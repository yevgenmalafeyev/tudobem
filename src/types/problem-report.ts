export type ProblemType = 'irrelevant_hint' | 'incorrect_answer' | 'missing_option' | 'other';

export interface ProblemReport {
  id: string;
  userId?: string;
  exerciseId: string;
  problemType: ProblemType;
  userComment: string;
  status: 'pending' | 'accepted' | 'declined';
  adminComment?: string;
  aiResponse?: {
    isValid: boolean;
    explanation: string;
    sqlCorrection?: string;
  };
  createdAt: Date;
  processedAt?: Date | null;
  processedBy?: string;
}

export interface ProblemReportWithExercise extends ProblemReport {
  exercise: {
    sentence: string;
    correctAnswer: string;
    hint?: string;
    multipleChoiceOptions?: string[];
    level: string;
    topic: string;
    explanation?: string;
  };
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemReportSubmission {
  exerciseId: string;
  problemType: ProblemType;
  userComment: string;
}

export interface AIAssistanceResponse {
  isValid: boolean;
  explanation: string;
  sqlCorrection?: string;
}