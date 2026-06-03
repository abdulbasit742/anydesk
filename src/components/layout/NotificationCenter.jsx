// NotificationCenter.jsx — Slide-in notifications panel
import { useState } from 'react';

const SAMPLE_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Broadcast complete', message: '5/5 accounts received prompt', ts: Date.now() - 120000 },
  { id: 2, type: 'warn', title: 'Key expiring soon', message: 'Bolt.new API key expires in 12 days', ts: Date.now() - 3600000 },
  { id: 3, type: 'info', title: 'Workflow finished', message: 'Security Audit workflow completed', ts: Date.now() - 7200000 },
];

const TYPE_COLORS = { success: '#00FF88', warn: '#FFB800', error: '#FF4D4D', info: '#6699FF' };

export function NotificationCenter({ onClose }) {
  const [now] = useState(() => Date.now());
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const dismiss = (id) => setNotifications(n => n.filter(x => x.id !== id));
  const timeAgo = (ts) => { const s = Math.floor((now - ts) / 1000); if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s / 60)}m ago`; return `${Math.floor(s / 3600)}h ago`; };

  return (
    <div style={{ width: 320, background: '#0a0e1a', borderLeft: '1px solid #1e2340', display: 'flex', flexDirection: 'column', fontFamily: 'monospace', flexShrink: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2340', display: 'flex', alignItems: 'center' }}>
        <h3 style={{ flex: 1, margin: 0, fontSize: 13, color: '#e0e0e0' }}>Notifications</h3>
        <button onClick={() => setNotifications([])} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 11 }}>Clear all</button>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, marginLeft: 8 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {notifications.length === 0 && <div style={{ textAlign: 'center', color: '#333', padding: 40, fontSize: 13 }}>All clear</div>}
        {notifications.map(n => (
          <div key={n.id} style={{ background: '#0d1020', border: `1px solid ${TYPE_COLORS[n.type]}22`, borderRadius: 8, padding: 12, marginBottom: 8, position: 'relative' }}>
            <button onClick={() => dismiss(n.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: 14 }}>×</button>
            <div style={{ color: TYPE_COLORS[n.type], fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{n.title}</div>
            <div style={{ color: '#888', fontSize: 12 }}>{n.message}</div>
            <div style={{ color: '#333', fontSize: 10, marginTop: 4 }}>{timeAgo(n.ts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
