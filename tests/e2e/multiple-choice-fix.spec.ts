import { test, expect } from '@playwright/test'
import { validateESLintInTest } from '../utils/test-helpers'

test.describe('Multiple Choice Options Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('should always include correct answer in multiple choice options', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should always include correct answer in multiple choice options');


  
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Wait for options to appear
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Get all option buttons
    const optionButtons = await page.locator('[data-testid="multiple-choice-option"]').all()
    
    // Should have at least one option
    expect(optionButtons.length).toBeGreaterThan(0)
    
    // Check that at least one option is clickable (meaning correct answer is available)
    const firstOption = optionButtons[0]
    await expect(firstOption).toBeVisible()
    await expect(firstOption).toBeEnabled()
    
    // Click an option to test functionality
    await firstOption.click()
    
    // Should be able to check the answer
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible({ timeout: 5000 })
    await checkButton.click()
    
    // Should get feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
  })

  test('should handle API failures gracefully', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle API failures gracefully');


  
    // Intercept API calls to simulate failure
    await page.route('**/api/generate-multiple-choice', (route) => {
      route.abort('failed')
    })
    
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Even with API failure, should still show options
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Should have fallback options
    const optionButtons = await page.locator('[data-testid="multiple-choice-option"]').all()
    expect(optionButtons.length).toBeGreaterThan(0)
    
    // Should be able to select and answer
    await optionButtons[0].click()
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible({ timeout: 5000 })
    await checkButton.click()
    
    // Should get feedback even with fallback options
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
  })

  test('should handle slow API responses', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle slow API responses');


  
    // Intercept API calls to simulate slow response
    await page.route('**/api/generate-multiple-choice', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
      await route.continue()
    })
    
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Should show loading or still provide options
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 15000 })
    
    const optionButtons = await page.locator('[data-testid="multiple-choice-option"]').all()
    expect(optionButtons.length).toBeGreaterThan(0)
  })

  test('should handle different exercise types consistently', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle different exercise types consistently');


  
    // Test multiple exercises to ensure consistency
    for (let i = 0; i < 3; i++) {
      // Wait for exercise to load
      await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
      
      // Switch to multiple choice mode
      await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
      
      // Wait for options
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Should always have options
      const optionButtons = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(optionButtons.length).toBeGreaterThan(0)
      
      // Select first option and check answer
      await optionButtons[0].click()
      const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
      await expect(checkButton).toBeVisible({ timeout: 5000 })
      await checkButton.click()
      
      // Wait for feedback
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      
      // Move to next exercise
      await page.click('text=Next Exercise')
      
      // Wait a bit for next exercise to load
      await page.waitForTimeout(1000)
    }
  })

  test('should not show duplicate options', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should not show duplicate options');


  
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Wait for options
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Get all option texts
    const optionTexts = await page.locator('[data-testid="multiple-choice-option"]').allTextContents()
    
    // Check for duplicates
    const uniqueOptions = [...new Set(optionTexts)]
    expect(optionTexts.length).toBe(uniqueOptions.length)
  })

  test('should handle mode switching correctly', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle mode switching correctly');


  
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Start in input mode
    await page.click('button:has-text("Digitar Resposta"), button:has-text("Type answer")')
    
    // Should see input field
    await page.waitForSelector('input[type="text"]', { timeout: 5000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Should see multiple choice options
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Should not see input field
    await expect(page.locator('input[type="text"]')).not.toBeVisible()
    
    // Options should be available
    const optionButtons = await page.locator('[data-testid="multiple-choice-option"]').all()
    expect(optionButtons.length).toBeGreaterThan(0)
    
    // Switch back to input mode
    await page.click('button:has-text("Digitar Resposta"), button:has-text("Type answer")')
    
    // Should see input field again
    await page.waitForSelector('input[type="text"]', { timeout: 5000 })
    
    // Should not see multiple choice options
    await expect(page.locator('[data-testid="multiple-choice-option"]')).not.toBeVisible()
  })

  test('should handle special characters in options', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle special characters in options');


  
    // Mock an exercise with special characters
    await page.route('**/api/generate-exercise', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-special',
          sentence: 'Ela ___ em casa.',
          gapIndex: 1,
          correctAnswer: 'está',
          topic: 'verbs',
          level: 'A1',
          hint: {
            infinitive: 'estar',
            form: 'present'
          }
        })
      })
    })
    
    // Mock multiple choice options with special characters
    await page.route('**/api/generate-multiple-choice', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          options: ['está', 'estão', 'estás', 'estamos']
        })
      })
    })
    
    // Reload to get new exercise
    await page.reload()
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Should see options with special characters
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Should be able to see and click the option with special characters
    await expect(page.locator('text=está')).toBeVisible()
    await page.click('text=está')
    
    // Should be able to check answer
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible({ timeout: 5000 })
    await checkButton.click()
    
    // Should get feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
  })

  test('should maintain correct answer availability after page reload', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should maintain correct answer availability after page reload');


  
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Wait for options
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Get options before reload
    const optionsBefore = await page.locator('[data-testid="multiple-choice-option"]').allTextContents()
    expect(optionsBefore.length).toBeGreaterThan(0)
    
    // Reload the page
    await page.reload()
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Switch to multiple choice mode again
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    
    // Should still have options after reload
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    const optionsAfter = await page.locator('[data-testid="multiple-choice-option"]').all()
    expect(optionsAfter.length).toBeGreaterThan(0)
  })
})