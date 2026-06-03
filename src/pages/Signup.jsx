import { useState } from 'react';
import { signUp } from '../lib/auth';
import { setPlan } from '../lib/planGate';

export default function Signup({ onNav }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Save selected plan
        setPlan(selectedPlan);
        
        // Go to onboarding
        if (onNav) {
          onNav('onboarding');
        } else {
          window.location.href = '/onboarding';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const planOptions = [
    { id: 'free', name: 'Free', desc: '2 AI accounts', price: '$0' },
    { id: 'starter', name: 'Starter', desc: '5 AI accounts, relay', price: '$19/mo' },
    { id: 'pro', name: 'Pro', desc: '25 accounts, fleet, wall', price: '$49/mo' },
    { id: 'agency', name: 'Agency', desc: 'Unlimited accounts, dedicated', price: '$99/mo' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoHeader} onClick={() => onNav('landing')}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>AgentFlow</span>
        </div>

        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Get started with AgentFlow account management</p>

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
            <label htmlFor="password" style={styles.label}>Password</label>
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

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Choose a plan</label>
            <div style={styles.planSelectorGrid}>
              {planOptions.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    ...styles.planOptionCard,
                    ...(selectedPlan === plan.id ? styles.selectedPlanCard : {})
                  }}
                >
                  <div style={styles.planNameRow}>
                    <span style={styles.planOptionName}>{plan.name}</span>
                    <span style={styles.planOptionPrice}>{plan.price}</span>
                  </div>
                  <div style={styles.planOptionDesc}>{plan.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Start Free Trial'}
          </button>
        </form>

        <p style={styles.trialText}>7 days free trial, cancel anytime. No credit card required.</p>

        <div style={styles.footer}>
          <span>Already have an account?</span>{' '}
          <button onClick={() => onNav('login')} style={styles.linkBtn}>
            Sign in
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
    maxWidth: '460px',
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
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '6px',
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
  planSelectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  planOptionCard: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  selectedPlanCard: {
    border: '1px solid #f5b731',
    backgroundColor: 'rgba(245, 183, 49, 0.04)',
  },
  planNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  planOptionName: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planOptionPrice: {
    fontSize: '12px',
    color: '#f5b731',
  },
  planOptionDesc: {
    fontSize: '11px',
    color: '#8e92b2',
    lineHeight: 1.3,
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
  trialText: {
    fontSize: '11px',
    color: '#8e92b2',
    marginTop: '12px',
    marginBottom: 0,
  },
  footer: {
    marginTop: '24px',
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
