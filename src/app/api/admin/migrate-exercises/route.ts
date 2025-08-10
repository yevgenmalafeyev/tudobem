import { NextResponse } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';
import { EnhancedFallbackService } from '@/services/enhancedFallbackService';

export async function POST() {
  const startTime = Date.now();
  console.log('🔄 [DEBUG] Exercise migration endpoint called at', new Date().toISOString());
  
  try {
    // Check if database is available
    console.log('🔄 [DEBUG] Checking database availability...');
    const isDatabaseAvailable = SmartDatabase.isDatabaseAvailable();
    if (!isDatabaseAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Database is not available'
      }, { status: 500 });
    }
    
    console.log('🔄 [DEBUG] Database is available, starting migration...');
    
    // Check current database state
    console.log('🔄 [DEBUG] Checking current database state...');
    const currentStats = await SmartDatabase.getUsageStats();
    console.log('🔄 [DEBUG] Current database stats:', {
      total: currentStats.totalExercises,
      byLevel: currentStats.exercisesByLevel,
      byTopic: currentStats.exercisesByTopic
    });
    
    // Migrate static exercises
    console.log('🔄 [DEBUG] Migrating static exercises to database...');
    const migratedCount = await EnhancedFallbackService.populateFromStaticExercises();
    console.log('🔄 [DEBUG] Migrated', migratedCount, 'exercises');
    
    // Check final state
    console.log('🔄 [DEBUG] Checking final database state...');
    const finalStats = await SmartDatabase.getUsageStats();
    console.log('🔄 [DEBUG] Final database stats:', {
      total: finalStats.totalExercises,
      byLevel: finalStats.exercisesByLevel,
      byTopic: finalStats.exercisesByTopic
    });
    
    const totalTime = Date.now() - startTime;
    const result = {
      success: true,
      message: 'Static exercises migrated successfully',
      migration: {
        migratedCount,
        beforeStats: currentStats,
        afterStats: finalStats
      },
      responseTime: totalTime,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔄 [DEBUG] Migration completed in', totalTime, 'ms');
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('🔄 [DEBUG] Migration failed:', error);
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResult, { status: 500 });
  }
}