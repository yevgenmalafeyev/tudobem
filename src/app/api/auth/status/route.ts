import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, withErrorHandling } from '@/lib/api-utils';

/**
 * Lightweight endpoint to check authentication status without returning 401 errors
 * This prevents console errors in browser when checking if user is logged in
 */
async function getAuthStatusHandler() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (!sessionToken) {
      return createApiResponse({ 
        authenticated: false, 
        user: null 
      });
    }

    const user = await UserDatabase.verifyToken(sessionToken);
    if (!user) {
      // Clear invalid session cookie
      cookieStore.delete('session-token');
      return createApiResponse({ 
        authenticated: false, 
        user: null 
      });
    }

    return createApiResponse({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return createApiResponse({ 
      authenticated: false, 
      user: null 
    });
  }
}

export const GET = withErrorHandling(getAuthStatusHandler);