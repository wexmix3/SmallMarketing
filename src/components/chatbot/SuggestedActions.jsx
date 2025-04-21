/**
 * Suggested Actions Component
 * 
 * A sleek, Apple-inspired component for displaying suggested actions in the chat.
 */

import React from 'react';
import styled from 'styled-components';
import { colors, typography, borders, animations } from '../../styles/appleDesignTokens';

// Styled components
const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 12px;
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

const ActionButton = styled.button`
  background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${borders.radius.full};
  padding: 8px 16px;
  font-size: ${typography.sizes.sm};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${animations.durations.fast} ${animations.easings.appleEase};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/**
 * Suggested Actions Component
 */
const SuggestedActions = ({ 
  actions = [], 
  onActionClick,
  isDarkMode = false 
}) => {
  if (!actions || actions.length === 0) {
    return null;
  }
  
  return (
    <ActionsContainer>
      {actions.map((action, index) => (
        <ActionButton
          key={action.id || index}
          onClick={() => onActionClick(action)}
          isDarkMode={isDarkMode}
        >
          {action.label}
        </ActionButton>
      ))}
    </ActionsContainer>
  );
};

export default SuggestedActions;
