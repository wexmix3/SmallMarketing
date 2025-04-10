'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

// Mock data for analytics
const overviewStats = [
  {
    name: 'Total Followers',
    value: '3,245',
    change: '+12%',
    changeType: 'increase',
  },
  {
    name: 'Engagement Rate',
    value: '4.3%',
    change: '+2.5%',
    changeType: 'increase',
  },
  {
    name: 'Reach',
    value: '24,892',
    change: '+18.2%',
    changeType: 'increase',
  },
  {
    name: 'Conversion Rate',
    value: '2.8%',
    change: '-0.5%',
    changeType: 'decrease',
  },
];

const platformPerformance = [
  {
    name: 'Facebook',
    followers: 1245,
    engagement: '3.2%',
    posts: 45,
    reach: 8750,
    growth: '+2.4%'
  },
  {
    name: 'Instagram',
    followers: 1840,
    engagement: '5.7%',
    posts: 62,
    reach: 12450,
    growth: '+4.1%'
  },
  {
    name: 'Twitter',
    followers: 768,
    engagement: '2.1%',
    posts: 87,
    reach: 5680,
    growth: '+1.2%'
  },
  {
    name: 'LinkedIn',
    followers: 572,
    engagement: '3.8%',
    posts: 28,
    reach: 3950,
    growth: '+3.5%'
  },
];

const contentPerformance = [
  {
    id: 1,
    title: 'Summer Sale Announcement',
    type: 'Social Media Post',
    engagement: '8.2%',
    reach: 3245,
    clicks: 187,
    conversions: 24,
  },
  {
    id: 2,
    title: 'Weekly Newsletter',
    type: 'Email Campaign',
    engagement: '24.5%',
    reach: 1850,
    clicks: 342,
    conversions: 56,
  },
  {
    id: 3,
    title: 'New Product Launch',
    type: 'Social Media Post',
    engagement: '6.8%',
    reach: 4120,
    clicks: 215,
    conversions: 32,
  },
  {
    id: 4,
    title: 'Customer Appreciation Day',
    type: 'Event Promotion',
    engagement: '5.4%',
    reach: 2780,
    clicks: 145,
    conversions: 18,
  },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('30days');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics & Insights</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              id="timeframe"
              name="timeframe"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CalendarDaysIcon className="h-4 w-4 mr-2" />
            Custom Range
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((item) => (
              <div
                key={item.name}
                className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
                <dd className="mt-2 flex items-baseline">
                  <p
                    className={`text-sm font-semibold ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <span className="flex items-center">
                      {item.changeType === 'increase' ? (
                        <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                      )}
                      {item.change}
                    </span>
                  </p>
                  <p className="ml-2 text-sm text-gray-500">from previous period</p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Platform Performance</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export Data
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Followers
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reach
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {platformPerformance.map((platform) => (
                  <tr key={platform.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{platform.followers.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{platform.engagement}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{platform.posts}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{platform.reach.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">{platform.growth}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Top Performing Content</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Content
          </button>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reach
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contentPerformance.map((content) => (
                  <tr key={content.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.engagement}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.reach.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.clicks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.conversions}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Powered Insights</h3>
          <p className="mt-1 text-sm text-gray-500">
            Recommendations based on your marketing performance data
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-blue-800 mb-2">Content Optimization</h4>
              <p className="text-sm text-blue-700">
                Your posts with images receive 2.3x more engagement than text-only posts. Consider including more visual content in your upcoming campaigns.
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
                Your fastest growing audience segment is women aged 25-34. Consider creating more targeted content for this demographic.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-yellow-800 mb-2">Campaign Recommendation</h4>
              <p className="text-sm text-yellow-700">
                Based on seasonal trends, now is an optimal time to start planning your holiday marketing campaign. Businesses in your industry typically see a 40% increase in engagement with early holiday promotions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
