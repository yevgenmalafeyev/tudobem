import { NextRequest } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';
import { 
  generateBatchExercisePrompt, 
  validateBatchExerciseResponse,
  processGeneratedExercises,
  generateSupplementaryPrompt
} from '@/utils/batchPrompts';
import { topics } from '@/data/topics';
import { 
  parseRequestBody, 
  createApiResponse, 
  createApiError, 
  callClaudeApi,
  extractJsonFromClaudeResponse,
  withErrorHandling,
  FALLBACK_MESSAGES
} from '@/lib/api-utils';
import { 
  BatchGenerationRequest, 
  BatchGenerationResponse, 
  EnhancedExercise,
  ExerciseFilter 
} from '@/types/enhanced';
import { LanguageLevel } from '@/types';
import { EnhancedFallbackService } from '@/services/enhancedFallbackService';

/**
 * Generate fallback exercises when database and AI both fail
 */
async function generateFallbackExercises(levels: LanguageLevel[], count: number): Promise<EnhancedExercise[]> {
  try {
    console.log('🆘 [DEBUG] Generating fallback exercises for levels:', levels, 'count:', count);
    const fallbackExercises = await EnhancedFallbackService.getExerciseBatch(
      levels, 
      [], // No specific topics filter for ultimate fallback
      count,
      {}, // No mastered words filter for ultimate fallback
      `fallback-${Date.now()}` // Generate session ID for tracking
    );
    console.log('🆘 [DEBUG] Generated', fallbackExercises.length, 'fallback exercises');
    return fallbackExercises;
  } catch (error) {
    console.error('🆘 [DEBUG] Even fallback exercises failed:', error);
    // Return minimal hard-coded exercise as last resort
    return [{
      id: `fallback-${Date.now()}`,
      sentence: "Eu ___ português.",
      gapIndex: 1,
      correctAnswer: "falo",
      topic: "present-indicative",
      level: levels[0] || 'A1',
      multipleChoiceOptions: ["falo", "falas", "fala", "falamos"],
      explanations: {
        pt: "Usamos 'falo' para a primeira pessoa do singular no presente.",
        en: "We use 'falo' for the first person singular in the present tense.",
        uk: "Ми використовуємо 'falo' для першої особи однини в теперішньому часі."
      },
      hint: { infinitive: "falar", form: "1st person singular present" },
      source: 'fallback',
      difficultyScore: 0.3,
      usageCount: 0
    }];
  }
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  const startTime = Date.now();
  console.log('📦 [DEBUG] Batch exercise generation API called at', new Date().toISOString());
  
  // Debug environment variables
  console.log('📦 [DEBUG] Environment check:', {
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    postgresUrlPrefix: process.env.POSTGRES_URL?.substring(0, 20) + '...' || 'NOT_SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'NOT_SET'
  });
  
  let body: BatchGenerationRequest;
  try {
    console.log('📦 [DEBUG] Step 1: Parsing request body...');
    body = await parseRequestBody<BatchGenerationRequest>(request);
    console.log('📦 [DEBUG] Step 1: Request body parsed successfully');
  } catch (parseError) {
    console.error('📦 [DEBUG] Failed to parse request body:', parseError);
    return createApiError(`Invalid request body: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`, 400);
  }
  
  try {
    
    const {
      levels: parsedLevels,
      topics: parsedTopics,
      claudeApiKey,
      masteredWords: parsedMasteredWords = {},
      count = 10,
      sessionId,
      priority = 'immediate'
    } = body;
  
    const levels = parsedLevels || ['A1'];
    const selectedTopics = parsedTopics || [];
    const masteredWords = parsedMasteredWords;
    
    console.log('📦 [DEBUG] Step 2: Data processing completed');
    console.log('📊 [DEBUG] Parsed data:', { 
      levels, 
      selectedTopics: selectedTopics?.length, 
      hasApiKey: !!claudeApiKey, 
      masteredWordsCount: Object.keys(masteredWords).length,
      requestedCount: count,
      sessionId,
      priority,
      elapsedMs: Date.now() - startTime
    });

    // Add timeout protection for database operations
    const dbTimeoutMs = 10000; // 10 second timeout for DB operations
    
    /**
     * Timeout wrapper for database operations
     */
    const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs);
        })
      ]);
    };

    // Step 3: Try to get exercises from database first (with fallback)
    let databaseExercises: EnhancedExercise[] = [];
    
    try {
      console.log('📦 [DEBUG] Step 3: Starting database check...');
      console.log('🔍 [DEBUG] Checking database for existing exercises...');
      
      const filter: ExerciseFilter = {
        levels,
        topics: selectedTopics,
        limit: count * 2 // Get more than needed to have variety
      };
      console.log('📦 [DEBUG] Database filter created:', filter);
      
      console.log('📦 [DEBUG] About to call SmartDatabase.getExercises...');
      const dbStartTime = Date.now();
      databaseExercises = await withTimeout(
        SmartDatabase.getExercises(filter),
        dbTimeoutMs,
        'Database query'
      );
      console.log('📦 [DEBUG] SmartDatabase.getExercises completed in', Date.now() - dbStartTime, 'ms');
      console.log(`📚 [DEBUG] Found ${databaseExercises.length} exercises in database`);
      
    } catch (dbError) {
      console.error('⚠️ [DEBUG] Database operation failed:', dbError);
      console.log('📦 [DEBUG] Continuing without database exercises...');
      databaseExercises = [];
    }
    
    console.log('📦 [DEBUG] Step 4: Starting exercise processing...');
    
    // Step 4: Determine how many new exercises we need to generate
    let exercisesToReturn: EnhancedExercise[] = [];
    let generationSource: 'ai' | 'database' | 'mixed' = 'database';
    
    console.log('📦 [DEBUG] Step 4a: Checking if we have enough database exercises...');
    if (databaseExercises.length >= count) {
      console.log('📦 [DEBUG] Step 4a: Sufficient database exercises found');
      // We have enough in database
      exercisesToReturn = databaseExercises
        .filter(ex => !masteredWords[`${ex.correctAnswer}:${ex.hint?.infinitive || ''}:${ex.hint?.form || ''}`])
        .slice(0, count);
      
      if (exercisesToReturn.length < count) {
        // Not enough non-mastered exercises, include some mastered ones
        const remainingNeeded = count - exercisesToReturn.length;
        const masteredExercises = databaseExercises
          .filter(ex => masteredWords[`${ex.correctAnswer}:${ex.hint?.infinitive || ''}:${ex.hint?.form || ''}`])
          .slice(0, remainingNeeded);
        exercisesToReturn.push(...masteredExercises);
      }
      
      console.log(`✅ Using ${exercisesToReturn.length} exercises from database`);
    } else {
      // We need to generate some new exercises
      const neededCount = count - databaseExercises.length;
      console.log('📦 [DEBUG] Step 4b: Need to generate AI exercises');
      console.log(`🤖 [DEBUG] Need to generate ${neededCount} new exercises`);
      
      if (!claudeApiKey) {
        console.log('📦 [DEBUG] Step 4b: No API key provided');
        console.log('⚠️ [DEBUG] No API key provided, returning only database exercises');
        exercisesToReturn = databaseExercises.slice(0, count);
        generationSource = 'database';
      } else {
        // Generate new exercises using Claude AI
        console.log('📦 [DEBUG] Step 4c: Starting AI generation process...');
        const topicNames = topics
          .filter(topic => selectedTopics.includes(topic.id))
          .map(topic => topic.name);
        console.log('📦 [DEBUG] Topic names extracted:', topicNames);

        console.log('📦 [DEBUG] Generating prompt...');
        const prompt = databaseExercises.length > 0
          ? generateSupplementaryPrompt(levels, selectedTopics, databaseExercises, neededCount)
          : generateBatchExercisePrompt(levels, selectedTopics, topicNames, masteredWords, neededCount);
        console.log('📦 [DEBUG] Prompt generated, length:', prompt.length);
        
        console.log('🚀 [DEBUG] About to call Claude AI...');
        
        try {
          const aiStartTime = Date.now();
          console.log('📦 [DEBUG] Calling Claude API...');
          const responseText = await callClaudeApi(claudeApiKey, prompt);
          console.log('📦 [DEBUG] Claude API call completed in', Date.now() - aiStartTime, 'ms');
          console.log('📝 [DEBUG] Claude AI response received, length:', responseText.length);
          
          const jsonString = extractJsonFromClaudeResponse(responseText);
          const exerciseData = JSON.parse(jsonString);
          
          // Validate the response
          if (!validateBatchExerciseResponse(exerciseData)) {
            throw new Error('Generated exercises failed validation');
          }
          
          // Process and clean up exercises
          const processedExercises = processGeneratedExercises(exerciseData);
          
          // Validate constraints for each exercise
          const validExercises: EnhancedExercise[] = [];
          for (const exercise of processedExercises) {
            // Check level constraint
            if (!levels.includes(exercise.level)) {
              console.warn(`⚠️ Exercise level ${exercise.level} not in requested levels ${levels.join(', ')}`);
              continue;
            }
            
            // Check topic constraint
            if (!selectedTopics.includes(exercise.topic)) {
              console.warn(`⚠️ Exercise topic ${exercise.topic} not in requested topics ${selectedTopics.join(', ')}`);
              continue;
            }
            
            validExercises.push({
              ...exercise,
              source: 'ai',
              difficultyScore: 0.5,
              usageCount: 0
            });
          }
          
          console.log(`✅ Generated ${validExercises.length} valid exercises`);
          
          // Save new exercises to database for future use (with timeout)
          if (validExercises.length > 0) {
            try {
              console.log('💾 Saving new exercises to database...');
              const saveStartTime = Date.now();
              await withTimeout(
                SmartDatabase.saveExerciseBatch(validExercises),
                dbTimeoutMs,
                'Database save operation'
              );
              console.log('💾 Database save completed in', Date.now() - saveStartTime, 'ms');
            } catch (saveError) {
              console.error('⚠️ Failed to save exercises to database:', saveError);
              // Continue without saving - exercises can still be returned
            }
          }
          
          // Combine database and generated exercises
          exercisesToReturn = [...databaseExercises, ...validExercises].slice(0, count);
          generationSource = databaseExercises.length > 0 ? 'mixed' : 'ai';
          
        } catch (aiError) {
          console.error('❌ AI generation failed:', aiError);
          
          // Fallback to database exercises only
          exercisesToReturn = databaseExercises.slice(0, count);
          generationSource = 'database';
          
          if (exercisesToReturn.length === 0) {
            console.log('🆘 [DEBUG] No database exercises, falling back to static fallback exercises...');
            // Ultimate fallback - return static fallback exercises
            const fallbackExercises = generateFallbackExercises(levels, count);
            return createApiResponse({
              exercises: fallbackExercises,
              generatedCount: fallbackExercises.length,
              source: 'fallback' as const,
              sessionId
            });
          }
        }
      }
    }
    
    // Step 3: Shuffle the final exercise list for variety
    const shuffledExercises = exercisesToReturn.sort(() => Math.random() - 0.5);
    
    // Step 4: Track usage for database exercises (mark them as used with timeout)
    for (const exercise of shuffledExercises) {
      if (exercise.id && exercise.source !== 'ai') {
        try {
          await withTimeout(
            SmartDatabase.markExerciseUsed(exercise.id, sessionId, false), // We don't know if it's correct yet
            5000, // Shorter timeout for usage tracking
            'Mark exercise as used'
          );
        } catch (error) {
          console.warn('⚠️ Failed to mark exercise as used:', error);
          // Continue - this is not critical for the response
        }
      }
    }
    
    const response: BatchGenerationResponse = {
      success: true,
      data: {
        exercises: shuffledExercises,
        generatedCount: shuffledExercises.length,
        source: generationSource,
        sessionId
      }
    };
    
    console.log(`🎉 Successfully returning ${shuffledExercises.length} exercises (source: ${generationSource})`);
    return createApiResponse(response.data);
    
  } catch (error) {
    console.error('💥 Error in batch generation:', error);
    
    // Try to extract variables from the error context if they exist
    let fallbackLevels: LanguageLevel[] = ['A1'];
    let fallbackCount = 10;
    let fallbackSessionId = `error-fallback-${Date.now()}`;
    
    try {
      // Parse the request body again to get the variables for fallback
      const request_clone = request.clone();
      const fallbackBody = await parseRequestBody<BatchGenerationRequest>(request_clone);
      fallbackLevels = fallbackBody.levels || ['A1'];
      fallbackCount = fallbackBody.count || 10;
      fallbackSessionId = fallbackBody.sessionId || fallbackSessionId;
    } catch (parseError) {
      console.warn('⚠️ Could not re-parse request for fallback, using defaults');
    }
    
    // Ultimate fallback - try to get any exercises from database
    try {
      const fallbackFilter: ExerciseFilter = { levels: fallbackLevels, limit: fallbackCount };
      const fallbackExercises = await SmartDatabase.getExercises(fallbackFilter);
      
      if (fallbackExercises.length > 0) {
        console.log(`🆘 Using ${fallbackExercises.length} fallback exercises from database`);
        return createApiResponse({
          exercises: fallbackExercises.slice(0, fallbackCount),
          generatedCount: fallbackExercises.length,
          source: 'database' as const,
          sessionId: fallbackSessionId
        });
      }
    } catch (fallbackError) {
      console.error('💥 Database fallback also failed:', fallbackError);
    }
    
    // Final fallback using enhanced fallback service
    try {
      console.log('🆘 [DEBUG] All database options failed, using enhanced fallback service...');
      const fallbackExercises = await generateFallbackExercises(fallbackLevels, fallbackCount);
      
      if (fallbackExercises.length > 0) {
        console.log(`🆘 Using ${fallbackExercises.length} enhanced fallback exercises`);
        return createApiResponse({
          exercises: fallbackExercises,
          generatedCount: fallbackExercises.length,
          source: 'fallback' as const,
          sessionId: fallbackSessionId
        });
      }
    } catch (enhancedFallbackError) {
      console.error('💥 Enhanced fallback also failed:', enhancedFallbackError);
    }
    
    // If everything fails
    const errorMessage = `Failed to generate exercise batch: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return createApiError(errorMessage, 500);
  }
});