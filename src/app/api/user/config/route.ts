import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

// GET - Load user configuration
async function getConfigHandler() {
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
    const config = await UserDatabase.getUserConfiguration(user.id);
    
    if (!config) {
      // Return default configuration if none found
      return createApiResponse({
        config: {
          appLanguage: 'pt',
          explanationLanguage: 'pt',
          learningMode: 'typing',
          levelsEnabled: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
          topicsEnabled: []
        }
      });
    }

    return createApiResponse({ config });
  } catch (error) {
    console.error('Error loading user configuration:', error);
    return createApiError('Failed to load configuration', 500);
  }
}

// POST - Save user configuration
async function saveConfigHandler(request: NextRequest) {
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
    const { config } = await parseRequestBody<{
      config: {
        appLanguage: string;
        explanationLanguage: string;
        learningMode: string;
        levelsEnabled: string[];
        topicsEnabled: string[];
      };
    }>(request);

    if (!config) {
      return createApiError('Configuration data is required', 400);
    }

    const success = await UserDatabase.saveUserConfiguration(user.id, config);
    
    if (!success) {
      return createApiError('Failed to save configuration', 500);
    }

    return createApiResponse({ 
      message: 'Configuration saved successfully',
      config
    });
  } catch (error) {
    console.error('Error saving user configuration:', error);
    return createApiError('Failed to save configuration', 500);
  }
}

export const GET = withErrorHandling(getConfigHandler);
export const POST = withErrorHandling(saveConfigHandler);