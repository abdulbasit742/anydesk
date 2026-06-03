import { useState, useEffect } from 'react';

const ALERT_RULES = [
  { id: 1, name: 'CPU > 90%', active: true },
  { id: 2, name: 'Memory > 85%', active: true },
  { id: 3, name: 'Disk > 95%', active: false },
  { id: 4, name: 'API latency > 500ms', active: true },
  { id: 5, name: 'Error rate > 5%', active: true },
];

const INIT_PROCESSES = [
  { pid: 1847, name: 'ml-inference', cpu: 21.4, mem: 18.2 },
  { pid: 1203, name: 'api-gateway', cpu: 8.7, mem: 11.4 },
  { pid: 2941, name: 'queue-worker', cpu: 4.2, mem: 6.8 },
  { pid: 3312, name: 'postgres', cpu: 3.1, mem: 22.7 },
  { pid: 4102, name: 'redis', cpu: 1.0, mem: 4.5 },
  { pid: 5500, name: 'scheduler', cpu: 0.5, mem: 2.1 },
];

const LOG_LINES = [
  '[2026-06-02 08:09:11] INFO  api-gateway: 200 GET /api/v2/status 42ms',
  '[2026-06-02 08:09:12] INFO  ml-inference: batch inference completed 1.2s',
  '[2026-06-02 08:09:13] WARN  queue-worker: queue depth 1,204 approaching threshold',
  '[2026-06-02 08:09:14] INFO  postgres: checkpoint completed',
  '[2026-06-02 08:09:15] ERROR scheduler: job #4421 failed: timeout after 30s',
  '[2026-06-02 08:09:16] INFO  api-gateway: 201 POST /api/broadcast 88ms',
  '[2026-06-02 08:09:17] INFO  redis: evicted 12 keys (maxmemory policy)',
  '[2026-06-02 08:09:18] WARN  ml-inference: GPU utilization 87%',
];

function CircleGauge({ label, value, color, size = 110 }) {
  const r = 42, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="15" fontWeight="800">{value}%</text>
      </svg>
      <div style={{ fontSize: 12, color: '#6e7191', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState({ cpu: 47, mem: 62, disk: 31, net: 55 });
  const [processes, setProcesses] = useState(INIT_PROCESSES);
  const [rules, setRules] = useState(ALERT_RULES);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logIdx, setLogIdx] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(LOG_LINES.slice(0, 4));

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setMetrics(m => ({
        cpu: Math.max(5, Math.min(95, m.cpu + (Math.random() - 0.5) * 8)),
        mem: Math.max(10, Math.min(95, m.mem + (Math.random() - 0.5) * 4)),
        disk: Math.max(5, Math.min(98, m.disk + (Math.random() - 0.5) * 2)),
        net: Math.max(5, Math.min(98, m.net + (Math.random() - 0.5) * 12)),
      }));
      setProcesses(prev => prev.map(p => ({ ...p, cpu: Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 3)), mem: Math.max(0, Math.min(100, p.mem + (Math.random() - 0.5) * 1)) })));
      setLogIdx(i => (i + 1) % LOG_LINES.length);
      setVisibleLogs(prev => [LOG_LINES[logIdx % LOG_LINES.length], ...prev].slice(0, 8));
    }, 3000);
    return () => clearInterval(id);
  }, [autoRefresh, logIdx]);

  const healthScore = Math.round((100 - metrics.cpu * 0.3 - metrics.mem * 0.2 - metrics.disk * 0.1) * 1.1);
  const gaugeColor = v => v < 50 ? '#22d3ee' : v < 75 ? '#f5b731' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#22d3ee,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>System Health</h1>
            <p style={{ color: '#6e7191', margin: 0, fontSize: 15 }}>Infrastructure monitoring with live metrics and process telemetry.</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#22d3ee', lineHeight: 1 }}>{healthScore}%</div>
            <div style={{ color: '#6e7191', fontSize: 13 }}>Health Score</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setAutoRefresh(a => !a)} style={{ padding: '8px 20px', borderRadius: 10, border: autoRefresh ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)', background: autoRefresh ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)', color: autoRefresh ? '#22d3ee' : '#6e7191', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {autoRefresh ? '● Auto-refresh ON' : '○ Auto-refresh OFF'}
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Gauges */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' }}>Resource Utilization</h2>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 36, background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 36px', justifyContent: 'space-around' }}>
          <CircleGauge label="CPU" value={Math.round(metrics.cpu)} color={gaugeColor(metrics.cpu)} />
          <CircleGauge label="Memory" value={Math.round(metrics.mem)} color={gaugeColor(metrics.mem)} />
          <CircleGauge label="Disk" value={Math.round(metrics.disk)} color={gaugeColor(metrics.disk)} />
          <CircleGauge label="Network I/O" value={Math.round(metrics.net)} color={gaugeColor(metrics.net)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Alert Rules */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Alert Rules</h2>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              {rules.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12 }}>
                  <div style={{ flex: 1, fontSize: 14 }}>{r.name}</div>
                  <button onClick={() => setRules(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x))}
                    style={{ width: 42, height: 22, borderRadius: 12, background: r.active ? '#22d3ee' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: r.active ? 23 : 3, transition: 'left .2s' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Log Console */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Log Output</h2>
            <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.8, minHeight: 200, maxHeight: 220, overflowY: 'auto' }}>
              {visibleLogs.map((line, i) => (
                <div key={i} style={{ color: line.includes('ERROR') ? '#ef4444' : line.includes('WARN') ? '#f5b731' : '#6e7191', marginBottom: 2 }}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Table */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Process Table</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px', padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Process</span><span>PID</span><span>CPU%</span><span>MEM%</span>
          </div>
          {processes.map(p => (
            <div key={p.pid} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px', padding: '12px 22px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontFamily: 'monospace', color: '#6e7191', fontSize: 12 }}>{p.pid}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: gaugeColor(p.cpu), marginBottom: 3 }}>{p.cpu.toFixed(1)}%</div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4 }}>
                  <div style={{ width: `${p.cpu}%`, height: '100%', background: gaugeColor(p.cpu), borderRadius: 3, transition: 'width 2s ease' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: gaugeColor(p.mem), marginBottom: 3 }}>{p.mem.toFixed(1)}%</div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4 }}>
                  <div style={{ width: `${p.mem}%`, height: '100%', background: gaugeColor(p.mem), borderRadius: 3, transition: 'width 2s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
