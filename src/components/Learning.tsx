'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { t } from '@/utils/translations';
import { useLearning } from '@/hooks/useLearning';
import { useExerciseQueue } from '@/hooks/useExerciseQueue';
import { useAnswerChecking } from '@/hooks/useAnswerChecking';
import { EnhancedExercise } from '@/types/enhanced';
import { Exercise } from '@/types';
import { topics } from '@/data/topics';
import ModeToggle from './learning/ModeToggle';
import ExerciseDisplay from './learning/ExerciseDisplay';
import MultipleChoiceOptions from './learning/MultipleChoiceOptions';
import FeedbackDisplay from './learning/FeedbackDisplay';
import ActionButtons from './learning/ActionButtons';
import ProblemReportButton from './learning/ProblemReportButton';
import NotLoggedInPrompt from './NotLoggedInPrompt';

interface LearningProps {
  onViewChange?: (view: 'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile') => void;
}

export default function Learning({ onViewChange }: LearningProps = {}) {
  // Helper function to get topic display name
  const getTopicDisplayName = useCallback((topicId: string, language: string = 'en') => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return '';
    
    return language === 'pt' ? topic.namePt : topic.name;
  }, []);

  // State for topic visibility (hidden by default)
  const [isTopicVisible, setIsTopicVisible] = useState(false);

  const {
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
  } = useLearning();


  // Memoize callbacks to prevent useExerciseQueue dependency changes
  const onExerciseGenerated = useCallback((exercise: EnhancedExercise) => {
    setCurrentExercise(exercise);
    // Don't generate explanation immediately - only when answer is wrong
  }, [setCurrentExercise]);

  const onQueueEmpty = useCallback(() => {
    console.log('Exercise queue is empty - loading new batch');
    // Could trigger a new batch load here
  }, []);

  // Exercise queue management
  const {
    exerciseQueue,
    loadInitialBatch,
    getNextExercise,
    isLoading: queueLoading,
    loadingError
  } = useExerciseQueue({
    configuration,
    onExerciseGenerated,
    onQueueEmpty
  });

  // Generate multiple choice options for current exercise
  const generateMultipleChoiceOptions = useCallback(async (exercise: Exercise | EnhancedExercise) => {
    if (learningMode !== 'multiple-choice') return;
    
    // Use the options from the enhanced exercise if available
    if (exercise.multipleChoiceOptions && exercise.multipleChoiceOptions.length > 0) {
      setMultipleChoiceOptions(exercise.multipleChoiceOptions);
      return;
    }
    
    // Fallback to generating options (for legacy exercises)
    try {
      const { generateBasicDistractors, processMultipleChoiceOptions } = await import('@/services/multipleChoiceService');
      const distractors = generateBasicDistractors(exercise.correctAnswer);
      const options = processMultipleChoiceOptions(exercise.correctAnswer, distractors);
      setMultipleChoiceOptions(options);
    } catch (error) {
      console.error('Error generating multiple choice options:', error);
    }
  }, [learningMode, setMultipleChoiceOptions]);

  const { checkAnswer } = useAnswerChecking({
    setFeedback,
    setShowAnswer,
    setIsLoading,
    addIncorrectAnswer
  });

  // Global loading lock to prevent multiple simultaneous requests
  const globalLoadingRef = useRef(false);
  
  // Load initial batch and exercise - with global locking to prevent race conditions
  useEffect(() => {
    // Only trigger initial load if we have no exercise, no queue, and not already loading
    if (!currentExercise && exerciseQueue.exercises.length === 0 && !queueLoading && !globalLoadingRef.current) {
      console.log('🎯 [DEBUG] Triggering initial batch load from Learning component (with global lock)');
      globalLoadingRef.current = true;
      
      loadInitialBatch().finally(() => {
        // Always release the lock after loading completes (success or failure)
        setTimeout(() => {
          globalLoadingRef.current = false;
        }, 1000); // 1 second delay to prevent rapid re-triggers
      });
    }
  }, [loadInitialBatch, currentExercise, exerciseQueue.exercises.length, queueLoading]);
  
  // Handle queue exercises when available - use ref to prevent cascading updates
  const hasProcessedQueueRef = useRef(false);
  
  useEffect(() => {
    if (!currentExercise && exerciseQueue.exercises.length > 0 && !hasProcessedQueueRef.current) {
      hasProcessedQueueRef.current = true;
      const nextExercise = getNextExercise();
      if (nextExercise) {
        setCurrentExercise(nextExercise);
        // Don't generate explanation immediately - only when answer is wrong
      }
      // Reset flag after a brief delay to allow for new batches
      setTimeout(() => {
        hasProcessedQueueRef.current = false;
      }, 1000);
    }
  }, [exerciseQueue.exercises.length, currentExercise, getNextExercise, setCurrentExercise]); // Removed generateExplanation dependency

  // Focus input when component mounts and when new exercise is generated
  useEffect(() => {
    if (currentExercise && !showAnswer) {
      focusInput();
    }
  }, [currentExercise, showAnswer, focusInput]);

  // Reset topic visibility when exercise changes
  useEffect(() => {
    setIsTopicVisible(false);
  }, [currentExercise]);

  const handleCheckAnswer = useCallback(async () => {
    if (!currentExercise) return;
    
    // Check the answer first
    await checkAnswer({
      exercise: currentExercise,
      userAnswer: getCurrentAnswer(),
      explanationLanguage: configuration.appLanguage
    });
    
  }, [currentExercise, getCurrentAnswer, configuration, checkAnswer]);

  const [isNextLoading, setIsNextLoading] = useState(false);

  const handleNextExercise = useCallback(async () => {
    if (isNextLoading) return; // Prevent double-clicks
    
    setIsNextLoading(true);
    
    try {
      // Get next exercise from queue
      const nextExercise = getNextExercise();
      
      if (nextExercise) {
        setCurrentExercise(nextExercise);
        resetState();
        // Don't generate explanation immediately - only when answer is wrong
        focusInput();
      } else {
        // No more exercises - trigger a new batch load
        console.log('No more exercises available - loading initial batch');
        await loadInitialBatch();
      }
    } catch (error) {
      console.error('Error loading next exercise:', error);
    } finally {
      // Re-enable button after a brief delay to prevent rapid clicking
      setTimeout(() => {
        setIsNextLoading(false);
      }, 300);
    }
  }, [isNextLoading, getNextExercise, setCurrentExercise, resetState, focusInput, loadInitialBatch]);

  // Auto-advance after correct answers with 2-second delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showAnswer && feedback?.isCorrect) {
      console.log('✅ Correct answer detected, auto-advancing in 2 seconds');
      timeoutId = setTimeout(() => {
        handleNextExercise();
      }, 2000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showAnswer, feedback, handleNextExercise]);

  // Handler for multiple choice option selection with immediate answer checking
  const handleOptionSelect = useCallback(async (selectedOption: string) => {
    if (!currentExercise) return;
    
    // Set the selected option in state
    setSelectedOption(selectedOption);
    
    // Check the answer immediately with the selected option
    await checkAnswer({
      exercise: currentExercise,
      userAnswer: selectedOption,
      explanationLanguage: configuration.appLanguage
    });
    
  }, [currentExercise, setSelectedOption, configuration, checkAnswer]);

  // Regenerate multiple choice options when mode changes
  useEffect(() => {
    if (currentExercise && learningMode === 'multiple-choice' && multipleChoiceOptions.length === 0) {
      generateMultipleChoiceOptions(currentExercise);
    }
  }, [currentExercise, learningMode, multipleChoiceOptions.length, generateMultipleChoiceOptions]);

  // Keyboard event handling
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showAnswer) {
          handleNextExercise();
        } else if (hasValidAnswer()) {
          handleCheckAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [showAnswer, hasValidAnswer, handleCheckAnswer, handleNextExercise]);

  // Loading state - show loading instead of error during initial load
  const isInitialLoading = !currentExercise && (isLoading || queueLoading || exerciseQueue.exercises.length === 0);
  
  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          {t('loadingExercise', configuration.appLanguage)}
        </div>
      </div>
    );
  }

  // Error state - show detailed error if available
  const hasLoadingFailed = loadingError && !isLoading && !queueLoading && exerciseQueue.exercises.length === 0;
  
  if (hasLoadingFailed) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-2xl p-6">
          <div className="neo-card-lg text-center">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--neo-error)' }}>
                {loadingError.message}
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--neo-text-secondary)' }}>
                {loadingError.details}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--neo-text-muted)' }}>
                Error occurred at: {loadingError.timestamp.toLocaleString()}
              </p>
            </div>
            <button 
              onClick={() => loadInitialBatch()} 
              className="neo-button neo-button-primary"
            >
              {t('tryAgain', configuration.appLanguage)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final safety check - this should not happen with improved loading logic
  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          {t('loadingExercise', configuration.appLanguage)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 relative">
      <div className="neo-card-lg" data-testid="exercise-container">
        {/* Header with level, topic and mode toggle */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="neo-outset-sm text-xs sm:text-sm px-2 sm:px-3 py-1" style={{ color: 'var(--neo-accent-text)' }}>
                {currentExercise?.level || 'A1'}
              </span>
              {currentExercise?.topic && (
                <button 
                  onClick={() => setIsTopicVisible(!isTopicVisible)}
                  className="neo-outset-sm text-xs sm:text-sm px-2 sm:px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--neo-text-secondary)' }}
                  data-testid="topic-toggle"
                  title={isTopicVisible ? getTopicDisplayName(currentExercise.topic, configuration.appLanguage) : t('clickToShowTopic', configuration.appLanguage)}
                >
                  {isTopicVisible 
                    ? getTopicDisplayName(currentExercise.topic, configuration.appLanguage)
                    : t('clickToShowTopic', configuration.appLanguage)
                  }
                </button>
              )}
              
              {/* Problem Report Button */}
              <ProblemReportButton
                exercise={currentExercise}
                showAnswer={showAnswer}
                learningMode={learningMode}
                appLanguage={configuration.appLanguage}
                feedback={feedback}
              />
            </div>
            
            <ModeToggle 
              learningMode={learningMode}
              setLearningMode={setLearningMode}
              appLanguage={configuration.appLanguage}
            />
          </div>
        </div>
          
        {/* Exercise display */}
        <ExerciseDisplay
          exercise={currentExercise}
          learningMode={learningMode}
          userAnswer={userAnswer}
          selectedOption={selectedOption}
          showAnswer={showAnswer}
          feedback={feedback}
          inputRef={inputRef}
          setUserAnswer={setUserAnswer}
        />

        {/* Multiple choice options */}
        {learningMode === 'multiple-choice' && (
          <MultipleChoiceOptions
            options={multipleChoiceOptions}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            showAnswer={showAnswer}
            onOptionSelect={handleOptionSelect}
          />
        )}

        {/* Feedback display */}
        <FeedbackDisplay 
          feedback={feedback}
          appLanguage={configuration.appLanguage}
          currentExercise={currentExercise}
        />

        {/* Action buttons */}
        <ActionButtons
          showAnswer={showAnswer}
          hasValidAnswer={hasValidAnswer()}
          isLoading={isLoading}
          appLanguage={configuration.appLanguage}
          learningMode={learningMode}
          onCheckAnswer={handleCheckAnswer}
          onNextExercise={handleNextExercise}
          feedback={feedback}
          isNextLoading={isNextLoading}
        />

        {/* Not logged in prompt */}
        <NotLoggedInPrompt className="mt-8" onViewChange={onViewChange} />
      </div>
    </div>
  );
}