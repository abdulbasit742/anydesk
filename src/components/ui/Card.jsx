import { useState } from 'react';

const VARIANT_STYLES = {
  bordered: {
    background: 'var(--surface, #13131f)',
    border: '1px solid var(--border, #2a2a3a)',
    boxShadow: 'none',
  },
  elevated: {
    background: 'var(--surface, #13131f)',
    border: '1px solid var(--border, #2a2a3a)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  glass: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
};

export default function Card({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  variant = 'bordered',
  hover = true,
  padding = '20px',
  style: extraStyle = {},
  className,
}) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.bordered;

  const cardStyle = {
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    transform: hover && hovered ? 'translateY(-3px)' : 'translateY(0)',
    boxShadow: hover && hovered
      ? '0 12px 40px rgba(0,0,0,0.5)'
      : v.boxShadow,
    ...v,
    ...extraStyle,
  };

  const hasHeader = title || subtitle || headerActions;

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            padding: `${padding} ${padding} 0 ${padding}`,
            paddingBottom: children ? '0' : padding,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary, #e8e8f0)',
                  letterSpacing: '0.01em',
                  marginBottom: subtitle ? '4px' : 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '12px',
                  color: 'var(--text-muted, #6b6b8a)',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {headerActions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {headerActions}
            </div>
          )}
        </div>
      )}

      {children && (
        <div style={{ padding }}>
          {children}
        </div>
      )}

      {footer && (
        <div
          style={{
            padding: `12px ${padding}`,
            borderTop: '1px solid var(--border, #2a2a3a)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
