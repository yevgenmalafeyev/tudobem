const puppeteer = require('puppeteer');

async function debugProduction() {
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser for debugging
    devtools: true   // Open devtools
  });
  
  const page = await browser.newPage();
  
  // Monitor network requests
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/api/generate-exercise')) {
      console.log('🔄 API Request:', request.url());
      console.log('📝 Request body:', request.postData());
      requests.push({
        url: request.url(),
        body: request.postData(),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('/api/generate-exercise')) {
      console.log('📥 API Response:', response.status());
      try {
        const responseBody = await response.text();
        console.log('📄 Response body:', responseBody);
      } catch (e) {
        console.log('❌ Could not read response body');
      }
    }
  });
  
  // Monitor console logs
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warn' || msg.text().includes('level') || msg.text().includes('exercise')) {
      console.log(`🖥️ Console ${type}:`, msg.text());
    }
  });
  
  try {
    console.log('🌐 Navigating to production site...');
    await page.goto('https://portuguese-learning-app-theta.vercel.app', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for initial page load...');
    await page.waitForTimeout(3000);
    
    // Check if we're on configuration page
    const configHeading = await page.$('h1');
    if (configHeading) {
      const headingText = await page.evaluate(el => el.textContent, configHeading);
      console.log('📄 Page heading:', headingText);
      
      if (headingText.includes('Configure') || headingText.includes('Configuração')) {
        console.log('⚙️ On configuration page, completing setup...');
        
        // Check current selected levels
        const selectedLevels = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons
            .filter(btn => btn.classList.contains('neo-button-primary'))
            .map(btn => btn.textContent.trim());
        });
        console.log('📊 Initially selected levels:', selectedLevels);
        
        // Select B2 level
        console.log('🔘 Selecting B2 level...');
        await page.click('button:contains("B2")'); // This might not work, let's try a different approach
        
        // Alternative approach to select B2
        const b2Button = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => btn.textContent.trim() === 'B2');
        });
        
        if (b2Button) {
          await page.click('button:contains("B2")');
          console.log('✅ B2 level selected');
        } else {
          console.log('❌ Could not find B2 button');
        }
        
        // Check levels after selection
        const newSelectedLevels = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons
            .filter(btn => btn.classList.contains('neo-button-primary'))
            .map(btn => btn.textContent.trim());
        });
        console.log('📊 After selection levels:', newSelectedLevels);
        
        // Save configuration
        console.log('💾 Saving configuration...');
        const saveButton = await page.$('button[class*="neo-button-success"]');
        if (saveButton) {
          await saveButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
    
    // Wait for learning page to load
    console.log('⏳ Waiting for learning page...');
    await page.waitForSelector('.neo-card-lg, .neo-card', { timeout: 15000 });
    
    // Generate a few exercises to see the pattern
    for (let i = 0; i < 5; i++) {
      console.log(`\n🎯 Exercise ${i + 1}:`);
      
      // Get current exercise info
      const exerciseInfo = await page.evaluate(() => {
        const levelBadge = document.querySelector('[data-testid="exercise-level"], .neo-outset-sm');
        const exerciseText = document.querySelector('.neo-card-lg');
        
        return {
          level: levelBadge ? levelBadge.textContent.trim() : 'No level found',
          exercise: exerciseText ? exerciseText.textContent.trim() : 'No exercise found'
        };
      });
      
      console.log('📊 Level:', exerciseInfo.level);
      console.log('📝 Exercise:', exerciseInfo.exercise.substring(0, 100));
      
      // Complete the exercise (just put any answer)
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.type('test');
        await page.click('button:contains("Check"), button:contains("Verificar")');
        await page.waitForTimeout(1000);
        
        // Move to next exercise
        await page.click('button:contains("Next"), button:contains("Próximo")');
        await page.waitForTimeout(2000);
      }
    }
    
    console.log('\n📊 Summary of requests:', requests);
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
  
  console.log('\n🏁 Debugging complete. Check the browser window for more details.');
  // Don't close browser immediately to allow manual inspection
  await page.waitForTimeout(60000);
  await browser.close();
}

debugProduction().catch(console.error);