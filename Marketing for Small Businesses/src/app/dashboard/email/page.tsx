'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  EnvelopeIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const emailCampaigns = [
  {
    id: 1,
    name: 'Monthly Newsletter - August',
    subject: 'Your August Update from Local Business',
    status: 'Sent',
    sentDate: 'Aug 5, 2023',
    openRate: '24.8%',
    clickRate: '3.2%',
    recipients: 1245,
  },
  {
    id: 2,
    name: 'Summer Sale Promotion',
    subject: 'Don\'t Miss Our Biggest Sale of the Season!',
    status: 'Scheduled',
    sentDate: 'Aug 18, 2023',
    openRate: '-',
    clickRate: '-',
    recipients: 1350,
  },
  {
    id: 3,
    name: 'New Product Announcement',
    subject: 'Introducing Our Latest Products',
    status: 'Draft',
    sentDate: '-',
    openRate: '-',
    clickRate: '-',
    recipients: 0,
  },
  {
    id: 4,
    name: 'Customer Feedback Survey',
    subject: 'We Value Your Opinion - Quick 2-Minute Survey',
    status: 'Sent',
    sentDate: 'Jul 22, 2023',
    openRate: '32.1%',
    clickRate: '12.5%',
    recipients: 1245,
  },
  {
    id: 5,
    name: 'Holiday Season Preview',
    subject: 'Get Ready for the Holiday Season with Local Business',
    status: 'Draft',
    sentDate: '-',
    openRate: '-',
    clickRate: '-',
    recipients: 0,
  },
];

const subscriberLists = [
  { id: 1, name: 'All Subscribers', count: 1350, lastUpdated: '2 days ago' },
  { id: 2, name: 'Frequent Customers', count: 487, lastUpdated: '1 week ago' },
  { id: 3, name: 'New Subscribers', count: 124, lastUpdated: '1 day ago' },
  { id: 4, name: 'Inactive Subscribers', count: 215, lastUpdated: '2 weeks ago' },
];

export default function EmailMarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Email Marketing</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Campaign
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`${
              activeTab === 'subscribers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analytics
          </button>
        </nav>
      </div>
      
      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === 'Sent'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.sentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.recipients.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.openRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.clickRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Subscriber Lists</h3>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Import Subscribers
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                  New List
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {subscriberLists.map((list) => (
                  <li key={list.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{list.name}</div>
                          <div className="text-sm text-gray-500">{list.count} subscribers</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500 mr-4">
                          Updated {list.lastUpdated}
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Subscriber Growth</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track your subscriber list growth over time
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Subscriber growth chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Email Templates</h3>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
              New Template
            </button>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Template Card 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900">Monthly Newsletter</h4>
                  <p className="mt-1 text-sm text-gray-500">Standard newsletter template with sections for updates, promotions, and news.</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Template Card 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900">Promotional Offer</h4>
                  <p className="mt-1 text-sm text-gray-500">Template designed for sales, discounts, and special offers with prominent CTA buttons.</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Template Card 3 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900">Welcome Email</h4>
                  <p className="mt-1 text-sm text-gray-500">Onboarding template for new subscribers with introduction to your business.</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Add New Template Card */}
              <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center h-64">
                <button
                  type="button"
                  className="inline-flex flex-col items-center px-4 py-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <PlusIcon className="h-10 w-10 mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">Create New Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Email Performance Overview</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Open Rate</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">26.4%</dd>
                  <dd className="mt-2 flex items-baseline">
                    <p className="text-sm font-semibold text-green-600">
                      <span className="flex items-center">
                        +2.5%
                      </span>
                    </p>
                    <p className="ml-2 text-sm text-gray-500">from last month</p>
                  </dd>
                </div>
                
                <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Click Rate</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">4.8%</dd>
                  <dd className="mt-2 flex items-baseline">
                    <p className="text-sm font-semibold text-green-600">
                      <span className="flex items-center">
                        +1.2%
                      </span>
                    </p>
                    <p className="ml-2 text-sm text-gray-500">from last month</p>
                  </dd>
                </div>
                
                <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Subscribers</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">1,350</dd>
                  <dd className="mt-2 flex items-baseline">
                    <p className="text-sm font-semibold text-green-600">
                      <span className="flex items-center">
                        +124
                      </span>
                    </p>
                    <p className="ml-2 text-sm text-gray-500">new this month</p>
                  </dd>
                </div>
                
                <div className="bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 truncate">Unsubscribe Rate</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0.8%</dd>
                  <dd className="mt-2 flex items-baseline">
                    <p className="text-sm font-semibold text-green-600">
                      <span className="flex items-center">
                        -0.2%
                      </span>
                    </p>
                    <p className="ml-2 text-sm text-gray-500">from last month</p>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Campaign Performance</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-80 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Campaign performance chart will be displayed here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Send Time Optimization</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                AI-powered recommendations for the best times to send your emails
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-md font-medium text-blue-800 mb-2">Optimal Send Times</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Based on your subscriber engagement patterns, here are the recommended times to send your emails:
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-900">Tuesday, 10:00 AM</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">28.4% average open rate</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-900">Thursday, 2:00 PM</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">26.7% average open rate</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-900">Sunday, 7:00 PM</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">24.2% average open rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
