import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, withErrorHandling } from '@/lib/api-utils';

async function logoutHandler() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (sessionToken) {
      // Remove session from database
      await UserDatabase.logoutUser(sessionToken);
    }

    // Clear the session cookie
    cookieStore.delete('session-token');
    
    return createApiResponse({
      message: 'Logout successful'
    });
  } catch {
    // Even if database logout fails, clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete('session-token');
    
    return createApiResponse({
      message: 'Logout completed (with warnings)'
    });
  }
}

export const POST = withErrorHandling(logoutHandler);
export const GET = withErrorHandling(logoutHandler); // Allow GET for convenience