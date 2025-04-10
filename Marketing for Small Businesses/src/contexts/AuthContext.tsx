'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
};

// Define business type
export type Business = {
  id: string;
  name: string;
  industry: string;
  location: string;
  logo?: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  business: Business | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  createBusiness: (businessData: Omit<Business, 'id'>) => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Create the auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would be an API call to verify the token
        const storedUser = localStorage.getItem('user');
        const storedBusiness = localStorage.getItem('business');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        if (storedBusiness) {
          setBusiness(JSON.parse(storedBusiness));
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful login with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'owner',
      };
      
      // Mock business data
      const mockBusiness: Business = {
        id: '1',
        name: 'Local Coffee Shop',
        industry: 'Food & Beverage',
        location: 'New York, NY',
        logo: '/logo-placeholder.png',
      };
      
      // Save to state
      setUser(mockUser);
      setBusiness(mockBusiness);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('business', JSON.stringify(mockBusiness));
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'owner',
      };
      
      // Save to state
      setUser(mockUser);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setBusiness(null);
    localStorage.removeItem('user');
    localStorage.removeItem('business');
  };

  // Create business function
  const createBusiness = async (businessData: Omit<Business, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful business creation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock business data
      const mockBusiness: Business = {
        id: '1',
        ...businessData,
      };
      
      // Save to state
      setBusiness(mockBusiness);
      
      // Save to localStorage for persistence
      localStorage.setItem('business', JSON.stringify(mockBusiness));
    } catch (err) {
      console.error('Business creation error:', err);
      setError('Failed to create business profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    business,
    isLoading,
    error,
    login,
    register,
    logout,
    createBusiness,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
