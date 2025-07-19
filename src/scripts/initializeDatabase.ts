import { SmartDatabase } from '@/lib/smartDatabase';

/**
 * Initialize database tables and setup
 * Run this script to set up the enhanced exercise system
 */
export async function initializeDatabase(): Promise<void> {
  console.log('Initializing enhanced exercise database...');
  
  try {
    // Create all necessary tables
    await SmartDatabase.initializeTables();
    
    console.log('✅ Database initialization completed successfully');
    console.log('📊 Tables created:');
    console.log('  - exercises (with multilingual support)');
    console.log('  - exercise_sessions (usage tracking)');
    console.log('  - generation_queue (background processing)');
    console.log('🚀 Enhanced exercise system is ready!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Allow running as standalone script
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization script failed:', error);
      process.exit(1);
    });
}