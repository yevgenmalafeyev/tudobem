import fs from 'fs';
import { Anthropic } from '@anthropic-ai/sdk';

// Load local config
let ANTHROPIC_API_KEY = null;
try {
  const localConfig = JSON.parse(fs.readFileSync('./local-config.json', 'utf8'));
  ANTHROPIC_API_KEY = localConfig.anthropicApiKey;
} catch {
  console.error('❌ No local-config.json found');
  process.exit(1);
}

async function testAnthropicAPI() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ No API key found in local-config.json');
    process.exit(1);
  }
  
  console.log('🔑 Testing Anthropic API key...');
  console.log(`📏 API key length: ${ANTHROPIC_API_KEY.length}`);
  console.log(`🔤 API key format: ${ANTHROPIC_API_KEY.substring(0, 10)}...`);
  
  try {
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hello, please respond with just "API test successful"'
        }
      ]
    });
    
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('✅ API test successful');
    console.log(`📝 Response: ${responseText}`);
    return true;
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      status: error.status,
      type: error.type
    });
    return false;
  }
}

testAnthropicAPI().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});