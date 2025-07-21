#!/usr/bin/env node

// Instructions for testing with your Claude API key:
// 1. Set your API key: export CLAUDE_API_KEY=your-actual-key-here
// 2. Run: node test-with-your-api-key.js

async function testWithRealApiKey() {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Please set your Claude API key:');
    console.log('   export CLAUDE_API_KEY=sk-ant-api03-...');
    console.log('   node test-with-your-api-key.js');
    return;
  }

  if (!apiKey.startsWith('sk-ant-')) {
    console.log('⚠️  API key format seems incorrect. Should start with sk-ant-');
    return;
  }

  console.log('🧪 Testing with your real Claude API key...');
  console.log('🔑 API key prefix:', apiKey.substring(0, 15) + '...');
  
  const testPayload = {
    levels: ['A1'],
    topics: ['presente-indicativo-regulares'],
    claudeApiKey: apiKey, // Your real API key
    masteredWords: {},
    count: 3,
    sessionId: `real-test-${Date.now()}`,
    priority: 'immediate'
  };

  try {
    console.log('🚀 Making request with real API key...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/generate-exercise-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const duration = Date.now() - startTime;
    console.log(`🧪 Response received in ${duration}ms, status: ${response.status}`);
    
    if (response.status !== 200) {
      console.error('❌ Non-200 response:', response.status);
      const text = await response.text();
      console.error('Response text:', text.substring(0, 500));
      return;
    }
    
    const data = await response.json();
    
    console.log('🎉 SUCCESS! Result analysis:');
    console.log('  Source:', data.data?.source);
    console.log('  Exercise count:', data.data?.exercises?.length || 0);
    console.log('  First exercise source:', data.data?.exercises?.[0]?.source);
    
    if (data.data?.source === 'ai') {
      console.log('✅ PERFECT! Fresh AI exercises generated');
      console.log('  First exercise:', data.data.exercises[0].sentence);
    } else if (data.data?.source === 'database') {
      console.log('⚠️  Still using database fallback. Possible reasons:');
      console.log('     - Claude API timeout (check server logs)');
      console.log('     - API key invalid');
      console.log('     - Network issues');
    } else {
      console.log('❓ Unexpected source:', data.data?.source);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testWithRealApiKey();