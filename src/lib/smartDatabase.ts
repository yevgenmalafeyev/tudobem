import { ExerciseDatabase } from './exerciseDatabase';
import { LocalDatabase } from './localDatabase';
import { 
  EnhancedExercise, 
  ExerciseFilter, 
  UsageStats, 
  ExerciseSession,
  GenerationQueueRecord 
} from '@/types/enhanced';
import { LanguageLevel } from '@/types';

/**
 * Smart Database - automatically chooses between Vercel Postgres and Local Postgres
 */
export class SmartDatabase {
  private static isLocalMode(): boolean {
    const url = process.env.POSTGRES_URL;
    return !!(url && (url.includes('localhost') || url.includes('127.0.0.1')));
  }

  private static getActiveDatabase() {
    return this.isLocalMode() ? LocalDatabase : ExerciseDatabase;
  }

  /**
   * Check if database is available
   */
  static isDatabaseAvailable(): boolean {
    return this.getActiveDatabase().isDatabaseAvailable();
  }

  /**
   * Initialize database tables if they don't exist
   */
  static async initializeTables(): Promise<void> {
    console.log(`🔄 Using ${this.isLocalMode() ? 'Local' : 'Vercel'} Postgres adapter`);
    return this.getActiveDatabase().initializeTables();
  }

  /**
   * Save a batch of exercises to the database
   */
  static async saveExerciseBatch(exercises: EnhancedExercise[]): Promise<string[]> {
    return this.getActiveDatabase().saveExerciseBatch(exercises);
  }

  /**
   * Get exercises by level and topic with filtering
   */
  static async getExercises(filter: ExerciseFilter): Promise<EnhancedExercise[]> {
    return this.getActiveDatabase().getExercises(filter);
  }

  /**
   * Mark an exercise as used and track session
   */
  static async markExerciseUsed(
    exerciseId: string, 
    sessionId: string, 
    answeredCorrectly: boolean,
    responseTimeMs?: number
  ): Promise<void> {
    return this.getActiveDatabase().markExerciseUsed(exerciseId, sessionId, answeredCorrectly, responseTimeMs);
  }

  /**
   * Get exercise usage statistics
   */
  static async getUsageStats(): Promise<UsageStats> {
    return this.getActiveDatabase().getUsageStats();
  }

  /**
   * Add generation request to queue (Vercel Postgres only for now)
   */
  static async addToGenerationQueue(
    userSessionId: string,
    levels: LanguageLevel[],
    topics: string[],
    priority: number = 0
  ): Promise<string> {
    if (this.isLocalMode()) {
      // For local development, we'll skip the queue for now
      console.log('⚠️ Generation queue not implemented for local database');
      return 'local-queue-placeholder';
    }
    return ExerciseDatabase.addToGenerationQueue(userSessionId, levels, topics, priority);
  }

  /**
   * Get pending generation queue items (Vercel Postgres only for now)
   */
  static async getPendingQueueItems(): Promise<GenerationQueueRecord[]> {
    if (this.isLocalMode()) {
      return [];
    }
    return ExerciseDatabase.getPendingQueueItems();
  }

  /**
   * Update queue item status (Vercel Postgres only for now)
   */
  static async updateQueueItemStatus(
    queueId: string, 
    status: 'processing' | 'completed' | 'failed'
  ): Promise<void> {
    if (this.isLocalMode()) {
      return;
    }
    return ExerciseDatabase.updateQueueItemStatus(queueId, status);
  }
}