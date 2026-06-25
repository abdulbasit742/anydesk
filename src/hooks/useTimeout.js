import { useEffect, useRef, useCallback } from 'react';

/**
 * useTimeout
 * Fires a callback once after `delay` ms. Resets automatically when delay changes.
 * Exposes manual reset and clear helpers.
 *
 * @param {Function}    callback - Function to call after the delay
 * @param {number|null} delay    - Delay in ms. Pass null to prevent firing.
 * @returns {{ reset: Function, clear: Function }}
 *
 * @example
 * const { reset, clear } = useTimeout(() => setVisible(false), 3000);
 */
export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay === null || delay === undefined) return;
    timerRef.current = setTimeout(() => {
      savedCallback.current();
      timerRef.current = null;
    }, delay);
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]);

  return { reset, clear };
}

export default useTimeout;
