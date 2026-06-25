// PlatformPie.jsx — Mini donut chart showing account distributions across platforms
export default function PlatformPie({ platforms = [], size = 100 }) {
  const total = platforms.reduce((acc, p) => acc + (p.count || 1), 0);
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.55;

  let currentAngle = -Math.PI / 2;
  const slices = [];
  for (const p of platforms) {
    const angle = ((p.count || 1) / total) * Math.PI * 2;
    const startAngle = currentAngle;
    currentAngle += angle;
    slices.push({ ...p, startAngle, endAngle: currentAngle, angle });
  }

  const arc = (cx, cy, r, start, end) => {
    const x1 = cx + Math.cos(start) * r, y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r, y2 = cy + Math.sin(end) * r;
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const COLORS = ['#00FFAA', '#FFB800', '#6699FF', '#FF4D8F', '#FF8800', '#88FF00'];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path
          key={s.id || i}
          d={arc(cx, cy, outerR, s.startAngle, s.endAngle)}
          fill={s.color || COLORS[i % COLORS.length]}
          opacity={0.85}
        >
          <title>{s.label}: {s.count || 1}</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={innerR} fill="#080c14" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#aaa" fontSize={10} fontFamily="monospace">
        {total}
      </text>
    </svg>
  );
}
