/**
 * API Service
 * 
 * This service handles all API requests to the backend.
 * It provides a consistent interface for making requests and handling responses.
 */

// Base API URL - would come from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.marketpro.com';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// API request options interface
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  cache?: RequestCache;
}

// API error interface
export interface ApiError {
  status: number;
  message: string;
  errors?: any;
}

/**
 * Make an API request with error handling and timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Process API response
 */
async function processResponse<T>(response: Response): Promise<T> {
  // Check if the request was successful
  if (!response.ok) {
    let errorData: any = { message: response.statusText };
    
    try {
      errorData = await response.json();
    } catch (e) {
      // If we can't parse the error response, use the status text
    }
    
    const apiError: ApiError = {
      status: response.status,
      message: errorData.message || 'An error occurred',
      errors: errorData.errors,
    };
    
    throw apiError;
  }
  
  // Check if the response is empty
  if (response.status === 204) {
    return {} as T;
  }
  
  // Parse the response as JSON
  return await response.json();
}

/**
 * API client with methods for different HTTP verbs
 */
const api = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      ...options,
    });
    
    return processResponse<T>(response);
  },
  
  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
    
    return processResponse<T>(response);
  },
  
  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
    
    return processResponse<T>(response);
  },
  
  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
    
    return processResponse<T>(response);
  },
  
  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      ...options,
    });
    
    return processResponse<T>(response);
  },
};

export default api;
