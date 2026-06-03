import { useState } from 'react';

const PLATFORMS = [
  { id: 'bolt', name: 'bolt.new', color: '#f5b731' },
  { id: 'lovable', name: 'lovable.dev', color: '#a78bfa' },
  { id: 'v0', name: 'v0.dev', color: '#22d3ee' },
  { id: 'cursor', name: 'cursor', color: '#60a5fa' },
  { id: 'replit', name: 'replit', color: '#ef4444' },
];

const AXES = ['Speed', 'Reliability', 'Cost', 'Quality', 'Coverage'];

// Scores: each platform has a score per axis
const SCORES_NOW = {
  bolt:    { Speed: 88, Reliability: 79, Cost: 72, Quality: 85, Coverage: 91 },
  lovable: { Speed: 75, Reliability: 83, Cost: 88, Quality: 80, Coverage: 74 },
  v0:      { Speed: 91, Reliability: 76, Cost: 80, Quality: 88, Coverage: 70 },
  cursor:  { Speed: 70, Reliability: 91, Cost: 65, Quality: 92, Coverage: 82 },
  replit:  { Speed: 82, Reliability: 68, Cost: 95, Quality: 71, Coverage: 88 },
};
const SCORES_PREV = {
  bolt:    { Speed: 80, Reliability: 72, Cost: 70, Quality: 80, Coverage: 85 },
  lovable: { Speed: 70, Reliability: 78, Cost: 85, Quality: 74, Coverage: 68 },
  v0:      { Speed: 85, Reliability: 70, Cost: 76, Quality: 83, Coverage: 65 },
  cursor:  { Speed: 66, Reliability: 87, Cost: 62, Quality: 88, Coverage: 78 },
  replit:  { Speed: 78, Reliability: 63, Cost: 90, Quality: 67, Coverage: 82 },
};

function RadarChart({ platforms, scores, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = AXES.length;
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt = (i, v) => {
    const a = angle(i);
    const rr = (v / 100) * r;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };
  const axisEnd = (i) => {
    const a = angle(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const labelPt = (i) => {
    const a = angle(i);
    const rr = r + 22;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <polygon key={frac} points={AXES.map((_, i) => axisEnd(i).map(v => (v - cx) * frac + cx).join(',')).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {/* Axes */}
      {AXES.map((_, i) => {
        const [x, y] = axisEnd(i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
      })}
      {/* Labels */}
      {AXES.map((ax, i) => {
        const [x, y] = labelPt(i);
        return <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#6e7191" fontSize="11" fontWeight="600">{ax}</text>;
      })}
      {/* Data polygons */}
      {platforms.map(plat => {
        const pts = AXES.map((ax, i) => pt(i, scores[plat.id][ax]).join(',')).join(' ');
        return (
          <g key={plat.id}>
            <polygon points={pts} fill={plat.color} fillOpacity="0.1" stroke={plat.color} strokeWidth="2" strokeLinejoin="round" />
            {AXES.map((ax, i) => {
              const [x, y] = pt(i, scores[plat.id][ax]);
              return <circle key={ax} cx={x} cy={y} r={3} fill={plat.color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function PlatformRadar() {
  const [visible, setVisible] = useState(PLATFORMS.map(p => p.id));
  const [comparison, setComparison] = useState('now');

  const scores = comparison === 'now' ? SCORES_NOW : SCORES_PREV;
  const activePlatforms = PLATFORMS.filter(p => visible.includes(p.id));

  const toggle = (id) => setVisible(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', background: 'linear-gradient(90deg,#f5b731,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform Radar</h1>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Multi-platform performance comparison across key dimensions.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => {
            const avg = Math.round(Object.values(SCORES_NOW[p.id]).reduce((a, b) => a + b, 0) / AXES.length);
            return (
              <div key={p.id} style={{ background: `${p.color}10`, border: `1px solid ${p.color}40`, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: p.color }}>{avg}</div>
                <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>{p.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          <span style={{ color: '#6e7191', fontSize: 13, fontWeight: 600 }}>Platforms:</span>
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => toggle(p.id)} style={{ padding: '7px 16px', borderRadius: 20, border: visible.includes(p.id) ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.1)', background: visible.includes(p.id) ? `${p.color}18` : 'rgba(255,255,255,0.03)', color: visible.includes(p.id) ? p.color : '#6e7191', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {p.name}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['now', 'prev'].map(c => (
              <button key={c} onClick={() => setComparison(c)} style={{ padding: '7px 16px', borderRadius: 10, border: comparison === c ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)', background: comparison === c ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)', color: comparison === c ? '#22d3ee' : '#6e7191', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                {c === 'now' ? 'This Month' : 'Last Month'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Radar */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <RadarChart platforms={activePlatforms} scores={scores} />
            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: visible.includes(p.id) ? 1 : 0.3 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontSize: 12, color: '#bbb' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Table */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>Dimension Scores</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1 }}>Axis</th>
                    {PLATFORMS.map(p => (
                      <th key={p.id} style={{ padding: '10px 16px', fontSize: 11, color: p.color, textTransform: 'uppercase', letterSpacing: 1 }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AXES.map(ax => (
                    <tr key={ax} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: 14 }}>{ax}</td>
                      {PLATFORMS.map(p => {
                        const v = scores[p.id][ax];
                        const prev = SCORES_PREV[p.id][ax];
                        const delta = v - prev;
                        return (
                          <td key={p.id} style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{v}</div>
                            <div style={{ fontSize: 10, color: delta >= 0 ? '#22d3ee' : '#ef4444', marginTop: 2 }}>{delta >= 0 ? '+' : ''}{delta}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 800, fontSize: 14, color: '#a78bfa' }}>Average</td>
                    {PLATFORMS.map(p => {
                      const avg = Math.round(Object.values(scores[p.id]).reduce((a, b) => a + b, 0) / AXES.length);
                      return <td key={p.id} style={{ padding: '14px 16px', textAlign: 'center', fontSize: 20, fontWeight: 900, color: p.color }}>{avg}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
