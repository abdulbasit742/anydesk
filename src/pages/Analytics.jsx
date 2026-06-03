import { useState, useEffect, useRef, useMemo } from 'react';

// ── CSS VAR TOKENS ──────────────────────────────────────────────────────────
const C = {
  gold:     '#f5b731',
  teal:     '#22d3ee',
  purple:   '#a78bfa',
  surface:  '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border:   'rgba(255,255,255,0.07)',
  muted:    '#6e7191',
  red:      '#ef4444',
  green:    '#22c55e',
  text:     '#e2e8f0',
  textDim:  '#94a3b8',
};

// ── STATIC DATA ──────────────────────────────────────────────────────────────
const KPI_META = [
  { label: 'Bounce Rate',   value: '42.3%',  delta: -2.1, icon: '↩', positive: false },
  { label: 'Avg Session',   value: '3m 47s', delta: +8.4, icon: '⏱', positive: true  },
  { label: 'Page Views',    value: '2.94M',  delta: +12.7,icon: '👁', positive: true  },
  { label: 'Conversions',   value: '14,821', delta: +5.3, icon: '🎯', positive: true  },
  { label: 'Revenue',       value: '$84.2K', delta: +19.1,icon: '💰', positive: true  },
  { label: 'NPS Score',     value: '74',     delta: +3.0, icon: '⭐', positive: true  },
];

const PAGES_DATA = [
  { path: '/dashboard',        views: 421840, unique: 318200, avgTime: '4:12', bounce: 28.1 },
  { path: '/pricing',          views: 312000, unique: 281000, avgTime: '2:47', bounce: 41.2 },
  { path: '/docs/getting-started', views: 287400, unique: 241000, avgTime: '6:33', bounce: 18.9 },
  { path: '/blog/ai-trends',   views: 198200, unique: 176500, avgTime: '5:18', bounce: 31.4 },
  { path: '/login',            views: 174100, unique: 174100, avgTime: '1:02', bounce: 5.3  },
  { path: '/features',         views: 153900, unique: 131200, avgTime: '3:55', bounce: 36.8 },
  { path: '/about',            views: 98700,  unique: 87400,  avgTime: '2:14', bounce: 54.7 },
  { path: '/docs/api',         views: 87300,  unique: 71200,  avgTime: '7:41', bounce: 12.1 },
  { path: '/changelog',        views: 63400,  unique: 58900,  avgTime: '3:02', bounce: 47.6 },
  { path: '/contact',          views: 41200,  unique: 39800,  avgTime: '1:48', bounce: 61.3 },
];

const GEO_DATA = [
  { flag: '🇺🇸', name: 'United States', sessions: 421840, pct: 33.8 },
  { flag: '🇬🇧', name: 'United Kingdom', sessions: 198200, pct: 15.9 },
  { flag: '🇩🇪', name: 'Germany',        sessions: 142100, pct: 11.4 },
  { flag: '🇫🇷', name: 'France',         sessions: 118700, pct: 9.5  },
  { flag: '🇯🇵', name: 'Japan',          sessions: 97300,  pct: 7.8  },
  { flag: '🇨🇦', name: 'Canada',         sessions: 84200,  pct: 6.7  },
  { flag: '🇦🇺', name: 'Australia',      sessions: 71100,  pct: 5.7  },
  { flag: '🇮🇳', name: 'India',          sessions: 112400, pct: 9.0  },
];

const BROWSER_DATA = [
  { name: 'Chrome',  pct: 61.4, color: C.gold   },
  { name: 'Safari',  pct: 18.7, color: C.teal   },
  { name: 'Firefox', pct: 9.8,  color: C.purple },
  { name: 'Edge',    pct: 6.1,  color: '#fb923c' },
  { name: 'Other',   pct: 4.0,  color: C.muted  },
];

const FUNNEL_STAGES = [
  { label: 'Visit',     count: 1247000, color: C.gold   },
  { label: 'Sign Up',   count: 412000,  color: '#f97316' },
  { label: 'Activate',  count: 218000,  color: C.purple },
  { label: 'Purchase',  count: 84291,   color: C.teal   },
  { label: 'Retain',    count: 61200,   color: C.green  },
];

const TIME_RANGES = ['1H','6H','24H','7D','30D','90D','Custom'];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const WEEKS = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'];

// ── COHORT RETENTION GRID DATA ───────────────────────────────────────────────
const COHORT_DATA = (() => {
  const base = [
    [100,72,61,54,49,44,38,31],
    [100,68,57,50,46,40,34,0 ],
    [100,74,63,56,51,46,0, 0 ],
    [100,70,59,52,48,0, 0, 0 ],
    [100,76,64,57,0, 0, 0, 0 ],
    [100,71,0, 0, 0, 0, 0, 0 ],
    [100,0, 0, 0, 0, 0, 0, 0 ],
  ];
  return base;
})();

// ── UTILITY FUNCTIONS ────────────────────────────────────────────────────────
function generateSparkline(n, min, max) {
  return Array.from({ length: n }, () =>
    Math.floor(min + (max - min) * (0.3 + 0.7 * (Math.sin(Math.random() * 6) * 0.5 + 0.5)))
  );
}

function buildSparkPath(data, w, h) {
  if (!data || data.length < 2) return '';
  const mn = Math.min(...data);
  const mx = Math.max(...data) || 1;
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map(v => h - ((v - mn) / (mx - mn || 1)) * h);
  return xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
}

function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

function retentionColor(val) {
  if (val === 0) return C.surface3;
  const t = val / 100;
  const r = Math.round(14  + t * (34 - 14));
  const g = Math.round(14  + t * (197- 14));
  const b = Math.round(22  + t * (94 - 22));
  return `rgb(${r},${g},${b})`;
}

// ── SUB-COMPONENTS (all at module scope) ────────────────────────────────────

function HeroBadge({ label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: C.surface3, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '6px 14px',
    }}>
      <span style={{ color: C.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{label}</span>
      <span style={{ color: C.gold, fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono, monospace' }}>{value}</span>
    </div>
  );
}

function SparkSVG({ data, color, w = 80, h = 28 }) {
  const path = buildSparkPath(data, w, h);
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ label, value, delta, icon, sparkData }) {
  const up = delta >= 0;
  const deltaColor = (label === 'Bounce Rate') ? (up ? C.red : C.green) : (up ? C.green : C.red);
  return (
    <div style={{
      background: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 10,
      flex: '1 1 140px', minWidth: 140,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: deltaColor, fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
          {up ? '▲' : '▼'} {Math.abs(delta)}%
        </span>
      </div>
      <div style={{ color: C.text, fontSize: 22, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{value}</div>
      <div style={{ color: C.muted, fontSize: 11 }}>{label}</div>
      <SparkSVG data={sparkData} color={deltaColor} w={100} h={28} />
    </div>
  );
}

function LiveAreaChart({ data, width = 900, height = 220 }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const evts = data.map(d => d.events);
  const sess = data.map(d => d.sessions);
  const allVals = [...evts, ...sess];
  const mn = Math.min(...allVals);
  const mx = Math.max(...allVals) || 1;
  const pad = { top: 20, right: 20, bottom: 36, left: 52 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  function toY(v) { return pad.top + ch - ((v - mn) / (mx - mn || 1)) * ch; }
  function toX(i) { return pad.left + (i / (data.length - 1)) * cw; }

  function makePath(vals) {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  }

  function makeArea(vals) {
    const top = makePath(vals);
    const bottom = `L${toX(vals.length - 1).toFixed(1)},${(pad.top + ch).toFixed(1)} L${pad.left.toFixed(1)},${(pad.top + ch).toFixed(1)} Z`;
    return top + ' ' + bottom;
  }

  const gridLines = 5;
  const gridVals = Array.from({ length: gridLines + 1 }, (_, i) =>
    mn + ((mx - mn) / gridLines) * i
  );

  function handleMouseMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const mx2 = e.clientX - rect.left - pad.left;
    const idx = Math.round((mx2 / cw) * (data.length - 1));
    if (idx >= 0 && idx < data.length) {
      setTooltip({ idx, x: toX(idx), y: toY(data[idx].events) });
    }
  }

  return (
    <svg
      ref={svgRef}
      width="100%" viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <defs>
        <linearGradient id="grad-events" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="grad-sessions" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.teal} stopOpacity="0.25" />
          <stop offset="100%" stopColor={C.teal} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line
            x1={pad.left} y1={toY(v)}
            x2={pad.left + cw} y2={toY(v)}
            stroke={C.border} strokeWidth={1}
          />
          <text
            x={pad.left - 8} y={toY(v) + 4}
            fill={C.muted} fontSize={10} textAnchor="end"
            fontFamily="DM Mono, monospace"
          >{fmtNum(Math.round(v))}</text>
        </g>
      ))}

      {/* X-axis labels */}
      {data.filter((_, i) => i % 10 === 0).map((_, ii) => {
        const i = ii * 10;
        return (
          <text key={i} x={toX(i)} y={pad.top + ch + 18}
            fill={C.muted} fontSize={10} textAnchor="middle"
            fontFamily="DM Mono, monospace"
          >{i}s</text>
        );
      })}

      {/* Area fills */}
      <path d={makeArea(evts)} fill="url(#grad-events)" />
      <path d={makeArea(sess)} fill="url(#grad-sessions)" />

      {/* Lines */}
      <path d={makePath(evts)} fill="none" stroke={C.gold} strokeWidth={2} strokeLinejoin="round" />
      <path d={makePath(sess)} fill="none" stroke={C.teal} strokeWidth={2} strokeLinejoin="round" />

      {/* Tooltip */}
      {tooltip && (
        <g>
          <line
            x1={tooltip.x} y1={pad.top}
            x2={tooltip.x} y2={pad.top + ch}
            stroke={C.border} strokeWidth={1} strokeDasharray="4,3"
          />
          <circle cx={tooltip.x} cy={toY(data[tooltip.idx].events)} r={4} fill={C.gold} />
          <circle cx={tooltip.x} cy={toY(data[tooltip.idx].sessions)} r={4} fill={C.teal} />
          <rect
            x={tooltip.x + 8} y={pad.top + 10}
            width={110} height={50} rx={6}
            fill={C.surface3} stroke={C.border}
          />
          <text x={tooltip.x + 16} y={pad.top + 27} fill={C.gold} fontSize={10} fontFamily="DM Mono, monospace">
            Events: {fmtNum(data[tooltip.idx].events)}
          </text>
          <text x={tooltip.x + 16} y={pad.top + 44} fill={C.teal} fontSize={10} fontFamily="DM Mono, monospace">
            Sessions: {fmtNum(data[tooltip.idx].sessions)}
          </text>
        </g>
      )}
    </svg>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (col !== sortCol) return <span style={{ color: C.muted, marginLeft: 4 }}>⇅</span>;
  return <span style={{ color: C.gold, marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

function TopPagesTable() {
  const [sortCol, setSortCol] = useState('views');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');

  const sparklines = useMemo(() =>
    PAGES_DATA.map(() => generateSparkline(8, 10, 90)),
    []
  );

  function handleSort(col) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  }

  const filtered = PAGES_DATA.filter(p => p.path.includes(search));
  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortCol], vb = b[sortCol];
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const thStyle = (col) => ({
    padding: '10px 14px', textAlign: 'left',
    color: col === sortCol ? C.gold : C.muted,
    fontSize: 11, fontFamily: 'DM Mono, monospace',
    cursor: 'pointer', userSelect: 'none',
    borderBottom: `1px solid ${C.border}`,
    whiteSpace: 'nowrap',
  });
  const tdStyle = {
    padding: '10px 14px', fontSize: 12, color: C.text,
    fontFamily: 'DM Mono, monospace',
    borderBottom: `1px solid ${C.border}`,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>Top Pages</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filter paths…"
          style={{
            background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.text, padding: '6px 12px', fontSize: 12,
            fontFamily: 'DM Mono, monospace', outline: 'none', width: 200,
          }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[['path','Path'],['views','Views'],['unique','Unique'],['avgTime','Avg Time'],['bounce','Bounce%']].map(([col, label]) => (
                <th key={col} style={thStyle(col)} onClick={() => handleSort(col)}>
                  {label}<SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
              <th style={{ ...thStyle(null), cursor: 'default' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.path} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ ...tdStyle, color: C.teal }}>{row.path}</td>
                <td style={tdStyle}>{fmtNum(row.views)}</td>
                <td style={tdStyle}>{fmtNum(row.unique)}</td>
                <td style={tdStyle}>{row.avgTime}</td>
                <td style={{ ...tdStyle, color: row.bounce > 50 ? C.red : C.text }}>{row.bounce}%</td>
                <td style={tdStyle}>
                  <SparkSVG data={sparklines[PAGES_DATA.indexOf(row)]} color={C.teal} w={60} h={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeoMap() {
  const max = Math.max(...GEO_DATA.map(d => d.sessions));
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {/* Simplified world map SVG */}
      <div style={{ flex: '0 0 320px' }}>
        <svg viewBox="0 0 320 180" width="100%" style={{ display: 'block', borderRadius: 8, overflow: 'hidden' }}>
          <rect width="320" height="180" fill={C.surface3} rx={8} />
          {/* Continents as simplified shapes */}
          {/* N. America */}
          <rect x={20} y={30} width={70} height={70} rx={4} fill={C.teal} opacity={0.3} />
          {/* S. America */}
          <rect x={60} y={110} width={40} height={55} rx={4} fill={C.teal} opacity={0.2} />
          {/* Europe */}
          <rect x={130} y={25} width={35} height={40} rx={3} fill={C.gold} opacity={0.4} />
          {/* Africa */}
          <rect x={130} y={75} width={38} height={70} rx={4} fill={C.gold} opacity={0.25} />
          {/* Asia */}
          <rect x={175} y={20} width={100} height={80} rx={4} fill={C.purple} opacity={0.3} />
          {/* Australia */}
          <rect x={240} y={115} width={60} height={45} rx={4} fill={C.purple} opacity={0.2} />
          <text x={160} y={170} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="DM Mono, monospace">Geo Distribution (Simplified)</text>
        </svg>
      </div>
      {/* Country bars */}
      <div style={{ flex: 1, minWidth: 240 }}>
        {GEO_DATA.map(d => (
          <div key={d.name} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.text, fontFamily: 'DM Mono, monospace' }}>
                {d.flag} {d.name}
              </span>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: 'DM Mono, monospace' }}>
                {fmtNum(d.sessions)} · {d.pct}%
              </span>
            </div>
            <div style={{ background: C.surface3, borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`,
                width: `${(d.sessions / max) * 100}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceBrowserChart() {
  const devices = [
    { label: 'Desktop', pct: 58, color: C.gold   },
    { label: 'Mobile',  pct: 33, color: C.teal   },
    { label: 'Tablet',  pct: 9,  color: C.purple },
  ];

  // Donut
  const cx = 80, cy = 80, r = 55, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const slices = devices.map(d => {
    const dash = (d.pct / 100) * circumference;
    const gap  = circumference - dash;
    const slice = { ...d, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Donut */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <svg width={160} height={160}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surface3} strokeWidth={stroke} />
          {slices.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fill={C.text} fontSize={14} fontWeight="700" fontFamily="Syne, sans-serif">Devices</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="DM Mono, monospace">breakdown</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {devices.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
              <span style={{ color: C.text }}>{d.label}</span>
              <span style={{ color: C.muted }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Browser bars */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 14 }}>Browsers</div>
        {BROWSER_DATA.map(b => (
          <div key={b.name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: C.text, fontFamily: 'DM Mono, monospace' }}>{b.name}</span>
              <span style={{ fontSize: 11, color: b.color, fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{b.pct}%</span>
            </div>
            <div style={{ background: C.surface3, borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4, background: b.color,
                width: `${b.pct}%`, opacity: 0.85,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversionFunnel() {
  const maxW = 400;
  const minW = 100;
  const stageH = 52;
  const gap = 4;

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <svg width={maxW} height={FUNNEL_STAGES.length * (stageH + gap)} style={{ display: 'block', overflow: 'visible' }}>
        {FUNNEL_STAGES.map((stage, i) => {
          const t = i / (FUNNEL_STAGES.length - 1);
          const w = maxW - t * (maxW - minW);
          const xOff = (maxW - w) / 2;
          const y = i * (stageH + gap);
          const nextStage = FUNNEL_STAGES[i + 1];
          const dropoff = nextStage ? (((stage.count - nextStage.count) / stage.count) * 100).toFixed(1) : null;

          return (
            <g key={stage.label}>
              <rect x={xOff} y={y} width={w} height={stageH} rx={6}
                fill={stage.color} fillOpacity={0.18}
                stroke={stage.color} strokeWidth={1.5} strokeOpacity={0.6}
              />
              <text x={maxW / 2} y={y + stageH / 2 - 6} textAnchor="middle"
                fill={stage.color} fontSize={11} fontWeight="700" fontFamily="Syne, sans-serif">
                {stage.label}
              </text>
              <text x={maxW / 2} y={y + stageH / 2 + 10} textAnchor="middle"
                fill={C.text} fontSize={10} fontFamily="DM Mono, monospace">
                {fmtNum(stage.count)}
              </text>
              {dropoff && (
                <text x={maxW / 2 + w / 2 + 12} y={y + stageH + gap / 2 + 4}
                  fill={C.red} fontSize={9} fontFamily="DM Mono, monospace">
                  ▼ {dropoff}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
        {FUNNEL_STAGES.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            <span style={{ color: C.text }}>{s.label}</span>
            <span style={{ color: C.muted }}>{fmtNum(s.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CohortHeatmap() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 4, marginLeft: 56 }}>
        {DAYS.map(d => (
          <div key={d} style={{ width: 44, textAlign: 'center', fontSize: 9, color: C.muted, fontFamily: 'DM Mono, monospace' }}>{d}</div>
        ))}
      </div>
      {COHORT_DATA.map((row, wi) => (
        <div key={wi} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 3 }}>
          <div style={{ width: 52, fontSize: 9, color: C.muted, fontFamily: 'DM Mono, monospace', textAlign: 'right', paddingRight: 8 }}>
            {WEEKS[wi]}
          </div>
          {row.map((val, di) => (
            <div key={di} style={{
              width: 38, height: 28, margin: '0 3px',
              background: retentionColor(val),
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: val > 40 ? C.surface : C.text,
              fontFamily: 'DM Mono, monospace',
              transition: 'background 0.3s',
              cursor: val > 0 ? 'default' : 'not-allowed',
              opacity: val === 0 ? 0.4 : 1,
            }}>
              {val > 0 ? `${val}%` : '—'}
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: 'DM Mono, monospace' }}>Low</span>
        {[10,25,40,55,70,85,100].map(v => (
          <div key={v} style={{ width: 18, height: 10, borderRadius: 2, background: retentionColor(v) }} />
        ))}
        <span style={{ fontSize: 10, color: C.muted, fontFamily: 'DM Mono, monospace' }}>High</span>
      </div>
    </div>
  );
}

function ExportControls() {
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btnStyle = (color) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'transparent', border: `1px solid ${color}`,
    color, borderRadius: 8, padding: '9px 20px',
    fontSize: 12, fontFamily: 'DM Mono, monospace',
    cursor: 'pointer', transition: 'background 0.2s',
    fontWeight: 600,
  });

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button style={btnStyle(C.gold)}>⬇ Export CSV</button>
      <button style={btnStyle(C.purple)}>📄 Export PDF</button>
      <button style={btnStyle(copied ? C.green : C.teal)} onClick={handleCopyLink}>
        {copied ? '✓ Copied!' : '🔗 Share Link'}
      </button>
    </div>
  );
}

function PulsingDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: 8 }}>
      <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: C.red,
        animation: 'pulse-ring 1.2s ease-out infinite',
      }} />
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </span>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [activeRange, setActiveRange] = useState('24H');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo]   = useState('');
  const [activeSessions, setActiveSessions] = useState(1247);

  const [chartData, setChartData] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      events:   800 + Math.floor(Math.sin(i * 0.3) * 200 + 400),
      sessions: 300 + Math.floor(Math.cos(i * 0.4) * 120 + 200),
    }))
  );

  const kpiSparks = useMemo(() =>
    KPI_META.map(() => generateSparkline(8, 20, 90)),
    []
  );

  // Live active sessions counter
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSessions(prev => {
        const delta = Math.floor(1 + Math.random() * 3);
        return Math.random() > 0.4 ? prev + delta : prev - delta;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Real-time chart feed
  useEffect(() => {
    const id = setInterval(() => {
      setChartData(prev => {
        const newPt = {
          events:   800 + Math.floor(Math.sin(Date.now() * 0.001) * 300 + 400),
          sessions: 300 + Math.floor(Math.cos(Date.now() * 0.0013) * 150 + 200),
        };
        return [...prev.slice(1), newPt];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const card = (title, children, extra) => (
    <div style={{
      background: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: 24, ...extra,
    }}>
      {title && (
        <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: C.surface,
      padding: '32px 40px', fontFamily: 'DM Mono, monospace',
      color: C.text, boxSizing: 'border-box',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800,
          color: C.text, margin: 0, marginBottom: 16,
          background: `linear-gradient(90deg, ${C.gold}, ${C.teal})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Analytics Command Center
        </h1>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroBadge label="Total Events" value="8.2M" />
          <HeroBadge label="Active Sessions" value={activeSessions.toLocaleString()} />
          <HeroBadge label="Revenue" value="$84,291" />
        </div>
      </div>

      {/* ── TIME RANGE ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {TIME_RANGES.map(r => (
          <button key={r} onClick={() => setActiveRange(r)} style={{
            background: activeRange === r ? C.surface3 : 'transparent',
            border: activeRange === r ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
            borderRadius: 8, padding: '7px 16px', cursor: 'pointer',
            color: activeRange === r ? C.gold : C.muted,
            fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 600,
            borderBottom: activeRange === r ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
            transition: 'all 0.15s',
          }}>{r}</button>
        ))}
        {activeRange === 'Custom' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '6px 10px', fontSize: 12, fontFamily: 'DM Mono, monospace', outline: 'none' }}
            />
            <span style={{ color: C.muted }}>→</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '6px 10px', fontSize: 12, fontFamily: 'DM Mono, monospace', outline: 'none' }}
            />
          </div>
        )}
      </div>

      {/* ── KPI CARDS ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        {KPI_META.map((k, i) => (
          <KpiCard key={k.label} {...k} sparkData={kpiSparks[i]} />
        ))}
      </div>

      {/* ── REAL-TIME CHART ───────────────────────────────────────────────── */}
      {card(null, (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>Real-Time Event Stream</span>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                LIVE<PulsingDot />
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{c: C.gold, l: 'Events'}, {c: C.teal, l: 'Sessions'}].map(s => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 2, background: s.c, borderRadius: 1 }} />
                  <span style={{ color: C.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <LiveAreaChart data={chartData} width={900} height={220} />
        </div>
      ), { marginBottom: 28 })}

      {/* ── TOP PAGES TABLE ───────────────────────────────────────────────── */}
      {card(null, <TopPagesTable />, { marginBottom: 28 })}

      {/* ── GEO + DEVICE ROW ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 400px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Geographic Distribution</div>
          <GeoMap />
        </div>
        <div style={{ flex: '1 1 300px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Devices & Browsers</div>
          <DeviceBrowserChart />
        </div>
      </div>

      {/* ── FUNNEL + COHORT ROW ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 360px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Conversion Funnel</div>
          <ConversionFunnel />
        </div>
        <div style={{ flex: '2 1 400px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>User Cohort Retention Heatmap</div>
          <CohortHeatmap />
        </div>
      </div>

      {/* ── EXPORT CONTROLS ───────────────────────────────────────────────── */}
      {card('Export & Share', <ExportControls />, {})}

    </div>
  );
}
