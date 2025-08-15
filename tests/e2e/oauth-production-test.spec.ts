import { test, expect } from '@playwright/test';

test.describe('OAuth Production Test', () => {
  test('Google OAuth should be available on production signin page', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/auth/signin');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Google OAuth button is present
    const googleButton = page.locator('button').filter({ hasText: 'Continue with Google' });
    await expect(googleButton).toBeVisible();
    
    // Verify the button has the Google icon
    const googleIcon = page.locator('svg').first();
    await expect(googleIcon).toBeVisible();
    
    // Check that we don't see the "not configured" message
    await expect(page.locator('text=Social Login Temporarily Unavailable')).not.toBeVisible();
    await expect(page.locator('text=OAuth providers are not currently configured')).not.toBeVisible();
    
    console.log('✅ Google OAuth button is available on production');
  });
  
  test('OAuth providers API returns Google as available', async ({ page }) => {
    // Test the providers endpoint directly
    const response = await page.request.get('/api/auth/providers');
    expect(response.status()).toBe(200);
    
    const providers = await response.json();
    expect(providers.google).toBeDefined();
    expect(providers.google.name).toBe('Google');
    expect(providers.google.type).toBeDefined();
    expect(providers.google.id).toBe('google');
    
    console.log('✅ Google OAuth provider is properly configured on production');
  });
});