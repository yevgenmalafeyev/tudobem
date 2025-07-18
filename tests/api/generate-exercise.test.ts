import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-exercise/route'
import { server } from '../../src/__mocks__/server'

// Mock the getFallbackExercise function
jest.mock('@/services/exerciseService', () => ({
  getFallbackExercise: jest.fn(() => ({
    id: 'fallback-1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1',
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  })),
  createExercise: jest.fn((data) => ({
    id: 'generated-1',
    sentence: data.sentence,
    gapIndex: 1,
    correctAnswer: data.correctAnswer,
    topic: data.topic,
    level: data.level,
    hint: data.hint
  }))
}))

// Mock the generateExercisePrompt function
jest.mock('@/utils/prompts', () => ({
  generateExercisePrompt: jest.fn(() => 'Mock prompt for exercise generation')
}))

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({
            sentence: 'Eu ___ português.',
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            hint: {
              infinitive: 'falar',
              form: 'present indicative'
            }
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

describe('/api/generate-exercise', () => {
  it('should generate exercise with API key', async () => {
    const requestBody = {
      levels: ['A1'],
      topics: ['present-indicative'],
      claudeApiKey: 'test-key',
      masteredWords: {}
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('sentence')
    expect(data.data).toHaveProperty('correctAnswer')
    expect(data.data).toHaveProperty('topic')
    expect(data.data).toHaveProperty('level')
  })

  it('should generate fallback exercise without API key', async () => {
    const requestBody = {
      levels: ['A1'],
      topics: ['present-indicative'],
      masteredWords: {}
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('id', 'fallback-1')
    expect(data.data).toHaveProperty('sentence')
    expect(data.data).toHaveProperty('correctAnswer')
  })

  it('should return error for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/generate-exercise', {
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

  it('should handle API failure with fallback', async () => {
    // Mock Anthropic to throw error
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    }))

    const requestBody = {
      levels: ['A1'],
      topics: ['present-indicative'],
      claudeApiKey: 'test-key',
      masteredWords: {}
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data.data).toHaveProperty('id', 'fallback-1')
  })
})