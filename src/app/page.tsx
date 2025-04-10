import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          Local Business Marketing Platform
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          A comprehensive marketing solution for small local businesses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Content Management</h2>
            <p className="text-gray-700">
              Create, schedule, and manage content across multiple marketing channels.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Social Media</h2>
            <p className="text-gray-700">
              Manage all your social media accounts from one central dashboard.
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Analytics</h2>
            <p className="text-gray-700">
              Track performance and gain insights with comprehensive analytics.
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">AI Recommendations</h2>
            <p className="text-gray-700">
              Get AI-powered suggestions to optimize your marketing efforts.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors text-center"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-6 rounded-md border border-blue-600 transition-colors text-center"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
