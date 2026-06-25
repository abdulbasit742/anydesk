// useIntersectionObserver.js — Lazy-renders off-screen Gantt segments for 60 FPS
import { useState, useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) setHasBeenVisible(true);
    }, {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '50px',
      root: options.root ?? null,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.root]);

  return { ref, isVisible, hasBeenVisible };
}

export function useVirtualGantt(items, rowHeight = 48, containerHeight = 600) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleStart = Math.floor(scrollTop / rowHeight);
  const visibleEnd = Math.min(items.length, visibleStart + Math.ceil(containerHeight / rowHeight) + 2);
  const visibleItems = items.slice(visibleStart, visibleEnd).map((item, i) => ({
    ...item,
    top: (visibleStart + i) * rowHeight,
  }));

  const totalHeight = items.length * rowHeight;

  const handleScroll = (e) => setScrollTop(e.currentTarget.scrollTop);

  return { containerRef, visibleItems, totalHeight, handleScroll, visibleStart, visibleEnd };
}
