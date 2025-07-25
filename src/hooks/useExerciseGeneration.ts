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
      const options = result.success ? result.data.options : result.options;
      setMultipleChoiceOptions(options);
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

        const result = await response.json();
        exercise = result.success ? result.data : result;
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
      // Fallback to offline exercise
      try {
        const { getFallbackExercise } = await import('@/services/exerciseService');
        const fallbackExercise = getFallbackExercise(
          configuration.selectedLevels,
          progress.masteredWords,
          configuration.selectedTopics
        );
        
        if (fallbackExercise) {
          setCurrentExercise(fallbackExercise);
          resetState();
          
          // Generate multiple choice options if in multiple choice mode
          if (learningMode === 'multiple-choice') {
            await generateMultipleChoiceOptions(fallbackExercise);
          }
          
          // Notify parent about exercise generation
          if (onExerciseGenerated) {
            onExerciseGenerated(fallbackExercise);
          }
          
          // Focus input field after exercise is loaded (only in input mode)
          focusInput();
        } else {
          // If no fallback exercise for the exact levels/topics, try with A1 as ultimate fallback
          const ultimateFallback = getFallbackExercise(['A1'], progress.masteredWords, []);
          if (ultimateFallback) {
            setCurrentExercise(ultimateFallback);
            resetState();
            
            // Generate multiple choice options if in multiple choice mode
            if (learningMode === 'multiple-choice') {
              await generateMultipleChoiceOptions(ultimateFallback);
            }
            
            // Notify parent about exercise generation
            if (onExerciseGenerated) {
              onExerciseGenerated(ultimateFallback);
            }
            
            // Focus input field after exercise is loaded (only in input mode)
            focusInput();
          }
        }
      } catch (fallbackError) {
        console.error('Error with fallback exercise:', fallbackError);
      }
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