// src/components/UpgradeModal.jsx
import { useState } from 'react';
import { getCheckoutUrl, PRICES, FEATURES } from '../lib/stripe';
import { auth } from '../lib/supabase';

export default function UpgradeModal({ feature, requiredPlan = 'pro', onClose, onNav }) {
  // Initialize current plan synchronously
  const initialPlan = auth.getPlan() || 'free';
  const [currentPlan] = useState(initialPlan);

  const handleUpgradeClick = () => {
    const url = getCheckoutUrl(requiredPlan, false);
    window.open(url, '_blank');
  };

  const handleSeeAllPlans = () => {
    if (onClose) onClose();
    if (onNav) {
      onNav('pricing');
    } else {
      window.location.href = '/pricing';
    }
  };

  const planPrice = PRICES[requiredPlan]?.monthly || 49;
  const currentPlanFeatures = FEATURES[currentPlan] || [];
  const requiredPlanFeatures = FEATURES[requiredPlan] || [];

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <button onClick={onClose} style={styles.closeBtn}>×</button>
        <div style={styles.header}>
          <div style={styles.badge}>PLAN LIMIT REACHED</div>
          <h2 style={styles.title}>Unlock {feature ? feature.toUpperCase() : 'PREMIUM FEATURE'}</h2>
          <p style={styles.subtitle}>
            Your current <strong style={{ color: '#ffffff' }}>{currentPlan.toUpperCase()}</strong> plan doesn't include access to this feature. Upgrade to <strong style={{ color: '#f5b731' }}>{requiredPlan.toUpperCase()}</strong> to continue without limits.
          </p>
        </div>
        <div style={styles.comparisonBox}>
          <div style={styles.planCol}>
            <h4 style={styles.colTitle}>Current: {currentPlan.toUpperCase()}</h4>
            <ul style={styles.list}>
              {currentPlanFeatures.map((feat, i) => (
                <li key={i} style={styles.itemMuted}>✓ {feat}</li>
              ))}
            </ul>
          </div>
          <div style={styles.planColActive}>
            <h4 style={styles.colTitleActive}>Required: {requiredPlan.toUpperCase()}</h4>
            <ul style={styles.list}>
              {requiredPlanFeatures.map((feat, i) => (
                <li key={i} style={styles.itemActive}>✓ {feat}</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={styles.actionArea}>
          <button onClick={handleUpgradeClick} style={styles.primaryBtn}>
            Upgrade to {requiredPlan.toUpperCase()} — ${planPrice}/mo ⚡
          </button>
          <button onClick={handleSeeAllPlans} style={styles.secondaryBtn}>
            See all plans &amp; comparisons
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 5, 8, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
  },
  content: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    maxWidth: '560px',
    width: '100%',
    position: 'relative',
    padding: '40px 32px 32px 32px',
    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1,
    outline: 'none',
  },
  header: {
    marginBottom: '28px',
  },
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#f5b731',
    background: 'rgba(245, 183, 49, 0.08)',
    border: '1px solid rgba(245, 183, 49, 0.2)',
    padding: '4px 10px',
    borderRadius: '4px',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13.5px',
    color: '#8e92b2',
    margin: 0,
    lineHeight: 1.5,
  },
  comparisonBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '28px',
    textAlign: 'left',
  },
  planCol: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '16px',
  },
  colTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#8e92b2',
    margin: '0 0 12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '8px',
  },
  planColActive: {
    backgroundColor: 'rgba(245, 183, 49, 0.02)',
    border: '1px solid rgba(245, 183, 49, 0.2)',
    borderRadius: '8px',
    padding: '16px',
  },
  colTitleActive: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#f5b731',
    margin: '0 0 12px 0',
    borderBottom: '1px solid rgba(245, 183, 49, 0.2)',
    paddingBottom: '8px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  itemMuted: {
    fontSize: '12px',
    color: '#6e7191',
  },
  itemActive: {
    fontSize: '12px',
    color: '#e2e8f0',
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(245, 183, 49, 0.2)',
  },
  secondaryBtn: {
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'underline',
  },
};
