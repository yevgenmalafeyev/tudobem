import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api-utils';

async function verifyHandler() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (!sessionToken) {
      return createApiError('No session token found', 401);
    }

    // Verify token with database
    const user = await UserDatabase.verifyToken(sessionToken);

    if (!user) {
      // Clear invalid cookie
      cookieStore.delete('session-token');
      return createApiError('Invalid or expired session', 401);
    }

    // Return user data without password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userResponse } = user;
    
    return createApiResponse({
      user: userResponse,
      valid: true
    });
  } catch {
    // Clear cookie on any error
    const cookieStore = await cookies();
    cookieStore.delete('session-token');
    
    return createApiError('Session verification failed', 401);
  }
}

export const GET = withErrorHandling(verifyHandler);
export const POST = withErrorHandling(verifyHandler); // Allow POST for convenience