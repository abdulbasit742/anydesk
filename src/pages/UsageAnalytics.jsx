import { useState, useEffect, useRef, useCallback } from 'react';

// ─── THEME TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg:       '#0a0a0f',
  card:     '#111118',
  border:   'rgba(255,255,255,0.08)',
  text:     '#e2e8f0',
  muted:    '#8892a4',
  accent:   '#00d4aa',
  accentDim:'rgba(0,212,170,0.15)',
  red:      '#ef4444',
  yellow:   '#f59e0b',
  green:    '#22c55e',
};

const LAB_COLORS = {
  OpenAI:    '#10A37F',
  Anthropic: '#C17B5A',
  Google:    '#4285F4',
  Mistral:   '#9B59B6',
  Cohere:    '#00C2B8',
};

const MODEL_COLORS = ['#00d4aa','#6366f1','#f59e0b','#ef4444','#8b5cf6'];

// ─── MOCK DATA GENERATORS ───────────────────────────────────────────────────
function genTokenData(days) {
  const seed = [28,32,21,40,35,38,22,30,44,36,25,41,39,33,27,43,37,29,45,34,31,42,26,38,40,23,36,44,30,35];
  return seed.slice(0, days).map((v, i) => ({
    day: i + 1,
    tokens: v * 1_000_000 + Math.floor(Math.random() * 2_000_000),
  }));
}

function getTokenDataForFilter(filter) {
  if (filter === 'Today')   return genTokenData(1);
  if (filter === '7 Days')  return genTokenData(7);
  if (filter === '30 Days') return genTokenData(30);
  return genTokenData(30);
}

const COST_DATA = [
  { lab: 'OpenAI',    cost: 4821 },
  { lab: 'Anthropic', cost: 3214 },
  { lab: 'Google',    cost: 2108 },
  { lab: 'Mistral',   cost: 1634 },
  { lab: 'Cohere',    cost: 1070 },
];

const PIE_DATA = [
  { label: 'GPT-4o',        pct: 34 },
  { label: 'Claude 3.5',    pct: 22 },
  { label: 'Gemini 1.5',    pct: 18 },
  { label: 'GPT-3.5',       pct: 14 },
  { label: 'Others',        pct: 12 },
];

// 7 rows (days of week) × 24 cols (hours) latency heatmap
function genHeatmap() {
  const rows = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 24; h++) {
      const peak = (h >= 9 && h <= 18);
      const base = peak ? 400 : 150;
      const spike = Math.random() < 0.08;
      row.push(spike ? 2500 + Math.random() * 1500 : base + Math.random() * (peak ? 1800 : 600));
    }
    rows.push(row);
  }
  return rows;
}
const HEATMAP = genHeatmap();

const LEADERBOARD = [
  { model: 'GPT-4o',            lab: 'OpenAI',    efficiency: 8.4, speed: 312,  quality: 9.2, cost: 4821 },
  { model: 'Claude 3.5 Sonnet', lab: 'Anthropic', efficiency: 8.9, speed: 287,  quality: 9.4, cost: 3214 },
  { model: 'Gemini 1.5 Pro',    lab: 'Google',    efficiency: 8.1, speed: 340,  quality: 8.8, cost: 2108 },
  { model: 'GPT-3.5 Turbo',     lab: 'OpenAI',    efficiency: 9.6, speed: 182,  quality: 7.8, cost: 1100 },
  { model: 'Claude Instant',    lab: 'Anthropic', efficiency: 9.2, speed: 210,  quality: 8.1, cost: 980  },
  { model: 'Mistral Large',     lab: 'Mistral',   efficiency: 7.8, speed: 395,  quality: 8.5, cost: 1634 },
];

const DAYS_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function fmtTokens(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n;
}
function fmtMs(n) { return n.toFixed(0) + 'ms'; }
function latencyColor(ms) {
  if (ms < 500)  return T.green;
  if (ms < 2000) return T.yellow;
  return T.red;
}
function latencyOpacity(ms) {
  if (ms < 500)  return 0.4 + (ms / 500) * 0.4;
  if (ms < 2000) return 0.4 + ((ms - 500) / 1500) * 0.4;
  return 0.85;
}

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(target * ease);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

// ─── SMOOTH SVG PATH ────────────────────────────────────────────────────────
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - (pts[i - 1]?.x ?? pts[i].x)) / 6;
    const cp1y = pts[i].y + (pts[i + 1].y - (pts[i - 1]?.y ?? pts[i].y)) / 6;
    const cp2x = pts[i + 1].x - (pts[i + 2]?.x ?? pts[i + 1].x - pts[i].x + pts[i + 1].x - pts[i].x) / 6;
    const cp2y = pts[i + 1].y - ((pts[i + 2]?.y ?? pts[i + 1].y) - pts[i].y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── STAT CARD ──────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix = '', prefix = '', color = T.accent, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? 'linear-gradient(135deg, #151520 0%, #111118 100%)'
          : T.card,
        border: `1px solid ${hover ? 'rgba(0,212,170,0.25)' : T.border}`,
        borderRadius: 16,
        padding: '24px 28px',
        flex: 1,
        minWidth: 160,
        transition: 'all 0.25s ease',
        boxShadow: hover ? `0 0 24px rgba(0,212,170,0.1)` : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 12, color: T.muted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {prefix}{typeof value === 'number' ? fmtTokens(Math.round(value)) : value}{suffix}
      </div>
    </div>
  );
}

// ─── TIME FILTER ────────────────────────────────────────────────────────────
function TimeFilter({ active, onChange }) {
  const opts = ['Today', '7 Days', '30 Days', 'All Time'];
  return (
    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
      {opts.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            background: active === o ? T.accent : 'transparent',
            color: active === o ? '#0a0a0f' : T.muted,
            border: 'none',
            borderRadius: 7,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: active === o ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── SECTION CARD ───────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 20 }}>
      {children}
    </div>
  );
}

// ─── LINE CHART ─────────────────────────────────────────────────────────────
function LineChart({ data }) {
  const W = 700, H = 220, PL = 50, PR = 20, PT = 16, PB = 32;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;

  const maxVal = Math.max(...data.map(d => d.tokens));
  const minVal = Math.min(...data.map(d => d.tokens));
  const range  = maxVal - minVal || 1;

  const pts = data.map((d, i) => ({
    x: PL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: PT + innerH - ((d.tokens - minVal) / range) * innerH,
  }));

  const linePath = smoothPath(pts);
  const areaPath = pts.length > 0
    ? `${linePath} L ${pts[pts.length - 1].x} ${PT + innerH} L ${pts[0].x} ${PT + innerH} Z`
    : '';

  const yTicks = 4;

  const [hovered, setHovered] = useState(null);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={T.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={T.accent} stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="lineStrokeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="100%" stopColor={T.accent} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = PT + (i / yTicks) * innerH;
        const val = maxVal - (i / yTicks) * range;
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PL - 8} y={y + 4} textAnchor="end"
              fill={T.muted} fontSize="10">
              {(val / 1_000_000).toFixed(0)}M
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
        if (data.length <= 7 || i % Math.ceil(data.length / 7) === 0) {
          return (
            <text key={i} x={pts[i]?.x ?? 0} y={H - 4} textAnchor="middle"
              fill={T.muted} fontSize="10">
              {data.length === 1 ? 'Today' : `Day ${d.day}`}
            </text>
          );
        }
        return null;
      })}

      {/* Area fill */}
      {pts.length > 1 && (
        <path d={areaPath} fill="url(#lineAreaGrad)" />
      )}

      {/* Line */}
      {pts.length > 1 && (
        <path d={linePath} fill="none" stroke="url(#lineStrokeGrad)"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Dots */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r={hovered === i ? 6 : 4}
          fill={hovered === i ? '#fff' : T.accent}
          stroke={T.accent} strokeWidth="2"
          style={{ cursor: 'pointer', transition: 'r 0.15s' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}

      {/* Tooltip */}
      {hovered !== null && pts[hovered] && (() => {
        const p = pts[hovered];
        const d = data[hovered];
        const tx = Math.min(p.x + 10, W - 110);
        return (
          <g>
            <rect x={tx} y={p.y - 36} width={100} height={30}
              rx="6" fill="#1a1a2e" stroke={T.accent} strokeWidth="1" />
            <text x={tx + 50} y={p.y - 22} textAnchor="middle" fill={T.accent} fontSize="11" fontWeight="700">
              {(d.tokens / 1_000_000).toFixed(1)}M tokens
            </text>
            <text x={tx + 50} y={p.y - 10} textAnchor="middle" fill={T.muted} fontSize="10">
              Day {d.day}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ─── BAR CHART ──────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const W = 380, H = 220, PL = 16, PR = 16, PT = 16, PB = 32;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;
  const maxCost = Math.max(...data.map(d => d.cost));
  const barW = Math.floor(innerW / data.length) - 10;
  const [hovered, setHovered] = useState(null);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const barH = (d.cost / maxCost) * innerH;
        const x = PL + i * (innerW / data.length) + 5;
        const y = PT + innerH - barH;
        const col = LAB_COLORS[d.lab] ?? T.accent;
        const isHov = hovered === i;
        return (
          <g key={d.lab}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}>
            <defs>
              <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={col} stopOpacity={isHov ? 1 : 0.85} />
                <stop offset="100%" stopColor={col} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect x={x} y={isHov ? y - 4 : y}
              width={barW} height={isHov ? barH + 4 : barH}
              rx="5" fill={`url(#barGrad${i})`}
              style={{ transition: 'all 0.2s ease' }} />
            {isHov && (
              <text x={x + barW / 2} y={y - 10} textAnchor="middle"
                fill="#fff" fontSize="11" fontWeight="700">
                ${d.cost.toLocaleString()}
              </text>
            )}
            <text x={x + barW / 2} y={H - 10} textAnchor="middle"
              fill={T.muted} fontSize="10">
              {d.lab.slice(0, 5)}
            </text>
          </g>
        );
      })}
      {/* Y-axis ticks */}
      {[0, 0.5, 1].map((pct, i) => {
        const y = PT + innerH - pct * innerH;
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3,3" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── DONUT CHART ────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const cx = 120, cy = 110, R = 80, r = 50;
  const [hovered, setHovered] = useState(null);
  let cumAngle = -Math.PI / 2;

  function polarToXY(angle, radius) {
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function arcPath(startA, endA, outerR, innerR, expand = false) {
    const exp = expand ? 6 : 0;
    const midA = (startA + endA) / 2;
    const ox = expand ? Math.cos(midA) * exp : 0;
    const oy = expand ? Math.sin(midA) * exp : 0;
    const o1 = polarToXY(startA, outerR + exp);
    const o2 = polarToXY(endA,   outerR + exp);
    const i1 = polarToXY(startA, innerR);
    const i2 = polarToXY(endA,   innerR);
    const large = endA - startA > Math.PI ? 1 : 0;
    return [
      `M ${o1.x + ox} ${o1.y + oy}`,
      `A ${outerR + exp} ${outerR + exp} 0 ${large} 1 ${o2.x + ox} ${o2.y + oy}`,
      `L ${i2.x + ox} ${i2.y + oy}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x + ox} ${i1.y + oy}`,
      'Z',
    ].join(' ');
  }

  const total = data.reduce((s, d) => s + d.pct, 0);

  return (
    <svg width="100%" viewBox="0 0 280 220" style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const angle = (d.pct / total) * 2 * Math.PI;
        const startA = cumAngle;
        const endA   = cumAngle + angle;
        cumAngle = endA;
        const isHov = hovered === i;
        const col = MODEL_COLORS[i % MODEL_COLORS.length];
        return (
          <path
            key={d.label}
            d={arcPath(startA, endA, R, r, isHov)}
            fill={col}
            opacity={isHov ? 1 : 0.82}
            stroke={T.card}
            strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}

      {/* Center label */}
      {hovered !== null ? (
        <>
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">
            {data[hovered].pct}%
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill={T.muted} fontSize="10">
            {data[hovered].label}
          </text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill={T.text} fontSize="14" fontWeight="700">Models</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={T.muted} fontSize="10">Usage %</text>
        </>
      )}

      {/* Legend */}
      {data.map((d, i) => {
        const col = MODEL_COLORS[i % MODEL_COLORS.length];
        return (
          <g key={d.label} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <rect x={cx * 2 + 8} y={16 + i * 36} width={10} height={10} rx="3" fill={col} />
            <text x={cx * 2 + 24} y={26 + i * 36} fill={hovered === i ? T.text : T.muted} fontSize="11">
              {d.label}
            </text>
            <text x={cx * 2 + 24} y={40 + i * 36} fill={col} fontSize="12" fontWeight="700">
              {d.pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── HEATMAP ────────────────────────────────────────────────────────────────
function LatencyHeatmap({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const CELL_W = 28, CELL_H = 26, GAP = 2;
  const LABEL_W = 36;
  const svgW = LABEL_W + 24 * (CELL_W + GAP) + 8;
  const svgH = 24 + 7 * (CELL_H + GAP) + 32;

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
        {/* Hour labels */}
        {Array.from({ length: 24 }).map((_, h) => (
          (h % 4 === 0) && (
            <text key={h} x={LABEL_W + h * (CELL_W + GAP) + CELL_W / 2}
              y={16} textAnchor="middle" fill={T.muted} fontSize="9">
              {h.toString().padStart(2, '0')}:00
            </text>
          )
        ))}

        {/* Day labels + cells */}
        {data.map((row, d) => (
          <g key={d}>
            <text x={LABEL_W - 4} y={24 + d * (CELL_H + GAP) + CELL_H / 2 + 4}
              textAnchor="end" fill={T.muted} fontSize="10">
              {DAYS_LABELS[d]}
            </text>
            {row.map((ms, h) => {
              const x = LABEL_W + h * (CELL_W + GAP);
              const y = 24 + d * (CELL_H + GAP);
              const col = latencyColor(ms);
              const op  = latencyOpacity(ms);
              return (
                <rect key={h}
                  x={x} y={y} width={CELL_W} height={CELL_H} rx="3"
                  fill={col} opacity={op}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => setTooltip({ d, h, ms, x, y })}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </g>
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = Math.min(tooltip.x + CELL_W + 4, svgW - 120);
          const ty = tooltip.y - 10;
          return (
            <g>
              <rect x={tx} y={ty} width={115} height={36} rx="6"
                fill="#1a1a2e" stroke={latencyColor(tooltip.ms)} strokeWidth="1" />
              <text x={tx + 58} y={ty + 14} textAnchor="middle" fill={latencyColor(tooltip.ms)} fontSize="11" fontWeight="700">
                {fmtMs(tooltip.ms)}
              </text>
              <text x={tx + 58} y={ty + 28} textAnchor="middle" fill={T.muted} fontSize="9">
                {DAYS_LABELS[tooltip.d]}, {tooltip.h.toString().padStart(2,'0')}:00
              </text>
            </g>
          );
        })()}

        {/* Legend */}
        {[['< 500ms', T.green, 0.7], ['500–2000ms', T.yellow, 0.7], ['> 2000ms', T.red, 0.85]].map(([lbl, col, op], i) => (
          <g key={lbl}>
            <rect x={LABEL_W + i * 120} y={svgH - 18} width={12} height={12} rx="3" fill={col} opacity={op} />
            <text x={LABEL_W + i * 120 + 18} y={svgH - 8} fill={T.muted} fontSize="10">{lbl}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── LEADERBOARD TABLE ──────────────────────────────────────────────────────
function Leaderboard({ data }) {
  const [sortKey, setSortKey] = useState('efficiency');
  const [sortAsc, setSortAsc] = useState(false);
  const [hovRow, setHovRow] = useState(null);

  const cols = [
    { key: 'rank',       label: '#',               fmt: (_, i) => i + 1 },
    { key: 'model',      label: 'Model',            fmt: v => v },
    { key: 'lab',        label: 'Lab',              fmt: v => v },
    { key: 'efficiency', label: 'Efficiency Score', fmt: v => v.toFixed(1) },
    { key: 'speed',      label: 'Speed (ms)',        fmt: v => v + 'ms' },
    { key: 'quality',    label: 'Quality',          fmt: v => v.toFixed(1) + '/10' },
    { key: 'cost',       label: 'Total Cost',       fmt: v => '$' + v.toLocaleString() },
  ];

  const sorted = [...data].sort((a, b) => {
    if (sortKey === 'rank' || sortKey === 'model' || sortKey === 'lab') return 0;
    return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  function handleSort(key) {
    if (key === 'rank' || key === 'model' || key === 'lab') return;
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(false); }
  }

  const rankMedals = ['🥇','🥈','🥉'];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key}
                onClick={() => handleSort(c.key)}
                style={{
                  padding: '10px 16px',
                  textAlign: c.key === 'rank' ? 'center' : 'left',
                  color: sortKey === c.key ? T.accent : T.muted,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${T.border}`,
                  cursor: (c.key !== 'rank' && c.key !== 'model' && c.key !== 'lab') ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}>
                {c.label}
                {sortKey === c.key && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>{sortAsc ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const labCol = LAB_COLORS[row.lab] ?? T.muted;
            return (
              <tr key={row.model}
                onMouseEnter={() => setHovRow(i)}
                onMouseLeave={() => setHovRow(null)}
                style={{
                  background: hovRow === i ? 'rgba(0,212,170,0.04)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: T.muted }}>
                  {i < 3 ? rankMedals[i] : i + 1}
                </td>
                <td style={{ padding: '14px 16px', color: T.text, fontWeight: 600 }}>
                  {row.model}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: labCol + '22',
                    color: labCol,
                    border: `1px solid ${labCol}55`,
                    borderRadius: 6,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {row.lab}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 60, height: 6, background: 'rgba(255,255,255,0.06)',
                      borderRadius: 3, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(row.efficiency / 10) * 100}%`, height: '100%',
                        background: T.accent, borderRadius: 3,
                      }} />
                    </div>
                    <span style={{ color: T.accent, fontWeight: 700 }}>{row.efficiency.toFixed(1)}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: T.text }}>{row.speed}ms</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 50, height: 6, background: 'rgba(255,255,255,0.06)',
                      borderRadius: 3, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(row.quality / 10) * 100}%`, height: '100%',
                        background: '#6366f1', borderRadius: 3,
                      }} />
                    </div>
                    <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{row.quality.toFixed(1)}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: T.text, fontWeight: 600 }}>
                  ${row.cost.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function UsageAnalytics({ onNav }) {
  const [filter, setFilter] = useState('30 Days');
  const tokenData = getTokenDataForFilter(filter);

  // Count-up targets
  const totalTokens  = useCountUp(847_300_000, 1500);
  const totalCost    = useCountUp(12847, 1500);
  const apiCalls     = useCountUp(2_400_000, 1500);
  const avgLatency   = useCountUp(312, 1200);

  const containerStyle = {
    minHeight: '100vh',
    background: T.bg,
    color: T.text,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: '32px 32px 60px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, letterSpacing: '-0.02em' }}>
            Usage Analytics
          </h1>
          <p style={{ fontSize: 13, color: T.muted, margin: '6px 0 0', letterSpacing: '0.01em' }}>
            Platform-wide token, cost & latency intelligence
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TimeFilter active={filter} onChange={setFilter} />
          <button style={{
            background: T.accent,
            color: '#0a0a0f',
            border: 'none',
            borderRadius: 10,
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Total Tokens"  value={totalTokens}  suffix="T" icon="🔢" color={T.accent} />
        <StatCard label="Total Cost"    value={totalCost}    prefix="$" icon="💵" color="#f59e0b" />
        <StatCard label="API Calls"     value={apiCalls}     suffix="M" icon="⚡" color="#6366f1" />
        <StatCard label="Avg Latency"   value={avgLatency}   suffix="ms" icon="⏱️" color="#ec4899" />
      </div>

      {/* ── LINE CHART + BAR CHART ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 16, marginBottom: 24 }}>

        {/* Line Chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <CardTitle>Daily Token Usage</CardTitle>
            <span style={{ fontSize: 11, color: T.muted, background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '3px 10px' }}>
              Tokens / Day
            </span>
          </div>
          <LineChart data={tokenData} />
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardTitle>Cost by Provider</CardTitle>
          <BarChart data={COST_DATA} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {COST_DATA.map(d => (
              <span key={d.lab} style={{
                fontSize: 11, color: LAB_COLORS[d.lab],
                background: LAB_COLORS[d.lab] + '18',
                border: `1px solid ${LAB_COLORS[d.lab]}33`,
                borderRadius: 6, padding: '2px 9px',
              }}>
                {d.lab}: ${d.cost.toLocaleString()}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ── DONUT + HEATMAP ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, marginBottom: 24 }}>

        {/* Donut */}
        <Card>
          <CardTitle>Model Usage Breakdown</CardTitle>
          <DonutChart data={PIE_DATA} />
        </Card>

        {/* Heatmap */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <CardTitle>Latency Heatmap (7-Day × 24-Hour)</CardTitle>
            <span style={{ fontSize: 11, color: T.muted }}>Hover cells for details</span>
          </div>
          <LatencyHeatmap data={HEATMAP} />
        </Card>
      </div>

      {/* ── LEADERBOARD ── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <CardTitle>Model Leaderboard</CardTitle>
          <span style={{ fontSize: 11, color: T.muted }}>Click column headers to sort</span>
        </div>
        <Leaderboard data={LEADERBOARD} />
      </Card>

      {/* ── BOTTOM GRADIENT FADE ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 60,
        background: `linear-gradient(to top, ${T.bg}, transparent)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
