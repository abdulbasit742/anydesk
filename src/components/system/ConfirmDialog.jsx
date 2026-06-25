import React from 'react';

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmBg = variant === 'danger' ? '#FF4D4D' : '#00FFAA';
  const confirmColor = variant === 'danger' ? '#fff' : '#000';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000000bb', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 9998, fontFamily: 'monospace',
    }} onClick={onCancel}>
      <div style={{
        background: '#0d1117', border: '1px solid #1e2340', borderRadius: 12, padding: 24,
        minWidth: 340, maxWidth: 480, boxShadow: '0 8px 32px #000000aa',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ color: '#eee', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{title}</div>
        <div style={{ color: '#888', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            background: 'none', border: '1px solid #1e2340', borderRadius: 7, color: '#888',
            fontSize: 12, padding: '8px 18px', cursor: 'pointer',
          }}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{
            background: confirmBg, border: 'none', borderRadius: 7, color: confirmColor,
            fontSize: 12, padding: '8px 18px', cursor: 'pointer', fontWeight: 600,
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
