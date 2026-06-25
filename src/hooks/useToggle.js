import { useState, useCallback } from 'react';
export function useToggle(initial = false) {
  const [val, setVal] = useState(initial);
  const toggle   = useCallback(() => setVal(v => !v), []);
  const setTrue  = useCallback(() => setVal(true), []);
  const setFalse = useCallback(() => setVal(false), []);
  return [val, toggle, setTrue, setFalse];
}
