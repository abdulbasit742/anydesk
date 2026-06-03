// MetricCard.jsx — Single metric stat card with trend indicator
export function MetricCard({ label, value, total, color = '#00FFAA', icon, trend, unit = '' }) {
  const pct = total ? Math.round((value / total) * 100) : null;

  return (
    <div style={{ background: '#0d1020', border: `1px solid ${color}22`, borderRadius: 12, padding: 20, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      </div>
      <div style={{ color, fontSize: 36, fontWeight: 'bold', marginBottom: 4 }}>
        {value}{unit}
        {total && <span style={{ color: '#444', fontSize: 16, marginLeft: 6 }}>/ {total}</span>}
      </div>
      {pct !== null && (
        <div style={{ height: 3, background: '#1a1e2e', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
        </div>
      )}
      {trend !== undefined && (
        <div style={{ marginTop: 8, color: trend >= 0 ? '#00FF88' : '#FF4D4D', fontSize: 11 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  );
}
