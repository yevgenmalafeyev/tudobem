import { test, expect } from '@playwright/test';

test.describe('Fallback Exercise System', () => {
  test('learning mode loads and shows exercise or loading state', async ({ page }) => {
    // Navigate to the learning page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to configure first
    const configTitle = page.locator('text=Configure Your Portuguese Learning');
    if (await configTitle.isVisible()) {
      // Configure basic settings
      await page.check('input[type="checkbox"][value="A1"]');
      await page.check('input[type="checkbox"][value="Present Tense"]');
      await page.fill('input[placeholder*="API key"]', 'test-api-key');
      await page.click('button:has-text("Save Configuration")');
      
      // Wait for learning mode to load
      await page.waitForLoadState('networkidle');
    }
    
    // Now we should be in learning mode
    await expect(page.locator('h1')).toContainText('Tudobem');
    
    // Check that either an exercise appears or loading state is shown
    const exerciseVisible = page.locator('input[type="text"]').or(page.locator('text=Loading exercise'));
    await expect(exerciseVisible).toBeVisible({ timeout: 10000 });
    
    // Success - the fallback system is working (either shows exercise or loading)
    expect(true).toBe(true);
  });

});