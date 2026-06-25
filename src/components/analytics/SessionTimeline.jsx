// SessionTimeline.jsx — Session activity timeline visualization
import { useState } from 'react';

export function SessionTimeline({ sessions = [] }) {
  const [demo] = useState(() => sessions.length ? sessions : Array.from({ length: 5 }, (_, i) => ({
    id: `sess_${i}`, platform: ['bolt', 'lovable', 'claude', 'manus', 'replit'][i],
    startedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    duration: Math.floor(Math.random() * 60) + 5,
    success: Math.random() > 0.2,
  })));

  const COLORS = { bolt: '#FFB800', lovable: '#FF4D8F', claude: '#D4571A', manus: '#1A9FD4', replit: '#F26207' };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      {demo.map(s => (
        <div key={s.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #111a30' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[s.platform] || '#888', marginTop: 5, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: COLORS[s.platform] || '#aaa', fontSize: 12 }}>{s.platform}</span>
              <span style={{ color: s.success ? '#00FF88' : '#FF4D4D', fontSize: 11 }}>{s.success ? '✓' : '✗'}</span>
            </div>
            <div style={{ color: '#333', fontSize: 11, marginTop: 2 }}>
              {new Date(s.startedAt).toLocaleTimeString()} · {s.duration}min
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
