import { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/soundEngine';
import { store } from '../lib/store';

const injectStyles = () => {
  if (document.getElementById('log-styles')) return;
  const s = document.createElement('style');
  s.id = 'log-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes log-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .log-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .log-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .log-row:hover { background:rgba(255,255,255,0.03)!important; }
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

const INITIAL_LOGS = [
  { id: 'init-1', at: Date.now() - 50000, ts: '19:04:12', level: 'info', service: 'api-gateway', msg: 'Successfully parsed JWT claims for user session 1a2b' },
  { id: 'init-2', at: Date.now() - 40000, ts: '19:04:15', level: 'warn', service: 'database-engine', msg: 'Connection pool approaching threshold limit (12/15 connections active)' },
  { id: 'init-3', at: Date.now() - 30000, ts: '19:04:18', level: 'error', service: 'background-worker', msg: 'Cheerio parsing failed on URL https://store.demo/missing-product' },
  { id: 'init-4', at: Date.now() - 20000, ts: '19:04:22', level: 'info', service: 'api-gateway', msg: 'GET /api/v2/metrics resolved 200 OK in 14ms' },
  { id: 'init-5', at: Date.now() - 10000, ts: '19:04:25', level: 'info', service: 'authentication-flow', msg: 'Rotating credential access tokens sweep completed' }
];

const mapStoreEventToLog = (e) => ({
  id: e.id,
  at: e.at || Date.now(),
  ts: new Date(e.at || Date.now()).toTimeString().split(' ')[0],
  level: e.severity === 'error' ? 'error' : (e.severity === 'warning' ? 'warn' : 'info'),
  service: e.type.split(':')[0] || 'system',
  msg: e.data ? `${e.type.replace(':', ' ')} - ${Object.entries(e.data).map(([k, v]) => `${k}: ${v}`).join(', ')}` : e.type
});

export default function LogAnalyzer() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [logs, setLogs] = useState(() => {
    const storeLogs = store.getEvents(50).map(mapStoreEventToLog);
    return [...INITIAL_LOGS, ...storeLogs].sort((a, b) => a.at - b.at).slice(-50);
  });
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [paused, setPaused] = useState(false);
  const logFeedRef = useRef(null);

  // Auto-scroll logs feed
  useEffect(() => {
    if (logFeedRef.current) {
      logFeedRef.current.scrollTop = logFeedRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate logs stream
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const services = ['api-gateway', 'database-engine', 'background-worker', 'authentication-flow'];
      const levels = ['info', 'info', 'info', 'warn', 'error'];
      const messages = [
        'GET /api/v1/projects - 200 OK in 8ms',
        'Redis cache key matching query parsed successfully',
        'Cron scheduler triggered active jobs sweep',
        'SSL Handshake validation payload confirmed',
        'Database replicas database query timed out'
      ];

      const randomIdx = Math.floor(Math.random() * messages.length);
      const newLog = {
        id: 'stream-' + Date.now(),
        at: Date.now(),
        ts: new Date().toTimeString().split(' ')[0],
        level: levels[Math.floor(Math.random() * levels.length)],
        service: services[Math.floor(Math.random() * services.length)],
        msg: messages[randomIdx]
      };

      setLogs(prev => {
        const next = [...prev, newLog];
        return next.slice(-50);
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  // Pull new events from store periodically
  useEffect(() => {
    const checkStoreEvents = () => {
      const storeLogs = store.getEvents(50).map(mapStoreEventToLog);
      setLogs(prev => {
        const existingIds = new Set(prev.map(l => l.id));
        const newStoreLogs = storeLogs.filter(l => !existingIds.has(l.id));
        if (newStoreLogs.length === 0) return prev;
        return [...prev, ...newStoreLogs].sort((a, b) => a.at - b.at).slice(-50);
      });
    };
    const interval = setInterval(checkStoreEvents, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(l => {
    if (levelFilter !== 'all' && l.level !== levelFilter) return false;
    if (serviceFilter !== 'all' && l.service !== serviceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.msg.toLowerCase().includes(q) || l.service.toLowerCase().includes(q);
    }
    return true;
  });

  const downloadLogs = () => {
    sound.play('click');
    const output = filteredLogs.map(l => `[${l.ts}] [${l.level.toUpperCase()}] [${l.service}] ${l.msg}`).join('\n');
    const blob = new Blob([output], { type: 'text/plain' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `audit_logs_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    sound.play('success');
  };

  // Metrics calculations
  const totalLogs = logs.length;
  const errorLogs = logs.filter(l => l.level === 'error').length;
  const warnLogs = logs.filter(l => l.level === 'warn').length;

  const errorRate = totalLogs > 0 ? ((errorLogs / totalLogs) * 100).toFixed(2) + '%' : '0.00%';
  const warnRate = totalLogs > 0 ? ((warnLogs / totalLogs) * 100).toFixed(2) + '%' : '0.00%';
  const activeSources = new Set(logs.map(l => l.service)).size;

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>

      {/* HERO HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #0c1524 50%, #151020 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>📺</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Global Log Analyzer</h1>
            <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Central logs aggregator, warning indicators analytics, and real-time streaming debug logs</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="log-btn" onClick={() => setPaused(!paused)} style={{ padding: '10px 18px', borderRadius: 8, background: paused ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${paused ? V.teal : V.border}`, color: paused ? V.teal : '#dde0f0', fontSize: 12, cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>
              {paused ? '▶ Resume Feed' : '⏸ Pause Feed'}
            </button>
            <button className="log-btn" onClick={downloadLogs} style={{ padding: '10px 18px', borderRadius: 8, background: V.gold, border: 'none', color: '#000', fontSize: 12, cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>
              📥 Download Log Output
            </button>
          </div>
        </div>

        {/* TELEMETRIES ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { title: 'Indexed Logs Count', value: `${totalLogs} records`, icon: '📄', color: V.teal },
            { title: 'Errors rate', value: errorRate, icon: '⚠️', color: V.red },
            { title: 'Cluster Warning rate', value: warnRate, icon: '🔔', color: V.gold },
            { title: 'Active Log Sources', value: `${activeSources} channels`, icon: '🌐', color: V.purple }
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

        {/* LOG ANOMALY PLOTS & CONTROLS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, animation: 'log-fadeup 0.3s ease' }}>

          {/* STREAM VIEW LOG PANEL */}
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header + Filter tools */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${V.border}`, background: V.surface3, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Streaming Live Logs Viewer</span>
                <input type="text" placeholder="Search logs payload..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '6px 12px', background: V.surface, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', fontSize: 11.5, outline: 'none' }} />
              </div>

              {/* Filter pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* Level pills */}
                {['all', 'info', 'warn', 'error'].map(lvl => (
                  <button key={lvl} onClick={() => setLevelFilter(lvl)} style={{ border: `1px solid ${levelFilter === lvl ? V.teal : V.border}`, background: levelFilter === lvl ? 'rgba(34,211,238,0.1)' : 'transparent', color: levelFilter === lvl ? V.teal : V.muted, padding: '4px 10px', borderRadius: 6, fontSize: 10.5, textTransform: 'capitalize', cursor: 'pointer', outline: 'none' }}>
                    {lvl}
                  </button>
                ))}
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
                {/* Service pills */}
                {['all', 'api-gateway', 'database-engine', 'background-worker', 'authentication-flow', 'account', 'config', 'env'].map(srv => (
                  <button key={srv} onClick={() => setServiceFilter(srv)} style={{ border: `1px solid ${serviceFilter === srv ? V.purple : V.border}`, background: serviceFilter === srv ? 'rgba(167,139,250,0.1)' : 'transparent', color: serviceFilter === srv ? V.purple : V.muted, padding: '4px 10px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer', outline: 'none' }}>
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Console list output */}
            <div ref={logFeedRef} style={{ height: '360px', overflowY: 'auto', padding: '16px', background: '#07070b', fontFamily: 'DM Mono, monospace', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredLogs.length === 0 ? (
                <div style={{ color: V.muted, textAlign: 'center', marginTop: 120, fontSize: 12 }}>No logs match current filter criteria.</div>
              ) : (
                filteredLogs.map(l => {
                  const color = l.level === 'error' ? V.red : l.level === 'warn' ? V.gold : V.teal;
                  return (
                    <div key={l.id} style={{ display: 'flex', gap: 10, borderBottom: `1px solid rgba(255,255,255,0.02)`, paddingBottom: 4 }}>
                      <span style={{ color: V.muted }}>[{l.ts}]</span>
                      <span style={{ color, fontWeight: 700, width: 50, textTransform: 'uppercase' }}>{l.level}</span>
                      <span style={{ color: V.purple, width: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.service}</span>
                      <span style={{ color: '#dde0f0', flex: 1, wordBreak: 'break-all' }}>{l.msg}</span>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT: ERROR/WARNINGS FREQUENCY CHART */}
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>Event Distribution Frequency</div>

            {/* SVG area chart for logs analytics */}
            <div style={{ border: `1px solid ${V.border}`, borderRadius: 12, padding: 10, background: 'rgba(0,0,0,0.1)' }}>
              <svg viewBox="0 0 300 180" width="100%" height="180">
                <defs>
                  <linearGradient id="logAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={V.gold} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={V.gold} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((s, idx) => (
                  <line key={idx} x1="30" y1={20 + s * 120} x2="280" y2={20 + s * 120} stroke={V.border} strokeDasharray="3" />
                ))}

                {/* Area path for warnings */}
                <path d="M 30 140 L 70 120 L 110 130 L 150 90 L 190 70 L 230 40 L 270 50 L 280 40 L 280 140 Z" fill="url(#logAreaGrad)" />

                {/* Line path warnings */}
                <path d="M 30 140 L 70 120 L 110 130 L 150 90 L 190 70 L 230 40 L 270 50 L 280 40" fill="none" stroke={V.gold} strokeWidth="2" />

                {/* Line path errors (Red line) */}
                <path d="M 30 140 L 70 140 L 110 138 L 150 120 L 190 135 L 230 110 L 270 125 L 280 120" fill="none" stroke={V.red} strokeWidth="2" />

              </svg>
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 11, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: V.gold, borderRadius: 2 }} />
                <span style={{ color: '#dde0f0' }}>Warnings (Log trends)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: V.red, borderRadius: 2 }} />
                <span style={{ color: '#dde0f0' }}>Errors (Exceptions)</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
