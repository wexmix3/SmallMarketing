import { Op } from 'sequelize';
import { Pick, Game, Team } from '../models';
import { format, parseISO } from 'date-fns';
import { isUsingMockDatabase } from './initDatabase';

// Mock data storage when database is not available
const mockData = {
  picks: [],
  games: [],
  teams: []
};

/**
 * Save a pick to the database
 * @param pick - The pick to save
 * @returns The saved pick
 */
export async function savePickToDatabase(pickData: any): Promise<any> {
  try {
    // Check if we're using a mock database
    if (isUsingMockDatabase()) {
      // Create a mock pick
      const mockPick = {
        id: pickData.id,
        gameId: pickData.gameId,
        homeTeam: pickData.homeTeam,
        awayTeam: pickData.awayTeam,
        betType: pickData.betType,
        betSelection: pickData.betSelection,
        odds: pickData.odds,
        prediction: pickData.prediction,
        confidence: pickData.confidence,
        reasoning: pickData.reasoning,
        dateCreated: new Date(pickData.dateCreated),
        result: pickData.result || 'pending',
        tweetId: pickData.tweetId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to mock data
      mockData.picks.push(mockPick);

      return mockPick;
    } else {
      // Create the pick in the database
      const pick = await Pick.create({
        id: pickData.id,
        gameId: pickData.gameId,
        homeTeam: pickData.homeTeam,
        awayTeam: pickData.awayTeam,
        betType: pickData.betType,
        betSelection: pickData.betSelection,
        odds: pickData.odds,
        prediction: pickData.prediction,
        confidence: pickData.confidence,
        reasoning: pickData.reasoning,
        dateCreated: new Date(pickData.dateCreated),
        result: pickData.result || 'pending',
        tweetId: pickData.tweetId
      });

      return pick.toJSON();
    }
  } catch (error) {
    console.error('Error saving pick to database:', error);

    // If there's an error, try using mock data
    console.warn('Falling back to mock database');

    // Create a mock pick
    const mockPick = {
      id: pickData.id,
      gameId: pickData.gameId,
      homeTeam: pickData.homeTeam,
      awayTeam: pickData.awayTeam,
      betType: pickData.betType,
      betSelection: pickData.betSelection,
      odds: pickData.odds,
      prediction: pickData.prediction,
      confidence: pickData.confidence,
      reasoning: pickData.reasoning,
      dateCreated: new Date(pickData.dateCreated),
      result: pickData.result || 'pending',
      tweetId: pickData.tweetId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock data
    mockData.picks.push(mockPick);

    return mockPick;
  }
}

/**
 * Get all picks from the database
 * @returns Array of all picks
 */
export async function getAllPicks(): Promise<any[]> {
  try {
    const picks = await Pick.findAll({
      order: [['dateCreated', 'DESC']]
    });

    return picks.map(pick => pick.toJSON());
  } catch (error) {
    console.error('Error getting all picks:', error);
    throw error;
  }
}

/**
 * Get a pick by ID
 * @param id - The ID of the pick to retrieve
 * @returns The pick or null if not found
 */
export async function getPickById(id: string): Promise<any | null> {
  try {
    const pick = await Pick.findByPk(id);
    return pick ? pick.toJSON() : null;
  } catch (error) {
    console.error('Error getting pick by ID:', error);
    throw error;
  }
}

/**
 * Update a pick in the database
 * @param id - The ID of the pick to update
 * @param updates - The fields to update
 * @returns The updated pick or null if not found
 */
export async function updatePick(id: string, updates: Partial<any>): Promise<any | null> {
  try {
    // Find the pick
    const pick = await Pick.findByPk(id);

    if (!pick) return null;

    // Update the pick
    await pick.update(updates);

    return pick.toJSON();
  } catch (error) {
    console.error('Error updating pick:', error);
    throw error;
  }
}

/**
 * Delete a pick from the database
 * @param id - The ID of the pick to delete
 * @returns True if deleted, false if not found
 */
export async function deletePick(id: string): Promise<boolean> {
  try {
    const deleted = await Pick.destroy({
      where: { id }
    });

    return deleted > 0;
  } catch (error) {
    console.error('Error deleting pick:', error);
    throw error;
  }
}

/**
 * Get picks by date
 * @param date - The date to filter by (YYYY-MM-DD)
 * @returns Array of picks for the specified date
 */
export async function getPicksByDate(date: string): Promise<any[]> {
  try {
    // Create start and end date for the query (full day)
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const picks = await Pick.findAll({
      where: {
        dateCreated: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['dateCreated', 'DESC']]
    });

    return picks.map(pick => pick.toJSON());
  } catch (error) {
    console.error('Error getting picks by date:', error);
    throw error;
  }
}

/**
 * Get performance metrics
 * @returns Object with performance metrics
 */
export async function getPerformanceMetrics(): Promise<{
  totalPicks: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winPercentage: number;
  roi: number;
}> {
  try {
    // Get counts for each result type
    const totalPicks = await Pick.count();
    const wins = await Pick.count({ where: { result: 'win' } });
    const losses = await Pick.count({ where: { result: 'loss' } });
    const pushes = await Pick.count({ where: { result: 'push' } });
    const pending = await Pick.count({ where: { result: 'pending' } });

    // Calculate win percentage
    const winPercentage = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;

    // Get all completed picks to calculate ROI
    const completedPicks = await Pick.findAll({
      where: {
        result: {
          [Op.ne]: 'pending'
        }
      }
    });

    // Calculate ROI
    // Assuming $100 bet on each pick
    const winnings = completedPicks.reduce((total, pick) => {
      const pickData = pick.toJSON();

      if (pickData.result === 'win') {
        // Calculate winnings based on odds
        const odds = pickData.odds;
        const profit = odds > 0 ? (odds / 100) * 100 : (100 / Math.abs(odds)) * 100;
        return total + profit;
      }
      if (pickData.result === 'loss') {
        return total - 100;
      }
      return total;
    }, 0);

    const roi = completedPicks.length > 0 ? (winnings / (completedPicks.length * 100)) * 100 : 0;

    return {
      totalPicks,
      wins,
      losses,
      pushes,
      pending,
      winPercentage,
      roi
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    throw error;
  }
}

/**
 * Save a game to the database
 * @param gameData - The game data to save
 * @returns The saved game
 */
export async function saveGameToDatabase(gameData: any): Promise<any> {
  try {
    // Check if the game already exists
    const existingGame = await Game.findByPk(gameData.id);

    if (existingGame) {
      // Update the existing game
      await existingGame.update({
        date: gameData.date,
        time: gameData.time,
        homeTeamId: gameData.homeTeam.id,
        homeTeamName: gameData.homeTeam.name,
        homeTeamScore: gameData.score?.homeTeam,
        awayTeamId: gameData.awayTeam.id,
        awayTeamName: gameData.awayTeam.name,
        awayTeamScore: gameData.score?.awayTeam,
        venue: gameData.venue,
        status: gameData.status,
        homeTeamMoneyline: gameData.odds.homeTeamMoneyline,
        awayTeamMoneyline: gameData.odds.awayTeamMoneyline,
        homeTeamSpread: gameData.odds.homeTeamSpread,
        homeTeamSpreadOdds: gameData.odds.homeTeamSpreadOdds,
        awayTeamSpreadOdds: gameData.odds.awayTeamSpreadOdds,
        overUnder: gameData.odds.overUnder,
        overOdds: gameData.odds.overOdds,
        underOdds: gameData.odds.underOdds
      });

      return existingGame.toJSON();
    } else {
      // Create a new game
      const game = await Game.create({
        id: gameData.id,
        date: gameData.date,
        time: gameData.time,
        homeTeamId: gameData.homeTeam.id,
        homeTeamName: gameData.homeTeam.name,
        homeTeamScore: gameData.score?.homeTeam,
        awayTeamId: gameData.awayTeam.id,
        awayTeamName: gameData.awayTeam.name,
        awayTeamScore: gameData.score?.awayTeam,
        venue: gameData.venue,
        status: gameData.status,
        homeTeamMoneyline: gameData.odds.homeTeamMoneyline,
        awayTeamMoneyline: gameData.odds.awayTeamMoneyline,
        homeTeamSpread: gameData.odds.homeTeamSpread,
        homeTeamSpreadOdds: gameData.odds.homeTeamSpreadOdds,
        awayTeamSpreadOdds: gameData.odds.awayTeamSpreadOdds,
        overUnder: gameData.odds.overUnder,
        overOdds: gameData.odds.overOdds,
        underOdds: gameData.odds.underOdds
      });

      return game.toJSON();
    }
  } catch (error) {
    console.error('Error saving game to database:', error);
    throw error;
  }
}

/**
 * Save a team to the database
 * @param teamData - The team data to save
 * @returns The saved team
 */
export async function saveTeamToDatabase(teamData: any): Promise<any> {
  try {
    // Check if the team already exists
    const existingTeam = await Team.findByPk(teamData.id);

    if (existingTeam) {
      // Update the existing team
      await existingTeam.update({
        name: teamData.name,
        abbreviation: teamData.abbreviation,
        location: teamData.location,
        conference: teamData.conference,
        division: teamData.division,
        wins: teamData.winLoss.wins,
        losses: teamData.winLoss.losses,
        winPercentage: teamData.winLoss.winPercentage,
        pointsPerGame: teamData.stats.pointsPerGame,
        pointsAllowedPerGame: teamData.stats.pointsAllowedPerGame,
        homeAdvantage: teamData.homeAdvantage || 3.5
      });

      return existingTeam.toJSON();
    } else {
      // Create a new team
      const team = await Team.create({
        id: teamData.id,
        name: teamData.name,
        abbreviation: teamData.abbreviation,
        location: teamData.location,
        conference: teamData.conference,
        division: teamData.division,
        wins: teamData.winLoss.wins,
        losses: teamData.winLoss.losses,
        winPercentage: teamData.winLoss.winPercentage,
        pointsPerGame: teamData.stats.pointsPerGame,
        pointsAllowedPerGame: teamData.stats.pointsAllowedPerGame,
        homeAdvantage: teamData.homeAdvantage || 3.5
      });

      return team.toJSON();
    }
  } catch (error) {
    console.error('Error saving team to database:', error);
    throw error;
  }
}

/**
 * Get monthly performance data
 * @returns Monthly performance data for charts
 */
export async function getMonthlyPerformance(): Promise<any[]> {
  try {
    // Get all picks
    const picks = await Pick.findAll({
      where: {
        result: {
          [Op.ne]: 'pending'
        }
      }
    });

    // Group picks by month
    const monthlyData: Record<string, { month: string, wins: number, losses: number, pushes: number }> = {};

    picks.forEach(pick => {
      const pickData = pick.toJSON();
      const date = new Date(pickData.dateCreated);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM');

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          wins: 0,
          losses: 0,
          pushes: 0
        };
      }

      if (pickData.result === 'win') {
        monthlyData[monthKey].wins++;
      } else if (pickData.result === 'loss') {
        monthlyData[monthKey].losses++;
      } else if (pickData.result === 'push') {
        monthlyData[monthKey].pushes++;
      }
    });

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) => {
      const monthA = new Date(`${a.month} 1, 2023`).getTime();
      const monthB = new Date(`${b.month} 1, 2023`).getTime();
      return monthA - monthB;
    });
  } catch (error) {
    console.error('Error getting monthly performance:', error);
    throw error;
  }
}
