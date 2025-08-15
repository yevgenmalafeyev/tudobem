import { test, expect, Page } from '@playwright/test'

test.describe('Irregular Verbs Feedback Timing Issue', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate to the application
    await page.goto('/?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Navigate to irregular verbs section - work with both Portuguese and English
    try {
      await page.click('text=Verbos Irregulares')
    } catch {
      await page.click('text=Irregular Verbs')
    }
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('should keep feedback visible for sufficient time in multiple choice mode', async () => {
    console.log('🔍 Testing feedback timing in multiple choice mode')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
    
    // Switch to multiple choice mode - work with both Portuguese and English
    try {
      await page.click('text=Mostrar Opções')
    } catch {
      await page.click('text=Show Options')
    }
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
    
    // Verify feedback is visible - work with both Portuguese and English
    const feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                            await page.locator('text=❌ Incorreto').count() > 0 ||
                            await page.locator('text=✅ Correct!').count() > 0 || 
                            await page.locator('text=❌ Incorrect').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Check that next button is visible - work with both Portuguese and English
    const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                              await page.locator('text=Next Exercise').count() > 0 ||
                              await page.locator('text=Próximo Exercício').count() > 0
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
    
    // Switch to multiple choice mode - work with both Portuguese and English
    try {
      await page.click('text=Mostrar Opções')
    } catch {
      await page.click('text=Show Options')
    }
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Click the last option to maximize chance of wrong answer (to avoid auto-progression)
    const options = await page.locator('button[data-testid="multiple-choice-option"]').all()
    const lastOption = options[options.length - 1]
    await lastOption.click()
    
    // Wait for feedback to appear
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    )
    
    // Check if answer was correct or incorrect
    const correctFeedback = await page.locator('text=✅ Correto!').count() > 0
    const incorrectFeedback = await page.locator('text=❌ Incorreto').count() > 0
    
    if (correctFeedback) {
      console.log('✅ Answer was correct - checking for expected auto-progression behavior')
      // For correct answers, wait a bit and then verify next button is available
      await page.waitForTimeout(3000)
      
      // Should still have feedback visible and next button available for user interaction
      const feedbackStillVisible = await page.locator('text=✅ Correto!').count() > 0
      expect(feedbackStillVisible).toBe(true)
      
      // Next button should be available - work with both Portuguese and English
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                                await page.locator('text=Next Exercise').count() > 0 ||
                                await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      console.log('✅ Correct answer: feedback and next button remain available for user interaction')
    } else if (incorrectFeedback) {
      console.log('❌ Answer was incorrect - verifying no auto-progression')
      // For incorrect answers, wait 10 seconds and verify no auto-progression
      await page.waitForTimeout(10000)
      
      // Feedback should still be visible
      const feedbackStillVisible = await page.locator('text=❌ Incorreto').count() > 0
      expect(feedbackStillVisible).toBe(true)
      
      // Next button should be available - work with both Portuguese and English
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                                await page.locator('text=Next Exercise').count() > 0 ||
                                await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      console.log('✅ Incorrect answer: no auto-progression, user must manually proceed')
    } else {
      throw new Error('No feedback detected - test cannot proceed')
    }
  })

  test('should detect rapid feedback dismissal bug', async () => {
    console.log('🔍 Testing for rapid feedback dismissal')
    
    // Wait for exercise to load
    await page.waitForSelector('h2', { timeout: 10000 })
    
    // Switch to multiple choice mode - work with both Portuguese and English
    try {
      await page.click('text=Mostrar Opções')
    } catch {
      await page.click('text=Show Options')
    }
    await page.waitForTimeout(1000)
    
    // Wait for multiple choice options
    await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Record timestamp before clicking
    const clickTime = Date.now()
    
    // Click last option to maximize chance of wrong answer
    const options = await page.locator('button[data-testid="multiple-choice-option"]').all()
    const lastOption = options[options.length - 1]
    await lastOption.click()
    
    // Wait for feedback to appear - work with both Portuguese and English
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    ).catch(() => 
      page.waitForSelector('text=✅ Correct!', { timeout: 2000 })
    ).catch(() => 
      page.waitForSelector('text=❌ Incorrect', { timeout: 2000 })
    )
    
    const feedbackAppearTime = Date.now()
    console.log(`📊 Feedback appeared after: ${feedbackAppearTime - clickTime}ms`)
    
    // Check what type of feedback we got
    const correctFeedback = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=✅ Correct!').count() > 0
    
    // Check that feedback stays visible for at least 100ms
    await page.waitForTimeout(100)
    
    let feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                         await page.locator('text=❌ Incorreto').count() > 0 ||
                         await page.locator('text=✅ Correct!').count() > 0 || 
                         await page.locator('text=❌ Incorrect').count() > 0
    expect(feedbackVisible).toBe(true)
    
    // Check at 500ms intervals up to 3 seconds
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(500)
      feedbackVisible = await page.locator('text=✅ Correto!').count() > 0 || 
                       await page.locator('text=❌ Incorreto').count() > 0 ||
                       await page.locator('text=✅ Correct!').count() > 0 || 
                       await page.locator('text=❌ Incorrect').count() > 0
      const timeElapsed = i * 500
      
      console.log(`📊 Feedback visible at ${timeElapsed}ms: ${feedbackVisible}`)
      
      // For incorrect answers, feedback should stay visible
      // For correct answers, the app may auto-advance, which is expected behavior
      if (!correctFeedback) {
        // If feedback disappears before 3 seconds without user interaction for incorrect answers, it's a bug
        if (!feedbackVisible && timeElapsed < 3000) {
          const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 ||
                                   await page.locator('text=Next Exercise').count() > 0 ||
                                   await page.locator('text=Próximo Exercício').count() > 0
          if (!nextButtonVisible) {
            throw new Error(`BUG DETECTED: Feedback disappeared after ${timeElapsed}ms without user interaction`)
          }
        }
        expect(feedbackVisible).toBe(true)
      } else {
        // For correct answers, feedback may disappear as part of normal auto-progression
        console.log(`✅ Correct answer - feedback visibility at ${timeElapsed}ms: ${feedbackVisible}`)
        if (!feedbackVisible && timeElapsed >= 2000) {
          console.log('✅ Auto-progression occurred for correct answer - this is expected behavior')
          break
        }
      }
    }
    
    if (!correctFeedback) {
      console.log('✅ Feedback remained stable for incorrect answer')
    } else {
      console.log('✅ Correct answer handling verified')
    }
  })
})