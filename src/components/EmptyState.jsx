/* ── EmptyState — reusable empty / zero-data placeholder ─────────
   Usage:
     <EmptyState
       icon="📡"
       title="No broadcasts yet"
       subtitle="Send your first prompt to get started."
       action={{ label: 'New Broadcast', onClick: () => onNav('broadcast') }}
     />
   ─────────────────────────────────────────────────────────────── */

export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  subtitle = 'Data will appear here once you get started.',
  action = null,
  secondaryAction = null,
  size = 'md',      // 'sm' | 'md' | 'lg'
  animate = true,
  children,
}) {
  const sizes = {
    sm: { iconSize: 36, titleFs: '0.9rem',  subFs: '0.76rem', pad: '32px 20px' },
    md: { iconSize: 52, titleFs: '1.05rem', subFs: '0.82rem', pad: '56px 24px' },
    lg: { iconSize: 72, titleFs: '1.25rem', subFs: '0.9rem',  pad: '80px 32px' },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: s.pad,
        animation: animate ? 'fadeIn 0.4s ease' : undefined,
      }}
    >
      {/* Animated icon bubble */}
      <div
        style={{
          width: s.iconSize,
          height: s.iconSize,
          borderRadius: '50%',
          background: 'var(--surface3)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.iconSize * 0.5,
          marginBottom: 18,
          boxShadow: '0 0 0 8px rgba(255,255,255,0.02)',
          animation: animate ? 'pulse 3s ease-in-out infinite' : undefined,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: s.titleFs,
          fontWeight: 700,
          color: '#e4e4ed',
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: s.subFs,
          color: 'var(--muted)',
          maxWidth: 360,
          lineHeight: 1.65,
          marginBottom: (action || secondaryAction || children) ? 22 : 0,
        }}
      >
        {subtitle}
      </div>

      {/* Custom children slot */}
      {children}

      {/* Action buttons */}
      {(action || secondaryAction) && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: children ? 12 : 0 }}>
          {action && (
            <button
              onClick={action.onClick}
              className="btn btn-gold btn-sm"
            >
              {action.icon && <span style={{ marginRight: 2 }}>{action.icon}</span>}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="btn btn-ghost btn-sm"
            >
              {secondaryAction.icon && <span style={{ marginRight: 2 }}>{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
