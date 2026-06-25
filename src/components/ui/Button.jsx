import { useState } from 'react';

const VARIANTS = {
  primary: {
    background: 'var(--gold, #f5c518)',
    color: '#0a0a0f',
    border: '1px solid var(--gold, #f5c518)',
    hoverBg: '#e0b215',
    hoverBorder: '#e0b215',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary, #e8e8f0)',
    border: '1px solid var(--border, #2a2a3a)',
    hoverBg: 'rgba(255,255,255,0.05)',
    hoverBorder: 'var(--border, #2a2a3a)',
  },
  danger: {
    background: 'var(--red, #e53e3e)',
    color: '#fff',
    border: '1px solid var(--red, #e53e3e)',
    hoverBg: '#c53030',
    hoverBorder: '#c53030',
  },
  teal: {
    background: 'var(--teal, #38b2ac)',
    color: '#0a0a0f',
    border: '1px solid var(--teal, #38b2ac)',
    hoverBg: '#2c9a94',
    hoverBorder: '#2c9a94',
  },
  gold: {
    background: 'linear-gradient(135deg, var(--gold, #f5c518) 0%, #e0a800 100%)',
    color: '#0a0a0f',
    border: '1px solid var(--gold, #f5c518)',
    hoverBg: '#e0b215',
    hoverBorder: '#e0b215',
  },
};

const SIZES = {
  xs: { padding: '4px 10px', fontSize: '11px', borderRadius: '6px', height: '26px', iconSize: 12 },
  sm: { padding: '6px 14px', fontSize: '12px', borderRadius: '7px', height: '32px', iconSize: 14 },
  md: { padding: '8px 18px', fontSize: '13px', borderRadius: '8px', height: '38px', iconSize: 16 },
  lg: { padding: '12px 24px', fontSize: '15px', borderRadius: '10px', height: '46px', iconSize: 18 },
};

const spinnerStyle = `
  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes btn-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.5); }
    50% { box-shadow: 0 0 0 8px rgba(245,197,24,0); }
  }
`;

function injectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('btn-styles')) {
    const el = document.createElement('style');
    el.id = 'btn-styles';
    el.textContent = spinnerStyle;
    document.head.appendChild(el);
  }
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  pulse = false,
  onClick,
  type = 'button',
  style: extraStyle = {},
  fullWidth = false,
  ...props
}) {
  injectStyles();
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  const isDisabled = disabled || loading;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: s.padding,
    height: s.height,
    fontSize: s.fontSize,
    fontFamily: 'DM Mono, monospace',
    fontWeight: 600,
    letterSpacing: '0.02em',
    borderRadius: s.borderRadius,
    border: v.border,
    background: hovered && !isDisabled ? (v.hoverBg || v.background) : v.background,
    color: v.color,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'all 0.18s ease',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
    animation: pulse && !isDisabled ? 'btn-pulse 2s infinite' : undefined,
    transform: hovered && !isDisabled ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hovered && !isDisabled
      ? `0 4px 16px rgba(0,0,0,0.3)`
      : '0 1px 4px rgba(0,0,0,0.2)',
    ...extraStyle,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: s.iconSize,
            height: s.iconSize,
            border: `2px solid ${v.color}30`,
            borderTopColor: v.color,
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'btn-spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      ) : iconLeft ? (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, fontSize: s.iconSize }}>{iconLeft}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && iconRight && (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, fontSize: s.iconSize }}>{iconRight}</span>
      )}
    </button>
  );
}
