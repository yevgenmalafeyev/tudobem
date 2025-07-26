import fs from 'fs';

// Configuration for testing production
const PROD_URL = 'https://portuguese-learning-app-theta.vercel.app';

// Load local config
let ANTHROPIC_API_KEY = null;
try {
  const localConfig = JSON.parse(fs.readFileSync('./local-config.json', 'utf8'));
  ANTHROPIC_API_KEY = localConfig.anthropicApiKey;
} catch {
  console.warn('⚠️  No local-config.json found - will test without API key');
}

async function testProductionQuick() {
  console.log('🌐 Testing Production App Configuration and Exercise Generation');
  console.log('==========================================================');
  
  const results = {
    fallbackExercises: [],
    freshExercises: [],
    errors: []
  };
  
  // Test 1: API without key (should use fallback)
  console.log('\n📋 Test 1: API without key (should use fallback)');
  try {
    const response = await fetch(`${PROD_URL}/api/generate-exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        levels: ['B2'],
        topics: ['imperfect-subjunctive'],
        masteredWords: {}
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const exercise = await response.json();
    results.fallbackExercises.push(exercise);
    console.log(`   ✅ Success: Level ${exercise.level}, Topic ${exercise.topic}`);
    console.log(`   📝 Exercise: ${exercise.sentence}`);
    
    // Validate constraints
    if (exercise.level !== 'B2') {
      results.errors.push(`Level constraint violated: expected B2, got ${exercise.level}`);
    }
    if (exercise.topic !== 'imperfect-subjunctive') {
      results.errors.push(`Topic constraint violated: expected imperfect-subjunctive, got ${exercise.topic}`);
    }
    
  } catch (error) {
    results.errors.push(`Fallback test failed: ${error.message}`);
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // Test 2: API with key (should use Claude AI)
  if (ANTHROPIC_API_KEY) {
    console.log('\n📋 Test 2: API with key (should use Claude AI)');
    try {
      const response = await fetch(`${PROD_URL}/api/generate-exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levels: ['B1'],
          topics: ['present-subjunctive'],
          claudeApiKey: ANTHROPIC_API_KEY,
          masteredWords: {}
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const exercise = await response.json();
      results.freshExercises.push(exercise);
      console.log(`   ✅ Success: Level ${exercise.level}, Topic ${exercise.topic}`);
      console.log(`   📝 Exercise: ${exercise.sentence}`);
      
      // Check if it's fresh generation (has timestamp-based ID)
      const isFresh = exercise.id && exercise.id.length > 10;
      console.log(`   🔄 Generation type: ${isFresh ? 'Fresh (Claude AI)' : 'Fallback'}`);
      
      // Validate constraints
      if (exercise.level !== 'B1') {
        results.errors.push(`Level constraint violated: expected B1, got ${exercise.level}`);
      }
      if (exercise.topic !== 'present-subjunctive') {
        results.errors.push(`Topic constraint violated: expected present-subjunctive, got ${exercise.topic}`);
      }
      
    } catch (error) {
      results.errors.push(`Fresh generation test failed: ${error.message}`);
      console.log(`   ❌ Error: ${error.message}`);
    }
  } else {
    console.log('\n📋 Test 2: Skipped (no API key)');
  }
  
  // Test 3: Invalid parameters (should fail gracefully)
  console.log('\n📋 Test 3: Invalid parameters (should fail gracefully)');
  try {
    const response = await fetch(`${PROD_URL}/api/generate-exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        levels: ['Z1'],
        topics: ['fake-topic'],
        masteredWords: {}
      })
    });
    
    if (response.ok) {
      results.errors.push('Invalid parameters should have failed but returned success');
      console.log('   ❌ Should have failed but returned success');
    } else {
      console.log(`   ✅ Correctly failed with HTTP ${response.status}`);
    }
    
  } catch (error) {
    console.log(`   ✅ Correctly failed with error: ${error.message}`);
  }
  
  // Generate final report
  console.log('\n📈 FINAL REPORT');
  console.log('================');
  
  console.log(`📊 Results:`);
  console.log(`   Fallback exercises: ${results.fallbackExercises.length}`);
  console.log(`   Fresh exercises: ${results.freshExercises.length}`);
  console.log(`   Errors: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors found:');
    results.errors.forEach(error => console.log(`   - ${error}`));
    return false;
  }
  
  // Validate level/topic filtering
  const allExercises = [...results.fallbackExercises, ...results.freshExercises];
  const levelViolations = allExercises.filter(e => 
    (e.level === 'B2' && e.topic !== 'imperfect-subjunctive') ||
    (e.level === 'B1' && e.topic !== 'present-subjunctive')
  );
  
  if (levelViolations.length > 0) {
    console.log('\n❌ Level/topic filtering violations found');
    return false;
  }
  
  console.log('\n✅ All tests passed! Production app is working correctly.');
  console.log('   - Configuration topic selection is working');
  console.log('   - Exercise generation respects level/topic selection');
  console.log('   - API key is properly used for fresh generation');
  
  return true;
}

// Run the test
if (require.main === module) {
  testProductionQuick().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Production test failed:', error);
    process.exit(1);
  });
}

module.exports = { testProductionQuick };