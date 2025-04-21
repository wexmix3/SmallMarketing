'use client';

import ChatbotDashboard from '@/components/chatbot/admin/ChatbotDashboard';

export default function CustomerServiceAssistantAdmin() {
  // In a real application, we would check authentication here
  const businessId = 'business-1'; // This would come from the authenticated user's business
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Customer Service Assistant</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin Dashboard</span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                Help
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ChatbotDashboard businessId={businessId} />
        </div>
      </main>
    </div>
  );
}
