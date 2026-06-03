import React from 'react';
const TYPE_STYLES = {
  success: { border: '#00FFAA', icon: '✓', color: '#00FFAA' },
  error:   { border: '#FF4D4D', icon: '✕', color: '#FF4D4D' },
  warning: { border: '#FFB800', icon: '⚠', color: '#FFB800' },
  info:    { border: '#00AAFF', icon: 'ℹ', color: '#00AAFF' },
};

export function Toast({ id, type = 'info', title, message, onDismiss, duration = 4000 }) {
  const style = TYPE_STYLES[type] || TYPE_STYLES.info;

  React.useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onDismiss?.(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <div style={{
      background: '#0d1117', border: `1px solid ${style.border}`, borderLeft: `3px solid ${style.border}`,
      borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
      fontFamily: 'monospace', minWidth: 280, maxWidth: 380, boxShadow: '0 4px 20px #00000088',
      animation: 'slideIn 0.2s ease',
    }}>
      <span style={{ color: style.color, fontSize: 14, marginTop: 1 }}>{style.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ color: '#eee', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>}
        {message && <div style={{ color: '#888', fontSize: 12 }}>{message}</div>}
      </div>
      <button onClick={() => onDismiss?.(id)} style={{
        background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
      }}>×</button>
    </div>
  );
}
