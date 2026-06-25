import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const REGIONS = [
  { name: 'North America', code: 'US', sessions: 48_420, share: 41, color: '#22d3ee' },
  { name: 'Europe', code: 'EU', sessions: 31_800, share: 27, color: '#a78bfa' },
  { name: 'Asia Pacific', code: 'APAC', sessions: 26_100, share: 22, color: '#f5b731' },
  { name: 'Latin America', code: 'LATAM', sessions: 11_780, share: 10, color: '#60a5fa' },
];

const DEVICES = [
  { type: 'Desktop', pct: 54, color: '#22d3ee' },
  { type: 'Mobile', pct: 29, color: '#a78bfa' },
  { type: 'API', pct: 17, color: '#f5b731' },
];

// Generate heatmap data: 7 days x 24 hours
function genHeatmap() {
  return DAYS.map(() => HOURS.map(() => {
    const base = Math.random();
    // simulate peak at 10am-4pm
    return base;
  }));
}

const heatData = genHeatmap();

// Normalize to get peak
const allVals = heatData.flat();
const maxVal = Math.max(...allVals);

function intensityColor(v) {
  const ratio = v / maxVal;
  if (ratio < 0.15) return 'rgba(34,211,238,0.06)';
  if (ratio < 0.35) return 'rgba(34,211,238,0.18)';
  if (ratio < 0.55) return 'rgba(34,211,238,0.36)';
  if (ratio < 0.75) return 'rgba(34,211,238,0.58)';
  return 'rgba(34,211,238,0.85)';
}

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'Last 90d'];

export default function ActivityMap() {
  const [dateRange, setDateRange] = useState('This Week');
  const [hoveredCell, setHoveredCell] = useState(null);

  const totalSessions = REGIONS.reduce((a, r) => a + r.sessions, 0);

  // Find peak hour
  const hourTotals = HOURS.map(h => heatData.reduce((s, day) => s + day[h], 0));
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals));

  const exportCSV = () => {
    const rows = [['Day', 'Hour', 'Value'], ...DAYS.flatMap((d, di) => HOURS.map(h => [d, h, heatData[di][h].toFixed(3)]))];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'activity.csv'; a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#22d3ee,#f5b731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Activity Map</h1>
            <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Global user activity heatmap across days and hours.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 12, padding: '10px 20px' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#22d3ee' }}>{totalSessions.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#6e7191' }}>Total Sessions</div>
              </div>
              <div style={{ background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.3)', borderRadius: 12, padding: '10px 20px' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f5b731' }}>{peakHour}:00</div>
                <div style={{ fontSize: 12, color: '#6e7191' }}>Peak Hour</div>
              </div>
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: '10px 20px' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa' }}>4</div>
                <div style={{ fontSize: 12, color: '#6e7191' }}>Active Regions</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {DATE_RANGES.map(dr => (
                <button key={dr} onClick={() => setDateRange(dr)} style={{ padding: '7px 14px', borderRadius: 9, border: dateRange === dr ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)', background: dateRange === dr ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)', color: dateRange === dr ? '#22d3ee' : '#6e7191', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  {dr}
                </button>
              ))}
            </div>
            <button onClick={exportCSV} style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(245,183,49,0.3)', background: 'rgba(245,183,49,0.08)', color: '#f5b731', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              ⬇ Export CSV
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Heatmap */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Activity Heatmap (Days × Hours)</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', marginBottom: 28, overflowX: 'auto' }}>
          {/* Hour labels */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 4, paddingLeft: 40 }}>
            {HOURS.filter(h => h % 3 === 0).map(h => (
              <div key={h} style={{ width: `${(100 / 8)}%`, fontSize: 9, color: '#6e7191', textAlign: 'center', flexShrink: 0, minWidth: 28 }}>{h}h</div>
            ))}
          </div>
          {DAYS.map((day, di) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
              <div style={{ width: 36, fontSize: 11, color: '#6e7191', flexShrink: 0 }}>{day}</div>
              {HOURS.map(h => (
                <div
                  key={h}
                  onMouseEnter={() => setHoveredCell({ day, hour: h, val: heatData[di][h] })}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    flex: 1, height: 18, minWidth: 14, borderRadius: 3,
                    background: intensityColor(heatData[di][h]),
                    border: hoveredCell?.day === day && hoveredCell?.hour === h ? '1px solid #22d3ee' : '1px solid transparent',
                    cursor: 'default', transition: 'border .1s',
                  }}
                />
              ))}
            </div>
          ))}
          {hoveredCell && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#22d3ee' }}>
              {hoveredCell.day} {hoveredCell.hour}:00 — Intensity: {(hoveredCell.val / maxVal * 100).toFixed(0)}%
            </div>
          )}
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ fontSize: 11, color: '#6e7191' }}>Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
              <div key={v} style={{ width: 20, height: 12, borderRadius: 3, background: intensityColor(v * maxVal) }} />
            ))}
            <span style={{ fontSize: 11, color: '#6e7191' }}>High</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Region Breakdown */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Region Breakdown</h2>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              {REGIONS.map(r => (
                <div key={r.code} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                    <span style={{ color: r.color, fontWeight: 700, fontSize: 14 }}>{r.sessions.toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${r.share}%`, height: '100%', background: r.color, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#6e7191', marginTop: 4 }}>{r.share}% of total traffic</div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Device Breakdown</h2>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px' }}>
              {DEVICES.map(d => (
                <div key={d.type} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>{d.type}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{d.pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 10 }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: `linear-gradient(90deg,${d.color},${d.color}80)`, borderRadius: 6, transition: 'width 0.6s' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '12px', background: 'rgba(245,183,49,0.06)', border: '1px solid rgba(245,183,49,0.2)', borderRadius: 10, fontSize: 13, color: '#f5b731' }}>
                ⚡ Peak hours: {peakHour}:00 – {(peakHour + 2) % 24}:00 UTC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
