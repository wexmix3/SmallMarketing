'use client';

import ColdEmailCreator from '@/components/email/ColdEmailCreator';

export default function ColdEmailPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Cold Email Outreach</h1>
      </div>
      
      <ColdEmailCreator />
    </div>
  );
}
