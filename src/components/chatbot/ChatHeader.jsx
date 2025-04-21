/**
 * Chat Header Component
 * 
 * A sleek, Apple-inspired header for the chat interface.
 */

import React from 'react';
import styled from 'styled-components';
import { colors, typography, borders, animations } from '../../styles/appleDesignTokens';

// Styled components
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(135deg, #1d1d1f 0%, #2d2d30 100%)' 
    : 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)'};
  border-bottom: 1px solid ${props => props.isDarkMode ? colors.darkGray2 : colors.lightGray2};
  border-top-left-radius: ${borders.radius.lg};
  border-top-right-radius: ${borders.radius.lg};
`;

const BusinessInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${borders.radius.full};
  object-fit: cover;
  margin-right: 12px;
`;

const BusinessName = styled.h3`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.semibold};
  font-size: ${typography.sizes.lg};
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borders.radius.full};
  color: ${props => props.isDarkMode ? colors.midGray1 : colors.darkGray1};
  transition: all ${animations.durations.fast} ${animations.easings.appleEase};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// SVG Icons
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const MinimizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

/**
 * Chat Header Component
 */
const ChatHeader = ({ 
  businessName = 'AI Assistant', 
  businessLogo = '', 
  onClose, 
  onMinimize,
  isDarkMode = false,
  children
}) => {
  return (
    <HeaderContainer isDarkMode={isDarkMode}>
      <BusinessInfo>
        {businessLogo && <Logo src={businessLogo} alt={businessName} />}
        <BusinessName isDarkMode={isDarkMode}>{businessName}</BusinessName>
      </BusinessInfo>
      
      <HeaderActions>
        {children}
        
        {onMinimize && (
          <IconButton 
            onClick={onMinimize} 
            isDarkMode={isDarkMode}
            aria-label="Minimize chat"
          >
            <MinimizeIcon />
          </IconButton>
        )}
        
        {onClose && (
          <IconButton 
            onClick={onClose} 
            isDarkMode={isDarkMode}
            aria-label="Close chat"
          >
            <CloseIcon />
          </IconButton>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};

export default ChatHeader;
