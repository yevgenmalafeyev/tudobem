import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEVEL_PROMPTS = {
  'A1': 'A1_Exercise_Generation_Prompt.md',
  'A2': 'A2_Exercise_Generation_Prompt.md', 
  'B1': 'B1_Exercise_Generation_Prompt.md',
  'B2': 'B2_Exercise_Generation_Prompt_Exact.md',
  'C1': 'C1_Exercise_Generation_Prompt.md',
  'C2': 'C2_Exercise_Generation_Prompt.md'
};

export async function POST(request: NextRequest) {
  console.log(`🚀 POST /api/admin/generate-bulk-questions endpoint called`);
  console.log(`⏰ Request timestamp: ${new Date().toISOString()}`);
  
  try {
    console.log(`📋 Parsing request body...`);
    const { level } = await request.json();
    console.log(`📝 Requested level: ${level}`);
    
    if (!level || !LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS]) {
      console.error(`❌ Invalid level specified: ${level}`);
      return NextResponse.json(
        { error: 'Invalid level specified' },
        { status: 400 }
      );
    }
    console.log(`✅ Level validation passed for: ${level}`);

    // Read the prompt file for the specified level
    const promptPath = path.join(process.cwd(), 'src', 'prompts', LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS]);
    console.log(`📁 Prompt file path: ${promptPath}`);
    
    if (!fs.existsSync(promptPath)) {
      console.error(`❌ Prompt file not found: ${promptPath}`);
      return NextResponse.json(
        { error: `Prompt file not found for level ${level}` },
        { status: 404 }
      );
    }
    console.log(`✅ Prompt file exists`);

    console.log(`📖 Reading prompt file content...`);
    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    console.log(`📄 Prompt content length: ${promptContent.length} characters`);
    
    // Extract topics from the prompt content
    console.log(`🔍 Extracting topics from prompt content...`);
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    console.log(`📋 Topic regex matches: ${topicMatches?.length || 0}`);
    
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];
    console.log(`📚 Extracted topics (${topics.length}): ${JSON.stringify(topics.slice(0, 5))}${topics.length > 5 ? '...' : ''}`);

    if (topics.length === 0) {
      console.error(`❌ No topics found in prompt file for level ${level}`);
      return NextResponse.json(
        { error: `No topics found in prompt file for level ${level}` },
        { status: 400 }
      );
    }

    // Start the generation process (this will be handled by a background job)
    // For now, return success with the topics that will be generated
    console.log(`🎯 Preparing successful response for level ${level}`);
    console.log(`📊 Total topics to be generated: ${topics.length}`);
    
    const response = {
      success: true,
      message: `Started generation for ${level} level`,
      totalTopics: topics.length,
      topics: topics
    };
    
    console.log(`✅ Returning success response:`, response);
    return NextResponse.json(response);

  } catch (error) {
    console.error(`❌ Error starting bulk question generation:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    
    const errorResponse = { 
      error: 'Failed to start bulk question generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    
    console.log(`❌ Returning error response:`, errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}