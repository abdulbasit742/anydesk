import { useState } from 'react';

export default function Landing({ onNav }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const starterLink = import.meta.env.VITE_STRIPE_STARTER || '#';
  const proLink = import.meta.env.VITE_STRIPE_PRO || '#';


  const faqData = [
    {
      q: 'Which AI platforms are supported?',
      a: 'Claude, ChatGPT, Gemini, Bolt, Lovable, Manus, Replit, Cursor, Perplexity, and more being added.'
    },
    {
      q: 'Is my data secure?',
      a: 'All credentials are encrypted with AES-256. We never store plain text passwords.'
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Cancel with one click. No questions asked.'
    },
    {
      q: 'What happens when I hit my account limit?',
      a: 'You\'ll see an upgrade prompt. Your existing accounts keep working.'
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes — 2 accounts, basic features. Upgrade anytime.'
    }
  ];

  return (
    <div style={styles.container}>
      {/* HEADER / NAVIGATION BAR */}
      <header style={styles.navBar}>
        <div style={styles.logoRow} onClick={() => onNav('landing')}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>AgentFlow</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
          <a href="#faq" style={styles.navLink}>FAQ</a>
          <button onClick={() => onNav('login')} style={styles.ghostBtn}>Sign In</button>
          <button onClick={() => onNav('signup')} style={styles.smallGoldBtn}>Get Started</button>
        </div>
      </header>

      {/* SECTION 1 - HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroGlow} />
        <h1 style={styles.heroHeadline}>Run All Your AI Accounts Like One</h1>
        <p style={styles.heroSubheadline}>
          When credits run out, AgentFlow auto-switches to your next account. Your work never stops.
        </p>
        <div style={styles.heroActions}>
          <button onClick={() => onNav('signup')} style={styles.heroPrimaryBtn}>
            Start Free — No Card Needed
          </button>
          <a href="#features" style={styles.heroSecondaryBtn}>
            See How It Works
          </a>
        </div>
        <div style={styles.heroSocialText}>Join 500+ AI power users</div>
      </section>

      {/* SECTION 2 - PROBLEM */}
      <section id="problem" style={styles.section}>
        <h2 style={styles.sectionTitle}>The Pain of Managing Multiple AI Accounts</h2>
        <div style={styles.grid}>
          <div style={styles.painCard}>
            <span style={styles.cardIcon}>😤</span>
            <h3 style={styles.cardTitle}>Credits run out mid-task</h3>
            <p style={styles.cardText}>You lose your conversational context, progress, and generated outputs instantly when quotas exhaust.</p>
          </div>
          <div style={styles.painCard}>
            <span style={styles.cardIcon}>🔀</span>
            <h3 style={styles.cardTitle}>Wasting hours in tabs</h3>
            <p style={styles.cardText}>Constantly switching browser sessions, copy-pasting API keys, and managing multiple billing plans is a chore.</p>
          </div>
          <div style={styles.painCard}>
            <span style={styles.cardIcon}>📭</span>
            <h3 style={styles.cardTitle}>Siloed prompt execution</h3>
            <p style={styles.cardText}>No simple way to broadcast one prompt to all your active AI platforms at the same time to review outcomes.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SOLUTION */}
      <section id="features" style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Say Hello to Seamless Workflows</h2>
        <div style={styles.grid}>
          <div style={styles.solutionCard}>
            <span style={styles.cardIconGold}>⚡</span>
            <h3 style={styles.cardTitle}>Credit Relay</h3>
            <p style={styles.cardText}>
              AgentFlow detects when credits get low and automatically continues your work on the next account. Zero interruption.
            </p>
          </div>
          <div style={styles.solutionCard}>
            <span style={styles.cardIconGold}>📡</span>
            <h3 style={styles.cardTitle}>Fleet Prompt</h3>
            <p style={styles.cardText}>
              Type once, send to all 20 accounts simultaneously. Compare results, merge the best outputs in a single interface.
            </p>
          </div>
          <div style={styles.solutionCard}>
            <span style={styles.cardIconGold}>🖥️</span>
            <h3 style={styles.cardTitle}>12-Screen Wall</h3>
            <p style={styles.cardText}>
              Watch all your AI agents working at the same time on one screen. Real-time telemetry, console output, and status.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 - HOW IT WORKS */}
      <section id="how-it-works" style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.stepsConnectorLine} />

          <div style={styles.stepBlock}>
            <div style={styles.stepBadge}>1</div>
            <h4 style={styles.stepBlockTitle}>Add your AI accounts</h4>
            <p style={styles.stepBlockText}>Paste credentials or tokens. They are locally encrypted with AES-256 before leaving your client sandbox.</p>
          </div>

          <div style={styles.stepBlock}>
            <div style={styles.stepBadge}>2</div>
            <h4 style={styles.stepBlockTitle}>Set your preferences</h4>
            <p style={styles.stepBlockText}>Configure warning thresholds, execution schedules, event notifications, and relay auto-routing rules.</p>
          </div>

          <div style={styles.stepBlock}>
            <div style={styles.stepBadge}>3</div>
            <h4 style={styles.stepBlockTitle}>Let it run</h4>
            <p style={styles.stepBlockText}>AgentFlow runs in the background, executing scheduled prompts and handling relays autonomously.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - PRICING */}
      <section id="pricing" style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>

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

      {/* SECTION 6 - SOCIAL PROOF */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Loved by AI Power Users</h2>
        <div style={styles.grid}>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialQuote}>
              "Finally I don't lose work when my Claude credits run out. The relay is seamless, letting me finish my tasks automatically."
            </p>
            <div style={styles.testimonialAuthor}>— Alex M., AI Developer</div>
          </div>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialQuote}>
              "I manage 15 AI accounts for clients. AgentFlow is the only tool that makes this process possible, organized, and reliable."
            </p>
            <div style={styles.testimonialAuthor}>— Sarah K., AI Agency Founder</div>
          </div>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialQuote}>
              "Fleet prompt alone saves me 2 hours a day. Broadcasting tasks concurrently to compare output makes quality assurance simple."
            </p>
            <div style={styles.testimonialAuthor}>— David R., Researcher</div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - FAQ */}
      <section id="faq" style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqList}>
          {faqData.map((faq, i) => (
            <div key={i} style={styles.faqItem}>
              <button onClick={() => toggleFaq(i)} style={styles.faqQuestion}>
                <span>{faq.q}</span>
                <span>{activeFaq === i ? '−' : '+'}</span>
              </button>
              {activeFaq === i && (
                <div style={styles.faqAnswer}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 - FINAL CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start Managing All Your AI Accounts Today</h2>
        <p style={styles.ctaSubtitle}>Free for 7 days. No credit card required.</p>
        <button onClick={() => onNav('signup')} style={styles.ctaBtn}>
          Get Started Free
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>⚡</span>
            <span style={styles.logoText}>AgentFlow</span>
          </div>
          <div style={styles.footerLinks}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy policy statement details...'); }} style={styles.footerLink}>Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of service agreement details...'); }} style={styles.footerLink}>Terms of Service</a>
            <a href="mailto:support@agentflow.ai" style={styles.footerLink}>Contact</a>
          </div>
        </div>
        <div style={styles.footerCopyright}>
          © 2026 AgentFlow. Built for AI power users.
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0a0a0f',
    color: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
    scrollBehavior: 'smooth',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
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
  navLink: {
    color: '#8e92b2',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  ghostBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  smallGoldBtn: {
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '120px 24px 100px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    backgroundColor: 'rgba(245, 183, 49, 0.04)',
    filter: 'blur(100px)',
    borderRadius: '50%',
    zIndex: 1,
  },
  heroHeadline: {
    fontSize: '52px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 20px 0',
    letterSpacing: '-1.5px',
    maxWidth: '800px',
    lineHeight: 1.1,
    zIndex: 2,
  },
  heroSubheadline: {
    fontSize: '18px',
    color: '#8e92b2',
    margin: '0 0 40px 0',
    maxWidth: '580px',
    lineHeight: 1.6,
    zIndex: 2,
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    zIndex: 2,
  },
  heroPrimaryBtn: {
    padding: '14px 28px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(245, 183, 49, 0.25)',
  },
  heroSecondaryBtn: {
    padding: '14px 28px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  heroSocialText: {
    fontSize: '12px',
    color: '#8e92b2',
    fontWeight: '600',
    letterSpacing: '0.5px',
    zIndex: 2,
  },
  section: {
    padding: '80px 40px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  sectionAlt: {
    padding: '80px 40px',
    backgroundColor: '#0e0e16',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '48px',
    letterSpacing: '-0.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  painCard: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    padding: '36px 24px',
    textAlign: 'left',
  },
  solutionCard: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '36px 24px',
    textAlign: 'left',
  },
  cardIcon: {
    fontSize: '36px',
    marginBottom: '20px',
    display: 'block',
  },
  cardIconGold: {
    fontSize: '36px',
    color: '#f5b731',
    marginBottom: '20px',
    display: 'block',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 12px 0',
  },
  cardText: {
    fontSize: '14px',
    color: '#8e92b2',
    lineHeight: 1.5,
    margin: 0,
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: '40px',
    flexWrap: 'wrap',
  },
  stepsConnectorLine: {
    position: 'absolute',
    top: '36px',
    left: '80px',
    right: '80px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  stepBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 240px',
    zIndex: 2,
  },
  stepBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#16161e',
    border: '1.5px solid #f5b731',
    color: '#f5b731',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '16px',
  },
  stepBlockTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  stepBlockText: {
    fontSize: '13px',
    color: '#8e92b2',
    lineHeight: 1.5,
    margin: 0,
    maxWidth: '240px',
  },
  pricingToggleContainer: {
    display: 'inline-flex',
    backgroundColor: '#16161e',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '40px',
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
  },
  priceFeaturesLi: {
    fontSize: '13px',
    color: '#e2e8f0',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    transition: 'background-color 0.2s',
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
    boxShadow: '0 4px 12px rgba(245, 183, 49, 0.2)',
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
  testimonialCard: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'left',
  },
  testimonialQuote: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: '#e2e8f0',
    lineHeight: 1.6,
    margin: '0 0 16px 0',
  },
  testimonialAuthor: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#f5b731',
  },
  faqList: {
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
  },
  faqItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '16px 0',
  },
  faqQuestion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 0',
  },
  faqAnswer: {
    padding: '10px 0 6px 0',
    fontSize: '13.5px',
    color: '#8e92b2',
    lineHeight: 1.5,
  },
  ctaSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '100px 24px',
    textAlign: 'center',
    backgroundColor: 'rgba(245, 183, 49, 0.02)',
    borderTop: '1px solid rgba(245, 183, 49, 0.05)',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '950',
    color: '#ffffff',
    margin: '0 0 12px 0',
  },
  ctaSubtitle: {
    fontSize: '16px',
    color: '#8e92b2',
    margin: '0 0 32px 0',
  },
  ctaBtn: {
    padding: '16px 36px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(245, 183, 49, 0.25)',
  },
  footer: {
    backgroundColor: '#050508',
    padding: '60px 40px 30px 40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
    gap: '24px',
    marginBottom: '32px',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    fontSize: '13px',
    color: '#8e92b2',
    textDecoration: 'none',
  },
  footerCopyright: {
    fontSize: '12px',
    color: '#6e7191',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    paddingTop: '20px',
  }
};
