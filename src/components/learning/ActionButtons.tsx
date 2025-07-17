import { t } from '@/utils/translations';
import type { AppLanguage } from '@/types';

interface ActionButtonsProps {
  showAnswer: boolean;
  hasValidAnswer: boolean;
  isLoading: boolean;
  appLanguage: AppLanguage;
  onCheckAnswer: () => void;
  onNextExercise: () => void;
}

export default function ActionButtons({
  showAnswer,
  hasValidAnswer,
  isLoading,
  appLanguage,
  onCheckAnswer,
  onNextExercise
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center">
      {!showAnswer ? (
        <>
          <button
            onClick={onCheckAnswer}
            disabled={!hasValidAnswer || isLoading}
            className="neo-button neo-button-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
          >
            {isLoading ? t('checking', appLanguage) : t('checkAnswer', appLanguage)}
          </button>
          <p className="text-xs sm:text-sm mt-2 opacity-70" style={{ color: 'var(--neo-text-muted)' }}>
            {t('enterToCheck', appLanguage)}
          </p>
        </>
      ) : (
        <>
          <button
            onClick={onNextExercise}
            disabled={isLoading}
            className="neo-button neo-button-success w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
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