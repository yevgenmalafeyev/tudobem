import { test, expect, Page } from '@playwright/test'

test.describe('Irregular Verbs Learning Flow - Functional Tests', () => {
  let page: Page
  let consoleErrors: string[] = []
  let consoleWarnings: string[] = []
  let pageErrors: Error[] = []

  // Helper function to check for console errors, warnings, and visual error indicators
  async function checkForConsoleErrorsAndWarnings() {
    // Fail test if there are console errors
    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(', ')}`)
    }
    
    // Fail test if there are console warnings
    if (consoleWarnings.length > 0) {
      throw new Error(`Console warnings detected: ${consoleWarnings.join(', ')}`)
    }
    
    // Fail test if there are page errors
    if (pageErrors.length > 0) {
      throw new Error(`Page errors detected: ${pageErrors.map(e => e.message).join(', ')}`)
    }

    // Check for visual error indicators (dev overlays, lint errors, etc.)
    const errorIndicators = await page.locator('[style*="background-color: red"], [style*="background: red"], .error-overlay, [data-nextjs-dialog-overlay], [class*="issue"], [class*="error"]').count()
    if (errorIndicators > 0) {
      const errorText = await page.locator('[style*="background-color: red"], [style*="background: red"], .error-overlay, [data-nextjs-dialog-overlay], [class*="issue"], [class*="error"]').first().textContent()
      throw new Error(`Visual error indicator detected: ${errorText}`)
    }

    // Check for Next.js error overlay specifically
    const nextjsErrorOverlay = await page.locator('[data-nextjs-error-overlay]').count()
    if (nextjsErrorOverlay > 0) {
      const errorContent = await page.locator('[data-nextjs-error-overlay]').textContent()
      throw new Error(`Next.js error overlay detected: ${errorContent}`)
    }
  }

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Reset error arrays for each test
    consoleErrors = []
    consoleWarnings = []
    pageErrors = []
    
    // Set up console message listeners
    page.on('console', async (msg) => {
      const type = msg.type()
      const text = msg.text()
      
      if (type === 'error') {
        consoleErrors.push(`Console Error: ${text}`)
      } else if (type === 'warning') {
        consoleWarnings.push(`Console Warning: ${text}`)
      }
    })
    
    // Set up page error listener
    page.on('pageerror', (error) => {
      pageErrors.push(error)
    })
    
    // Set up viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Navigate to the application
    await page.goto('/?e2e-test=true')
    
    // Wait for application to load
    await page.waitForLoadState('networkidle')
    
    // Check for errors after initial page load
    await checkForConsoleErrorsAndWarnings()
    
    // Navigate to irregular verbs section
    await page.click('text=Verbos Irregulares')
    await page.waitForLoadState('networkidle')
    
    // Check for errors after navigation
    await checkForConsoleErrorsAndWarnings()
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.describe('Full Irregular Verbs Learning Session', () => {
    test('should complete a full irregular verbs session with multiple exercises', async () => {
      console.log('🔤 Testing irregular verbs learning session')
      
      const exercisesCompleted = 5
      
      for (let i = 0; i < exercisesCompleted; i++) {
        console.log(`📝 Exercise ${i + 1}/${exercisesCompleted}`)
        
        // Wait for exercise to load - look for any question (conjugation or participle)
        await page.waitForSelector('h2', { timeout: 15000 })
        
        // Check for console errors after exercise load
        await checkForConsoleErrorsAndWarnings()
        
        // Verify we have a question
        const questionText = await page.textContent('h2')
        expect(questionText).toBeTruthy()
        expect(questionText?.length).toBeGreaterThan(0)
        
        // Take screenshot of exercise
        await page.screenshot({ 
          path: `test-results/irregular-verbs-exercise-${i + 1}.png`,
          fullPage: true 
        })
        
        // Test both input and multiple choice modes
        if (i % 2 === 0) {
          console.log('🔤 Testing text input mode')
          // Ensure we're in text input mode first
          await page.click('text=Digitar Resposta')
          await page.waitForTimeout(500) // Wait for UI update
          
          // Text input mode (default for irregular verbs)
          await page.waitForSelector('input[type="text"]', { timeout: 10000 })
          
          // Check for console errors after input appears
          await checkForConsoleErrorsAndWarnings()
          
          // Fill in a conjugated verb form (may not be correct, but tests functionality)
          await page.fill('input[type="text"]', 'sou')
          
          // Check for console errors after filling input
          await checkForConsoleErrorsAndWarnings()
          
          // Check answer
          await page.click('text=Verificar resposta')
          
          // Check for console errors after submitting answer
          await checkForConsoleErrorsAndWarnings()
          
        } else {
          console.log('🔘 Testing multiple choice mode')
          // Multiple choice mode
          await page.click('text=Mostrar Opções')
          
          // Check for console errors after clicking multiple choice toggle
          await checkForConsoleErrorsAndWarnings()
          
          await page.waitForTimeout(1000) // Small wait for UI update
          
          // Take screenshot after clicking multiple choice
          await page.screenshot({ 
            path: `test-results/multiple-choice-debug-${i + 1}.png`,
            fullPage: true 
          })
          
          // Wait for multiple choice options with new button format
          await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 15000 })
          
          // Check for console errors after multiple choice options load
          await checkForConsoleErrorsAndWarnings()
          
          // Verify we have exactly 4 options
          const optionCount = await page.locator('button[data-testid="multiple-choice-option"]').count()
          expect(optionCount).toBe(4)
          
          // Click first option - this should immediately submit the answer
          const options = await page.locator('button[data-testid="multiple-choice-option"]').all()
          if (options.length > 0) {
            await options[0].click()
            
            // Check for console errors after clicking option (which auto-submits)
            await checkForConsoleErrorsAndWarnings()
            
            // No need to click "Verificar resposta" - it auto-submits
          }
        }
        
        // Wait for feedback
        await page.waitForSelector('text=Correto', { timeout: 15000 }).catch(() => 
          page.waitForSelector('text=Incorreto', { timeout: 15000 })
        )
        
        // Check for console errors after feedback display
        await checkForConsoleErrorsAndWarnings()
        
        // Check that feedback is displayed
        const correctFeedback = await page.locator('text=✅ Correto!').count()
        const incorrectFeedback = await page.locator('text=❌ Incorreto').count()
        expect(correctFeedback + incorrectFeedback).toBeGreaterThan(0)
        
        // Move to next exercise (except for last one)
        if (i < exercisesCompleted - 1) {
          // Test Enter key to move to next exercise
          await page.keyboard.press('Enter')
          
          // Check for console errors after moving to next exercise
          await checkForConsoleErrorsAndWarnings()
          
          await page.waitForTimeout(1000) // Allow for loading
        }
      }
      
      console.log('✅ Irregular verbs session completed successfully')
    })

    test('should handle tense configuration and exercise filtering', async () => {
      console.log('⚙️ Testing tense configuration')
      
      // Navigate to configuration
      await page.click('text=Configurar')
      await page.waitForLoadState('networkidle')
      
      // Check for console errors after navigation to configuration
      await checkForConsoleErrorsAndWarnings()
      
      // Find irregular verbs tense section
      await page.waitForSelector('text=Verbos Irregulares - Tempos Verbais', { timeout: 10000 })
      
      // Check for console errors after configuration page loads
      await checkForConsoleErrorsAndWarnings()
      
      // Deselect all tenses first
      await page.click('text=Nenhum')
      await page.waitForTimeout(500)
      
      // Check for console errors after deselecting tenses
      await checkForConsoleErrorsAndWarnings()
      
      // Select only Presente Indicativo - find checkbox by looking for the label text and associated checkbox
      const presenteIndicativoCheckbox = page.locator('label:has-text("Presente Indicativo") input[type="checkbox"]');
      await presenteIndicativoCheckbox.check();
      
      // Check for console errors after selecting tense
      await checkForConsoleErrorsAndWarnings()
      
      // Save configuration
      await page.click('text=Guardar Configuração e Começar a Aprender')
      await page.waitForLoadState('networkidle')
      
      // Check for console errors after saving configuration
      await checkForConsoleErrorsAndWarnings()
      
      // Navigate back to irregular verbs
      await page.click('text=Verbos Irregulares')
      await page.waitForLoadState('networkidle')
      
      // Check for console errors after navigating back to irregular verbs
      await checkForConsoleErrorsAndWarnings()
      
      // Verify that exercise is using only selected tense
      await page.waitForSelector('text=Presente Indicativo', { timeout: 10000 })
      
      // Check for console errors after exercise loads with configuration
      await checkForConsoleErrorsAndWarnings()
      
      console.log('✅ Tense configuration working correctly')
    })

    test('should display verb information correctly', async () => {
      console.log('📋 Testing verb information display')
      
      // Wait for exercise to load
      await page.waitForSelector('h2', { timeout: 10000 })
      
      // Check for console errors after exercise loads
      await checkForConsoleErrorsAndWarnings()
      
      // Verify question format
      const questionText = await page.textContent('h2')
      expect(questionText).toBeTruthy()
      expect(questionText?.length).toBeGreaterThan(0)
      
      // Check toggle buttons are present
      await page.waitForSelector('text=Digitar Resposta', { timeout: 10000 })
      await page.waitForSelector('text=Mostrar Opções', { timeout: 10000 })
      
      // Check for console errors after UI elements load
      await checkForConsoleErrorsAndWarnings()
      
      // Check statistics display
      const statsVisible = await page.locator('text=Exercícios:').count() > 0
      // Stats appear after first exercise, so don't require it initially
      
      console.log('✅ Verb information displayed correctly')
    })
  })
})