import type { Exercise } from '@/types';
import type { AppLanguage } from '@/types';
import { t } from '@/utils/translations';

interface GrammarExplanationProps {
  exercise: Exercise;
  appLanguage: AppLanguage;
  isVisible: boolean;
}

export default function GrammarExplanation({
  exercise,
  appLanguage,
  isVisible
}: GrammarExplanationProps) {
  if (!isVisible || !exercise.hint?.grammarRule) {
    return null;
  }

  return (
    <div className="mt-4 p-4 rounded-lg neo-inset" style={{ 
      backgroundColor: 'var(--neo-bg-secondary)', 
      borderLeft: '4px solid var(--neo-accent)' 
    }}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ 
          backgroundColor: 'var(--neo-accent)', 
          color: 'var(--neo-bg)' 
        }}>
          <span className="text-sm font-bold">📚</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--neo-text)' }}>
            {t('grammarRule', appLanguage)}
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--neo-text-muted)' }}>
            {exercise.hint.grammarRule}
          </p>
          {exercise.hint.form && (
            <div className="mt-2 text-xs" style={{ color: 'var(--neo-accent-text)' }}>
              <strong>{t('grammarForm', appLanguage)}:</strong> {exercise.hint.form}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}