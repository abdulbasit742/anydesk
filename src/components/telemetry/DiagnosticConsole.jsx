// DiagnosticConsole.jsx — Monospace log screen for build sequences and handshake steps
import { useEffect, useRef, useState } from 'react';

const LOG_COLORS = {
  info: '#00FFAA',
  warn: '#FFB800',
  error: '#FF4D4D',
  success: '#88FF00',
  system: '#6699FF',
  debug: '#888',
};

export default function DiagnosticConsole({ logs = [], maxLines = 200, height = 280 }) {
  const bottomRef = useRef(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.level === filter);

  return (
    <div style={{
      background: '#080c14',
      border: '1px solid #1e2340',
      borderRadius: 8,
      overflow: 'hidden',
      fontFamily: 'monospace',
    }}>
      <div style={{ display: 'flex', gap: 6, padding: '6px 12px', borderBottom: '1px solid #1e2340', background: '#0d1020' }}>
        <span style={{ color: '#00FFAA', fontSize: 11, fontWeight: 'bold' }}>DIAGNOSTIC CONSOLE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {['all', 'info', 'warn', 'error', 'success'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#1e2340' : 'transparent',
              border: '1px solid #1e2340', borderRadius: 4,
              color: LOG_COLORS[f] || '#888', fontSize: 10, cursor: 'pointer', padding: '2px 6px',
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ height, overflowY: 'auto', padding: 12 }}>
        {filtered.slice(-maxLines).map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3, fontSize: 12 }}>
            <span style={{ color: '#444', minWidth: 80 }}>
              {log.ts ? new Date(log.ts).toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'}
            </span>
            <span style={{ color: LOG_COLORS[log.level] || '#888', minWidth: 60, textTransform: 'uppercase' }}>
              [{log.level || 'info'}]
            </span>
            <span style={{ color: '#ccd', flex: 1, wordBreak: 'break-word' }}>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
