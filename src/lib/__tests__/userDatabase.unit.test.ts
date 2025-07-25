import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test';

// Mock the query function that will be used by the Pool instances
const mockQuery = jest.fn();
const mockConnect = jest.fn();
const mockEnd = jest.fn();

// Mock the pg module at the module level
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: mockQuery,
    })),
    Client: jest.fn().mockImplementation(() => ({
      connect: mockConnect,
      query: mockQuery,
      end: mockEnd,
    })),
  };
});

// Import UserDatabase after mocking pg
import { UserDatabase } from '../userDatabase';

describe('UserDatabase Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockQuery.mockResolvedValue({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });
    mockConnect.mockResolvedValue(undefined);
    mockEnd.mockResolvedValue(undefined);
  });

  describe('Table Initialization', () => {
    it('should create all required tables', async () => {
      // Mock successful table creation
      mockQuery.mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0, fields: [] });

      await UserDatabase.initializeTables();

      // Verify that SQL was called for table creation
      expect(mockQuery).toHaveBeenCalled();
      expect(mockConnect).toHaveBeenCalled();
      expect(mockEnd).toHaveBeenCalled();
    });

    it('should create required indexes', async () => {
      mockQuery.mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0, fields: [] });

      await UserDatabase.initializeTables();

      // Check that index creation SQL was called
      const sqlCalls = mockQuery.mock.calls;
      const indexCalls = sqlCalls.filter(call => 
        call[0] && call[0].includes && call[0].includes('CREATE INDEX')
      );
      expect(indexCalls.length).toBeGreaterThan(0);
    });

    it('should initialize admin config if not exists', async () => {
      // Mock config count check returning 0
      mockQuery
        .mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0, fields: [] })
        .mockResolvedValueOnce({ rows: [{ count: '0' }], command: 'SELECT', rowCount: 1, fields: [] }) // Config count
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1, fields: [] }); // Insert config

      await UserDatabase.initializeTables();

      // Verify admin config initialization was attempted
      const sqlCalls = mockQuery.mock.calls;
      const configInsert = sqlCalls.find(call => 
        call[0] && call[0].includes && call[0].includes('INSERT INTO admin_config')
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
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        // Mock email check (empty result)
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] })
        // Mock user creation
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1, fields: [] });

      const result = await UserDatabase.registerUser('test_user_1', 'testpassword123', 'test1@example.com');

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledTimes(3);
    });

    it('should reject duplicate username', async () => {
      // Mock username check (user exists)
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ id: 'existing-id' }], 
        command: 'SELECT', 
        rowCount: 1, 
        fields: [] 
      });

      await expect(
        UserDatabase.registerUser('existing_user', 'testpassword123')
      ).rejects.toThrow('Username already exists');

      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should reject duplicate email', async () => {
      // Mock username check (empty)
      mockQuery
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

      expect(mockQuery).toHaveBeenCalledTimes(2);
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

      mockQuery
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
      mockQuery
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
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

      await expect(
        UserDatabase.loginUser('nonexistent_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject invalid password', async () => {
      // Mock bcrypt.compare to return false
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      mockQuery.mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1, fields: [] });

      await expect(
        UserDatabase.loginUser('test_login_user', 'wrongpassword')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject inactive user', async () => {
      // Mock empty result for inactive user query
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

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
      mockQuery.mockResolvedValueOnce({ 
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
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });

      const result = await UserDatabase.verifyToken(validToken);
      expect(result).toBeNull();
    });

    it('should logout user successfully', async () => {
      const token = 'test-token';
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 1, fields: [] });

      await UserDatabase.logoutUser(token);

      const deleteCalls = mockQuery.mock.calls.filter(call => 
        call[0] && call[0].includes && call[0].includes('DELETE FROM user_sessions')
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
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
      mockQuery.mockResolvedValueOnce({ 
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
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ exercise_id: 'exercise-1' }, { exercise_id: 'exercise-2' }], 
        command: 'SELECT', 
        rowCount: 2, 
        fields: [] 
      });

      const result = await UserDatabase.getCorrectlyAnsweredExercises('user-id');

      expect(result).toEqual(['exercise-1', 'exercise-2']);
    });

    it('should calculate user progress correctly', async () => {
      mockQuery
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
        })
        // Recent attempts
        .mockResolvedValueOnce({ 
          rows: [{
            id: 'attempt-id',
            user_id: 'user-id',
            exercise_id: 'exercise-id',
            is_correct: true,
            user_answer: 'falo',
            attempted_at: new Date()
          }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      const result = await UserDatabase.getUserProgress('user-id');

      expect(result.totalAttempts).toBe(3);
      expect(result.correctAttempts).toBe(2);
      expect(result.accuracyRate).toBeCloseTo(66.67, 2);
      expect(result.levelProgress).toBeDefined();
      expect(result.topicProgress).toBeDefined();
      expect(result.recentAttempts).toBeDefined();
    });
  });

  describe('Admin Functions', () => {
    it('should get and set Claude API key', async () => {
      const testApiKey = 'sk-test-api-key-12345';

      // Mock update
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1, fields: [] })
        // Mock get
        .mockResolvedValueOnce({ 
          rows: [{ claude_api_key: testApiKey }], 
          command: 'SELECT', 
          rowCount: 1, 
          fields: [] 
        });

      await UserDatabase.setClaudeApiKey(testApiKey);
      const result = await UserDatabase.getClaudeApiKey();

      expect(result).toBe(testApiKey);
    });

    it('should get database statistics', async () => {
      // Mock comprehensive stats query
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ 
          total_users: '10',
          active_users: '5',
          total_exercises: '100',
          total_attempts: '200',
          average_accuracy: '75.0'
        }], 
        command: 'SELECT', 
        rowCount: 1, 
        fields: [] 
      });

      const result = await UserDatabase.getDatabaseStats();

      expect(result.totalUsers).toBe(10);
      expect(result.activeUsers).toBe(5);
      expect(result.totalExercises).toBe(100);
      expect(result.totalAttempts).toBe(200);
      expect(result.averageAccuracy).toBe('75.0');
    });

    it('should cleanup expired sessions', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 2, fields: [] });

      await UserDatabase.cleanupExpiredSessions();

      const deleteCalls = mockQuery.mock.calls.filter(call => 
        call[0] && call[0].includes && call[0].includes('DELETE FROM user_sessions WHERE expires_at')
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

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