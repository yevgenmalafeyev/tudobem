import { NextRequest } from 'next/server';
import { 
  parseRequestBody, 
  createApiResponse, 
  withErrorHandling,
  FALLBACK_MESSAGES,
  SupportedLanguage
} from '@/lib/api-utils';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { exercise, userAnswer, explanationLanguage = 'pt' } = await parseRequestBody<{
    exercise: {
      sentence: string;
      correctAnswer: string;
      level: string;
      topic: string;
      hint?: Record<string, string>;
    };
    userAnswer: string;
    explanationLanguage?: SupportedLanguage;
  }>(request);
  
  // ⚡ OPTIMIZED: Always use simple case-insensitive comparison
  const isCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
  
  // Use localized fallback messages for consistent feedback
  const lang = explanationLanguage as SupportedLanguage;
  const messages = FALLBACK_MESSAGES[lang];
  const explanation = isCorrect 
    ? messages.correct 
    : messages.incorrect(exercise.correctAnswer);
  
  // Return instant result - no API calls needed
  return createApiResponse({
    isCorrect,
    explanation
  });
});