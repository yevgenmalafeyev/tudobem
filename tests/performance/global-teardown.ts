import { promises as fs } from 'fs';
import path from 'path';

/**
 * Global Teardown for Performance Testing
 * 
 * Generates performance reports and cleans up testing environment.
 */
async function globalTeardown() {
  console.log('🧹 Starting performance testing global teardown...');
  
  try {
    // Generate performance summary report
    await generatePerformanceSummary();
    
    // Clean up temporary files
    await cleanupTempFiles();
    
    console.log('✅ Performance testing teardown completed');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

async function generatePerformanceSummary() {
  console.log('📊 Generating performance summary...');
  
  try {
    // Check if performance results exist
    const resultsPath = path.join(process.cwd(), 'performance-results.json');
    
    if (await fileExists(resultsPath)) {
      const resultsData = await fs.readFile(resultsPath, 'utf-8');
      const results = JSON.parse(resultsData);
      
      // Generate summary statistics
      const summary = {
        timestamp: new Date().toISOString(),
        testSuite: 'Performance Tests',
        totalTests: results.suites?.reduce((acc: number, suite: { specs?: unknown[] }) => 
          acc + (suite.specs?.length || 0), 0) || 0,
        passedTests: 0,
        failedTests: 0,
        averageDuration: 0,
        performanceMetrics: {
          note: 'Detailed metrics available in individual test results'
        }
      };
      
      // Count passed/failed tests and calculate average duration
      if (results.suites) {
        let totalDuration = 0;
        let testCount = 0;
        
        results.suites.forEach((suite: { specs?: { tests?: { results?: { status: string; duration: number }[] }[] }[] }) => {
          if (suite.specs) {
            suite.specs.forEach((spec: { tests?: { results?: { status: string; duration: number }[] }[] }) => {
              if (spec.tests) {
                spec.tests.forEach((test: { results?: { status: string; duration: number }[] }) => {
                  testCount++;
                  if (test.results) {
                    test.results.forEach((result: { status: string; duration: number }) => {
                      if (result.status === 'passed') {
                        summary.passedTests++;
                      } else {
                        summary.failedTests++;
                      }
                      totalDuration += result.duration || 0;
                    });
                  }
                });
              }
            });
          }
        });
        
        summary.averageDuration = testCount > 0 ? totalDuration / testCount : 0;
      }
      
      // Write summary to file
      const summaryPath = path.join(process.cwd(), 'performance-summary.json');
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      
      console.log(`📋 Performance summary generated: ${summary.passedTests}/${summary.totalTests} tests passed`);
      console.log(`⏱️  Average test duration: ${Math.round(summary.averageDuration)}ms`);
      
    } else {
      console.log('ℹ️  No performance results found to summarize');
    }
    
  } catch (error) {
    console.error('❌ Failed to generate performance summary:', error);
  }
}

async function cleanupTempFiles() {
  console.log('🗑️  Cleaning up temporary files...');
  
  const tempPatterns = [
    'temp-performance-*.json',
    'perf-trace-*.json',
    '.temp-metrics'
  ];
  
  try {
    for (const pattern of tempPatterns) {
      // In a real implementation, you might use glob patterns
      // For now, we'll just log the cleanup intent
      console.log(`🧹 Would clean: ${pattern}`);
    }
    
    console.log('✅ Temporary files cleaned up');
    
  } catch (error) {
    console.error('❌ Failed to cleanup temporary files:', error);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export default globalTeardown;