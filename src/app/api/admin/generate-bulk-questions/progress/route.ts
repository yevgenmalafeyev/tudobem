import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { ANTHROPIC_CONFIG } from '@/constants';
import { calculateCost, estimateTokenCount } from '@/utils/costCalculation';

// Note: In production, use a proper job queue like Redis or database for progress tracking

const LEVEL_PROMPTS = {
  'A1': 'A1_Exercise_Generation_Prompt.md',
  'A2': 'A2_Exercise_Generation_Prompt.md', 
  'B1': 'B1_Exercise_Generation_Prompt.md',
  'B2': 'B2_Exercise_Generation_Prompt_Exact.md',
  'C1': 'C1_Exercise_Generation_Prompt.md',
  'C2': 'C2_Exercise_Generation_Prompt.md'
};

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  if (!level) {
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Start the real generation using Claude API
      generateQuestionsWithClaude(level, controller, encoder);
      
      // Keep the connection alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      // Clean up when the client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        try {
          controller.close();
        } catch {
          // Connection already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}

async function generateQuestionsWithClaude(level: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  try {
    // Initialize Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Read the prompt file for the specified level
    const promptFileName = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    if (!promptFileName) {
      throw new Error(`No prompt file found for level ${level}`);
    }

    const promptPath = path.join(process.cwd(), 'src', 'prompts', promptFileName);
    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file not found: ${promptPath}`);
    }

    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    
    // Extract topics from the prompt content
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];

    if (topics.length === 0) {
      throw new Error(`No topics found in prompt file for level ${level}`);
    }

    const totalTopics = topics.length;
    let totalQuestionsAdded = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    
    // Send initial progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 0,
      currentTopic: 'Starting generation...',
      totalTopics: totalTopics
    })}\n\n`));

    // Process each topic
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      
      // Update progress
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        progress: Math.round((i / totalTopics) * 100),
        currentTopic: `Generating questions for: ${topic}`,
        totalTopics: totalTopics
      })}\n\n`));

      try {
        // Create topic-specific prompt
        const topicPrompt = `${promptContent}\n\nGenerate exactly 10 questions for the topic "${topic}". Return ONLY a valid JSON array of exercises following the exact format specified in the prompt.`;
        
        // Estimate input tokens for this request
        const inputTokens = estimateTokenCount(topicPrompt);
        
        // Call Claude API
        const message = await anthropic.messages.create({
          model: ANTHROPIC_CONFIG.model,
          max_tokens: ANTHROPIC_CONFIG.maxTokens.exercise * 10,
          messages: [
            {
              role: 'user',
              content: topicPrompt
            }
          ]
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        
        // Track token usage
        const outputTokens = estimateTokenCount(responseText);
        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        
        // Extract and parse JSON
        const startIndex = responseText.indexOf('[');
        if (startIndex === -1) {
          console.warn(`No JSON array found in Claude response for topic: ${topic}`);
          continue;
        }
        
        let bracketCount = 0;
        let endIndex = startIndex;
        
        for (let j = startIndex; j < responseText.length; j++) {
          if (responseText[j] === '[') {
            bracketCount++;
          } else if (responseText[j] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              endIndex = j;
              break;
            }
          }
        }
        
        const jsonString = responseText.substring(startIndex, endIndex + 1);
        const exercises = JSON.parse(jsonString);
        
        // Save exercises to database
        const client = await pool.connect();
        try {
          for (const exercise of exercises) {
            // Validate exercise data
            if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
              console.warn('Invalid exercise data, skipping:', exercise);
              continue;
            }

            await client.query(
              `INSERT INTO exercises (sentence, correct_answer, topic, level, hint, multiple_choice_options, explanations, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
              [
                exercise.sentence,
                exercise.correctAnswer,
                exercise.topic,
                exercise.level,
                exercise.hint ? JSON.stringify(exercise.hint) : null,
                exercise.multipleChoiceOptions ? JSON.stringify(exercise.multipleChoiceOptions) : null,
                exercise.explanations ? JSON.stringify(exercise.explanations) : null
              ]
            );
            totalQuestionsAdded++;
          }
        } finally {
          client.release();
        }

        console.log(`Generated ${exercises.length} questions for topic: ${topic}`);
        
      } catch (error) {
        console.error(`Error generating questions for topic "${topic}":`, error);
        // Continue with next topic
      }
    }

    // Send final progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 100,
      currentTopic: 'Generation completed',
      totalTopics: totalTopics
    })}\n\n`));

    // Calculate total cost
    const costBreakdown = calculateCost({
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens
    });

    // Save cost data to database
    try {
      const client = await pool.connect();
      try {
        await client.query(
          `INSERT INTO generation_costs (level, topics_generated, questions_generated, input_tokens, output_tokens, total_tokens, input_cost_usd, output_cost_usd, total_cost_usd)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            level,
            totalTopics,
            totalQuestionsAdded,
            costBreakdown.inputTokens,
            costBreakdown.outputTokens,
            costBreakdown.totalTokens,
            costBreakdown.inputCostUsd,
            costBreakdown.outputCostUsd,
            costBreakdown.totalCostUsd
          ]
        );
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error saving cost data:', error);
    }

    // Send completion with cost information
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'complete',
      questionsAdded: totalQuestionsAdded,
      message: `Successfully generated ${totalQuestionsAdded} questions for ${level} level across ${totalTopics} topics`,
      cost: {
        totalCostUsd: costBreakdown.totalCostUsd,
        inputTokens: costBreakdown.inputTokens,
        outputTokens: costBreakdown.outputTokens,
        totalTokens: costBreakdown.totalTokens
      }
    })}\n\n`));

    controller.close();

  } catch (error) {
    console.error('Error in generateQuestionsWithClaude:', error);
    
    // Send error
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })}\n\n`));
    
    controller.close();
  }
}