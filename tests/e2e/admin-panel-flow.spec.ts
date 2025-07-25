import { test, expect } from '@playwright/test';
import { setupErrorMonitoring, validateNoErrors, E2EErrorMonitor } from '../utils/errorMonitoring';

// Load configuration for API key testing
import fs from 'fs';
import path from 'path';

let REAL_API_KEY: string | null = null;
let hasRealApiKey = false;

try {
  const configPath = path.join(process.cwd(), 'local-config.json');
  if (fs.existsSync(configPath)) {
    const localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    REAL_API_KEY = localConfig.anthropicApiKey;
    hasRealApiKey = !!REAL_API_KEY && REAL_API_KEY.startsWith('sk-ant-');
  }
} catch (error) {
  console.warn('⚠️  Could not load local-config.json for admin test');
}

test.describe('Admin Panel Flow', () => {
  let errorMonitor: E2EErrorMonitor;
  
  test.beforeEach(async ({ page }) => {
    errorMonitor = await setupErrorMonitoring(page);
    
    page.on('console', msg => {
      if (msg.text().includes('🤖 [ADMIN]') || msg.text().includes('🤖 [AUTO-GEN]')) {
        console.log(`🖥️ ADMIN: ${msg.text()}`);
      }
    });
    
    await page.context().clearCookies();
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
    await page.goto(baseURL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.afterEach(async () => {
    try {
      await validateNoErrors(errorMonitor, {
        allowWarnings: true,
        allowNetworkErrors: false
      });
    } catch (error) {
      console.error('🚨 Error validation failed:', error.message);
      throw error;
    } finally {
      errorMonitor.stopMonitoring();
    }
  });

  test('admin login and authentication flow', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('🧪 Testing admin login flow');

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Test admin login via API
    const loginResponse = await page.request.post(`${baseURL}/api/admin/login`, {
      data: {
        username: 'admin',
        password: '321admin123'
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginResult = await loginResponse.json();
    expect(loginResult.success).toBe(true);
    expect(loginResult.data.admin.username).toBe('admin');
    expect(loginResult.data.admin.role).toBe('admin');
    console.log('✅ Admin login successful');

    // Test accessing admin stats
    const statsResponse = await page.request.get(`${baseURL}/api/admin/stats`);
    expect(statsResponse.ok()).toBeTruthy();
    const statsResult = await statsResponse.json();
    expect(statsResult.success).toBe(true);
    expect(statsResult.data.summary).toBeDefined();
    console.log('✅ Admin stats accessible');

    // Test admin logout
    const logoutResponse = await page.request.post(`${baseURL}/api/admin/logout`);
    expect(logoutResponse.ok()).toBeTruthy();
    const logoutResult = await logoutResponse.json();
    expect(logoutResult.success).toBe(true);
    console.log('✅ Admin logout successful');

    // Verify access is denied after logout
    const statsAfterLogout = await page.request.get(`${baseURL}/api/admin/stats`);
    expect(statsAfterLogout.status()).toBe(401);
    console.log('✅ Access properly denied after logout');

    console.log('🎉 Admin authentication flow completed successfully!');
  });

  test('admin API key management', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('🧪 Testing admin API key management');

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Login as admin
    await page.request.post(`${baseURL}/api/admin/login`, {
      data: { username: 'admin', password: '321admin123' }
    });

    // Get current API key
    const getKeyResponse = await page.request.get(`${baseURL}/api/admin/api-key`);
    expect(getKeyResponse.ok()).toBeTruthy();
    const getKeyResult = await getKeyResponse.json();
    expect(getKeyResult.success).toBe(true);
    console.log('✅ API key retrieval successful');

    // Test updating API key with invalid format
    const invalidKeyResponse = await page.request.post(`${baseURL}/api/admin/api-key`, {
      data: { apiKey: 'invalid-key-format' }
    });
    expect(invalidKeyResponse.status()).toBe(400);
    console.log('✅ Invalid API key properly rejected');

    // Test updating API key with valid format
    const validKey = 'sk-ant-api03-test-key-for-testing';
    const validKeyResponse = await page.request.post(`${baseURL}/api/admin/api-key`, {
      data: { apiKey: validKey }
    });
    expect(validKeyResponse.ok()).toBeTruthy();
    const validKeyResult = await validKeyResponse.json();
    expect(validKeyResult.success).toBe(true);
    console.log('✅ Valid API key update successful');

    // Verify the key was saved
    const verifyKeyResponse = await page.request.get(`${baseURL}/api/admin/api-key`);
    const verifyKeyResult = await verifyKeyResponse.json();
    expect(verifyKeyResult.data.apiKey).toBe(validKey);
    console.log('✅ API key persistence verified');

    console.log('🎉 Admin API key management completed successfully!');
  });

  test.skip(!hasRealApiKey, 'Real API key required for exercise generation test');

  test('admin exercise generation', async ({ page }) => {
    test.setTimeout(60000); // AI generation takes time
    
    console.log('🧪 Testing admin exercise generation');

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Login as admin
    await page.request.post(`${baseURL}/api/admin/login`, {
      data: { username: 'admin', password: '321admin123' }
    });

    // Set real API key
    await page.request.post(`${baseURL}/api/admin/api-key`, {
      data: { apiKey: REAL_API_KEY! }
    });

    // Test manual exercise generation
    const generateResponse = await page.request.post(`${baseURL}/api/admin/generate`, {
      data: {
        topics: ['verbos', 'substantivos'],
        levels: ['A1'],
        count: 2
      }
    });

    expect(generateResponse.ok()).toBeTruthy();
    const generateResult = await generateResponse.json();
    expect(generateResult.success).toBe(true);
    expect(generateResult.data.generated.total).toBeGreaterThan(0);
    console.log(`✅ Generated ${generateResult.data.generated.total} exercises`);

    // Test auto-generation
    const autoGenResponse = await page.request.post(`${baseURL}/api/admin/auto-generate`, {
      data: {
        targetCounts: {
          'A1': 50,
          'A2': 30
        },
        topics: ['verbos']
      }
    });

    expect(autoGenResponse.ok()).toBeTruthy();
    const autoGenResult = await autoGenResponse.json();
    expect(autoGenResult.success).toBe(true);
    expect(autoGenResult.data.summary.levelsProcessed).toBe(2);
    console.log(`✅ Auto-generation processed ${autoGenResult.data.summary.levelsProcessed} levels`);

    console.log('🎉 Admin exercise generation completed successfully!');
  });

  test('admin database statistics', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('🧪 Testing admin database statistics');

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Login as admin
    await page.request.post(`${baseURL}/api/admin/login`, {
      data: { username: 'admin', password: '321admin123' }
    });

    // Get database statistics
    const statsResponse = await page.request.get(`${baseURL}/api/admin/stats`);
    expect(statsResponse.ok()).toBeTruthy();
    const statsResult = await statsResponse.json();
    
    expect(statsResult.success).toBe(true);
    expect(statsResult.data.summary).toBeDefined();
    expect(statsResult.data.database).toBeDefined();
    
    const summary = statsResult.data.summary;
    expect(typeof summary.totalUsers).toBe('number');
    expect(typeof summary.activeUsers).toBe('number');
    expect(typeof summary.totalExercises).toBe('number');
    expect(typeof summary.totalAttempts).toBe('number');
    expect(typeof summary.overallAccuracy).toBe('string');
    
    console.log('📊 Database Statistics:');
    console.log(`   Total Users: ${summary.totalUsers}`);
    console.log(`   Active Users: ${summary.activeUsers}`);
    console.log(`   Total Exercises: ${summary.totalExercises}`);
    console.log(`   Total Attempts: ${summary.totalAttempts}`);
    console.log(`   Overall Accuracy: ${summary.overallAccuracy}%`);

    expect(statsResult.data.database.exercises).toBeDefined();
    expect(statsResult.data.database.users).toBeDefined();
    
    console.log('✅ Database statistics retrieved successfully');

    console.log('🎉 Admin database statistics completed successfully!');
  });

  test('unauthorized admin access prevention', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('🧪 Testing unauthorized admin access prevention');

    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

    // Test accessing admin endpoints without authentication
    const endpoints = [
      '/api/admin/stats',
      '/api/admin/api-key',
      '/api/admin/generate',
      '/api/admin/auto-generate'
    ];

    for (const endpoint of endpoints) {
      const response = await page.request.get(`${baseURL}${endpoint}`);
      expect(response.status()).toBe(401);
      console.log(`✅ ${endpoint} properly protected`);
    }

    // Test with wrong admin credentials
    const wrongLoginResponse = await page.request.post(`${baseURL}/api/admin/login`, {
      data: {
        username: 'admin',
        password: 'wrongpassword'
      }
    });

    expect(wrongLoginResponse.status()).toBe(401);
    console.log('✅ Wrong credentials properly rejected');

    // Test with wrong username
    const wrongUserResponse = await page.request.post(`${baseURL}/api/admin/login`, {
      data: {
        username: 'wrongadmin',
        password: '321admin123'
      }
    });

    expect(wrongUserResponse.status()).toBe(401);
    console.log('✅ Wrong username properly rejected');

    console.log('🎉 Unauthorized access prevention completed successfully!');
  });
});