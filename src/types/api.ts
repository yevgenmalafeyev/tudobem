import { Exercise, LanguageLevel, ExplanationLanguage } from './index';

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
  explanationLanguage?: ExplanationLanguage;
}

export interface CheckAnswerResponse {
  isCorrect: boolean;
  explanation: string;
}

export interface GenerateMultipleChoiceRequest {
  exercise: Exercise;
  claudeApiKey?: string;
  explanationLanguage?: ExplanationLanguage;
}

export interface GenerateMultipleChoiceResponse {
  options: string[];
}

export interface APIError {
  error: string;
  status: number;
}