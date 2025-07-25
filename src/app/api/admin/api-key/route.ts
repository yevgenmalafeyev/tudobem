import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling, requireAdminAuth } from '@/lib/api-utils';

interface UpdateApiKeyRequest {
  apiKey: string;
}

async function getApiKeyHandler() {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Initialize database if needed
    await UserDatabase.initializeTables();
    
    const apiKey = await UserDatabase.getClaudeApiKey();
    
    return createApiResponse({
      apiKey,
      hasApiKey: !!apiKey
    });
  } catch (error) {
    throw error;
  }
}

async function updateApiKeyHandler(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { apiKey } = await parseRequestBody<UpdateApiKeyRequest>(request);

  // Validate API key format
  if (!apiKey || typeof apiKey !== 'string') {
    return createApiError('Valid API key is required', 400);
  }

  // Basic validation for Claude API key format
  if (!apiKey.startsWith('sk-ant-api03-')) {
    return createApiError('Invalid Claude API key format', 400);
  }

  try {
    // Initialize database if needed
    await UserDatabase.initializeTables();
    
    await UserDatabase.setClaudeApiKey(apiKey);
    
    return createApiResponse({
      message: 'Claude API key updated successfully',
      hasApiKey: true
    });
  } catch (error) {
    throw error;
  }
}

export const GET = withErrorHandling(getApiKeyHandler);
export const POST = withErrorHandling(updateApiKeyHandler);
export const PUT = withErrorHandling(updateApiKeyHandler);