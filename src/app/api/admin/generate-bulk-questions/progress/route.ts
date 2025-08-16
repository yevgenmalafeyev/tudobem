import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { calculateCost, estimateTokenCount } from '@/utils/costCalculation';

// Minimal logging - warnings and errors only
function logError(message: string) {
  console.error(message);
}

function logWarning(message: string) {
  console.warn(message);
}

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
    logError('No level parameter provided');
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Start the real generation using Claude API
      generateQuestionsWithClaude(level, controller, encoder);
      
      // Keep the connection alive with heartbeats
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 15000);

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
    if (!process.env.ANTHROPIC_API_KEY) {
      logError('ANTHROPIC_API_KEY not configured');
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Test the API key - use Sonnet for all levels
    const selectedModel = 'claude-3-5-sonnet-20241022';
    
    try {
      await anthropic.messages.create({
        model: selectedModel,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }]
      });
    } catch (apiTestError) {
      logError(`Claude API connection failed: ${apiTestError}`);
      throw new Error(`Claude API connection test failed: ${apiTestError}`);
    }

    // Read the prompt file for the specified level
    const promptFileName = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    
    if (!promptFileName) {
      logError(`No prompt file mapping found for level ${level}`);
      throw new Error(`No prompt file found for level ${level}`);
    }

    const promptPath = path.join(process.cwd(), 'src', 'prompts', promptFileName);
    
    if (!fs.existsSync(promptPath)) {
      logError(`Prompt file does not exist at path: ${promptPath}`);
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
      logError(`No topics found in prompt file for level ${level}`);
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
        // Create topic-specific prompt with explicit JSON format requirement  
        const topicPrompt = `${promptContent}

IMPORTANT: Generate exactly 10 questions for the topic "${topic}".

CRITICAL: You MUST return ONLY a valid JSON array. Do NOT include any explanations, comments, or text outside the JSON. The response should start with [ and end with ].

Example format:
[
  {
    "sentence": "Example sentence with ___.",
    "correctAnswer": "correct answer", 
    "topic": "${topic}",
    "level": "${level}",
    "hint": {"pt": "Portuguese hint", "en": "English hint"},
    "multipleChoiceOptions": ["option1", "option2", "option3", "option4"],
    "explanations": {"pt": "Portuguese explanation", "en": "English explanation"}
  }
]

Generate exactly 10 questions for topic "${topic}" and return ONLY the JSON array:`;
        
        // Estimate input tokens for this request
        const inputTokens = estimateTokenCount(topicPrompt);
        
        // Use Sonnet for all levels
        const maxTokens = 8192;
        
        let message;
        try {
          // Standard API call for all levels
          message = await anthropic.messages.create({
            model: selectedModel,
            max_tokens: maxTokens,
            messages: [
              {
                role: 'user',
                content: topicPrompt
              }
            ]
          });
        } catch (claudeError) {
          logError(`Claude API call failed for topic "${topic}": ${claudeError instanceof Error ? claudeError.message : String(claudeError)}`);
          throw claudeError;
        }

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        
        // Track token usage
        const outputTokens = estimateTokenCount(responseText);
        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        
        // Extract and parse JSON with multiple fallback strategies
        let jsonString = '';
        let jsonFound = false;
        
        // Strategy 1: Look for JSON array (most common case)
        const startIndex = responseText.indexOf('[');
        
        if (startIndex !== -1) {
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
          
          jsonString = responseText.substring(startIndex, endIndex + 1);
          jsonFound = true;
        }
        
        // Strategy 2: Look for JSON object if array not found
        if (!jsonFound) {
          const objStartIndex = responseText.indexOf('{');
          
          if (objStartIndex !== -1) {
            let braceCount = 0;
            let endIndex = objStartIndex;
            
            for (let j = objStartIndex; j < responseText.length; j++) {
              if (responseText[j] === '{') {
                braceCount++;
              } else if (responseText[j] === '}') {
                braceCount--;
                if (braceCount === 0) {
                  endIndex = j;
                  break;
                }
              }
            }
            
            const objString = responseText.substring(objStartIndex, endIndex + 1);
            jsonString = `[${objString}]`; // Wrap single object in array
            jsonFound = true;
          }
        }
        
        // Strategy 3: Try to clean the response and extract JSON with regex
        if (!jsonFound) {
          const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
            jsonFound = true;
          }
        }
        
        if (!jsonFound) {
          logWarning(`No valid JSON found in Claude response for topic: ${topic}`);
          continue;
        }
        
        let exercises;
        try {
          exercises = JSON.parse(jsonString);
        } catch (parseError) {
          logError(`JSON parse error for topic "${topic}": ${parseError}`);
          continue;
        }
        
        // Save exercises to database IMMEDIATELY (incremental saving)
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
                `INSERT INTO exercises (sentence, correct_answer, topic, level, hint, multiple_choice_options, explanation_pt, explanation_en, explanation_uk, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
                [
                  exercise.sentence,
                  exercise.correctAnswer,
                  exercise.topic,
                  exercise.level,
                  exercise.hint ? JSON.stringify(exercise.hint) : null,
                  exercise.multipleChoiceOptions ? JSON.stringify(exercise.multipleChoiceOptions) : null,
                  exercise.explanations?.pt || null,
                  exercise.explanations?.en || null,
                  exercise.explanations?.uk || null
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
        // Continue with next topic instead of failing completely
        continue;
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