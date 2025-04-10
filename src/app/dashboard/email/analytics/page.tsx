'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';
import EmailAnalytics from '@/components/email/EmailAnalytics';
import { EmailCampaign } from '@/models/email';

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  
  const { campaigns, loading, error } = useEmailMarketing();
  
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(campaignId);
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days'>('30days');
  
  // Get sent campaigns
  const sentCampaigns = campaigns.filter(campaign => campaign.status === 'sent');
  
  // Get selected campaign
  const selectedCampaign = selectedCampaignId 
    ? campaigns.find(campaign => campaign.id === selectedCampaignId)
    : null;
  
  // Update selected campaign when URL param changes
  useEffect(() => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
    }
  }, [campaignId]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/email" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Email Analytics</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedCampaign 
                ? `Campaign Analytics: ${selectedCampaign.name}`
                : 'Overall Email Performance'
              }
            </h2>
            
            <div className="flex space-x-4">
              <select
                value={selectedCampaignId || ''}
                onChange={(e) => setSelectedCampaignId(e.target.value || null)}
                className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All Campaigns</option>
                {sentCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
              
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as '7days' | '30days' | '90days')}
                className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <EmailAnalytics 
            campaignId={selectedCampaignId || undefined}
            timeframe={timeframe}
          />
        </div>
      </div>
      
      {/* Overall stats */}
      {!selectedCampaignId && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Email Marketing Insights</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Best Performing Subject Lines</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Questions in subject lines</p>
                      <p className="text-xs text-gray-600">Subject lines with questions have 32% higher open rates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Personalization</p>
                      <p className="text-xs text-gray-600">Including the recipient's name increases opens by 26%</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Urgency</p>
                      <p className="text-xs text-gray-600">Terms like "limited time" boost open rates by 22%</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">Optimal Send Times</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tuesday, 10:00 AM</p>
                      <p className="text-xs text-gray-600">28.4% average open rate</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Thursday, 2:00 PM</p>
                      <p className="text-xs text-gray-600">26.7% average open rate</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sunday, 7:00 PM</p>
                      <p className="text-xs text-gray-600">24.2% average open rate</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Content That Drives Clicks</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CursorArrowRaysIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clear CTAs</p>
                      <p className="text-xs text-gray-600">Buttons with action verbs have 28% higher click rates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CursorArrowRaysIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Visual content</p>
                      <p className="text-xs text-gray-600">Emails with images see 42% more engagement</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CursorArrowRaysIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Social proof</p>
                      <p className="text-xs text-gray-600">Including testimonials increases clicks by 34%</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">Factors That Increase Unsubscribes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Frequency</p>
                      <p className="text-xs text-gray-600">Sending more than 2 emails per week increases unsubscribes by 35%</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Irrelevant content</p>
                      <p className="text-xs text-gray-600">Non-personalized content leads to 28% more unsubscribes</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mobile unfriendly</p>
                      <p className="text-xs text-gray-600">Non-responsive emails have 21% higher unsubscribe rates</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Campaign comparison */}
      {!selectedCampaignId && sentCampaigns.length > 1 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Campaign Comparison</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Click Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bounce Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sentCampaigns
                    .filter(campaign => campaign.stats)
                    .sort((a, b) => {
                      if (!a.sentAt || !b.sentAt) return 0;
                      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
                    })
                    .slice(0, 5)
                    .map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/dashboard/email/analytics?campaignId=${campaign.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-900"
                          >
                            {campaign.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.stats?.sent || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, campaign.stats?.openRate || 0)}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">
                              {campaign.stats?.openRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-yellow-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, campaign.stats?.clickRate || 0) * 3}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">
                              {campaign.stats?.clickRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-red-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, campaign.stats?.bounceRate || 0) * 5}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">
                              {campaign.stats?.bounceRate.toFixed(1)}%
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
    </div>
  );
}
