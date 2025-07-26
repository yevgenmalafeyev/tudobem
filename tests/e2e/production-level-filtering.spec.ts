import { test, expect } from '@playwright/test'
import { setupTestPage , validateESLintInTest } from '../utils/test-helpers'

/**
 * Production tests for level filtering against the deployed Vercel app
 * These tests verify that level filtering works correctly in the real environment
 */

test.describe('Production Level Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page)
  })

  test('should display consistent levels in production environment', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should display consistent levels in production environment');


  
    const observedLevels: string[] = []
    
    // Generate multiple exercises and track levels
    for (let i = 0; i < 8; i++) {
      // Get the current exercise level
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      await expect(levelBadge).toBeVisible()
      
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        observedLevels.push(level.trim())
      }
      
      // Complete exercise and move to next
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // Verify all levels are valid CEFR levels
    observedLevels.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    // Should have collected level data for all exercises
    expect(observedLevels.length).toBe(8)
    
    // Log levels for debugging (will appear in test output)
    console.log('Observed levels in production:', observedLevels)
  })

  test('should maintain level consistency across API calls', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should maintain level consistency across API calls');


  
    let apiCallCount = 0
    const apiResponses: unknown[] = []
    
    // Monitor API calls to verify level consistency
    page.on('response', async response => {
      if (response.url().includes('/api/generate-exercise')) {
        apiCallCount++
        try {
          const responseData = await response.json()
          apiResponses.push(responseData)
        } catch {
          // Handle cases where response isn't JSON
          console.log('Non-JSON response from API')
        }
      }
    })
    
    // Generate several exercises to trigger API calls
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
      
      // Small delay to ensure API call completes
      await page.waitForTimeout(1000)
    }
    
    // Verify API responses have valid levels
    apiResponses.forEach(response => {
      if (response.level) {
        expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(response.level)
      }
    })
    
    console.log(`API calls made: ${apiCallCount}, Valid responses: ${apiResponses.length}`)
  })

  test('should handle level filtering with real network conditions', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle level filtering with real network conditions');


  
    // Test with actual network delays and potential failures
    const exerciseData: Array<{level: string, contentComplexity: number}> = []
    
    // Generate exercises and analyze content complexity
    for (let i = 0; i < 6; i++) {
      // Get exercise content
      const exerciseContent = await page.locator('.neo-card-lg').textContent()
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      
      if (level?.trim() && exerciseContent) {
        // Simple heuristic for content complexity
        const complexity = exerciseContent.length + 
          (exerciseContent.match(/[^\s]/g) || []).length +
          (exerciseContent.match(/[àáâãäèéêëìíîïòóôõöùúûü]/g) || []).length * 2
        
        exerciseData.push({
          level: level.trim(),
          contentComplexity: complexity
        })
      }
      
      // Move to next exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // Verify we collected data
    expect(exerciseData.length).toBeGreaterThan(0)
    
    // Group by level and check complexity progression
    const levelGroups = exerciseData.reduce((groups, item) => {
      if (!groups[item.level]) groups[item.level] = []
      groups[item.level].push(item.contentComplexity)
      return groups
    }, {} as Record<string, number[]>)
    
    // If we have multiple levels, verify complexity progression
    const levels = Object.keys(levelGroups).sort()
    if (levels.length > 1) {
      const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      const sortedLevels = levels.sort((a, b) => 
        levelOrder.indexOf(a) - levelOrder.indexOf(b)
      )
      
      // Higher levels should generally have higher complexity
      for (let i = 1; i < sortedLevels.length; i++) {
        const prevLevel = sortedLevels[i - 1]
        const currentLevel = sortedLevels[i]
        
        const prevAvg = levelGroups[prevLevel].reduce((a, b) => a + b, 0) / levelGroups[prevLevel].length
        const currentAvg = levelGroups[currentLevel].reduce((a, b) => a + b, 0) / levelGroups[currentLevel].length
        
        // Allow some tolerance for natural variation
        expect(currentAvg).toBeGreaterThanOrEqual(prevAvg * 0.8)
      }
    }
    
    console.log('Level complexity analysis:', levelGroups)
  })

  test('should handle production API errors gracefully', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should handle production API errors gracefully');


  
    const levelsBefore: string[] = []
    const levelsAfter: string[] = []
    
    // Collect some normal levels first
    for (let i = 0; i < 3; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsBefore.push(level.trim())
      }
      
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // Simulate some API errors
    await page.route('**/api/generate-exercise', route => {
      // Let some requests through, fail others
      if (Math.random() > 0.5) {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
      } else {
        route.continue()
      }
    })
    
    // Generate more exercises with potential API failures
    for (let i = 0; i < 4; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsAfter.push(level.trim())
      }
      
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // All levels should still be valid (using fallback exercises)
    [...levelsBefore, ...levelsAfter].forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    console.log('Levels before API errors:', levelsBefore)
    console.log('Levels after API errors:', levelsAfter)
  })

  test('should maintain level filtering across browser refreshes', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should maintain level filtering across browser refreshes');


  
    const levelsBeforeRefresh: string[] = []
    const levelsAfterRefresh: string[] = []
    
    // Collect levels before refresh
    for (let i = 0; i < 3; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsBeforeRefresh.push(level.trim())
      }
      
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // Refresh the page
    await page.reload()
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 })
    
    // Collect levels after refresh
    for (let i = 0; i < 3; i++) {
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      const level = await levelBadge.textContent()
      if (level?.trim()) {
        levelsAfterRefresh.push(level.trim())
      }
      
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // All levels should be valid before and after refresh
    [...levelsBeforeRefresh, ...levelsAfterRefresh].forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    // Should have collected the expected amount of data
    expect(levelsBeforeRefresh.length).toBe(3)
    expect(levelsAfterRefresh.length).toBe(3)
    
    console.log('Levels before refresh:', levelsBeforeRefresh)
    console.log('Levels after refresh:', levelsAfterRefresh)
  })

  test('should handle concurrent exercise generations with consistent levels', async ({ page, context }) => {
    // Create multiple tabs to test concurrent access
    const page2 = await context.newPage()
    const page3 = await context.newPage()
    
    // Navigate all pages
    await Promise.all([
      page.goto('/'),
      page2.goto('/'),
      page3.goto('/')
    ])
    
    // Wait for all pages to load
    await Promise.all([
      page.waitForSelector('.neo-card-lg', { timeout: 30000 }),
      page2.waitForSelector('.neo-card-lg', { timeout: 30000 }),
      page3.waitForSelector('.neo-card-lg', { timeout: 30000 })
    ])
    
    const allLevels: string[] = []
    
    // Generate exercises concurrently on all pages
    for (let i = 0; i < 3; i++) {
      // Start exercises on all pages simultaneously
      const promises = [page, page2, page3].map(async (p) => {
        const levelBadge = p.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
        const level = await levelBadge.textContent()
        
        await p.fill('input[type="text"]', 'test')
        await p.click('text=Check Answer')
        await p.waitForSelector('.neo-inset', { timeout: 15000 })
        await p.click('text=Next Exercise')
        await p.waitForSelector('input[type="text"]', { timeout: 15000 })
        
        return level?.trim()
      })
      
      const levels = await Promise.all(promises)
      allLevels.push(...levels.filter(Boolean) as string[])
    }
    
    // All levels should be valid
    allLevels.forEach(level => {
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(level)
    })
    
    // Should have collected data from all pages
    expect(allLevels.length).toBe(9) // 3 pages × 3 exercises
    
    // Clean up
    await page2.close()
    await page3.close()
    
    console.log('Concurrent levels:', allLevels)
  })

  test('should validate level filtering performance in production', async ({ page }) => {


  test.setTimeout(25000); // Timeout for ESLint validation


  // Run ESLint validation first


  await validateESLintInTest('should validate level filtering performance in production');


  
    const performanceData: Array<{
      exerciseNumber: number
      levelDisplayTime: number
      contentLoadTime: number
      level: string
    }> = []
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now()
      
      // Wait for level to be displayed
      const levelBadge = page.locator('[data-testid="exercise-level"], .neo-outset-sm').first()
      await expect(levelBadge).toBeVisible()
      const levelDisplayTime = Date.now() - startTime
      
      // Get the level
      const level = await levelBadge.textContent()
      
      // Wait for full content to load
      await expect(page.locator('input[type="text"]')).toBeVisible()
      const contentLoadTime = Date.now() - startTime
      
      if (level?.trim()) {
        performanceData.push({
          exerciseNumber: i + 1,
          levelDisplayTime,
          contentLoadTime,
          level: level.trim()
        })
      }
      
      // Move to next exercise
      await page.fill('input[type="text"]', 'test')
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 15000 })
      await page.click('text=Next Exercise')
      await page.waitForSelector('input[type="text"]', { timeout: 15000 })
    }
    
    // Verify performance metrics
    performanceData.forEach(data => {
      expect(data.levelDisplayTime).toBeLessThan(5000) // Level should display quickly
      expect(data.contentLoadTime).toBeLessThan(10000) // Content should load reasonably fast
      expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(data.level)
    })
    
    // Calculate averages
    const avgLevelDisplayTime = performanceData.reduce((sum, d) => sum + d.levelDisplayTime, 0) / performanceData.length
    const avgContentLoadTime = performanceData.reduce((sum, d) => sum + d.contentLoadTime, 0) / performanceData.length
    
    console.log('Performance metrics:')
    console.log(`Average level display time: ${avgLevelDisplayTime}ms`)
    console.log(`Average content load time: ${avgContentLoadTime}ms`)
    console.log('Performance data:', performanceData)
    
    // Performance should be reasonable
    expect(avgLevelDisplayTime).toBeLessThan(3000)
    expect(avgContentLoadTime).toBeLessThan(8000)
  })
})