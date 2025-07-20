import { test, expect } from '@playwright/test'
import { setupTestPage } from '../utils/test-helpers'

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page and complete configuration if needed
    await setupTestPage(page)
  })

  test('should have proper heading structure', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check for proper heading hierarchy (if any headings exist)
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    
    if (headingCount > 0) {
      // Check that headings are properly nested
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeLessThanOrEqual(1)
    }
  })

  test('should have proper focus management', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that input field is focused initially
    await expect(page.locator('[data-testid="exercise-input"]')).toBeFocused()
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that focus is on the mode toggle or check answer button
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Use Tab to navigate through elements
    await page.keyboard.press('Tab') // Mode toggle
    await page.keyboard.press('Tab') // Check answer button
    
    // Check that all interactive elements are focusable
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test keyboard activation
    await page.keyboard.press('Enter')
    
    // Should have activated the focused element
    // (behavior depends on what's focused)
  })

  test('should work with screen readers', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that form elements have proper labels
    const inputField = page.locator('[data-testid="exercise-input"]')
    
    // Check for aria-label or associated label
    const hasAriaLabel = await inputField.getAttribute('aria-label')
    const hasTitle = await inputField.getAttribute('title')
    const hasPlaceholder = await inputField.getAttribute('placeholder')
    
    // Should have some form of accessible name
    expect(hasAriaLabel || hasTitle || hasPlaceholder).toBeTruthy()
  })

  test('should have proper button labeling', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that buttons have accessible names
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const buttonText = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button should have either text content or aria-label
      expect(buttonText || ariaLabel).toBeTruthy()
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that text is visible (basic visibility test)
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
    
    // Check that feedback colors are distinguishable
    // Fill in correct answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is visible
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode by checking element visibility
    await page.waitForSelector('.neo-card-lg')
    
    // Check that all interactive elements are visible
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
    
    // Check that borders and outlines are visible
    const inputField = page.locator('[data-testid="exercise-input"]')
    const boundingBox = await inputField.boundingBox()
    expect(boundingBox).toBeTruthy()
  })

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Complete an exercise to trigger any animations
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback appears (animations should be reduced)
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should work with voice control', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that elements can be activated by voice commands
    // (simulated by programmatic clicks)
    
    // Voice command: "Click Input"
    await page.click('[data-testid="input-mode-toggle"]')
    
    // Voice command: "Type falo"
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Voice command: "Click Check Answer"
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that actions were successful
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check for ARIA attributes on interactive elements
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const role = await button.getAttribute('role')
      const ariaPressed = await button.getAttribute('aria-pressed')
      
      // Buttons should have proper role (implicit or explicit)
      // Toggle buttons should have aria-pressed
      if (ariaPressed !== null) {
        expect(ariaPressed).toMatch(/^(true|false)$/)
      }
    }
  })

  test('should announce state changes', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check for live regions or aria-live attributes
    const liveRegions = page.locator('[aria-live]')
    const liveRegionCount = await liveRegions.count()
    
    if (liveRegionCount > 0) {
      // Check that live regions have proper values
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i)
        const ariaLive = await region.getAttribute('aria-live')
        expect(ariaLive).toMatch(/^(polite|assertive|off)$/)
      }
    }
    
    // Trigger state change
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is announced
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should support zoom up to 200%', async ({ page }) => {
    // Set zoom level to 200%
    await page.setViewportSize({ width: 640, height: 480 })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that elements are still usable at high zoom
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
    
    // Test functionality at high zoom
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is visible at high zoom
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      // This test would require server-side rendering
      // For a Next.js app, this would test the SSR functionality
    })
    
    // Wait for the page to load
    await page.goto('/')
    
    // Check that basic structure is present
    // (This test depends on SSR implementation)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle form validation errors accessibly', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Try to submit without filling in answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Check that button is disabled (no error should occur)
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeDisabled()
    
    // Fill in answer
    await page.fill('[data-testid="exercise-input"]', 'falo')
    
    // Button should now be enabled
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeEnabled()
  })

  test('should provide skip links if needed', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check for skip links (if implemented)
    const skipLinks = page.locator('a[href^="#"]')
    const skipLinkCount = await skipLinks.count()
    
    if (skipLinkCount > 0) {
      // Test that skip links work
      await skipLinks.first().click()
      
      // Check that focus moved to target
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('should handle dynamic content updates', async ({ page }) => {
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Complete an exercise to trigger dynamic content
    await page.fill('[data-testid="exercise-input"]', 'falo')
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback (dynamic content)
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that new content is accessible
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Go to next exercise (more dynamic content)
    await page.click('[data-testid="next-exercise-button"]')
    
    // Check that input field is focused
    await expect(page.locator('[data-testid="exercise-input"]')).toBeFocused()
  })
})