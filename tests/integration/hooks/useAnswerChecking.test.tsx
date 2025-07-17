import { renderHook, act, waitFor } from '@testing-library/react'
import { useAnswerChecking } from '@/hooks/useAnswerChecking'
import { server } from '@/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Mock functions
const mockSetFeedback = jest.fn()
const mockSetShowAnswer = jest.fn()
const mockSetIsLoading = jest.fn()
const mockAddIncorrectAnswer = jest.fn()

const mockProps = {
  setFeedback: mockSetFeedback,
  setShowAnswer: mockSetShowAnswer,
  setIsLoading: mockSetIsLoading,
  addIncorrectAnswer: mockAddIncorrectAnswer
}

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('useAnswerChecking hook', () => {
  const mockExercise = {
    id: '1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1' as const,
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  }

  it('should check correct answer successfully', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: true,
        explanation: expect.any(String)
      })
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should check incorrect answer successfully', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'fala',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: false,
        explanation: expect.any(String)
      })
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockAddIncorrectAnswer).toHaveBeenCalledWith(mockExercise, 'fala')
    })
  })

  it('should handle API error with fallback', async () => {
    // Mock API error
    server.use(
      http.post('/api/check-answer', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'API Error' }))
      })
    )

    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: true, // Should still check correctly with fallback
        explanation: expect.any(String)
      })
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should use correct API parameters', async () => {
    let requestBody: any
    
    server.use(
      http.post('/api/check-answer', async (req, res, ctx) => {
        requestBody = await req.json()
        return res(ctx.json({
          isCorrect: true,
          explanation: 'Correto!'
        }))
      })
    )

    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(requestBody).toEqual({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })
  })

  it('should handle loading states correctly', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    const checkPromise = act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    // Should set loading to true initially
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)

    await checkPromise

    // Should set loading to false after completion
    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should show answer after checking', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
    })
  })

  it('should handle network errors gracefully', async () => {
    // Mock network error
    server.use(
      http.post('/api/check-answer', (req, res, ctx) => {
        return res.networkError('Network error')
      })
    )

    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockSetFeedback).toHaveBeenCalled()
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
    })
  })

  it('should handle invalid API response gracefully', async () => {
    // Mock invalid response
    server.use(
      http.post('/api/check-answer', (req, res, ctx) => {
        return res(ctx.json({ invalid: 'response' }))
      })
    )

    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockSetFeedback).toHaveBeenCalled()
      expect(mockSetShowAnswer).toHaveBeenCalledWith(true)
    })
  })

  it('should handle case-insensitive answers', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'FALO',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: true,
        explanation: expect.any(String)
      })
    })
  })

  it('should handle whitespace in answers', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: '  falo  ',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: true,
        explanation: expect.any(String)
      })
    })
  })

  it('should track incorrect answers', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'fala',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockAddIncorrectAnswer).toHaveBeenCalledWith(mockExercise, 'fala')
    })
  })

  it('should not track correct answers as incorrect', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockAddIncorrectAnswer).not.toHaveBeenCalled()
    })
  })

  it('should handle different explanation languages', async () => {
    let requestBody: any
    
    server.use(
      http.post('/api/check-answer', async (req, res, ctx) => {
        requestBody = await req.json()
        return res(ctx.json({
          isCorrect: true,
          explanation: 'Correto!'
        }))
      })
    )

    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: 'falo',
        claudeApiKey: 'test-key',
        explanationLanguage: 'pt'
      })
    })

    await waitFor(() => {
      expect(requestBody.explanationLanguage).toBe('pt')
    })
  })

  it('should handle empty user answer', async () => {
    const { result } = renderHook(() => useAnswerChecking(mockProps))

    await act(async () => {
      await result.current.checkAnswer({
        exercise: mockExercise,
        userAnswer: '',
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })

    await waitFor(() => {
      expect(mockSetFeedback).toHaveBeenCalledWith({
        isCorrect: false,
        explanation: expect.any(String)
      })
      expect(mockAddIncorrectAnswer).toHaveBeenCalledWith(mockExercise, '')
    })
  })
})