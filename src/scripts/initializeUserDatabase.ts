import { UserDatabase } from '../lib/userDatabase';

async function initializeUserDatabase() {
  try {
    console.log('Initializing user database tables...');
    await UserDatabase.initializeTables();
    console.log('✅ User database initialized successfully');
    
    // Check database stats
    const stats = await UserDatabase.getDatabaseStats();
    console.log('📊 User database stats:', {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalExercises: stats.totalExercises,
      totalAttempts: stats.totalAttempts
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing user database:', error);
    process.exit(1);
  }
}

initializeUserDatabase();