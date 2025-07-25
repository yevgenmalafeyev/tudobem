#!/usr/bin/env node

/**
 * Script to add error monitoring to all E2E test files
 * 
 * This script automatically adds comprehensive error monitoring
 * to all Playwright E2E test files in the tests/e2e directory.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const E2E_DIR = 'tests/e2e';
const UTILS_IMPORT = `import { setupErrorMonitoring, validateNoErrors, E2EErrorMonitor } from '../utils/errorMonitoring';`;

const ERROR_MONITORING_SETUP = `  let errorMonitor: E2EErrorMonitor;
  
  test.beforeEach(async ({ page }) => {
    // Setup comprehensive error monitoring
    errorMonitor = await setupErrorMonitoring(page);
  });

  test.afterEach(async () => {
    // Validate no critical errors occurred during test
    try {
      await validateNoErrors(errorMonitor, {
        allowWarnings: true, // Allow React warnings for now
        allowNetworkErrors: false, // Fail on network errors
        customPatterns: [
          'dispatchSetStateInternal',
          'getRootForUpdatedFiber',
          'handleLevelToggle',
          'Configuration.useEffect'
        ]
      });
    } catch (error) {
      console.error('🚨 Error validation failed:', error.message);
      throw error;
    } finally {
      errorMonitor.stopMonitoring();
    }
  });`;

function addErrorMonitoringToFile(filePath) {
  console.log(`📝 Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if error monitoring is already added
  if (content.includes('setupErrorMonitoring')) {
    console.log(`  ✅ Already has error monitoring`);
    return;
  }
  
  // Add import statement
  const importRegex = /import\s+{[^}]+}\s+from\s+['"]@playwright\/test['"];/;
  const importMatch = content.match(importRegex);
  
  if (importMatch) {
    const importStatement = importMatch[0];
    const newImportStatement = importStatement.replace(
      /import\s+{([^}]+)}\s+from\s+['"]@playwright\/test['"];/,
      'import { $1 } from \'@playwright/test\';'
    );
    content = content.replace(importStatement, `${newImportStatement}\n${UTILS_IMPORT}`);
  } else {
    // If no playwright import found, add at the top
    content = `${UTILS_IMPORT}\n${content}`;
  }
  
  // Add error monitoring setup to test.describe blocks
  const describeRegex = /test\.describe\s*\(\s*['"]([^'"]+)['"],\s*\(\)\s*=>\s*\{/g;
  content = content.replace(describeRegex, (match, testName) => {
    return `${match}\n${ERROR_MONITORING_SETUP}`;
  });
  
  // Write the updated content back to file
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Added error monitoring`);
}

function main() {
  console.log('🔍 Adding error monitoring to all E2E tests...');
  console.log('=============================================');
  
  // Find all .spec.ts files in the e2e directory
  const testFiles = glob.sync(`${E2E_DIR}/**/*.spec.ts`);
  
  if (testFiles.length === 0) {
    console.log('❌ No E2E test files found');
    return;
  }
  
  console.log(`📊 Found ${testFiles.length} E2E test files:`);
  testFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  // Process each test file
  testFiles.forEach(addErrorMonitoringToFile);
  
  console.log('');
  console.log('🎉 Error monitoring added to all E2E tests!');
  console.log('');
  console.log('📋 What was added:');
  console.log('- Import statement for error monitoring utilities');
  console.log('- beforeEach hook to start error monitoring');
  console.log('- afterEach hook to validate and report errors');
  console.log('- Specific checks for React state update errors');
  console.log('- Network error monitoring');
  console.log('- Console error detection');
  console.log('');
  console.log('🚀 Run your tests now to see comprehensive error reporting!');
}

if (require.main === module) {
  main();
}