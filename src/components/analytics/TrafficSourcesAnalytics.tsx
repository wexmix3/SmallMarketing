'use client';

import { useState } from 'react';
import { 
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useWebAnalytics } from '@/hooks/useWebAnalytics';
import { TimePeriod, TrafficSource } from '@/models/analytics';

export default function TrafficSourcesAnalytics() {
  const { 
    trafficSources, 
    loading, 
    error,
    loadDataForPeriod,
    formatDuration
  } = useWebAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [sortBy, setSortBy] = useState<keyof TrafficSource>('visitors');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle period change
  const handlePeriodChange = async (period: TimePeriod) => {
    setSelectedPeriod(period);
    await loadDataForPeriod(period);
  };
  
  // Handle sort change
  const handleSortChange = (column: keyof TrafficSource) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Sort traffic sources
  const sortedTrafficSources = [...trafficSources].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });
  
  // Get sort indicator
  const getSortIndicator = (column: keyof TrafficSource) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
      : <ArrowTrendingDownIcon className="h-4 w-4 ml-1" />;
  };
  
  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google':
        return '🔍';
      case 'facebook':
        return '👥';
      case 'twitter':
        return '🐦';
      case 'instagram':
        return '📷';
      case 'linkedin':
        return '💼';
      case 'youtube':
        return '▶️';
      case 'pinterest':
        return '📌';
      case 'email':
        return '📧';
      case 'direct':
        return '🔗';
      default:
        return '🌐';
    }
  };
  
  // Get medium color
  const getMediumColor = (medium?: string) => {
    if (!medium) return 'bg-gray-100 text-gray-800';
    
    switch (medium.toLowerCase()) {
      case 'organic':
        return 'bg-green-100 text-green-800';
      case 'cpc':
      case 'ppc':
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'email':
        return 'bg-yellow-100 text-yellow-800';
      case 'referral':
        return 'bg-indigo-100 text-indigo-800';
      case 'affiliate':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Time period selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => handlePeriodChange('day')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'day'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'week'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'month'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'year'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>
      
      {/* Traffic sources table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('source')}
                >
                  <div className="flex items-center">
                    Source / Medium
                    {getSortIndicator('source')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('visitors')}
                >
                  <div className="flex items-center">
                    Visitors
                    {getSortIndicator('visitors')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('sessions')}
                >
                  <div className="flex items-center">
                    Sessions
                    {getSortIndicator('sessions')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('bounceRate')}
                >
                  <div className="flex items-center">
                    Bounce Rate
                    {getSortIndicator('bounceRate')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('avgSessionDuration')}
                >
                  <div className="flex items-center">
                    Avg. Session
                    {getSortIndicator('avgSessionDuration')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('conversionRate')}
                >
                  <div className="flex items-center">
                    Conversion Rate
                    {getSortIndicator('conversionRate')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sortedTrafficSources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No traffic sources data available
                  </td>
                </tr>
              ) : (
                sortedTrafficSources.map((source, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-xl">
                          {getSourceIcon(source.source)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{source.source}</div>
                          {source.medium && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getMediumColor(source.medium)}`}>
                              {source.medium}
                            </span>
                          )}
                          {source.campaign && (
                            <div className="text-xs text-gray-500 mt-1">
                              Campaign: {source.campaign}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.visitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.sessions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              source.bounceRate > 70 
                                ? 'bg-red-500' 
                                : source.bounceRate > 50 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`} 
                            style={{ width: `${source.bounceRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {source.bounceRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(source.avgSessionDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, source.conversionRate * 10)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {source.conversionRate.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Traffic insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Traffic Insights</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Top Performing Sources</h4>
                <ul className="space-y-2">
                  {sortedTrafficSources
                    .sort((a, b) => b.conversionRate - a.conversionRate)
                    .slice(0, 3)
                    .map((source, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {source.source} {source.medium ? `/ ${source.medium}` : ''}
                          </p>
                          <p className="text-xs text-gray-600">
                            {source.conversionRate.toFixed(2)}% conversion rate, {formatDuration(source.avgSessionDuration)} avg. session
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Opportunities for Improvement</h4>
                <ul className="space-y-2">
                  {sortedTrafficSources
                    .filter(source => source.visitors > 100) // Only consider sources with significant traffic
                    .sort((a, b) => b.bounceRate - a.bounceRate)
                    .slice(0, 3)
                    .map((source, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {source.source} {source.medium ? `/ ${source.medium}` : ''}
                          </p>
                          <p className="text-xs text-gray-600">
                            {source.bounceRate.toFixed(1)}% bounce rate, {source.conversionRate.toFixed(2)}% conversion rate
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">Optimization Opportunities</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Improve landing pages for social traffic
                      </p>
                      <p className="text-xs text-gray-600">
                        Social media traffic has a high bounce rate (50%+). Create dedicated landing pages for social campaigns.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Invest more in email marketing
                      </p>
                      <p className="text-xs text-gray-600">
                        Email traffic has the highest conversion rate. Consider expanding your email campaigns.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Optimize for organic search
                      </p>
                      <p className="text-xs text-gray-600">
                        Organic search drives significant traffic with good engagement. Focus on SEO to increase this channel.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Channel Strategy</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Based on your traffic patterns, here's a recommended channel allocation:
                </p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Organic Search</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Email Marketing</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Social Media</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Paid Search</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Other Channels</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
