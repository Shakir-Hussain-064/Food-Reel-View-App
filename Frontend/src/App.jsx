import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import globalErrorHandler from './utils/globalErrorHandler'

function App() {
  useEffect(() => {
    // Initialize global error handler when app starts
    // This is already done in the module, but we ensure it's active
    console.log('Global error handler initialized');
  }, []);

  return (
    <ErrorBoundary>
      <>
        <AppRoutes />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{
            top: 20,
            left: 20,
            bottom: 20,
            right: 20,
          }}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 16px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              maxWidth: '90vw',
              wordBreak: 'break-word',
            },
            // Custom styles for different types
            success: {
              style: {
                background: '#10b981',
                color: '#fff',
                border: '1px solid #059669',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
                border: '1px solid #dc2626',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              },
            },
          }}
        />
      </>
    </ErrorBoundary>
  )
}

export default App