import { NextRequest } from 'next/server'
import { POST } from '@/app/api/check-answer/route'
import { server } from '@/src/__mocks__/server'

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{
          text: JSON.stringify({
            isCorrect: true,
            explanation: 'Correct! You used the right form of the verb.'
          })
        }]
      })
    }
  }))
}))

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('/api/check-answer', () => {
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

  it('should check correct answer', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
    expect(typeof data.explanation).toBe('string')
  })

  it('should check incorrect answer', async () => {
    // Mock Anthropic to return incorrect response
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            text: JSON.stringify({
              isCorrect: false,
              explanation: 'Incorrect. The correct answer is "falo".'
            })
          }]
        })
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'fala',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', false)
    expect(data).toHaveProperty('explanation')
    expect(data.explanation).toContain('Incorrect')
  })

  it('should handle case-insensitive comparison', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'FALO',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
  })

  it('should handle whitespace trimming', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: '  falo  ',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
  })

  it('should return error for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for missing required fields', async () => {
    const requestBody = {
      exercise: mockExercise,
      // Missing userAnswer and other required fields
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for missing API key', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should handle API failure with fallback', async () => {
    // Mock Anthropic to throw error
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true) // Should use fallback logic
    expect(data).toHaveProperty('explanation')
  })

  it('should handle malformed AI response', async () => {
    // Mock Anthropic to return invalid JSON
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            text: 'Invalid JSON response'
          }]
        })
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true) // Should use fallback logic
    expect(data).toHaveProperty('explanation')
  })

  it('should handle empty user answer', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: '',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', false)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle different explanation languages', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'pt'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle Ukrainian explanation language', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'uk'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle special characters in answers', async () => {
    const exerciseWithAccents = {
      ...mockExercise,
      correctAnswer: 'está',
      sentence: 'Ele ___ bem.'
    }

    const requestBody = {
      exercise: exerciseWithAccents,
      userAnswer: 'está',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
  })

  it('should handle invalid API key', async () => {
    // Mock Anthropic to throw authentication error
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockRejectedValue(new Error('Authentication failed'))
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'invalid-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle network timeout', async () => {
    // Mock Anthropic to simulate timeout
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
        )
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle exercise without hint', async () => {
    const exerciseWithoutHint = {
      ...mockExercise,
      hint: undefined
    }

    const requestBody = {
      exercise: exerciseWithoutHint,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
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
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })

  it('should handle very long user answers', async () => {
    const longAnswer = 'a'.repeat(1000)

    const requestBody = {
      exercise: mockExercise,
      userAnswer: longAnswer,
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('isCorrect', false)
    expect(data).toHaveProperty('explanation')
  })

  it('should validate response structure from AI', async () => {
    // Mock Anthropic to return valid but incomplete response
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            text: JSON.stringify({
              isCorrect: true,
              // Missing explanation
            })
          }]
        })
      }
    }))

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('isCorrect', true)
    expect(data).toHaveProperty('explanation')
  })
})