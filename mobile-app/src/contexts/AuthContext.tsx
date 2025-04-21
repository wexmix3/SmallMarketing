/**
 * Auth Context
 * 
 * This context provides authentication state and methods for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';

import { api } from '../api/api';

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name: string;
  businessId: string;
  role: string;
}

// Define the shape of the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from secure storage
        const credentials = await Keychain.getGenericPassword();
        
        if (credentials) {
          const { password: token } = credentials;
          
          // Validate token
          const decoded = jwtDecode<User & { exp: number }>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            // Token is valid
            setUser({
              id: decoded.id,
              email: decoded.email,
              name: decoded.name,
              businessId: decoded.businessId,
              role: decoded.role
            });
            
            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setIsAuthenticated(true);
          } else {
            // Token is expired
            await Keychain.resetGenericPassword();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Call login API
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Store token securely
      await Keychain.setGenericPassword('auth_token', token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user data
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store FCM token if available
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      if (fcmToken) {
        await api.post('/users/fcm-token', { token: fcmToken });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove FCM token from server
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      if (fcmToken) {
        await api.delete('/users/fcm-token');
      }
      
      // Clear token from secure storage
      await Keychain.resetGenericPassword();
      
      // Clear token from API headers
      delete api.defaults.headers.common['Authorization'];
      
      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Call register API
      const response = await api.post('/auth/register', { email, password, name });
      const { token, user: userData } = response.data;
      
      // Store token securely
      await Keychain.setGenericPassword('auth_token', token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user data
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
