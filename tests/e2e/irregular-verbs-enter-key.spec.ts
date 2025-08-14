import { test, expect, Page } from '@playwright/test'

test.describe('Irregular Verbs Enter Key Functionality', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate to the application
    await page.goto('/?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Navigate to irregular verbs section
    await page.click('text=Verbos Irregulares')
    await page.waitForLoadState('networkidle')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('Enter key should work like "Próximo exercício" button in text input mode', async () => {
    console.log('🔍 Testing Enter key in text input mode')
    
    // Ensure we're in text input mode
    await page.click('text=Digitar Resposta')
    await page.waitForTimeout(500)
    
    // Wait for text input
    await page.waitForSelector('input[type="text"]', { timeout: 10000 })
    
    // Fill in an answer
    await page.fill('input[type="text"]', 'sou')
    
    // Submit with Enter key
    await page.keyboard.press('Enter')
    
    // Wait for feedback
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    // Verify feedback is visible
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Store the current question to verify it changes
    const currentQuestion = await page.textContent('h2')
    
    // Now test Enter key to proceed to next exercise
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000) // Allow time for next exercise to load
    
    // Verify we moved to next exercise (question should change)
    const newQuestion = await page.textContent('h2')
    expect(newQuestion).not.toBe(currentQuestion)
    
    console.log('✅ Enter key works correctly in text input mode')
  })

  test('Enter key should work like "Próximo exercício" button in multiple choice mode', async () => {
    console.log('🔍 Testing Enter key in multiple choice mode')
    
    // Switch to multiple choice mode
    await page.click('text=Mostrar Opções')
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Store the current question to verify it changes
    const currentQuestion = await page.textContent('h2')
    
    // Click first option (auto-submits)
    const firstOption = await page.locator('button[data-testid="multiple-choice-option"]').first()
    await firstOption.click()
    
    // Wait for feedback
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    // Verify feedback is visible
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Test Enter key to proceed to next exercise
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000) // Allow time for next exercise to load
    
    // Verify we moved to next exercise (question should change)
    const newQuestion = await page.textContent('h2')
    expect(newQuestion).not.toBe(currentQuestion)
    
    console.log('✅ Enter key works correctly in multiple choice mode')
  })

  test('Enter key behavior should be consistent with button click', async () => {
    console.log('🔍 Testing Enter key vs button click consistency')
    
    // Test in both modes
    for (const mode of ['text', 'multiple-choice']) {
      console.log(`Testing ${mode} mode`)
      
      if (mode === 'multiple-choice') {
        await page.click('text=Mostrar Opções')
        await page.waitForTimeout(1000)
        await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
      } else {
        await page.click('text=Digitar Resposta')
        await page.waitForTimeout(500)
        await page.waitForSelector('input[type="text"]', { timeout: 10000 })
      }
      
      // Store current question
      const currentQuestion = await page.textContent('h2')
      
      // Answer the question
      if (mode === 'text') {
        await page.fill('input[type="text"]', 'sou')
        await page.keyboard.press('Enter') // Submit answer
      } else {
        const firstOption = await page.locator('button[data-testid="multiple-choice-option"]').first()
        await firstOption.click() // Auto-submits
      }
      
      // Wait for feedback
      await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
        page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
      )
      
      // Test both Enter key and button click should work the same way
      const nextButtonSelector = 'text=Próximo exercício →'
      
      // Verify button is present and clickable
      await page.waitForSelector(nextButtonSelector, { timeout: 5000 })
      const buttonVisible = await page.locator(nextButtonSelector).count() > 0
      expect(buttonVisible).toBe(true)
      
      // Test Enter key (should work the same as button click)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2000)
      
      // Verify we moved to next exercise
      const newQuestion = await page.textContent('h2')
      expect(newQuestion).not.toBe(currentQuestion)
      
      console.log(`✅ ${mode} mode: Enter key works consistently with button`)
    }
  })

  test('Enter key should not work when feedback is not shown', async () => {
    console.log('🔍 Testing Enter key should not advance without feedback in multiple choice mode')
    
    // Switch to multiple choice mode
    await page.click('text=Mostrar Opções')
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Store current question
    const currentQuestion = await page.textContent('h2')
    
    // Press Enter without selecting an answer (should not advance)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)
    
    // Verify question hasn't changed
    const stillSameQuestion = await page.textContent('h2')
    expect(stillSameQuestion).toBe(currentQuestion)
    
    // Verify no feedback is shown
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(false)
    
    console.log('✅ Enter key correctly ignored when no feedback is shown')
  })
})