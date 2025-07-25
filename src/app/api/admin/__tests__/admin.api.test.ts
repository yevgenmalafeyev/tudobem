import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Request interface for testing
interface MockRequest {
  json(): Promise<Record<string, unknown>>;
}


// Mock environment variables for testing
process.env.NODE_ENV = 'test';

const mockUserDatabase = {
  initializeTables: jest.fn().mockResolvedValue(undefined),
  getClaudeApiKey: jest.fn().mockResolvedValue('sk-ant-api03-test-key'),
  updateClaudeApiKey: jest.fn().mockResolvedValue(undefined),
  getDatabaseStats: jest.fn().mockResolvedValue({
    total: 100,
    byLevel: [
      { level: 'A1', count: 60 },
      { level: 'A2', count: 40 }
    ],
    userStats: {
      totalUsers: 50,
      activeUsers: 25,
      totalAttempts: 500,
      correctAttempts: 350
    }
  })
};

const mockExerciseDatabase = {
  initializeTables: jest.fn().mockResolvedValue(undefined),
  getStats: jest.fn().mockResolvedValue({
    total: 100,
    byLevel: [
      { level: 'A1', count: 60 },
      { level: 'A2', count: 40 }
    ],
    byTopic: [
      { topic: 'verbos', count: 50 },
      { topic: 'substantivos', count: 30 },
      { topic: 'adjetivos', count: 20 }
    ]
  })
};

jest.mock('@/lib/userDatabase', () => ({
  UserDatabase: mockUserDatabase
}));

jest.mock('@/lib/database', () => ({
  ExerciseDatabase: mockExerciseDatabase
}));

const mockCookies = {
  set: jest.fn(),
  get: jest.fn().mockReturnValue({ value: 'authenticated' }),
  delete: jest.fn()
};

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(mockCookies)
}));

describe('Admin API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to authenticated by default
    mockCookies.get.mockReturnValue({ value: 'authenticated' });
  });

  describe('POST /api/admin/login', () => {
    it('should login admin with correct credentials', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          username: 'admin',
          password: '321admin123'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.admin.username).toBe('admin');
      expect(responseData.data.admin.role).toBe('admin');
      expect(mockCookies.set).toHaveBeenCalledWith('admin-session', 'authenticated', expect.objectContaining({
        httpOnly: true,
        secure: false, // test environment
        sameSite: 'strict'
      }));
    });

    it('should reject invalid credentials', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          username: 'admin',
          password: 'wrongpassword'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid admin credentials');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          username: 'admin'
          // missing password
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Username and password are required');
    });

    it('should reject wrong username', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          username: 'wrongadmin',
          password: '321admin123'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid admin credentials');
    });
  });

  describe('POST /api/admin/logout', () => {
    it('should logout admin successfully', async () => {
      const { POST } = await import('../logout/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Admin logout successful');
      expect(mockCookies.delete).toHaveBeenCalledWith('admin-session');
    });

    it('should handle logout errors gracefully', async () => {
      mockCookies.delete.mockImplementationOnce(() => {
        throw new Error('Cookie error');
      });
      
      const { POST } = await import('../logout/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Admin logout completed');
    });
  });

  describe('GET /api/admin/api-key', () => {
    it('should get API key when authenticated', async () => {
      const { GET } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.apiKey).toBe('sk-ant-api03-test-key');
      expect(responseData.data.hasApiKey).toBe(true);
      expect(mockUserDatabase.initializeTables).toHaveBeenCalled();
      expect(mockUserDatabase.getClaudeApiKey).toHaveBeenCalled();
    });

    it('should require admin authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/admin/api-key', () => {
    it('should update API key when authenticated', async () => {
      const { POST } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          apiKey: 'sk-ant-api03-new-test-key'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Claude API key updated successfully');
      expect(responseData.data.hasApiKey).toBe(true);
      expect(mockUserDatabase.updateClaudeApiKey).toHaveBeenCalledWith('sk-ant-api03-new-test-key');
    });

    it('should validate API key format', async () => {
      const { POST } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          apiKey: 'invalid-api-key'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid Claude API key format');
    });

    it('should require API key', async () => {
      const { POST } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          // missing apiKey
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Valid API key is required');
    });

    it('should require admin authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../api-key/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({
          apiKey: 'sk-ant-api03-test-key'
        })
      };

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should get admin statistics when authenticated', async () => {
      const { GET } = await import('../stats/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.summary.totalUsers).toBe(50);
      expect(responseData.data.summary.activeUsers).toBe(25);
      expect(responseData.data.summary.totalExercises).toBe(100);
      expect(responseData.data.summary.totalAttempts).toBe(500);
      expect(responseData.data.summary.overallAccuracy).toBe('70.00');
      expect(responseData.data.database.exercises).toBeDefined();
      expect(responseData.data.database.users).toBeDefined();
      expect(mockUserDatabase.initializeTables).toHaveBeenCalled();
      expect(mockExerciseDatabase.initializeTables).toHaveBeenCalled();
      expect(mockUserDatabase.getDatabaseStats).toHaveBeenCalled();
      expect(mockExerciseDatabase.getStats).toHaveBeenCalled();
    });

    it('should require admin authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../stats/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should handle database errors', async () => {
      mockUserDatabase.getDatabaseStats.mockRejectedValueOnce(new Error('Database error'));
      
      const { GET } = await import('../stats/route');
      
      const mockRequest: MockRequest = {
        json: () => Promise.resolve({})
      };

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Database error');
    });
  });
});