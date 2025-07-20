import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import QuestionStats from '@/components/admin/QuestionStats'

// Mock fetch globally
global.fetch = jest.fn()

describe('QuestionStats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      ;(fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({
            total: 100,
            byLevel: [{ level: 'A1', count: 25 }],
            byTopic: [{ topic: 'Grammar', count: 50 }]
          })
        }), 100))
      )

      render(<QuestionStats />)
      
      expect(screen.getByText('Loading statistics...')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should style loading state correctly', () => {
      ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<QuestionStats />)
      
      const loadingContainer = screen.getByText('Loading statistics...').closest('.neo-card')
      expect(loadingContainer).toHaveClass('text-center', 'py-8')
      
      const loadingText = screen.getByText('Loading statistics...').parentElement
      expect(loadingText).toHaveClass('text-lg')
      expect(loadingText).toHaveStyle('color: var(--neo-text)')
    })
  })

  describe('Successful Data Display', () => {
    const mockStats = {
      total: 150,
      byLevel: [
        { level: 'A1', count: 40 },
        { level: 'A2', count: 35 },
        { level: 'B1', count: 30 },
        { level: 'B2', count: 25 },
        { level: 'C1', count: 20 }
      ],
      byTopic: [
        { topic: 'Grammar', count: 60 },
        { topic: 'Vocabulary', count: 50 },
        { topic: 'Reading', count: 25 },
        { topic: 'Listening', count: 15 }
      ]
    }

    beforeEach(() => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats)
      })
    })

    it('should display total questions correctly', async () => {
      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('📊 Total Questions')).toBeInTheDocument()
        expect(screen.getByText('150')).toBeInTheDocument()
        expect(screen.getByText('Total questions in database')).toBeInTheDocument()
      })
    })

    it('should format large numbers correctly', async () => {
      const largeStats = { ...mockStats, total: 12345 }
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(largeStats)
      })

      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        // Number formatting uses spaces in some locales, commas in others
        const formattedNumber = screen.getByText(/12[\s,]345/)
        expect(formattedNumber).toBeInTheDocument()
      })
    })

    it('should display questions by level section', async () => {
      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Questions by Level')).toBeInTheDocument()
        
        // Check each level
        expect(screen.getByText('A1')).toBeInTheDocument()
        expect(screen.getByText('A2')).toBeInTheDocument()
        expect(screen.getByText('B1')).toBeInTheDocument()
        expect(screen.getByText('B2')).toBeInTheDocument()
        expect(screen.getByText('C1')).toBeInTheDocument()
        
        // Check counts - use getAllByText since '25' appears in both level and topic sections
        expect(screen.getByText('40')).toBeInTheDocument()
        expect(screen.getByText('35')).toBeInTheDocument()
        expect(screen.getByText('30')).toBeInTheDocument()
        expect(screen.getAllByText('25')).toHaveLength(2) // B2 level and Reading topic
        expect(screen.getByText('20')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should calculate and display percentages correctly', async () => {
      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        // A1: 40/150 = 26.7%
        expect(screen.getByText('(26.7%)')).toBeInTheDocument()
        // A2: 35/150 = 23.3%
        expect(screen.getByText('(23.3%)')).toBeInTheDocument()
        // B1: 30/150 = 20.0%
        expect(screen.getByText('(20.0%)')).toBeInTheDocument()
        // B2: 25/150 = 16.7% - check there are exactly 2 instances (level and topic)
        expect(screen.getAllByText('(16.7%)')).toHaveLength(2)
        // C1: 20/150 = 13.3%
        expect(screen.getByText('(13.3%)')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should display questions by topic section', async () => {
      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('📚 Questions by Topic')).toBeInTheDocument()
        
        // Check topics
        expect(screen.getByText('Grammar')).toBeInTheDocument()
        expect(screen.getByText('Vocabulary')).toBeInTheDocument()
        expect(screen.getByText('Reading')).toBeInTheDocument()
        expect(screen.getByText('Listening')).toBeInTheDocument()
        
        // Check topic counts
        expect(screen.getByText('60')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
        // Note: 25 and 15 are already checked in by-level tests
      })
    })

    it('should display refresh button', async () => {
      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /Refresh Statistics/ })
        expect(refreshButton).toBeInTheDocument()
        expect(refreshButton).toHaveClass('neo-button', 'neo-button-primary')
        expect(refreshButton).toHaveTextContent('🔄 Refresh Statistics')
      }, { timeout: 2000 })
    })

    it('should style components correctly', async () => {
      render(<QuestionStats />)
      
      await waitFor(() => {
        // Total questions styling
        const totalHeader = screen.getByText('📊 Total Questions')
        expect(totalHeader).toHaveClass('text-2xl', 'font-semibold', 'mb-2')
        expect(totalHeader).toHaveStyle('color: var(--neo-text)')
        
        const totalNumber = screen.getByText('150')
        expect(totalNumber).toHaveClass('text-4xl', 'font-bold')
        expect(totalNumber).toHaveStyle('color: var(--neo-accent-text)')
        
        // Level section styling
        const levelHeader = screen.getByText('📈 Questions by Level')
        expect(levelHeader).toHaveClass('text-xl', 'font-semibold', 'mb-4')
        expect(levelHeader).toHaveStyle('color: var(--neo-text)')
        
        // Topic section styling
        const topicHeader = screen.getByText('📚 Questions by Topic')
        expect(topicHeader).toHaveClass('text-xl', 'font-semibold', 'mb-4')
        expect(topicHeader).toHaveStyle('color: var(--neo-text)')
      })
    })

    it('should have scrollable topic area', async () => {
      render(<QuestionStats />)
      
      await waitFor(() => {
        const topicContainer = screen.getByText('Grammar').closest('.space-y-2')
        expect(topicContainer).toHaveClass('max-h-96', 'overflow-y-auto')
      })
    })
  })

  describe('Error State', () => {
    it('should display error message on fetch failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText(/❌.*Failed to fetch statistics/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      })
    })

    it('should display network error message', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText(/❌.*Network error while fetching statistics/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      })
    })

    it('should style error state correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false
      })

      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        const errorContainer = screen.getByText(/Failed to fetch statistics/).closest('.neo-card')
        expect(errorContainer).toHaveClass('text-center', 'py-8')
        
        const errorText = screen.getByText(/Failed to fetch statistics/)
        expect(errorText).toHaveClass('text-lg', 'mb-4')
        expect(errorText).toHaveStyle('color: var(--neo-error)')
        
        const tryAgainButton = screen.getByRole('button', { name: 'Try Again' })
        expect(tryAgainButton).toHaveClass('neo-button', 'neo-button-primary')
      }, { timeout: 2000 })
    })

    it('should retry fetch when try again button is clicked', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            total: 50,
            byLevel: [{ level: 'A1', count: 25 }],
            byTopic: [{ topic: 'Test', count: 25 }]
          })
        })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch statistics/)).toBeInTheDocument()
      })
      
      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' })
      
      await act(async () => {
        fireEvent.click(tryAgainButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📊 Total Questions')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
      })
      
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('No Data State', () => {
    it('should display no data message when stats is null', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('No statistics available')).toBeInTheDocument()
      })
    })

    it('should style no data state correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        const noDataContainer = screen.getByText('No statistics available').closest('.neo-card')
        expect(noDataContainer).toHaveClass('text-center', 'py-8')
        
        const noDataText = screen.getByText('No statistics available')
        expect(noDataText).toHaveClass('text-lg')
        expect(noDataText).toHaveStyle('color: var(--neo-text-muted)')
      })
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data from correct API endpoint', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [],
          byTopic: []
        })
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/stats')
      })
    })

    it('should fetch data on component mount', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [],
          byTopic: []
        })
      })

      render(<QuestionStats />)
      
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should refresh data when refresh button is clicked', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [{ level: 'A1', count: 50 }],
          byTopic: [{ topic: 'Test', count: 50 }]
        })
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('📊 Total Questions')).toBeInTheDocument()
      })
      
      const refreshButton = screen.getByRole('button', { name: /Refresh Statistics/ })
      
      await act(async () => {
        fireEvent.click(refreshButton)
      })
      
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Number Formatting', () => {
    it('should format numbers with commas for large values', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 1234567,
          byLevel: [{ level: 'A1', count: 123456 }],
          byTopic: [{ topic: 'Test', count: 987654 }]
        })
      })

      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        // Check for numbers with locale-appropriate formatting (spaces or commas)
        expect(screen.getByText(/1[\s,]234[\s,]567/)).toBeInTheDocument()
        expect(screen.getByText(/123[\s,]456/)).toBeInTheDocument()
        expect(screen.getByText(/987[\s,]654/)).toBeInTheDocument()
      })
    })

    it('should format small numbers without commas', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 999,
          byLevel: [{ level: 'A1', count: 500 }],
          byTopic: [{ topic: 'Test', count: 499 }]
        })
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('999')).toBeInTheDocument()
        expect(screen.getByText('500')).toBeInTheDocument()
        expect(screen.getByText('499')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty level and topic arrays', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 0,
          byLevel: [],
          byTopic: []
        })
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByText('📊 Total Questions')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
        expect(screen.getByText('📈 Questions by Level')).toBeInTheDocument()
        expect(screen.getByText('📚 Questions by Topic')).toBeInTheDocument()
      })
    })

    it('should handle zero percentages correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [{ level: 'A1', count: 0 }],
          byTopic: [{ topic: 'Test', count: 0 }]
        })
      })

      await act(async () => {
        render(<QuestionStats />)
      })
      
      await waitFor(() => {
        // Both level and topic have 0.0% so expect 2 instances
        expect(screen.getAllByText('(0.0%)')).toHaveLength(2)
      }, { timeout: 2000 })
    })
  })

  describe('Component Structure', () => {
    it('should have proper section layout', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [{ level: 'A1', count: 50 }],
          byTopic: [{ topic: 'Test', count: 50 }]
        })
      })

      let container: HTMLElement
      await act(async () => {
        const result = render(<QuestionStats />)
        container = result.container
      })
      
      await waitFor(() => {
        expect(screen.getByText('📊 Total Questions')).toBeInTheDocument()
      })
      
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass('space-y-6')
      
      const cards = container.querySelectorAll('.neo-card')
      expect(cards).toHaveLength(3) // Total, By Level, By Topic (refresh button is not in a card)
    })

    it('should have proper heading hierarchy', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          total: 100,
          byLevel: [{ level: 'A1', count: 50 }],
          byTopic: [{ topic: 'Test', count: 50 }]
        })
      })

      render(<QuestionStats />)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2, name: /Total Questions/ })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /Questions by Level/ })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /Questions by Topic/ })).toBeInTheDocument()
      })
    })
  })
})