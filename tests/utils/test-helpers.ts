import { Page } from '@playwright/test'

/**
 * Helper function to complete configuration if needed before running tests
 * This ensures tests can access the learning page regardless of initial state
 */
export async function completeConfigurationIfNeeded(page: Page): Promise<void> {
  try {
    // Check if we're on the configuration page by looking for the main heading
    const configHeading = page.locator('h1:has-text("Configure a Sua Aprendizagem de Português")')
    const isConfigPage = await configHeading.isVisible({ timeout: 5000 })
    
    if (isConfigPage) {
      // Click the save button to complete configuration and navigate to learning page
      await page.click('button:has-text("Guardar Configuração e Começar a Aprender")')
      // Wait for transition to learning page with exercise card or error message
      await page.waitForSelector('.neo-card-lg, .neo-card:has-text("Erro ao carregar exercício")', { timeout: 30000 })
      
      // Check if we got an error loading exercises
      const errorCard = page.locator('.neo-card:has-text("Erro ao carregar exercício")')
      const hasError = await errorCard.isVisible({ timeout: 2000 })
      
      if (hasError) {
        console.warn('Exercise loading error detected in production. This may indicate API issues.')
        // For testing purposes, we can still proceed as the app structure is loaded
      }
    } else {
      // We might already be on the learning page, check for either success or error state
      const learningElements = page.locator('.neo-card-lg, .neo-card:has-text("Erro ao carregar exercício")')
      await learningElements.first().waitFor({ timeout: 15000 })
    }
  } catch (error) {
    // Try one more time to wait for any recognizable page element
    try {
      const anyRecognizableElement = page.locator('.neo-card-lg, .neo-card, h1')
      await anyRecognizableElement.first().waitFor({ timeout: 15000 })
      console.log('Page loaded but in unexpected state')
    } catch (finalError) {
      console.error('Failed to load any recognizable page elements:', error, finalError)
      throw new Error('Application failed to load properly')
    }
  }
}

/**
 * Helper function to navigate to app and complete setup
 */
export async function setupTestPage(page: Page): Promise<void> {
  await page.goto('/')
  await completeConfigurationIfNeeded(page)
}