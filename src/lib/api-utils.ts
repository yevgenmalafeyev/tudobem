import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_CONFIG } from '@/constants';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function createApiResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data });
}

export function createApiError(message: string, status: number = 500): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function parseRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }
    
    const body = await request.text();
    if (!body || body.trim() === '') {
      throw new Error('Request body cannot be empty');
    }
    
    return JSON.parse(body);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid JSON in request body: ${error.message}`);
    }
    throw new Error('Invalid JSON in request body');
  }
}

export function extractJsonFromClaudeResponse(responseText: string): string {
  console.log('🔍 [DEBUG] Extracting JSON from response length:', responseText.length);
  console.log('🔍 [DEBUG] Response start:', responseText.substring(0, 200));
  console.log('🔍 [DEBUG] Response end:', responseText.substring(responseText.length - 200));
  
  // Look for array first, then object
  const arrayStartIndex = responseText.indexOf('[');
  const objectStartIndex = responseText.indexOf('{');
  
  console.log('🔍 [DEBUG] Array start index:', arrayStartIndex);
  console.log('🔍 [DEBUG] Object start index:', objectStartIndex);
  
  // Determine which JSON structure appears first (or if only one exists)
  let startIndex: number;
  let startChar: string;
  let endChar: string;
  
  if (arrayStartIndex !== -1 && (objectStartIndex === -1 || arrayStartIndex < objectStartIndex)) {
    // Array comes first or is the only JSON structure
    startIndex = arrayStartIndex;
    startChar = '[';
    endChar = ']';
    console.log('🔍 [DEBUG] Using array extraction');
  } else if (objectStartIndex !== -1) {
    // Object comes first or is the only JSON structure
    startIndex = objectStartIndex;
    startChar = '{';
    endChar = '}';
    console.log('🔍 [DEBUG] Using object extraction');
  } else {
    throw new Error('No JSON found in Claude response');
  }
  
  let bracketCount = 0;
  let endIndex = startIndex;
  
  for (let i = startIndex; i < responseText.length; i++) {
    if (responseText[i] === startChar) {
      bracketCount++;
    } else if (responseText[i] === endChar) {
      bracketCount--;
      if (bracketCount === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  // If we didn't find a closing bracket, the response might be truncated
  if (endIndex === startIndex) {
    console.log('🔍 [DEBUG] No closing bracket found, response might be truncated');
    console.log('🔍 [DEBUG] Full response:', responseText);
    
    // Try to find the last valid JSON structure in the response
    const lastValidJson = responseText.lastIndexOf('}');
    if (lastValidJson > startIndex) {
      endIndex = lastValidJson;
      console.log('🔍 [DEBUG] Using last } as end point at index:', endIndex);
      
      // Add closing bracket if we're extracting an array
      if (startChar === '[') {
        const extracted = responseText.substring(startIndex, endIndex + 1) + ']';
        console.log('🔍 [DEBUG] Reconstructed JSON with closing bracket');
        return extracted;
      }
    } else {
      throw new Error('Response appears to be truncated - no valid JSON structure found');
    }
  }
  
  const extracted = responseText.substring(startIndex, endIndex + 1);
  console.log('🔍 [DEBUG] Extracted JSON length:', extracted.length);
  console.log('🔍 [DEBUG] Extracted JSON start:', extracted.substring(0, 200));
  console.log('🔍 [DEBUG] Extracted JSON end:', extracted.substring(extracted.length - 200));
  
  return extracted;
}

export async function callClaudeApi(
  apiKey: string,
  prompt: string,
  maxTokens: number = ANTHROPIC_CONFIG.maxTokens.exercise,
  model: string = ANTHROPIC_CONFIG.model
): Promise<string> {
  try {
    const anthropic = new Anthropic({ apiKey });
    
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    });
    
    if (message.content[0]?.type === 'text') {
      return message.content[0].text;
    } else {
      console.error('🤖 [CLAUDE_API] ERROR: No text content in response');
      throw new Error('No text content in Claude API response');
    }
    
  } catch (error) {
    console.error('🤖 [CLAUDE_API] ERROR: API call failed:', error);
    console.error('🤖 [CLAUDE_API] Error type:', error?.constructor?.name);
    console.error('🤖 [CLAUDE_API] Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && 'status' in error) {
      console.error('🤖 [CLAUDE_API] HTTP Status:', (error as Error & { status?: number }).status);
    }
    
    throw error;
  }
}

export async function checkAdminAuthentication(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin-session');
    return adminSession?.value === 'authenticated';
  } catch (error) {
    console.error('Admin auth check error:', error);
    return false;
  }
}

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const isAuthenticated = await checkAdminAuthentication();
  
  if (!isAuthenticated) {
    return createApiError('Unauthorized', 401);
  }
  
  return null;
}

export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      return createApiError(message, 500);
    }
  };
}

export const FALLBACK_MESSAGES = {
  pt: {
    correct: 'Correto! Muito bem.',
    incorrect: (answer: string) => `Incorreto. A resposta correta é "${answer}".`,
    loadingError: 'Erro ao carregar. Tente novamente.',
    noExercises: 'Não há exercícios disponíveis para os níveis e tópicos selecionados.'
  },
  en: {
    correct: 'Correct! Well done.',
    incorrect: (answer: string) => `Incorrect. The correct answer is "${answer}".`,
    loadingError: 'Loading error. Please try again.',
    noExercises: 'No exercises available for selected levels and topics.'
  },
  uk: {
    correct: 'Правильно! Молодець.',
    incorrect: (answer: string) => `Неправильно. Правильна відповідь "${answer}".`,
    loadingError: 'Помилка завантаження. Спробуйте знову.',
    noExercises: 'Немає доступних вправ для обраних рівнів і тем.'
  }
};

export type SupportedLanguage = keyof typeof FALLBACK_MESSAGES;