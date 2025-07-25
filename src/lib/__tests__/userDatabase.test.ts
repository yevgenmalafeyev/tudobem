import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { sql } from '@vercel/postgres';
import { UserDatabase, User, UserExerciseAttempt } from '../userDatabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';

describe('UserDatabase', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData();
    // Initialize tables
    await UserDatabase.initializeTables();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
  });

  beforeEach(async () => {
    // Clean up data before each test to ensure isolation
    await cleanupTestData();
  });

  async function cleanupTestData() {
    try {
      await sql`DELETE FROM user_exercise_attempts WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%')`;
      await sql`DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%')`;
      await sql`DELETE FROM users WHERE username LIKE 'test_%'`;
    } catch (error) {
      // Ignore errors if tables don't exist yet
    }
  }

  describe('Table Initialization', () => {
    it('should create all required tables', async () => {
      await UserDatabase.initializeTables();

      // Check that all tables exist
      const tablesResult = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'user_exercise_attempts', 'admin_config', 'user_sessions')
      `;

      const tableNames = tablesResult.rows.map(row => row.table_name);
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('user_exercise_attempts');
      expect(tableNames).toContain('admin_config');
      expect(tableNames).toContain('user_sessions');
    });

    it('should create required indexes', async () => {
      await UserDatabase.initializeTables();

      // Check for some key indexes
      const indexesResult = await sql`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename IN ('users', 'user_exercise_attempts', 'user_sessions')
      `;

      const indexNames = indexesResult.rows.map(row => row.indexname);
      expect(indexNames).toContain('idx_users_username');
      expect(indexNames).toContain('idx_sessions_token');
    });

    it('should initialize admin config if not exists', async () => {
      await UserDatabase.initializeTables();

      const configResult = await sql`SELECT COUNT(*) as count FROM admin_config`;
      expect(parseInt(configResult.rows[0].count)).toBeGreaterThan(0);
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const username = 'test_user_1';
      const password = 'testpassword123';
      const email = 'test1@example.com';

      const user = await UserDatabase.registerUser(username, password, email);

      expect(user).toBeDefined();
      expect(user.username).toBe(username);
      expect(user.email).toBe(email);
      expect(user.id).toBeDefined();
      expect(user.password_hash).toBeDefined();
      expect(user.is_active).toBe(true);
      expect(user.created_at).toBeDefined();

      // Verify password is hashed
      expect(user.password_hash).not.toBe(password);
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      expect(isPasswordValid).toBe(true);
    });

    it('should register a user without email', async () => {
      const username = 'test_user_2';
      const password = 'testpassword123';

      const user = await UserDatabase.registerUser(username, password);

      expect(user).toBeDefined();
      expect(user.username).toBe(username);
      expect(user.email).toBeNull();
    });

    it('should reject duplicate username', async () => {
      const username = 'test_user_duplicate';
      const password = 'testpassword123';

      // Register first user
      await UserDatabase.registerUser(username, password);

      // Try to register with same username
      await expect(
        UserDatabase.registerUser(username, password)
      ).rejects.toThrow('Username already exists');
    });

    it('should reject duplicate email', async () => {
      const email = 'duplicate@example.com';
      const password = 'testpassword123';

      // Register first user
      await UserDatabase.registerUser('test_user_3', password, email);

      // Try to register with same email
      await expect(
        UserDatabase.registerUser('test_user_4', password, email)
      ).rejects.toThrow('Email already exists');
    });

    it('should hash passwords with sufficient rounds', async () => {
      const username = 'test_user_hash';
      const password = 'testpassword123';

      const user = await UserDatabase.registerUser(username, password);

      // Check that password hash starts with $2b$ (bcrypt) and has sufficient rounds
      expect(user.password_hash).toMatch(/^\$2b\$12\$/);
    });
  });

  describe('User Login', () => {
    let testUser: User;

    beforeEach(async () => {
      const username = 'test_login_user';
      const password = 'testpassword123';
      const email = 'login@example.com';
      testUser = await UserDatabase.registerUser(username, password, email);
    });

    it('should login with valid credentials', async () => {
      const result = await UserDatabase.loginUser('test_login_user', 'testpassword123');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('test_login_user');

      // Verify JWT token
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.userId).toBe(testUser.id);
      expect(decoded.username).toBe('test_login_user');
    });

    it('should reject invalid username', async () => {
      await expect(
        UserDatabase.loginUser('nonexistent_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject invalid password', async () => {
      await expect(
        UserDatabase.loginUser('test_login_user', 'wrongpassword')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should update last_login timestamp', async () => {
      const beforeLogin = new Date();
      
      await UserDatabase.loginUser('test_login_user', 'testpassword123');

      const userResult = await sql`
        SELECT last_login FROM users WHERE username = 'test_login_user'
      `;
      
      const lastLogin = new Date(userResult.rows[0].last_login);
      expect(lastLogin.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
    });

    it('should create session record', async () => {
      const result = await UserDatabase.loginUser('test_login_user', 'testpassword123');

      const sessionResult = await sql`
        SELECT * FROM user_sessions WHERE session_token = ${result.token}
      `;

      expect(sessionResult.rows.length).toBe(1);
      expect(sessionResult.rows[0].user_id).toBe(testUser.id);
    });

    it('should reject inactive user', async () => {
      // Deactivate user
      await sql`UPDATE users SET is_active = false WHERE username = 'test_login_user'`;

      await expect(
        UserDatabase.loginUser('test_login_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });
  });

  describe('Session Management', () => {
    let testUser: User;
    let validToken: string;

    beforeEach(async () => {
      testUser = await UserDatabase.registerUser('test_session_user', 'testpassword123');
      const loginResult = await UserDatabase.loginUser('test_session_user', 'testpassword123');
      validToken = loginResult.token;
    });

    it('should verify valid token', async () => {
      const user = await UserDatabase.verifyToken(validToken);

      expect(user).toBeDefined();
      expect(user!.id).toBe(testUser.id);
      expect(user!.username).toBe('test_session_user');
    });

    it('should reject invalid token', async () => {
      const user = await UserDatabase.verifyToken('invalid.token.here');
      expect(user).toBeNull();
    });

    it('should reject expired session', async () => {
      // Manually expire the session
      await sql`
        UPDATE user_sessions 
        SET expires_at = NOW() - INTERVAL '1 day'
        WHERE session_token = ${validToken}
      `;

      const user = await UserDatabase.verifyToken(validToken);
      expect(user).toBeNull();
    });

    it('should logout user successfully', async () => {
      await UserDatabase.logoutUser(validToken);

      // Session should be deleted
      const sessionResult = await sql`
        SELECT * FROM user_sessions WHERE session_token = ${validToken}
      `;
      expect(sessionResult.rows.length).toBe(0);

      // Token should no longer be valid
      const user = await UserDatabase.verifyToken(validToken);
      expect(user).toBeNull();
    });
  });

  describe('Exercise Attempts', () => {
    let testUser: User;
    let exerciseId: string;

    beforeEach(async () => {
      testUser = await UserDatabase.registerUser('test_exercise_user', 'testpassword123');
      
      // Create a test exercise
      const exerciseResult = await sql`
        INSERT INTO exercises (sentence, correct_answer, topic, level, multiple_choice_options, explanation_pt, explanation_en, explanation_uk)
        VALUES ('Eu _____ português.', 'falo', 'verbos', 'A1', '["falo", "falas", "fala"]', 'Primeira pessoa singular', 'First person singular', 'Перша особа однини')
        RETURNING id
      `;
      exerciseId = exerciseResult.rows[0].id;
    });

    it('should record exercise attempt', async () => {
      const attempt = await UserDatabase.recordAttempt(
        testUser.id,
        exerciseId,
        true,
        'falo'
      );

      expect(attempt).toBeDefined();
      expect(attempt.user_id).toBe(testUser.id);
      expect(attempt.exercise_id).toBe(exerciseId);
      expect(attempt.is_correct).toBe(true);
      expect(attempt.user_answer).toBe('falo');
      expect(attempt.attempted_at).toBeDefined();
    });

    it('should get correctly answered exercises', async () => {
      // Record some attempts
      await UserDatabase.recordAttempt(testUser.id, exerciseId, true, 'falo');
      await UserDatabase.recordAttempt(testUser.id, exerciseId, false, 'falas');
      await UserDatabase.recordAttempt(testUser.id, exerciseId, true, 'falo');

      const correctExercises = await UserDatabase.getCorrectlyAnsweredExercises(testUser.id);

      expect(correctExercises).toContain(exerciseId);
      expect(correctExercises.length).toBe(1); // Should be unique
    });

    it('should calculate user progress correctly', async () => {
      // Record multiple attempts
      await UserDatabase.recordAttempt(testUser.id, exerciseId, true, 'falo');
      await UserDatabase.recordAttempt(testUser.id, exerciseId, false, 'falas');
      await UserDatabase.recordAttempt(testUser.id, exerciseId, true, 'falo');

      const progress = await UserDatabase.getUserProgress(testUser.id);

      expect(progress.totalAttempts).toBe(3);
      expect(progress.correctAttempts).toBe(2);
      expect(progress.accuracyRate).toBeCloseTo(66.67, 2);
      expect(progress.levelProgress).toBeDefined();
      expect(progress.topicProgress).toBeDefined();
    });
  });

  describe('Admin Functions', () => {
    it('should get and update Claude API key', async () => {
      const testApiKey = 'sk-test-api-key-12345';

      await UserDatabase.updateClaudeApiKey(testApiKey);
      const retrievedKey = await UserDatabase.getClaudeApiKey();

      expect(retrievedKey).toBe(testApiKey);
    });

    it('should get database statistics', async () => {
      // Create a test user and attempt
      const testUser = await UserDatabase.registerUser('test_stats_user', 'testpassword123');
      
      const stats = await UserDatabase.getDatabaseStats();

      expect(stats).toBeDefined();
      expect(stats.total).toBeDefined();
      expect(stats.byLevel).toBeDefined();
      expect(stats.userStats).toBeDefined();
      expect(stats.userStats.totalUsers).toBeGreaterThanOrEqual(1);
    });

    it('should cleanup expired sessions', async () => {
      const testUser = await UserDatabase.registerUser('test_cleanup_user', 'testpassword123');
      const loginResult = await UserDatabase.loginUser('test_cleanup_user', 'testpassword123');

      // Manually expire the session
      await sql`
        UPDATE user_sessions 
        SET expires_at = NOW() - INTERVAL '1 day'
        WHERE session_token = ${loginResult.token}
      `;

      await UserDatabase.cleanupExpiredSessions();

      // Session should be deleted
      const sessionResult = await sql`
        SELECT * FROM user_sessions WHERE session_token = ${loginResult.token}
      `;
      expect(sessionResult.rows.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test might be difficult to implement without mocking
      // but we can test that errors are properly thrown
      await expect(
        UserDatabase.registerUser('', '') // Invalid data
      ).rejects.toThrow();
    });

    it('should handle JWT verification errors', async () => {
      const malformedToken = 'not.a.valid.jwt.token';
      const user = await UserDatabase.verifyToken(malformedToken);
      expect(user).toBeNull();
    });
  });
});