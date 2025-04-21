'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowPathIcon, 
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { DailyPicks, BettingPick } from '@/models/sports';

export default function SportsAnalyticsPage() {
  const [performance, setPerformance] = useState<{
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
    roi: number;
  } | null>(null);
  
  const [picks, setPicks] = useState<DailyPicks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  // Load performance data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range based on timeframe
        const endDate = new Date();
        const startDate = new Date();
        
        if (timeframe === '7days') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (timeframe === '30days') {
          startDate.setDate(startDate.getDate() - 30);
        } else if (timeframe === '90days') {
          startDate.setDate(startDate.getDate() - 90);
        } else {
          // For 'all', set a far past date
          startDate.setFullYear(startDate.getFullYear() - 10);
        }
        
        // Fetch performance metrics
        const performanceResponse = await fetch(
          `/api/sports/performance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        
        if (!performanceResponse.ok) {
          throw new Error('Failed to load performance metrics');
        }
        
        const performanceData = await performanceResponse.json();
        
        // Fetch picks
        const picksResponse = await fetch('/api/sports/picks?status=completed');
        
        if (!picksResponse.ok) {
          throw new Error('Failed to load picks');
        }
        
        const picksData = await picksResponse.json();
        
        // Filter picks by date range
        const filteredPicks = picksData.filter((pick: DailyPicks) => {
          const pickDate = new Date(pick.date);
          return pickDate >= startDate && pickDate <= endDate;
        });
        
        setPerformance(performanceData);
        setPicks(filteredPicks);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeframe]);

  // Calculate pick type distribution
  const calculatePickTypeDistribution = () => {
    if (picks.length === 0) return [];
    
    const pickTypes: Record<string, number> = {
      spread: 0,
      moneyline: 0,
      total: 0,
      prop: 0
    };
    
    let totalPicks = 0;
    
    // Count pick types
    picks.forEach(dailyPick => {
      dailyPick.picks.forEach(pick => {
        pickTypes[pick.pickType] = (pickTypes[pick.pickType] || 0) + 1;
        totalPicks++;
      });
    });
    
    // Convert to percentage
    return Object.entries(pickTypes).map(([type, count]) => ({
      type,
      count,
      percentage: totalPicks > 0 ? Math.round((count / totalPicks) * 100) : 0
    }));
  };

  // Calculate sport distribution
  const calculateSportDistribution = () => {
    if (picks.length === 0) return [];
    
    const sports: Record<string, number> = {};
    let totalPicks = 0;
    
    // Count sports
    picks.forEach(dailyPick => {
      dailyPick.picks.forEach(pick => {
        const sport = pick.game.sport;
        sports[sport] = (sports[sport] || 0) + 1;
        totalPicks++;
      });
    });
    
    // Convert to percentage
    return Object.entries(sports).map(([sport, count]) => ({
      sport,
      count,
      percentage: totalPicks > 0 ? Math.round((count / totalPicks) * 100) : 0
    }));
  };

  // Calculate monthly performance
  const calculateMonthlyPerformance = () => {
    if (picks.length === 0) return [];
    
    const monthlyData: Record<string, { wins: number; losses: number; pushes: number }> = {};
    
    // Group by month
    picks.forEach(dailyPick => {
      const date = new Date(dailyPick.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { wins: 0, losses: 0, pushes: 0 };
      }
      
      // Count results
      dailyPick.picks.forEach(pick => {
        if (pick.result === 'win') {
          monthlyData[monthKey].wins++;
        } else if (pick.result === 'loss') {
          monthlyData[monthKey].losses++;
        } else if (pick.result === 'push') {
          monthlyData[monthKey].pushes++;
        }
      });
    });
    
    // Convert to array and calculate win rate
    return Object.entries(monthlyData).map(([month, data]) => {
      const total = data.wins + data.losses + data.pushes;
      const winRate = total > 0 ? Math.round((data.wins / total) * 100) : 0;
      
      // Format month for display
      const [year, monthNum] = month.split('-');
      const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      return {
        month: `${monthName} ${year}`,
        ...data,
        winRate
      };
    }).sort((a, b) => {
      // Sort by month (most recent first)
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) {
        return parseInt(bYear) - parseInt(aYear);
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(bMonth) - months.indexOf(aMonth);
    });
  };

  // Get top performing picks
  const getTopPerformingPicks = () => {
    if (picks.length === 0) return [];
    
    const allPicks: BettingPick[] = [];
    
    // Collect all picks
    picks.forEach(dailyPick => {
      dailyPick.picks.forEach(pick => {
        if (pick.result === 'win') {
          allPicks.push(pick);
        }
      });
    });
    
    // Sort by odds (highest first)
    return allPicks
      .sort((a, b) => b.odds - a.odds)
      .slice(0, 5);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format odds for display
  const formatOdds = (odds: number) => {
    return odds >= 0 ? `+${odds}` : odds.toString();
  };

  const pickTypeDistribution = calculatePickTypeDistribution();
  const sportDistribution = calculateSportDistribution();
  const monthlyPerformance = calculateMonthlyPerformance();
  const topPicks = getTopPerformingPicks();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/sports" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sports Gambling Analytics</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('7days')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timeframe === '7days'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30days')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timeframe === '30days'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe('90days')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timeframe === '90days'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timeframe === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Performance Summary */}
          {performance && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Wins</p>
                  <p className="text-2xl font-bold text-green-600">{performance.wins}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Losses</p>
                  <p className="text-2xl font-bold text-red-600">{performance.losses}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Pushes</p>
                  <p className="text-2xl font-bold text-gray-600">{performance.pushes}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{performance.winRate.toFixed(1)}%</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">ROI</p>
                  <p className="text-2xl font-bold text-purple-600">{performance.roi.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Pick Type Distribution */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <ChartPieIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Pick Type Distribution</h2>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {pickTypeDistribution.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {pickTypeDistribution.map(item => (
                      <div key={item.type} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-900 capitalize">
                          {item.type}
                        </div>
                        <div className="flex-1">
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-blue-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sport Distribution */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <ChartPieIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Sport Distribution</h2>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {sportDistribution.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {sportDistribution.map(item => (
                      <div key={item.sport} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-900">
                          {item.sport}
                        </div>
                        <div className="flex-1">
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-green-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Monthly Performance */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Monthly Performance</h2>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {monthlyPerformance.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Wins
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Losses
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Win Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthlyPerformance.map((month, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {month.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {month.wins}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {month.losses}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {month.winRate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            {/* Top Performing Picks */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <TrophyIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Top Performing Picks</h2>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {topPicks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {topPicks.map((pick, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {pick.game.awayTeam.name} @ {pick.game.homeTeam.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(pick.createdAt.toString())}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {formatOdds(pick.odds)}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-blue-600 font-medium">{pick.pick}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pick.analysis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
