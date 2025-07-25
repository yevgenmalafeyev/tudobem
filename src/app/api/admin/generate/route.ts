import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { ExerciseDatabase } from '@/lib/database';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling, requireAdminAuth, callClaudeApi, extractJsonFromClaudeResponse } from '@/lib/api-utils';
import { LanguageLevel } from '@/types';

interface GenerateExercisesRequest {
  topics: string[];
  levels: LanguageLevel[];
  count: number;
}

const EXERCISE_GENERATION_PROMPT = `Generate Portuguese language learning exercises for the following specifications:

Topics: {TOPICS}
Levels: {LEVELS}
Count: {COUNT}

For each exercise, create a fill-in-the-blank sentence with the following structure:
- sentence: A Portuguese sentence with "____" where the answer should go
- correctAnswer: The correct word/phrase to fill the blank
- topic: One of the specified topics
- level: One of the specified levels (A1, A2, B1, B2, C1, C2)
- hint: Object with infinitive, person, and form if applicable
- multipleChoiceOptions: Array of 4 options including the correct answer
- explanations: Object with Portuguese (pt), English (en), and Ukrainian (uk) explanations

Return ONLY a JSON array of exercises in this exact format:
[
  {
    "sentence": "Eu _____ português todos os dias.",
    "correctAnswer": "estudo",
    "topic": "verbos",
    "level": "A1",
    "hint": {
      "infinitive": "estudar",
      "person": "primeira pessoa singular",
      "form": "presente do indicativo"
    },
    "multipleChoiceOptions": ["estudo", "estudas", "estuda", "estudamos"],
    "explanations": {
      "pt": "Primeira pessoa do singular do verbo 'estudar' no presente do indicativo.",
      "en": "First person singular of the verb 'to study' in the present indicative.",
      "uk": "Перша особа однини дієслова 'вивчати' в теперішньому часі."
    }
  }
]

Focus on practical, everyday Portuguese usage appropriate for the specified levels.`;

async function generateExercisesHandler(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { topics, levels, count } = await parseRequestBody<GenerateExercisesRequest>(request);

  // Validate required fields
  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return createApiError('Topics array is required and must not be empty', 400);
  }

  if (!levels || !Array.isArray(levels) || levels.length === 0) {
    return createApiError('Levels array is required and must not be empty', 400);
  }

  if (!count || typeof count !== 'number' || count < 1 || count > 20) {
    return createApiError('Count must be a number between 1 and 20', 400);
  }

  // Validate levels
  const validLevels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const invalidLevels = levels.filter(level => !validLevels.includes(level));
  if (invalidLevels.length > 0) {
    return createApiError(`Invalid levels: ${invalidLevels.join(', ')}. Valid levels are: ${validLevels.join(', ')}`, 400);
  }

  try {
    // Initialize databases
    await UserDatabase.initializeTables();
    await ExerciseDatabase.initializeTables();

    // Get Claude API key
    const apiKey = await UserDatabase.getClaudeApiKey();
    if (!apiKey) {
      return createApiError('Claude API key not configured. Please configure it in admin settings.', 500);
    }

    // Prepare the prompt
    const prompt = EXERCISE_GENERATION_PROMPT
      .replace('{TOPICS}', topics.join(', '))
      .replace('{LEVELS}', levels.join(', '))
      .replace('{COUNT}', count.toString());

    console.log('🤖 [ADMIN] Generating exercises with Claude API...');
    
    // Call Claude API
    const responseText = await callClaudeApi(apiKey, prompt, 4000);
    
    // Extract JSON from response
    const jsonString = extractJsonFromClaudeResponse(responseText);
    let exercises;
    
    try {
      exercises = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('🤖 [ADMIN] Failed to parse Claude response as JSON:', parseError);
      return createApiError('Failed to parse generated exercises. Please try again.', 500);
    }

    // Validate exercises structure
    if (!Array.isArray(exercises)) {
      return createApiError('Generated response is not an array of exercises', 500);
    }

    // Filter out any exercises that don't have required fields
    const validExercises = exercises.filter(ex => 
      ex.sentence && 
      ex.correctAnswer && 
      ex.topic && 
      ex.level &&
      Array.isArray(ex.multipleChoiceOptions) &&
      ex.explanations?.pt &&
      ex.explanations?.en &&
      ex.explanations?.uk
    );

    if (validExercises.length === 0) {
      return createApiError('No valid exercises were generated. Please try again.', 500);
    }

    console.log(`🤖 [ADMIN] Generated ${validExercises.length} valid exercises`);

    // Check for duplicates and save to database
    const savedExercises = [];
    let duplicateCount = 0;

    for (const exercise of validExercises) {
      const exists = await ExerciseDatabase.exerciseExists(
        exercise.sentence,
        exercise.correctAnswer,
        exercise.topic,
        exercise.level
      );

      if (!exists) {
        savedExercises.push(exercise);
      } else {
        duplicateCount++;
      }
    }

    // Save new exercises to database
    let dbExercises = [];
    if (savedExercises.length > 0) {
      dbExercises = await ExerciseDatabase.saveBatchExercises(savedExercises);
    }

    return createApiResponse({
      message: 'Exercises generated successfully',
      generated: {
        total: validExercises.length,
        saved: savedExercises.length,
        duplicates: duplicateCount
      },
      exercises: dbExercises.map(ex => ({
        id: ex.id,
        sentence: ex.sentence,
        correctAnswer: ex.correct_answer,
        topic: ex.topic,
        level: ex.level,
        multipleChoiceOptions: ex.multiple_choice_options,
        explanations: {
          pt: ex.explanation_pt,
          en: ex.explanation_en,
          uk: ex.explanation_uk
        }
      }))
    });

  } catch (error) {
    console.error('🤖 [ADMIN] Exercise generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return createApiError('Invalid Claude API key or API error', 500);
      }
      if (error.message.includes('rate limit')) {
        return createApiError('API rate limit exceeded. Please try again later.', 429);
      }
    }
    
    throw error;
  }
}

export const POST = withErrorHandling(generateExercisesHandler);