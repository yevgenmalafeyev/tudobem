'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import { Exercise } from '@/types';
import { isMobileDevice } from '@/utils/pwaDetection';
import { useAnalytics } from '@/hooks/useAnalytics';

type LearningMode = 'input' | 'multiple-choice';

export default function Learning() {
  const { 
    currentExercise, 
    setCurrentExercise, 
    addIncorrectAnswer,
    addMasteredWord,
    configuration,
    progress
  } = useStore();
  
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [learningMode, setLearningMode] = useState<LearningMode>(
    typeof window !== 'undefined' && isMobileDevice() ? 'multiple-choice' : 'input'
  );
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [fallbackExercise, setFallbackExercise] = useState<Exercise | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showFallbackLoading, setShowFallbackLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Analytics tracking
  const { trackExerciseGenerated, trackQuestionAnswered, trackModeChanged, startResponseTimer } = useAnalytics();
  
  // Background generation for faster transitions
  const [detailedExplanation, setDetailedExplanation] = useState<string>('');
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  // Generate detailed grammar explanation for current exercise
  const generateDetailedExplanation = useCallback(async (exercise: Exercise) => {
    if (!exercise || !configuration.claudeApiKey) return;
    
    try {
      const response = await fetch('/api/generate-detailed-explanation', {
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
        throw new Error('Failed to generate detailed explanation');
      }

      const result = await response.json();
      setDetailedExplanation(result.explanation);
    } catch (error) {
      console.error('Error generating detailed explanation:', error);
      setDetailedExplanation('');
    }
  }, [configuration.claudeApiKey, configuration.appLanguage]);

  // Generate batch exercises in background
  const generateBatchExercises = useCallback(async () => {
    if (isGeneratingBatch || !configuration.claudeApiKey) return;
    
    setIsGeneratingBatch(true);
    try {
      const response = await fetch('/api/generate-batch-exercises', {
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
        throw new Error('Failed to generate batch exercises');
      }

      const { exercises } = await response.json();
      setExerciseQueue(prev => [...prev, ...exercises]);
    } catch (error) {
      console.error('Error generating batch exercises:', error);
    } finally {
      setIsGeneratingBatch(false);
    }
  }, [configuration.selectedLevels, configuration.selectedTopics, configuration.claudeApiKey, progress.masteredWords, isGeneratingBatch]);

  // Fetch fallback exercise from database
  const fetchFallbackExercise = useCallback(async () => {
    try {
      const response = await fetch('/api/fallback-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levels: configuration.selectedLevels,
          topics: configuration.selectedTopics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fallback exercise');
      }

      const { fallbackExercise } = await response.json();
      return fallbackExercise;
    } catch (error) {
      console.error('Error fetching fallback exercise:', error);
      return null;
    }
  }, [configuration.selectedLevels, configuration.selectedTopics]);

  const generateMultipleChoiceOptions = useCallback(async (exercise: { correctAnswer: string; sentence: string; level: string; topic: string; hint?: { infinitive?: string; person?: string } }) => {
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
  }, [learningMode, configuration.claudeApiKey, configuration.appLanguage]);

  const generateNewExercise = useCallback(async () => {
    // If user has interacted with fallback, don't replace it with fresh exercise
    if (userInteracted && fallbackExercise) {
      console.log('User has interacted with fallback, not replacing with fresh exercise');
      return;
    }

    setIsLoading(true);
    console.log('Generating exercise with configuration:', {
      levels: configuration.selectedLevels,
      topics: configuration.selectedTopics,
      hasApiKey: !!configuration.claudeApiKey,
      masteredWordsCount: Object.keys(progress.masteredWords).length
    });
    
    try {
      let exercise;
      
      // Use exercise from queue if available
      if (exerciseQueue.length > 0) {
        exercise = exerciseQueue[0];
        setExerciseQueue(prev => prev.slice(1));
        console.log('Using exercise from queue');
        
        // Generate new batch when only 2 exercises remain
        if (exerciseQueue.length === 3) {
          generateBatchExercises();
        }
      } else {
        // Generate single exercise as fallback
        console.log('Generating single exercise as fallback');
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

      // Only set as current exercise if user hasn't interacted with fallback
      if (!userInteracted) {
        setCurrentExercise(exercise);
        setUserAnswer('');
        setSelectedOption('');
        setFeedback(null);
        setShowAnswer(false);
        
        // Track exercise generation
        trackExerciseGenerated(exercise);
        
        // Start response timer for analytics
        startResponseTimer();
        
        // For batch exercises, the detailed explanation is already included
        if (exercise.detailedExplanation) {
          if (typeof exercise.detailedExplanation === 'string') {
            setDetailedExplanation(exercise.detailedExplanation);
          } else {
            // Multi-language explanations from database
            const lang = configuration.appLanguage || 'pt';
            setDetailedExplanation(exercise.detailedExplanation[lang] || exercise.detailedExplanation.pt);
          }
        } else {
          // Generate detailed explanation for fallback exercises
          generateDetailedExplanation(exercise);
        }
        
        // For batch exercises, multiple choice options are already included
        if (exercise.multipleChoiceOptions && learningMode === 'multiple-choice') {
          setMultipleChoiceOptions(exercise.multipleChoiceOptions);
        } else if (learningMode === 'multiple-choice') {
          // Generate multiple choice options for fallback exercises
          await generateMultipleChoiceOptions(exercise);
        }
        
        // Clear fallback exercise since we have a fresh one
        setFallbackExercise(null);
        
        // Focus input field after exercise is loaded (only in input mode)
        if (learningMode === 'input') {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configuration.selectedLevels, configuration.selectedTopics, configuration.claudeApiKey, progress.masteredWords, learningMode, generateMultipleChoiceOptions, setCurrentExercise, exerciseQueue, generateDetailedExplanation, generateBatchExercises, configuration.appLanguage, userInteracted, fallbackExercise]);

  useEffect(() => {
    if (!currentExercise && !fallbackExercise) {
      // First try to get a fallback exercise from database
      fetchFallbackExercise().then(async (fallback) => {
        if (fallback) {
          setFallbackExercise(fallback);
          setCurrentExercise(fallback);
          setUserAnswer('');
          setSelectedOption('');
          setFeedback(null);
          setShowAnswer(false);
          
          // Handle explanations for fallback exercises
          if (fallback.detailedExplanation) {
            if (typeof fallback.detailedExplanation === 'string') {
              setDetailedExplanation(fallback.detailedExplanation);
            } else {
              const lang = configuration.appLanguage || 'pt';
              setDetailedExplanation(fallback.detailedExplanation[lang] || fallback.detailedExplanation.pt);
            }
          }
          
          // Handle multiple choice options for fallback exercises
          if (fallback.multipleChoiceOptions && learningMode === 'multiple-choice') {
            setMultipleChoiceOptions(fallback.multipleChoiceOptions);
          } else if (learningMode === 'multiple-choice') {
            await generateMultipleChoiceOptions(fallback);
          }
          
          // Start generating fresh exercise in background
          generateNewExercise();
        } else {
          // No fallback available, show loading animation
          setShowFallbackLoading(true);
          generateNewExercise();
        }
      });
    }
  }, [currentExercise, fallbackExercise, generateNewExercise, fetchFallbackExercise, configuration.appLanguage, learningMode, generateMultipleChoiceOptions]);

  // Initialize exercise queue when component mounts
  useEffect(() => {
    if (exerciseQueue.length === 0 && !isGeneratingBatch) {
      generateBatchExercises();
    }
  }, [exerciseQueue.length, isGeneratingBatch, generateBatchExercises]);

  const checkAnswer = useCallback(async () => {
    if (!currentExercise) return;
    
    const answerToCheck = learningMode === 'input' 
      ? userAnswer.trim() 
      : selectedOption;
    
    if (!answerToCheck) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise: currentExercise,
          userAnswer: answerToCheck,
          claudeApiKey: configuration.claudeApiKey,
          explanationLanguage: configuration.appLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      const result = await response.json();
      setFeedback(result);
      setShowAnswer(true);

      // Track question answered
      trackQuestionAnswered(currentExercise, answerToCheck, result.isCorrect);

      if (!result.isCorrect) {
        addIncorrectAnswer(currentExercise.correctAnswer);
      } else {
        // Add to mastered words when answer is correct
        addMasteredWord(currentExercise);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentExercise, userAnswer, selectedOption, learningMode, configuration.claudeApiKey, configuration.appLanguage, addIncorrectAnswer, addMasteredWord]);

  const moveToNextExercise = useCallback(() => {
    // Reset all state for the new exercise
    setShowAnswer(false);
    setFeedback(null);
    setUserAnswer('');
    setSelectedOption('');
    setMultipleChoiceOptions([]);
    setUserInteracted(false);
    setFallbackExercise(null);
    setShowFallbackLoading(false);
    
    // Clear current exercise to force generation of a new one
    setCurrentExercise(null);
    
    // Generate new exercise
    generateNewExercise();
  }, [generateNewExercise, setCurrentExercise]);

  // Focus input when component mounts and when new exercise is generated
  useEffect(() => {
    if (currentExercise && !showAnswer) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentExercise, showAnswer]);

  // Auto-forward to next question after 2 seconds on correct answer
  useEffect(() => {
    if (feedback?.isCorrect && showAnswer) {
      const timer = setTimeout(() => {
        moveToNextExercise();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback?.isCorrect, showAnswer, moveToNextExercise]);

  // Add global keypress listener for Enter key
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showAnswer) {
          moveToNextExercise();
        } else {
          const hasValidAnswer = learningMode === 'input' 
            ? userAnswer.trim() 
            : selectedOption;
          if (hasValidAnswer) {
            checkAnswer();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [showAnswer, userAnswer, selectedOption, learningMode, checkAnswer, moveToNextExercise]);
  
  // Add effect to regenerate multiple choice options when mode changes
  useEffect(() => {
    if (currentExercise && learningMode === 'multiple-choice' && multipleChoiceOptions.length === 0) {
      generateMultipleChoiceOptions(currentExercise);
    }
  }, [currentExercise, learningMode, multipleChoiceOptions.length, generateMultipleChoiceOptions]);

  if (showFallbackLoading && !currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-4" style={{ borderColor: 'var(--neo-accent)' }}></div>
            {t('loadingExercise', configuration.appLanguage)}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-text)' }}>
          {t('loadingExercise', configuration.appLanguage)}
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="neo-card text-xl" style={{ color: 'var(--neo-error)' }}>
          {t('loadingError', configuration.appLanguage)}
        </div>
      </div>
    );
  }

  const sentenceParts = currentExercise.sentence.split('___');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="neo-card-lg">
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="neo-outset-sm text-xs sm:text-sm px-2 sm:px-3 py-1" style={{ color: 'var(--neo-accent-text)' }}>
              {currentExercise.level}
            </span>
            
            {/* Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                {t('learningMode', configuration.appLanguage)}:
              </span>
              <div className="flex neo-inset-sm rounded-lg p-1">
                <button
                  onClick={() => {
                    setLearningMode('input');
                    trackModeChanged('input');
                  }}
                  className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                    learningMode === 'input' ? 'neo-button-primary' : ''
                  }`}
                >
                  {t('inputMode', configuration.appLanguage)}
                </button>
                <button
                  onClick={() => {
                    setLearningMode('multiple-choice');
                    trackModeChanged('multiple-choice');
                  }}
                  className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                    learningMode === 'multiple-choice' ? 'neo-button-primary' : ''
                  }`}
                >
                  {t('multipleChoiceMode', configuration.appLanguage)}
                </button>
              </div>
            </div>
          </div>
        </div>
          
        <div className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 leading-relaxed" style={{ color: 'var(--neo-text)' }}>
            {sentenceParts[0]}
            <span className="inline-block mx-1 sm:mx-2 min-w-16 sm:min-w-24 text-center">
              {showAnswer ? (
                <span className={`font-bold neo-outset-sm px-2 py-1 ${feedback?.isCorrect ? '' : ''}`} style={{ color: feedback?.isCorrect ? 'var(--neo-success-text)' : 'var(--neo-error)' }}>
                  {feedback?.isCorrect ? (learningMode === 'input' ? userAnswer : selectedOption) : currentExercise.correctAnswer}
                </span>
              ) : learningMode === 'input' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    // Mark as interacted when user starts typing
                    if (!userInteracted && e.target.value.length > 0) {
                      setUserInteracted(true);
                    }
                  }}
                  className="neo-inset text-center min-w-16 sm:min-w-24 text-lg sm:text-xl lg:text-2xl"
                  placeholder="?"
                  disabled={showAnswer}
                />
              ) : (
                <span className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                  ?
                </span>
              )}
            </span>
            {sentenceParts[1]}
            {currentExercise.hint && (currentExercise.hint.infinitive || currentExercise.hint.person) && (
              <span className="text-sm sm:text-base ml-2" style={{ color: 'var(--neo-text-muted)' }}>
                ({currentExercise.hint.infinitive}{currentExercise.hint.person ? `, ${currentExercise.hint.person}` : ''})
              </span>
            )}
          </div>

        {/* Multiple Choice Options */}
        {learningMode === 'multiple-choice' && !showAnswer && multipleChoiceOptions.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {multipleChoiceOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={async () => {
                    setSelectedOption(option);
                    // Mark as interacted when user selects an option
                    if (!userInteracted) {
                      setUserInteracted(true);
                    }
                    // Auto-check answer when option is selected
                    setTimeout(async () => {
                      // Create a temporary answer check with the selected option
                      if (!currentExercise) return;
                      
                      setIsLoading(true);
                      try {
                        const response = await fetch('/api/check-answer', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            exercise: currentExercise,
                            userAnswer: option,
                            claudeApiKey: configuration.claudeApiKey,
                            explanationLanguage: configuration.appLanguage
                          }),
                        });

                        if (!response.ok) {
                          throw new Error('Failed to check answer');
                        }

                        const result = await response.json();
                        setFeedback(result);
                        setShowAnswer(true);

                        if (!result.isCorrect) {
                          addIncorrectAnswer(currentExercise.correctAnswer);
                        } else {
                          addMasteredWord(currentExercise);
                        }
                      } catch (error) {
                        console.error('Error checking answer:', error);
                      } finally {
                        setIsLoading(false);
                      }
                    }, 100);
                  }}
                  className={`neo-button text-sm sm:text-base p-3 sm:p-4 text-left ${
                    selectedOption === option ? 'neo-button-primary' : ''
                  }`}
                  style={{ 
                    minHeight: '44px',
                    color: selectedOption === option ? 'var(--neo-text-inverted)' : 'var(--neo-text)'
                  }}
                  disabled={isLoading}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className="neo-inset mb-4 sm:mb-6 p-3 sm:p-4">
            <div className={`font-semibold mb-2 text-sm sm:text-base`} style={{ color: feedback.isCorrect ? 'var(--neo-success-text)' : 'var(--neo-error)' }}>
              {feedback.isCorrect ? `✓ ${t('correct', configuration.appLanguage)}` : `✗ ${t('incorrect', configuration.appLanguage)}`}
            </div>
            <div className="text-sm sm:text-base" style={{ color: 'var(--neo-text)' }}>
              {feedback.explanation}
              {!feedback.isCorrect && detailedExplanation && (
                <div className="mt-3 p-3 neo-inset-sm rounded" style={{ backgroundColor: 'var(--neo-background-muted)' }}>
                  <div className="font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                    📚 Grammar Details:
                  </div>
                  <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                    {detailedExplanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          {!showAnswer ? (
            <>
              {/* Only show check button for input mode */}
              {learningMode === 'input' && (
                <>
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || isLoading}
                    className="neo-button neo-button-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
                  >
                    {isLoading ? t('checking', configuration.appLanguage) : t('checkAnswer', configuration.appLanguage)}
                  </button>
                  <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
                    {t('enterToCheck', configuration.appLanguage)}
                  </p>
                </>
              )}
              {/* For multiple choice, show different text */}
              {learningMode === 'multiple-choice' && (
                <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
                  {t('selectOption', configuration.appLanguage)}
                </p>
              )}
            </>
          ) : (
            <>
              <button
                onClick={moveToNextExercise}
                disabled={isLoading}
                className="neo-button neo-button-success w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
              >
                {isLoading ? t('loading', configuration.appLanguage) : t('nextExercise', configuration.appLanguage)}
              </button>
              <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
                {t('enterForNext', configuration.appLanguage)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}