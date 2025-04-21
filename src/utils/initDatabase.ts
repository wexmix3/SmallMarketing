import { syncDatabase } from '../models';
import { testConnection } from '../config/database';
import sportsDataAPI from './sportsDataAPI';
import { saveTeamToDatabase, saveGameToDatabase } from './database';

// Flag to track if we're using a mock database
let usingMockDatabase = false;

/**
 * Initialize the database
 * @param force - Whether to force sync (drop tables)
 */
export async function initializeDatabase(force: boolean = false): Promise<boolean> {
  try {
    // Test database connection
    const connected = await testConnection();

    if (!connected) {
      console.warn('Failed to connect to the database, using mock database instead');
      usingMockDatabase = true;
      // Return true since we're using a mock database
      return true;
    }

    // If we have a real database connection, sync the models
    if (!usingMockDatabase) {
      // Sync database models
      const synced = await syncDatabase(force);
      if (!synced) {
        console.error('Failed to sync database models');
        return false;
      }

      // If we're forcing a sync, seed the database with initial data
      if (force) {
        await seedDatabase();
      }
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    console.warn('Using mock database instead');
    usingMockDatabase = true;
    return true; // Return true since we're using a mock database
  }
}

/**
 * Check if we're using a mock database
 */
export function isUsingMockDatabase(): boolean {
  return usingMockDatabase;
}

/**
 * Seed the database with initial data
 */
async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database with initial data...');

    // Fetch teams from sports data API
    const teams = sportsDataAPI.getMockTeams();

    // Save teams to database
    for (const team of teams) {
      await saveTeamToDatabase(team);
    }
    console.log(`Saved ${teams.length} teams to database`);

    // Fetch upcoming games from sports data API
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const games = await sportsDataAPI.getUpcomingGames(today);

    // Save games to database
    for (const game of games) {
      await saveGameToDatabase(game);
    }
    console.log(`Saved ${games.length} games to database`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
