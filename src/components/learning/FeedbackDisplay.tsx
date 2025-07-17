import { t } from '@/utils/translations';
import type { AppLanguage } from '@/types';

interface FeedbackDisplayProps {
  feedback: { isCorrect: boolean; explanation: string } | null;
  appLanguage: AppLanguage;
  detailedExplanation?: string;
}

export default function FeedbackDisplay({ feedback, appLanguage, detailedExplanation }: FeedbackDisplayProps) {
  if (!feedback) return null;

  return (
    <div className="neo-inset mb-4 sm:mb-6 p-3 sm:p-4">
      <div 
        className={`font-semibold mb-2 text-sm sm:text-base`} 
        style={{ color: feedback.isCorrect ? 'var(--neo-success-text)' : 'var(--neo-error)' }}
      >
        {feedback.isCorrect ? `✓ ${t('correct', appLanguage)}` : `✗ ${t('incorrect', appLanguage)}`}
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
  );
}