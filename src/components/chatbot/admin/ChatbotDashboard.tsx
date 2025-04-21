'use client';

import { useState, useEffect } from 'react';
import { 
  ChatbotConfig, 
  Conversation,
  KnowledgeBase
} from '@/models/chatbot';

interface ChatbotDashboardProps {
  businessId: string;
}

export default function ChatbotDashboard({ businessId }: ChatbotDashboardProps) {
  const [activeTab, setActiveTab] = useState<'conversations' | 'knowledge' | 'settings'>('conversations');
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch chatbot configuration
        const configResponse = await fetch(`/api/chatbot/config?businessId=${businessId}`);
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setChatbotConfig(configData);
        }
        
        // Fetch active conversations
        const conversationsResponse = await fetch(`/api/chatbot/conversations?businessId=${businessId}&status=active`);
        if (conversationsResponse.ok) {
          const conversationsData = await conversationsResponse.json();
          setConversations(conversationsData);
        }
        
        // Fetch knowledge base
        const knowledgeResponse = await fetch(`/api/chatbot/knowledge?businessId=${businessId}`);
        if (knowledgeResponse.ok) {
          const knowledgeData = await knowledgeResponse.json();
          setKnowledgeBase(knowledgeData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [businessId]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">AI Customer Service Assistant</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'conversations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'knowledge'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>
      
      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'conversations' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Conversations</h2>
              {conversations.length === 0 ? (
                <p className="text-gray-500">No active conversations</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {conversation.visitorName || 'Anonymous Visitor'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(conversation.startTime).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {conversation.status}
                        </span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-2">
                        {conversation.messages.length > 0
                          ? conversation.messages[conversation.messages.length - 1].content
                          : 'No messages yet'}
                      </p>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Conversation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'knowledge' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
              {!knowledgeBase ? (
                <p className="text-gray-500">No knowledge base found</p>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">FAQs</h3>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add FAQ
                      </button>
                    </div>
                    {knowledgeBase.faqs.length === 0 ? (
                      <p className="text-gray-500">No FAQs added yet</p>
                    ) : (
                      <div className="space-y-3">
                        {knowledgeBase.faqs.map((faq) => (
                          <div key={faq.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{faq.question}</h4>
                            <p className="text-sm text-gray-700 mb-2">{faq.answer}</p>
                            <div className="flex space-x-2">
                              {faq.tags?.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <button className="text-sm text-blue-600 hover:text-blue-800">
                                Edit
                              </button>
                              <button className="text-sm text-red-600 hover:text-red-800">
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Products</h3>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add Product
                      </button>
                    </div>
                    {knowledgeBase.products.length === 0 ? (
                      <p className="text-gray-500">No products added yet</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {knowledgeBase.products.map((product) => (
                          <div key={product.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-700 mb-2">{product.description}</p>
                            <p className="font-medium text-green-700">
                              {product.price.toFixed(2)} {product.currency}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Services</h3>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add Service
                      </button>
                    </div>
                    {knowledgeBase.services.length === 0 ? (
                      <p className="text-gray-500">No services added yet</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {knowledgeBase.services.map((service) => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">{service.name}</h4>
                            <p className="text-sm text-gray-700 mb-2">{service.description}</p>
                            <p className="font-medium text-green-700">
                              {service.price.toFixed(2)} {service.currency}
                            </p>
                            {service.duration && (
                              <p className="text-sm text-gray-500">
                                Duration: {service.duration} minutes
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Chatbot Settings</h2>
              {!chatbotConfig ? (
                <p className="text-gray-500">No configuration found</p>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-medium mb-3">General Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chatbot Name
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Welcome Message
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.welcomeMessage}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit Settings
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Appearance</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Theme
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.appearance.theme}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Color
                        </label>
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-md mr-2"
                            style={{ backgroundColor: chatbotConfig.appearance.primaryColor }}
                          ></div>
                          <input
                            type="text"
                            value={chatbotConfig.appearance.primaryColor}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.appearance.position}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Customize Appearance
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-medium mb-3">AI Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          AI Model
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.aiSettings.model}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Temperature
                        </label>
                        <input
                          type="text"
                          value={chatbotConfig.aiSettings.temperature}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Configure AI
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
