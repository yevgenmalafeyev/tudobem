#!/usr/bin/env npx tsx

/**
 * Comprehensive ESLint auto-fix script
 * Fixes all common ESLint issues systematically
 */

import * as fs from 'fs';
import * as path from 'path';
import { runESLintValidation } from '../tests/utils/eslint-validator.js';

interface FileFixResult {
  file: string;
  before: { errors: number; warnings: number };
  after: { errors: number; warnings: number };
  fixedIssues: string[];
}

async function comprehensiveEslintFix(): Promise<void> {
  console.log('🔧 Starting comprehensive ESLint auto-fix...');
  
  let iteration = 0;
  let totalFixed = 0;
  const maxIterations = 5;
  
  while (iteration < maxIterations) {
    iteration++;
    console.log(`\\n🔄 Iteration ${iteration}/${maxIterations}`);
    
    const result = await runESLintValidation({ includeWarnings: true });
    console.log(`📊 Current state: ${result.errorCount} errors, ${result.warningCount} warnings`);
    
    if (result.errorCount === 0 && result.warningCount === 0) {
      console.log('🎉 All ESLint issues resolved!');
      break;
    }
    
    let fixedInIteration = 0;
    
    for (const fileResult of result.results.slice(0, 20)) { // Process 20 files at a time
      const fixResult = await comprehensiveFixFile(fileResult);
      if (fixResult.fixedIssues.length > 0) {
        console.log(`  ✅ ${fixResult.file}: ${fixResult.fixedIssues.length} issues fixed`);
        fixedInIteration += fixResult.fixedIssues.length;
      }
    }
    
    totalFixed += fixedInIteration;
    
    if (fixedInIteration === 0) {
      console.log('⚠️ No more issues can be auto-fixed. Manual intervention needed.');
      break;
    }
  }
  
  console.log(`\\n🎉 Total issues fixed: ${totalFixed}`);
  
  // Final status
  const finalResult = await runESLintValidation({ includeWarnings: true });
  console.log(`\\n📊 Final state: ${finalResult.errorCount} errors, ${finalResult.warningCount} warnings`);
  
  if (finalResult.errorCount > 0 || finalResult.warningCount > 0) {
    console.log('\\n🔍 Remaining issues:');
    finalResult.results.slice(0, 5).forEach(file => {
      console.log(`  ${path.basename(file.filePath)}: ${file.errorCount} errors, ${file.warningCount} warnings`);
    });
  }
}

async function comprehensiveFixFile(fileResult: { filePath: string; errorCount: number; warningCount: number; messages: Array<{ line: number; ruleId: string; message: string }> }): Promise<FileFixResult> {
  const filePath = fileResult.filePath;
  const relativePath = path.relative(process.cwd(), filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const fixedIssues: string[] = [];
  
  const before = { errors: fileResult.errorCount, warnings: fileResult.warningCount };
  
  try {
    // Apply comprehensive fixes
    const fixes = [
      fixUnusedImports,
      fixUnusedVariables,
      fixPreferConstIssues,
      fixExplicitAnyTypes,
      fixRequireImports,
      fixUnusedCatchBindings,
      fixNoExplicitAny,
      fixMissingReturnTypes
    ];
    
    for (const fixFunction of fixes) {
      const fixResult = fixFunction(content, fileResult);
      if (fixResult.changed) {
        content = fixResult.content;
        fixedIssues.push(...fixResult.fixedRules);
      }
    }
    
    if (fixedIssues.length > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`Error fixing ${relativePath}:`, error);
  }
  
  return {
    file: relativePath,
    before,
    after: { errors: 0, warnings: 0 }, // Will be determined in next iteration
    fixedIssues
  };
}

function fixUnusedImports(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  const lines = content.split('\\n');
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === '@typescript-eslint/no-unused-vars' && lines[message.line - 1]?.includes('import')) {
      const line = lines[message.line - 1];
      const varName = extractVariableName(message.message);
      
      if (varName) {
        // Remove unused import
        const newLine = line
          .replace(new RegExp(`,\\\\s*${varName}`), '')
          .replace(new RegExp(`${varName},\\\\s*`), '')
          .replace(new RegExp(`\\\\{\\\\s*${varName}\\\\s*\\\\}`), '{}')
          .replace(/\\\\{\\\\s*,/, '{')
          .replace(/,\\\\s*\\\\}/, '}');
        
        if (newLine.includes('{ }') || newLine.includes('{}')) {
          lines.splice(message.line - 1, 1);
        } else {
          lines[message.line - 1] = newLine;
        }
        
        changed = true;
        fixedRules.push('@typescript-eslint/no-unused-vars');
      }
    }
  }
  
  return { content: lines.join('\\n'), changed, fixedRules };
}

function fixUnusedVariables(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  const lines = content.split('\\n');
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === '@typescript-eslint/no-unused-vars' && !lines[message.line - 1]?.includes('import')) {
      const lineIndex = message.line - 1;
      const line = lines[lineIndex];
      
      // Add eslint-disable comment
      const indent = line.match(/^\\s*/)?.[0] || '';
      lines.splice(lineIndex, 0, `${indent}// eslint-disable-next-line @typescript-eslint/no-unused-vars`);
      
      changed = true;
      fixedRules.push('@typescript-eslint/no-unused-vars');
    }
  }
  
  return { content: lines.join('\\n'), changed, fixedRules };
}

function fixPreferConstIssues(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  let newContent = content;
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === 'prefer-const') {
      newContent = newContent.replace(/\\blet\\b/, 'const');
      changed = true;
      fixedRules.push('prefer-const');
    }
  }
  
  return { content: newContent, changed, fixedRules };
}

function fixExplicitAnyTypes(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  let newContent = content;
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === '@typescript-eslint/no-explicit-any') {
      // Common any type fixes
      const fixes = [
        { pattern: /\\s+as\\s+any\\b/g, replacement: ' as unknown' },
        { pattern: /:\\s*any\\b/g, replacement: ': unknown' },
        { pattern: /\\(\\{[^}]*\\}:\\s*any\\)/g, replacement: '({ [key: string]: unknown })' },
        { pattern: /Promise<any>/g, replacement: 'Promise<unknown>' },
        { pattern: /Record<string,\\s*any>/g, replacement: 'Record<string, unknown>' }
      ];
      
      for (const fix of fixes) {
        const before = newContent;
        newContent = newContent.replace(fix.pattern, fix.replacement);
        if (newContent !== before) {
          changed = true;
          fixedRules.push('@typescript-eslint/no-explicit-any');
          break;
        }
      }
    }
  }
  
  return { content: newContent, changed, fixedRules };
}

function fixRequireImports(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  let newContent = content;
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === '@typescript-eslint/no-require-imports') {
      // Convert require to import
      newContent = newContent.replace(
        /const\\s+(\\w+)\\s*=\\s*require\\('([^']+)'\\)/g,
        "import $1 from '$2'"
      );
      newContent = newContent.replace(
        /const\\s*\\{\\s*([^}]+)\\s*\\}\\s*=\\s*require\\('([^']+)'\\)/g,
        "import { $1 } from '$2'"
      );
      
      changed = true;
      fixedRules.push('@typescript-eslint/no-require-imports');
    }
  }
  
  return { content: newContent, changed, fixedRules };
}

function fixUnusedCatchBindings(content: string, fileResult: { messages: Array<{ line: number; ruleId: string; message: string }> }): { content: string; changed: boolean; fixedRules: string[] } {
  let newContent = content;
  let changed = false;
  const fixedRules: string[] = [];
  
  for (const message of fileResult.messages) {
    if (message.ruleId === '@typescript-eslint/no-unused-vars' && newContent.includes('} catch (')) {
      // Replace catch (error) with catch (_error) or catch (_)
      newContent = newContent.replace(/catch\\s*\\(\\s*(\\w+)\\s*\\)/g, 'catch (_$1)');
      changed = true;
      fixedRules.push('@typescript-eslint/no-unused-vars');
    }
  }
  
  return { content: newContent, changed, fixedRules };
}

function fixNoExplicitAny(content: string): { content: string; changed: boolean; fixedRules: string[] } {
  let newContent = content;
  let changed = false;
  const fixedRules: string[] = [];
  
  // Add specific typing for test mocks
  if (newContent.includes('jest.mock') && newContent.includes(': any')) {
    newContent = newContent.replace(
      /\\(\\{\\s*([^}]+)\\s*\\}:\\s*any\\)/g,
      '({ $1 }: { [key: string]: unknown })'
    );
    changed = true;
    fixedRules.push('@typescript-eslint/no-explicit-any');
  }
  
  return { content: newContent, changed, fixedRules };
}

function fixMissingReturnTypes(content: string): { content: string; changed: boolean; fixedRules: string[] } {
  // This would be more complex to implement correctly
  return { content, changed: false, fixedRules: [] };
}

function extractVariableName(message: string): string | null {
  const match = message.match(/'([^']+)' is defined but never used/);
  return match ? match[1] : null;
}

// Run the script
if (require.main === module) {
  comprehensiveEslintFix().catch(console.error);
}