import { render, screen, fireEvent } from '@testing-library/react'
import ModeToggle from '@/components/learning/ModeToggle'

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

    const inputButton = screen.getByRole('button', { name: /type answer/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    expect(inputButton).toHaveClass('neo-button-primary')
    expect(multipleChoiceButton).not.toHaveClass('neo-button-primary')
  })

  it('should render with multiple choice mode selected', () => {
    render(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /type answer/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    expect(inputButton).not.toHaveClass('neo-button-primary')
    expect(multipleChoiceButton).toHaveClass('neo-button-primary')
  })

  it('should call setLearningMode when input button is clicked', () => {
    render(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /type answer/i })
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

    const multipleChoiceButton = screen.getByRole('button', { name: /show options/i })
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

    expect(screen.getByText('Digitar Resposta')).toBeInTheDocument()
    expect(screen.getByText('Mostrar Opções')).toBeInTheDocument()
  })

  it('should render with Ukrainian labels', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="uk"
      />
    )

    expect(screen.getByText('Ввести Відповідь')).toBeInTheDocument()
    expect(screen.getByText('Показати Варіанти')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /type answer/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    expect(inputButton.tagName).toBe('BUTTON')
    expect(multipleChoiceButton.tagName).toBe('BUTTON')
  })

  it('should not call setLearningMode when clicking already selected mode', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /type answer/i })
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

    let inputButton = screen.getByRole('button', { name: /type answer/i })
    let multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    expect(inputButton).toHaveClass('neo-button-primary')
    expect(multipleChoiceButton).not.toHaveClass('neo-button-primary')

    rerender(
      <ModeToggle 
        learningMode="multiple-choice" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    inputButton = screen.getByRole('button', { name: /type answer/i })
    multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    expect(inputButton).not.toHaveClass('neo-button-primary')
    expect(multipleChoiceButton).toHaveClass('neo-button-primary')
  })

  it('should apply correct CSS classes for styling', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const container = screen.getByRole('button', { name: /type answer/i }).parentElement
    expect(container).toHaveClass('flex', 'neo-inset-sm')
  })

  it('should handle keyboard navigation', () => {
    render(
      <ModeToggle 
        learningMode="input" 
        setLearningMode={mockSetLearningMode}
        appLanguage="en"
      />
    )

    const inputButton = screen.getByRole('button', { name: /type answer/i })
    
    inputButton.focus()
    expect(inputButton).toHaveFocus()

    fireEvent.click(inputButton)
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
      expect(button).toHaveClass('px-2', 'sm:px-3')
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

    const inputButton = screen.getByRole('button', { name: /type answer/i })
    const multipleChoiceButton = screen.getByRole('button', { name: /show options/i })

    fireEvent.click(multipleChoiceButton)
    fireEvent.click(inputButton)
    fireEvent.click(multipleChoiceButton)

    expect(mockSetLearningMode).toHaveBeenCalledTimes(3)
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(1, 'multiple-choice')
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(2, 'input')
    expect(mockSetLearningMode).toHaveBeenNthCalledWith(3, 'multiple-choice')
  })
})