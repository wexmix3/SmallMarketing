'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Social media platforms
const socialPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '/facebook-icon.png', // In a real app, you would have these icons
    description: 'Connect your Facebook Business Page',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '/instagram-icon.png',
    description: 'Connect your Instagram Business Account',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '/twitter-icon.png',
    description: 'Connect your Twitter Account',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '/linkedin-icon.png',
    description: 'Connect your LinkedIn Company Page',
  },
];

// Email providers
const emailProviders = [
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: '/mailchimp-icon.png',
    description: 'Connect your Mailchimp account',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: '/sendgrid-icon.png',
    description: 'Connect your SendGrid account',
  },
  {
    id: 'constant-contact',
    name: 'Constant Contact',
    icon: '/constant-contact-icon.png',
    description: 'Connect your Constant Contact account',
  },
];

export default function ConnectChannelsPage() {
  const [connectedSocial, setConnectedSocial] = useState<string[]>([]);
  const [connectedEmail, setConnectedEmail] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // Handle social platform connection
  const handleConnectSocial = (platformId: string) => {
    // In a real app, this would open OAuth flow
    // For demo purposes, we'll just toggle the connection status
    if (connectedSocial.includes(platformId)) {
      setConnectedSocial(connectedSocial.filter(id => id !== platformId));
    } else {
      setConnectedSocial([...connectedSocial, platformId]);
    }
  };

  // Handle email provider connection
  const handleConnectEmail = (providerId: string) => {
    // In a real app, this would open OAuth flow
    // For demo purposes, we'll just toggle the connection status
    if (connectedEmail.includes(providerId)) {
      setConnectedEmail(connectedEmail.filter(id => id !== providerId));
    } else {
      setConnectedEmail([...connectedEmail, providerId]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you would save this data to your backend
      // For now, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo purposes
      localStorage.setItem('connectedChannels', JSON.stringify({
        social: connectedSocial,
        email: connectedEmail,
      }));
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Channel connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect your marketing channels
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Link your social media and email accounts to manage them in one place
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Social Media Platforms</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your social media accounts to manage posts, comments, and analytics
              </p>
              <div className="mt-4 space-y-3">
                {socialPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {/* Placeholder for platform icon */}
                        <span className="text-lg font-bold">{platform.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{platform.name}</h4>
                        <p className="text-xs text-gray-500">{platform.description}</p>
                      </div>
                    </div>
                    <div>
                      {connectedSocial.includes(platform.id) ? (
                        <button
                          type="button"
                          onClick={() => handleConnectSocial(platform.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Connected
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectSocial(platform.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Marketing Providers</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your email marketing accounts to manage campaigns and subscribers
              </p>
              <div className="mt-4 space-y-3">
                {emailProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {/* Placeholder for provider icon */}
                        <span className="text-lg font-bold">{provider.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                        <p className="text-xs text-gray-500">{provider.description}</p>
                      </div>
                    </div>
                    <div>
                      {connectedEmail.includes(provider.id) ? (
                        <button
                          type="button"
                          onClick={() => handleConnectEmail(provider.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Connected
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectEmail(provider.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                You can always connect more accounts later from your dashboard settings.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Finishing...' : (
                    <>
                      Finish Setup
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
