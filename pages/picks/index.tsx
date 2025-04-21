import React, { useState, useEffect } from 'react';
import Layout from '../../src/components/Layout';
import { format, parseISO } from 'date-fns';

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

export default function RecentPicks() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch picks
        const picksResponse = await fetch('/api/picks');
        const picksData = await picksResponse.json();
        
        if (picksData.success) {
          setPicks(picksData.picks);
        } else {
          setError('Failed to fetch picks');
        }
        
        // Fetch performance metrics
        const metricsResponse = await fetch('/api/performance');
        const metricsData = await metricsResponse.json();
        
        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        } else {
          setError('Failed to fetch performance metrics');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <Layout title="Recent Picks - Sports Gambling Bot" description="View our recent sports gambling picks and performance">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Recent Picks</h1>
          <p className="mt-2 text-lg text-gray-600">
            View our recent sports gambling picks and performance metrics
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Performance Summary */}
            {metrics && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Record</p>
                    <p className="text-2xl font-bold">
                      {metrics.wins}-{metrics.losses}-{metrics.pushes}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="text-2xl font-bold">{metrics.winPercentage.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">ROI</p>
                    <p className={`text-2xl font-bold ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.roi.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Picks</p>
                    <p className="text-2xl font-bold">{metrics.totalPicks}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Picks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Picks</h2>
              
              {picks.length === 0 ? (
                <p className="text-gray-500">No picks available yet.</p>
              ) : (
                <div className="space-y-6">
                  {picks.slice(0, 10).map((pick) => (
                    <div key={pick.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <div className="text-lg font-medium">
                            {pick.awayTeam} @ {pick.homeTeam}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(pick.dateCreated), 'MMMM d, yyyy')}
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0 flex items-center">
                          <div className="mr-4">
                            <span className="font-medium">Pick:</span> {pick.prediction}
                          </div>
                          
                          <div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              pick.result === 'win' ? 'bg-green-100 text-green-800' : 
                              pick.result === 'loss' ? 'bg-red-100 text-red-800' : 
                              pick.result === 'push' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {pick.result ? pick.result.charAt(0).toUpperCase() + pick.result.slice(1) : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm">
                          <span className="font-medium">Confidence:</span> {pick.confidence}%
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {pick.reasoning}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
