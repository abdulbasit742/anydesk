// ActivityHeatmap.jsx — 35-day block density activity grid for prompt transmissions
export default function ActivityHeatmap({ data = [], days = 35, label = 'Activity' }) {
  const cols = 7;

  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const key = date.toISOString().split('T')[0];
    const value = data.find(d => d.date === key)?.count || 0;
    return { date: key, value, label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
  });

  const maxVal = Math.max(...cells.map(c => c.value), 1);

  const getColor = (value) => {
    if (!value) return '#1a1e2e';
    const intensity = value / maxVal;
    if (intensity < 0.25) return '#0d3321';
    if (intensity < 0.5) return '#0e6640';
    if (intensity < 0.75) return '#00994d';
    return '#00FF88';
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <p style={{ color: '#888', fontSize: 11, marginBottom: 8 }}>{label} — last {days} days</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 14px)`, gap: 3 }}>
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.label}: ${cell.value} transmissions`}
            style={{
              width: 14, height: 14,
              borderRadius: 3,
              backgroundColor: getColor(cell.value),
              cursor: 'default',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 8 }}>
        <span style={{ color: '#555', fontSize: 10 }}>Less</span>
        {['#1a1e2e', '#0d3321', '#0e6640', '#00994d', '#00FF88'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: c }} />
        ))}
        <span style={{ color: '#555', fontSize: 10 }}>More</span>
      </div>
    </div>
  );
}
