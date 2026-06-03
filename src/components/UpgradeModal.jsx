import { useEffect } from 'react';

export default function UpgradeModal({ feature, onClose }) {
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCardClick = (url) => {
    window.open(url, '_blank');
  };

  const plansList = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$19',
      billing: '/mo',
      desc: 'Ideal for getting started with multi-account routing.',
      features: ['5 AI accounts', 'Credit relay system', 'Basic scheduler', 'Email support'],
      link: import.meta.env.VITE_STRIPE_STARTER || '#'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      billing: '/mo',
      desc: 'Our most popular plan for power users and developers.',
      features: ['25 AI accounts', 'Credit relay system', 'Fleet prompt capability', '12-screen agent wall', 'Advanced analytics', 'Priority support'],
      link: import.meta.env.VITE_STRIPE_PRO || '#',
      featured: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '$99',
      billing: '/mo',
      desc: 'Designed for production workloads and team operation.',
      features: ['Unlimited accounts', 'Everything in Pro', 'White label reports', 'Team management', 'Dedicated support', 'Unlimited relays'],
      link: import.meta.env.VITE_STRIPE_AGENCY || '#'
    }
  ];

  return (
    <div className="upgrade-modal-overlay" style={styles.overlay}>
      <div className="upgrade-modal-content" style={styles.content}>
        <button className="upgrade-modal-close" onClick={onClose} style={styles.closeBtn}>×</button>
        
        <div style={styles.header}>
          <div style={styles.badge}>PRO FEATURE</div>
          <h2 style={styles.title}>Unlock {feature ? feature.toUpperCase() : 'Premium Features'}</h2>
          <p style={styles.subtitle}>
            Your current plan doesn't include access to this feature. Upgrade to continue building without limits.
          </p>
        </div>

        <div className="upgrade-plans-grid" style={styles.grid}>
          {plansList.map(plan => (
            <div 
              key={plan.id} 
              style={{
                ...styles.card,
                ...(plan.featured ? styles.featuredCard : {})
              }}
            >
              {plan.featured && (
                <div style={styles.featuredBadge}>MOST POPULAR</div>
              )}
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.priceContainer}>
                <span style={styles.price}>{plan.price}</span>
                <span style={styles.billing}>{plan.billing}</span>
              </div>
              <p style={styles.planDesc}>{plan.desc}</p>
              
              <ul style={styles.featuresList}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={styles.featureItem}>
                    <span style={styles.checkIcon}>✓</span> {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCardClick(plan.link)} 
                style={{
                  ...styles.planBtn,
                  ...(plan.featured ? styles.featuredBtn : {})
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.backBtn}>Maybe Later</button>
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
  },
  content: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '40px 32px 32px 32px',
    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
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
    transition: 'color 0.2s',
    outline: 'none',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
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
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8e92b2',
    margin: 0,
    maxWidth: '540px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  featuredCard: {
    border: '1px solid #f5b731',
    boxShadow: '0 0 20px rgba(245, 183, 49, 0.1)',
    transform: 'scale(1.02)',
  },
  featuredBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f5b731',
    color: '#000000',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '3px 12px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },
  planName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 12px 0',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '16px',
  },
  price: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  billing: {
    fontSize: '14px',
    color: '#8e92b2',
    marginLeft: '4px',
  },
  planDesc: {
    fontSize: '13px',
    color: '#8e92b2',
    margin: '0 0 24px 0',
    lineHeight: 1.5,
    minHeight: '40px',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 32px 0',
    flexGrow: 1,
  },
  featureItem: {
    fontSize: '13px',
    color: '#e2e8f0',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    lineHeight: 1.4,
  },
  checkIcon: {
    color: '#22d3ee',
    fontWeight: 'bold',
  },
  planBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  featuredBtn: {
    backgroundColor: '#f5b731',
    border: 'none',
    color: '#0e0e16',
  },
  footer: {
    textAlign: 'center',
    marginTop: '12px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'underline',
  }
};
