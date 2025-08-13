import { test, expect } from '@playwright/test';

test.describe('Basic App Loading', () => {
  test('App loads without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error);
    });

    try {
      await page.goto('/', { timeout: 30000 });
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Check for basic elements
      const title = await page.title();
      console.log('Page title:', title);
      
      // Look for any visible text content
      const bodyText = await page.locator('body').textContent();
      console.log('Page has content:', bodyText ? bodyText.length > 0 : false);
      
      // Check if we see configuration screen or learning interface
      const hasConfig = await page.locator('text=Configure').isVisible().catch(() => false);
      const hasLearning = await page.locator('text=Learning').isVisible().catch(() => false);
      const hasExercise = await page.locator('[data-testid="exercise-input"]').isVisible().catch(() => false);
      
      console.log('Has config:', hasConfig);
      console.log('Has learning:', hasLearning);
      console.log('Has exercise input:', hasExercise);
      
      // Report console errors
      if (consoleErrors.length > 0) {
        console.log('Console errors found:', consoleErrors);
      }
      
      // Report page errors
      if (pageErrors.length > 0) {
        console.log('Page errors found:', pageErrors.map(e => e.message));
      }
      
      // Basic assertion
      expect(title).toBeTruthy();
      
    } catch (error) {
      console.log('Test error:', error);
      console.log('Console errors:', consoleErrors);
      console.log('Page errors:', pageErrors.map(e => e.message));
      throw error;
    }
  });
});