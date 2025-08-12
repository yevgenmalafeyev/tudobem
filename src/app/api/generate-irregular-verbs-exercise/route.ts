import { NextRequest } from 'next/server';
import { 
  createApiResponse, 
  createApiError, 
  parseRequestBody, 
  withErrorHandling 
} from '@/lib/api-utils';
import { IrregularVerbsDatabase } from '@/lib/irregularVerbsDatabase';
import type { VerbTense } from '@/types/irregular-verbs';

interface GenerateIrregularVerbExerciseRequest {
  enabledTenses: VerbTense[];
  excludeRecentVerbs?: string[];
  includeMultipleChoice?: boolean;
  sessionId?: string;
  includeVos?: boolean;
}

async function generateIrregularVerbExerciseHandler(request: NextRequest) {
  try {
    const { 
      enabledTenses, 
      excludeRecentVerbs = [], 
      includeMultipleChoice = false,
      sessionId,
      includeVos = false
    } = await parseRequestBody<GenerateIrregularVerbExerciseRequest>(request);

    // Validate required fields
    if (!enabledTenses || enabledTenses.length === 0) {
      return createApiError('At least one tense must be enabled', 400);
    }

    // Initialize database
    await IrregularVerbsDatabase.initializeTables();

    // Generate exercise with retry logic
    let exercise = null;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!exercise && attempts < maxAttempts) {
      exercise = await IrregularVerbsDatabase.generateExercise(
        enabledTenses, 
        excludeRecentVerbs,
        includeVos
      );
      attempts++;
      
      // If we can't find an exercise with recent exclusions, try without them
      if (!exercise && attempts === 3 && excludeRecentVerbs.length > 0) {
        exercise = await IrregularVerbsDatabase.generateExercise(
          enabledTenses, 
          [], // Clear exclusions
          includeVos
        );
      }
    }

    if (!exercise) {
      return createApiError('No exercises available with current configuration', 404);
    }

    // Add multiple choice options if requested
    if (includeMultipleChoice) {
      const options = await IrregularVerbsDatabase.generateMultipleChoiceOptions(exercise, 4, includeVos);
      exercise.multipleChoiceOptions = options;
    }

    return createApiResponse({
      exercise,
      sessionId: sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        enabledTenses: enabledTenses.length,
        excludedVerbs: excludeRecentVerbs.length,
        includeMultipleChoice,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating irregular verb exercise:', error);
    return createApiError('Failed to generate exercise', 500);
  }
}

export const POST = withErrorHandling(generateIrregularVerbExerciseHandler);