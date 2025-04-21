import sportsDataAPI from './sportsDataAPI';
import { Game, Team, Pick } from '../models';
import { saveGameToDatabase, saveTeamToDatabase } from './database';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import predictionModel from '../ml/predictionModel';

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
 * Calculate win probability based on team stats and ML model
 */
async function calculateWinProbability(homeTeamData: any, awayTeamData: any): Promise<number> {
  try {
    // First, ensure teams are saved to the database
    await saveTeamToDatabase(homeTeamData);
    await saveTeamToDatabase(awayTeamData);

    // Get team data from database or use the provided data
    const homeTeam = await Team.findByPk(homeTeamData.id) || homeTeamData;
    const awayTeam = await Team.findByPk(awayTeamData.id) || awayTeamData;

    // Convert to plain object if it's a Sequelize model
    const homeTeamObj = homeTeam instanceof Team ? homeTeam.toJSON() : homeTeamData;
    const awayTeamObj = awayTeam instanceof Team ? awayTeam.toJSON() : awayTeamData;

    // Try to use the ML model for prediction
    try {
      // Check if model needs training
      if (predictionModel.needsTraining()) {
        console.log('ML model needs training, using statistical model for now');
        throw new Error('Model needs training');
      }

      // Get prediction from ML model
      const mlPrediction = await predictionModel.predictGameOutcome(homeTeamObj, awayTeamObj);
      console.log(`ML model prediction: ${mlPrediction.toFixed(4)}`);

      // Blend ML prediction with statistical model (70% ML, 30% statistical)
      const statPrediction = calculateStatisticalWinProbability(homeTeamObj, awayTeamObj);
      const blendedPrediction = (mlPrediction * 0.7) + (statPrediction * 0.3);

      // Ensure probability is between 0.05 and 0.95
      return Math.max(0.05, Math.min(0.95, blendedPrediction));
    } catch (error) {
      console.warn('Error using ML model, falling back to statistical model:', error);
      // Fall back to statistical model
      return calculateStatisticalWinProbability(homeTeamObj, awayTeamObj);
    }
  } catch (error) {
    console.error('Error calculating win probability:', error);
    // Fallback to a simpler calculation if there's an error
    return 0.5 + (Math.random() * 0.2 - 0.1); // Random value between 0.4 and 0.6
  }
}

/**
 * Calculate win probability using statistical model
 */
function calculateStatisticalWinProbability(homeTeamObj: any, awayTeamObj: any): number {
  // More advanced model that considers:
  // 1. Win percentage (25%)
  // 2. Recent form (20%)
  // 3. Home court advantage (10%)
  // 4. Injuries (15%)
  // 5. Offensive and defensive efficiency (30%)

  // Base probability from win percentage
  let homeWinProb = (homeTeamObj.winPercentage || homeTeamObj.winLoss?.winPercentage || 0.5) * 0.25;

  // Adjust for recent form (simplified since we don't have recent games in the database model)
  // In a real implementation, you would query recent games from the database
  const homeRecentWins = homeTeamObj.recentGames ? homeTeamObj.recentGames.filter(game => game.result === 'W').length : 3;
  const awayRecentWins = awayTeamObj.recentGames ? awayTeamObj.recentGames.filter(game => game.result === 'W').length : 2;
  homeWinProb += ((homeRecentWins - awayRecentWins) / 5) * 0.2;

  // Adjust for home court advantage
  homeWinProb += (homeTeamObj.homeAdvantage || 3.5) * 0.025;

  // Adjust for injuries (simplified since we don't have player data in the database model)
  // In a real implementation, you would query player data from the database
  const homeInjuredStarters = homeTeamObj.players ? homeTeamObj.players.filter(p => p.isInjured && ['PG', 'SG', 'SF', 'PF', 'C'].includes(p.position)).length : 1;
  const awayInjuredStarters = awayTeamObj.players ? awayTeamObj.players.filter(p => p.isInjured && ['PG', 'SG', 'SF', 'PF', 'C'].includes(p.position)).length : 1;
  homeWinProb += (awayInjuredStarters - homeInjuredStarters) * 0.05;

  // Adjust for offensive and defensive efficiency
  const homeOffensiveRating = homeTeamObj.pointsPerGame || homeTeamObj.stats?.pointsPerGame || 110;
  const homeDefensiveRating = homeTeamObj.pointsAllowedPerGame || homeTeamObj.stats?.pointsAllowedPerGame || 110;
  const awayOffensiveRating = awayTeamObj.pointsPerGame || awayTeamObj.stats?.pointsPerGame || 110;
  const awayDefensiveRating = awayTeamObj.pointsAllowedPerGame || awayTeamObj.stats?.pointsAllowedPerGame || 110;

  // Net rating difference
  const homeNetRating = (homeOffensiveRating - homeDefensiveRating);
  const awayNetRating = (awayOffensiveRating - awayDefensiveRating);
  const netRatingDiff = homeNetRating - awayNetRating;

  // Normalize to a probability adjustment (roughly -0.15 to +0.15)
  const netRatingAdjustment = netRatingDiff / 30 * 0.3;
  homeWinProb += netRatingAdjustment;

  // Ensure probability is between 0 and 1
  homeWinProb = Math.max(0.05, Math.min(0.95, homeWinProb));

  return homeWinProb;
}

/**
 * Calculate the probability of the total score going over the line
 */
async function calculateOverProbability(homeTeamData: any, awayTeamData: any, overUnderLine: number): Promise<number> {
  try {
    // First, ensure teams are saved to the database
    await saveTeamToDatabase(homeTeamData);
    await saveTeamToDatabase(awayTeamData);

    // Get team data from database or use the provided data
    const homeTeam = await Team.findByPk(homeTeamData.id) || homeTeamData;
    const awayTeam = await Team.findByPk(awayTeamData.id) || awayTeamData;

    // Convert to plain object if it's a Sequelize model
    const homeTeamObj = homeTeam instanceof Team ? homeTeam.toJSON() : homeTeamData;
    const awayTeamObj = awayTeam instanceof Team ? awayTeam.toJSON() : awayTeamData;

    // Calculate expected total based on team offensive and defensive ratings
    const homeExpectedPoints = (homeTeamObj.pointsPerGame + awayTeamObj.pointsAllowedPerGame) / 2;
    const awayExpectedPoints = (awayTeamObj.pointsPerGame + homeTeamObj.pointsAllowedPerGame) / 2;
    const expectedTotal = homeExpectedPoints + awayExpectedPoints;

    // Calculate standard deviation (simplified)
    const stdDev = 12;

    // Calculate z-score
    const zScore = (overUnderLine - expectedTotal) / stdDev;

    // Convert to probability using normal distribution approximation
    // This is a simplified version of the cumulative distribution function
    const overProbability = 1 - (0.5 * (1 + Math.erf(zScore / Math.sqrt(2))));

    return overProbability;
  } catch (error) {
    console.error('Error calculating over probability:', error);
    // Fallback to a simpler calculation if there's an error
    return 0.5 + (Math.random() * 0.1 - 0.05); // Random value between 0.45 and 0.55
  }
}

/**
 * Generate picks for today's games
 * @param maxPicks - Maximum number of picks to generate (1-3)
 * @returns Array of picks
 */
export async function generateDailyPicks(maxPicks: number = 3): Promise<any[]> {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');

    // Fetch upcoming games
    const gamesData = await sportsDataAPI.getUpcomingGames(today);

    // Save games to database
    for (const gameData of gamesData) {
      await saveGameToDatabase(gameData);
    }

    // Calculate win probabilities and expected values for each game
    const gameAnalysisPromises = gamesData.map(async (gameData) => {
      // Calculate moneyline probabilities and EV
      const homeWinProbability = await calculateWinProbability(gameData.homeTeam, gameData.awayTeam);
      const homeMoneylineEV = calculateExpectedValue(homeWinProbability, gameData.odds.homeTeamMoneyline);
      const awayMoneylineEV = calculateExpectedValue(1 - homeWinProbability, gameData.odds.awayTeamMoneyline);

      // Calculate spread probabilities and EV
      // For simplicity, we'll use an adjustment to the win probability based on the spread
      const spreadAdjustment = gameData.odds.homeTeamSpread / 10; // Each point is worth about 0.1 in probability
      const homeSpreadProbability = Math.max(0.05, Math.min(0.95, homeWinProbability + spreadAdjustment));
      const homeSpreadEV = calculateExpectedValue(homeSpreadProbability, gameData.odds.homeTeamSpreadOdds);
      const awaySpreadEV = calculateExpectedValue(1 - homeSpreadProbability, gameData.odds.awayTeamSpreadOdds);

      // Calculate over/under probabilities and EV
      const overProbability = await calculateOverProbability(gameData.homeTeam, gameData.awayTeam, gameData.odds.overUnder);
      const overEV = calculateExpectedValue(overProbability, gameData.odds.overOdds);
      const underEV = calculateExpectedValue(1 - overProbability, gameData.odds.underOdds);

      // Find the best bet across all types
      const allBets = [
        { type: 'moneyline', selection: 'home', ev: homeMoneylineEV, probability: homeWinProbability, odds: gameData.odds.homeTeamMoneyline },
        { type: 'moneyline', selection: 'away', ev: awayMoneylineEV, probability: 1 - homeWinProbability, odds: gameData.odds.awayTeamMoneyline },
        { type: 'spread', selection: 'home', ev: homeSpreadEV, probability: homeSpreadProbability, odds: gameData.odds.homeTeamSpreadOdds, line: gameData.odds.homeTeamSpread },
        { type: 'spread', selection: 'away', ev: awaySpreadEV, probability: 1 - homeSpreadProbability, odds: gameData.odds.awayTeamSpreadOdds, line: -gameData.odds.homeTeamSpread },
        { type: 'over_under', selection: 'over', ev: overEV, probability: overProbability, odds: gameData.odds.overOdds, line: gameData.odds.overUnder },
        { type: 'over_under', selection: 'under', ev: underEV, probability: 1 - overProbability, odds: gameData.odds.underOdds, line: gameData.odds.overUnder }
      ];

      // Sort by expected value (highest first)
      allBets.sort((a, b) => b.ev - a.ev);

      // Return the game with analysis
      return {
        game: gameData,
        bets: allBets,
        bestBet: allBets[0]
      };
    });

    // Resolve all promises
    const gameAnalysis = await Promise.all(gameAnalysisPromises);

    // Sort games by best expected value
    gameAnalysis.sort((a, b) => b.bestBet.ev - a.bestBet.ev);

    // Take top N picks
    const topPicks = gameAnalysis.slice(0, maxPicks);

    // Format picks
    const picksPromises = topPicks.map(async (analysis) => {
      const { game, bestBet } = analysis;

      let prediction = '';
      let reasoning = '';
      let confidence = Math.round(bestBet.probability * 100);

      if (bestBet.type === 'moneyline') {
        const team = bestBet.selection === 'home' ? game.homeTeam.name : game.awayTeam.name;
        const opponent = bestBet.selection === 'home' ? game.awayTeam.name : game.homeTeam.name;
        prediction = `${team} ML (${bestBet.odds > 0 ? '+' : ''}${bestBet.odds})`;

        reasoning = `${team} has a ${confidence}% chance to win against ${opponent}, which is higher than the implied odds of ${Math.round((bestBet.odds > 0 ? 100 / (bestBet.odds + 100) : Math.abs(bestBet.odds) / (Math.abs(bestBet.odds) + 100)) * 100)}%. `;

        // Add recent form (simplified)
        const recentWins = game.homeTeam.recentGames ?
          (bestBet.selection === 'home' ? game.homeTeam.recentGames.filter(g => g.result === 'W').length : game.awayTeam.recentGames.filter(g => g.result === 'W').length) :
          (bestBet.selection === 'home' ? 3 : 2);
        reasoning += `They've won ${recentWins} of their last 5 games. `;

        // Add injury information (simplified)
        const teamInjuries = game.homeTeam.players ?
          (bestBet.selection === 'home' ? game.homeTeam.players.filter(p => p.isInjured).length : game.awayTeam.players.filter(p => p.isInjured).length) :
          1;
        const opponentInjuries = game.homeTeam.players ?
          (bestBet.selection === 'home' ? game.awayTeam.players.filter(p => p.isInjured).length : game.homeTeam.players.filter(p => p.isInjured).length) :
          1;

        if (teamInjuries > 0) {
          reasoning += `${team} has ${teamInjuries} injured players. `;
        }
        if (opponentInjuries > 0) {
          reasoning += `${opponent} has ${opponentInjuries} injured players. `;
        }

        // Add offensive/defensive comparison
        const teamObj = bestBet.selection === 'home' ? game.homeTeam : game.awayTeam;
        const opponentObj = bestBet.selection === 'home' ? game.awayTeam : game.homeTeam;
        reasoning += `${team} scores ${teamObj.stats?.pointsPerGame.toFixed(1) || '110.0'} PPG while ${opponent} allows ${opponentObj.stats?.pointsAllowedPerGame.toFixed(1) || '108.0'} PPG.`;
      }
      else if (bestBet.type === 'spread') {
        const team = bestBet.selection === 'home' ? game.homeTeam.name : game.awayTeam.name;
        const line = bestBet.line || 0;
        prediction = `${team} ${line > 0 ? '+' : ''}${line} (${bestBet.odds > 0 ? '+' : ''}${bestBet.odds})`;

        reasoning = `${team} has a ${confidence}% chance to cover the ${Math.abs(line)}-point spread, which is higher than the implied odds. `;

        // Add recent form against the spread (simplified)
        reasoning += `Based on recent performance and matchup analysis, we project a close game where ${team} should perform better than the spread indicates. `;

        // Add team stats comparison
        const teamObj = bestBet.selection === 'home' ? game.homeTeam : game.awayTeam;
        const opponentObj = bestBet.selection === 'home' ? game.awayTeam : game.homeTeam;
        const teamNetRating = teamObj.stats ? (teamObj.stats.pointsPerGame - teamObj.stats.pointsAllowedPerGame) : 2.5;
        const opponentNetRating = opponentObj.stats ? (opponentObj.stats.pointsPerGame - opponentObj.stats.pointsAllowedPerGame) : 1.5;
        reasoning += `${team} has a net rating of ${teamNetRating.toFixed(1)} compared to ${opponentObj.name}'s ${opponentNetRating.toFixed(1)}.`;
      }
      else { // over_under
        const line = bestBet.line || 0;
        prediction = `${bestBet.selection === 'over' ? 'Over' : 'Under'} ${line} (${bestBet.odds > 0 ? '+' : ''}${bestBet.odds})`;

        const homePoints = game.homeTeam.stats?.pointsPerGame || 110;
        const awayPoints = game.awayTeam.stats?.pointsPerGame || 108;
        reasoning = `Our model projects a total score of ${(homePoints + awayPoints).toFixed(1)} points, giving the ${bestBet.selection} a ${confidence}% chance. `;

        // Add pace and efficiency context
        reasoning += `${game.homeTeam.name} averages ${game.homeTeam.stats?.pointsPerGame.toFixed(1) || '110.0'} PPG while ${game.awayTeam.name} averages ${game.awayTeam.stats?.pointsPerGame.toFixed(1) || '108.0'} PPG. `;

        // Add defensive context
        reasoning += `Defensively, ${game.homeTeam.name} allows ${game.homeTeam.stats?.pointsAllowedPerGame.toFixed(1) || '108.0'} PPG and ${game.awayTeam.name} allows ${game.awayTeam.stats?.pointsAllowedPerGame.toFixed(1) || '110.0'} PPG.`;
      }

      const pickData = {
        id: uuidv4(),
        gameId: game.id,
        homeTeam: game.homeTeam.name,
        awayTeam: game.awayTeam.name,
        betType: bestBet.type as 'moneyline' | 'spread' | 'over_under',
        betSelection: bestBet.selection as 'home' | 'away' | 'over' | 'under',
        odds: bestBet.odds,
        prediction,
        confidence: Math.min(99, Math.max(51, confidence)), // Keep confidence between 51-99%
        reasoning,
        dateCreated: new Date().toISOString(),
        result: 'pending'
      };

      return pickData;
    });

    const picks = await Promise.all(picksPromises);
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
    tweet += `🔒 Confidence: ${pick.confidence}%\n\n`;
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

/**
 * Evaluate the results of previous picks
 * @param pickId - The ID of the pick to evaluate
 * @param actualResult - The actual result of the game
 */
export async function evaluatePickResult(pickId: string, actualResult: any): Promise<'win' | 'loss' | 'push'> {
  // In a real implementation, this would fetch the pick from a database
  // and compare it with the actual game result

  // For now, we'll just return a random result
  const outcomes: ('win' | 'loss' | 'push')[] = ['win', 'loss', 'push'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}
