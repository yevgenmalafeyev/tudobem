import { t } from '@/utils/translations';
import type { AppLanguage } from '@/types';
import type { LearningMode } from '@/hooks/useLearning';

interface ActionButtonsProps {
  showAnswer: boolean;
  hasValidAnswer: boolean;
  isLoading: boolean;
  appLanguage: AppLanguage;
  learningMode: LearningMode;
  onCheckAnswer: () => void;
  onNextExercise: () => void;
  feedback?: { isCorrect: boolean; explanation: string } | null;
  isNextLoading?: boolean;
}

export default function ActionButtons({
  showAnswer,
  hasValidAnswer,
  isLoading,
  appLanguage,
  learningMode,
  onCheckAnswer,
  onNextExercise,
  feedback,
  isNextLoading = false
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-full">
      {!showAnswer ? (
        <>
          {/* Hide "Verificar Resposta" button in multiple choice mode - automatic verification on selection */}
          {learningMode !== 'multiple-choice' && (
            <>
              <button
                onClick={onCheckAnswer}
                disabled={!hasValidAnswer || isLoading}
                className="neo-button neo-button-primary w-full max-w-xs sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
                data-testid="check-answer-button"
              >
                {isLoading ? t('checking', appLanguage) : t('checkAnswer', appLanguage)}
              </button>
              <p className="text-xs sm:text-sm mt-2 opacity-70 text-center px-2" style={{ color: 'var(--neo-text-muted)' }}>
                {t('enterToCheck', appLanguage)}
              </p>
            </>
          )}
          {/* In multiple choice mode, show instructions that selection is automatic */}
          {learningMode === 'multiple-choice' && (
            <p className="text-xs sm:text-sm mt-2 opacity-70 text-center px-2" style={{ color: 'var(--neo-text-muted)' }}>
              {t('selectOption', appLanguage)}
            </p>
          )}
        </>
      ) : (
        <>
          {/* Only show next button for incorrect answers - correct answers auto-advance */}
          {feedback && !feedback.isCorrect && (
            <>
              <button
                onClick={onNextExercise}
                disabled={isLoading || isNextLoading}
                className="neo-button neo-button-success w-full max-w-xs sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
                data-testid="next-exercise-button"
              >
                {isLoading || isNextLoading ? t('loading', appLanguage) : t('nextExercise', appLanguage)}
              </button>
              {!isNextLoading && (
                <p className="text-xs sm:text-sm mt-2 opacity-70 text-center px-2" style={{ color: 'var(--neo-text-muted)' }}>
                  {t('enterForNext', appLanguage)}
                </p>
              )}
            </>
          )}
          {/* Show auto-advance message for correct answers */}
          {feedback && feedback.isCorrect && (
            <p className="text-xs sm:text-sm mt-2 opacity-70 text-center px-2" style={{ color: 'var(--neo-success-text)' }}>
              ✨ Próximo exercício em breve...
            </p>
          )}
        </>
      )}
    </div>
  );
}