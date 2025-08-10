import { NextRequest } from 'next/server';
import { createApiResponse, createApiError, requireAdminAuth, withErrorHandling } from '@/lib/api-utils';
import { enhanceAllHints, getExercisesNeedingHintAnalysis } from '@/scripts/enhance-hints';

export const POST = withErrorHandling(async (_request: NextRequest) => {
  console.log('🚀 [DEBUG] Hint enhancement API endpoint called');
  
  // Require admin authentication
  const authResult = await requireAdminAuth();
  if (authResult) {
    return authResult; // Returns error response if not authenticated
  }
  
  try {
    console.log('🔍 [DEBUG] Starting hint enhancement process...');
    
    // Get preview of exercises that need analysis
    const exercisesNeedingAnalysis = await getExercisesNeedingHintAnalysis();
    
    console.log(`📊 [DEBUG] Found ${exercisesNeedingAnalysis.length} exercises needing hint analysis`);
    
    if (exercisesNeedingAnalysis.length === 0) {
      return createApiResponse({
        message: 'All exercises already have sufficient hint data',
        exercisesAnalyzed: 0,
        hintsAdded: 0,
        exercisesWithSufficientHints: 0
      });
    }
    
    // Run the enhancement process
    await enhanceAllHints();
    
    // Get updated count to see how many were actually updated
    const remainingExercises = await getExercisesNeedingHintAnalysis();
    const hintsAdded = exercisesNeedingAnalysis.length - remainingExercises.length;
    
    console.log('✅ [DEBUG] Hint enhancement completed successfully');
    
    return createApiResponse({
      message: 'Hint enhancement completed successfully',
      exercisesAnalyzed: exercisesNeedingAnalysis.length,
      hintsAdded: hintsAdded,
      exercisesWithSufficientHints: remainingExercises.length
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Error in hint enhancement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createApiError(`Hint enhancement failed: ${errorMessage}`, 500);
  }
});

export const GET = withErrorHandling(async (_request: NextRequest) => {
  console.log('🔍 [DEBUG] Getting hint enhancement preview');
  
  // Require admin authentication
  const authResult = await requireAdminAuth();
  if (authResult) {
    return authResult;
  }
  
  try {
    // Get preview of exercises that need analysis
    const exercisesNeedingAnalysis = await getExercisesNeedingHintAnalysis();
    
    // Return summary information
    const preview = {
      totalExercisesNeedingAnalysis: exercisesNeedingAnalysis.length,
      sampleExercises: exercisesNeedingAnalysis.slice(0, 5).map(ex => ({
        id: ex.id,
        sentence: ex.sentence,
        correctAnswer: ex.correctAnswer,
        level: ex.level,
        topic: ex.topic,
        currentHint: ex.currentHint
      }))
    };
    
    return createApiResponse(preview);
    
  } catch (error) {
    console.error('❌ [DEBUG] Error getting hint enhancement preview:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createApiError(`Failed to get preview: ${errorMessage}`, 500);
  }
});