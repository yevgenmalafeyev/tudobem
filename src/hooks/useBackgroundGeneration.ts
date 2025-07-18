import { useState, useCallback, useRef } from 'react';
import { Exercise } from '@/types';

interface UseBackgroundGenerationProps {
  selectedLevels: string[];
  selectedTopics: string[];
  claudeApiKey?: string;
  masteredWords: Record<string, unknown>;
  explanationLanguage?: string;
}

export function useBackgroundGeneration({
  selectedLevels,
  selectedTopics,
  claudeApiKey,
  masteredWords,
  explanationLanguage = 'pt'
}: UseBackgroundGenerationProps) {
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const generationInProgress = useRef(false);

  const generateBatchExercises = useCallback(async () => {
    if (generationInProgress.current || !claudeApiKey) return;
    
    generationInProgress.current = true;
    setIsGeneratingBatch(true);
    
    try {
      const response = await fetch('/api/generate-batch-exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levels: selectedLevels,
          topics: selectedTopics,
          claudeApiKey,
          masteredWords,
          explanationLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate batch exercises');
      }

      const result = await response.json();
      const exercises = result.success ? result.data.exercises : result.exercises;
      setExerciseQueue(prev => [...prev, ...exercises]);
    } catch (error) {
      console.error('Error generating batch exercises:', error);
    } finally {
      setIsGeneratingBatch(false);
      generationInProgress.current = false;
    }
  }, [selectedLevels, selectedTopics, claudeApiKey, masteredWords, explanationLanguage]);

  const consumeNextExercise = useCallback(() => {
    const exercise = exerciseQueue[0];
    if (exercise) {
      setExerciseQueue(prev => prev.slice(1));
      
      // Trigger new batch generation when only 2 exercises remain
      if (exerciseQueue.length === 3 && !generationInProgress.current) {
        generateBatchExercises();
      }
    }
    return exercise || null;
  }, [exerciseQueue, generateBatchExercises]);

  const initializeQueue = useCallback(() => {
    if (exerciseQueue.length === 0 && !generationInProgress.current) {
      generateBatchExercises();
    }
  }, [exerciseQueue.length, generateBatchExercises]);

  return {
    nextExercise: exerciseQueue[0] || null,
    queueLength: exerciseQueue.length,
    isGeneratingBatch,
    generateBatchExercises,
    consumeNextExercise,
    initializeQueue
  };
}