import { useState, useEffect } from 'react';
export function useScrollPosition() {
  const [pos, setPos] = useState({ x: window.scrollX, y: window.scrollY });
  useEffect(() => {
    const h = () => setPos({ x: window.scrollX, y: window.scrollY });
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return pos;
}
