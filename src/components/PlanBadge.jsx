const PLAN_CONFIG = {
  free:    { label: 'Free',    color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: '🆓' },
  starter: { label: 'Starter', color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '🚀' },
  pro:     { label: 'Pro',     color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: '⚡' },
  agency:  { label: 'Agency',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🏢' },
};

/**
 * Displays a colored pill badge showing the user's current subscription plan.
 */
export default function PlanBadge({ plan = 'free', size = 'md' }) {
  const cfg = PLAN_CONFIG[plan] || PLAN_CONFIG.free;

  const sizes = {
    sm: { fontSize: 9,  padding: '2px 7px',  iconSize: 10 },
    md: { fontSize: 11, padding: '3px 10px', iconSize: 12 },
    lg: { fontSize: 13, padding: '5px 14px', iconSize: 15 },
  };

  const s = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: s.fontSize,
      padding: s.padding,
      borderRadius: 99,
      background: cfg.bg,
      color: cfg.color,
      fontWeight: 700,
      border: `1px solid ${cfg.color}33`,
      letterSpacing: '0.02em',
    }}>
      <span style={{ fontSize: s.iconSize }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
