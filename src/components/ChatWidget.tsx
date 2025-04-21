import React, { useState, useEffect, useRef } from 'react';
import { Message, Conversation, ChatbotConfig } from '../types/chatbot';

interface ChatWidgetProps {
  businessId: string;
  apiUrl: string;
  config?: {
    theme?: 'light' | 'dark';
    position?: 'left' | 'right';
    primaryColor?: string;
    autoOpen?: boolean;
    collectVisitorInfo?: boolean;
  };
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  businessId, 
  apiUrl,
  config = {} 
}) => {
  const [isOpen, setIsOpen] = useState(config.autoOpen || false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    infoCollected: false
  });
  const [error, setError] = useState<string | null>(null);
  
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
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/api/chatbot/config?businessId=${businessId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chatbot configuration');
        }
        
        const data = await response.json();
        setChatbotConfig(data);
      } catch (error) {
        console.error('Error fetching chatbot config:', error);
        setError('Failed to load chat. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, [apiUrl, businessId]);
  
  // Initialize conversation when chat is opened
  useEffect(() => {
    if (isOpen && !conversation && (visitorInfo.infoCollected || !(chatbotConfig?.behavior.collectName || chatbotConfig?.behavior.collectEmail))) {
      initializeConversation();
    }
  }, [isOpen, conversation, visitorInfo.infoCollected, chatbotConfig]);
  
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
      setError(null);
      
      const visitorId = localStorage.getItem('visitorId') || `visitor-${Date.now()}`;
      
      const response = await fetch(`${apiUrl}/api/chatbot/conversations`, {
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
      
      if (!response.ok) {
        throw new Error('Failed to initialize conversation');
      }
      
      const data = await response.json();
      setConversation(data);
      
      // Mark welcome message as read
      if (data.messages && data.messages.length > 0) {
        markMessagesAsRead(data.id, [data.messages[0].id]);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      setError('Failed to start conversation. Please try again later.');
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
      const response = await fetch(`${apiUrl}/api/chatbot/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          sender: 'user'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Fetch updated conversation to get AI response
      await fetchConversation(conversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };
  
  // Fetch conversation
  const fetchConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/chatbot/conversations/${conversationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      
      const data = await response.json();
      setConversation(data);
      
      // Mark new assistant messages as read
      const unreadMessages = data.messages
        .filter(msg => msg.sender === 'assistant' && !msg.isRead)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markMessagesAsRead(conversationId, unreadMessages);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Failed to update conversation. Please refresh.');
    }
  };
  
  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string, messageIds: string[]) => {
    try {
      await fetch(`${apiUrl}/api/chatbot/conversations/${conversationId}/messages`, {
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
    // Validate required fields
    if (chatbotConfig?.behavior.requireContactInfo) {
      if (chatbotConfig.behavior.collectName && !visitorInfo.name) {
        setError('Please enter your name');
        return;
      }
      
      if (chatbotConfig.behavior.collectEmail && !visitorInfo.email) {
        setError('Please enter your email');
        return;
      }
    }
    
    setVisitorInfo(prev => ({ ...prev, infoCollected: true }));
    setError(null);
  };
  
  // Handle suggested action click
  const handleSuggestedAction = (action: { text: string, value: string }) => {
    if (action.value === 'human_handoff') {
      // Request human handoff
      if (conversation) {
        fetch(`${apiUrl}/api/chatbot/conversations/${conversation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'transferred'
          }),
        }).then(() => {
          fetchConversation(conversation.id);
        }).catch(error => {
          console.error('Error requesting human handoff:', error);
        });
      }
    } else if (action.value === 'end_conversation') {
      // Close conversation
      if (conversation) {
        fetch(`${apiUrl}/api/chatbot/conversations/${conversation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'closed'
          }),
        }).then(() => {
          setConversation(null);
        }).catch(error => {
          console.error('Error closing conversation:', error);
        });
      }
    } else {
      // Send the suggested message
      setMessage(action.text);
      sendMessage();
    }
  };
  
  // Determine theme colors
  const theme = config.theme || chatbotConfig?.appearance.theme || 'light';
  const position = config.position || chatbotConfig?.appearance.position || 'right';
  const primaryColor = config.primaryColor || chatbotConfig?.appearance.primaryColor || '#0070f3';
  
  // Determine if we need to collect visitor info
  const needsVisitorInfo = chatbotConfig && 
    (chatbotConfig.behavior.collectName || chatbotConfig.behavior.collectEmail) && 
    !visitorInfo.infoCollected;
  
  return (
    <div className={`chat-widget ${position}`} style={{ position: 'fixed', bottom: '20px', [position]: '20px', zIndex: 1000 }}>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          color: 'white',
          border: 'none',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}
      >
        {isOpen ? '×' : '💬'}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            [position]: '0',
            width: '350px',
            height: '500px',
            backgroundColor: theme === 'light' ? 'white' : '#1a1a1a',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '15px',
              backgroundColor: primaryColor,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {chatbotConfig?.appearance.logoUrl ? (
                <img 
                  src={chatbotConfig.appearance.logoUrl} 
                  alt="Logo" 
                  style={{ width: '24px', height: '24px', marginRight: '10px', borderRadius: '50%' }}
                />
              ) : (
                <span style={{ marginRight: '10px', fontSize: '20px' }}>💬</span>
              )}
              <span style={{ fontWeight: 'bold' }}>
                {chatbotConfig?.name || 'Customer Support'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          
          {/* Chat content */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  border: `3px solid ${theme === 'light' ? '#eee' : '#444'}`,
                  borderTop: `3px solid ${primaryColor}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : error ? (
              <div style={{ 
                padding: '15px', 
                backgroundColor: theme === 'light' ? '#fff3f3' : '#3a2a2a', 
                color: theme === 'light' ? '#e53e3e' : '#ff8080',
                borderRadius: '5px',
                margin: '10px 0'
              }}>
                {error}
                <button
                  onClick={() => {
                    setError(null);
                    if (!conversation) {
                      initializeConversation();
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : needsVisitorInfo ? (
              <div style={{ 
                padding: '15px', 
                backgroundColor: theme === 'light' ? 'white' : '#333',
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: theme === 'light' ? '#333' : '#fff'
                }}>
                  Before we start chatting
                </h3>
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: theme === 'light' ? '#666' : '#ccc',
                  fontSize: '14px'
                }}>
                  Please provide your information so we can better assist you.
                </p>
                
                {chatbotConfig?.behavior.collectName && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '5px',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}>
                      Name {chatbotConfig.behavior.requireContactInfo && '*'}
                    </label>
                    <input
                      type="text"
                      value={visitorInfo.name}
                      onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${theme === 'light' ? '#ddd' : '#555'}`,
                        borderRadius: '5px',
                        backgroundColor: theme === 'light' ? 'white' : '#444',
                        color: theme === 'light' ? '#333' : '#fff'
                      }}
                      required={chatbotConfig.behavior.requireContactInfo}
                    />
                  </div>
                )}
                
                {chatbotConfig?.behavior.collectEmail && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '5px',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}>
                      Email {chatbotConfig.behavior.requireContactInfo && '*'}
                    </label>
                    <input
                      type="email"
                      value={visitorInfo.email}
                      onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${theme === 'light' ? '#ddd' : '#555'}`,
                        borderRadius: '5px',
                        backgroundColor: theme === 'light' ? 'white' : '#444',
                        color: theme === 'light' ? '#333' : '#fff'
                      }}
                      required={chatbotConfig.behavior.requireContactInfo}
                    />
                  </div>
                )}
                
                <button
                  onClick={submitVisitorInfo}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Start Chat
                </button>
              </div>
            ) : conversation?.messages && conversation.messages.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 15px',
                        borderRadius: '10px',
                        backgroundColor: msg.sender === 'user' 
                          ? primaryColor 
                          : theme === 'light' ? 'white' : '#333',
                        color: msg.sender === 'user' 
                          ? 'white' 
                          : theme === 'light' ? '#333' : '#fff',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ wordBreak: 'break-word' }}>{msg.content}</div>
                      <div style={{ 
                        fontSize: '11px', 
                        marginTop: '5px', 
                        textAlign: 'right',
                        opacity: 0.7
                      }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    {/* Suggested actions */}
                    {msg.sender === 'assistant' && msg.metadata?.suggestedActions && msg.metadata.suggestedActions.length > 0 && (
                      <div style={{ 
                        marginTop: '5px', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '5px' 
                      }}>
                        {msg.metadata.suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedAction(action)}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: theme === 'light' ? '#f0f0f0' : '#444',
                              color: theme === 'light' ? '#333' : '#fff',
                              border: `1px solid ${theme === 'light' ? '#ddd' : '#555'}`,
                              borderRadius: '15px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                color: theme === 'light' ? '#999' : '#777'
              }}>
                No messages yet
              </div>
            )}
          </div>
          
          {/* Message input */}
          {!needsVisitorInfo && !isLoading && !error && (
            <div style={{ 
              padding: '15px', 
              borderTop: `1px solid ${theme === 'light' ? '#eee' : '#444'}`,
              backgroundColor: theme === 'light' ? 'white' : '#1a1a1a'
            }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                style={{ display: 'flex', gap: '10px' }}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    border: `1px solid ${theme === 'light' ? '#ddd' : '#444'}`,
                    borderRadius: '20px',
                    backgroundColor: theme === 'light' ? 'white' : '#333',
                    color: theme === 'light' ? '#333' : '#fff'
                  }}
                  disabled={conversation?.status !== 'active'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 15px',
                    backgroundColor: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: conversation?.status === 'active' ? 'pointer' : 'not-allowed',
                    opacity: conversation?.status === 'active' ? 1 : 0.6
                  }}
                  disabled={conversation?.status !== 'active'}
                >
                  Send
                </button>
              </form>
              
              {conversation?.status === 'transferred' && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: theme === 'light' ? '#666' : '#aaa',
                  textAlign: 'center'
                }}>
                  Your conversation has been transferred to a human agent. Please wait for a response.
                </div>
              )}
              
              {conversation?.status === 'closed' && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: theme === 'light' ? '#666' : '#aaa',
                  textAlign: 'center'
                }}>
                  This conversation has ended. 
                  <button
                    onClick={() => {
                      setConversation(null);
                      initializeConversation();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: primaryColor,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                      margin: 0,
                      fontSize: '12px'
                    }}
                  >
                    Start a new conversation
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* CSS for animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatWidget;
