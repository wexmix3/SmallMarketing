/**
 * Message Bubble Component
 * 
 * A sleek, Apple-inspired chat message bubble component.
 */

import React from 'react';
import styled from 'styled-components';
import { colors, typography, borders, shadows, animations } from '../../styles/appleDesignTokens';

// Types of message senders
const SENDER_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// Styled components
const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 8px;
  animation: fadeIn ${animations.durations.medium} ${animations.easings.appleEase};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Bubble = styled.div`
  padding: 12px 16px;
  border-radius: ${borders.radius.lg};
  box-shadow: ${shadows.sm};
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.base};
  line-height: ${typography.lineHeights.relaxed};
  word-break: break-word;
  
  /* User message styling */
  ${props => props.sender === SENDER_TYPES.USER && `
    background-color: ${colors.primary};
    color: ${colors.white};
    align-self: flex-end;
    border-bottom-right-radius: ${borders.radius.sm};
    margin-left: auto;
  `}
  
  /* Assistant message styling */
  ${props => props.sender === SENDER_TYPES.ASSISTANT && `
    background-color: ${props.isDarkMode ? colors.darkGray2 : colors.lightGray1};
    color: ${props.isDarkMode ? colors.white : colors.nearBlack};
    align-self: flex-start;
    border-bottom-left-radius: ${borders.radius.sm};
    margin-right: auto;
  `}
  
  /* System message styling */
  ${props => props.sender === SENDER_TYPES.SYSTEM && `
    background-color: ${props.isDarkMode ? colors.darkGray1 : colors.lightGray2};
    color: ${props.isDarkMode ? colors.midGray1 : colors.darkGray1};
    font-size: ${typography.sizes.sm};
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    max-width: 90%;
  `}
`;

const MessageTime = styled.span`
  font-size: ${typography.sizes.xs};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  margin-top: 4px;
  align-self: ${props => props.sender === SENDER_TYPES.USER ? 'flex-end' : 'flex-start'};
`;

// Typing indicator
const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
`;

const TypingDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${borders.radius.full};
  background-color: ${props => props.isDarkMode ? colors.midGray1 : colors.darkGray1};
  opacity: 0.7;
  
  @keyframes typing {
    0% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-2px); }
    100% { opacity: 0.3; transform: translateY(0); }
  }
  
  &:nth-child(1) {
    animation: typing 1.4s infinite ease-in-out;
  }
  
  &:nth-child(2) {
    animation: typing 1.4s infinite ease-in-out 0.2s;
  }
  
  &:nth-child(3) {
    animation: typing 1.4s infinite ease-in-out 0.4s;
  }
`;

/**
 * Message Bubble Component
 */
const MessageBubble = ({ 
  message, 
  timestamp, 
  sender, 
  isTyping = false, 
  isDarkMode = false 
}) => {
  // Format timestamp
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BubbleContainer>
      <Bubble sender={sender} isDarkMode={isDarkMode}>
        {isTyping ? (
          <TypingIndicator>
            <TypingDot isDarkMode={isDarkMode} />
            <TypingDot isDarkMode={isDarkMode} />
            <TypingDot isDarkMode={isDarkMode} />
          </TypingIndicator>
        ) : (
          message
        )}
      </Bubble>
      
      {timestamp && !isTyping && (
        <MessageTime sender={sender} isDarkMode={isDarkMode}>
          {formatTime(timestamp)}
          {sender === SENDER_TYPES.ASSISTANT && ' • AI'}
        </MessageTime>
      )}
    </BubbleContainer>
  );
};

export default MessageBubble;
export { SENDER_TYPES };
