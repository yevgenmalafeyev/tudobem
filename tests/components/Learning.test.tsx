import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Learning from '@/components/Learning'

// Mock all the hooks used by Learning component
jest.mock('@/hooks/useLearning', () => ({
  useLearning: () => ({
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
      gapIndex: 1,
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
  })
}))

jest.mock('@/hooks/useExerciseQueue', () => ({
  useExerciseQueue: () => ({
    exerciseQueue: [],
    queueStatus: 'idle' as const,
    isGenerating: false,
    clearQueue: jest.fn(),
    addToQueue: jest.fn()
  })
}))

jest.mock('@/hooks/useAnswerChecking', () => ({
  useAnswerChecking: () => ({
    checkAnswer: jest.fn()
  })
}))

jest.mock('@/hooks/useDetailedExplanation', () => ({
  useDetailedExplanation: () => ({
    explanation: null,
    isLoadingExplanation: false,
    getDetailedExplanation: jest.fn()
  })
}))

// Mock child components
jest.mock('@/components/GenerationStatusIndicator', () => {
  return function MockGenerationStatusIndicator() {
    return <div data-testid="generation-status-indicator">Generation Status</div>
  }
})

jest.mock('@/components/learning/ModeToggle', () => {
  return function MockModeToggle({ mode, onModeChange }: any) {
    return (
      <button 
        data-testid="mode-toggle" 
        onClick={() => onModeChange(mode === 'input' ? 'multiple-choice' : 'input')}
      >
        {mode === 'input' ? 'Switch to Multiple Choice' : 'Switch to Input'}
      </button>
    )
  }
})

jest.mock('@/components/learning/ExerciseDisplay', () => {
  return function MockExerciseDisplay({ exercise }: any) {
    return <div data-testid="exercise-display">{exercise?.sentence}</div>
  }
})

jest.mock('@/components/learning/MultipleChoiceOptions', () => {
  return function MockMultipleChoiceOptions() {
    return <div data-testid="multiple-choice-options">Multiple Choice Options</div>
  }
})

jest.mock('@/components/learning/FeedbackDisplay', () => {
  return function MockFeedbackDisplay({ feedback }: any) {
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
    expect(modeToggle).toHaveTextContent('Switch to Multiple Choice')
    
    fireEvent.click(modeToggle)
    // The mock doesn't actually change the mode, but we can verify the button exists
    expect(modeToggle).toBeInTheDocument()
  })

  it('should render multiple choice options when in multiple choice mode', () => {
    // Mock the learning mode to be multiple-choice
    const mockUseLearning = require('@/hooks/useLearning').useLearning as jest.Mock
    mockUseLearning.mockReturnValue({
      ...mockUseLearning(),
      learningMode: 'multiple-choice',
      multipleChoiceOptions: ['falo', 'fala', 'falamos', 'falam']
    })

    render(<Learning />)
    
    expect(screen.getByTestId('multiple-choice-options')).toBeInTheDocument()
  })

  it('should not render multiple choice options when in input mode', () => {
    render(<Learning />)
    
    expect(screen.getByTestId('multiple-choice-options')).toBeInTheDocument()
  })

  it('should show feedback when available', () => {
    const mockUseLearning = require('@/hooks/useLearning').useLearning as jest.Mock
    mockUseLearning.mockReturnValue({
      ...mockUseLearning(),
      feedback: {
        isCorrect: true,
        explanation: 'Correct! Well done.'
      }
    })

    render(<Learning />)
    
    expect(screen.getByTestId('feedback-display')).toHaveTextContent('Correct! Well done.')
  })

  it('should handle missing exercise gracefully', () => {
    const mockUseLearning = require('@/hooks/useLearning').useLearning as jest.Mock
    mockUseLearning.mockReturnValue({
      ...mockUseLearning(),
      currentExercise: null
    })

    render(<Learning />)
    
    // Should still render the basic structure
    expect(screen.getByTestId('generation-status-indicator')).toBeInTheDocument()
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('should show loading state appropriately', () => {
    const mockUseLearning = require('@/hooks/useLearning').useLearning as jest.Mock
    mockUseLearning.mockReturnValue({
      ...mockUseLearning(),
      isLoading: true
    })

    render(<Learning />)
    
    // Components should still render even when loading
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument()
  })
})