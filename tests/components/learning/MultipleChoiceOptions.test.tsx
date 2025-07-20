import { render, screen, fireEvent } from '@testing-library/react'
import MultipleChoiceOptions from '@/components/learning/MultipleChoiceOptions'

describe('MultipleChoiceOptions', () => {
  const mockSetSelectedOption = jest.fn()
  const mockOptions = ['falo', 'fala', 'falamos', 'falam']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all options as buttons', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    mockOptions.forEach((option, index) => {
      const letter = String.fromCharCode(65 + index)
      expect(screen.getByRole('button', { name: `${letter}. ${option}` })).toBeInTheDocument()
    })
  })

  it('should call setSelectedOption when option is clicked', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const firstOption = screen.getByRole('button', { name: 'A. falo' })
    fireEvent.click(firstOption)

    expect(mockSetSelectedOption).toHaveBeenCalledWith('falo')
  })

  it('should highlight selected option', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const selectedButton = screen.getByRole('button', { name: 'A. falo' })
    const unselectedButton = screen.getByRole('button', { name: 'B. fala' })

    expect(selectedButton).toHaveClass('neo-button-primary')
    expect(unselectedButton).not.toHaveClass('neo-button-primary')
  })

  it('should not render buttons when showAnswer is true', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should not call setSelectedOption when showAnswer is true', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    // Component returns null when showAnswer is true, so no buttons to click
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(mockSetSelectedOption).not.toHaveBeenCalled()
  })

  it('should handle empty options array', () => {
    render(
      <MultipleChoiceOptions
        options={[]}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should handle single option', () => {
    render(
      <MultipleChoiceOptions
        options={['falo']}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    expect(screen.getByRole('button', { name: 'A. falo' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('should handle option selection change', () => {
    const { rerender } = render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    let faloButton = screen.getByRole('button', { name: 'A. falo' })
    let falaButton = screen.getByRole('button', { name: 'B. fala' })

    expect(faloButton).toHaveClass('neo-button-primary')
    expect(falaButton).not.toHaveClass('neo-button-primary')

    rerender(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="fala"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    faloButton = screen.getByRole('button', { name: 'A. falo' })
    falaButton = screen.getByRole('button', { name: 'B. fala' })

    expect(faloButton).not.toHaveClass('neo-button-primary')
    expect(falaButton).toHaveClass('neo-button-primary')
  })

  it('should apply correct styling classes', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const container = screen.getByRole('button', { name: 'A. falo' }).parentElement
    expect(container).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-3')

    const button = screen.getByRole('button', { name: 'A. falo' })
    expect(button).toHaveClass('neo-button', 'text-sm', 'sm:text-base', 'p-3', 'sm:p-4', 'text-left')
  })

  it('should handle keyboard navigation', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const firstButton = screen.getByRole('button', { name: 'A. falo' })
    
    firstButton.focus()
    expect(firstButton).toHaveFocus()

    fireEvent.click(firstButton)
    expect(mockSetSelectedOption).toHaveBeenCalledWith('falo')
  })

  it('should handle options with special characters', () => {
    const specialOptions = ['está', 'são', 'coração', 'nação']
    
    render(
      <MultipleChoiceOptions
        options={specialOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    specialOptions.forEach((option, index) => {
      const letter = String.fromCharCode(65 + index)
      expect(screen.getByRole('button', { name: `${letter}. ${option}` })).toBeInTheDocument()
    })
  })

  it('should handle long options', () => {
    const longOptions = ['falo', 'estava falando', 'terei falado', 'falaria']
    
    render(
      <MultipleChoiceOptions
        options={longOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    longOptions.forEach((option, index) => {
      const letter = String.fromCharCode(65 + index)
      expect(screen.getByRole('button', { name: `${letter}. ${option}` })).toBeInTheDocument()
    })
  })

  it('should handle rapid clicking', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const faloButton = screen.getByRole('button', { name: 'A. falo' })
    const falaButton = screen.getByRole('button', { name: 'B. fala' })

    fireEvent.click(faloButton)
    fireEvent.click(falaButton)
    fireEvent.click(faloButton)

    expect(mockSetSelectedOption).toHaveBeenCalledTimes(3)
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(1, 'falo')
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(2, 'fala')
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(3, 'falo')
  })

  it('should hide options when showAnswer changes to true', () => {
    const { rerender } = render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    let selectedButton = screen.getByRole('button', { name: 'A. falo' })
    expect(selectedButton).toHaveClass('neo-button-primary')

    rerender(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    // Component returns null when showAnswer is true
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should handle duplicate options', () => {
    const duplicateOptions = ['falo', 'falo', 'fala', 'fala']
    
    render(
      <MultipleChoiceOptions
        options={duplicateOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    // Should render all options, even duplicates
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('should have proper button type attributes', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    mockOptions.forEach((option, index) => {
      const letter = String.fromCharCode(65 + index)
      const button = screen.getByRole('button', { name: `${letter}. ${option}` })
      expect(button.tagName).toBe('BUTTON')
    })
  })

  it('should handle empty string options', () => {
    const optionsWithEmpty = ['falo', '', 'fala', 'falamos']
    
    render(
      <MultipleChoiceOptions
        options={optionsWithEmpty}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })
})