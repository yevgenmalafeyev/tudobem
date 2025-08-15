/**
 * Database adapter that conditionally uses different database libraries
 * based on environment:
 * - Local development: pg (PostgreSQL)
 * - Production/Vercel: @vercel/postgres (Neon)
 */

// Type definition for SQL query result
export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

// Type for SQL template function  
export type SqlTemplate = (strings: TemplateStringsArray, ...values: (string | number | boolean | null | undefined | string[] | number[])[]) => Promise<QueryResult>;

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const useVercelPostgres = isProduction || isVercel;

let sqlTemplate: SqlTemplate | null = null;

const initializeDatabase = async (): Promise<SqlTemplate> => {
  if (sqlTemplate) {
    return sqlTemplate;
  }

  if (useVercelPostgres) {
    // Use @vercel/postgres for production/Vercel
    const { sql } = await import('@vercel/postgres');
    sqlTemplate = async (strings: TemplateStringsArray, ...values: (string | number | boolean | null | undefined | string[] | number[])[]): Promise<QueryResult> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await sql(strings, ...(values as any[]));
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    };
  } else {
    // Use pg for local development
    const { Pool } = await import('pg');
    
    // Create connection pool for local PostgreSQL
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      // Additional local development configurations
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Create a template function similar to @vercel/postgres
    sqlTemplate = async (strings: TemplateStringsArray, ...values: (string | number | boolean | null | undefined | string[] | number[])[]): Promise<QueryResult> => {
      try {
        // Build the query string by interpolating values
        let query = strings[0];
        for (let i = 0; i < values.length; i++) {
          query += `$${i + 1}${strings[i + 1]}`;
        }

        const client = await pool.connect();
        try {
          const result = await client.query(query, values);
          return {
            rows: result.rows,
            rowCount: result.rowCount || 0
          };
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Database query error:', error);
        throw error;
      }
    };
  }

  return sqlTemplate;
};

// Export the sql template function with lazy initialization
export const sql = async (strings: TemplateStringsArray, ...values: (string | number | boolean | null | undefined | string[] | number[])[]): Promise<QueryResult> => {
  const sqlTemplate = await initializeDatabase();
  return sqlTemplate(strings, ...values);
};


// Export utility functions
export const getDatabaseInfo = () => ({
  isLocal: !useVercelPostgres,
  isProduction: useVercelPostgres,
  connectionString: process.env.POSTGRES_URL,
  adapter: useVercelPostgres ? '@vercel/postgres' : 'pg'
});

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await sql`SELECT 1 as test`;
    return result.rows.length > 0 && (result.rows[0] as { test: number }).test === 1;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

// Unsafe SQL execution for admin operations (use with extreme caution)
export const executeUnsafeSQL = async (rawSQL: string): Promise<QueryResult> => {
  console.log('🔧 executeUnsafeSQL called with:', { useVercelPostgres, rawSQLPreview: rawSQL.substring(0, 100) + '...' });
  
  // Create a timeout promise to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('SQL execution timeout after 30 seconds')), 30000);
  });
  
  if (useVercelPostgres) {
    console.log('📡 @vercel/postgres does not support raw SQL execution');
    console.log('🔄 Using pg.Client for raw SQL support...');
    // @vercel/postgres template literals cannot execute arbitrary raw SQL strings
    // Skip directly to pg.Client approach
  }
  
  // Use pg.Client for local development or as fallback
  console.log('📡 Using pg.Client for direct connection...');
  
  const executeQuery = async (): Promise<QueryResult> => {
    const { Client } = await import('pg');
    
    const client = new Client({
      connectionString: process.env.POSTGRES_URL!,
      ssl: useVercelPostgres ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 10000, // 10 second connection timeout
      query_timeout: 20000, // 20 second query timeout
    });
    
    try {
      console.log('🔌 Attempting to connect to database...');
      await client.connect();
      console.log('✅ Connected to database via pg.Client');
      
      console.log('🔍 Executing SQL query...');
      // Execute raw SQL directly
      const result = await client.query(rawSQL);
      
      console.log('✅ SQL execution result:', { 
        rowCount: result.rowCount, 
        rows: result.rows?.length,
        command: result.command 
      });
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      console.error('❌ SQL execution error:', error);
      throw error;
    } finally {
      try {
        await client.end();
        console.log('✅ Database connection closed');
      } catch (closeError) {
        console.error('⚠️ Error closing connection:', closeError);
      }
    }
  };
  
  // Race between the actual execution and timeout
  try {
    return await Promise.race([executeQuery(), timeoutPromise]);
  } catch (error) {
    console.error('❌ SQL execution failed with error:', error);
    throw error;
  }
};