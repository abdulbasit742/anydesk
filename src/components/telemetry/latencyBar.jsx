// latencyBar.jsx — Responsive metric bars comparing platform API response speeds
export default function LatencyBar({ platforms = [] }) {
  const maxLatency = Math.max(...platforms.map(p => p.latency || 0), 1);

  const getColor = (ms) => {
    if (ms < 200) return '#00FF88';
    if (ms < 500) return '#FFB800';
    if (ms < 1000) return '#FF8800';
    return '#FF4D4D';
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      {platforms.map(p => (
        <div key={p.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#aaa', fontSize: 12 }}>{p.label}</span>
            <span style={{ color: getColor(p.latency), fontSize: 12, fontWeight: 'bold' }}>
              {p.latency ? `${p.latency}ms` : 'N/A'}
            </span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#1a1e2e', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              height: '100%',
              width: `${((p.latency || 0) / maxLatency) * 100}%`,
              background: getColor(p.latency),
              borderRadius: 3,
              transition: 'width 0.4s ease',
              boxShadow: `0 0 6px ${getColor(p.latency)}88`,
            }} />
          </div>
          {p.status && (
            <span style={{ color: p.status === 'active' ? '#00FF88' : '#FF4D4D', fontSize: 10 }}>
              {p.status === 'active' ? '● online' : '● degraded'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
