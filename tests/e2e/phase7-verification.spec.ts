import { test, expect } from '@playwright/test';
import { validateESLintInTest } from '../utils/test-helpers';

test.describe('Phase 7 Verification', () => {
  test('Phase 7: App loads directly in learning mode (no configuration required)', async ({ page }) => {
    test.setTimeout(20000); // Increased timeout to account for ESLint validation
    
    // Run ESLint validation first
    await validateESLintInTest('Phase 7 Verification - Direct learning mode');
    
    console.log('🧪 Testing Phase 7: Direct learning mode loading');

    // Navigate to app
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Wait a moment for the app to stabilize
    await page.waitForTimeout(3000);
    
    // Verify we're in learning mode directly (no configuration screen)
    const header = page.locator('header h1');
    await expect(header).toContainText('Tudobem', { timeout: 10000 });
    console.log('✅ Phase 7 working: App header shows "Tudobem"');
    
    // Check that we don't see configuration screen
    const configTitle = page.locator('text=Configure a Sua Aprendizagem');
    await expect(configTitle).not.toBeVisible({ timeout: 3000 });
    console.log('✅ Phase 7 working: No configuration screen shown');
    
    // Check for any exercise-related elements (even if loading)
    const exerciseContainer = page.locator('.exercise-container');
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    const loadingElement = page.locator('.loading');
    
    const hasExerciseContainer = await exerciseContainer.count() > 0;
    const hasExerciseInput = await exerciseInput.count() > 0;
    const hasLoadingElement = await loadingElement.count() > 0;
    
    if (hasExerciseContainer || hasExerciseInput || hasLoadingElement) {
      console.log('✅ Phase 7 working: Exercise elements or loading states found');
    } else {
      console.log('⚠️ No exercise elements found yet, but Phase 7 navigation is working');
    }
    
    // Verify the app state in the browser console
    const appState = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage),
        url: window.location.pathname,
        title: document.title
      };
    });
    
    console.log('📊 App state:', appState);
    
    // The main test is that we're not on a configuration screen
    console.log('🎉 Phase 7 verification complete: App loads directly without configuration requirement');
  });
});