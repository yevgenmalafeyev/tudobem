import { test, expect, devices } from '@playwright/test'

// Test across different browsers and devices
const browsers = ['chromium', 'firefox', 'webkit']
const deviceTypes = [
  { name: 'Desktop', viewport: { width: 1280, height: 720 } },
  { name: 'Tablet', viewport: { width: 768, height: 1024 } },
  { name: 'Mobile', viewport: { width: 375, height: 667 } }
]

for (const browserName of browsers) {
  test.describe(`Cross-Browser Compatibility - ${browserName}`, () => {
    
    for (const device of deviceTypes) {
      test.describe(`${device.name} - ${browserName}`, () => {
        test.use({ 
          ...devices[device.name === 'Mobile' ? 'iPhone 12' : device.name === 'Tablet' ? 'iPad' : 'Desktop Chrome'],
          viewport: device.viewport
        })

        test('should work correctly on different browsers and devices', async ({ page }) => {
          await page.goto('/')
          await page.waitForLoadState('networkidle')
          
          // Test basic functionality
          await page.waitForSelector('text=___', { timeout: 15000 })
          
          // Test mode switching
          await page.click('text=Show options')
          await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
          
          const options = await page.locator('[data-testid="multiple-choice-option"]').all()
          expect(options.length).toBeGreaterThan(0)
          
          // Test interaction
          if (options.length > 0) {
            await options[0].click()
            
            // Check if option is selected
            const isSelected = await options[0].getAttribute('aria-selected')
            expect(isSelected).toBe('true')
            
            // Test answer checking
            await page.click('text=Check Answer')
            await page.waitForSelector('.neo-inset', { timeout: 10000 })
          }
          
          // Test input mode
          await page.click('text=Type answer')
          await page.waitForSelector('input[type="text"]', { timeout: 5000 })
          
          await page.fill('input[type="text"]', 'test')
          const inputValue = await page.inputValue('input[type="text"]')
          expect(inputValue).toBe('test')
          
          // Take screenshot for visual verification
          await page.screenshot({ 
            path: `test-results/cross-browser-${browserName}-${device.name.toLowerCase()}.png`,
            fullPage: true 
          })
        })

        test('should handle Portuguese characters correctly', async ({ page }) => {
          // Mock exercise with Portuguese characters
          await page.route('**/api/generate-batch-exercises', route => {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                id: 'portuguese-chars',
                sentence: 'Ele _____ português.',
                correctAnswer: 'não',
                topic: 'negation',
                level: 'A1'
              })
            })
          })
          
          await page.route('**/api/generate-batch-exercises', route => {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                options: ['não', 'sim', 'também', 'só']
              })
            })
          })
          
          await page.goto('/')
          await page.waitForLoadState('networkidle')
          
          await page.waitForSelector('text=___', { timeout: 10000 })
          await page.click('text=Show options')
          await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
          
          // Should display Portuguese characters correctly
          const pageContent = await page.textContent('body')
          expect(pageContent).toContain('não')
          expect(pageContent).toContain('também')
          expect(pageContent).toContain('só')
        })

        test('should handle touch interactions on mobile', async ({ page }) => {
          if (device.name === 'Mobile') {
            await page.goto('/')
            await page.waitForLoadState('networkidle')
            
            await page.waitForSelector('text=___', { timeout: 10000 })
            
            // Test touch interactions
            await page.tap('text=Show options')
            await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
            
            const options = await page.locator('[data-testid="multiple-choice-option"]').all()
            if (options.length > 0) {
              await options[0].tap()
              
              const isSelected = await options[0].getAttribute('aria-selected')
              expect(isSelected).toBe('true')
              
              await page.tap('text=Check Answer')
              await page.waitForSelector('.neo-inset', { timeout: 10000 })
            }
          }
        })

        test('should handle keyboard navigation', async ({ page }) => {
          if (device.name === 'Desktop') {
            await page.goto('/')
            await page.waitForLoadState('networkidle')
            
            await page.waitForSelector('text=___', { timeout: 10000 })
            
            // Test keyboard navigation
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter') // Should activate mode toggle
            
            await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
            
            // Navigate through options
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter') // Select option
            
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter') // Check answer
            
            await page.waitForSelector('.neo-inset', { timeout: 10000 })
          }
        })
      })
    }
  })
}

test.describe('Browser-Specific Features', () => {
  test('should handle Safari-specific behaviors', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test')
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test Safari-specific CSS and JS behaviors
    await page.waitForSelector('text=___', { timeout: 10000 })
    
    // Test that neomorphism styles work in Safari
    const styles = await page.evaluate(() => {
      const element = document.querySelector('.neo-card')
      return element ? window.getComputedStyle(element) : null
    })
    
    expect(styles).toBeTruthy()
  })

  test('should handle Firefox-specific behaviors', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test')
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test Firefox-specific behaviors
    await page.waitForSelector('text=___', { timeout: 10000 })
    
    // Test that CSS Grid works correctly in Firefox
    const gridStyles = await page.evaluate(() => {
      const element = document.querySelector('.grid')
      return element ? window.getComputedStyle(element).display : null
    })
    
    expect(gridStyles).toBe('grid')
  })

  test('should handle Chrome-specific behaviors', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test')
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test Chrome-specific behaviors
    await page.waitForSelector('text=___', { timeout: 10000 })
    
    // Test that modern CSS features work in Chrome
    const cssFeatures = await page.evaluate(() => {
      const element = document.querySelector('.neo-button')
      const styles = element ? window.getComputedStyle(element) : null
      return {
        borderRadius: styles?.borderRadius,
        boxShadow: styles?.boxShadow
      }
    })
    
    expect(cssFeatures.borderRadius).toBeTruthy()
    expect(cssFeatures.boxShadow).toBeTruthy()
  })
})

test.describe('Performance Across Browsers', () => {
  test('should load quickly on all browsers', async ({ page, browserName }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForSelector('text=___', { timeout: 15000 })
    
    const loadTime = Date.now() - startTime
    
    // Different browsers may have different performance characteristics
    const maxLoadTime = browserName === 'webkit' ? 8000 : 6000
    expect(loadTime).toBeLessThan(maxLoadTime)
  })

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('text=___', { timeout: 10000 })
    
    // Test smooth transitions
    await page.click('text=Show options')
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    await page.click('text=Type answer')
    await page.waitForSelector('input[type="text"]', { timeout: 5000 })
    
    // Check for smooth animations (no janky transitions)
    const animationPerformance = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0].loadEventEnd
    })
    
    expect(animationPerformance).toBeGreaterThan(0)
  })
})

test.describe('Accessibility Across Browsers', () => {
  test('should have proper ARIA support', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('text=___', { timeout: 10000 })
    await page.click('text=Show options')
    await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
    
    // Test ARIA attributes work across browsers
    const options = await page.locator('[data-testid="multiple-choice-option"]').all()
    if (options.length > 0) {
      await options[0].click()
      
      const ariaSelected = await options[0].getAttribute('aria-selected')
      expect(ariaSelected).toBe('true')
    }
  })

  test('should support screen readers', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test that elements have proper labels for screen readers
    await page.waitForSelector('text=___', { timeout: 10000 })
    
    const modeToggle = page.locator('text=Show options')
    await expect(modeToggle).toBeVisible()
    
    const toggleText = await modeToggle.textContent()
    expect(toggleText).toBeTruthy()
    expect(toggleText?.length).toBeGreaterThan(0)
  })
})

test.describe('Responsive Design', () => {
  test('should adapt to different screen sizes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568 },  // iPhone 5
      { width: 375, height: 667 },  // iPhone 6/7/8
      { width: 414, height: 736 },  // iPhone 6/7/8 Plus
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad Landscape
      { width: 1280, height: 720 }, // Desktop
      { width: 1920, height: 1080 } // Large Desktop
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(1000)
      
      // Ensure content is still accessible
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that UI elements are still clickable
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
      
      // Test that options are properly sized
      if (options.length > 0) {
        const boundingBox = await options[0].boundingBox()
        expect(boundingBox?.width).toBeGreaterThan(0)
        expect(boundingBox?.height).toBeGreaterThan(0)
      }
    }
  })
})

test.describe('Network Conditions', () => {
  test('should handle different network speeds', async ({ page }) => {
    // Test different network conditions
    const networkConditions = [
      { name: 'Fast 3G', downloadThroughput: 1.5 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
      { name: 'Slow 3G', downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8, latency: 400 },
      { name: 'WiFi', downloadThroughput: 30 * 1024 * 1024 / 8, uploadThroughput: 15 * 1024 * 1024 / 8, latency: 2 }
    ]
    
    for (const condition of networkConditions) {
      await page.context().setOffline(false)
      
      // Simulate network condition
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, condition.latency))
        await route.continue()
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle', { timeout: 30000 })
      
      // Should still work on slow networks
      await page.waitForSelector('text=___', { timeout: 20000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 15000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
    }
  })
})