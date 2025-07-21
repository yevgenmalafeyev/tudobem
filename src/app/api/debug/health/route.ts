import { NextRequest, NextResponse } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔍 [DEBUG] Health check endpoint called at', new Date().toISOString());
  
  try {
    // Check environment variables
    const envCheck = {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      postgresUrlPrefix: process.env.POSTGRES_URL?.substring(0, 30) + '...' || 'NOT_SET',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'NOT_SET',
    };
    console.log('🔍 [DEBUG] Environment check:', envCheck);
    
    // Check database availability
    console.log('🔍 [DEBUG] Checking database availability...');
    const dbStartTime = Date.now();
    const isDatabaseAvailable = SmartDatabase.isDatabaseAvailable();
    const dbCheckTime = Date.now() - dbStartTime;
    console.log('🔍 [DEBUG] Database availability check completed in', dbCheckTime, 'ms:', isDatabaseAvailable);
    
    // Try a simple database operation
    let dbTestResult = null;
    if (isDatabaseAvailable) {
      try {
        console.log('🔍 [DEBUG] Testing database connection...');
        const testStartTime = Date.now();
        const testExercises = await SmartDatabase.getExercises({ levels: ['A1'], limit: 1 });
        const testTime = Date.now() - testStartTime;
        dbTestResult = {
          success: true,
          exerciseCount: testExercises.length,
          responseTime: testTime
        };
        console.log('🔍 [DEBUG] Database test completed in', testTime, 'ms');
      } catch (dbError) {
        console.error('🔍 [DEBUG] Database test failed:', dbError);
        dbTestResult = {
          success: false,
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        };
      }
    }
    
    const totalTime = Date.now() - startTime;
    const healthStatus = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        available: isDatabaseAvailable,
        test: dbTestResult
      },
      responseTime: totalTime,
      status: 'healthy'
    };
    
    console.log('🔍 [DEBUG] Health check completed in', totalTime, 'ms');
    return NextResponse.json(healthStatus);
    
  } catch (error) {
    console.error('🔍 [DEBUG] Health check failed:', error);
    const errorStatus = {
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime
    };
    
    return NextResponse.json(errorStatus, { status: 500 });
  }
}