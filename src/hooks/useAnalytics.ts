import { useCallback, useEffect, useRef } from 'react';
import { Exercise } from '@/types';

// Generate a unique session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = localStorage.getItem('tudobem_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('tudobem_session_id', sessionId);
  }
  return sessionId;
}

export function useAnalytics() {
  const sessionId = getSessionId();
  const startTime = useRef<number | null>(null);

  // Track analytics event
  const trackEvent = useCallback(async (eventData: {
    activityType: 'question_answered' | 'session_started' | 'exercise_generated' | 'mode_changed';
    exerciseId?: string;
    questionLevel?: string;
    questionTopic?: string;
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect?: boolean;
    responseTimeMs?: number;
  }) => {
    try {
      await fetch('/api/track-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...eventData
        })
      });
    } catch (error) {
      // Fail silently for analytics - don't disrupt user experience
      console.debug('Analytics tracking failed:', error);
    }
  }, [sessionId]);

  // Track session start
  const trackSessionStart = useCallback(() => {
    trackEvent({ activityType: 'session_started' });
  }, [trackEvent]);

  // Track exercise generation
  const trackExerciseGenerated = useCallback((exercise: Exercise) => {
    trackEvent({
      activityType: 'exercise_generated',
      exerciseId: exercise.id,
      questionLevel: exercise.level,
      questionTopic: exercise.topic
    });
  }, [trackEvent]);

  // Track question answered
  const trackQuestionAnswered = useCallback((exercise: Exercise, userAnswer: string, isCorrect: boolean) => {
    const responseTime = startTime.current ? Date.now() - startTime.current : undefined;
    
    trackEvent({
      activityType: 'question_answered',
      exerciseId: exercise.id,
      questionLevel: exercise.level,
      questionTopic: exercise.topic,
      userAnswer,
      correctAnswer: exercise.correctAnswer,
      isCorrect,
      responseTimeMs: responseTime
    });
  }, [trackEvent]);

  // Track mode change
  const trackModeChanged = useCallback((mode: string) => {
    trackEvent({
      activityType: 'mode_changed',
      userAnswer: mode // Use userAnswer field to store the mode
    });
  }, [trackEvent]);

  // Start response time tracking
  const startResponseTimer = useCallback(() => {
    startTime.current = Date.now();
  }, []);

  // Initialize session tracking
  useEffect(() => {
    trackSessionStart();
  }, [trackSessionStart]);

  return {
    trackSessionStart,
    trackExerciseGenerated,
    trackQuestionAnswered,
    trackModeChanged,
    startResponseTimer
  };
}