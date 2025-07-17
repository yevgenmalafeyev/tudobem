import { useState, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';

export type LearningMode = 'input' | 'multiple-choice';

export function useLearning() {
  const { 
    currentExercise, 
    setCurrentExercise, 
    addIncorrectAnswer,
    configuration 
  } = useStore();
  
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [learningMode, setLearningMode] = useState<LearningMode>('input');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setUserAnswer('');
    setSelectedOption('');
    setMultipleChoiceOptions([]);
    setFeedback(null);
    setShowAnswer(false);
  }, []);

  const getCurrentAnswer = useCallback(() => {
    return learningMode === 'input' ? userAnswer.trim() : selectedOption;
  }, [learningMode, userAnswer, selectedOption]);

  const hasValidAnswer = useCallback(() => {
    const answer = getCurrentAnswer();
    return Boolean(answer);
  }, [getCurrentAnswer]);

  const focusInput = useCallback(() => {
    if (learningMode === 'input') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [learningMode]);

  return {
    // State
    userAnswer,
    selectedOption,
    multipleChoiceOptions,
    learningMode,
    feedback,
    isLoading,
    showAnswer,
    inputRef,
    currentExercise,
    configuration,
    
    // Actions
    setUserAnswer,
    setSelectedOption,
    setMultipleChoiceOptions,
    setLearningMode,
    setFeedback,
    setIsLoading,
    setShowAnswer,
    setCurrentExercise,
    addIncorrectAnswer,
    resetState,
    getCurrentAnswer,
    hasValidAnswer,
    focusInput
  };
}