import { NextRequest } from 'next/server';
import { 
  parseRequestBody, 
  createApiResponse, 
  createApiError, 
  checkAdminAuthentication,
  withErrorHandling 
} from '@/lib/api-utils';
import { 
  ADMIN_CREDENTIALS, 
  setAdminSession, 
  clearAdminSession 
} from '@/lib/admin-middleware';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { username, password } = await parseRequestBody<{
    username: string;
    password: string;
  }>(request);
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    await setAdminSession();
    return createApiResponse({ success: true });
  } else {
    return createApiError('Invalid credentials', 401);
  }
});

export const GET = withErrorHandling(async () => {
  const authenticated = await checkAdminAuthentication();
  return createApiResponse({ authenticated });
});

export const DELETE = withErrorHandling(async () => {
  await clearAdminSession();
  return createApiResponse({ success: true });
});