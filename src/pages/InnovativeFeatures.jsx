import { useState } from 'react';

const innovations = [
  {
    id: 'quantum-routing', title: 'Quantum Prompt Routing', icon: '⚛️',
    description: 'Route prompts intelligently across AI models based on complexity scores and cost optimization.',
    status: 'live', category: 'AI',
  },
  {
    id: 'neural-compress', title: 'Neural Context Compression', icon: '🧬',
    description: 'Compress large context windows using semantic embedding clustering to reduce token costs by 70%.',
    status: 'beta', category: 'AI',
  },
  {
    id: 'swarm-agents', title: 'Swarm Agent Coordination', icon: '🐝',
    description: 'Deploy swarms of specialized micro-agents that collaborate to solve complex multi-step tasks.',
    status: 'live', category: 'Automation',
  },
  {
    id: 'temporal-memory', title: 'Temporal Memory Engine', icon: '🕰️',
    description: 'Agents remember past interactions with time-weighted relevance decay for natural long-term memory.',
    status: 'beta', category: 'Memory',
  },
  {
    id: 'market-predict', title: 'Market Prediction Models', icon: '📈',
    description: 'ML-powered trend prediction for prompt performance, user behavior, and platform reliability.',
    status: 'coming', category: 'Analytics',
  },
  {
    id: 'zero-latency', title: 'Zero-Latency Streaming', icon: '⚡',
    description: 'Edge-cached AI responses with WebSocket streaming for sub-100ms perceived response times.',
    status: 'live', category: 'Performance',
  },
];

const STATUS = {
  live: { label: 'Live', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  beta: { label: 'Beta', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  coming: { label: 'Coming Soon', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
};

export default function InnovativeFeatures() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'AI', 'Automation', 'Memory', 'Analytics', 'Performance'];

  const filtered = filter === 'All' ? innovations : innovations.filter(f => f.category === filter);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🚀 Innovative Features</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Cutting-edge capabilities that push the boundaries of AI automation.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              border: `1px solid ${filter === cat ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
              background: filter === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: filter === cat ? '#6366f1' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(feature => {
          const s = STATUS[feature.status];
          return (
            <div
              key={feature.id}
              style={{
                background: 'var(--card)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{feature.icon}</span>
                <span style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 99,
                  background: s.bg,
                  color: s.color,
                  fontWeight: 600,
                }}>
                  {s.label}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#fff' }}>{feature.title}</h3>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>{feature.description}</p>
              <div style={{ marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {feature.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
