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
    sessionId: generateSessionId(),
    totalGenerated: 0
  });

  const [loadingError, setLoadingError] = useState<{
    message: string;
    details: string;
    timestamp: Date;
  } | null>(null);

  const backgroundLoadingRef = useRef(false);
  const hasTriggeredBackgroundRef = useRef(false);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingPromiseRef = useRef<Promise<boolean> | null>(null);

  /**
   * Generate unique session ID for tracking
   */
  function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load initial batch of exercises with retry logic
   */
  const loadInitialBatch = useCallback(async (retryCount: number = 0): Promise<boolean> => {
    // Prevent multiple simultaneous loading attempts
    if (loadingPromiseRef.current) {
      console.log('🔄 [DEBUG] Loading already in progress, returning existing promise');
      return await loadingPromiseRef.current;
    }
    
    // Add a shorter delay to allow component to stabilize after mount/unmount cycles
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if component is still mounted after stabilization
    if (!mountedRef.current) {
      return false;
    }
    
    const maxRetries = 2;
    
    // Clear any previous error
    setLoadingError(null);
    
    // Cancel any existing request only if we have one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Check mount status before setting state
    if (!mountedRef.current) return false;
    
    // Create and store the loading promise
    const loadingPromise = (async (): Promise<boolean> => {
      try {
        setExerciseQueue(prev => ({ ...prev, isBackgroundLoading: true }));
      
        console.log('🚀 [DEBUG] Starting initial batch load for levels:', configuration.selectedLevels);
      const request: BatchGenerationRequest = {
        levels: configuration.selectedLevels,
        topics: configuration.selectedTopics,
        masteredWords: progress.masteredWords,
        count: 10,
        sessionId: exerciseQueue.sessionId,
        priority: 'immediate',
        source: 'learning' // Mark as learning mode request - NO AI generation
      };

      // Create new AbortController for this request only if still mounted
      if (!mountedRef.current) {
        return false;
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const timeoutId = setTimeout(() => {
        if (mountedRef.current && abortControllerRef.current === controller) {
          console.error('Request timeout after 15 seconds');
          controller.abort();
        }
      }, 15000); // 15 second timeout for database operations
      
      const response = await fetch('/api/generate-exercise-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      // Check if component is still mounted before processing response
      if (!mountedRef.current) {
        return false;
      }

      if (!response.ok) {
        const errorText = response.statusText || 'Unknown error';
        console.error('HTTP error response:', response.status, errorText);
        const httpError = new Error(`Server returned ${response.status}: ${errorText}`) as Error & {
          type: string;
          status: number;
        };
        httpError.type = 'http';
        httpError.status = response.status;
        throw httpError;
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('API returned failure:', result.error);
        const apiError = new Error(result.error || 'Failed to generate exercises from database') as Error & {
          type: string;
        };
        apiError.type = 'api';
        throw apiError;
      }

      const exercises: EnhancedExercise[] = result.data.exercises;
      
      // Check mount status before updating state
      if (!mountedRef.current) {
        return false;
      }
      
      setExerciseQueue(prev => ({
        ...prev,
        exercises,
        currentIndex: 1, // Set to 1 since exercises[0] is already being displayed
        isBackgroundLoading: false,
        totalGenerated: result.data.generatedCount
      }));
      
      // Trigger callback with first exercise (only if still mounted)
      if (mountedRef.current && exercises.length > 0 && onExerciseGenerated) {
        onExerciseGenerated(exercises[0]);
      }

      return true;
    } catch (error) {
      console.error('Failed to load initial batch:', error);
      
      // Handle timeout errors and network errors specifically
      const isTimeoutError = error instanceof Error && error.name === 'AbortError';
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      const isHttpError = (error as Error & { type?: string }).type === 'http';
      const isApiError = (error as Error & { type?: string }).type === 'api';
      const isComponentUnmounted = !mountedRef.current;
      
      if (isComponentUnmounted) {
        return false;
      }
      
      // Create detailed error information
      let errorMessage = 'Unknown error occurred';
      let errorDetails = '';
      
      if (isTimeoutError) {
        errorMessage = 'Request timeout';
        errorDetails = 'The server took too long to respond. This might be due to high server load or network issues.';
        console.error('Request was aborted due to timeout');
      } else if (isNetworkError) {
        errorMessage = 'Network connection error';
        errorDetails = 'Unable to connect to the server. Please check your internet connection and try again.';
        console.error('Network error detected');
      } else if (isHttpError) {
        errorMessage = `Server error (${(error as Error & { status?: number }).status})`;
        errorDetails = error instanceof Error ? error.message : 'The server encountered an error processing your request.';
      } else if (isApiError) {
        errorMessage = 'Database loading failed';
        errorDetails = error instanceof Error ? error.message : 'Failed to load exercises from the database.';
      } else if (error instanceof Error) {
        errorMessage = 'Exercise loading failed';
        errorDetails = error.message;
      }
      
      // Retry on timeout or network errors (but not on HTTP/API errors or component unmount)
      if ((isTimeoutError || isNetworkError) && retryCount < maxRetries && mountedRef.current) {
        if (mountedRef.current) {
          setExerciseQueue(prev => ({ ...prev, isBackgroundLoading: false }));
        }
        
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        return loadInitialBatch(retryCount + 1);
      }
      
      // Set detailed error for non-retryable errors or after max retries
      if (mountedRef.current) {
        setLoadingError({
          message: errorMessage,
          details: errorDetails,
          timestamp: new Date()
        });
        setExerciseQueue(prev => ({ ...prev, isBackgroundLoading: false }));
        }
        return false;
      } finally {
        // Clear the promise reference when done (success or error)
        loadingPromiseRef.current = null;
      }
    })();
      
      // Store the promise to prevent concurrent requests
      loadingPromiseRef.current = loadingPromise;
      
      // Return the promise result
      return await loadingPromise;
  }, [configuration.selectedLevels, configuration.selectedTopics, progress.masteredWords, onExerciseGenerated]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load next batch in background (triggered at 8/10 progress)
   */
  const triggerBackgroundGeneration = useCallback(async (): Promise<void> => {
    // Check if component is still mounted
    if (!mountedRef.current) {
      return;
    }

    // Prevent multiple simultaneous background loads
    if (backgroundLoadingRef.current || hasTriggeredBackgroundRef.current) {
      return;
    }

    backgroundLoadingRef.current = true;
    hasTriggeredBackgroundRef.current = true;
    
    // Check mount status before setting state
    if (!mountedRef.current) return;
    setExerciseQueue(prev => ({ ...prev, nextBatchLoading: true }));

    try {
      const request: BatchGenerationRequest = {
        levels: configuration.selectedLevels,
        topics: configuration.selectedTopics,
        masteredWords: progress.masteredWords,
        count: 10,
        sessionId: exerciseQueue.sessionId,
        priority: 'background',
        source: 'learning' // Mark as learning mode request - NO AI generation
      };

      // Add timeout for background requests too
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.error('Background request timeout after 15 seconds');
          controller.abort();
        }
      }, 15000);
      
      const response = await fetch('/api/generate-exercise-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Check if component is still mounted before processing response
      if (!mountedRef.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Check mount status before updating state
      if (!mountedRef.current) {
        return;
      }
      
      if (result.success) {
        const newExercises: EnhancedExercise[] = result.data.exercises;
        
        setExerciseQueue(prev => ({
          ...prev,
          exercises: [...prev.exercises, ...newExercises],
          nextBatchLoading: false,
          totalGenerated: prev.totalGenerated + result.data.generatedCount
        }));
      } else {
        throw new Error(result.error || 'Background generation failed');
      }
    } catch (error) {
      const isComponentUnmounted = !mountedRef.current;
      
      if (isComponentUnmounted) {
        return;
      }
      
      console.error('Background generation failed:', error);
      if (mountedRef.current) {
        setExerciseQueue(prev => ({ ...prev, nextBatchLoading: false }));
      }
    } finally {
      backgroundLoadingRef.current = false;
    }
  }, [configuration.selectedLevels, configuration.selectedTopics, progress.masteredWords]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Get the next exercise from the queue
   */
  const getNextExercise = useCallback((): EnhancedExercise | null => {
    // Check if component is still mounted
    if (!mountedRef.current) {
      return null;
    }

    const { exercises, currentIndex } = exerciseQueue;
    
    if (currentIndex >= exercises.length) {
      if (onQueueEmpty && mountedRef.current) {
        onQueueEmpty();
      }
      return null;
    }

    const nextExercise = exercises[currentIndex];
    
    // Update current index (only if still mounted)
    if (mountedRef.current) {
      setExerciseQueue(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    }

    // Trigger background generation at 80% progress (8 out of 10)
    const progress = currentIndex + 1; // +1 because we're about to show this exercise
    
    if (progress >= 8 && progress % 10 === 8 && !hasTriggeredBackgroundRef.current && mountedRef.current) {
      triggerBackgroundGeneration();
    }

    // Reset background trigger flag when starting a new batch of 10
    if (progress % 10 === 1) {
      hasTriggeredBackgroundRef.current = false;
    }

    if (onExerciseGenerated && mountedRef.current) {
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
    // Cancel any ongoing requests first
    if (abortControllerRef.current) {
      console.log('🛑 [DEBUG] Aborting ongoing request due to queue reset');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear the loading promise to allow fresh requests
    loadingPromiseRef.current = null;
    
    setExerciseQueue({
      exercises: [],
      currentIndex: 0,
      isBackgroundLoading: false,
      nextBatchLoading: false,
      sessionId: generateSessionId(),
      totalGenerated: 0
    });
    setLoadingError(null); // Clear errors when resetting
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

  // Auto-reset queue when configuration changes (only if configuration actually changed)
  const configRef = useRef({ levels: configuration.selectedLevels, topics: configuration.selectedTopics });
  
  useEffect(() => {
    const currentConfig = { levels: configuration.selectedLevels, topics: configuration.selectedTopics };
    const prevConfig = configRef.current;
    
    // Only reset if configuration actually changed
    if (JSON.stringify(currentConfig.levels) !== JSON.stringify(prevConfig.levels) ||
        JSON.stringify(currentConfig.topics) !== JSON.stringify(prevConfig.topics)) {
      console.log('🔄 [DEBUG] Configuration changed, resetting queue');
      resetQueue();
      configRef.current = currentConfig;
    }
  }, [configuration.selectedLevels, configuration.selectedTopics, resetQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Add a small delay before aborting to allow any in-flight requests to complete
      setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      }, 50); // Small delay to let current requests finish
    };
  }, []);

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
    hasExercises: exerciseQueue.exercises.length > 0,
    queueStats: getQueueStats(),
    loadingError
  };
}