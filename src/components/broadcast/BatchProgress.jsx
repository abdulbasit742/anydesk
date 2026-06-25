// BatchProgress.jsx — Multi-account broadcast progress tracker

const STATUS_META = {
  queued: { color: '#444', label: '○ Queued', anim: false },
  running: { color: '#FFB800', label: '⟳ Sending...', anim: true },
  done: { color: '#00FF88', label: '✓ Done', anim: false },
  error: { color: '#FF4D4D', label: '✗ Error', anim: false },
};

function ProgressRow({ item }) {
  const meta = STATUS_META[item.status] || STATUS_META.queued;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <span style={{ color: meta.color, fontSize: 12, minWidth: 100, fontFamily: 'monospace' }}>{meta.label}</span>
      <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace', flex: 1 }}>{item.label || item.id}</span>
    </div>
  );
}

export function BatchProgress({ items = [] }) {
  const done = items.filter(i => i.status === 'done').length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, padding: 16, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: '#555', fontSize: 12 }}>BROADCAST PROGRESS</span>
        <span style={{ color: '#00FFAA', fontSize: 12, fontWeight: 'bold' }}>{done}/{total} ({pct}%)</span>
      </div>
      <div style={{ height: 6, background: '#1a1e2e', borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#00FFAA', borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ maxHeight: 180, overflowY: 'auto' }}>
        {items.map((item, i) => <ProgressRow key={i} item={item} />)}
      </div>
    </div>
  );
}
