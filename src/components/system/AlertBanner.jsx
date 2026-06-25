// AlertBanner.jsx — Full-width inline alert banner
import React from 'react';
const VARIANTS = {
  info:    { bg: '#00AAFF11', border: '#00AAFF44', color: '#00AAFF', icon: 'ℹ' },
  success: { bg: '#00FFAA11', border: '#00FFAA44', color: '#00FFAA', icon: '✓' },
  warning: { bg: '#FFB80011', border: '#FFB80044', color: '#FFB800', icon: '⚠' },
  error:   { bg: '#FF4D4D11', border: '#FF4D4D44', color: '#FF4D4D', icon: '✕' },
};

export function AlertBanner({ type = 'info', title, children, dismissible = false, onDismiss, action }) {
  const [hidden, setHidden] = React.useState(false);
  const v = VARIANTS[type] || VARIANTS.info;

  if (hidden) return null;

  const handleDismiss = () => {
    setHidden(true);
    onDismiss?.();
  };

  return (
    <div style={{
      background: v.bg, border: `1px solid ${v.border}`, borderRadius: 8, padding: '10px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'monospace',
    }}>
      <span style={{ color: v.color, fontSize: 14, marginTop: 1 }}>{v.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ color: '#ddd', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>}
        <div style={{ color: '#aaa', fontSize: 12 }}>{children}</div>
      </div>
      {action && (
        <button onClick={action.onClick} style={{
          background: 'none', border: `1px solid ${v.color}`, borderRadius: 5, color: v.color,
          fontSize: 11, padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>{action.label}</button>
      )}
      {dismissible && (
        <button onClick={handleDismiss} style={{
          background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 0,
        }}>×</button>
      )}
    </div>
  );
}
