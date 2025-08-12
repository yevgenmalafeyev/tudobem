import { NextRequest } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';
import { Pool } from 'pg';
import { createApiResponse, createApiError } from '@/lib/api-utils';

/**
 * Test cleanup endpoint for e2e tests
 * Clears user data and usage statistics to ensure clean test environment
 */
export async function POST(request: NextRequest) {
  console.log('🧹 [DEBUG] Test cleanup API called');
  
  // Only allow in development/test environment
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    return createApiError('Cleanup endpoint not available in production', 403);
  }
  
  try {
    const body = await request.json();
    const { action, tables, email, username } = body;
    
    if (action !== 'cleanup_user_data') {
      return createApiError('Invalid cleanup action', 400);
    }
    
    console.log('🧹 [DEBUG] Starting database cleanup...');
    
    // Check if database is available
    if (!SmartDatabase.isDatabaseAvailable()) {
      return createApiError('Database not available', 500);
    }
    
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: false // Local development doesn't need SSL
    });
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      let cleanupCount = 0;
      
      // Delete test user if email or username provided
      if (email || username) {
        let userDeleteResult;
        if (email) {
          // First check if user exists before trying to delete
          const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
          if (checkUser.rows.length > 0) {
            userDeleteResult = await client.query('DELETE FROM users WHERE email = $1', [email]);
            console.log(`🧹 [DEBUG] Deleted user with email: ${email}, rows: ${userDeleteResult.rowCount}`);
            cleanupCount += userDeleteResult?.rowCount || 0;
          } else {
            console.log(`🧹 [DEBUG] No user found with email: ${email}`);
          }
        } else if (username) {
          // First check if user exists before trying to delete
          const checkUser = await client.query('SELECT id FROM users WHERE username = $1', [username]);
          if (checkUser.rows.length > 0) {
            userDeleteResult = await client.query('DELETE FROM users WHERE username = $1', [username]);
            console.log(`🧹 [DEBUG] Deleted user with username: ${username}, rows: ${userDeleteResult.rowCount}`);
            cleanupCount += userDeleteResult?.rowCount || 0;
          } else {
            console.log(`🧹 [DEBUG] No user found with username: ${username}`);
          }
        }
        
        // Clean up orphaned sessions only if we deleted a user
        if (userDeleteResult && userDeleteResult.rowCount && userDeleteResult.rowCount > 0) {
          await client.query('DELETE FROM user_sessions WHERE user_id NOT IN (SELECT id FROM users)');
          
          // Clean up NextAuth tables if they exist (ignore errors)
          await client.query('DELETE FROM accounts WHERE "userId" NOT IN (SELECT id FROM users)').catch(() => {});
          await client.query('DELETE FROM sessions WHERE "userId" NOT IN (SELECT id FROM users)').catch(() => {});
          await client.query('DELETE FROM users_nextauth WHERE id NOT IN (SELECT id FROM users)').catch(() => {});
        }
      }
      
      // Reset exercise usage counts to 0 (removes usage-based filtering)
      if (!tables || tables.length === 0 || tables.includes('exercises')) {
        const exerciseResult = await client.query('UPDATE exercises SET usage_count = 0');
        console.log(`🧹 [DEBUG] Reset ${exerciseResult.rowCount} exercise usage counts`);
        cleanupCount += exerciseResult.rowCount || 0;
      }
      
      // Delete user exercise attempts (removes user-specific filtering)
      if (!tables || tables.length === 0 || tables.includes('user_exercise_attempts')) {
        try {
          const attemptResult = await client.query('DELETE FROM user_exercise_attempts');
          console.log(`🧹 [DEBUG] Deleted ${attemptResult.rowCount} user exercise attempts`);
          cleanupCount += attemptResult.rowCount || 0;
        } catch {
          // Table might not exist, that's ok
          console.log('🧹 [DEBUG] user_exercise_attempts table does not exist (ok)');
        }
      }
      
      // Delete exercise sessions
      if (!tables || tables.length === 0 || tables.includes('exercise_sessions')) {
        try {
          const sessionResult = await client.query('DELETE FROM exercise_sessions');
          console.log(`🧹 [DEBUG] Deleted ${sessionResult.rowCount} exercise sessions`);
          cleanupCount += sessionResult.rowCount || 0;
        } catch {
          // Table might not exist, that's ok
          console.log('🧹 [DEBUG] exercise_sessions table does not exist (ok)');
        }
      }
      
      // Delete user sessions
      if (!tables || tables.length === 0 || tables.includes('user_sessions')) {
        try {
          const userSessionResult = await client.query('DELETE FROM user_sessions');
          console.log(`🧹 [DEBUG] Deleted ${userSessionResult.rowCount} user sessions`);
          cleanupCount += userSessionResult.rowCount || 0;
        } catch {
          // Table might not exist, that's ok
          console.log('🧹 [DEBUG] user_sessions table does not exist (ok)');
        }
      }
      
      await client.query('COMMIT');
      
      console.log(`🧹 [DEBUG] Database cleanup completed successfully. Total operations: ${cleanupCount}`);
      
      return createApiResponse({
        success: true,
        message: `Database cleanup completed. ${cleanupCount} operations performed.`,
        cleanupCount
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
    
  } catch (error) {
    console.error('🧹 [DEBUG] Database cleanup failed:', error);
    return createApiError(`Database cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}