import { test, expect } from '@playwright/test';

test.describe('Production Debugging', () => {
  test('debug level filtering issue', async ({ page }) => {
    const apiRequests: any[] = [];
    const apiResponses: any[] = [];
    
    // Monitor API requests
    page.on('request', request => {
      if (request.url().includes('/api/generate-exercise')) {
        console.log('🔄 API Request URL:', request.url());
        try {
          const postData = request.postData();
          if (postData) {
            const parsedData = JSON.parse(postData);
            console.log('📝 Request data:', JSON.stringify(parsedData, null, 2));
            apiRequests.push(parsedData);
          }
        } catch (e) {
          console.log('❌ Could not parse request data');
        }
      }
    });
    
    // Monitor API responses
    page.on('response', async response => {
      if (response.url().includes('/api/generate-exercise')) {
        console.log('📥 API Response status:', response.status());
        try {
          const responseBody = await response.json();
          console.log('📄 Response data:', JSON.stringify(responseBody, null, 2));
          apiResponses.push(responseBody);
        } catch (e) {
          console.log('❌ Could not parse response body');
        }
      }
    });
    
    // Monitor console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || type === 'warn' || text.includes('level') || text.includes('exercise') || text.includes('configuration')) {
        console.log(`🖥️ Console ${type}:`, text);
      }
    });
    
    console.log('🌐 Navigating to production site...');
    await page.goto('https://portuguese-learning-app-theta.vercel.app');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if we're on configuration page
    const pageTitle = await page.title();
    console.log('📄 Page title:', pageTitle);
    
    const h1Element = await page.locator('h1').first();
    const heading = await h1Element.textContent();
    console.log('📄 Page heading:', heading);
    
    if (heading && (heading.includes('Configure') || heading.includes('Configuração'))) {
      console.log('⚙️ On configuration page, checking current state...');
      
      // Check initial state of level buttons
      const levelButtons = await page.locator('button').all();
      const initialLevels = [];
      
      for (const button of levelButtons) {
        const text = await button.textContent();
        const classes = await button.getAttribute('class');
        if (text && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(text.trim())) {
          const isSelected = classes?.includes('neo-button-primary');
          initialLevels.push({ level: text.trim(), selected: isSelected });
        }
      }
      
      console.log('📊 Initial level state:', initialLevels);
      
      // Deselect all levels first
      for (const levelInfo of initialLevels) {
        if (levelInfo.selected) {
          console.log(`🔘 Deselecting ${levelInfo.level}...`);
          await page.click(`button:has-text("${levelInfo.level}")`);
          await page.waitForTimeout(500);
        }
      }
      
      // Select only B2
      console.log('🔘 Selecting B2 level...');
      await page.click('button:has-text("B2")');
      await page.waitForTimeout(1000);
      
      // Verify B2 is selected
      const b2Button = page.locator('button:has-text("B2")');
      const b2Classes = await b2Button.getAttribute('class');
      console.log('📊 B2 button classes after selection:', b2Classes);
      
      // Check topics that are available for B2
      const topicCheckboxes = await page.locator('input[type="checkbox"]').all();
      const availableTopics = [];
      
      for (const checkbox of topicCheckboxes) {
        const isChecked = await checkbox.isChecked();
        const labelElement = await checkbox.locator('..').locator('span').first();
        const topicName = await labelElement.textContent();
        if (topicName) {
          availableTopics.push({ topic: topicName.trim(), selected: isChecked });
        }
      }
      
      console.log('📊 Available topics for B2:', availableTopics);
      
      // Save configuration
      console.log('💾 Saving configuration...');
      const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Save")');
      await saveButton.click();
      await page.waitForTimeout(3000);
    }
    
    // Now we should be on the learning page
    console.log('⏳ Waiting for learning page to load...');
    
    try {
      await page.waitForSelector('.neo-card-lg, .neo-card', { timeout: 15000 });
      console.log('✅ Learning page loaded');
    } catch (e) {
      console.log('❌ Could not find learning page elements');
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-production-state.png', fullPage: true });
      console.log('📸 Screenshot saved as debug-production-state.png');
    }
    
    // Check the store state in localStorage
    const storeState = await page.evaluate(() => {
      try {
        const storeData = localStorage.getItem('portuguese-learning-store');
        return storeData ? JSON.parse(storeData) : null;
      } catch (e) {
        return { error: 'Could not parse store data' };
      }
    });
    
    console.log('🏪 Store state from localStorage:');
    console.log(JSON.stringify(storeState, null, 2));
    
    // Generate a few exercises and observe the pattern
    for (let i = 0; i < 5; i++) {
      console.log(`\n🎯 Exercise ${i + 1}:`);
      
      try {
        // Wait for exercise to load
        await page.waitForSelector('.neo-card-lg, input[type="text"]', { timeout: 10000 });
        
        // Get exercise information
        const exerciseInfo = await page.evaluate(() => {
          const levelBadge = document.querySelector('[data-testid="exercise-level"], .neo-outset-sm');
          const exerciseCard = document.querySelector('.neo-card-lg');
          const exerciseText = exerciseCard ? exerciseCard.textContent : '';
          
          return {
            level: levelBadge ? levelBadge.textContent?.trim() : 'No level badge found',
            exercise: exerciseText ? exerciseText.substring(0, 200) : 'No exercise text found',
            hasLevelBadge: !!levelBadge,
            hasExerciseCard: !!exerciseCard
          };
        });
        
        console.log('📊 Level:', exerciseInfo.level);
        console.log('📝 Exercise preview:', exerciseInfo.exercise);
        console.log('🏷️ Has level badge:', exerciseInfo.hasLevelBadge);
        console.log('📄 Has exercise card:', exerciseInfo.hasExerciseCard);
        
        // Complete the exercise
        const input = page.locator('input[type="text"]');
        if (await input.isVisible()) {
          await input.fill('test');
          
          // Click check answer
          const checkButton = page.locator('button:has-text("Check"), button:has-text("Verificar")');
          await checkButton.click();
          await page.waitForTimeout(1000);
          
          // Move to next exercise
          const nextButton = page.locator('button:has-text("Next"), button:has-text("Próximo")');
          await nextButton.click();
          await page.waitForTimeout(2000);
        } else {
          console.log('❌ No input field found');
          break;
        }
        
      } catch (e) {
        console.log(`❌ Error on exercise ${i + 1}:`, e.message);
        break;
      }
    }
    
    console.log('\n📊 Summary of API interactions:');
    console.log('📤 Requests made:', apiRequests.length);
    console.log('📥 Responses received:', apiResponses.length);
    
    if (apiRequests.length > 0) {
      console.log('\n📤 Request details:');
      apiRequests.forEach((req, index) => {
        console.log(`Request ${index + 1}:`, JSON.stringify(req, null, 2));
      });
    }
    
    if (apiResponses.length > 0) {
      console.log('\n📥 Response details:');
      apiResponses.forEach((res, index) => {
        console.log(`Response ${index + 1}:`, JSON.stringify(res, null, 2));
      });
    }
    
    // Final store state check
    const finalStoreState = await page.evaluate(() => {
      try {
        const storeData = localStorage.getItem('portuguese-learning-store');
        return storeData ? JSON.parse(storeData) : null;
      } catch (e) {
        return { error: 'Could not parse store data' };
      }
    });
    
    console.log('\n🏪 Final store state:');
    console.log(JSON.stringify(finalStoreState, null, 2));
    
    // Keep the browser open for manual inspection
    await page.waitForTimeout(30000);
  });
});