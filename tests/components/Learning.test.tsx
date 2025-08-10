import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Learning from '@/components/Learning'

// Create a mock function that can be modified in tests
const mockUseLearning = jest.fn()

// Mock all the hooks used by Learning component
jest.mock('@/hooks/useLearning', () => ({
  useLearning: () => mockUseLearning()
}))

// Default mock implementation
const defaultUseLearningMock = {
  // State
  userAnswer: '',
  selectedOption: null,
  multipleChoiceOptions: [],
  learningMode: 'input' as const,
  feedback: null,
  isLoading: false,
  showAnswer: false,
  inputRef: { current: null },
  currentExercise: {
    id: '1',
    sentence: 'Eu ___ português.',
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1' as const,
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  },
  configuration: {
    selectedLevels: ['A1'],
    selectedTopics: ['present-indicative'],
    claudeApiKey: 'test-key',
    appLanguage: 'en'
  },
  
  // Actions
  setUserAnswer: jest.fn(),
  setSelectedOption: jest.fn(),
  setMultipleChoiceOptions: jest.fn(),
  setLearningMode: jest.fn(),
  setFeedback: jest.fn(),
  setIsLoading: jest.fn(),
  setShowAnswer: jest.fn(),
  setCurrentExercise: jest.fn(),
  addIncorrectAnswer: jest.fn(),
  resetState: jest.fn(),
  getCurrentAnswer: jest.fn(() => ''),
  hasValidAnswer: jest.fn(() => false),
  focusInput: jest.fn()
}

jest.mock('@/hooks/useExerciseQueue', () => ({
  useExerciseQueue: () => ({
    exerciseQueue: {
      exercises: [],
      currentIndex: 0,
      isBackgroundLoading: false,
      nextBatchLoading: false,
      generationSource: 'ai',
      sessionId: 'test-session',
      totalGenerated: 0
    },
    queueStatus: 'idle' as const,
    isGenerating: false,
    isLoading: false,
    isBackgroundLoading: false,
    generationSource: 'ai',
    clearQueue: jest.fn(),
    addToQueue: jest.fn(),
    loadInitialBatch: jest.fn(),
    getCurrentExercise: jest.fn(),
    getNextExercise: jest.fn(),
    queueStats: {
      total: 0,
      completed: 0,
      remaining: 0,
      progressPercentage: 0,
      totalGenerated: 0
    }
  })
}))

jest.mock('@/hooks/useAnswerChecking', () => ({
  useAnswerChecking: () => ({
    checkAnswer: jest.fn()
  })
}))


// Mock child components
jest.mock('@/components/GenerationStatusIndicator', () => {
  return function MockGenerationStatusIndicator() {
    return <div data-testid="generation-status-indicator">Generation Status</div>
  }
})

jest.mock('@/components/learning/ModeToggle', () => {
  return function MockModeToggle({ mode, onModeChange }: { mode: string; onModeChange?: (mode: string) => void }) {
    return (
      <button 
        data-testid="mode-toggle" 
        onClick={() => onModeChange && onModeChange(mode === 'input' ? 'multiple-choice' : 'input')}
      >
        {mode === 'input' ? 'Switch to Multiple Choice' : 'Switch to Input'}
      </button>
    )
  }
})

jest.mock('@/components/learning/ExerciseDisplay', () => {
  return function MockExerciseDisplay({ exercise }: { exercise?: { sentence?: string } }) {
    return <div data-testid="exercise-display">{exercise?.sentence}</div>
  }
})

jest.mock('@/components/learning/MultipleChoiceOptions', () => {
  return function MockMultipleChoiceOptions() {
    return <div data-testid="multiple-choice-options">Multiple Choice Options</div>
  }
})

jest.mock('@/components/learning/FeedbackDisplay', () => {
  return function MockFeedbackDisplay({ feedback }: { feedback?: { explanation?: string } }) {
    return feedback ? <div data-testid="feedback-display">{feedback.explanation}</div> : null
  }
})

jest.mock('@/components/learning/ActionButtons', () => {
  return function MockActionButtons() {
    return <div data-testid="action-buttons">Action Buttons</div>
  }
})

// Mock translations
jest.mock('@/utils/translations', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'learning.noExercise': 'No exercise available',
      'learning.loading': 'Loading...',
      'learning.error': 'Error loading exercise'
    }
    return translations[key] || key
  }
}))

describe('Learning Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set default mock implementation
    mockUseLearning.mockReturnValue(defaultUseLearningMock)
  })

  it('should render without crashing', () => {
    render(<Learning />)
    
    expect(screen.getByTestId('generation-status-indicator')).toBeInTheDocument()
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('exercise-display')).toBeInTheDocument()
  })

  it('should display the current exercise', () => {
    render(<Learning />)
    
    expect(screen.getByTestId('exercise-display')).toHaveTextContent('Eu ___ português.')
  })

  it('should show action buttons', () => {
    render(<Learning />)
    
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument()
  })

  it('should show generation status indicator', () => {
    render(<Learning />)
    
    expect(screen.getByTestId('generation-status-indicator')).toBeInTheDocument()
  })

  it('should handle mode toggle interaction', () => {
    render(<Learning />)
    
    const modeToggle = screen.getByTestId('mode-toggle')
    expect(modeToggle).toHaveTextContent('Switch to Input')
    
    fireEvent.click(modeToggle)
    // The mock doesn't actually change the mode, but we can verify the button exists
    expect(modeToggle).toBeInTheDocument()
  })

  it('should render multiple choice options when in multiple choice mode', () => {
    // Mock the learning mode to be multiple-choice
    mockUseLearning.mockReturnValue({
      ...defaultUseLearningMock,
      learningMode: 'multiple-choice',
      multipleChoiceOptions: ['falo', 'fala', 'falamos', 'falam']
    })

    render(<Learning />)
    
    expect(screen.getByTestId('multiple-choice-options')).toBeInTheDocument()
  })

  it('should not render multiple choice options when in input mode', () => {
    render(<Learning />)
    
    expect(screen.queryByTestId('multiple-choice-options')).not.toBeInTheDocument()
  })

  it('should show feedback when available', () => {
    mockUseLearning.mockReturnValue({
      ...defaultUseLearningMock,
      feedback: {
        isCorrect: true,
        explanation: 'Correct! Well done.'
      }
    })

    render(<Learning />)
    
    expect(screen.getByTestId('feedback-display')).toHaveTextContent('Correct! Well done.')
  })

  it('should handle missing exercise gracefully', () => {
    mockUseLearning.mockReturnValue({
      ...defaultUseLearningMock,
      currentExercise: null
    })

    render(<Learning />)
    
    // Should show loading state when no exercise is available
    expect(screen.getByText('loadingExercise')).toBeInTheDocument()
  })

  it('should show loading state appropriately', () => {
    mockUseLearning.mockReturnValue({
      ...defaultUseLearningMock,
      isLoading: true,
      currentExercise: null  // No exercise while loading
    })

    render(<Learning />)
    
    // Should show loading state with generation status indicator
    expect(screen.getByText('loadingExercise')).toBeInTheDocument()
    expect(screen.getByTestId('generation-status-indicator')).toBeInTheDocument()
  })
})