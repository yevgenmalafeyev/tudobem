import { test, expect } from '@playwright/test';

test.describe('OAuth Debug', () => {
  test('Debug OAuth provider loading', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/auth/signin');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Wait a bit for providers to load
    await page.waitForTimeout(3000);
    
    // Check if any buttons exist
    const allButtons = await page.locator('button').count();
    console.log(`Found ${allButtons} buttons on the page`);
    
    // Check all button texts
    for (let i = 0; i < allButtons; i++) {
      const buttonText = await page.locator('button').nth(i).textContent();
      console.log(`Button ${i}: "${buttonText}"`);
    }
    
    // Check for loading state
    const loadingElement = page.locator('text=Loading...');
    const isLoading = await loadingElement.isVisible();
    console.log(`Is loading: ${isLoading}`);
    
    // Check for error message
    const errorMessage = page.locator('text=Social Login Temporarily Unavailable');
    const hasError = await errorMessage.isVisible();
    console.log(`Has error message: ${hasError}`);
    
    // Check NextAuth providers endpoint
    const response = await page.request.get('/api/auth/providers');
    const nextAuthProviders = await response.text();
    console.log('NextAuth providers response:', nextAuthProviders);
    
    // Check our custom providers endpoint  
    const customResponse = await page.request.get('/api/auth/providers');
    const customProviders = await customResponse.json();
    console.log('Custom providers response:', customProviders);
  });
});