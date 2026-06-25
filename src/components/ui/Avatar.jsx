

const SIZE_MAP = {
  xs: { dim: 22, font: 9, badge: 7 },
  sm: { dim: 30, font: 12, badge: 9 },
  md: { dim: 40, font: 15, badge: 11 },
  lg: { dim: 56, font: 20, badge: 14 },
};

const BADGE_COLORS = {
  online:  '#38b2ac',
  offline: '#6b6b8a',
  busy:    '#e53e3e',
  away:    '#f5c518',
};

function hashColor(name = '') {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Avatar({
  name = '',
  src,
  size = 'md',
  badge,
  style: extraStyle = {},
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const bg = hashColor(name);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        width: s.dim,
        height: s.dim,
        ...extraStyle,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: s.dim,
            height: s.dim,
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            border: '2px solid var(--border, #2a2a3a)',
          }}
        />
      ) : (
        <div
          style={{
            width: s.dim,
            height: s.dim,
            borderRadius: '50%',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: s.font,
            color: '#fff',
            letterSpacing: '0.03em',
            border: '2px solid var(--border, #2a2a3a)',
            userSelect: 'none',
          }}
        >
          {initials(name)}
        </div>
      )}

      {badge && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: s.badge,
            height: s.badge,
            borderRadius: '50%',
            background: BADGE_COLORS[badge] || badge,
            border: '2px solid var(--surface, #13131f)',
          }}
        />
      )}
    </div>
  );
}
