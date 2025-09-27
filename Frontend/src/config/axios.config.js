import axios from 'axios';
import toastService from '../services/toast.service';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    toastService.error('Failed to send request. Please try again.');
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      toastService.error('Request timed out. Please try again.');
    } else if (error.code === 'ERR_NETWORK') {
      toastService.handleNetworkError(error);
    } else if (error.response) {
      // Server responded with error status
      handleServerError(error);
    } else if (error.request) {
      // Request was made but no response received
      toastService.handleNetworkError(error);
    } else {
      // Something else happened
      toastService.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// Handle server errors with specific status codes
function handleServerError(error) {
  const { status, data } = error.response;
  const message = data?.message || 'Server error occurred';
  
  switch (status) {
    case 400:
      toastService.error(message || 'Invalid request. Please check your input.');
      break;
    case 401:
      toastService.error('Please login to continue');
      // Optionally redirect to login page
      // window.location.href = '/user/login';
      break;
    case 403:
      toastService.error('You are not authorized to perform this action');
      break;
    case 404:
      toastService.error('The requested resource was not found');
      break;
    case 409:
      toastService.error(message || 'Conflict occurred. Please try again.');
      break;
    case 422:
      toastService.error(message || 'Invalid data provided. Please check your input.');
      break;
    case 429:
      toastService.error('Too many requests. Please wait a moment and try again.');
      break;
    case 500:
      toastService.error('Server error. Please try again later.');
      break;
    case 502:
      toastService.error('Server is temporarily unavailable. Please try again later.');
      break;
    case 503:
      toastService.error('Service temporarily unavailable. Please try again later.');
      break;
    case 504:
      toastService.error('Request timed out. Please try again.');
      break;
    default:
      if (status >= 500) {
        toastService.error('Server error. Please try again later.');
      } else {
        toastService.error(message || 'An error occurred. Please try again.');
      }
  }
}

// Helper function for making requests with toast notifications
export const apiRequest = {
  // GET request with error handling
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response;
    } catch (error) {
      // Error already handled by interceptor
      throw error;
    }
  },

  // POST request with error handling
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response;
    } catch (error) {
      // Error already handled by interceptor
      throw error;
    }
  },

  // PUT request with error handling
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response;
    } catch (error) {
      // Error already handled by interceptor
      throw error;
    }
  },

  // DELETE request with error handling
  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response;
    } catch (error) {
      // Error already handled by interceptor
      throw error;
    }
  },

  // Request with loading toast
  withLoading: async (requestFn, loadingMessage = 'Loading...') => {
    const loadingToast = toastService.loading(loadingMessage);
    
    try {
      const result = await requestFn();
      toastService.dismiss(loadingToast);
      return result;
    } catch (error) {
      toastService.dismiss(loadingToast);
      throw error;
    }
  },

  // Request with success and error toasts
  withToasts: async (requestFn, messages = {}) => {
    const { loading, success, error: errorMessage } = messages;
    
    if (loading) {
      const loadingToast = toastService.loading(loading);
      
      try {
        const result = await requestFn();
        toastService.dismiss(loadingToast);
        if (success) {
          toastService.success(success);
        }
        return result;
      } catch (error) {
        toastService.dismiss(loadingToast);
        if (errorMessage) {
          toastService.error(errorMessage);
        }
        throw error;
      }
    } else {
      try {
        const result = await requestFn();
        if (success) {
          toastService.success(success);
        }
        return result;
      } catch (error) {
        if (errorMessage) {
          toastService.error(errorMessage);
        }
        throw error;
      }
    }
  },
};

export default axiosInstance;