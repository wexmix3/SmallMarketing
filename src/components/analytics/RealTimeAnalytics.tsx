'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowPathIcon,
  MapPinIcon,
  DevicePhoneIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useWebAnalytics } from '@/hooks/useWebAnalytics';

export default function RealTimeAnalytics() {
  const { realTimeData, loading, error } = useWebAnalytics();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(30);
  
  // Auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Reset countdown and trigger refresh
          setLastUpdated(new Date());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [autoRefresh]);
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    setLastUpdated(new Date());
    setCountdown(30);
  };
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      setCountdown(30);
    }
  };
  
  // Mock active locations data
  const activeLocations = [
    { city: 'New York', country: 'United States', visitors: 12 },
    { city: 'London', country: 'United Kingdom', visitors: 8 },
    { city: 'Los Angeles', country: 'United States', visitors: 6 },
    { city: 'Toronto', country: 'Canada', visitors: 5 },
    { city: 'Sydney', country: 'Australia', visitors: 4 }
  ];
  
  // Mock device breakdown
  const deviceBreakdown = [
    { device: 'desktop', count: 22, percentage: 55 },
    { device: 'mobile', count: 15, percentage: 37.5 },
    { device: 'tablet', count: 3, percentage: 7.5 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header with refresh controls */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">Real-Time Analytics</h3>
            <span className="ml-2 text-sm text-gray-500">
              Last updated: {formatTime(lastUpdated)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="auto-refresh"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={autoRefresh}
                onChange={toggleAutoRefresh}
              />
              <label htmlFor="auto-refresh" className="ml-2 block text-sm text-gray-700">
                Auto-refresh {autoRefresh && `(${countdown}s)`}
              </label>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Real-time metrics */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : realTimeData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Visitors */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100 text-blue-600">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Visitors</h3>
                <p className="text-3xl font-semibold text-gray-900">{realTimeData.activeVisitors}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    Right now
                  </span>
                </div>
              </div>
            </div>
            
            {/* Device breakdown */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Device Breakdown</h4>
              <div className="space-y-2">
                {deviceBreakdown.map((device) => (
                  <div key={device.device} className="flex items-center">
                    <div className="flex-shrink-0 w-6">
                      {device.device === 'desktop' ? (
                        <ComputerDesktopIcon className="h-4 w-4 text-blue-500" />
                      ) : device.device === 'mobile' ? (
                        <DevicePhoneIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <DevicePhoneIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="capitalize">{device.device}</span>
                        <span>{device.count} ({device.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            device.device === 'desktop' 
                              ? 'bg-blue-500' 
                              : device.device === 'mobile' 
                              ? 'bg-green-500' 
                              : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Page Views Today */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Page Views Today</h3>
                <p className="text-3xl font-semibold text-gray-900">{realTimeData.pageViewsToday}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    Since midnight
                  </span>
                </div>
              </div>
            </div>
            
            {/* Hourly trend */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Hourly Trend</h4>
              <div className="h-20 flex items-end space-x-1">
                {Array.from({ length: 24 }).map((_, i) => {
                  // Generate a realistic-looking hourly trend
                  const hour = new Date().getHours();
                  const hourDiff = (hour - i + 24) % 24;
                  
                  // Create a curve that peaks during business hours
                  let height = 0;
                  if (hourDiff >= 0 && hourDiff <= 8) {
                    // Last 8 hours (most recent)
                    const businessHourFactor = hourDiff < 4 ? 1 : 0.7;
                    height = 30 + Math.random() * 70 * businessHourFactor;
                  } else if (hourDiff > 8 && hourDiff <= 16) {
                    // 8-16 hours ago
                    const businessHourFactor = hourDiff < 12 ? 0.6 : 0.4;
                    height = 20 + Math.random() * 50 * businessHourFactor;
                  } else {
                    // 16-24 hours ago
                    height = 10 + Math.random() * 30;
                  }
                  
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${(hour - hourDiff + 24) % 24}:00 - ${(hour - hourDiff + 24) % 24 + 1}:00`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>Now</span>
              </div>
            </div>
          </div>
          
          {/* Active Locations */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-purple-100 text-purple-600">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Locations</h3>
                <p className="text-3xl font-semibold text-gray-900">{activeLocations.reduce((sum, loc) => sum + loc.visitors, 0)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    From {activeLocations.length} cities
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top locations */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Top Locations</h4>
              <ul className="space-y-3">
                {activeLocations.map((location, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-lg mr-2">
                        {location.country === 'United States' ? '🇺🇸' :
                         location.country === 'United Kingdom' ? '🇬🇧' :
                         location.country === 'Canada' ? '🇨🇦' :
                         location.country === 'Australia' ? '🇦🇺' : '🌍'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{location.city}</p>
                        <p className="text-xs text-gray-500">{location.country}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {location.visitors}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Popular pages right now */}
      {realTimeData && realTimeData.popularPages && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Popular Pages Right Now</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Visitors
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {realTimeData.popularPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {index + 1}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                            <div className="text-xs text-gray-500">{page.url}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{page.activeVisitors}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-500 h-2.5 rounded-full" 
                              style={{ width: `${(page.activeVisitors / realTimeData.activeVisitors) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">
                            {((page.activeVisitors / realTimeData.activeVisitors) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Real-time events */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Live Activity Feed</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {/* Generate some mock real-time events */}
              {Array.from({ length: 10 }).map((_, index) => {
                // Generate random event types
                const eventTypes = [
                  { type: 'pageview', icon: <GlobeAltIcon className="h-5 w-5 text-blue-500" />, color: 'bg-blue-100' },
                  { type: 'click', icon: <ClockIcon className="h-5 w-5 text-green-500" />, color: 'bg-green-100' },
                  { type: 'conversion', icon: <ArrowPathIcon className="h-5 w-5 text-purple-500" />, color: 'bg-purple-100' }
                ];
                
                const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                
                // Generate random pages
                const pages = [
                  { url: '/', title: 'Home' },
                  { url: '/products', title: 'Products' },
                  { url: '/about', title: 'About Us' },
                  { url: '/contact', title: 'Contact Us' },
                  { url: '/blog', title: 'Blog' }
                ];
                
                const page = pages[Math.floor(Math.random() * pages.length)];
                
                // Generate random locations
                const locations = [
                  'New York, US',
                  'London, UK',
                  'Los Angeles, US',
                  'Toronto, CA',
                  'Sydney, AU'
                ];
                
                const location = locations[Math.floor(Math.random() * locations.length)];
                
                // Generate random time (within the last 5 minutes)
                const time = new Date(Date.now() - Math.floor(Math.random() * 300000));
                const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                return (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index < 9 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className={`relative ${event.color} p-1 rounded-full flex items-center justify-center`}>
                          {event.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.type === 'pageview' && 'Page View'}
                              {event.type === 'click' && 'Button Click'}
                              {event.type === 'conversion' && 'Conversion'}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {timeString}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              {event.type === 'pageview' && `Visitor from ${location} viewed ${page.title}`}
                              {event.type === 'click' && `Visitor from ${location} clicked on a button on ${page.title}`}
                              {event.type === 'conversion' && `Visitor from ${location} completed a conversion on ${page.title}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
