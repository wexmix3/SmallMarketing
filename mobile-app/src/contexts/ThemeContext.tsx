/**
 * Theme Context
 * 
 * This context provides theme state and methods for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

// Define light theme colors
const lightColors: ThemeColors = {
  primary: '#0070f3',
  secondary: '#6c757d',
  background: '#ffffff',
  card: '#f8f9fa',
  text: '#212529',
  border: '#dee2e6',
  notification: '#ff3860',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8'
};

// Define dark theme colors
const darkColors: ThemeColors = {
  primary: '#0070f3',
  secondary: '#6c757d',
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8f9fa',
  border: '#333333',
  notification: '#ff3860',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8'
};

// Define theme type
type ThemeType = 'light' | 'dark' | 'system';

// Define theme context
interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Determine if dark mode is active
  const isDark = 
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  
  // Get colors based on theme
  const colors = isDark ? darkColors : lightColors;
  
  // Set theme and save to storage
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Context value
  const value = {
    theme,
    colors,
    isDark,
    setTheme
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
