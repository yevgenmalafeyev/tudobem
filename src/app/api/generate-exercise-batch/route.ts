import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SmartDatabase } from '@/lib/smartDatabase';
import { UserDatabase } from '@/lib/userDatabase';
import { 
  generateBatchExercisePrompt, 
  validateBatchExerciseResponse,
  processGeneratedExercises
} from '@/utils/batchPrompts';
import { topics } from '@/data/topics';
import { 
  parseRequestBody, 
  createApiResponse, 
  createApiError, 
  callClaudeApi,
  extractJsonFromClaudeResponse,
  withErrorHandling
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
async function generateFallbackExercises(
  levels: LanguageLevel[], 
  count: number, 
  authenticatedUserId?: string,
  isLearningMode: boolean = false
): Promise<EnhancedExercise[]> {
  try {
    console.log('🆘 [DEBUG] Generating fallback exercises for levels:', levels, 'count:', count, 'userId:', authenticatedUserId, 'learningMode:', isLearningMode);
    
    if (isLearningMode) {
      // For learning mode: Use database-only fallback service (no AI calls)
      console.log('🆘 [DEBUG] Learning mode fallback: Database-only, no AI calls');
      const databaseOnlyExercises = await SmartDatabase.getExercises({
        levels,
        limit: count,
        userId: authenticatedUserId
      });
      
      if (databaseOnlyExercises.length > 0) {
        console.log('🆘 [DEBUG] Learning mode fallback: Using', databaseOnlyExercises.length, 'database exercises');
        return databaseOnlyExercises.slice(0, count);
      }
      
      // If no database exercises, return hard-coded static exercise
      console.log('🆘 [DEBUG] Learning mode fallback: No database exercises, using static');
    } else {
      // For admin/external mode: Allow full fallback including AI
      const fallbackExercises = await EnhancedFallbackService.getExerciseBatch(
        levels, 
        [], // No specific topics filter for ultimate fallback
        count,
        {}, // No mastered words filter for ultimate fallback
        authenticatedUserId // Pass user ID for filtering
      );
      console.log('🆘 [DEBUG] Admin/External fallback: Generated', fallbackExercises.length, 'fallback exercises');
      return fallbackExercises;
    }
  } catch (error) {
    console.error('🆘 [DEBUG] Fallback exercises failed:', error);
  }
  
  // Return minimal hard-coded exercise as last resort
  console.log('🆘 [DEBUG] Using hard-coded static exercise as last resort');
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
    difficultyScore: 0.3,
    usageCount: 0
  }];
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
      masteredWords: parsedMasteredWords = {},
      count = 10,
      sessionId,
      priority = 'immediate',
      source = 'external' // Default to external if not specified (for backward compatibility)
    } = body;
  
    const levels = parsedLevels || ['A1'];
    const selectedTopics = parsedTopics || [];
    const masteredWords = parsedMasteredWords;
    
    // Get Claude API key from database
    const claudeApiKey = await UserDatabase.getClaudeApiKey();
    
    // Check for authenticated user and get their correctly answered exercises
    let authenticatedUser = null;
    let userCorrectlyAnswered: string[] = [];
    
    try {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('session-token')?.value;
      
      if (sessionToken) {
        authenticatedUser = await UserDatabase.verifyToken(sessionToken);
        if (authenticatedUser) {
          console.log('🔐 [DEBUG] Authenticated user found:', authenticatedUser.id);
          userCorrectlyAnswered = await UserDatabase.getCorrectlyAnsweredExercises(authenticatedUser.id);
          console.log('🔐 [DEBUG] User has correctly answered', userCorrectlyAnswered.length, 'exercises');
        }
      }
    } catch (authError) {
      console.log('🔐 [DEBUG] No authenticated user or auth error:', authError);
      // Continue as anonymous user
    }
    
    console.log('📦 [DEBUG] Step 2: Data processing completed');
    console.log('📊 [DEBUG] Parsed data:', { 
      levels, 
      selectedTopics: selectedTopics?.length, 
      hasApiKey: !!claudeApiKey, 
      masteredWordsCount: Object.keys(masteredWords).length,
      requestedCount: count,
      sessionId,
      priority,
      source,
      authenticatedUser: !!authenticatedUser,
      userCorrectlyAnsweredCount: userCorrectlyAnswered.length,
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
        limit: count * 2, // Get more than needed to have variety
        userId: authenticatedUser?.id // Exclude user's correctly answered exercises
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
    
    // Step 4: CONTROL GENERATION STRATEGY BASED ON SOURCE
    let exercisesToReturn: EnhancedExercise[] = [];
    
    // Learning mode: ALWAYS use database, never generate fresh AI exercises
    if (source === 'learning') {
      console.log('📦 [DEBUG] Step 4: LEARNING MODE - Using database only (no AI generation)');
      
      // Use database exercises (server-side filtering only)
      // NO CLIENT-SIDE FILTERING - all filtering happens in the database query
      exercisesToReturn = databaseExercises.slice(0, count);
      
      console.log(`📚 LEARNING MODE: Using ${exercisesToReturn.length} database exercises (no AI generation)`);
      
    } else {
      // Admin/External mode: Can use AI generation
      console.log('📦 [DEBUG] Step 4: ADMIN/EXTERNAL MODE - AI generation allowed');
      
      if (!claudeApiKey) {
      console.log('📦 [DEBUG] Step 4a: No API key provided - using database fallback');
      console.log('⚠️ [DEBUG] API key check details:', {
        claudeApiKey: claudeApiKey,
        type: typeof claudeApiKey,
        length: claudeApiKey?.length || 0,
        truthy: !!claudeApiKey
      });
      
      // Fallback to database exercises (server-side filtering only)
      // NO CLIENT-SIDE FILTERING - all filtering happens in the database query
      exercisesToReturn = databaseExercises.slice(0, count);
      
      console.log(`⚠️ Using ${exercisesToReturn.length} exercises from database (no API key)`);
      
    } else {
      console.log('📦 [DEBUG] Step 4b: API key present - attempting AI generation');
      console.log('📦 [DEBUG] API key details:', {
        type: typeof claudeApiKey,
        length: claudeApiKey.length,
        prefix: claudeApiKey.substring(0, 15) + '...',
        valid: claudeApiKey.startsWith('sk-ant-')
      });
      // Generate fresh exercises using Claude AI
      console.log('📦 [DEBUG] Step 4c: Starting FRESH AI generation process...');
      const topicNames = topics
        .filter(topic => selectedTopics.includes(topic.id))
        .map(topic => topic.name);
      console.log('📦 [DEBUG] Topic names extracted:', topicNames);

      console.log('📦 [DEBUG] Generating prompt for FRESH exercises...');
      // Always generate fresh exercises, don't supplement existing ones
      const prompt = generateBatchExercisePrompt(levels, selectedTopics, topicNames, masteredWords, count);
      console.log('📦 [DEBUG] Prompt generated for', count, 'fresh exercises, length:', prompt.length);
        
        console.log('🚀 [DEBUG] About to call Claude AI...');
        console.log('🚀 [DEBUG] Pre-API call state:', {
          promptLength: prompt.length,
          claudeApiKeyPresent: !!claudeApiKey,
          claudeApiKeyLength: claudeApiKey.length,
          claudeApiKeyValid: claudeApiKey.startsWith('sk-ant-'),
          timestamp: new Date().toISOString()
        });
        
        try {
          const aiStartTime = Date.now();
          console.log('📦 [DEBUG] Calling Claude API with timeout protection...');
          console.log('📦 [DEBUG] Starting timeout race at:', new Date().toISOString());
          
          // Add timeout wrapper for Claude API call with detailed timing
          const claudeApiCall = callClaudeApi(claudeApiKey, prompt);
          const apiTimeout = new Promise<never>((_, reject) => {
            setTimeout(() => {
              const timeoutTime = Date.now();
              console.log('⏰ [DEBUG] API timeout triggered at:', new Date(timeoutTime).toISOString());
              console.log('⏰ [DEBUG] Total time before timeout:', timeoutTime - aiStartTime, 'ms');
              reject(new Error('Claude API call timeout after 35 seconds'));
            }, 35000);
          });
          
          console.log('📦 [DEBUG] About to start Promise.race...');
          const raceStartTime = Date.now();
          const responseText = await Promise.race([claudeApiCall, apiTimeout]);
          const raceEndTime = Date.now();
          console.log('📦 [DEBUG] Promise.race completed at:', new Date(raceEndTime).toISOString());
          console.log('📦 [DEBUG] Claude API call completed in', raceEndTime - aiStartTime, 'ms');
          console.log('📦 [DEBUG] Race duration:', raceEndTime - raceStartTime, 'ms');
          console.log('📝 [DEBUG] Claude AI response received, length:', responseText.length);
          console.log('📝 [DEBUG] Raw Claude response:', responseText.substring(0, 500) + '...');
          
          const jsonString = extractJsonFromClaudeResponse(responseText);
          console.log('📝 [DEBUG] Extracted JSON string:', jsonString.substring(0, 500) + '...');
          
          try {
            JSON.parse(jsonString);
            console.log('📝 [DEBUG] JSON parsing successful');
          } catch (parseError) {
            console.error('📝 [DEBUG] JSON parsing failed:', parseError instanceof Error ? parseError.message : String(parseError));
            console.log('📝 [DEBUG] Failed JSON string length:', jsonString.length);
            console.log('📝 [DEBUG] Failed JSON string full content:', jsonString);
            throw parseError;
          }
          
          const exerciseData = JSON.parse(jsonString);
          console.log('📝 [DEBUG] Parsed exercise data type:', typeof exerciseData);
          console.log('📝 [DEBUG] Parsed exercise data is array:', Array.isArray(exerciseData));
          console.log('📝 [DEBUG] Parsed exercise data:', JSON.stringify(exerciseData).substring(0, 500) + '...');
          
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
              difficultyScore: 0.5,
              usageCount: 0
            });
          }
          
          console.log(`✅ Generated ${validExercises.length} FRESH AI exercises`);
          
          // Save new exercises to database for future fallback use (with timeout)
          if (validExercises.length > 0) {
            try {
              console.log('💾 Saving new AI exercises to database for future fallback...');
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
          
          // Return ONLY fresh AI-generated exercises
          exercisesToReturn = validExercises.slice(0, count);
          console.log(`🤖 SUCCESS: Returning ${exercisesToReturn.length} FRESH AI exercises`);
          
        } catch (aiError) {
          console.error('❌ AI generation failed:', aiError);
          console.log('🔄 [DEBUG] Falling back to database exercises due to AI failure');
          
          // Fallback to database exercises when AI fails (server-side filtering only)
          // NO CLIENT-SIDE FILTERING - all filtering happens in the database query
          exercisesToReturn = databaseExercises.slice(0, count);
          
          console.log(`🔄 FALLBACK: Using ${exercisesToReturn.length} database exercises (AI failed)`);
          
          if (exercisesToReturn.length === 0) {
            console.log('🆘 [DEBUG] No database exercises available, using static fallback...');
            // Ultimate fallback - return static fallback exercises (pass source info)
            const isLearningMode = source !== 'admin';
            const fallbackExercises = await generateFallbackExercises(levels, count, authenticatedUser?.id, isLearningMode);
            return createApiResponse({
              exercises: fallbackExercises,
              generatedCount: fallbackExercises.length,
              source: 'fallback' as const,
              sessionId
            });
          }
        }
      }
    } // End of admin/external mode block
    
    // Handle insufficient exercises for learning mode
    if (source === 'learning' && exercisesToReturn.length === 0) {
      console.log('🆘 [DEBUG] Learning mode: No database exercises available, using static fallback...');
      // For learning mode, if no database exercises, use fallback but NO AI generation
      const fallbackExercises = await generateFallbackExercises(levels, count, authenticatedUser?.id, true);
      return createApiResponse({
        exercises: fallbackExercises,
        generatedCount: fallbackExercises.length,
        source: 'fallback' as const,
        sessionId
      });
    }
    
    // Step 3: Shuffle the final exercise list for variety
    const shuffledExercises = exercisesToReturn.sort(() => Math.random() - 0.5);
    
    // Step 4: Track usage for database exercises (mark them as used with timeout)
    for (const exercise of shuffledExercises) {
      if (exercise.id) {
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
        sessionId
      }
    };
    
    console.log(`🎉 Successfully returning ${shuffledExercises.length} exercises`);
    return createApiResponse(response.data);
    
  } catch (error) {
    console.error('💥 Error in batch generation:', error);
    
    // Try to extract variables from the error context if they exist
    // Use default values for fallback since we're in the error handler
    const fallbackLevels: LanguageLevel[] = ['A1'];
    const fallbackCount = 10;
    const fallbackSessionId = `error-fallback-${Date.now()}`;
    
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
      // In error handler, we don't have access to the original source, so default to safe learning mode
      const fallbackExercises = await generateFallbackExercises(fallbackLevels, fallbackCount, undefined, true); // Always safe mode in error handler
      
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