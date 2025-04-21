/**
 * Database Setup Script
 * 
 * This script runs the database migration to set up the necessary tables
 * and optionally load sample data.
 * 
 * Usage:
 * node scripts/setup-db.js [--sample-data]
 */

// Set environment variables
if (process.argv.includes('--sample-data')) {
  process.env.LOAD_SAMPLE_DATA = 'true';
}

// Import and run the migration
require('../dist/db/migrate.js').default()
  .then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
