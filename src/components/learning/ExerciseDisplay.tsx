import { RefObject } from 'react';
import type { Exercise } from '@/types';
import type { LearningMode } from '@/hooks/useLearning';

interface ExerciseDisplayProps {
  exercise: Exercise;
  learningMode: LearningMode;
  userAnswer: string;
  selectedOption: string;
  showAnswer: boolean;
  feedback: { isCorrect: boolean; explanation: string } | null;
  inputRef: RefObject<HTMLInputElement | null>;
  setUserAnswer: (answer: string) => void;
}

export default function ExerciseDisplay({
  exercise,
  learningMode,
  userAnswer,
  selectedOption,
  showAnswer,
  feedback,
  inputRef,
  setUserAnswer
}: ExerciseDisplayProps) {
  const sentenceParts = exercise.sentence.split('___');
  
  // Create hint text for placeholder
  const hintText = exercise.hint && (exercise.hint.infinitive || exercise.hint.person) 
    ? `${exercise.hint.infinitive || ''}${exercise.hint.person ? (exercise.hint.infinitive ? ', ' : '') + exercise.hint.person : ''}`
    : '?';

  return (
    <div className="exercise-container neo-card-sm text-base sm:text-lg lg:text-xl xl:text-2xl mb-3 sm:mb-4 lg:mb-6 leading-relaxed" style={{ color: 'var(--neo-text)' }}>
      {sentenceParts[0]}
      <span className="inline-block mx-1 sm:mx-2 min-w-12 sm:min-w-16 lg:min-w-24 text-center">
        {showAnswer ? (
          <span 
            className={`font-bold neo-outset-sm px-2 py-1`} 
            style={{ 
              color: feedback?.isCorrect ? 'var(--neo-success-text)' : 'var(--neo-error)' 
            }}
          >
            {feedback?.isCorrect ? (learningMode === 'input' ? userAnswer : selectedOption) : exercise.correctAnswer}
          </span>
        ) : learningMode === 'input' ? (
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="neo-inset text-center min-w-12 sm:min-w-16 lg:min-w-24 text-base sm:text-lg lg:text-xl xl:text-2xl placeholder:text-gray-400 placeholder:opacity-70"
            placeholder={hintText}
            disabled={showAnswer}
            data-testid="exercise-input"
          />
        ) : (
          <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
            ?
          </span>
        )}
      </span>
      {sentenceParts[1]}
    </div>
  );
}