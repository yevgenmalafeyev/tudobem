import { test, expect, Page } from '@playwright/test'

test.describe('Admin Problem Reports - Comprehensive Issues Detection', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate to the application
    await page.goto('/?e2e-test=true')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('should detect all 4 admin problem reports issues', async () => {
    console.log('🧪 Testing admin problem reports comprehensive issues')
    
    // First, submit a problem report as a user to have data
    console.log('📝 Step 1: Submit a problem report as a user')
    
    // Navigate to learning mode to submit a report
    await page.click('text=Verbos Irregulares')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h2', { timeout: 10000 })
    
    // Switch to text input mode and answer incorrectly to trigger report button
    await page.click('text=Digitar Resposta')
    await page.waitForTimeout(1000)
    await page.waitForSelector('input[type="text"]', { timeout: 10000 })
    
    // Give a wrong answer
    await page.fill('input[type="text"]', 'wrong_answer')
    await page.keyboard.press('Enter')
    
    // Wait for feedback to show
    await page.waitForSelector('text=❌ Incorreto', { timeout: 5000 })
    
    // Look for the report problem button
    const reportButtonVisible = await page.locator('text=Reportar Problema').count() > 0
    if (reportButtonVisible) {
      console.log('✅ Report button found, submitting problem report')
      await page.click('text=Reportar Problema')
      await page.waitForTimeout(1000)
      
      // Fill the problem report form
      const problemTypeSelect = page.locator('select').first()
      await problemTypeSelect.selectOption('incorrect_answer')
      
      const commentTextarea = page.locator('textarea')
      await commentTextarea.fill('This answer seems incorrect. I believe the correct answer should be different.')
      
      await page.click('text=Enviar Relatório')
      await page.waitForTimeout(2000)
    } else {
      console.log('⚠️ Report button not found, continuing with existing data')
    }

    // Navigate back to home and then to admin
    console.log('📝 Step 2: Navigate to admin area')
    await page.goto('/?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Go to admin login
    await page.goto('/admin?e2e-test=true')
    await page.waitForLoadState('networkidle')
    
    // Try to login as admin (assuming test credentials)
    const loginForm = await page.locator('form').count()
    if (loginForm > 0) {
      console.log('🔑 Admin login form found, attempting login')
      
      // Try common test credentials
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      if (await emailInput.count() > 0) {
        await emailInput.fill('admin@tudobem.com')
        await passwordInput.fill('admin123')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(3000)
      }
    }
    
    // Navigate to problem reports section
    console.log('📝 Step 3: Navigate to problem reports moderation')
    await page.goto('/admin/problem-reports?e2e-test=true')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // ISSUE 1: Check if reporter name/email is missing
    console.log('🔍 Issue 1: Checking for missing reporter name/email')
    
    await page.waitForSelector('table', { timeout: 10000 })
    const tableHeaders = await page.locator('th').allTextContents()
    console.log('Table headers found:', tableHeaders)
    
    // Check if there's a column for reporter information
    const hasReporterColumn = tableHeaders.some(header => 
      header.toLowerCase().includes('reporter') || 
      header.toLowerCase().includes('user') ||
      header.toLowerCase().includes('email') ||
      header.toLowerCase().includes('name')
    )
    
    if (!hasReporterColumn) {
      console.log('❌ ISSUE 1 DETECTED: Missing reporter name/email column')
    } else {
      console.log('✅ Reporter column found')
    }
    
    // Check table rows for reporter information
    const tableRows = await page.locator('tbody tr').count()
    if (tableRows > 0) {
      console.log(`Found ${tableRows} problem reports`)
      
      // Get the first row to check if it has reporter info
      const firstRowCells = await page.locator('tbody tr').first().locator('td').allTextContents()
      console.log('First row data:', firstRowCells)
      
      // Check if any cell contains email or name information
      const hasReporterData = firstRowCells.some(cell => 
        cell.includes('@') || // Email
        (cell.length > 3 && !cell.includes('#') && !cell.includes('pending') && !cell.includes('Accept'))
      )
      
      if (!hasReporterData) {
        console.log('❌ ISSUE 1 CONFIRMED: No reporter information in table data')
      }
    }
    
    // ISSUE 2 & 4: Test accept/decline actions
    if (tableRows > 0) {
      console.log('🔍 Issue 2 & 4: Testing accept/decline actions')
      
      // Look for action buttons
      const acceptButtons = await page.locator('text=Accept').count()
      const declineButtons = await page.locator('text=Decline').count()
      
      if (acceptButtons > 0 && declineButtons > 0) {
        console.log(`Found ${acceptButtons} Accept and ${declineButtons} Decline buttons`)
        
        // Test decline action (Issue 2)
        console.log('🔍 Testing decline action...')
        try {
          // Set up network request monitoring
          const responsePromise = page.waitForResponse(response => 
            response.url().includes('/admin/problem-reports/') && response.request().method() === 'PATCH'
          )
          
          await page.locator('text=Decline').first().click()
          await page.waitForTimeout(1000)
          
          const response = await responsePromise
          const responseBody = await response.json().catch(() => null)
          
          if (!response.ok() || responseBody?.error) {
            console.log('❌ ISSUE 2 DETECTED: Error when declining reports')
            console.log('Response status:', response.status())
            console.log('Response body:', responseBody)
          } else {
            console.log('✅ Decline action works correctly')
          }
        } catch (error) {
          console.log('❌ ISSUE 2 CONFIRMED: Error when declining reports:', error)
        }
        
        // Test accept action (Issue 4) - only if we still have pending reports
        const remainingAcceptButtons = await page.locator('text=Accept').count()
        if (remainingAcceptButtons > 0) {
          console.log('🔍 Testing accept action...')
          try {
            const acceptResponsePromise = page.waitForResponse(response => 
              response.url().includes('/admin/problem-reports/') && response.request().method() === 'PATCH'
            )
            
            await page.locator('text=Accept').first().click()
            await page.waitForTimeout(1000)
            
            const acceptResponse = await acceptResponsePromise
            const acceptResponseBody = await acceptResponse.json().catch(() => null)
            
            if (!acceptResponse.ok() || acceptResponseBody?.error) {
              console.log('❌ ISSUE 4 DETECTED: Error when accepting reports')
              console.log('Response status:', acceptResponse.status())
              console.log('Response body:', acceptResponseBody)
            } else {
              console.log('✅ Accept action works correctly')
            }
          } catch (error) {
            console.log('❌ ISSUE 4 CONFIRMED: Error when accepting reports:', error)
          }
        }
      } else {
        console.log('⚠️ No action buttons found - reports may not be in pending status')
      }
      
      // ISSUE 3: Test AI assistance
      console.log('🔍 Issue 3: Testing AI assistance')
      
      // Look for AI Assistance buttons
      const aiButtons = await page.locator('text=AI Assistance').count()
      
      if (aiButtons > 0) {
        console.log(`Found ${aiButtons} AI Assistance buttons`)
        
        try {
          // Set up network request monitoring for AI assistance
          const aiResponsePromise = page.waitForResponse(response => 
            response.url().includes('/ai-assistance') && response.request().method() === 'POST'
          )
          
          await page.locator('text=AI Assistance').first().click()
          await page.waitForTimeout(2000)
          
          // Check if modal opened
          const modalVisible = await page.locator('.fixed.inset-0').count() > 0
          if (modalVisible) {
            console.log('✅ AI Assistance modal opened')
            
            // Look for "Get AI Assistance" button in modal
            const getAIButton = await page.locator('text=Get AI Assistance').count()
            if (getAIButton > 0) {
              console.log('🔍 Testing AI assistance request...')
              
              await page.click('text=Get AI Assistance')
              
              const aiResponse = await aiResponsePromise
              const aiResponseBody = await aiResponse.json().catch(() => null)
              
              if (!aiResponse.ok() || aiResponseBody?.error) {
                console.log('❌ ISSUE 3 DETECTED: Error when getting AI help')
                console.log('AI Response status:', aiResponse.status())
                console.log('AI Response body:', aiResponseBody)
              } else {
                console.log('✅ AI assistance works correctly')
              }
              
              // Close modal
              await page.click('text=Cancel')
            }
          } else {
            console.log('⚠️ AI Assistance modal did not open')
          }
        } catch (error) {
          console.log('❌ ISSUE 3 CONFIRMED: Error when getting AI help:', error)
        }
      } else {
        console.log('⚠️ No AI Assistance buttons found - reports may not be in pending status')
      }
    } else {
      console.log('⚠️ No problem reports found in the table')
    }
    
    console.log('✅ Comprehensive admin problem reports issues testing completed')
  })
})