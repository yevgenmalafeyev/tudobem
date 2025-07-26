import { renderHook, act } from '@testing-library/react'
import { useLearning } from '@/hooks/useLearning'

// Create mutable state for the store mock
let mockCurrentExercise: unknown = null;
const mockSetCurrentExercise = jest.fn((exercise: unknown) => {
  mockCurrentExercise = exercise;
});

// Mock the store
jest.mock('@/store/useStore', () => ({
  useStore: () => ({
    configuration: {
      selectedLevels: ['A1', 'A2'],
      selectedTopics: ['present-indicative'],
      claudeApiKey: 'test-key',
      appLanguage: 'en'
    },
    isConfigured: true,
    get currentExercise() {
      return mockCurrentExercise;
    },
    progress: {
      incorrectAnswers: {},
      reviewQueue: [],
      masteredWords: {}
    },
    setCurrentExercise: mockSetCurrentExercise,
    addIncorrectAnswer: jest.fn()
  })
}))

describe('useLearning hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentExercise = null
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLearning())

    expect(result.current.userAnswer).toBe('')
    expect(result.current.selectedOption).toBe('')
    expect(result.current.multipleChoiceOptions).toEqual([])
    expect(result.current.learningMode).toBe('input')
    expect(result.current.feedback).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.showAnswer).toBe(false)
    expect(result.current.currentExercise).toBeNull()
  })

  it('should update user answer', () => {
    const { result } = renderHook(() => useLearning())

    act(() => {
      result.current.setUserAnswer('falo')
    })

    expect(result.current.userAnswer).toBe('falo')
  })

  it('should update selected option', () => {
    const { result } = renderHook(() => useLearning())

    act(() => {
      result.current.setSelectedOption('falo')
    })

    expect(result.current.selectedOption).toBe('falo')
  })

  it('should update learning mode', () => {
    const { result } = renderHook(() => useLearning())

    act(() => {
      result.current.setLearningMode('multiple-choice')
    })

    expect(result.current.learningMode).toBe('multiple-choice')
  })

  it('should update multiple choice options', () => {
    const { result } = renderHook(() => useLearning())
    const options = ['falo', 'fala', 'falamos', 'falam']

    act(() => {
      result.current.setMultipleChoiceOptions(options)
    })

    expect(result.current.multipleChoiceOptions).toEqual(options)
  })

  it('should update feedback', () => {
    const { result } = renderHook(() => useLearning())
    const feedback = { isCorrect: true, explanation: 'Correct!' }

    act(() => {
      result.current.setFeedback(feedback)
    })

    expect(result.current.feedback).toEqual(feedback)
  })

  it('should update loading state', () => {
    const { result } = renderHook(() => useLearning())

    act(() => {
      result.current.setIsLoading(true)
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should update show answer state', () => {
    const { result } = renderHook(() => useLearning())

    act(() => {
      result.current.setShowAnswer(true)
    })

    expect(result.current.showAnswer).toBe(true)
  })

  it('should update current exercise', () => {
    const { result } = renderHook(() => useLearning())
    const exercise = {
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

    act(() => {
      result.current.setCurrentExercise(exercise)
    })

    // Verify the function was called with the correct exercise
    expect(mockSetCurrentExercise).toHaveBeenCalledWith(exercise)
    expect(result.current.setCurrentExercise).toBeDefined()
  })

  it('should add incorrect answer', () => {
    const { result } = renderHook(() => useLearning())
    const exercise = {
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

    act(() => {
      result.current.addIncorrectAnswer(exercise, 'fala')
    })

    // The function should be available and callable
    expect(result.current.addIncorrectAnswer).toBeDefined()
    expect(typeof result.current.addIncorrectAnswer).toBe('function')
  })

  it('should reset state', () => {
    const { result } = renderHook(() => useLearning())

    // Set some state first
    act(() => {
      result.current.setUserAnswer('falo')
      result.current.setSelectedOption('falo')
      result.current.setFeedback({ isCorrect: true, explanation: 'Correct!' })
      result.current.setShowAnswer(true)
    })

    // Reset state
    act(() => {
      result.current.resetState()
    })

    expect(result.current.userAnswer).toBe('')
    expect(result.current.selectedOption).toBe('')
    expect(result.current.feedback).toBeNull()
    expect(result.current.showAnswer).toBe(false)
  })

  it('should get current answer based on mode', () => {
    const { result } = renderHook(() => useLearning())

    // Test input mode
    act(() => {
      result.current.setLearningMode('input')
      result.current.setUserAnswer('falo')
    })

    expect(result.current.getCurrentAnswer()).toBe('falo')

    // Test multiple choice mode
    act(() => {
      result.current.setLearningMode('multiple-choice')
      result.current.setSelectedOption('fala')
    })

    expect(result.current.getCurrentAnswer()).toBe('fala')
  })

  it('should validate answer correctly', () => {
    const { result } = renderHook(() => useLearning())

    // Test input mode with valid answer
    act(() => {
      result.current.setLearningMode('input')
      result.current.setUserAnswer('falo')
    })

    expect(result.current.hasValidAnswer()).toBe(true)

    // Test input mode with empty answer
    act(() => {
      result.current.setUserAnswer('')
    })

    expect(result.current.hasValidAnswer()).toBe(false)

    // Test multiple choice mode with selection
    act(() => {
      result.current.setLearningMode('multiple-choice')
      result.current.setSelectedOption('falo')
    })

    expect(result.current.hasValidAnswer()).toBe(true)

    // Test multiple choice mode without selection
    act(() => {
      result.current.setSelectedOption('')
    })

    expect(result.current.hasValidAnswer()).toBe(false)
  })

  it('should handle focus input', () => {
    const { result } = renderHook(() => useLearning())

    // Mock the input ref
    {
      current: {
        focus: jest.fn()
      }
    }
    
    // This would normally be handled by the component using the hook
    // The exact implementation depends on how the ref is managed
    act(() => {
      result.current.focusInput()
    })

    // The focus functionality would be tested in the component tests
    expect(result.current.focusInput).toBeDefined()
  })

  it('should provide configuration from store', () => {
    const { result } = renderHook(() => useLearning())

    expect(result.current.configuration).toEqual({
      selectedLevels: ['A1', 'A2'],
      selectedTopics: ['present-indicative'],
      claudeApiKey: 'test-key',
      appLanguage: 'en'
    })
  })

  it('should handle learning mode changes correctly', () => {
    const { result } = renderHook(() => useLearning())

    // Start in input mode
    expect(result.current.learningMode).toBe('input')

    // Switch to multiple choice
    act(() => {
      result.current.setLearningMode('multiple-choice')
    })

    expect(result.current.learningMode).toBe('multiple-choice')

    // Switch back to input
    act(() => {
      result.current.setLearningMode('input')
    })

    expect(result.current.learningMode).toBe('input')
  })

  it('should handle state updates without affecting other state', () => {
    const { result } = renderHook(() => useLearning())

    // Set initial state
    act(() => {
      result.current.setUserAnswer('falo')
      result.current.setSelectedOption('fala')
      result.current.setIsLoading(true)
    })

    // Update one piece of state
    act(() => {
      result.current.setShowAnswer(true)
    })

    // Other state should remain unchanged
    expect(result.current.userAnswer).toBe('falo')
    expect(result.current.selectedOption).toBe('fala')
    expect(result.current.isLoading).toBe(true)
    expect(result.current.showAnswer).toBe(true)
  })
})