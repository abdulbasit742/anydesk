const SUPPORT_TARGETS = [
  { id: 'workstation', name: 'Workstation support', icon: '🖥️', note: 'Consent-first screen-view request' },
  { id: 'browser', name: 'Browser guidance', icon: '🌐', note: 'Local preview only' },
  { id: 'mobile', name: 'Mobile assistance', icon: '📱', note: 'Transport not implemented' },
];

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 18,
};

export default function RemoteHome({ onNav }) {
  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#a5b4fc', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          SkyDesk remote support prototype
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Consent-first support sessions</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 760, lineHeight: 1.6 }}>
          This repository does not currently establish a live remote-control connection. It prepares a short-lived support request,
          records explicit host consent, and opens a local UI preview only.
        </p>
      </div>

      <div role="status" style={{ ...cardStyle, marginBottom: 20, borderColor: 'rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.08)' }}>
        <strong style={{ color: '#fbbf24' }}>Prototype boundary:</strong>{' '}
        <span style={{ color: '#fde68a' }}>
          no device discovery, signalling, media capture, keyboard/mouse injection, clipboard access, file transfer, or unattended access is enabled.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          ['Consent', 'Required for every preview'],
          ['Transport', 'Not configured'],
          ['Remote input', 'Disabled'],
          ['Audit', 'Session-local timeline'],
        ].map(([label, value]) => (
          <div key={label} style={cardStyle}>
            <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>{label}</div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 650 }}>{value}</div>
          </div>
        ))}
      </div>

      <section aria-labelledby="support-targets-title">
        <h2 id="support-targets-title" style={{ fontSize: 16, marginBottom: 12 }}>Prepare a support request</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          {SUPPORT_TARGETS.map((target) => (
            <article key={target.id} style={cardStyle}>
              <div style={{ fontSize: 26, marginBottom: 10 }} aria-hidden="true">{target.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 6 }}>{target.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, minHeight: 38, lineHeight: 1.5 }}>{target.note}</p>
              <button
                type="button"
                onClick={() => onNav?.('remote-session')}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.45)',
                  background: 'rgba(99,102,241,0.16)', color: '#c7d2fe', cursor: 'pointer', fontWeight: 650,
                }}
              >
                Review consent flow
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
