/**
 * Modern Chat Interface
 * 
 * A sleek, Apple-inspired chat interface for the AI Customer Service Assistant.
 */

import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { designSystem as ds } from '../../styles/designSystem';
import LanguageSelector from './LanguageSelector';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isTyping?: boolean;
}

interface SuggestedAction {
  id: string;
  label: string;
  action: () => void;
}

interface ModernChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  suggestedActions?: SuggestedAction[];
  isLoading?: boolean;
  businessName?: string;
  businessLogo?: string;
  theme?: 'light' | 'dark' | 'system';
  position?: 'left' | 'right';
  language?: string;
  onLanguageChange?: (language: string) => void;
  supportedLanguages?: Array<{ code: string; name: string }>;
  isOpen?: boolean;
  onToggleChat?: () => void;
  minimized?: boolean;
}

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

// Styled Components
const ChatContainer = styled.div<{ isOpen: boolean; position: 'left' | 'right'; isDarkMode: boolean }>`
  position: fixed;
  bottom: ${ds.spacing[6]};
  ${props => props.position === 'right' ? 'right' : 'left'}: ${ds.spacing[6]};
  width: 380px;
  height: ${props => props.isOpen ? '600px' : '0'};
  display: flex;
  flex-direction: column;
  border-radius: ${ds.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${ds.shadows['2xl']};
  transition: all ${ds.transitions.duration[300]} ${ds.transitions.timing.appleEase};
  z-index: ${ds.zIndex[50]};
  background-color: ${props => props.isDarkMode ? ds.darkMode.colors.background : ds.colors.neutral[100]};
  border: 1px solid ${props => props.isDarkMode ? ds.darkMode.colors.border : ds.colors.neutral[300]};
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  
  ${props => props.isOpen && css`
    animation: ${slideIn} ${ds.transitions.duration[500]} ${ds.transitions.timing.appleEase};
  `}
`;

const ChatHeader = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${ds.spacing[4]} ${ds.spacing[5]};
  background: ${props => props.isDarkMode ? 
    'linear-gradient(135deg, #1d1d1f 0%, #2d2d30 100%)' : 
    'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)'};
  border-bottom: 1px solid ${props => props.isDarkMode ? ds.darkMode.colors.border : ds.colors.neutral[300]};
`;

const BusinessInfo = styled.div`
  display: flex;
  align-items: center;
`;

const BusinessLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${ds.borderRadius.full};
  object-fit: cover;
  margin-right: ${ds.spacing[3]};
`;

const BusinessName = styled.h3<{ isDarkMode: boolean }>`
  font-family: ${ds.typography.fontFamily.base};
  font-weight: ${ds.typography.fontWeight.semibold};
  font-size: ${ds.typography.fontSize.lg};
  color: ${props => props.isDarkMode ? ds.colors.neutral[100] : ds.colors.neutral[800]};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const CloseButton = styled.button<{ isDarkMode: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${ds.borderRadius.full};
  color: ${props => props.isDarkMode ? ds.colors.neutral[400] : ds.colors.neutral[600]};
  transition: all ${ds.transitions.duration[150]} ${ds.transitions.timing.appleEase};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.isDarkMode ? ds.colors.neutral[200] : ds.colors.neutral[800]};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const MessagesContainer = styled.div<{ isDarkMode: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${ds.spacing[4]};
  background-color: ${props => props.isDarkMode ? ds.colors.neutral[900] : ds.colors.neutral[200]};
  
  /* Sleek scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: ${ds.borderRadius.full};
  }
`;

const MessageGroup = styled.div`
  margin-bottom: ${ds.spacing[4]};
  animation: ${fadeIn} ${ds.transitions.duration[300]} ${ds.transitions.timing.appleEase};
`;

const MessageBubble = styled.div<{ sender: 'user' | 'assistant' | 'system'; isDarkMode: boolean }>`
  max-width: 80%;
  padding: ${ds.spacing[3]} ${ds.spacing[4]};
  border-radius: ${ds.borderRadius.xl};
  margin-bottom: ${ds.spacing[2]};
  box-shadow: ${ds.shadows.sm};
  word-break: break-word;
  line-height: ${ds.typography.lineHeight.relaxed};
  
  ${props => props.sender === 'user' && css`
    background-color: ${props.isDarkMode ? ds.darkMode.components.chatBubble.user.backgroundColor : ds.components.chatBubble.user.backgroundColor};
    color: ${ds.colors.neutral[100]};
    margin-left: auto;
    border-bottom-right-radius: ${ds.borderRadius.sm};
  `}
  
  ${props => props.sender === 'assistant' && css`
    background-color: ${props.isDarkMode ? ds.darkMode.components.chatBubble.assistant.backgroundColor : ds.components.chatBubble.assistant.backgroundColor};
    color: ${props.isDarkMode ? ds.darkMode.components.chatBubble.assistant.color : ds.components.chatBubble.assistant.color};
    margin-right: auto;
    border-bottom-left-radius: ${ds.borderRadius.sm};
  `}
  
  ${props => props.sender === 'system' && css`
    background-color: ${props.isDarkMode ? ds.darkMode.components.chatBubble.system.backgroundColor : ds.components.chatBubble.system.backgroundColor};
    color: ${props.isDarkMode ? ds.darkMode.components.chatBubble.system.color : ds.components.chatBubble.system.color};
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    border-radius: ${ds.borderRadius.lg};
    font-size: ${ds.typography.fontSize.sm};
    opacity: 0.8;
  `}
`;

const MessageText = styled.p`
  margin: 0;
  font-family: ${ds.typography.fontFamily.base};
  font-size: ${ds.typography.fontSize.base};
`;

const MessageTime = styled.span<{ isDarkMode: boolean }>`
  font-size: ${ds.typography.fontSize.xs};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  margin-top: ${ds.spacing[1]};
  display: block;
  text-align: right;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${ds.spacing[1]};
  padding: ${ds.spacing[2]};
`;

const TypingDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: ${ds.borderRadius.full};
  background-color: ${ds.colors.neutral[500]};
  animation: ${typing} 1.4s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const SuggestedActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${ds.spacing[2]};
  margin-top: ${ds.spacing[3]};
  margin-bottom: ${ds.spacing[2]};
`;

const SuggestedActionButton = styled.button<{ isDarkMode: boolean }>`
  background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.isDarkMode ? ds.colors.neutral[200] : ds.colors.neutral[800]};
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${ds.borderRadius.full};
  padding: ${ds.spacing[2]} ${ds.spacing[3]};
  font-size: ${ds.typography.fontSize.sm};
  font-family: ${ds.typography.fontFamily.base};
  cursor: pointer;
  transition: all ${ds.transitions.duration[150]} ${ds.transitions.timing.appleEase};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const InputContainer = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: flex-end;
  padding: ${ds.spacing[3]} ${ds.spacing[4]};
  background-color: ${props => props.isDarkMode ? ds.colors.neutral[800] : ds.colors.neutral[100]};
  border-top: 1px solid ${props => props.isDarkMode ? ds.darkMode.colors.border : ds.colors.neutral[300]};
`;

const TextInput = styled.textarea<{ isDarkMode: boolean }>`
  flex: 1;
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : ds.colors.neutral[300]};
  border-radius: ${ds.borderRadius.xl};
  padding: ${ds.spacing[3]} ${ds.spacing[4]};
  font-family: ${ds.typography.fontFamily.base};
  font-size: ${ds.typography.fontSize.base};
  resize: none;
  background-color: ${props => props.isDarkMode ? ds.colors.neutral[700] : ds.colors.neutral[200]};
  color: ${props => props.isDarkMode ? ds.colors.neutral[100] : ds.colors.neutral[800]};
  transition: all ${ds.transitions.duration[200]} ${ds.transitions.timing.appleEase};
  min-height: 24px;
  max-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.isDarkMode ? ds.darkMode.components.input.focusBorderColor : ds.components.input.focusBorderColor};
    box-shadow: 0 0 0 2px ${props => props.isDarkMode ? 'rgba(41, 151, 255, 0.3)' : 'rgba(0, 113, 227, 0.3)'};
  }
  
  &::placeholder {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.5)' : ds.components.input.placeholderColor};
  }
`;

const SendButton = styled.button<{ isDarkMode: boolean; isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${ds.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${ds.spacing[2]};
  background-color: ${props => props.isDisabled 
    ? (props.isDarkMode ? 'rgba(41, 151, 255, 0.5)' : 'rgba(0, 113, 227, 0.5)') 
    : (props.isDarkMode ? ds.darkMode.components.button.primary.backgroundColor : ds.components.button.primary.backgroundColor)};
  color: white;
  border: none;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all ${ds.transitions.duration[200]} ${ds.transitions.timing.appleEase};
  opacity: ${props => props.isDisabled ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.isDarkMode 
      ? ds.darkMode.components.button.primary.hoverBackgroundColor 
      : ds.components.button.primary.hoverBackgroundColor};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const ChatButton = styled.button<{ position: 'left' | 'right'; isDarkMode: boolean; isOpen: boolean }>`
  position: fixed;
  bottom: ${ds.spacing[6]};
  ${props => props.position === 'right' ? 'right' : 'left'}: ${ds.spacing[6]};
  width: 60px;
  height: 60px;
  border-radius: ${ds.borderRadius.full};
  background-color: ${props => props.isDarkMode 
    ? ds.darkMode.components.button.primary.backgroundColor 
    : ds.components.button.primary.backgroundColor};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${ds.shadows.lg};
  transition: all ${ds.transitions.duration[300]} ${ds.transitions.timing.appleEase};
  z-index: ${ds.zIndex[40]};
  opacity: ${props => props.isOpen ? 0 : 1};
  transform: ${props => props.isOpen ? 'scale(0.8)' : 'scale(1)'};
  pointer-events: ${props => props.isOpen ? 'none' : 'all'};
  
  &:hover {
    transform: ${props => props.isOpen ? 'scale(0.8)' : 'scale(1.05)'};
    background-color: ${props => props.isDarkMode 
      ? ds.darkMode.components.button.primary.hoverBackgroundColor 
      : ds.components.button.primary.hoverBackgroundColor};
  }
  
  &:active {
    transform: ${props => props.isOpen ? 'scale(0.8)' : 'scale(1)'};
  }
  
  svg {
    width: 28px;
    height: 28px;
    fill: currentColor;
  }
  
  animation: ${pulse} 2s infinite;
`;

// SVG Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// Main Component
const ModernChatInterface: React.FC<ModernChatInterfaceProps> = ({
  messages,
  onSendMessage,
  suggestedActions = [],
  isLoading = false,
  businessName = 'AI Assistant',
  businessLogo = '',
  theme = 'system',
  position = 'right',
  language = 'en',
  onLanguageChange,
  supportedLanguages = [],
  isOpen = false,
  onToggleChat,
  minimized = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Determine if dark mode should be used
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };
  
  // Handle send message
  const handleSendMessage = () => {
    const trimmedMessage = inputValue.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setInputValue('');
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat Button */}
      <ChatButton 
        position={position} 
        isDarkMode={isDarkMode} 
        isOpen={isOpen}
        onClick={onToggleChat}
        aria-label="Open chat"
      >
        <ChatIcon />
      </ChatButton>
      
      {/* Chat Interface */}
      <ChatContainer isOpen={isOpen} position={position} isDarkMode={isDarkMode}>
        {/* Header */}
        <ChatHeader isDarkMode={isDarkMode}>
          <BusinessInfo>
            {businessLogo && <BusinessLogo src={businessLogo} alt={businessName} />}
            <BusinessName isDarkMode={isDarkMode}>{businessName}</BusinessName>
          </BusinessInfo>
          <HeaderActions>
            {onLanguageChange && (
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
                theme={isDarkMode ? 'dark' : 'light'}
                position="top"
              />
            )}
            <CloseButton isDarkMode={isDarkMode} onClick={onToggleChat} aria-label="Close chat">
              <CloseIcon />
            </CloseButton>
          </HeaderActions>
        </ChatHeader>
        
        {/* Messages */}
        <MessagesContainer isDarkMode={isDarkMode}>
          {messages.map((message, index) => (
            <MessageGroup key={message.id || index}>
              <MessageBubble sender={message.sender} isDarkMode={isDarkMode}>
                <MessageText>{message.content}</MessageText>
                <MessageTime isDarkMode={isDarkMode}>
                  {formatTime(message.timestamp)}
                  {message.sender === 'assistant' && ' • AI'}
                </MessageTime>
              </MessageBubble>
              
              {/* Show suggested actions after assistant messages */}
              {message.sender === 'assistant' && index === messages.length - 1 && suggestedActions.length > 0 && (
                <SuggestedActionsContainer>
                  {suggestedActions.map(action => (
                    <SuggestedActionButton 
                      key={action.id} 
                      onClick={action.action}
                      isDarkMode={isDarkMode}
                    >
                      {action.label}
                    </SuggestedActionButton>
                  ))}
                </SuggestedActionsContainer>
              )}
            </MessageGroup>
          ))}
          
          {/* Typing indicator */}
          {isLoading && (
            <MessageBubble sender="assistant" isDarkMode={isDarkMode}>
              <TypingIndicator>
                <TypingDot />
                <TypingDot />
                <TypingDot />
              </TypingIndicator>
            </MessageBubble>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        {/* Input */}
        <InputContainer isDarkMode={isDarkMode}>
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            isDarkMode={isDarkMode}
            disabled={isLoading}
          />
          <SendButton 
            onClick={handleSendMessage} 
            isDarkMode={isDarkMode}
            isDisabled={!inputValue.trim() || isLoading}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <SendIcon />
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default ModernChatInterface;
