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

  test('should handle feedback timing correctly based on answer correctness', async () => {
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
    
    // Wait for feedback to appear - work with both Portuguese and English
    await page.waitForSelector('text=✅ Correto!', { timeout: 2000 }).catch(() => 
      page.waitForSelector('text=❌ Incorreto', { timeout: 2000 })
    ).catch(() => 
      page.waitForSelector('text=✅ Correct!', { timeout: 2000 })
    ).catch(() => 
      page.waitForSelector('text=❌ Incorrect', { timeout: 2000 })
    )
    
    console.log('✅ Feedback appeared')
    
    // Determine if the answer was correct or incorrect
    const correctFeedback = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=✅ Correct!').count() > 0
    const incorrectFeedback = await page.locator('text=❌ Incorreto').count() > 0 || 
                             await page.locator('text=❌ Incorrect').count() > 0
    
    expect(correctFeedback || incorrectFeedback).toBe(true)
    
    if (correctFeedback) {
      console.log('✅ Answer was correct - testing auto-advance behavior')
      
      // For correct answers, should show next button AND auto-advance message
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                               await page.locator('text=Next Exercise').count() > 0 ||
                               await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      const autoAdvanceMessage = await page.locator('text=Auto-avanço em').count() > 0 ||
                                 await page.locator('text=Auto-advance in').count() > 0
      
      // Auto-advance should occur after ~2 seconds
      await page.waitForTimeout(2500) // Wait a bit longer than 2 seconds
      
      // After auto-advance, feedback should be gone and new exercise should load
      const feedbackGone = await page.locator('text=✅ Correto!').count() === 0 && 
                          await page.locator('text=✅ Correct!').count() === 0
      
      expect(feedbackGone).toBe(true)
      console.log('✅ Correct answer: auto-advance occurred as expected')
      
    } else if (incorrectFeedback) {
      console.log('❌ Answer was incorrect - testing manual progression behavior')
      
      // For incorrect answers, should show next button
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                               await page.locator('text=Next Exercise').count() > 0 ||
                               await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      // Wait 5 seconds to verify no auto-advance occurs
      await page.waitForTimeout(5000)
      
      // Feedback should still be visible
      const feedbackStillVisible = await page.locator('text=❌ Incorreto').count() > 0 || 
                                   await page.locator('text=❌ Incorrect').count() > 0
      expect(feedbackStillVisible).toBe(true)
      
      // Next button should still be visible
      const nextButtonStillVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                                    await page.locator('text=Next Exercise').count() > 0 ||
                                    await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonStillVisible).toBe(true)
      
      console.log('✅ Incorrect answer: no auto-advance, manual progression required as expected')
    }
  })

  test('should validate correct auto-progression behavior for different answer types', async () => {
    console.log('🔍 Testing auto-progression behavior validation')
    
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
    
    // Click the last option to trigger feedback
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
    
    // Check if answer was correct or incorrect
    const correctFeedback = await page.locator('text=✅ Correto!').count() > 0 || 
                           await page.locator('text=✅ Correct!').count() > 0
    const incorrectFeedback = await page.locator('text=❌ Incorreto').count() > 0 || 
                             await page.locator('text=❌ Incorrect').count() > 0
    
    expect(correctFeedback || incorrectFeedback).toBe(true)
    
    if (correctFeedback) {
      console.log('✅ Answer was correct - checking for expected auto-progression behavior')
      
      // Next button should be visible for correct answers too now
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                                await page.locator('text=Next Exercise').count() > 0 ||
                                await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      // Record initial state
      const initialExerciseText = await page.locator('h2').textContent()
      
      // Wait for auto-progression (should happen around 2 seconds)
      await page.waitForTimeout(3000)
      
      // After auto-progression, should have new exercise
      const newExerciseText = await page.locator('h2').textContent()
      const exerciseChanged = initialExerciseText !== newExerciseText
      
      // Either exercise changed (auto-progressed) OR feedback is gone
      const feedbackGone = await page.locator('text=✅ Correto!').count() === 0 && 
                          await page.locator('text=✅ Correct!').count() === 0
      
      expect(exerciseChanged || feedbackGone).toBe(true)
      console.log('✅ Correct answer: auto-progression occurred as expected')
      
    } else if (incorrectFeedback) {
      console.log('❌ Answer was incorrect - verifying no auto-progression')
      
      // Record initial state
      const initialExerciseText = await page.locator('h2').textContent()
      
      // Wait longer to verify no auto-progression
      await page.waitForTimeout(10000)
      
      // Exercise should be the same (no auto-progression)
      const currentExerciseText = await page.locator('h2').textContent()
      const exerciseUnchanged = initialExerciseText === currentExerciseText
      expect(exerciseUnchanged).toBe(true)
      
      // Feedback should still be visible
      const feedbackStillVisible = await page.locator('text=❌ Incorreto').count() > 0 || 
                                   await page.locator('text=❌ Incorrect').count() > 0
      expect(feedbackStillVisible).toBe(true)
      
      // Next button should be available - work with both Portuguese and English
      const nextButtonVisible = await page.locator('text=Próximo exercício →').count() > 0 || 
                                await page.locator('text=Next Exercise').count() > 0 ||
                                await page.locator('text=Próximo Exercício').count() > 0
      expect(nextButtonVisible).toBe(true)
      
      console.log('✅ Incorrect answer: no auto-progression, user must manually proceed')
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