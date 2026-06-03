import { useState } from 'react';
import { getPlan } from '../lib/planGate';

export default function Billing({ onNav }) {
  const [plan] = useState(() => getPlan());

  const planLabels = {
    free: 'Free Trial Plan',
    starter: 'Starter Plan',
    pro: 'Professional Pro Plan',
    agency: 'Enterprise Agency Plan'
  };

  const planPrices = {
    free: '$0 / mo',
    starter: '$19 / mo',
    pro: '$49 / mo',
    agency: '$99 / mo'
  };

  const invoiceHistory = []; // Empty state for now

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
              <span style={styles.badge}>CURRENT PLAN</span>
              <h3 style={styles.planTitle}>{planLabels[plan] || 'Unknown Plan'}</h3>
            </div>
            <div style={styles.price}>{planPrices[plan] || '—'}</div>
          </div>
          
          <p style={styles.cardText}>
            Your plan allows you to add up to {plan === 'free' ? '2' : plan === 'starter' ? '5' : plan === 'pro' ? '25' : '999'} accounts, 
            {plan === 'free' ? ' with no relay or fleet broadcasting capabilities.' : ' with active credit relay and custom thresholds.'}
          </p>

          <div style={styles.actions}>
            <button onClick={() => onNav('pricing')} style={styles.upgradeBtn}>
              Upgrade Plan ⚡
            </button>
            <button 
              onClick={() => alert('Redirecting to Stripe Billing Portal... (Simulated link)')} 
              style={styles.manageBtn}
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Invoice history */}
        <div style={styles.historyCard}>
          <h4 style={styles.historyTitle}>Invoice History</h4>
          {invoiceHistory.length > 0 ? (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Invoice ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Rows would go here */}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>🧾</span>
              <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>No invoices found</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8e92b2' }}>You haven't been billed yet.</p>
            </div>
          )}
        </div>
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
    maxWidth: '800px',
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
  badge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#f5b731',
    backgroundColor: 'rgba(245, 183, 49, 0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginBottom: '8px',
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
  cardText: {
    fontSize: '13.5px',
    color: '#8e92b2',
    lineHeight: 1.5,
    margin: '0 0 24px 0',
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
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#16161e',
    borderRadius: '8px',
    border: '1px dashed rgba(255, 255, 255, 0.05)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left',
  }
};
