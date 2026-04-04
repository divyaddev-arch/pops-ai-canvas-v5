import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Button, Icon } from '@my-google-project/gm3-react-components';
import { MyGoogleLogo } from '../../creatives/icons/MyGoogleLogo';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface" id="login-loading-container">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" id="login-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F8FAFD] font-google-sans" id="login-page-container">
      <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl shadow-elevation-1 max-w-md w-full" id="login-card">
        <MyGoogleLogo className="w-16 h-16" id="login-logo" />
        <div className="text-center" id="login-text-container">
          <h1 className="text-3xl font-medium text-on-surface mb-2" id="login-title">Welcome to My Google</h1>
          <p className="text-on-surface-variant" id="login-subtitle">Sign in to access your personalized dashboard and AI assistant.</p>
        </div>
        <Button 
          variant="filled" 
          onClick={login} 
          className="w-full h-12 rounded-full flex items-center justify-center gap-2"
          id="login-button"
        >
          <Icon>login</Icon>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
