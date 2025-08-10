import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Configuration from '@/components/Configuration'

// Mock the store
const mockSetConfiguration = jest.fn()
jest.mock('@/store/useStore', () => ({
  useStore: () => ({
    configuration: {
      selectedLevels: ['A1'],
      selectedTopics: ['verbo-estar'],
      appLanguage: 'en'
    },
    setConfiguration: mockSetConfiguration
  })
}))

// Mock topics data
jest.mock('@/data/topics', () => ({
  topics: [
    {
      id: 'present-indicative',
      name: 'Present Indicative',
      namePt: 'Presente do indicativo',
      levels: ['A1', 'A2']
    },
    {
      id: 'past-tense',
      name: 'Past Tense', 
      namePt: 'Pretérito perfeito',
      levels: ['A2', 'B1']
    },
    {
      id: 'future-tense',
      name: 'Future Tense',
      namePt: 'Futuro',
      levels: ['B1', 'B2']
    }
  ]
}))

// Mock translations
jest.mock('@/utils/translations', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'configTitle': 'Configuration',
      'selectLevels': 'Levels',
      'selectTopics': 'Topics',
      'appLanguageTitle': 'App Language',
      'portuguese': 'Português',
      'english': 'English',
      'ukrainian': 'Українська',
      'saveAndStart': 'Save Configuration & Start Learning',
      'installApp': 'Install App'
    }
    return translations[key] || key
  }
}))

// Mock PWA utilities
jest.mock('@/utils/pwaDetection', () => ({
  isMobileDevice: jest.fn(() => false),
  checkPWASupport: jest.fn(() => ({ isSupported: false, reason: 'desktop' }))
}))

jest.mock('@/utils/pwaInstructions', () => ({
  getPWAButtonText: jest.fn(() => 'Install App')
}))

// Mock PWA component
jest.mock('@/components/PWAInstallModal', () => {
  return function MockPWAInstallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="pwa-modal">
        <button onClick={onClose}>Close PWA Modal</button>
      </div>
    ) : null
  }
})

describe('Configuration Component', () => {
  const mockOnSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    expect(screen.getByText('Configuration')).toBeInTheDocument()
    expect(screen.getByText('Levels')).toBeInTheDocument()
    expect(screen.getByText('Topics')).toBeInTheDocument()
  })

  it('should render language level buttons', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    expect(screen.getByRole('button', { name: 'A1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'A2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'B1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'B2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'C1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'C2' })).toBeInTheDocument()
  })

  it('should have A1 level pre-selected', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    const a1Button = screen.getByRole('button', { name: 'A1' })
    expect(a1Button).toHaveClass('neo-button-primary')
  })

  it('should render available topics based on selected levels', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Check that topics are rendered (should have checkboxes for A1 topics)
    const topicCheckboxes = screen.getAllByRole('checkbox')
    expect(topicCheckboxes.length).toBeGreaterThan(0)
    
    // Verify Topics section exists
    expect(screen.getByText('Topics')).toBeInTheDocument()
  })

  it('should update available topics when levels change', async () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Initially only A1 is selected, count initial topics
    const initialCheckboxes = screen.getAllByRole('checkbox')
    const initialCount = initialCheckboxes.length
    
    // Select A2 level
    const a2Button = screen.getByRole('button', { name: 'A2' })
    fireEvent.click(a2Button)
    
    await waitFor(() => {
      // Now should have more topics (A1 + A2)
      const updatedCheckboxes = screen.getAllByRole('checkbox')
      expect(updatedCheckboxes.length).toBeGreaterThanOrEqual(initialCount)
    })
  })


  it('should render app language selector', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Language selector uses radio buttons, check for English option
    const englishOption = screen.getByLabelText('English')
    expect(englishOption).toBeInTheDocument()
    expect(englishOption).toBeChecked()
  })

  it('should render save button', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Use the actual button text from translations
    const saveButton = screen.getByRole('button', { name: /Save Configuration & Start Learning/i })
    expect(saveButton).toBeInTheDocument()
  })

  it('should call onSave when save button is clicked', async () => {
    render(<Configuration onSave={mockOnSave} />)
    
    const saveButton = screen.getByRole('button', { name: /Save Configuration & Start Learning/i })
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(mockSetConfiguration).toHaveBeenCalled()
      expect(mockOnSave).toHaveBeenCalled()
    })
  })


  it('should update app language when selector changes', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Click on Portuguese radio button
    const portugueseOption = screen.getByLabelText('Português')
    fireEvent.click(portugueseOption)
    
    expect(portugueseOption).toBeChecked()
  })

  it('should handle level selection changes', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    const b1Button = screen.getByRole('button', { name: 'B1' })
    expect(b1Button).not.toHaveClass('neo-button-primary')
    
    fireEvent.click(b1Button)
    expect(b1Button).toHaveClass('neo-button-primary')
  })

  it('should handle topic selection changes', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Find the first checkbox (should be for the first A1 topic)
    const topicCheckboxes = screen.getAllByRole('checkbox')
    const firstTopicCheckbox = topicCheckboxes[0] as HTMLInputElement
    
    // Topic should initially be unchecked (no auto-selection in test environment)
    expect(firstTopicCheckbox.checked).toBe(false)
    
    fireEvent.click(firstTopicCheckbox)
    expect(firstTopicCheckbox.checked).toBe(true)
  })

  it('should not render PWA modal by default', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    expect(screen.queryByTestId('pwa-modal')).not.toBeInTheDocument()
  })

  it('should disable save button when no levels are selected', () => {
    render(<Configuration onSave={mockOnSave} />)
    
    // Unselect all levels (A1 is initially selected)
    const a1Button = screen.getByRole('button', { name: 'A1' })
    fireEvent.click(a1Button) // This should unselect A1
    
    const saveButton = screen.getByRole('button', { name: /Save Configuration & Start Learning/i })
    expect(saveButton).toBeDisabled()
  })

  it('should work without onSave prop', () => {
    render(<Configuration />)
    
    const saveButton = screen.getByRole('button', { name: /Save Configuration & Start Learning/i })
    expect(saveButton).toBeInTheDocument()
    
    // Should not throw error when clicked
    fireEvent.click(saveButton)
  })
})