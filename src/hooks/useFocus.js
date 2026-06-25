import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useFocus
 * Tracks whether the attached element currently has focus.
 * Returns a tuple [ref, isFocused] — attach ref to the target element.
 *
 * @returns {[React.RefObject, boolean]}
 *
 * @example
 * const [ref, isFocused] = useFocus();
 * return <input ref={ref} style={{ borderColor: isFocused ? 'var(--teal)' : 'var(--surface)' }} />;
 */
export function useFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener('focus', handleFocus);
    node.addEventListener('blur', handleBlur);

    // Sync initial state in case the element is already focused
    setIsFocused(document.activeElement === node);

    return () => {
      node.removeEventListener('focus', handleFocus);
      node.removeEventListener('blur', handleBlur);
    };
  }, [handleFocus, handleBlur]);

  return [ref, isFocused];
}

export default useFocus;
