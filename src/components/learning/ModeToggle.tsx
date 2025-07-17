import { t } from '@/utils/translations';
import type { LearningMode } from '@/hooks/useLearning';
import type { AppLanguage } from '@/types';

interface ModeToggleProps {
  learningMode: LearningMode;
  setLearningMode: (mode: LearningMode) => void;
  appLanguage: AppLanguage;
}

export default function ModeToggle({ learningMode, setLearningMode, appLanguage }: ModeToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-xs sm:text-sm" style={{ color: 'var(--neo-text-muted)' }}>
        {t('learningMode', appLanguage)}:
      </span>
      <div className="flex neo-inset-sm rounded-lg p-1">
        <button
          onClick={() => setLearningMode('input')}
          className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
            learningMode === 'input' ? 'neo-button-primary' : ''
          }`}
        >
          {t('inputMode', appLanguage)}
        </button>
        <button
          onClick={() => setLearningMode('multiple-choice')}
          className={`neo-button text-xs sm:text-sm px-2 sm:px-3 py-1 ${
            learningMode === 'multiple-choice' ? 'neo-button-primary' : ''
          }`}
        >
          {t('multipleChoiceMode', appLanguage)}
        </button>
      </div>
    </div>
  );
}