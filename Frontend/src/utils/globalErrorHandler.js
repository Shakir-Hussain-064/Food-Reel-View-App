import toastService from '../services/toast.service';

/**
 * Global error handler that captures unhandled errors and promise rejections
 */
class GlobalErrorHandler {
  constructor() {
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', this.handleError.bind(this));
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    // Override console.error to catch console errors
    this.overrideConsoleError();
  }

  handleError(event) {
    console.error('Global Error Handler - Unhandled Error:', event.error);
    
    // Don't show toast for script loading errors or minor errors
    if (this.shouldIgnoreError(event.error)) {
      return;
    }

    const errorMessage = this.getErrorMessage(event.error);
    toastService.error(errorMessage);
  }

  handlePromiseRejection(event) {
    console.error('Global Error Handler - Unhandled Promise Rejection:', event.reason);
    
    // Don't show toast for certain types of promise rejections
    if (this.shouldIgnoreError(event.reason)) {
      return;
    }

    const errorMessage = this.getErrorMessage(event.reason);
    toastService.error(errorMessage);
    
    // Prevent the default browser behavior
    event.preventDefault();
  }

  overrideConsoleError() {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Check if this is an error we should show to the user
      const firstArg = args[0];
      if (this.shouldShowConsoleError(firstArg, args)) {
        const errorMessage = this.extractConsoleErrorMessage(args);
        if (errorMessage) {
          toastService.error(errorMessage);
        }
      }
    };
  }

  shouldIgnoreError(error) {
    if (!error) return true;
    
    const errorString = error.toString().toLowerCase();
    const errorMessage = typeof error === 'object' ? error.message?.toLowerCase() : errorString;
    
    // Ignore certain types of errors
    const ignoredErrors = [
      'script error',
      'non-error promise rejection captured',
      'loading chunk',
      'loading css chunk',
      'network error',
      'fetch',
      'cors',
      'content security policy',
      'mixed content',
      'resource timing',
      'chunkloadererror',
    ];
    
    return ignoredErrors.some(ignored => 
      errorString.includes(ignored) || errorMessage?.includes(ignored)
    );
  }

  shouldShowConsoleError(firstArg, allArgs) {
    if (!firstArg) return false;
    
    const errorString = firstArg.toString().toLowerCase();
    
    // Only show specific console errors that are user-relevant
    const userRelevantErrors = [
      'failed to fetch',
      'network request failed',
      'api error',
      'server error',
      'authentication',
      'authorization',
      'permission denied',
      'access denied',
      'timeout',
      'service unavailable',
    ];
    
    return userRelevantErrors.some(relevant => errorString.includes(relevant));
  }

  extractConsoleErrorMessage(args) {
    const firstArg = args[0];
    
    if (typeof firstArg === 'string') {
      // Extract meaningful message from console error
      if (firstArg.includes('Failed to fetch')) {
        return 'Network error. Please check your connection and try again.';
      } else if (firstArg.includes('API Error') || firstArg.includes('Server Error')) {
        return 'Server error. Please try again later.';
      } else if (firstArg.includes('Authentication') || firstArg.includes('Unauthorized')) {
        return 'Please login to continue.';
      } else if (firstArg.includes('Permission') || firstArg.includes('Access denied')) {
        return 'You are not authorized to perform this action.';
      }
    }
    
    return null; // Don't show toast for other console errors
  }

  getErrorMessage(error) {
    if (!error) return 'An unexpected error occurred';
    
    // Handle different types of errors
    if (typeof error === 'string') {
      return this.formatErrorMessage(error);
    } else if (error.message) {
      return this.formatErrorMessage(error.message);
    } else if (error.reason) {
      return this.formatErrorMessage(error.reason);
    } else {
      return 'An unexpected error occurred. Please refresh the page and try again.';
    }
  }

  formatErrorMessage(message) {
    // Clean up and format error messages for user display
    const cleanMessage = message
      .replace(/^Error:\s*/i, '')
      .replace(/^TypeError:\s*/i, '')
      .replace(/^ReferenceError:\s*/i, '')
      .replace(/^SyntaxError:\s*/i, '');
    
    // Provide user-friendly messages for common errors
    if (cleanMessage.toLowerCase().includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    } else if (cleanMessage.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please try again.';
    } else if (cleanMessage.toLowerCase().includes('server')) {
      return 'Server error. Please try again later.';
    } else if (cleanMessage.length > 100) {
      return 'An error occurred. Please refresh the page and try again.';
    }
    
    return cleanMessage || 'An unexpected error occurred';
  }

  // Method to manually report errors
  reportError(error, context = {}) {
    console.error('Manual Error Report:', error, context);
    
    if (!this.shouldIgnoreError(error)) {
      const errorMessage = this.getErrorMessage(error);
      toastService.error(errorMessage);
    }
  }
}

// Create and export singleton instance
const globalErrorHandler = new GlobalErrorHandler();
export default globalErrorHandler;