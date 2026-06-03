// useElementSize.js — Tracks panel dimensions for dynamic SVG spline repositioning
import { useState, useEffect, useRef, useCallback } from 'react';

export function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const updateSize = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height, x: rect.x, y: rect.y });
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const rect = ref.current?.getBoundingClientRect();
        setSize({ width, height, x: rect?.x ?? 0, y: rect?.y ?? 0 });
      }
    });

    observer.observe(ref.current);
    updateSize();

    return () => observer.disconnect();
  }, [updateSize]);

  return [ref, size];
}

export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
