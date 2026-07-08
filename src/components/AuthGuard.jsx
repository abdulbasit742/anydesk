// src/components/AuthGuard.jsx
import { useState, useEffect } from 'react';
import { auth } from '../lib/supabase';

export function AuthGuard({ children }) {
  // Determine auth state synchronously
  const isAuthed = auth.isAuthed();
  const [authed] = useState(isAuthed);
  const [loading] = useState(false);

  // Side-effects (redirects) must run inside useEffect
  useEffect(() => {
    if (!isAuthed) {
      window.location.href = '/login';
    }
  }, [isAuthed]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#8e92b2',
        fontSize: '14px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Verifying security credentials...
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return children;
}
