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
    return await request.json();
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

export function extractJsonFromClaudeResponse(responseText: string): string {
  const startIndex = responseText.indexOf('{');
  if (startIndex === -1) {
    throw new Error('No JSON found in Claude response');
  }
  
  let braceCount = 0;
  let endIndex = startIndex;
  
  for (let i = startIndex; i < responseText.length; i++) {
    if (responseText[i] === '{') {
      braceCount++;
    } else if (responseText[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  return responseText.substring(startIndex, endIndex + 1);
}

export async function callClaudeApi(
  apiKey: string,
  prompt: string,
  maxTokens: number = ANTHROPIC_CONFIG.maxTokens.exercise,
  model: string = ANTHROPIC_CONFIG.model
): Promise<string> {
  const anthropic = new Anthropic({ apiKey });
  
  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
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