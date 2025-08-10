import { test, expect } from '@playwright/test';

test.describe('Exercise Auto-Cycling Bug Detection', () => {
  test('should not auto-cycle exercises on direct page load', async ({ page }) => {
    // Get base URL from environment or default to localhost:3000
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    
    // Navigate directly to the application (fresh page load)
    await page.goto(baseUrl);
    
    // Wait for the learning mode to load by default
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 });
    
    // Wait a bit more to ensure the exercise has fully loaded
    await page.waitForTimeout(1000);
    
    // Helper function to extract exercise sentence from the card
    const getExerciseSentence = async () => {
      const exerciseText = await page.locator('.neo-card-lg').textContent();
      // Extract the sentence pattern with underscores
      const match = exerciseText?.match(/[\w\s]+___[\w\s]+/);
      return match ? match[0].trim() : exerciseText?.trim();
    };
    
    // Capture the initial exercise sentence
    const initialExercise = await getExerciseSentence();
    expect(initialExercise).toBeTruthy();
    console.log('Initial exercise:', initialExercise);
    
    // Wait for 5 seconds without any user interaction
    // This is the critical period where the auto-cycling bug occurs
    await page.waitForTimeout(5000);
    
    // Capture the exercise sentence after the wait period
    const finalExercise = await getExerciseSentence();
    console.log('Final exercise:', finalExercise);
    
    // The exercise should remain exactly the same - no auto-cycling
    expect(finalExercise).toBe(initialExercise);
    
    // Additional verification: ensure we're still in learning mode
    expect(await page.locator('[data-testid="exercise-input"]').isVisible()).toBe(true);
  });

  test('should not auto-cycle when app is already configured (control test)', async ({ page }) => {
    // Get base URL from environment or default to localhost:3000
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    
    // Navigate to the application and wait for it to load
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Wait a moment for the app to initialize
    await page.waitForTimeout(2000);
    
    // Check if we're already in learning mode (app configured) or need to configure
    const exerciseInputVisible = await page.locator('[data-testid="exercise-input"]').isVisible();
    
    if (!exerciseInputVisible) {
      // App not configured, skip this test as it's not the scenario we're testing
      test.skip(true, 'App not configured - skipping UI navigation test');
      return;
    }
    
    // Helper function to extract exercise sentence from the card
    const getExerciseSentence = async () => {
      const exerciseText = await page.locator('.neo-card-lg').textContent();
      // Extract the sentence pattern with underscores
      const match = exerciseText?.match(/[\w\s]+___[\w\s]+/);
      return match ? match[0].trim() : exerciseText?.trim();
    };
    
    // Capture the initial exercise sentence
    const initialExercise = await getExerciseSentence();
    expect(initialExercise).toBeTruthy();
    console.log('Initial exercise (configured app):', initialExercise);
    
    // Wait for 5 seconds without any user interaction
    await page.waitForTimeout(5000);
    
    // Capture the exercise sentence after the wait period
    const finalExercise = await getExerciseSentence();
    console.log('Final exercise (configured app):', finalExercise);
    
    // The exercise should remain the same (this should pass as a control)
    expect(finalExercise).toBe(initialExercise);
  });

  test('should not auto-cycle during user interaction', async ({ page }) => {
    // Get base URL from environment or default to localhost:3000
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    
    // Navigate directly to the application
    await page.goto(baseUrl);
    
    // Wait for learning mode to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Helper function to extract exercise sentence from the card
    const getExerciseSentence = async () => {
      const exerciseText = await page.locator('.neo-card-lg').textContent();
      // Extract the sentence pattern with underscores
      const match = exerciseText?.match(/[\w\s]+___[\w\s]+/);
      return match ? match[0].trim() : exerciseText?.trim();
    };
    
    // Capture the initial exercise sentence
    const initialExercise = await getExerciseSentence();
    expect(initialExercise).toBeTruthy();
    
    // Type something in the input field (user interaction)
    await page.fill('[data-testid="exercise-input"]', 'test');
    
    // Wait for 3 seconds while there's user input
    await page.waitForTimeout(3000);
    
    // The exercise should still be the same
    const finalExercise = await getExerciseSentence();
    expect(finalExercise).toBe(initialExercise);
    
    // Input should still contain our text
    const inputValue = await page.inputValue('[data-testid="exercise-input"]');
    expect(inputValue).toBe('test');
  });
});