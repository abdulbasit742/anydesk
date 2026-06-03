

export default function Divider({
  label,
  orientation = 'h',
  color = 'var(--border, #2a2a3a)',
  style: extraStyle = {},
}) {
  if (orientation === 'v') {
    return (
      <div
        style={{
          width: '1px',
          alignSelf: 'stretch',
          background: color,
          flexShrink: 0,
          ...extraStyle,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          ...extraStyle,
        }}
      >
        <div style={{ flex: 1, height: '1px', background: color }} />
        <span
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: 'var(--text-muted, #6b6b8a)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: '1px', background: color }} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        background: color,
        ...extraStyle,
      }}
    />
  );
}
