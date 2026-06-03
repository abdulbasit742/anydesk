import { useState, useEffect } from 'react';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    width: '100%',
  },
  card: {
    background: 'var(--surface, #1a1a2e)',
    border: '1px solid var(--border, #2a2a3e)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHover: {
    borderColor: 'var(--gold, #f5c518)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
    borderRadius: '12px 0 0 12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted, #888)',
    margin: 0,
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  value: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text, #f0f0f0)',
    lineHeight: 1,
    margin: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  change: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  changeLabel: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-muted, #888)',
  },
};

function TrendArrow({ change }) {
  if (change === 0 || change === null || change === undefined) {
    return <span style={{ color: 'var(--text-muted, #888)', fontSize: '14px' }}>—</span>;
  }
  const isPositive = change > 0;
  const color = isPositive ? 'var(--teal, #00d4aa)' : 'var(--red, #ff4757)';
  const arrow = isPositive ? '▲' : '▼';
  const sign = isPositive ? '+' : '';
  return (
    <span style={{ ...styles.change, color }}>
      {arrow} {sign}{change}%
    </span>
  );
}

function StatCard({ stat, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const cardStyle = {
    ...styles.card,
    ...(hovered ? styles.cardHover : {}),
    opacity: visible ? 1 : 0,
    transform: visible
      ? hovered ? 'translateY(-2px)' : 'translateY(0)'
      : 'translateY(12px)',
    transition: 'opacity 0.4s ease, transform 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const iconBg = stat.color
    ? `${stat.color}22`
    : 'rgba(245,197,24,0.12)';
  const iconColor = stat.color || 'var(--gold, #f5c518)';

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.cardAccent, background: iconColor }} />
      <div style={styles.header}>
        <p style={styles.label}>{stat.label}</p>
        <div style={{ ...styles.iconBox, background: iconBg, color: iconColor }}>
          {stat.icon || '📊'}
        </div>
      </div>
      <p style={styles.value}>{stat.value ?? '—'}</p>
      <div style={styles.footer}>
        <TrendArrow change={stat.change} />
        <span style={styles.changeLabel}>vs last period</span>
      </div>
    </div>
  );
}

export default function StatsPanel({ stats = [] }) {
  const defaultStats = [
    { label: 'Total Requests', value: '24,891', change: 12.4, color: 'var(--teal, #00d4aa)', icon: '⚡' },
    { label: 'Success Rate', value: '99.2%', change: 0.3, color: 'var(--gold, #f5c518)', icon: '✓' },
    { label: 'Avg Latency', value: '142ms', change: -8.1, color: 'var(--red, #ff4757)', icon: '⏱' },
    { label: 'Active Users', value: '1,204', change: 5.7, color: '#a78bfa', icon: '👥' },
  ];

  const data = stats.length > 0 ? stats : defaultStats;

  return (
    <div style={styles.container}>
      {data.map((stat, i) => (
        <StatCard key={stat.label ?? i} stat={stat} index={i} />
      ))}
    </div>
  );
}
