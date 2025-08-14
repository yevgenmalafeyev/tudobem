'use client';

import { useState } from 'react';
import { Exercise, AppLanguage } from '@/types';
import { ProblemType, ProblemReportSubmission } from '@/types/problem-report';

interface ProblemReportButtonProps {
  exercise: Exercise;
  showAnswer: boolean;
  learningMode: 'input' | 'multiple-choice';
  appLanguage: AppLanguage;
  feedback?: { isCorrect: boolean; explanation: string } | null;
}

interface ProblemReportModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  appLanguage: AppLanguage;
}

function ProblemReportModal({ exercise, isOpen, onClose, appLanguage }: ProblemReportModalProps) {
  const [selectedProblemType, setSelectedProblemType] = useState<ProblemType>('other');
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple translation helper
  const getText = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      pt: {
        title: 'Reportar um Problema',
        thankYou: 'Obrigado!',
        submitted: 'O seu problema foi reportado com sucesso.',
        exercisePreview: 'Exercício',
        sentence: 'Frase',
        correctAnswer: 'Resposta Correta',
        hint: 'Dica',
        options: 'Opções',
        selectProblem: 'Selecione o tipo de problema:',
        detailsLabel: 'Descreva o problema em detalhe',
        required: 'obrigatório',
        detailsPlaceholder: 'Por favor, descreva o problema que encontrou...',
        cancel: 'Cancelar',
        submit: 'Enviar',
        submitting: 'A enviar...',
        button: 'Reportar Problema',
        buttonTitle: 'Reportar um problema com este exercício',
        submitError: 'Erro ao enviar o relatório',
        networkError: 'Erro de rede. Tente novamente.'
      },
      en: {
        title: 'Report a Problem',
        thankYou: 'Thank you!',
        submitted: 'Your problem report has been submitted successfully.',
        exercisePreview: 'Exercise',
        sentence: 'Sentence',
        correctAnswer: 'Correct Answer',
        hint: 'Hint',
        options: 'Options',
        selectProblem: 'Select the type of problem:',
        detailsLabel: 'Describe the problem in detail',
        required: 'required',
        detailsPlaceholder: 'Please describe the problem you encountered...',
        cancel: 'Cancel',
        submit: 'Submit',
        submitting: 'Submitting...',
        button: 'Report Problem',
        buttonTitle: 'Report a problem with this exercise',
        submitError: 'Error submitting report',
        networkError: 'Network error. Please try again.'
      }
    };
    return translations[appLanguage] ? (translations[appLanguage][key] || translations['en'][key]) : translations['en'][key];
  };

  const problemTypes = [
    { value: 'irrelevant_hint', label: appLanguage === 'pt' ? 'Dica irrelevante' : 'Irrelevant hint' },
    { value: 'incorrect_answer', label: appLanguage === 'pt' ? 'Resposta incorreta' : 'Incorrect answer' },
    { value: 'missing_option', label: appLanguage === 'pt' ? 'Opção em falta' : 'Missing option' },
    { value: 'other', label: appLanguage === 'pt' ? 'Outro' : 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userComment.trim() || userComment.length < 10) {
      setError(appLanguage === 'pt' ? 'O comentário deve ter pelo menos 10 caracteres' : 'Comment must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submission: ProblemReportSubmission = {
        exerciseId: exercise.id,
        problemType: selectedProblemType,
        userComment: userComment.trim()
      };

      const response = await fetch('/api/problem-reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        setSubmitted(true);
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form state when modal closes
          setTimeout(() => {
            setSubmitted(false);
            setSelectedProblemType('other');
            setUserComment('');
            setError(null);
          }, 300);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || getText('submitError'));
      }
    } catch (error) {
      console.error('Error submitting problem report:', error);
      setError(getText('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--neo-success-text)' }}>
              {getText('thankYou')}
            </h2>
            <p style={{ color: 'var(--neo-text-secondary)' }}>
              {getText('submitted')}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--neo-text)' }}>
                {getText('title')}
              </h2>
              <button
                onClick={onClose}
                className="neo-button-sm text-lg leading-none px-3 py-1"
                style={{ color: 'var(--neo-text-secondary)' }}
              >
                ×
              </button>
            </div>

            {/* Exercise Preview */}
            <div className="neo-inset p-4 mb-6">
              <h3 className="font-semibold mb-2" style={{ color: 'var(--neo-text)' }}>
                {getText('exercisePreview')}
              </h3>
              <div className="text-sm" style={{ color: 'var(--neo-text-secondary)' }}>
                <p><strong>{getText('sentence')}:</strong> {exercise.sentence}</p>
                <p><strong>{getText('correctAnswer')}:</strong> {exercise.correctAnswer}</p>
                {exercise.hint && (
                  <p><strong>{getText('hint')}:</strong> {exercise.hint}</p>
                )}
                {exercise.multipleChoiceOptions && exercise.multipleChoiceOptions.length > 0 && (
                  <p><strong>{getText('options')}:</strong> {exercise.multipleChoiceOptions.join(', ')}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Problem Type Selection */}
              <div className="mb-6">
                <label className="block font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  {getText('selectProblem')}
                </label>
                <div className="space-y-2">
                  {problemTypes.map((type) => (
                    <label key={type.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="problemType"
                        value={type.value}
                        checked={selectedProblemType === type.value}
                        onChange={(e) => setSelectedProblemType(e.target.value as ProblemType)}
                        className="mr-3"
                        data-testid="problem-type"
                      />
                      <span style={{ color: 'var(--neo-text)' }}>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comment Text Area */}
              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ color: 'var(--neo-text)' }}>
                  {getText('detailsLabel')}
                  <span className="text-sm font-normal" style={{ color: 'var(--neo-text-secondary)' }}>
                    {' '}({getText('required')})
                  </span>
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder={getText('detailsPlaceholder')}
                  className="neo-inset w-full h-32 p-3 resize-none"
                  maxLength={1000}
                  required
                  data-testid="problem-comment"
                />
                <div className="text-sm mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                  {userComment.length}/1000
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 neo-inset border-l-4" style={{ 
                  borderLeftColor: 'var(--neo-error)',
                  backgroundColor: 'var(--neo-error-bg)',
                  color: 'var(--neo-error)'
                }}>
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="neo-button px-6 py-2"
                  disabled={isSubmitting}
                >
                  {getText('cancel')}
                </button>
                <button
                  type="submit"
                  className="neo-button neo-button-primary px-6 py-2"
                  disabled={isSubmitting || userComment.length < 10}
                >
                  {isSubmitting ? getText('submitting') : getText('submit')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProblemReportButton({ exercise, showAnswer, learningMode, appLanguage, feedback }: ProblemReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show button when:
  // 1. In input mode and exercise is shown but not answered yet
  // 2. In input mode and answer is shown but user got it wrong
  const shouldShow = learningMode === 'input' && 
    (!showAnswer || (showAnswer && feedback && !feedback.isCorrect));

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="neo-button neo-button-sm text-sm px-3 py-1 ml-2"
        style={{ color: 'var(--neo-text-secondary)' }}
        title={appLanguage === 'pt' ? 'Reportar um problema com este exercício' : 'Report a problem with this exercise'}
        data-testid="report-problem-button"
      >
        {appLanguage === 'pt' ? 'Reportar Problema' : 'Report Problem'}
      </button>

      <ProblemReportModal
        exercise={exercise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appLanguage={appLanguage}
      />
    </>
  );
}