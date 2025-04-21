/**
 * Design System
 * 
 * This file defines the design system for the AI Customer Service Assistant,
 * inspired by Apple's sleek and minimalist design aesthetic.
 */

// Color palette
export const colors = {
  // Primary colors
  primary: {
    light: '#0071e3', // Apple blue
    dark: '#2997ff',  // Apple blue for dark mode
  },
  
  // Neutrals
  neutral: {
    100: '#ffffff', // Pure white
    200: '#f5f5f7', // Light gray (background)
    300: '#e8e8ed', // Light gray (borders)
    400: '#d2d2d7', // Mid gray (disabled)
    500: '#86868b', // Gray (secondary text)
    600: '#6e6e73', // Dark gray (tertiary text)
    700: '#424245', // Darker gray
    800: '#1d1d1f', // Almost black (primary text)
    900: '#000000', // Pure black
  },
  
  // Semantic colors
  success: {
    light: '#34c759', // Green
    dark: '#30d158',  // Green for dark mode
  },
  warning: {
    light: '#ff9500', // Orange
    dark: '#ff9f0a',  // Orange for dark mode
  },
  error: {
    light: '#ff3b30', // Red
    dark: '#ff453a',  // Red for dark mode
  },
  info: {
    light: '#5ac8fa', // Blue
    dark: '#64d2ff',  // Blue for dark mode
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0071e3 0%, #42a1ec 100%)',
    dark: 'linear-gradient(135deg, #2997ff 0%, #64d2ff 100%)',
  },
};

// Typography
export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif',
    monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  56: '14rem',   // 224px
  64: '16rem',   // 256px
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(0, 113, 227, 0.5)',
  none: 'none',
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',  // Fully rounded
};

// Z-index
export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 'auto',
};

// Transitions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  timing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    // Apple-specific easing
    appleEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
};

// Breakpoints
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media queries
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  hover: '@media (hover: hover)',
  motion: '@media (prefers-reduced-motion: no-preference)',
};

// Component-specific styles
export const components = {
  // Button variants
  button: {
    primary: {
      backgroundColor: colors.primary.light,
      color: colors.neutral[100],
      hoverBackgroundColor: '#0077ed',
      activeBackgroundColor: '#006edb',
    },
    secondary: {
      backgroundColor: colors.neutral[200],
      color: colors.neutral[800],
      hoverBackgroundColor: colors.neutral[300],
      activeBackgroundColor: colors.neutral[400],
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.primary.light,
      hoverBackgroundColor: 'rgba(0, 113, 227, 0.1)',
      activeBackgroundColor: 'rgba(0, 113, 227, 0.2)',
    },
  },
  
  // Input styles
  input: {
    backgroundColor: colors.neutral[200],
    borderColor: colors.neutral[300],
    focusBorderColor: colors.primary.light,
    placeholderColor: colors.neutral[500],
    textColor: colors.neutral[800],
    errorColor: colors.error.light,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[300],
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Chat bubble styles
  chatBubble: {
    user: {
      backgroundColor: colors.primary.light,
      color: colors.neutral[100],
    },
    assistant: {
      backgroundColor: colors.neutral[200],
      color: colors.neutral[800],
    },
    system: {
      backgroundColor: colors.neutral[300],
      color: colors.neutral[800],
    },
  },
};

// Dark mode overrides
export const darkMode = {
  colors: {
    primary: colors.primary.dark,
    background: colors.neutral[800],
    text: colors.neutral[100],
    border: colors.neutral[700],
  },
  components: {
    button: {
      primary: {
        backgroundColor: colors.primary.dark,
        hoverBackgroundColor: '#3aa3ff',
        activeBackgroundColor: '#4baeff',
      },
      secondary: {
        backgroundColor: colors.neutral[700],
        color: colors.neutral[100],
        hoverBackgroundColor: colors.neutral[600],
        activeBackgroundColor: colors.neutral[500],
      },
    },
    input: {
      backgroundColor: colors.neutral[700],
      borderColor: colors.neutral[600],
      focusBorderColor: colors.primary.dark,
      placeholderColor: colors.neutral[500],
      textColor: colors.neutral[100],
    },
    card: {
      backgroundColor: colors.neutral[800],
      borderColor: colors.neutral[700],
    },
    chatBubble: {
      user: {
        backgroundColor: colors.primary.dark,
      },
      assistant: {
        backgroundColor: colors.neutral[700],
        color: colors.neutral[100],
      },
      system: {
        backgroundColor: colors.neutral[600],
        color: colors.neutral[100],
      },
    },
  },
};

// Export the complete design system
export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  zIndex,
  transitions,
  breakpoints,
  mediaQueries,
  components,
  darkMode,
};

export default designSystem;
