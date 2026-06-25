import { useState, useEffect } from 'react';
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const h = (e) => setMatches(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [query]);
  return matches;
}

export const useMobile   = () => useMediaQuery('(max-width: 768px)');
export const useTablet   = () => useMediaQuery('(max-width: 1024px)');
export const useDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
