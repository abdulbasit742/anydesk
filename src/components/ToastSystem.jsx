/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

/* ── Toast Context ─────────────────────────────────────────────── */
const ToastCtx = createContext(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

let _toastId = 0;

/* ── Toast Provider ────────────────────────────────────────────── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', message, duration = 4000, undo, onUndo }) => {
    const id = ++_toastId;
    const undoDuration = undo ? 30000 : duration;

    setToasts(t => [...t, { id, type, message, undo, onUndo, undoDuration, startTime: Date.now() }]);

    timers.current[id] = setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
      delete timers.current[id];
    }, undoDuration);

    return id;
  }, []);

  // Convenience shorthands
  const success = useCallback((msg, opts = {}) => toast({ type: 'ok', message: msg, ...opts }), [toast]);
  const error   = useCallback((msg, opts = {}) => toast({ type: 'err', message: msg, ...opts }), [toast]);
  const info    = useCallback((msg, opts = {}) => toast({ type: 'info', message: msg, ...opts }), [toast]);
  const warn    = useCallback((msg, opts = {}) => toast({ type: 'warn', message: msg, ...opts }), [toast]);

  // Undo-delete helper
  const undoDelete = useCallback((itemName, onUndo) => {
    return toast({
      type: 'warn',
      message: `"${itemName}" deleted`,
      undo: true,
      onUndo,
      duration: 30000,
    });
  }, [toast]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      Object.values(activeTimers).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastCtx.Provider value={{ toast, success, error, info, warn, undoDelete, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

/* ── Individual Toast ──────────────────────────────────────────── */
function ToastItem({ toast: t, onDismiss }) {
  const [now, setNow] = useState(t.startTime);

  // Countdown ticker for undo toasts
  useEffect(() => {
    if (!t.undo) return;
    const iv = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(iv);
  }, [t.undo]);

  const remaining = t.undo ? Math.max(0, Math.ceil((t.undoDuration - (now - t.startTime)) / 1000)) : null;

  const colors = {
    ok:   { border: 'var(--teal)',   icon: '✓', bg: 'rgba(0,212,170,0.08)'    },
    err:  { border: 'var(--red)',    icon: '✕', bg: 'rgba(255,95,95,0.08)'    },
    info: { border: 'var(--blue)',   icon: 'ℹ', bg: 'rgba(79,142,247,0.08)'   },
    warn: { border: 'var(--gold)',   icon: '⚠', bg: 'rgba(245,183,49,0.08)'   },
  };

  const c = colors[t.type] || colors.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      background: `var(--surface3)`,
      border: `1px solid var(--border2)`,
      borderLeft: `3px solid ${c.border}`,
      borderRadius: 'var(--radius)',
      boxShadow: '0 6px 28px rgba(0,0,0,0.45)',
      minWidth: 280,
      maxWidth: 400,
      animation: 'tIn 0.32s cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Progress bar for undo */}
      {t.undo && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 2,
          background: c.border,
          transition: 'width 0.5s linear',
          width: `${Math.max(0, ((t.undoDuration - (now - t.startTime)) / t.undoDuration) * 100)}%`,
          opacity: 0.6,
        }} />
      )}

      {/* Icon */}
      <span style={{
        fontSize: 15,
        color: c.border,
        flexShrink: 0,
        marginTop: 1,
        fontWeight: 700,
      }}>{c.icon}</span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', color: '#e4e4ed', fontWeight: 500, wordBreak: 'break-word' }}>
          {t.message}
        </div>
        {t.undo && remaining !== null && (
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 3 }}>
            Undo available for {remaining}s
          </div>
        )}
      </div>

      {/* Undo button */}
      {t.undo && t.onUndo && (
        <button
          onClick={() => {
            t.onUndo();
            onDismiss(t.id);
          }}
          style={{
            flexShrink: 0,
            padding: '4px 10px',
            borderRadius: 5,
            border: `1px solid ${c.border}`,
            background: 'transparent',
            color: c.border,
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: '"Syne", sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = c.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          UNDO
        </button>
      )}

      {/* Dismiss X */}
      <button
        onClick={() => onDismiss(t.id)}
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: 4,
          border: 'none',
          background: 'transparent',
          color: 'var(--muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#e4e4ed'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; }}
      >✕</button>
    </div>
  );
}

/* ── Toast Container ───────────────────────────────────────────── */
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 48,
      right: 24,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
