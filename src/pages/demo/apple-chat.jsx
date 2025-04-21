/**
 * Apple-like Chat Interface Demo Page
 * 
 * This page demonstrates the sleek, high-tech chat interface inspired by Apple's design.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AppleLikeChatInterface from '../../components/chatbot/AppleLikeChatInterface';
import { colors, typography } from '../../styles/appleDesignTokens';

// Styled components for the demo page
const DemoContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(135deg, #1d1d1f 0%, #000000 100%)' 
    : 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  font-family: ${typography.fontFamily};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: ${typography.sizes['4xl']};
  font-weight: ${typography.fontWeights.semibold};
  margin-bottom: 16px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(90deg, #2997ff 0%, #5ac8fa 100%)' 
    : 'linear-gradient(90deg, #0071e3 0%, #42a1ec 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${typography.sizes.xl};
  color: ${props => props.isDarkMode ? colors.midGray1 : colors.darkGray1};
  max-width: 600px;
  margin: 0 auto;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 24px;
  right: 24px;
  background: ${props => props.isDarkMode ? colors.darkGray2 : colors.white};
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  border: 1px solid ${props => props.isDarkMode ? colors.darkGray1 : colors.lightGray2};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: ${typography.sizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${props => props.isDarkMode ? colors.darkGray1 : colors.lightGray1};
  }
`;

// Sample data for the demo
const sampleMessages = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 60000 * 5)
  }
];

const sampleSuggestedActions = [
  { id: '1', label: 'Tell me about your products' },
  { id: '2', label: 'I need technical support' },
  { id: '3', label: 'What are your business hours?' }
];

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
];

/**
 * Apple-like Chat Interface Demo Page
 */
const AppleChatDemo = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };
  
  // Handle sending a message
  const handleSendMessage = (message) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(message),
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Add system message about language change
    const systemMessage = {
      id: `system-${Date.now()}`,
      content: `Language changed to ${supportedLanguages.find(lang => lang.code === newLanguage)?.name || newLanguage}`,
      sender: 'system',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };
  
  // Simple AI response generator for demo
  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    }
    
    if (lowerMessage.includes('product')) {
      return 'We offer a range of innovative products designed to simplify your life. Our flagship product is the AI Customer Service Assistant, which provides 24/7 support for your customers.';
    }
    
    if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return 'I\'d be happy to help with any technical issues. Could you please describe the problem you\'re experiencing in detail?';
    }
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('open')) {
      return 'Our business hours are Monday to Friday, 9 AM to 6 PM Eastern Time. We\'re closed on weekends and major holidays.';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'We offer flexible pricing plans starting at $29/month for small businesses. Would you like me to provide more details about our pricing tiers?';
    }
    
    return 'Thank you for your message. Is there anything specific you\'d like to know about our services or products?';
  };
  
  return (
    <DemoContainer isDarkMode={isDarkMode}>
      <ThemeToggle onClick={toggleTheme} isDarkMode={isDarkMode}>
        {theme === 'system' ? '🖥️ System' : theme === 'light' ? '☀️ Light' : '🌙 Dark'}
      </ThemeToggle>
      
      <Header>
        <Title isDarkMode={isDarkMode}>AI Customer Service Assistant</Title>
        <Subtitle isDarkMode={isDarkMode}>
          A sleek, high-tech chat interface inspired by Apple's design aesthetic
        </Subtitle>
      </Header>
      
      <AppleLikeChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        suggestedActions={sampleSuggestedActions}
        onActionClick={(action) => handleSendMessage(action.label)}
        isLoading={isLoading}
        businessName="AI Assistant"
        businessLogo="/apple-logo.png"
        theme={theme}
        position="right"
        language={language}
        onLanguageChange={handleLanguageChange}
        supportedLanguages={supportedLanguages}
        initialOpen={true}
      />
    </DemoContainer>
  );
};

export default AppleChatDemo;
