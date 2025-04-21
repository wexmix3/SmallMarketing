/**
 * Apple-like Chat Interface
 * 
 * A sleek, high-tech chat interface inspired by Apple's design aesthetic.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, borders, shadows, animations } from '../../styles/appleDesignTokens';

// Import components
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ChatInput from './ChatInput';
import ChatToggleButton from './ChatToggleButton';
import LanguageSelector from './LanguageSelector';

// Styled components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 24px;
  ${props => props.position === 'right' ? 'right' : 'left'}: 24px;
  width: 380px;
  height: ${props => props.isOpen ? '600px' : '0'};
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.xl};
  overflow: hidden;
  box-shadow: ${shadows.xl};
  transition: all ${animations.durations.medium} ${animations.easings.appleEase};
  z-index: 1000;
  background-color: ${props => props.isDarkMode ? colors.black : colors.white};
  border: 1px solid ${props => props.isDarkMode ? colors.darkGray2 : colors.lightGray2};
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  ${props => props.isOpen && `
    animation: slideIn ${animations.durations.medium} ${animations.easings.appleEase};
  `}
`;

/**
 * Apple-like Chat Interface Component
 */
const AppleLikeChatInterface = ({
  messages = [],
  onSendMessage,
  suggestedActions = [],
  onActionClick,
  isLoading = false,
  businessName = 'AI Assistant',
  businessLogo = '',
  theme = 'system',
  position = 'right',
  language = 'en',
  onLanguageChange,
  supportedLanguages = [],
  initialOpen = false,
  unreadCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  // Determine if dark mode should be used
  useEffect(() => {
    const checkDarkMode = () => {
      if (theme === 'dark') {
        setIsDarkMode(true);
      } else if (theme === 'light') {
        setIsDarkMode(false);
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };
    
    checkDarkMode();
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setIsDarkMode(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Handle sending a message
  const handleSendMessage = (message) => {
    onSendMessage(message);
  };
  
  // Handle clicking a suggested action
  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      // Default behavior: send the action label as a message
      onSendMessage(action.label);
    }
  };
  
  return (
    <>
      {/* Chat Toggle Button */}
      <ChatToggleButton 
        onClick={toggleChat}
        position={position}
        isDarkMode={isDarkMode}
        isHidden={isOpen}
        unreadCount={unreadCount}
      />
      
      {/* Chat Interface */}
      <ChatContainer 
        isOpen={isOpen} 
        position={position} 
        isDarkMode={isDarkMode}
      >
        {/* Header */}
        <ChatHeader 
          businessName={businessName}
          businessLogo={businessLogo}
          onClose={toggleChat}
          isDarkMode={isDarkMode}
        >
          {/* Language Selector */}
          {onLanguageChange && (
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
              theme={isDarkMode ? 'dark' : 'light'}
              position="top"
            />
          )}
        </ChatHeader>
        
        {/* Messages */}
        <MessagesContainer 
          messages={messages}
          suggestedActions={suggestedActions}
          onActionClick={handleActionClick}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        />
        
        {/* Input */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        />
      </ChatContainer>
    </>
  );
};

export default AppleLikeChatInterface;
