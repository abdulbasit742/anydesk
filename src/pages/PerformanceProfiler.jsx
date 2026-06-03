import { useState, useEffect } from 'react';

const C = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#4ade80',
  text: '#e2e8f0',
  textDim: '#94a3b8',
};

// ─── Utilities ────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ─── Circular SVG Gauge ───────────────────────────────────────
function CircularGauge({ value, max = 100, label, unit = '%', color, size = 120 }) {
  const r = (size / 2) - 14;
  const cx = size / 2, cy = size / 2;
  const totalAngle = 240;
  const startAngle = 150;
  const pct = clamp(value / max, 0, 1);
  const deg = pct * totalAngle;

  function polarToXY(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg, r) {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const trackPath = describeArc(startAngle, startAngle + totalAngle, r);
  const valuePath = deg > 0.5 ? describeArc(startAngle, startAngle + deg, r) : '';

  const displayVal = unit === 'KB/s' ? value.toFixed(0) : Math.round(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path d={trackPath} stroke="rgba(255,255,255,0.06)" strokeWidth={8} fill="none" strokeLinecap="round" />
        {/* Value arc */}
        {valuePath && (
          <path
            d={valuePath}
            stroke={color}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'stroke-dasharray 0.4s ease' }}
          />
        )}
        {/* Glow dot at end */}
        {valuePath && (() => {
          const endPt = polarToXY(startAngle + deg, r);
          return <circle cx={endPt.x} cy={endPt.y} r={4} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
        })()}
        {/* Center value */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={C.text} fontSize={18} fontWeight="700" fontFamily="'DM Mono', monospace">
          {displayVal}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily="'DM Mono', monospace">
          {unit}
        </text>
      </svg>
      <span style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: C.textDim, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Flame Graph ──────────────────────────────────────────────
const FLAME_DATA = [
  [{ name: 'main()', w: 100, color: C.gold }],
  [{ name: 'render()', w: 60, color: C.teal }, { name: 'fetchData()', w: 38, color: C.teal }],
  [{ name: 'reconcile()', w: 35, color: C.purple }, { name: 'useState()', w: 23, color: C.purple }, { name: 'http.get()', w: 36, color: C.purple }],
  [{ name: 'diffTree()', w: 20, color: C.gold }, { name: 'applyPatches()', w: 14, color: C.gold }, { name: 'JSON.parse()', w: 22, color: '#f97316' }, { name: 'mapResponse()', w: 13, color: '#f97316' }],
  [{ name: 'domOps()', w: 12, color: C.teal }, { name: 'styleCalc()', w: 7, color: C.teal }, { name: 'layout()', w: 5, color: C.teal }, { name: 'decode()', w: 11, color: C.teal }, { name: 'validate()', w: 10, color: C.teal }],
];
const FLAME_DURATIONS = [342, 198, 87, 42, 15];

function FlameGraph({ highlighted, onHighlight }) {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ position: 'relative' }}>
      {FLAME_DATA.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          {row.map((block, bi) => {
            const key = `${ri}-${bi}`;
            const isHl = highlighted === key;
            return (
              <div
                key={bi}
                onMouseEnter={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ name: block.name, dur: FLAME_DURATIONS[ri], x: rect.left, y: rect.top - 40 });
                  onHighlight(key);
                }}
                onMouseLeave={() => { setTooltip(null); onHighlight(null); }}
                style={{
                  width: block.w + '%',
                  height: 28,
                  background: isHl ? `${block.color}dd` : `${block.color}66`,
                  borderRadius: 3,
                  border: `1px solid ${isHl ? block.color : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                  color: isHl ? '#fff' : C.textDim,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  boxShadow: isHl ? `0 0 8px ${block.color}80` : 'none',
                }}
              >
                {block.w > 8 ? block.name : ''}
              </div>
            );
          })}
        </div>
      ))}
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 8,
          top: tooltip.y,
          background: C.surface3,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: '5px 10px',
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          color: C.text,
          pointerEvents: 'none',
          zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <span style={{ color: C.gold }}>{tooltip.name}</span>
          <span style={{ color: C.muted, marginLeft: 8 }}>{tooltip.dur}ms</span>
        </div>
      )}
    </div>
  );
}

// ─── API Waterfall ────────────────────────────────────────────
const API_CALLS = [
  { endpoint: '/api/user/profile', method: 'GET', status: 200, start: 0, dur: 120 },
  { endpoint: '/api/dashboard/metrics', method: 'GET', status: 200, start: 80, dur: 280 },
  { endpoint: '/api/auth/token', method: 'POST', status: 200, start: 10, dur: 45 },
  { endpoint: '/api/alerts', method: 'GET', status: 404, start: 200, dur: 30 },
  { endpoint: '/api/models/list', method: 'GET', status: 200, start: 250, dur: 340 },
  { endpoint: '/api/workspace/sync', method: 'PUT', status: 200, start: 120, dur: 190 },
  { endpoint: '/api/billing/usage', method: 'GET', status: 200, start: 400, dur: 88 },
  { endpoint: '/api/logs/stream', method: 'GET', status: 500, start: 350, dur: 600 },
  { endpoint: '/api/integrations', method: 'GET', status: 200, start: 550, dur: 155 },
  { endpoint: '/api/settings/save', method: 'PATCH', status: 200, start: 650, dur: 70 },
];

function methodColor(m) {
  return { GET: C.teal, POST: C.gold, PUT: C.purple, PATCH: '#f97316', DELETE: C.red }[m] || C.muted;
}
function statusColor(s) {
  if (s >= 500) return C.red;
  if (s >= 400) return '#f97316';
  return C.teal;
}

function APIWaterfall() {
  const total = 1000;
  return (
    <div>
      {/* Axis */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, paddingLeft: 200 }}>
        {[0, 250, 500, 750, 1000].map(t => (
          <span key={t} style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: C.muted }}>{t}ms</span>
        ))}
      </div>
      {API_CALLS.map((call, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 6, gap: 8 }}>
          {/* Endpoint + Method */}
          <div style={{ width: 192, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: methodColor(call.method), background: `${methodColor(call.method)}18`, border: `1px solid ${methodColor(call.method)}40`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>{call.method}</span>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: C.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={call.endpoint}>{call.endpoint}</span>
          </div>
          {/* Bar */}
          <div style={{ flex: 1, position: 'relative', height: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
            <div style={{
              position: 'absolute',
              left: (call.start / total * 100) + '%',
              width: Math.max(call.dur / total * 100, 1) + '%',
              height: '100%',
              background: statusColor(call.status) + '55',
              borderRadius: 3,
              border: `1px solid ${statusColor(call.status)}80`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 4,
              overflow: 'hidden',
            }}>
              <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: statusColor(call.status), whiteSpace: 'nowrap' }}>{call.dur}ms</span>
            </div>
          </div>
          {/* Status */}
          <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: statusColor(call.status), width: 32, textAlign: 'right', flexShrink: 0 }}>{call.status}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Memory Timeline ──────────────────────────────────────────
function MemoryTimeline({ data }) {
  const W = 560, H = 120, PAD = { t: 10, b: 24, l: 40, r: 16 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const allVals = data.flatMap(d => [d.used, d.total]);
  const maxVal = Math.max(...allVals, 1);

  function xOf(i) { return PAD.l + (i / (data.length - 1 || 1)) * innerW; }
  function yOf(v) { return PAD.t + (1 - v / maxVal) * innerH; }

  const usedPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(d.used)}`).join(' ');
  const totalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(d.total)}`).join(' ');
  const usedArea = `${usedPath} L ${xOf(data.length - 1)} ${PAD.t + innerH} L ${PAD.l} ${PAD.t + innerH} Z`;

  const gcEvents = data.reduce((acc, d, i) => { if (d.gc) acc.push(i); return acc; }, []);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="usedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(r => {
        const y = PAD.t + (1 - r) * innerH;
        return (
          <g key={r}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <text x={PAD.l - 4} y={y + 3} textAnchor="end" fill={C.muted} fontSize={8} fontFamily="'DM Mono', monospace">
              {(maxVal * r).toFixed(0)}
            </text>
          </g>
        );
      })}
      {/* GC event lines */}
      {gcEvents.map(i => (
        <line key={i} x1={xOf(i)} y1={PAD.t} x2={xOf(i)} y2={PAD.t + innerH} stroke={C.red} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
      ))}
      {/* Area fill */}
      <path d={usedArea} fill="url(#usedGrad)" />
      {/* Lines */}
      <path d={totalPath} fill="none" stroke={C.teal} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5} />
      <path d={usedPath} fill="none" stroke={C.gold} strokeWidth={2} />
      {/* Dots on last point */}
      {data.length > 0 && (
        <circle cx={xOf(data.length - 1)} cy={yOf(data[data.length - 1].used)} r={3} fill={C.gold} style={{ filter: `drop-shadow(0 0 4px ${C.gold})` }} />
      )}
      {/* X Axis */}
      <line x1={PAD.l} y1={PAD.t + innerH} x2={W - PAD.r} y2={PAD.t + innerH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {/* Legend */}
      <g>
        <circle cx={PAD.l + 4} cy={H - 6} r={3} fill={C.gold} />
        <text x={PAD.l + 12} y={H - 3} fill={C.muted} fontSize={8} fontFamily="'DM Mono', monospace">Heap Used</text>
        <line x1={PAD.l + 72} y1={H - 6} x2={PAD.l + 82} y2={H - 6} stroke={C.teal} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={PAD.l + 88} y={H - 3} fill={C.muted} fontSize={8} fontFamily="'DM Mono', monospace">Heap Total</text>
        <line x1={PAD.l + 156} y1={H - 6} x2={PAD.l + 166} y2={H - 6} stroke={C.red} strokeWidth={1.5} strokeDasharray="3,3" />
        <text x={PAD.l + 172} y={H - 3} fill={C.muted} fontSize={8} fontFamily="'DM Mono', monospace">GC Event</text>
      </g>
    </svg>
  );
}

// ─── Operations Table ─────────────────────────────────────────
const INITIAL_OPS = [
  { op: 'renderDashboard()', count: 2847, avg: 1240, max: 2890 },
  { op: 'fetchMetrics()', count: 312, avg: 890, max: 1450 },
  { op: 'syncWorkspace()', count: 58, avg: 540, max: 980 },
  { op: 'buildFlameGraph()', count: 120, avg: 185, max: 290 },
  { op: 'parseResponse()', count: 1024, avg: 12, max: 45 },
  { op: 'reconcileTree()', count: 4200, avg: 8, max: 28 },
  { op: 'applyTransform()', count: 890, avg: 320, max: 640 },
  { op: 'loadUserSettings()', count: 22, avg: 1850, max: 3200 },
  { op: 'compressPayload()', count: 67, avg: 95, max: 210 },
  { op: 'validateSchema()', count: 445, avg: 22, max: 80 },
];

function statusBadge(avg) {
  if (avg >= 1000) return { label: 'Slow', color: C.red };
  if (avg >= 200) return { label: 'Warn', color: C.gold };
  return { label: 'Fast', color: C.green };
}

function SortIcon({ dir }) {
  return <span style={{ fontSize: 9, opacity: 0.6 }}>{dir === 'asc' ? '▲' : '▼'}</span>;
}

function OperationsTable({ ops, sortKey, sortDir, onSort }) {
  const cols = [
    { key: 'op', label: 'Operation' },
    { key: 'count', label: 'Count' },
    { key: 'avg', label: 'Avg (ms)' },
    { key: 'max', label: 'Max (ms)' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {cols.map(c => (
              <th
                key={c.key}
                onClick={() => c.key !== 'status' && onSort(c.key)}
                style={{
                  padding: '8px 12px',
                  textAlign: c.key === 'op' ? 'left' : 'right',
                  color: sortKey === c.key ? C.gold : C.muted,
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: c.key !== 'status' ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.label} {sortKey === c.key && <SortIcon dir={sortDir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ops.map((row, i) => {
            const badge = statusBadge(row.avg);
            return (
              <tr
                key={i}
                style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '9px 12px', color: C.text }}>{row.op}</td>
                <td style={{ padding: '9px 12px', color: C.textDim, textAlign: 'right' }}>{row.count.toLocaleString()}</td>
                <td style={{ padding: '9px 12px', color: badge.color, textAlign: 'right', fontWeight: 600 }}>{row.avg}</td>
                <td style={{ padding: '9px 12px', color: C.textDim, textAlign: 'right' }}>{row.max}</td>
                <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: badge.color + '18', border: `1px solid ${badge.color}40`, color: badge.color }}>
                    {badge.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── AI Recommendations ───────────────────────────────────────
const RECOMMENDATIONS = [
  { priority: 'Critical', title: 'Memoize renderDashboard()', desc: 'This component re-renders 2847 times/session. Wrapping with React.memo and useMemo for derived state could reduce renders by ~85%.', improvement: 85 },
  { priority: 'Critical', title: 'Lazy-load heavy routes', desc: 'loadUserSettings() averages 1850ms. Use React.lazy() and Suspense to defer loading until navigation intent is detected.', improvement: 72 },
  { priority: 'High', title: 'Batch fetchMetrics() calls', desc: 'Detected 312 isolated fetch calls. Use a request queue with batching window of 50ms to reduce API overhead by ~60%.', improvement: 60 },
  { priority: 'High', title: 'Virtualize large lists', desc: 'applyTransform() runs 890 times on unmeasured DOM. Use react-virtual for lists >50 items to cut layout thrash.', improvement: 45 },
  { priority: 'Medium', title: 'Enable HTTP/2 compression', desc: 'compressPayload() runs at 95ms avg with no server-side compression detected. Enable Brotli on your CDN for ~30% payload reduction.', improvement: 30 },
];

function priorityStyle(p) {
  return {
    Critical: { color: C.red, bg: `${C.red}12`, border: `${C.red}30` },
    High: { color: C.gold, bg: `${C.gold}12`, border: `${C.gold}30` },
    Medium: { color: C.purple, bg: `${C.purple}12`, border: `${C.purple}30` },
  }[p] || { color: C.muted, bg: 'transparent', border: C.border };
}

// ─── Main Component ───────────────────────────────────────────
// ─── Section Component ────────────────────────────────────────
function Section({ title, children, action }) {
  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 22px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: C.text, letterSpacing: '0.04em', margin: 0 }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function PerformanceProfiler() {
  const [cpu, setCpu] = useState(34);
  const [memory, setMemory] = useState(58);
  const [network, setNetwork] = useState(142);
  const [connections, setConnections] = useState(28);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState('10s');
  const [flameHighlight, setFlameHighlight] = useState(null);
  const [memData, setMemData] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    used: rand(280, 380),
    total: rand(400, 500),
    gc: i % 9 === 8,
  })));
  const [sortKey, setSortKey] = useState('avg');
  const [sortDir, setSortDir] = useState('desc');
  const [appliedFixes, setAppliedFixes] = useState([]);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Real-time gauge updates
  useEffect(() => {
    const iv = setInterval(() => {
      setCpu(v => clamp(v + rand(-8, 8), 5, 98));
      setMemory(v => clamp(v + rand(-4, 4), 20, 95));
      setNetwork(v => clamp(v + rand(-40, 40), 0, 800));
      setConnections(v => clamp(Math.round(v + rand(-3, 3)), 0, 100));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Memory timeline updates
  useEffect(() => {
    const iv = setInterval(() => {
      setMemData(prev => {
        const next = [...prev.slice(1), {
          used: clamp(prev[prev.length - 1].used + rand(-20, 20), 100, 600),
          total: clamp(prev[prev.length - 1].total + rand(-10, 10), 350, 700),
          gc: Math.random() < 0.1,
        }];
        return next;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortedOps = [...INITIAL_OPS].sort((a, b) => {
    const aVal = sortKey === 'op' ? a.op : a[sortKey];
    const bVal = sortKey === 'op' ? b.op : b[sortKey];
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const applyFix = (i) => {
    setAppliedFixes(prev => prev.includes(i) ? prev : [...prev, i]);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.surface, color: C.text, fontFamily: "'DM Mono', monospace", padding: '24px 28px', overflowY: 'auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes recordPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 70%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
      `}</style>

      {/* ── HERO HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>📊</span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, margin: 0, letterSpacing: '-0.02em' }}>
              Performance Profiler
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'FPS', value: '60', color: C.green },
              { label: 'Memory', value: '342 MB', color: C.teal },
              { label: 'API Calls', value: '1,284', color: C.gold },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: `${b.color}12`, border: `1px solid ${b.color}30`, borderRadius: 20, fontSize: 12 }}>
                <span style={{ color: b.color, fontWeight: 700 }}>{b.value}</span>
                <span style={{ color: C.muted }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROFILER CONTROLS ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 16px' }}>
          <button
            onClick={() => setIsRecording(r => !r)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 7,
              background: isRecording ? `${C.red}18` : C.surface3,
              border: `1px solid ${isRecording ? C.red + '60' : C.border}`,
              color: isRecording ? C.red : C.textDim,
              fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono', monospace",
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isRecording ? C.red : C.muted,
              animation: isRecording ? 'recordPulse 1.2s infinite' : 'none',
              flexShrink: 0,
            }} />
            {isRecording ? 'Recording…' : 'Record'}
          </button>

          <button
            style={{ padding: '7px 13px', borderRadius: 7, background: C.surface3, border: `1px solid ${C.border}`, color: C.textDim, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}
          >
            Clear
          </button>

          <button
            onClick={handleExport}
            style={{ padding: '7px 13px', borderRadius: 7, background: exportSuccess ? `${C.green}12` : C.surface3, border: `1px solid ${exportSuccess ? C.green + '40' : C.border}`, color: exportSuccess ? C.green : C.textDim, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono', monospace", transition: 'all 0.2s' }}
          >
            {exportSuccess ? '✓ Exported' : 'Export'}
          </button>

          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 7, background: C.surface3, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: 'pointer', outline: 'none' }}
          >
            {['5s', '10s', '30s'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ── REAL-TIME GAUGES ── */}
      <Section title="Real-time System Metrics">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          <CircularGauge value={cpu} label="CPU" color={cpu > 80 ? C.red : cpu > 60 ? C.gold : C.teal} />
          <CircularGauge value={memory} label="Memory" color={memory > 80 ? C.red : memory > 60 ? C.gold : C.purple} />
          <CircularGauge value={network} max={800} label="Network" unit="KB/s" color={C.teal} />
          <CircularGauge value={connections} max={100} label="Connections" color={C.gold} />
        </div>
      </Section>

      {/* ── FLAME GRAPH ── */}
      <Section title="Flame Graph — Call Stack">
        <div style={{ marginBottom: 8, fontSize: 11, color: C.muted }}>Hover to inspect · Click to highlight call chain · Depth 0→4</div>
        <FlameGraph highlighted={flameHighlight} onHighlight={setFlameHighlight} />
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 10, color: C.muted }}>
          {['Root call (342ms)', 'Child calls (198ms)', 'Leaf calls (15ms)'].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: [C.gold, C.teal, C.purple][i] + '66' }} />
              {l}
            </div>
          ))}
        </div>
      </Section>

      {/* ── API WATERFALL ── */}
      <Section title="API Waterfall — Request Timeline">
        <APIWaterfall />
      </Section>

      {/* ── MEMORY TIMELINE ── */}
      <Section
        title="Memory Timeline"
        action={<span style={{ fontSize: 11, color: C.muted }}>Last {memData.length} samples · updates every 2s</span>}
      >
        <MemoryTimeline data={memData} />
      </Section>

      {/* ── OPERATIONS TABLE ── */}
      <Section title="Slowest Operations">
        <OperationsTable ops={sortedOps} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
      </Section>

      {/* ── AI RECOMMENDATIONS ── */}
      <Section title="🤖 AI Recommendations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RECOMMENDATIONS.map((rec, i) => {
            const ps = priorityStyle(rec.priority);
            const applied = appliedFixes.includes(i);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, transition: 'border-color 0.2s', borderLeft: `3px solid ${ps.color}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: ps.bg, border: `1px solid ${ps.border}`, color: ps.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {rec.priority}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Syne', sans-serif" }}>{rec.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.textDim, margin: 0, lineHeight: '18px' }}>{rec.desc}</p>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>Est. improvement:</span>
                    <div style={{ flex: 1, maxWidth: 120, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <div style={{ width: rec.improvement + '%', height: '100%', background: ps.color, borderRadius: 2, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ps.color }}>{rec.improvement}%</span>
                  </div>
                </div>
                <button
                  onClick={() => applyFix(i)}
                  disabled={applied}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 7,
                    border: `1px solid ${applied ? C.green + '40' : ps.color + '40'}`,
                    background: applied ? `${C.green}12` : `${ps.color}10`,
                    color: applied ? C.green : ps.color,
                    fontSize: 11,
                    fontFamily: "'DM Mono', monospace",
                    cursor: applied ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {applied ? '✓ Applied' : 'Apply Fix'}
                </button>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
