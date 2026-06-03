import { PLATFORMS, HEALTH_CONFIG } from '../data/constants';

export function PlatformIcon({ platformId, size = 30 }) {
  const pl = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
  return (
    <div className="acc-avatar" style={{
      width: size, height: size, background: pl.bg, color: pl.color,
      fontSize: size > 22 ? 12 : 9, borderRadius: size > 22 ? 9 : 6
    }}>
      {pl.abbr}
    </div>
  );
}

export function StatusBadge({ status }) {
  const cfg = HEALTH_CONFIG[status] || HEALTH_CONFIG.unknown;
  const classMap = {
    active: 'badge-ok',
    low_credits: 'badge-pend',
    exhausted: 'badge-err',
    expired_session: 'badge-err',
    inactive: 'badge-off',
    paused: 'badge-off',
    unknown: 'badge-off'
  };
  return <span className={`badge ${classMap[status] || 'badge-off'}`}>{cfg.icon} {cfg.label}</span>;
}
