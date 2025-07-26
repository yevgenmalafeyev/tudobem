#!/usr/bin/env node

/**
 * AI Integration Test Runner
 * 
 * This script runs the comprehensive AI integration E2E test that validates:
 * 1. Real API key configuration and validation
 * 2. AI-generated question delivery through the UI
 * 3. Complete user interaction flow
 * 4. Performance benchmarking
 * 
 * Prerequisites:
 * - local-config.json with valid anthropicApiKey
 * - Development server running on localhost:3000
 * - All dependencies installed
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 AI Integration Test Runner');
console.log('=====================================');

// Check prerequisites
console.log('🔍 Checking prerequisites...');

// 1. Check for local-config.json
const configPath = path.join(process.cwd(), 'local-config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ local-config.json not found');
  console.log('   Create local-config.json with:');
  console.log('   {');
  console.log('     "anthropicApiKey": "sk-ant-api03-your-key-here"');
  console.log('   }');
  process.exit(1);
}

// 2. Validate API key format
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch {
  console.error('❌ Invalid local-config.json format');
  process.exit(1);
}

if (!config.anthropicApiKey) {
  console.error('❌ No anthropicApiKey found in local-config.json');
  process.exit(1);
}

if (!config.anthropicApiKey.startsWith('sk-ant-')) {
  console.error('❌ Invalid API key format. Should start with sk-ant-');
  process.exit(1);
}

console.log('✅ API key found and validated');
console.log(`🔑 Using key: ${config.anthropicApiKey.substring(0, 15)}...`);

// 3. Check if development server is running
console.log('🌐 Checking development server...');
let serverPort = null;
const portsToCheck = [3000, 3001, 3002];

for (const port of portsToCheck) {
  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}`, { 
      encoding: 'utf8',
      timeout: 5000 
    });
    
    if (response.trim() === '200') {
      serverPort = port;
      console.log(`✅ Development server is running on port ${port}`);
      break;
    }
  } catch {
    // Continue checking next port
  }
}

if (!serverPort) {
  console.error('❌ Development server not accessible on ports 3000, 3001, or 3002');
  console.log('   Please start the server with: npm run dev');
  process.exit(1);
}

// 4. Run the test
console.log('\n🚀 Running AI Integration E2E Test...');
console.log('=====================================');

try {
  // Run only the AI integration test on Chromium for speed
  const testCommand = 'npx playwright test tests/e2e/ai-integration-full-flow.spec.ts --project=chromium --headed --reporter=line';
  
  console.log(`📝 Command: ${testCommand}`);
  console.log(`🌐 Using server port: ${serverPort}`);
  console.log('⏳ This may take 1-2 minutes due to AI generation...\n');
  
  execSync(testCommand, { 
    stdio: 'inherit',
    timeout: 120000, // 2 minute timeout
    env: { 
      ...process.env, 
      PLAYWRIGHT_BASE_URL: `http://localhost:${serverPort}` 
    }
  });
  
  console.log('\n🎉 AI Integration Test Completed Successfully!');
  console.log('=====================================');
  console.log('✅ API key validation working');
  console.log('✅ AI question generation working');
  console.log('✅ User interaction flow working');
  console.log('✅ Performance benchmarks met');
  
} catch (error) {
  console.error('\n❌ AI Integration Test Failed');
  console.error('=====================================');
  console.error('Error details:', error.message);
  
  console.log('\n🔧 Troubleshooting Tips:');
  console.log('- Ensure your API key is valid and has credits');
  console.log('- Check network connectivity');
  console.log('- Verify the development server is fully loaded');
  console.log('- Check browser console for JavaScript errors');
  console.log('- Review Playwright test output for specific failures');
  
  process.exit(1);
}