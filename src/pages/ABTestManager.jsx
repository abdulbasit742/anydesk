import { useState, useEffect, useCallback } from 'react';

// ─── Static data ─────────────────────────────────────────────────────────────

const METRICS   = ['Conversion Rate', 'Click-Through Rate', 'Session Duration', 'Error Rate', 'Revenue per User'];
const SEGMENTS  = ['All Users', 'Free Tier', 'Pro Users', 'Enterprise', 'Mobile', 'Desktop'];
const PLATFORMS = ['Web', 'Mobile', 'API', 'Slack Bot'];

const STATUS_COLORS = { running: '#22d3ee', completed: '#a78bfa', paused: '#f97316' };
const STATUS_ICONS  = { running: '▶', completed: '✓', paused: '⏸' };

const initialTests = [
  {
    id: 1, name: 'GPT-4 vs Claude 3.5 Clarity', status: 'running',
    hypothesis: 'Claude 3.5 will produce clearer outputs for technical docs',
    metric: 'Conversion Rate', segment: 'Pro Users', platform: 'Web',
    variantA: { name: 'GPT-4 Turbo', prompt: 'You are a technical documentation expert.', conversions: 142, visitors: 800, color: '#60a5fa' },
    variantB: { name: 'Claude 3.5',  prompt: 'Act as a senior technical writer.', conversions: 187, visitors: 800, color: '#f5b731' },
    traffic: 50, startDate: '2026-05-01', days: 32, confidence: 97.4,
    requiredSample: 1600,
  },
  {
    id: 2, name: 'Prompt Length Optimization', status: 'running',
    hypothesis: 'Shorter system prompts will reduce latency without quality loss',
    metric: 'Session Duration', segment: 'All Users', platform: 'Web',
    variantA: { name: 'Long Prompt (450 tokens)', prompt: 'You are an AI assistant...', conversions: 98, visitors: 600, color: '#a78bfa' },
    variantB: { name: 'Short Prompt (120 tokens)', prompt: 'Expert AI.', conversions: 112, visitors: 600, color: '#22d3ee' },
    traffic: 50, startDate: '2026-05-15', days: 17, confidence: 82.1,
    requiredSample: 1200,
  },
  {
    id: 3, name: 'Temperature 0.7 vs 0.3', status: 'completed',
    hypothesis: 'Lower temperature increases user satisfaction for factual queries',
    metric: 'Conversion Rate', segment: 'Enterprise', platform: 'API',
    variantA: { name: 'Temp 0.7 (Creative)', prompt: 'Temperature: 0.7', conversions: 201, visitors: 1000, color: '#f97316' },
    variantB: { name: 'Temp 0.3 (Precise)',  prompt: 'Temperature: 0.3', conversions: 251, visitors: 1000, color: '#22d3ee' },
    traffic: 50, startDate: '2026-04-01', days: 45, confidence: 99.2, winner: 'B',
    requiredSample: 2000,
  },
  {
    id: 4, name: 'Chain-of-Thought vs Direct', status: 'paused',
    hypothesis: 'CoT prompting leads to higher quality code generation',
    metric: 'Error Rate', segment: 'Pro Users', platform: 'Web',
    variantA: { name: 'Direct Answer',    prompt: 'Generate code directly.',           conversions: 67, visitors: 400, color: '#60a5fa' },
    variantB: { name: 'Chain-of-Thought', prompt: 'Think step by step before writing.', conversions: 89, visitors: 400, color: '#f5b731' },
    traffic: 50, startDate: '2026-05-20', days: 12, confidence: 71.3,
    requiredSample: 900,
  },
  {
    id: 5, name: 'Persona A vs Persona B', status: 'running',
    hypothesis: 'A friendly, first-person AI persona increases engagement',
    metric: 'Click-Through Rate', segment: 'Free Tier', platform: 'Web',
    variantA: { name: 'Formal Persona',   prompt: 'You are an assistant.',  conversions: 54, visitors: 480, color: '#ec4899' },
    variantB: { name: 'Friendly Persona', prompt: "Hey! I'm your AI buddy.", conversions: 71, visitors: 480, color: '#34d399' },
    traffic: 50, startDate: '2026-05-25', days: 7, confidence: 78.9,
    requiredSample: 1100,
  },
  {
    id: 6, name: 'Response Format: Bullet vs Prose', status: 'running',
    hypothesis: 'Bullet-point responses reduce time-to-value for support queries',
    metric: 'Session Duration', segment: 'Enterprise', platform: 'API',
    variantA: { name: 'Prose Output',   prompt: 'Respond in full paragraphs.',        conversions: 88, visitors: 520, color: '#60a5fa' },
    variantB: { name: 'Bullet Output',  prompt: 'Use concise bullet points always.',  conversions: 103, visitors: 520, color: '#f5b731' },
    traffic: 50, startDate: '2026-05-28', days: 4, confidence: 68.5,
    requiredSample: 1400,
  },
];

const COMPLETED_HISTORY = [
  { id: 100, name: 'System Prompt A vs B',           winner: 'B', lift: '+18.4%', duration: '30 days', confidence: 99.1, sampleSize: '4,200', metric: 'Conversion Rate', endDate: '2026-04-15' },
  { id: 101, name: 'Role Assignment Test',            winner: 'A', lift: '+7.2%',  duration: '21 days', confidence: 95.7, sampleSize: '2,800', metric: 'Session Duration', endDate: '2026-03-20' },
  { id: 102, name: 'Output Format Markdown vs Plain', winner: 'A', lift: '+24.1%', duration: '14 days', confidence: 98.3, sampleSize: '3,100', metric: 'Click-Through Rate', endDate: '2026-02-28' },
  { id: 103, name: 'Few-Shot Prompt Variants',        winner: 'B', lift: '+11.9%', duration: '28 days', confidence: 96.8, sampleSize: '5,600', metric: 'Conversion Rate', endDate: '2026-01-31' },
  { id: 104, name: 'Context Window 4K vs 8K',        winner: 'B', lift: '+9.3%',  duration: '19 days', confidence: 97.2, sampleSize: '3,800', metric: 'Revenue per User', endDate: '2026-01-14' },
  { id: 105, name: 'Streaming vs Blocking Response', winner: 'A', lift: '+31.2%', duration: '11 days', confidence: 99.5, sampleSize: '2,400', metric: 'Session Duration', endDate: '2025-12-30' },
  { id: 106, name: 'JSON vs Natural Language Output', winner: 'A', lift: '+5.8%',  duration: '24 days', confidence: 94.1, sampleSize: '4,900', metric: 'Error Rate', endDate: '2025-12-10' },
  { id: 107, name: 'Memory: 5-turn vs 20-turn',      winner: 'B', lift: '+14.7%', duration: '35 days', confidence: 98.9, sampleSize: '6,100', metric: 'Conversion Rate', endDate: '2025-11-22' },
];

// Multivariate variable options
const MV_VARIABLES_DEFAULT = [
  { id: 'v1', name: 'Tone',     options: ['Formal', 'Casual', 'Friendly'] },
  { id: 'v2', name: 'Format',   options: ['Prose', 'Bullets'] },
  { id: 'v3', name: 'Length',   options: ['Short', 'Medium', 'Long'] },
];

// ─── Pure computation helpers ─────────────────────────────────────────────────

function computeRequiredSampleSize(baseline, mde, power, alpha) {
  // Two-proportion z-test sample size approximation
  const p1 = baseline / 100;
  const p2 = p1 * (1 + mde / 100);
  const zAlpha = alpha === 0.01 ? 2.576 : 2.326; // one-tail for half alpha
  const zPower = power === 80 ? 0.842 : power === 90 ? 1.282 : 1.645;
  const pooled = (p1 + p2) / 2;
  const num = Math.pow(zAlpha * Math.sqrt(2 * pooled * (1 - pooled)) + zPower * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denom = Math.pow(p2 - p1, 2);
  if (denom === 0) return Infinity;
  return Math.ceil(num / denom);
}

function computeLift(rateA, rateB) {
  if (rateA === 0) return 0;
  return ((Math.max(rateA, rateB) - Math.min(rateA, rateB)) / Math.min(rateA, rateB)) * 100;
}

function sigBadge(confidence) {
  if (confidence >= 95) return { label: 'Significant ✓', color: '#22c55e' };
  if (confidence >= 80) return { label: 'Approaching ⚡', color: '#f5b731' };
  return { label: 'Not Significant', color: '#6e7191' };
}

function estimateDaysToSig(test) {
  const dailyVisitors = (test.variantA.visitors + test.variantB.visitors) / Math.max(test.days, 1);
  if (dailyVisitors === 0) return '—';
  const needed = test.requiredSample - test.variantA.visitors;
  if (needed <= 0) return '0';
  return Math.ceil(needed / dailyVisitors) + 'd';
}

function exportCSV(rows) {
  const headers = ['Name', 'Winner', 'Lift', 'Duration', 'Confidence', 'Sample Size', 'Metric', 'End Date'];
  const lines = [headers.join(','), ...rows.map(r =>
    [r.name, `Variant ${r.winner}`, r.lift, r.duration, r.confidence + '%', r.sampleSize, r.metric, r.endDate].join(',')
  )];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url; a.download = 'ab_test_history.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── Sub-components (module scope) ───────────────────────────────────────────

function ConversionBar({ variantA, variantB }) {
  const rateA = variantA.visitors > 0 ? (variantA.conversions / variantA.visitors) * 100 : 0;
  const rateB = variantB.visitors > 0 ? (variantB.conversions / variantB.visitors) * 100 : 0;
  const maxRate = Math.max(rateA, rateB, 10);
  const winner  = rateA >= rateB ? 'A' : 'B';
  return (
    <div style={{ marginTop: 10 }}>
      {[{ v: variantA, rate: rateA, label: 'A' }, { v: variantB, rate: rateB, label: 'B' }].map(({ v, rate, label }) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Variant {label}: <span style={{ color: '#e4e4ed' }}>{v.name}</span></span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: v.color, fontWeight: 700 }}>{rate.toFixed(1)}%</span>
              {winner === label && <span style={{ fontSize: 9, padding: '1px 5px', background: '#22d3ee20', color: '#22d3ee', borderRadius: 4, border: '1px solid #22d3ee40', fontWeight: 700 }}>WINNING</span>}
            </div>
          </div>
          <div style={{ height: 8, background: '#1c1c2a', borderRadius: 999 }}>
            <div style={{ height: '100%', borderRadius: 999, width: `${(rate / maxRate) * 100}%`, background: `linear-gradient(90deg,${v.color}cc,${v.color}80)`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{v.conversions} conversions / {v.visitors} visitors</div>
        </div>
      ))}
    </div>
  );
}

function SignificanceIndicator({ confidence }) {
  const color  = confidence >= 95 ? '#22d3ee' : confidence >= 80 ? '#f5b731' : '#ef4444';
  const label  = confidence >= 95 ? 'Significant' : confidence >= 80 ? 'Trending' : 'Not Significant';
  const pValue = ((100 - confidence) / 100).toFixed(4);
  return (
    <div style={{ padding: '10px 12px', background: `${color}10`, borderRadius: 8, border: `1px solid ${color}30`, marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color }}>{label} ({confidence.toFixed(1)}% confidence)</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>p-value: {pValue} · CI: ±{(3 - confidence / 50).toFixed(1)}%</div>
        </div>
        <div style={{ position: 'relative', width: 44, height: 44 }}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#1c1c2a" strokeWidth="4" />
            <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
              strokeDasharray={`${(confidence / 100) * 113} 113`}
              strokeLinecap="round" transform="rotate(-90 22 22)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color }}>{Math.round(confidence)}%</div>
        </div>
      </div>
    </div>
  );
}

function TrafficSlider({ value, onChange }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 10.5 }}>
        <span style={{ color: '#60a5fa', fontWeight: 700 }}>Variant A: {value}%</span>
        <span style={{ color: '#f5b731', fontWeight: 700 }}>Variant B: {100 - value}%</span>
      </div>
      <input type="range" min={10} max={90} step={5} value={value} onChange={e => onChange(+e.target.value)} style={{ width: '100%', appearance: 'none', height: 6, borderRadius: 999, background: `linear-gradient(90deg,#60a5fa ${value}%,#f5b731 ${value}%)`, outline: 'none', cursor: 'pointer' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {[[50,'50/50'],[80,'80/20'],[20,'20/80'],[67,'67/33']].map(([v, label]) => (
          <button key={v} onClick={() => onChange(v)} style={{ flex: 1, padding: '4px', borderRadius: 6, border: '1px solid var(--border)', background: value === v ? 'rgba(245,183,49,0.15)' : '#1c1c2a', color: value === v ? '#f5b731' : 'var(--muted)', cursor: 'pointer', fontSize: 10 }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function ConfidenceIntervalChart({ variantA, variantB }) {
  const W = 520, H = 120, padL = 80, padR = 20;
  const rA = variantA.visitors > 0 ? variantA.conversions / variantA.visitors : 0;
  const rB = variantB.visitors > 0 ? variantB.conversions / variantB.visitors : 0;
  const se = (r, n) => n > 0 ? Math.sqrt((r * (1 - r)) / n) * 1.96 : 0;
  const seA = se(rA, variantA.visitors);
  const seB = se(rB, variantB.visitors);
  const allVals = [rA - seA, rA + seA, rB - seB, rB + seB, 0];
  const minV = Math.max(0, Math.min(...allVals) - 0.01);
  const maxV = Math.min(1, Math.max(...allVals) + 0.01);
  const toX  = v => padL + ((v - minV) / (maxV - minV)) * (W - padL - padR);
  const data = [
    { label: 'Variant A', r: rA, se: seA, color: variantA.color, y: 35 },
    { label: 'Variant B', r: rB, se: seB, color: variantB.color, y: 80 },
  ];
  return (
    <div style={{ background: '#0e0e16', borderRadius: 10, border: '1px solid var(--border)', padding: '14px 16px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', marginBottom: 10 }}>Confidence Interval Visualization</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* Zero line / baseline */}
        <line x1={toX(minV)} y1={10} x2={toX(minV)} y2={H - 10} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        {data.map(d => {
          const cx  = toX(d.r);
          const lo  = toX(Math.max(0, d.r - d.se));
          const hi  = toX(Math.min(1, d.r + d.se));
          return (
            <g key={d.label}>
              {/* CI bar */}
              <line x1={lo} y1={d.y} x2={hi} y2={d.y} stroke={d.color} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.5" />
              {/* Whiskers */}
              <line x1={lo} y1={d.y - 8} x2={lo} y2={d.y + 8} stroke={d.color} strokeWidth="2" strokeLinecap="round" />
              <line x1={hi} y1={d.y - 8} x2={hi} y2={d.y + 8} stroke={d.color} strokeWidth="2" strokeLinecap="round" />
              {/* Center point */}
              <circle cx={cx} cy={d.y} r="6" fill={d.color} />
              {/* Label */}
              <text x={8} y={d.y + 4} fill={d.color} fontSize="10" fontWeight="700" fontFamily="DM Mono, monospace">{d.label}</text>
              {/* Value */}
              <text x={cx} y={d.y - 12} textAnchor="middle" fill={d.color} fontSize="9" fontFamily="DM Mono, monospace">{(d.r * 100).toFixed(1)}%</text>
            </g>
          );
        })}
        {/* X-axis ticks */}
        {[minV, (minV + maxV) / 2, maxV].map((v, i) => (
          <text key={i} x={toX(v)} y={H - 2} textAnchor="middle" fill="#6e7191" fontSize="8" fontFamily="DM Mono, monospace">{(v * 100).toFixed(1)}%</text>
        ))}
      </svg>
    </div>
  );
}

function PowerCurveChart({ baseline, mde, power, alpha }) {
  const W = 460, H = 130, padL = 40, padB = 24, padT = 10;
  const points = [];
  for (let m = 2; m <= 50; m += 2) {
    const n = computeRequiredSampleSize(baseline, m, power, alpha);
    points.push({ mde: m, n: Math.min(n, 50000) });
  }
  const maxN = Math.max(...points.map(p => p.n));
  const minN = Math.min(...points.map(p => p.n));
  const toX  = m => padL + ((m - 2) / 48) * (W - padL - 10);
  const toY  = n => padT + ((H - padT - padB) * (1 - (n - minN) / Math.max(maxN - minN, 1)));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.mde)} ${toY(p.n)}`).join(' ');
  const curMDE = Math.min(Math.max(mde, 2), 50);
  const curN   = computeRequiredSampleSize(baseline, curMDE, power, alpha);
  const curX   = toX(curMDE);
  const curY   = toY(Math.min(curN, 50000));
  return (
    <div style={{ background: '#0e0e16', borderRadius: 10, border: '1px solid var(--border)', padding: '14px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', marginBottom: 10 }}>Power Curve — Sample Size vs MDE</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map(f => {
          const y = padT + (H - padT - padB) * (1 - f);
          return <line key={f} x1={padL} y1={y} x2={W - 10} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
        })}
        {/* Curve */}
        <path d={pathD} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Fill under */}
        <path d={pathD + ` L ${toX(50)} ${H - padB} L ${toX(2)} ${H - padB} Z`} fill="#a78bfa" fillOpacity="0.07" />
        {/* Current point */}
        <line x1={curX} y1={padT} x2={curX} y2={H - padB} stroke="#f5b731" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={curX} cy={curY} r="5" fill="#f5b731" />
        <text x={curX + 6} y={curY - 4} fill="#f5b731" fontSize="8" fontFamily="DM Mono, monospace">{curMDE}% MDE</text>
        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1={padL} y1={H - padB} x2={W - 10} y2={H - padB} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* X ticks */}
        {[10, 20, 30, 40, 50].map(m => <text key={m} x={toX(m)} y={H - 6} textAnchor="middle" fill="#6e7191" fontSize="8" fontFamily="DM Mono, monospace">{m}%</text>)}
        {/* Y label */}
        <text x={8} y={padT + (H - padT - padB) / 2} fill="#6e7191" fontSize="8" textAnchor="middle" transform={`rotate(-90,8,${padT + (H - padT - padB) / 2})`} fontFamily="DM Mono, monospace">n/variant</text>
      </svg>
    </div>
  );
}

function StatCalculator() {
  const [baseline, setBaseline] = useState(5);
  const [mde,      setMde]      = useState(10);
  const [power,    setPower]    = useState(80);
  const [alpha,    setAlpha]    = useState(0.05);
  const [dailyTraffic]          = useState(2400);

  const n        = computeRequiredSampleSize(baseline, mde, power, alpha);
  const duration = isFinite(n) ? Math.ceil((n * 2) / dailyTraffic) : '∞';

  const inputStyle = { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none', fontFamily: 'DM Mono, monospace' };

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        🧮 Statistical Power Calculator
        <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 400 }}>— real-time calculation</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 20 }}>
        {/* Baseline */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Baseline Conversion %</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min={1} max={50} step={0.5} value={baseline} onChange={e => setBaseline(+e.target.value)} style={{ flex: 1, accentColor: '#f5b731' }} />
            <span style={{ ...inputStyle, width: 52, textAlign: 'center' }}>{baseline}%</span>
          </div>
        </div>
        {/* MDE */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Detectable Effect %</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min={2} max={50} step={1} value={mde} onChange={e => setMde(+e.target.value)} style={{ flex: 1, accentColor: '#a78bfa' }} />
            <span style={{ ...inputStyle, width: 52, textAlign: 'center' }}>{mde}%</span>
          </div>
        </div>
        {/* Power */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Statistical Power</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[80, 90, 95].map(p => (
              <button key={p} onClick={() => setPower(p)} style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: `1px solid ${power === p ? '#22d3ee' : 'var(--border)'}`, background: power === p ? 'rgba(34,211,238,0.1)' : '#0e0e16', color: power === p ? '#22d3ee' : 'var(--muted)', cursor: 'pointer', fontSize: 11, fontWeight: power === p ? 700 : 400 }}>{p}%</button>
            ))}
          </div>
        </div>
        {/* Alpha */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Significance Level (α)</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0.05, 0.01].map(a => (
              <button key={a} onClick={() => setAlpha(a)} style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: `1px solid ${alpha === a ? '#f5b731' : 'var(--border)'}`, background: alpha === a ? 'rgba(245,183,49,0.1)' : '#0e0e16', color: alpha === a ? '#f5b731' : 'var(--muted)', cursor: 'pointer', fontSize: 11, fontWeight: alpha === a ? 700 : 400 }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Sample Size / Variant', value: isFinite(n) ? n.toLocaleString() : '∞', color: '#a78bfa', note: `Total: ${isFinite(n) ? (n * 2).toLocaleString() : '∞'}` },
          { label: 'Est. Test Duration',    value: isFinite(duration) ? `${duration}d` : '∞', color: '#22d3ee', note: `@ ${(dailyTraffic).toLocaleString()} daily visitors` },
          { label: 'Min Lift Detectable',   value: `${mde}%`, color: '#f5b731', note: `α=${alpha} · power=${power}%` },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px', background: '#0e0e16', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <PowerCurveChart baseline={baseline} mde={mde} power={power} alpha={alpha} />
    </div>
  );
}

function ResultsVisualization({ tests }) {
  const [selectedTest, setSelectedTest] = useState(tests[0]?.id || null);
  const [segView, setSegView]           = useState('device');
  const [showConfirm, setShowConfirm]   = useState(false);

  const test = tests.find(t => t.id === selectedTest);

  const segData = {
    device:    [{ seg: 'Desktop', a: 5.2, b: 6.8 }, { seg: 'Mobile', a: 4.1, b: 5.2 }, { seg: 'Tablet', a: 3.8, b: 4.6 }],
    geography: [{ seg: 'North America', a: 5.8, b: 7.4 }, { seg: 'Europe', a: 4.9, b: 6.1 }, { seg: 'Asia', a: 3.4, b: 4.2 }],
    segment:   [{ seg: 'Free Tier', a: 3.1, b: 4.4 }, { seg: 'Pro', a: 6.2, b: 7.9 }, { seg: 'Enterprise', a: 8.1, b: 9.8 }],
  };

  if (!test) return <div style={{ color: 'var(--muted)', padding: 40, textAlign: 'center' }}>Select a test to view results</div>;

  const rA = test.variantA.visitors > 0 ? (test.variantA.conversions / test.variantA.visitors) * 100 : 0;
  const rB = test.variantB.visitors > 0 ? (test.variantB.conversions / test.variantB.visitors) * 100 : 0;

  const segs = segData[segView];
  const maxSeg = Math.max(...segs.flatMap(s => [s.a, s.b]));

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>📈 Results Visualization</div>
        <select value={selectedTest} onChange={e => setSelectedTest(+e.target.value)} style={{ background: '#0e0e16', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 10px', color: '#e4e4ed', fontSize: 11, outline: 'none', cursor: 'pointer' }}>
          {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Side-by-side bar chart */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>Conversion Rate Comparison</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120 }}>
          {[{ v: test.variantA, r: rA, label: 'A' }, { v: test.variantB, r: rB, label: 'B' }].map(({ v, r, label }) => {
            const h = (r / Math.max(rA, rB, 1)) * 100;
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: v.color }}>{r.toFixed(2)}%</div>
                <div style={{ width: '100%', height: h + '%', minHeight: 4, background: v.color, borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: v.color, whiteSpace: 'nowrap', paddingBottom: 4 }}>Variant {label}</div>
                </div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', textAlign: 'center' }}>{v.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CI chart */}
      <ConfidenceIntervalChart variantA={test.variantA} variantB={test.variantB} />

      {/* Segmentation */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Segment by:</span>
          {['device', 'geography', 'segment'].map(s => (
            <button key={s} onClick={() => setSegView(s)} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${segView === s ? '#22d3ee' : 'var(--border)'}`, background: segView === s ? 'rgba(34,211,238,0.1)' : '#0e0e16', color: segView === s ? '#22d3ee' : 'var(--muted)', cursor: 'pointer', fontSize: 10.5, textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segs.map(s => (
            <div key={s.seg} style={{ background: '#0e0e16', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#e4e4ed', marginBottom: 6 }}>{s.seg}</div>
              {[{ label: 'A', r: s.a, color: test.variantA.color }, { label: 'B', r: s.b, color: test.variantB.color }].map(v => (
                <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)', width: 18 }}>{v.label}</span>
                  <div style={{ flex: 1, height: 6, background: '#1c1c2a', borderRadius: 999 }}>
                    <div style={{ height: '100%', borderRadius: 999, width: `${(v.r / maxSeg) * 100}%`, background: v.color, transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 10, color: v.color, fontWeight: 700, width: 36, textAlign: 'right' }}>{v.r.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Rollout button */}
      <button onClick={() => setShowConfirm(true)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, width: '100%' }}>
        🚀 Rollout Variant B to 100%
      </button>

      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#16161e', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 14, padding: 28, maxWidth: 400, width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', marginBottom: 12 }}>⚠️ Confirm Full Rollout</div>
            <div style={{ fontSize: 13, color: '#e4e4ed', marginBottom: 8 }}>You are about to rollout <strong>Variant B</strong> of <strong>"{test.name}"</strong> to 100% of traffic.</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>This action will end the experiment and replace Variant A for all users. This cannot be undone.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✓ Confirm Rollout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MultivariateBuilder({ onAddTest }) {
  const [variables, setVariables] = useState(MV_VARIABLES_DEFAULT.map(v => ({ ...v, options: [...v.options] })));
  const [testName, setTestName]   = useState('');
  const traffic     = 50;

  const totalVariants = variables.reduce((a, v) => a * v.options.filter(o => o.trim()).length, 1);

  const updateVarName = (id, val) => setVariables(vs => vs.map(v => v.id === id ? { ...v, name: val } : v));
  const updateOption  = (vid, oi, val) => setVariables(vs => vs.map(v => v.id === vid ? { ...v, options: v.options.map((o, i) => i === oi ? val : o) } : v));
  const addOption     = (vid) => setVariables(vs => vs.map(v => v.id === vid && v.options.length < 4 ? { ...v, options: [...v.options, ''] } : v));
  const removeOption  = (vid, oi) => setVariables(vs => vs.map(v => v.id === vid && v.options.length > 2 ? { ...v, options: v.options.filter((_, i) => i !== oi) } : v));

  const handleCreate = () => {
    if (!testName.trim()) return;
    onAddTest({
      id: Date.now(), name: testName, status: 'running',
      hypothesis: `Multivariate test — ${totalVariants} variants across ${variables.length} dimensions`,
      metric: 'Conversion Rate', segment: 'All Users', platform: 'Web',
      variantA: { name: 'Control', prompt: '', conversions: 0, visitors: 0, color: '#60a5fa' },
      variantB: { name: `Best of ${totalVariants} variants`, prompt: '', conversions: 0, visitors: 0, color: '#f5b731' },
      traffic, startDate: new Date().toISOString().split('T')[0], days: 0, confidence: 0,
      requiredSample: computeRequiredSampleSize(5, 10, 80, 0.05) * totalVariants,
    });
    setTestName('');
  };

  const inputStyle = { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '6px 10px', color: '#e4e4ed', fontSize: 11, outline: 'none', fontFamily: 'DM Mono, monospace', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>🔀 Multivariate Test Builder</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 18 }}>Define variables and options — combinations are auto-calculated</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Test Name</div>
        <input value={testName} onChange={e => setTestName(e.target.value)} placeholder="e.g. Persona × Format × Length" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 18 }}>
        {variables.map(v => (
          <div key={v.id} style={{ padding: '14px', background: '#0e0e16', borderRadius: 10, border: '1px solid var(--border)' }}>
            <input value={v.name} onChange={e => updateVarName(v.id, e.target.value)} style={{ ...inputStyle, fontSize: 12, fontWeight: 700, marginBottom: 10, color: '#a78bfa', border: 'none', background: 'transparent', padding: '0 0 6px 0', borderBottom: '1px solid var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {v.options.map((o, oi) => (
                <div key={oi} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input value={o} onChange={e => updateOption(v.id, oi, e.target.value)} placeholder={`Option ${oi + 1}`} style={{ ...inputStyle, flex: 1 }} />
                  {v.options.length > 2 && (
                    <button onClick={() => removeOption(v.id, oi)} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                  )}
                </div>
              ))}
              {v.options.length < 4 && (
                <button onClick={() => addOption(v.id)} style={{ padding: '5px', borderRadius: 6, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 10 }}>+ Add Option</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ padding: '12px 16px', background: 'rgba(167,139,250,0.08)', borderRadius: 10, border: '1px solid rgba(167,139,250,0.2)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Variants</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#a78bfa', fontFamily: 'Syne, sans-serif' }}>{totalVariants}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          {variables.map(v => v.options.filter(o => o.trim()).length + ' ' + (v.name || 'var')).join(' × ')} = <span style={{ color: '#a78bfa', fontWeight: 700 }}>{totalVariants}</span> combinations
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Traffic / variant</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f5b731' }}>{(100 / totalVariants).toFixed(1)}%</div>
        </div>
      </div>

      <button onClick={handleCreate} disabled={!testName.trim()} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: testName.trim() ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : '#1c1c2a', color: testName.trim() ? '#fff' : 'var(--muted)', cursor: testName.trim() ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, transition: 'all 0.15s' }}>
        ＋ Create Multivariate Test ({totalVariants} variants)
      </button>
    </div>
  );
}

function TestHistoryTable({ history }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');

  const filtered = history.filter(h => {
    if (dateFrom && h.endDate < dateFrom) return false;
    if (dateTo   && h.endDate > dateTo)   return false;
    return true;
  });

  const inputStyle = { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '5px 10px', color: '#e4e4ed', fontSize: 11, outline: 'none', fontFamily: 'DM Mono, monospace' };

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>📋 Test History ({filtered.length})</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>From:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>To:</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          <button onClick={() => exportCSV(filtered)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--border)', background: '#0e0e16', color: '#f5b731', cursor: 'pointer', fontSize: 10.5, fontWeight: 600 }}>⬇ Export CSV</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Test Name','Metric','Winner','Lift','Confidence','Duration','Sample Size','End Date'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#16161e'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#e4e4ed', fontWeight: 600 }}>{h.name}</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'var(--muted)' }}>{h.metric}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}>Variant {h.winner}</span>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: '#f5b731' }}>{h.lift}</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: h.confidence >= 99 ? '#22c55e' : '#22d3ee' }}>{h.confidence}%</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'var(--muted)' }}>{h.duration}</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{h.sampleSize}</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{h.endDate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No tests match the selected date range.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewTestModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', hypothesis: '',
    variantAName: 'Control', variantAPrompt: '',
    variantBName: 'Treatment', variantBPrompt: '',
    metric: METRICS[0], segment: SEGMENTS[0], platform: PLATFORMS[0],
    traffic: 50,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.name || !form.hypothesis) return;
    onAdd({
      id: Date.now(), name: form.name, hypothesis: form.hypothesis,
      status: 'running', metric: form.metric, segment: form.segment, platform: form.platform,
      variantA: { name: form.variantAName, prompt: form.variantAPrompt, conversions: 0, visitors: 0, color: '#60a5fa' },
      variantB: { name: form.variantBName, prompt: form.variantBPrompt, conversions: 0, visitors: 0, color: '#f5b731' },
      traffic: form.traffic, startDate: new Date().toISOString().split('T')[0], days: 0, confidence: 0,
      requiredSample: computeRequiredSampleSize(5, 10, 80, 0.05),
    });
    onClose();
  };

  const inputStyle = { width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'DM Mono, monospace' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 600, maxHeight: '90vh', overflowY: 'auto', background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20, fontFamily: 'Syne, sans-serif' }}>🧪 Create A/B Test</div>
        {[['Test Name','name','input','e.g. Claude vs GPT-4 for Docs'],['Hypothesis','hypothesis','textarea','We believe that…']].map(([label, key, tag, ph]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            {tag === 'input'
              ? <input value={form[key]} onChange={e => set(key, e.target.value)} style={inputStyle} placeholder={ph} />
              : <textarea value={form[key]} onChange={e => set(key, e.target.value)} rows={2} style={inputStyle} placeholder={ph} />}
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          {[['Metric','metric',METRICS],['Segment','segment',SEGMENTS],['Platform','platform',PLATFORMS]].map(([label, key, opts]) => (
            <div key={key}>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ ...inputStyle, padding: '8px 10px', resize: 'none' }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
          {[['A','variantAName','variantAPrompt','#60a5fa'],['B','variantBName','variantBPrompt','#f5b731']].map(([label, nameKey, promptKey, color]) => (
            <div key={label} style={{ padding: 14, background: '#0e0e16', borderRadius: 10, border: `1px solid ${color}30` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 10 }}>Variant {label}</div>
              <input value={form[nameKey]} onChange={e => set(nameKey, e.target.value)} placeholder="Variant name" style={{ ...inputStyle, marginBottom: 8 }} />
              <textarea value={form[promptKey]} onChange={e => set(promptKey, e.target.value)} rows={4} placeholder="System prompt…" style={inputStyle} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Traffic Split</div>
          <TrafficSlider value={form.traffic} onChange={v => set('traffic', v)} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          <button onClick={handleCreate} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#f5b731,#e0a020)', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Launch Test</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ABTestManager() {
  const [tests,        setTests]        = useState(initialTests);
  const [showModal,    setShowModal]    = useState(false);
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('All');

  // Simulate live conversion updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTests(prev => prev.map(t => {
        if (t.status !== 'running') return t;
        const addA = Math.random() > 0.5 ? 1 : 0;
        const addB = Math.random() > 0.45 ? 1 : 0;
        const newA = { ...t.variantA, visitors: t.variantA.visitors + 1, conversions: t.variantA.conversions + addA };
        const newB = { ...t.variantB, visitors: t.variantB.visitors + 1, conversions: t.variantB.conversions + addB };
        const rateA = newA.conversions / newA.visitors;
        const rateB = newB.conversions / newB.visitors;
        const diff  = Math.abs(rateA - rateB);
        const avg   = (rateA + rateB) / 2;
        const z     = diff / Math.sqrt((avg * (1 - avg)) * (2 / Math.max(newA.visitors, 1)));
        const conf  = Math.min(99.9, 50 + z * 18);
        return { ...t, variantA: newA, variantB: newB, confidence: isNaN(conf) ? t.confidence : conf };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = useCallback((test) => setTests(prev => [test, ...prev]), []);

  const handleTogglePause = (id) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t));
  };

  const handleDeclareWinner = (id, variant) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', winner: variant } : t));
  };

  const handleArchive = (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const activeTests = tests.filter(t => t.status === 'running').length;
  const avgConf     = tests.length ? (tests.reduce((a, t) => a + t.confidence, 0) / tests.length).toFixed(1) : 0;
  const sigCount    = tests.filter(t => t.confidence >= 95).length;

  const completedTests = tests.filter(t => t.status === 'completed');
  const avgLift = (() => {
    if (!completedTests.length) return '—';
    const lifts = completedTests.map(t => {
      const rA = t.variantA.conversions / t.variantA.visitors;
      const rB = t.variantB.conversions / t.variantB.visitors;
      return computeLift(rA * 100, rB * 100);
    });
    return '+' + (lifts.reduce((a, b) => a + b, 0) / lifts.length).toFixed(1) + '%';
  })();

  const displayedTests = filterStatus === 'All' ? tests : tests.filter(t => t.status === filterStatus);

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#e4e4ed', paddingBottom: 80, fontFamily: 'DM Mono, monospace' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg,rgba(34,211,238,0.04) 0%,transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#22d3ee,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>
              🎯 A/B Test Manager
            </div>
            <div style={{ fontSize: 13, color: '#6e7191', marginBottom: 16 }}>Split test AI prompts • Measure real impact with statistical significance</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: `${activeTests} Active Tests`, color: '#22d3ee' },
                { label: `${avgLift} avg lift`,         color: '#f5b731' },
                { label: `${avgConf}% avg confidence`,  color: '#a78bfa' },
                { label: `${sigCount} significant`,     color: '#22c55e' },
              ].map((b, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30` }}>{b.label}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#22d3ee,#0891b2)', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>+ Create Test</button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div style={{ padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' }}>
        {[
          ['dashboard',   '🧪 Experiments'],
          ['calculator',  '🧮 Calculator'],
          ['results',     '📈 Results'],
          ['multivariate','🔀 Multivariate'],
          ['history',     '📋 History'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '12px 18px', border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, background: 'transparent', color: activeTab === id ? '#22d3ee' : '#6e7191', borderBottom: activeTab === id ? '2px solid #22d3ee' : '2px solid transparent', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
            {label}
          </button>
        ))}
        {activeTab === 'dashboard' && (
          <div style={{ marginLeft: 'auto', padding: '8px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6e7191' }}>Filter:</span>
            {['All','running','paused','completed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${filterStatus === s ? (STATUS_COLORS[s] || '#22d3ee') : 'rgba(255,255,255,0.07)'}`, background: filterStatus === s ? `${STATUS_COLORS[s] || '#22d3ee'}15` : 'transparent', color: filterStatus === s ? (STATUS_COLORS[s] || '#22d3ee') : '#6e7191', cursor: 'pointer', fontSize: 11, textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 32px' }}>

        {/* ── Tab: Experiment Dashboard ─────────────────────── */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(460px,1fr))', gap: 20 }}>
            {displayedTests.map(test => {
              const rateA = test.variantA.visitors > 0 ? (test.variantA.conversions / test.variantA.visitors * 100) : 0;
              const rateB = test.variantB.visitors > 0 ? (test.variantB.conversions / test.variantB.visitors * 100) : 0;
              const lift  = rateA > 0 ? computeLift(rateA, rateB).toFixed(1) : '0.0';
              const winnerVariant = rateB >= rateA ? 'B' : 'A';
              const sig   = sigBadge(test.confidence);
              const samplePct = Math.min(100, (test.variantA.visitors / (test.requiredSample || 1)) * 100);
              const daysEst   = estimateDaysToSig(test);

              return (
                <div key={test.id} style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 20, transition: 'box-shadow 0.15s', boxShadow: test.status === 'running' ? '0 0 0 1px rgba(34,211,238,0.06)' : 'none' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 3 }}>{test.name}</div>
                      <div style={{ fontSize: 10.5, color: '#6e7191', fontStyle: 'italic' }}>"{test.hypothesis}"</div>
                    </div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: `${STATUS_COLORS[test.status]}20`, color: STATUS_COLORS[test.status], border: `1px solid ${STATUS_COLORS[test.status]}40`, textTransform: 'uppercase', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {STATUS_ICONS[test.status]} {test.status}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12, fontSize: 10, color: '#6e7191' }}>
                    <span>📏 {test.metric}</span>
                    <span>👥 {test.segment}</span>
                    <span>💻 {test.platform}</span>
                    <span>📅 {test.days}d running</span>
                    {test.winner && <span style={{ color: '#22d3ee', fontWeight: 700 }}>🏆 Winner: {test.winner}</span>}
                  </div>

                  {/* Traffic split */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${test.traffic}%`, background: '#60a5fa' }} />
                      <div style={{ flex: 1, background: '#f5b731' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#6e7191', marginTop: 3 }}>
                      <span>A: {test.traffic}%</span><span>B: {100 - test.traffic}%</span>
                    </div>
                  </div>

                  {/* Sample size progress */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6e7191', marginBottom: 4 }}>
                      <span>Sample Progress</span>
                      <span><span style={{ color: '#e4e4ed', fontWeight: 700 }}>{test.variantA.visitors.toLocaleString()}</span> / {(test.requiredSample || 0).toLocaleString()}</span>
                    </div>
                    <div style={{ height: 5, background: '#1c1c2a', borderRadius: 999 }}>
                      <div style={{ height: '100%', borderRadius: 999, width: `${samplePct}%`, background: samplePct >= 100 ? '#22c55e' : 'linear-gradient(90deg,#22d3ee,#0891b2)', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: '#6e7191', marginTop: 3 }}>Est. {daysEst} to significance</div>
                  </div>

                  {/* Conversion bars */}
                  <ConversionBar variantA={test.variantA} variantB={test.variantB} />

                  {/* Lift + sig badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <div style={{ flex: 1, padding: '8px 12px', background: '#0e0e16', borderRadius: 8 }}>
                      <div style={{ fontSize: 9, color: '#6e7191', marginBottom: 2 }}>OBSERVED LIFT</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f5b731', fontFamily: 'Syne, sans-serif' }}>+{lift}%</div>
                      <div style={{ fontSize: 9, color: '#6e7191' }}>Variant {winnerVariant} leads</div>
                    </div>
                    <div style={{ flex: 2 }}>
                      <div style={{ padding: '8px 12px', background: `${sig.color}10`, borderRadius: 8, border: `1px solid ${sig.color}30` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: sig.color }}>{sig.label}</div>
                        <div style={{ fontSize: 9.5, color: '#6e7191', marginTop: 2 }}>{test.confidence.toFixed(1)}% confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Significance indicator */}
                  <SignificanceIndicator confidence={test.confidence} />

                  {/* Actions */}
                  {test.status !== 'completed' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button onClick={() => handleTogglePause(test.id)} style={{ flex: 1, padding: '7px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.07)', background: '#0e0e16', color: '#6e7191', cursor: 'pointer', fontSize: 11 }}>
                        {test.status === 'running' ? '⏸ Pause' : '▶ Resume'}
                      </button>
                      <button onClick={() => handleArchive(test.id)} style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}>Archive</button>
                      {test.confidence >= 80 && (
                        <button onClick={() => handleDeclareWinner(test.id, winnerVariant)} style={{ flex: 1.5, padding: '7px', borderRadius: 7, border: '1px solid #22d3ee', background: 'rgba(34,211,238,0.1)', color: '#22d3ee', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                          🏆 Declare Winner ({winnerVariant})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {displayedTests.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#6e7191' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No tests found</div>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#22d3ee,#0891b2)', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Create First Test</button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Statistical Calculator ───────────────────── */}
        {activeTab === 'calculator' && <StatCalculator />}

        {/* ── Tab: Results Visualization ────────────────────── */}
        {activeTab === 'results' && <ResultsVisualization tests={tests} />}

        {/* ── Tab: Multivariate Builder ─────────────────────── */}
        {activeTab === 'multivariate' && <MultivariateBuilder onAddTest={handleAdd} />}

        {/* ── Tab: History ──────────────────────────────────── */}
        {activeTab === 'history' && (
          <TestHistoryTable history={[
            ...COMPLETED_HISTORY,
            ...tests.filter(t => t.status === 'completed').map(t => ({
              id: t.id,
              name: t.name,
              winner: t.winner || '—',
              lift: '+' + computeLift(
                t.variantA.visitors > 0 ? (t.variantA.conversions / t.variantA.visitors) * 100 : 0,
                t.variantB.visitors > 0 ? (t.variantB.conversions / t.variantB.visitors) * 100 : 0,
              ).toFixed(1) + '%',
              duration: t.days + ' days',
              confidence: t.confidence.toFixed(1),
              sampleSize: (t.variantA.visitors + t.variantB.visitors).toLocaleString(),
              metric: t.metric,
              endDate: new Date().toISOString().split('T')[0],
            })),
          ]} />
        )}
      </div>

      {showModal && <NewTestModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
