// AlertsFeed.jsx — Recent alerts and events feed
import { useState } from 'react';

const TYPE_META = { critical: { color: '#FF4D4D', icon: '⛔' }, warn: { color: '#FFB800', icon: '⚠' }, info: { color: '#6699FF', icon: 'ℹ' }, success: { color: '#00FF88', icon: '✓' } };

export function AlertsFeed({ alerts = [], maxItems = 10 }) {
  const [now] = useState(() => Date.now());
  const [demo] = useState(() => alerts.length ? alerts : [
    { type: 'warn', message: 'API key expiring in 15 days', ts: Date.now() - 3600000 },
    { type: 'success', message: 'Broadcast completed: 8/8 accounts', ts: Date.now() - 7200000 },
    { type: 'info', message: 'New workflow "Security Audit" added', ts: Date.now() - 10800000 },
  ]);

  const timeAgo = (ts) => {
    const m = Math.floor((now - ts) / 60000);
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      {demo.slice(0, maxItems).map((a, i) => {
        const meta = TYPE_META[a.type] || TYPE_META.info;
        return (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #111a30', alignItems: 'flex-start' }}>
            <span style={{ color: meta.color, fontSize: 14, flexShrink: 0 }}>{meta.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#ccc', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.message}</div>
              <div style={{ color: '#333', fontSize: 10, marginTop: 2 }}>{timeAgo(a.ts)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
