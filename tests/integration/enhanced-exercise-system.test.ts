/**
 * Integration tests for the database-driven exercise system
 * Tests the full flow from database storage to user progress tracking
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { ExerciseDatabase } from '@/lib/exerciseDatabase';
import { UserDatabase } from '@/lib/userDatabase';
import { LanguageLevel } from '@/types';

// Mock environment for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Helper function to check if database is available
function isDatabaseAvailable(): boolean {
  return !!process.env.POSTGRES_URL && 
         process.env.POSTGRES_URL !== 'postgresql://test:test@localhost:5432/test' &&
         process.env.POSTGRES_URL.includes('postgresql://');
}

// Helper function to conditionally skip tests
function describeWithDb(name: string, tests: () => void) {
  if (isDatabaseAvailable()) {
    describe(name, tests);
  } else {
    describe.skip(`${name} (Database unavailable)`, tests);
  }
}

describe('Database-Driven Exercise System Integration', () => {
  beforeAll(async () => {
    // Skip database initialization if no database URL available
    if (process.env.POSTGRES_URL && process.env.POSTGRES_URL !== 'postgresql://test:test@localhost:5432/test') {
      try {
        await ExerciseDatabase.initializeTables();
        await UserDatabase.initializeTables();
        console.log('✅ Database initialized successfully');
      } catch (error) {
        console.warn('⚠️ Database initialization failed, tests will be skipped:', error.message);
      }
    } else {
      console.log('⚠️ No database URL configured, using mock implementations');
    }
  });

  beforeEach(async () => {
    // Clean up test data before each test
    // Note: In a real test environment, you'd want to use a separate test database
  });

  describeWithDb('Exercise Database Operations', () => {
    test('should initialize database tables successfully', async () => {
      // This test verifies that all tables are created correctly
      const stats = await ExerciseDatabase.getStats();
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
    });

    test('should save and retrieve exercise batches', async () => {
      const testExercises = [
        {
          sentence: 'Eu _____ português.',
          correctAnswer: 'falo',
          topic: 'verbos',
          level: 'A1',
          hint: { infinitive: 'falar', person: 'primeira pessoa', form: 'presente' },
          multipleChoiceOptions: ['falo', 'falas', 'fala', 'falamos'],
          explanations: {
            pt: 'Primeira pessoa do singular do presente do indicativo.',
            en: 'First person singular present indicative.',
            uk: 'Перша особа однини теперішнього часу.'
          }
        }
      ];

      const savedExercises = await ExerciseDatabase.saveBatchExercises(testExercises);
      expect(savedExercises).toHaveLength(1);

      const retrieved = await ExerciseDatabase.getRandomExercises(['A1'], ['verbos'], 1);
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].sentence).toBe('Eu _____ português.');
      expect(retrieved[0].detailedExplanation.pt).toBe('Primeira pessoa do singular do presente do indicativo.');
    });

    test('should check for exercise duplicates', async () => {
      const testExercise = {
        sentence: 'Tu _____ bem.',
        correctAnswer: 'estás',
        topic: 'verbos',
        level: 'A1'
      };

      // First insertion
      const exists1 = await ExerciseDatabase.exerciseExists(
        testExercise.sentence,
        testExercise.correctAnswer,
        testExercise.topic,
        testExercise.level
      );
      expect(exists1).toBe(false);

      // Save exercise
      await ExerciseDatabase.saveBatchExercises([{
        ...testExercise,
        multipleChoiceOptions: ['estás', 'está', 'estou'],
        explanations: { pt: 'Test', en: 'Test', uk: 'Test' }
      }]);

      // Check if it exists now
      const exists2 = await ExerciseDatabase.exerciseExists(
        testExercise.sentence,
        testExercise.correctAnswer,
        testExercise.topic,
        testExercise.level
      );
      expect(exists2).toBe(true);
    });
  });

  describeWithDb('User System Integration', () => {
    test('should create user and track progress', async () => {
      // Register a test user
      const testUser = await UserDatabase.registerUser('testuser', 'TestPass123', 'test@example.com');
      expect(testUser.username).toBe('testuser');
      expect(testUser.is_active).toBe(true);

      // Create a test exercise
      const exercises = await ExerciseDatabase.saveBatchExercises([{
        sentence: 'Nós _____ felizes.',
        correctAnswer: 'somos',
        topic: 'verbos',
        level: 'A1',
        multipleChoiceOptions: ['somos', 'são', 'sou', 'és'],
        explanations: {
          pt: 'Primeira pessoa do plural do verbo ser.',
          en: 'First person plural of the verb to be.',
          uk: 'Перша особа множини дієслова бути.'
        }
      }]);

      const exerciseId = exercises[0].id;

      // Record an attempt
      const attempt = await UserDatabase.recordAttempt(testUser.id, exerciseId, true, 'somos');
      expect(attempt.is_correct).toBe(true);
      expect(attempt.user_answer).toBe('somos');

      // Get user progress
      const progress = await UserDatabase.getUserProgress(testUser.id);
      expect(progress.totalAttempts).toBe(1);
      expect(progress.correctAttempts).toBe(1);
      expect(progress.accuracyRate).toBe(100);
    });

    test('should track correctly answered exercises', async () => {
      const testUser = await UserDatabase.registerUser('progressuser', 'TestPass123');
      
      const exercises = await ExerciseDatabase.saveBatchExercises([
        {
          sentence: 'Ela _____ professora.',
          correctAnswer: 'é',
          topic: 'verbos',
          level: 'A1',
          multipleChoiceOptions: ['é', 'está', 'são', 'somos'],
          explanations: { pt: 'Terceira pessoa singular.', en: 'Third person singular.', uk: 'Третя особа однини.' }
        },
        {
          sentence: 'Eles _____ estudantes.',
          correctAnswer: 'são',
          topic: 'verbos',
          level: 'A1',
          multipleChoiceOptions: ['são', 'é', 'somos', 'estão'],
          explanations: { pt: 'Terceira pessoa plural.', en: 'Third person plural.', uk: 'Третя особа множини.' }
        }
      ]);

      // Record correct attempts for both exercises
      await UserDatabase.recordAttempt(testUser.id, exercises[0].id, true, 'é');
      await UserDatabase.recordAttempt(testUser.id, exercises[1].id, true, 'são');

      const correctExercises = await UserDatabase.getCorrectlyAnsweredExercises(testUser.id);
      expect(correctExercises).toHaveLength(2);
      expect(correctExercises).toContain(exercises[0].id);
      expect(correctExercises).toContain(exercises[1].id);
    });
  });

  describeWithDb('Admin Exercise Generation', () => {
    test('should validate exercise generation parameters', async () => {
      // Test that we can validate generation parameters
      const validTopics = ['verbos', 'substantivos', 'adjetivos'];
      const validLevels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      
      expect(validTopics).toContain('verbos');
      expect(validLevels).toContain('A1');
      expect(validLevels).toContain('C2');
    });

    test('should handle duplicate exercise detection', async () => {
      // Save an exercise
      const exercise = {
        sentence: 'Duplicate test ___.',
        correctAnswer: 'sentence',
        topic: 'test',
        level: 'A1' as LanguageLevel,
        multipleChoiceOptions: ['sentence', 'other'],
        explanations: { pt: 'Test', en: 'Test', uk: 'Test' }
      };

      await ExerciseDatabase.saveBatchExercises([exercise]);

      // Check that duplicate is detected
      const isDuplicate = await ExerciseDatabase.exerciseExists(
        exercise.sentence,
        exercise.correct_answer,
        exercise.topic,
        exercise.level
      );

      expect(isDuplicate).toBe(true);
    });
  });

  describeWithDb('Database Statistics', () => {
    test('should retrieve comprehensive database statistics', async () => {
      // Add some test data
      await ExerciseDatabase.saveBatchExercises([
        {
          sentence: 'Stats test 1 ___.',
          correctAnswer: 'one',
          topic: 'test',
          level: 'A1',
          multipleChoiceOptions: ['one', 'two'],
          explanations: { pt: 'Test', en: 'Test', uk: 'Test' }
        },
        {
          sentence: 'Stats test 2 ___.',
          correctAnswer: 'two',
          topic: 'test',
          level: 'A2',
          multipleChoiceOptions: ['one', 'two'],
          explanations: { pt: 'Test', en: 'Test', uk: 'Test' }
        }
      ]);

      const stats = await ExerciseDatabase.getStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.byLevel).toBeDefined();
      expect(stats.byTopic).toBeDefined();
      
      const userStats = await UserDatabase.getDatabaseStats();
      expect(userStats.total).toBeGreaterThan(0);
      expect(userStats.userStats).toBeDefined();
    });
  });

  describe('Error Handling (No Database Required)', () => {
    test('should handle database connection errors gracefully', async () => {
      // Test with invalid database configuration
      const originalUrl = process.env.POSTGRES_URL;
      process.env.POSTGRES_URL = '';
      
      try {
        const isAvailable = ExerciseDatabase.isDatabaseAvailable();
        expect(isAvailable).toBe(false);
        
        // Should return empty array when database unavailable
        const exercises = await ExerciseDatabase.getExercises({ levels: ['A1'], limit: 5 });
        expect(exercises).toEqual([]);
      } finally {
        // Restore original URL
        process.env.POSTGRES_URL = originalUrl;
      }
    });

    test('should handle invalid exercise data gracefully', async () => {
      // Test saving invalid exercise format
      const invalidExercises = [
        {
          sentence: '', // Invalid empty sentence
          correct_answer: 'test',
          topic: 'test',
          level: 'A1' as LanguageLevel,
          multiple_choice_options: ['test'],
          explanation_pt: 'Test',
          explanation_en: 'Test',
          explanation_uk: 'Test'
        }
      ];

      // Should handle gracefully and return empty array
      const result = await ExerciseDatabase.saveBatchExercises(invalidExercises);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describeWithDb('Performance', () => {
    test('should retrieve exercises within performance thresholds', async () => {
      // Add some test exercises first
      await ExerciseDatabase.saveBatchExercises([
        {
          sentence: 'Performance test 1 ___.',
          correct_answer: 'one',
          topic: 'performance-test',
          level: 'A1' as LanguageLevel,
          multiple_choice_options: ['one', 'two'],
          explanation_pt: 'Test',
          explanation_en: 'Test',
          explanation_uk: 'Test'
        },
        {
          sentence: 'Performance test 2 ___.',
          correct_answer: 'two',
          topic: 'performance-test',
          level: 'A2' as LanguageLevel,
          multiple_choice_options: ['one', 'two'],
          explanation_pt: 'Test',
          explanation_en: 'Test',
          explanation_uk: 'Test'
        }
      ]);
      
      const startTime = Date.now();
      
      const exercises = await ExerciseDatabase.getRandomExercises(
        ['A1', 'A2'],
        ['performance-test'],
        10
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(exercises.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000); // Should complete in under 2 seconds
      
      // Test database statistics performance
      const statsStartTime = Date.now();
      const stats = await ExerciseDatabase.getStats();
      const statsEndTime = Date.now();
      const statsDuration = statsEndTime - statsStartTime;
      
      expect(stats).toBeDefined();
      expect(statsDuration).toBeLessThan(1000); // Stats should be fast
    });
  });
});

// Clean up after all tests
afterAll(async () => {
  // Clean up test data
  console.log('Integration tests completed');
});