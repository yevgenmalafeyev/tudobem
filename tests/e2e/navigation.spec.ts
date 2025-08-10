import { test, expect } from '@playwright/test'
import { validateESLintInTest } from '../utils/test-helpers'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to configuration page when clicking Configurar button', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should navigate to configuration page when clicking Configurar button');

    // Capture console messages for debugging
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Ensure user is configured so navigation buttons are visible
    await page.evaluate(() => {
      localStorage.setItem('store', JSON.stringify({
        state: {
          configuration: {
            selectedLevels: ['A1'],
            selectedTopics: ['verbo-estar'],
            claudeApiKey: '',
            appLanguage: 'pt'
          },
          isConfigured: true
        },
        version: 0
      }));
    });
    await page.reload();

    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="exercise-input"], .neo-card', { timeout: 15000 })
    
    // Find and click the configuration button (using both Portuguese and English text)
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Configure")').first()
    await expect(configButton).toBeVisible({ timeout: 10000 })
    
    console.log('About to click configuration button...');
    await configButton.click()
    
    // Give some time for state changes and log messages
    await page.waitForTimeout(2000)
    
    console.log('Console messages:', consoleMessages.filter(msg => msg.includes('DEBUG')));
    
    // Verify we're on the configuration page
    // Look for configuration-specific elements
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Tópicos').or(page.locator('text=Topics'))).toBeVisible({ timeout: 5000 })
    
    // Verify the configuration button is now active/highlighted
    await expect(configButton).toHaveClass(/neo-button-primary/)
  })

  test('should navigate between learning and configuration pages', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should navigate between learning and configuration pages');

    // Start on learning page
    await page.waitForSelector('[data-testid="exercise-input"], .neo-card', { timeout: 15000 })
    
    // Verify we're on learning page initially
    const learningButton = page.locator('button:has-text("Aprender"), button:has-text("Learn")').first()
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Configure")').first()
    
    await expect(learningButton).toHaveClass(/neo-button-primary/)
    
    // Navigate to configuration
    await configButton.click()
    await page.waitForTimeout(500) // Give time for navigation
    
    // Verify we're on configuration page
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    await expect(configButton).toHaveClass(/neo-button-primary/)
    await expect(learningButton).not.toHaveClass(/neo-button-primary/)
    
    // Navigate back to learning
    await learningButton.click()
    await page.waitForTimeout(500) // Give time for navigation
    
    // Verify we're back on learning page
    await page.waitForSelector('[data-testid="exercise-input"], .neo-card', { timeout: 10000 })
    await expect(learningButton).toHaveClass(/neo-button-primary/)
    await expect(configButton).not.toHaveClass(/neo-button-primary/)
  })

  test('should maintain configuration page state when navigating', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should maintain configuration page state when navigating');

    // Navigate to configuration
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Configure")').first()
    await configButton.click()
    
    // Wait for configuration page to load
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    
    // Make a change in configuration (select a different level)
    const levelCheckbox = page.locator('input[type="checkbox"]').first()
    const initialState = await levelCheckbox.isChecked()
    
    if (initialState) {
      await levelCheckbox.uncheck()
    } else {
      await levelCheckbox.check()
    }
    
    // Verify the change was made
    const changedState = await levelCheckbox.isChecked()
    expect(changedState).toBe(!initialState)
    
    // Navigate away and back
    const learningButton = page.locator('button:has-text("Aprender"), button:has-text("Learn")').first()
    await learningButton.click()
    await page.waitForTimeout(500)
    
    await configButton.click()
    await page.waitForTimeout(500)
    
    // Verify the configuration state is maintained
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    const finalState = await levelCheckbox.isChecked()
    expect(finalState).toBe(changedState)
  })

  test('should show configuration page for unconfigured users', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should show configuration page for unconfigured users');

    // Clear local storage to simulate unconfigured state
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Should automatically redirect to configuration
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    
    // Configuration button should be active
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Configure")').first()
    await expect(configButton).toHaveClass(/neo-button-primary/)
  })

  test('should handle configuration save and redirect', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should handle configuration save and redirect');

    // Navigate to configuration
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Configure")').first()
    await configButton.click()
    
    // Wait for configuration page
    await expect(page.locator('text=Níveis').or(page.locator('text=Levels'))).toBeVisible({ timeout: 10000 })
    
    // Make sure at least one level and topic are selected
    const levelCheckboxes = page.locator('input[type="checkbox"][value*="A1"], input[type="checkbox"][value*="A2"]')
    const firstLevel = levelCheckboxes.first()
    if (!(await firstLevel.isChecked())) {
      await firstLevel.check()
    }
    
    // Find and click save button
    const saveButton = page.locator('button:has-text("Salvar"), button:has-text("Save"), button:has-text("Guardar")').first()
    await expect(saveButton).toBeVisible({ timeout: 5000 })
    await saveButton.click()
    
    // Should redirect to learning page
    await page.waitForSelector('[data-testid="exercise-input"], .neo-card', { timeout: 15000 })
    
    // Learning button should be active
    const learningButton = page.locator('button:has-text("Aprender"), button:has-text("Learn")').first()
    await expect(learningButton).toHaveClass(/neo-button-primary/)
  })

  test('should have accessible navigation elements', async ({ page }) => {
    test.setTimeout(25000); // Timeout for ESLint validation

    // Run ESLint validation first
    await validateESLintInTest('should have accessible navigation elements');

    await page.waitForSelector('nav', { timeout: 10000 })
    
    // Check that navigation buttons have proper attributes
    const navButtons = page.locator('nav button')
    const buttonCount = await navButtons.count()
    
    expect(buttonCount).toBeGreaterThan(0)
    
    // Check each button has text content
    for (let i = 0; i < buttonCount; i++) {
      const button = navButtons.nth(i)
      const text = await button.textContent()
      expect(text?.trim()).toBeTruthy()
      
      // Check button is keyboard accessible
      await expect(button).toBeFocusable()
    }
  })
})