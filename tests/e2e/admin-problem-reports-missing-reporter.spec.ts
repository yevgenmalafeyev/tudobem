import { test, expect } from '@playwright/test';

test.describe('Admin Problem Reports - Missing Reporter Info', () => {
  
  test('should display reporter name and email in problem reports list', async ({ page }) => {
    // Submit an anonymous problem report via API to ensure we have test data
    const reportData = {
      exerciseId: '0007213c-c173-42c5-9d4d-21cdb3e98a79',
      problemType: 'irrelevant_hint',
      userComment: 'This exercise has an issue with the hint being irrelevant to the actual answer.'
    };
    
    // Submit report via API (simulating anonymous submission)
    const response = await page.request.post('/api/problem-reports/submit', {
      data: reportData
    });
    
    expect(response.status()).toBe(200);
    
    // Now log in as admin to check the problem reports list
    await page.goto('/admin');
    
    // Dismiss cookie banner if present
    try {
      await page.locator('button:has-text("Aceitar todos")').click({ timeout: 2000 });
    } catch (e) {
      // Cookie banner might not be present, continue
    }
    
    // Fill admin login form
    await page.fill('input#username', 'admin@tudobem.blaster.app');
    await page.fill('input#password', '321admin123');
    await page.click('button[type="submit"]', { force: true });
    
    // Wait for admin dashboard
    await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
    
    // Navigate to problem reports
    await page.click('button:has-text("Problem Reports")');
    
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
    expect(reporterText).toMatch(/@|Anonymous/); // Should contain email or show "Anonymous"
  });
  
  test('should handle anonymous reports gracefully', async ({ page }) => {
    // Submit an anonymous problem report (current behavior)
    const reportData = {
      exerciseId: '0007213c-c173-42c5-9d4d-21cdb3e98a79',
      problemType: 'other',
      userComment: 'This is an anonymous problem report for testing purposes.'
    };
    
    // Submit report via API (simulating anonymous submission)
    const response = await page.request.post('/api/problem-reports/submit', {
      data: reportData
    });
    
    expect(response.status()).toBe(200);
    
    // Now check admin panel shows anonymous user appropriately
    await page.goto('/admin');
    
    // Dismiss cookie banner if present
    try {
      await page.locator('button:has-text("Aceitar todos")').click({ timeout: 2000 });
    } catch (e) {
      // Cookie banner might not be present, continue
    }
    
    await page.fill('input#username', 'admin@tudobem.blaster.app');
    await page.fill('input#password', '321admin123');
    await page.click('button[type="submit"]', { force: true });
    
    await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
    await page.click('button:has-text("Problem Reports")');
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check that anonymous reports show "Anonymous User" or similar
    const reporterCells = page.locator('tbody tr td:nth-child(2)'); // Reporter column
    const reporterTexts = await reporterCells.allTextContents();
    
    // Should have at least one "Anonymous" or similar identifier
    const hasAnonymousIndicator = reporterTexts.some(text => 
      text.includes('Anonymous') || text.includes('Not provided') || text.trim() === ''
    );
    
    expect(hasAnonymousIndicator).toBe(true);
  });
  
});