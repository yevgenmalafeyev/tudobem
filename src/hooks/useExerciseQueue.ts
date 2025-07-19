import { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { EnhancedExercise, ExerciseQueue, BatchGenerationRequest } from '@/types/enhanced';
import { UserConfiguration } from '@/types';

interface UseExerciseQueueProps {
  configuration: UserConfiguration;
  onExerciseGenerated?: (exercise: EnhancedExercise) => void;
  onQueueEmpty?: () => void;
}

export function useExerciseQueue({
  configuration,
  onExerciseGenerated,
  onQueueEmpty
}: UseExerciseQueueProps) {
  const { progress } = useStore();
  const [exerciseQueue, setExerciseQueue] = useState<ExerciseQueue>({
    exercises: [],
    currentIndex: 0,
    isBackgroundLoading: false,
    nextBatchLoading: false,
    generationSource: 'ai',
    sessionId: generateSessionId(),
    totalGenerated: 0
  });

  const backgroundLoadingRef = useRef(false);
  const hasTriggeredBackgroundRef = useRef(false);

  /**
   * Generate unique session ID for tracking
   */
  function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load initial batch of exercises
   */
  const loadInitialBatch = useCallback(async (): Promise<boolean> => {
    console.log('🚀 Loading initial exercise batch...');
    
    setExerciseQueue(prev => ({ ...prev, isBackgroundLoading: true }));
    
    try {
      const request: BatchGenerationRequest = {
        levels: configuration.selectedLevels,
        topics: configuration.selectedTopics,
        claudeApiKey: configuration.claudeApiKey,
        masteredWords: progress.masteredWords,
        count: 10,
        sessionId: exerciseQueue.sessionId,
        priority: 'immediate'
      };

      const response = await fetch('/api/generate-exercise-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate exercises');
      }

      const exercises: EnhancedExercise[] = result.data.exercises;
      
      setExerciseQueue(prev => ({
        ...prev,
        exercises,
        currentIndex: 0,
        isBackgroundLoading: false,
        generationSource: result.data.source,
        totalGenerated: result.data.generatedCount
      }));

      console.log(`✅ Loaded ${exercises.length} exercises (source: ${result.data.source})`);
      
      // Trigger callback with first exercise
      if (exercises.length > 0 && onExerciseGenerated) {
        onExerciseGenerated(exercises[0]);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to load initial batch:', error);
      setExerciseQueue(prev => ({ ...prev, isBackgroundLoading: false }));
      return false;
    }
  }, [configuration, progress.masteredWords, exerciseQueue.sessionId, onExerciseGenerated]);

  /**
   * Load next batch in background (triggered at 8/10 progress)
   */
  const triggerBackgroundGeneration = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous background loads
    if (backgroundLoadingRef.current || hasTriggeredBackgroundRef.current) {
      console.log('⏳ Background generation already in progress or triggered');
      return;
    }

    console.log('🔄 Triggering background generation...');
    backgroundLoadingRef.current = true;
    hasTriggeredBackgroundRef.current = true;
    
    setExerciseQueue(prev => ({ ...prev, nextBatchLoading: true }));

    try {
      const request: BatchGenerationRequest = {
        levels: configuration.selectedLevels,
        topics: configuration.selectedTopics,
        claudeApiKey: configuration.claudeApiKey,
        masteredWords: progress.masteredWords,
        count: 10,
        sessionId: exerciseQueue.sessionId,
        priority: 'background'
      };

      const response = await fetch('/api/generate-exercise-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newExercises: EnhancedExercise[] = result.data.exercises;
        
        setExerciseQueue(prev => ({
          ...prev,
          exercises: [...prev.exercises, ...newExercises],
          nextBatchLoading: false,
          totalGenerated: prev.totalGenerated + result.data.generatedCount
        }));

        console.log(`✅ Background loaded ${newExercises.length} additional exercises`);
      } else {
        throw new Error(result.error || 'Background generation failed');
      }
    } catch (error) {
      console.error('❌ Background generation failed:', error);
      setExerciseQueue(prev => ({ ...prev, nextBatchLoading: false }));
    } finally {
      backgroundLoadingRef.current = false;
    }
  }, [configuration, progress.masteredWords, exerciseQueue.sessionId]);

  /**
   * Get the next exercise from the queue
   */
  const getNextExercise = useCallback((): EnhancedExercise | null => {
    const { exercises, currentIndex } = exerciseQueue;
    
    if (currentIndex >= exercises.length) {
      console.warn('⚠️ No more exercises in queue');
      if (onQueueEmpty) {
        onQueueEmpty();
      }
      return null;
    }

    const nextExercise = exercises[currentIndex];
    
    // Update current index
    setExerciseQueue(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1
    }));

    // Trigger background generation at 80% progress (8 out of 10)
    const progress = currentIndex + 1; // +1 because we're about to show this exercise
    const totalInCurrentBatch = Math.min(exercises.length, 10);
    
    if (progress >= 8 && progress % 10 === 8 && !hasTriggeredBackgroundRef.current) {
      console.log(`📊 Progress: ${progress}/${totalInCurrentBatch} - triggering background generation`);
      triggerBackgroundGeneration();
    }

    // Reset background trigger flag when starting a new batch of 10
    if (progress % 10 === 1) {
      hasTriggeredBackgroundRef.current = false;
    }

    if (onExerciseGenerated) {
      onExerciseGenerated(nextExercise);
    }

    return nextExercise;
  }, [exerciseQueue, onExerciseGenerated, onQueueEmpty, triggerBackgroundGeneration]);

  /**
   * Get current exercise without advancing the queue
   */
  const getCurrentExercise = useCallback((): EnhancedExercise | null => {
    const { exercises, currentIndex } = exerciseQueue;
    return exercises[currentIndex] || null;
  }, [exerciseQueue]);

  /**
   * Reset the queue (useful for configuration changes)
   */
  const resetQueue = useCallback(() => {
    console.log('🔄 Resetting exercise queue');
    setExerciseQueue({
      exercises: [],
      currentIndex: 0,
      isBackgroundLoading: false,
      nextBatchLoading: false,
      generationSource: 'ai',
      sessionId: generateSessionId(),
      totalGenerated: 0
    });
    backgroundLoadingRef.current = false;
    hasTriggeredBackgroundRef.current = false;
  }, []);

  /**
   * Get queue statistics
   */
  const getQueueStats = useCallback(() => {
    const { exercises, currentIndex, totalGenerated } = exerciseQueue;
    const remaining = exercises.length - currentIndex;
    const completed = currentIndex;
    const progressPercentage = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;
    
    return {
      total: exercises.length,
      completed,
      remaining,
      progressPercentage,
      totalGenerated,
      isNearEnd: remaining <= 2,
      needsBackgroundLoad: completed >= 8 && completed % 10 >= 8
    };
  }, [exerciseQueue]);

  // Auto-reset queue when configuration changes
  useEffect(() => {
    resetQueue();
  }, [configuration.selectedLevels, configuration.selectedTopics, resetQueue]);

  return {
    exerciseQueue,
    loadInitialBatch,
    triggerBackgroundGeneration,
    getNextExercise,
    getCurrentExercise,
    resetQueue,
    getQueueStats,
    
    // Convenience properties
    isLoading: exerciseQueue.isBackgroundLoading,
    isBackgroundLoading: exerciseQueue.nextBatchLoading,
    generationSource: exerciseQueue.generationSource,
    hasExercises: exerciseQueue.exercises.length > 0,
    queueStats: getQueueStats()
  };
}