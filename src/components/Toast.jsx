/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toasts">
        {toasts.map(t => {
          const cls = { success: 't-ok', error: 't-err', info: 't-info', bolt: 't-bolt' }[t.type] || 't-info';
          const icon = { success: '✓', error: '✕', info: 'ℹ', bolt: '⚡' }[t.type] || 'ℹ';
          return (
            <div key={t.id} className={`toast ${cls}`}>
              {icon} {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const addToast = useContext(ToastContext);
  if (!addToast) throw new Error('useToast must be used within ToastProvider');
  return {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    bolt: (msg) => addToast(msg, 'bolt'),
  };
}
