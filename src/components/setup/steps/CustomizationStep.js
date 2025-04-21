/**
 * Customization Step Component
 * Third step of the setup wizard for customizing the chatbot appearance
 */

import React, { useState, useRef } from 'react';

/**
 * Customization Step Component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.initialData - Initial customization data
 * @returns {JSX.Element} - Customization step component
 */
export const CustomizationStep = ({ onSubmit, initialData }) => {
  // State for customization options
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#0071e3');
  const [chatbotName, setChatbotName] = useState(initialData?.chatbotName || 'Assistant');
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialData?.welcomeMessage || 'Hello! How can I help you today?'
  );
  const [logo, setLogo] = useState(initialData?.logo || null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo ? URL.createObjectURL(initialData.logo) : null);
  
  // Reference to file input
  const fileInputRef = useRef(null);
  
  /**
   * Handle logo file selection
   * @param {Event} e - File input change event
   */
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  /**
   * Remove logo
   */
  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create customization object
    const customization = {
      primaryColor,
      chatbotName,
      welcomeMessage,
      logo
    };
    
    // Submit customization
    onSubmit(customization);
  };
  
  return (
    <div className="customization-step">
      <h2>Customize Your AI Assistant</h2>
      <p className="step-description">
        Personalize your AI assistant to match your brand and provide a seamless experience for your customers.
      </p>
      
      <div className="customization-content">
        <div className="customization-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Appearance</h3>
              
              <div className="form-group">
                <label htmlFor="primaryColor">Primary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="form-control"
                  />
                  <span className="color-value">{primaryColor}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="logo">Logo</label>
                <div className="logo-upload">
                  <input
                    type="file"
                    id="logo"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="form-control"
                  />
                  
                  {logoPreview && (
                    <div className="logo-preview">
                      <img src={logoPreview} alt="Logo preview" />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={handleRemoveLogo}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <small className="form-text text-muted">
                  Recommended size: 200x200 pixels. PNG or SVG with transparent background works best.
                </small>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Messaging</h3>
              
              <div className="form-group">
                <label htmlFor="chatbotName">Assistant Name</label>
                <input
                  type="text"
                  id="chatbotName"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  placeholder="Enter a name for your AI assistant"
                  maxLength={20}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="welcomeMessage">Welcome Message</label>
                <textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                  placeholder="Enter the first message your assistant will send to customers"
                  maxLength={200}
                  className="form-control"
                />
                <small className="form-text text-muted">
                  {welcomeMessage.length}/200 characters
                </small>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => onSubmit(initialData)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Next: Integration
              </button>
            </div>
          </form>
        </div>
        
        <div className="customization-preview">
          <h3>Live Preview</h3>
          
          <div 
            className="chat-preview"
            style={{
              '--primary-color': primaryColor
            }}
          >
            <div className="chat-header">
              {logoPreview && (
                <div className="chat-logo">
                  <img src={logoPreview} alt="Logo" />
                </div>
              )}
              <div className="chat-title">{chatbotName}</div>
            </div>
            
            <div className="chat-messages">
              <div className="message assistant">
                <div className="message-content">
                  {welcomeMessage}
                </div>
                <div className="message-time">Just now</div>
              </div>
              
              <div className="message user">
                <div className="message-content">
                  Hello, I have a question about your services.
                </div>
                <div className="message-time">Just now</div>
              </div>
              
              <div className="message assistant">
                <div className="message-content">
                  I'd be happy to help! What would you like to know about our services?
                </div>
                <div className="message-time">Just now</div>
              </div>
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                disabled
              />
              <button disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="preview-note">
            This is a preview of how your AI assistant will appear to your customers.
            Changes you make to the customization options will be reflected here in real-time.
          </div>
        </div>
      </div>
    </div>
  );
};
