import axios from 'axios';
import { format, subDays } from 'date-fns';
import apiSportsService from '../services/apiSportsService';

// Types for our sports data
export interface Player {
  id: number;
  name: string;
  position: string;
  isInjured: boolean;
  injurySeverity?: 'minor' | 'moderate' | 'severe';
}

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  location: string;
  conference: string;
  division: string;
  winLoss: {
    wins: number;
    losses: number;
    winPercentage: number;
  };
  recentGames: {
    date: string;
    opponent: string;
    isHome: boolean;
    result: 'W' | 'L';
    score: {
      team: number;
      opponent: number;
    };
  }[];
  stats: {
    pointsPerGame: number;
    pointsAllowedPerGame: number;
    reboundsPerGame: number;
    assistsPerGame: number;
    turnoversPerGame: number;
    fieldGoalPercentage: number;
    threePointPercentage: number;
  };
  players: Player[];
  homeAdvantage?: number;
}

export interface Game {
  id: number;
  date: string;
  time: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
  odds: {
    homeTeamMoneyline: number;
    awayTeamMoneyline: number;
    homeTeamSpread: number;
    homeTeamSpreadOdds: number;
    awayTeamSpreadOdds: number;
    overUnder: number;
    overOdds: number;
    underOdds: number;
  };
  status: 'scheduled' | 'in_progress' | 'final';
  score?: {
    homeTeam: number;
    awayTeam: number;
  };
}

export interface Pick {
  id: string;
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  betType: 'moneyline' | 'spread' | 'over_under';
  betSelection: 'home' | 'away' | 'over' | 'under';
  odds: number;
  prediction: string;
  confidence: number; // 0-100%
  reasoning: string;
  dateCreated: string;
  result?: 'win' | 'loss' | 'push' | 'pending';
}

// Mock API class - in a real implementation, this would connect to a sports data API
class SportsDataAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SPORTS_DATA_API_KEY || 'mock_api_key';
    this.baseUrl = process.env.SPORTS_DATA_API_URL || 'https://api.sportsdata.io/v3/nba';
  }

  /**
   * Fetch upcoming games for a specific date
   * @param date - Date in YYYY-MM-DD format, defaults to today
   */
  async getUpcomingGames(date: string = format(new Date(), 'yyyy-MM-dd')): Promise<Game[]> {
    try {
      // Try to get real data from API-Sports
      const apiGames = await apiSportsService.getGames(date);

      if (apiGames && apiGames.length > 0) {
        console.log(`Retrieved ${apiGames.length} games from API-Sports`);
        return apiGames;
      }

      // Fallback to mock data
      console.log('Using mock game data');
      return this.getMockGames(date);
    } catch (error) {
      console.error('Error fetching upcoming games:', error);
      // Fallback to mock data on error
      return this.getMockGames(date);
    }
  }

  /**
   * Fetch team details including recent performance
   * @param teamId - The ID of the team
   */
  async getTeamDetails(teamId: number): Promise<Team> {
    try {
      // Try to get real data from API-Sports
      const teams = await apiSportsService.getTeams();
      const team = teams.find(t => t.id === teamId);

      if (team) {
        console.log(`Retrieved team details for ${team.name} from API-Sports`);

        // Get team statistics
        const stats = await apiSportsService.getTeamStatistics(teamId);
        if (stats) {
          // Update team with statistics
          team.stats.pointsPerGame = stats.points?.for?.average?.all || team.stats.pointsPerGame;
          team.stats.pointsAllowedPerGame = stats.points?.against?.average?.all || team.stats.pointsAllowedPerGame;
        }

        return team as Team;
      }

      // Fallback to mock data
      console.log('Using mock team data');
      return this.getMockTeams().find(team => team.id === teamId) as Team;
    } catch (error) {
      console.error('Error fetching team details:', error);
      // Fallback to mock data on error
      return this.getMockTeams().find(team => team.id === teamId) as Team;
    }
  }

  /**
   * Fetch betting odds for upcoming games
   * @param date - Date in YYYY-MM-DD format, defaults to today
   */
  async getBettingOdds(date: string = format(new Date(), 'yyyy-MM-dd')): Promise<any> {
    try {
      // Try to get real data from API-Sports
      const apiOdds = await apiSportsService.getOdds(date);

      if (apiOdds && apiOdds.length > 0) {
        console.log(`Retrieved odds for ${apiOdds.length} games from API-Sports`);

        // Format the odds data
        return apiOdds.map(odds => {
          // Find the FanDuel bookmaker (or any available bookmaker)
          const bookmaker = odds.bookmakers.find(b => b.name === 'FanDuel') || odds.bookmakers[0];

          if (!bookmaker) {
            return null;
          }

          // Get the markets
          const spreadsMarket = bookmaker.markets.find(m => m.key === 'spreads');
          const totalsMarket = bookmaker.markets.find(m => m.key === 'totals');
          const moneylineMarket = bookmaker.markets.find(m => m.key === 'h2h');

          if (!spreadsMarket || !totalsMarket || !moneylineMarket) {
            return null;
          }

          // Extract the odds
          const homeSpread = spreadsMarket.outcomes.find(o => o.name.includes('Lakers') || o.name.includes('Warriors'));
          const awaySpread = spreadsMarket.outcomes.find(o => o.name.includes('Celtics') || o.name.includes('Bucks'));
          const overTotal = totalsMarket.outcomes.find(o => o.name === 'Over');
          const underTotal = totalsMarket.outcomes.find(o => o.name === 'Under');
          const homeMoneyline = moneylineMarket.outcomes.find(o => o.name.includes('Lakers') || o.name.includes('Warriors'));
          const awayMoneyline = moneylineMarket.outcomes.find(o => o.name.includes('Celtics') || o.name.includes('Bucks'));

          return {
            gameId: odds.id,
            homeTeamMoneyline: homeMoneyline?.price || -110,
            awayTeamMoneyline: awayMoneyline?.price || -110,
            homeTeamSpread: homeSpread?.point || -2.5,
            homeTeamSpreadOdds: homeSpread?.price || -110,
            awayTeamSpreadOdds: awaySpread?.price || -110,
            overUnder: overTotal?.point || 225.5,
            overOdds: overTotal?.price || -110,
            underOdds: underTotal?.price || -110
          };
        }).filter(Boolean);
      }

      // Fallback to mock data
      console.log('Using mock odds data');
      const games = this.getMockGames(date);
      return games.map(game => ({
        gameId: game.id,
        homeTeamMoneyline: game.odds.homeTeamMoneyline,
        awayTeamMoneyline: game.odds.awayTeamMoneyline,
        homeTeamSpread: game.odds.homeTeamSpread,
        homeTeamSpreadOdds: game.odds.homeTeamSpreadOdds,
        awayTeamSpreadOdds: game.odds.awayTeamSpreadOdds,
        overUnder: game.odds.overUnder,
        overOdds: game.odds.overOdds,
        underOdds: game.odds.underOdds
      }));
    } catch (error) {
      console.error('Error fetching betting odds:', error);
      // Fallback to mock data on error
      const games = this.getMockGames(date);
      return games.map(game => ({
        gameId: game.id,
        homeTeamMoneyline: game.odds.homeTeamMoneyline,
        awayTeamMoneyline: game.odds.awayTeamMoneyline,
        homeTeamSpread: game.odds.homeTeamSpread,
        homeTeamSpreadOdds: game.odds.homeTeamSpreadOdds,
        awayTeamSpreadOdds: game.odds.awayTeamSpreadOdds,
        overUnder: game.odds.overUnder,
        overOdds: game.odds.overOdds,
        underOdds: game.odds.underOdds
      }));
    }
  }

  /**
   * Fetch historical game results for a specific date
   * @param date - Date in YYYY-MM-DD format
   */
  async getHistoricalResults(date: string): Promise<any> {
    try {
      // In a real implementation, this would be an API call
      // const response = await axios.get(`${this.baseUrl}/scores/${date}`, {
      //   headers: { 'Ocp-Apim-Subscription-Key': this.apiKey }
      // });
      // return response.data;

      // For now, return mock data
      const games = this.getMockGames(date);
      // Simulate that these games are completed
      return games.map(game => ({
        ...game,
        status: 'final',
        score: {
          homeTeam: Math.floor(Math.random() * 30) + 90, // Random score between 90-120
          awayTeam: Math.floor(Math.random() * 30) + 90
        }
      }));
    } catch (error) {
      console.error('Error fetching historical results:', error);
      throw error;
    }
  }

  /**
   * Generate mock teams data
   */
  private getMockTeams(): Team[] {
    return [
      {
        id: 1,
        name: "Lakers",
        abbreviation: "LAL",
        location: "Los Angeles",
        conference: "Western",
        division: "Pacific",
        winLoss: {
          wins: 15,
          losses: 7,
          winPercentage: 0.682
        },
        recentGames: [
          {
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
            opponent: "Clippers",
            isHome: true,
            result: "W",
            score: {
              team: 112,
              opponent: 108
            }
          },
          {
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
            opponent: "Warriors",
            isHome: false,
            result: "W",
            score: {
              team: 120,
              opponent: 115
            }
          },
          {
            date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
            opponent: "Suns",
            isHome: true,
            result: "L",
            score: {
              team: 105,
              opponent: 110
            }
          },
          {
            date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
            opponent: "Kings",
            isHome: false,
            result: "W",
            score: {
              team: 118,
              opponent: 112
            }
          },
          {
            date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
            opponent: "Nuggets",
            isHome: true,
            result: "W",
            score: {
              team: 125,
              opponent: 120
            }
          }
        ],
        stats: {
          pointsPerGame: 115.2,
          pointsAllowedPerGame: 110.5,
          reboundsPerGame: 44.8,
          assistsPerGame: 26.3,
          turnoversPerGame: 13.2,
          fieldGoalPercentage: 0.478,
          threePointPercentage: 0.372
        },
        players: [
          {
            id: 101,
            name: "LeBron James",
            position: "SF",
            isInjured: false
          },
          {
            id: 102,
            name: "Anthony Davis",
            position: "PF",
            isInjured: false
          },
          {
            id: 103,
            name: "D'Angelo Russell",
            position: "PG",
            isInjured: true,
            injurySeverity: "minor"
          }
        ],
        homeAdvantage: 3.5
      },
      {
        id: 2,
        name: "Celtics",
        abbreviation: "BOS",
        location: "Boston",
        conference: "Eastern",
        division: "Atlantic",
        winLoss: {
          wins: 18,
          losses: 5,
          winPercentage: 0.783
        },
        recentGames: [
          {
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
            opponent: "Knicks",
            isHome: false,
            result: "W",
            score: {
              team: 115,
              opponent: 110
            }
          },
          {
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
            opponent: "76ers",
            isHome: true,
            result: "W",
            score: {
              team: 122,
              opponent: 118
            }
          },
          {
            date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
            opponent: "Bucks",
            isHome: false,
            result: "W",
            score: {
              team: 130,
              opponent: 125
            }
          },
          {
            date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
            opponent: "Heat",
            isHome: true,
            result: "L",
            score: {
              team: 112,
              opponent: 115
            }
          },
          {
            date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
            opponent: "Nets",
            isHome: false,
            result: "W",
            score: {
              team: 128,
              opponent: 120
            }
          }
        ],
        stats: {
          pointsPerGame: 120.5,
          pointsAllowedPerGame: 112.8,
          reboundsPerGame: 45.2,
          assistsPerGame: 28.1,
          turnoversPerGame: 12.5,
          fieldGoalPercentage: 0.492,
          threePointPercentage: 0.385
        },
        players: [
          {
            id: 201,
            name: "Jayson Tatum",
            position: "SF",
            isInjured: false
          },
          {
            id: 202,
            name: "Jaylen Brown",
            position: "SG",
            isInjured: false
          },
          {
            id: 203,
            name: "Kristaps Porzingis",
            position: "C",
            isInjured: true,
            injurySeverity: "moderate"
          }
        ],
        homeAdvantage: 4.2
      },
      {
        id: 3,
        name: "Warriors",
        abbreviation: "GSW",
        location: "Golden State",
        conference: "Western",
        division: "Pacific",
        winLoss: {
          wins: 14,
          losses: 9,
          winPercentage: 0.609
        },
        recentGames: [
          {
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
            opponent: "Kings",
            isHome: true,
            result: "W",
            score: {
              team: 125,
              opponent: 120
            }
          },
          {
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
            opponent: "Lakers",
            isHome: true,
            result: "L",
            score: {
              team: 115,
              opponent: 120
            }
          },
          {
            date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
            opponent: "Clippers",
            isHome: false,
            result: "W",
            score: {
              team: 118,
              opponent: 112
            }
          },
          {
            date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
            opponent: "Suns",
            isHome: true,
            result: "L",
            score: {
              team: 110,
              opponent: 115
            }
          },
          {
            date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
            opponent: "Mavericks",
            isHome: false,
            result: "W",
            score: {
              team: 122,
              opponent: 118
            }
          }
        ],
        stats: {
          pointsPerGame: 118.3,
          pointsAllowedPerGame: 114.2,
          reboundsPerGame: 43.5,
          assistsPerGame: 29.8,
          turnoversPerGame: 14.1,
          fieldGoalPercentage: 0.485,
          threePointPercentage: 0.398
        },
        players: [
          {
            id: 301,
            name: "Stephen Curry",
            position: "PG",
            isInjured: false
          },
          {
            id: 302,
            name: "Klay Thompson",
            position: "SG",
            isInjured: false
          },
          {
            id: 303,
            name: "Draymond Green",
            position: "PF",
            isInjured: false
          }
        ],
        homeAdvantage: 4.0
      },
      {
        id: 4,
        name: "Bucks",
        abbreviation: "MIL",
        location: "Milwaukee",
        conference: "Eastern",
        division: "Central",
        winLoss: {
          wins: 16,
          losses: 7,
          winPercentage: 0.696
        },
        recentGames: [
          {
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
            opponent: "Bulls",
            isHome: false,
            result: "W",
            score: {
              team: 128,
              opponent: 115
            }
          },
          {
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
            opponent: "Cavaliers",
            isHome: true,
            result: "W",
            score: {
              team: 120,
              opponent: 110
            }
          },
          {
            date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
            opponent: "Celtics",
            isHome: true,
            result: "L",
            score: {
              team: 125,
              opponent: 130
            }
          },
          {
            date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
            opponent: "Pacers",
            isHome: false,
            result: "W",
            score: {
              team: 118,
              opponent: 112
            }
          },
          {
            date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
            opponent: "Pistons",
            isHome: true,
            result: "W",
            score: {
              team: 125,
              opponent: 105
            }
          }
        ],
        stats: {
          pointsPerGame: 122.5,
          pointsAllowedPerGame: 115.8,
          reboundsPerGame: 46.2,
          assistsPerGame: 25.1,
          turnoversPerGame: 13.5,
          fieldGoalPercentage: 0.488,
          threePointPercentage: 0.375
        },
        players: [
          {
            id: 401,
            name: "Giannis Antetokounmpo",
            position: "PF",
            isInjured: false
          },
          {
            id: 402,
            name: "Damian Lillard",
            position: "PG",
            isInjured: false
          },
          {
            id: 403,
            name: "Khris Middleton",
            position: "SF",
            isInjured: true,
            injurySeverity: "severe"
          }
        ],
        homeAdvantage: 3.8
      }
    ];
  }

  /**
   * Generate mock games data for a specific date
   */
  private getMockGames(date: string): Game[] {
    const teams = this.getMockTeams();

    return [
      {
        id: 1001,
        date,
        time: "19:00",
        homeTeam: teams[0], // Lakers
        awayTeam: teams[1], // Celtics
        venue: "Crypto.com Arena",
        odds: {
          homeTeamMoneyline: -120,
          awayTeamMoneyline: +110,
          homeTeamSpread: -2.5,
          homeTeamSpreadOdds: -110,
          awayTeamSpreadOdds: -110,
          overUnder: 225.5,
          overOdds: -110,
          underOdds: -110
        },
        status: 'scheduled'
      },
      {
        id: 1002,
        date,
        time: "20:30",
        homeTeam: teams[2], // Warriors
        awayTeam: teams[3], // Bucks
        venue: "Chase Center",
        odds: {
          homeTeamMoneyline: +105,
          awayTeamMoneyline: -125,
          homeTeamSpread: +1.5,
          homeTeamSpreadOdds: -110,
          awayTeamSpreadOdds: -110,
          overUnder: 230.5,
          overOdds: -110,
          underOdds: -110
        },
        status: 'scheduled'
      }
    ];
  }
}

// Export a singleton instance
const sportsDataAPI = new SportsDataAPI();
export default sportsDataAPI;
