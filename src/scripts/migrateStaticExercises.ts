import { EnhancedFallbackService } from '@/services/enhancedFallbackService';
import { SmartDatabase } from '@/lib/smartDatabase';

/**
 * Migration script to move static exercises to database
 * Run this script once to populate the database with existing exercises
 */
export async function migrateStaticExercises(): Promise<void> {
  console.log('🚀 Starting static exercise migration...');
  
  try {
    // Initialize database tables first
    console.log('📋 Initializing database tables...');
    await SmartDatabase.initializeTables();
    
    // Check current database state
    console.log('📊 Checking current database state...');
    const currentStats = await SmartDatabase.getUsageStats();
    console.log('Current database stats:', {
      total: currentStats.totalExercises,
      byLevel: currentStats.exercisesByLevel,
      bySource: currentStats.exercisesBySource
    });
    
    // Migrate static exercises
    console.log('🔄 Migrating static exercises to database...');
    const migratedCount = await EnhancedFallbackService.populateFromStaticExercises();
    
    // Check final state
    console.log('📊 Checking final database state...');
    const finalStats = await SmartDatabase.getUsageStats();
    console.log('Final database stats:', {
      total: finalStats.totalExercises,
      byLevel: finalStats.exercisesByLevel,
      bySource: finalStats.exercisesBySource
    });
    
    console.log(`✅ Migration completed successfully!`);
    console.log(`📈 Summary:`);
    console.log(`  - Migrated: ${migratedCount} exercises`);
    console.log(`  - Total in database: ${finalStats.totalExercises}`);
    console.log(`  - Ready for enhanced question generation!`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback migration (if needed)
 */
export async function rollbackMigration(): Promise<void> {
  console.log('🔄 Rolling back migration...');
  
  try {
    // This would delete all static exercises from database
    // Implementation depends on database setup
    console.log('⚠️ Rollback not implemented - would require careful database cleanup');
    console.log('🔧 To rollback: manually delete exercises with source="static" from database');
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Validate migration results
 */
export async function validateMigration(): Promise<boolean> {
  console.log('🔍 Validating migration...');
  
  try {
    const stats = await SmartDatabase.getUsageStats();
    
    // Check that we have exercises for all levels
    const requiredLevels = ['A1', 'A2', 'B1', 'B2'];
    const missingLevels = requiredLevels.filter(level => 
      (stats.exercisesByLevel[level as keyof typeof stats.exercisesByLevel] || 0) === 0
    );
    
    if (missingLevels.length > 0) {
      console.error(`❌ Missing exercises for levels: ${missingLevels.join(', ')}`);
      return false;
    }
    
    // Check that we have static exercises
    const staticCount = stats.exercisesBySource.static || 0;
    if (staticCount === 0) {
      console.error('❌ No static exercises found in database');
      return false;
    }
    
    console.log('✅ Migration validation passed');
    console.log(`📊 Found exercises for all required levels`);
    console.log(`📚 ${staticCount} static exercises in database`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return false;
  }
}

// Allow running as standalone script
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      migrateStaticExercises()
        .then(() => {
          console.log('Migration script completed');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Migration script failed:', error);
          process.exit(1);
        });
      break;
      
    case 'validate':
      validateMigration()
        .then((success) => {
          console.log(`Validation ${success ? 'passed' : 'failed'}`);
          process.exit(success ? 0 : 1);
        })
        .catch((error) => {
          console.error('Validation script failed:', error);
          process.exit(1);
        });
      break;
      
    case 'rollback':
      rollbackMigration()
        .then(() => {
          console.log('Rollback script completed');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Rollback script failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: npm run migrate [migrate|validate|rollback]');
      console.log('');
      console.log('Commands:');
      console.log('  migrate  - Migrate static exercises to database');
      console.log('  validate - Validate migration results');
      console.log('  rollback - Rollback migration (removes static exercises)');
      process.exit(1);
  }
}