'use client';

import { useEffect, useCallback } from 'react';
import { t } from '@/utils/translations';
import { useLearning } from '@/hooks/useLearning';
import { useExerciseGeneration } from '@/hooks/useExerciseGeneration';
import { useAnswerChecking } from '@/hooks/useAnswerChecking';
import { useBackgroundGeneration } from '@/hooks/useBackgroundGeneration';
import { useDetailedExplanation } from '@/hooks/useDetailedExplanation';
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

  // Background generation hook
  const { 
    nextExercise, 
    queueLength,
    isGeneratingBatch, 
    generateBatchExercises, 
    consumeNextExercise,
    initializeQueue
  } = useBackgroundGeneration({
    selectedLevels: configuration.selectedLevels,
    selectedTopics: configuration.selectedTopics,
    claudeApiKey: configuration.claudeApiKey,
    masteredWords: {} // TODO: Get from store
  });

  // Detailed explanation hook
  const { 
    detailedExplanation, 
    generateExplanation, 
    clearExplanation 
  } = useDetailedExplanation({
    claudeApiKey: configuration.claudeApiKey,
    explanationLanguage: configuration.explanationLanguage
  });

  const { generateNewExercise, generateMultipleChoiceOptions } = useExerciseGeneration({
    configuration,
    learningMode,
    setCurrentExercise,
    setMultipleChoiceOptions,
    setIsLoading,
    resetState,
    focusInput,
    preGeneratedExercise: nextExercise,
    onExerciseGenerated: (exercise) => {
      // Generate detailed explanation for the new exercise
      generateExplanation(exercise);
      
      // Initialize queue if needed
      if (queueLength === 0) {
        initializeQueue();
      }
    }
  });

  const { checkAnswer } = useAnswerChecking({
    setFeedback,
    setShowAnswer,
    setIsLoading,
    addIncorrectAnswer
  });

  // Load initial exercise
  useEffect(() => {
    if (!currentExercise) {
      generateNewExercise();
    }
  }, [currentExercise, generateNewExercise]);

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
      explanationLanguage: configuration.explanationLanguage
    });
  }, [currentExercise, getCurrentAnswer, configuration, checkAnswer]);

  const handleNextExercise = useCallback(() => {
    // Clear current detailed explanation
    clearExplanation();
    
    // Consume the next exercise from queue
    const nextFromQueue = consumeNextExercise();
    
    // Generate new exercise (will use from queue if available)
    generateNewExercise();
  }, [generateNewExercise, clearExplanation, consumeNextExercise]);

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

  // Loading state
  if (isLoading && !currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          {t('loadingExercise', configuration.appLanguage)}
        </div>
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
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