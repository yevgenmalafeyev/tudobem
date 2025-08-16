import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { calculateCost, estimateTokenCount } from '@/utils/costCalculation';

// Debug logging function for production debugging
function debugLog(message: string) {
  console.log(message);
  // Also store in memory for API access
  try {
    global.debugLogs = global.debugLogs || [];
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    global.debugLogs.push(logEntry);
    
    // Keep only the last 200 entries
    if (global.debugLogs.length > 200) {
      global.debugLogs.shift();
    }
  } catch (error) {
    console.error('Error storing debug log:', error);
  }
}

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
  debugLog(`🌐 [DEBUG] SSE endpoint called for bulk question generation`);
  
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  debugLog(`📋 [DEBUG] Requested level: ${level}`);

  if (!level) {
    debugLog(`❌ [DEBUG] No level parameter provided`);
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }
  
  debugLog(`✅ [DEBUG] Level parameter validated: ${level}`);

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
  debugLog(`🚀 [DEBUG] Starting generation for level: ${level}`);
  
  try {
    // Initialize Claude API
    debugLog(`🔧 [DEBUG] Initializing Claude API...`);
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      debugLog(`❌ [DEBUG] ANTHROPIC_API_KEY not configured`);
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    debugLog(`✅ [DEBUG] Claude API initialized successfully with key: ${process.env.ANTHROPIC_API_KEY.substring(0, 8)}...`);
    
    // Test the API key with the appropriate model for this level
    const isAdvancedLevel = ['C1', 'C2'].includes(level);
    const testModel = isAdvancedLevel ? 'claude-3-opus-20240229' : 'claude-3-5-sonnet-20241022';
    debugLog(`🧪 [DEBUG] Testing Claude API key with ${testModel} for level ${level}...`);
    try {
      const testMessage = await anthropic.messages.create({
        model: testModel,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }]
      });
      debugLog(`✅ [DEBUG] Claude API key test successful with ${testModel}, response length: ${testMessage.content[0].type === 'text' ? testMessage.content[0].text.length : 0}`);
    } catch (apiTestError) {
      debugLog(`❌ [DEBUG] Claude API key test failed with ${testModel}: ${apiTestError}`);
      throw new Error(`Claude API key test failed with ${testModel}: ${apiTestError}`);
    }

    // Read the prompt file for the specified level
    const promptFileName = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    debugLog(`📁 [DEBUG] Using prompt file: ${promptFileName} for level ${level}`);
    
    if (!promptFileName) {
      debugLog(`❌ [DEBUG] No prompt file mapping found for level ${level}`);
      throw new Error(`No prompt file found for level ${level}`);
    }

    const promptPath = path.join(process.cwd(), 'src', 'prompts', promptFileName);
    debugLog(`📍 [DEBUG] Full prompt path: ${promptPath}`);
    
    if (!fs.existsSync(promptPath)) {
      debugLog(`❌ [DEBUG] Prompt file does not exist at path: ${promptPath}`);
      throw new Error(`Prompt file not found: ${promptPath}`);
    }
    debugLog(`✅ [DEBUG] Prompt file found successfully`);

    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    debugLog(`📖 [DEBUG] Prompt content length: ${promptContent.length} characters`);
    
    // Extract topics from the prompt content
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    debugLog(`🔍 [DEBUG] Topic regex matches found: ${topicMatches?.length || 0}`);
    
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];

    debugLog(`📋 [DEBUG] Extracted topics (${topics.length}): ${JSON.stringify(topics)}`);

    if (topics.length === 0) {
      debugLog(`❌ [DEBUG] No topics found in prompt file for level ${level}`);
      throw new Error(`No topics found in prompt file for level ${level}`);
    }

    const totalTopics = topics.length;
    let totalQuestionsAdded = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    
    debugLog(`🎯 [DEBUG] Will process ${totalTopics} topics for level ${level}`);
    
    // Send initial progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 0,
      currentTopic: 'Starting generation...',
      totalTopics: totalTopics
    })}\n\n`));

    // Process each topic
    debugLog(`🔄 [DEBUG] Starting to process topics...`);
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      debugLog(`\n🎯 [DEBUG] Processing topic ${i + 1}/${totalTopics}: "${topic}"`);
      
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
        debugLog(`📝 [DEBUG] Created topic prompt for "${topic}" (${topicPrompt.length} chars)`);
        
        // Estimate input tokens for this request
        const inputTokens = estimateTokenCount(topicPrompt);
        debugLog(`🔢 [DEBUG] Estimated input tokens: ${inputTokens}`);
        
        // Select model based on level: Sonnet for A1-B2, Opus for C1-C2
        const isAdvancedLevel = ['C1', 'C2'].includes(level);
        const selectedModel = isAdvancedLevel ? 'claude-3-opus-20240229' : 'claude-3-5-sonnet-20241022';
        debugLog(`📋 [DEBUG] Using model ${selectedModel} for level ${level}`);

        // Call Claude API with appropriate token limits for each model
        const maxTokens = isAdvancedLevel ? 8192 * 3 : 8192; // Opus: 24,576 tokens, Sonnet: 8,192 tokens
        debugLog(`🤖 [DEBUG] Calling Claude API for topic "${topic}" with max_tokens: ${maxTokens}...`);
        const message = await anthropic.messages.create({
          model: selectedModel,
          max_tokens: maxTokens,
          messages: [
            {
              role: 'user',
              content: topicPrompt
            }
          ]
        });
        debugLog(`✅ [DEBUG] Claude API call successful for topic "${topic}"`);

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        debugLog(`📄 [DEBUG] Claude response length: ${responseText.length} chars`);
        debugLog(`📄 [DEBUG] Claude response preview: ${responseText.substring(0, 200)}...`);
        
        // Track token usage
        const outputTokens = estimateTokenCount(responseText);
        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        debugLog(`📊 [DEBUG] Token usage - Input: ${inputTokens}, Output: ${outputTokens}, Total so far: Input=${totalInputTokens}, Output=${totalOutputTokens}`);
        
        // Extract and parse JSON
        const startIndex = responseText.indexOf('[');
        debugLog(`🔍 [DEBUG] JSON start index: ${startIndex}`);
        if (startIndex === -1) {
          debugLog(`❌ [DEBUG] No JSON array found in Claude response for topic: ${topic}`);
          debugLog(`📄 [DEBUG] Full response: ${responseText}`);
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
        debugLog(`📝 [DEBUG] Extracted JSON string length: ${jsonString.length} chars`);
        debugLog(`📝 [DEBUG] JSON preview: ${jsonString.substring(0, 300)}...`);
        
        let exercises;
        try {
          exercises = JSON.parse(jsonString);
          debugLog(`✅ [DEBUG] Successfully parsed JSON, found ${exercises.length} exercises`);
        } catch (parseError) {
          debugLog(`❌ [DEBUG] JSON parse error for topic "${topic}": ${parseError}`);
          debugLog(`📄 [DEBUG] Failed JSON string: ${jsonString}`);
          continue;
        }
        
        // Save exercises to database
        debugLog(`💾 [DEBUG] Connecting to database to save ${exercises.length} exercises...`);
        const client = await pool.connect();
        debugLog(`✅ [DEBUG] Database connection established`);
        
        try {
          let exercisesInserted = 0;
          for (const exercise of exercises) {
            debugLog(`🔍 [DEBUG] Validating exercise: ${JSON.stringify(exercise).substring(0, 100)}...`);
            
            // Validate exercise data
            if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
              debugLog(`❌ [DEBUG] Invalid exercise data, skipping: ${JSON.stringify(exercise)}`);
              continue;
            }

            debugLog(`💾 [DEBUG] Inserting exercise into database: "${exercise.sentence.substring(0, 50)}..."`);
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
              debugLog(`✅ [DEBUG] Successfully inserted exercise ${exercisesInserted}/${exercises.length} for topic "${topic}"`);
            } catch (insertError) {
              debugLog(`❌ [DEBUG] Database insert error for exercise: ${insertError}`);
              debugLog(`📄 [DEBUG] Failed exercise data: ${JSON.stringify(exercise)}`);
            }
          }
          debugLog(`✅ [DEBUG] Completed database operations for topic "${topic}". Inserted: ${exercisesInserted}/${exercises.length} exercises`);
        } finally {
          client.release();
          debugLog(`🔌 [DEBUG] Database connection released`);
        }

        debugLog(`✅ [DEBUG] Generated ${exercises.length} questions for topic: ${topic} (Total added so far: ${totalQuestionsAdded})`);
        
      } catch (error) {
        debugLog(`❌ [DEBUG] Error generating questions for topic "${topic}": ${error}`);
        debugLog(`❌ [DEBUG] Error stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
        debugLog(`❌ [DEBUG] Error details: ${JSON.stringify(error, null, 2)}`);
        
        // Fail fast on API errors to surface the real issue
        throw new Error(`Claude API call failed for topic "${topic}": ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    debugLog(`🏁 [DEBUG] Finished processing all ${totalTopics} topics. Total questions added: ${totalQuestionsAdded}`);

    // Send final progress
    debugLog(`📤 [DEBUG] Sending final progress update...`);
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 100,
      currentTopic: 'Generation completed',
      totalTopics: totalTopics
    })}\n\n`));

    // Calculate total cost
    debugLog(`💰 [DEBUG] Calculating costs - Input tokens: ${totalInputTokens}, Output tokens: ${totalOutputTokens}`);
    const costBreakdown = calculateCost({
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens
    });
    debugLog(`💰 [DEBUG] Cost breakdown: ${JSON.stringify(costBreakdown)}`);

    // Save cost data to database
    debugLog(`💾 [DEBUG] Saving cost data to database...`);
    try {
      const client = await pool.connect();
      debugLog(`✅ [DEBUG] Connected to database for cost saving`);
      try {
        debugLog(`💾 [DEBUG] Inserting cost record: Level=${level}, Topics=${totalTopics}, Questions=${totalQuestionsAdded}, Cost=$${costBreakdown.totalCostUsd}`);
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
        debugLog(`✅ [DEBUG] Successfully saved cost data to database`);
      } finally {
        client.release();
        debugLog(`🔌 [DEBUG] Released database connection for cost saving`);
      }
    } catch (error) {
      debugLog(`❌ [DEBUG] Error saving cost data: ${error}`);
      debugLog(`❌ [DEBUG] Cost save error stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
    }

    // Send completion with cost information
    debugLog(`📤 [DEBUG] Sending completion message...`);
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
    debugLog(`📤 [DEBUG] Completion data: ${JSON.stringify(completionData)}`);
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completionData)}\n\n`));

    debugLog(`🏁 [DEBUG] Generation completed successfully. Closing connection.`);
    controller.close();

  } catch (error) {
    debugLog(`❌ [DEBUG] Critical error in generateQuestionsWithClaude: ${error}`);
    debugLog(`❌ [DEBUG] Error stack: ${error instanceof Error ? error.stack : 'No stack trace available'}`);
    debugLog(`❌ [DEBUG] Error type: ${typeof error}`);
    debugLog(`❌ [DEBUG] Error name: ${error instanceof Error ? error.name : 'Unknown error type'}`);
    
    // Send error
    const errorData = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    debugLog(`📤 [DEBUG] Sending error response: ${JSON.stringify(errorData)}`);
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
    
    debugLog(`🔚 [DEBUG] Closing connection due to error.`);
    controller.close();
  }
}