import { UserDatabase } from '@/lib/userDatabase';
import { ExerciseDatabase } from '@/lib/database';
import { createApiResponse, withErrorHandling, requireAdminAuth } from '@/lib/api-utils';

async function getAdminStatsHandler() {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Initialize databases if needed
    await UserDatabase.initializeTables();
    await ExerciseDatabase.initializeTables();
    
    // Get database statistics
    const userStats = await UserDatabase.getDatabaseStats();
    const exerciseStats = await ExerciseDatabase.getStats();
    
    return createApiResponse({
      database: {
        exercises: exerciseStats,
        users: userStats
      },
      summary: {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        totalExercises: userStats.totalExercises,
        totalAttempts: userStats.totalAttempts,
        overallAccuracy: userStats.averageAccuracy
      }
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getAdminStatsHandler);