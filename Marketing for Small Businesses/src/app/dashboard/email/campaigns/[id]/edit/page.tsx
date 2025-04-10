'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EmailCampaignCreator from '@/components/email/EmailCampaignCreator';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';
import { EmailCampaign } from '@/models/email';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { campaigns } = useEmailMarketing();
  
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load campaign data
  useEffect(() => {
    const campaignData = campaigns.find(c => c.id === params.id);
    if (campaignData) {
      setCampaign(campaignData);
    }
    setLoading(false);
  }, [params.id, campaigns]);
  
  const handleSave = (updatedCampaign: EmailCampaign) => {
    router.push('/dashboard/email/campaigns');
  };
  
  const handleCancel = () => {
    router.push('/dashboard/email/campaigns');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">Campaign not found</h2>
        <p className="mt-2 text-gray-500">The campaign you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <Link
            href="/dashboard/email/campaigns"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/email/campaigns" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Campaign</h1>
      </div>
      
      <EmailCampaignCreator
        campaignId={campaign.id}
        initialCampaign={campaign}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
