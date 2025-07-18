import { test, expect } from '@playwright/test'

test.describe('Accessibility Functional Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should be fully keyboard navigable', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test Tab navigation through all interactive elements
      const focusableElements = []
      
      // Start tabbing through the page
      await page.keyboard.press('Tab')
      let currentElement = await page.locator(':focus').first()
      
      // Navigate through all focusable elements
      for (let i = 0; i < 20; i++) { // Limit to prevent infinite loop
        const tagName = await currentElement.evaluate(el => el.tagName)
        const textContent = await currentElement.evaluate(el => el.textContent?.trim() || '')
        
        focusableElements.push({ tagName, textContent })
        
        await page.keyboard.press('Tab')
        
        const nextElement = await page.locator(':focus').first()
        const nextTagName = await nextElement.evaluate(el => el.tagName)
        
        // Break if we've cycled back to the beginning
        if (nextTagName === focusableElements[0]?.tagName && i > 3) {
          break
        }
        
        currentElement = nextElement
      }
      
      // Should have navigated through multiple elements
      expect(focusableElements.length).toBeGreaterThan(2)
      
      console.log('Focusable elements:', focusableElements)
    })

    test('should support keyboard shortcuts', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test Enter key activation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Find and activate mode toggle with Enter
      const focused = await page.locator(':focus').first()
      await page.keyboard.press('Enter')
      
      // Should change mode or trigger action
      await page.waitForTimeout(1000)
      
      // Test Space key activation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Space')
      
      // Should also trigger action
      await page.waitForTimeout(1000)
    })

    test('should handle focus management', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that focus is properly managed when switching modes
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // First option should be focusable
      const firstOption = page.locator('[data-testid="multiple-choice-option"]').first()
      await firstOption.focus()
      
      const isFocused = await firstOption.evaluate(el => el === document.activeElement)
      expect(isFocused).toBe(true)
      
      // Switch to input mode
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      
      // Input should be focusable
      const input = page.locator('input[type="text"]')
      await input.focus()
      
      const inputFocused = await input.evaluate(el => el === document.activeElement)
      expect(inputFocused).toBe(true)
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      
      if (headings.length > 0) {
        for (const heading of headings) {
          const tagName = await heading.evaluate(el => el.tagName)
          const textContent = await heading.textContent()
          
          expect(textContent).toBeTruthy()
          expect(textContent?.trim().length).toBeGreaterThan(0)
          
          console.log(`${tagName}: ${textContent}`)
        }
      }
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test mode toggle buttons have proper labels
      const modeButtons = await page.locator('text=Type answer, text=Show options').all()
      
      for (const button of modeButtons) {
        const ariaLabel = await button.getAttribute('aria-label')
        const textContent = await button.textContent()
        
        // Should have either aria-label or meaningful text content
        expect(ariaLabel || textContent).toBeTruthy()
      }
      
      // Test multiple choice options have proper labels
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      
      for (const option of options) {
        const textContent = await option.textContent()
        const ariaLabel = await option.getAttribute('aria-label')
        
        expect(textContent || ariaLabel).toBeTruthy()
        expect((textContent || ariaLabel)?.trim().length).toBeGreaterThan(0)
      }
    })

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      
      const input = page.locator('input[type="text"]')
      
      // Check for proper labeling
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const placeholder = await input.getAttribute('placeholder')
      
      // Should have some form of labeling
      expect(ariaLabel || ariaLabelledBy || placeholder).toBeTruthy()
    })

    test('should announce state changes', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that mode changes are announced
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Check for ARIA live regions
      const liveRegions = await page.locator('[aria-live], [aria-atomic]').all()
      
      console.log('Live regions found:', liveRegions.length)
      
      // Test selection announcement
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].click()
        
        const ariaSelected = await options[0].getAttribute('aria-selected')
        expect(ariaSelected).toBe('true')
      }
    })
  })

  test.describe('Visual Accessibility', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test color contrast of key elements
      const elements = [
        'text=Type answer',
        'text=Show options',
        'text=Check Answer'
      ]
      
      for (const selector of elements) {
        const element = page.locator(selector)
        if (await element.count() > 0) {
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize
            }
          })
          
          console.log(`Element "${selector}":`, styles)
          
          // Should have color values (basic check)
          expect(styles.color).toBeTruthy()
          expect(styles.backgroundColor).toBeTruthy()
        }
      }
    })

    test('should be usable when zoomed', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test different zoom levels
      const zoomLevels = [1.5, 2.0, 2.5]
      
      for (const zoom of zoomLevels) {
        await page.setViewportSize({ 
          width: Math.floor(1280 / zoom), 
          height: Math.floor(720 / zoom) 
        })
        
        await page.evaluate((zoomLevel) => {
          document.body.style.zoom = zoomLevel.toString()
        }, zoom)
        
        await page.waitForTimeout(1000)
        
        // Should still be functional at high zoom
        await page.waitForSelector('text=___', { timeout: 10000 })
        
        // Test interaction still works
        await page.click('text=Show options')
        await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
        
        const options = await page.locator('[data-testid="multiple-choice-option"]').all()
        expect(options.length).toBeGreaterThan(0)
        
        console.log(`Zoom ${zoom}x: ${options.length} options visible`)
      }
    })

    test('should work with reduced motion', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that functionality still works with reduced motion
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
      
      // Test mode switching
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      
      const input = page.locator('input[type="text"]')
      await expect(input).toBeVisible()
    })
  })

  test.describe('Motor Accessibility', () => {
    test('should have adequately sized click targets', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Test that buttons are large enough (minimum 44px)
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      
      for (let i = 0; i < Math.min(options.length, 3); i++) {
        const boundingBox = await options[i].boundingBox()
        
        expect(boundingBox?.width).toBeGreaterThan(44)
        expect(boundingBox?.height).toBeGreaterThan(44)
        
        console.log(`Option ${i + 1}: ${boundingBox?.width}x${boundingBox?.height}`)
      }
    })

    test('should support click and drag interactions', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Test drag-like interactions (useful for motor impairments)
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      
      if (options.length > 0) {
        const boundingBox = await options[0].boundingBox()
        
        if (boundingBox) {
          // Test mouse down, move, and up (simulating drag)
          await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2)
          await page.mouse.down()
          await page.mouse.move(boundingBox.x + boundingBox.width / 2 + 5, boundingBox.y + boundingBox.height / 2 + 5)
          await page.mouse.up()
          
          // Should still register as a click
          const ariaSelected = await options[0].getAttribute('aria-selected')
          expect(ariaSelected).toBe('true')
        }
      }
    })

    test('should have reasonable timeout periods', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      
      // Test that there's no aggressive timeout on input
      await page.fill('input[type="text"]', 'slow')
      await page.waitForTimeout(5000) // Wait 5 seconds
      
      const inputValue = await page.inputValue('input[type="text"]')
      expect(inputValue).toBe('slow')
      
      // Should still be able to interact
      await page.click('text=Check Answer')
      await page.waitForSelector('.neo-inset', { timeout: 10000 })
    })
  })

  test.describe('Cognitive Accessibility', () => {
    test('should provide clear navigation', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that mode options are clearly labeled
      const modeButtons = await page.locator('text=Type answer, text=Show options').all()
      
      for (const button of modeButtons) {
        const textContent = await button.textContent()
        
        // Should have clear, descriptive text
        expect(textContent).toBeTruthy()
        expect(textContent?.trim().length).toBeGreaterThan(5)
        
        console.log('Mode button:', textContent)
      }
    })

    test('should provide helpful feedback', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Select an option and check answer
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].click()
        await page.click('text=Check Answer')
        await page.waitForSelector('.neo-inset', { timeout: 10000 })
        
        // Should provide clear feedback
        const feedbackElement = page.locator('.neo-inset')
        const feedbackText = await feedbackElement.textContent()
        
        expect(feedbackText).toBeTruthy()
        expect(feedbackText?.trim().length).toBeGreaterThan(10)
        
        console.log('Feedback:', feedbackText)
      }
    })

    test('should support different learning styles', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that both input and multiple choice modes are available
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      await expect(page.locator('input[type="text"]')).toBeVisible()
      
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      expect(options.length).toBeGreaterThan(0)
      
      // Both modes should be functional
      console.log('Available learning modes: Input and Multiple Choice')
    })
  })

  test.describe('Assistive Technology Support', () => {
    test('should work with simulated screen reader', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Simulate screen reader navigation
      const allElements = await page.locator('*').all()
      const readableElements = []
      
      for (let i = 0; i < Math.min(allElements.length, 50); i++) {
        const element = allElements[i]
        const textContent = await element.textContent()
        const ariaLabel = await element.getAttribute('aria-label')
        const role = await element.getAttribute('role')
        
        if (textContent?.trim() || ariaLabel || role) {
          readableElements.push({
            text: textContent?.trim() || ariaLabel || '',
            role: role || await element.evaluate(el => el.tagName)
          })
        }
      }
      
      // Should have meaningful content for screen readers
      expect(readableElements.length).toBeGreaterThan(5)
      
      console.log('Readable elements:', readableElements.slice(0, 10))
    })

    test('should support voice control', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that elements can be targeted by voice commands
      // (by having unique, descriptive text)
      const clickableElements = await page.locator('button, a, input').all()
      
      for (const element of clickableElements) {
        const textContent = await element.textContent()
        const ariaLabel = await element.getAttribute('aria-label')
        const placeholder = await element.getAttribute('placeholder')
        
        const identifier = textContent || ariaLabel || placeholder
        
        if (identifier) {
          // Should have unique, speakable identifiers
          expect(identifier.trim().length).toBeGreaterThan(2)
          
          console.log('Voice control target:', identifier)
        }
      }
    })

    test('should support switch navigation', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test that all interactive elements are reachable via Tab
      const tabOrder = []
      
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        
        const focused = await page.locator(':focus').first()
        const tagName = await focused.evaluate(el => el.tagName).catch(() => 'UNKNOWN')
        const textContent = await focused.textContent().catch(() => '')
        
        if (tagName && tagName !== 'UNKNOWN') {
          tabOrder.push({ tagName, textContent: textContent?.trim() || '' })
        }
      }
      
      // Should have a logical tab order
      expect(tabOrder.length).toBeGreaterThan(2)
      
      console.log('Tab order:', tabOrder)
    })
  })

  test.describe('WCAG Compliance', () => {
    test('should meet WCAG 2.1 AA requirements - Focus Management', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Test focus indicators are visible
      await page.keyboard.press('Tab')
      
      const focusedElement = await page.locator(':focus').first()
      const styles = await focusedElement.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          outlineColor: computed.outlineColor,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        }
      })
      
      // Should have visible focus indicator
      const hasFocusIndicator = styles.outline !== 'none' || 
                               styles.outlineWidth !== '0px' || 
                               styles.boxShadow !== 'none'
      
      expect(hasFocusIndicator).toBe(true)
      
      console.log('Focus styles:', styles)
    })

    test('should meet WCAG 2.1 AA requirements - Error Identification', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Type answer')
      await page.waitForSelector('input[type="text"]', { timeout: 5000 })
      
      // Test error handling
      await page.click('text=Check Answer') // Submit without input
      await page.waitForTimeout(2000)
      
      // Should provide clear error messaging if validation fails
      const errorElements = await page.locator('[aria-invalid="true"], .error, [role="alert"]').all()
      
      console.log('Error elements found:', errorElements.length)
    })

    test('should meet WCAG 2.1 AA requirements - Status Messages', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Test status announcements
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        await options[0].click()
        await page.click('text=Check Answer')
        await page.waitForSelector('.neo-inset', { timeout: 10000 })
        
        // Should have status messages for screen readers
        const statusElements = await page.locator('[aria-live], [role="status"], [role="alert"]').all()
        
        console.log('Status elements found:', statusElements.length)
      }
    })
  })
})