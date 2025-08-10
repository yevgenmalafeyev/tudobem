#!/usr/bin/env tsx

/**
 * Database Dump Script
 * Exports the current local database structure and data to JSON/SQL files
 * This data will be used to sync with production database on deployment
 */

import { LocalDatabase } from '@/lib/localDatabase';
import { promises as fs } from 'fs';
import path from 'path';

interface DatabaseDump {
  version: string;
  timestamp: string;
  schema: {
    tables: string[];
    indexes: string[];
  };
  data: {
    exercises: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    exercise_sessions: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    generation_queue: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  stats: {
    totalExercises: number;
    exercisesByLevel: Record<string, number>;
    exercisesByTopic: Record<string, number>;
  };
}

/**
 * Export current database to JSON dump file
 */
export async function dumpDatabase(): Promise<void> {
  console.log('🗄️ Starting database dump...\n');
  
  try {
    // Initialize database connection
    await LocalDatabase.initializeTables();
    
    // Get all exercises
    console.log('📊 Fetching exercises...');
    const exercises = await LocalDatabase.getExercises({
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      topics: [],
      limit: 10000 // Get all exercises
    });
    
    console.log(`   Found ${exercises.length} exercises`);
    
    // Get usage stats
    console.log('📈 Fetching usage statistics...');
    const stats = await LocalDatabase.getUsageStats();
    
    // Create database dump object
    const dump: DatabaseDump = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      schema: {
        tables: ['exercises', 'exercise_sessions', 'generation_queue'],
        indexes: [
          'idx_exercises_level_topic',
          'idx_exercises_source',
          'idx_exercises_usage_count',
          'idx_exercises_created_at'
        ]
      },
      data: {
        exercises: exercises,
        exercise_sessions: [], // Could be populated if needed
        generation_queue: []   // Could be populated if needed
      },
      stats: {
        totalExercises: stats.totalExercises,
        exercisesByLevel: stats.exercisesByLevel,
        exercisesByTopic: stats.exercisesByTopic
      }
    };
    
    // Create dumps directory
    const dumpsDir = path.join(process.cwd(), 'database-dumps');
    await fs.mkdir(dumpsDir, { recursive: true });
    
    // Save JSON dump
    const jsonFile = path.join(dumpsDir, 'database-dump.json');
    await fs.writeFile(jsonFile, JSON.stringify(dump, null, 2));
    
    console.log(`\n✅ Database dump completed!`);
    console.log(`📁 Saved to: ${jsonFile}`);
    console.log(`📊 Statistics:`);
    console.log(`   Total exercises: ${stats.totalExercises}`);
    console.log(`   By level: ${Object.entries(stats.exercisesByLevel).map(([k,v]) => `${k}:${v}`).join(', ')}`);
    console.log(`   Dump size: ${(JSON.stringify(dump).length / 1024).toFixed(2)} KB`);
    
    // Also create a production seed script
    const seedScript = generateSeedScript(exercises);
    const seedFile = path.join(dumpsDir, 'production-seed.ts');
    await fs.writeFile(seedFile, seedScript);
    
    console.log(`🌱 Production seed script created: ${seedFile}`);
    
  } catch (error) {
    console.error('❌ Database dump failed:', error);
    throw error;
  }
}

/**
 * Generate TypeScript seed script for production
 */
function generateSeedScript(exercises: any[]): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  return `#!/usr/bin/env tsx

/**
 * Production Database Seed Script
 * Generated automatically from local database dump
 * Last updated: ${new Date().toISOString()}
 */

import { LocalDatabase } from '@/lib/localDatabase';

const EXERCISES_DATA = ${JSON.stringify(exercises, null, 2)};

export async function seedProductionDatabase(): Promise<void> {
  console.log('🌱 Seeding production database with local data...');
  
  try {
    // Initialize tables
    await LocalDatabase.initializeTables();
    
    // Clear existing exercises (production reset)
    console.log('🧹 Clearing existing production data...');
    await LocalDatabase.clearAllExercises();
    
    // Insert exercises in batches
    console.log(\`📊 Inserting \${EXERCISES_DATA.length} exercises...\`);
    let inserted = 0;
    
    for (const exercise of EXERCISES_DATA) {
      try {
        await LocalDatabase.addExercise(exercise);
        inserted++;
        if (inserted % 50 === 0) {
          console.log(\`   Progress: \${inserted}/\${EXERCISES_DATA.length} exercises inserted\`);
        }
      } catch (error) {
        // Skip duplicates, log other errors
        if (!error.message.includes('duplicate')) {
          console.warn(\`   ⚠️ Skipped exercise: \${error.message}\`);
        }
      }
    }
    
    // Verify results
    const stats = await LocalDatabase.getUsageStats();
    
    console.log(\`\\n✅ Production database seeded successfully!\`);
    console.log(\`📈 Final statistics:\`);
    console.log(\`   Total exercises: \${stats.totalExercises}\`);
    console.log(\`   By level: \${Object.entries(stats.exercisesByLevel).map(([k,v]) => \`\${k}:\${v}\`).join(', ')}\`);
    
  } catch (error) {
    console.error('❌ Production seeding failed:', error);
    throw error;
  }
}

// Allow running as standalone script
if (require.main === module) {
  seedProductionDatabase()
    .then(() => {
      console.log('Production seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Production seeding failed:', error);
      process.exit(1);
    });
}
`;
}

// Allow running as standalone script
if (require.main === module) {
  dumpDatabase()
    .then(() => {
      console.log('Database dump script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database dump script failed:', error);
      process.exit(1);
    });
}