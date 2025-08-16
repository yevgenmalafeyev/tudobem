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
  console.log(`🌐 [DEBUG] SSE endpoint called for bulk question generation`);
  
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  console.log(`📋 [DEBUG] Requested level: ${level}`);

  if (!level) {
    console.log(`❌ [DEBUG] No level parameter provided`);
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }
  
  console.log(`✅ [DEBUG] Level parameter validated: ${level}`);

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
  console.log(`🚀 [DEBUG] Starting generation for level: ${level}`);
  
  try {
    // Initialize Claude API
    console.log(`🔧 [DEBUG] Initializing Claude API...`);
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      console.log(`❌ [DEBUG] ANTHROPIC_API_KEY not configured`);
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    console.log(`✅ [DEBUG] Claude API initialized successfully`);

    // Read the prompt file for the specified level
    const promptFileName = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    console.log(`📁 [DEBUG] Using prompt file: ${promptFileName} for level ${level}`);
    
    if (!promptFileName) {
      console.log(`❌ [DEBUG] No prompt file mapping found for level ${level}`);
      throw new Error(`No prompt file found for level ${level}`);
    }

    const promptPath = path.join(process.cwd(), 'src', 'prompts', promptFileName);
    console.log(`📍 [DEBUG] Full prompt path: ${promptPath}`);
    
    if (!fs.existsSync(promptPath)) {
      console.log(`❌ [DEBUG] Prompt file does not exist at path: ${promptPath}`);
      throw new Error(`Prompt file not found: ${promptPath}`);
    }
    console.log(`✅ [DEBUG] Prompt file found successfully`);

    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    console.log(`📖 [DEBUG] Prompt content length: ${promptContent.length} characters`);
    
    // Extract topics from the prompt content
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    console.log(`🔍 [DEBUG] Topic regex matches found: ${topicMatches?.length || 0}`);
    
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];

    console.log(`📋 [DEBUG] Extracted topics (${topics.length}):`, topics);

    if (topics.length === 0) {
      console.log(`❌ [DEBUG] No topics found in prompt file for level ${level}`);
      throw new Error(`No topics found in prompt file for level ${level}`);
    }

    const totalTopics = topics.length;
    let totalQuestionsAdded = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    
    console.log(`🎯 [DEBUG] Will process ${totalTopics} topics for level ${level}`);
    
    // Send initial progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 0,
      currentTopic: 'Starting generation...',
      totalTopics: totalTopics
    })}\n\n`));

    // Process each topic
    console.log(`🔄 [DEBUG] Starting to process topics...`);
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(`\n🎯 [DEBUG] Processing topic ${i + 1}/${totalTopics}: "${topic}"`);
      
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
        console.log(`📝 [DEBUG] Created topic prompt for "${topic}" (${topicPrompt.length} chars)`);
        
        // Estimate input tokens for this request
        const inputTokens = estimateTokenCount(topicPrompt);
        console.log(`🔢 [DEBUG] Estimated input tokens: ${inputTokens}`);
        
        // Call Claude API
        console.log(`🤖 [DEBUG] Calling Claude API for topic "${topic}"...`);
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
        console.log(`✅ [DEBUG] Claude API call successful for topic "${topic}"`);

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        console.log(`📄 [DEBUG] Claude response length: ${responseText.length} chars`);
        console.log(`📄 [DEBUG] Claude response preview: ${responseText.substring(0, 200)}...`);
        
        // Track token usage
        const outputTokens = estimateTokenCount(responseText);
        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        console.log(`📊 [DEBUG] Token usage - Input: ${inputTokens}, Output: ${outputTokens}, Total so far: Input=${totalInputTokens}, Output=${totalOutputTokens}`);
        
        // Extract and parse JSON
        const startIndex = responseText.indexOf('[');
        console.log(`🔍 [DEBUG] JSON start index: ${startIndex}`);
        if (startIndex === -1) {
          console.warn(`❌ [DEBUG] No JSON array found in Claude response for topic: ${topic}`);
          console.log(`📄 [DEBUG] Full response: ${responseText}`);
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
        console.log(`📝 [DEBUG] Extracted JSON string length: ${jsonString.length} chars`);
        console.log(`📝 [DEBUG] JSON preview: ${jsonString.substring(0, 300)}...`);
        
        let exercises;
        try {
          exercises = JSON.parse(jsonString);
          console.log(`✅ [DEBUG] Successfully parsed JSON, found ${exercises.length} exercises`);
        } catch (parseError) {
          console.error(`❌ [DEBUG] JSON parse error for topic "${topic}":`, parseError);
          console.log(`📄 [DEBUG] Failed JSON string: ${jsonString}`);
          continue;
        }
        
        // Save exercises to database
        console.log(`💾 [DEBUG] Connecting to database to save ${exercises.length} exercises...`);
        const client = await pool.connect();
        console.log(`✅ [DEBUG] Database connection established`);
        
        try {
          let exercisesInserted = 0;
          for (const exercise of exercises) {
            console.log(`🔍 [DEBUG] Validating exercise: ${JSON.stringify(exercise).substring(0, 100)}...`);
            
            // Validate exercise data
            if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
              console.warn(`❌ [DEBUG] Invalid exercise data, skipping:`, exercise);
              continue;
            }

            console.log(`💾 [DEBUG] Inserting exercise into database: "${exercise.sentence.substring(0, 50)}..."`);
            try {
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
              exercisesInserted++;
              console.log(`✅ [DEBUG] Successfully inserted exercise ${exercisesInserted}/${exercises.length} for topic "${topic}"`);
            } catch (insertError) {
              console.error(`❌ [DEBUG] Database insert error for exercise:`, insertError);
              console.log(`📄 [DEBUG] Failed exercise data:`, exercise);
            }
          }
          console.log(`✅ [DEBUG] Completed database operations for topic "${topic}". Inserted: ${exercisesInserted}/${exercises.length} exercises`);
        } finally {
          client.release();
          console.log(`🔌 [DEBUG] Database connection released`);
        }

        console.log(`✅ [DEBUG] Generated ${exercises.length} questions for topic: ${topic} (Total added so far: ${totalQuestionsAdded})`);
        
      } catch (error) {
        console.error(`❌ [DEBUG] Error generating questions for topic "${topic}":`, error);
        console.error(`❌ [DEBUG] Error stack:`, error instanceof Error ? error.stack : 'No stack trace available');
        // Continue with next topic
      }
    }
    
    console.log(`🏁 [DEBUG] Finished processing all ${totalTopics} topics. Total questions added: ${totalQuestionsAdded}`);

    // Send final progress
    console.log(`📤 [DEBUG] Sending final progress update...`);
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 100,
      currentTopic: 'Generation completed',
      totalTopics: totalTopics
    })}\n\n`));

    // Calculate total cost
    console.log(`💰 [DEBUG] Calculating costs - Input tokens: ${totalInputTokens}, Output tokens: ${totalOutputTokens}`);
    const costBreakdown = calculateCost({
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens
    });
    console.log(`💰 [DEBUG] Cost breakdown:`, costBreakdown);

    // Save cost data to database
    console.log(`💾 [DEBUG] Saving cost data to database...`);
    try {
      const client = await pool.connect();
      console.log(`✅ [DEBUG] Connected to database for cost saving`);
      try {
        console.log(`💾 [DEBUG] Inserting cost record: Level=${level}, Topics=${totalTopics}, Questions=${totalQuestionsAdded}, Cost=$${costBreakdown.totalCostUsd}`);
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
        console.log(`✅ [DEBUG] Successfully saved cost data to database`);
      } finally {
        client.release();
        console.log(`🔌 [DEBUG] Released database connection for cost saving`);
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Error saving cost data:`, error);
      console.error(`❌ [DEBUG] Cost save error stack:`, error instanceof Error ? error.stack : 'No stack trace available');
    }

    // Send completion with cost information
    console.log(`📤 [DEBUG] Sending completion message...`);
    const completionData = {
      type: 'complete',
      questionsAdded: totalQuestionsAdded,
      message: `Successfully generated ${totalQuestionsAdded} questions for ${level} level across ${totalTopics} topics`,
      cost: {
        totalCostUsd: costBreakdown.totalCostUsd,
        inputTokens: costBreakdown.inputTokens,
        outputTokens: costBreakdown.outputTokens,
        totalTokens: costBreakdown.totalTokens
      }
    };
    console.log(`📤 [DEBUG] Completion data:`, completionData);
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completionData)}\n\n`));

    console.log(`🏁 [DEBUG] Generation completed successfully. Closing connection.`);
    controller.close();

  } catch (error) {
    console.error(`❌ [DEBUG] Critical error in generateQuestionsWithClaude:`, error);
    console.error(`❌ [DEBUG] Error stack:`, error instanceof Error ? error.stack : 'No stack trace available');
    console.error(`❌ [DEBUG] Error type:`, typeof error);
    console.error(`❌ [DEBUG] Error name:`, error instanceof Error ? error.name : 'Unknown error type');
    
    // Send error
    const errorData = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    console.log(`📤 [DEBUG] Sending error response:`, errorData);
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
    
    console.log(`🔚 [DEBUG] Closing connection due to error.`);
    controller.close();
  }
}