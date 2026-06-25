import { useState, useCallback } from 'react';
export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback((v) => {
    setVal(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore storage errors */ }
      return next;
    });
  }, [key]);
  const remove = useCallback(() => { localStorage.removeItem(key); setVal(initial); }, [key, initial]);
  return [val, set, remove];
}
