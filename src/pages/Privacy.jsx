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

const SectionTitle = ({ children, color = '#22d3ee' }) => (
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

export default function Privacy() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 840, margin: '0 auto', paddingBottom: 40 }}>
      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(167,139,250,0.03) 100%)',
        border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: '24px 32px'
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, margin: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ margin: '4px 0 0', color: V.muted, fontSize: 13 }}>
          Last Updated: June 2, 2026 • Version 2.1.0
        </p>
      </div>

      <Card>
        <SectionTitle color={V.teal}>1. Information We Collect</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 16px 0' }}>
          At AgentFlow, we prioritize the confidentiality of your credentials and workspaces. To provide our account rotation and credit relay services, we collect:
        </p>
        <ul style={{ fontSize: 13, color: V.muted, lineHeight: 1.6, margin: '0 0 16px 20px', padding: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Account Authentication Credentials:</strong> Session cookies, workspace identifiers, and API keys you connect to coordinate broadcasts. These are encrypted using client-side derived keys before storage.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Telemetry and Relay Logs:</strong> Connection response timings, failure counts, and execution metrics to facilitate smart routing triggers.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Billing and Transaction Data:</strong> stripe customer IDs, active plan tiers, and subscription billing history metadata. No credit card details are processed directly on our servers.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle color={V.purple}>2. Cryptographic Security & Vault Storage</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 16px 0' }}>
          We employ advanced cryptographic protections to safeguard developer workspace access:
        </p>
        <ul style={{ fontSize: 13, color: V.muted, lineHeight: 1.6, margin: '0 0 16px 20px', padding: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>AES-256 Encryption:</strong> Your private workspace credentials are encrypted using AES-GCM (256-bit keys derived using PBKDF2 iterations) before committing to local/cloud database tables.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: '#fff' }}>Local Decryption:</strong> Private decryption keys remain local to your browser session context and are never broadcasted to third parties.
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle color={V.gold}>3. Cookie Usage and Tracking</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 12px 0' }}>
          AgentFlow uses browser cookies and local storage tokens to maintain your login session context, remember settings configurations (such as auto-run schedules or dark mode toggles), and coordinate referral partner clicks.
        </p>
        <p style={{ fontSize: 13, color: V.muted, lineHeight: 1.6, margin: 0 }}>
          We do not sell cookie telemetry datasets to advertising networks or external tracking aggregators.
        </p>
      </Card>

      <Card>
        <SectionTitle color={V.green}>4. Your Rights under GDPR & CCPA</SectionTitle>
        <p style={{ fontSize: 13, color: '#dde0f0', lineHeight: 1.6, margin: '0 0 14px 0' }}>
          Depending on your location, you have the following rights regarding your personal information:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
          {[
            { title: 'Right to Erase', desc: 'Wipe all credentials, linked platforms, billing customer profiles, and referral logs in 1-click.', icon: '🗑️' },
            { title: 'Right to Export', desc: 'Download a clean JSON zip folder enclosing all account variables and scheduling histories.', icon: '💾' },
            { title: 'Right to Audit', desc: 'Inspect transmission logs to track where prompt packets were directed and evaluated.', icon: '🔍' }
          ].map(right => (
            <div
              key={right.title}
              style={{
                background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10,
                padding: 14, textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{right.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{right.title}</div>
              <div style={{ fontSize: 10.5, color: V.muted, lineHeight: 1.4 }}>{right.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ textAlign: 'center', padding: '30px 20px' }}>
        <SectionTitle color="#fff">Questions or Security Audits?</SectionTitle>
        <p style={{ fontSize: 13, color: V.muted, margin: '0 0 20px 0', lineHeight: 1.5 }}>
          If you have questions about how we handle API vault credentials or wish to conduct a formal compliance review, contact our security officer.
        </p>
        <button
          onClick={() => { sound.play('success'); alert('[HELP HUB] Redirecting to security center...'); }}
          style={{
            padding: '10px 24px', borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.1))',
            border: `1px solid ${V.border}`, color: V.teal,
            fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: "'Syne', sans-serif"
          }}
        >
          📧 Contact Security Swarm
        </button>
      </Card>
    </div>
  );
}
