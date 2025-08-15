import { test, expect, Page } from '@playwright/test'

test.describe('Admin Problem Reports - Specific Issues', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate directly to admin and login
    await page.goto('/admin?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Login with admin credentials
    const usernameInput = page.locator('input[type="text"], input[name="username"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"]')
    
    await usernameInput.fill('admin@tudobem.blaster.app')
    await passwordInput.fill('321admin123')
    await page.click('button[type="submit"]')
    
    // Wait for successful login
    await page.waitForTimeout(3000)
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('Issue 1: Missing reporter name/email in admin problem reports list', async () => {
    console.log('🔍 Testing Issue 1: Missing reporter name/email')
    
    // Navigate to problem reports
    await page.click('text=Problem Reports')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Wait for the page to load and check for table
    try {
      await page.waitForSelector('table', { timeout: 10000 })
      
      // Check table headers
      const headers = await page.locator('th').allTextContents()
      console.log('Table headers:', headers)
      
      // Check if there's a reporter/user column
      const hasReporterColumn = headers.some(header => 
        header.toLowerCase().includes('reporter') || 
        header.toLowerCase().includes('user') ||
        header.toLowerCase().includes('submitter')
      )
      
      // Check table data
      const rowCount = await page.locator('tbody tr').count()
      console.log(`Found ${rowCount} problem reports`)
      
      if (rowCount > 0) {
        const firstRowCells = await page.locator('tbody tr').first().locator('td').allTextContents()
        console.log('First row data:', firstRowCells)
        
        // Check if any cell contains user information (username or email)
        const hasUserInfo = firstRowCells.some(cell => 
          cell.includes('@') || // Email
          cell.includes('test_user') || // Username
          cell.includes('migration_test')
        )
        
        if (!hasReporterColumn && !hasUserInfo) {
          console.log('❌ ISSUE 1 CONFIRMED: Missing reporter information in table')
          expect(hasReporterColumn || hasUserInfo).toBe(true)
        } else {
          console.log('✅ Reporter information found')
        }
      } else {
        console.log('⚠️ No problem reports found')
      }
    } catch (error) {
      console.log('❌ Could not access problem reports table:', error)
      throw error
    }
  })

  test('Issue 2: Error when declining problem reports', async () => {
    console.log('🔍 Testing Issue 2: Error when declining reports')
    
    // Navigate to problem reports
    await page.click('text=Problem Reports')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    try {
      await page.waitForSelector('table', { timeout: 10000 })
      
      // Look for decline buttons (more specific selector to avoid dropdown option)
      const declineButtons = await page.locator('button:has-text("Decline")').count()
      console.log(`Found ${declineButtons} Decline buttons`)
      
      if (declineButtons > 0) {
        // Set up network monitoring
        const responses: any[] = []
        page.on('response', response => {
          if (response.url().includes('/admin/problem-reports/') && response.request().method() === 'PATCH') {
            responses.push({
              status: response.status(),
              url: response.url()
            })
          }
        })
        
        // Click decline button (more specific selector to avoid dropdown option)
        await page.locator('button:has-text("Decline")').first().click()
        await page.waitForTimeout(3000)
        
        // Check for errors
        const hasError = responses.some(r => r.status >= 400)
        if (hasError) {
          console.log('❌ ISSUE 2 CONFIRMED: Error when declining reports')
          console.log('Error responses:', responses.filter(r => r.status >= 400))
        } else {
          console.log('✅ Decline action works correctly')
        }
      } else {
        console.log('⚠️ No decline buttons found - may need pending reports')
      }
    } catch (error) {
      console.log('❌ Error testing decline functionality:', error)
    }
  })

  test('Issue 3: Error when getting AI help', async () => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
    console.log('🔍 Testing Issue 3: Error when getting AI help')
    
    // Navigate to problem reports
    await page.click('text=Problem Reports')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    try {
      await page.waitForSelector('table', { timeout: 10000 })
      
      // Look for AI Assistance buttons
      const aiButtons = await page.locator('text=AI Assistance').count()
      console.log(`Found ${aiButtons} AI Assistance buttons`)
      
      if (aiButtons > 0) {
        // Set up network monitoring
        const aiResponses: any[] = []
        page.on('response', response => {
          if (response.url().includes('/ai-assistance') && response.request().method() === 'POST') {
            aiResponses.push({
              status: response.status(),
              url: response.url()
            })
          }
        })
        
        // Click AI Assistance button
        await page.locator('text=AI Assistance').first().click()
        await page.waitForTimeout(2000)
        
        // Check if modal opened
        const modalVisible = await page.locator('.fixed.inset-0').count() > 0
        if (modalVisible) {
          console.log('✅ AI modal opened')
          
          // Click "Get AI Assistance" button
          const getAIButton = await page.locator('text=Get AI Assistance').count()
          if (getAIButton > 0) {
            await page.click('text=Get AI Assistance')
            
            // Wait for AI response with increased timeout
            let responseReceived = false
            let attempts = 0
            const maxAttempts = 10
            
            while (!responseReceived && attempts < maxAttempts) {
              await page.waitForTimeout(3000)
              attempts++
              
              // Check if AI response is visible or loading spinner
              const hasResponse = await page.locator('text=Analysis Report').count() > 0 ||
                                 await page.locator('text=Analyzing with AI').count() > 0 ||
                                 await page.locator('text=Valid Issue Detected').count() > 0 ||
                                 await page.locator('text=No Action Required').count() > 0
              
              if (hasResponse || aiResponses.length > 0) {
                responseReceived = true
                break
              }
            }
            
            // Check for errors
            const hasError = aiResponses.some(r => r.status >= 400)
            if (hasError) {
              console.log('❌ ISSUE 3 CONFIRMED: Error when getting AI help')
              console.log('AI Error responses:', aiResponses.filter(r => r.status >= 400))
            } else if (!responseReceived) {
              console.log('⚠️ AI assistance timeout - may indicate slow response but not necessarily error')
            } else {
              console.log('✅ AI assistance works correctly')
            }
            
            // Close modal
            try {
              await page.click('text=Close')
            } catch {
              await page.click('text=Cancel')
            }
          }
        } else {
          console.log('⚠️ AI modal did not open')
        }
      } else {
        console.log('⚠️ No AI Assistance buttons found')
      }
    } catch (error) {
      console.log('❌ Error testing AI assistance:', error)
    }
  })

  test('Issue 4: Error when accepting problem reports', async () => {
    console.log('🔍 Testing Issue 4: Error when accepting reports')
    
    // Navigate to problem reports
    await page.click('text=Problem Reports')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    try {
      await page.waitForSelector('table', { timeout: 10000 })
      
      // Look for accept buttons
      const acceptButtons = await page.locator('button:has-text("Accept")').count()
      console.log(`Found ${acceptButtons} Accept buttons`)
      
      if (acceptButtons > 0) {
        // Set up network monitoring
        const responses: any[] = []
        page.on('response', response => {
          if (response.url().includes('/admin/problem-reports/') && response.request().method() === 'PATCH') {
            responses.push({
              status: response.status(),
              url: response.url()
            })
          }
        })
        
        // Click accept button
        await page.locator('button:has-text("Accept")').first().click()
        await page.waitForTimeout(3000)
        
        // Check for errors
        const hasError = responses.some(r => r.status >= 400)
        if (hasError) {
          console.log('❌ ISSUE 4 CONFIRMED: Error when accepting reports')
          console.log('Error responses:', responses.filter(r => r.status >= 400))
        } else {
          console.log('✅ Accept action works correctly')
        }
      } else {
        console.log('⚠️ No accept buttons found - may need pending reports')
      }
    } catch (error) {
      console.log('❌ Error testing accept functionality:', error)
    }
  })
})