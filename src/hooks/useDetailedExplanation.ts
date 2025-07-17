import { useState, useCallback } from 'react';
import { Exercise } from '@/types';

interface UseDetailedExplanationProps {
  claudeApiKey?: string;
  explanationLanguage: string;
}

export function useDetailedExplanation({
  claudeApiKey,
  explanationLanguage
}: UseDetailedExplanationProps) {
  const [detailedExplanation, setDetailedExplanation] = useState<string>('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  const generateExplanation = useCallback(async (exercise: Exercise) => {
    if (!exercise || !claudeApiKey) {
      setDetailedExplanation('');
      return;
    }
    
    setIsGeneratingExplanation(true);
    try {
      const response = await fetch('/api/generate-detailed-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise,
          claudeApiKey,
          explanationLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate detailed explanation');
      }

      const result = await response.json();
      setDetailedExplanation(result.explanation || '');
    } catch (error) {
      console.error('Error generating detailed explanation:', error);
      setDetailedExplanation('');
    } finally {
      setIsGeneratingExplanation(false);
    }
  }, [claudeApiKey, explanationLanguage]);

  const clearExplanation = useCallback(() => {
    setDetailedExplanation('');
  }, []);

  return {
    detailedExplanation,
    isGeneratingExplanation,
    generateExplanation,
    clearExplanation
  };
}