'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Conversation, 
  Message, 
  ChatbotConfig 
} from '@/models/chatbot';

interface ChatWidgetProps {
  businessId: string;
  config?: Partial<ChatbotConfig>;
  onClose?: () => void;
}

export default function ChatWidget({ 
  businessId, 
  config,
  onClose 
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    infoCollected: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate a visitor ID if none exists
  useEffect(() => {
    const storedVisitorId = localStorage.getItem('visitorId');
    if (!storedVisitorId) {
      const newVisitorId = `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('visitorId', newVisitorId);
    }
  }, []);
  
  // Fetch chatbot configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/chatbot/config?businessId=${businessId}`);
        if (response.ok) {
          const data = await response.json();
          setChatbotConfig(data);
        } else {
          console.error('Failed to fetch chatbot config');
        }
      } catch (error) {
        console.error('Error fetching chatbot config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, [businessId]);
  
  // Initialize conversation when chat is opened
  useEffect(() => {
    if (isOpen && !conversation) {
      initializeConversation();
    }
  }, [isOpen, conversation]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);
  
  // Initialize a new conversation
  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      
      const visitorId = localStorage.getItem('visitorId') || `visitor-${Date.now()}`;
      
      const response = await fetch('/api/chatbot/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          visitorId,
          visitorName: visitorInfo.name || undefined,
          visitorEmail: visitorInfo.email || undefined,
          source: 'website'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
        
        // Mark welcome message as read
        if (data.messages && data.messages.length > 0) {
          markMessagesAsRead(data.id, [data.messages[0].id]);
        }
      } else {
        console.error('Failed to initialize conversation');
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send a message
  const sendMessage = async () => {
    if (!message.trim() || !conversation) return;
    
    try {
      // Add message to UI immediately for better UX
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: conversation.id,
        content: message,
        sender: 'user',
        timestamp: new Date(),
        isRead: true
      };
      
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, tempMessage]
        };
      });
      
      setMessage('');
      
      // Send message to API
      const response = await fetch(`/api/chatbot/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          sender: 'user'
        }),
      });
      
      if (response.ok) {
        // Fetch updated conversation to get AI response
        await fetchConversation(conversation.id);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Fetch conversation
  const fetchConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chatbot/conversations/${conversationId}`);
      
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
        
        // Mark new assistant messages as read
        const unreadMessages = data.messages
          .filter(msg => msg.sender === 'assistant' && !msg.isRead)
          .map(msg => msg.id);
        
        if (unreadMessages.length > 0) {
          markMessagesAsRead(conversationId, unreadMessages);
        }
      } else {
        console.error('Failed to fetch conversation');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };
  
  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string, messageIds: string[]) => {
    try {
      await fetch(`/api/chatbot/conversations/${conversationId}/messages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageIds
        }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  // Submit visitor info
  const submitVisitorInfo = () => {
    if (!visitorInfo.name || !visitorInfo.email) return;
    
    setVisitorInfo(prev => ({ ...prev, infoCollected: true }));
    
    // If conversation already exists, update it
    if (conversation) {
      // In a real implementation, we would update the conversation with visitor info
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          visitorName: visitorInfo.name,
          visitorEmail: visitorInfo.email
        };
      });
    } else {
      // Otherwise initialize a new conversation with visitor info
      initializeConversation();
    }
  };
  
  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (onClose && isOpen) {
      onClose();
    }
  };
  
  // Handle message input
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  // Handle message submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  // Determine if we need to collect visitor info
  const needsVisitorInfo = chatbotConfig && (
    (chatbotConfig.behaviors.collectName || chatbotConfig.behaviors.collectEmail) && 
    !visitorInfo.infoCollected
  );
  
  // Get merged configuration (props override fetched config)
  const mergedConfig = {
    ...chatbotConfig,
    ...config
  };
  
  // Determine theme colors
  const primaryColor = mergedConfig?.appearance?.primaryColor || '#0070f3';
  const secondaryColor = mergedConfig?.appearance?.secondaryColor || '#ffffff';
  const position = mergedConfig?.appearance?.position || 'right';
  
  return (
    <div className="fixed bottom-4 z-50" style={{ [position]: '20px' }}>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div 
          className="absolute bottom-16 w-80 sm:w-96 h-96 rounded-lg shadow-xl flex flex-col overflow-hidden"
          style={{ [position]: '0', backgroundColor: secondaryColor }}
        >
          {/* Header */}
          <div 
            className="p-3 flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center">
              {mergedConfig?.appearance?.logoUrl ? (
                <img 
                  src={mergedConfig.appearance.logoUrl} 
                  alt="Logo" 
                  className="h-8 w-8 rounded-full mr-2"
                />
              ) : (
                <div 
                  className="h-8 w-8 rounded-full mr-2 flex items-center justify-center bg-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              )}
              <span className="text-white font-medium">
                {mergedConfig?.name || 'Customer Support'}
              </span>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Chat content */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
              </div>
            ) : needsVisitorInfo ? (
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-medium mb-2">Before we start chatting</h3>
                <p className="text-sm text-gray-600 mb-4">Please provide your information so we can better assist you.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); submitVisitorInfo(); }}>
                  {chatbotConfig?.behaviors.collectName && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={visitorInfo.name}
                        onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={chatbotConfig.behaviors.requireContactInfo}
                      />
                    </div>
                  )}
                  
                  {chatbotConfig?.behaviors.collectEmail && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={visitorInfo.email}
                        onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={chatbotConfig.behaviors.requireContactInfo}
                      />
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Start Chat
                  </button>
                </form>
              </div>
            ) : conversation?.messages && conversation.messages.length > 0 ? (
              <div className="space-y-3">
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 shadow'
                      }`}
                      style={msg.sender === 'user' ? { backgroundColor: primaryColor } : {}}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No messages yet</p>
              </div>
            )}
          </div>
          
          {/* Message input */}
          {!needsVisitorInfo && (
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-md text-white focus:outline-none"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
