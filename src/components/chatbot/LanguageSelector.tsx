/**
 * Language Selector Component
 * 
 * This component allows users to select their preferred language for the chatbot.
 */

import React, { useState, useEffect } from 'react';
import { supportedLanguages } from '@/services/languageService';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  position?: 'top' | 'bottom';
  theme?: 'light' | 'dark';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  position = 'top',
  theme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  
  // Update selected language when currentLanguage prop changes
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);
  
  // Get language name from code
  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code.toUpperCase();
  };
  
  // Handle language selection
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange(languageCode);
    setIsOpen(false);
  };
  
  // Get background and text colors based on theme
  const backgroundColor = theme === 'dark' ? '#333' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#ddd';
  const hoverColor = theme === 'dark' ? '#444' : '#f5f5f5';
  
  return (
    <div
      style={{
        position: 'relative',
        padding: '8px 12px',
        borderBottom: position === 'top' ? `1px solid ${borderColor}` : 'none',
        borderTop: position === 'bottom' ? `1px solid ${borderColor}` : 'none',
        backgroundColor,
        zIndex: 10
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: textColor,
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          <span style={{ marginRight: '4px' }}>🌐</span>
          <span>{getLanguageName(selectedLanguage)}</span>
          <span style={{ marginLeft: '4px' }}>▼</span>
        </button>
      </div>
      
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            [position === 'top' ? 'top' : 'bottom']: '100%',
            width: '160px',
            backgroundColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 20
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            {supportedLanguages.map(language => (
              <li
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: selectedLanguage === language.code ? hoverColor : 'transparent',
                  color: textColor,
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 
                    selectedLanguage === language.code ? hoverColor : 'transparent';
                }}
              >
                {selectedLanguage === language.code && (
                  <span style={{ marginRight: '8px' }}>✓</span>
                )}
                {language.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
