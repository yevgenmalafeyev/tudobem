import { Exercise, AppLanguage } from './index';

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