const fs = require('fs');
const puppeteer = require('puppeteer');

// Configuration for testing
const LOCAL_URL = 'http://localhost:3000';
const PROD_URL = 'https://portuguese-learning-app-theta.vercel.app';

// Load local config
let ANTHROPIC_API_KEY = null;
try {
  const localConfig = JSON.parse(fs.readFileSync('./local-config.json', 'utf8'));
  ANTHROPIC_API_KEY = localConfig.anthropicApiKey;
} catch (error) {
  console.warn('⚠️  No local-config.json found for API key testing');
  console.warn('   Create local-config.json with: {"anthropicApiKey": "your-api-key"}');
}

// Test results storage
let testResults = {
  configurationTests: [],
  exerciseGenerationTests: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0
  }
};

async function testConfiguration(url, browser) {
  console.log(`\n🔧 Testing Configuration at ${url}`);
  
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  
  try {
    await page.goto(url);
    
    // Wait for configuration page to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check if we're on the configuration page
    const isConfigPage = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading && heading.textContent.includes('Configure');
    });
    
    if (!isConfigPage) {
      // Navigate to configuration
      await page.click('a[href="#"], button'); // Try to find config link
      await page.waitForSelector('h1', { timeout: 5000 });
    }
    
    // Test 1: Select only B2 level
    console.log('   Testing level selection...');
    await page.click('button:has-text("B2")');
    await page.waitForTimeout(1000);
    
    // Test 2: Unselect some topics
    console.log('   Testing topic deselection...');
    const topicCheckboxes = await page.$$('input[type="checkbox"]');
    if (topicCheckboxes.length > 0) {
      // Uncheck first topic
      await topicCheckboxes[0].click();
      await page.waitForTimeout(500);
      
      // Check if it's actually unchecked
      const isUnchecked = await topicCheckboxes[0].evaluate(el => !el.checked);
      if (!isUnchecked) {
        throw new Error('Topic could not be unchecked');
      }
    }
    
    // Test 3: Add API key if available
    if (ANTHROPIC_API_KEY) {
      console.log('   Testing API key input...');
      await page.fill('input[type="password"]', ANTHROPIC_API_KEY);
    }
    
    // Test 4: Save configuration
    console.log('   Testing configuration save...');
    await page.click('button:has-text("Guardar")');
    await page.waitForTimeout(2000);
    
    console.log('   ✅ Configuration tests passed');
    return { success: true, errors: [] };
    
  } catch (error) {
    console.log(`   ❌ Configuration test failed: ${error.message}`);
    return { success: false, errors: [error.message] };
  } finally {
    await page.close();
  }
}

async function testExerciseGeneration(url, browser) {
  console.log(`\n🎯 Testing Exercise Generation at ${url}`);
  
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  
  const results = {
    success: true,
    errors: [],
    exercises: [],
    apiUsed: false
  };
  
  try {
    await page.goto(url);
    
    // Complete configuration if needed
    await page.waitForSelector('h1', { timeout: 10000 });
    const isConfigPage = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      return heading && heading.textContent.includes('Configure');
    });
    
    if (isConfigPage) {
      console.log('   Completing configuration...');
      
      // Select only B2 level
      await page.click('button:has-text("B2")');
      await page.waitForTimeout(500);
      
      // Unselect some topics
      const topicCheckboxes = await page.$$('input[type="checkbox"]');
      if (topicCheckboxes.length > 2) {
        // Uncheck first two topics
        await topicCheckboxes[0].click();
        await topicCheckboxes[1].click();
        await page.waitForTimeout(500);
      }
      
      // Add API key if available
      if (ANTHROPIC_API_KEY) {
        await page.fill('input[type="password"]', ANTHROPIC_API_KEY);
      }
      
      // Save configuration
      await page.click('button:has-text("Guardar")');
      await page.waitForTimeout(3000);
    }
    
    // Wait for learning page
    await page.waitForSelector('.neo-card-lg', { timeout: 10000 });
    
    // Listen for API calls
    page.on('response', async (response) => {
      if (response.url().includes('/api/generate-exercise')) {
        try {
          const responseData = await response.json();
          results.exercises.push({
            level: responseData.level,
            topic: responseData.topic,
            sentence: responseData.sentence,
            timestamp: new Date()
          });
          
          // Check if this looks like a fresh generation vs fallback
          if (responseData.id && responseData.id.length > 5) {
            results.apiUsed = true;
          }
        } catch (e) {
          console.log('   Could not parse exercise response');
        }
      }
    });
    
    // Generate several exercises
    console.log('   Generating exercises...');
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(2000);
      
      // Look for next exercise button or generate new exercise
      const nextButton = await page.$('button:has-text("Próximo")');
      if (nextButton) {
        await nextButton.click();
      } else {
        // Look for input or multiple choice
        const input = await page.$('input[type="text"]');
        if (input) {
          await input.fill('test');
          await page.click('button:has-text("Verificar")');
          await page.waitForTimeout(1000);
          const nextBtn = await page.$('button:has-text("Próximo")');
          if (nextBtn) await nextBtn.click();
        }
      }
      
      await page.waitForTimeout(1000);
    }
    
    // Analyze results
    console.log(`   Generated ${results.exercises.length} exercises`);
    if (results.exercises.length > 0) {
      const levels = [...new Set(results.exercises.map(e => e.level))];
      const topics = [...new Set(results.exercises.map(e => e.topic))];
      
      console.log(`   Levels found: ${levels.join(', ')}`);
      console.log(`   Topics found: ${topics.join(', ')}`);
      console.log(`   API used: ${results.apiUsed ? 'Yes' : 'No (fallback)'}`);
      
      // Check if exercises respect B2-only selection
      const nonB2Exercises = results.exercises.filter(e => e.level !== 'B2');
      if (nonB2Exercises.length > 0) {
        results.success = false;
        results.errors.push(`Found non-B2 exercises: ${nonB2Exercises.map(e => e.level).join(', ')}`);
      }
      
      // Check if API should have been used
      if (ANTHROPIC_API_KEY && !results.apiUsed) {
        results.success = false;
        results.errors.push('API key provided but fallback exercises used');
      }
    } else {
      results.success = false;
      results.errors.push('No exercises generated');
    }
    
    if (results.success) {
      console.log('   ✅ Exercise generation tests passed');
    } else {
      console.log('   ❌ Exercise generation tests failed');
      results.errors.forEach(error => console.log(`      - ${error}`));
    }
    
    return results;
    
  } catch (error) {
    console.log(`   ❌ Exercise generation test failed: ${error.message}`);
    return { success: false, errors: [error.message], exercises: [], apiUsed: false };
  } finally {
    await page.close();
  }
}

async function runTests() {
  console.log('🚀 Starting Configuration and Exercise Generation Tests');
  console.log('====================================================');
  
  // Check if puppeteer is available
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
  } catch (error) {
    console.error('❌ Puppeteer not available. Install with: npm install puppeteer');
    process.exit(1);
  }
  
  // Test local development
  console.log('\n🏠 Testing Local Development Environment');
  const localConfigResults = await testConfiguration(LOCAL_URL, browser);
  const localExerciseResults = await testExerciseGeneration(LOCAL_URL, browser);
  
  testResults.configurationTests.push({
    environment: 'local',
    ...localConfigResults
  });
  
  testResults.exerciseGenerationTests.push({
    environment: 'local',
    ...localExerciseResults
  });
  
  // Test production if local tests pass
  if (localConfigResults.success && localExerciseResults.success) {
    console.log('\n🌐 Testing Production Environment');
    const prodConfigResults = await testConfiguration(PROD_URL, browser);
    const prodExerciseResults = await testExerciseGeneration(PROD_URL, browser);
    
    testResults.configurationTests.push({
      environment: 'production',
      ...prodConfigResults
    });
    
    testResults.exerciseGenerationTests.push({
      environment: 'production',
      ...prodExerciseResults
    });
  } else {
    console.log('\n⚠️  Skipping production tests due to local test failures');
  }
  
  await browser.close();
  
  // Generate final report
  console.log('\n📈 FINAL REPORT');
  console.log('================');
  
  const allTests = [...testResults.configurationTests, ...testResults.exerciseGenerationTests];
  testResults.summary.totalTests = allTests.length;
  testResults.summary.passed = allTests.filter(t => t.success).length;
  testResults.summary.failed = allTests.filter(t => !t.success).length;
  
  console.log(`Total tests: ${testResults.summary.totalTests}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  
  if (testResults.summary.failed > 0) {
    console.log('\n❌ Failed tests:');
    allTests.filter(t => !t.success).forEach(test => {
      console.log(`  - ${test.environment}: ${test.errors.join(', ')}`);
    });
  }
  
  // Save detailed results
  fs.writeFileSync('test-config-generation-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n📁 Detailed results saved to test-config-generation-results.json');
  
  return testResults.summary.failed === 0;
}

// Run the tests
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };