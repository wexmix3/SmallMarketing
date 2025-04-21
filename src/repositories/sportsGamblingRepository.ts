/**
 * Sports Gambling Repository
 *
 * This repository handles data storage and retrieval for sports gambling functionality.
 * In a real implementation, this would interact with a database.
 */

import { 
  Game, 
  BettingPick, 
  DailyPicks, 
  SportType 
} from '@/models/sports';

// In-memory storage (would be replaced with a database in a real implementation)
const games: Game[] = [];
const picks: BettingPick[] = [];
const dailyPicks: DailyPicks[] = [];

/**
 * Game Repository
 */
export const GameRepository = {
  /**
   * Save a game
   */
  save: async (game: Game): Promise<Game> => {
    const existingIndex = games.findIndex(g => g.id === game.id);
    
    if (existingIndex >= 0) {
      // Update existing game
      games[existingIndex] = game;
    } else {
      // Add new game
      games.push(game);
    }
    
    return game;
  },
  
  /**
   * Get a game by ID
   */
  getById: async (id: string): Promise<Game | null> => {
    const game = games.find(g => g.id === id);
    return game || null;
  },
  
  /**
   * Get all games
   */
  getAll: async (): Promise<Game[]> => {
    return [...games];
  },
  
  /**
   * Get games by sport
   */
  getBySport: async (sport: SportType): Promise<Game[]> => {
    return games.filter(g => g.sport === sport);
  },
  
  /**
   * Get games by date range
   */
  getByDateRange: async (startDate: Date, endDate: Date): Promise<Game[]> => {
    return games.filter(g => {
      const gameDate = new Date(g.startTime);
      return gameDate >= startDate && gameDate <= endDate;
    });
  },
  
  /**
   * Delete a game
   */
  delete: async (id: string): Promise<boolean> => {
    const initialLength = games.length;
    const filteredGames = games.filter(g => g.id !== id);
    
    // Update the games array
    games.length = 0;
    games.push(...filteredGames);
    
    return games.length < initialLength;
  }
};

/**
 * Betting Pick Repository
 */
export const PickRepository = {
  /**
   * Save a betting pick
   */
  save: async (pick: BettingPick): Promise<BettingPick> => {
    const existingIndex = picks.findIndex(p => p.id === pick.id);
    
    if (existingIndex >= 0) {
      // Update existing pick
      picks[existingIndex] = pick;
    } else {
      // Add new pick
      picks.push(pick);
    }
    
    return pick;
  },
  
  /**
   * Get a pick by ID
   */
  getById: async (id: string): Promise<BettingPick | null> => {
    const pick = picks.find(p => p.id === id);
    return pick || null;
  },
  
  /**
   * Get all picks
   */
  getAll: async (): Promise<BettingPick[]> => {
    return [...picks];
  },
  
  /**
   * Get picks by game ID
   */
  getByGameId: async (gameId: string): Promise<BettingPick[]> => {
    return picks.filter(p => p.gameId === gameId);
  },
  
  /**
   * Get picks by result
   */
  getByResult: async (result: 'win' | 'loss' | 'push' | 'pending'): Promise<BettingPick[]> => {
    return picks.filter(p => p.result === result);
  },
  
  /**
   * Get picks by date range
   */
  getByDateRange: async (startDate: Date, endDate: Date): Promise<BettingPick[]> => {
    return picks.filter(p => {
      const pickDate = new Date(p.createdAt);
      return pickDate >= startDate && pickDate <= endDate;
    });
  },
  
  /**
   * Delete a pick
   */
  delete: async (id: string): Promise<boolean> => {
    const initialLength = picks.length;
    const filteredPicks = picks.filter(p => p.id !== id);
    
    // Update the picks array
    picks.length = 0;
    picks.push(...filteredPicks);
    
    return picks.length < initialLength;
  }
};

/**
 * Daily Picks Repository
 */
export const DailyPicksRepository = {
  /**
   * Save daily picks
   */
  save: async (dailyPick: DailyPicks): Promise<DailyPicks> => {
    const existingIndex = dailyPicks.findIndex(dp => dp.id === dailyPick.id);
    
    if (existingIndex >= 0) {
      // Update existing daily picks
      dailyPicks[existingIndex] = dailyPick;
    } else {
      // Add new daily picks
      dailyPicks.push(dailyPick);
    }
    
    return dailyPick;
  },
  
  /**
   * Get daily picks by ID
   */
  getById: async (id: string): Promise<DailyPicks | null> => {
    const dailyPick = dailyPicks.find(dp => dp.id === id);
    return dailyPick || null;
  },
  
  /**
   * Get all daily picks
   */
  getAll: async (): Promise<DailyPicks[]> => {
    return [...dailyPicks];
  },
  
  /**
   * Get daily picks by date
   */
  getByDate: async (date: Date): Promise<DailyPicks | null> => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const dailyPick = dailyPicks.find(dp => {
      const dpDate = new Date(dp.date);
      dpDate.setHours(0, 0, 0, 0);
      
      return dpDate.getTime() === targetDate.getTime();
    });
    
    return dailyPick || null;
  },
  
  /**
   * Get daily picks by status
   */
  getByStatus: async (status: 'pending' | 'posted' | 'completed'): Promise<DailyPicks[]> => {
    return dailyPicks.filter(dp => dp.status === status);
  },
  
  /**
   * Get daily picks by date range
   */
  getByDateRange: async (startDate: Date, endDate: Date): Promise<DailyPicks[]> => {
    return dailyPicks.filter(dp => {
      const dpDate = new Date(dp.date);
      return dpDate >= startDate && dpDate <= endDate;
    });
  },
  
  /**
   * Delete daily picks
   */
  delete: async (id: string): Promise<boolean> => {
    const initialLength = dailyPicks.length;
    const filteredDailyPicks = dailyPicks.filter(dp => dp.id !== id);
    
    // Update the dailyPicks array
    dailyPicks.length = 0;
    dailyPicks.push(...filteredDailyPicks);
    
    return dailyPicks.length < initialLength;
  }
};
