'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';
import { EmailCampaign } from '@/models/email';

export default function CampaignsPage() {
  const { 
    campaigns, 
    templates,
    contactLists,
    deleteEmailCampaign,
    sendCampaignImmediately,
    cancelEmailCampaign,
    loading, 
    error 
  } = useEmailMarketing();
  
  const [statusFilter, setStatusFilter] = useState<EmailCampaign['status'] | 'all'>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filter campaigns by status
  const filteredCampaigns = statusFilter === 'all'
    ? campaigns
    : campaigns.filter(campaign => campaign.status === statusFilter);
  
  // Sort campaigns by created date (newest first)
  const sortedCampaigns = [...filteredCampaigns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Handle campaign delete
  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteEmailCampaign(campaignId);
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };
  
  // Handle campaign send now
  const handleSendCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to send this campaign now?')) {
      try {
        await sendCampaignImmediately(campaignId);
      } catch (error) {
        console.error('Failed to send campaign:', error);
      }
    }
  };
  
  // Handle campaign cancel
  const handleCancelCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to cancel this scheduled campaign?')) {
      try {
        await cancelEmailCampaign(campaignId);
      } catch (error) {
        console.error('Failed to cancel campaign:', error);
      }
    }
  };
  
  // Handle campaign details
  const handleViewDetails = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setShowDetails(true);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get template name
  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };
  
  // Get list names
  const getListNames = (listIds: string[]) => {
    return listIds.map(id => {
      const list = contactLists.find(l => l.id === id);
      return list ? list.name : 'Unknown List';
    });
  };
  
  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/email" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Email Campaigns</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-lg font-medium text-gray-900">Campaigns</h2>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EmailCampaign['status'] | 'all')}
                className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <Link
                href="/dashboard/email/campaigns/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                New Campaign
              </Link>
            </div>
          </div>
        </div>
        
        {/* Campaigns table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled/Sent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
              ) : sortedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                sortedCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetails(campaign)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.subject}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.stats?.sent || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.sentAt 
                        ? formatDate(campaign.sentAt)
                        : campaign.scheduledAt
                        ? formatDate(campaign.scheduledAt)
                        : 'Not scheduled'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.stats ? (
                        <div className="flex space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <EnvelopeOpenIcon className="h-4 w-4 text-green-500 mr-1" />
                            {campaign.stats.openRate.toFixed(1)}%
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CursorArrowRaysIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            {campaign.stats.clickRate.toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        {campaign.status === 'draft' && (
                          <button
                            type="button"
                            onClick={() => handleSendCampaign(campaign.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Send Now"
                          >
                            <PaperAirplaneIcon className="h-5 w-5" />
                          </button>
                        )}
                        {campaign.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => handleCancelCampaign(campaign.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Schedule"
                          >
                            <ClockIcon className="h-5 w-5" />
                          </button>
                        )}
                        {campaign.status === 'sent' && (
                          <Link
                            href={`/dashboard/email/analytics?campaignId=${campaign.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Analytics"
                          >
                            <ChartBarIcon className="h-5 w-5" />
                          </Link>
                        )}
                        {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                          <Link
                            href={`/dashboard/email/campaigns/${campaign.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Campaign"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Campaign"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Campaign details modal */}
      {showDetails && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Campaign Details
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowDetails(false)}
                      >
                        <span className="sr-only">Close</span>
                        <ArrowLeftIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{selectedCampaign.name}</h4>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(selectedCampaign.status)}`}>
                              {selectedCampaign.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Email Details</h4>
                        <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">From Name</p>
                              <p className="text-sm font-medium text-gray-900">{selectedCampaign.fromName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">From Email</p>
                              <p className="text-sm font-medium text-gray-900">{selectedCampaign.fromEmail}</p>
                            </div>
                            {selectedCampaign.replyTo && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-500">Reply To</p>
                                <p className="text-sm font-medium text-gray-900">{selectedCampaign.replyTo}</p>
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Subject</p>
                            <p className="text-sm font-medium text-gray-900">{selectedCampaign.subject}</p>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Template</p>
                            <p className="text-sm font-medium text-gray-900">{getTemplateName(selectedCampaign.templateId)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Recipients</h4>
                        <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
                          <div className="space-y-2">
                            {getListNames(selectedCampaign.listIds).map((name, index) => (
                              <div key={index} className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{name}</span>
                              </div>
                            ))}
                          </div>
                          {selectedCampaign.stats && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500">Total Recipients</p>
                              <p className="text-sm font-medium text-gray-900">{selectedCampaign.stats.sent}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Timing</h4>
                        <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">Created</p>
                              <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.createdAt)}</p>
                            </div>
                            {selectedCampaign.scheduledAt && (
                              <div>
                                <p className="text-xs text-gray-500">Scheduled For</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.scheduledAt)}</p>
                              </div>
                            )}
                            {selectedCampaign.sentAt && (
                              <div>
                                <p className="text-xs text-gray-500">Sent At</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.sentAt)}</p>
                              </div>
                            )}
                            {selectedCampaign.completedAt && (
                              <div>
                                <p className="text-xs text-gray-500">Completed At</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.completedAt)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {selectedCampaign.stats && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Performance</h4>
                          <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                                <EnvelopeOpenIcon className="h-5 w-5 text-green-500 mb-1" />
                                <p className="text-xs text-gray-500">Open Rate</p>
                                <p className="text-lg font-medium text-gray-900">{selectedCampaign.stats.openRate.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">{selectedCampaign.stats.opened} opened</p>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                                <CursorArrowRaysIcon className="h-5 w-5 text-yellow-500 mb-1" />
                                <p className="text-xs text-gray-500">Click Rate</p>
                                <p className="text-lg font-medium text-gray-900">{selectedCampaign.stats.clickRate.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">{selectedCampaign.stats.clicked} clicked</p>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mb-1" />
                                <p className="text-xs text-gray-500">Bounce Rate</p>
                                <p className="text-lg font-medium text-gray-900">{selectedCampaign.stats.bounceRate.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">{selectedCampaign.stats.bounced} bounced</p>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                                <XMarkIcon className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-xs text-gray-500">Unsubscribe Rate</p>
                                <p className="text-lg font-medium text-gray-900">{selectedCampaign.stats.unsubscribeRate.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">{selectedCampaign.stats.unsubscribed} unsubscribed</p>
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <Link
                                href={`/dashboard/email/analytics?campaignId=${selectedCampaign.id}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                              >
                                View detailed analytics
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedCampaign.status === 'draft' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSendCampaign(selectedCampaign.id);
                      setShowDetails(false);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Send Now
                  </button>
                )}
                {selectedCampaign.status === 'scheduled' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCancelCampaign(selectedCampaign.id);
                      setShowDetails(false);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel Schedule
                  </button>
                )}
                {(selectedCampaign.status === 'draft' || selectedCampaign.status === 'scheduled') && (
                  <Link
                    href={`/dashboard/email/campaigns/${selectedCampaign.id}/edit`}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Edit Campaign
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
