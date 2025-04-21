'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { DailyPicks, BettingPick } from '@/models/sports';

export default function PicksDetailPage({ params }: { params: { id: string } }) {
  const [picks, setPicks] = useState<DailyPicks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load picks data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch picks
        const response = await fetch(`/api/sports/picks/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load picks');
        }
        
        const data = await response.json();
        setPicks(data);
      } catch (err) {
        console.error('Error loading picks:', err);
        setError('Failed to load picks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [params.id]);

  // Post picks to Twitter
  const handlePostPicks = async () => {
    if (!picks) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/sports/picks/${picks.id}/post`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to post picks');
      }
      
      const updatedPicks = await response.json();
      setPicks(updatedPicks);
      
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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format odds for display
  const formatOdds = (odds: number) => {
    return odds >= 0 ? `+${odds}` : odds.toString();
  };

  // Get result badge color
  const getResultBadgeColor = (result?: string) => {
    switch (result) {
      case 'win':
        return 'bg-green-100 text-green-800';
      case 'loss':
        return 'bg-red-100 text-red-800';
      case 'push':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/sports" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
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
      
      {loading && !picks ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-500">Loading picks...</p>
        </div>
      ) : !picks ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Picks not found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Picks for {formatDate(picks.date.toString())}
                </h1>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  picks.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  picks.status === 'posted' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {picks.status.charAt(0).toUpperCase() + picks.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {picks.status === 'pending' ? (
                <div className="mb-4">
                  <button
                    onClick={handlePostPicks}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    Post to Twitter
                  </button>
                </div>
              ) : picks.status === 'posted' && picks.tweetId ? (
                <div className="mb-4">
                  <a
                    href={`https://twitter.com/user/status/${picks.tweetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    View on Twitter
                  </a>
                </div>
              ) : null}
              
              {picks.performance && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Performance</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Wins</p>
                      <p className="text-lg font-bold text-green-600">{picks.performance.wins}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Losses</p>
                      <p className="text-lg font-bold text-red-600">{picks.performance.losses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pushes</p>
                      <p className="text-lg font-bold text-gray-600">{picks.performance.pushes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="text-lg font-bold text-blue-600">{picks.performance.roi.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">Picks ({picks.picks.length})</h3>
              
              {picks.picks.length === 0 ? (
                <p className="text-gray-500">No picks available for this day.</p>
              ) : (
                <div className="space-y-6">
                  {picks.picks.map((pick: BettingPick) => (
                    <div key={pick.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {pick.game.awayTeam.name} @ {pick.game.homeTeam.name}
                            </span>
                            
                            <span className="ml-2 text-xs text-gray-500">
                              {formatTime(pick.game.startTime.toString())}
                            </span>
                          </div>
                          
                          <div className="mt-1">
                            <span className="text-lg font-bold text-blue-600">
                              {pick.pick}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              Odds: {formatOdds(pick.odds)}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              Confidence: {pick.confidence}/10
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          {pick.result ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultBadgeColor(pick.result)}`}>
                              {pick.result === 'win' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                              {pick.result === 'loss' && <XCircleIcon className="h-3 w-3 mr-1" />}
                              {pick.result === 'push' && <MinusCircleIcon className="h-3 w-3 mr-1" />}
                              {pick.result.charAt(0).toUpperCase() + pick.result.slice(1)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <p>{pick.analysis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Preview Tweet</h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">@</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Sports Picks</p>
                    <p className="text-xs text-gray-500">@SportsPicks</p>
                  </div>
                </div>
                
                <div className="text-gray-800 whitespace-pre-line">
                  {`🔥 TODAY'S TOP BETTING PICKS (${new Date(picks.date).toLocaleDateString()}) 🔥\n\n` +
                    picks.picks.map((pick, index) => {
                      const gameInfo = `${pick.game.awayTeam.name} @ ${pick.game.homeTeam.name}`;
                      const pickInfo = `${index + 1}. ${pick.pick} (${formatOdds(pick.odds)})`;
                      return `${pickInfo}\n${gameInfo}`;
                    }).join('\n\n')}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
