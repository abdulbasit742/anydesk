import { useState, useEffect } from 'react';
import { sound } from '../lib/soundEngine';

const injectStyles = () => {
  if (document.getElementById('lb-styles')) return;
  const s = document.createElement('style');
  s.id = 'lb-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes lb-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes lb-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .lb-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .lb-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .lb-row:hover { background:rgba(255,255,255,0.03)!important; }
  `;
  document.head.appendChild(s);
};

const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
};

const INITIAL_SERVERS = [
  { id: 'srv-1', name: 'Server Alpha (US-East)', ip: '10.0.1.24', weight: 4, connections: 12, status: 'healthy', count: 18452 },
  { id: 'srv-2', name: 'Server Beta (US-West)', ip: '10.0.1.25', weight: 3, connections: 8, status: 'healthy', count: 14210 },
  { id: 'srv-3', name: 'Server Gamma (EU-West)', ip: '10.0.1.26', weight: 2, connections: 15, status: 'degraded', count: 9140 },
  { id: 'srv-4', name: 'Server Delta (APAC)', ip: '10.0.1.27', weight: 1, connections: 0, status: 'offline', count: 245 }
];

export default function LoadBalancer() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [strategy, setStrategy] = useState('round-robin');
  const [rateLimit, setRateLimit] = useState(250);
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [liveTraffic, setLiveTraffic] = useState(72); // Req/sec

  // Toggle server status
  const toggleServerStatus = (id) => {
    sound.play('click');
    setServers(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus = s.status === 'healthy' ? 'offline' : s.status === 'offline' ? 'degraded' : 'healthy';
      return {
        ...s,
        status: nextStatus,
        connections: nextStatus === 'offline' ? 0 : s.connections
      };
    }));
    sound.play('success');
  };

  // Update server weight
  const updateWeight = (id, weight) => {
    setServers(prev => prev.map(s => s.id === id ? { ...s, weight: parseInt(weight, 10) } : s));
  };

  // Simulate network traffic flow ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTraffic(Math.floor(60 + Math.random() * 30));
      setServers(prev => prev.map(s => {
        if (s.status === 'offline') return s;
        const connDelta = Math.floor(Math.random() * 3) - 1;
        const reqDelta = Math.floor(Math.random() * 8) + 2;
        return {
          ...s,
          connections: Math.max(1, s.connections + connDelta),
          count: s.count + reqDelta
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const changeStrategy = (strat) => {
    sound.play('click');
    setStrategy(strat);
    sound.play('success');
  };

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>

      {/* HERO HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #0f1624 50%, #1a0f12 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>⚖️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Gateway Load Balancer</h1>
            <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Manage ingress routing rules, configure health check protocols, and view dynamic server nodes load distributions</div>
          </div>
        </div>

        {/* TELEMETRY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { title: 'Ingress Traffic rate', value: `${liveTraffic} req/sec`, icon: '📈', color: V.teal },
            { title: 'Avg Gateway Latency', value: '18ms', icon: '⏱️', color: V.green },
            { title: 'Healthy Target Servers', value: `${servers.filter(s => s.status !== 'offline').length} / ${servers.length}`, icon: '🖥️', color: V.gold },
            { title: 'Error Rate (24h)', value: '0.04%', icon: '⚠️', color: V.red }
          ].map((m, mi) => (
            <div key={mi} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${V.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 9.5, color: V.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.title}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: m.color, marginTop: 1 }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* MAIN PANEL GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, animation: 'lb-fadeup 0.3s ease' }}>

          {/* LEFT: BACKEND MANAGEMENT TABLE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Target Servers Registry</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {servers.map(s => (
                  <div key={s.id} className="lb-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 12, gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'healthy' ? V.green : s.status === 'degraded' ? V.gold : V.red }} />
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>{s.name}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: V.muted, fontFamily: 'DM Mono, monospace', marginTop: 4 }}>
                        IP: {s.ip} · Handled: {s.count.toLocaleString()} reqs
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

                      {/* Weight slider */}
                      <div style={{ width: 80 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: V.muted }}>
                          <span>Weight</span>
                          <span style={{ fontFamily: 'DM Mono, monospace' }}>{s.weight}</span>
                        </div>
                        <input type="range" min="1" max="10" value={s.weight} onChange={e => updateWeight(s.id, e.target.value)} style={{ width: '100%', accentColor: V.gold, height: 3, cursor: 'pointer' }} />
                      </div>

                      {/* Connection count */}
                      <div style={{ textAlign: 'right', minWidth: 60 }}>
                        <div style={{ fontSize: 9.5, color: V.muted }}>Active Conns</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: V.teal, marginTop: 2, fontFamily: 'DM Mono, monospace' }}>{s.connections}</div>
                      </div>

                      <button onClick={() => toggleServerStatus(s.id)} style={{ border: 'none', background: 'rgba(255,255,255,0.04)', color: '#dde0f0', borderRadius: 8, padding: '6px 12px', fontSize: 10.5, cursor: 'pointer', transition: 'all 0.15s' }}>
                        Toggle State
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROUTING CONFIG CARD */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Configuration & Rate Limits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, color: V.muted, display: 'block', marginBottom: 8 }}>Rate Limiting Threshold (Requests / Sec)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <input type="range" min="50" max="1000" step="50" value={rateLimit} onChange={e => setRateLimit(parseInt(e.target.value, 10))} style={{ flex: 1, accentColor: V.teal, cursor: 'pointer' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: V.teal, fontFamily: 'DM Mono, monospace', minWidth: 60 }}>{rateLimit} R/S</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: ROUTING STRATEGY & TOPOLOGY MAP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* STRATEGY PICKER */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Ingress Routing Strategy</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { id: 'round-robin', label: 'Round Robin', icon: '🔄', desc: 'Distribute requests sequentially' },
                  { id: 'least-conn', label: 'Least Connections', icon: '⚖️', desc: 'Route to least busy node' },
                  { id: 'ip-hash', label: 'IP Hash', icon: '🔑', desc: 'Static mapping by client IP' },
                  { id: 'weighted', label: 'Weighted Resource', icon: '📊', desc: 'Route based on server weight config' }
                ].map(opt => (
                  <button key={opt.id} onClick={() => changeStrategy(opt.id)} style={{ padding: '12px 14px', borderRadius: 10, background: strategy === opt.id ? 'rgba(34,211,238,0.12)' : V.surface3, border: `1px solid ${strategy === opt.id ? V.teal : V.border}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: strategy === opt.id ? V.teal : '#fff' }}>
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    <div style={{ fontSize: 9.5, color: V.muted, marginTop: 4, lineHeight: 1.3 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* VISUAL CABLE DIAGRAM */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 13.5 }}>Dynamic Load Balancing Topology</div>
              <div style={{ border: `1px solid ${V.border}`, borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 220" width="100%" height="220">

                  {/* Load Balancer Gateway Node */}
                  <rect x="10" y="85" width="60" height="50" rx="8" fill="rgba(34,211,238,0.1)" stroke={V.teal} strokeWidth="1.5" />
                  <text x="40" y="114" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">LB GATE</text>

                  {/* Target Nodes */}
                  {servers.map((srv, idx) => {
                    const targetY = 30 + idx * 50;
                    const isOffline = srv.status === 'offline';
                    return (
                      <g key={srv.id}>
                        <rect x="180" y={targetY - 18} width="110" height="36" rx="6" fill={isOffline ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)'} stroke={isOffline ? V.red : V.border} strokeWidth="1" />
                        <text x="190" y={targetY + 4} fill={isOffline ? V.red : '#fff'} fontSize="9" fontWeight="bold">{srv.name.split(' ')[0]}</text>

                        {/* Connecting splines */}
                        <path d={`M 70 110 C 120 110, 130 ${targetY}, 180 ${targetY}`} fill="none" stroke={isOffline ? 'rgba(239,68,68,0.15)' : V.border} strokeWidth="1.5" />

                        {/* Animated flowing circles */}
                        {!isOffline && (
                          <circle r="3" fill={V.teal}>
                            <animateMotion path={`M 70 110 C 120 110, 130 ${targetY}, 180 ${targetY}`} dur={`${1.2 + idx * 0.3}s`} repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                </svg>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
