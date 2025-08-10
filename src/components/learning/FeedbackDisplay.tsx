import { t } from '@/utils/translations';
import type { AppLanguage } from '@/types';
import type { EnhancedExercise } from '@/types/enhanced';
import GrammarExplanation from './GrammarExplanation';

interface FeedbackDisplayProps {
  feedback: { isCorrect: boolean; explanation: string } | null;
  appLanguage: AppLanguage;
  detailedExplanation?: string;
  currentExercise?: EnhancedExercise | null;
}

export default function FeedbackDisplay({ 
  feedback, 
  appLanguage, 
  detailedExplanation, 
  currentExercise 
}: FeedbackDisplayProps) {
  if (!feedback) return null;

  // Get multilingual explanation from enhanced exercise
  const getEnhancedExplanation = () => {
    if (!currentExercise?.explanations) return null;
    
    // Map app language to explanation language
    const explanationLang = appLanguage === 'pt' ? 'pt' : appLanguage === 'uk' ? 'uk' : 'en';
    return currentExercise.explanations[explanationLang];
  };

  const enhancedExplanation = getEnhancedExplanation();

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
        
        {/* Enhanced multilingual explanation for wrong answers */}
        {!feedback.isCorrect && enhancedExplanation && (
          <div className="mt-3 p-3 neo-inset-sm rounded" style={{ backgroundColor: 'var(--neo-background-muted)' }}>
            <div className="flex items-center mb-2" style={{ color: 'var(--neo-text)' }}>
              <span className="font-medium">💡 {t('explanation', appLanguage)}:</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full" 
                    style={{ backgroundColor: 'var(--neo-accent)', color: 'var(--neo-accent-text)' }}>
                {appLanguage === 'pt' ? 'PT' : appLanguage === 'uk' ? 'UK' : 'EN'}
              </span>
            </div>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {enhancedExplanation}
            </div>
          </div>
        )}
        
        {/* Legacy detailed explanation fallback */}
        {!feedback.isCorrect && !enhancedExplanation && detailedExplanation && (
          <div className="mt-3 p-3 neo-inset-sm rounded" style={{ backgroundColor: 'var(--neo-background-muted)' }}>
            <div className="font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
              📚 Grammar Details:
            </div>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {detailedExplanation}
            </div>
          </div>
        )}
        
        {/* Grammar explanation for incorrect answers */}
        {currentExercise && (
          <GrammarExplanation 
            exercise={currentExercise}
            appLanguage={appLanguage}
            isVisible={!feedback.isCorrect}
          />
        )}
      </div>
    </div>
  );
}