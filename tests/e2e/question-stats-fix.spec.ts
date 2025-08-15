import { test, expect } from '@playwright/test';

test.describe('Question Stats Fix Verification', () => {
  test('Question stats should load successfully after database fix', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    
    // Dismiss cookie consent if present
    try {
      await page.click('text=Aceitar todos', { timeout: 3000 });
    } catch (e) {
      // Cookie banner not present, continue
    }
    
    // Login as admin
    await page.fill('input[placeholder="Enter username"]', 'admin@tudobem.blaster.app');
    await page.fill('input[placeholder="Enter password"]', '321admin123');
    await page.click('button[type="submit"]');
    
    // Wait for admin dashboard to load
    await page.waitForURL('**/admin**');
    await expect(page.locator('text=Tudobem Admin')).toBeVisible();
    
    // Click on Question Stats tab
    await page.click('text=Question Stats');
    
    // Wait for stats to load and verify no error message
    await page.waitForTimeout(2000);
    
    // Should NOT see the error message
    await expect(page.locator('text=❌ Failed to fetch statistics')).not.toBeVisible();
    
    // Verify the main sections are present and data is loaded
    await expect(page.locator('h2').filter({ hasText: '📊 Total Questions' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: '📈 Questions by Level' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: '📚 Questions by Topic' })).toBeVisible();
    
    // Most important: verify the total count is displayed (proves API is working)
    // Use production count (1194) or local count (1195)
    const totalCount = await page.locator('text=1194').or(page.locator('text=1195'));
    await expect(totalCount).toBeVisible();
    
    console.log('✅ Question Stats fix verified: No errors and statistics are displayed successfully');
  });
});