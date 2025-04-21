import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Pick {
  id: string;
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  betType: 'moneyline' | 'spread' | 'over_under';
  betSelection: 'home' | 'away' | 'over' | 'under';
  odds: number;
  prediction: string;
  confidence: number;
  reasoning: string;
  dateCreated: string;
  result?: 'win' | 'loss' | 'push' | 'pending';
}

interface PerformanceMetrics {
  totalPicks: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winPercentage: number;
  roi: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPicks, setIsGeneratingPicks] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [allPicks, setAllPicks] = useState<Pick[]>([]);
  const [tweet, setTweet] = useState('');
  const [error, setError] = useState('');
  const [numPicks, setNumPicks] = useState(3);
  const [activeTab, setActiveTab] = useState('generate');
  const [isInitializingDb, setIsInitializingDb] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const router = useRouter();

  // Fetch all picks and performance metrics on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all picks
        const picksResponse = await fetch('/api/picks');
        const picksData = await picksResponse.json();

        if (picksData.success) {
          setAllPicks(picksData.picks);
        }

        // Fetch performance metrics
        const metricsResponse = await fetch('/api/performance');
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        }

        // Fetch monthly performance data
        const monthlyResponse = await fetch('/api/performance/monthly');
        const monthlyResponseData = await monthlyResponse.json();

        if (monthlyResponseData.success) {
          setMonthlyData(monthlyResponseData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate picks
  const generatePicks = async () => {
    setIsGeneratingPicks(true);
    setError('');

    try {
      const response = await fetch('/api/generatePicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numPicks }),
      });

      const data = await response.json();

      if (data.success) {
        setPicks(data.picks);
        setTweet(data.tweet);

        // Refresh all picks
        const picksResponse = await fetch('/api/picks');
        const picksData = await picksResponse.json();

        if (picksData.success) {
          setAllPicks(picksData.picks);
        }

        // Refresh performance metrics
        const metricsResponse = await fetch('/api/performance');
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        }

        // Refresh monthly performance data
        const monthlyResponse = await fetch('/api/performance/monthly');
        const monthlyResponseData = await monthlyResponse.json();

        if (monthlyResponseData.success) {
          setMonthlyData(monthlyResponseData.data);
        }
      } else {
        setError(data.message || 'Failed to generate picks');
      }
    } catch (err) {
      setError('An error occurred while generating picks');
      console.error(err);
    } finally {
      setIsGeneratingPicks(false);
    }
  };

  // Function to update pick result
  const updatePickResult = async (pickId: string, result: 'win' | 'loss' | 'push') => {
    try {
      const response = await fetch(`/api/picks/${pickId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the pick in the allPicks array
        setAllPicks(prevPicks =>
          prevPicks.map(pick =>
            pick.id === pickId ? { ...pick, result } : pick
          )
        );

        // Refresh performance metrics
        const metricsResponse = await fetch('/api/performance');
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        }

        // Refresh monthly performance data
        const monthlyResponse = await fetch('/api/performance/monthly');
        const monthlyResponseData = await monthlyResponse.json();

        if (monthlyResponseData.success) {
          setMonthlyData(monthlyResponseData.data);
        }
      } else {
        setError(data.message || 'Failed to update pick');
      }
    } catch (err) {
      setError('An error occurred while updating pick');
      console.error(err);
    }
  };

  // Function to initialize database
  const initializeDatabase = async (force: boolean = false) => {
    try {
      setIsInitializingDb(true);
      setError('');

      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh data after database initialization
        const picksResponse = await fetch('/api/picks');
        const picksData = await picksResponse.json();

        if (picksData.success) {
          setAllPicks(picksData.picks);
        }

        // Refresh performance metrics
        const metricsResponse = await fetch('/api/performance');
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        }

        alert('Database initialized successfully!');
      } else {
        setError(data.message || 'Failed to initialize database');
      }
    } catch (err) {
      setError('An error occurred while initializing database');
      console.error(err);
    } finally {
      setIsInitializingDb(false);
    }
  };

  // Function to train the ML model
  const trainModel = async () => {
    try {
      setIsTrainingModel(true);
      setError('');

      const response = await fetch('/api/ml/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Model training started! This may take a few minutes to complete.');
      } else {
        setError(data.message || 'Failed to start model training');
      }
    } catch (err) {
      setError('An error occurred while starting model training');
      console.error(err);
    } finally {
      setIsTrainingModel(false);
    }
  };

  // Function to handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Prepare data for charts
  const prepareResultsChartData = () => {
    if (!metrics) return [];

    return [
      { name: 'Wins', value: metrics.wins, color: '#10B981' },
      { name: 'Losses', value: metrics.losses, color: '#EF4444' },
      { name: 'Pushes', value: metrics.pushes, color: '#F59E0B' },
      { name: 'Pending', value: metrics.pending, color: '#6B7280' }
    ];
  };

  const prepareBetTypeChartData = () => {
    if (!allPicks || allPicks.length === 0) return [];

    const betTypeCounts = allPicks.reduce((acc, pick) => {
      acc[pick.betType] = (acc[pick.betType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Moneyline', value: betTypeCounts['moneyline'] || 0, color: '#3B82F6' },
      { name: 'Spread', value: betTypeCounts['spread'] || 0, color: '#8B5CF6' },
      { name: 'Over/Under', value: betTypeCounts['over_under'] || 0, color: '#EC4899' }
    ];
  };

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Sports Gambling Bot - Admin Dashboard</title>
          <meta name="description" content="Admin dashboard for sports gambling Twitter bot" />
        </Head>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sports Gambling Bot Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => initializeDatabase(false)}
                disabled={isInitializingDb}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {isInitializingDb ? 'Initializing...' : 'Init DB'}
              </button>
              <button
                onClick={() => {
                  if (confirm('This will reset the database. Are you sure?')) {
                    initializeDatabase(true);
                  }
                }}
                disabled={isInitializingDb}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Reset DB
              </button>
              <button
                onClick={trainModel}
                disabled={isTrainingModel}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {isTrainingModel ? 'Training...' : 'Train ML Model'}
              </button>
              <span className="text-gray-600">{session?.user?.name}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${activeTab === 'generate' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('generate')}
              >
                Generate Picks
              </button>
              <button
                className={`${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('history')}
              >
                Pick History
              </button>
              <button
                className={`${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Generate Picks Tab */}
          {!isLoading && activeTab === 'generate' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Generate New Picks</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Number of Picks (1-3)</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={numPicks}
                    onChange={(e) => setNumPicks(Number(e.target.value))}
                  >
                    <option value={1}>1 Pick</option>
                    <option value={2}>2 Picks</option>
                    <option value={3}>3 Picks</option>
                  </select>
                </div>

                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={generatePicks}
                  disabled={isGeneratingPicks}
                >
                  {isGeneratingPicks ? 'Generating...' : 'Generate & Post Picks'}
                </button>
              </div>

              {picks.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Generated Picks</h2>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Tweet Preview:</h3>
                    <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
                      {tweet}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Character count: {tweet.length}/280
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Detailed Picks:</h3>
                    <div className="space-y-4">
                      {picks.map((pick) => (
                        <div key={pick.id} className="border p-4 rounded">
                          <div className="font-bold">
                            {pick.awayTeam} @ {pick.homeTeam}
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Prediction:</span> {pick.prediction}
                          </div>
                          <div className="mt-1">
                            <span className="font-medium">Confidence:</span> {pick.confidence.toFixed(1)}%
                          </div>
                          <div className="mt-1">
                            <span className="font-medium">Reasoning:</span> {pick.reasoning}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pick History Tab */}
          {!isLoading && activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pick History</h2>

              {allPicks.length === 0 ? (
                <p className="text-gray-500">No picks have been generated yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPicks.map((pick) => (
                        <tr key={pick.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(pick.dateCreated), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pick.awayTeam} @ {pick.homeTeam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pick.prediction}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pick.odds > 0 ? `+${pick.odds}` : pick.odds}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pick.confidence}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pick.result === 'win' ? 'bg-green-100 text-green-800' : pick.result === 'loss' ? 'bg-red-100 text-red-800' : pick.result === 'push' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {pick.result ? pick.result.charAt(0).toUpperCase() + pick.result.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {pick.result === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updatePickResult(pick.id, 'win')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Win
                                </button>
                                <button
                                  onClick={() => updatePickResult(pick.id, 'loss')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Loss
                                </button>
                                <button
                                  onClick={() => updatePickResult(pick.id, 'push')}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Push
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {!isLoading && activeTab === 'analytics' && (
            <div>
              {metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Picks</p>
                        <p className="text-2xl font-bold">{metrics.totalPicks}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Win Percentage</p>
                        <p className="text-2xl font-bold">{metrics.winPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Wins</p>
                        <p className="text-2xl font-bold text-green-600">{metrics.wins}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600">Losses</p>
                        <p className="text-2xl font-bold text-red-600">{metrics.losses}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Pushes</p>
                        <p className="text-2xl font-bold text-yellow-600">{metrics.pushes}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">ROI</p>
                        <p className="text-2xl font-bold text-blue-600">{metrics.roi.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Results Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Results Distribution</h2>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareResultsChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareResultsChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bet Type Distribution */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Bet Type Distribution</h2>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareBetTypeChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" name="Count">
                            {prepareBetTypeChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Performance */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData.length > 0 ? monthlyData : [
                            { month: 'Jan', wins: 5, losses: 3, pushes: 1 },
                            { month: 'Feb', wins: 7, losses: 2, pushes: 0 },
                            { month: 'Mar', wins: 4, losses: 4, pushes: 2 },
                            { month: 'Apr', wins: 6, losses: 1, pushes: 1 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="wins" name="Wins" fill="#10B981" />
                          <Bar dataKey="losses" name="Losses" fill="#EF4444" />
                          <Bar dataKey="pushes" name="Pushes" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No performance data available yet.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
