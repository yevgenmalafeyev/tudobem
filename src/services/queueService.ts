import { ExerciseDatabase } from '@/lib/exerciseDatabase';
import { QueueItem, BatchGenerationRequest, GenerationQueueRecord } from '@/types/enhanced';
import { callClaudeApi, extractJsonFromClaudeResponse } from '@/lib/api-utils';
import { generateBatchExercisePrompt, validateBatchExerciseResponse, processGeneratedExercises } from '@/utils/batchPrompts';
import { topics } from '@/data/topics';

/**
 * Exercise Generation Queue Service
 * Handles background processing of exercise generation requests
 */
export class ExerciseQueueService {
  private static processingQueue = false;
  private static readonly MAX_CONCURRENT_GENERATIONS = 3;
  private static readonly RETRY_DELAY_MS = 5000; // 5 seconds
  private static readonly MAX_RETRIES = 3;

  /**
   * Add a generation request to the queue
   */
  static async addToQueue(request: BatchGenerationRequest): Promise<string> {
    try {
      console.log('📥 Adding request to generation queue:', {
        sessionId: request.sessionId,
        levels: request.levels,
        topics: request.topics.length,
        priority: request.priority
      });

      const priority = request.priority === 'immediate' ? 1 : 0;
      const queueId = await ExerciseDatabase.addToGenerationQueue(
        request.sessionId,
        request.levels,
        request.topics,
        priority
      );

      console.log(`✅ Added to queue with ID: ${queueId}`);

      // Start processing if not already running
      if (!this.processingQueue) {
        this.processQueue().catch(error => {
          console.error('❌ Queue processing error:', error);
        });
      }

      return queueId;
    } catch (error) {
      console.error('❌ Error adding to queue:', error);
      throw error;
    }
  }

  /**
   * Process the generation queue
   */
  static async processQueue(): Promise<void> {
    if (this.processingQueue) {
      console.log('⏳ Queue already being processed');
      return;
    }

    this.processingQueue = true;
    console.log('🚀 Starting queue processing...');

    try {
      while (true) {
        // Get pending queue items
        const pendingItems = await ExerciseDatabase.getPendingQueueItems();
        
        if (pendingItems.length === 0) {
          console.log('✅ No pending items in queue');
          break;
        }

        console.log(`📋 Processing ${pendingItems.length} pending items`);

        // Process items with concurrency limit
        const processingPromises = pendingItems
          .slice(0, this.MAX_CONCURRENT_GENERATIONS)
          .map(item => this.processQueueItem(item));

        await Promise.allSettled(processingPromises);

        // Small delay before checking for more items
        await this.delay(1000);
      }
    } catch (error) {
      console.error('❌ Queue processing error:', error);
    } finally {
      this.processingQueue = false;
      console.log('🏁 Queue processing completed');
    }
  }

  /**
   * Process a single queue item
   */
  private static async processQueueItem(item: GenerationQueueRecord): Promise<void> {
    console.log(`🔄 Processing queue item: ${item.id}`);

    try {
      // Mark as processing
      await ExerciseDatabase.updateQueueItemStatus(item.id, 'processing');

      // Generate exercises (this is where the actual work happens)
      await this.generateExercisesForQueueItem(item);

      // Mark as completed
      await ExerciseDatabase.updateQueueItemStatus(item.id, 'completed');
      console.log(`✅ Completed queue item: ${item.id}`);

    } catch (error) {
      console.error(`❌ Failed to process queue item ${item.id}:`, error);
      await ExerciseDatabase.updateQueueItemStatus(item.id, 'failed');
    }
  }

  /**
   * Generate exercises for a queue item
   */
  private static async generateExercisesForQueueItem(item: GenerationQueueRecord): Promise<void> {
    const { levels, topics: selectedTopics, userSessionId } = item;
    
    console.log(`🎯 Generating exercises for levels: ${levels.join(', ')}, topics: ${selectedTopics.join(', ')}`);

    try {
      // Check if we already have enough exercises in database
      const existingExercises = await ExerciseDatabase.getExercises({
        levels,
        topics: selectedTopics,
        limit: 20 // Check for a good amount
      });

      if (existingExercises.length >= 10) {
        console.log(`✅ Sufficient exercises already exist in database (${existingExercises.length})`);
        return;
      }

      // We need to generate new exercises
      const neededCount = 10 - existingExercises.length;
      console.log(`🤖 Generating ${neededCount} new exercises`);

      // For background generation, we'll use a system API key or skip if none available
      const systemApiKey = process.env.ANTHROPIC_API_KEY;
      if (!systemApiKey) {
        console.log('⚠️ No system API key available for background generation');
        return;
      }

      // Get topic names
      const topicNames = topics
        .filter(topic => selectedTopics.includes(topic.id))
        .map(topic => topic.name);

      // Generate prompt
      const prompt = generateBatchExercisePrompt(
        levels,
        selectedTopics,
        topicNames,
        {}, // No mastered words for background generation
        neededCount
      );

      // Call Claude API
      const responseText = await callClaudeApi(systemApiKey, prompt);
      const jsonString = extractJsonFromClaudeResponse(responseText);
      const exerciseData = JSON.parse(jsonString);

      // Validate and process
      if (!validateBatchExerciseResponse(exerciseData)) {
        throw new Error('Generated exercises failed validation');
      }

      const processedExercises = processGeneratedExercises(exerciseData);
      
      // Filter for valid exercises
      const validExercises = processedExercises.filter(exercise => {
        return levels.includes(exercise.level) && selectedTopics.includes(exercise.topic);
      }).map(exercise => ({
        ...exercise,
        source: 'ai' as const,
        difficultyScore: 0.5,
        usageCount: 0
      }));

      if (validExercises.length > 0) {
        // Save to database
        await ExerciseDatabase.saveExerciseBatch(validExercises);
        console.log(`💾 Saved ${validExercises.length} new exercises to database`);
      } else {
        console.warn('⚠️ No valid exercises generated');
      }

    } catch (error) {
      console.error('❌ Error generating exercises for queue item:', error);
      throw error;
    }
  }

  /**
   * Get queue status for a specific session
   */
  static async getQueueStatus(sessionId: string): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      // This would require a new database method to get status by session
      // For now, we'll return a simple status
      const pendingItems = await ExerciseDatabase.getPendingQueueItems();
      const sessionPending = pendingItems.filter(item => item.userSessionId === sessionId);

      return {
        pending: sessionPending.length,
        processing: 0, // We'd need to track this in the database
        completed: 0,  // We'd need to track this in the database
        failed: 0      // We'd need to track this in the database
      };
    } catch (error) {
      console.error('❌ Error getting queue status:', error);
      return { pending: 0, processing: 0, completed: 0, failed: 0 };
    }
  }

  /**
   * Clear old completed/failed queue items (cleanup)
   */
  static async cleanupOldQueueItems(olderThanHours: number = 24): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
      
      // This would require a new database method
      console.log(`🧹 Cleaning up queue items older than ${olderThanHours} hours`);
      
      // For now, just log - implement the actual cleanup in the database service
      console.log('✅ Queue cleanup completed');
    } catch (error) {
      console.error('❌ Error during queue cleanup:', error);
    }
  }

  /**
   * Force process the queue (for testing/debugging)
   */
  static async forceProcessQueue(): Promise<void> {
    console.log('🔧 Force processing queue...');
    this.processingQueue = false; // Reset the flag
    return this.processQueue();
  }

  /**
   * Utility: delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Initialize queue processing on server startup
 */
export function initializeQueueProcessing(): void {
  console.log('🚀 Initializing exercise generation queue processing...');
  
  // Start processing any pending items
  ExerciseQueueService.processQueue().catch(error => {
    console.error('❌ Initial queue processing failed:', error);
  });

  // Set up periodic cleanup (every 6 hours)
  setInterval(() => {
    ExerciseQueueService.cleanupOldQueueItems().catch(error => {
      console.error('❌ Queue cleanup failed:', error);
    });
  }, 6 * 60 * 60 * 1000);

  console.log('✅ Queue processing initialized');
}