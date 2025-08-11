import { Exercise, LanguageLevel, AppLanguage } from './index';

export interface GenerateExerciseRequest {
  levels: LanguageLevel[];
  topics: string[];
  claudeApiKey?: string;
}

export interface GenerateExerciseResponse {
  exercise?: Exercise;
  error?: string;
}

export interface CheckAnswerRequest {
  exercise: Exercise;
  userAnswer: string;
  claudeApiKey?: string;
  explanationLanguage?: AppLanguage;
}

export interface CheckAnswerResponse {
  isCorrect: boolean;
  explanation: string;
}


export interface APIError {
  error: string;
  status: number;
}