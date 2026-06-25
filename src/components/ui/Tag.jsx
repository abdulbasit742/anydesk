import { useState } from 'react';

export default function Tag({
  label,
  onRemove,
  color = 'var(--teal, #38b2ac)',
  icon,
  clickable = false,
  onClick,
  style: extraStyle = {},
}) {
  const [hovered, setHovered] = useState(false);

  const bg = `${color}18`;
  const border = `${color}40`;

  return (
    <span
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: hovered && clickable ? `${color}28` : bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        padding: '3px 9px',
        fontSize: '11px',
        fontFamily: 'DM Mono, monospace',
        fontWeight: 600,
        letterSpacing: '0.04em',
        userSelect: 'none',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
          {icon}
        </span>
      )}
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            marginLeft: '2px',
            color: `${color}90`,
            fontSize: '13px',
            lineHeight: 1,
            transition: 'color 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${color}90`)}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
