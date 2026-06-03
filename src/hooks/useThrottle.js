import { useState, useRef, useEffect, useCallback } from 'react';
export function useThrottle(value, limit = 300) {
  const [throttled, setThrottled] = useState(value);
  const lastRun = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const timeRemaining = limit - (now - lastRun.current);

    if (timeRemaining <= 0) {
      setThrottled(value);
      lastRun.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setThrottled(value);
        lastRun.current = Date.now();
      }, timeRemaining);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, limit]);

  return throttled;
}

export function useThrottledCallback(fn, limit = 300) {
  const lastRun = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      fn(...args);
    }
  }, [fn, limit]);
}
