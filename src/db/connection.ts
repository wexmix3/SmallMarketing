/**
 * Database Connection Utility
 *
 * This module provides a connection to the PostgreSQL database.
 * In development mode with USE_MOCK_DB=true, it uses a mock database service.
 */

import { Pool } from 'pg';

// Check if we should use the mock database
const useMockDb = process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test';

// If using mock database, import and export the mock service
if (useMockDb) {
  console.log('Using mock database service');
  export { query, transaction } from '../services/mockDatabaseService';
  export default null; // No pool needed for mock database
} else {
  // Get database configuration from environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ai_customer_service',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined
  };

  // Create a connection pool
  const pool = new Pool(dbConfig);

  // Test the connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Database connected successfully at:', res.rows[0].now);
    }
  });

  // Export the pool for use in other modules
  export default pool;

  // Helper function to execute a query with parameters
  export async function query(text: string, params?: any[]) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV !== 'production') {
        console.log('Executed query', { text, duration, rows: res.rowCount });
      }

      return res;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Helper function to execute a transaction
  export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
