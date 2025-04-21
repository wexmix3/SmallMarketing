/**
 * Chat Toggle Button Component
 * 
 * A sleek, Apple-inspired button to open/close the chat interface.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, borders, shadows, animations } from '../../styles/appleDesignTokens';

// Animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: ${shadows.md};
  }
  50% {
    transform: scale(1.05);
    box-shadow: ${shadows.lg};
  }
  100% {
    transform: scale(1);
    box-shadow: ${shadows.md};
  }
`;

// Styled components
const Button = styled.button`
  position: fixed;
  bottom: 24px;
  ${props => props.position === 'right' ? 'right: 24px' : 'left: 24px'};
  width: 60px;
  height: 60px;
  border-radius: ${borders.radius.full};
  background-color: ${props => props.isDarkMode ? colors.primaryDark : colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${shadows.md};
  transition: all ${animations.durations.medium} ${animations.easings.appleEase};
  z-index: 999;
  opacity: ${props => props.isHidden ? 0 : 1};
  transform: ${props => props.isHidden ? 'scale(0.8)' : 'scale(1)'};
  pointer-events: ${props => props.isHidden ? 'none' : 'all'};
  
  &:hover {
    transform: ${props => props.isHidden ? 'scale(0.8)' : 'scale(1.05)'};
    background-color: ${props => props.isDarkMode ? '#3aa3ff' : '#0077ed'};
  }
  
  &:active {
    transform: ${props => props.isHidden ? 'scale(0.8)' : 'scale(1)'};
  }
  
  svg {
    width: 28px;
    height: 28px;
    fill: currentColor;
  }
  
  /* Pulse animation when unread messages */
  animation: ${props => props.hasUnreadMessages ? `${pulse} 2s infinite` : 'none'};
`;

// Badge for unread count
const UnreadBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${colors.error};
  color: white;
  border-radius: ${borders.radius.full};
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid ${props => props.isDarkMode ? colors.black : colors.white};
`;

// SVG Icons
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
  </svg>
);

/**
 * Chat Toggle Button Component
 */
const ChatToggleButton = ({ 
  onClick, 
  position = 'right', 
  isDarkMode = false,
  isHidden = false,
  unreadCount = 0
}) => {
  const hasUnreadMessages = unreadCount > 0;
  
  return (
    <Button 
      onClick={onClick} 
      position={position} 
      isDarkMode={isDarkMode}
      isHidden={isHidden}
      hasUnreadMessages={hasUnreadMessages}
      aria-label="Open chat"
    >
      <ChatIcon />
      {hasUnreadMessages && (
        <UnreadBadge isDarkMode={isDarkMode}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </UnreadBadge>
      )}
    </Button>
  );
};

export default ChatToggleButton;
