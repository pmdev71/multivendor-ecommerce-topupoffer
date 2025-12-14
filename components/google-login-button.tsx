'use client';

import { useState, useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onSuccess?: (user: any, token: string) => void;
  onError?: (error: string) => void;
}

/**
 * Google One Click Login Button Component
 * Google Sign-In Button ব্যবহার করে login করার জন্য
 */
export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load Google Sign-In script
    if (typeof window !== 'undefined' && !scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded.current = true;
        initializeGoogleSignIn();
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (typeof window === 'undefined' || !(window as any).google || !buttonRef.current) {
      return;
    }

    const google = (window as any).google;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('Google Client ID not configured');
      return;
    }

    try {
      // Initialize Google Sign-In
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      // Render button
      google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
      });

      // Try to show One Tap prompt
      google.accounts.id.prompt((notification: any) => {
        // One Tap prompt shown or skipped
        console.log('One Tap notification:', notification);
      });
    } catch (error: any) {
      console.error('Google Sign-In initialization error:', error);
      onError?.(error.message || 'Failed to initialize Google Sign-In');
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);

      // Send ID Token to backend for verification
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();

      if (data.success) {
        // Store token
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }

        onSuccess?.(data.user, data.token);
        
        // Redirect based on role and status
        if (typeof window !== 'undefined') {
          if (data.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else if (data.needsAccountTypeSelection) {
            // New user - redirect to account type selection
            window.location.href = '/select-account-type';
          } else if (data.user.role === 'seller') {
            // Check if seller has store and if it's approved
            if (!data.sellerStore) {
              // No store created yet
              window.location.href = '/seller/create-store';
            } else if (!data.sellerStore.isApproved) {
              // Store created but not approved
              window.location.href = '/seller/waiting-approval';
            } else {
              // Store approved - go to dashboard
              window.location.href = '/seller/dashboard';
            }
          } else {
            window.location.href = '/customer/products';
          }
        }
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      onError?.(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full"></div>
      {loading && (
        <div className="mt-2 text-center text-sm text-gray-600">
          Signing in...
        </div>
      )}
    </div>
  );
}

