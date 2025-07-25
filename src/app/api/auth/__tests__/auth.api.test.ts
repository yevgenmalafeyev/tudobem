import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';

// Mock the database and cookies
const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password',
  created_at: new Date(),
  last_login: new Date(),
  is_active: true
};

const mockUserDatabase = {
  initializeTables: jest.fn().mockResolvedValue(undefined),
  registerUser: jest.fn().mockResolvedValue(mockUser),
  loginUser: jest.fn().mockResolvedValue({ user: mockUser, token: 'mock-jwt-token' }),
  verifyToken: jest.fn().mockResolvedValue(mockUser),
  logoutUser: jest.fn().mockResolvedValue(undefined),
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

describe('Authentication API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'testuser',
          password: 'TestPass123',
          email: 'test@example.com'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockUserDatabase.initializeTables).toHaveBeenCalled();
      expect(mockUserDatabase.registerUser).toHaveBeenCalledWith('testuser', 'TestPass123', 'test@example.com');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: '',
          password: 'TestPass123'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Username and password are required');
    });

    it('should validate username format', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'ab', // too short
          password: 'TestPass123'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Username must be 3-50 characters');
    });

    it('should validate password strength', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'testuser',
          password: 'weak' // too weak
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Password must be at least 8 characters');
    });

    it('should validate email format', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'testuser',
          password: 'TestPass123',
          email: 'invalid-email'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Invalid email format');
    });

    it('should handle duplicate username error', async () => {
      mockUserDatabase.registerUser.mockRejectedValueOnce(new Error('Username already exists'));
      
      const { POST } = await import('../register/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'existinguser',
          password: 'TestPass123'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(409);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'testuser',
          password: 'TestPass123'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.token).toBe('mock-jwt-token');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockCookies.set).toHaveBeenCalledWith('session-token', 'mock-jwt-token', expect.objectContaining({
        httpOnly: true,
        secure: false, // test environment
        sameSite: 'strict'
      }));
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'testuser'
          // missing password
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Username and password are required');
    });

    it('should handle invalid credentials', async () => {
      mockUserDatabase.loginUser.mockRejectedValueOnce(new Error('Invalid username or password'));
      
      const { POST } = await import('../login/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          username: 'wronguser',
          password: 'wrongpass'
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid username or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const { POST } = await import('../logout/route');
      
      const mockRequest = {} as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logout successful');
      expect(mockUserDatabase.logoutUser).toHaveBeenCalledWith('mock-session-token');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });

    it('should logout even without session token', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../logout/route');
      
      const mockRequest = {} as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });

    it('should handle database errors gracefully', async () => {
      mockUserDatabase.logoutUser.mockRejectedValueOnce(new Error('Database error'));
      
      const { POST } = await import('../logout/route');
      
      const mockRequest = {} as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logout completed (with warnings)');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify valid session', async () => {
      const { GET } = await import('../verify/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.valid).toBe(true);
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockUserDatabase.verifyToken).toHaveBeenCalledWith('mock-session-token');
    });

    it('should reject missing session token', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../verify/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('No session token found');
    });

    it('should reject invalid session token', async () => {
      mockUserDatabase.verifyToken.mockResolvedValueOnce(null);
      
      const { GET } = await import('../verify/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });

    it('should handle verification errors', async () => {
      mockUserDatabase.verifyToken.mockRejectedValueOnce(new Error('Database error'));
      
      const { GET } = await import('../verify/route');
      
      const mockRequest = {} as any;

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Session verification failed');
      expect(mockCookies.delete).toHaveBeenCalledWith('session-token');
    });
  });
});