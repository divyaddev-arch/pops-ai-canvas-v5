import React, { Component, ErrorInfo, ReactNode } from 'react';
import HomePage from '../homepage/index';
import { AuthProvider, useAuth } from './lib/AuthContext';
import LoginPage from '../homepage/LoginPage';
import { UnifiedLayout } from '../creatives/UnifiedLayout';

const VERSION = '1774592747441';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      try {
        // Check if it's a FirestoreErrorInfo JSON string
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) {
          errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} at ${parsed.path})`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-surface p-6 text-center" id="error-boundary-root">
          <div className="bg-error-container text-on-error-container p-8 rounded-2xl max-w-md shadow-elevation-2" id="error-message-container">
            <Icon className="text-4xl mb-4">error</Icon>
            <h2 className="text-2xl font-medium mb-2">Application Error</h2>
            <p className="text-base mb-6 opacity-90">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
              id="error-reload-button"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Helper for Icon in ErrorBoundary
const Icon = ({ children, className = '' }: { children: string, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{children}</span>
);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [statusChecked, setStatusChecked] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/system-status');
        const data = await response.json();
        setIsSwitching(data.switching);
      } catch (error) {
        // Silently fail
      } finally {
        setStatusChecked(true);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 500);
    return () => clearInterval(interval);
  }, [statusChecked]);

  // Firestore Connection Test
  React.useEffect(() => {
    if (user) {
      import('./lib/firebase').then(({ testFirestoreConnection }) => {
        testFirestoreConnection();
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (!loading && statusChecked) {
      const storedVersion = sessionStorage.getItem('app-version');
      if (storedVersion !== VERSION) {
        const clearFlag = async () => {
          try {
            await fetch('/api/clear-switching-flag', { method: 'POST' });
            setIsSwitching(false);
            sessionStorage.setItem('app-version', VERSION);
          } catch (error) {
            // Silently fail
          }
        };
        clearFlag();
      }
    }
  }, [loading, statusChecked]);

  if (loading || !statusChecked || isSwitching) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-surface gap-4" id="app-loading-container">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" id="app-loading-spinner"></div>
        {(isSwitching || !statusChecked) && (
          <p className="text-on-surface-variant font-medium animate-pulse" id="switching-text">
            {isSwitching ? 'Switching project...' : 'Loading...'}
          </p>
        )}
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <UnifiedLayout userName={user.displayName || 'Divya'} userEmail={user.email || ''} />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
