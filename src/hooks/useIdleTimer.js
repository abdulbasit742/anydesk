// useIdleTimer.js — Low-power states for HUD overlays when developer goes idle
import { useState, useEffect, useRef, useCallback } from 'react';

export function useIdleTimer(idleThresholdMs = 30000) {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActive, setLastActive] = useState(() => Date.now());
  const [idleSeconds, setIdleSeconds] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    setLastActive(Date.now());
    setIdleSeconds(0);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsIdle(true), idleThresholdMs);
  }, [idleThresholdMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'wheel'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));

    timerRef.current = setTimeout(() => setIsIdle(true), idleThresholdMs);

    const interval = setInterval(() => {
      setIdleSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, [resetTimer, idleThresholdMs]);

  return { isIdle, lastActive, idleSeconds, resetTimer };
}

export default useIdleTimer;
