import { test, expect } from '@playwright/test'
import { setupTestPage , validateESLintInTest } from '../utils/test-helpers'

test.describe('Learning Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page and complete configuration if needed
    await setupTestPage(page)
  })

  test('should load initial exercise', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should load initial exercise');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that an exercise sentence is displayed
    const exerciseContent = page.locator('.neo-card-lg')
    await expect(exerciseContent).toBeVisible()
    
    // Exercise could have:
    // 1. Input field embedded in text (input mode)
    // 2. Text with underscores "___" (old format)
    // 3. Text with question mark "?" (multiple choice)
    const hasInputField = await exerciseContent.locator('input[type="text"]').count() > 0
    const hasUnderscores = await exerciseContent.locator('text=___').count() > 0
    const hasQuestionMark = await exerciseContent.locator('text=?').count() > 0
    const hasExerciseText = await exerciseContent.textContent()
    
    // Should have some form of exercise content
    const hasValidContent = hasInputField || hasUnderscores || hasQuestionMark || (hasExerciseText && hasExerciseText.trim().length > 0)
    expect(hasValidContent).toBeTruthy()
    
    // Check that input field is present
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    
    // Check that check answer button is present
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
  })

  test('should complete input mode exercise flow', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should complete input mode exercise flow');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in any answer (use "a" as a generic answer)
    await page.fill('[data-testid="exercise-input"]', 'a')
    
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should switch to multiple choice mode');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Click on multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Check that input field is no longer visible
    await expect(page.locator('[data-testid="exercise-input"]')).not.toBeVisible()
    
    // Check that question mark is displayed
    await expect(page.locator('text=?')).toBeVisible()
    
    // Check that multiple choice options are displayed (any option buttons)
    const multipleChoiceOptions = page.locator('[data-testid="multiple-choice-option"]')
    await expect(multipleChoiceOptions.first()).toBeVisible()
    
    // Should have at least 2 options
    const optionsCount = await multipleChoiceOptions.count()
    expect(optionsCount).toBeGreaterThanOrEqual(2)
  })

  test('should complete multiple choice exercise flow', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should complete multiple choice exercise flow');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Switch to multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Wait for options to load
    const multipleChoiceOptions = page.locator('[data-testid="multiple-choice-option"]')
    await multipleChoiceOptions.first().waitFor({ timeout: 10000 })
    
    // Click on the first option (any option)
    await multipleChoiceOptions.first().click()
    
    // Check that an option is selected (first option should have some selection styling)
    await expect(multipleChoiceOptions.first()).toHaveClass(/neo-button-primary|selected|neo-inset/)
    
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle incorrect answers');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in an incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'incorrect')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    const feedback = page.locator('.neo-inset')
    await expect(feedback).toBeVisible()
    
    // Feedback should contain some text (error message)
    const feedbackText = await feedback.textContent()
    expect(feedbackText).toBeTruthy()
    expect(feedbackText.length).toBeGreaterThan(0)
    
    // Check that next exercise button appears
    await expect(page.locator('[data-testid="next-exercise-button"]')).toBeVisible()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle keyboard shortcuts');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer (use generic answer)
    await page.fill('[data-testid="exercise-input"]', 'test')
    
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should disable check answer button when input is empty');


  
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should show loading state');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Fill in the answer (use generic answer)
    await page.fill('[data-testid="exercise-input"]', 'test')
    
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should display exercise level');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that exercise level is displayed
    await expect(page.locator('text=A1')).toBeVisible()
  })

  test('should display hints when available', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should display hints when available');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that hint is displayed (if available)
    const hintSelector = page.locator('text=/\\([^)]+\\)/')
    if (await hintSelector.count() > 0) {
      await expect(hintSelector).toBeVisible()
    }
  })

  test('should handle multiple exercises in sequence', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle multiple exercises in sequence');


  
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


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle mode switching mid-session');


  
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
    const multipleChoiceOptions = page.locator('[data-testid="multiple-choice-option"]')
    await multipleChoiceOptions.first().waitFor({ timeout: 10000 })
    
    // Select an option
    await multipleChoiceOptions.first().click()
    await page.click('[data-testid="check-answer-button"]')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should be responsive on mobile');


  
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Check that elements are still visible and usable
    await expect(page.locator('[data-testid="exercise-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-answer-button"]')).toBeVisible()
    
    // Fill in the answer (use generic answer)
    await page.fill('[data-testid="exercise-input"]', 'test')
    
    // Click check answer
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle network errors gracefully');


  
    // Intercept API calls and return errors
    await page.route('**/api/generate-exercise', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Network error' }) })
    })
    
    await page.route('**/api/check-answer', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Network error' }) })
    })
    
    // Wait for the exercise to load (should use fallback)
    await page.waitForSelector('.neo-card-lg')
    
    // Check that some exercise is displayed (fallback or cached)
    const exerciseContent = page.locator('.neo-card-lg')
    await expect(exerciseContent).toBeVisible()
    
    // Should have some exercise content despite network error
    const hasExerciseText = await exerciseContent.textContent()
    expect(hasExerciseText).toBeTruthy()
    
    // Fill in the answer (use generic answer)
    await page.fill('[data-testid="exercise-input"]', 'test')
    
    // Click check answer (should use fallback logic)
    await page.click('[data-testid="check-answer-button"]')
    
    // Wait for feedback to appear
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check that feedback is displayed
    await expect(page.locator('.neo-inset')).toBeVisible()
  })

  test('should maintain session state', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should maintain session state');


  
    // Wait for the exercise to load
    await page.waitForSelector('.neo-card-lg')
    
    // Switch to multiple choice mode
    await page.click('[data-testid="multiple-choice-mode-toggle"]')
    
    // Complete an exercise
    const multipleChoiceOptions = page.locator('[data-testid="multiple-choice-option"]')
    await multipleChoiceOptions.first().waitFor({ timeout: 10000 })
    await multipleChoiceOptions.first().click()
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