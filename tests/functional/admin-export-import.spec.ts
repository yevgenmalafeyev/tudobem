import { test, expect } from '@playwright/test';

test.describe('Admin Export/Import Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page and login
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'tudobem2024');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load and navigate to Data Management
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 10000 });
    await page.click('text=Data Management');
    await expect(page.locator('text=Export Questions')).toBeVisible();
  });

  test('displays export section correctly', async ({ page }) => {
    // Check export section elements
    await expect(page.locator('text=📤 Export Questions')).toBeVisible();
    await expect(page.locator('text=Export all questions, answers, and explanations')).toBeVisible();
    await expect(page.locator('button:has-text("Export Database")')).toBeVisible();
    
    // Check export button is enabled
    await expect(page.locator('button:has-text("Export Database")')).toBeEnabled();
  });

  test('displays import section correctly', async ({ page }) => {
    // Check import section elements
    await expect(page.locator('text=📥 Import Questions')).toBeVisible();
    await expect(page.locator('text=Import questions from a ZIP file')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
    await expect(page.locator('button:has-text("Import Data")')).toBeVisible();
    
    // Check import button is disabled initially
    await expect(page.locator('button:has-text("Import Data")')).toBeDisabled();
  });

  test('displays instructions section correctly', async ({ page }) => {
    // Check instructions section
    await expect(page.locator('text=📋 Instructions')).toBeVisible();
    await expect(page.locator('text=Export: Downloads all questions')).toBeVisible();
    await expect(page.locator('text=Import: Uploads a ZIP file')).toBeVisible();
    await expect(page.locator('text=File Format: ZIP files should contain')).toBeVisible();
    await expect(page.locator('text=Note: Import will not overwrite')).toBeVisible();
  });

  test('export functionality shows loading state', async ({ page }) => {
    // Click export button
    await page.click('button:has-text("Export Database")');
    
    // Should show loading state
    await expect(page.locator('text=Exporting...')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('span.animate-spin')).toBeVisible();
    
    // Export button should be disabled during export
    await expect(page.locator('button:has-text("Exporting...")')).toBeDisabled();
  });

  test('successful export shows success message', async ({ page }) => {
    // Click export button
    await page.click('button:has-text("Export Database")');
    
    // Wait for export to complete and check for success message
    await expect(page.locator('text=✅ Export completed successfully!')).toBeVisible({ timeout: 15000 });
    
    // Export button should be enabled again
    await expect(page.locator('button:has-text("Export Database")')).toBeEnabled();
  });

  test('file input accepts only ZIP files', async ({ page }) => {
    // Check file input attributes
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', '.zip');
    
    // Check label text
    await expect(page.locator('text=Select ZIP file to import')).toBeVisible();
  });

  test('import button is disabled without file selection', async ({ page }) => {
    // Import button should be disabled initially
    await expect(page.locator('button:has-text("Import Data")')).toBeDisabled();
    
    // Should remain disabled without file
    await page.click('input[type="file"]');
    await expect(page.locator('button:has-text("Import Data")')).toBeDisabled();
  });

  test('shows error message for invalid file type', async ({ page }) => {
    // Create a fake text file
    const fileContent = 'This is not a zip file';
    
    // Try to upload non-zip file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(fileContent)
    });
    
    // Should show error message
    await expect(page.locator('text=❌ Please select a ZIP file')).toBeVisible();
    
    // Import button should remain disabled
    await expect(page.locator('button:has-text("Import Data")')).toBeDisabled();
  });

  test('shows file information when valid ZIP is selected', async ({ page }) => {
    // Create a fake zip file
    const fileContent = 'PK'; // ZIP file magic bytes
    
    // Upload zip file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(fileContent)
    });
    
    // Should show file information
    await expect(page.locator('text=Selected file: test.zip')).toBeVisible();
    await expect(page.locator('text=MB)')).toBeVisible();
    
    // Import button should be enabled
    await expect(page.locator('button:has-text("Import Data")')).toBeEnabled();
  });

  test('import functionality shows loading state', async ({ page }) => {
    // Create a fake zip file
    const fileContent = 'PK';
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(fileContent)
    });
    
    // Click import button
    await page.click('button:has-text("Import Data")');
    
    // Should show loading state
    await expect(page.locator('text=Importing...')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('span.animate-spin')).toBeVisible();
    
    // Import button should be disabled during import
    await expect(page.locator('button:has-text("Importing...")')).toBeDisabled();
  });

  test('export and import sections are independent', async ({ page }) => {
    // Both sections should be visible simultaneously
    await expect(page.locator('text=📤 Export Questions')).toBeVisible();
    await expect(page.locator('text=📥 Import Questions')).toBeVisible();
    
    // Both buttons should be available
    await expect(page.locator('button:has-text("Export Database")')).toBeVisible();
    await expect(page.locator('button:has-text("Import Data")')).toBeVisible();
  });

  test('message display section shows status updates', async ({ page }) => {
    // Initially no message should be shown
    const messageCard = page.locator('.neo-card:has-text("✅")').or(page.locator('.neo-card:has-text("❌")'));
    await expect(messageCard).not.toBeVisible();
    
    // After an action, message should appear
    await page.click('button:has-text("Export Database")');
    
    // Should eventually show a message
    await expect(page.locator('text=✅').or(page.locator('text=❌'))).toBeVisible({ timeout: 15000 });
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // All sections should still be visible
    await expect(page.locator('text=📤 Export Questions')).toBeVisible();
    await expect(page.locator('text=📥 Import Questions')).toBeVisible();
    await expect(page.locator('text=📋 Instructions')).toBeVisible();
    
    // Buttons should still be accessible
    await expect(page.locator('button:has-text("Export Database")')).toBeVisible();
    await expect(page.locator('button:has-text("Import Data")')).toBeVisible();
  });
});