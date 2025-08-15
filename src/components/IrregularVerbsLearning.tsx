'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { 
  IrregularVerbExercise, 
  VerbTense
} from '@/types/irregular-verbs';

import type { UserConfiguration, AppLanguage } from '@/types';
import NotLoggedInPrompt from './NotLoggedInPrompt';
import QuestionMarkup from './irregular-verbs/QuestionMarkup';

interface IrregularVerbsLearningProps {
  userConfig: UserConfiguration;
  onConfigUpdate: (config: Partial<UserConfiguration>) => void;
  appLanguage: AppLanguage;
  onViewChange?: (view: 'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile') => void;
}

export default function IrregularVerbsLearning({ 
  userConfig,
  onViewChange
}: Omit<IrregularVerbsLearningProps, 'onConfigUpdate' | 'appLanguage'>) {
  const [currentExercise, setCurrentExercise] = useState<IrregularVerbExercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [recentVerbs, setRecentVerbs] = useState<string[]>([]);
  const [showMultipleChoice, setShowMultipleChoice] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [sessionId] = useState(`irregular-verbs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isNextLoading, setIsNextLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const exerciseContainerRef = useRef<HTMLDivElement>(null);

  // Get enabled tenses from user config or default to all
  const enabledTenses: VerbTense[] = useMemo(() => 
    userConfig.irregularVerbsEnabledTenses?.length > 0
      ? userConfig.irregularVerbsEnabledTenses as VerbTense[]
      : [
          'presente_indicativo', 'pps', 'preterito_imperfeito',
          'imperativo_positivo', 'imperativo_negativo', 'infinitivo_pessoal',
          'futuro_imperfeito', 'condicional_presente', 'conjuntivo_presente',
          'conjuntivo_passado', 'conjuntivo_futuro', 'participio_passado'
        ], [userConfig.irregularVerbsEnabledTenses]);

  const generateExercise = useCallback(async (forceMultipleChoice?: boolean) => {
    setIsLoading(true);
    const useMultipleChoice = forceMultipleChoice !== undefined ? forceMultipleChoice : showMultipleChoice;
    
    // If forceMultipleChoice is specified, update the state immediately to prevent race conditions
    if (forceMultipleChoice !== undefined) {
      setShowMultipleChoice(forceMultipleChoice);
    }
    
    try {
      const response = await fetch('/api/generate-irregular-verbs-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabledTenses,
          excludeRecentVerbs: recentVerbs,
          includeMultipleChoice: true, // Always generate multiple choice options
          sessionId,
          includeVos: userConfig.irregularVerbsIncludeVos ?? false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data.exercise) {
        console.log('🔍 Exercise data:', data.data.exercise);
        console.log('🔍 Multiple choice options:', data.data.exercise.multipleChoiceOptions);
        setCurrentExercise(data.data.exercise);
        setUserAnswer('');
        setSelectedOption('');
        setShowFeedback(false);
        setIsCorrect(false);
        
        // Add verb to recent verbs (keep last 10)
        setRecentVerbs(prev => {
          const updated = [data.data.exercise.infinitive, ...prev];
          return updated.slice(0, 10);
        });
        
        // Focus on input if in text mode
        if (!useMultipleChoice) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      } else {
        console.error('Failed to generate exercise:', data.error);
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [enabledTenses, recentVerbs, showMultipleChoice, sessionId, userConfig.irregularVerbsIncludeVos]);

  const handleSubmit = () => {
    if (!currentExercise) return;

    const answer = showMultipleChoice ? selectedOption : userAnswer.trim().toLowerCase();
    const correctAnswer = currentExercise.correctAnswer.toLowerCase();
    const correctAnswerAlt = currentExercise.correctAnswerAlt?.toLowerCase();
    
    let isAnswerCorrect: boolean = answer === correctAnswer || 
                         (correctAnswerAlt ? answer === correctAnswerAlt : false);
    
    // For Imperativo Negativo in text input mode, also accept answers with "não" prefix
    if (!isAnswerCorrect && currentExercise.targetTense === 'imperativo_negativo' && !showMultipleChoice) {
      const answerWithoutNao = answer.startsWith('não ') ? answer.substring(4) : answer;
      const answerWithNao = answer.startsWith('não ') ? answer : `não ${answer}`;
      
      isAnswerCorrect = answerWithoutNao === correctAnswer || 
                       answerWithNao === `não ${correctAnswer}` ||
                       Boolean(correctAnswerAlt && (answerWithoutNao === correctAnswerAlt || answerWithNao === `não ${correctAnswerAlt}`));
    }
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    setExerciseCount(prev => prev + 1);
    
    if (isAnswerCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = useCallback(async () => {
    if (isNextLoading) return; // Prevent double-clicks
    
    setIsNextLoading(true);
    
    try {
      await generateExercise();
    } catch (error) {
      console.error('Error generating next exercise:', error);
    } finally {
      // Re-enable button after a brief delay to prevent rapid clicking
      setTimeout(() => {
        setIsNextLoading(false);
      }, 300);
    }
  }, [isNextLoading, generateExercise]);

  // Auto-advance after correct answers with 2-second delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showFeedback && isCorrect) {
      console.log('✅ Correct irregular verb answer detected, auto-advancing in 2 seconds');
      timeoutId = setTimeout(() => {
        handleNext();
      }, 2000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showFeedback, isCorrect, handleNext]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showFeedback) {
        handleNext();
      } else if (!showMultipleChoice) {
        // Only submit in text input mode
        handleSubmit();
      }
    }
  };

  // Global keydown handler for Enter key when feedback is shown
  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && showFeedback) {
      e.preventDefault();
      handleNext();
    }
  };


  // Focus management and global keyboard handling
  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showFeedback) {
        e.preventDefault();
        handleNext();
      }
    };

    if (showFeedback) {
      // Focus on the exercise container when feedback is shown for keyboard navigation
      exerciseContainerRef.current?.focus();
      
      // Add global keyboard listener
      document.addEventListener('keydown', handleGlobalKeyboard);
      
      return () => {
        document.removeEventListener('keydown', handleGlobalKeyboard);
      };
    } else if (!showMultipleChoice && inputRef.current) {
      // Focus on input in text mode when no feedback is shown
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showFeedback, showMultipleChoice, handleNext]);

  // Generate first exercise on mount - use a separate effect to avoid infinite loops
  useEffect(() => {
    const generateInitialExercise = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate-irregular-verbs-exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enabledTenses,
            excludeRecentVerbs: [],
            includeMultipleChoice: true, // Always generate multiple choice options
            sessionId,
            includeVos: userConfig.irregularVerbsIncludeVos ?? false
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data.exercise) {
          setCurrentExercise(data.data.exercise);
          setUserAnswer('');
          setSelectedOption('');
          setShowFeedback(false);
          setIsCorrect(false);
          
          // Add verb to recent verbs (keep last 10)
          setRecentVerbs([data.data.exercise.infinitive]);
          
          // Focus on input if in text mode
          if (!showMultipleChoice) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        } else {
          console.error('Failed to generate exercise:', data.error);
        }
      } catch (error) {
        console.error('Error generating exercise:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInitialExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledTenses, sessionId, userConfig.irregularVerbsIncludeVos]); // Only depend on config-level changes, not display mode

  // Calculate accuracy
  const accuracy = exerciseCount > 0 ? Math.round((correctCount / exerciseCount) * 100) : 0;

  if (isLoading && !currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-card text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--neo-text)' }}>Carregando exercícios...</p>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-card text-center">
          <p style={{ color: 'var(--neo-text)' }}>Não foi possível carregar exercícios.</p>
          <button 
            onClick={() => generateExercise()}
            className="neo-button neo-button-primary mt-4"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--neo-bg)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="neo-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--neo-text)' }}>
              Verbos Irregulares
            </h1>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {exerciseCount > 0 && (
                <span>
                  Exercícios: {exerciseCount} | Acertos: {correctCount} ({accuracy}%)
                </span>
              )}
            </div>
          </div>
          
        </div>

        {/* Exercise */}
        <div 
          ref={exerciseContainerRef}
          className="neo-card"
          onKeyDown={handleGlobalKeyDown}
          tabIndex={showFeedback ? 0 : -1}
        >
          {/* Mode Toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex neo-inset-sm rounded-lg p-1">
              <button
                onClick={() => {
                  // Just switch to text input mode without generating new exercise
                  setShowMultipleChoice(false);
                }}
                className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                  !showMultipleChoice ? 'neo-button-primary' : ''
                }`}
              >
                Digitar Resposta
              </button>
              <button
                onClick={() => {
                  // Just switch to multiple choice mode without generating new exercise
                  setShowMultipleChoice(true);
                }}
                className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                  showMultipleChoice ? 'neo-button-primary' : ''
                }`}
              >
                Mostrar Opções
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <QuestionMarkup 
              question={currentExercise.question}
              className="mb-4"
            />
          </div>

          {currentExercise.multipleChoiceOptions && currentExercise.multipleChoiceOptions.length > 0 && showMultipleChoice ? (
            /* Multiple Choice Mode - Updated to match main learning mode */
            <div className="mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentExercise.multipleChoiceOptions.map((option, index) => {
                  // For Imperativo Negativo, add "não" prefix to display
                  const displayOption = currentExercise.targetTense === 'imperativo_negativo' && !option.startsWith('não ') 
                    ? `não ${option}` 
                    : option;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!showFeedback) {
                          setSelectedOption(option);
                          // Immediately submit the answer when option is clicked
                          const answer = option;
                          const correctAnswer = currentExercise.correctAnswer.toLowerCase();
                          const correctAnswerAlt = currentExercise.correctAnswerAlt?.toLowerCase();
                          
                          const isAnswerCorrect = answer.toLowerCase() === correctAnswer || 
                                               (correctAnswerAlt ? answer.toLowerCase() === correctAnswerAlt : false);
                          
                          setIsCorrect(isAnswerCorrect);
                          setShowFeedback(true);
                          setExerciseCount(prev => prev + 1);
                          
                          if (isAnswerCorrect) {
                            setCorrectCount(prev => prev + 1);
                          }
                        }
                      }}
                      className={`neo-button text-sm sm:text-base p-3 sm:p-4 text-left ${
                        selectedOption === option ? 'neo-button-primary' : ''
                      }`}
                      style={{ 
                        minHeight: '44px',
                        color: selectedOption === option ? 'var(--neo-text-inverted)' : 'var(--neo-text)'
                      }}
                      disabled={showFeedback}
                      data-testid="multiple-choice-option"
                    >
                      {String.fromCharCode(65 + index)}. {displayOption}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Text Input Mode */
            <div className="mb-6">
              {showMultipleChoice && (!currentExercise.multipleChoiceOptions || currentExercise.multipleChoiceOptions.length === 0) && (
                <div className="mb-2 text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                  ℹ️ Opções múltiplas não disponíveis para este exercício
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={showFeedback}
                placeholder="Digite a conjugação..."
                className="neo-input w-full text-lg"
                style={{ padding: '12px 16px' }}
              />
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
            }`}>
              <div className={`font-semibold mb-2 ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '✅ Correto!' : '❌ Incorreto'}
              </div>
              
              {!isCorrect && (
                <div className="text-sm" style={{ color: 'var(--neo-text)' }}>
                  <strong>Resposta correta:</strong> {
                    currentExercise.targetTense === 'imperativo_negativo' 
                      ? `não ${currentExercise.correctAnswer}`
                      : currentExercise.correctAnswer
                  }
                  {currentExercise.correctAnswerAlt && (
                    <span> ou {
                      currentExercise.targetTense === 'imperativo_negativo' 
                        ? `não ${currentExercise.correctAnswerAlt}`
                        : currentExercise.correctAnswerAlt
                    }</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {showFeedback ? (
              <>
                {/* Only show next button for incorrect answers - correct answers auto-advance */}
                {!isCorrect && (
                  <button
                    onClick={handleNext}
                    disabled={isNextLoading}
                    className="neo-button neo-button-primary px-8 py-3"
                  >
                    {isNextLoading ? 'Carregando...' : 'Próximo exercício →'}
                  </button>
                )}
                {/* Show auto-advance message for correct answers */}
                {isCorrect && (
                  <p className="text-sm opacity-70 text-center" style={{ color: 'var(--neo-success-text)' }}>
                    ✨ Próximo exercício em breve...
                  </p>
                )}
              </>
            ) : (
              // Only show Verificar resposta button in text input mode
              !showMultipleChoice && (
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || isLoading}
                  className="neo-button neo-button-primary px-8 py-3"
                >
                  {isLoading ? 'Verificando...' : 'Verificar resposta'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Not logged in prompt */}
        <NotLoggedInPrompt className="mt-8" onViewChange={onViewChange} />
      </div>
    </div>
  );
}