import { useCallback } from 'react';
import type { LearningMode } from './useLearning';
import type { Exercise, UserConfiguration } from '@/types';
import { useStore } from '@/store/useStore';

interface UseExerciseGenerationProps {
  configuration: UserConfiguration;
  learningMode: LearningMode;
  setCurrentExercise: (exercise: Exercise) => void;
  setMultipleChoiceOptions: (options: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  resetState: () => void;
  focusInput: () => void;
  preGeneratedExercise?: Exercise | null;
  onExerciseGenerated?: (exercise: Exercise) => void;
}

export function useExerciseGeneration({
  configuration,
  learningMode,
  setCurrentExercise,
  setMultipleChoiceOptions,
  setIsLoading,
  resetState,
  focusInput,
  preGeneratedExercise,
  onExerciseGenerated
}: UseExerciseGenerationProps) {
  const { progress } = useStore();
  
  const generateMultipleChoiceOptions = useCallback(async (exercise: Exercise) => {
    if (learningMode !== 'multiple-choice') return;
    
    try {
      const response = await fetch('/api/generate-multiple-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise,
          claudeApiKey: configuration.claudeApiKey,
          explanationLanguage: configuration.appLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate multiple choice options');
      }

      const result = await response.json();
      setMultipleChoiceOptions(result.options);
    } catch (error) {
      console.error('Error generating multiple choice options:', error);
      // Fallback to basic options using the service
      const { generateBasicDistractors, processMultipleChoiceOptions } = await import('@/services/multipleChoiceService');
      const distractors = generateBasicDistractors(exercise.correctAnswer);
      const options = processMultipleChoiceOptions(exercise.correctAnswer, distractors);
      setMultipleChoiceOptions(options);
    }
  }, [learningMode, configuration.claudeApiKey, configuration.appLanguage, setMultipleChoiceOptions]);

  const generateNewExercise = useCallback(async () => {
    setIsLoading(true);
    try {
      let exercise;
      
      // Use pre-generated exercise if available
      if (preGeneratedExercise) {
        exercise = preGeneratedExercise;
        console.log('Using pre-generated exercise');
      } else {
        // Generate fresh exercise
        console.log('Generating fresh exercise');
        const response = await fetch('/api/generate-exercise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            levels: configuration.selectedLevels,
            topics: configuration.selectedTopics,
            claudeApiKey: configuration.claudeApiKey,
            masteredWords: progress.masteredWords
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate exercise');
        }

        exercise = await response.json();
      }

      setCurrentExercise(exercise);
      resetState();
      
      // Generate multiple choice options if in multiple choice mode
      if (learningMode === 'multiple-choice') {
        await generateMultipleChoiceOptions(exercise);
      }
      
      // Notify parent about exercise generation
      if (onExerciseGenerated) {
        onExerciseGenerated(exercise);
      }
      
      // Focus input field after exercise is loaded (only in input mode)
      focusInput();
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    configuration.selectedLevels,
    configuration.selectedTopics,
    configuration.claudeApiKey,
    progress.masteredWords,
    learningMode,
    generateMultipleChoiceOptions,
    setCurrentExercise,
    setIsLoading,
    resetState,
    focusInput,
    preGeneratedExercise,
    onExerciseGenerated
  ]);

  return {
    generateNewExercise,
    generateMultipleChoiceOptions
  };
}