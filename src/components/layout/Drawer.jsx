// Drawer.jsx — Slide-out drawer panel from right or bottom
import { useEffect } from 'react';

export function Drawer({ open, title, children, onClose, side = 'right', width = 400 }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const isRight = side === 'right';

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    [isRight ? 'right' : 'left']: open ? 0 : -width,
    width,
    height: '100vh',
    background: '#0a0e1a',
    borderLeft: isRight ? '1px solid #1e2340' : 'none',
    borderRight: !isRight ? '1px solid #1e2340' : 'none',
    transition: `${isRight ? 'right' : 'left'} 0.25s ease`,
    zIndex: 900,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'monospace',
  };

  return (
    <>
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 899 }} onClick={onClose} />}
      <div style={drawerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1e2340' }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: 14, color: '#e0e0e0' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>{children}</div>
      </div>
    </>
  );
}
