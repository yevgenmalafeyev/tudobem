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