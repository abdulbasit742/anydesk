// src/pages/Pricing.jsx
import { useState } from 'react';
import { getCheckoutUrl, PRICES, FEATURES } from '../lib/stripe';

export default function Pricing({ onNav }) {
  const [annual, setAnnual] = useState(false);

  const comparisonRows = [
    { feature: 'AI Accounts Linked', free: '2', starter: '5', pro: '25', agency: 'Unlimited' },
    { feature: 'Client-Side Key Encryption (AES-256)', free: '✓', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Manual Credit Refill Alerts', free: '✓', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Automated Credit Relay Pipeline', free: '—', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Relay Warning Thresholds', free: '—', starter: '10%-30%', pro: 'Customizable', agency: 'Customizable' },
    { feature: 'Concurrent Fleet Prompt Sends', free: '—', starter: '—', pro: '✓', agency: '✓' },
    { feature: 'Live Screen Wall Dashboard', free: '—', starter: '—', pro: '12 Screens', agency: 'Unlimited' },
    { feature: 'Advanced Diagnostic Analytics', free: '—', starter: '—', pro: '✓', agency: '✓' },
    { feature: 'White Label Report Exporting', free: '—', starter: '—', pro: '—', agency: '✓' },
    { feature: 'Dedicated Support Account Manager', free: '—', starter: '—', pro: '—', agency: '✓' },
    { feature: 'Response SLA Timeframes', free: 'Community', starter: 'Email (24h)', pro: 'Priority (4h)', agency: 'Dedicated Slack' }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.navBar}>
        <div style={styles.logoRow} onClick={() => onNav('landing')}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>AgentFlow</span>
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => onNav('landing')} style={styles.navLinkBtn}>Home</button>
          <button onClick={() => onNav('dashboard')} style={styles.navLinkBtn}>Dashboard</button>
          <button onClick={() => onNav('login')} style={styles.ghostBtn}>Sign In</button>
        </div>
      </header>

      <section style={styles.heroSection}>
        <h1 style={styles.title}>Flexible Plans for Any Scale</h1>
        <p style={styles.subtitle}>Start with a 7-day free trial. No credit card required. Upgrade when you need more capacity.</p>

        {/* Toggle */}
        <div style={styles.pricingToggleContainer}>
          <button
            onClick={() => setAnnual(false)}
            style={{
              ...styles.toggleBtn,
              ...(!annual ? styles.toggleBtnActive : {})
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              ...styles.toggleBtn,
              ...(annual ? styles.toggleBtnActive : {})
            }}
          >
            Annual (Save 33%)
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section style={styles.cardsSection}>
        <div style={styles.pricingGrid}>
          {/* Plan 1: Starter */}
          <div style={styles.priceCard}>
            <h3 style={styles.priceCardTitle}>STARTER</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                ${annual ? PRICES.starter.annual : PRICES.starter.monthly}
              </span>
              <span style={styles.pricePeriod}>
                {annual ? '/yr' : '/mo'}
              </span>
            </div>
            <p style={styles.billingSubtext}>{annual ? 'Billed annually ($190/yr)' : 'Billed monthly'}</p>
            <ul style={styles.priceFeatures}>
              {FEATURES.starter.map((feat, i) => (
                <li key={i} style={styles.priceFeaturesLi}>✓ {feat}</li>
              ))}
            </ul>
            <button
              onClick={() => window.open(getCheckoutUrl('starter', annual), '_blank')}
              style={styles.priceBtn}
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 2: Pro (Featured) */}
          <div style={{...styles.priceCard, ...styles.priceCardFeatured}}>
            <div style={styles.featuredTag}>MOST POPULAR</div>
            <h3 style={styles.priceCardTitle}>PRO</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                ${annual ? PRICES.pro.annual : PRICES.pro.monthly}
              </span>
              <span style={styles.pricePeriod}>
                {annual ? '/yr' : '/mo'}
              </span>
            </div>
            <p style={styles.billingSubtextFeatured}>{annual ? 'Billed annually ($490/yr)' : 'Billed monthly'}</p>
            <ul style={styles.priceFeatures}>
              {FEATURES.pro.map((feat, i) => (
                <li key={i} style={styles.priceFeaturesLi}>✓ {feat}</li>
              ))}
            </ul>
            <button
              onClick={() => window.open(getCheckoutUrl('pro', annual), '_blank')}
              style={styles.priceBtnFeatured}
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 3: Agency */}
          <div style={styles.priceCard}>
            <h3 style={styles.priceCardTitle}>AGENCY</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                ${annual ? PRICES.agency.annual : PRICES.agency.monthly}
              </span>
              <span style={styles.pricePeriod}>
                {annual ? '/yr' : '/mo'}
              </span>
            </div>
            <p style={styles.billingSubtext}>{annual ? 'Billed annually ($990/yr)' : 'Billed monthly'}</p>
            <ul style={styles.priceFeatures}>
              {FEATURES.agency.map((feat, i) => (
                <li key={i} style={styles.priceFeaturesLi}>✓ {feat}</li>
              ))}
            </ul>
            <button
              onClick={() => window.open(getCheckoutUrl('agency', annual), '_blank')}
              style={styles.priceBtn}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={styles.tableSection}>
        <h2 style={styles.tableTitle}>Compare Full Features Matrix</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHeader}>
                <th style={styles.thFirst}>Feature Capability</th>
                <th style={styles.th}>Free</th>
                <th style={styles.th}>Starter</th>
                <th style={styles.thFeatured}>Pro</th>
                <th style={styles.th}>Agency</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.tdFirst}>{row.feature}</td>
                  <td style={styles.td}>{row.free}</td>
                  <td style={styles.td}>{row.starter}</td>
                  <td style={styles.tdFeatured}>{row.pro}</td>
                  <td style={styles.td}>{row.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0a0a0f',
    color: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '22px',
    color: '#f5b731',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    padding: 0,
  },
  ghostBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  heroSection: {
    textAlign: 'center',
    padding: '80px 24px 30px 24px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#8e92b2',
    margin: '0 0 32px 0',
    maxWidth: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.5,
  },
  pricingToggleContainer: {
    display: 'inline-flex',
    backgroundColor: '#16161e',
    borderRadius: '8px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
  },
  toggleBtnActive: {
    backgroundColor: '#f5b731',
    color: '#0e0e16',
  },
  cardsSection: {
    padding: '0 24px',
  },
  pricingGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '24px',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
  },
  priceCard: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '40px 30px',
    flex: '1 1 290px',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    textAlign: 'left',
  },
  priceCardFeatured: {
    border: '2px solid #f5b731',
    transform: 'scale(1.03)',
    boxShadow: '0 10px 30px rgba(245, 183, 49, 0.1)',
  },
  featuredTag: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '3px 12px',
    borderRadius: '12px',
  },
  priceCardTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#8e92b2',
    letterSpacing: '1.5px',
    margin: '0 0 16px 0',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '4px',
  },
  priceVal: {
    fontSize: '40px',
    fontWeight: '900',
    color: '#ffffff',
  },
  pricePeriod: {
    fontSize: '16px',
    color: '#8e92b2',
    marginLeft: '4px',
  },
  billingSubtext: {
    fontSize: '11px',
    color: '#8e92b2',
    margin: '0 0 24px 0',
  },
  billingSubtextFeatured: {
    fontSize: '11px',
    color: '#f5b731',
    margin: '0 0 24px 0',
    fontWeight: '600',
  },
  priceFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 36px 0',
    flexGrow: 1,
  },
  priceFeaturesLi: {
    fontSize: '13.5px',
    color: '#e2e8f0',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    lineHeight: 1.4,
  },
  priceBtn: {
    width: '100%',
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  priceBtnFeatured: {
    width: '100%',
    padding: '12px 0',
    backgroundColor: '#f5b731',
    border: 'none',
    color: '#0e0e16',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  tableSection: {
    padding: '80px 24px 30px 24px',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tableTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '32px',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    backgroundColor: '#16161e',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left',
  },
  trHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  thFirst: {
    padding: '16px 20px',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  th: {
    padding: '16px 20px',
    color: '#8e92b2',
    fontWeight: 'bold',
  },
  thFeatured: {
    padding: '16px 20px',
    color: '#f5b731',
    fontWeight: 'bold',
    backgroundColor: 'rgba(245, 183, 49, 0.03)',
  },
  trEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  trOdd: {
    backgroundColor: 'transparent',
  },
  tdFirst: {
    padding: '14px 20px',
    color: '#ffffff',
    fontWeight: '500',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '14px 20px',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  tdFeatured: {
    padding: '14px 20px',
    color: '#ffffff',
    fontWeight: '600',
    backgroundColor: 'rgba(245, 183, 49, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  }
};
