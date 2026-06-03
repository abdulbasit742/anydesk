// TokenBurnBar.jsx — Tracks credit utilization rates relative to platforms and days
export default function TokenBurnBar({ used = 0, total = 1000, platform = '', color = '#00FFAA', label }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const barColor = pct >= 90 ? '#FF4D4D' : pct >= 70 ? '#FFB800' : color;

  return (
    <div style={{ fontFamily: 'monospace', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#aaa', fontSize: 12 }}>{label || platform}</span>
        <span style={{ color: barColor, fontSize: 12, fontWeight: 'bold' }}>
          {used.toLocaleString()} / {total.toLocaleString()} ({pct}%)
        </span>
      </div>
      <div style={{ height: 8, background: '#1a1e2e', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
          borderRadius: 4,
          transition: 'width 0.6s ease',
        }} />
      </div>
      {pct >= 90 && (
        <p style={{ color: '#FF4D4D', fontSize: 10, marginTop: 3 }}>
          ⚠ Critical: {100 - pct}% remaining
        </p>
      )}
    </div>
  );
}
