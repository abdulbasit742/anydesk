import { useState } from 'react';

const PLATFORMS = [
  { id: 'bolt', name: 'Bolt.new', icon: '⚡', status: 'connected', sessions: 3 },
  { id: 'lovable', name: 'Lovable', icon: '💜', status: 'connected', sessions: 1 },
  { id: 'cursor', name: 'Cursor', icon: '🎯', status: 'idle', sessions: 0 },
  { id: 'claude', name: 'Claude.ai', icon: '🤖', status: 'connected', sessions: 5 },
  { id: 'chatgpt', name: 'ChatGPT', icon: '💬', status: 'connected', sessions: 2 },
  { id: 'gemini', name: 'Gemini', icon: '✨', status: 'idle', sessions: 0 },
  { id: 'replit', name: 'Replit', icon: '🔧', status: 'error', sessions: 0 },
  { id: 'v0', name: 'v0.dev', icon: '🎨', status: 'connected', sessions: 1 },
];

const STATUS_COLORS = {
  connected: '#10b981',
  idle: '#f59e0b',
  error: '#ef4444',
};

export default function RemoteHome() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalConnected = PLATFORMS.filter(p => p.status === 'connected').length;
  const totalSessions = PLATFORMS.reduce((a, p) => a + p.sessions, 0);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🖥️ Remote Desktop Hub</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Manage remote connections to all your AI platforms and development environments.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Platforms', value: PLATFORMS.length, icon: '🌐' },
          { label: 'Connected', value: totalConnected, icon: '✅' },
          { label: 'Active Sessions', value: totalSessions, icon: '🔗' },
          { label: 'Uptime', value: '99.8%', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search platforms..."
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--card)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          color: '#e2e8f0',
          fontSize: 13,
          marginBottom: 16,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Platform grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.map(platform => (
          <div
            key={platform.id}
            onClick={() => setSelected(platform.id === selected ? null : platform.id)}
            style={{
              background: selected === platform.id ? 'rgba(99,102,241,0.1)' : 'var(--card)',
              border: `1px solid ${selected === platform.id ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12,
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{platform.icon}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: STATUS_COLORS[platform.status],
                  boxShadow: `0 0 6px ${STATUS_COLORS[platform.status]}`,
                }} />
                <span style={{ fontSize: 10, color: STATUS_COLORS[platform.status], textTransform: 'capitalize' }}>
                  {platform.status}
                </span>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{platform.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {platform.sessions} active session{platform.sessions !== 1 ? 's' : ''}
            </div>

            {selected === platform.id && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'rgba(99,102,241,0.2)',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  Connect
                </button>
                <button style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: 11,
                }}>
                  Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
