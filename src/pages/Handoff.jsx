import { useState } from 'react';

const MOCK_HANDOFFS = [
  { id: 1, from: 'Claude', to: 'GPT-4', status: 'completed', task: 'Code review and optimization', tokens: 12840, time: '2m ago' },
  { id: 2, from: 'GPT-4', to: 'Gemini', status: 'active', task: 'UI component generation', tokens: 8200, time: '5m ago' },
  { id: 3, from: 'Gemini', to: 'Claude', status: 'queued', task: 'Test suite generation', tokens: 0, time: 'pending' },
  { id: 4, from: 'Claude', to: 'GPT-4', status: 'completed', task: 'API documentation writing', tokens: 15300, time: '18m ago' },
  { id: 5, from: 'GPT-4', to: 'Manus', status: 'failed', task: 'Browser automation task', tokens: 3100, time: '32m ago' },
];

const STATUS_COLORS = {
  completed: '#10b981',
  active: '#6366f1',
  queued: '#f59e0b',
  failed: '#ef4444',
};

export default function Handoff() {
  const [handoffs, setHandoffs] = useState(MOCK_HANDOFFS);
  const totalTokens = handoffs.reduce((a, h) => a + h.tokens, 0);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🔄 Handoff Manager</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Manage context handoffs between AI agents and platforms seamlessly.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Handoffs', value: handoffs.length, icon: '🔄' },
          { label: 'Active', value: handoffs.filter(h => h.status === 'active').length, icon: '⚡' },
          { label: 'Completed', value: handoffs.filter(h => h.status === 'completed').length, icon: '✅' },
          { label: 'Tokens Transferred', value: `${(totalTokens / 1000).toFixed(1)}k`, icon: '🪙' },
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

      {/* Handoffs table */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Handoff Queue</span>
          <button
            onClick={() => setHandoffs(prev => [
              { id: Date.now(), from: 'Claude', to: 'GPT-4', status: 'queued', task: 'New task queued', tokens: 0, time: 'just now' },
              ...prev,
            ])}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: 'rgba(99,102,241,0.2)',
              color: '#6366f1',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            + New Handoff
          </button>
        </div>

        {handoffs.map((h, i) => (
          <div
            key={h.id}
            style={{
              padding: '14px 20px',
              borderBottom: i < handoffs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{h.from}</span>
              <span style={{ fontSize: 16, color: 'var(--muted)' }}>→</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{h.to}</span>
            </div>
            <div style={{ flex: 1, fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {h.task}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', minWidth: 70 }}>
              {h.tokens > 0 ? `${h.tokens.toLocaleString()} tok` : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', minWidth: 60 }}>{h.time}</div>
            <span style={{
              fontSize: 10,
              padding: '3px 9px',
              borderRadius: 99,
              background: STATUS_COLORS[h.status] + '20',
              color: STATUS_COLORS[h.status],
              fontWeight: 600,
              textTransform: 'capitalize',
              minWidth: 70,
              textAlign: 'center',
            }}>
              {h.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
