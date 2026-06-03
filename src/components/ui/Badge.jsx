

const VARIANT_MAP = {
  ok:   { bg: 'rgba(56,178,172,0.15)', color: 'var(--teal, #38b2ac)', border: 'rgba(56,178,172,0.3)',  dot: '#38b2ac' },
  warn: { bg: 'rgba(245,197,24,0.12)', color: 'var(--gold, #f5c518)',  border: 'rgba(245,197,24,0.3)',  dot: '#f5c518' },
  err:  { bg: 'rgba(229,62,62,0.12)',  color: 'var(--red, #e53e3e)',   border: 'rgba(229,62,62,0.3)',   dot: '#e53e3e' },
  info: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8',               border: 'rgba(99,102,241,0.3)',  dot: '#818cf8' },
  muted:{ bg: 'rgba(107,107,138,0.1)', color: 'var(--text-muted, #6b6b8a)', border: 'rgba(107,107,138,0.2)', dot: '#6b6b8a' },
};

const SIZE_MAP = {
  sm: { fontSize: '10px', padding: '2px 7px', dotSize: 6, borderRadius: '5px' },
  md: { fontSize: '12px', padding: '3px 10px', dotSize: 7, borderRadius: '6px' },
};

const dotPulseStyle = `
  @keyframes badge-dot-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
`;

function injectBadgeStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('badge-styles')) {
    const el = document.createElement('style');
    el.id = 'badge-styles';
    el.textContent = dotPulseStyle;
    document.head.appendChild(el);
  }
}

export default function Badge({
  text,
  variant = 'info',
  dot = false,
  size = 'md',
  style: extraStyle = {},
}) {
  injectBadgeStyles();
  const v = VARIANT_MAP[variant] || VARIANT_MAP.info;
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dot ? '5px' : '0',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: s.borderRadius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: 'DM Mono, monospace',
        fontWeight: 600,
        letterSpacing: '0.04em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...extraStyle,
      }}
    >
      {dot && (
        <span
          style={{
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: '50%',
            background: v.dot,
            flexShrink: 0,
            animation: 'badge-dot-pulse 1.8s ease-in-out infinite',
            display: 'inline-block',
          }}
        />
      )}
      {text}
    </span>
  );
}
