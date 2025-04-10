'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  UsersIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { SocialApi } from '@/utils/api';
import { SocialPlatformType } from '@/models/social';

// Chart component will be imported from a separate file
import EngagementChart from './analytics/EngagementChart';
import FollowerGrowthChart from './analytics/FollowerGrowthChart';
import PlatformComparison from './analytics/PlatformComparison';
import TopPostsTable from './analytics/TopPostsTable';

interface AnalyticsDashboardProps {
  initialTimeframe?: '7days' | '30days' | '90days';
  initialPlatform?: SocialPlatformType | 'all';
}

export default function AnalyticsDashboard({ 
  initialTimeframe = '30days',
  initialPlatform = 'all'
}: AnalyticsDashboardProps) {
  // State
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days'>(initialTimeframe);
  const [platform, setPlatform] = useState<SocialPlatformType | 'all'>(initialPlatform);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const options: any = {};
        
        if (platform !== 'all') {
          options.platform = platform;
        }
        
        const data = await SocialApi.getAnalytics(timeframe, options);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [timeframe, platform]);
  
  // Format percentage change
  const formatChange = (value: number | string) => {
    if (typeof value === 'string') {
      // If value is already a string with % sign
      return value;
    }
    
    return value > 0 
      ? `+${value.toFixed(1)}%` 
      : `${value.toFixed(1)}%`;
  };
  
  // Get change indicator
  const getChangeIndicator = (value: number | string) => {
    let numValue = typeof value === 'string' 
      ? parseFloat(value.replace('%', '')) 
      : value;
    
    if (numValue > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (numValue < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  // Get change text color
  const getChangeTextColor = (value: number | string) => {
    let numValue = typeof value === 'string' 
      ? parseFloat(value.replace('%', '')) 
      : value;
    
    if (numValue > 0) {
      return 'text-green-600';
    } else if (numValue < 0) {
      return 'text-red-600';
    }
    return 'text-gray-500';
  };
  
  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">Social Media Analytics</h2>
          
          <div className="flex space-x-4">
            {/* Platform filter */}
            <div>
              <label htmlFor="platform-filter" className="sr-only">Platform</label>
              <select
                id="platform-filter"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatformType | 'all')}
                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Pinterest">Pinterest</option>
              </select>
            </div>
            
            {/* Timeframe filter */}
            <div>
              <label htmlFor="timeframe-filter" className="sr-only">Timeframe</label>
              <select
                id="timeframe-filter"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as '7days' | '30days' | '90days')}
                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics content */}
      {!loading && !error && analyticsData && (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total followers */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100 text-blue-600">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Followers</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.totalFollowers.toLocaleString()}
                    </p>
                    <p className={`ml-2 text-sm ${getChangeTextColor(analyticsData.summary.followerGrowth)}`}>
                      <span className="flex items-center">
                        {getChangeIndicator(analyticsData.summary.followerGrowth)}
                        {analyticsData.summary.followerGrowth}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total engagement */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100 text-purple-600">
                  <HeartIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Engagement</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.totalEngagement.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Average engagement rate */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Engagement Rate</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.avgEngagementRate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total reach */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100 text-yellow-600">
                  <EyeIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.totalReach.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement over time */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Over Time</h3>
              {analyticsData.engagement && (
                <EngagementChart data={analyticsData.engagement} />
              )}
            </div>
            
            {/* Follower growth */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Follower Growth</h3>
              {analyticsData.followers && (
                <FollowerGrowthChart data={analyticsData.followers} />
              )}
            </div>
          </div>
          
          {/* Platform comparison */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Performance</h3>
            {analyticsData.platforms && (
              <PlatformComparison platforms={analyticsData.platforms} />
            )}
          </div>
          
          {/* Top performing posts */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Posts</h3>
            {analyticsData.posts && (
              <TopPostsTable posts={analyticsData.posts} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
