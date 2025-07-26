import fs from 'fs';

// Load local config
let ANTHROPIC_API_KEY = null;
try {
  const localConfig = JSON.parse(fs.readFileSync('./local-config.json', 'utf8'));
  ANTHROPIC_API_KEY = localConfig.anthropicApiKey;
} catch {
  console.warn('⚠️  No local-config.json found');
  console.warn('   Create local-config.json with: {"anthropicApiKey": "your-api-key"}');
}

async function testAPIDirectly() {
  console.log('🔧 Testing API directly...');
  
  const testCases = [
    {
      name: 'Without API key (should use fallback)',
      body: {
        levels: ['B2'],
        topics: ['imperfect-subjunctive'],
        masteredWords: {}
      }
    },
    {
      name: 'With API key (should use Claude)',
      body: {
        levels: ['B2'],
        topics: ['imperfect-subjunctive'],
        claudeApiKey: ANTHROPIC_API_KEY,
        masteredWords: {}
      }
    },
    {
      name: 'With invalid levels (should fail)',
      body: {
        levels: ['Z1'],
        topics: ['fake-topic'],
        masteredWords: {}
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    
    if (testCase.name.includes('API key') && !ANTHROPIC_API_KEY) {
      console.log('   ⚠️  Skipping - no API key configured');
      continue;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   ❌ HTTP ${response.status}: ${errorText}`);
        continue;
      }
      
      const result = await response.json();
      console.log(`   ✅ Success: Level ${result.level}, Topic ${result.topic}`);
      console.log(`   📝 Exercise: ${result.sentence}`);
      
      // Validate level constraint
      if (testCase.body.levels && !testCase.body.levels.includes(result.level)) {
        console.log(`   ⚠️  Level constraint violated: expected ${testCase.body.levels.join(', ')}, got ${result.level}`);
      }
      
      // Validate topic constraint
      if (testCase.body.topics && !testCase.body.topics.includes(result.topic)) {
        console.log(`   ⚠️  Topic constraint violated: expected ${testCase.body.topics.join(', ')}, got ${result.topic}`);
      }
      
      // Check if it looks like a fresh generation vs fallback
      const isFreshGeneration = result.id && result.id.length > 5;
      console.log(`   🔄 Generation type: ${isFreshGeneration ? 'Fresh (API)' : 'Fallback (hardcoded)'}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// Run the test
testAPIDirectly().catch(console.error);