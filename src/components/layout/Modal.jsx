// Modal.jsx — Glassmorphic modal dialog component
import { useEffect, useCallback } from 'react';

export function Modal({ title, children, onClose, width = 520, footer }) {
  const handleKeyDown = useCallback(e => { if (e.key === 'Escape') onClose?.(); }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div style={{ width, background: 'rgba(13,16,32,0.98)', border: '1px solid #1e2340', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1e2340' }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: 15, color: '#e0e0e0' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 20, maxHeight: '70vh', overflowY: 'auto' }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px', borderTop: '1px solid #1e2340', background: '#080c14', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{footer}</div>}
      </div>
    </div>
  );
}

export function ModalButton({ onClick, variant = 'primary', children, disabled }) {
  const styles = {
    primary: { background: '#00FFAA', color: '#080c14' },
    secondary: { background: 'transparent', color: '#666', border: '1px solid #1e2340' },
    danger: { background: '#FF4D4D', color: '#fff' },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 'bold', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'monospace', opacity: disabled ? 0.5 : 1 }}>{children}</button>;
}
