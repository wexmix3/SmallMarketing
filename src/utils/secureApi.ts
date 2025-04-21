/**
 * Secure API Utilities
 * 
 * This module provides utilities for making secure API requests.
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
import { generateToken } from './encryption';

// Create a secure axios instance
const secureApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor to add authentication token
secureApi.interceptors.request.use(
  async (config) => {
    // Add a unique request ID for tracing
    config.headers['X-Request-ID'] = generateToken(16);
    
    // Add CSRF protection for non-GET requests
    if (config.method !== 'get') {
      config.headers['X-CSRF-Protection'] = 'true';
    }
    
    // Add authentication token if available
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
secureApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden:', error.response.data);
      } else if (status === 429) {
        // Too many requests - rate limited
        console.error('Rate limited:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Make a secure GET request
 * 
 * @param url - The URL to request
 * @param config - Additional axios config
 * @returns The response data
 */
export async function secureGet<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await secureApi.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Make a secure POST request
 * 
 * @param url - The URL to request
 * @param data - The data to send
 * @param config - Additional axios config
 * @returns The response data
 */
export async function securePost<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await secureApi.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Make a secure PUT request
 * 
 * @param url - The URL to request
 * @param data - The data to send
 * @param config - Additional axios config
 * @returns The response data
 */
export async function securePut<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await secureApi.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Make a secure DELETE request
 * 
 * @param url - The URL to request
 * @param config - Additional axios config
 * @returns The response data
 */
export async function secureDelete<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await secureApi.delete<T>(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default secureApi;
