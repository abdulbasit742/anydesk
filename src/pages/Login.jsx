// src/pages/Login.jsx
import { useState } from 'react';
import { auth } from '../lib/supabase';

export default function Login({ onNav }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await auth.signIn(email, password);
      if (onNav) {
        onNav('dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoHeader} onClick={() => onNav('landing')}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>AgentFlow</span>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to manage your AI account relays</p>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <a href="#" style={styles.forgotLink} onClick={(e) => { e.preventDefault(); alert('Please check your Supabase dashboard settings to configure password reset.'); }}>
                Forgot?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <span style={styles.spinnerContainer}>
                <span style={styles.spinner}></span> Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Don't have an account?</span>{' '}
          <button onClick={() => onNav('signup')} style={styles.linkBtn}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '24px',
  },
  card: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
  },
  logoHeader: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginBottom: '28px',
  },
  logoIcon: {
    fontSize: '24px',
    color: '#f5b731',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8e92b2',
    margin: '0 0 28px 0',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '6px',
    padding: '12px',
    color: '#ef4444',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
    marginBottom: '20px',
  },
  errorIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '6px',
  },
  forgotLink: {
    fontSize: '12px',
    color: '#f5b731',
    textDecoration: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  spinnerContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(14, 14, 22, 0.2)',
    borderTopColor: '#0e0e16',
    borderRadius: '50%',
    animation: 'agp-spin 0.6s linear infinite',
  },
  footer: {
    marginTop: '28px',
    fontSize: '13px',
    color: '#8e92b2',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#f5b731',
    padding: 0,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'underline',
  }
};

// Add standard keyframe spinner CSS rules if needed dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes agp-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
