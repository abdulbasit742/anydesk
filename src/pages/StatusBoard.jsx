import { useState } from 'react';

const SERVICES = [
  { name: 'API Gateway', uptime: 99.98, responseTime: 42, status: 'healthy' },
  { name: 'Auth Service', uptime: 99.95, responseTime: 67, status: 'healthy' },
  { name: 'ML Engine', uptime: 98.70, responseTime: 210, status: 'degraded' },
  { name: 'Storage', uptime: 99.99, responseTime: 18, status: 'healthy' },
  { name: 'Queue', uptime: 99.90, responseTime: 31, status: 'healthy' },
  { name: 'Cache', uptime: 99.99, responseTime: 5, status: 'healthy' },
  { name: 'WebSocket', uptime: 97.20, responseTime: 88, status: 'degraded' },
  { name: 'CDN', uptime: 99.97, responseTime: 14, status: 'healthy' },
  { name: 'Database', uptime: 99.92, responseTime: 55, status: 'healthy' },
  { name: 'Scheduler', uptime: 93.10, responseTime: 340, status: 'critical' },
  { name: 'Notifier', uptime: 99.80, responseTime: 73, status: 'healthy' },
  { name: 'Analytics', uptime: 99.60, responseTime: 128, status: 'healthy' },
];

const INCIDENTS = [
  { id: 1, service: 'Scheduler', msg: 'Increased latency detected', time: '10m ago', severity: 'critical' },
  { id: 2, service: 'ML Engine', msg: 'GPU memory pressure above threshold', time: '47m ago', severity: 'warning' },
  { id: 3, service: 'WebSocket', msg: 'Connection drops in EU-West region', time: '2h ago', severity: 'warning' },
  { id: 4, service: 'Auth Service', msg: 'Resolved: token validation timeout', time: '5h ago', severity: 'resolved' },
];

const statusColor = { healthy: '#22d3ee', degraded: '#f5b731', critical: '#ef4444' };
const statusLabel = { healthy: 'Healthy', degraded: 'Degraded', critical: 'Critical' };

function Sparkline({ rt }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const factor = 1 + (Math.sin(rt + i * 17) * 0.2);
    return Math.max(5, rt * factor);
  });
  const max = Math.max(...pts);
  const w = 80, h = 28;
  const path = pts.map((v, i) => `${(i / 9) * w},${h - (v / max) * h}`).join(' L ');
  const color = rt < 100 ? '#22d3ee' : rt < 200 ? '#f5b731' : '#ef4444';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

export default function StatusBoard() {
  const [selected, setSelected] = useState(null);
  const overall = 97.3;

  const severityColors = { critical: '#ef4444', warning: '#f5b731', resolved: '#22d3ee' };

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1d1d28 0%, #0e0e16 70%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', background: 'linear-gradient(90deg,#22d3ee,#f5b731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Status Board</h1>
            <p style={{ color: '#6e7191', margin: 0, fontSize: 15 }}>Real-time health across all platform services.</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ fontSize: 48, fontWeight: 900, background: 'linear-gradient(90deg,#22d3ee,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{overall}%</div>
            <div style={{ color: '#6e7191', fontSize: 13 }}>Overall System Score</div>
          </div>
        </div>

        {/* Stat badges */}
        <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Healthy', count: SERVICES.filter(s => s.status === 'healthy').length, color: '#22d3ee' },
            { label: 'Degraded', count: SERVICES.filter(s => s.status === 'degraded').length, color: '#f5b731' },
            { label: 'Critical', count: SERVICES.filter(s => s.status === 'critical').length, color: '#ef4444' },
            { label: 'Incidents', count: INCIDENTS.filter(i => i.severity !== 'resolved').length, color: '#a78bfa' },
          ].map(b => (
            <div key={b.label} style={{ background: `${b.color}12`, border: `1px solid ${b.color}40`, borderRadius: 12, padding: '10px 20px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: b.color }}>{b.count}</div>
              <div style={{ fontSize: 12, color: '#6e7191' }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Service Grid */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Service Health</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, marginBottom: 36 }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.name} onClick={() => setSelected(selected === i ? null : i)}
              style={{ background: '#16161e', border: `1px solid ${selected === i ? statusColor[svc.status] + '60' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all .2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[svc.status], boxShadow: `0 0 8px ${statusColor[svc.status]}` }} />
                <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{svc.name}</span>
                <span style={{ fontSize: 11, background: `${statusColor[svc.status]}18`, color: statusColor[svc.status], padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>{statusLabel[svc.status]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>Uptime</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: svc.uptime > 99 ? '#22d3ee' : svc.uptime > 97 ? '#f5b731' : '#ef4444' }}>{svc.uptime}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>Response</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{svc.responseTime}ms</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 4 }}>Trend</div>
                  <Sparkline rt={svc.responseTime} />
                </div>
              </div>
              {selected === i && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 6 }}>30-day uptime</div>
                  <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {Array.from({ length: 30 }, (_, d) => {
                      const seed = i * 30 + d;
                      const val = Math.sin(seed) * 10000;
                      const ok = (val - Math.floor(val)) > 0.05;
                      return <div key={d} style={{ width: 8, height: 8, borderRadius: 2, background: ok ? '#22d3ee' : '#ef4444', opacity: 0.75 }} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Incidents */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Incidents Log</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          {INCIDENTS.map(inc => (
            <div key={inc.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColors[inc.severity], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{inc.msg}</div>
                <div style={{ fontSize: 12, color: '#6e7191', marginTop: 2 }}>Service: {inc.service}</div>
              </div>
              <span style={{ fontSize: 11, color: '#6e7191' }}>{inc.time}</span>
              <span style={{ fontSize: 11, background: `${severityColors[inc.severity]}18`, color: severityColors[inc.severity], padding: '2px 10px', borderRadius: 20, fontWeight: 700, textTransform: 'capitalize' }}>{inc.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
