import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test';

// Mock pg Pool
const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockConnect = jest.fn<() => Promise<void>>();
const mockEnd = jest.fn<() => Promise<void>>();
const mockPool = {
  query: mockQuery,
  connect: mockConnect,
  end: mockEnd
};

// Mock the entire pg module before importing UserDatabase
jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
  Client: jest.fn(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: mockEnd
  }))
}));

// Import UserDatabase after mocking pg
import { UserDatabase } from '../userDatabase';

describe('UserDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockQuery.mockResolvedValue({ rows: [], command: 'SELECT', rowCount: 0, fields: [] });
    mockConnect.mockResolvedValue(undefined);
    mockEnd.mockResolvedValue(undefined);
  });

  describe('Table Initialization', () => {
    it('should create all required tables', async () => {
      // Mock successful table creation and admin config initialization
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Users table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Attempts table  
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Admin config table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Sessions table
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 1
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 2
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 3
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 4
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 5
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 6
        .mockResolvedValueOnce({ rows: [], command: 'CREATE', rowCount: 0 }) // Index 7
        .mockResolvedValueOnce({ rows: [{ count: '0' }], command: 'SELECT', rowCount: 1 }) // Config count
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1 }); // Insert config

      await UserDatabase.initializeTables();

      // Verify that initialization was called
      expect(mockQuery).toHaveBeenCalled();
      expect(mockConnect).toHaveBeenCalled();
      expect(mockEnd).toHaveBeenCalled();
    });

    it('should create required indexes', async () => {
      // Mock successful index creation
      mockQuery
        .mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0 });

      await UserDatabase.initializeTables();

      // Verify that index creation SQL was executed
      const createIndexCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('CREATE INDEX')
      );
      expect(createIndexCalls.length).toBeGreaterThan(0);
    });

    it('should initialize admin config if not exists', async () => {
      // Mock config count check returning 0, then insert
      mockQuery
        .mockResolvedValue({ rows: [], command: 'CREATE', rowCount: 0 })
        .mockResolvedValueOnce({ rows: [{ count: '0' }], command: 'SELECT', rowCount: 1 })
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1 });

      await UserDatabase.initializeTables();

      // Verify admin config initialization was attempted
      const insertCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('INSERT INTO admin_config')
      );
      expect(insertCalls.length).toBeGreaterThan(0);
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const username = 'test_user_1';
      const password = 'testpassword123';
      const email = 'test1@example.com';
      
      const mockUser = {
        id: 'test-user-id',
        username,
        email,
        password_hash: await bcrypt.hash(password, 12),
        created_at: new Date(),
        last_login: null,
        is_active: true
      };

      // Mock username check (empty), email check (empty), user creation
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 }) // Username check
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 }) // Email check
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1 }); // User creation

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
      
      const mockUser = {
        id: 'test-user-id',
        username,
        email: null,
        password_hash: await bcrypt.hash(password, 12),
        created_at: new Date(),
        last_login: null,
        is_active: true
      };

      // Mock username check (empty), user creation
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 }) // Username check
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1 }); // User creation

      const user = await UserDatabase.registerUser(username, password);

      expect(user).toBeDefined();
      expect(user.username).toBe(username);
      expect(user.email).toBeNull();
    });

    it('should reject duplicate username', async () => {
      const username = 'test_user_duplicate';
      const password = 'testpassword123';

      // Mock username check (user exists)
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ id: 'existing-id' }], 
        command: 'SELECT', 
        rowCount: 1 
      });

      await expect(
        UserDatabase.registerUser(username, password)
      ).rejects.toThrow('Username already exists');
    });

    it('should reject duplicate email', async () => {
      const email = 'duplicate@example.com';
      const password = 'testpassword123';

      // Mock username check (empty), email check (exists)
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 }) // Username check
        .mockResolvedValueOnce({ 
          rows: [{ id: 'existing-id' }], 
          command: 'SELECT', 
          rowCount: 1 
        }); // Email check

      await expect(
        UserDatabase.registerUser('test_user_4', password, email)
      ).rejects.toThrow('Email already exists');
    });

    it('should hash passwords with sufficient rounds', async () => {
      const username = 'test_user_hash';
      const password = 'testpassword123';
      
      const mockUser = {
        id: 'test-user-id',
        username,
        email: null,
        password_hash: await bcrypt.hash(password, 12),
        created_at: new Date(),
        last_login: null,
        is_active: true
      };

      // Mock username check (empty), user creation
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 }) // Username check
        .mockResolvedValueOnce({ rows: [mockUser], command: 'INSERT', rowCount: 1 }); // User creation

      const user = await UserDatabase.registerUser(username, password);

      // Check that password hash starts with $2b$ (bcrypt) and has sufficient rounds
      expect(user.password_hash).toMatch(/^\$2b\$12\$/);
    });
  });

  describe('User Login', () => {
    const mockUser = {
      id: 'test-user-id',
      username: 'test_login_user',
      email: 'login@example.com',
      password_hash: '$2b$12$test.hash',
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
      // Mock user lookup, last_login update, session creation
      mockQuery
        .mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1 }) // User lookup
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1 }) // Last login update
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1 }); // Session creation

      const result = await UserDatabase.loginUser('test_login_user', 'testpassword123');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('test_login_user');

      // Verify JWT token
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as { userId: string; username: string; iat: number; exp: number };
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.username).toBe('test_login_user');
    });

    it('should reject invalid username', async () => {
      // Mock empty user lookup
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 });

      await expect(
        UserDatabase.loginUser('nonexistent_user', 'testpassword123')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should reject invalid password', async () => {
      // Mock bcrypt.compare to return false
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      
      mockQuery.mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1 });

      await expect(
        UserDatabase.loginUser('test_login_user', 'wrongpassword')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should update last_login timestamp', async () => {
      // Mock user lookup, last_login update, session creation
      mockQuery
        .mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1 }) // User lookup
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1 }) // Last login update
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1 }); // Session creation
      
      await UserDatabase.loginUser('test_login_user', 'testpassword123');

      // Verify that last_login update was called
      const updateCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('UPDATE users SET last_login')
      );
      expect(updateCalls.length).toBeGreaterThan(0);
    });

    it('should create session record', async () => {
      // Mock user lookup, last_login update, session creation
      mockQuery
        .mockResolvedValueOnce({ rows: [mockUser], command: 'SELECT', rowCount: 1 }) // User lookup
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1 }) // Last login update
        .mockResolvedValueOnce({ rows: [], command: 'INSERT', rowCount: 1 }); // Session creation

      const result = await UserDatabase.loginUser('test_login_user', 'testpassword123');

      // Verify that session creation was called
      const insertCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('INSERT INTO user_sessions')
      );
      expect(insertCalls.length).toBeGreaterThan(0);
      expect(result.token).toBeDefined();
    });

    it('should reject inactive user', async () => {
      // Mock empty result for inactive user query
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 });

      await expect(
        UserDatabase.loginUser('test_login_user', 'testpassword123')
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
        rowCount: 1 
      });

      const user = await UserDatabase.verifyToken(validToken);

      expect(user).toBeDefined();
      expect(user!.id).toBe(mockUser.id);
      expect(user!.username).toBe('test_session_user');
    });

    it('should reject invalid token', async () => {
      const user = await UserDatabase.verifyToken('invalid.token.here');
      expect(user).toBeNull();
    });

    it('should reject expired session', async () => {
      const validToken = jwt.sign(
        { userId: mockUser.id, username: mockUser.username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Mock expired session (empty result)
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'SELECT', rowCount: 0 });

      const user = await UserDatabase.verifyToken(validToken);
      expect(user).toBeNull();
    });

    it('should logout user successfully', async () => {
      const token = 'test-token';
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 1 });

      await UserDatabase.logoutUser(token);

      // Verify that session deletion was called
      const deleteCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('DELETE FROM user_sessions')
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise Attempts', () => {
    const mockUser = {
      id: 'test-user-id',
      username: 'test_exercise_user',
      email: null,
      password_hash: 'hash',
      created_at: new Date(),
      last_login: null,
      is_active: true
    };
    const exerciseId = 'test-exercise-id';

    it('should record exercise attempt', async () => {
      const mockAttempt = {
        id: 'attempt-id',
        user_id: mockUser.id,
        exercise_id: exerciseId,
        is_correct: true,
        user_answer: 'falo',
        attempted_at: new Date()
      };

      mockQuery.mockResolvedValueOnce({ 
        rows: [mockAttempt], 
        command: 'INSERT', 
        rowCount: 1 
      });

      const attempt = await UserDatabase.recordAttempt(
        mockUser.id,
        exerciseId,
        'A1',
        'Present Tense',
        true,
        'falo'
      );

      expect(attempt).toBeDefined();
      expect(attempt.user_id).toBe(mockUser.id);
      expect(attempt.exercise_id).toBe(exerciseId);
      expect(attempt.is_correct).toBe(true);
      expect(attempt.user_answer).toBe('falo');
      expect(attempt.attempted_at).toBeDefined();
    });

    it('should get correctly answered exercises', async () => {
      mockQuery.mockResolvedValueOnce({ 
        rows: [{ exercise_id: exerciseId }], 
        command: 'SELECT', 
        rowCount: 1 
      });

      const correctExercises = await UserDatabase.getCorrectlyAnsweredExercises(mockUser.id);

      expect(correctExercises).toContain(exerciseId);
      expect(correctExercises.length).toBe(1);
    });

    it('should calculate user progress correctly', async () => {
      mockQuery
        // Total attempts
        .mockResolvedValueOnce({ rows: [{ total: '3' }], command: 'SELECT', rowCount: 1 })
        // Correct attempts
        .mockResolvedValueOnce({ rows: [{ correct: '2' }], command: 'SELECT', rowCount: 1 })
        // Level progress
        .mockResolvedValueOnce({ 
          rows: [{ level: 'A1', total_attempts: '3', correct_attempts: '2' }], 
          command: 'SELECT', 
          rowCount: 1 
        })
        // Topic progress
        .mockResolvedValueOnce({ 
          rows: [{ topic: 'verbos', total_attempts: '3', correct_attempts: '2' }], 
          command: 'SELECT', 
          rowCount: 1 
        })
        // Recent attempts
        .mockResolvedValueOnce({ 
          rows: [{ 
            id: 'attempt-id',
            user_id: mockUser.id,
            exercise_id: exerciseId,
            is_correct: true,
            user_answer: 'falo',
            attempted_at: new Date()
          }], 
          command: 'SELECT', 
          rowCount: 1 
        });

      const progress = await UserDatabase.getUserProgress(mockUser.id);

      expect(progress.totalAttempts).toBe(3);
      expect(progress.correctAttempts).toBe(2);
      expect(progress.accuracyRate).toBeCloseTo(66.67, 2);
      expect(progress.levelProgress).toBeDefined();
      expect(progress.topicProgress).toBeDefined();
      expect(progress.recentAttempts).toBeDefined();
    });
  });

  describe('Admin Functions', () => {
    it('should get and set Claude API key', async () => {
      const testApiKey = 'sk-test-api-key-12345';

      // Mock update and get operations
      mockQuery
        .mockResolvedValueOnce({ rows: [], command: 'UPDATE', rowCount: 1 }) // Set API key
        .mockResolvedValueOnce({ 
          rows: [{ claude_api_key: testApiKey }], 
          command: 'SELECT', 
          rowCount: 1 
        }); // Get API key

      await UserDatabase.setClaudeApiKey(testApiKey);
      const retrievedKey = await UserDatabase.getClaudeApiKey();

      expect(retrievedKey).toBe(testApiKey);
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
        rowCount: 1 
      });
      
      const stats = await UserDatabase.getDatabaseStats();

      expect(stats).toBeDefined();
      expect(stats.totalUsers).toBe(10);
      expect(stats.activeUsers).toBe(5);
      expect(stats.totalExercises).toBe(100);
      expect(stats.totalAttempts).toBe(200);
      expect(stats.averageAccuracy).toBe('75.0');
    });

    it('should cleanup expired sessions', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], command: 'DELETE', rowCount: 2 });

      await UserDatabase.cleanupExpiredSessions();

      // Verify that expired session cleanup was called
      const deleteCalls = mockQuery.mock.calls.filter(call => 
        call[0] && typeof call[0] === 'string' && call[0].includes('DELETE FROM user_sessions WHERE expires_at')
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));
      
      await expect(
        UserDatabase.registerUser('test_user', 'password')
      ).rejects.toThrow();
    });

    it('should handle JWT verification errors', async () => {
      const malformedToken = 'not.a.valid.jwt.token';
      const user = await UserDatabase.verifyToken(malformedToken);
      expect(user).toBeNull();
    });
  });
});