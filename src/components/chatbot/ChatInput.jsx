/**
 * Chat Input Component
 * 
 * A sleek, Apple-inspired input component for the chat interface.
 */

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors, typography, borders, animations } from '../../styles/appleDesignTokens';

// Styled components
const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  background-color: ${props => props.isDarkMode ? colors.nearBlack : colors.white};
  border-top: 1px solid ${props => props.isDarkMode ? colors.darkGray2 : colors.lightGray2};
`;

const TextArea = styled.textarea`
  flex: 1;
  border: 1px solid ${props => props.isDarkMode ? colors.darkGray1 : colors.lightGray2};
  border-radius: ${borders.radius.lg};
  padding: 12px 16px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.base};
  line-height: ${typography.lineHeights.base};
  background-color: ${props => props.isDarkMode ? colors.darkGray2 : colors.lightGray1};
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  resize: none;
  transition: all ${animations.durations.fast} ${animations.easings.appleEase};
  min-height: 24px;
  max-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.isDarkMode ? colors.primaryDark : colors.primary};
    box-shadow: 0 0 0 2px ${props => props.isDarkMode ? 'rgba(41, 151, 255, 0.3)' : 'rgba(0, 113, 227, 0.3)'};
  }
  
  &::placeholder {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.5)' : colors.midGray2};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${borders.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  background-color: ${props => props.disabled 
    ? (props.isDarkMode ? 'rgba(41, 151, 255, 0.5)' : 'rgba(0, 113, 227, 0.5)') 
    : (props.isDarkMode ? colors.primaryDark : colors.primary)};
  color: white;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${animations.durations.fast} ${animations.easings.appleEase};
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background-color: ${props => props.isDarkMode ? '#3aa3ff' : '#0077ed'};
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

// SVG Icon
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

/**
 * Chat Input Component
 */
const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  isDarkMode = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);
  
  // Handle input change
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  
  // Handle send message
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <InputContainer isDarkMode={isDarkMode}>
      <TextArea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        rows={1}
        isDarkMode={isDarkMode}
        disabled={isLoading}
      />
      <SendButton 
        onClick={handleSend} 
        disabled={!message.trim() || isLoading}
        isDarkMode={isDarkMode}
        aria-label="Send message"
      >
        <SendIcon />
      </SendButton>
    </InputContainer>
  );
};

export default ChatInput;
