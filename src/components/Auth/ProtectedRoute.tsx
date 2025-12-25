import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('student' | 'instructor' | 'admin')[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  roles = ['student', 'instructor', 'admin'],
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = fallbackPath;
    }
  }, [isAuthenticated, isLoading, fallbackPath]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Redirecting...</span>
        </div>
      </div>
    );
  }

  if (user && !roles.includes(user.role)) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button
          className="button button--primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
}