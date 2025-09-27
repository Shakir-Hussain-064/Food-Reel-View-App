import React from 'react';
import toastService from '../services/toast.service';

/**
 * Error Boundary component to catch JavaScript errors and show user-friendly messages
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Show user-friendly error message
    toastService.error(
      'Something went wrong. Please refresh the page and try again.',
      { duration: 8000 }
    );

    // Optional: Report error to an error reporting service
    // errorReportingService.reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h2 style={styles.title}>Oops! Something went wrong</h2>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              style={styles.button}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '2rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-md)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'var(--color-text)',
  },
  message: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: 'var(--color-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  details: {
    marginTop: '2rem',
    textAlign: 'left',
    backgroundColor: 'var(--color-surface-alt)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-text)',
  },
  errorText: {
    fontSize: '0.875rem',
    color: 'var(--color-danger)',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

export default ErrorBoundary;