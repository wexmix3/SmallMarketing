/**
 * Chat Widget Component
 * Main component for the AI Customer Service Assistant chatbot
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

/**
 * Chat Widget Component
 * @param {Object} props - Component props
 * @param {Object} props.config - Chatbot configuration
 * @param {Function} props.onSendMessage - Message send handler
 * @returns {JSX.Element} - Chat widget component
 */
export const ChatWidget = ({ config, onSendMessage }) => {
  // State for chat messages
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  
  // Reference to messages container for auto-scrolling
  const messagesContainerRef = useRef(null);
  
  // Initialize chat with welcome message
  useEffect(() => {
    if (config.welcomeMessage) {
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: config.welcomeMessage,
          timestamp: new Date()
        }
      ]);
      
      // Set initial suggested actions
      setSuggestedActions([
        'What services do you offer?',
        'What are your hours?',
        'How can I contact you?'
      ]);
    }
  }, [config.welcomeMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  /**
   * Handle message submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    
    // Clear suggested actions
    setSuggestedActions([]);
    
    // Call onSendMessage callback
    if (onSendMessage) {
      onSendMessage(inputValue);
    }
    
    setInputValue('');
    
    // Simulate assistant typing
    setIsTyping(true);
    
    // Simulate assistant response after delay
    setTimeout(() => {
      // Add assistant message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I understand you\'re asking about "' + inputValue + '". Let me check that for you.',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
      
      // Set new suggested actions
      setSuggestedActions([
        'Tell me more',
        'I have another question',
        'Thank you'
      ]);
    }, 1500);
  };
  
  /**
   * Handle suggested action click
   * @param {string} action - Suggested action text
   */
  const handleSuggestedAction = (action) => {
    // Set input value to suggested action
    setInputValue(action);
    
    // Submit form
    handleSubmit({
      preventDefault: () => {}
    });
  };
  
  /**
   * Toggle chat widget minimized state
   */
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  /**
   * Format timestamp
   * @param {Date} timestamp - Message timestamp
   * @returns {string} - Formatted time
   */
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`chat-widget ${isMinimized ? 'minimized' : ''}`}
      style={{
        '--primary-color': config.primaryColor || '#0071e3'
      }}
    >
      <div className="chat-header" onClick={toggleMinimized}>
        {config.logo && (
          <div className="chat-logo">
            <img src={config.logo} alt="Logo" />
          </div>
        )}
        <div className="chat-title">{config.chatbotName || 'Assistant'}</div>
        <div className="chat-controls">
          <button type="button" className="minimize-button">
            <span>{isMinimized ? '+' : '_'}</span>
          </button>
        </div>
      </div>
      
      <div className="chat-body">
        <div className="chat-messages" ref={messagesContainerRef}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              formatTime={formatTime}
            />
          ))}
          
          {suggestedActions.length > 0 && !isTyping && (
            <div className="suggested-actions">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className="action-button"
                  onClick={() => handleSuggestedAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
          
          {isTyping && <TypingIndicator />}
        </div>
        
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
