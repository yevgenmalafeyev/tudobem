import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { calculateCost, estimateTokenCount } from '@/utils/costCalculation';

// Declare global type for debug logs
declare global {
  var debugLogs: string[] | undefined;
}

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

function logError(message: string) {
  console.error(message);
  debugLog(`❌ ERROR: ${message}`);
}

function logWarning(message: string) {
  console.warn(message);
  debugLog(`⚠️ WARNING: ${message}`);
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
  debugLog(`🌐 SSE endpoint called for bulk question generation`);
  
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  debugLog(`📋 Requested level: ${level}`);

  if (!level) {
    logError('No level parameter provided');
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }
  
  debugLog(`✅ Level parameter validated: ${level}`);

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
  debugLog(`🚀 Starting generation for level: ${level}`);
  
  try {
    // Initialize Claude API
    debugLog(`🔧 Initializing Claude API...`);
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      logError('ANTHROPIC_API_KEY not configured');
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    debugLog(`✅ Claude API initialized with key: ${process.env.ANTHROPIC_API_KEY.substring(0, 8)}...`);
    
    // Test the API key with the appropriate model for this level
    const isAdvancedLevel = ['C1', 'C2'].includes(level);
    const testModel = isAdvancedLevel ? 'claude-opus-4-20250514' : 'claude-3-5-sonnet-20241022';
    debugLog(`🧪 Testing Claude API key with ${testModel} for level ${level}...`);
    try {
      const testMessage = await anthropic.messages.create({
        model: testModel,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }]
      });
      debugLog(`✅ Claude API key test successful with ${testModel}, response length: ${testMessage.content[0].type === 'text' ? testMessage.content[0].text.length : 0}`);
    } catch (apiTestError) {
      logError(`Claude API key test failed with ${testModel}: ${apiTestError}`);
      throw new Error(`Claude API key test failed with ${testModel}: ${apiTestError}`);
    }

    // Read the prompt file for the specified level
    const promptFileName = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    debugLog(`📁 Using prompt file: ${promptFileName} for level ${level}`);
    
    if (!promptFileName) {
      logError(`No prompt file mapping found for level ${level}`);
      throw new Error(`No prompt file found for level ${level}`);
    }

    const promptPath = path.join(process.cwd(), 'src', 'prompts', promptFileName);
    debugLog(`📍 Full prompt path: ${promptPath}`);
    
    if (!fs.existsSync(promptPath)) {
      logError(`Prompt file does not exist at path: ${promptPath}`);
      throw new Error(`Prompt file not found: ${promptPath}`);
    }
    debugLog(`✅ Prompt file found successfully`);

    const promptContent = fs.readFileSync(promptPath, 'utf-8');
    debugLog(`📖 Prompt content length: ${promptContent.length} characters`);
    
    // Extract topics from the prompt content
    const topicMatches = promptContent.match(/\d+\.\s\*\*([^*]+)\*\*/g);
    debugLog(`🔍 Topic regex matches found: ${topicMatches?.length || 0}`);
    
    const topics = topicMatches ? topicMatches.map(match => {
      const topicMatch = match.match(/\*\*([^*]+)\*\*/);
      return topicMatch ? topicMatch[1] : '';
    }).filter(Boolean) : [];

    debugLog(`📋 Extracted topics (${topics.length}): ${JSON.stringify(topics)}`);

    if (topics.length === 0) {
      logError(`No topics found in prompt file for level ${level}`);
      throw new Error(`No topics found in prompt file for level ${level}`);
    }

    const totalTopics = topics.length;
    let totalQuestionsAdded = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    
    debugLog(`🎯 Will process ${totalTopics} topics for level ${level}`);
    
    // Send initial progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 0,
      currentTopic: 'Starting generation...',
      totalTopics: totalTopics
    })}\n\n`));

    // Process each topic
    debugLog(`🔄 Starting to process topics...`);
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      debugLog(`\n🎯 Processing topic ${i + 1}/${totalTopics}: "${topic}"`);
      
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
        debugLog(`📝 Created topic prompt for "${topic}" (${topicPrompt.length} chars)`);
        
        // Estimate input tokens for this request
        const inputTokens = estimateTokenCount(topicPrompt);
        debugLog(`🔢 Estimated input tokens: ${inputTokens}`);
        
        // Select model based on level: Sonnet for A1-B2, Opus for C1-C2
        const isAdvancedLevel = ['C1', 'C2'].includes(level);
        const selectedModel = isAdvancedLevel ? 'claude-opus-4-20250514' : 'claude-3-5-sonnet-20241022';
        debugLog(`📋 Using model ${selectedModel} for level ${level}`);

        // Call Claude API with appropriate token limits for each model
        const maxTokens = isAdvancedLevel ? 8192 * 3 : 8192; // Opus: 24,576 tokens, Sonnet: 8,192 tokens
        debugLog(`🤖 Calling Claude API for topic "${topic}" with max_tokens: ${maxTokens}...`);
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
        debugLog(`✅ Claude API call successful for topic "${topic}"`);

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        debugLog(`📄 Claude response length: ${responseText.length} chars`);
        debugLog(`📄 Claude response preview: ${responseText.substring(0, 200)}...`);
        
        // Track token usage
        const outputTokens = estimateTokenCount(responseText);
        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        debugLog(`📊 Token usage - Input: ${inputTokens}, Output: ${outputTokens}, Total so far: Input=${totalInputTokens}, Output=${totalOutputTokens}`);
        
        // Extract and parse JSON
        const startIndex = responseText.indexOf('[');
        debugLog(`🔍 JSON start index: ${startIndex}`);
        if (startIndex === -1) {
          logWarning(`No JSON array found in Claude response for topic: ${topic}`);
          debugLog(`📄 Full response: ${responseText}`);
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
        
        let exercises;
        try {
          exercises = JSON.parse(jsonString);
        } catch (parseError) {
          logError(`JSON parse error for topic "${topic}": ${parseError}`);
          continue;
        }
        
        // Save exercises to database
        const client = await pool.connect();
        
        try {
          for (const exercise of exercises) {
            // Validate exercise data
            if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
              logWarning(`Invalid exercise data, skipping: ${JSON.stringify(exercise).substring(0, 100)}`);
              continue;
            }

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
            } catch (insertError) {
              logError(`Database insert error for exercise: ${insertError}`);
            }
          }
        } finally {
          client.release();
        }

      } catch (error) {
        logError(`Error generating questions for topic "${topic}": ${error instanceof Error ? error.message : String(error)}`);
        
        // Fail fast on API errors to surface the real issue
        throw new Error(`Claude API call failed for topic "${topic}": ${error instanceof Error ? error.message : String(error)}`);
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
      logError(`Error saving cost data: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Send completion with cost information
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
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completionData)}\n\n`));
    controller.close();

  } catch (error) {
    logError(`Critical error in generateQuestionsWithClaude: ${error instanceof Error ? error.message : String(error)}`);
    
    // Send error
    const errorData = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
    controller.close();
  }
}