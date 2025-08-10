#!/usr/bin/env tsx

/**
 * Migration script to remove the 'source' column and its index from exercises table.
 * This script handles both production (Vercel Postgres) and local (PostgreSQL) databases.
 */

import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

interface MigrationConfig {
  dryRun: boolean;
  environment: 'local' | 'production' | 'auto';
}

class SourceColumnMigration {
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  private log(message: string) {
    console.log(`🔄 [MIGRATION] ${message}`);
  }

  private async isProduction(): Promise<boolean> {
    if (this.config.environment !== 'auto') {
      return this.config.environment === 'production';
    }
    
    return process.env.POSTGRES_URL?.includes('vercel-storage') || 
           process.env.VERCEL_ENV === 'production' ||
           !process.env.POSTGRES_URL?.includes('localhost');
  }

  private async getLocalConnection() {
    const postgresUrl = process.env.POSTGRES_URL;
    if (!postgresUrl) {
      throw new Error('POSTGRES_URL environment variable not set');
    }
    
    return new Pool({ connectionString: postgresUrl });
  }

  private async checkColumnExists(isProduction: boolean): Promise<boolean> {
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'exercises' 
      AND column_name = 'source'
    `;

    try {
      if (isProduction) {
        const result = await sql.query(checkQuery);
        return result.rows.length > 0;
      } else {
        const pool = await this.getLocalConnection();
        try {
          const result = await pool.query(checkQuery);
          return result.rows.length > 0;
        } finally {
          await pool.end();
        }
      }
    } catch (error) {
      this.log(`Error checking column existence: ${error}`);
      return false;
    }
  }

  private async checkIndexExists(isProduction: boolean): Promise<boolean> {
    const checkQuery = `
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'exercises' 
      AND indexname = 'idx_exercises_source'
    `;

    try {
      if (isProduction) {
        const result = await sql.query(checkQuery);
        return result.rows.length > 0;
      } else {
        const pool = await this.getLocalConnection();
        try {
          const result = await pool.query(checkQuery);
          return result.rows.length > 0;
        } finally {
          await pool.end();
        }
      }
    } catch (error) {
      this.log(`Error checking index existence: ${error}`);
      return false;
    }
  }

  private async executeQuery(query: string, description: string, isProduction: boolean): Promise<void> {
    if (this.config.dryRun) {
      this.log(`[DRY RUN] Would execute: ${description}`);
      this.log(`[DRY RUN] Query: ${query}`);
      return;
    }

    this.log(`Executing: ${description}`);
    
    try {
      if (isProduction) {
        await sql.query(query);
      } else {
        const pool = await this.getLocalConnection();
        try {
          await pool.query(query);
        } finally {
          await pool.end();
        }
      }
      this.log(`✅ Successfully executed: ${description}`);
    } catch (error) {
      this.log(`❌ Failed to execute: ${description}`);
      throw error;
    }
  }

  async migrate(): Promise<void> {
    const isProduction = await this.isProduction();
    const envLabel = isProduction ? 'production' : 'local';
    
    this.log(`Starting migration on ${envLabel} database`);
    
    if (this.config.dryRun) {
      this.log('🔍 DRY RUN MODE - No actual changes will be made');
    }

    try {
      // Check if source column exists
      const columnExists = await this.checkColumnExists(isProduction);
      const indexExists = await this.checkIndexExists(isProduction);
      
      if (!columnExists && !indexExists) {
        this.log('✅ Source column and index do not exist - migration already complete');
        return;
      }

      // Step 1: Drop the index if it exists
      if (indexExists) {
        await this.executeQuery(
          'DROP INDEX IF EXISTS idx_exercises_source',
          'Remove source column index',
          isProduction
        );
      } else {
        this.log('ℹ️ Index idx_exercises_source does not exist - skipping');
      }

      // Step 2: Drop the source column if it exists
      if (columnExists) {
        await this.executeQuery(
          'ALTER TABLE exercises DROP COLUMN IF EXISTS source',
          'Remove source column from exercises table',
          isProduction
        );
      } else {
        this.log('ℹ️ Source column does not exist - skipping');
      }

      this.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      this.log('❌ Migration failed');
      console.error(error);
      throw error;
    }
  }

  async rollback(): Promise<void> {
    const isProduction = await this.isProduction();
    const envLabel = isProduction ? 'production' : 'local';
    
    this.log(`Rolling back migration on ${envLabel} database`);
    
    if (this.config.dryRun) {
      this.log('🔍 DRY RUN MODE - No actual changes will be made');
    }

    try {
      // Step 1: Add the source column back
      await this.executeQuery(
        `ALTER TABLE exercises ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'ai' CHECK (source IN ('ai', 'static', 'admin'))`,
        'Re-add source column to exercises table',
        isProduction
      );

      // Step 2: Recreate the index
      await this.executeQuery(
        'CREATE INDEX IF NOT EXISTS idx_exercises_source ON exercises(source)',
        'Recreate source column index',
        isProduction
      );

      this.log('🔄 Rollback completed successfully!');
      
    } catch (error) {
      this.log('❌ Rollback failed');
      console.error(error);
      throw error;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';
  
  const config: MigrationConfig = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    environment: args.includes('--prod') ? 'production' : 
                args.includes('--local') ? 'local' : 'auto'
  };

  const migration = new SourceColumnMigration(config);

  try {
    switch (command) {
      case 'migrate':
        await migration.migrate();
        break;
      case 'rollback':
        await migration.rollback();
        break;
      case 'help':
        console.log(`
Usage: npx tsx src/scripts/migrate-remove-source.ts [command] [options]

Commands:
  migrate   Remove source column and index (default)
  rollback  Re-add source column and index
  help      Show this help message

Options:
  --dry-run, -n    Show what would be done without making changes
  --prod           Force production database
  --local          Force local database
  (auto)           Auto-detect database environment

Examples:
  npx tsx src/scripts/migrate-remove-source.ts
  npx tsx src/scripts/migrate-remove-source.ts migrate --dry-run
  npx tsx src/scripts/migrate-remove-source.ts rollback --local
        `);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Use "help" command to see available options');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { SourceColumnMigration };