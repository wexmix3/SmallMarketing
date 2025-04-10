'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import PlatformPerformance from '@/components/social/PlatformPerformance';
import EngagementChart from '@/components/social/EngagementChart';
import { 
  getMockPlatformAnalytics, 
  getMockEngagementOverTime, 
  getMockFollowerGrowth 
} from '@/models/social';

export default function SocialMediaAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days'>('30days');
  
  // Get mock data
  const platformAnalytics = getMockPlatformAnalytics();
  const engagementData = getMockEngagementOverTime();
  const followerData = getMockFollowerGrowth();
  
  // Calculate total metrics
  const totalFollowers = platformAnalytics.reduce((sum, platform) => sum + platform.followers, 0);
  const totalReach = platformAnalytics.reduce((sum, platform) => sum + platform.reach, 0);
  
  // Calculate average engagement
  const avgEngagement = (platformAnalytics.reduce((sum, platform) => {
    return sum + parseFloat(platform.engagement.replace('%', ''));
  }, 0) / platformAnalytics.length).toFixed(1) + '%';
  
  // Calculate follower growth
  const followerGrowth = followerData.length > 1 
    ? ((followerData[followerData.length - 1].total - followerData[0].total) / followerData[0].total * 100).toFixed(1) + '%'
    : '0%';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            href="/dashboard/social" 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Social Media Analytics</h1>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
        </select>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
          <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
            Total Followers
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalFollowers.toLocaleString()}</dd>
          <dd className="mt-2 flex items-baseline">
            <p className="text-sm font-semibold text-green-600 flex items-center">
              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" aria-hidden="true" />
              {followerGrowth}
            </p>
            <p className="ml-2 text-sm text-gray-500">from previous period</p>
          </dd>
        </div>
        
        <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
          <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-green-500" />
            Avg. Engagement Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{avgEngagement}</dd>
          <dd className="mt-2 flex items-baseline">
            <p className="text-sm font-semibold text-green-600 flex items-center">
              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" aria-hidden="true" />
              +0.8%
            </p>
            <p className="ml-2 text-sm text-gray-500">from previous period</p>
          </dd>
        </div>
        
        <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
          <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
            <EyeIcon className="h-5 w-5 mr-2 text-purple-500" />
            Total Reach
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalReach.toLocaleString()}</dd>
          <dd className="mt-2 flex items-baseline">
            <p className="text-sm font-semibold text-green-600 flex items-center">
              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" aria-hidden="true" />
              +18.2%
            </p>
            <p className="ml-2 text-sm text-gray-500">from previous period</p>
          </dd>
        </div>
        
        <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
          <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
            <ShareIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Total Shares
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">245</dd>
          <dd className="mt-2 flex items-baseline">
            <p className="text-sm font-semibold text-green-600 flex items-center">
              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-1" aria-hidden="true" />
              +12.5%
            </p>
            <p className="ml-2 text-sm text-gray-500">from previous period</p>
          </dd>
        </div>
      </div>
      
      {/* Engagement Chart */}
      <EngagementChart 
        engagementData={engagementData} 
        followerData={followerData} 
      />
      
      {/* Platform Performance */}
      <PlatformPerformance analytics={platformAnalytics} />
      
      {/* AI Insights */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Powered Insights</h3>
          <p className="mt-1 text-sm text-gray-500">
            Recommendations based on your social media performance
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-blue-800 mb-2">Content Optimization</h4>
              <p className="text-sm text-blue-700">
                Posts with images receive 2.3x more engagement than text-only posts. Consider including more visual content in your upcoming campaigns.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-green-800 mb-2">Posting Schedule</h4>
              <p className="text-sm text-green-700">
                Your audience is most active between 5-7 PM on weekdays. Scheduling posts during this time could increase your reach by up to 28%.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-purple-800 mb-2">Audience Insights</h4>
              <p className="text-sm text-purple-700">
                Your Instagram audience is growing faster than other platforms. Consider focusing more resources on Instagram content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
