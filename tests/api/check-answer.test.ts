import { describe, it, expect, beforeAll, afterEach, afterAll, jest } from '@jest/globals';
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/check-answer/route'
import { server } from '../../src/__mocks__/server'

// Mock Anthropic SDK - using manual mock in __mocks__ directory
jest.mock('@anthropic-ai/sdk')

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
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', true)
    expect(data.data).toHaveProperty('explanation')
    expect(typeof data.data.explanation).toBe('string')
  })

  it('should check incorrect answer', async () => {
    // The manual mock automatically detects wrong answers and returns incorrect response

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'fala',
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', false)
    expect(data.data).toHaveProperty('explanation')
    expect(data.data.explanation).toContain('Incorrect')
  })

  it('should handle case-insensitive comparison without API key', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'FALO',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', true)
  })

  it('should handle whitespace trimming', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: '  falo  ',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', true)
  })

  it('should return error for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('success', false)
    expect(data).toHaveProperty('error')
  })

  it('should work without API key using fallback', async () => {
    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'wrong',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', false)
    expect(data.data.explanation).toContain('Incorrect')
  })

  it('should handle API failure with fallback', async () => {
    // For API failure test, we can test with invalid API key which triggers fallback

    const requestBody = {
      exercise: mockExercise,
      userAnswer: 'falo',
      claudeApiKey: 'invalid-key-triggers-error',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/check-answer', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('isCorrect', true)
    expect(data.data).toHaveProperty('explanation')
  })
})