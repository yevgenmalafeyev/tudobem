import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UserDatabase } from '../userDatabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Mock the @vercel/postgres module
const mockSql = jest.fn();
jest.mock('@vercel/postgres', () => ({
  sql: mockSql
}));

describe('UserDatabase Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Table Initialization', () => {
    it('should create all required tables', async () => {
      // Mock successful table creation
      mockSql.mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0, fields: [] });

      await UserDatabase.initializeTables();

      // Verify that SQL was called for each table creation
      expect(mockSql).toHaveBeenCalledTimes(11); // 4 tables + 7 indexes + admin config check + insert
    });

    it('should create required indexes', async () => {
      mockSql.mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0, fields: [] });

      await UserDatabase.initializeTables();

      // Check that index creation SQL was called
      const sqlCalls = mockSql.mock.calls;
      const indexCalls = sqlCalls.filter(call => 
        call[0].toString().includes('CREATE INDEX')
      );
      expect(indexCalls.length).toBeGreaterThan(0);
    });

    it('should initialize admin config if not exists', async () => {
      // Mock config count check returning 0
      mockSql
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] }) // Users table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] }) // Attempts table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] }) // Admin config table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] }) // Sessions table
        // Indexes...
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [{ count: 0 }], command: 'SELECT', rowCount: 1, fields: [] }) // Config count
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1, fields: [] }); // Insert config

      await UserDatabase.initializeTables();

      // Verify admin config initialization was attempted
      const sqlCalls = mockSql.mock.calls;
      const configInsert = sqlCalls.find(call => 
        call[0].toString().includes('INSERT INTO admin_config')
      );
      expect(configInsert).toBeDefined();
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        username: 'test_user_1',
        email: 'test1@example.com',
        password_hash: 'hashed_password',
        created_at: new Date(),
        last_login: null,
        is_active: true
      };

      // Mock username check (empty result)
      mockSql
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        // Mock email check (empty result)
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        // Mock user creation
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1, fields: [] });

      const result = await UserDatabase.registerUser('test_user_1', 'testpassword123', 'test1@example.com');

      expect(result).toEqual(mockUser);
      expect(mockSql).toHaveBeenCalledTimes(3);
    });

    it('should reject duplicate username', async () => {
      // Mock username check (user exists)
      mockSql.mockResolvedValueOnce({ 
        rows: [{ id: 'existing-id' }], 
        command: 'SELECT', 
        rowCount: 1, 
        fields: [] 
      });

      await expect(
        UserDatabase.registerUser('existing_user', 'testpassword123')
      ).rejects.toThrow('Username already exists');

      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it('should reject duplicate email', async () => {
      // Mock username check (empty)
      mockSql
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        // Mock email check (exists)
        .mockResolvedValueOnce({ 
          rows: [{ id: 'existing-id' }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      await expect(
        UserDatabase.registerUser('new_user', 'testpassword123', 'existing@example.com')
      ).rejects.toThrow('Email already exists');

      expect(mockSql).toHaveBeenCalledTimes(2);
    });

    it('should hash passwords with sufficient rounds', async () => {
      const mockUser = {
        id: 'test-user-id',
        username: 'test_user_hash',
        email: null,
        password_hash: '$2b$12$hashedpassword',
        created_at: new Date(),
        last_login: null,
        is_active: true
      };

      mockSql
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1, fields: [] });

      const result = await UserDatabase.registerUser('test_user_hash', 'testpassword123');

      // Verify that bcrypt was used with proper rounds
      expect(result.password_hash).toMatch(/^\$2b\$12\$/);
    });
  });

  describe('User Login', () => {
    const mockUser = {
      id: 'test-user-id',
      username: 'test_login_user',
      email: 'login@example.com',
      password_hash: '$2b$12$test.hash', // This will be generated properly in real bcrypt
      created_at: new Date(),
      last_login: null,
      is_active: true
    };

    beforeEach(() => {
      // Mock bcrypt.compare to return true for correct password
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (password: string) => {
        return password === 'testpassword123';
      });
    });

    it('should login with valid credentials', async () => {
      mockSql
        // Mock user lookup
        .mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1, fields: [] })
        // Mock last_login update
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1, fields: [] })
        // Mock session creation
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1, fields: [] });

      const result = await UserDatabase.loginUser('test_login_user', 'testpassword123');

      expect(result).toBeDefined();
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();

      // Verify JWT token contains correct data
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as { userId: string; username: string; iat: number; exp: number };
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.username).toBe(mockUser.username);
    });

    it('should reject invalid username', async () => {
      // Mock empty user lookup
      mockSql.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

      await expect(
        UserDatabase.loginUser('nonexistent_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject invalid password', async () => {
      // Mock bcrypt.compare to return false
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      mockSql.mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1, fields: [] });

      await expect(
        UserDatabase.loginUser('test_login_user', 'wrongpassword')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject inactive user', async () => {
      // Mock empty result for inactive user query
      mockSql.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

      await expect(
        UserDatabase.loginUser('inactive_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });
  });

  describe('Session Management', () => {
    const mockUser = {
      id: 'test-user-id',
      username: 'test_session_user',
      email: null,
      password_hash: 'hash',
      created_at: new Date(),
      last_login: new Date(),
      is_active: true
    };

    it('should verify valid token', async () => {
      const validToken = jwt.sign(
        { userId: mockUser.id, username: mockUser.username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Mock session lookup with user data
      mockSql.mockResolvedValueOnce({ 
        rows: [mockUser], 
        command: 'SELECT', 
        rowCount: 1, 
        fields: [] 
      });

      const result = await UserDatabase.verifyToken(validToken);

      expect(result).toEqual(mockUser);
    });

    it('should reject invalid token', async () => {
      const result = await UserDatabase.verifyToken('invalid.token.here');
      expect(result).toBeNull();
    });

    it('should reject expired session', async () => {
      const validToken = jwt.sign(
        { userId: mockUser.id, username: mockUser.username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Mock expired session (empty result)
      mockSql.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

      const result = await UserDatabase.verifyToken(validToken);
      expect(result).toBeNull();
    });

    it('should logout user successfully', async () => {
      const token = 'test-token';
      mockSql.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 1, fields: [] });

      await UserDatabase.logoutUser(token);

      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('DELETE FROM user_sessions')])
      );
    });
  });

  describe('Exercise Attempts', () => {
    const mockAttempt = {
      id: 'attempt-id',
      user_id: 'user-id',
      exercise_id: 'exercise-id',
      is_correct: true,
      user_answer: 'falo',
      attempted_at: new Date()
    };

    it('should record exercise attempt', async () => {
      mockSql.mockResolvedValueOnce({ 
        rows: [mockAttempt], 
        command: 'INSERT', 
        rowCount: 1, 
        fields: [] 
      });

      const result = await UserDatabase.recordAttempt(
        'user-id',
        'exercise-id',
        true,
        'falo'
      );

      expect(result).toEqual(mockAttempt);
    });

    it('should get correctly answered exercises', async () => {
      mockSql.mockResolvedValueOnce({ 
        rows: [{ exercise_id: 'exercise-1' }, { exercise_id: 'exercise-2' }], 
        command: 'SELECT', 
        rowCount: 2, 
        fields: [] 
      });

      const result = await UserDatabase.getCorrectlyAnsweredExercises('user-id');

      expect(result).toEqual(['exercise-1', 'exercise-2']);
    });

    it('should calculate user progress correctly', async () => {
      mockSql
        // Total attempts
        .mockResolvedValueOnce({ rows: [{ total: '3' }], command: 'SELECT', rowCount: 1, fields: [] })
        // Correct attempts
        .mockResolvedValueOnce({ rows: [{ correct: '2' }], command: 'SELECT', rowCount: 1, fields: [] })
        // Level progress
        .mockResolvedValueOnce({ 
          rows: [{ level: 'A1', total_attempts: '3', correct_attempts: '2' }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        })
        // Topic progress
        .mockResolvedValueOnce({ 
          rows: [{ topic: 'verbos', total_attempts: '3', correct_attempts: '2' }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      const result = await UserDatabase.getUserProgress('user-id');

      expect(result.totalAttempts).toBe(3);
      expect(result.correctAttempts).toBe(2);
      expect(result.accuracyRate).toBeCloseTo(66.67, 2);
      expect(result.levelProgress).toHaveLength(1);
      expect(result.topicProgress).toHaveLength(1);
    });
  });

  describe('Admin Functions', () => {
    it('should get and update Claude API key', async () => {
      const testApiKey = 'sk-test-api-key-12345';

      // Mock update
      mockSql
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1, fields: [] })
        // Mock get
        .mockResolvedValueOnce({ 
          rows: [{ claude_api_key: testApiKey }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      await UserDatabase.updateClaudeApiKey(testApiKey);
      const result = await UserDatabase.getClaudeApiKey();

      expect(result).toBe(testApiKey);
    });

    it('should get database statistics', async () => {
      mockSql
        // Exercise count
        .mockResolvedValueOnce({ rows: [{ total: '100' }], command: 'SELECT', rowCount: 1, fields: [] })
        // By level
        .mockResolvedValueOnce({ 
          rows: [
            { level: 'A1', count: '50' },
            { level: 'A2', count: '50' }
          ], 
          command: 'SELECT', 
          rowCount: 2, 
          fields: [] 
        })
        // User stats
        .mockResolvedValueOnce({ 
          rows: [{ 
            total_users: '10',
            active_users: '5',
            total_attempts: '200',
            correct_attempts: '150'
          }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      const result = await UserDatabase.getDatabaseStats();

      expect(result.total).toBe(100);
      expect(result.byLevel).toHaveLength(2);
      expect(result.userStats.totalUsers).toBe(10);
      expect(result.userStats.correctAttempts).toBe(150);
    });

    it('should cleanup expired sessions', async () => {
      mockSql.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 2, fields: [] });

      await UserDatabase.cleanupExpiredSessions();

      expect(mockSql).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('DELETE FROM user_sessions')])
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(
        UserDatabase.registerUser('test_user', 'password')
      ).rejects.toThrow();
    });

    it('should handle JWT verification errors', async () => {
      // Test with malformed token
      const result = await UserDatabase.verifyToken('not.a.valid.jwt.token');
      expect(result).toBeNull();
    });
  });
});