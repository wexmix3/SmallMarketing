/**
 * Language Selector Component
 * 
 * A sleek, Apple-inspired language selector for the chat interface.
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors, typography, borders, animations } from '../../styles/appleDesignTokens';

// Default supported languages
const defaultLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

// Styled components
const SelectorContainer = styled.div`
  position: relative;
  margin-right: 4px;
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: ${borders.radius.md};
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  transition: all ${animations.durations.fast} ${animations.easings.appleEase};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  span {
    margin-left: 4px;
    font-size: ${typography.sizes.sm};
    font-weight: ${typography.fontWeights.medium};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  ${props => props.position === 'top' ? 'bottom: 100%' : 'top: 100%'};
  right: 0;
  width: 160px;
  max-height: 300px;
  overflow-y: auto;
  background-color: ${props => props.isDarkMode ? colors.darkGray2 : colors.white};
  border-radius: ${borders.radius.md};
  box-shadow: ${shadows.lg};
  border: 1px solid ${props => props.isDarkMode ? colors.darkGray1 : colors.lightGray2};
  z-index: 1001;
  margin-top: ${props => props.position === 'top' ? '0' : '8px'};
  margin-bottom: ${props => props.position === 'top' ? '8px' : '0'};
  
  /* Sleek scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: ${borders.radius.full};
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  animation: fadeIn ${animations.durations.fast} ${animations.easings.appleEase};
`;

const LanguageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LanguageItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  font-size: ${typography.sizes.sm};
  display: flex;
  align-items: center;
  color: ${props => props.isDarkMode ? colors.white : colors.nearBlack};
  background-color: ${props => props.isSelected 
    ? (props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') 
    : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  svg {
    margin-right: 8px;
    opacity: ${props => props.isSelected ? 1 : 0};
  }
`;

// SVG Icons
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

/**
 * Language Selector Component
 */
const LanguageSelector = ({ 
  currentLanguage = 'en',
  onLanguageChange,
  supportedLanguages = defaultLanguages,
  position = 'bottom',
  theme = 'system'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  
  // Determine if dark mode should be used
  useEffect(() => {
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'light') {
      setIsDarkMode(false);
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, [theme]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get language name from code
  const getLanguageName = (code) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code.toUpperCase();
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };
  
  // Handle language selection
  const handleSelectLanguage = (code) => {
    onLanguageChange(code);
    setIsOpen(false);
  };
  
  return (
    <SelectorContainer ref={dropdownRef}>
      <LanguageButton 
        onClick={toggleDropdown}
        isDarkMode={isDarkMode}
        aria-label="Select language"
      >
        <GlobeIcon />
        <span>{getLanguageName(currentLanguage)}</span>
      </LanguageButton>
      
      {isOpen && (
        <Dropdown position={position} isDarkMode={isDarkMode}>
          <LanguageList>
            {supportedLanguages.map(language => (
              <LanguageItem
                key={language.code}
                onClick={() => handleSelectLanguage(language.code)}
                isSelected={currentLanguage === language.code}
                isDarkMode={isDarkMode}
              >
                <CheckIcon />
                {language.name}
              </LanguageItem>
            ))}
          </LanguageList>
        </Dropdown>
      )}
    </SelectorContainer>
  );
};

export default LanguageSelector;
