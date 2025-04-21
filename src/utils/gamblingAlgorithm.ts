import axios from 'axios';

// Types for our sports data
interface Team {
  id: number;
  name: string;
  winPercentage: number;
  recentForm: number[]; // Last 5 games: 1 for win, 0 for loss
  homeAdvantage?: number;
  injuries?: number; // 0-10 scale, 10 being most severe
}

interface Game {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  odds: {
    homeTeamOdds: number;
    awayTeamOdds: number;
    overUnder: number;
  };
}

interface Pick {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number; // 0-100%
  reasoning: string;
}

/**
 * Fetch upcoming games data
 * In a real implementation, this would connect to a sports data API
 */
export async function fetchUpcomingGames(): Promise<Game[]> {
  // This is a mock implementation
  // In a real app, you would fetch from a sports API like ESPN, SportRadar, etc.
  
  // For now, we'll return mock data
  const mockGames: Game[] = [
    {
      id: 1,
      homeTeam: {
        id: 101,
        name: "Los Angeles Lakers",
        winPercentage: 0.65,
        recentForm: [1, 1, 0, 1, 1],
        homeAdvantage: 3.2,
        injuries: 2
      },
      awayTeam: {
        id: 102,
        name: "Boston Celtics",
        winPercentage: 0.72,
        recentForm: [1, 1, 1, 0, 1],
        injuries: 4
      },
      date: new Date(),
      odds: {
        homeTeamOdds: -110,
        awayTeamOdds: -110,
        overUnder: 220.5
      }
    },
    {
      id: 2,
      homeTeam: {
        id: 103,
        name: "Golden State Warriors",
        winPercentage: 0.58,
        recentForm: [0, 1, 0, 1, 1],
        homeAdvantage: 4.1,
        injuries: 5
      },
      awayTeam: {
        id: 104,
        name: "Brooklyn Nets",
        winPercentage: 0.52,
        recentForm: [0, 0, 1, 1, 0],
        injuries: 3
      },
      date: new Date(),
      odds: {
        homeTeamOdds: -120,
        awayTeamOdds: +100,
        overUnder: 235.5
      }
    },
    {
      id: 3,
      homeTeam: {
        id: 105,
        name: "Miami Heat",
        winPercentage: 0.61,
        recentForm: [1, 1, 1, 0, 1],
        homeAdvantage: 3.8,
        injuries: 1
      },
      awayTeam: {
        id: 106,
        name: "Philadelphia 76ers",
        winPercentage: 0.59,
        recentForm: [1, 0, 1, 1, 0],
        injuries: 6
      },
      date: new Date(),
      odds: {
        homeTeamOdds: +105,
        awayTeamOdds: -125,
        overUnder: 215.5
      }
    }
  ];
  
  return mockGames;
}

/**
 * Calculate the expected value of a bet based on our model's probability vs. the implied probability from odds
 */
function calculateExpectedValue(modelProbability: number, odds: number): number {
  // Convert American odds to implied probability
  let impliedProbability: number;
  if (odds > 0) {
    impliedProbability = 100 / (odds + 100);
  } else {
    impliedProbability = Math.abs(odds) / (Math.abs(odds) + 100);
  }
  
  // Calculate expected value
  // EV = (Probability of winning * Potential profit) - (Probability of losing * Stake)
  const potentialProfit = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  const ev = (modelProbability * potentialProfit) - ((1 - modelProbability) * 1);
  
  return ev;
}

/**
 * Calculate win probability based on team stats
 */
function calculateWinProbability(homeTeam: Team, awayTeam: Team): number {
  // Basic model that considers:
  // 1. Win percentage
  // 2. Recent form (last 5 games)
  // 3. Home court advantage
  // 4. Injuries
  
  // Calculate average recent form
  const homeRecentFormAvg = homeTeam.recentForm.reduce((a, b) => a + b, 0) / homeTeam.recentForm.length;
  const awayRecentFormAvg = awayTeam.recentForm.reduce((a, b) => a + b, 0) / awayTeam.recentForm.length;
  
  // Base probability from win percentage
  let homeWinProb = homeTeam.winPercentage * 0.4 + awayTeam.winPercentage * 0.4;
  
  // Adjust for recent form (30% weight)
  homeWinProb += (homeRecentFormAvg - awayRecentFormAvg) * 0.15;
  
  // Adjust for home court advantage (15% weight)
  homeWinProb += (homeTeam.homeAdvantage || 3.5) * 0.01;
  
  // Adjust for injuries (15% weight)
  // Higher injury number means more injuries, which is bad
  const injuryFactor = ((awayTeam.injuries || 0) - (homeTeam.injuries || 0)) * 0.015;
  homeWinProb += injuryFactor;
  
  // Ensure probability is between 0 and 1
  homeWinProb = Math.max(0, Math.min(1, homeWinProb));
  
  return homeWinProb;
}

/**
 * Generate picks for today's games
 * @param maxPicks - Maximum number of picks to generate (1-3)
 * @returns Array of picks
 */
export async function generateDailyPicks(maxPicks: number = 3): Promise<Pick[]> {
  try {
    // Fetch upcoming games
    const games = await fetchUpcomingGames();
    
    // Calculate win probabilities and expected values for each game
    const gameAnalysis = games.map(game => {
      const homeWinProbability = calculateWinProbability(game.homeTeam, game.awayTeam);
      const homeTeamEV = calculateExpectedValue(homeWinProbability, game.odds.homeTeamOdds);
      const awayTeamEV = calculateExpectedValue(1 - homeWinProbability, game.odds.awayTeamOdds);
      
      // Determine if over or under is more likely
      // This would be more complex in a real model
      const predictedTotalScore = (game.homeTeam.winPercentage + game.awayTeam.winPercentage) * 110;
      const overUnderEV = predictedTotalScore > game.odds.overUnder ? 0.05 : -0.05;
      
      return {
        game,
        homeWinProbability,
        homeTeamEV,
        awayTeamEV,
        overUnderEV,
        bestBet: Math.max(homeTeamEV, awayTeamEV, overUnderEV),
        bestBetType: homeTeamEV > awayTeamEV && homeTeamEV > overUnderEV 
          ? 'home' 
          : awayTeamEV > overUnderEV 
            ? 'away' 
            : 'overUnder'
      };
    });
    
    // Sort by expected value (highest first)
    gameAnalysis.sort((a, b) => b.bestBet - a.bestBet);
    
    // Take top N picks
    const topPicks = gameAnalysis.slice(0, maxPicks);
    
    // Format picks
    const picks: Pick[] = topPicks.map(analysis => {
      const { game, homeWinProbability, bestBetType } = analysis;
      
      let prediction = '';
      let reasoning = '';
      let confidence = 0;
      
      if (bestBetType === 'home') {
        prediction = `${game.homeTeam.name} (${game.odds.homeTeamOdds})`;
        reasoning = `${game.homeTeam.name} has a ${(homeWinProbability * 100).toFixed(1)}% chance to win, which is higher than the implied odds. They've won ${game.homeTeam.recentForm.filter(x => x === 1).length} of their last 5 games.`;
        confidence = homeWinProbability * 100;
      } else if (bestBetType === 'away') {
        prediction = `${game.awayTeam.name} (${game.odds.awayTeamOdds})`;
        reasoning = `${game.awayTeam.name} has a ${((1 - homeWinProbability) * 100).toFixed(1)}% chance to win, which is higher than the implied odds. They've won ${game.awayTeam.recentForm.filter(x => x === 1).length} of their last 5 games.`;
        confidence = (1 - homeWinProbability) * 100;
      } else {
        // Over/Under pick
        const overOrUnder = analysis.overUnderEV > 0 ? 'Over' : 'Under';
        prediction = `${overOrUnder} ${game.odds.overUnder}`;
        reasoning = `Our model predicts a total score ${overOrUnder.toLowerCase()} the line of ${game.odds.overUnder} points.`;
        confidence = 55 + Math.abs(analysis.overUnderEV) * 100; // Just a simple way to convert EV to confidence
      }
      
      return {
        gameId: game.id,
        homeTeam: game.homeTeam.name,
        awayTeam: game.awayTeam.name,
        prediction,
        confidence: Math.min(99, Math.max(51, confidence)), // Keep confidence between 51-99%
        reasoning
      };
    });
    
    return picks;
  } catch (error) {
    console.error('Error generating picks:', error);
    throw error;
  }
}

/**
 * Format picks into a tweet-friendly format
 */
export function formatPicksForTweet(picks: Pick[]): string {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
  
  let tweet = `🏀 DAILY PICKS: ${date} 🏀\n\n`;
  
  picks.forEach((pick, index) => {
    tweet += `PICK ${index + 1}: ${pick.awayTeam} @ ${pick.homeTeam}\n`;
    tweet += `🔮 ${pick.prediction}\n`;
    tweet += `🔒 Confidence: ${pick.confidence.toFixed(0)}%\n\n`;
  });
  
  tweet += `#SportsBetting #GamblingPicks #SportsTips`;
  
  // Twitter has a 280 character limit
  if (tweet.length > 280) {
    // Simplify the tweet if it's too long
    tweet = `🏀 DAILY PICKS: ${date} 🏀\n\n`;
    picks.forEach((pick, index) => {
      tweet += `PICK ${index + 1}: ${pick.prediction}\n`;
    });
    tweet += `\n#SportsBetting #GamblingPicks`;
  }
  
  return tweet;
}
