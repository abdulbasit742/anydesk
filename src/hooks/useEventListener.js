import { useEffect } from 'react';
export function useEventListener(event, handler, element = window) {
  useEffect(() => {
    if (!element?.addEventListener) return;
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }, [event, handler, element]);
}
