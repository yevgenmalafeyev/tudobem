import { NextRequest } from 'next/server';
import { 
  parseRequestBody, 
  createApiResponse, 
  callClaudeApi,
  withErrorHandling,
  FALLBACK_MESSAGES,
  SupportedLanguage
} from '@/lib/api-utils';
import { generateAnswerCheckingPrompt } from '@/utils/answer-checking-prompts';

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { exercise, userAnswer, claudeApiKey, explanationLanguage = 'pt' } = await parseRequestBody<{
    exercise: {
      sentence: string;
      correctAnswer: string;
      level: string;
      topic: string;
      hint?: Record<string, string>;
    };
    userAnswer: string;
    claudeApiKey?: string;
    explanationLanguage?: SupportedLanguage;
  }>(request);
  
  // Basic check without AI
  const isBasicallyCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
  
  if (!claudeApiKey) {
    const lang = explanationLanguage as SupportedLanguage;
    const messages = FALLBACK_MESSAGES[lang];
    const explanation = isBasicallyCorrect 
      ? messages.correct 
      : messages.incorrect(exercise.correctAnswer);
    
    return createApiResponse({
      isCorrect: isBasicallyCorrect,
      explanation
    });
  }

  // Enhanced check with Claude AI
  const prompt = generateAnswerCheckingPrompt({
    exercise,
    userAnswer,
    explanationLanguage
  });

  try {
    const responseText = await callClaudeApi(claudeApiKey, prompt, 800);
    const result = JSON.parse(responseText);
    return createApiResponse(result);
  } catch (error) {
    console.error('Error checking answer:', error);
    
    // Fallback to basic check
    const lang = explanationLanguage as SupportedLanguage;
    const messages = FALLBACK_MESSAGES[lang];
    const explanation = isBasicallyCorrect 
      ? messages.correct 
      : messages.incorrect(exercise.correctAnswer);
    
    return createApiResponse({
      isCorrect: isBasicallyCorrect,
      explanation
    });
  }
});