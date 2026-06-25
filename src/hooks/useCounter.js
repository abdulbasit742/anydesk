import { useState, useCallback } from 'react';
export function useCounter(initial = 0, { min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initial);
  const increment = useCallback((by = 1) => setCount(c => Math.min(max, Math.max(min, c + by))), [min, max]);
  const decrement = useCallback((by = 1) => setCount(c => Math.min(max, Math.max(min, c - by))), [min, max]);
  const reset     = useCallback(() => setCount(initial), [initial]);
  const set       = useCallback((v) => setCount(Math.min(max, Math.max(min, v))), [min, max]);
  return { count, increment, decrement, reset, set };
}
