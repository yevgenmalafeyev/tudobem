export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Topic {
  id: string;
  name: string;
  namePt: string;
  levels: LanguageLevel[];
}

export type ExplanationLanguage = 'pt' | 'en' | 'uk';
export type AppLanguage = 'pt' | 'en' | 'uk';

export interface UserConfiguration {
  selectedLevels: LanguageLevel[];
  selectedTopics: string[];
  appLanguage: AppLanguage;
  claudeApiKey?: string;
}

export interface Exercise {
  id: string;
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: LanguageLevel;
  hint?: string;  // Changed to simple string for flexibility
  multipleChoiceOptions?: string[];
  detailedExplanation?: string;
}

export interface UserProgress {
  incorrectAnswers: Record<string, number>;
  reviewQueue: string[];
  masteredWords: Record<string, {
    word: string;
    infinitive?: string;
    form?: string;
    masteredAt: Date;
    topic: string;
    level: LanguageLevel;
  }>;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardCollection {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}