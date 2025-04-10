'use client';

import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error caught by error boundary:', error);
      setHasError(true);
      setError(error.error);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h2 className="mt-2 text-lg font-medium text-gray-900">Something went wrong</h2>
              <p className="mt-2 text-sm text-gray-500">
                We're sorry, but there was an error loading this page.
              </p>
              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-700 font-mono overflow-auto text-left">
                    {error.toString()}
                  </p>
                </div>
              )}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setHasError(false);
                    setError(null);
                    window.location.reload();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
