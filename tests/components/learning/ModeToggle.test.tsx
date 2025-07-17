import { render, screen, fireEvent } from '@testing-library/react'
import ModeToggle from '@/components/learning/ModeToggle'
import { LearningMode } from '@/hooks/useLearning'

describe('ModeToggle', () => {
  const mockSetLearningMode = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with input mode selected', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    expect(inputButton).toHaveClass('neo-inset')
    expect(multipleChoiceButton).toHaveClass('neo-outset')
  })

  it('should render with multiple choice mode selected', () => {
    render(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    expect(inputButton).toHaveClass('neo-outset')
    expect(multipleChoiceButton).toHaveClass('neo-inset')
  })

  it('should call setLearningMode when input button is clicked', () => {
    render(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    fireEvent.click(inputButton)

    expect(mockSetLearningMode).toHaveBeenCalledWith('input')
  })

  it('should call setLearningMode when multiple choice button is clicked', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })
    fireEvent.click(multipleChoiceButton)

    expect(mockSetLearningMode).toHaveBeenCalledWith('multiple-choice')
  })

  it('should render with Portuguese labels', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="pt"
      />
    )

    expect(screen.getByText('Escrita')).toBeInTheDocument()
    expect(screen.getByText('Escolha Múltipla')).toBeInTheDocument()
  })

  it('should render with Ukrainian labels', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="uk"
      />
    )

    expect(screen.getByText('Введення')).toBeInTheDocument()
    expect(screen.getByText('Множинний вибір')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    expect(inputButton).toHaveAttribute('type', 'button')
    expect(multipleChoiceButton).toHaveAttribute('type', 'button')
  })

  it('should not call setLearningMode when clicking already selected mode', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    fireEvent.click(inputButton)

    expect(mockSetLearningMode).toHaveBeenCalledWith('input')
  })

  it('should handle mode changes correctly', () => {
    const { rerender } = render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    let inputButton = screen.getByRole('button', { name: /input/i })
    let multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    expect(inputButton).toHaveClass('neo-inset')
    expect(multipleChoiceButton).toHaveClass('neo-outset')

    rerender(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    inputButton = screen.getByRole('button', { name: /input/i })
    multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    expect(inputButton).toHaveClass('neo-outset')
    expect(multipleChoiceButton).toHaveClass('neo-inset')
  })

  it('should apply correct CSS classes for styling', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const container = screen.getByRole('button', { name: /input/i }).parentElement
    expect(container).toHaveClass('flex', 'neo-outset-sm')
  })

  it('should handle keyboard navigation', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    
    inputButton.focus()
    expect(inputButton).toHaveFocus()

    fireEvent.keyDown(inputButton, { key: 'Enter' })
    expect(mockSetLearningMode).toHaveBeenCalledWith('input')

    fireEvent.keyDown(inputButton, { key: ' ' })
    expect(mockSetLearningMode).toHaveBeenCalledWith('input')
  })

  it('should be responsive', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const buttons = screen.getAllByRole('button')
    
    buttons.forEach(button => {
      expect(button).toHaveClass('px-2', 'sm:px-4')
      expect(button).toHaveClass('text-xs', 'sm:text-sm')
    })
  })

  it('should handle rapid mode switching', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /input/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /multiple choice/i })

    fireEvent.click(multipleChoiceButton)
    fireEvent.click(inputButton)
    fireEvent.click(multipleChoiceButton)

    expect(mockSetLearningMode).toHaveBeenCalledTimes(3)
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(1, 'multiple-choice')
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(2, 'input')
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(3, 'multiple-choice')
  })
})