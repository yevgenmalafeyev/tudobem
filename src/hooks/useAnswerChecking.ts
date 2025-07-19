import { useCallback } from 'react';
import type { CheckAnswerRequest } from '@/types/api';

interface UseAnswerCheckingProps {
  setFeedback: (feedback: { isCorrect: boolean; explanation: string }) => void;
  setShowAnswer: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  addIncorrectAnswer: (answer: string) => void;
}

/**
 * Local answer validation using simple string comparison
 */
function validateAnswerLocally(userAnswer: string, correctAnswer: string, explanationLanguage: string = 'pt') {
  const normalizedUser = userAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();
  const isCorrect = normalizedUser === normalizedCorrect;
  
  // Localized feedback messages
  const messages = {
    pt: {
      correct: 'Correto! Muito bem.',
      incorrect: `Incorreto. A resposta correta é "${correctAnswer}".`
    },
    en: {
      correct: 'Correct! Well done.',
      incorrect: `Incorrect. The correct answer is "${correctAnswer}".`
    },
    uk: {
      correct: 'Правильно! Молодець.',
      incorrect: `Неправильно. Правильна відповідь: "${correctAnswer}".`
    }
  };
  
  const lang = explanationLanguage as keyof typeof messages;
  const langMessages = messages[lang] || messages.pt;
  
  return {
    isCorrect,
    explanation: isCorrect ? langMessages.correct : langMessages.incorrect
  };
}

export function useAnswerChecking({
  setFeedback,
  setShowAnswer,
  setIsLoading,
  addIncorrectAnswer
}: UseAnswerCheckingProps) {
  
  const checkAnswer = useCallback(async (request: CheckAnswerRequest) => {
    if (!request.exercise || !request.userAnswer) return;

    // ⚡ INSTANT LOCAL VALIDATION - No API calls needed
    setIsLoading(true);
    
    try {
      // Use simple case-insensitive string comparison
      const feedback = validateAnswerLocally(
        request.userAnswer, 
        request.exercise.correctAnswer,
        request.explanationLanguage || 'pt'
      );
      
      // Instant feedback
      setFeedback(feedback);
      setShowAnswer(true);

      if (!feedback.isCorrect) {
        addIncorrectAnswer(request.exercise.correctAnswer);
      }
      
    } catch (error) {
      console.error('Error checking answer locally:', error);
      // Fallback to simple comparison if anything fails
      const isCorrect = request.userAnswer.toLowerCase().trim() === 
        request.exercise.correctAnswer.toLowerCase().trim();
      
      setFeedback({
        isCorrect,
        explanation: isCorrect ? 'Correto!' : `Incorreto. A resposta correta é "${request.exercise.correctAnswer}".`
      });
      setShowAnswer(true);
      
      if (!isCorrect) {
        addIncorrectAnswer(request.exercise.correctAnswer);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setFeedback, setShowAnswer, setIsLoading, addIncorrectAnswer]);

  return { checkAnswer };
}