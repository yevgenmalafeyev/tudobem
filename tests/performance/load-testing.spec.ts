import { test, expect } from '@playwright/test';
import { 
  PerformanceMeasurer, 
  NetworkSimulator, 
  PerformanceAssertions,
  performanceHelpers 
} from './performance-utils';

/**
 * Load Testing and Stress Testing
 * 
 * Tests application performance under various load conditions
 * including rapid user interactions, extended usage, and concurrent operations.
 */

test.describe('Load and Stress Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await performanceHelpers.waitForStablePage(page);
  });

  test.describe('Rapid Interaction Testing', () => {
    test('should handle rapid input changes', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      await performanceHelpers.markPerformance(page, 'rapid-input-start');
      
      // Simulate rapid typing and clearing
      const inputField = page.locator('input[type="text"]');
      
      for (let i = 0; i < 100; i++) {
        await inputField.fill(`test${i}`);
        await page.waitForTimeout(10); // Very rapid input
        
        if (i % 10 === 0) {
          await inputField.clear();
        }
      }
      
      await performanceHelpers.markPerformance(page, 'rapid-input-end');
      
      const rapidInputTime = await measurer.measureCustomTiming('rapid-input-start', 'rapid-input-end');
      
      // Should handle rapid input efficiently
      expect(rapidInputTime).toBeLessThan(5000); // < 5s for 100 rapid inputs
      
      // Verify final state is correct
      await expect(inputField).toHaveValue('test99');
      
      // Check for memory leaks after rapid operations
      const metrics = await measurer.getAllMetrics();
      if (metrics.memoryUsage) {
        PerformanceAssertions.assertMemoryUsage(metrics.memoryUsage, 100);
      }
    });

    test('should handle rapid mode switching', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      await performanceHelpers.markPerformance(page, 'mode-switch-start');
      
      // Rapid switching between type answer and multiple choice
      for (let i = 0; i < 20; i++) {
        await page.click('text=Show options');
        await page.waitForTimeout(100);
        await page.click('text=Type answer');
        await page.waitForTimeout(100);
      }
      
      await performanceHelpers.markPerformance(page, 'mode-switch-end');
      
      const modeSwitchTime = await measurer.measureCustomTiming('mode-switch-start', 'mode-switch-end');
      
      // Mode switching should be efficient
      expect(modeSwitchTime).toBeLessThan(8000); // < 8s for 40 mode switches
      
      // Final state should be stable
      await expect(page.locator('input[type="text"]')).toBeVisible();
      
      // Layout should remain stable
      const finalMetrics = await measurer.measureCoreWebVitals(3000);
      expect(finalMetrics.CLS).toBeLessThan(0.15); // Allow slight increase due to rapid changes
    });

    test('should handle concurrent user actions', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      await performanceHelpers.markPerformance(page, 'concurrent-start');
      
      // Simulate concurrent actions (as much as possible in single browser context)
      const concurrentActions = [
        page.fill('input[type="text"]', 'concurrent1'),
        page.click('text=Show options'),
        page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 }),
      ];
      
      await Promise.all(concurrentActions);
      
      // Continue with more concurrent actions
      const moreActions = [
        page.click('text=Type answer'),
        page.fill('input[type="text"]', 'concurrent2'),
        page.click('text=Check Answer')
      ];
      
      await Promise.allSettled(moreActions); // Use allSettled to handle potential conflicts
      
      await performanceHelpers.markPerformance(page, 'concurrent-end');
      
      const concurrentTime = await measurer.measureCustomTiming('concurrent-start', 'concurrent-end');
      
      // Should handle concurrent actions gracefully
      expect(concurrentTime).toBeLessThan(3000); // < 3s for concurrent workflow
      
      // App should remain functional
      await expect(page.locator('.neo-card-lg')).toBeVisible();
    });
  });

  test.describe('Extended Usage Testing', () => {
    test('should maintain performance during extended session', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      const sessionMetrics = {
        exerciseCount: 0,
        totalTime: 0,
        exerciseTimes: [] as number[],
        memorySnapshots: [] as number[]
      };
      
      // Simulate extended learning session (20 exercises)
      for (let i = 0; i < 20; i++) {
        const exerciseStart = Date.now();
        
        // Complete an exercise
        await page.fill('input[type="text"]', `answer${i}`);
        await page.click('text=Check Answer');
        await page.waitForSelector('.neo-inset', { timeout: 10000 });
        
        // Take memory snapshot
        const currentMemory = await measurer.getMemoryUsage();
        if (currentMemory) {
          sessionMetrics.memorySnapshots.push(currentMemory.usedJSHeapSize);
        }
        
        if (i < 19) { // Don't click next on last exercise
          await page.click('text=Next Exercise');
          await page.waitForSelector('input[type="text"]', { timeout: 10000 });
        }
        
        const exerciseTime = Date.now() - exerciseStart;
        sessionMetrics.exerciseTimes.push(exerciseTime);
        sessionMetrics.totalTime += exerciseTime;
        sessionMetrics.exerciseCount++;
        
        console.log(`Exercise ${i + 1}: ${exerciseTime}ms`);
        
        // Brief pause to simulate realistic usage
        await page.waitForTimeout(500);
      }
      
      // Analyze session performance
      const avgExerciseTime = sessionMetrics.totalTime / sessionMetrics.exerciseCount;
      const firstFive = sessionMetrics.exerciseTimes.slice(0, 5);
      const lastFive = sessionMetrics.exerciseTimes.slice(-5);
      const firstAvg = firstFive.reduce((a, b) => a + b, 0) / firstFive.length;
      const lastAvg = lastFive.reduce((a, b) => a + b, 0) / lastFive.length;
      
      console.log(`📊 Extended Session Analysis:`);
      console.log(`  Total Exercises: ${sessionMetrics.exerciseCount}`);
      console.log(`  Total Time: ${(sessionMetrics.totalTime / 1000).toFixed(2)}s`);
      console.log(`  Average Exercise Time: ${avgExerciseTime.toFixed(2)}ms`);
      console.log(`  First 5 Average: ${firstAvg.toFixed(2)}ms`);
      console.log(`  Last 5 Average: ${lastAvg.toFixed(2)}ms`);
      
      // Performance should not degrade significantly
      expect(avgExerciseTime).toBeLessThan(8000); // Average < 8s per exercise
      expect(lastAvg).toBeLessThan(firstAvg * 1.3); // Last 5 not more than 30% slower
      
      // Memory usage analysis
      if (sessionMetrics.memorySnapshots.length > 1) {
        const initialMemory = sessionMetrics.memorySnapshots[0];
        const finalMemory = sessionMetrics.memorySnapshots[sessionMetrics.memorySnapshots.length - 1];
        const memoryIncrease = ((finalMemory - initialMemory) / initialMemory) * 100;
        
        console.log(`🧠 Memory Usage Change: ${memoryIncrease.toFixed(2)}%`);
        
        // Memory should not grow excessively
        expect(memoryIncrease).toBeLessThan(50); // < 50% memory increase
      }
      
      // Final performance check
      const finalMetrics = await measurer.getAllMetrics();
      performanceHelpers.logMetrics(finalMetrics, 'Extended Session Final');
    });

    test('should handle memory efficiently during long usage', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Get baseline memory
      const baselineMemory = await measurer.getMemoryUsage();
      
      // Simulate memory-intensive operations
      const memoryCheckpoints = [];
      
      for (let round = 0; round < 10; round++) {
        console.log(`Memory test round ${round + 1}/10`);
        
        // Perform multiple operations that might accumulate memory
        for (let i = 0; i < 10; i++) {
          await page.fill('input[type="text"]', `memory-test-${round}-${i}`);
          await page.click('text=Show options');
          await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 });
          await page.click('text=Type answer');
          await page.waitForTimeout(50);
        }
        
        // Check memory after each round
        const currentMemory = await measurer.getMemoryUsage();
        if (currentMemory && baselineMemory) {
          const memoryIncrease = currentMemory.usedJSHeapSize - baselineMemory.usedJSHeapSize;
          const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
          
          memoryCheckpoints.push({
            round: round + 1,
            memoryUsedMB: currentMemory.usedJSHeapSize / (1024 * 1024),
            memoryIncreaseMB
          });
          
          console.log(`  Memory used: ${memoryIncreaseMB.toFixed(2)}MB increase`);
        }
        
        // Brief pause between rounds
        await page.waitForTimeout(200);
      }
      
      // Analyze memory usage pattern
      if (memoryCheckpoints.length > 0) {
        const finalCheckpoint = memoryCheckpoints[memoryCheckpoints.length - 1];
        const midCheckpoint = memoryCheckpoints[Math.floor(memoryCheckpoints.length / 2)];
        
        console.log(`🧠 Memory Usage Analysis:`);
        console.log(`  Mid-session: ${midCheckpoint.memoryUsedMB.toFixed(2)}MB`);
        console.log(`  Final: ${finalCheckpoint.memoryUsedMB.toFixed(2)}MB`);
        console.log(`  Total increase: ${finalCheckpoint.memoryIncreaseMB.toFixed(2)}MB`);
        
        // Memory growth should be controlled
        expect(finalCheckpoint.memoryIncreaseMB).toBeLessThan(30); // < 30MB increase
        expect(finalCheckpoint.memoryUsedMB).toBeLessThan(100); // < 100MB total
      }
    });
  });

  test.describe('Stress Testing', () => {
    test('should handle high-frequency interactions', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      await performanceHelpers.markPerformance(page, 'stress-test-start');
      
      // High-frequency interactions stress test
      const stressMetrics = {
        totalOperations: 0,
        failures: 0,
        timeouts: 0
      };
      
      for (let batch = 0; batch < 10; batch++) {
        console.log(`Stress test batch ${batch + 1}/10`);
        
        // Rapid-fire operations
        for (let i = 0; i < 20; i++) {
          try {
            stressMetrics.totalOperations++;
            
            await page.fill('input[type="text"]', `stress${batch}${i}`, { timeout: 1000 });
            
            if (i % 3 === 0) {
              await page.click('text=Show options', { timeout: 1000 });
              await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 2000 });
              await page.click('text=Type answer', { timeout: 1000 });
            }
            
            await page.waitForTimeout(25); // Very short delay
            
          } catch (error) {
            if (error.message.includes('timeout')) {
              stressMetrics.timeouts++;
            } else {
              stressMetrics.failures++;
            }
            console.log(`  Operation ${i} failed: ${error.message.substring(0, 50)}...`);
          }
        }
        
        // Brief recovery period
        await page.waitForTimeout(100);
      }
      
      await performanceHelpers.markPerformance(page, 'stress-test-end');
      
      const stressTestTime = await measurer.measureCustomTiming('stress-test-start', 'stress-test-end');
      
      console.log(`🔥 Stress Test Results:`);
      console.log(`  Total Operations: ${stressMetrics.totalOperations}`);
      console.log(`  Failures: ${stressMetrics.failures}`);
      console.log(`  Timeouts: ${stressMetrics.timeouts}`);
      console.log(`  Success Rate: ${((stressMetrics.totalOperations - stressMetrics.failures - stressMetrics.timeouts) / stressMetrics.totalOperations * 100).toFixed(2)}%`);
      console.log(`  Total Time: ${(stressTestTime / 1000).toFixed(2)}s`);
      
      // Stress test acceptance criteria
      const successRate = (stressMetrics.totalOperations - stressMetrics.failures - stressMetrics.timeouts) / stressMetrics.totalOperations;
      expect(successRate).toBeGreaterThan(0.8); // > 80% success rate under stress
      
      // App should remain functional after stress test
      await expect(page.locator('.neo-card-lg')).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible();
      
      // Performance should recover after stress
      const postStressMetrics = await measurer.getAllMetrics();
      if (postStressMetrics.memoryUsage) {
        PerformanceAssertions.assertMemoryUsage(postStressMetrics.memoryUsage, 150);
      }
    });

    test('should recover from network stress', async ({ page }) => {
      const networkSim = new NetworkSimulator(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Apply severe network constraints
      await networkSim.simulateCustomNetwork({
        downloadThroughput: 100 * 1024, // 100 Kbps (very slow)
        uploadThroughput: 50 * 1024,    // 50 Kbps
        latency: 1000                   // 1 second latency
      });
      
      await performanceHelpers.markPerformance(page, 'network-stress-start');
      
      const networkStressMetrics = {
        operations: 0,
        timeouts: 0,
        completedInTime: 0
      };
      
      // Attempt operations under severe network stress
      for (let i = 0; i < 5; i++) {
        try {
          const operationStart = Date.now();
          
          await page.fill('input[type="text"]', `network-stress-${i}`);
          await page.click('text=Check Answer');
          await page.waitForSelector('.neo-inset', { timeout: 15000 });
          
          const operationTime = Date.now() - operationStart;
          networkStressMetrics.operations++;
          
          if (operationTime < 10000) { // Completed within 10s
            networkStressMetrics.completedInTime++;
          }
          
          console.log(`Network stress operation ${i + 1}: ${operationTime}ms`);
          
          if (i < 4) {
            await page.click('text=Next Exercise');
            await page.waitForSelector('input[type="text"]', { timeout: 15000 });
          }
          
        } catch (error) {
          networkStressMetrics.timeouts++;
          console.log(`Network stress operation ${i + 1} failed: ${error.message.substring(0, 50)}...`);
        }
      }
      
      // Remove network constraints
      await networkSim.disableThrottling();
      
      await performanceHelpers.markPerformance(page, 'network-stress-end');
      
      // Test recovery after network stress
      const recoveryStart = Date.now();
      await page.fill('input[type="text"]', 'recovery-test');
      await page.click('text=Check Answer');
      await page.waitForSelector('.neo-inset', { timeout: 10000 });
      const recoveryTime = Date.now() - recoveryStart;
      
      console.log(`🌐 Network Stress Results:`);
      console.log(`  Operations Attempted: ${networkStressMetrics.operations + networkStressMetrics.timeouts}`);
      console.log(`  Operations Completed: ${networkStressMetrics.operations}`);
      console.log(`  Completed in <10s: ${networkStressMetrics.completedInTime}`);
      console.log(`  Recovery Time: ${recoveryTime}ms`);
      
      // Network stress acceptance criteria
      expect(networkStressMetrics.operations).toBeGreaterThan(0); // At least some operations should complete
      expect(recoveryTime).toBeLessThan(5000); // Should recover quickly < 5s
      
      // App should be fully functional after network stress
      await expect(page.locator('.neo-inset')).toBeVisible();
    });

    test('should handle browser resource exhaustion gracefully', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Attempt to exhaust browser resources (within reasonable limits)
      const resourceExhaustionTest = async () => {
        const operations = [];
        
        // Create multiple promises that stress different resources
        for (let i = 0; i < 50; i++) {
          operations.push(
            page.evaluate((index) => {
              // Create some DOM elements to use memory
              const div = document.createElement('div');
              div.innerHTML = `Stress test element ${index}`.repeat(100);
              document.body.appendChild(div);
              
              // Remove it to test cleanup
              setTimeout(() => {
                document.body.removeChild(div);
              }, 100);
              
              return index;
            }, i)
          );
        }
        
        return Promise.allSettled(operations);
      };
      
      await performanceHelpers.markPerformance(page, 'resource-stress-start');
      
      const results = await resourceExhaustionTest();
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      await performanceHelpers.markPerformance(page, 'resource-stress-end');
      
      console.log(`💾 Resource Exhaustion Test:`);
      console.log(`  Operations Attempted: ${results.length}`);
      console.log(`  Successful: ${successful}`);
      console.log(`  Success Rate: ${(successful / results.length * 100).toFixed(2)}%`);
      
      // App should remain functional despite resource stress
      await expect(page.locator('.neo-card-lg')).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible();
      
      // Basic functionality should still work
      await page.fill('input[type="text"]', 'post-stress-test');
      await page.click('text=Check Answer');
      await page.waitForSelector('.neo-inset', { timeout: 10000 });
      await expect(page.locator('.neo-inset')).toBeVisible();
      
      // Memory should not be critically high
      const finalMetrics = await measurer.getAllMetrics();
      if (finalMetrics.memoryUsage) {
        // More lenient after stress test
        PerformanceAssertions.assertMemoryUsage(finalMetrics.memoryUsage, 200);
      }
    });
  });
});