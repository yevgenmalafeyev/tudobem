import { test, expect, Page } from '@playwright/test'

test.describe('Admin Panel - Functional Tests', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.describe('Authentication Flow', () => {
    test('should handle complete login flow', async () => {
      // Should see login form
      await page.waitForSelector('input[type="text"]', { timeout: 10000 })
      await page.waitForSelector('input[type="password"]')
      
      // Try invalid credentials first
      await page.fill('input[type="text"]', 'wronguser')
      await page.fill('input[type="password"]', 'wrongpass')
      await page.click('button[type="submit"]')
      
      // Should show error
      await page.waitForSelector('text=Invalid credentials', { timeout: 5000 })
      
      // Try correct credentials
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      
      // Should redirect to dashboard
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      await page.waitForSelector('text=Question Stats')
      await page.waitForSelector('text=Usage Analytics')
      
      // Take screenshot of successful login
      await page.screenshot({ 
        path: 'test-results/admin-dashboard.png',
        fullPage: true 
      })
    })

    test('should handle session persistence', async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      
      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Should still be logged in
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should handle logout', async () => {
      // Login first
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      
      // Logout
      await page.click('text=Logout')
      
      // Should redirect to login
      await page.waitForSelector('input[type="text"]', { timeout: 10000 })
      await page.waitForSelector('input[type="password"]')
    })
  })

  test.describe('Data Management', () => {
    test.beforeEach(async () => {
      // Login before each test
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should handle data export flow', async () => {
      // Click on Data Management
      await page.click('text=Data Management')
      
      // Should see export/import interface
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
      
      // Test export functionality
      const downloadPromise = page.waitForEvent('download')
      await page.click('text=Export Questions')
      
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('tudobem-questions')
      expect(download.suggestedFilename()).toContain('.zip')
      
      // Save the download for verification
      await download.saveAs(`test-results/${download.suggestedFilename()}`)
    })

    test('should handle data import flow', async () => {
      await page.click('text=Data Management')
      await page.waitForSelector('text=Import Questions', { timeout: 10000 })
      
      // Create a test JSON file for import
      const testData = {
        questions: [
          {
            sentence: 'Eu ___ português.',
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            explanations: {
              pt: 'Primeira pessoa do singular do presente do indicativo',
              en: 'First person singular present indicative',
              uk: 'Перша особа однини теперішнього часу'
            }
          }
        ]
      }
      
      // Would need to create and upload a test file
      // This is a placeholder for file upload testing
      const fileInput = page.locator('input[type="file"]')
      if (await fileInput.count() > 0) {
        // In a real test, you would upload a test file here
        expect(await fileInput.isVisible()).toBe(true)
      }
    })
  })

  test.describe('Question Statistics', () => {
    test.beforeEach(async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should display question statistics', async () => {
      await page.click('text=Question Stats')
      
      // Should show statistics
      await page.waitForSelector('text=Total Questions', { timeout: 10000 })
      
      // Should show level breakdown
      await page.waitForSelector('text=A1', { timeout: 5000 })
      await page.waitForSelector('text=A2', { timeout: 5000 })
      
      // Should show topic breakdown
      await page.waitForSelector('text=Questions by Topic', { timeout: 5000 })
      
      // Take screenshot of stats
      await page.screenshot({ 
        path: 'test-results/question-stats.png',
        fullPage: true 
      })
    })

    test('should handle real-time updates', async () => {
      await page.click('text=Question Stats')
      await page.waitForSelector('text=Total Questions', { timeout: 10000 })
      
      // Get initial count
      const initialCount = await page.locator('text=Total Questions').textContent()
      
      // Refresh the page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Login again
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      
      await page.click('text=Question Stats')
      await page.waitForSelector('text=Total Questions', { timeout: 10000 })
      
      // Should still show statistics
      const updatedCount = await page.locator('text=Total Questions').textContent()
      expect(updatedCount).toBeTruthy()
    })
  })

  test.describe('Usage Analytics', () => {
    test.beforeEach(async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should display usage analytics', async () => {
      await page.click('text=Usage Analytics')
      
      // Should show analytics dashboard
      await page.waitForSelector('text=Total Users', { timeout: 10000 })
      await page.waitForSelector('text=Total Sessions', { timeout: 5000 })
      await page.waitForSelector('text=Total Questions', { timeout: 5000 })
      
      // Should show charts or data visualizations
      await page.waitForSelector('text=Countries', { timeout: 5000 })
      await page.waitForSelector('text=Platforms', { timeout: 5000 })
      
      // Take screenshot of analytics
      await page.screenshot({ 
        path: 'test-results/usage-analytics.png',
        fullPage: true 
      })
    })

    test('should handle time range filtering', async () => {
      await page.click('text=Usage Analytics')
      await page.waitForSelector('text=Total Users', { timeout: 10000 })
      
      // Test different time ranges
      const timeRanges = ['1d', '7d', '30d', '90d']
      
      for (const range of timeRanges) {
        const rangeButton = page.locator(`text=${range}`)
        if (await rangeButton.count() > 0) {
          await rangeButton.click()
          await page.waitForTimeout(1000) // Wait for data to update
          
          // Verify data is still displayed
          await page.waitForSelector('text=Total Users', { timeout: 5000 })
        }
      }
    })

    test('should handle analytics data refresh', async () => {
      await page.click('text=Usage Analytics')
      await page.waitForSelector('text=Total Users', { timeout: 10000 })
      
      // Get initial data
      const initialUsers = await page.locator('text=Total Users').textContent()
      
      // Refresh the analytics (if refresh button exists)
      const refreshButton = page.locator('button:has-text("Refresh")')
      if (await refreshButton.count() > 0) {
        await refreshButton.click()
        await page.waitForTimeout(2000)
      }
      
      // Data should still be displayed
      await page.waitForSelector('text=Total Users', { timeout: 10000 })
      const updatedUsers = await page.locator('text=Total Users').textContent()
      expect(updatedUsers).toBeTruthy()
    })
  })

  test.describe('Navigation and UX', () => {
    test.beforeEach(async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should handle navigation between sections', async () => {
      // Navigate through all sections
      await page.click('text=Data Management')
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
      
      await page.click('text=Question Stats')
      await page.waitForSelector('text=Total Questions', { timeout: 10000 })
      
      await page.click('text=Usage Analytics')
      await page.waitForSelector('text=Total Users', { timeout: 10000 })
      
      // Navigate back
      await page.click('text=Data Management')
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
    })

    test('should handle responsive design', async () => {
      // Test desktop view
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.click('text=Data Management')
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(1000)
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
      
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(1000)
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
    })

    test('should handle keyboard navigation', async () => {
      // Test keyboard navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Should activate navigation
      
      // Test arrow key navigation (if implemented)
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowLeft')
      
      // Should still be functional
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })
  })

  test.describe('Error Handling', () => {
    test.beforeEach(async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should handle API failures gracefully', async () => {
      // Mock API failures
      await page.route('**/api/admin/stats', route => {
        route.abort('failed')
      })
      
      await page.click('text=Question Stats')
      
      // Should show error message or fallback
      await page.waitForTimeout(5000)
      
      // Should not crash the application
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
    })

    test('should handle network timeouts', async () => {
      // Mock slow network
      await page.route('**/api/admin/analytics', route => {
        setTimeout(() => route.continue(), 10000) // 10 second delay
      })
      
      await page.click('text=Usage Analytics')
      
      // Should show loading state or timeout gracefully
      await page.waitForTimeout(3000)
      
      // Application should remain responsive
      await page.click('text=Data Management')
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
    })

    test('should handle invalid data responses', async () => {
      // Mock invalid JSON responses
      await page.route('**/api/admin/stats', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'invalid json'
        })
      })
      
      await page.click('text=Question Stats')
      
      // Should handle gracefully
      await page.waitForTimeout(3000)
      
      // Should not crash
      await page.click('text=Data Management')
      await page.waitForSelector('text=Export Questions', { timeout: 10000 })
    })
  })

  test.describe('Security', () => {
    test('should handle unauthorized access', async () => {
      // Try to access admin without login
      await page.goto('/admin')
      await page.waitForLoadState('networkidle')
      
      // Should redirect to login or show login form
      await page.waitForSelector('input[type="text"]', { timeout: 10000 })
      await page.waitForSelector('input[type="password"]')
    })

    test('should handle session expiration', async () => {
      // Login
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      
      // Mock session expiration
      await page.route('**/api/admin/**', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unauthorized' })
        })
      })
      
      await page.click('text=Question Stats')
      
      // Should handle unauthorized response (redirect to login or show error)
      await page.waitForTimeout(3000)
      
      // Should not crash the application
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
    })
  })

  test.describe('Performance', () => {
    test('should load admin panel quickly', async () => {
      const startTime = Date.now()
      
      await page.fill('input[type="text"]', 'admin')
      await page.fill('input[type="password"]', 'tudobem2024')
      await page.click('button[type="submit"]')
      await page.waitForSelector('text=Data Management', { timeout: 10000 })
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(10000) // Should load within 10 seconds
    })

    test('should handle large data sets', async () => {
      // Mock large data response
      await page.route('**/api/admin/analytics', route => {
        const largeData = {
          totalUsers: 10000,
          totalSessions: 50000,
          totalQuestions: 200000,
          countries: Array.from({length: 50}, (_, i) => ({
            country: `Country ${i}`,
            count: Math.floor(Math.random() * 1000)
          }))
        }
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(largeData)
        })
      })
      
      await page.click('text=Usage Analytics')
      await page.waitForSelector('text=Total Users', { timeout: 15000 })
      
      // Should handle large data without crashing
      const pageContent = await page.textContent('body')
      expect(pageContent).toContain('10000')
    })
  })
})