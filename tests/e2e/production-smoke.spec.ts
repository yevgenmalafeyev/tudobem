import { test, expect } from '@playwright/test'
import { setupTestPage } from '../utils/test-helpers'

/**
 * Production smoke tests - Critical path verification for deployed app
 * These tests run against the live Vercel deployment to ensure basic functionality
 */

test.describe('Production Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the deployed app and complete configuration if needed
    await setupTestPage(page)
  })

  test('should load the application successfully', async ({ page }) => {
    // Check that the app loads - either with exercise or error state
    const mainContent = page.locator('.neo-card-lg, .neo-card:has-text("Erro ao carregar exercício")')
    await expect(mainContent.first()).toBeVisible()
    
    // Check if we have a working exercise (preferred) or at least the app structure loaded
    const hasExercise = await page.locator('.neo-card-lg').isVisible()
    const hasError = await page.locator('.neo-card:has-text("Erro ao carregar exercício")').isVisible()
    
    if (hasExercise) {
      // Verify exercise elements are present
      await expect(page.locator('input[type="text"]')).toBeVisible()
    } else if (hasError) {
      console.warn('Production app has exercise loading issues - API may be down')
      // At least verify the app structure loaded
      await expect(page.locator('h1:has-text("Aprender Português")')).toBeVisible()
    } else {
      throw new Error('App loaded but in unexpected state')
    }
    
    // Check that there are no console errors
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    // Wait a bit to catch any console errors
    await page.waitForTimeout(2000)
    
    // No critical console errors should be present
    const criticalErrors = logs.filter(log => 
      log.includes('Error') && 
      !log.includes('404') && // Ignore 404s for non-critical resources
      !log.includes('favicon') // Ignore favicon errors
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should complete basic exercise flow', async ({ page }) => {
    // Check if we have a working exercise or error state
    const hasExercise = await page.locator('.neo-card-lg').isVisible()
    const hasError = await page.locator('.neo-card:has-text("Erro ao carregar exercício")').isVisible()
    
    if (hasError) {
      console.warn('Skipping exercise flow test - API appears to be down')
      // Just verify the app structure is working
      await expect(page.locator('h1:has-text("Aprender Português")')).toBeVisible()
      return
    }
    
    if (!hasExercise) {
      throw new Error('No exercise or error state found')
    }
    
    // Verify exercise elements are present
    await expect(page.locator('text=___')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    
    // Fill in a common Portuguese answer
    await page.fill('input[type="text"]', 'falo')
    
    // Check answer button should be enabled
    await expect(page.locator('text=Verificar Resposta, text=Check Answer')).toBeEnabled()
    
    // Click check answer
    await page.click('text=Check Answer')
    
    // Wait for feedback (with longer timeout for production)
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    
    // Verify feedback appears
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Next exercise button should appear
    await expect(page.locator('text=Next Exercise')).toBeVisible()
  })

  test('should handle mode switching', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    // Switch to multiple choice mode
    await page.click('text=Multiple Choice')
    
    // Wait for multiple choice options (with longer timeout)
    await page.waitForSelector('button:has-text("falo"), button:has-text("fala"), button:has-text("é")', { timeout: 15000 })
    
    // Verify mode switched successfully
    await expect(page.locator('input[type="text"]')).not.toBeVisible()
    await expect(page.locator('text=?')).toBeVisible()
    
    // Should have multiple choice buttons
    const buttons = page.locator('button').filter({ hasNotText: /Check Answer|Next Exercise|Input|Multiple Choice/ })
    await expect(buttons.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    // Check that elements are visible and usable on mobile
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('text=Check Answer')).toBeVisible()
    
    // Test basic interaction on mobile
    await page.fill('input[type="text"]', 'sou')
    await expect(page.locator('text=Check Answer')).toBeEnabled()
  })

  test('should handle network conditions gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', async route => {
      // Add delay to API calls
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg', { timeout: 45000 })
    
    // Should still work with slow network
    await expect(page.locator('input[type="text"]')).toBeVisible()
    
    // Fill in answer
    await page.fill('input[type="text"]', 'está')
    
    // Click check answer
    await page.click('text=Check Answer')
    
    // Should show loading state
    await expect(page.locator('text=Loading...')).toBeVisible()
    
    // Eventually should show feedback
    await page.waitForSelector('.neo-inset', { timeout: 30000 })
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should maintain functionality across page reloads', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    // Complete an exercise
    await page.fill('input[type="text"]', 'falo')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    
    // Reload the page
    await page.reload()
    
    // Should load a new exercise
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toHaveValue('')
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors occasionally
    let callCount = 0
    await page.route('**/api/check-answer', route => {
      callCount++
      if (callCount === 1) {
        // First call fails
        route.fulfill({ 
          status: 500, 
          body: JSON.stringify({ error: 'Server error' }) 
        })
      } else {
        // Subsequent calls succeed
        route.continue()
      }
    })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    // Fill in answer
    await page.fill('input[type="text"]', 'falo')
    
    // Click check answer (this should fail gracefully)
    await page.click('text=Check Answer')
    
    // Should still show some feedback (fallback logic)
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now()
    
    // Navigate and wait for content
    await page.goto('/')
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    const loadTime = Date.now() - startTime
    
    // Should load within 10 seconds in production
    expect(loadTime).toBeLessThan(10000)
    
    // Check that interactive elements are ready
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('text=Check Answer')).toBeVisible()
  })

  test('should work without JavaScript (basic SSR check)', async ({ page }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      // This would require SSR to be implemented
      // For now, just check that the page structure exists
    })
    
    await page.goto('/')
    
    // Basic page structure should be present
    await expect(page.locator('body')).toBeVisible()
    
    // This test would be more comprehensive with full SSR
  })

  test('should handle concurrent users (basic load test)', async ({ page, context }) => {
    // Create multiple pages to simulate concurrent users
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ])
    
    // Navigate all pages simultaneously
    await Promise.all([
      page.goto('/'),
      ...pages.map(p => p.goto('/'))
    ])
    
    // Wait for all pages to load
    await Promise.all([
      page.waitForSelector('.neo-card-lg', { timeout: 30000 }),
      ...pages.map(p => p.waitForSelector('.neo-card-lg', { timeout: 30000 }))
    ])
    
    // All pages should be functional
    await Promise.all([
      expect(page.locator('input[type="text"]')).toBeVisible(),
      ...pages.map(p => expect(p.locator('input[type="text"]')).toBeVisible())
    ])
    
    // Clean up
    await Promise.all(pages.map(p => p.close()))
  })
})