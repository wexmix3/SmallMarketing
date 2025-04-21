/**
 * Apple-inspired Design Tokens
 * 
 * A streamlined set of design tokens for creating a sleek, high-tech UI
 * similar to Apple's design aesthetic.
 */

// Color palette
export const colors = {
  // Primary colors
  primary: '#0071e3', // Apple blue
  primaryDark: '#2997ff', // Apple blue for dark mode
  
  // Neutrals
  white: '#ffffff',
  lightGray1: '#f5f5f7', // Light background
  lightGray2: '#e8e8ed', // Light borders
  midGray1: '#d2d2d7', // Disabled state
  midGray2: '#86868b', // Secondary text
  darkGray1: '#6e6e73', // Tertiary text
  darkGray2: '#424245', // Dark UI elements
  nearBlack: '#1d1d1f', // Primary text
  black: '#000000',
  
  // Semantic colors
  success: '#34c759', // Green
  warning: '#ff9500', // Orange
  error: '#ff3b30', // Red
  info: '#5ac8fa', // Light blue
  
  // Gradients
  gradientLight: 'linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)',
  gradientDark: 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
};

// Typography
export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  lineHeights: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.625,
  },
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

// Borders & Shadows
export const borders = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.05), 0 10px 10px rgba(0, 0, 0, 0.05)',
};

// Animations
export const animations = {
  durations: {
    fast: '150ms',
    medium: '300ms',
    slow: '500ms',
  },
  easings: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple-specific easing
    appleEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
};

// Dark mode overrides
export const darkMode = {
  background: colors.black,
  surface: colors.darkGray2,
  text: colors.white,
  textSecondary: colors.midGray1,
  border: colors.darkGray1,
  primary: colors.primaryDark,
};

// Export all tokens
export default {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  animations,
  darkMode,
};
