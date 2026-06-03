import { useEffect, useState } from 'react';
import { getSession } from '../lib/auth';

export function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !authed) {
      window.location.href = '/login';
    }
  }, [loading, authed]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0e0e16',
        color: '#8e92b2',
        fontSize: '14px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Loading session...
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return children;
}
