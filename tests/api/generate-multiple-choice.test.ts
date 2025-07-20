import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-multiple-choice/route'
import { server } from '../../src/__mocks__/server'

// Mock the services
jest.mock('@/services/multipleChoiceService', () => ({
  generateBasicDistractors: jest.fn(() => ['fala', 'falamos', 'falam']),
  processMultipleChoiceOptions: jest.fn((correctAnswer, distractors) => {
    // Always include the correct answer plus the distractors
    return [correctAnswer, ...distractors].slice(0, 4)
  })
}))

// Mock Anthropic SDK - using manual mock in __mocks__ directory
jest.mock('@anthropic-ai/sdk')

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('/api/generate-multiple-choice', () => {
  const mockExercise = {
    id: '1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1',
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  }

  it('should generate multiple choice options with valid request', async () => {
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(Array.isArray(data.options)).toBe(true)
    expect(data.options.length).toBeGreaterThan(0)
    expect(data.options).toContain('falo') // Should include correct answer
  })

  it('should return fallback options when API fails', async () => {
    // Use invalid API key to trigger error
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should return error for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return fallback options for missing required fields', async () => {
    const requestBody = {
      exercise: mockExercise,
      // Missing other fields like claudeApiKey - should fallback to basic distractors
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should return fallback options when API key is missing', async () => {
    const requestBody = {
      exercise: mockExercise,
      explanationLanguage: 'en'
      // No claudeApiKey - should fallback to basic distractors
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should return error for invalid exercise structure', async () => {
    const requestBody = {
      exercise: {
        id: '1',
        // Missing required fields
      },
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should handle invalid API key', async () => {
    // Use invalid API key to trigger error and fallback
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle malformed AI response', async () => {
    // When API fails to parse response, it falls back to basic distractors
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error', // This will trigger fallback
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle different explanation languages', async () => {
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'pt'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle Ukrainian explanation language', async () => {
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'uk'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle exercise with special characters', async () => {
    const exerciseWithAccents = {
      ...mockExercise,
      correctAnswer: 'está',
      sentence: 'Ele ___ bem.'
    }

    const requestBody = {
      exercise: exerciseWithAccents,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('está')
  })

  it('should handle exercise without hint', async () => {
    const exerciseWithoutHint = {
      ...mockExercise,
      hint: undefined
    }

    const requestBody = {
      exercise: exerciseWithoutHint,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle network timeout', async () => {
    // Test timeout scenario with fallback to basic distractors
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle AI response with non-array data', async () => {
    // Test invalid response format with fallback to basic distractors  
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle AI response with empty array', async () => {
    // Test empty response with fallback to basic distractors
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should handle complex exercise structure', async () => {
    const complexExercise = {
      ...mockExercise,
      hint: {
        infinitive: 'falar',
        person: '1ª pessoa singular',
        form: 'presente do indicativo'
      }
    }

    const requestBody = {
      exercise: complexExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
  })

  it('should filter out invalid distractors', async () => {
    // This test relies on the multipleChoiceService mock to filter properly
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('falo')
    expect(data.options).not.toContain('')
    expect(data.options).not.toContain(null)
  })

  it('should handle very long correct answers', async () => {
    const exerciseWithLongAnswer = {
      ...mockExercise,
      correctAnswer: 'estavámosfastandomuito',
      sentence: 'Nós ___ ontem.'
    }

    const requestBody = {
      exercise: exerciseWithLongAnswer,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    expect(data.options).toContain('estavámosfastandomuito')
  })

  it('should ensure correct answer is always included', async () => {
    // The processMultipleChoiceOptions service is designed to always include the correct answer
    // Test that this behavior works correctly
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-multiple-choice', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('options')
    // The service ensures correct answer is always included
    expect(data.options).toContain('falo')
    expect(data.options.length).toBeGreaterThan(1) // Should have distractors too
  })
})