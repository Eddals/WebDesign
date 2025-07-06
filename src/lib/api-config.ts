/**
 * API Configuration
 * Handles API URLs for both development and production environments
 */

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Base API URL configuration
export const API_BASE_URL = isDevelopment 
  ? '' // Empty string for relative URLs in development (uses Vite proxy)
  : 'https://devtone.agency';

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., '/api/webhooks/resend-simple')
 * @returns The full URL for the API endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In development, return relative URL (will be proxied by Vite)
  // In production, return full URL
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Common fetch options with proper headers
 */
export const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: isDevelopment ? 'same-origin' : 'include',
  };
};

/**
 * Helper function to make API requests with proper error handling
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = getApiUrl(endpoint);
  const fetchOptions = getFetchOptions(options);
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};