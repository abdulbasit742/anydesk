import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const modalStyle = `
  @keyframes modal-scale-in {
    from { opacity: 0; transform: scale(0.93) translateY(10px); }
    to   { opacity: 1; transform: scale(1)   translateY(0); }
  }
  @keyframes modal-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

function injectModalStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-modal-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-modal-styles';
    el.textContent = modalStyle;
    document.head.appendChild(el);
  }
}

const SIZE_MAP = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  style: extraStyle = {},
}) {
  injectModalStyles();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = SIZE_MAP[size] || SIZE_MAP.md;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'modal-overlay-in 0.18s ease',
      }}
    >
      <div
        style={{
          background: 'var(--surface, #13131f)',
          border: '1px solid var(--border, #2a2a3a)',
          borderRadius: '14px',
          width: '100%',
          maxWidth: maxW,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          animation: 'modal-scale-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          ...extraStyle,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 22px',
            borderBottom: '1px solid var(--border, #2a2a3a)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: 'var(--text-primary, #e8e8f0)',
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: '7px',
              color: 'var(--text-muted, #6b6b8a)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              padding: 0,
              transition: 'all 0.15s',
              fontSize: '18px',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'var(--text-primary, #e8e8f0)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted, #6b6b8a)';
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '22px',
            overflowY: 'auto',
            flex: 1,
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: 'var(--text-primary, #e8e8f0)',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--border, #2a2a3a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
              background: 'rgba(0,0,0,0.15)',
              borderRadius: '0 0 14px 14px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
