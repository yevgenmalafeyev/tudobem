/**
 * ESLint validation utility for E2E tests
 * Ensures code quality by checking for ESLint errors and warnings during testing
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ESLintResult {
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  results: ESLintFileResult[];
  summary: string;
}

export interface ESLintFileResult {
  filePath: string;
  errorCount: number;
  warningCount: number;
  messages: ESLintMessage[];
}

export interface ESLintMessage {
  ruleId: string | null;
  severity: 1 | 2; // 1 = warning, 2 = error
  message: string;
  line: number;
  column: number;
  nodeType: string;
  source: string;
}

/**
 * Run ESLint on the entire codebase and return detailed results
 */
export async function runESLintValidation(options: {
  failOnWarnings?: boolean;
  failOnErrors?: boolean;
  includeWarnings?: boolean;
  targetPaths?: string[];
} = {}): Promise<ESLintResult> {
  const {
    includeWarnings = true,
    targetPaths = ['src/', 'tests/']
  } = options;

  try {
    // Run ESLint with JSON output format
    const paths = targetPaths.join(' ');
    const eslintCommand = `npx eslint ${paths} --format json --ext .ts,.tsx,.js,.jsx`;
    
    console.log('🔍 Running ESLint validation...');
    
    let stdout = '';
    
    try {
      const result = await execAsync(eslintCommand, { 
        cwd: process.cwd(),
        timeout: 30000 // 30 second timeout
      });
      stdout = result.stdout;
    } catch (error: unknown) {
      // ESLint exits with non-zero code when there are errors
      const execError = error as { stdout?: string; stderr?: string };
      stdout = execError.stdout || '';
    }

    // Parse ESLint JSON output
    let eslintResults: ESLintFileResult[] = [];
    if (stdout.trim()) {
      try {
        eslintResults = JSON.parse(stdout);
      } catch (parseError) {
        console.error('Failed to parse ESLint output:', parseError);
        throw new Error(`ESLint output parsing failed: ${parseError}`);
      }
    }

    // Calculate totals
    const totalErrors = eslintResults.reduce((sum, file) => sum + file.errorCount, 0);
    const totalWarnings = eslintResults.reduce((sum, file) => sum + file.warningCount, 0);
    
    const hasErrors = totalErrors > 0;
    const hasWarnings = totalWarnings > 0;

    // Filter results to only include files with issues
    const filteredResults = eslintResults.filter(file => 
      file.errorCount > 0 || (includeWarnings && file.warningCount > 0)
    );

    // Generate summary
    let summary = `ESLint Results: ${totalErrors} errors, ${totalWarnings} warnings`;
    if (filteredResults.length > 0) {
      summary += `\nFiles with issues: ${filteredResults.length}`;
      
      // Add details for first few problematic files
      const detailCount = Math.min(3, filteredResults.length);
      for (let i = 0; i < detailCount; i++) {
        const file = filteredResults[i];
        summary += `\n  ${file.filePath}: ${file.errorCount} errors, ${file.warningCount} warnings`;
        
        // Show first few messages for this file
        const messageCount = Math.min(2, file.messages.length);
        for (let j = 0; j < messageCount; j++) {
          const msg = file.messages[j];
          const severity = msg.severity === 2 ? 'ERROR' : 'WARNING';
          summary += `\n    ${severity} (${msg.line}:${msg.column}): ${msg.message} [${msg.ruleId}]`;
        }
      }
      
      if (filteredResults.length > detailCount) {
        summary += `\n  ... and ${filteredResults.length - detailCount} more files`;
      }
    }

    return {
      hasErrors,
      hasWarnings,
      errorCount: totalErrors,
      warningCount: totalWarnings,
      results: filteredResults,
      summary
    };

  } catch (error) {
    console.error('ESLint validation failed:', error);
    throw new Error(`ESLint validation failed: ${error}`);
  }
}

/**
 * Validate code quality and fail the test if ESLint issues are found
 */
export async function validateCodeQuality(options: {
  testName: string;
  failOnWarnings?: boolean;
  failOnErrors?: boolean;
} = { testName: 'Unknown Test' }): Promise<void> {
  const { testName, failOnWarnings = true, failOnErrors = true } = options;
  
  console.log(`🧹 ESLint validation for: ${testName}`);
  
  const result = await runESLintValidation({
    failOnWarnings,
    failOnErrors,
    includeWarnings: true
  });

  console.log(`📊 ESLint Results: ${result.errorCount} errors, ${result.warningCount} warnings`);

  // Check if we should fail the test
  const shouldFailOnErrors = failOnErrors && result.hasErrors;
  const shouldFailOnWarnings = failOnWarnings && result.hasWarnings;

  if (shouldFailOnErrors || shouldFailOnWarnings) {
    console.error(`❌ Code quality check failed for ${testName}`);
    console.error(result.summary);
    
    // Create detailed error message
    let errorMessage = `Code quality validation failed for ${testName}:\n`;
    errorMessage += `${result.errorCount} ESLint errors, ${result.warningCount} warnings found\n\n`;
    
    if (result.hasErrors && failOnErrors) {
      errorMessage += '🚨 ESLint ERRORS must be fixed before tests can pass\n';
    }
    if (result.hasWarnings && failOnWarnings) {
      errorMessage += '⚠️ ESLint WARNINGS must be resolved before tests can pass\n';
    }
    
    errorMessage += '\nDetailed issues:\n' + result.summary;
    
    throw new Error(errorMessage);
  }

  console.log(`✅ Code quality validation passed for ${testName}`);
}

/**
 * Quick ESLint check for specific files or patterns
 */
export async function quickESLintCheck(
  paths: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await runESLintValidation({
      targetPaths: paths,
      failOnWarnings: true,
      failOnErrors: true
    });

    if (result.hasErrors || result.hasWarnings) {
      return {
        success: false,
        message: `ESLint issues found: ${result.errorCount} errors, ${result.warningCount} warnings`
      };
    }

    return {
      success: true,
      message: 'No ESLint issues found'
    };
  } catch (error) {
    return {
      success: false,
      message: `ESLint check failed: ${error}`
    };
  }
}

/**
 * Pre-commit style ESLint validation
 */
export async function preCommitESLintValidation(): Promise<void> {
  console.log('🔒 Running pre-commit ESLint validation...');
  
  const result = await runESLintValidation({
    failOnWarnings: true,
    failOnErrors: true,
    includeWarnings: true,
    targetPaths: ['src/', 'tests/', 'pages/']
  });

  if (result.hasErrors) {
    throw new Error(`❌ ESLint errors must be fixed before committing:\n${result.summary}`);
  }

  if (result.hasWarnings) {
    throw new Error(`⚠️ ESLint warnings must be resolved before committing:\n${result.summary}`);
  }

  console.log('✅ Pre-commit ESLint validation passed');
}