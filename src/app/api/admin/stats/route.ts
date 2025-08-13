// import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { ExerciseDatabase } from '@/lib/database';
import { initializeProblemReportsTable } from '@/lib/problemReportDatabase';
import { createApiResponse, withErrorHandling, requireAdminAuth } from '@/lib/api-utils';

async function getAdminStatsHandler(/* _request: NextRequest */) {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Initialize databases if needed
    await UserDatabase.initializeTables();
    await ExerciseDatabase.initializeTables();
    await initializeProblemReportsTable();
    
    // Get exercise statistics in the format expected by frontend
    const exerciseStats = await ExerciseDatabase.getStats();
    
    // Return the stats directly in the format expected by QuestionStats component
    return createApiResponse({
      total: exerciseStats.total,
      byLevel: exerciseStats.byLevel,
      byTopic: exerciseStats.byTopic
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getAdminStatsHandler);