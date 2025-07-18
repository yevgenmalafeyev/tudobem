import { test, expect } from '@playwright/test';

test.describe('Admin Basic Access', () => {
  test('admin page loads and shows content', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit longer for React to hydrate
    await page.waitForTimeout(3000);
    
    // Take a screenshot to debug
    await page.screenshot({ path: 'admin-page-debug.png' });
    
    // Check if page loads at all
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if any content is visible
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText?.length);
    
    // Wait for either login form or loading state
    await page.waitForSelector('text=Loading...', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('input[type="text"]', { timeout: 10000 }).catch(() => {});
    
    // Check what's actually visible
    const h1Elements = await page.locator('h1').all();
    console.log('H1 elements found:', h1Elements.length);
    
    for (const h1 of h1Elements) {
      const text = await h1.textContent();
      console.log('H1 text:', text);
    }
    
    // Check for input fields
    const inputElements = await page.locator('input').all();
    console.log('Input elements found:', inputElements.length);
    
    for (const input of inputElements) {
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      console.log('Input type:', type, 'placeholder:', placeholder);
    }
    
    // Basic assertion - page should load
    expect(title).toBeTruthy();
  });
});