// import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api-utils';

async function getUserProgressHandler(/* _request: NextRequest */) {
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
        last_login: user.last_login,
        created_at: user.created_at,
        email_verified: user.email_verified,
        is_active: user.is_active
      }
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getUserProgressHandler);