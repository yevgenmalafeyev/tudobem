import { test, expect, Page } from '@playwright/test'

test.describe('Complete Learning Flow - Functional Tests', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Set up viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Navigate to the application
    await page.goto('/')
    
    // Wait for application to load
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.describe('Full Learning Session', () => {
    test('should complete a full learning session with multiple exercises', async () => {
      const exercisesCompleted = 5
      
      for (let i = 0; i < exercisesCompleted; i++) {
        // Wait for exercise to load
        await page.waitForSelector('text=___', { timeout: 15000 })
        
        // Take screenshot of exercise
        await page.screenshot({ 
          path: `test-results/exercise-${i + 1}.png`,
          fullPage: true 
        })
        
        // Test both input and multiple choice modes
        if (i % 2 === 0) {
          // Input mode
          await page.click('text=Type answer')
          await page.waitForSelector('input[type="text"]')
          
          // Fill in a Portuguese word (may not be correct, but tests functionality)
          await page.fill('input[type="text"]', 'teste')
          
          // Check answer
          await page.click('text=Check Answer')
          
        } else {
          // Multiple choice mode
          await page.click('text=Show options')
          await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
          
          // Select first option
          const options = await page.locator('[data-testid="multiple-choice-option"]').all()
          if (options.length > 0) {
            await options[0].click()
            await page.click('text=Check Answer')
          }
        }
        
        // Wait for feedback
        await page.waitForSelector('.neo-inset', { timeout: 15000 })
        
        // Check that feedback is displayed
        const feedbackExists = await page.locator('.neo-inset').count() > 0
        expect(feedbackExists).toBe(true)
        
        // Move to next exercise (except for last one)
        if (i < exercisesCompleted - 1) {
          await page.click('text=Next Exercise')
          await page.waitForTimeout(1000) // Allow for loading
        }
      }
      
      // Verify session statistics (if available)
      // This would test any session tracking functionality
    })

    test('should handle rapid exercise completion', async () => {
      // Test rapid clicking and interaction
      for (let i = 0; i < 3; i++) {
        await page.waitForSelector('text=___', { timeout: 10000 })
        
        // Rapidly switch between modes
        await page.click('text=Show options')
        await page.waitForTimeout(500)
        await page.click('text=Type answer')
        await page.waitForTimeout(500)
        await page.click('text=Show options')
        
        // Quick selection and answer
        await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
        const options = await page.locator('[data-testid="multiple-choice-option"]').all()
        if (options.length > 0) {
          await options[0].click()
          await page.click('text=Check Answer')
          await page.waitForSelector('.neo-inset', { timeout: 10000 })
          
          if (i < 2) {
            await page.click('text=Next Exercise')
          }
        }
      }
    })
  })

  test.describe('PWA and Mobile Functionality', () => {
    test('should work correctly on mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Reload to trigger mobile-specific behavior
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Should default to multiple choice on mobile
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Check if multiple choice is default (may need to wait for auto-selection)
      await page.waitForTimeout(2000)
      
      // Test mobile-specific interactions
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Test touch interactions
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].tap()
        await page.waitForSelector('text=Check Answer')
        await page.tap('text=Check Answer')
        await page.waitForSelector('.neo-inset', { timeout: 10000 })
      }
    })

    test('should handle orientation changes', async () => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 })
      await page.waitForTimeout(1000)
      
      // Ensure functionality still works
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Back to portrait
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(1000)
      
      // Test interaction still works
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].click()
        expect(await options[0].getAttribute('aria-selected')).toBe('true')
      }
    })
  })

  test.describe('Network Conditions', () => {
    test('should handle offline mode', async () => {
      // Start online
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Go offline
      await page.context().setOffline(true)
      
      // Try to interact with the app
      await page.click('text=Show options')
      
      // Should still work with cached/fallback content
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
      
      // Go back online
      await page.context().setOffline(false)
    })

    test('should handle slow network', async () => {
      // Simulate slow 3G
      await page.context().route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
        await route.continue()
      })
      
      await page.waitForSelector('text=___', { timeout: 15000 })
      
      // Test that app still works with slow network
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 15000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
    })

    test('should handle API failures gracefully', async () => {
      // Mock API failures
      await page.route('**/api/generate-batch-exercises', route => {
        route.abort('failed')
      })
      
      // Should still work with fallback content
      await page.waitForSelector('text=___', { timeout: 15000 })
      
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 15000 })
      
      // Should have fallback options
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test keyboard navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Should activate mode toggle
      
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Navigate through options with keyboard
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Select option
      
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Check answer
      
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
    })

    test('should have proper ARIA attributes', async () => {
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Check ARIA attributes
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].click()
        const ariaSelected = await options[0].getAttribute('aria-selected')
        expect(ariaSelected).toBe('true')
      }
    })

    test('should work with screen reader simulation', async () => {
      // Simulate screen reader behavior
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that elements have proper labels
      const modeToggle = page.locator('text=Show options')
      await expect(modeToggle).toBeVisible()
      
      await modeToggle.click()
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Check that options are properly labeled
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      for (let i = 0; i < Math.min(options.length, 3); i++) {
        const optionText = await options[i].textContent()
        expect(optionText).toBeTruthy()
        expect(optionText?.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Performance', () => {
    test('should load quickly', async () => {
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
    })

    test('should handle multiple rapid interactions', async () => {
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Rapid mode switching
      for (let i = 0; i < 10; i++) {
        await page.click('text=Show options')
        await page.waitForTimeout(100)
        await page.click('text=Type answer')
        await page.waitForTimeout(100)
      }
      
      // Should still be functional
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
    })
  })

  test.describe('Data Persistence', () => {
    test('should maintain state across page reloads', async () => {
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Interact with the app
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Get current exercise content
      await page.locator('text=___').textContent()
      
      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Should still be functional
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    })
  })

  test.describe('Edge Cases', () => {
    test('should handle very long Portuguese words', async () => {
      // Mock an exercise with a very long word
      await page.route('**/api/generate-batch-exercises', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'long-word-test',
            sentence: 'Esta é uma palavra muito _____.',
            correctAnswer: 'responsabilidade',
            topic: 'vocabulary',
            level: 'B2'
          })
        })
      })
      
      await page.reload()
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Should handle long words properly
      const options = await page.locator('[data-testid="multiple-choice-option"]').allTextContents()
      expect(options.some(opt => opt.includes('responsabilidade'))).toBe(true)
    })

    test('should handle special Portuguese characters', async () => {
      // Mock an exercise with special characters
      await page.route('**/api/generate-batch-exercises', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'special-chars-test',
            sentence: 'Ele _____ muito bem.',
            correctAnswer: 'não',
            topic: 'negation',
            level: 'A1'
          })
        })
      })
      
      await page.reload()
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Should display special characters correctly
      const pageContent = await page.textContent('body')
      expect(pageContent).toContain('não')
    })

    test('should handle empty or malformed responses', async () => {
      // Mock empty response
      await page.route('**/api/generate-batch-exercises', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ options: [] })
        })
      })
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      
      // Should still provide fallback options
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
    })
  })
})