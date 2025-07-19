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

export const POST = withErrorHandling(async (request: NextRequest) => {
  console.log('📦 Batch exercise generation API called');
  
  const {
    levels: parsedLevels,
    topics: parsedTopics,
    claudeApiKey,
    masteredWords: parsedMasteredWords = {},
    count = 10,
    sessionId,
    priority = 'immediate'
  } = await parseRequestBody<BatchGenerationRequest>(request);
  
  const levels = parsedLevels || ['A1'];
  const selectedTopics = parsedTopics || [];
  const masteredWords = parsedMasteredWords;
  
  console.log('📊 Parsed data:', { 
    levels, 
    selectedTopics: selectedTopics?.length, 
    hasApiKey: !!claudeApiKey, 
    masteredWordsCount: Object.keys(masteredWords).length,
    requestedCount: count,
    sessionId,
    priority
  });

  try {
    // Step 1: Try to get exercises from database first
    console.log('🔍 Checking database for existing exercises...');
    
    const filter: ExerciseFilter = {
      levels,
      topics: selectedTopics,
      limit: count * 2 // Get more than needed to have variety
    };
    
    const databaseExercises = await SmartDatabase.getExercises(filter);
    console.log(`📚 Found ${databaseExercises.length} exercises in database`);
    
    // Step 2: Determine how many new exercises we need to generate
    let exercisesToReturn: EnhancedExercise[] = [];
    let generationSource: 'ai' | 'database' | 'mixed' = 'database';
    
    if (databaseExercises.length >= count) {
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
      console.log(`🤖 Need to generate ${neededCount} new exercises`);
      
      if (!claudeApiKey) {
        console.log('⚠️ No API key provided, returning only database exercises');
        exercisesToReturn = databaseExercises.slice(0, count);
        generationSource = 'database';
      } else {
        // Generate new exercises using Claude AI
        const topicNames = topics
          .filter(topic => selectedTopics.includes(topic.id))
          .map(topic => topic.name);

        const prompt = databaseExercises.length > 0
          ? generateSupplementaryPrompt(levels, selectedTopics, databaseExercises, neededCount)
          : generateBatchExercisePrompt(levels, selectedTopics, topicNames, masteredWords, neededCount);
        
        console.log('🚀 Generating exercises with Claude AI...');
        
        try {
          const responseText = await callClaudeApi(claudeApiKey, prompt);
          console.log('📝 Claude AI response received');
          
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
          
          // Save new exercises to database for future use
          if (validExercises.length > 0) {
            console.log('💾 Saving new exercises to database...');
            await SmartDatabase.saveExerciseBatch(validExercises);
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
            return createApiError(
              `Unable to generate exercises. No database exercises available for levels ${levels.join(', ')} and topics ${selectedTopics.join(', ')}.`,
              500
            );
          }
        }
      }
    }
    
    // Step 3: Shuffle the final exercise list for variety
    const shuffledExercises = exercisesToReturn.sort(() => Math.random() - 0.5);
    
    // Step 4: Track usage for database exercises (mark them as used)
    for (const exercise of shuffledExercises) {
      if (exercise.id && exercise.source !== 'ai') {
        try {
          await SmartDatabase.markExerciseUsed(exercise.id, sessionId, false); // We don't know if it's correct yet
        } catch (error) {
          console.warn('⚠️ Failed to mark exercise as used:', error);
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
    
    // Ultimate fallback - try to get any exercises from database
    try {
      const fallbackFilter: ExerciseFilter = { levels, limit: count };
      const fallbackExercises = await SmartDatabase.getExercises(fallbackFilter);
      
      if (fallbackExercises.length > 0) {
        console.log(`🆘 Using ${fallbackExercises.length} fallback exercises from database`);
        return createApiResponse({
          exercises: fallbackExercises.slice(0, count),
          generatedCount: fallbackExercises.length,
          source: 'database' as const,
          sessionId
        });
      }
    } catch (fallbackError) {
      console.error('💥 Fallback also failed:', fallbackError);
    }
    
    // If everything fails
    const errorMessage = `Failed to generate exercise batch: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return createApiError(errorMessage, 500);
  }
});