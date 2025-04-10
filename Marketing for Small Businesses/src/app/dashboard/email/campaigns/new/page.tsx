'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EmailCampaignCreator from '@/components/email/EmailCampaignCreator';
import { EmailCampaign } from '@/models/email';

export default function NewCampaignPage() {
  const router = useRouter();
  
  const handleSave = (campaign: EmailCampaign) => {
    router.push('/dashboard/email/campaigns');
  };
  
  const handleCancel = () => {
    router.push('/dashboard/email/campaigns');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/email/campaigns" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Campaign</h1>
      </div>
      
      <EmailCampaignCreator
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
