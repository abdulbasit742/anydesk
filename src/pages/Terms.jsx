import { sound } from '../lib/soundEngine';

const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  blue: '#60a5fa',
  green: '#22c55e',
};

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: `1px solid ${V.border}`,
    borderRadius: 12,
    padding: '24px 28px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#a78bfa' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color,
    margin: '0 0 14px 0',
  }}>{children}</h2>
);

export default function Terms() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 840, margin: '0 auto', paddingBottom: 40 }}>
      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(34,211,238,0.03) 100%)',
        border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: '24px 32px'
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, margin: 0 }}>
          Terms of Service
        </h1>
        <p style={{ margin: '4px 0 0', color: V.muted, fontSize: 13 }}>
          Last Updated: June 2, 2026 • Version 2.1.0
        </p>
      </div>

      <Card>
        <SectionTitle color={V.purple}>1. Acceptance of Terms</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: 0 }}>
          By creating an AgentFlow account or connecting workspace credentials to our platform, you agree to comply with and be bound by these Terms of Service. If you are entering into these terms on behalf of a company, you warrant that you have the authority to bind such entity.
        </p>
      </Card>

      <Card>
        <SectionTitle color={V.teal}>2. Workspace Integration & Fair Use</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 16px 0' }}>
          AgentFlow acts as a control orchestrator between your developer profiles (e.g. Bolt.new, Lovable, Replit, Manus, or Cursor). Users agree to follow these guidelines:
        </p>
        <ul style={{ fontSize: 13, color: V.muted, lineHeight: 1.6, margin: '0 0 16px 20px', padding: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Access Authority:</strong> You must own or hold explicit permissions to use session keys and API tokens connected to your account database.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Handoff Sweeps:</strong> Multi-account broadcasts must not overload target platform APIs or bypass platform-specific rate limits.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Scheduler Fair Use:</strong> Automated scheduler routines must be spaced by at least 10 seconds per execution thread.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle color={V.gold}>3. Credit Relays and Plan Gating</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 14px 0' }}>
          Our gating and billing frameworks are strictly regulated based on your active subscription:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
          {[
            { plan: 'Starter', limit: '5 Accounts Limit', desc: 'Allows basic ZIP folder handoffs. Restricts multi-agent fleet prompt broadcasts.', color: V.green },
            { plan: 'Pro', limit: '25 Accounts Limit', desc: 'Includes full multi-screen visual sweeps and smart language routing optimization.', color: V.purple },
            { plan: 'Agency', limit: 'Unlimited Access', desc: 'Grants fully custom white-label reports branding and prioritized server queues.', color: V.gold }
          ].map(tier => (
            <div
              key={tier.plan}
              style={{
                background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10,
                padding: 14, borderTop: `2.5px solid ${tier.color}`
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{tier.plan}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tier.color, margin: '4px 0 8px 0' }}>{tier.limit}</div>
              <div style={{ fontSize: 10.5, color: V.muted, lineHeight: 1.45 }}>{tier.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle color={V.blue}>4. Billing, Cancellations, and Discount Adjustments</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 12px 0' }}>
          Subscription payments are processed monthly or annually in advance. You can cancel your subscription at any time via the Billing portal, which will downgrade your profile to the Free Trial tier at the end of the current billing cycle.
        </p>
        <p style={{ fontSize: 13, color: V.muted, lineHeight: 1.6, margin: 0 }}>
          Any referral rewards or coupon code deductions (e.g. 50% discount codes) apply to standard price plans and cannot be combined or retroactively cash-refunded.
        </p>
      </Card>

      <Card>
        <SectionTitle color={V.red}>5. Disclaimer of Liabilities</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: 0 }}>
          AgentFlow is provided “as is” without warranties of any kind. We are not liable for account suspensions, cookie expiries, code compilations defects, or API service outages on external developer platforms connected via your credentials vault.
        </p>
      </Card>

      <Card style={{ textAlign: 'center', padding: '30px 20px' }}>
        <SectionTitle color="#fff">Ready to Accept Terms?</SectionTitle>
        <p style={{ fontSize: 13, color: V.muted, margin: '0 0 20px 0', lineHeight: 1.5 }}>
          Your continued access to AgentFlow dashboard services signifies consent to these terms.
        </p>
        <button
          onClick={() => { sound.play('success'); alert('[HELP HUB] Redirecting to terms confirmation...'); }}
          style={{
            padding: '10px 24px', borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(34,211,238,0.1))',
            border: `1px solid ${V.border}`, color: V.purple,
            fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: "'Syne', sans-serif"
          }}
        >
          ✓ Accept Terms of Service
        </button>
      </Card>
    </div>
  );
}
