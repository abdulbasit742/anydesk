import { useState, useCallback } from 'react';
export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      if (navigator.clipboard) { await navigator.clipboard.writeText(text); }
      else { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch { return false; }
  }, [resetDelay]);
  return [copied, copy];
}
