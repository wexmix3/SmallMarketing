'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/analytics" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Overview</h1>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
}
