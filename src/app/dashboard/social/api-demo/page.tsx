'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ApiDemo from '@/components/social/ApiDemo';

export default function ApiDemoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/social" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Social Media API Demo</h1>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This page demonstrates the usage of the Social Media Management API endpoints. You can create posts, view scheduled posts, and fetch analytics data.
            </p>
          </div>
        </div>
      </div>
      
      <ApiDemo />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Documentation</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">POST /api/social/post</h3>
            <p className="text-sm text-gray-600 mb-2">Creates a new social media post</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs text-gray-800 overflow-auto">
{`// Request body
{
  "content": "Post content text",
  "platforms": ["Facebook", "Twitter"],
  "scheduledTime": "2023-08-20T15:00:00.000Z",
  "mediaAttachments": [],
  "publishNow": false
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">GET /api/social/scheduled</h3>
            <p className="text-sm text-gray-600 mb-2">Gets all scheduled social media posts</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs text-gray-800 overflow-auto">
{`// Query parameters
?platform=Facebook
&startDate=2023-08-01T00:00:00.000Z
&endDate=2023-08-31T23:59:59.999Z`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">PUT /api/social/post/:id</h3>
            <p className="text-sm text-gray-600 mb-2">Updates a specific social media post</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs text-gray-800 overflow-auto">
{`// Request body
{
  "content": "Updated post content",
  "platforms": ["Facebook", "Twitter", "Instagram"],
  "scheduledTime": "2023-08-21T10:00:00.000Z",
  "status": "scheduled"
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">GET /api/social/analytics/:timeframe</h3>
            <p className="text-sm text-gray-600 mb-2">Gets social media analytics for the specified timeframe</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs text-gray-800 overflow-auto">
{`// Path parameters
:timeframe = "7days" | "30days" | "90days" | "custom"

// Query parameters
?platform=Facebook
&metrics=engagement,followers,platforms,posts
&startDate=2023-08-01 (required if timeframe=custom)
&endDate=2023-08-31 (required if timeframe=custom)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
