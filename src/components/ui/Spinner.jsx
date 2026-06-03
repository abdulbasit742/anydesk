

const spinnerKeyframes = `
  @keyframes bsp-spin {
    to { transform: rotate(360deg); }
  }
`;

function injectSpinnerStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-spinner-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-spinner-styles';
    el.textContent = spinnerKeyframes;
    document.head.appendChild(el);
  }
}

const SIZE_MAP = {
  sm: { size: 18, border: 2, fontSize: 10 },
  md: { size: 28, border: 2.5, fontSize: 11 },
  lg: { size: 44, border: 3.5, fontSize: 12 },
};

export default function Spinner({
  size = 'md',
  color = 'var(--gold, #f5c518)',
  label,
  style: extraStyle = {},
}) {
  injectSpinnerStyles();
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        ...extraStyle,
      }}
    >
      <span
        role="status"
        aria-label={label || 'Loading…'}
        style={{
          display: 'block',
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          border: `${s.border}px solid rgba(255,255,255,0.1)`,
          borderTopColor: color,
          borderRightColor: `${color}60`,
          animation: 'bsp-spin 0.75s linear infinite',
          flexShrink: 0,
        }}
      />
      {label && (
        <span
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: s.fontSize,
            color: 'var(--text-muted, #6b6b8a)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
