import { useState, useEffect, useRef } from 'react';

const SERVICES = ['api-gateway', 'auth-service', 'worker-1', 'worker-2', 'db-pool', 'cache'];
const QUOTAS = { 'api-gateway': { cpu: 40, mem: 35 }, 'auth-service': { cpu: 20, mem: 20 }, 'worker-1': { cpu: 60, mem: 50 }, 'worker-2': { cpu: 60, mem: 45 }, 'db-pool': { cpu: 30, mem: 70 }, cache: { cpu: 10, mem: 80 } };

function rand(min, max) { return Math.random() * (max - min) + min; }

function GaugeRing({ label, value, max = 100, color, unit = '%' }) {
  const r = 44, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dashOff = circ * (1 - pct);
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={dashOff} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 0.4s' }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize={16} fontWeight={800}>{Math.round(value)}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#6e7191" fontSize={10}>{unit}</text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function MiniChart({ data, color, height = 40, width = 200 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');
  const area = `${pts} ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height}>
      <polygon points={area} fill={color + '22'} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

const PROCS = [
  { pid: 1201, name: 'node server.js', cpu: 12.3, mem: 180 },
  { pid: 1340, name: 'worker.js --queue', cpu: 34.1, mem: 210 },
  { pid: 2201, name: 'postgres', cpu: 8.7, mem: 320 },
  { pid: 3301, name: 'redis-server', cpu: 2.1, mem: 64 },
  { pid: 4100, name: 'nginx', cpu: 1.4, mem: 28 },
  { pid: 5500, name: 'cron scheduler', cpu: 0.3, mem: 16 },
];

export default function ResourceMonitor() {
  const MAX_POINTS = 60;
  const [history, setHistory] = useState({ cpu: Array(MAX_POINTS).fill(0), mem: Array(MAX_POINTS).fill(0), disk: Array(MAX_POINTS).fill(0), net: Array(MAX_POINTS).fill(0) });
  const [current, setCurrent] = useState({ cpu: 0, mem: 0, disk: 0, net: 0 });
  const [alerts, setAlerts] = useState([]);
  const [procs, setProcs] = useState(PROCS);
  const [killed, setKilled] = useState([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const cpu = rand(10, 90);
      const mem = rand(40, 85);
      const disk = rand(55, 70);
      const net = rand(5, 100);
      setCurrent({ cpu, mem, disk, net });
      setHistory(h => ({
        cpu: [...h.cpu.slice(-MAX_POINTS + 1), cpu],
        mem: [...h.mem.slice(-MAX_POINTS + 1), mem],
        disk: [...h.disk.slice(-MAX_POINTS + 1), disk],
        net: [...h.net.slice(-MAX_POINTS + 1), net],
      }));
      if (cpu > 80) {
        setAlerts(a => [...a.slice(-4), { id: Date.now(), msg: `CPU spike: ${cpu.toFixed(1)}%`, ts: new Date().toLocaleTimeString() }]);
      }
      counterRef.current += 1;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const killProc = (pid) => {
    setKilled(k => [...k, pid]);
    setProcs(p => p.filter(pr => pr.pid !== pid));
  };

  const costEst = (cpu, mem) => ((cpu * 0.048 + mem * 0.006) * 730 / 100).toFixed(2);

  const METRICS = [
    { key: 'cpu', label: 'CPU', color: '#22d3ee', unit: '%' },
    { key: 'mem', label: 'Memory', color: '#a78bfa', unit: '%' },
    { key: 'disk', label: 'Disk', color: '#f5b731', unit: '%' },
    { key: 'net', label: 'Network', color: '#60a5fa', unit: 'Mbps' },
  ];

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #081820 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    btn: (c = '#22d3ee') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }),
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { padding: '8px 12px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', fontSize: 12 },
    td: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    alertBadge: { background: '#ef444418', border: '1px solid #ef444433', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#ef4444', display: 'flex', justifyContent: 'space-between' },
    quotaBar: (pct, q) => {
      const c = pct > q ? '#ef4444' : pct > q * 0.8 ? '#f5b731' : '#22d3ee';
      return { fill: c, pct, c };
    },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={s.heroTitle}>Resource Monitor</h1>
            <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Live system resource usage, processes and cost estimation</p>
          </div>
          <div style={{ background: '#22d3ee18', border: '1px solid #22d3ee33', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: 13 }}>LIVE · 2s</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {METRICS.map(m => <GaugeRing key={m.key} label={m.label} value={current[m.key]} color={m.color} unit={m.unit} />)}
        </div>
      </div>

      <div style={s.body}>
        {alerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {alerts.slice(-3).map(a => (
              <div key={a.id} style={{ ...s.alertBadge, marginBottom: 6 }}>
                <span>⚠ {a.msg}</span><span style={{ color: '#6e7191' }}>{a.ts}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {METRICS.map(m => (
            <div key={m.key} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.label}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{current[m.key].toFixed(1)}{m.unit}</span>
              </div>
              <MiniChart data={history[m.key]} color={m.color} width={340} height={50} />
              <div style={{ fontSize: 11, color: '#6e7191', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>60-point history</span>
                <span>avg: {(history[m.key].reduce((a, b) => a + b, 0) / Math.max(history[m.key].filter(v => v > 0).length, 1)).toFixed(1)}{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={s.cardTitle}>Process Table</span>
            <span style={{ fontSize: 12, color: '#6e7191' }}>Est. monthly cost: <strong style={{ color: '#f5b731' }}>${costEst(current.cpu, current.mem)}</strong></span>
          </div>
          <table style={s.table}>
            <thead><tr>{['PID', 'Process', 'CPU %', 'Mem (MB)', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {procs.map(p => (
                <tr key={p.pid}>
                  <td style={{ ...s.td, color: '#6e7191', fontFamily: 'monospace' }}>{p.pid}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace' }}>{p.name}</td>
                  <td style={s.td}><span style={{ color: p.cpu > 25 ? '#ef4444' : '#22d3ee', fontWeight: 700 }}>{p.cpu.toFixed(1)}%</span></td>
                  <td style={{ ...s.td, color: '#a78bfa' }}>{p.mem} MB</td>
                  <td style={s.td}><button style={s.btn('#ef4444')} onClick={() => killProc(p.pid)}>Kill</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <span style={{ display: 'none' }}>{killed.join(',')}</span>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Resource Quotas per Service</div>
          {SERVICES.map(svc => {
            const cpuPct = rand(10, 90);
            const memPct = rand(30, 95);
            const { c: cpuColor } = s.quotaBar(cpuPct, QUOTAS[svc].cpu);
            const { c: memColor } = s.quotaBar(memPct, QUOTAS[svc].mem);
            return (
              <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, minWidth: 120, color: '#9ca3af' }}>{svc}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 3 }}>CPU {cpuPct.toFixed(0)}% / quota {QUOTAS[svc].cpu}%</div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ width: `${Math.min(cpuPct, 100)}%`, height: '100%', background: cpuColor, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 3 }}>Mem {memPct.toFixed(0)}% / quota {QUOTAS[svc].mem}%</div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(memPct, 100)}%`, height: '100%', background: memColor, borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
