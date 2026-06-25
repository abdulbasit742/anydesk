// useKeyboardShortcuts.js — Centralizes keybindings for BSP workspace
import { useEffect, useCallback, useMemo } from 'react';

const defaultBindings = {
  'KeyN': 'scratchpad',
  'Space': 'canvas-pan',
  'ctrl+KeyS': 'save',
  'ctrl+KeyZ': 'undo',
  'ctrl+KeyY': 'redo',
  'ctrl+shift+KeyE': 'export',
  'Escape': 'close-modal',
  'ctrl+KeyB': 'toggle-sidebar',
  'ctrl+KeyF': 'search',
};

const EMPTY_OBJECT = {};

export function useKeyboardShortcuts(bindings = EMPTY_OBJECT, enabled = true) {
  const merged = useMemo(() => ({ ...defaultBindings, ...bindings }), [bindings]);

  const handleKeyDown = useCallback(e => {
    if (!enabled) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    parts.push(e.code);

    const combo = parts.join('+');
    const action = merged[combo] || merged[e.code];

    if (action) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('bsp-shortcut', { detail: { action, combo } }));
    }
  }, [merged, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onShortcut = useCallback((action, handler) => {
    const listener = e => { if (e.detail.action === action) handler(e.detail); };
    window.addEventListener('bsp-shortcut', listener);
    return () => window.removeEventListener('bsp-shortcut', listener);
  }, []);

  return { onShortcut };
}
