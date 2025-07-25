'use client';

import { useEffect, useCallback } from 'react';
import { t } from '@/utils/translations';
import { useLearning } from '@/hooks/useLearning';
import { useExerciseQueue } from '@/hooks/useExerciseQueue';
import { useAnswerChecking } from '@/hooks/useAnswerChecking';
import { useDetailedExplanation } from '@/hooks/useDetailedExplanation';
import { EnhancedExercise } from '@/types/enhanced';
import { Exercise } from '@/types';
import GenerationStatusIndicator from './GenerationStatusIndicator';
import ModeToggle from './learning/ModeToggle';
import ExerciseDisplay from './learning/ExerciseDisplay';
import MultipleChoiceOptions from './learning/MultipleChoiceOptions';
import FeedbackDisplay from './learning/FeedbackDisplay';
import ActionButtons from './learning/ActionButtons';

export default function Learning() {
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

  // Exercise queue management
  const {
    exerciseQueue,
    loadInitialBatch,
    getNextExercise,
    isLoading: queueLoading,
    isBackgroundLoading,
    generationSource,
    queueStats
  } = useExerciseQueue({
    configuration,
    onExerciseGenerated: (exercise) => {
      setCurrentExercise(exercise);
      generateExplanation(exercise);
    },
    onQueueEmpty: () => {
      console.warn('Exercise queue is empty');
      // Could trigger a new batch load here
    }
  });

  // Detailed explanation hook
  const { 
    detailedExplanation, 
    generateExplanation, 
    clearExplanation 
  } = useDetailedExplanation({
    claudeApiKey: configuration.claudeApiKey,
    explanationLanguage: configuration.appLanguage
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

  // Load initial batch and exercise - separate effects to avoid dependency issues
  useEffect(() => {
    console.log('🚀 [DEBUG] Learning mount effect triggered:', {
      hasCurrentExercise: !!currentExercise,
      exerciseQueueLength: exerciseQueue.exercises.length,
      hasApiKey: !!configuration.claudeApiKey,
      apiKeyLength: configuration.claudeApiKey?.length || 0
    });
    
    // Only trigger initial load if we have no exercise and no queue
    if (!currentExercise && exerciseQueue.exercises.length === 0) {
      console.log('🚀 [DEBUG] Calling loadInitialBatch immediately on mount...');
      loadInitialBatch();
    }
  }, [loadInitialBatch, currentExercise, exerciseQueue.exercises.length, configuration.claudeApiKey]); // Include all dependencies
  
  // Handle queue exercises when available
  useEffect(() => {
    if (!currentExercise && exerciseQueue.exercises.length > 0) {
      console.log('🚀 [DEBUG] Getting next exercise from queue...');
      const nextExercise = getNextExercise();
      if (nextExercise) {
        setCurrentExercise(nextExercise);
        generateExplanation(nextExercise);
      }
    }
  }, [exerciseQueue.exercises.length, currentExercise, getNextExercise, setCurrentExercise, generateExplanation]); // Include all dependencies

  // Focus input when component mounts and when new exercise is generated
  useEffect(() => {
    if (currentExercise && !showAnswer) {
      focusInput();
    }
  }, [currentExercise, showAnswer, focusInput]);

  const handleCheckAnswer = useCallback(() => {
    if (!currentExercise) return;
    
    checkAnswer({
      exercise: currentExercise,
      userAnswer: getCurrentAnswer(),
      claudeApiKey: configuration.claudeApiKey,
      explanationLanguage: configuration.appLanguage
    });
  }, [currentExercise, getCurrentAnswer, configuration, checkAnswer]);

  const handleNextExercise = useCallback(() => {
    // Clear current detailed explanation
    clearExplanation();
    
    // Get next exercise from queue
    const nextExercise = getNextExercise();
    
    if (nextExercise) {
      setCurrentExercise(nextExercise);
      resetState();
      generateExplanation(nextExercise);
      focusInput();
    } else {
      // No more exercises - could trigger a new batch load
      console.warn('No more exercises available');
      loadInitialBatch();
    }
  }, [getNextExercise, setCurrentExercise, resetState, generateExplanation, focusInput, clearExplanation, loadInitialBatch]);

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

  // Loading state - improved logic to prevent question swapping
  const isWaitingForAPI = configuration.claudeApiKey && 
    (isLoading || queueLoading) && 
    exerciseQueue.exercises.length === 0;
  
  if (isWaitingForAPI || ((isLoading || queueLoading) && !currentExercise)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          {t('loadingExercise', configuration.appLanguage)}
        </div>
        <GenerationStatusIndicator
          source={generationSource}
          isBackgroundLoading={true}
        />
      </div>
    );
  }

  // Error state
  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-error)' }}>
          {t('loadingError', configuration.appLanguage)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 relative">
      {/* Generation Status Indicator */}
      <GenerationStatusIndicator
        source={generationSource}
        isBackgroundLoading={isBackgroundLoading}
        exerciseCount={queueStats.remaining}
        totalGenerated={queueStats.totalGenerated}
        currentProgress={{
          completed: queueStats.completed,
          total: queueStats.total,
          progressPercentage: queueStats.progressPercentage
        }}
      />
      
      <div className="neo-card-lg">
        {/* Header with level and mode toggle */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="neo-outset-sm text-xs sm:text-sm px-2 sm:px-3 py-1" style={{ color: 'var(--neo-accent-text)' }}>
              {currentExercise.level}
            </span>
            
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
          />
        )}

        {/* Feedback display */}
        <FeedbackDisplay 
          feedback={feedback}
          appLanguage={configuration.appLanguage}
          detailedExplanation={detailedExplanation}
        />

        {/* Action buttons */}
        <ActionButtons
          showAnswer={showAnswer}
          hasValidAnswer={hasValidAnswer()}
          isLoading={isLoading}
          appLanguage={configuration.appLanguage}
          onCheckAnswer={handleCheckAnswer}
          onNextExercise={handleNextExercise}
        />
      </div>
    </div>
  );
}