'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowPathIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DailyPicks } from '@/models/sports';

export default function SportsGamblingDashboard() {
  const [picks, setPicks] = useState<DailyPicks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performance, setPerformance] = useState<{
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
    roi: number;
  } | null>(null);

  // Load picks and performance data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch picks
        const picksResponse = await fetch('/api/sports/picks');
        const picksData = await picksResponse.json();
        
        // Fetch performance metrics
        const performanceResponse = await fetch('/api/sports/performance');
        const performanceData = await performanceResponse.json();
        
        setPicks(picksData);
        setPerformance(performanceData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Generate new picks
  const handleGeneratePicks = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/sports/picks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate picks');
      }
      
      const newPicks = await response.json();
      
      // Add to picks list
      setPicks(prev => [newPicks, ...prev]);
      
      alert('Picks generated successfully!');
    } catch (err) {
      console.error('Error generating picks:', err);
      setError('Failed to generate picks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Post picks to Twitter
  const handlePostPicks = async (picksId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/sports/picks/${picksId}/post`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to post picks');
      }
      
      const updatedPicks = await response.json();
      
      // Update picks in the list
      setPicks(prev => prev.map(p => p.id === picksId ? updatedPicks : p));
      
      alert('Picks posted to Twitter successfully!');
    } catch (err) {
      console.error('Error posting picks:', err);
      setError('Failed to post picks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sports Gambling Dashboard</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={handleGeneratePicks}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Generate Picks
          </button>
          
          <Link href="/dashboard/sports/analytics" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Analytics
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Daily Picks */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Daily Picks</h2>
        </div>
        
        {loading && picks.length === 0 ? (
          <div className="p-6 text-center">
            <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin" />
            <p className="mt-2 text-gray-500">Loading picks...</p>
          </div>
        ) : picks.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No picks available. Generate some picks to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {picks.map(dailyPick => (
              <li key={dailyPick.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(dailyPick.date.toString())}
                      </span>
                      
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dailyPick.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        dailyPick.status === 'posted' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {dailyPick.status === 'pending' ? (
                          <>
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        ) : dailyPick.status === 'posted' ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Posted
                          </>
                        ) : (
                          'Completed'
                        )}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {dailyPick.picks.length} picks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/sports/picks/${dailyPick.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                    
                    {dailyPick.status === 'pending' && (
                      <button
                        onClick={() => handlePostPicks(dailyPick.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Post to Twitter
                      </button>
                    )}
                    
                    {dailyPick.status === 'posted' && dailyPick.tweetId && (
                      <a
                        href={`https://twitter.com/user/status/${dailyPick.tweetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        View Tweet
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
