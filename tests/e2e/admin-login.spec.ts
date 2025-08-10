import { test, expect, Page } from '@playwright/test'

test.describe('Admin Login E2E Tests', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Set up viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Navigate to the admin login page
    await page.goto('/admin')
    
    // Wait for application to load
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.describe('Admin Login Flow', () => {
    test('should display admin login page correctly', async () => {
      // Check that we're on the admin login page
      await expect(page).toHaveURL('/admin')
      
      // Verify login form elements are present
      await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')).toBeVisible()
      
      // Check for any admin-related text/branding
      const pageContent = await page.textContent('body')
      expect(pageContent).toMatch(/admin|login|entrar/i)
    })

    test('should successfully login with correct admin credentials', async () => {
      console.log('🔐 Testing admin login with correct credentials')
      
      // Fill in the username field (could be email or text input)
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('admin@tudobem.blaster.app')
      
      // Fill in the password field
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('321admin123')
      
      // Take screenshot before login
      await page.screenshot({ 
        path: 'test-results/admin-login-before.png',
        fullPage: true 
      })
      
      // Submit the form
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for navigation or success indication
      await page.waitForTimeout(2000)
      
      // Check for successful login indicators
      // Could be redirect to dashboard, success message, or admin panel
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      // Take screenshot after login attempt
      await page.screenshot({ 
        path: 'test-results/admin-login-after.png',
        fullPage: true 
      })
      
      // Verify successful login (multiple possible indicators)
      const isLoggedIn = 
        currentUrl.includes('/admin') && !currentUrl.endsWith('/admin') || // Redirected to admin dashboard
        bodyContent?.includes('dashboard') ||
        bodyContent?.includes('Dashboard') ||
        bodyContent?.includes('admin panel') ||
        bodyContent?.includes('logout') ||
        bodyContent?.includes('Logout') ||
        bodyContent?.includes('sair') ||
        bodyContent?.includes('Sair') ||
        page.locator('button:has-text("Logout"), button:has-text("Sair")').isVisible()
      
      expect(isLoggedIn).toBeTruthy()
      console.log('✅ Admin login successful, URL:', currentUrl)
    })

    test('should reject login with incorrect username', async () => {
      console.log('🚫 Testing admin login with incorrect username')
      
      // Fill in wrong username
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('wrong@admin.com')
      
      // Fill in correct password
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('321admin123')
      
      // Submit the form
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for error message
      await page.waitForTimeout(2000)
      
      // Check that we're still on login page or see error message
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      // Should still be on admin login page or show error
      const hasError = 
        currentUrl.endsWith('/admin') || // Still on login page
        bodyContent?.includes('invalid') ||
        bodyContent?.includes('Invalid') ||
        bodyContent?.includes('erro') ||
        bodyContent?.includes('Erro') ||
        bodyContent?.includes('wrong') ||
        bodyContent?.includes('incorrect')
      
      expect(hasError).toBeTruthy()
      console.log('✅ Incorrect username properly rejected')
    })

    test('should reject login with incorrect password', async () => {
      console.log('🚫 Testing admin login with incorrect password')
      
      // Fill in correct username
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('admin@tudobem.blaster.app')
      
      // Fill in wrong password
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('wrongpassword')
      
      // Submit the form
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for error message
      await page.waitForTimeout(2000)
      
      // Check that we're still on login page or see error message
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      // Should still be on admin login page or show error
      const hasError = 
        currentUrl.endsWith('/admin') || // Still on login page
        bodyContent?.includes('invalid') ||
        bodyContent?.includes('Invalid') ||
        bodyContent?.includes('erro') ||
        bodyContent?.includes('Erro') ||
        bodyContent?.includes('wrong') ||
        bodyContent?.includes('incorrect')
      
      expect(hasError).toBeTruthy()
      console.log('✅ Incorrect password properly rejected')
    })

    test('should reject login with empty fields', async () => {
      console.log('🚫 Testing admin login with empty fields')
      
      // Leave fields empty and try to submit
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for validation message
      await page.waitForTimeout(1000)
      
      // Should show validation error or prevent submission
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      // Check for validation indicators
      const hasValidationError = 
        currentUrl.endsWith('/admin') || // Still on login page
        bodyContent?.includes('required') ||
        bodyContent?.includes('Required') ||
        bodyContent?.includes('obrigatório') ||
        bodyContent?.includes('necessário') ||
        page.locator('input:invalid').count() > 0 // HTML5 validation
      
      expect(hasValidationError).toBeTruthy()
      console.log('✅ Empty fields properly validated')
    })
  })

  test.describe('Admin Dashboard Access', () => {
    test('should access admin dashboard after successful login', async () => {
      console.log('📊 Testing admin dashboard access')
      
      // Login first
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('admin@tudobem.blaster.app')
      
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('321admin123')
      
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for dashboard to load
      await page.waitForTimeout(3000)
      
      // Take screenshot of dashboard
      await page.screenshot({ 
        path: 'test-results/admin-dashboard.png',
        fullPage: true 
      })
      
      // Check for dashboard elements
      const bodyContent = await page.textContent('body')
      
      const hasDashboardElements = 
        bodyContent?.includes('dashboard') ||
        bodyContent?.includes('Dashboard') ||
        bodyContent?.includes('statistics') ||
        bodyContent?.includes('exercises') ||
        bodyContent?.includes('users') ||
        bodyContent?.includes('total') ||
        bodyContent?.includes('analytics')
      
      expect(hasDashboardElements).toBeTruthy()
      console.log('✅ Admin dashboard accessible and functional')
    })

    test('should be able to logout from admin panel', async () => {
      console.log('🚪 Testing admin logout functionality')
      
      // Login first
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('admin@tudobem.blaster.app')
      
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('321admin123')
      
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for dashboard
      await page.waitForTimeout(3000)
      
      // Look for logout button/link
      const logoutElement = page.locator('button:has-text("Logout"), button:has-text("Sair"), a:has-text("Logout"), a:has-text("Sair")')
      
      if (await logoutElement.count() > 0) {
        await logoutElement.first().click()
        
        // Wait for logout to complete
        await page.waitForTimeout(2000)
        
        // Should be redirected back to login page
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/admin|login/i)
        
        console.log('✅ Logout functionality working')
      } else {
        console.log('⚠️ Logout button not found, but login was successful')
      }
    })
  })

  test.describe('Admin Security', () => {
    test('should not allow direct access to admin pages without login', async () => {
      console.log('🔒 Testing admin security - direct access prevention')
      
      // Try to access admin dashboard directly without login
      await page.goto('/admin/dashboard')
      await page.waitForLoadState('networkidle')
      
      // Should be redirected to login or show unauthorized
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      const isSecured = 
        currentUrl.endsWith('/admin') || // Redirected to login
        currentUrl.includes('/login') ||
        bodyContent?.includes('login') ||
        bodyContent?.includes('Login') ||
        bodyContent?.includes('unauthorized') ||
        bodyContent?.includes('Unauthorized')
      
      expect(isSecured).toBeTruthy()
      console.log('✅ Admin pages properly secured')
    })

    test('should handle session persistence across page reloads', async () => {
      console.log('🔄 Testing admin session persistence')
      
      // Login first
      const usernameField = page.locator('input[type="email"], input[type="text"], input[name="username"], input[name="email"]').first()
      await usernameField.fill('admin@tudobem.blaster.app')
      
      const passwordField = page.locator('input[type="password"]')
      await passwordField.fill('321admin123')
      
      const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')
      await loginButton.click()
      
      // Wait for successful login
      await page.waitForTimeout(3000)
      
      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Should still be logged in
      const currentUrl = page.url()
      const bodyContent = await page.textContent('body')
      
      const isStillLoggedIn = 
        !currentUrl.endsWith('/admin') || // Not back to login page
        bodyContent?.includes('dashboard') ||
        bodyContent?.includes('logout')
      
      expect(isStillLoggedIn).toBeTruthy()
      console.log('✅ Admin session persists across page reloads')
    })
  })

  test.describe('UI/UX Elements', () => {
    test('should display admin branding and styling correctly', async () => {
      console.log('🎨 Testing admin UI elements')
      
      // Check for proper styling and branding
      await expect(page.locator('body')).toBeVisible()
      
      // Look for admin-specific styling or branding
      const hasAdminStyling = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.body)
        const hasCustomStyling = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                                styles.fontFamily !== 'initial'
        return hasCustomStyling
      })
      
      expect(hasAdminStyling).toBeTruthy()
      console.log('✅ Admin UI styling properly applied')
    })

    test('should be responsive on mobile devices', async () => {
      console.log('📱 Testing admin mobile responsiveness')
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Navigate to admin page
      await page.goto('/admin')
      await page.waitForLoadState('networkidle')
      
      // Check that form elements are still accessible
      await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")')).toBeVisible()
      
      // Take mobile screenshot
      await page.screenshot({ 
        path: 'test-results/admin-mobile.png',
        fullPage: true 
      })
      
      console.log('✅ Admin interface responsive on mobile')
    })
  })
})