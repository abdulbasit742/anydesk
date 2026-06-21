// src/pages/Billing.jsx
import { useState, useEffect } from 'react';
import { auth } from '../lib/supabase';
import { FEATURES } from '../lib/stripe';
import PlanBadge from '../components/PlanBadge';

export default function Billing({ onNav }) {
  const [plan, setPlan] = useState('free');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    setPlan(auth.getPlan());
  }, []);

  const handleCancelSubscription = () => {
    alert('Subscription successfully set to cancel at the end of the current billing cycle. (Mock handler completed)');
    setShowCancelConfirm(false);
  };

  const portalUrl = import.meta.env.VITE_STRIPE_PORTAL || '#';
  const planFeatures = FEATURES[plan] || FEATURES.free;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Billing &amp; Subscription</h2>
        <p style={styles.subtitle}>Manage your plan preferences, payment settings, and invoices.</p>
      </div>

      <div style={styles.cardContainer}>
        {/* Active plan card */}
        <div style={styles.mainCard}>
          <div style={styles.planHeader}>
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#8e92b2', marginBottom: '4px' }}>CURRENT PLAN</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <h3 style={styles.planTitle}>{plan.toUpperCase()}</h3>
                <PlanBadge plan={plan} />
              </div>
            </div>
            <div style={styles.price}>
              {plan === 'free' ? '$0' : plan === 'starter' ? '$19' : plan === 'pro' ? '$49' : '$99'}
              <span style={{ fontSize: '12px', color: '#8e92b2', fontWeight: 'normal' }}>/mo</span>
            </div>
          </div>

          <div style={{ margin: '16px 0 24px 0' }}>
            <h4 style={{ fontSize: '12px', color: '#ffffff', margin: '0 0 8px 0' }}>Features in your current tier:</h4>
            <ul style={styles.featureList}>
              {planFeatures.map((feat, i) => (
                <li key={i} style={styles.featureItem}>✓ {feat}</li>
              ))}
            </ul>
          </div>

          <div style={styles.actions}>
            <button onClick={() => onNav('pricing')} style={styles.upgradeBtn}>
              Upgrade Tier ⚡
            </button>
            <button
              onClick={() => {
                if (portalUrl !== '#') {
                  window.open(portalUrl, '_blank');
                } else {
                  alert('Redirecting to Stripe Billing Portal... (VITE_STRIPE_PORTAL is not configured, running simulated portal fallback)');
                }
              }}
              style={styles.manageBtn}
            >
              Manage Stripe Billing
            </button>
          </div>
        </div>

        {/* Invoice history */}
        <div style={styles.historyCard}>
          <h4 style={styles.historyTitle}>Invoice History</h4>
          <div style={styles.emptyState}>
            <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>🧾</span>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#ffffff' }}>No invoices found</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#8e92b2' }}>Invoices appear here after first payment.</p>
          </div>
        </div>

        {/* Cancel Subscription */}
        {plan !== 'free' && (
          <div style={styles.cancelCard}>
            <h4 style={styles.cancelTitle}>Danger Zone</h4>
            <p style={styles.cancelText}>
              Cancel your AgentFlow premium tier and revert your workspace back to the Free plan limits.
            </p>
            {!showCancelConfirm ? (
              <button onClick={() => setShowCancelConfirm(true)} style={styles.cancelBtn}>
                Cancel Subscription
              </button>
            ) : (
              <div style={styles.cancelConfirmBlock}>
                <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 'bold' }}>Are you absolutely sure?</span>
                <div style={styles.cancelActions}>
                  <button onClick={handleCancelSubscription} style={styles.cancelConfirmBtn}>Yes, Cancel</button>
                  <button onClick={() => setShowCancelConfirm(false)} style={styles.cancelDismissBtn}>Keep Subscription</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#0a0a0f',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#e2e8f0',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8e92b2',
    margin: 0,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '640px',
  },
  mainCard: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '28px',
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
  },
  planTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureItem: {
    fontSize: '13px',
    color: '#8e92b2',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  upgradeBtn: {
    padding: '10px 20px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  manageBtn: {
    padding: '10px 20px',
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  historyCard: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '24px',
  },
  historyTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 16px 0',
  },
  emptyState: {
    textAlignment: 'center',
    padding: '30px 20px',
    backgroundColor: '#16161e',
    borderRadius: '8px',
    border: '1px dashed rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cancelCard: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '10px',
    padding: '24px',
  },
  cancelTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ef4444',
    margin: '0 0 8px 0',
  },
  cancelText: {
    fontSize: '13px',
    color: '#8e92b2',
    margin: '0 0 16px 0',
    lineHeight: 1.4,
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelConfirmBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-start',
  },
  cancelActions: {
    display: 'flex',
    gap: '8px',
  },
  cancelConfirmBtn: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    border: 'none',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelDismissBtn: {
    padding: '8px 16px',
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
