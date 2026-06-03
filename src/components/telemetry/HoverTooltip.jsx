// HoverTooltip.jsx — Glassmorphic modal popup detailing telemetry at hover
import { useState, useCallback } from 'react';

export default function HoverTooltip({ children, content, placement = 'top' }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback(e => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: placement === 'top' ? rect.top : rect.bottom });
    setVisible(true);
  }, [placement]);

  const tooltipStyle = {
    position: 'fixed',
    left: pos.x,
    top: placement === 'top' ? pos.y - 8 : pos.y + 8,
    transform: `translateX(-50%) translateY(${placement === 'top' ? '-100%' : '0'})`,
    background: 'rgba(10,14,28,0.92)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,255,170,0.2)',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#dde',
    fontSize: 12,
    fontFamily: 'monospace',
    zIndex: 9999,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(0,255,170,0.1)',
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && typeof document !== 'undefined' && (
        <div style={tooltipStyle}>
          {typeof content === 'string' ? content : content}
        </div>
      )}
    </span>
  );
}
