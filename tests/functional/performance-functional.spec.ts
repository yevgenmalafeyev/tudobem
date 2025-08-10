import { test, expect } from '@playwright/test'

test.describe('Performance Functional Tests', () => {
  test.describe('Core Web Vitals', () => {
    test('should meet Core Web Vitals thresholds', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Measure Core Web Vitals
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {
            LCP: 0, // Largest Contentful Paint
            FID: 0, // First Input Delay
            CLS: 0  // Cumulative Layout Shift
          }
          
          // Measure LCP
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1]
            vitals.LCP = lastEntry.startTime
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Measure FID
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry) => {
              vitals.FID = entry.processingStart - entry.startTime
            })
          }).observe({ entryTypes: ['first-input'] })
          
          // Measure CLS
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry) => {
              vitals.CLS += entry.value
            })
          }).observe({ entryTypes: ['layout-shift'] })
          
          setTimeout(() => resolve(vitals), 5000)
        })
      })
      
      // Core Web Vitals thresholds
      expect(webVitals.LCP).toBeLessThan(2500) // LCP should be < 2.5s
      expect(webVitals.CLS).toBeLessThan(0.1)  // CLS should be < 0.1
      
      console.log('Core Web Vitals:', webVitals)
    })

    test('should have fast Time to Interactive (TTI)', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Wait for interactive elements
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.waitForSelector('text=Show options', { timeout: 5000 })
      
      const tti = Date.now() - startTime
      expect(tti).toBeLessThan(3000) // TTI should be < 3s
      
      console.log('Time to Interactive:', tti, 'ms')
    })
  })

  test.describe('Loading Performance', () => {
    test('should load initial content quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
      
      console.log('Initial load time:', loadTime, 'ms')
    })

    test('should handle subsequent page loads efficiently', async ({ page }) => {
      // Initial load
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Subsequent loads should be faster due to caching
      const startTime = Date.now()
      await page.reload()
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      const reloadTime = Date.now() - startTime
      expect(reloadTime).toBeLessThan(3000) // Reload should be faster
      
      console.log('Reload time:', reloadTime, 'ms')
    })

    test('should efficiently load multiple choice options', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      const startTime = Date.now()
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const optionLoadTime = Date.now() - startTime
      expect(optionLoadTime).toBeLessThan(2000) // Options should load within 2 seconds
      
      console.log('Multiple choice load time:', optionLoadTime, 'ms')
    })
  })

  test.describe('Runtime Performance', () => {
    test('should handle rapid interactions without lag', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Rapid mode switching
      const startTime = Date.now()
      
      for (let i = 0; i < 10; i++) {
        await page.click('text=Show options')
        await page.waitForTimeout(100)
        await page.click('text=Type answer')
        await page.waitForTimeout(100)
      }
      
      const rapidInteractionTime = Date.now() - startTime
      expect(rapidInteractionTime).toBeLessThan(5000) // Should handle rapid interactions
      
      console.log('Rapid interaction time:', rapidInteractionTime, 'ms')
    })

    test('should maintain performance during extended use', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Simulate extended use
      for (let i = 0; i < 5; i++) {
        await page.waitForSelector('text=___', { timeout: 10000 })
        
        const startTime = Date.now()
        
        // Complete an exercise
        await page.click('text=Show options')
        await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
        
        const options = await page.locator('[data-testid="multiple-choice-option"]').all()
        if (options.length > 0) {
          await options[0].click()
          await page.click('text=Check Answer')
          await page.waitForSelector('.neo-inset', { timeout: 10000 })
          
          if (i < 4) {
            await page.click('text=Next Exercise')
          }
        }
        
        const exerciseTime = Date.now() - startTime
        expect(exerciseTime).toBeLessThan(10000) // Each exercise should complete within 10s
        
        console.log(`Exercise ${i + 1} time:`, exerciseTime, 'ms')
      }
    })

    test('should handle memory efficiently', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as { memory?: { usedJSHeapSize: number } }).memory ? (performance as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize : 0
      })
      
      // Simulate intensive usage
      for (let i = 0; i < 10; i++) {
        await page.waitForSelector('text=___', { timeout: 10000 })
        await page.click('text=Show options')
        await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
        
        const options = await page.locator('[data-testid="multiple-choice-option"]').all()
        if (options.length > 0) {
          await options[0].click()
          await page.click('text=Check Answer')
          await page.waitForSelector('.neo-inset', { timeout: 10000 })
          
          if (i < 9) {
            await page.click('text=Next Exercise')
          }
        }
      }
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        return (performance as { memory?: { usedJSHeapSize: number } }).memory ? (performance as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize : 0
      })
      
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100
        
        // Memory should not increase by more than 50% during normal usage
        expect(memoryIncreasePercent).toBeLessThan(50)
        
        console.log('Memory increase:', memoryIncreasePercent.toFixed(2), '%')
      }
    })
  })

  test.describe('Network Performance', () => {
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
        await route.continue()
      })
      
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForSelector('text=___', { timeout: 15000 })
      
      const slowNetworkLoadTime = Date.now() - startTime
      expect(slowNetworkLoadTime).toBeLessThan(10000) // Should still load within 10s on slow network
      
      console.log('Slow network load time:', slowNetworkLoadTime, 'ms')
    })

    test('should efficiently handle API failures', async ({ page }) => {
      // Mock API failures
      await page.route('**/api/generate-batch-exercises', route => {
        route.abort('failed')
      })
      
      await page.route('**/api/generate-batch-exercises', route => {
        route.abort('failed')
      })
      
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      // Should still work with fallback
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const fallbackLoadTime = Date.now() - startTime
      expect(fallbackLoadTime).toBeLessThan(8000) // Should handle fallback efficiently
      
      console.log('Fallback load time:', fallbackLoadTime, 'ms')
    })

    test('should minimize network requests', async ({ page }) => {
      const requests = []
      
      // Track all network requests
      page.on('request', request => {
        requests.push(request.url())
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.waitForSelector('text=___', { timeout: 10000 })
      await page.click('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      // Should not make excessive network requests
      const apiRequests = requests.filter(url => url.includes('/api/'))
      expect(apiRequests.length).toBeLessThan(10) // Should make fewer than 10 API calls
      
      console.log('Total API requests:', apiRequests.length)
      console.log('API requests:', apiRequests)
    })
  })

  test.describe('Resource Efficiency', () => {
    test('should load minimal CSS and JS', async ({ page }) => {
      const resources = []
      
      // Track resource loading
      page.on('response', response => {
        if (response.url().includes('.css') || response.url().includes('.js')) {
          resources.push({
            url: response.url(),
            size: response.headers()['content-length'] || 0,
            type: response.url().includes('.css') ? 'CSS' : 'JS'
          })
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const totalSize = resources.reduce((sum, resource) => sum + parseInt(resource.size), 0)
      
      // Should not load excessive resources
      expect(totalSize).toBeLessThan(5000000) // Less than 5MB total
      
      console.log('Total resource size:', totalSize, 'bytes')
      console.log('Resources loaded:', resources.length)
    })

    test('should use efficient caching', async ({ page }) => {
      // Initial load
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const cachedRequests = []
      
      // Track cached requests on reload
      page.on('response', response => {
        if (response.headers()['cache-control'] || response.status() === 304) {
          cachedRequests.push(response.url())
        }
      })
      
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Should use caching effectively
      expect(cachedRequests.length).toBeGreaterThan(0)
      
      console.log('Cached requests:', cachedRequests.length)
    })
  })

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForSelector('text=___', { timeout: 10000 })
      
      const mobileLoadTime = Date.now() - startTime
      expect(mobileLoadTime).toBeLessThan(6000) // Mobile should load within 6s
      
      // Test mobile interactions
      await page.tap('text=Show options')
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 })
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all()
      if (options.length > 0) {
        const interactionStart = Date.now()
        await options[0].tap()
        const interactionTime = Date.now() - interactionStart
        
        expect(interactionTime).toBeLessThan(500) // Touch interaction should be fast
      }
      
      console.log('Mobile load time:', mobileLoadTime, 'ms')
    })
  })

  test.describe('Performance Monitoring', () => {
    test('should track performance metrics', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
        }
      })
      
      // Verify performance metrics are reasonable
      expect(metrics.domContentLoaded).toBeLessThan(2000) // DOM should load within 2s
      expect(metrics.firstPaint).toBeLessThan(1500) // First paint within 1.5s
      expect(metrics.firstContentfulPaint).toBeLessThan(2000) // FCP within 2s
      expect(metrics.totalLoadTime).toBeLessThan(5000) // Total load within 5s
      
      console.log('Performance metrics:', metrics)
    })

    test('should maintain consistent performance', async ({ page }) => {
      const loadTimes = []
      
      // Test multiple loads
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now()
        await page.goto('/')
        await page.waitForSelector('text=___', { timeout: 10000 })
        
        const loadTime = Date.now() - startTime
        loadTimes.push(loadTime)
        
        console.log(`Load ${i + 1}:`, loadTime, 'ms')
      }
      
      // Calculate consistency
      const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
      const maxVariation = Math.max(...loadTimes) - Math.min(...loadTimes)
      
      // Performance should be consistent (variation < 50% of average)
      expect(maxVariation).toBeLessThan(averageLoadTime * 0.5)
      
      console.log('Average load time:', averageLoadTime, 'ms')
      console.log('Max variation:', maxVariation, 'ms')
    })
  })
})