'use client';

import { useState } from 'react';
import ChatWidget from '@/components/chatbot/ChatWidget';

export default function CustomerServiceAssistantDemo() {
  const [showChatbot, setShowChatbot] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Customer Service Assistant</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Hero section */}
            <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Enhance Your Customer Service with AI
                </h2>
                <p className="mt-4 text-xl">
                  Provide 24/7 support, answer common questions, and schedule appointments automatically.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => setShowChatbot(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Try the Demo
                  </button>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h3>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">24/7 Availability</h4>
                  <p className="text-gray-600">
                    Provide instant responses to customer inquiries at any time, even outside business hours.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Custom Knowledge Base</h4>
                  <p className="text-gray-600">
                    Train the AI with your business information, FAQs, products, and services.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Appointment Scheduling</h4>
                  <p className="text-gray-600">
                    Allow customers to book appointments directly through the chat interface.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h4>
                  <p className="text-gray-600">
                    Track conversation metrics, popular topics, and customer satisfaction.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Human Handoff</h4>
                  <p className="text-gray-600">
                    Seamlessly transfer complex conversations to human agents when needed.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Customizable Appearance</h4>
                  <p className="text-gray-600">
                    Match the chatbot's look and feel to your brand identity.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="px-6 py-8 sm:p-10 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pricing Plans</h3>
              
              <div className="grid gap-8 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Basic</h4>
                  <p className="text-gray-500 mb-4">For small businesses just getting started</p>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$29<span className="text-lg font-normal text-gray-500">/month</span></p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Website integration
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Customizable appearance
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      FAQ configuration
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Basic analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Email notifications
                    </li>
                  </ul>
                  
                  <button className="w-full py-2 px-4 border border-blue-500 rounded-md text-blue-500 font-medium hover:bg-blue-50 focus:outline-none">
                    Get Started
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-500 relative">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                    Popular
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Standard</h4>
                  <p className="text-gray-500 mb-4">For growing businesses with more needs</p>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$79<span className="text-lg font-normal text-gray-500">/month</span></p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      All Basic features
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Appointment scheduling
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Product/service catalog
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lead capture forms
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile app notifications
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      CRM integration
                    </li>
                  </ul>
                  
                  <button className="w-full py-2 px-4 bg-blue-500 rounded-md text-white font-medium hover:bg-blue-600 focus:outline-none">
                    Get Started
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Premium</h4>
                  <p className="text-gray-500 mb-4">For businesses with advanced requirements</p>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$149<span className="text-lg font-normal text-gray-500">/month</span></p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      All Standard features
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Multi-language support
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Multi-platform integration
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Voice capability
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  
                  <button className="w-full py-2 px-4 border border-blue-500 rounded-md text-blue-500 font-medium hover:bg-blue-50 focus:outline-none">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to enhance your customer service?</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Start providing 24/7 support to your customers today.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowChatbot(true)}
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Try the Demo
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-gray-900 font-bold text-xl">AI Customer Service Assistant</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-gray-500 md:text-right">
                &copy; 2023 Marketing for Small Businesses. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chatbot widget */}
      {showChatbot && (
        <ChatWidget
          businessId="business-1"
          config={{
            name: "Demo Assistant",
            welcomeMessage: "👋 Hello! I'm your AI customer service assistant. How can I help you today?",
            appearance: {
              primaryColor: "#4F46E5",
              position: "right"
            }
          }}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
}
