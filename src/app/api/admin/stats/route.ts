import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { ExerciseDatabase } from '@/lib/database';
import { createApiResponse, withErrorHandling, requireAdminAuth } from '@/lib/api-utils';

async function getAdminStatsHandler(request: NextRequest) {
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
        users: userStats.userStats,
        system: {
          totalExercises: userStats.total,
          exercisesByLevel: userStats.byLevel
        }
      },
      summary: {
        totalUsers: userStats.userStats.totalUsers,
        activeUsers: userStats.userStats.activeUsers,
        totalExercises: userStats.total,
        totalAttempts: userStats.userStats.totalAttempts,
        overallAccuracy: userStats.userStats.totalAttempts > 0 
          ? ((userStats.userStats.correctAttempts / userStats.userStats.totalAttempts) * 100).toFixed(2)
          : '0'
      }
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getAdminStatsHandler);