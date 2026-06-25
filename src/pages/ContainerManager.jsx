import { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/soundEngine';

const injectStyles = () => {
  if (document.getElementById('container-styles')) return;
  const s = document.createElement('style');
  s.id = 'container-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes container-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes container-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .container-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .container-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .container-row:hover { background:rgba(255,255,255,0.03)!important; }
    .container-badge { padding:3px 8px; border-radius:6px; font-size:9.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.3px; }
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

const INITIAL_CONTAINERS = [
  { id: 'c-1', name: 'api-gateway-service', status: 'running', image: 'nginx:alpine', port: '80:8080', cpu: 14, mem: 42, uptime: '4 days' },
  { id: 'c-2', name: 'postgres-db-replica', status: 'running', image: 'postgres:15', port: '5432:5432', cpu: 8, mem: 128, uptime: '12 days' },
  { id: 'c-3', name: 'redis-cache-cluster', status: 'running', image: 'redis:7.0-alpine', port: '6379:6379', cpu: 2, mem: 16, uptime: '22 hours' },
  { id: 'c-4', name: 'vector-search-engine', status: 'running', image: 'chromadb/chroma:latest', port: '8000:8000', cpu: 22, mem: 256, uptime: '3 days' },
  { id: 'c-5', name: 'auth-jwt-verifier', status: 'running', image: 'node:18-slim', port: '4000:4000', cpu: 5, mem: 64, uptime: '14 hours' },
  { id: 'c-6', name: 'background-worker-node', status: 'stopped', image: 'python:3.10-slim', port: 'N/A', cpu: 0, mem: 0, uptime: 'Stopped' }
];

export default function ContainerManager() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [selectedId, setSelectedId] = useState('c-1');
  const [logs, setLogs] = useState(() => [
    `[SYSTEM] Connecting to api-gateway-service logging stream...`,
    `[INFO] Pulling stdout/stderr buffer. Showing last 50 lines...`,
    `[api-gateway-service] Starting process manager...`,
    `[api-gateway-service] Executing binary entrypoint...`,
    `[api-gateway-service] Listening on port 80:8080...`,
    `[api-gateway-service] Health check endpoint /health - 200 OK (Latency: 4ms)`,
    `[api-gateway-service] Database handshake confirmed. Connection pool size: 10`,
  ]);
  const [activeTab, setActiveTab] = useState('services');
  const [bulkState, setBulkState] = useState(false);
  const logEndRef = useRef(null);

  // Selected container
  const selectedContainer = containers.find(c => c.id === selectedId) || containers[0];

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Telemetry fluctuation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => prev.map(c => {
        if (c.status !== 'running') return c;
        const cpuDelta = Math.floor(Math.random() * 5) - 2;
        const memDelta = Math.floor(Math.random() * 3) - 1;
        return {
          ...c,
          cpu: Math.max(1, Math.min(99, c.cpu + cpuDelta)),
          mem: Math.max(10, Math.min(2048, c.mem + memDelta))
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);



  const toggleContainer = (id, action) => {
    sound.play('click');
    setContainers(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextStatus = action === 'start' ? 'running' : 'stopped';
      return {
        ...c,
        status: nextStatus,
        cpu: nextStatus === 'running' ? 5 : 0,
        mem: nextStatus === 'running' ? 32 : 0,
        uptime: nextStatus === 'running' ? 'Just started' : 'Stopped'
      };
    }));

    const target = containers.find(c => c.id === id);
    if (target) {
      const logMsg = action === 'start'
        ? `[SYSTEM] Started container ${target.name} [${target.image}]`
        : `[SYSTEM] Stopped container ${target.name} gracefully.`;
      setLogs(prev => [...prev, logMsg]);
      sound.play('success');
    }
  };

  const restartContainer = (id) => {
    sound.play('click');
    setContainers(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: 'running',
        cpu: 15,
        mem: c.mem,
        uptime: 'Restarted just now'
      };
    }));
    const target = containers.find(c => c.id === id);
    if (target) {
      setLogs(prev => [
        ...prev,
        `[SYSTEM] Triggering restart request for ${target.name}...`,
        `[SYSTEM] Sending SIGTERM...`,
        `[SYSTEM] Container rebooted. Upgraded thread mappings.`
      ]);
      sound.play('success');
    }
  };

  const handleBulkAction = (action) => {
    sound.play('click');
    setBulkState(true);
    setContainers(prev => prev.map(c => {
      const status = action === 'start' ? 'running' : 'stopped';
      return {
        ...c,
        status,
        cpu: status === 'running' ? 8 : 0,
        mem: status === 'running' ? 64 : 0,
        uptime: status === 'running' ? 'Active' : 'Stopped'
      };
    }));
    setLogs(prev => [...prev, `[BULK] Executed ${action.toUpperCase()} action across all indexed environment nodes.`]);
    setTimeout(() => {
      setBulkState(false);
      sound.play('success');
    }, 1200);
  };

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #101824 50%, #150d18 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>📦</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Container Manager</h1>
            <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Orchestrate local microservices, map virtual network bridges, and inspect live resources</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="container-btn" onClick={() => handleBulkAction('start')} disabled={bulkState} style={{ padding: '10px 18px', borderRadius: 8, background: 'rgba(34,211,238,0.12)', border: `1px solid ${V.teal}`, color: V.teal, fontSize: 12, cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>
              ▶ Start All
            </button>
            <button className="container-btn" onClick={() => handleBulkAction('stop')} disabled={bulkState} style={{ padding: '10px 18px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: `1px solid ${V.red}`, color: '#f87171', fontSize: 12, cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>
              ⏹ Stop All
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { title: 'Containers Running', value: `${containers.filter(c => c.status === 'running').length} / ${containers.length}`, icon: '🔌', color: V.teal },
            { title: 'Aggregate Memory Used', value: `${containers.reduce((acc, c) => acc + c.mem, 0)} MB`, icon: '💾', color: V.purple },
            { title: 'Cluster CPU Load', value: `${containers.reduce((acc, c) => acc + c.cpu, 0)}%`, icon: '⚡', color: V.gold },
            { title: 'Network Interfaces', value: 'Bridge v1.02', icon: '🌐', color: V.blue }
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

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, background: V.surface2, borderRadius: 10, padding: 5, border: `1px solid ${V.border}`, width: 'fit-content' }}>
          {[
            { id: 'services', label: 'Microservices Deck' },
            { id: 'networking', label: 'Network Bridges' }
          ].map(t => (
            <button key={t.id} className={`scraper-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => { sound.play('click'); setActiveTab(t.id); }} style={{ border: 'none', cursor: 'pointer' }}>{t.label}</button>
          ))}
        </div>

        {/* MICROSERVICES DECK */}
        {activeTab === 'services' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, animation: 'container-fadeup 0.3s ease' }}>

            {/* LEFT CONTAINER GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {containers.map(c => (
                <div key={c.id} onClick={() => {
                  setSelectedId(c.id);
                  setLogs([
                    `[SYSTEM] Connecting to ${c.name} logging stream...`,
                    `[INFO] Pulling stdout/stderr buffer. Showing last 50 lines...`,
                    `[${c.name}] Starting process manager...`,
                    `[${c.name}] Executing binary entrypoint...`,
                    `[${c.name}] Listening on port ${c.port}...`,
                    `[${c.name}] Health check endpoint /health - 200 OK (Latency: 4ms)`,
                    `[${c.name}] Database handshake confirmed. Connection pool size: 10`,
                  ]);
                }} className="container-card" style={{ background: V.surface2, border: `1px solid ${selectedId === c.id ? V.gold : V.border}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', gap: 16 }}>

                  {/* Icon & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{c.status === 'running' ? '🟢' : '🔴'}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: 13.5 }}>{c.name}</div>
                      <div style={{ fontSize: 10.5, color: V.muted, fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{c.image}</div>
                    </div>
                  </div>

                  {/* CPU / MEM GAUGE */}
                  <div style={{ display: 'flex', gap: 24, flex: 1, justifyBetween: 'flex-end', marginLeft: 40, marginRight: 20 }}>
                    <div style={{ flex: 1, minWidth: 80 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: V.muted, marginBottom: 3 }}>
                        <span>CPU</span>
                        <span style={{ fontFamily: 'DM Mono, monospace' }}>{c.cpu}%</span>
                      </div>
                      <div style={{ height: 4, background: V.surface3, borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${c.cpu}%`, background: c.cpu > 50 ? V.red : V.teal, borderRadius: 999 }} />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 80 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: V.muted, marginBottom: 3 }}>
                        <span>MEM</span>
                        <span style={{ fontFamily: 'DM Mono, monospace' }}>{c.mem} MB</span>
                      </div>
                      <div style={{ height: 4, background: V.surface3, borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, (c.mem / 512) * 100)}%`, background: V.purple, borderRadius: 999 }} />
                      </div>
                    </div>
                  </div>

                  {/* Port and Action Deck */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 10.5, color: '#dde0f0', fontFamily: 'DM Mono, monospace', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: 6, border: `1px solid ${V.border}` }}>
                      {c.port}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {c.status === 'running' ? (
                        <button className="container-btn" onClick={(e) => { e.stopPropagation(); toggleContainer(c.id, 'stop'); }} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 10 }}>
                          ⏹ Stop
                        </button>
                      ) : (
                        <button className="container-btn" onClick={(e) => { e.stopPropagation(); toggleContainer(c.id, 'start'); }} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(34,211,238,0.1)', color: V.teal, border: 'none', cursor: 'pointer', fontSize: 10 }}>
                          ▶ Start
                        </button>
                      )}
                      <button className="container-btn" onClick={(e) => { e.stopPropagation(); restartContainer(c.id); }} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(245,183,49,0.1)', color: V.gold, border: 'none', cursor: 'pointer', fontSize: 10 }}>
                        🔄
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* RIGHT SIDEBAR INSPECTOR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* DETAILS CARD */}
              <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Inspect: {selectedContainer.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                  {[
                    ['Container ID', selectedContainer.id],
                    ['Image Version', selectedContainer.image],
                    ['Host Bindings', selectedContainer.port],
                    ['Service Status', selectedContainer.status === 'running' ? 'Active' : 'Inactive'],
                    ['Running Uptime', selectedContainer.uptime]
                  ].map(([k, val], idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${V.border}` }}>
                      <span style={{ color: V.muted }}>{k}</span>
                      <span style={{ color: '#dde0f0', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE TERM LOGS */}
              <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${V.border}`, background: V.surface3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedContainer.status === 'running' ? V.teal : V.muted, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Stdout Console logs</span>
                  </div>
                  <button onClick={() => setLogs([])} style={{ border: 'none', background: 'transparent', color: V.muted, fontSize: 10, cursor: 'pointer' }}>Clear</button>
                </div>
                <div style={{ height: '200px', overflowY: 'auto', padding: '12px 16px', background: '#07070b', fontFamily: 'DM Mono, monospace', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {logs.map((l, li) => (
                    <div key={li} style={{ color: l.includes('[SYSTEM]') ? V.gold : l.includes('[INFO]') ? V.teal : '#dde0f0' }}>{l}</div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* NETWORKING BRIDGE VIEW */}
        {activeTab === 'networking' && (
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '24px', animation: 'container-fadeup 0.3s ease' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: 15, marginBottom: 8 }}>Network Bridge topology</h3>
            <div style={{ fontSize: 11, color: V.muted, marginBottom: 20 }}>Visual layout map of local proxy gateways mapping endpoints into isolated Docker bridges.</div>

            {/* SVG Visual Network Bridge */}
            <div style={{ border: `1px solid ${V.border}`, borderRadius: 12, padding: 20, background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 500 240" width="100%" height="240">

                {/* WAN Edge Gate */}
                <rect x="20" y="95" width="80" height="50" rx="8" fill="rgba(34,211,238,0.1)" stroke={V.teal} strokeWidth="1.5" />
                <text x="60" y="125" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">WAN EDGE</text>

                {/* Proxy router node */}
                <circle cx="200" cy="120" r="28" fill="rgba(167,139,250,0.12)" stroke={V.purple} strokeWidth="2" />
                <text x="200" y="123" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">ROUTER</text>

                {/* Microservice Container Nodes */}
                {[
                  { cy: 40, label: 'api-gateway', id: 'n-1' },
                  { cy: 120, label: 'postgres-db', id: 'n-2' },
                  { cy: 200, label: 'redis-cache', id: 'n-3' }
                ].map((node, nIdx) => (
                  <g key={node.id}>
                    <rect x="360" y={node.cy - 20} width="110" height="40" rx="8" fill="rgba(245,183,49,0.1)" stroke={V.gold} strokeWidth="1.5" />
                    <text x="415" y={node.cy + 4} fill="#fff" fontSize="10.5" textAnchor="middle" fontWeight="bold">{node.label}</text>

                    {/* Cables curves */}
                    <path d={`M 228 120 C 280 120, 300 ${node.cy}, 360 ${node.cy}`} fill="none" stroke={V.border} strokeWidth="1.5" />

                    {/* Animated Particles */}
                    <circle r="3" fill={V.teal}>
                      <animateMotion path={`M 228 120 C 280 120, 300 ${node.cy}, 360 ${node.cy}`} dur={`${1.5 + nIdx * 0.4}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}

                {/* Edge routing path WAN to Router */}
                <line x1="100" y1="120" x2="172" y2="120" stroke={V.teal} strokeWidth="1.5" strokeDasharray="3" />
                <circle r="4" fill={V.teal}>
                  <animateMotion path="M 100 120 L 172 120" dur="1s" repeatCount="indefinite" />
                </circle>

              </svg>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
