// ToastProvider.jsx — Global toast context and container
import React from 'react';
import { Toast } from './Toast.jsx';

const ToastContext = React.createContext(null);

/* eslint-disable-next-line react-refresh/only-export-components */
export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const show = React.useCallback((type, title, message, duration) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const api = React.useMemo(() => ({
    success: (title, message, dur) => show('success', title, message, dur),
    error:   (title, message, dur) => show('error',   title, message, dur),
    warning: (title, message, dur) => show('warning', title, message, dur),
    info:    (title, message, dur) => show('info',    title, message, dur),
    dismiss,
  }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{
        position: 'fixed', bottom: 28, right: 20, display: 'flex', flexDirection: 'column',
        gap: 8, zIndex: 9999, pointerEvents: 'none',
      }}>
        <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
