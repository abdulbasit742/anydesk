import { useState } from 'react';

const PLATFORMS = [
  // University & Academic Infrastructure
  { id: 'university-hpc', name: 'University HPC Cluster', icon: '🏛️', status: 'connected', sessions: 4, category: 'University', desc: 'Slurm compute nodes & GPU cluster' },
  { id: 'eduroam-lab', name: 'Eduroam Lab VDI Node', icon: '🎓', status: 'connected', sessions: 8, category: 'University', desc: 'Virtual Lab Desktop over Eduroam Proxy' },
  { id: 'guacamole-ws', name: 'Guacamole Workstation', icon: '🔬', status: 'connected', sessions: 2, category: 'University', desc: 'Engineering & Physics simulation lab' },
  { id: 'campus-library', name: 'Digital Library Node', icon: '📚', status: 'idle', sessions: 0, category: 'University', desc: 'Campus journals & dataset archive' },

  // AI & Development Clouds
  { id: 'bolt', name: 'Bolt.new', icon: '⚡', status: 'connected', sessions: 3, category: 'AI Cloud', desc: 'Fullstack WebContainer dev' },
  { id: 'lovable', name: 'Lovable', icon: '💜', status: 'connected', sessions: 1, category: 'AI Cloud', desc: 'Autonomous frontend engineering' },
  { id: 'cursor', name: 'Cursor', icon: '🎯', status: 'idle', sessions: 0, category: 'AI Cloud', desc: 'AI code editor & indexing' },
  { id: 'claude', name: 'Claude.ai', icon: '🤖', status: 'connected', sessions: 5, category: 'AI Cloud', desc: 'Artifacts & code reasoning' },
  { id: 'chatgpt', name: 'ChatGPT', icon: '💬', status: 'connected', sessions: 2, category: 'AI Cloud', desc: 'Advanced data analysis & tools' },
  { id: 'gemini', name: 'Gemini', icon: '✨', status: 'idle', sessions: 0, category: 'AI Cloud', desc: 'Multimodal workspace engine' },
  { id: 'replit', name: 'Replit', icon: '🔧', status: 'error', sessions: 0, category: 'AI Cloud', desc: 'Cloud workspace container' },
  { id: 'v0', name: 'v0.dev', icon: '🎨', status: 'connected', sessions: 1, category: 'AI Cloud', desc: 'Generative UI component generator' },
];

const STATUS_COLORS = {
  connected: '#10b981',
  idle: '#f59e0b',
  error: '#ef4444',
};

export default function RemoteHome({ onNav }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = PLATFORMS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.desc && p.desc.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalConnected = PLATFORMS.filter(p => p.status === 'connected').length;
  const totalSessions = PLATFORMS.reduce((a, p) => a + p.sessions, 0);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header with Eduroam Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🖥️ Remote Desktop & University Hub</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Manage remote connections to University campus HPC labs, Eduroam VDI nodes, and AI development environments.
          </p>
        </div>

        {/* Eduroam Proxy Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 99,
          fontSize: 12,
          color: '#10b981',
          fontWeight: 600,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          Eduroam Tunnel: 172.30.10.10:3128 (Active)
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Platforms', value: PLATFORMS.length, icon: '🌐' },
          { label: 'Connected Nodes', value: totalConnected, icon: '✅' },
          { label: 'Total Sessions', value: totalSessions, icon: '🔗' },
          { label: 'Campus Uptime', value: '99.9%', icon: '📊' },
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

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          {['all', 'University', 'AI Cloud'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: category === cat ? '#6366f1' : 'transparent',
                color: category === cat ? '#fff' : 'var(--muted)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat === 'all' ? 'All Environments' : cat}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campus nodes or AI platforms..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: '8px 14px',
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: '#e2e8f0',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Platform grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{platform.icon}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: STATUS_COLORS[platform.status],
                    boxShadow: `0 0 6px ${STATUS_COLORS[platform.status]}`,
                  }} />
                  <span style={{ fontSize: 10, color: STATUS_COLORS[platform.status], textTransform: 'capitalize', fontWeight: 600 }}>
                    {platform.status}
                  </span>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{platform.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{platform.desc}</div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {platform.sessions} session{platform.sessions !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
                {platform.category}
              </span>
            </div>

            {selected === platform.id && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNav) onNav('remote-session');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#6366f1',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Connect Now
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'transparent',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: 11,
                  }}
                >
                  Configure
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
