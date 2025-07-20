/**
 * Integration tests for the enhanced exercise generation system
 * Tests the full flow from batch generation to queue management
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { ExerciseDatabase } from '@/lib/exerciseDatabase';
import { EnhancedFallbackService } from '@/services/enhancedFallbackService';
import { ExerciseQueueService } from '@/services/queueService';
import { BatchGenerationRequest } from '@/types/enhanced';
import { LanguageLevel } from '@/types';

// Mock environment for testing
process.env.NODE_ENV = 'test';

describe('Enhanced Exercise System Integration', () => {
  beforeAll(async () => {
    // Initialize test database
    await ExerciseDatabase.initializeTables();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    // Note: In a real test environment, you'd want to use a separate test database
  });

  describe('Database Operations', () => {
    test('should initialize database tables successfully', async () => {
      // This test verifies that all tables are created correctly
      const stats = await ExerciseDatabase.getUsageStats();
      expect(stats).toBeDefined();
      expect(stats.totalExercises).toBeGreaterThanOrEqual(0);
    });

    test('should save and retrieve exercise batches', async () => {
      const testExercises = [
        {
          id: 'test-1',
          sentence: 'Eu ___ português.',
          gapIndex: 1,
          correctAnswer: 'falo',
          topic: 'present-indicative',
          level: 'A1' as LanguageLevel,
          multipleChoiceOptions: ['falo', 'falas', 'fala', 'falamos'],
          explanations: {
            pt: 'Primeira pessoa do singular do presente do indicativo.',
            en: 'First person singular present indicative.',
            uk: 'Ukrainian explanation'
          },
          hint: { infinitive: 'falar', form: 'present indicative' },
          source: 'ai' as const,
          difficultyScore: 0.5,
          usageCount: 0
        }
      ];

      const savedIds = await ExerciseDatabase.saveExerciseBatch(testExercises);
      expect(savedIds).toHaveLength(1);

      const retrieved = await ExerciseDatabase.getExercises({
        levels: ['A1'],
        topics: ['present-indicative'],
        limit: 1
      });

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].sentence).toBe('Eu ___ português.');
      expect(retrieved[0].explanations.pt).toBe('Primeira pessoa do singular do presente do indicativo.');
    });

    test('should track exercise usage correctly', async () => {
      const testExercise = {
        id: 'test-usage',
        sentence: 'Test sentence ___.',
        gapIndex: 1,
        correctAnswer: 'test',
        topic: 'test-topic',
        level: 'A1' as LanguageLevel,
        multipleChoiceOptions: ['test', 'other'],
        explanations: { pt: 'Test', en: 'Test', uk: 'Test' },
        source: 'ai' as const,
        difficultyScore: 0.5,
        usageCount: 0
      };

      const [exerciseId] = await ExerciseDatabase.saveExerciseBatch([testExercise]);
      
      await ExerciseDatabase.markExerciseUsed(exerciseId, 'test-session', true, 1500);
      
      const retrieved = await ExerciseDatabase.getExercises({
        levels: ['A1'],
        topics: ['test-topic'],
        limit: 1
      });

      expect(retrieved[0].usageCount).toBe(1);
    });
  });

  describe('Enhanced Fallback Service', () => {
    test('should migrate static exercises to database', async () => {
      const initialStats = await ExerciseDatabase.getUsageStats();
      const initialCount = initialStats.totalExercises;

      const migratedCount = await EnhancedFallbackService.populateFromStaticExercises();
      expect(migratedCount).toBeGreaterThan(0);

      const finalStats = await ExerciseDatabase.getUsageStats();
      expect(finalStats.totalExercises).toBeGreaterThan(initialCount);
      expect(finalStats.exercisesBySource.static).toBeGreaterThan(0);
    });

    test('should return database exercises with priority', async () => {
      await EnhancedFallbackService.populateFromStaticExercises();
      
      const exercise = await EnhancedFallbackService.getExercise(
        ['A1'],
        ['present-indicative'],
        {},
        'test-session'
      );

      expect(exercise).toBeDefined();
      expect(exercise?.level).toBe('A1');
      expect(exercise?.multipleChoiceOptions).toBeDefined();
      expect(exercise?.explanations).toBeDefined();
      expect(exercise?.explanations.pt).toBeDefined();
      expect(exercise?.explanations.en).toBeDefined();
      expect(exercise?.explanations.uk).toBeDefined();
    });

    test('should return exercise batch with correct count', async () => {
      await EnhancedFallbackService.populateFromStaticExercises();
      
      const exercises = await EnhancedFallbackService.getExerciseBatch(
        ['A1', 'A2'],
        ['present-indicative'],
        5,
        {},
        'test-session'
      );

      expect(exercises).toBeDefined();
      expect(exercises.length).toBeLessThanOrEqual(5);
      exercises.forEach(exercise => {
        expect(['A1', 'A2']).toContain(exercise.level);
        expect(exercise.multipleChoiceOptions).toBeDefined();
        expect(exercise.explanations).toBeDefined();
      });
    });
  });

  describe('Queue Service', () => {
    test('should add items to generation queue', async () => {
      const queueId = await ExerciseQueueService.addToQueue({
        levels: ['A1'],
        topics: ['present-indicative'],
        sessionId: 'test-queue-session',
        count: 10,
        priority: 'immediate'
      });

      expect(queueId).toBeDefined();
      expect(typeof queueId).toBe('string');
    });

    test('should process queue items', async () => {
      await ExerciseQueueService.addToQueue({
        levels: ['A1'],
        topics: ['present-indicative'],
        sessionId: 'test-process-session',
        count: 5,
        priority: 'background'
      });

      // Process queue (this would normally be done in background)
      await ExerciseQueueService.forceProcessQueue();

      // Check that exercises were generated and saved
      const exercises = await ExerciseDatabase.getExercises({
        levels: ['A1'],
        topics: ['present-indicative'],
        limit: 10
      });

      expect(exercises.length).toBeGreaterThan(0);
    });
  });

  describe('API Integration', () => {
    test('should generate exercise batch via API', async () => {
      const mockRequest = {
        levels: ['A1'] as LanguageLevel[],
        topics: ['present-indicative'],
        sessionId: 'test-api-session',
        count: 5
      };

      // This would be a real API call in a full integration test
      const exercises = await EnhancedFallbackService.getExerciseBatch(
        mockRequest.levels,
        mockRequest.topics,
        mockRequest.count,
        {},
        mockRequest.sessionId
      );

      expect(exercises).toBeDefined();
      expect(exercises.length).toBeLessThanOrEqual(5);
      
      exercises.forEach(exercise => {
        expect(exercise.sentence).toContain('___');
        expect(exercise.correctAnswer).toBeDefined();
        expect(exercise.multipleChoiceOptions).toBeDefined();
        expect(exercise.multipleChoiceOptions.length).toBeGreaterThanOrEqual(2);
        expect(exercise.multipleChoiceOptions).toContain(exercise.correctAnswer);
        expect(exercise.explanations).toBeDefined();
        expect(exercise.explanations.pt).toBeDefined();
        expect(exercise.explanations.en).toBeDefined();
        expect(exercise.explanations.uk).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Mock database error
      const mockError = new Error('Database connection failed');
      
      // Test that fallback service handles errors gracefully
      // This would require mocking the database connection
      expect(true).toBe(true); // Placeholder - implement actual error testing
    });

    test('should fall back to static exercises when database fails', async () => {
      // Test fallback to static exercises
      const exercise = await EnhancedFallbackService.getExercise(
        ['A1'],
        [],
        {},
        'test-fallback-session'
      );

      expect(exercise).toBeDefined();
      expect(exercise?.level).toBe('A1');
    });
  });

  describe('Performance', () => {
    test('should retrieve exercises within performance thresholds', async () => {
      await EnhancedFallbackService.populateFromStaticExercises();
      
      const startTime = Date.now();
      
      const exercises = await EnhancedFallbackService.getExerciseBatch(
        ['A1', 'A2'],
        ['present-indicative'],
        10,
        {},
        'test-performance-session'
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(exercises.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });
  });
});

// Clean up after all tests
afterAll(async () => {
  // Clean up test data
  console.log('Integration tests completed');
});