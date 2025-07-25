import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { sql } from '@vercel/postgres';
import { UserDatabase } from '../userDatabase';
import { ExerciseDatabase } from '../database';

describe('Database Migration', () => {
  beforeAll(async () => {
    // Clean up any existing data
    await cleanupAllTestData();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupAllTestData();
  });

  async function cleanupAllTestData() {
    try {
      // Clean up in dependency order
      await sql`DELETE FROM user_exercise_attempts WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'migration_test_%')`;
      await sql`DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'migration_test_%')`;
      await sql`DELETE FROM users WHERE username LIKE 'migration_test_%'`;
      await sql`DELETE FROM exercises WHERE topic = 'migration_test'`;
    } catch {
      // Ignore errors if tables don't exist yet
    }
  }

  describe('Schema Creation', () => {
    it('should create user system tables', async () => {
      await UserDatabase.initializeTables();

      const tablesResult = await sql`
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'user_exercise_attempts', 'admin_config', 'user_sessions')
        ORDER BY table_name, ordinal_position
      `;

      const tableStructure = tablesResult.rows.reduce((acc, row) => {
        if (!acc[row.table_name]) acc[row.table_name] = [];
        acc[row.table_name].push({
          column: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable === 'YES',
          default: row.column_default
        });
        return acc;
      }, {} as Record<string, Array<{column: string; type: string; nullable: boolean; default: string | null}>>);

      // Define column type for better TypeScript inference
      type ColumnInfo = {column: string; type: string; nullable: boolean; default: string | null};

      // Verify users table structure
      expect(tableStructure.users).toBeDefined();
      const usersTable = tableStructure.users;
      expect(usersTable.find((col: ColumnInfo) => col.column === 'id')).toBeDefined();
      expect(usersTable.find((col: ColumnInfo) => col.column === 'username')).toBeDefined();
      expect(usersTable.find((col: ColumnInfo) => col.column === 'password_hash')).toBeDefined();
      expect(usersTable.find((col: ColumnInfo) => col.column === 'email')).toBeDefined();
      expect(usersTable.find((col: ColumnInfo) => col.column === 'created_at')).toBeDefined();
      expect(usersTable.find((col: ColumnInfo) => col.column === 'is_active')).toBeDefined();

      // Verify user_exercise_attempts table structure
      expect(tableStructure.user_exercise_attempts).toBeDefined();
      const attemptsTable = tableStructure.user_exercise_attempts;
      expect(attemptsTable.find((col: ColumnInfo) => col.column === 'user_id')).toBeDefined();
      expect(attemptsTable.find((col: ColumnInfo) => col.column === 'exercise_id')).toBeDefined();
      expect(attemptsTable.find((col: ColumnInfo) => col.column === 'is_correct')).toBeDefined();
      expect(attemptsTable.find((col: ColumnInfo) => col.column === 'user_answer')).toBeDefined();

      // Verify admin_config table structure
      expect(tableStructure.admin_config).toBeDefined();
      const adminTable = tableStructure.admin_config;
      expect(adminTable.find((col: ColumnInfo) => col.column === 'claude_api_key')).toBeDefined();

      // Verify user_sessions table structure
      expect(tableStructure.user_sessions).toBeDefined();
      const sessionsTable = tableStructure.user_sessions;
      expect(sessionsTable.find((col: ColumnInfo) => col.column === 'session_token')).toBeDefined();
      expect(sessionsTable.find((col: ColumnInfo) => col.column === 'expires_at')).toBeDefined();
    });

    it('should create exercise system tables', async () => {
      await ExerciseDatabase.initializeTables();

      const exerciseTableResult = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'exercises'
        ORDER BY ordinal_position
      `;

      const exerciseColumns = exerciseTableResult.rows.map(row => row.column_name);
      expect(exerciseColumns).toContain('id');
      expect(exerciseColumns).toContain('sentence');
      expect(exerciseColumns).toContain('correct_answer');
      expect(exerciseColumns).toContain('topic');
      expect(exerciseColumns).toContain('level');
      expect(exerciseColumns).toContain('multiple_choice_options');
      expect(exerciseColumns).toContain('explanation_pt');
      expect(exerciseColumns).toContain('explanation_en');
      expect(exerciseColumns).toContain('explanation_uk');
    });

    it('should verify foreign key constraints', async () => {
      const constraintsResult = await sql`
        SELECT 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
        AND tc.table_name IN ('user_exercise_attempts', 'user_sessions')
      `;

      const constraints = constraintsResult.rows;
      
      // Should have foreign key from user_exercise_attempts to users
      const userAttemptConstraint = constraints.find(c => 
        c.table_name === 'user_exercise_attempts' && 
        c.column_name === 'user_id' &&
        c.foreign_table_name === 'users'
      );
      expect(userAttemptConstraint).toBeDefined();

      // Should have foreign key from user_exercise_attempts to exercises
      const exerciseAttemptConstraint = constraints.find(c => 
        c.table_name === 'user_exercise_attempts' && 
        c.column_name === 'exercise_id' &&
        c.foreign_table_name === 'exercises'
      );
      expect(exerciseAttemptConstraint).toBeDefined();

      // Should have foreign key from user_sessions to users
      const sessionConstraint = constraints.find(c => 
        c.table_name === 'user_sessions' && 
        c.column_name === 'user_id' &&
        c.foreign_table_name === 'users'
      );
      expect(sessionConstraint).toBeDefined();
    });

    it('should create required indexes', async () => {
      await UserDatabase.initializeTables();
      await ExerciseDatabase.initializeTables();

      const indexesResult = await sql`
        SELECT schemaname, tablename, indexname
        FROM pg_indexes 
        WHERE schemaname = 'public'
        AND tablename IN ('users', 'user_exercise_attempts', 'user_sessions', 'exercises')
        AND indexname NOT LIKE '%_pkey'
      `;

      const indexes = indexesResult.rows.map(row => row.indexname);
      
      // User system indexes
      expect(indexes).toContain('idx_users_username');
      expect(indexes).toContain('idx_users_email');
      expect(indexes).toContain('idx_user_attempts_user_id');
      expect(indexes).toContain('idx_user_attempts_exercise_id');
      expect(indexes).toContain('idx_sessions_token');
      expect(indexes).toContain('idx_sessions_user_id');

      // Exercise system indexes
      expect(indexes).toContain('idx_exercises_level');
      expect(indexes).toContain('idx_exercises_topic');
      expect(indexes).toContain('idx_exercises_level_topic');
    });
  });

  describe('Data Integration', () => {
    it('should integrate user and exercise systems', async () => {
      // Initialize both systems
      await UserDatabase.initializeTables();
      await ExerciseDatabase.initializeTables();

      // Create a test user
      const user = await UserDatabase.registerUser('migration_test_user', 'testpassword');

      // Create a test exercise
      const exercises = await ExerciseDatabase.saveBatchExercises([{
        sentence: 'Eu _____ português.',
        correctAnswer: 'falo',
        topic: 'migration_test',
        level: 'A1',
        multipleChoiceOptions: ['falo', 'falas', 'fala'],
        explanations: {
          pt: 'Primeira pessoa singular',
          en: 'First person singular',
          uk: 'Перша особа однини'
        }
      }]);

      expect(exercises).toHaveLength(1);
      const exercise = exercises[0];

      // Record an attempt
      const attempt = await UserDatabase.recordAttempt(
        user.id,
        exercise.id,
        true,
        'falo'
      );

      expect(attempt.user_id).toBe(user.id);
      expect(attempt.exercise_id).toBe(exercise.id);

      // Verify the relationship works
      const userProgress = await UserDatabase.getUserProgress(user.id);
      expect(userProgress.totalAttempts).toBe(1);
      expect(userProgress.correctAttempts).toBe(1);
      expect(userProgress.accuracyRate).toBe(100);
    });

    it('should handle cascade deletes properly', async () => {
      // Create user and exercise
      const user = await UserDatabase.registerUser('migration_test_cascade', 'testpassword');
      const exercises = await ExerciseDatabase.saveBatchExercises([{
        sentence: 'Tu _____ bem.',
        correctAnswer: 'estás',
        topic: 'migration_test',
        level: 'A1',
        multipleChoiceOptions: ['estás', 'está', 'estou'],
        explanations: { pt: 'Segunda pessoa', en: 'Second person', uk: 'Друга особа' }
      }]);

      // Create attempt and session
      await UserDatabase.recordAttempt(user.id, exercises[0].id, true, 'estás');
      await UserDatabase.loginUser('migration_test_cascade', 'testpassword');

      // Verify data exists
      let attemptResult = await sql`
        SELECT COUNT(*) as count FROM user_exercise_attempts WHERE user_id = ${user.id}
      `;
      expect(parseInt(attemptResult.rows[0].count)).toBe(1);

      let sessionResult = await sql`
        SELECT COUNT(*) as count FROM user_sessions WHERE user_id = ${user.id}
      `;
      expect(parseInt(sessionResult.rows[0].count)).toBe(1);

      // Delete user (should cascade)
      await sql`DELETE FROM users WHERE id = ${user.id}`;

      // Verify cascaded deletes
      attemptResult = await sql`
        SELECT COUNT(*) as count FROM user_exercise_attempts WHERE user_id = ${user.id}
      `;
      expect(parseInt(attemptResult.rows[0].count)).toBe(0);

      sessionResult = await sql`
        SELECT COUNT(*) as count FROM user_sessions WHERE user_id = ${user.id}
      `;
      expect(parseInt(sessionResult.rows[0].count)).toBe(0);
    });
  });

  describe('Performance and Constraints', () => {
    it('should enforce unique constraints', async () => {
      await UserDatabase.initializeTables();

      // Username uniqueness
      await UserDatabase.registerUser('migration_test_unique', 'password1');
      await expect(
        UserDatabase.registerUser('migration_test_unique', 'password2')
      ).rejects.toThrow('Username already exists');

      // Email uniqueness
      await UserDatabase.registerUser('migration_test_1', 'password1', 'unique@test.com');
      await expect(
        UserDatabase.registerUser('migration_test_2', 'password2', 'unique@test.com')
      ).rejects.toThrow('Email already exists');
    });

    it('should handle concurrent operations', async () => {
      await UserDatabase.initializeTables();

      // Create user
      const user = await UserDatabase.registerUser('migration_test_concurrent', 'testpassword');

      // Create exercise
      const exercises = await ExerciseDatabase.saveBatchExercises([{
        sentence: 'Nós _____ felizes.',
        correctAnswer: 'somos',
        topic: 'migration_test',
        level: 'A1',
        multipleChoiceOptions: ['somos', 'são', 'sou'],
        explanations: { pt: 'Primeira pessoa plural', en: 'First person plural', uk: 'Перша особа множини' }
      }]);

      // Simulate concurrent attempts
      const concurrentAttempts = Array.from({ length: 5 }, (_, i) =>
        UserDatabase.recordAttempt(user.id, exercises[0].id, i % 2 === 0, `answer_${i}`)
      );

      const results = await Promise.all(concurrentAttempts);
      expect(results).toHaveLength(5);

      // Verify all attempts were recorded
      const progress = await UserDatabase.getUserProgress(user.id);
      expect(progress.totalAttempts).toBe(5);
    });
  });

  describe('Migration Rollback', () => {
    it('should support safe rollback of user system', async () => {
      // This test demonstrates how to safely remove user system tables
      // In a real migration, this would be more sophisticated

      await UserDatabase.initializeTables();

      // Verify tables exist
      let tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'user_exercise_attempts', 'admin_config', 'user_sessions')
      `;
      expect(tablesResult.rows.length).toBe(4);

      // Rollback would involve dropping tables in reverse dependency order
      // (This is just a demonstration - in practice you'd have proper migration files)
      await sql`DROP TABLE IF EXISTS user_exercise_attempts CASCADE`;
      await sql`DROP TABLE IF EXISTS user_sessions CASCADE`;
      await sql`DROP TABLE IF EXISTS users CASCADE`;
      await sql`DROP TABLE IF EXISTS admin_config CASCADE`;

      // Verify tables are gone
      tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'user_exercise_attempts', 'admin_config', 'user_sessions')
      `;
      expect(tablesResult.rows.length).toBe(0);

      // Recreate for other tests
      await UserDatabase.initializeTables();
    });
  });
});