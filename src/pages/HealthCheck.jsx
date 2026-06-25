import { useState, useEffect, useCallback } from 'react';

const CHECKS = [
  { id: 'db', name: 'Database Connectivity', description: 'PostgreSQL primary node', category: 'Database' },
  { id: 'api', name: 'API Endpoints', description: 'REST API /health route', category: 'Network' },
  { id: 'auth', name: 'Auth Service', description: 'JWT validation service', category: 'Security' },
  { id: 'cache', name: 'Cache (Redis)', description: 'Redis cluster ping', category: 'Cache' },
  { id: 'queue', name: 'Queue (RabbitMQ)', description: 'Message broker connection', category: 'Queue' },
  { id: 'storage', name: 'Storage (S3)', description: 'Object storage bucket access', category: 'Storage' },
  { id: 'cdn', name: 'CDN', description: 'Cloudflare edge response', category: 'Network' },
  { id: 'ssl', name: 'SSL Certificate', description: 'TLS cert validity check', category: 'Security' },
];

const randMs = () => Math.floor(Math.random() * 300) + 10;
const randResult = () => Math.random() > 0.15 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'timeout';

function Sparkline({ data, color }) {
  if (!data.length) return null;
  const w = 80, h = 28, max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

export default function HealthCheck() {
  const [results, setResults] = useState({});
  const [running, setRunning] = useState({});
  const [histories, setHistories] = useState(() => Object.fromEntries(CHECKS.map(c => [c.id, []])));
  const [scheduled, setScheduled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhook, setShowWebhook] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const runCheck = useCallback((id) => {
    setRunning(r => ({ ...r, [id]: true }));
    const delay = Math.floor(Math.random() * 1500) + 300;
    setTimeout(() => {
      const ms = randMs();
      const result = randResult();
      setResults(r => ({ ...r, [id]: { ms, result, ts: new Date().toISOString() } }));
      setHistories(h => ({ ...h, [id]: [...(h[id] || []).slice(-29), ms] }));
      setRunning(r => { const n = { ...r }; delete n[id]; return n; });
    }, delay);
  }, []);

  const runAll = useCallback(() => {
    CHECKS.forEach(c => runCheck(c.id));
    setLastRun(new Date().toLocaleTimeString());
  }, [runCheck]);

  useEffect(() => {
    if (!scheduled) return;
    const timer = setTimeout(runAll, 0);
    const interval = setInterval(runAll, 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [scheduled, runAll]);

  const passed = Object.values(results).filter(r => r.result === 'pass').length;
  const failed = Object.values(results).filter(r => r.result === 'fail').length;
  const timeout = Object.values(results).filter(r => r.result === 'timeout').length;
  const total = Object.keys(results).length;

  const resultColor = (r) => r === 'pass' ? '#22d3ee' : r === 'fail' ? '#ef4444' : '#f5b731';
  const resultIcon = (r) => r === 'pass' ? '✓' : r === 'fail' ? '✗' : '⏱';

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #0a1818 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
    btn: (c = '#22d3ee') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }),
    statBadge: (c) => ({ background: c + '18', border: `1px solid ${c}33`, borderRadius: 12, padding: '12px 22px', textAlign: 'center', flex: 1 }),
    checkRow: (r) => ({
      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, marginBottom: 10,
      background: r ? resultColor(r.result) + '08' : '#1d1d28',
      border: `1px solid ${r ? resultColor(r.result) + '33' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all 0.3s',
    }),
    resultBadge: (r) => ({ background: resultColor(r) + '22', color: resultColor(r), border: `1px solid ${resultColor(r)}44`, borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 800, minWidth: 80, textAlign: 'center' }),
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', flex: 1 },
    toggle: (on) => ({ width: 40, height: 22, borderRadius: 11, background: on ? '#22d3ee' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }),
    toggleThumb: (on) => ({ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: on ? 21 : 3, transition: 'left 0.2s' }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Health Check</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Run diagnostics across all system components and services</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={s.statBadge('#22d3ee')}><div style={{ fontSize: 24, fontWeight: 800, color: '#22d3ee' }}>{passed}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Passed</div></div>
          <div style={s.statBadge('#ef4444')}><div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{failed}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Failed</div></div>
          <div style={s.statBadge('#f5b731')}><div style={{ fontSize: 24, fontWeight: 800, color: '#f5b731' }}>{timeout}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Timeout</div></div>
          <div style={s.statBadge('#a78bfa')}><div style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa' }}>{total ? `${Math.round((passed / total) * 100)}%` : '—'}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Health Score</div></div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexDirection: 'column', alignItems: 'flex-end' }}>
            <button style={{ ...s.btn('#22d3ee'), padding: '12px 28px', fontSize: 14 }} onClick={runAll}>▶ Run All Checks</button>
            {lastRun && <span style={{ fontSize: 12, color: '#6e7191' }}>Last run: {lastRun}</span>}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6e7191' }}>Auto-schedule (30s)</span>
            <div style={s.toggle(scheduled)} onClick={() => setScheduled(s => !s)}>
              <div style={s.toggleThumb(scheduled)} />
            </div>
          </div>
          <button style={s.btn('#a78bfa')} onClick={() => setShowWebhook(w => !w)}>🔔 Webhook on Failure</button>
        </div>

        {showWebhook && (
          <div style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', gap: 12 }}>
            <input style={s.input} placeholder="https://hooks.slack.com/…" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
            <button style={s.btn('#a78bfa')}>Save Webhook</button>
          </div>
        )}

        {CHECKS.map(check => {
          const r = results[check.id];
          const isRunning = running[check.id];
          return (
            <div key={check.id} style={s.checkRow(r)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{check.name}</div>
                <div style={{ fontSize: 12, color: '#6e7191', marginTop: 2 }}>{check.description} · <span style={{ color: '#a78bfa' }}>{check.category}</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Sparkline data={histories[check.id]} color={r ? resultColor(r.result) : '#6e7191'} />
                <span style={{ fontSize: 10, color: '#6e7191' }}>history</span>
              </div>
              {r && <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: resultColor(r.result) }}>{r.ms}ms</div>
                <div style={{ fontSize: 10, color: '#6e7191' }}>response</div>
              </div>}
              {r && <span style={s.resultBadge(r.result)}>{resultIcon(r.result)} {r.result.toUpperCase()}</span>}
              {isRunning && <span style={{ background: '#f5b73122', color: '#f5b731', border: '1px solid #f5b73144', borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 700 }}>⏳ Running…</span>}
              {!r && !isRunning && <span style={{ color: '#6e7191', fontSize: 13, minWidth: 100, textAlign: 'center' }}>Not run</span>}
              <button style={{ ...s.btn('#22d3ee'), padding: '6px 14px', fontSize: 12 }} onClick={() => runCheck(check.id)} disabled={isRunning}>
                {isRunning ? '…' : 'Run'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
