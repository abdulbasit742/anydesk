// src/components/AuthGuard.jsx
import { useState } from 'react';
import { auth } from '../lib/supabase';

export function AuthGuard({ children }) {
  // Determine auth state synchronously
  const isAuthed = auth.isAuthed();
  const [authed] = useState(isAuthed);
  const [loading] = useState(false);

  // If not authenticated, redirect immediately
  if (!isAuthed) {
    window.location.href = '/login';
    return null;
  }

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
