import { test, expect } from '@playwright/test';

test.describe('Admin Problem Reports - Missing Reporter Info', () => {
  
  test('should display reporter name and email in problem reports list', async ({ page }) => {
    // First, log in as a regular user to create a problem report
    await page.goto('/auth/signin');
    
    // Click on Google OAuth to sign in (assuming user will have auth)
    const googleButton = page.locator('button:has-text("Continue with Google")');
    if (await googleButton.isVisible()) {
      await googleButton.click();
      // In real test, we would handle OAuth flow
      // For this test, we'll navigate directly to learning page if already authenticated
    }
    
    // Go to learning page
    await page.goto('/');
    
    // Wait for an exercise to load and submit a problem report
    await page.waitForSelector('[data-testid="exercise-container"]', { timeout: 10000 });
    
    // Look for problem report button (should be visible in input mode)
    const reportButton = page.locator('button[data-testid="report-problem-button"]');
    if (await reportButton.isVisible()) {
      await reportButton.click();
      
      // Fill out the problem report form
      await page.fill('[data-testid="problem-comment"]', 'This exercise has an issue with the hint being irrelevant to the actual answer.');
      
      // Select problem type
      await page.selectOption('[data-testid="problem-type"]', 'irrelevant_hint');
      
      // Submit the report
      await page.click('button:has-text("Submit Report")');
      
      // Wait for success message
      await page.waitForSelector('text=Problem report submitted successfully', { timeout: 5000 });
    }
    
    // Now log in as admin to check the problem reports list
    await page.goto('/admin/login');
    
    // Fill admin login form
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for admin dashboard
    await page.waitForSelector('text=Admin Dashboard', { timeout: 10000 });
    
    // Navigate to problem reports
    await page.click('a:has-text("Problem Reports")');
    
    // Wait for problem reports table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check table headers - should include Reporter column
    const tableHeaders = page.locator('thead th');
    const headerTexts = await tableHeaders.allTextContents();
    
    // This test will FAIL initially because Reporter column is missing
    expect(headerTexts).toContain('Reporter');
    
    // Check if first row has reporter information
    const firstRow = page.locator('tbody tr').first();
    
    // Look for reporter name or email in the first row
    // This will also FAIL initially because no reporter info is displayed
    const reporterCell = firstRow.locator('td').nth(1); // Assuming Reporter is 2nd column
    const reporterText = await reporterCell.textContent();
    
    expect(reporterText).not.toBe('');
    expect(reporterText).not.toBe(null);
    expect(reporterText).toMatch(/@|Anonymous User/); // Should contain email or show "Anonymous User"
  });
  
  test('should handle anonymous reports gracefully', async ({ page }) => {
    // Submit an anonymous problem report (current behavior)
    const reportData = {
      exerciseId: '550e8400-e29b-41d4-a716-446655440000',
      problemType: 'other',
      userComment: 'This is an anonymous problem report for testing purposes.'
    };
    
    // Submit report via API (simulating anonymous submission)
    const response = await page.request.post('/api/problem-reports/submit', {
      data: reportData
    });
    
    expect(response.status()).toBe(200);
    
    // Now check admin panel shows anonymous user appropriately
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForSelector('text=Admin Dashboard', { timeout: 10000 });
    await page.click('a:has-text("Problem Reports")');
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check that anonymous reports show "Anonymous User" or similar
    const reporterCells = page.locator('tbody tr td:nth-child(2)'); // Reporter column
    const reporterTexts = await reporterCells.allTextContents();
    
    // Should have at least one "Anonymous User" or similar identifier
    const hasAnonymousIndicator = reporterTexts.some(text => 
      text.includes('Anonymous') || text.includes('Not provided') || text.trim() === ''
    );
    
    expect(hasAnonymousIndicator).toBe(true);
  });
  
});