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
}

export default function ActionButtons({
  showAnswer,
  hasValidAnswer,
  isLoading,
  appLanguage,
  learningMode,
  onCheckAnswer,
  onNextExercise
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center">
      {!showAnswer ? (
        <>
          {/* Hide "Verificar Resposta" button in multiple choice mode - automatic verification on selection */}
          {learningMode !== 'multiple-choice' && (
            <>
              <button
                onClick={onCheckAnswer}
                disabled={!hasValidAnswer || isLoading}
                className="neo-button neo-button-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
                data-testid="check-answer-button"
              >
                {isLoading ? t('checking', appLanguage) : t('checkAnswer', appLanguage)}
              </button>
              <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
                {t('enterToCheck', appLanguage)}
              </p>
            </>
          )}
          {/* In multiple choice mode, show instructions that selection is automatic */}
          {learningMode === 'multiple-choice' && (
            <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
              {t('selectOption', appLanguage)}
            </p>
          )}
        </>
      ) : (
        <>
          <button
            onClick={onNextExercise}
            disabled={isLoading}
            className="neo-button neo-button-success w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
            data-testid="next-exercise-button"
          >
            {isLoading ? t('loading', appLanguage) : t('nextExercise', appLanguage)}
          </button>
          <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
            {t('enterForNext', appLanguage)}
          </p>
        </>
      )}
    </div>
  );
}