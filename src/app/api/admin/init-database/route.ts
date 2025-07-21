import { NextResponse } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';

export async function POST() {
  const startTime = Date.now();
  console.log('🗄️ [DEBUG] Database initialization endpoint called at', new Date().toISOString());
  
  try {
    // Check if database is available
    console.log('🗄️ [DEBUG] Checking database availability...');
    const isDatabaseAvailable = SmartDatabase.isDatabaseAvailable();
    if (!isDatabaseAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Database is not available'
      }, { status: 500 });
    }
    
    console.log('🗄️ [DEBUG] Database is available, initializing tables...');
    
    // Initialize database tables
    await SmartDatabase.initializeTables();
    
    console.log('🗄️ [DEBUG] Database tables initialized successfully');
    
    // Try to query tables to verify they exist
    console.log('🗄️ [DEBUG] Verifying table creation...');
    const testExercises = await SmartDatabase.getExercises({ levels: ['A1'], limit: 1 });
    
    const totalTime = Date.now() - startTime;
    const result = {
      success: true,
      message: 'Database initialized successfully',
      tableVerification: {
        exercisesTable: true,
        testQuery: testExercises.length >= 0 // Should be 0 or more (empty table is OK)
      },
      responseTime: totalTime,
      timestamp: new Date().toISOString()
    };
    
    console.log('🗄️ [DEBUG] Database initialization completed in', totalTime, 'ms');
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('🗄️ [DEBUG] Database initialization failed:', error);
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResult, { status: 500 });
  }
}