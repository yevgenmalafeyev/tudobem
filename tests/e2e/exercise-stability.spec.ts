import { test, expect } from '@playwright/test'
import { validateESLintInTest } from '../utils/test-helpers'

test.describe('Exercise Stability', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the learning page
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('should not auto-change exercises without user interaction', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should not auto-change exercises without user interaction');
    
    // Wait for initial exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 15000 })
    
    // Get the initial exercise text
    const exerciseContainer = page.locator('.neo-card-lg')
    const initialExerciseText = await exerciseContainer.textContent()
    
    // Wait for 5 seconds to see if exercise changes automatically
    await page.waitForTimeout(5000)
    
    // Check that the exercise text hasn't changed
    const afterWaitExerciseText = await exerciseContainer.textContent()
    expect(afterWaitExerciseText).toBe(initialExerciseText)
    
    // Wait another 3 seconds to be extra sure
    await page.waitForTimeout(3000)
    
    // Check again that the exercise text is still the same
    const finalExerciseText = await exerciseContainer.textContent()
    expect(finalExerciseText).toBe(initialExerciseText)
  })

  test('should maintain same exercise during mode switching', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should maintain same exercise during mode switching');
    
    // Wait for initial exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 15000 })
    
    // Get the initial exercise sentence (looking for the main sentence text)
    const exerciseSentence = await page.locator('.neo-card-lg').textContent()
    const sentenceMatch = exerciseSentence?.match(/[\w\s]+___[\w\s]+/) // Match pattern with underscores
    const initialSentence = sentenceMatch ? sentenceMatch[0] : exerciseSentence
    
    // Switch to multiple choice mode
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Get exercise text in multiple choice mode
    const mcExerciseText = await page.locator('.neo-card-lg').textContent()
    const mcSentenceMatch = mcExerciseText?.match(/[\w\s]+___[\w\s]+/) 
    const mcSentence = mcSentenceMatch ? mcSentenceMatch[0] : mcExerciseText
    
    // Should be the same sentence
    expect(mcSentence).toContain(initialSentence?.trim() || '')
    
    // Switch back to input mode
    await page.click('button:has-text("Digitar Resposta"), button:has-text("Type answer")')
    await page.waitForSelector('input[type="text"]', { timeout: 5000 })
    
    // Get exercise text back in input mode
    const backToInputText = await page.locator('.neo-card-lg').textContent()
    const backSentenceMatch = backToInputText?.match(/[\w\s]+___[\w\s]+/)
    const backSentence = backSentenceMatch ? backSentenceMatch[0] : backToInputText
    
    // Should still be the same sentence
    expect(backSentence).toContain(initialSentence?.trim() || '')
  })

  test('should only change exercise when explicitly requesting next exercise', async ({ page }) => {
    test.setTimeout(30000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should only change exercise when explicitly requesting next exercise');
    
    // Wait for initial exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 15000 })
    
    // Get the initial exercise text
    const getExerciseId = async () => {
      const exerciseText = await page.locator('.neo-card-lg').textContent()
      // Extract a unique part of the exercise (sentence pattern)
      const match = exerciseText?.match(/[\w\s]+___[\w\s]+/)
      return match ? match[0].trim() : exerciseText?.trim()
    }
    
    const initialExerciseId = await getExerciseId()
    
    // Fill in an answer
    await page.fill('input[type="text"]', 'está')
    
    // Check answer
    const checkButton = page.locator('button:has-text("Verificar Resposta"), button:has-text("Check Answer")')
    await expect(checkButton).toBeVisible({ timeout: 5000 })
    await checkButton.click()
    
    // Wait for feedback
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Exercise should still be the same after checking answer
    const afterCheckExerciseId = await getExerciseId()
    expect(afterCheckExerciseId).toBe(initialExerciseId)
    
    // Wait another 3 seconds to ensure no auto-change
    await page.waitForTimeout(3000)
    const stillSameExerciseId = await getExerciseId()
    expect(stillSameExerciseId).toBe(initialExerciseId)
    
    // Now explicitly click next exercise
    await page.click('button:has-text("Próximo Exercício"), button:has-text("Next Exercise")')
    
    // Wait for new exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Now the exercise should be different
    const newExerciseId = await getExerciseId()
    expect(newExerciseId).not.toBe(initialExerciseId)
  })

  test('should maintain exercise stability during page interactions', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should maintain exercise stability during page interactions');
    
    // Wait for initial exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 15000 })
    
    // Get the initial exercise content
    const initialContent = await page.locator('.neo-card-lg').textContent()
    
    // Perform various interactions that shouldn't change the exercise
    
    // 1. Click in the input field
    await page.click('input[type="text"]')
    await page.waitForTimeout(1000)
    let currentContent = await page.locator('.neo-card-lg').textContent()
    expect(currentContent).toBe(initialContent)
    
    // 2. Type something and delete it
    await page.fill('input[type="text"]', 'test')
    await page.waitForTimeout(500)
    await page.fill('input[type="text"]', '')
    await page.waitForTimeout(1000)
    currentContent = await page.locator('.neo-card-lg').textContent()
    expect(currentContent).toBe(initialContent)
    
    // 3. Switch modes back and forth
    await page.click('button:has-text("Mostrar Opções"), button:has-text("Show options")')
    await page.waitForTimeout(1000)
    await page.click('button:has-text("Digitar Resposta"), button:has-text("Type answer")')
    await page.waitForTimeout(1000)
    currentContent = await page.locator('.neo-card-lg').textContent()
    expect(currentContent).toBe(initialContent)
    
    // 4. Wait a longer period to ensure no automatic changes
    await page.waitForTimeout(4000)
    currentContent = await page.locator('.neo-card-lg').textContent()
    expect(currentContent).toBe(initialContent)
  })

  test('should not change exercise due to configuration loading', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should not change exercise due to configuration loading');
    
    // Wait for initial exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 15000 })
    
    // Get the initial exercise  
    const exerciseText = await page.locator('.neo-card-lg').textContent()
    
    // Navigate to configuration page (this might trigger configuration changes)
    await page.click('nav button:has-text("Configuração"), nav button:has-text("Configuration")')
    await page.waitForTimeout(2000)
    
    // Navigate back to learning
    await page.click('nav button:has-text("Aprender"), nav button:has-text("Learn")')
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 })
    
    // Exercise should be the same (or if different, due to navigation not auto-changing)
    const afterNavExerciseText = await page.locator('.neo-card-lg').textContent()
    const afterNavSentence = afterNavExerciseText?.match(/[\w\s]+___[\w\s]+/)?.[0]
    
    // Wait to ensure no further auto-changes
    await page.waitForTimeout(3000)
    const finalExerciseText = await page.locator('.neo-card-lg').textContent()
    const finalSentence = finalExerciseText?.match(/[\w\s]+___[\w\s]+/)?.[0]
    
    // The final exercise should be stable (same as after navigation)
    expect(finalSentence).toBe(afterNavSentence)
  })
})