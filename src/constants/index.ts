import { LanguageLevel } from '@/types';

export const LANGUAGE_LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const COMMON_PORTUGUESE_WORDS = [
  'é', 'está', 'tem', 'vai', 'foi', 'ser', 'ter', 'uma', 'para', 'com', 'por'
];

export const ANTHROPIC_CONFIG = {
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: {
    exercise: 1500,
    explanation: 800,
    multipleChoice: 300
  }
} as const;

export const LEVENSHTEIN_THRESHOLD = 1;
export const MAX_DISTRACTORS = 3;
export const FALLBACK_DISTRACTORS_COUNT = 6;

export const DEFAULT_CONFIGURATION = {
  selectedLevels: ['A1', 'A2'] as LanguageLevel[],
  selectedTopics: [],
  explanationLanguage: 'pt' as const,
  appLanguage: 'pt' as const
};

export const ERROR_MESSAGES = {
  pt: {
    noExercises: 'Nenhum exercício disponível',
    generateFailed: 'Falha ao gerar exercício',
    checkFailed: 'Falha ao verificar resposta'
  },
  en: {
    noExercises: 'No exercises available',
    generateFailed: 'Failed to generate exercise',
    checkFailed: 'Failed to check answer'
  },
  uk: {
    noExercises: 'Немає доступних вправ',
    generateFailed: 'Не вдалося створити вправу',
    checkFailed: 'Не вдалося перевірити відповідь'
  }
} as const;