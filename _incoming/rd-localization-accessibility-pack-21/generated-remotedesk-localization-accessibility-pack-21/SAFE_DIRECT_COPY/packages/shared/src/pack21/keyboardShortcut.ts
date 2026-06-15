export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function shortcutToLabel(shortcut: KeyboardShortcut): string {
  return [shortcut.ctrl && "Ctrl", shortcut.meta && "Meta", shortcut.shift && "Shift", shortcut.alt && "Alt", shortcut.key.toUpperCase()].filter(Boolean).join("+");
}
