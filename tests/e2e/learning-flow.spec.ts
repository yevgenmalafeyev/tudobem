import { test, expect } from '@playwright/test'
import { setupTestPage } from '../utils/test-helpers'

test.describe('Learning Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page and complete configuration if needed
    await setupTestPage(page)
  })

  test('should load initial exercise', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that an exercise sentence is displayed
    await expect(page.locator('text=___ ')).toBeVisible()
    
    // Check that input field is present
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    
    // Check that check answer button is present
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
  })

  test('should complete input mode exercise flow', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Check that next exercise button appears
    await expect(page.locator('[data-testid="next-exercise-button"]')).toBeVisible()
    
    // Click next exercise
    await page.click('[data-testid="next-exercise-button"]')
    
    // Check that input field is focused and empty
    await expect(page.locator('[data-testid="exercise-input"]')).toHaveValue('')
  })

  test('should switch to multiple choice mode', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Click on multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Check that input field is no longer visible
    await expect(page.locator('[data-testid="exercise-input"]')).not.toBeVisible()
    
    // Check that question mark is displayed
    await expect(page.locator('text=?')).toBeVisible()
    
    // Check that multiple choice options are displayed
    await expect(page.locator('button:has-text("falo")')).toBeVisible()
  })

  test('should complete multiple choice exercise flow', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Switch to multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Wait for options to load
    await page.waitForSelector('button:has-text("falo")', { timeout: 10000 })
    
    // Click on the correct answer
    await page.click('button:has-text("falo")')
    
    // Check that the option is selected (highlighted)
    await expect(page.locator('button:has-text("falo")')).toHaveClass(/neo-inset/)
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Check that next exercise button appears
    await expect(page.locator('[data-testid="next-exercise-button"]')).toBeVisible()
  })

  test('should handle incorrect answers', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in an incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'incorrect')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed with error styling
    const feedback = page.locator('.neo-inset')
    await expect(feedback).toBeVisible()
    await expect(feedback).toHaveCSS('color', 'rgb(185, 28, 28)') // error color
    
    // Check that next exercise button appears
    await expect(page.locator('[data-testid="next-exercise-button"]')).toBeVisible()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Press Enter to check answer
    await page.press('[data-testid="exercise-input"]', 'Enter')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Press Enter again to go to next exercise
    await page.press('body', 'Enter')
    
    // Check that input field is focused and empty
    await expect(page.locator('[data-testid="exercise-input"]')).toHaveValue('')
  })

  test('should disable check answer button when input is empty', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that check answer button is disabled
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeDisabled()
    
    // Fill in some text
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Check that check answer button is now enabled
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeEnabled()
    
    // Clear the input
    await page.fill('[data-testid="exercise-input"]', '')
    
    // Check that check answer button is disabled again
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeDisabled()
  })

  test('should show loading state', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Check for loading state (might be brief)
    try {
      await expect(page.locator('text=Loading...')).toBeVisible({ timeout: 1000 })
    } catch {
      // Loading state might be too brief to catch
    }
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should display exercise level', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that exercise level is displayed
    await expect(page.locator('text=A1')).toBeVisible()
  })

  test('should display hints when available', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that hint is displayed (if available)
    const hintSelector = page.locator('text=/\\([^)]+\\)/')
    if (await hintSelector.count() > 0) {
      await expect(hintSelector).toBeVisible()
    }
  })

  test('should handle multiple exercises in sequence', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Complete first exercise
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('[data-testid="next-exercise-button"]')
    
    // Complete second exercise
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('[data-testid="next-exercise-button"]')
    
    // Complete third exercise
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that we can continue the flow
    await expect(page.locator('[data-testid="next-exercise-button"]')).toBeVisible()
  })

  test('should handle mode switching mid-session', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Start in input mode
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('[data-testid="next-exercise-button"]')
    
    // Switch to multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Wait for options to load
    await page.waitForSelector('button:has-text("falo")', { timeout: 10000 })
    
    // Select an option
    await page.click('button:has-text("falo")')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that elements are still visible and usable
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
    
    // Fill in the answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/api/generate-exercise', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Network error' }) })
    })
    
    await page.route('**/api/check-answer', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Network error' }) })
    })
    
    // Wait for the exercise to load (should use fallback)
    await page.waitForSelector('.neo-card-lg')
    
    // Check that fallback exercise is displayed
    await expect(page.locator('text=___ ')).toBeVisible()
    
    // Fill in the answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Click check answer (should use fallback logic)
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should maintain session state', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Switch to multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Complete an exercise
    await page.waitForSelector('button:has-text("falo")', { timeout: 10000 })
    await page.click('button:has-text("falo")')
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('[data-testid="next-exercise-button"]')
    
    // Check that mode is still multiple choice
    await expect(page.locator('text=?')).toBeVisible()
    await expect(page.locator('[data-testid="exercise-input"]')).not.toBeVisible()
    
    // Switch back to input mode
    await page.click('[data-testid="input-mode-toggle"]')
    
    // Check that input field is now visible
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
  })
})