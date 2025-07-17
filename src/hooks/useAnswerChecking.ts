import { useCallback } from 'react';
import type { CheckAnswerRequest, CheckAnswerResponse } from '@/types/api';

interface UseAnswerCheckingProps {
  setFeedback: (feedback: { isCorrect: boolean; explanation: string }) => void;
  setShowAnswer: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  addIncorrectAnswer: (answer: string) => void;
}

export function useAnswerChecking({
  setFeedback,
  setShowAnswer,
  setIsLoading,
  addIncorrectAnswer
}: UseAnswerCheckingProps) {
  
  const checkAnswer = useCallback(async (request: CheckAnswerRequest) => {
    if (!request.exercise || !request.userAnswer) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      const result: CheckAnswerResponse = await response.json();
      setFeedback(result);
      setShowAnswer(true);

      if (!result.isCorrect) {
        addIncorrectAnswer(request.exercise.correctAnswer);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setFeedback, setShowAnswer, setIsLoading, addIncorrectAnswer]);

  return { checkAnswer };
}