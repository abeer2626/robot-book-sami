import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}