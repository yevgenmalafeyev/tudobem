import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

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

// Create properly typed mock functions
const mockInitializeTables = jest.fn<() => Promise<void>>();
const mockRegisterUser = jest.fn<(username: string, password: string, email?: string) => Promise<unknown>>();
const mockLogin = jest.fn<(username: string, password: string) => Promise<{ success: boolean; user?: unknown; token?: string; error?: string }>>();
const mockVerifyToken = jest.fn<(token: string) => Promise<unknown>>();
const mockLogoutUser = jest.fn<(userId: string) => Promise<void>>();

mockInitializeTables.mockResolvedValue(undefined);
mockRegisterUser.mockResolvedValue(mockUser);
mockLogin.mockResolvedValue({ success: true, user: mockUser, token: 'mock-jwt-token' });
mockVerifyToken.mockResolvedValue(mockUser);
mockLogoutUser.mockResolvedValue(undefined);

const mockUserDatabase = {
  initializeTables: mockInitializeTables,
  registerUser: mockRegisterUser,
  login: mockLogin,
  verifyToken: mockVerifyToken,
  logoutUser: mockLogoutUser,
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

describe('Authentication API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: 'testuser',
          password: 'TestPass123',
          email: 'test@example.com'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockInitializeTables).toHaveBeenCalled();
      expect(mockRegisterUser).toHaveBeenCalledWith('testuser', 'TestPass123', 'test@example.com');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: '',
          password: 'TestPass123'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Username and password are required');
    });

    it('should validate username format', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: 'ab', // too short
          password: 'TestPass123'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Username must be 3-50 characters');
    });

    it('should validate password strength', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: 'testuser',
          password: 'weak' // too weak
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Password must be at least 8 characters');
    });

    it('should validate email format', async () => {
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: 'testuser',
          password: 'TestPass123',
          email: 'invalid-email'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Invalid email format');
    });

    it('should handle duplicate username error', async () => {
      mockRegisterUser.mockRejectedValueOnce(new Error('Username already exists'));
      
      const { POST } = await import('../register/route');
      
      const mockRequest = createMockRequest({
          username: 'existinguser',
          password: 'TestPass123'
      });

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
      
      const mockRequest = createMockRequest({
          email: 'testuser@example.com',
          password: 'TestPass123'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.email).toBe('test@example.com');
      expect(responseData.data.token).toBe('mock-jwt-token');
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockSet).toHaveBeenCalledWith('session-token', 'mock-jwt-token', expect.objectContaining({
        httpOnly: true,
        secure: false, // test environment
        sameSite: 'strict'
      }));
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../login/route');
      
      const mockRequest = createMockRequest({
          email: 'testuser@example.com'
          // missing password
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Email and password are required');
    });

    it('should handle invalid credentials', async () => {
      mockLogin.mockResolvedValueOnce({ success: false, error: 'Invalid email or password' });
      
      const { POST } = await import('../login/route');
      
      const mockRequest = createMockRequest({
          email: 'wronguser@example.com',
          password: 'wrongpass'
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const { POST } = await import('../logout/route');
      
      const response = await POST();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logout successful');
      expect(mockLogoutUser).toHaveBeenCalledWith('mock-session-token');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });

    it('should logout even without session token', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../logout/route');
      
      const response = await POST();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });

    it('should handle database errors gracefully', async () => {
      mockUserDatabase.logoutUser.mockRejectedValueOnce(new Error('Database error'));
      
      const { POST } = await import('../logout/route');
      
      const response = await POST();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logout completed (with warnings)');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify valid session', async () => {
      const { GET } = await import('../verify/route');
      
      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.user.username).toBe('testuser');
      expect(responseData.data.valid).toBe(true);
      expect(responseData.data.user.password_hash).toBeUndefined(); // Should not return password
      expect(mockUserDatabase.verifyToken).toHaveBeenCalledWith('mock-session-token');
    });

    it('should reject missing session token', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      const { GET } = await import('../verify/route');
      
      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('No session token found');
    });

    it('should reject invalid session token', async () => {
      mockUserDatabase.verifyToken.mockResolvedValueOnce(null);
      
      const { GET } = await import('../verify/route');
      
      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Invalid or expired session');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });

    it('should handle verification errors', async () => {
      mockUserDatabase.verifyToken.mockRejectedValueOnce(new Error('Database error'));
      
      const { GET } = await import('../verify/route');
      
      const response = await GET();
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Session verification failed');
      expect(mockDelete).toHaveBeenCalledWith('session-token');
    });
  });
});