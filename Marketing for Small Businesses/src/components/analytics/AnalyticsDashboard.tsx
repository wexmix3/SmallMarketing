'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  DevicePhoneIcon
} from '@heroicons/react/24/outline';
import { useWebAnalytics } from '@/hooks/useWebAnalytics';
import { TimePeriod } from '@/models/analytics';

export default function AnalyticsDashboard() {
  const { 
    summary, 
    timeSeriesData, 
    deviceBreakdown,
    loading, 
    error,
    loadDataForPeriod,
    formatDuration
  } = useWebAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const visitorChartRef = useRef<HTMLCanvasElement>(null);
  
  // Handle period change
  const handlePeriodChange = async (period: TimePeriod) => {
    setSelectedPeriod(period);
    await loadDataForPeriod(period);
  };
  
  // Draw visitor chart
  useEffect(() => {
    if (!visitorChartRef.current || timeSeriesData.length === 0) return;
    
    const ctx = visitorChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, visitorChartRef.current.width, visitorChartRef.current.height);
    
    // Set dimensions
    const width = visitorChartRef.current.width;
    const height = visitorChartRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxVisitors = Math.max(...timeSeriesData.map(d => d.visitors));
    const maxPageViews = Math.max(...timeSeriesData.map(d => d.pageViews));
    const maxValue = Math.max(maxVisitors, maxPageViews);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    
    // Determine label frequency based on data length
    const labelFrequency = timeSeriesData.length > 30 ? 7 : timeSeriesData.length > 14 ? 3 : 1;
    
    const step = chartWidth / (timeSeriesData.length - 1);
    timeSeriesData.forEach((d, i) => {
      if (i % labelFrequency === 0 || i === timeSeriesData.length - 1) {
        const x = padding + i * step;
        ctx.fillText(d.date.split('-').slice(1).join('/'), x, height - padding + 15);
      }
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = Math.round(maxValue * i / 5);
      ctx.fillText(value.toString(), padding - 5, y + 3);
      
      // Draw grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Draw visitors line
    ctx.beginPath();
    timeSeriesData.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.visitors / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw page views line
    ctx.beginPath();
    timeSeriesData.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.pageViews / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw legend
    const legendItems = [
      { label: 'Visitors', color: '#3b82f6' },
      { label: 'Page Views', color: '#10b981' }
    ];
    
    let legendX = padding;
    legendItems.forEach(item => {
      // Draw line
      ctx.beginPath();
      ctx.moveTo(legendX, 20);
      ctx.lineTo(legendX + 20, 20);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'left';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(item.label, legendX + 25, 23);
      
      legendX += 100;
    });
    
  }, [timeSeriesData]);
  
  // Get device icon
  const getDeviceIcon = (device: 'desktop' | 'tablet' | 'mobile') => {
    switch (device) {
      case 'desktop':
        return <ComputerDesktopIcon className="h-5 w-5 text-blue-500" />;
      case 'tablet':
        return <DeviceTabletIcon className="h-5 w-5 text-green-500" />;
      case 'mobile':
        return <DevicePhoneIcon className="h-5 w-5 text-yellow-500" />;
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
      
      {/* Summary metrics */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visitors */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100 text-blue-600">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
                <p className="text-2xl font-semibold text-gray-900">{summary.visitors.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {summary.newVisitors.toLocaleString()} new, {summary.returningVisitors.toLocaleString()} returning
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page Views */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
                <p className="text-2xl font-semibold text-gray-900">{summary.pageViews.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {summary.pagesPerSession.toFixed(1)} pages per session
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Avg. Session Duration */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100 text-yellow-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Session Duration</h3>
                <p className="text-2xl font-semibold text-gray-900">{formatDuration(summary.avgSessionDuration)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {summary.bounceRate.toFixed(1)}% bounce rate
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conversion Rate */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-purple-100 text-purple-600">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                <p className="text-2xl font-semibold text-gray-900">{summary.conversionRate.toFixed(2)}%</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {summary.conversions.toLocaleString()} conversions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Visitor chart */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Visitor Trends</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="h-80 relative">
            <canvas 
              ref={visitorChartRef} 
              className="w-full h-full"
              width={800}
              height={400}
            />
            
            {/* Fallback for when canvas is not supported or data is empty */}
            {(!timeSeriesData || timeSeriesData.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Device breakdown */}
      {deviceBreakdown && deviceBreakdown.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Device Breakdown</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deviceBreakdown.map((device) => (
                <div key={device.device} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(device.device)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">{device.device}</h4>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              device.device === 'desktop' 
                                ? 'bg-blue-500' 
                                : device.device === 'tablet' 
                                ? 'bg-green-500' 
                                : 'bg-yellow-500'
                            }`} 
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{device.percentage.toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{device.visitors.toLocaleString()} visitors</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
