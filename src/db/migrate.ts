/**
 * Database Migration Script
 * 
 * This script creates the necessary database tables and populates them with sample data.
 * It can be run manually or as part of the deployment process.
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

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

async function migrate() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('Starting database migration...');
    
    // Create UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('UUID extension enabled');
    
    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema.sql
    await pool.query(schemaSql);
    console.log('Schema created successfully');
    
    // Check if sample data should be loaded
    if (process.env.LOAD_SAMPLE_DATA === 'true') {
      // Read init.sql (contains sample data)
      const initPath = path.join(__dirname, 'init.sql');
      const initSql = fs.readFileSync(initPath, 'utf8');
      
      // Execute init.sql
      await pool.query(initSql);
      console.log('Sample data loaded successfully');
    }
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrate;
