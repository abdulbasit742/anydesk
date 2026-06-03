// ScoreDial.jsx — Circular SVG dial animating prompt evaluation ratings
export default function ScoreDial({ score = 0, maxScore = 100, label = 'Score', size = 120 }) {
  const radius = (size / 2) - 12;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / maxScore));
  const offset = circumference * (1 - pct);
  const cx = size / 2, cy = size / 2;

  const scoreColor = pct >= 0.7 ? '#00FF88' : pct >= 0.4 ? '#FFB800' : '#FF4D4D';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none" stroke="#1a1e2e" strokeWidth={10}
      />
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={scoreColor}
        strokeWidth={10}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s' }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={scoreColor} fontSize={size * 0.22} fontWeight="bold" fontFamily="monospace">
        {Math.round(score)}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#666" fontSize={size * 0.1} fontFamily="monospace">
        {label}
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="#444" fontSize={size * 0.09} fontFamily="monospace">
        /{maxScore}
      </text>
    </svg>
  );
}
