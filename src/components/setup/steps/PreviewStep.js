/**
 * Preview Step Component
 * Fifth step of the setup wizard for previewing the chatbot
 */

import React, { useState, useEffect } from 'react';
import { BusinessTypeNames } from '../../../models/businessTypes';

/**
 * Preview Step Component
 * @param {Object} props - Component props
 * @param {Object} props.businessInfo - Business information
 * @param {Array} props.knowledgeBase - Knowledge base items
 * @param {Object} props.customization - Customization options
 * @param {Function} props.onNext - Next step handler
 * @param {Function} props.onBack - Previous step handler
 * @returns {JSX.Element} - Preview step component
 */
export const PreviewStep = ({ businessInfo, knowledgeBase, customization, onNext, onBack }) => {
  // State for chat messages
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // State for preview mode
  const [previewMode, setPreviewMode] = useState('desktop');
  
  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'assistant',
        content: customization.welcomeMessage || 'Hello! How can I help you today?',
        timestamp: new Date()
      }
    ]);
  }, [customization.welcomeMessage]);
  
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
    setInputValue('');
    
    // Simulate assistant typing
    setIsTyping(true);
    
    // Simulate assistant response after delay
    setTimeout(() => {
      // Find response in knowledge base
      const response = findResponse(inputValue);
      
      // Add assistant message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  /**
   * Find response in knowledge base
   * @param {string} query - User query
   * @returns {string} - Assistant response
   */
  const findResponse = (query) => {
    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check knowledge base for exact match
    for (const item of knowledgeBase) {
      if (item.question.toLowerCase().includes(normalizedQuery)) {
        return item.answer;
      }
    }
    
    // Check for partial matches
    for (const item of knowledgeBase) {
      const words = normalizedQuery.split(' ');
      for (const word of words) {
        if (word.length > 3 && item.question.toLowerCase().includes(word)) {
          return item.answer;
        }
      }
    }
    
    // Default response
    return `I don't have specific information about that yet. Please contact ${businessInfo.name} directly for assistance.`;
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
    <div className="preview-step">
      <h2>Preview Your AI Assistant</h2>
      <p className="step-description">
        See how your AI assistant will appear and function for your customers.
        Try asking questions to test the knowledge base you've created.
      </p>
      
      <div className="preview-controls">
        <div className="preview-mode-selector">
          <button
            type="button"
            className={`mode-button ${previewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewMode('desktop')}
          >
            <span className="mode-icon">💻</span>
            Desktop
          </button>
          <button
            type="button"
            className={`mode-button ${previewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewMode('mobile')}
          >
            <span className="mode-icon">📱</span>
            Mobile
          </button>
        </div>
      </div>
      
      <div className="preview-container">
        <div className={`preview-frame ${previewMode}`}>
          <div 
            className="chat-widget"
            style={{
              '--primary-color': customization.primaryColor
            }}
          >
            <div className="chat-header">
              {customization.logo && (
                <div className="chat-logo">
                  <img src={URL.createObjectURL(customization.logo)} alt="Logo" />
                </div>
              )}
              <div className="chat-title">{customization.chatbotName || 'Assistant'}</div>
              <div className="chat-controls">
                <button type="button" className="minimize-button">
                  <span>_</span>
                </button>
              </div>
            </div>
            
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                    {message.type === 'assistant' && ' • AI'}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
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
        
        <div className="preview-info">
          <div className="info-section">
            <h3>Business Information</h3>
            <ul className="info-list">
              <li><strong>Name:</strong> {businessInfo.name}</li>
              <li><strong>Type:</strong> {BusinessTypeNames[businessInfo.type]}</li>
              <li><strong>Contact:</strong> {businessInfo.contact.email || businessInfo.contact.phone || 'Not provided'}</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h3>Knowledge Base</h3>
            <p>{knowledgeBase.length} items in knowledge base</p>
            <p className="suggestion">Try asking questions like:</p>
            <ul className="suggestion-list">
              {knowledgeBase.slice(0, 3).map((item, index) => (
                <li key={index}>{item.question}</li>
              ))}
              {knowledgeBase.length === 0 && (
                <li>No knowledge base items yet. Go back to add some.</li>
              )}
            </ul>
          </div>
          
          <div className="info-section">
            <h3>Customization</h3>
            <ul className="info-list">
              <li><strong>Assistant Name:</strong> {customization.chatbotName}</li>
              <li><strong>Primary Color:</strong> <span className="color-sample" style={{ backgroundColor: customization.primaryColor }}></span> {customization.primaryColor}</li>
              <li><strong>Logo:</strong> {customization.logo ? 'Custom logo' : 'Default'}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next: Complete Setup
        </button>
      </div>
    </div>
  );
};
