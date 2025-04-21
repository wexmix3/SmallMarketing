/**
 * Messages Container Component
 * 
 * A sleek, Apple-inspired container for chat messages.
 */

import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors, borders } from '../../styles/appleDesignTokens';
import MessageBubble, { SENDER_TYPES } from './MessageBubble';
import SuggestedActions from './SuggestedActions';

// Styled components
const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: ${props => props.isDarkMode ? colors.black : colors.lightGray1};
  
  /* Sleek scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: ${borders.radius.full};
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: ${props => props.isDarkMode ? colors.midGray1 : colors.midGray2};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 16px;
`;

/**
 * Messages Container Component
 */
const MessagesContainer = ({ 
  messages = [], 
  suggestedActions = [],
  onActionClick,
  isLoading = false,
  isDarkMode = false,
  emptyStateMessage = "No messages yet. Start a conversation!"
}) => {
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  // Show empty state if no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <Container isDarkMode={isDarkMode}>
        <EmptyStateContainer isDarkMode={isDarkMode}>
          <EmptyStateIcon>💬</EmptyStateIcon>
          <EmptyStateText>{emptyStateMessage}</EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
  }
  
  return (
    <Container isDarkMode={isDarkMode}>
      {/* Render messages */}
      {messages.map((message, index) => (
        <React.Fragment key={message.id || index}>
          <MessageBubble
            message={message.content}
            timestamp={message.timestamp}
            sender={message.sender}
            isDarkMode={isDarkMode}
          />
          
          {/* Show suggested actions after the last assistant message */}
          {message.sender === SENDER_TYPES.ASSISTANT && 
           index === messages.length - 1 && 
           suggestedActions.length > 0 && (
            <SuggestedActions
              actions={suggestedActions}
              onActionClick={onActionClick}
              isDarkMode={isDarkMode}
            />
          )}
        </React.Fragment>
      ))}
      
      {/* Show typing indicator when loading */}
      {isLoading && (
        <MessageBubble
          isTyping={true}
          sender={SENDER_TYPES.ASSISTANT}
          isDarkMode={isDarkMode}
        />
      )}
      
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </Container>
  );
};

export default MessagesContainer;
