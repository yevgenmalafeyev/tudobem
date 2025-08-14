import { test, expect, Page } from '@playwright/test'

test.describe('Irregular Verbs Feedback Timing Issue', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate to the application
    await page.goto('/?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Navigate to irregular verbs section
    await page.click('text=Verbos Irregulares')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('should keep feedback visible for sufficient time in multiple choice mode', async () => {
    console.log('🔍 Testing feedback timing in multiple choice mode')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('text=Mostrar Opções')
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Click first option to trigger feedback
    const firstOption = await page.locator('button[data-testid="multiple-choice-option"]').first()
    await firstOption.click()
    
    // Immediately check that feedback appears
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    console.log('✅ Feedback appeared')
    
    // Verify feedback is visible
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Check that "Próximo exercício →" button is visible
    const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0
    expect(nextButtonVisible).toBe(true)
    
    console.log('✅ Next button is visible')
    
    // Wait 2 seconds to simulate user reading time
    await page.waitForTimeout(2000)
    
    // Verify feedback is still visible after 2 seconds
    const feedbackStillVisible = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackStillVisible).toBe(true)
    
    console.log('✅ Feedback still visible after 2 seconds')
    
    // Wait another 3 seconds to check for auto-progression
    await page.waitForTimeout(3000)
    
    // Verify feedback is still visible and we haven't auto-progressed
    const feedbackStillVisibleAfter5s = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackStillVisibleAfter5s).toBe(true)
    
    // Verify next button is still there (not auto-progressed)
    const nextButtonStillVisible = await page.locator('text=Próximo exercício →').count() > 0
    expect(nextButtonStillVisible).toBe(true)
    
    console.log('✅ Feedback and next button still visible after 5 seconds - no auto-progression detected')
  })

  test('should not auto-progress to next exercise without user interaction', async () => {
    console.log('🔍 Testing for auto-progression bug')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
    const initialQuestionText = await page.textContent('h2')
    
    // Switch to multiple choice mode
    await page.click('text=Mostrar Opções')
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Click first option to trigger feedback
    const firstOption = await page.locator('button[data-testid="multiple-choice-option"]').first()
    await firstOption.click()
    
    // Wait for feedback
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    // Wait 10 seconds to see if it auto-progresses
    await page.waitForTimeout(10000)
    
    // Check if we're still on the same exercise (question hasn't changed)
    const currentQuestionText = await page.textContent('h2')
    
    // The question should be the same if no auto-progression occurred
    expect(currentQuestionText).toBe(initialQuestionText)
    
    // Feedback should still be visible
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Next button should still be visible
    const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0
    expect(nextButtonVisible).toBe(true)
    
    console.log('✅ No auto-progression detected - user must manually proceed')
  })

  test('should detect rapid feedback dismissal bug', async () => {
    console.log('🔍 Testing for rapid feedback dismissal')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
    
    // Switch to multiple choice mode
    await page.click('text=Mostrar Opções')
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Record timestamp before clicking
    const clickTime = Date.now()
    
    // Click first option to trigger feedback
    const firstOption = await page.locator('button[data-testid="multiple-choice-option"]').first()
    await firstOption.click()
    
    // Wait for feedback to appear
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    const feedbackAppearTime = Date.now()
    console.log(`📊 Feedback appeared after: ${feedbackAppearTime - clickTime}ms`)
    
    // Check that feedback stays visible for at least 100ms
    await page.waitForTimeout(100)
    
    let feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Check at 500ms intervals up to 3 seconds
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(500)
      feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || await page.locator('text=❌ Incorreto').count() > 0
      const timeElapsed = i * 500
      
      console.log(`📊 Feedback visible at ${timeElapsed}ms: ${feedbackVisible}`)
      
      // If feedback disappears before 3 seconds without user interaction, it's a bug
      if (!feedbackVisible && timeElapsed < 3000) {
        const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0
        if (!nextButtonVisible) {
          throw new Error(`BUG DETECTED: Feedback disappeared after ${timeElapsed}ms without user interaction`)
        }
      }
      
      expect(feedbackVisible).toBe(true)
    }
    
    console.log('✅ Feedback remained stable for 3+ seconds')
  })
})