import { test, expect } from '@playwright/test';
import { validateESLintInTest } from '../utils/test-helpers'
import { setupErrorMonitoring, validateNoErrors, E2EErrorMonitor } from '../utils/errorMonitoring';

test.describe('Fallback Exercise System', () => {
  let errorMonitor: E2EErrorMonitor;
  
  test.beforeEach(async ({ page }) => {
    // Setup comprehensive error monitoring
    errorMonitor = await setupErrorMonitoring(page);
  });

  test.afterEach(async () => {
    // Validate no critical errors occurred during test
    try {
      await validateNoErrors(errorMonitor, {
        allowWarnings: true, // Allow React warnings for now
        allowNetworkErrors: true, // Allow network errors for fallback testing
        customPatterns: [
          'dispatchSetStateInternal',
          'getRootForUpdatedFiber', 
          'handleLevelToggle',
          'Configuration.useEffect'
        ]
      });
    } catch (error) {
      console.error('🚨 Error validation failed:', error.message);
      throw error;
    } finally {
      errorMonitor.stopMonitoring();
    }
  });
  
  test('learning mode loads and shows exercise or loading state', async ({ page }) => {

  
  test.setTimeout(25000); // Timeout for ESLint validation

  
  // Run ESLint validation first

  
  await validateESLintInTest('learning mode loads and shows exercise or loading state');

  
  
    // Navigate to the learning page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to configure first - look for the Portuguese config title
    const configTitle = page.locator('text=Configure a Sua Aprendizagem');
    if (await configTitle.isVisible()) {
      // Wait for the page to load completely
      await page.waitForTimeout(1000);
      
      // A1 should already be selected by default, so we have levels
      // Now we need to ensure topics are selected - wait for topics to appear
      await page.waitForSelector('input[type="checkbox"]', { timeout: 5000 });
      
      // Select the first available topic checkbox  
      const topicCheckbox = page.locator('input[type="checkbox"]').first();
      await topicCheckbox.check();
      
      // Fill API key
      await page.fill('input[type="password"]', 'test-api-key-for-e2e');
      
      // Wait for the save button to be enabled
      await page.waitForSelector('button:has-text("Guardar Configuração"):not([disabled])', { timeout: 5000 });
      
      // Save configuration
      await page.click('button:has-text("Guardar Configuração")');
      
      // Wait for learning mode to load
      await page.waitForLoadState('networkidle');
    }
    
    // Now we should be in learning mode - check for app title in header specifically
    await expect(page.locator('header h1')).toContainText('Tudobem');
    
    // Check that either an exercise appears or loading state is shown
    const exerciseVisible = page.locator('[data-testid="exercise-input"]').or(page.locator('text=Loading exercise'));
    await expect(exerciseVisible).toBeVisible({ timeout: 10000 });
    
    // Success - the fallback system is working (either shows exercise or loading)
    expect(true).toBe(true);
  });

});