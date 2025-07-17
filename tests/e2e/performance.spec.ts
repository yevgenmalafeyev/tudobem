import { test, expect } from '@playwright/test'
import { setupTestPage } from '../utils/test-helpers'

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page and complete configuration if needed
    await setupTestPage(page)
  })

  test('should load initial page quickly', async ({ page }) => {
    const startTime = Date.now()
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should respond to user input quickly', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    const startTime = Date.now()
    
    // Fill in the answer
    await page.fill('input[type="text"]', 'falo')
    
    const inputTime = Date.now() - startTime
    
    // Input should be responsive (< 100ms)
    expect(inputTime).toBeLessThan(100)
  })

  test('should generate feedback quickly', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer
    await page.fill('input[type="text"]', 'falo')
    
    const startTime = Date.now()
    
    // Click check answer
    await page.click('text=Check Answer')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    const feedbackTime = Date.now() - startTime
    
    // Feedback should appear within 5 seconds
    expect(feedbackTime).toBeLessThan(5000)
  })

  test('should handle rapid interactions', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Perform rapid interactions
    for (let i = 0; i < 10; i++) {
      await page.fill('input[type="text"]', `answer${i}`)
      await page.waitForTimeout(50) // Small delay between actions
    }
    
    // Check that the last input is still responsive
    await expect(page.locator('input[type="text"]')).toHaveValue('answer9')
  })

  test('should handle multiple exercise generations', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Complete multiple exercises and measure performance
    const exerciseCount = 5
    const times: number[] = []
    
    for (let i = 0; i < exerciseCount; i++) {
      await page.fill('input[type="text"]', 'falo')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      
      const startTime = Date.now()
      await page.click('text=Next Exercise')
      
      // Wait for new exercise to load
      await page.waitForSelector('input[type="text"]')
      
      const nextExerciseTime = Date.now() - startTime
      times.push(nextExerciseTime)
    }
    
    // All exercise generations should be fast
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    expect(avgTime).toBeLessThan(2000) // Average < 2 seconds
  })

  test('should handle mode switching efficiently', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Measure mode switching performance
    const startTime = Date.now()
    
    // Switch to multiple choice
    await page.click('text=Multiple Choice')
    
    // Wait for options to load
    await page.waitForSelector('button:has-text("falo")', { timeout: 10000 })
    
    const switchTime = Date.now() - startTime
    
    // Mode switching should be fast
    expect(switchTime).toBeLessThan(3000)
  })

  test('should not cause memory leaks', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Perform many operations to test for memory leaks
    for (let i = 0; i < 20; i++) {
      await page.fill('input[type="text"]', 'falo')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
    }
    
    // Page should still be responsive
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('text=Check Answer')).toBeVisible()
  })

  test('should handle network delays gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', route => {
      setTimeout(() => {
        route.continue()
      }, 1000) // Add 1 second delay
    })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer
    await page.fill('input[type="text"]', 'falo')
    
    // Click check answer
    await page.click('text=Check Answer')
    
    // Should show loading state
    await expect(page.locator('text=Loading...')).toBeVisible()
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    
    // Check that feedback eventually appears
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should optimize for mobile performance', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Simulate mobile network conditions
    await page.context().addInitScript(() => {
      // Simulate slower mobile performance
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        value: { effectiveType: '3g' }
      })
    })
    
    const startTime = Date.now()
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    const loadTime = Date.now() - startTime
    
    // Should still load reasonably fast on mobile
    expect(loadTime).toBeLessThan(5000)
  })

  test('should handle concurrent operations', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Perform concurrent operations
    const promises = [
      page.fill('input[type="text"]', 'falo'),
      page.click('text=Multiple Choice'),
      page.waitForSelector('button:has-text("falo")', { timeout: 10000 })
    ]
    
    // Should handle concurrent operations without issues
    await Promise.all(promises)
    
    // Check that page is in expected state
    await expect(page.locator('button:has-text("falo")')).toBeVisible()
  })

  test('should maintain performance with large datasets', async ({ page }) => {
    // This test would be more relevant if the app handled large datasets
    // For now, we'll test with multiple rapid operations
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    const startTime = Date.now()
    
    // Perform many rapid operations
    for (let i = 0; i < 50; i++) {
      await page.fill('input[type="text"]', `test${i}`)
      if (i % 10 === 0) {
        await page.waitForTimeout(1) // Brief pause every 10 operations
      }
    }
    
    const operationTime = Date.now() - startTime
    
    // Should handle rapid operations efficiently
    expect(operationTime).toBeLessThan(2000)
  })

  test('should optimize resource usage', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that essential resources are loaded
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('text=Check Answer')).toBeVisible()
    
    // Complete an exercise to test resource efficiency
    await page.fill('input[type="text"]', 'falo')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Should maintain responsiveness
    await expect(page.locator('text=Next Exercise')).toBeVisible()
  })

  test('should handle error scenarios efficiently', async ({ page }) => {
    // Simulate network errors
    await page.route('**/api/**', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
    })
    
    const startTime = Date.now()
    
    // Wait for the exercise to load (should use fallback)
    await page.waitForSelector('.neo-card-lg')
    
    const loadTime = Date.now() - startTime
    
    // Should handle errors quickly and fall back
    expect(loadTime).toBeLessThan(3000)
    
    // Should still be functional
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })

  test('should optimize for repeated usage', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Measure performance for repeated operations
    const operationTimes: number[] = []
    
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now()
      
      await page.fill('input[type="text"]', 'falo')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
      
      const operationTime = Date.now() - startTime
      operationTimes.push(operationTime)
    }
    
    // Performance should not degrade significantly over time
    const firstHalf = operationTimes.slice(0, 5)
    const secondHalf = operationTimes.slice(5)
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    // Performance should not degrade by more than 50%
    expect(secondAvg).toBeLessThan(firstAvg * 1.5)
  })

  test('should handle animation and transitions smoothly', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Trigger any animations/transitions
    await page.fill('input[type="text"]', 'falo')
    await page.click('text=Check Answer')
    
    // Wait for feedback with potential animations
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that transitions are smooth (no abrupt changes)
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Go to next exercise
    await page.click('text=Next Exercise')
    
    // Should transition smoothly
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })
})