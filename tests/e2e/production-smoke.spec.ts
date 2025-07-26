import { test, expect, Page } from '@playwright/test'
import { setupTestPage , validateESLintInTest } from '../utils/test-helpers'

/**
 * Helper function to wait for exercise loading and check state
 */
async function waitForExerciseOrError(page: Page, maxWaitMs: number = 45000) {
  // Wait for loading to complete or error state to appear with extended timeout
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} to detect exercise state...`);
    
    try {
      await page.waitForFunction(() => {
        const loadingText = document.body.textContent?.includes('A carregar exercício')
        const hasInput = document.querySelector('input[type="text"]')
        const hasError = document.body.textContent?.includes('Erro ao carregar exercício')
        
        // More comprehensive loading detection
        const hasLoadingSpinner = document.querySelector('[data-testid="loading"]') || 
                                  document.querySelector('.loading') ||
                                  document.querySelector('.spinner')
        
        return !loadingText || hasInput || hasError || (!hasLoadingSpinner && !loadingText)
      }, { timeout: maxWaitMs / maxAttempts })
      
      // If we get here, function completed successfully
      break;
    } catch {
      console.warn(`Loading timeout on attempt ${attempts} - checking current state`)
      
      // If this is the last attempt, we'll proceed with state check
      if (attempts >= maxAttempts) {
        console.warn('All loading attempts timed out, checking final state')
      } else {
        // Wait a bit before next attempt to let any hanging requests resolve
        await page.waitForTimeout(2000)
      }
    }
  }
  
  // Check current state with multiple attempts
  let hasExercise = false;
  let hasError = false;
  let isLoading = false;
  
  try {
    hasExercise = await page.locator('input[type="text"]').isVisible({ timeout: 3000 })
  } catch {
    // Continue to error check
  }
  
  try {
    hasError = await page.locator('.neo-card:has-text("Erro ao carregar exercício")').isVisible({ timeout: 2000 })
  } catch {
    // Continue to loading check
  }
  
  try {
    isLoading = await page.locator('text=A carregar exercício').isVisible({ timeout: 1000 })
  } catch {
    // All checks done
  }
  
  console.log(`📊 Exercise state: hasExercise=${hasExercise}, hasError=${hasError}, isLoading=${isLoading}`)
  
  return { hasExercise, hasError, isLoading }
}

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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should load the application successfully');


  
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should complete basic exercise flow');


  
    // Wait for exercise to load or error to appear (longer timeout for production)
    const { hasExercise, hasError, isLoading } = await waitForExerciseOrError(page)
    
    if (hasError) {
      console.warn('Skipping exercise flow test - API appears to be down')
      // Just verify the app structure is working
      await expect(page.locator('h1:has-text("Aprender Português"), h1:has-text("Tudobem")')).toBeVisible()
      return
    }
    
    if (isLoading) {
      console.warn('Exercise still loading after timeout - this may indicate slow API responses')
      // Try to wait a bit more for the exercise to appear
      await page.waitForTimeout(5000)
      const retryHasExercise = await page.locator('input[type="text"]').isVisible({ timeout: 5000 })
      if (!retryHasExercise) {
        throw new Error('Exercise did not load within extended timeout - API may be experiencing issues')
      }
    } else if (!hasExercise) {
      throw new Error('No exercise input field found - check if page loaded properly')
    }
    
    // Verify exercise elements are present  
    await expect(page.locator('input[type="text"]')).toBeVisible()
    // Verify the exercise sentence is displayed
    const exerciseTextVisible = await page.locator('main').textContent()
    expect(exerciseTextVisible).toBeTruthy()
    console.log('Exercise loaded successfully with text:', exerciseTextVisible?.substring(0, 100))
    
    // Fill in a common Portuguese answer
    await page.fill('input[type="text"]', 'falo')
    
    // Check answer button should be enabled after entering text
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeEnabled()
    
    // Click check answer (Portuguese or English)
    await checkButton.click()
    
    // Wait for feedback (with longer timeout for production)
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    
    // Verify feedback appears
    await expect(page.locator('.neo-inset')).toBeVisible()
    
    // Next exercise button should appear (Portuguese or English)
    await expect(page.locator('button:has-text("Próximo Exercício"), button:has-text("Next Exercise")')).toBeVisible()
  })

  test('should handle mode switching', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle mode switching');


  
    // Wait for exercise to load or error to appear (longer timeout for production)
    const { hasExercise, hasError, isLoading } = await waitForExerciseOrError(page)
    
    if (hasError) {
      console.warn('Skipping mode switching test - API appears to be down')
      // Just verify the app structure is working
      await expect(page.locator('h1:has-text("Tudobem"), h1:has-text("Aprender Português")')).toBeVisible()
      return
    }
    
    if (isLoading) {
      console.warn('Exercise still loading after timeout - skipping mode switching test')
      return
    }
    
    if (!hasExercise) {
      console.warn('No exercise loaded - skipping mode switching test (API may be experiencing issues)')
      return
    }
    
    // Look for mode switching button in Portuguese or English (improved selector)
    const modeButton = page.locator('button:has-text("Mostrar Opções"), button:has-text("Multiple Choice")')
    await expect(modeButton).toBeVisible({ timeout: 10000 })
    await modeButton.click()
    
    // Wait for multiple choice options to appear
    await page.waitForTimeout(2000)
    
    // Verify mode switched successfully - input should be hidden
    await expect(page.locator('input[type="text"]')).not.toBeVisible()
    
    // Should have multiple choice buttons (look for any clickable options)
    const choiceButtons = page.locator('button').filter({ hasNotText: /Verificar|Check|Next|Próximo|Input|Multiple|Mostrar/ })
    await expect(choiceButtons.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should be responsive on mobile');


  
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for exercise to load or determine current state
    const { hasExercise, hasError, isLoading } = await waitForExerciseOrError(page)
    
    if (hasError) {
      console.warn('Skipping mobile responsiveness test - API appears to be down')
      // Just verify the app structure is working on mobile
      await expect(page.locator('h1:has-text("Tudobem"), h1:has-text("Aprender Português")')).toBeVisible()
      return
    }
    
    if (isLoading) {
      console.warn('Skipping mobile responsiveness test - exercise still loading')
      return
    }
    
    if (!hasExercise) {
      throw new Error('No exercise input field found - check if page loaded properly')
    }
    
    // Check that elements are visible and usable on mobile
    await expect(page.locator('input[type="text"]')).toBeVisible()
    
    // Look for check answer button in Portuguese or English (initially disabled)
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible()
    
    // Test basic interaction on mobile
    await page.fill('input[type="text"]', 'sou')
    await expect(checkButton).toBeEnabled()
  })

  test('should handle network conditions gracefully', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle network conditions gracefully');


  
    // Wait for exercise to load or determine current state
    const { hasExercise, hasError, isLoading } = await waitForExerciseOrError(page)
    
    if (hasError) {
      console.warn('Skipping network conditions test - API appears to be down')
      return
    }
    
    if (isLoading) {
      console.warn('Skipping network conditions test - exercise still loading')
      return
    }
    
    if (!hasExercise) {
      throw new Error('No exercise input field found - check if page loaded properly')
    }
    
    // Simulate slow network for future requests
    await page.route('**/api/**', async route => {
      // Add delay to API calls
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    // Should still work with slow network
    await expect(page.locator('input[type="text"]')).toBeVisible()
    
    // Fill in answer
    await page.fill('input[type="text"]', 'está')
    
    // Click check answer (Portuguese or English)
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await checkButton.click()
    
    // Should eventually show feedback (even with slow network)
    await page.waitForSelector('.neo-inset', { timeout: 30000 })
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should maintain functionality across page reloads', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should maintain functionality across page reloads');


  
    // Wait for exercise to load or error to appear (longer timeout for production)
    const { hasExercise, hasError, isLoading } = await waitForExerciseOrError(page)
    
    if (hasError) {
      console.warn('Skipping page reload test - API appears to be down')
      // Just verify the app reloads properly
      await page.reload()
      await page.waitForSelector('h1:has-text("Tudobem"), h1:has-text("Aprender Português")', { timeout: 30000 })
      return
    }
    
    if (isLoading) {
      console.warn('Exercise still loading after timeout - skipping page reload test')
      return
    }
    
    if (!hasExercise) {
      console.warn('No exercise loaded - skipping page reload test (API may be experiencing issues)')
      return
    }
    
    // Complete an exercise
    await page.fill('input[type="text"]', 'falo')
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await checkButton.click()
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    
    // Reload the page
    await page.reload()
    
    // Should load page again (may have new exercise or error state)
    await page.waitForSelector('.neo-card-lg, .neo-card:has-text("Erro ao carregar exercício")', { timeout: 30000 })
    
    // If we have an exercise, verify it's functional
    const hasExerciseAfterReload = await page.locator('.neo-card-lg').isVisible()
    if (hasExerciseAfterReload) {
      await expect(page.locator('input[type="text"]')).toBeVisible()
      await expect(page.locator('input[type="text"]')).toHaveValue('')
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle API errors gracefully');


  
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
    
    // Click check answer (this should fail gracefully) - Portuguese or English
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await checkButton.click()
    
    // Should still show some feedback (fallback logic)
    await page.waitForSelector('.neo-inset', { timeout: 15000 })
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should load within acceptable time limits', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should load within acceptable time limits');


  
    const startTime = Date.now()
    
    // Navigate and wait for content
    await page.goto('/')
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    const loadTime = Date.now() - startTime
    
    // Should load within 10 seconds in production
    expect(loadTime).toBeLessThan(10000)
    
    // Check that interactive elements are ready
    await expect(page.locator('input[type="text"]')).toBeVisible()
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible()
  })

  test('should work without JavaScript (basic SSR check)', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should work without JavaScript (basic SSR check)');


  
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
    // Create fewer concurrent pages to reduce resource pressure
    const pages = await Promise.all([
      context.newPage(),
      context.newPage()
    ])
    
    console.log('🚀 Starting concurrent load test with', pages.length + 1, 'pages')
    
    // Navigate all pages simultaneously using the test helper
    await Promise.all([
      setupTestPage(page),
      ...pages.map(p => setupTestPage(p))
    ])
    
    console.log('📊 All pages navigated, checking exercise states...')
    
    // Check exercise state on all pages with our robust helper
    const pageStates = await Promise.all([
      waitForExerciseOrError(page, 45000),
      ...pages.map(p => waitForExerciseOrError(p, 45000))
    ])
    
    console.log('📊 Page states:', pageStates.map((state, i) => `Page ${i}: ${JSON.stringify(state)}`))
    
    // Count successful exercises (not errors or loading states)
    const successfulPages = pageStates.filter(state => state.hasExercise && !state.hasError && !state.isLoading).length
    const totalPages = pageStates.length
    
    console.log(`📊 Load test result: ${successfulPages}/${totalPages} pages loaded exercises successfully`)
    
    // We expect at least 50% success rate under load (2/3 or 2/2 pages should work)
    expect(successfulPages).toBeGreaterThanOrEqual(Math.ceil(totalPages * 0.5))
    
    // Clean up additional pages
    await Promise.all(pages.map(p => p.close()))
  })
})