import axios from 'axios';
import { format, subDays } from 'date-fns';

/**
 * Service for interacting with the API-Sports API
 * Documentation: https://api-sports.io/documentation/nba/v2
 */
class ApiSportsService {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;
  
  constructor() {
    this.apiKey = process.env.API_SPORTS_KEY || '';
    this.baseUrl = 'https://v2.nba.api-sports.io';
    this.headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'v2.nba.api-sports.io'
    };
  }
  
  /**
   * Get all NBA teams
   * @returns Array of teams
   */
  async getTeams(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        console.warn('API_SPORTS_KEY not set, using mock data');
        return this.getMockTeams();
      }
      
      const response = await axios.get(`${this.baseUrl}/teams`, {
        headers: this.headers
      });
      
      if (response.data.results > 0) {
        return response.data.response.map(this.mapTeamData);
      }
      
      return this.getMockTeams();
    } catch (error) {
      console.error('Error fetching teams from API-Sports:', error);
      return this.getMockTeams();
    }
  }
  
  /**
   * Get games for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns Array of games
   */
  async getGames(date: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        console.warn('API_SPORTS_KEY not set, using mock data');
        return this.getMockGames(date);
      }
      
      const response = await axios.get(`${this.baseUrl}/games`, {
        headers: this.headers,
        params: {
          date
        }
      });
      
      if (response.data.results > 0) {
        return response.data.response.map(this.mapGameData);
      }
      
      return this.getMockGames(date);
    } catch (error) {
      console.error('Error fetching games from API-Sports:', error);
      return this.getMockGames(date);
    }
  }
  
  /**
   * Get standings for the current season
   * @returns Array of standings
   */
  async getStandings(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        console.warn('API_SPORTS_KEY not set, using mock data');
        return this.getMockStandings();
      }
      
      const currentSeason = new Date().getFullYear();
      
      const response = await axios.get(`${this.baseUrl}/standings`, {
        headers: this.headers,
        params: {
          league: 'standard',
          season: currentSeason
        }
      });
      
      if (response.data.results > 0) {
        return response.data.response;
      }
      
      return this.getMockStandings();
    } catch (error) {
      console.error('Error fetching standings from API-Sports:', error);
      return this.getMockStandings();
    }
  }
  
  /**
   * Get odds for games on a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns Array of odds
   */
  async getOdds(date: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        console.warn('API_SPORTS_KEY not set, using mock data');
        return this.getMockOdds(date);
      }
      
      const response = await axios.get(`${this.baseUrl}/odds`, {
        headers: this.headers,
        params: {
          date
        }
      });
      
      if (response.data.results > 0) {
        return response.data.response;
      }
      
      return this.getMockOdds(date);
    } catch (error) {
      console.error('Error fetching odds from API-Sports:', error);
      return this.getMockOdds(date);
    }
  }
  
  /**
   * Get statistics for a team
   * @param teamId - Team ID
   * @returns Team statistics
   */
  async getTeamStatistics(teamId: number): Promise<any> {
    try {
      if (!this.apiKey) {
        console.warn('API_SPORTS_KEY not set, using mock data');
        return this.getMockTeamStatistics(teamId);
      }
      
      const currentSeason = new Date().getFullYear();
      
      const response = await axios.get(`${this.baseUrl}/teams/statistics`, {
        headers: this.headers,
        params: {
          id: teamId,
          season: currentSeason
        }
      });
      
      if (response.data.results > 0) {
        return response.data.response;
      }
      
      return this.getMockTeamStatistics(teamId);
    } catch (error) {
      console.error('Error fetching team statistics from API-Sports:', error);
      return this.getMockTeamStatistics(teamId);
    }
  }
  
  /**
   * Map team data from API to our format
   */
  private mapTeamData(apiTeam: any): any {
    return {
      id: apiTeam.id,
      name: apiTeam.name,
      abbreviation: apiTeam.code,
      location: apiTeam.city,
      conference: apiTeam.leagues.standard.conference,
      division: apiTeam.leagues.standard.division,
      winLoss: {
        wins: 0,
        losses: 0,
        winPercentage: 0
      },
      stats: {
        pointsPerGame: 0,
        pointsAllowedPerGame: 0,
        reboundsPerGame: 0,
        assistsPerGame: 0,
        turnoversPerGame: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0
      },
      homeAdvantage: 3.5
    };
  }
  
  /**
   * Map game data from API to our format
   */
  private mapGameData(apiGame: any): any {
    return {
      id: apiGame.id,
      date: apiGame.date.start.substring(0, 10),
      time: apiGame.date.start.substring(11, 16),
      homeTeam: {
        id: apiGame.teams.home.id,
        name: apiGame.teams.home.name
      },
      awayTeam: {
        id: apiGame.teams.visitors.id,
        name: apiGame.teams.visitors.name
      },
      venue: apiGame.arena.name,
      status: apiGame.status.short === 'FT' ? 'final' : 
              apiGame.status.short === 'NS' ? 'scheduled' : 'in_progress',
      score: apiGame.scores ? {
        homeTeam: apiGame.scores.home.points,
        awayTeam: apiGame.scores.visitors.points
      } : undefined,
      odds: {
        homeTeamMoneyline: -110,
        awayTeamMoneyline: -110,
        homeTeamSpread: -2.5,
        homeTeamSpreadOdds: -110,
        awayTeamSpreadOdds: -110,
        overUnder: 220,
        overOdds: -110,
        underOdds: -110
      }
    };
  }
  
  // Mock data methods (same as in sportsDataAPI.ts)
  private getMockTeams(): any[] {
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
  
  private getMockGames(date: string): any[] {
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
  
  private getMockStandings(): any[] {
    return [
      {
        league: "standard",
        season: 2023,
        team: {
          id: 1,
          name: "Lakers",
          nickname: "Lakers",
          code: "LAL",
          logo: "https://media.api-sports.io/basketball/teams/1.png"
        },
        conference: {
          name: "west",
          rank: 3,
          win: 15,
          loss: 7
        },
        division: {
          name: "pacific",
          rank: 2,
          win: 15,
          loss: 7,
          gamesBehind: "2.0"
        },
        win: {
          home: 9,
          away: 6,
          total: 15,
          percentage: "0.682",
          lastTen: 7
        },
        loss: {
          home: 3,
          away: 4,
          total: 7,
          percentage: "0.318",
          lastTen: 3
        },
        gamesBehind: "3.0",
        streak: 3,
        winStreak: true
      },
      {
        league: "standard",
        season: 2023,
        team: {
          id: 2,
          name: "Celtics",
          nickname: "Celtics",
          code: "BOS",
          logo: "https://media.api-sports.io/basketball/teams/2.png"
        },
        conference: {
          name: "east",
          rank: 1,
          win: 18,
          loss: 5
        },
        division: {
          name: "atlantic",
          rank: 1,
          win: 18,
          loss: 5,
          gamesBehind: "0.0"
        },
        win: {
          home: 10,
          away: 8,
          total: 18,
          percentage: "0.783",
          lastTen: 8
        },
        loss: {
          home: 2,
          away: 3,
          total: 5,
          percentage: "0.217",
          lastTen: 2
        },
        gamesBehind: "0.0",
        streak: 4,
        winStreak: true
      }
    ];
  }
  
  private getMockOdds(date: string): any[] {
    return [
      {
        id: 1001,
        date,
        bookmakers: [
          {
            id: 1,
            name: "FanDuel",
            markets: [
              {
                key: "spreads",
                outcomes: [
                  {
                    name: "Los Angeles Lakers",
                    price: -110,
                    point: -2.5
                  },
                  {
                    name: "Boston Celtics",
                    price: -110,
                    point: 2.5
                  }
                ]
              },
              {
                key: "totals",
                outcomes: [
                  {
                    name: "Over",
                    price: -110,
                    point: 225.5
                  },
                  {
                    name: "Under",
                    price: -110,
                    point: 225.5
                  }
                ]
              },
              {
                key: "h2h",
                outcomes: [
                  {
                    name: "Los Angeles Lakers",
                    price: -120
                  },
                  {
                    name: "Boston Celtics",
                    price: 110
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 1002,
        date,
        bookmakers: [
          {
            id: 1,
            name: "FanDuel",
            markets: [
              {
                key: "spreads",
                outcomes: [
                  {
                    name: "Golden State Warriors",
                    price: -110,
                    point: 1.5
                  },
                  {
                    name: "Milwaukee Bucks",
                    price: -110,
                    point: -1.5
                  }
                ]
              },
              {
                key: "totals",
                outcomes: [
                  {
                    name: "Over",
                    price: -110,
                    point: 230.5
                  },
                  {
                    name: "Under",
                    price: -110,
                    point: 230.5
                  }
                ]
              },
              {
                key: "h2h",
                outcomes: [
                  {
                    name: "Golden State Warriors",
                    price: 105
                  },
                  {
                    name: "Milwaukee Bucks",
                    price: -125
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }
  
  private getMockTeamStatistics(teamId: number): any {
    const teams = this.getMockTeams();
    const team = teams.find(t => t.id === teamId) || teams[0];
    
    return {
      team: {
        id: team.id,
        name: team.name,
        nickname: team.name,
        code: team.abbreviation,
        logo: `https://media.api-sports.io/basketball/teams/${team.id}.png`
      },
      games: {
        played: team.winLoss.wins + team.winLoss.losses,
        wins: {
          all: team.winLoss.wins,
          percentage: team.winLoss.winPercentage.toString()
        },
        losses: {
          all: team.winLoss.losses,
          percentage: (1 - team.winLoss.winPercentage).toString()
        }
      },
      points: {
        for: {
          average: {
            all: team.stats.pointsPerGame
          },
          total: team.stats.pointsPerGame * (team.winLoss.wins + team.winLoss.losses)
        },
        against: {
          average: {
            all: team.stats.pointsAllowedPerGame
          },
          total: team.stats.pointsAllowedPerGame * (team.winLoss.wins + team.winLoss.losses)
        }
      }
    };
  }
}

// Export a singleton instance
const apiSportsService = new ApiSportsService();
export default apiSportsService;
