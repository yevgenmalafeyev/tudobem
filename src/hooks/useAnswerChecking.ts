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
  
  // Function to record attempt for logged-in users
  const recordAttempt = useCallback(async (
    exerciseId: string,
    exerciseLevel: string,
    exerciseTopic: string,
    isCorrect: boolean,
    userAnswer: string
  ) => {
    try {
      const response = await fetch('/api/progress/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          exerciseLevel,
          exerciseTopic,
          isCorrect,
          userAnswer
        }),
        credentials: 'include' // Include session cookie
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Attempt recorded successfully:', result.attempt);
      } else if (response.status === 401) {
        // User not logged in - skip recording
        console.log('📊 User not logged in - skipping attempt recording');
      } else {
        console.warn('Failed to record attempt:', response.status);
      }
    } catch (error) {
      // Don't fail answer checking if recording fails
      console.warn('Error recording attempt:', error);
    }
  }, []);
  
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
        addIncorrectAnswer(request.userAnswer);
      }

      // Record attempt for logged-in users (async, non-blocking)
      if (request.exercise.id && request.exercise.level && request.exercise.topic) {
        recordAttempt(
          request.exercise.id,
          request.exercise.level,
          request.exercise.topic,
          feedback.isCorrect,
          request.userAnswer
        ).catch(console.warn); // Log but don't fail
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
        addIncorrectAnswer(request.userAnswer);
      }

      // Record attempt even in fallback case
      if (request.exercise.id && request.exercise.level && request.exercise.topic) {
        recordAttempt(
          request.exercise.id,
          request.exercise.level,
          request.exercise.topic,
          isCorrect,
          request.userAnswer
        ).catch(console.warn); // Log but don't fail
      }
    } finally {
      setIsLoading(false);
    }
  }, [setFeedback, setShowAnswer, setIsLoading, addIncorrectAnswer, recordAttempt]);

  return { checkAnswer };
}