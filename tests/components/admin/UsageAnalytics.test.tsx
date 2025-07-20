import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import UsageAnalytics from '@/components/admin/UsageAnalytics'

// Mock fetch globally
global.fetch = jest.fn()

describe('UsageAnalytics Component', () => {
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
            totalUsers: 100,
            totalSessions: 200,
            totalQuestions: 800,
            correctAnswers: 640,
            incorrectAnswers: 160,
            countries: [],
            platforms: [],
            levels: [],
            dailyStats: []
          })
        }), 100))
      )

      render(<UsageAnalytics />)
      
      expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should style loading state correctly', () => {
      ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<UsageAnalytics />)
      
      const loadingContainer = screen.getByText('Loading analytics...').closest('.neo-card')
      expect(loadingContainer).toHaveClass('text-center', 'py-8')
      
      const loadingText = screen.getByText('Loading analytics...').parentElement
      expect(loadingText).toHaveClass('text-lg')
      expect(loadingText).toHaveStyle('color: var(--neo-text)')
    })
  })

  describe('Successful Data Display', () => {
    const mockStats = {
      totalUsers: 1500,
      totalSessions: 3200,
      totalQuestions: 12000,
      correctAnswers: 9600,
      incorrectAnswers: 2400,
      countries: [
        { country: 'United States', count: 450 },
        { country: 'Brazil', count: 380 },
        { country: 'Germany', count: 290 },
        { country: 'France', count: 220 },
        { country: 'Spain', count: 160 }
      ],
      platforms: [
        { platform: 'Desktop', count: 1200 },
        { platform: 'Mobile', count: 250 },
        { platform: 'Tablet', count: 50 }
      ],
      levels: [
        { level: 'A1', count: 600 },
        { level: 'A2', count: 500 },
        { level: 'B1', count: 400 }
      ],
      dailyStats: [
        { date: '2024-01-01', users: 50, questions: 200, correct: 160 },
        { date: '2024-01-02', users: 60, questions: 240, correct: 192 }
      ]
    }

    beforeEach(() => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats)
      })
    })

    it('should display time range filter buttons', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Last 24 hours' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Last 7 days' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Last 30 days' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Last 90 days' })).toBeInTheDocument()
      })
    })

    it('should highlight default time range (7d)', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        const sevenDaysButton = screen.getByRole('button', { name: 'Last 7 days' })
        expect(sevenDaysButton).toHaveClass('neo-button-primary')
        
        const oneDayButton = screen.getByRole('button', { name: 'Last 24 hours' })
        expect(oneDayButton).not.toHaveClass('neo-button-primary')
      })
    })

    it('should display key metrics correctly', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // Check total users - use regex for locale-specific formatting
        expect(screen.getByText(/1[\s,]500/)).toBeInTheDocument()
        expect(screen.getByText('Total Users')).toBeInTheDocument()
        
        // Check total sessions
        expect(screen.getByText(/3[\s,]200/)).toBeInTheDocument()
        expect(screen.getByText('Total Sessions')).toBeInTheDocument()
        
        // Check total questions
        expect(screen.getByText(/12[\s,]000/)).toBeInTheDocument()
        expect(screen.getByText('Questions Answered')).toBeInTheDocument()
      })
    })

    it('should calculate and display accuracy rate correctly', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // 9600 correct / 12000 total = 80.0%
        expect(screen.getByText('80.0%')).toBeInTheDocument()
        expect(screen.getByText('Accuracy Rate')).toBeInTheDocument()
      })
    })

    it('should display answer distribution', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('✅ Answer Distribution')).toBeInTheDocument()
        expect(screen.getByText(/9[\s,]600/)).toBeInTheDocument()
        expect(screen.getByText('Correct Answers')).toBeInTheDocument()
        expect(screen.getByText(/2[\s,]400/)).toBeInTheDocument()
        expect(screen.getByText('Incorrect Answers')).toBeInTheDocument()
      })
    })

    it('should display countries section', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('🌍 Users by Country')).toBeInTheDocument()
        expect(screen.getByText('United States')).toBeInTheDocument()
        expect(screen.getByText('Brazil')).toBeInTheDocument()
        expect(screen.getByText('Germany')).toBeInTheDocument()
        expect(screen.getByText('450')).toBeInTheDocument()
        expect(screen.getByText('380')).toBeInTheDocument()
      })
    })

    it('should display platforms section', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📱 Platforms')).toBeInTheDocument()
        expect(screen.getByText('Desktop')).toBeInTheDocument()
        expect(screen.getByText('Mobile')).toBeInTheDocument()
        expect(screen.getByText('Tablet')).toBeInTheDocument()
        expect(screen.getByText(/1[\s,]200/)).toBeInTheDocument()
        expect(screen.getByText('250')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
      })
    })

    it('should display levels section', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📚 Popular Levels')).toBeInTheDocument()
        expect(screen.getByText('A1')).toBeInTheDocument()
        expect(screen.getByText('A2')).toBeInTheDocument()
        expect(screen.getByText('B1')).toBeInTheDocument()
        expect(screen.getByText('600')).toBeInTheDocument()
        expect(screen.getByText('500')).toBeInTheDocument()
        expect(screen.getByText('400')).toBeInTheDocument()
      })
    })

    it('should display daily activity chart placeholder', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📊 Daily Activity')).toBeInTheDocument()
        expect(screen.getByText('Chart visualization will be implemented here')).toBeInTheDocument()
        expect(screen.getByText('Daily stats: 2 data points')).toBeInTheDocument()
      })
    })

    it('should display refresh button', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /Refresh Analytics/ })
        expect(refreshButton).toBeInTheDocument()
        expect(refreshButton).toHaveClass('neo-button', 'neo-button-primary')
        expect(refreshButton).toHaveTextContent('🔄 Refresh Analytics')
      })
    })

    it('should style components correctly', async () => {
      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // Main header styling
        const mainHeader = screen.getByText('📈 Usage Analytics')
        expect(mainHeader).toHaveClass('text-xl', 'font-semibold', 'mb-4')
        expect(mainHeader).toHaveStyle('color: var(--neo-text)')
        
        // Section headers styling
        const answerHeader = screen.getByText('✅ Answer Distribution')
        expect(answerHeader).toHaveClass('text-lg', 'font-semibold', 'mb-4')
        expect(answerHeader).toHaveStyle('color: var(--neo-text)')
        
        // Accuracy rate styling
        const accuracyRate = screen.getByText('80.0%')
        expect(accuracyRate).toHaveClass('text-2xl', 'font-bold')
        expect(accuracyRate).toHaveStyle('color: var(--neo-success-text)')
      })
    })
  })

  describe('Time Range Switching', () => {
    const mockStats = {
      totalUsers: 100,
      totalSessions: 200,
      totalQuestions: 800,
      correctAnswers: 640,
      incorrectAnswers: 160,
      countries: [],
      platforms: [],
      levels: [],
      dailyStats: []
    }

    it('should change time range when button is clicked', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats)
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
      })

      const thirtyDaysButton = screen.getByRole('button', { name: 'Last 30 days' })
      
      await act(async () => {
        fireEvent.click(thirtyDaysButton)
      })

      await waitFor(() => {
        expect(thirtyDaysButton).toHaveClass('neo-button-primary')
        const sevenDaysButton = screen.getByRole('button', { name: 'Last 7 days' })
        expect(sevenDaysButton).not.toHaveClass('neo-button-primary')
      })

      expect(fetch).toHaveBeenCalledWith('/api/admin/analytics?range=30d')
    })

    it('should fetch data with correct range parameter', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats)
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/analytics?range=7d')
      })

      const oneDayButton = screen.getByRole('button', { name: 'Last 24 hours' })
      
      await act(async () => {
        fireEvent.click(oneDayButton)
      })

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/analytics?range=1d')
      })
    })
  })

  describe('Error State', () => {
    it('should display error message on fetch failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText(/❌.*Failed to fetch analytics/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      })
    })

    it('should display network error message', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText(/❌.*Network error while fetching analytics/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      })
    })

    it('should style error state correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        const errorContainer = screen.getByText(/Failed to fetch analytics/).closest('.neo-card')
        expect(errorContainer).toHaveClass('text-center', 'py-8')
        
        const errorText = screen.getByText(/Failed to fetch analytics/)
        expect(errorText).toHaveClass('text-lg', 'mb-4')
        expect(errorText).toHaveStyle('color: var(--neo-error)')
        
        const tryAgainButton = screen.getByRole('button', { name: 'Try Again' })
        expect(tryAgainButton).toHaveClass('neo-button', 'neo-button-primary')
      })
    })

    it('should retry fetch when try again button is clicked', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            totalUsers: 50,
            totalSessions: 100,
            totalQuestions: 400,
            correctAnswers: 320,
            incorrectAnswers: 80,
            countries: [],
            platforms: [],
            levels: [],
            dailyStats: []
          })
        })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch analytics/)).toBeInTheDocument()
      })
      
      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' })
      
      await act(async () => {
        fireEvent.click(tryAgainButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
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

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('No analytics data available')).toBeInTheDocument()
      })
    })

    it('should style no data state correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        const noDataContainer = screen.getByText('No analytics data available').closest('.neo-card')
        expect(noDataContainer).toHaveClass('text-center', 'py-8')
        
        const noDataText = screen.getByText('No analytics data available')
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
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/analytics?range=7d')
      })
    })

    it('should fetch data on component mount', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should refresh data when refresh button is clicked', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
      })
      
      const refreshButton = screen.getByRole('button', { name: /Refresh Analytics/ })
      
      await act(async () => {
        fireEvent.click(refreshButton)
      })
      
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Number Formatting', () => {
    it('should format numbers with locale-appropriate separators', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 1234567,
          totalSessions: 987654,
          totalQuestions: 5432109,
          correctAnswers: 4321000,
          incorrectAnswers: 1111109,
          countries: [{ country: 'Test', count: 123456 }],
          platforms: [{ platform: 'Test', count: 789012 }],
          levels: [{ level: 'Test', count: 345678 }],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // Check for numbers with locale-appropriate formatting (spaces or commas)
        expect(screen.getByText(/1[\s,]234[\s,]567/)).toBeInTheDocument()
        expect(screen.getByText(/987[\s,]654/)).toBeInTheDocument()
        expect(screen.getByText(/5[\s,]432[\s,]109/)).toBeInTheDocument()
      })
    })

    it('should format small numbers without separators', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 999,
          totalSessions: 500,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [{ country: 'Test', count: 499 }],
          platforms: [{ platform: 'Test', count: 300 }],
          levels: [{ level: 'Test', count: 200 }],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('999')).toBeInTheDocument()
        expect(screen.getByText('500')).toBeInTheDocument()
        expect(screen.getByText('800')).toBeInTheDocument()
      })
    })
  })

  describe('Accuracy Calculation', () => {
    it('should handle zero total questions', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument()
        expect(screen.getByText('Accuracy Rate')).toBeInTheDocument()
      })
    })

    it('should calculate accuracy with decimal precision', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 7,
          correctAnswers: 5,
          incorrectAnswers: 2,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // 5/7 = 71.4285... rounds to 71.4%
        expect(screen.getByText('71.4%')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty arrays gracefully', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
        expect(screen.getByText('🌍 Users by Country')).toBeInTheDocument()
        expect(screen.getByText('📱 Platforms')).toBeInTheDocument()
        expect(screen.getByText('📚 Popular Levels')).toBeInTheDocument()
        expect(screen.getByText('Daily stats: 0 data points')).toBeInTheDocument()
      })
    })

    it('should limit countries display to top 10', async () => {
      const manyCountries = Array.from({ length: 15 }, (_, i) => ({
        country: `Country ${i + 1}`,
        count: 100 - i
      }))

      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 1500,
          totalSessions: 3000,
          totalQuestions: 12000,
          correctAnswers: 9600,
          incorrectAnswers: 2400,
          countries: manyCountries,
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      await act(async () => {
        render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        // Should show first 10 countries
        expect(screen.getByText('Country 1')).toBeInTheDocument()
        expect(screen.getByText('Country 10')).toBeInTheDocument()
        // Should not show 11th country
        expect(screen.queryByText('Country 11')).not.toBeInTheDocument()
      })
    })
  })

  describe('Component Structure', () => {
    it('should have proper grid layout for key metrics', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [],
          platforms: [],
          levels: [],
          dailyStats: []
        })
      })

      const { container } = await act(async () => {
        return render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
      })
      
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass('space-y-6')
      
      const metricsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')
      expect(metricsGrid).toBeInTheDocument()
    })

    it('should have proper section structure', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalUsers: 100,
          totalSessions: 200,
          totalQuestions: 800,
          correctAnswers: 640,
          incorrectAnswers: 160,
          countries: [{ country: 'Test', count: 100 }],
          platforms: [{ platform: 'Test', count: 100 }],
          levels: [{ level: 'Test', count: 100 }],
          dailyStats: [{ date: '2024-01-01', users: 50, questions: 200, correct: 160 }]
        })
      })

      const { container } = await act(async () => {
        return render(<UsageAnalytics />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('📈 Usage Analytics')).toBeInTheDocument()
      })
      
      const cards = container.querySelectorAll('.neo-card')
      expect(cards.length).toBeGreaterThanOrEqual(7) // Filter + 4 metrics + 2+ sections
    })
  })
})