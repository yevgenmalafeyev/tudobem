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
    const isLocal = !!(url && (url.includes('localhost') || url.includes('127.0.0.1')));
    console.log('🗄️ [DEBUG] SmartDatabase mode check:', {
      postgresUrl: url ? `${url.substring(0, 30)}...` : 'NOT_SET',
      isLocal,
      databaseType: isLocal ? 'LocalDatabase' : 'ExerciseDatabase'
    });
    return isLocal;
  }

  private static getActiveDatabase() {
    const db = this.isLocalMode() ? LocalDatabase : ExerciseDatabase;
    console.log('🗄️ [DEBUG] Using database adapter:', this.isLocalMode() ? 'Local' : 'Vercel');
    return db;
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
    console.log('🗄️ [DEBUG] SmartDatabase.getExercises called with filter:', filter);
    const startTime = Date.now();
    try {
      const result = await this.getActiveDatabase().getExercises(filter);
      console.log('🗄️ [DEBUG] SmartDatabase.getExercises completed in', Date.now() - startTime, 'ms, returned', result.length, 'exercises');
      return result;
    } catch (error) {
      console.error('🗄️ [DEBUG] SmartDatabase.getExercises failed after', Date.now() - startTime, 'ms:', error);
      throw error;
    }
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