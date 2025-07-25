import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

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

const mockUserDatabase = {
  initializeTables: jest.fn().mockResolvedValue(undefined),
  getClaudeApiKey: jest.fn().mockResolvedValue('sk-ant-api03-test-key')
};

const mockExerciseDatabase = {
  initializeTables: jest.fn().mockResolvedValue(undefined),
  exerciseExists: jest.fn().mockResolvedValue(false),
  saveBatchExercises: jest.fn().mockResolvedValue([mockDbExercise]),
  getStats: jest.fn().mockResolvedValue({
    total: 50,
    byLevel: [
      { level: 'A1', count: 20 },
      { level: 'A2', count: 15 },
      { level: 'B1', count: 10 },
      { level: 'B2', count: 5 }
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

const mockCallClaudeApi = jest.fn().mockResolvedValue(
  `Here are the exercises:\n${JSON.stringify([mockGeneratedExercise])}\n\nThese exercises are suitable for learning.`
);

const mockExtractJsonFromClaudeResponse = jest.fn().mockReturnValue(
  JSON.stringify([mockGeneratedExercise])
);

jest.mock('@/lib/api-utils', () => ({
  ...jest.requireActual('@/lib/api-utils'),
  callClaudeApi: mockCallClaudeApi,
  extractJsonFromClaudeResponse: mockExtractJsonFromClaudeResponse
}));

describe('Exercise Generation API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to authenticated by default
    mockCookies.get.mockReturnValue({ value: 'authenticated' });
    mockUserDatabase.getClaudeApiKey.mockResolvedValue('sk-ant-api03-test-key');
    mockExerciseDatabase.exerciseExists.mockResolvedValue(false);
  });

  describe('POST /api/admin/generate', () => {
    it('should generate exercises successfully', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos', 'substantivos'],
          levels: ['A1', 'A2'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.generated.total).toBe(1);
      expect(responseData.data.generated.saved).toBe(1);
      expect(responseData.data.generated.duplicates).toBe(0);
      expect(responseData.data.exercises).toHaveLength(1);
      expect(mockUserDatabase.getClaudeApiKey).toHaveBeenCalled();
      expect(mockCallClaudeApi).toHaveBeenCalled();
      expect(mockExerciseDatabase.saveBatchExercises).toHaveBeenCalledWith([mockGeneratedExercise]);
    });

    it('should require admin authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should validate required fields', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          // missing topics
          levels: ['A1'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Topics array is required');
    });

    it('should validate count range', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1'],
          count: 25 // too high
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Count must be a number between 1 and 20');
    });

    it('should validate language levels', async () => {
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1', 'INVALID'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Invalid levels: INVALID');
    });

    it('should handle missing API key', async () => {
      mockUserDatabase.getClaudeApiKey.mockResolvedValueOnce(null);
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Claude API key not configured');
    });

    it('should handle JSON parse errors', async () => {
      mockExtractJsonFromClaudeResponse.mockReturnValueOnce('invalid json');
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Failed to parse generated exercises');
    });

    it('should handle duplicate exercises', async () => {
      mockExerciseDatabase.exerciseExists.mockResolvedValueOnce(true);
      
      const { POST } = await import('../generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          topics: ['verbos'],
          levels: ['A1'],
          count: 5
        })
      } as any;

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
      
      const mockRequest = {
        json: () => Promise.resolve({
          targetCounts: {
            'A1': 50,
            'A2': 40
          },
          topics: ['verbos', 'substantivos']
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.summary.levelsProcessed).toBe(2);
      expect(responseData.data.summary.successful).toBeGreaterThan(0);
      expect(responseData.data.results).toHaveLength(2);
      expect(mockExerciseDatabase.getStats).toHaveBeenCalled();
    });

    it('should require admin authentication', async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          targetCounts: { 'A1': 50 }
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should validate target counts', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          // missing targetCounts
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('targetCounts object is required');
    });

    it('should validate target count values', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          targetCounts: {
            'A1': 1500 // too high
          }
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Target count for A1 must be a number between 0 and 1000');
    });

    it('should skip levels that already meet targets', async () => {
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          targetCounts: {
            'A1': 15 // current is 20, so target already met
          }
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      const a1Result = responseData.data.results.find((r: any) => r.level === 'A1');
      expect(a1Result.status).toBe('target_met');
      expect(a1Result.neededCount).toBe(0);
    });

    it('should handle missing API key', async () => {
      mockUserDatabase.getClaudeApiKey.mockResolvedValueOnce(null);
      
      const { POST } = await import('../auto-generate/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          targetCounts: { 'A1': 50 }
        })
      } as any;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('Claude API key not configured');
    });
  });
});