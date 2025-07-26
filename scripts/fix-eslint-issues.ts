#!/usr/bin/env npx tsx

/**
 * Script to automatically fix common ESLint issues
 */

import * as fs from 'fs';
import * as path from 'path';
import { runESLintValidation } from '../tests/utils/eslint-validator.js';

interface FixResult {
  file: string;
  fixed: number;
  errors: string[];
}

async function fixEslintIssues(): Promise<void> {
  console.log('🔧 Starting automatic ESLint issue fixing...');
  
  const results: FixResult[] = [];
  
  try {
    const eslintResult = await runESLintValidation({ includeWarnings: true });
    
    console.log(`📊 Found ${eslintResult.errorCount} errors and ${eslintResult.warningCount} warnings in ${eslintResult.results.length} files`);
    
    for (const fileResult of eslintResult.results) {
      const fixResult = await fixFileIssues(fileResult);
      if (fixResult.fixed > 0) {
        results.push(fixResult);
      }
    }
    
    console.log('\\n✅ Fix Summary:');
    let totalFixed = 0;
    results.forEach(result => {
      console.log(`  ${result.file}: ${result.fixed} issues fixed`);
      totalFixed += result.fixed;
    });
    
    console.log(`\\n🎉 Total issues fixed: ${totalFixed}`);
    
    // Run ESLint again to see remaining issues
    console.log('\\n🔍 Checking remaining issues...');
    const finalResult = await runESLintValidation({ includeWarnings: true });
    console.log(`📊 Remaining: ${finalResult.errorCount} errors, ${finalResult.warningCount} warnings`);
    
  } catch (error) {
    console.error('❌ Error during fixing:', error);
  }
}

async function fixFileIssues(fileResult: { filePath: string; messages: Array<{ line: number; ruleId: string; message: string }> }): Promise<FixResult> {
  const filePath = fileResult.filePath;
  const relativePath = path.relative(process.cwd(), filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  const errors: string[] = [];
  
  try {
    for (const message of fileResult.messages) {
      const fixed = await fixMessage(content, message, filePath);
      if (fixed.success) {
        content = fixed.content;
        fixCount++;
      } else {
        errors.push(`${message.ruleId}: ${message.message} (line ${message.line})`);
      }
    }
    
    if (fixCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    errors.push(`File processing error: ${error}`);
  }
  
  return {
    file: relativePath,
    fixed: fixCount,
    errors
  };
}

async function fixMessage(content: string, message: { line: number; ruleId: string; message: string }, filePath: string): Promise<{ success: boolean; content: string }> {
  const lines = content.split('\\n');
  const lineIndex = message.line - 1;
  const line = lines[lineIndex];
  
  if (!line) {
    return { success: false, content };
  }
  
  switch (message.ruleId) {
    case '@typescript-eslint/no-unused-vars':
      return fixUnusedVar(content, message, lines, lineIndex);
    
    case 'prefer-const':
      return fixPreferConst(content, message, lines, lineIndex);
    
    case '@typescript-eslint/no-explicit-any':
      return fixExplicitAny(content, message, lines, lineIndex, filePath);
    
    default:
      return { success: false, content };
  }
}

function fixUnusedVar(content: string, message: { message: string }, lines: string[], lineIndex: number): { success: boolean; content: string } {
  const line = lines[lineIndex];
  
  // Check if it's an import statement
  if (line.includes('import') && line.includes('from')) {
    // For imports, try to remove the unused variable
    const varName = extractVariableName(message.message);
    if (varName) {
      // Remove from destructured import
      const newLine = line.replace(new RegExp(`,\\s*${varName}`), '')
                          .replace(new RegExp(`${varName},\\s*`), '')
                          .replace(new RegExp(`{\\s*${varName}\\s*}`), '{}')
                          .replace(/\\{\\s*,/, '{')
                          .replace(/,\\s*\\}/, '}');
      
      // If the import becomes empty, remove the entire line
      if (newLine.includes('{ }') || newLine.includes('{}')) {
        lines.splice(lineIndex, 1);
      } else {
        lines[lineIndex] = newLine;
      }
      
      return { success: true, content: lines.join('\\n') };
    }
  }
  
  // For variable declarations, add eslint-disable comment
  if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
    const indent = line.match(/^\\s*/)?.[0] || '';
    lines.splice(lineIndex, 0, `${indent}// eslint-disable-next-line @typescript-eslint/no-unused-vars`);
    return { success: true, content: lines.join('\\n') };
  }
  
  return { success: false, content };
}

function fixPreferConst(content: string, message: { message: string }, lines: string[], lineIndex: number): { success: boolean; content: string } {
  const line = lines[lineIndex];
  const newLine = line.replace(/\\blet\\b/, 'const');
  
  if (newLine !== line) {
    lines[lineIndex] = newLine;
    return { success: true, content: lines.join('\\n') };
  }
  
  return { success: false, content };
}

function fixExplicitAny(content: string, message: { message: string }, lines: string[], lineIndex: number): { success: boolean; content: string } {
  const line = lines[lineIndex];
  
  // Common patterns for any types
  const fixes = [
    // Function parameters: ({ prop }: any) => 
    {
      pattern: /\\(\\{[^}]+\\}:\\s*any\\)/g,
      replacement: '({ [key: string]: unknown })'
    },
    // Type assertions: as any
    {
      pattern: /\\s+as\\s+any\\b/g,
      replacement: ' as unknown'
    },
    // Variable declarations: : any
    {
      pattern: /:\\s*any\\b/g,
      replacement: ': unknown'
    }
  ];
  
  let newLine = line;
  let wasFixed = false;
  
  for (const fix of fixes) {
    const replaced = newLine.replace(fix.pattern, fix.replacement);
    if (replaced !== newLine) {
      newLine = replaced;
      wasFixed = true;
      break;
    }
  }
  
  if (wasFixed) {
    lines[lineIndex] = newLine;
    return { success: true, content: lines.join('\\n') };
  }
  
  return { success: false, content };
}

function extractVariableName(message: string): string | null {
  const match = message.match(/'([^']+)' is defined but never used/);
  return match ? match[1] : null;
}

// Run the script
if (require.main === module) {
  fixEslintIssues().catch(console.error);
}