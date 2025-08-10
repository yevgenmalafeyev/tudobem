import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

// Type for test results that contain level property
interface LevelResult {
  level: string;
  status?: string;
  neededCount?: number;
}

const mockGeneratedExercise = {
  sentence: "Eu _____ português.",
  correctAnswer: "estudo",
  topic: "verbos",
  level: "A1",
  hint: {
    infinitive: "estudar",
    person: "primeira pessoa singular",
    form: "presente do indicativo"
  },
  multipleChoiceOptions: ["estudo", "estudas", "estuda", "estudamos"],
  explanations: {
    pt: "Primeira pessoa do singular do verbo 'estudar'.",
    en: "First person singular of the verb 'to study'.",
    uk: "Перша особа однини дієслова 'вивчати'."
  }
};

const mockDbExercise = {
  id: 'exercise-id',
  sentence: "Eu _____ português.",
  correct_answer: "estudo",
  topic: "verbos",
  level: "A1",
  multiple_choice_options: ["estudo", "estudas", "estuda", "estudamos"],
  explanation_pt: "Primeira pessoa do singular do verbo 'estudar'.",
  explanation_en: "First person singular of the verb 'to study'.",
  explanation_uk: "Перша особа однини дієслова 'вивчати'."
};

// Create properly typed mock functions
const mockInitializeTables = jest.fn<() => Promise<void>>();
const mockGetClaudeApiKey = jest.fn<() => Promise<string | null>>();
const mockExerciseExists = jest.fn<(sentence: string, correctAnswer: string) => Promise<boolean>>();
const mockSaveBatchExercises = jest.fn<(exercises: unknown[]) => Promise<unknown[]>>();
const mockGetStats = jest.fn<() => Promise<{ total: number; byLevel: Array<{ level: string; count: number }> }>>();

mockInitializeTables.mockResolvedValue(undefined);
mockGetClaudeApiKey.mockResolvedValue('sk-ant-api03-test-key');
mockExerciseExists.mockResolvedValue(false);
mockSaveBatchExercises.mockResolvedValue([mockDbExercise]);
mockGetStats.mockResolvedValue({
  total: 50,
  byLevel: [
    { level: 'A1', count: 20 },
    { level: 'A2', count: 15 },
    { level: 'B1', count: 10 },
    { level: 'B2', count: 5 }
  ]
});

const mockUserDatabase = {
  initializeTables: mockInitializeTables,
  getClaudeApiKey: mockGetClaudeApiKey
};

const mockExerciseDatabase = {
  initializeTables: mockInitializeTables,
  exerciseExists: mockExerciseExists,
  saveBatchExercises: mockSaveBatchExercises,
  getStats: mockGetStats
};

jest.mock('@/lib/userDatabase', () => ({
  UserDatabase: mockUserDatabase
}));

jest.mock('@/lib/database', () => ({
  ExerciseDatabase: mockExerciseDatabase
}));

const mockSet = jest.fn<(name: string, value: string, options?: unknown) => void>();
const mockGet = jest.fn<(name: string) => { value?: string } | undefined>();
const mockDelete = jest.fn<(name: string) => void>();

mockGet.mockReturnValue({ value: 'authenticated' });

const mockCookies = {
  set: mockSet,
  get: mockGet,
  delete: mockDelete
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => mockCookies)
}));

const mockCallClaudeApi = jest.fn<(apiKey: string, prompt: string) => Promise<string>>();
const mockExtractJsonFromClaudeResponse = jest.fn<(response: string) => string>();
const mockRequireAdminAuth = jest.fn<() => Promise<unknown>>();

mockCallClaudeApi.mockResolvedValue(
  `Here are the exercises:\n${JSON.stringify([mockGeneratedExercise])}\n\nThese exercises are suitable for learning.`
);
mockExtractJsonFromClaudeResponse.mockReturnValue(
  JSON.stringify([mockGeneratedExercise])
);
mockRequireAdminAuth.mockResolvedValue(null);

jest.mock('@/lib/api-utils', () => ({
  createApiError: jest.fn((message, status) => ({ 
    json: () => Promise.resolve({ success: false, error: message }), 
    status 
  })),
  createApiSuccess: jest.fn(),
  createApiResponse: jest.fn((data) => ({
    json: () => Promise.resolve({ success: true, data }),
    status: 200
  })),
  parseRequestBody: jest.fn(async (request: { json: () => Promise<unknown> }) => await request.json()),
  requireAdminAuth: mockRequireAdminAuth,
  withErrorHandling: jest.fn((handler) => handler),
  callClaudeApi: mockCallClaudeApi,
  extractJsonFromClaudeResponse: mockExtractJsonFromClaudeResponse
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

describe('Exercise Generation API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to authenticated by default
    mockGet.mockReturnValue({ value: 'authenticated' });
    mockGetClaudeApiKey.mockResolvedValue('sk-ant-api03-test-key');
    mockExerciseExists.mockResolvedValue(false);
    mockRequireAdminAuth.mockResolvedValue(null); // null means authorized
  });

  describe('POST /api/admin/generate', () => {
    it('should generate exercises successfully', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos', 'substantivos'],
          levels: ['A1', 'A2'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.generated.total).toBe(1);
      expect(responseData.data.generated.saved).toBe(1);
      expect(responseData.data.generated.duplicates).toBe(0);
      expect(responseData.data.exercises).toHaveLength(1);
      expect(mockGetClaudeApiKey).toHaveBeenCalled();
      expect(mockCallClaudeApi).toHaveBeenCalled();
      expect(mockSaveBatchExercises).toHaveBeenCalledWith([mockGeneratedExercise]);
    });

    it('should require admin authentication', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      // Make requireAdminAuth return an error response
      mockRequireAdminAuth.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Unauthorized' }),
        status: 401
      });
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          // missing topics
          levels: ['A1'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Topics array is required');
    });

    it('should validate count range', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1'],
          count: 25 // too high
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Count must be a number between 1 and 20');
    });

    it('should validate language levels', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1', 'INVALID'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Invalid levels: INVALID');
    });

    it('should handle missing API key', async () => {
      mockGetClaudeApiKey.mockResolvedValueOnce(null);
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Claude API key not configured');
    });

    it('should handle JSON parse errors', async () => {
      mockExtractJsonFromClaudeResponse.mockReturnValueOnce('invalid json');
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Failed to parse generated exercises');
    });

    it('should handle duplicate exercises', async () => {
      mockExerciseExists.mockResolvedValueOnce(true);
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = createMockRequest({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.generated.duplicates).toBe(1);
      expect(responseData.data.generated.saved).toBe(0);
    });
  });

  describe('POST /api/admin/auto-generate', () => {
    it('should auto-generate exercises successfully', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          targetCounts: {
            'A1': 50,
            'A2': 40
          },
          topics: ['verbos', 'substantivos']
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.summary.levelsProcessed).toBe(2);
      expect(responseData.data.summary.successful).toBeGreaterThan(0);
      expect(responseData.data.results).toHaveLength(2);
      expect(mockGetStats).toHaveBeenCalled();
    });

    it('should require admin authentication', async () => {
      mockGet.mockReturnValueOnce(undefined);
      
      // Make requireAdminAuth return an error response
      mockRequireAdminAuth.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: 'Unauthorized' }),
        status: 401
      });
      
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          targetCounts: { 'A1': 50 }
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should validate target counts', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          // missing targetCounts
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('targetCounts object is required');
    });

    it('should validate target count values', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          targetCounts: {
            'A1': 1500 // too high
          }
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Target count for A1 must be a number between 0 and 1000');
    });

    it('should skip levels that already meet targets', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          targetCounts: {
            'A1': 15 // current is 20, so target already met
          }
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      const a1Result = responseData.data.results.find((r: LevelResult) => r.level === 'A1');
      expect(a1Result.status).toBe('target_met');
      expect(a1Result.neededCount).toBe(0);
    });

    it('should handle missing API key', async () => {
      mockGetClaudeApiKey.mockResolvedValueOnce(null);
      
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = createMockRequest({
          targetCounts: { 'A1': 50 }
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Claude API key not configured');
    });
  });
});