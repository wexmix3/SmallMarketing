'use client';

import { useState } from 'react';
import { 
  EngagementOverTime, 
  FollowerGrowth,
  SocialPlatform
} from '@/models/social';

interface EngagementChartProps {
  engagementData: EngagementOverTime[];
  followerData: FollowerGrowth[];
}

export default function EngagementChart({ engagementData, followerData }: EngagementChartProps) {
  const [chartType, setChartType] = useState<'engagement' | 'followers'>('engagement');
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days'>('30days');
  
  // Get max values for scaling
  const getMaxEngagement = () => {
    return Math.max(
      ...engagementData.map(d => Math.max(d.likes, d.comments, d.shares))
    );
  };
  
  const getMaxFollowers = () => {
    return Math.max(
      ...followerData.map(d => d.total)
    );
  };
  
  // Scale values to fit chart height
  const scaleValue = (value: number, max: number, height: number) => {
    return (value / max) * height;
  };
  
  // Generate engagement chart
  const renderEngagementChart = () => {
    const chartHeight = 200;
    const maxValue = getMaxEngagement();
    
    return (
      <div className="mt-4">
        <div className="flex items-end h-52 space-x-2">
          {engagementData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center space-x-1">
                <div 
                  className="w-2 bg-blue-500 rounded-t"
                  style={{ height: `${scaleValue(data.likes, maxValue, chartHeight)}px` }}
                ></div>
                <div 
                  className="w-2 bg-green-500 rounded-t"
                  style={{ height: `${scaleValue(data.comments, maxValue, chartHeight)}px` }}
                ></div>
                <div 
                  className="w-2 bg-purple-500 rounded-t"
                  style={{ height: `${scaleValue(data.shares, maxValue, chartHeight)}px` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{data.date}</div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Likes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Comments</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Shares</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Generate followers chart
  const renderFollowersChart = () => {
    const chartHeight = 200;
    const maxValue = getMaxFollowers();
    
    const platforms: SocialPlatform[] = ['Facebook', 'Instagram', 'Twitter'];
    const colors = {
      Facebook: 'bg-blue-500',
      Instagram: 'bg-pink-500',
      Twitter: 'bg-blue-400',
      LinkedIn: 'bg-blue-700',
      Pinterest: 'bg-red-500'
    };
    
    return (
      <div className="mt-4">
        <div className="flex items-end h-52 space-x-2">
          {followerData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex justify-center">
                <div 
                  className="w-6 bg-gray-200 rounded-t"
                  style={{ height: `${scaleValue(data.total, maxValue, chartHeight)}px` }}
                >
                  {platforms.map((platform, i) => {
                    const followers = data.followers[platform] || 0;
                    const prevHeight = platforms.slice(0, i).reduce((sum, p) => {
                      return sum + (data.followers[p] || 0);
                    }, 0);
                    
                    return (
                      <div 
                        key={platform}
                        className={`w-full absolute bottom-0 ${colors[platform]} rounded-t`}
                        style={{ 
                          height: `${scaleValue(followers, maxValue, chartHeight)}px`,
                          bottom: `${scaleValue(prevHeight, maxValue, chartHeight)}px`
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{data.date}</div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          {platforms.map(platform => (
            <div key={platform} className="flex items-center">
              <div className={`w-3 h-3 ${colors[platform]} rounded-full mr-1`}></div>
              <span className="text-xs text-gray-600">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setChartType('engagement')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              chartType === 'engagement'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Engagement
          </button>
          <button
            type="button"
            onClick={() => setChartType('followers')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              chartType === 'followers'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Followers
          </button>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="block rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
        </select>
      </div>
      
      {chartType === 'engagement' ? renderEngagementChart() : renderFollowersChart()}
    </div>
  );
}
