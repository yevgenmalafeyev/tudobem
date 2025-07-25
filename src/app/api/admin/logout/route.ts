import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createApiResponse, withErrorHandling } from '@/lib/api-utils';

async function adminLogoutHandler(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Clear the admin session cookie
    cookieStore.delete('admin-session');
    
    return createApiResponse({
      message: 'Admin logout successful'
    });
  } catch (error) {
    // Always clear the cookie even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete('admin-session');
    
    return createApiResponse({
      message: 'Admin logout completed'
    });
  }
}

export const POST = withErrorHandling(adminLogoutHandler);
export const GET = withErrorHandling(adminLogoutHandler); // Allow GET for convenience