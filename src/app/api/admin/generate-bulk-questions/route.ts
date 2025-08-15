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
  try {
    const { level } = await request.json();
    
    if (!level || !LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid level specified' },
        { status: 400 }
      );
    }

    // Read the prompt file for the specified level
    const promptPath = path.join(process.cwd(), LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS]);
    
    if (!fs.existsSync(promptPath)) {
      return NextResponse.json(
        { error: `Prompt file not found for level ${level}` },
        { status: 404 }
      );
    }

    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    
    // Extract topics from the prompt content
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];

    if (topics.length === 0) {
      return NextResponse.json(
        { error: `No topics found in prompt file for level ${level}` },
        { status: 400 }
      );
    }

    // Start the generation process (this will be handled by a background job)
    // For now, return success with the topics that will be generated
    return NextResponse.json({
      success: true,
      message: `Started generation for ${level} level`,
      totalTopics: topics.length,
      topics: topics
    });

  } catch (error) {
    console.error('Error starting bulk question generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start bulk question generation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}