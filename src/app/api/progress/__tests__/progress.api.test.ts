import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';

const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password',
  created_at: new Date(),
  last_login: new Date(),
  is_active: true
};

const mockAttempt = {
  id: 'attempt-id',
  user_id: 'test-user-id',
  exercise_id: 'exercise-id',
  is_correct: true,
  user_answer: 'correct answer',
  attempted_at: new Date()
};

const mockProgress = {
  totalAttempts: 10,
  correctAttempts: 7,
  accuracyRate: 70,
  levelProgress: [
    { level: 'A1', correct: 5, total: 8 },
    { level: 'A2', correct: 2, total: 2 }
  ],
  topicProgress: [
    { topic: 'verbos', correct: 4, total: 6 },
    { topic: 'substantivos', correct: 3, total: 4 }
  ]
};

const mockUserDatabase = {
  verifyToken: jest.fn().mockResolvedValue(mockUser),
  recordAttempt: jest.fn().mockResolvedValue(mockAttempt),
  getUserProgress: jest.fn().mockResolvedValue(mockProgress),
  getCorrectlyAnsweredExercises: jest.fn().mockResolvedValue(['exercise-1', 'exercise-2'])
};

jest.mock('@/lib/userDatabase', () => ({
  UserDatabase: mockUserDatabase
}));

const mockCookies = {
  set: jest.fn(),
  get: jest.fn().mockReturnValue({ value: 'mock-session-token' }),
  delete: jest.fn()
};

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(mockCookies)
}));

describe('Progress API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/progress/attempt', () => {
    it('should record attempt successfully', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.attempt.exerciseId).toBe('exercise-id');
      expect(responseData.data.attempt.isCorrect).toBe(true);
      expect(responseData.data.progress).toEqual(mockProgress);
      expect(mockUserDatabase.verifyToken).toHaveBeenCalledWith('mock-session-token');
      expect(mockUserDatabase.recordAttempt).toHaveBeenCalledWith(
        'test-user-id',
        'exercise-id',
        true,
        'correct answer'
      );
    });

    it('should require authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Authentication required');
    });

    it('should handle invalid session', async () => {
      mockUserDatabase.verifyToken.mockResolvedValueOnce(null);
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          // missing isCorrect
          userAnswer: 'answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('exerciseId, isCorrect, and userAnswer are required');
    });

    it('should validate isCorrect is boolean', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          isCorrect: 'true', // string instead of boolean
          userAnswer: 'answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('exerciseId, isCorrect, and userAnswer are required');
    });

    it('should handle database errors', async () => {
      mockUserDatabase.recordAttempt.mockRejectedValueOnce(new Error('Database error'));
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'answer'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Database error');
    });
  });

  describe('GET /api/progress/stats', () => {
    it('should return user progress successfully', async () => {
      const { GET } = await import('../stats/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.progress).toEqual(mockProgress);
      expect(responseData.data.correctlyAnsweredExercises).toEqual(['exercise-1', 'exercise-2']);
      expect(responseData.data.user.id).toBe('test-user-id');
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockUserDatabase.verifyToken).toHaveBeenCalledWith('mock-session-token');
      expect(mockUserDatabase.getUserProgress).toHaveBeenCalledWith('test-user-id');
      expect(mockUserDatabase.getCorrectlyAnsweredExercises).toHaveBeenCalledWith('test-user-id');
    });

    it('should require authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Authentication required');
    });

    it('should handle invalid session', async () => {
      mockUserDatabase.verifyToken.mockResolvedValueOnce(null);
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });

    it('should handle database errors', async () => {
      mockUserDatabase.getUserProgress.mockRejectedValueOnce(new Error('Database error'));
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Database error');
    });
  });
});