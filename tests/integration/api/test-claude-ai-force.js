#!/usr/bin/env node

// Test script to force Claude AI generation by using non-existent topics
async function testForceClaudeAI() {
  console.log('🧪 Testing FORCED Claude AI generation...');
  
  // Test payload with non-existent topics to force AI generation
  const testPayload = {
    levels: ['A1'],
    topics: ['nonexistent-topic-12345'], // This topic shouldn't exist in DB
    claudeApiKey: process.env.CLAUDE_API_KEY || 'test-key-invalid',
    masteredWords: {},
    count: 1000, // Request way more than database likely has
    sessionId: `force-test-${Date.now()}`,
    priority: 'immediate'
  };

  console.log('🧪 Test payload (should force AI):', {
    ...testPayload,
    claudeApiKey: testPayload.claudeApiKey ? `${testPayload.claudeApiKey.substring(0, 15)}...` : 'NOT_SET'
  });

  try {
    console.log('🧪 Making request to force AI generation...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/generate-batch-exercises-batch', {
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

    if (data.success && data.data) {
      console.log('🧪 Response analysis:', {
        success: data.success,
        exerciseCount: data.data.exercises?.length || 0,
        source: data.data.source,
        firstExerciseSource: data.data.exercises?.[0]?.source,
        allSources: data.data.exercises?.map(ex => ex.source) || []
      });
    } else {
      console.log('🧪 Error response:', data.error || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

console.log('🔑 Claude API Key:', process.env.CLAUDE_API_KEY ? 'Present' : 'Missing');
testForceClaudeAI();