#!/usr/bin/env npx tsx

/**
 * Script to add ESLint validation to all E2E tests
 * This ensures code quality checks are run before every E2E test
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface TestFile {
  path: string;
  content: string;
  modified: boolean;
}

async function addESLintToE2ETests() {
  console.log('🔧 Adding ESLint validation to all E2E tests...');
  
  // Find all E2E test files
  const testFiles = await glob('tests/e2e/*.spec.ts');
  console.log(`📁 Found ${testFiles.length} E2E test files`);
  
  let modifiedCount = 0;
  let skippedCount = 0;
  
  for (const filePath of testFiles) {
    const testFile = await processTestFile(filePath);
    
    if (testFile.modified) {
      // Write the modified content back to the file
      fs.writeFileSync(testFile.path, testFile.content, 'utf8');
      console.log(`✅ Modified: ${path.basename(testFile.path)}`);
      modifiedCount++;
    } else {
      console.log(`⏭️ Skipped: ${path.basename(testFile.path)} (already has ESLint validation)`);
      skippedCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Modified: ${modifiedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   Total: ${testFiles.length} files`);
  
  console.log('\n✅ ESLint validation added to all E2E tests!');
}

async function processTestFile(filePath: string): Promise<TestFile> {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file already has ESLint validation
  if (content.includes('validateESLintInTest') || content.includes('setupTestPageWithESLint')) {
    return { path: filePath, content, modified: false };
  }
  
  let modified = false;
  let newContent = content;
  
  // Step 1: Add import for validateESLintInTest if not present
  if (!content.includes("import { validateESLintInTest }") && 
      !content.includes("validateESLintInTest")) {
    
    // Find the test-helpers import line and modify it
    const testHelpersImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/test-helpers['"]/;
    const match = newContent.match(testHelpersImportRegex);
    
    if (match) {
      const existingImports = match[1];
      const newImports = existingImports.includes('validateESLintInTest') 
        ? existingImports 
        : `${existingImports}, validateESLintInTest`;
      
      newContent = newContent.replace(
        testHelpersImportRegex,
        `import { ${newImports} } from '../utils/test-helpers'`
      );
      modified = true;
    } else {
      // Add new import if test-helpers is not imported
      const firstImportIndex = newContent.indexOf("import { test, expect }");
      if (firstImportIndex !== -1) {
        const insertIndex = newContent.indexOf('\n', firstImportIndex) + 1;
        newContent = newContent.slice(0, insertIndex) + 
                    "import { validateESLintInTest } from '../utils/test-helpers'\n" + 
                    newContent.slice(insertIndex);
        modified = true;
      }
    }
  }
  
  // Step 2: Add ESLint validation to each test function
  // Look for test('...' patterns and add validation
  const testFunctionRegex = /(\s*test\(['"]([^'"]+)['"],\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{\s*\n)(\s*test\.setTimeout\([^)]+\);\s*\n)?/g;
  
  newContent = newContent.replace(testFunctionRegex, (match, testStart, testName, timeoutLine) => {
    // Check if this test already has ESLint validation
    const nextLines = newContent.slice(newContent.indexOf(match) + match.length, newContent.indexOf(match) + match.length + 500);
    if (nextLines.includes('validateESLintInTest')) {
      return match; // Already has validation
    }
    
    // Create the ESLint validation line
    const indent = testStart.match(/^(\s*)/)?.[1] || '    ';
    const eslintValidation = `${indent}// Run ESLint validation first\n${indent}await validateESLintInTest('${testName}');\n${indent}\n`;
    
    // If there's a timeout, increase it by 5 seconds for ESLint validation
    let newTimeoutLine = timeoutLine;
    if (timeoutLine) {
      const timeoutMatch = timeoutLine.match(/test\.setTimeout\((\d+)\)/);
      if (timeoutMatch) {
        const currentTimeout = parseInt(timeoutMatch[1]);
        const newTimeout = currentTimeout + 5000; // Add 5 seconds
        newTimeoutLine = timeoutLine.replace(/\d+/, newTimeout.toString());
        newTimeoutLine += `${indent}// Increased timeout for ESLint validation\n`;
      }
    } else {
      // Add default timeout if none exists
      newTimeoutLine = `${indent}test.setTimeout(25000); // Timeout for ESLint validation\n`;
    }
    
    modified = true;
    return testStart + newTimeoutLine + eslintValidation;
  });
  
  return { path: filePath, content: newContent, modified };
}

// Run the script
if (require.main === module) {
  addESLintToE2ETests().catch(console.error);
}