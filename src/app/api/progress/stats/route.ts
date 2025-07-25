import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api-utils';

async function getUserProgressHandler() {
  // Verify user session
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session-token')?.value;

  if (!sessionToken) {
    return createApiError('Authentication required', 401);
  }

  const user = await UserDatabase.verifyToken(sessionToken);
  if (!user) {
    cookieStore.delete('session-token');
    return createApiError('Invalid or expired session', 401);
  }

  try {
    // Get user progress statistics
    const progress = await UserDatabase.getUserProgress(user.id);
    
    // Get correctly answered exercises for filtering
    const correctlyAnswered = await UserDatabase.getCorrectlyAnsweredExercises(user.id);
    
    return createApiResponse({
      progress,
      correctlyAnsweredExercises: correctlyAnswered,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getUserProgressHandler);