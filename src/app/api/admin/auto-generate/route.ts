import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { ExerciseDatabase } from '@/lib/database';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling, requireAdminAuth, callClaudeApi, extractJsonFromClaudeResponse } from '@/lib/api-utils';
import { LanguageLevel } from '@/types';

interface AutoGenerateRequest {
  targetCounts: {
    [level: string]: number;
  };
  topics?: string[];
}

const DEFAULT_TOPICS = [
  'verbos',
  'substantivos', 
  'adjetivos',
  'pronomes',
  'preposições',
  'artigos',
  'advérbios',
  'conjunções',
  'numerais',
  'expressões idiomáticas'
];

const AUTO_GENERATION_PROMPT = `Generate Portuguese language learning exercises to fill gaps in the database.

Current database status:
- Target level: {LEVEL}
- Current count: {CURRENT_COUNT}
- Target count: {TARGET_COUNT}
- Needed: {NEEDED_COUNT}
- Topics to focus on: {TOPICS}

Generate {NEEDED_COUNT} exercises for level {LEVEL} focusing on practical, everyday Portuguese usage.

For each exercise, create a fill-in-the-blank sentence with this structure:
- sentence: Portuguese sentence with "____" where the answer goes
- correctAnswer: The correct word/phrase to fill the blank
- topic: One of the specified topics
- level: {LEVEL}
- hint: Object with infinitive, person, and form if applicable
- multipleChoiceOptions: Array of 4 options including the correct answer
- explanations: Object with Portuguese (pt), English (en), and Ukrainian (uk) explanations

Return ONLY a JSON array of exercises. Ensure variety in topics and difficulty within the level.

Example format:
[
  {
    "sentence": "Eu _____ português todos os dias.",
    "correctAnswer": "estudo",
    "topic": "verbos",
    "level": "{LEVEL}",
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
]`;

async function autoGenerateExercisesHandler(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { targetCounts, topics = DEFAULT_TOPICS } = await parseRequestBody<AutoGenerateRequest>(request);

  // Validate required fields
  if (!targetCounts || typeof targetCounts !== 'object') {
    return createApiError('targetCounts object is required', 400);
  }

  const validLevels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const requestedLevels = Object.keys(targetCounts) as LanguageLevel[];
  
  // Validate levels
  const invalidLevels = requestedLevels.filter(level => !validLevels.includes(level));
  if (invalidLevels.length > 0) {
    return createApiError(`Invalid levels: ${invalidLevels.join(', ')}. Valid levels are: ${validLevels.join(', ')}`, 400);
  }

  // Validate target counts
  for (const [level, count] of Object.entries(targetCounts)) {
    if (typeof count !== 'number' || count < 0 || count > 1000) {
      return createApiError(`Target count for ${level} must be a number between 0 and 1000`, 400);
    }
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

    // Get current database statistics
    const stats = await ExerciseDatabase.getStats();
    const currentCounts = stats.byLevel.reduce((acc, item) => {
      acc[item.level] = item.count;
      return acc;
    }, {} as Record<string, number>);

    console.log('🤖 [AUTO-GEN] Current database counts:', currentCounts);
    console.log('🤖 [AUTO-GEN] Target counts:', targetCounts);

    const generationResults = [];
    let totalGenerated = 0;
    let totalSaved = 0;
    let totalDuplicates = 0;

    // Process each level
    for (const [level, targetCount] of Object.entries(targetCounts)) {
      const currentCount = currentCounts[level] || 0;
      const neededCount = Math.max(0, targetCount - currentCount);

      if (neededCount === 0) {
        console.log(`🤖 [AUTO-GEN] Level ${level}: Target already met (${currentCount}/${targetCount})`);
        generationResults.push({
          level,
          currentCount,
          targetCount,
          neededCount: 0,
          generated: 0,
          saved: 0,
          duplicates: 0,
          status: 'target_met'
        });
        continue;
      }

      console.log(`🤖 [AUTO-GEN] Level ${level}: Generating ${neededCount} exercises (${currentCount}/${targetCount})`);

      // Prepare the prompt for this level
      const prompt = AUTO_GENERATION_PROMPT
        .replace(/{LEVEL}/g, level)
        .replace('{CURRENT_COUNT}', currentCount.toString())
        .replace('{TARGET_COUNT}', targetCount.toString())
        .replace('{NEEDED_COUNT}', Math.min(neededCount, 10).toString()) // Limit to 10 per request
        .replace('{TOPICS}', topics.join(', '));

      try {
        // Call Claude API for this level
        const responseText = await callClaudeApi(apiKey, prompt, 4000);
        
        // Extract JSON from response
        const jsonString = extractJsonFromClaudeResponse(responseText);
        let exercises;
        
        try {
          exercises = JSON.parse(jsonString);
        } catch (parseError) {
          console.error(`🤖 [AUTO-GEN] Failed to parse response for ${level}:`, parseError);
          generationResults.push({
            level,
            currentCount,
            targetCount,
            neededCount,
            generated: 0,
            saved: 0,
            duplicates: 0,
            status: 'parse_error',
            error: 'Failed to parse generated exercises'
          });
          continue;
        }

        // Validate exercises structure
        if (!Array.isArray(exercises)) {
          console.error(`🤖 [AUTO-GEN] Response for ${level} is not an array`);
          generationResults.push({
            level,
            currentCount,
            targetCount,
            neededCount,
            generated: 0,
            saved: 0,
            duplicates: 0,
            status: 'invalid_response',
            error: 'Generated response is not an array'
          });
          continue;
        }

        // Filter valid exercises
        const validExercises = exercises.filter(ex => 
          ex.sentence && 
          ex.correctAnswer && 
          ex.topic && 
          ex.level === level &&
          Array.isArray(ex.multipleChoiceOptions) &&
          ex.explanations?.pt &&
          ex.explanations?.en &&
          ex.explanations?.uk
        );

        if (validExercises.length === 0) {
          console.error(`🤖 [AUTO-GEN] No valid exercises generated for ${level}`);
          generationResults.push({
            level,
            currentCount,
            targetCount,
            neededCount,
            generated: 0,
            saved: 0,
            duplicates: 0,
            status: 'no_valid_exercises',
            error: 'No valid exercises were generated'
          });
          continue;
        }

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

        console.log(`🤖 [AUTO-GEN] Level ${level}: Generated ${validExercises.length}, Saved ${savedExercises.length}, Duplicates ${duplicateCount}`);

        generationResults.push({
          level,
          currentCount,
          targetCount,
          neededCount,
          generated: validExercises.length,
          saved: savedExercises.length,
          duplicates: duplicateCount,
          status: 'success'
        });

        totalGenerated += validExercises.length;
        totalSaved += savedExercises.length;
        totalDuplicates += duplicateCount;

        // Add a small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (levelError) {
        console.error(`🤖 [AUTO-GEN] Error generating exercises for ${level}:`, levelError);
        generationResults.push({
          level,
          currentCount,
          targetCount,
          neededCount,
          generated: 0,
          saved: 0,
          duplicates: 0,
          status: 'api_error',
          error: levelError instanceof Error ? levelError.message : 'Unknown error'
        });
      }
    }

    return createApiResponse({
      message: 'Auto-generation completed',
      summary: {
        totalGenerated,
        totalSaved,
        totalDuplicates,
        levelsProcessed: requestedLevels.length,
        successful: generationResults.filter(r => r.status === 'success').length
      },
      results: generationResults
    });

  } catch (error) {
    console.error('🤖 [AUTO-GEN] Auto-generation error:', error);
    
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

export const POST = withErrorHandling(autoGenerateExercisesHandler);