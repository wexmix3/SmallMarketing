'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { EmailCampaign, EmailPerformanceData, getMockEmailPerformance } from '@/models/email';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';

interface EmailAnalyticsProps {
  campaignId?: string;
  timeframe?: '7days' | '30days' | '90days';
}

export default function EmailAnalytics({
  campaignId,
  timeframe = '30days'
}: EmailAnalyticsProps) {
  const { 
    campaigns, 
    getCampaignStatistics, 
    loading, 
    error 
  } = useEmailMarketing();
  
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7days' | '30days' | '90days'>(timeframe);
  const [performanceData, setPerformanceData] = useState<EmailPerformanceData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Load campaign data
  useEffect(() => {
    if (campaignId) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
      }
    }
  }, [campaignId, campaigns]);
  
  // Load performance data
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    setPerformanceData(getMockEmailPerformance());
  }, [selectedTimeframe]);
  
  // Load campaign statistics
  useEffect(() => {
    const loadStats = async () => {
      if (selectedCampaign && !selectedCampaign.stats) {
        setIsLoadingStats(true);
        try {
          await getCampaignStatistics(selectedCampaign.id);
        } catch (error) {
          console.error('Failed to load campaign statistics:', error);
        } finally {
          setIsLoadingStats(false);
        }
      }
    };
    
    loadStats();
  }, [selectedCampaign, getCampaignStatistics]);
  
  // Draw chart
  useEffect(() => {
    if (!chartRef.current || performanceData.length === 0) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Set dimensions
    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(
      ...performanceData.map(d => Math.max(d.sent, d.opened, d.clicked))
    );
    
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
    
    const step = chartWidth / (performanceData.length - 1);
    performanceData.forEach((d, i) => {
      const x = padding + i * step;
      ctx.fillText(d.date, x, height - padding + 15);
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
    
    // Draw sent line
    ctx.beginPath();
    performanceData.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.sent / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw opened line
    ctx.beginPath();
    performanceData.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.opened / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw clicked line
    ctx.beginPath();
    performanceData.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.clicked / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw legend
    const legendItems = [
      { label: 'Sent', color: '#6366f1' },
      { label: 'Opened', color: '#10b981' },
      { label: 'Clicked', color: '#f59e0b' }
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
      
      legendX += 80;
    });
    
  }, [performanceData]);
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Get trend indicator
  const getTrendIndicator = (value: number) => {
    if (value > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (value < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {selectedCampaign ? `Campaign Analytics: ${selectedCampaign.name}` : 'Email Analytics'}
          </h3>
          
          <div className="flex space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as '7days' | '30days' | '90days')}
              className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Campaign stats */}
      {selectedCampaign && selectedCampaign.stats && (
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Sent */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-indigo-100 text-indigo-600">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Sent</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {selectedCampaign.stats.sent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Opened */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                  <EnvelopeOpenIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Opened</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {selectedCampaign.stats.opened.toLocaleString()}
                    </p>
                    <p className="ml-2 text-sm text-green-600">
                      {formatPercentage(selectedCampaign.stats.openRate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Clicked */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100 text-yellow-600">
                  <CursorArrowRaysIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Clicked</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {selectedCampaign.stats.clicked.toLocaleString()}
                    </p>
                    <p className="ml-2 text-sm text-yellow-600">
                      {formatPercentage(selectedCampaign.stats.clickRate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bounced */}
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-red-100 text-red-600">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Bounced</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {selectedCampaign.stats.bounced.toLocaleString()}
                    </p>
                    <p className="ml-2 text-sm text-red-600">
                      {formatPercentage(selectedCampaign.stats.bounceRate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Campaign Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium text-gray-900">{selectedCampaign.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sent At</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCampaign.sentAt 
                    ? new Date(selectedCampaign.sentAt).toLocaleString() 
                    : 'Not sent yet'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed At</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCampaign.completedAt 
                    ? new Date(selectedCampaign.completedAt).toLocaleString() 
                    : 'Not completed yet'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Detailed Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Delivered</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCampaign.stats.delivered.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Open Rate</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPercentage(selectedCampaign.stats.openRate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Click Rate</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatPercentage(selectedCampaign.stats.clickRate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Unsubscribed</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCampaign.stats.unsubscribed.toLocaleString()} ({formatPercentage(selectedCampaign.stats.unsubscribeRate)})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Performance chart */}
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Email Performance Over Time
        </h4>
        <div className="w-full h-80 relative">
          <canvas 
            ref={chartRef} 
            className="w-full h-full"
            width={800}
            height={400}
          />
          
          {/* Fallback for when canvas is not supported or data is empty */}
          {(!performanceData || performanceData.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">No performance data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Overall stats */}
      {!selectedCampaign && (
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average open rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                  <EnvelopeOpenIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Open Rate</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      24.5%
                    </p>
                    <p className="ml-2 text-sm text-green-600 flex items-center">
                      {getTrendIndicator(2.3)}
                      +2.3%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Average click rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100 text-yellow-600">
                  <CursorArrowRaysIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Click Rate</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      3.8%
                    </p>
                    <p className="ml-2 text-sm text-green-600 flex items-center">
                      {getTrendIndicator(0.5)}
                      +0.5%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total emails sent */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-indigo-100 text-indigo-600">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Emails Sent</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    12,450
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
