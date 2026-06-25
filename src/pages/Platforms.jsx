import { useState } from 'react';

const PLATFORM_LIST = [
  { id: 'bolt', name: 'Bolt.new', icon: '⚡', color: '#f59e0b', category: 'Builder', features: ['Component gen', 'Full-stack', 'Deploy'], status: 'active' },
  { id: 'lovable', name: 'Lovable', icon: '💜', color: '#8b5cf6', category: 'Builder', features: ['UI focus', 'React', 'Supabase'], status: 'active' },
  { id: 'cursor', name: 'Cursor', icon: '🎯', color: '#06b6d4', category: 'IDE', features: ['Code AI', 'Git', 'Debugging'], status: 'active' },
  { id: 'claude', name: 'Claude.ai', icon: '🤖', color: '#f97316', category: 'AI Chat', features: ['Long context', 'Analysis', 'Code'], status: 'active' },
  { id: 'chatgpt', name: 'ChatGPT', icon: '💬', color: '#10b981', category: 'AI Chat', features: ['GPT-4o', 'Plugins', 'Vision'], status: 'active' },
  { id: 'gemini', name: 'Gemini', icon: '✨', color: '#6366f1', category: 'AI Chat', features: ['Multimodal', 'Search', 'Flash'], status: 'active' },
  { id: 'replit', name: 'Replit', icon: '🔧', color: '#ef4444', category: 'IDE', features: ['Cloud IDE', 'Multiplayer', 'Deploy'], status: 'active' },
  { id: 'v0', name: 'v0.dev', icon: '🎨', color: '#ec4899', category: 'UI Gen', features: ['shadcn/ui', 'Next.js', 'Tailwind'], status: 'active' },
  { id: 'manus', name: 'Manus', icon: '🦾', color: '#14b8a6', category: 'Agent', features: ['Autonomous', 'Browsing', 'Actions'], status: 'beta' },
];

export default function Platforms() {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', 'Builder', 'IDE', 'AI Chat', 'UI Gen', 'Agent'];
  const filtered = filter === 'All' ? PLATFORM_LIST : PLATFORM_LIST.filter(p => p.category === filter);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🌐 Platforms</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>All connected AI platforms and development environments in one hub.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['grid', 'list'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '7px 12px',
                borderRadius: 6,
                border: `1px solid ${viewMode === mode ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                background: viewMode === mode ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: viewMode === mode ? '#6366f1' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {mode === 'grid' ? '⊞' : '≡'} {mode}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: 99,
              border: `1px solid ${filter === cat ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
              background: filter === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: filter === cat ? '#6366f1' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{
        display: viewMode === 'grid'
          ? 'grid'
          : 'flex',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        flexDirection: 'column',
        gap: 12,
      }}>
        {filtered.map(p => (
          <div
            key={p.id}
            style={{
              background: 'var(--card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '18px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: viewMode === 'list' ? 'flex' : 'block',
              alignItems: 'center',
              gap: viewMode === 'list' ? 16 : 0,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = p.color + '55'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ fontSize: viewMode === 'list' ? 28 : 32, marginBottom: viewMode === 'list' ? 0 : 10 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                <span style={{
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 99,
                  background: p.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: p.status === 'active' ? '#10b981' : '#f59e0b',
                }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: viewMode === 'list' ? 0 : 10 }}>
                {p.category}
              </div>
              {viewMode === 'grid' && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.features.map(f => (
                    <span key={f} style={{
                      fontSize: 10,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.5)',
                    }}>{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
