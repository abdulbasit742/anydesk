import { useState } from 'react';

const MONITORS_INIT = [
  { id: 1, name: 'API Gateway', url: 'https://api.antigravity.io/health', status: 'up', rt: 42, uptime: 99.98, ssl: 91, lastCheck: '30s ago' },
  { id: 2, name: 'Auth Service', url: 'https://auth.antigravity.io/ping', status: 'up', rt: 67, uptime: 99.95, ssl: 30, lastCheck: '30s ago' },
  { id: 3, name: 'ML Engine', url: 'https://ml.antigravity.io/status', status: 'degraded', rt: 312, uptime: 98.70, ssl: 118, lastCheck: '32s ago' },
  { id: 4, name: 'Storage', url: 'https://storage.antigravity.io/', status: 'up', rt: 18, uptime: 99.99, ssl: 200, lastCheck: '29s ago' },
  { id: 5, name: 'WebSocket', url: 'wss://ws.antigravity.io/', status: 'degraded', rt: 188, uptime: 97.20, ssl: 75, lastCheck: '31s ago' },
  { id: 6, name: 'CDN', url: 'https://cdn.antigravity.io/', status: 'up', rt: 14, uptime: 99.97, ssl: 160, lastCheck: '28s ago' },
  { id: 7, name: 'Scheduler', url: 'https://scheduler.antigravity.io/alive', status: 'down', rt: 0, uptime: 93.10, ssl: 44, lastCheck: '35s ago' },
  { id: 8, name: 'Analytics', url: 'https://analytics.antigravity.io/', status: 'up', rt: 128, uptime: 99.60, ssl: 189, lastCheck: '30s ago' },
];

const INCIDENTS = [
  { id: 1, monitor: 'Scheduler', msg: 'Timeout after 5000ms', ts: '08:07 today', dur: '8m' },
  { id: 2, monitor: 'ML Engine', msg: 'Response time exceeded 300ms threshold', ts: '07:22 today', dur: '25m' },
  { id: 3, monitor: 'WebSocket', msg: 'Connection refused', ts: 'Yesterday 22:14', dur: '4m' },
];

const statusColor = { up: '#22d3ee', degraded: '#f5b731', down: '#ef4444' };
const statusLabel = { up: 'UP', degraded: 'DEG', down: 'DOWN' };

export default function UptimeMonitor() {
  const [monitors, setMonitors] = useState(MONITORS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: '', interval: '60', threshold: '500' });

  const globalUptime = (monitors.reduce((a, m) => a + m.uptime, 0) / monitors.length).toFixed(2);

  const addMonitor = () => {
    if (!form.url) return;
    setMonitors(prev => [...prev, {
      id: prev.length + 1, name: form.url.replace(/https?:\/\//, '').split('/')[0],
      url: form.url, status: 'up', rt: Math.floor(Math.random() * 200) + 20,
      uptime: 100, ssl: Math.floor(Math.random() * 200) + 30, lastCheck: 'just now',
    }]);
    setForm({ url: '', interval: '60', threshold: '500' });
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#22d3ee,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Uptime Monitor</h1>
            <p style={{ color: '#6e7191', margin: '0 0 20px', fontSize: 15 }}>Track service availability, response times, and SSL certificates.</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#22d3ee', lineHeight: 1 }}>{globalUptime}%</div>
            <div style={{ fontSize: 13, color: '#6e7191', marginTop: 2 }}>Global Uptime Score</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ label: 'Up', count: monitors.filter(m => m.status === 'up').length, color: '#22d3ee' },
            { label: 'Degraded', count: monitors.filter(m => m.status === 'degraded').length, color: '#f5b731' },
            { label: 'Down', count: monitors.filter(m => m.status === 'down').length, color: '#ef4444' },
          ].map(b => (
            <div key={b.label} style={{ background: `${b.color}12`, border: `1px solid ${b.color}40`, borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>{b.count}</div>
              <div style={{ fontSize: 12, color: '#6e7191' }}>{b.label}</div>
            </div>
          ))}
          <button onClick={() => setShowForm(f => !f)} style={{ marginLeft: 'auto', padding: '10px 22px', borderRadius: 12, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            + Add Monitor
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Add form */}
        {showForm && (
          <div style={{ background: '#16161e', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: '22px', marginBottom: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#a78bfa' }}>New Monitor</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://your-endpoint.com/health"
                style={{ flex: 2, minWidth: 240, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '9px 14px', color: '#fff', fontSize: 13, outline: 'none' }} />
              <input value={form.interval} onChange={e => setForm(f => ({ ...f, interval: e.target.value }))} placeholder="Interval (s)"
                style={{ width: 120, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '9px 14px', color: '#fff', fontSize: 13, outline: 'none' }} />
              <input value={form.threshold} onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))} placeholder="Alert (ms)"
                style={{ width: 120, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '9px 14px', color: '#fff', fontSize: 13, outline: 'none' }} />
              <button onClick={addMonitor} style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: '#a78bfa', color: '#0e0e16', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        )}

        {/* Monitor List */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Monitored Services</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px 90px 100px 140px', padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Service</span><span>URL</span><span>Status</span><span>Resp.</span><span>30d Uptime</span><span>SSL / Last Check</span>
          </div>
          {monitors.map(m => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px 90px 100px 140px', padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
              <span style={{ color: '#6e7191', fontSize: 11, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.url}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[m.status], boxShadow: `0 0 8px ${statusColor[m.status]}` }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[m.status] }}>{statusLabel[m.status]}</span>
              </span>
              <span style={{ fontWeight: 700, color: m.rt > 200 ? '#f5b731' : m.rt === 0 ? '#ef4444' : '#22d3ee' }}>{m.rt > 0 ? `${m.rt}ms` : '—'}</span>
              <div>
                <div style={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ width: 4, height: 12, borderRadius: 2, background: Math.random() > (1 - m.uptime / 100) * 3 ? '#22d3ee' : '#ef4444', opacity: 0.7 }} />)}
                </div>
                <div style={{ fontSize: 10, color: '#6e7191', marginTop: 3 }}>{m.uptime}%</div>
              </div>
              <div>
                {m.ssl < 30 && <span style={{ fontSize: 10, background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '1px 6px', borderRadius: 6, fontWeight: 700, marginRight: 4 }}>SSL {m.ssl}d</span>}
                <span style={{ fontSize: 11, color: '#6e7191' }}>{m.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incidents */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Incident History</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          {INCIDENTS.map(inc => (
            <div key={inc.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{inc.monitor}: {inc.msg}</div>
                <div style={{ fontSize: 12, color: '#6e7191', marginTop: 2 }}>{inc.ts} • Duration: {inc.dur}</div>
              </div>
              <span style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 12px', borderRadius: 20, fontWeight: 700 }}>Resolved</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
