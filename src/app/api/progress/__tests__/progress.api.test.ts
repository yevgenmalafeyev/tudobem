import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

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

// Create properly typed mock functions
const mockVerifyToken = jest.fn<(token: string) => Promise<unknown>>();
const mockRecordAttempt = jest.fn<(userId: string, exerciseId: string, isCorrect: boolean, userAnswer: string) => Promise<unknown>>();
const mockGetUserProgress = jest.fn<(userId: string) => Promise<unknown>>();
const mockGetCorrectlyAnsweredExercises = jest.fn<(userId: string) => Promise<string[]>>();

mockVerifyToken.mockResolvedValue(mockUser);
mockRecordAttempt.mockResolvedValue(mockAttempt);
mockGetUserProgress.mockResolvedValue(mockProgress);
mockGetCorrectlyAnsweredExercises.mockResolvedValue(['exercise-1', 'exercise-2']);

const mockUserDatabase = {
  verifyToken: mockVerifyToken,
  recordAttempt: mockRecordAttempt,
  getUserProgress: mockGetUserProgress,
  getCorrectlyAnsweredExercises: mockGetCorrectlyAnsweredExercises
};

jest.mock('@/lib/userDatabase', () => ({
  UserDatabase: mockUserDatabase
}));

const mockSet = jest.fn<(name: string, value: string, options?: unknown) => void>();
const mockGet = jest.fn<(name: string) => { value?: string } | undefined>();
const mockDelete = jest.fn<(name: string) => void>();

mockGet.mockReturnValue({ value: 'mock-session-token' });

const mockCookies = {
  set: mockSet,
  get: mockGet,
  delete: mockDelete
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => mockCookies)
}));

// Helper function to create NextRequest mock
function createMockRequest(body: unknown): NextRequest {
  return {
    json: () => Promise.resolve(body),
    headers: new Headers(),
    method: 'POST',
    url: 'http://localhost:3000/api/test',
  } as unknown as NextRequest;
}

describe('Progress API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/progress/attempt', () => {
    it('should record attempt successfully', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.attempt.exerciseId).toBe('exercise-id');
      expect(responseData.data.attempt.isCorrect).toBe(true);
      expect(responseData.data.progress).toEqual(mockProgress);
      expect(mockVerifyToken).toHaveBeenCalledWith('mock-session-token');
      expect(mockRecordAttempt).toHaveBeenCalledWith(
        'test-user-id',
        'exercise-id',
        true,
        'correct answer'
      );
    });

    it('should require authentication', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Authentication required');
    });

    it('should handle invalid session', async () => {
      mockVerifyToken.mockResolvedValueOnce(null);
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'correct answer'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          // missing isCorrect
          userAnswer: 'answer'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('exerciseId, isCorrect, and userAnswer are required');
    });

    it('should validate isCorrect is boolean', async () => {
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          isCorrect: 'true', // string instead of boolean
          userAnswer: 'answer'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('exerciseId, isCorrect, and userAnswer are required');
    });

    it('should handle database errors', async () => {
      mockRecordAttempt.mockRejectedValueOnce(new Error('Database error'));
      
      const { POST } = await import('../attempt/route');
      
      const mockRequest = createMockRequest({
          exerciseId: 'exercise-id',
          isCorrect: true,
          userAnswer: 'answer'
      });

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
      
      const mockRequest = createMockRequest({});

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.progress).toEqual(mockProgress);
      expect(responseData.data.correctlyAnsweredExercises).toEqual(['exercise-1', 'exercise-2']);
      expect(responseData.data.user.id).toBe('test-user-id');
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockVerifyToken).toHaveBeenCalledWith('mock-session-token');
      expect(mockGetUserProgress).toHaveBeenCalledWith('test-user-id');
      expect(mockGetCorrectlyAnsweredExercises).toHaveBeenCalledWith('test-user-id');
    });

    it('should require authentication', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = createMockRequest({});

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Authentication required');
    });

    it('should handle invalid session', async () => {
      mockVerifyToken.mockResolvedValueOnce(null);
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = createMockRequest({});

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });

    it('should handle database errors', async () => {
      mockGetUserProgress.mockRejectedValueOnce(new Error('Database error'));
      
      const { GET } = await import('../stats/route');
      
      const mockRequest = createMockRequest({});

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Database error');
    });
  });
});