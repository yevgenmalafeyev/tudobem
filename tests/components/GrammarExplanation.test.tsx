import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrammarExplanation from '@/components/learning/GrammarExplanation';
import type { Exercise } from '@/types';

// Mock translations
jest.mock('@/utils/translations', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'grammarRule': 'Grammar Rule',
      'grammarForm': 'Grammar Form'
    };
    return translations[key] || key;
  }
}));

describe('GrammarExplanation', () => {
  const baseExercise: Exercise = {
    id: '1',
    sentence: 'Eu ___ ao cinema.',
    correctAnswer: 'fui',
    topic: 'preterito-perfeito',
    level: 'A2'
  };

  it('should not render when isVisible is false', () => {
    const { container } = render(
      <GrammarExplanation
        exercise={baseExercise}
        appLanguage="en"
        isVisible={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when no grammar rule is provided', () => {
    const { container } = render(
      <GrammarExplanation
        exercise={baseExercise}
        appLanguage="en"
        isVisible={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render grammar rule when provided and visible', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        infinitive: 'ir',
        form: 'pretérito perfeito',
        grammarRule: 'Pretérito perfeito: exprime ações completas no passado. Ir: eu fui, tu foste, ele foi...'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="en"
        isVisible={true}
      />
    );

    expect(screen.getByText('Grammar Rule')).toBeInTheDocument();
    expect(screen.getByText('Pretérito perfeito: exprime ações completas no passado. Ir: eu fui, tu foste, ele foi...')).toBeInTheDocument();
  });

  it('should display grammar form when provided', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        infinitive: 'ir',
        form: 'pretérito perfeito',
        grammarRule: 'Test rule'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="en"
        isVisible={true}
      />
    );

    expect(screen.getByText('Grammar Form:')).toBeInTheDocument();
    expect(screen.getByText('pretérito perfeito')).toBeInTheDocument();
  });

  it('should not display grammar form section when form is not provided', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        infinitive: 'ir',
        grammarRule: 'Test rule'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="en"
        isVisible={true}
      />
    );

    expect(screen.queryByText('Grammar Form:')).not.toBeInTheDocument();
  });

  it('should render with Portuguese language', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        grammarRule: 'Regra em português'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="pt"
        isVisible={true}
      />
    );

    expect(screen.getByText('Regra em português')).toBeInTheDocument();
  });

  it('should render with Ukrainian language', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        grammarRule: 'Українське правило'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="uk"
        isVisible={true}
      />
    );

    expect(screen.getByText('Українське правило')).toBeInTheDocument();
  });

  it('should include book icon in the display', () => {
    const exerciseWithRule: Exercise = {
      ...baseExercise,
      hint: {
        grammarRule: 'Test rule'
      }
    };

    render(
      <GrammarExplanation
        exercise={exerciseWithRule}
        appLanguage="en"
        isVisible={true}
      />
    );

    expect(screen.getByText('📚')).toBeInTheDocument();
  });
});