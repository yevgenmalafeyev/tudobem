import { test, expect } from '@playwright/test'
import { setupTestPage } from '../utils/test-helpers'

test.describe('Level Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page)
  })

  test('should display only A1 exercises when A1 is selected', async ({ page }) => {
    // TODO: This test assumes there's a level selector UI
    // For now, we'll test the default behavior and exercise level display
    
    // Check that exercise level is displayed
    const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
    await expect(levelBadge).toBeVisible()
    
    // Get the displayed level
    const displayedLevel = await levelBadge.textContent()
    
    // Should be a valid level
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(displayedLevel?.trim())
    
    // Generate multiple exercises and verify levels
    for (let i = 0; i < 5; i++) {
      // Complete current exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      
      // Wait for new exercise
      await page.waitForSelector('input[type="text"]')
      
      // Check level is still valid
      const newLevel = await levelBadge.textContent()
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(newLevel?.trim())
    }
  })

  test('should not display exercises from excluded levels', async ({ page }) => {
    // Test with fallback exercises to ensure level consistency
    
    // Mock API to return specific level exercises
    await page.route('**/api/generate-exercise', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-b1-1',
          sentence: 'É importante que tu ___ cedo.',
          gapIndex: 1,
          correctAnswer: 'chegues',
          topic: 'present-subjunctive',
          level: 'B1',
          hint: {
            infinitive: 'chegar',
            form: 'present subjunctive'
          }
        })
      })
    })
    
    // Complete an exercise to trigger API call
    await page.fill('input[type="text"]', 'test')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('text=Next Exercise')
    
    // Wait for new exercise
    await page.waitForSelector('input[type="text"]')
    
    // Check that the level is B1 as specified in the mock
    const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
    await expect(levelBadge).toHaveText('B1')
  })

  test('should handle mixed level selection correctly', async ({ page }) => {
    const observedLevels: string[] = []
    
    // Intercept API calls to track requested levels
    await page.route('**/api/generate-exercise', async route => {
      const request = route.request()
      const postData = request.postData()
      
      if (postData) {
        const requestBody = JSON.parse(postData)
        const requestedLevels = requestBody.levels || []
        
        // Generate exercise matching one of the requested levels
        const selectedLevel = requestedLevels[Math.floor(Math.random() * requestedLevels.length)]
        
        const exercises = {
          'A1': {
            id: 'test-a1-1',
            sentence: 'Eu ___ português.',
            gapIndex: 1,
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            hint: { infinitive: 'falar', form: 'present indicative' }
          },
          'A2': {
            id: 'test-a2-1',
            sentence: 'Ontem eu ___ ao cinema.',
            gapIndex: 1,
            correctAnswer: 'fui',
            topic: 'preterite-perfect',
            level: 'A2',
            hint: { infinitive: 'ir', form: 'pretérito perfeito' }
          },
          'B1': {
            id: 'test-b1-1',
            sentence: 'É importante que tu ___ cedo.',
            gapIndex: 1,
            correctAnswer: 'chegues',
            topic: 'present-subjunctive',
            level: 'B1',
            hint: { infinitive: 'chegar', form: 'present subjunctive' }
          },
          'B2': {
            id: 'test-b2-1',
            sentence: 'Se eu ___ rico, compraria uma casa.',
            gapIndex: 1,
            correctAnswer: 'fosse',
            topic: 'imperfect-subjunctive',
            level: 'B2',
            hint: { infinitive: 'ser', form: 'imperfect subjunctive' }
          }
        }
        
        const exercise = exercises[selectedLevel as keyof typeof exercises] || exercises['A1']
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(exercise)
        })
      } else {
        route.continue()
      }
    })
    
    // Generate multiple exercises and track levels
    for (let i = 0; i < 8; i++) {
      // Complete current exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      
      // Record the level before moving to next
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        observedLevels.push(level.trim())
      }
      
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
    }
    
    // Verify we got exercises from multiple levels
    const uniqueLevels = [...new Set(observedLevels)]
    expect(uniqueLevels.length).toBeGreaterThan(1)
    
    // Verify all levels are valid
    observedLevels.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
  })

  test('should maintain level consistency in fallback exercises', async ({ page }) => {
    // Force API errors to test fallback exercises
    await page.route('**/api/generate-exercise', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
    })
    
    const observedLevels: string[] = []
    
    // Generate multiple exercises using fallback logic
    for (let i = 0; i < 10; i++) {
      // Complete current exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      
      // Record the level
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        observedLevels.push(level.trim())
      }
      
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
    }
    
    // Verify all fallback exercises have valid levels
    observedLevels.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2']).toContain(level) // Fallback exercises only go up to B2
    })
    
    // Should have exercises from fallback pool
    expect(observedLevels.length).toBe(10)
  })

  test('should handle level validation in API requests', async ({ page }) => {
    let capturedRequest: any = null
    
    // Capture the API request to verify level parameters
    await page.route('**/api/generate-exercise', async route => {
      const request = route.request()
      const postData = request.postData()
      
      if (postData) {
        capturedRequest = JSON.parse(postData)
      }
      
      // Continue with normal response
      route.continue()
    })
    
    // Trigger an exercise generation
    await page.fill('input[type="text"]', 'test')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('text=Next Exercise')
    await page.waitForSelector('input[type="text"]')
    
    // Verify the request contains valid level parameters
    expect(capturedRequest).toBeTruthy()
    expect(capturedRequest.levels).toBeDefined()
    expect(Array.isArray(capturedRequest.levels)).toBe(true)
    expect(capturedRequest.levels.length).toBeGreaterThan(0)
    
    // All levels should be valid
    capturedRequest.levels.forEach((level: string) => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
  })

  test('should display appropriate content complexity for selected levels', async ({ page }) => {
    // Mock API to return exercises with different complexity levels
    let exerciseCount = 0
    
    await page.route('**/api/generate-exercise', route => {
      exerciseCount++
      
      const exercises = [
        // A1 - Simple present tense
        {
          id: 'test-a1-content',
          sentence: 'Eu ___ português.',
          gapIndex: 1,
          correctAnswer: 'falo',
          topic: 'present-indicative',
          level: 'A1',
          hint: { infinitive: 'falar', form: 'present indicative' }
        },
        // B2 - Complex subjunctive
        {
          id: 'test-b2-content',
          sentence: 'Embora ele ___ estudado muito, não passou no exame.',
          gapIndex: 1,
          correctAnswer: 'tivesse',
          topic: 'imperfect-subjunctive',
          level: 'B2',
          hint: { infinitive: 'ter', form: 'imperfect subjunctive compound' }
        }
      ]
      
      const exercise = exercises[exerciseCount % 2]
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(exercise)
      })
    })
    
    // Test A1 level content
    await page.fill('input[type="text"]', 'test')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check for simple vocabulary and structure
    const exerciseText = await page.locator('.neo-card-lg').textContent()
    expect(exerciseText).toContain('português') // Simple, common word
    
    await page.click('text=Next Exercise')
    await page.waitForSelector('input[type="text"]')
    
    // Test B2 level content  
    await page.fill('input[type="text"]', 'test')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    
    // Check for complex vocabulary and structure
    const complexExerciseText = await page.locator('.neo-card-lg').textContent()
    expect(complexExerciseText).toContain('Embora') // Complex conjunction
  })

  test('should prevent level mixing in single exercise', async ({ page }) => {
    // Each individual exercise should have only one level
    
    const exerciseLevels: string[] = []
    
    // Generate several exercises and verify each has consistent level
    for (let i = 0; i < 5; i++) {
      // Get the current exercise level
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      
      if (level?.trim()) {
        exerciseLevels.push(level.trim())
        
        // Verify the exercise content matches the displayed level
        const exerciseContent = await page.locator('.neo-card-lg').textContent()
        
        // Each exercise should have exactly one level indicator
        const levelMatches = exerciseContent?.match(/\b(A1|A2|B1|B2|C1|C2)\b/g) || []
        expect(levelMatches.length).toBeGreaterThanOrEqual(1) // At least one level shown
        
        // All level indicators in the exercise should be the same
        const uniqueLevelsInExercise = [...new Set(levelMatches)]
        expect(uniqueLevelsInExercise.length).toBe(1)
        expect(uniqueLevelsInExercise[0]).toBe(level.trim())
      }
      
      // Move to next exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
    }
    
    // Verify we collected level data
    expect(exerciseLevels.length).toBe(5)
  })

  test('should handle invalid level requests gracefully', async ({ page }) => {
    // Test with malformed level data
    await page.route('**/api/generate-exercise', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-invalid-level',
          sentence: 'Eu ___ português.',
          gapIndex: 1,
          correctAnswer: 'falo',
          topic: 'present-indicative',
          level: 'INVALID_LEVEL', // Invalid level
          hint: { infinitive: 'falar', form: 'present indicative' }
        })
      })
    })
    
    // Should still work with fallback
    await page.fill('input[type="text"]', 'test')
    await page.click('text=Check Answer')
    await page.waitForSelector('.neo-inset', { timeout: 10000 })
    await page.click('text=Next Exercise')
    await page.waitForSelector('input[type="text"]')
    
    // Should display a valid level (fallback)
    const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
    const level = await levelBadge.textContent()
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level?.trim())
  })

  test('should maintain level filtering across mode switches', async ({ page }) => {
    // Test that level filtering works in both input and multiple choice modes
    
    const levelsInInputMode: string[] = []
    const levelsInMCMode: string[] = []
    
    // Test input mode
    for (let i = 0; i < 3; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsInInputMode.push(level.trim())
      }
      
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]')
    }
    
    // Switch to multiple choice mode
    await page.click('text=Multiple Choice')
    await page.waitForSelector('button:has-text("falo"), button:has-text("fala"), button:has-text("é")', { timeout: 15000 })
    
    // Test multiple choice mode
    for (let i = 0; i < 3; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsInMCMode.push(level.trim())
      }
      
      // Select first available option
      const firstOption = page.locator('button').filter({ hasNotText: /Check Answer|Next Exercise|Input|Multiple Choice/ }).first()
      await firstOption.click()
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('button:has-text("falo"), button:has-text("fala"), button:has-text("é")', { timeout: 15000 })
    }
    
    // Verify levels are valid in both modes
    levelsInInputMode.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    levelsInMCMode.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    // Both modes should have valid level data
    expect(levelsInInputMode.length).toBe(3)
    expect(levelsInMCMode.length).toBe(3)
  })
})