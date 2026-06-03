import { useState } from 'react';

export default function Pricing({ onNav }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const starterLink = import.meta.env.VITE_STRIPE_STARTER || '#';
  const proLink = import.meta.env.VITE_STRIPE_PRO || '#';


  const comparisonRows = [
    { feature: 'AI Accounts Connected', free: '2', starter: '5', pro: '25', agency: 'Unlimited' },
    { feature: 'AES-256 Client-Side Encryption', free: '✓', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Live Credit Telemetry', free: '✓', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Automatic Credit Relay Switch', free: '—', starter: '✓', pro: '✓', agency: '✓' },
    { feature: 'Trigger Warning Thresholds', free: '—', starter: '10%-30%', pro: 'Customizable', agency: 'Customizable' },
    { feature: 'Concurrent Fleet Broadcasts', free: '—', starter: '—', pro: '✓', agency: '✓' },
    { feature: 'Live Screen Wall Dashboard', free: '—', starter: '—', pro: '12 Screens', agency: 'Unlimited Screens' },
    { feature: 'Advanced Analytics Logs', free: '—', starter: '—', pro: '✓', agency: '✓' },
    { feature: 'White Label Telemetry Export', free: '—', starter: '—', pro: '—', agency: '✓' },
    { feature: 'Dedicated Account Manager', free: '—', starter: '—', pro: '—', agency: '✓' },
    { feature: 'Response Support SLAs', free: 'Community', starter: 'Email (24h)', pro: 'Priority (4h)', agency: 'Dedicated Slack' }
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
            onClick={() => setBillingPeriod('monthly')} 
            style={{
              ...styles.toggleBtn,
              ...(billingPeriod === 'monthly' ? styles.toggleBtnActive : {})
            }}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingPeriod('annual')} 
            style={{
              ...styles.toggleBtn,
              ...(billingPeriod === 'annual' ? styles.toggleBtnActive : {})
            }}
          >
            Annual (Save 33%)
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section style={styles.cardsSection}>
        <div style={styles.pricingGrid}>
          {/* Plan 1 */}
          <div style={styles.priceCard}>
            <h3 style={styles.priceCardTitle}>STARTER</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                {billingPeriod === 'monthly' ? '$19' : '$12.60'}
              </span>
              <span style={styles.pricePeriod}>
                {billingPeriod === 'monthly' ? '/mo' : '/mo billed annually'}
              </span>
            </div>
            <ul style={styles.priceFeatures}>
              <li>✓ 5 AI accounts</li>
              <li>✓ Credit relay system</li>
              <li>✓ Basic scheduler</li>
              <li>✓ Email support</li>
            </ul>
            <button onClick={() => window.open(starterLink, '_blank')} style={styles.priceBtn}>
              Start Free Trial
            </button>
          </div>

          {/* Plan 2 */}
          <div style={{...styles.priceCard, ...styles.priceCardFeatured}}>
            <div style={styles.featuredTag}>MOST POPULAR</div>
            <h3 style={styles.priceCardTitle}>PRO</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                {billingPeriod === 'monthly' ? '$49' : '$32.60'}
              </span>
              <span style={styles.pricePeriod}>
                {billingPeriod === 'monthly' ? '/mo' : '/mo billed annually'}
              </span>
            </div>
            <ul style={styles.priceFeatures}>
              <li>✓ 25 AI accounts</li>
              <li>✓ Everything in Starter</li>
              <li>✓ Fleet prompt execution</li>
              <li>✓ 12-screen agent wall</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <button onClick={() => window.open(proLink, '_blank')} style={styles.priceBtnFeatured}>
              Start Free Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div style={styles.priceCard}>
            <h3 style={styles.priceCardTitle}>AGENCY</h3>
            <div style={styles.priceContainer}>
              <span style={styles.priceVal}>
                {billingPeriod === 'monthly' ? '$99' : '$66'}
              </span>
              <span style={styles.pricePeriod}>
                {billingPeriod === 'monthly' ? '/mo' : '/mo billed annually'}
              </span>
            </div>
            <ul style={styles.priceFeatures}>
              <li>✓ Unlimited accounts</li>
              <li>✓ Everything in Pro</li>
              <li>✓ White label dashboards</li>
              <li>✓ Dedicated support agent</li>
              <li>✓ Team member profiles</li>
            </ul>
            <a href="mailto:support@agentflow.ai" style={styles.priceBtnLink}>
              Contact Us
            </a>
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
                <th style={styles.thFirst}>Feature</th>
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

      {/* Questions? Chat with us */}
      <section style={styles.chatSection}>
        <div style={styles.chatBox}>
          <span style={{ fontSize: '36px', marginBottom: '8px', display: 'block' }}>💬</span>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#ffffff' }}>Questions? Chat with us</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#8e92b2' }}>
            We're online and happy to answer any questions about configurations, billing, or platform support.
          </p>
          <button 
            onClick={() => alert('Chat widget activated! (Simulated Crisp chat initialization)')} 
            style={styles.chatBtn}
          >
            Start Live Chat
          </button>
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
    marginBottom: '28px',
  },
  priceVal: {
    fontSize: '40px',
    fontWeight: '900',
    color: '#ffffff',
  },
  pricePeriod: {
    fontSize: '13px',
    color: '#8e92b2',
    marginLeft: '4px',
  },
  priceFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 36px 0',
    flexGrow: 1,
    fontSize: '13px',
    color: '#e2e8f0',
    lineHeight: 2,
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
  priceBtnLink: {
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
    textDecoration: 'none',
    display: 'inline-block',
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
  },
  chatSection: {
    padding: '40px 24px',
    maxWidth: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chatBox: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
  },
  chatBtn: {
    padding: '10px 24px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }
};
