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
export type SqlTemplate = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<QueryResult>;

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const useVercelPostgres = isProduction || isVercel;

let sqlTemplate: SqlTemplate;

if (useVercelPostgres) {
  // Use @vercel/postgres for production/Vercel
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { sql } = require('@vercel/postgres');
  sqlTemplate = sql;
} else {
  // Use pg for local development
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg');
  
  // Create connection pool for local PostgreSQL
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    // Additional local development configurations
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Create a template function similar to @vercel/postgres
  sqlTemplate = async (strings: TemplateStringsArray, ...values: unknown[]): Promise<QueryResult> => {
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

// Export the sql template function
export const sql = sqlTemplate;

// Raw query function for dynamic SQL with parameters
export const query = async (queryText: string, params: unknown[] = []): Promise<QueryResult> => {
  if (useVercelPostgres) {
    // For Vercel/production, we can't use raw query easily with @vercel/postgres
    // We'll need to construct a template literal manually
    throw new Error('Raw query not supported in production. Use sql template literals.');
  } else {
    // Use pg pool for local development
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const client = await pool.connect();
    try {
      const result = await client.query(queryText, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } finally {
      client.release();
    }
  }
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