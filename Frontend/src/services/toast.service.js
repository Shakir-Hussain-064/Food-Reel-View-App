import toast from 'react-hot-toast';

/**
 * Toast notification service for showing user-friendly messages
 */
class ToastService {
  /**
   * Show success toast
   * @param {string} message - Success message to display
   * @param {object} options - Additional toast options
   */
  success(message, options = {}) {
    return toast.success(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10b981',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  }

  /**
   * Show error toast
   * @param {string} message - Error message to display
   * @param {object} options - Additional toast options
   */
  error(message, options = {}) {
    return toast.error(message, {
      duration: 6000,
      position: 'top-center',
      style: {
        background: '#ef4444',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '12px 16px',
        maxWidth: '90vw',
      },
      ...options,
    });
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message to display
   * @param {object} options - Additional toast options
   */
  warning(message, options = {}) {
    return toast(message, {
      duration: 5000,
      position: 'top-center',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  }

  /**
   * Show info toast
   * @param {string} message - Info message to display
   * @param {object} options - Additional toast options
   */
  info(message, options = {}) {
    return toast(message, {
      duration: 4000,
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  }

  /**
   * Show loading toast
   * @param {string} message - Loading message to display
   * @param {object} options - Additional toast options
   */
  loading(message, options = {}) {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#6b7280',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  }

  /**
   * Dismiss a specific toast
   * @param {string} toastId - ID of the toast to dismiss
   */
  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    toast.dismiss();
  }

  /**
   * Handle API errors and show appropriate toast messages
   * @param {Error} error - Error object from API call
   * @param {string} defaultMessage - Default message if error doesn't have a specific message
   */
  handleApiError(error, defaultMessage = 'Something went wrong. Please try again.') {
    console.error('API Error:', error);
    
    let message = defaultMessage;
    
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Handle specific HTTP status codes
    const status = error?.response?.status;
    if (status === 401) {
      message = 'Please login to continue';
    } else if (status === 403) {
      message = 'You are not authorized to perform this action';
    } else if (status === 404) {
      message = 'The requested resource was not found';
    } else if (status === 500) {
      message = 'Server error. Please try again later';
    } else if (status >= 500) {
      message = 'Server is temporarily unavailable. Please try again later';
    } else if (!navigator.onLine) {
      message = 'No internet connection. Please check your network';
    }

    this.error(message);
  }

  /**
   * Handle network errors specifically
   * @param {Error} error - Network error
   */
  handleNetworkError(error) {
    console.error('Network Error:', error);
    
    if (!navigator.onLine) {
      this.error('No internet connection. Please check your network and try again.');
    } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      this.error('Network error. Please check your connection and try again.');
    } else {
      this.error('Unable to connect to server. Please try again later.');
    }
  }

  /**
   * Promise-based toast for async operations
   * @param {Promise} promise - Promise to track
   * @param {object} messages - Messages for different states
   * @param {object} options - Additional options
   */
  promise(promise, messages, options = {}) {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: (err) => {
          console.error('Promise Error:', err);
          return messages.error || this.getErrorMessage(err);
        },
      },
      {
        position: 'top-center',
        style: {
          fontSize: '14px',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        ...options,
      }
    );
  }

  /**
   * Extract meaningful error message from error object
   * @param {Error} error - Error object
   * @returns {string} - User-friendly error message
   */
  getErrorMessage(error) {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    } else if (error?.message) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'Something went wrong. Please try again.';
    }
  }
}

// Export singleton instance
const toastService = new ToastService();
export default toastService;

// Also export individual methods for convenience
export const {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  handleApiError,
  handleNetworkError,
  promise: toastPromise,
} = toastService;