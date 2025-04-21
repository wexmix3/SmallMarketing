/**
 * API Service
 * 
 * This module provides a configured Axios instance for API requests.
 */

import axios from 'axios';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';
import * as Keychain from 'react-native-keychain';

// Create axios instance
export const api = axios.create({
  baseURL: Config.API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }
    
    // Add auth token if available
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        config.headers.Authorization = `Bearer ${credentials.password}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      try {
        // Clear token
        await Keychain.resetGenericPassword();
        
        // TODO: Redirect to login screen or refresh token
      } catch (e) {
        console.error('Error handling 401:', e);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      // Network error or timeout
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API services
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh-token', { refreshToken })
};

export const conversationsApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/chatbot/conversations', { params }),
  
  getById: (id: string) => 
    api.get(`/chatbot/conversations/${id}`),
  
  getMessages: (conversationId: string) => 
    api.get(`/chatbot/conversations/${conversationId}/messages`),
  
  sendMessage: (conversationId: string, content: string) => 
    api.post(`/chatbot/conversations/${conversationId}/messages`, { 
      content, 
      sender: 'human-agent' 
    }),
  
  updateStatus: (id: string, status: 'active' | 'closed' | 'transferred') => 
    api.patch(`/chatbot/conversations/${id}`, { status })
};

export const knowledgeBaseApi = {
  get: () => 
    api.get('/chatbot/knowledge-base'),
  
  getFaqs: () => 
    api.get('/chatbot/knowledge-base/faqs'),
  
  createFaq: (faq: { question: string; answer: string; category?: string; tags?: string[] }) => 
    api.post('/chatbot/knowledge-base/faqs', faq),
  
  updateFaq: (id: string, faq: { question?: string; answer?: string; category?: string; tags?: string[] }) => 
    api.put(`/chatbot/knowledge-base/faqs/${id}`, faq),
  
  deleteFaq: (id: string) => 
    api.delete(`/chatbot/knowledge-base/faqs/${id}`),
  
  getProducts: () => 
    api.get('/chatbot/knowledge-base/products'),
  
  getServices: () => 
    api.get('/chatbot/knowledge-base/services')
};

export const analyticsApi = {
  getSummary: (period: 'day' | 'week' | 'month' | 'year' = 'month') => 
    api.get('/chatbot/analytics/summary', { params: { period } }),
  
  getDetailed: (period: 'day' | 'week' | 'month' | 'year' = 'month') => 
    api.get('/chatbot/analytics/detailed', { params: { period } }),
  
  getConversationQuality: (conversationId: string) => 
    api.get(`/chatbot/analytics/conversations/${conversationId}/quality`),
  
  getReport: (period: 'day' | 'week' | 'month' | 'year' = 'month', format: 'json' | 'csv' | 'html' = 'json') => 
    api.get('/chatbot/analytics/report', { 
      params: { period, format },
      responseType: format === 'json' ? 'json' : 'blob'
    })
};

export const integrationsApi = {
  getAll: () => 
    api.get('/chatbot/integrations'),
  
  connect: (type: 'calendar' | 'crm' | 'email', providerType: string, authData: any) => 
    api.post(`/chatbot/integrations/${type}`, { providerType, ...authData }),
  
  disconnect: (id: string) => 
    api.delete(`/chatbot/integrations/${id}`)
};

export const settingsApi = {
  getConfig: () => 
    api.get('/chatbot/config'),
  
  updateConfig: (config: any) => 
    api.put('/chatbot/config', config),
  
  getProfile: () => 
    api.get('/users/profile'),
  
  updateProfile: (profile: any) => 
    api.put('/users/profile', profile),
  
  updatePassword: (currentPassword: string, newPassword: string) => 
    api.put('/users/password', { currentPassword, newPassword }),
  
  updateFcmToken: (token: string) => 
    api.post('/users/fcm-token', { token }),
  
  deleteFcmToken: () => 
    api.delete('/users/fcm-token')
};
