import { useEffect } from 'react';
export function useKeyboard(keyMap) {
  useEffect(() => {
    const h = (e) => {
      const key = [e.ctrlKey && 'ctrl', e.metaKey && 'meta', e.shiftKey && 'shift', e.altKey && 'alt', e.key.toLowerCase()].filter(Boolean).join('+');
      if (keyMap[key]) { e.preventDefault(); keyMap[key](e); }
      else if (keyMap[e.key]) { keyMap[e.key](e); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [keyMap]);
}
