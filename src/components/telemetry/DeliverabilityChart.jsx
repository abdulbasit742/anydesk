// DeliverabilityChart.jsx — SVG spline graph plotting success/failure telemetry over time
export default function DeliverabilityChart({ data = [], width = 400, height = 120, label = 'Deliverability' }) {
  if (!data.length) return <div style={{ color: '#444', fontFamily: 'monospace', fontSize: 12 }}>No data</div>;

  const pad = { top: 16, right: 16, bottom: 24, left: 36 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * w,
    y: pad.top + h - ((d.value - minVal) / range) * h,
    ...d,
  }));

  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + h} L ${pad.left} ${pad.top + h} Z`;

  return (
    <svg width={width} height={height} style={{ fontFamily: 'monospace', overflow: 'visible' }}>
      <defs>
        <linearGradient id="dgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FFAA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FFAA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text x={pad.left} y={12} fill="#888" fontSize={10}>{label}</text>
      <text x={pad.left - 4} y={pad.top + 4} fill="#555" fontSize={9} textAnchor="end">{Math.round(maxVal)}</text>
      <text x={pad.left - 4} y={pad.top + h} fill="#555" fontSize={9} textAnchor="end">{Math.round(minVal)}</text>
      <path d={areaPath} fill="url(#dgrad)" />
      <path d={linePath} fill="none" stroke="#00FFAA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#00FFAA" title={`${p.label || p.date}: ${p.value}`} />
      ))}
    </svg>
  );
}
