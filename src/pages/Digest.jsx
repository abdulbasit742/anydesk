import { useState } from 'react';

const DIGEST_ITEMS = [
  {
    id: 1, type: 'summary', icon: '📊', title: 'Daily Activity Summary',
    body: 'You dispatched 48 broadcasts across 6 platforms. Claude handled 23 tasks with an average quality score of 94%. Token spend: 48,200 (12% under budget).',
    time: 'Today, 9:00 AM', tags: ['daily', 'summary'],
  },
  {
    id: 2, type: 'insight', icon: '💡', title: 'Peak Performance Hours',
    body: 'Your AI agents perform best between 2PM–5PM. Response quality is 18% higher during this window. Consider scheduling complex tasks in this period.',
    time: 'Today, 8:30 AM', tags: ['insight', 'optimization'],
  },
  {
    id: 3, type: 'alert', icon: '⚠️', title: 'Credit Usage Warning',
    body: 'At current pace, you will exhaust your monthly credit allocation in 8 days. Consider upgrading your plan or reducing broadcast frequency.',
    time: 'Yesterday, 11:45 PM', tags: ['alert', 'billing'],
  },
  {
    id: 4, type: 'update', icon: '🔄', title: 'Platform Updates',
    body: 'Bolt.new deployed a new model (GPT-4o-mini) with 40% lower token costs. Gemini 1.5 Pro now supports 2M context window. Auto-migration complete.',
    time: 'Yesterday, 6:00 PM', tags: ['update', 'platform'],
  },
  {
    id: 5, type: 'summary', icon: '📈', title: 'Weekly Performance Report',
    body: 'Best week this month: 320 tasks completed, 94.2% success rate, 2.1M tokens processed across all accounts. Revenue impact: +$1,240 estimated.',
    time: 'Mon, 8:00 AM', tags: ['weekly', 'report'],
  },
];

const TYPE_COLORS = {
  summary: '#6366f1',
  insight: '#10b981',
  alert: '#f59e0b',
  update: '#06b6d4',
};

export default function Digest() {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'summary', 'insight', 'alert', 'update'];

  const filtered = filter === 'all' ? DIGEST_ITEMS : DIGEST_ITEMS.filter(d => d.type === filter);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>📰 Intelligence Digest</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          AI-curated summaries, insights, and alerts from across your automation empire.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 12px',
              borderRadius: 99,
              border: `1px solid ${filter === f ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
              background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: filter === f ? '#6366f1' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: 12,
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            background: 'var(--card)',
            border: `1px solid rgba(255,255,255,0.06)`,
            borderLeft: `3px solid ${TYPE_COLORS[item.type]}`,
            borderRadius: 12,
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.time}</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: '0 0 10px 0' }}>
              {item.body}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: TYPE_COLORS[item.type] + '20',
                  color: TYPE_COLORS[item.type],
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
