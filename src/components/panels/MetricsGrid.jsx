import { useState, useEffect } from 'react';

function Sparkline({ data = [], color = '#f5c518', width = 80, height = 32 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M${points.join(' L')}`;
  const areaD = `M${points.join(' L')} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={data.length > 0 ? (data.length - 1) * stepX : 0}
        cy={data.length > 0 ? height - ((data[data.length - 1] - min) / range) * (height - 4) - 2 : 0}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

function MetricCard({ metric, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  const color = metric.color || 'var(--gold, #f5c518)';
  const isPositive = (metric.trend ?? 0) >= 0;
  const trendColor = isPositive ? 'var(--teal, #00d4aa)' : 'var(--red, #ff4757)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface, #1a1a2e)',
        border: `1px solid ${hovered ? color + '55' : 'var(--border, #2a2a3e)'}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hovered ? `0 4px 20px ${color}18` : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          color: 'var(--text-muted, #888)',
        }}>
          {metric.label}
        </span>
        {metric.unit && (
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            color,
            background: `${color}18`,
            padding: '2px 6px',
            borderRadius: '4px',
          }}>
            {metric.unit}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text, #f0f0f0)',
            margin: '0 0 4px 0',
            lineHeight: 1,
          }}>
            {metric.value}
          </p>
          {metric.trend !== undefined && (
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: trendColor,
              fontWeight: '600',
            }}>
              {isPositive ? '▲' : '▼'} {Math.abs(metric.trend)}%
            </span>
          )}
        </div>
        {metric.sparkline && (
          <Sparkline data={metric.sparkline} color={color} />
        )}
      </div>
    </div>
  );
}

const generateSparkline = (base, len = 12) =>
  Array.from({ length: len }, (_, i) => base + Math.sin(i * 0.8) * (base * 0.2) + Math.random() * (base * 0.1));

const defaultMetrics = [
  { label: 'Throughput', value: '12.4K', trend: 8.2, color: 'var(--teal, #00d4aa)', unit: 'req/s', sparkline: generateSparkline(12.4) },
  { label: 'Error Rate', value: '0.8%', trend: -2.1, color: 'var(--red, #ff4757)', unit: '%', sparkline: generateSparkline(0.8) },
  { label: 'P99 Latency', value: '312ms', trend: -5.4, color: 'var(--gold, #f5c518)', unit: 'ms', sparkline: generateSparkline(312) },
  { label: 'GPU Util', value: '73%', trend: 11.3, color: '#a78bfa', unit: '%', sparkline: generateSparkline(73) },
  { label: 'Cache Hit', value: '94.1%', trend: 1.7, color: '#38bdf8', unit: '%', sparkline: generateSparkline(94) },
  { label: 'Queue Depth', value: '247', trend: -3.8, color: '#fb923c', unit: 'jobs', sparkline: generateSparkline(247) },
];

export default function MetricsGrid({ metrics = [], cols = 3 }) {
  const data = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '14px',
      width: '100%',
    }}>
      {data.map((metric, i) => (
        <MetricCard key={metric.label ?? i} metric={metric} index={i} />
      ))}
    </div>
  );
}
