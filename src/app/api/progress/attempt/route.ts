import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

interface AttemptRequest {
  exerciseId: string;
  isCorrect: boolean;
  userAnswer: string;
}

async function recordAttemptHandler(request: NextRequest) {
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

  const { exerciseId, isCorrect, userAnswer } = await parseRequestBody<AttemptRequest>(request);

  // Validate required fields
  if (!exerciseId || typeof isCorrect !== 'boolean' || !userAnswer) {
    return createApiError('exerciseId, isCorrect, and userAnswer are required', 400);
  }

  try {
    // Record the attempt
    const attempt = await UserDatabase.recordAttempt(
      user.id,
      exerciseId,
      isCorrect,
      userAnswer
    );

    // Get updated user progress
    const progress = await UserDatabase.getUserProgress(user.id);
    
    return createApiResponse({
      attempt: {
        id: attempt.id,
        exerciseId: attempt.exercise_id,
        isCorrect: attempt.is_correct,
        userAnswer: attempt.user_answer,
        attemptedAt: attempt.attempted_at
      },
      progress,
      message: 'Attempt recorded successfully'
    });
  } catch (error) {
    throw error;
  }
}

export const POST = withErrorHandling(recordAttemptHandler);