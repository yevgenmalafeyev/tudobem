import { Exercise, LanguageLevel } from './index';

// Enhanced Exercise with multilingual support and options
export interface EnhancedExercise extends Exercise {
  multipleChoiceOptions: string[];
  explanations: {
    pt: string;
    en: string;
    uk: string;
  };
  source?: 'ai' | 'database' | 'static';
  difficultyScore?: number;
  usageCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Batch generation request
export interface BatchGenerationRequest {
  levels: LanguageLevel[];
  topics: string[];
  claudeApiKey?: string;
  masteredWords?: Record<string, unknown>;
  count?: number; // Default: 10
  sessionId: string;
  priority?: 'immediate' | 'background';
}

// Batch generation response
export interface BatchGenerationResponse {
  success: boolean;
  data: {
    exercises: EnhancedExercise[];
    generatedCount: number;
    source: 'ai' | 'database' | 'mixed';
    sessionId: string;
  };
  error?: string;
}

// Exercise queue state
export interface ExerciseQueue {
  exercises: EnhancedExercise[];
  currentIndex: number;
  isBackgroundLoading: boolean;
  nextBatchLoading: boolean;
  generationSource: 'ai' | 'database' | 'fallback';
  sessionId: string;
  totalGenerated: number;
}

// Queue management
export interface QueueItem {
  id: string;
  request: BatchGenerationRequest;
  priority: number; // 1 = immediate, 0 = background
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}

// Database service interfaces
export interface ExerciseFilter {
  levels?: LanguageLevel[];
  topics?: string[];
  source?: 'ai' | 'database' | 'static';
  excludeUsed?: boolean;
  sessionId?: string;
  limit?: number;
}

export interface UsageStats {
  totalExercises: number;
  exercisesByLevel: Record<LanguageLevel, number>;
  exercisesByTopic: Record<string, number>;
  exercisesBySource: Record<string, number>;
  averageUsageCount: number;
}

export interface ExerciseSession {
  id: string;
  userSessionId: string;
  exerciseId: string;
  answeredCorrectly: boolean;
  responseTimeMs: number;
  createdAt: Date;
}

// Generation queue database record
export interface GenerationQueueRecord {
  id: string;
  userSessionId: string;
  levels: LanguageLevel[];
  topics: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  processedAt?: Date;
}