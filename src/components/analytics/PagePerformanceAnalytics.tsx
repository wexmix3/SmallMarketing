'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useWebAnalytics } from '@/hooks/useWebAnalytics';
import { TimePeriod, PagePerformance } from '@/models/analytics';

export default function PagePerformanceAnalytics() {
  const { 
    pagePerformance, 
    topLandingPages,
    topExitPages,
    topConvertingPages,
    loading, 
    error,
    loadDataForPeriod
  } = useWebAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [sortBy, setSortBy] = useState<keyof PagePerformance>('pageViews');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle period change
  const handlePeriodChange = async (period: TimePeriod) => {
    setSelectedPeriod(period);
    await loadDataForPeriod(period);
  };
  
  // Handle sort change
  const handleSortChange = (column: keyof PagePerformance) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort pages
  const filteredPages = pagePerformance
    .filter(page => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        page.url.toLowerCase().includes(query) ||
        page.title.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
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
  const getSortIndicator = (column: keyof PagePerformance) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
      : <ArrowTrendingDownIcon className="h-4 w-4 ml-1" />;
  };
  
  // Format time in seconds to readable format
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Time period selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
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
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search pages..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Page performance table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Page Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('url')}
                >
                  <div className="flex items-center">
                    Page
                    {getSortIndicator('url')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('pageViews')}
                >
                  <div className="flex items-center">
                    Page Views
                    {getSortIndicator('pageViews')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('uniquePageViews')}
                >
                  <div className="flex items-center">
                    Unique Views
                    {getSortIndicator('uniquePageViews')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('avgTimeOnPage')}
                >
                  <div className="flex items-center">
                    Avg. Time
                    {getSortIndicator('avgTimeOnPage')}
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
                  onClick={() => handleSortChange('exitRate')}
                >
                  <div className="flex items-center">
                    Exit Rate
                    {getSortIndicator('exitRate')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('conversionRate')}
                >
                  <div className="flex items-center">
                    Conv. Rate
                    {getSortIndicator('conversionRate')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No pages found matching your search
                  </td>
                </tr>
              ) : (
                filteredPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-xs text-gray-500">{page.url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.pageViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.uniquePageViews.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(page.avgTimeOnPage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              page.bounceRate > 70 
                                ? 'bg-red-500' 
                                : page.bounceRate > 50 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`} 
                            style={{ width: `${page.bounceRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {page.bounceRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              page.exitRate > 70 
                                ? 'bg-red-500' 
                                : page.exitRate > 50 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`} 
                            style={{ width: `${page.exitRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {page.exitRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, page.conversionRate * 10)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {page.conversionRate.toFixed(2)}%
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
      
      {/* Page insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Landing Pages */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
            <ArrowsRightLeftIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Top Landing Pages</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : topLandingPages.slice(0, 5).map((page, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-500">{page.url}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{page.entrances.toLocaleString()} entrances</span>
                      <span className="mx-1">•</span>
                      <span>{page.bounceRate.toFixed(1)}% bounce rate</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Top Exit Pages */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
            <ArrowUturnRightIcon className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Top Exit Pages</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : topExitPages.slice(0, 5).map((page, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-2">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-500">{page.url}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{page.exitRate.toFixed(1)}% exit rate</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(page.avgTimeOnPage)} avg. time</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Top Converting Pages */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Top Converting Pages</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : topConvertingPages.slice(0, 5).map((page, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-2">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-500">{page.url}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{page.conversionRate.toFixed(2)}% conv. rate</span>
                      <span className="mx-1">•</span>
                      <span>{page.conversions} conversions</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Optimization recommendations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Page Optimization Recommendations</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">High Bounce Rate Pages</h4>
              <ul className="space-y-3">
                {pagePerformance
                  .filter(page => page.pageViews > 100 && page.bounceRate > 60)
                  .sort((a, b) => b.bounceRate - a.bounceRate)
                  .slice(0, 3)
                  .map((page, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowUturnLeftIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-600">
                          {page.bounceRate.toFixed(1)}% bounce rate, {page.pageViews.toLocaleString()} views
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Recommendation:</strong> Improve page content, add clear CTAs, and optimize page load speed.
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Low Engagement Pages</h4>
              <ul className="space-y-3">
                {pagePerformance
                  .filter(page => page.pageViews > 100 && page.avgTimeOnPage < 30)
                  .sort((a, b) => a.avgTimeOnPage - b.avgTimeOnPage)
                  .slice(0, 3)
                  .map((page, index) => (
                    <li key={index} className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-600">
                          {formatTime(page.avgTimeOnPage)} avg. time, {page.pageViews.toLocaleString()} views
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Recommendation:</strong> Add more engaging content, improve readability, and include multimedia elements.
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">High Potential Pages</h4>
              <ul className="space-y-3">
                {pagePerformance
                  .filter(page => page.pageViews > 100 && page.avgTimeOnPage > 60 && page.conversionRate < 1)
                  .sort((a, b) => b.avgTimeOnPage - a.avgTimeOnPage)
                  .slice(0, 3)
                  .map((page, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-600">
                          {formatTime(page.avgTimeOnPage)} avg. time, {page.conversionRate.toFixed(2)}% conv. rate
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Recommendation:</strong> Add stronger CTAs, optimize conversion paths, and A/B test different layouts.
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Content Strategy Recommendations</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Optimize landing pages
                    </p>
                    <p className="text-xs text-gray-600">
                      Focus on improving landing pages with high traffic but high bounce rates to increase conversion opportunities.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Improve internal linking
                    </p>
                    <p className="text-xs text-gray-600">
                      Add more relevant internal links on pages with high exit rates to keep visitors engaged with your content.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Create more content like your top performers
                    </p>
                    <p className="text-xs text-gray-600">
                      Analyze your top-performing pages and create similar content to replicate their success.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
