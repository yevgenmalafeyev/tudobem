#!/usr/bin/env node

// Test script to verify Claude API functionality locally
// Using built-in fetch (Node.js 18+)

async function testClaudeAPILocally() {
  console.log('🧪 Testing Claude API locally...');
  
  // Test payload - simulate what the frontend sends
  const testPayload = {
    levels: ['A1'],
    topics: ['present-indicative'],
    claudeApiKey: process.env.CLAUDE_API_KEY || 'test-key', // Use env var or prompt user
    masteredWords: {},
    count: 5,
    sessionId: `test-${Date.now()}`,
    priority: 'immediate'
  };

  console.log('🧪 Test payload:', {
    ...testPayload,
    claudeApiKey: testPayload.claudeApiKey ? `${testPayload.claudeApiKey.substring(0, 15)}...` : 'NOT_SET'
  });

  try {
    console.log('🧪 Making request to local API...');
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
    
    const data = await response.json();
    console.log('🧪 Full response:', JSON.stringify(data, null, 2));
    console.log('🧪 Response summary:', {
      success: data.success,
      error: data.error,
      exerciseCount: data.exercises?.length || 0,
      source: data.source,
      firstExercise: data.exercises?.[0] ? {
        sentence: data.exercises[0].sentence,
        source: data.exercises[0].source
      } : null
    });

    if (!data.success) {
      console.error('❌ API call failed:', data.error);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Check if Claude API key is available
if (!process.env.CLAUDE_API_KEY) {
  console.log('⚠️  CLAUDE_API_KEY not found in environment');
  console.log('💡 Please set it with: export CLAUDE_API_KEY=sk-ant-...');
  console.log('🧪 Testing with dummy key (should show API key validation)...');
}

testClaudeAPILocally();