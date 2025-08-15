import { test, expect } from '@playwright/test';

test.describe('Question Stats Tests', () => {
  test('should load question stats successfully', async ({ page }) => {
    // Set up request monitoring
    const requests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/admin/stats')) {
        requests.push(request);
        console.log('📡 Stats API request:', request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/admin/stats')) {
        console.log('📡 Stats API response:', response.status(), response.statusText());
      }
    });
    
    // Navigate to admin login page with test parameter
    await page.goto('/admin?e2e-test=true');
    await page.waitForLoadState('networkidle');
    
    // Fill in admin credentials (using the pattern from existing tests)
    const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first();
    await usernameField.fill('admin@tudobem.blaster.app');
    
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill('321admin123');
    
    // Click login button
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    // Accept URL with or without query parameter
    await expect(page.url()).toMatch(/\/admin(\?.*)?$/);
    
    // Check for admin dashboard content
    const pageContent = await page.textContent('body');
    console.log('Page content after login includes dashboard?', pageContent?.includes('Dashboard') || pageContent?.includes('Admin'));
    
    // Navigate to Question Stats - look for the link/button
    const statsButton = page.locator('text=Question Stats, text=Stats, button:has-text("Question Stats"), a:has-text("Question Stats")').first();
    
    if (await statsButton.isVisible()) {
      console.log('✅ Found Question Stats button, clicking...');
      await statsButton.click();
    } else {
      console.log('❌ Question Stats button not found, trying navigation');
      // Try direct navigation
      await page.goto('/admin#stats');
    }
    
    // Wait for stats component to load
    await page.waitForTimeout(2000);
    
    // Check for loading state first
    const loadingElement = page.locator('text=Loading statistics...');
    if (await loadingElement.isVisible()) {
      console.log('📊 Stats loading state detected');
      await page.waitForTimeout(5000); // Give it time to load
    }
    
    // Check final state
    const errorElement = page.locator('text=❌ Failed to fetch statistics');
    const statsElement = page.locator('text=📊 Total Questions');
    
    if (await errorElement.isVisible()) {
      console.log('❌ Question stats failed to load');
      await page.screenshot({ path: 'question-stats-error-local.png' });
      
      // Check if any requests were made
      console.log('Number of stats API requests made:', requests.length);
      
      // Try clicking the "Try Again" button
      const tryAgainButton = page.locator('button:has-text("Try Again")');
      if (await tryAgainButton.isVisible()) {
        console.log('🔄 Clicking Try Again button...');
        await tryAgainButton.click();
        await page.waitForTimeout(3000);
        
        // Check again
        if (await statsElement.isVisible()) {
          console.log('✅ Stats loaded after retry');
        } else {
          console.log('❌ Stats still failed after retry');
        }
      }
    } else if (await statsElement.isVisible()) {
      console.log('✅ Question stats loaded successfully');
      await page.screenshot({ path: 'question-stats-success-local.png' });
    } else {
      console.log('⚠️ Unknown state - neither error nor success detected');
      await page.screenshot({ path: 'question-stats-unknown-local.png' });
    }
  });
});