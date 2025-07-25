#!/usr/bin/env node

// Direct test of Claude API without the web app
const Anthropic = require('@anthropic-ai/sdk');

async function testDirectClaudeAPI() {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Please set your Claude API key:');
    console.log('   export CLAUDE_API_KEY=your-actual-key-here');
    console.log('   node test-direct-claude-api.js');
    return;
  }
  
  console.log('🔑 Testing direct Claude API call...');
  console.log('🔑 API key prefix:', apiKey.substring(0, 15) + '...');
  console.log('🔑 API key length:', apiKey.length);
  console.log('🔑 API key format valid:', apiKey.startsWith('sk-ant-'));
  
  try {
    const startTime = Date.now();
    console.log('🤖 Creating Anthropic client at:', new Date().toISOString());
    
    const anthropic = new Anthropic({ apiKey });
    console.log('🤖 Client created, making API request...');
    
    const requestStart = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        { 
          role: 'user', 
          content: 'Generate 1 Portuguese fill-in-the-blank exercise for A1 level about present tense verbs. Format as JSON: {"exercises": [{"sentence": "...", "correctAnswer": "...", "topic": "present-indicative", "level": "A1"}]}'
        }
      ]
    });
    
    const requestEnd = Date.now();
    const requestDuration = requestEnd - requestStart;
    const totalDuration = requestEnd - startTime;
    
    console.log('✅ SUCCESS!');
    console.log('⏱️  Request duration:', requestDuration, 'ms');
    console.log('⏱️  Total duration:', totalDuration, 'ms');
    console.log('📝 Response length:', message.content[0]?.text?.length || 0);
    console.log('📄 Response preview:', message.content[0]?.text?.substring(0, 200) + '...');
    
    if (requestDuration > 15000) {
      console.log('⚠️  API call took longer than 15 seconds - this could cause timeouts');
    }
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);
    
    if (error.status) {
      console.error('📊 HTTP Status:', error.status);
    }
    
    if (error.error?.type) {
      console.error('🔍 Error type:', error.error.type);
    }
    
    console.error('🔍 Full error:', error);
  }
}

testDirectClaudeAPI();