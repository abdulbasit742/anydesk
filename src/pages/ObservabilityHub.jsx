import { useState, useEffect } from 'react';

const SERVICES = [
  { id: 'api-gw', label: 'API Gateway', x: 140, y: 80, color: 'var(--gold)', status: 'healthy', rps: 1240, latency: 12 },
  { id: 'auth', label: 'Auth Service', x: 60, y: 200, color: 'var(--teal)', status: 'healthy', rps: 480, latency: 8 },
  { id: 'broadcast', label: 'Broadcast Engine', x: 240, y: 200, color: 'var(--purple)', status: 'degraded', rps: 320, latency: 89 },
  { id: 'db', label: 'Database', x: 140, y: 310, color: 'var(--blue)', status: 'healthy', rps: 2100, latency: 4 },
  { id: 'cache', label: 'Redis Cache', x: 60, y: 310, color: '#10b981', status: 'healthy', rps: 5400, latency: 1 },
  { id: 'queue', label: 'Message Queue', x: 240, y: 310, color: 'var(--red)', status: 'critical', rps: 180, latency: 220 },
];

const SERVICE_LINKS = [
  { from: 'api-gw', to: 'auth' }, { from: 'api-gw', to: 'broadcast' },
  { from: 'broadcast', to: 'db' }, { from: 'broadcast', to: 'queue' },
  { from: 'auth', to: 'cache' }, { from: 'api-gw', to: 'db' },
];

const TRACES = [
  { id: 'tr-001', name: 'POST /api/broadcast', duration: 342, status: 'error', service: 'API Gateway', spans: 8, ts: '21:04:12' },
  { id: 'tr-002', name: 'GET /api/accounts', duration: 18, status: 'ok', service: 'API Gateway', spans: 3, ts: '21:04:10' },
  { id: 'tr-003', name: 'WS /stream/events', duration: 1204, status: 'ok', service: 'Broadcast Engine', spans: 12, ts: '21:04:08' },
  { id: 'tr-004', name: 'POST /auth/login', duration: 56, status: 'ok', service: 'Auth Service', spans: 4, ts: '21:04:05' },
  { id: 'tr-005', name: 'PUT /api/workflow/run', duration: 890, status: 'error', service: 'Broadcast Engine', spans: 15, ts: '21:04:02' },
];

const TRACE_SPANS = [
  { name: 'HTTP Handler', start: 0, dur: 342, depth: 0, color: 'var(--gold)', service: 'api-gw' },
  { name: 'Auth Middleware', start: 8, dur: 28, depth: 1, color: 'var(--teal)', service: 'auth' },
  { name: 'Cache Lookup', start: 12, dur: 4, depth: 2, color: '#10b981', service: 'cache' },
  { name: 'DB Query users', start: 38, dur: 45, depth: 1, color: 'var(--blue)', service: 'db' },
  { name: 'Broadcast Dispatch', start: 90, dur: 245, depth: 1, color: 'var(--purple)', service: 'broadcast' },
  { name: 'Queue Publish', start: 140, dur: 188, depth: 2, color: 'var(--red)', service: 'queue' },
];

const ERRORS = [
  { id: 'e-001', type: 'TimeoutError', message: 'Queue publish timeout after 200ms', service: 'Message Queue', count: 47, ts: '21:04:12', stack: 'at Queue.publish (queue.js:142)\n  at BroadcastEngine.dispatch (broadcast.js:89)\n  at async route.post (routes.js:56)' },
  { id: 'e-002', type: 'ConnectionError', message: 'Redis connection pool exhausted (max: 50)', service: 'Redis Cache', count: 12, ts: '21:03:58', stack: 'at RedisPool.acquire (pool.js:67)\n  at CacheService.get (cache.js:23)' },
  { id: 'e-003', type: 'ValidationError', message: 'Broadcast payload exceeds 64KB limit', service: 'API Gateway', count: 5, ts: '21:02:11', stack: 'at validator.check (middleware/validate.js:34)\n  at Layer.handle (router.js:95)' },
];

const LOGS = [
  { level: 'ERROR', msg: 'Queue publish timeout: job_id=bc291a4f', service: 'queue', ts: '21:04:12.441' },
  { level: 'WARN', msg: 'Cache miss rate elevated: 42% (threshold: 30%)', service: 'cache', ts: '21:04:11.202' },
  { level: 'INFO', msg: 'Broadcast dispatched to 4 accounts: batch_id=f9e2', service: 'broadcast', ts: '21:04:10.887' },
  { level: 'INFO', msg: 'Auth token validated: user=usr_7h82ka', service: 'auth', ts: '21:04:10.543' },
  { level: 'ERROR', msg: 'DB query exceeded 100ms: SELECT * FROM workflows WHERE...', service: 'db', ts: '21:04:08.112' },
  { level: 'DEBUG', msg: 'Incoming request: POST /api/broadcast - ua=BSP/2.1', service: 'api-gw', ts: '21:04:08.001' },
  { level: 'WARN', msg: 'Rate limit approaching for ip: 192.168.1.45 (85/100 rpm)', service: 'api-gw', ts: '21:04:06.774' },
  { level: 'INFO', msg: 'Workflow step 3/6 completed: wf_id=abc123', service: 'broadcast', ts: '21:04:05.330' },
];

const SLOS = [
  { name: 'API Availability', target: 99.9, current: 99.7, burnRate: 2.1, window: '30d' },
  { name: 'Broadcast Latency p99 < 500ms', target: 99.5, current: 97.2, burnRate: 5.4, window: '7d' },
  { name: 'Auth Service Uptime', target: 99.99, current: 99.98, burnRate: 0.6, window: '30d' },
  { name: 'Error Rate < 0.1%', target: 99.9, current: 99.1, burnRate: 4.2, window: '24h' },
];

const ALERT_RULES = [
  { id: 1, name: 'High Error Rate', condition: 'error_rate > 1%', status: 'firing', severity: 'critical' },
  { id: 2, name: 'Queue Latency Spike', condition: 'queue.p99 > 200ms', status: 'firing', severity: 'warning' },
  { id: 3, name: 'Cache Hit Rate Drop', condition: 'cache_hit_rate < 70%', status: 'resolved', severity: 'warning' },
  { id: 4, name: 'CPU Saturation', condition: 'cpu_util > 85%', status: 'ok', severity: 'info' },
];

function LogLevelBadge({ level }) {
  const colors = { ERROR: 'var(--red)', WARN: 'var(--gold)', INFO: 'var(--teal)', DEBUG: 'var(--muted)' };
  return (
    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontFamily: 'DM Mono, monospace', background: `${colors[level]}20`, color: colors[level], minWidth: 38, display: 'inline-block', textAlign: 'center' }}>{level}</span>
  );
}

function SloGauge({ slo }) {
  const pct = (slo.current / slo.target) * 100;
  const ok = slo.current >= slo.target;
  return (
    <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--surface2)', border: `1px solid ${ok ? 'var(--border)' : 'rgba(239,68,68,0.3)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{slo.name}</span>
        <span style={{ fontSize: 10, color: ok ? 'var(--teal)' : 'var(--red)', fontWeight: 700 }}>{ok ? '✓ GOOD' : '⚠ BREACH'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
        <span>Target: {slo.target}%</span>
        <span>Current: <strong style={{ color: ok ? 'var(--teal)' : 'var(--red)' }}>{slo.current}%</strong></span>
        <span>Burn: <strong style={{ color: slo.burnRate > 3 ? 'var(--red)' : 'var(--gold)' }}>{slo.burnRate}x</strong></span>
      </div>
      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3 }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: ok ? 'var(--teal)' : 'var(--red)', borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function ObservabilityHub() {
  const [activeTab, setActiveTab] = useState('traces');
  const [logFilter, setLogFilter] = useState('ALL');
  const [selectedTrace, setSelectedTrace] = useState('tr-001');
  const [selectedError, setSelectedError] = useState(null);
  const [metricQuery, setMetricQuery] = useState('rate(http_requests_total[5m])');
  const [liveMode, setLiveMode] = useState(true);
  const [liveTime, setLiveTime] = useState('21:04:12');
  const [anomalies] = useState([
    { svc: 'Message Queue', metric: 'p99 latency', value: '220ms', expected: '<50ms', severity: 'critical', delta: '+340%' },
    { svc: 'Broadcast Engine', metric: 'error rate', value: '3.2%', expected: '<0.5%', severity: 'warning', delta: '+540%' },
    { svc: 'Redis Cache', metric: 'connection pool', value: '94%', expected: '<70%', severity: 'warning', delta: '+34%' },
  ]);

  useEffect(() => {
    if (!liveMode) return;
    const iv = setInterval(() => {
      const now = new Date();
      setLiveTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(iv);
  }, [liveMode]);

  const filteredLogs = logFilter === 'ALL' ? LOGS : LOGS.filter(l => l.level === logFilter);

  const tabs = [
    { id: 'traces', label: 'Traces', icon: '🔍' },
    { id: 'errors', label: 'Errors', icon: '🚨' },
    { id: 'logs', label: 'Logs', icon: '📋' },
    { id: 'servicemap', label: 'Service Map', icon: '🗺️' },
    { id: 'slos', label: 'SLO Monitor', icon: '🎯' },
    { id: 'alerts', label: 'Alert Rules', icon: '🔔' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'anomalies', label: 'Anomalies', icon: '⚡' },
  ];

  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🔭</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>Observability Hub</h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Distributed tracing · Logs · SLOs · Anomaly detection</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--teal)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            LIVE {liveTime}
          </div>
          <button onClick={() => setLiveMode(!liveMode)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${liveMode ? 'var(--teal)' : 'var(--border)'}`, background: liveMode ? 'rgba(34,211,238,0.1)' : 'var(--surface2)', color: liveMode ? 'var(--teal)' : 'var(--muted)', cursor: 'pointer', fontSize: 11 }}>
            {liveMode ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: '#dde0f0', cursor: 'pointer', fontSize: 11 }}>
            📤 Export JSON
          </button>
        </div>
      </div>

      {/* Status Strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {SERVICES.map(svc => (
          <div key={svc.id} style={{
            flex: 1, padding: '10px 12px', borderRadius: 8, background: 'var(--surface2)',
            border: `1px solid ${svc.status === 'healthy' ? 'var(--border)' : svc.status === 'degraded' ? 'rgba(245,183,49,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{svc.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: svc.status === 'healthy' ? 'var(--teal)' : svc.status === 'degraded' ? 'var(--gold)' : 'var(--red)', display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#dde0f0' }}>{svc.latency}ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 11,
            fontWeight: activeTab === tab.id ? 700 : 400,
            background: activeTab === tab.id ? 'var(--surface2)' : 'transparent',
            color: activeTab === tab.id ? 'var(--teal)' : 'var(--muted)',
            borderBottom: activeTab === tab.id ? '2px solid var(--teal)' : '2px solid transparent',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TRACES TAB */}
      {activeTab === 'traces' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Recent Traces</div>
            {TRACES.map(trace => (
              <div key={trace.id} onClick={() => setSelectedTrace(trace.id)} style={{
                padding: '12px 14px', borderRadius: 8, marginBottom: 6, cursor: 'pointer', transition: 'all 0.15s',
                border: `1px solid ${selectedTrace === trace.id ? 'var(--teal)' : 'var(--border)'}`,
                background: selectedTrace === trace.id ? 'rgba(34,211,238,0.06)' : 'var(--surface2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: 'DM Mono, monospace' }}>{trace.name}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 700, background: trace.status === 'ok' ? 'rgba(34,211,238,0.15)' : 'rgba(239,68,68,0.15)', color: trace.status === 'ok' ? 'var(--teal)' : 'var(--red)' }}>
                    {trace.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--muted)' }}>
                  <span>⏱ {trace.duration}ms</span>
                  <span>📦 {trace.spans} spans</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace' }}>{trace.ts}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Trace Timeline — {selectedTrace}
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', padding: '14px', overflowX: 'auto' }}>
              <svg width="420" height={TRACE_SPANS.length * 32 + 20} style={{ overflow: 'visible' }}>
                {/* Timeline axis */}
                {[0, 100, 200, 300].map(x => (
                  <g key={x}>
                    <line x1={x + 100} y1={0} x2={x + 100} y2={TRACE_SPANS.length * 32 + 10} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                    <text x={x + 100} y={TRACE_SPANS.length * 32 + 18} textAnchor="middle" fill="var(--muted)" fontSize="8">{x}ms</text>
                  </g>
                ))}
                {TRACE_SPANS.map((span, i) => {
                  const maxDur = 342;
                  const scale = 300 / maxDur;
                  const x = 100 + span.start * scale;
                  const w = Math.max(span.dur * scale, 2);
                  return (
                    <g key={i}>
                      <text x={95} y={i * 32 + 18} textAnchor="end" fill="rgba(200,200,220,0.6)" fontSize="9">{span.name}</text>
                      <rect x={x + span.depth * 8} y={i * 32 + 8} width={w} height={16} rx={3} fill={span.color} opacity={0.85} />
                      <text x={x + span.depth * 8 + 4} y={i * 32 + 19} fill="#000" fontSize="8" fontWeight="700">{span.dur}ms</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ERRORS TAB */}
      {activeTab === 'errors' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            {ERRORS.map(err => (
              <div key={err.id} onClick={() => setSelectedError(err.id === selectedError ? null : err.id)}
                style={{
                  padding: '14px 16px', borderRadius: 10, marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1px solid ${selectedError === err.id ? 'var(--red)' : 'var(--border)'}`,
                  background: selectedError === err.id ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>{err.type}</span>
                  <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--gold)', fontWeight: 700 }}>{err.count}×</span>
                </div>
                <div style={{ fontSize: 11, color: '#dde0f0', marginBottom: 4 }}>{err.message}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>📦 {err.service} · {err.ts}</div>
                {selectedError === err.id && (
                  <pre style={{ marginTop: 10, padding: '10px', background: '#0d1117', borderRadius: 6, fontSize: 10, color: '#7dd3fc', fontFamily: 'DM Mono, monospace', overflow: 'auto', whiteSpace: 'pre-wrap', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {err.stack}
                  </pre>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: '16px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Error Rate (last 24h)</div>
            <svg width="100%" height="140" viewBox="0 0 360 140">
              {[8, 12, 6, 47, 24, 18, 31, 11, 8, 9, 12, 47].map((v, i) => {
                const h = (v / 50) * 120;
                return (
                  <g key={i}>
                    <rect x={i * 30} y={120 - h} width={22} height={h} rx={3}
                      fill={v > 30 ? 'var(--red)' : v > 15 ? 'var(--gold)' : 'var(--blue)'} opacity={0.8} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === 'logs' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['ALL', 'ERROR', 'WARN', 'INFO', 'DEBUG'].map(lvl => (
              <button key={lvl} onClick={() => setLogFilter(lvl)} style={{
                padding: '5px 12px', borderRadius: 6, border: `1px solid ${logFilter === lvl ? 'var(--gold)' : 'var(--border)'}`,
                background: logFilter === lvl ? 'rgba(245,183,49,0.1)' : 'var(--surface2)',
                color: logFilter === lvl ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', fontSize: 11,
              }}>{lvl}</button>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)', alignSelf: 'center' }}>{filteredLogs.length} entries</div>
          </div>
          <div style={{ background: '#0d1117', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', background: 'var(--surface3)', borderBottom: '1px solid var(--border)', fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              TIMESTAMP · LEVEL · SERVICE · MESSAGE
            </div>
            {filteredLogs.map((log, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', gap: 12, alignItems: 'baseline', fontFamily: 'DM Mono, monospace', fontSize: 11,
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}>
                <span style={{ color: 'var(--muted)', fontSize: 10, flexShrink: 0 }}>{log.ts}</span>
                <LogLevelBadge level={log.level} />
                <span style={{ color: 'var(--purple)', fontSize: 10, flexShrink: 0 }}>[{log.service}]</span>
                <span style={{ color: log.level === 'ERROR' ? '#fca5a5' : log.level === 'WARN' ? '#fde68a' : '#dde0f0', fontSize: 11 }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE MAP TAB */}
      {activeTab === 'servicemap' && (
        <div>
          <svg width="420" height="420" style={{ background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)', display: 'block' }}>
            {SERVICE_LINKS.map((link, i) => {
              const from = SERVICES.find(s => s.id === link.from);
              const to = SERVICES.find(s => s.id === link.to);
              if (!from || !to) return null;
              return (
                <line key={i}
                  x1={from.x + 40} y1={from.y + 18}
                  x2={to.x + 40} y2={to.y + 18}
                  stroke="rgba(255,255,255,0.12)" strokeWidth={2}
                  strokeDasharray={link.from === 'broadcast' && link.to === 'queue' ? '6 4' : 'none'}
                />
              );
            })}
            {SERVICES.map(svc => (
              <g key={svc.id}>
                <rect x={svc.x} y={svc.y} width={80} height={36} rx={8}
                  fill="var(--surface3)" stroke={svc.status === 'healthy' ? svc.color : svc.status === 'degraded' ? 'var(--gold)' : 'var(--red)'}
                  strokeWidth={svc.status === 'healthy' ? 1.5 : 2.5}
                />
                <circle cx={svc.x + 70} cy={svc.y + 8} r={4}
                  fill={svc.status === 'healthy' ? 'var(--teal)' : svc.status === 'degraded' ? 'var(--gold)' : 'var(--red)'}
                />
                <text x={svc.x + 40} y={svc.y + 16} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">{svc.label}</text>
                <text x={svc.x + 40} y={svc.y + 29} textAnchor="middle" fill="var(--muted)" fontSize="8">{svc.latency}ms · {svc.rps} rps</text>
              </g>
            ))}
          </svg>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11 }}>
            {[{ label: 'Healthy', color: 'var(--teal)' }, { label: 'Degraded', color: 'var(--gold)' }, { label: 'Critical', color: 'var(--red)' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                <span style={{ color: 'var(--muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLOs TAB */}
      {activeTab === 'slos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>SLO / SLA Dashboard</div>
          {SLOS.map((slo, i) => <SloGauge key={i} slo={slo} />)}
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Alert Rules Engine</div>
            <button style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: 'var(--red)', color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
              + New Rule
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALERT_RULES.map(rule => (
              <div key={rule.id} style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--surface2)', border: `1px solid ${rule.status === 'firing' ? (rule.severity === 'critical' ? 'rgba(239,68,68,0.4)' : 'rgba(245,183,49,0.3)') : 'var(--border)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, fontWeight: 700, background: rule.status === 'firing' ? (rule.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,183,49,0.15)') : 'rgba(34,211,238,0.1)', color: rule.status === 'firing' ? (rule.severity === 'critical' ? 'var(--red)' : 'var(--gold)') : 'var(--teal)' }}>
                      {rule.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{rule.name}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{rule.severity}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontFamily: 'DM Mono, monospace' }}>WHEN {rule.condition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRICS TAB */}
      {activeTab === 'metrics' && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Metric Query (PromQL-style)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={metricQuery} onChange={e => setMetricQuery(e.target.value)} style={{
                flex: 1, background: '#0d1117', border: '1px solid var(--border)', borderRadius: 8,
                color: '#7dd3fc', padding: '10px 14px', fontSize: 12, outline: 'none', fontFamily: 'DM Mono, monospace',
              }} />
              <button style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--teal)', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>▶ Run</button>
            </div>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)', padding: '16px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>HTTP Requests / second</div>
            <svg width="100%" height="160" viewBox="0 0 600 160">
              {[1240, 980, 1340, 1120, 1480, 1200, 1380, 1050, 1290, 1440, 1180, 1320].map((v, i) => {
                const maxV = 1600;
                const h = (v / maxV) * 140;
                return (
                  <g key={i}>
                    <rect x={i * 50} y={150 - h} width={40} height={h} rx={4}
                      fill="var(--teal)" opacity={0.7} />
                    <text x={i * 50 + 20} y={155} textAnchor="middle" fill="var(--muted)" fontSize="8">
                      {i * 2}h
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ANOMALIES TAB */}
      {activeTab === 'anomalies' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Anomaly Detection Feed</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>AI-powered statistical anomaly detection across all services</div>
          {anomalies.map((a, i) => (
            <div key={i} style={{
              padding: '16px 18px', borderRadius: 10, marginBottom: 10,
              background: 'var(--surface2)', border: `1px solid ${a.severity === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,183,49,0.25)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{a.severity === 'critical' ? '🚨' : '⚠️'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.svc}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.metric}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: a.severity === 'critical' ? 'var(--red)' : 'var(--gold)', fontFamily: 'DM Mono, monospace' }}>{a.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>expected {a.expected}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: a.severity === 'critical' ? 'var(--red)' : 'var(--gold)', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                {a.delta} vs baseline
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
