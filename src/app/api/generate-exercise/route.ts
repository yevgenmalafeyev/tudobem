import { NextRequest } from 'next/server';
import { topics } from '@/data/topics';
import { getFallbackExercise, createExercise } from '@/services/exerciseService';
import { EnhancedFallbackService } from '@/services/enhancedFallbackService';
import { generateExercisePrompt } from '@/utils/prompts';
import { LanguageLevel } from '@/types';
import { 
  parseRequestBody, 
  createApiResponse, 
  createApiError, 
  callClaudeApi,
  extractJsonFromClaudeResponse,
  withErrorHandling,
  FALLBACK_MESSAGES
} from '@/lib/api-utils';

export const POST = withErrorHandling(async (request: NextRequest) => {
  
  const { 
    levels: parsedLevels, 
    topics: parsedTopics, 
    claudeApiKey, 
    masteredWords: parsedMasteredWords = {}
  } = await parseRequestBody<{
    levels: LanguageLevel[];
    topics: string[];
    claudeApiKey?: string;
    masteredWords?: Record<string, unknown>;
  }>(request);
  
  const levels = parsedLevels || [];
  const selectedTopics = parsedTopics || [];
  const masteredWords = parsedMasteredWords;
  
  // Data parsed successfully
  
  // If no Claude API key, use enhanced fallback system
  if (!claudeApiKey) {
    try {
      const exercise = await EnhancedFallbackService.getExercise(
        levels || ['A1'], 
        selectedTopics, 
        masteredWords
      );
      
      if (!exercise) {
        console.error('No enhanced fallback exercise found for levels:', levels, 'and topics:', selectedTopics);
        return createApiError(FALLBACK_MESSAGES.en.noExercises, 400);
      }
      
      // Using enhanced fallback exercise
      return createApiResponse(exercise);
    } catch (error) {
      console.error('Enhanced fallback failed, using legacy fallback:', error);
      
      // Ultimate fallback to legacy system
      const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
      if (!exercise) {
        return createApiError(FALLBACK_MESSAGES.en.noExercises, 400);
      }
      return createApiResponse(exercise);
    }
  }

  // Generate exercise using Claude AI
  const topicNames = topics
    .filter(topic => selectedTopics.includes(topic.id))
    .map(topic => topic.name);

  const prompt = generateExercisePrompt(levels, selectedTopics, topicNames, masteredWords);
  // Using Claude AI for generation
  
  try {
    const responseText = await callClaudeApi(claudeApiKey, prompt);
    // Claude AI response received
    
    const jsonString = extractJsonFromClaudeResponse(responseText);
    // JSON extracted from response
    
    const exerciseData = JSON.parse(jsonString);
    // Exercise data parsed successfully
    
    // Validate that the exercise matches the requested constraints
    if (!levels.includes(exerciseData.level)) {
      console.error('Level constraint violation:', { requested: levels, actual: exerciseData.level });
      throw new Error(`AI generated exercise with level ${exerciseData.level} but requested levels were ${levels.join(', ')}`);
    }
    
    if (!selectedTopics.includes(exerciseData.topic)) {
      console.error('Topic constraint violation:', { requested: selectedTopics, actual: exerciseData.topic });
      throw new Error(`AI generated exercise with topic ${exerciseData.topic} but requested topics were ${selectedTopics.join(', ')}`);
    }
    
    const exercise = createExercise(exerciseData);
    // Exercise created successfully

    return createApiResponse(exercise);
  } catch (error) {
    console.error('Error generating exercise:', error);
    
    // Try fallback with original request parameters
    // Attempting fallback with original parameters
    const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
    
    if (exercise) {
      // Fallback exercise found
      return createApiResponse(exercise);
    }
    
    console.error('Fallback failed for levels:', levels, 'and topics:', selectedTopics);
    const errorMessage = `No exercises available for selected levels (${levels?.join(', ')}) and topics. Please try selecting different levels or topics.`;
    return createApiError(errorMessage, 500);
  }
});