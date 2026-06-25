// shortcuts.js — keyboard shortcut definitions

export const SHORTCUTS = [
  { keys: ['Ctrl', 'K'],      action: 'Open Command Palette',    category: 'Navigation' },
  { keys: ['Ctrl', 'Enter'],  action: 'Broadcast prompt',        category: 'Broadcast' },
  { keys: ['Escape'],         action: 'Close modal / cancel',    category: 'Navigation' },
  { keys: ['Ctrl', '/'],      action: 'Open Keyboard Shortcuts', category: 'Navigation' },
  { keys: ['Ctrl', 'B'],      action: 'Go to Broadcast Studio',  category: 'Navigation' },
  { keys: ['Ctrl', 'A'],      action: 'Go to Accounts',          category: 'Navigation' },
  { keys: ['Ctrl', 'D'],      action: 'Go to Dashboard',         category: 'Navigation' },
  { keys: ['Ctrl', 'S'],      action: 'Go to Screen Wall',       category: 'Navigation' },
  { keys: ['Ctrl', 'H'],      action: 'Go to History',           category: 'Navigation' },
  { keys: ['Ctrl', 'N'],      action: 'New Account / Project',   category: 'Actions' },
  { keys: ['Ctrl', 'E'],      action: 'Export data',             category: 'Actions' },
  { keys: ['Ctrl', 'F'],      action: 'Search / Filter',         category: 'Actions' },
  { keys: ['Ctrl', 'Z'],      action: 'Undo last action',        category: 'Actions' },
  { keys: ['Ctrl', 'Shift', 'R'], action: 'Run health check',    category: 'Actions' },
  { keys: ['Alt', '1'],       action: 'Switch to first account', category: 'Accounts' },
  { keys: ['Alt', '2'],       action: 'Switch to second account',category: 'Accounts' },
  { keys: ['Tab'],            action: 'Move focus forward',      category: 'Accessibility' },
  { keys: ['Shift', 'Tab'],   action: 'Move focus backward',     category: 'Accessibility' },
  { keys: ['?'],              action: 'Show this help screen',   category: 'Help' },
];

export const SHORTCUT_CATEGORIES = [...new Set(SHORTCUTS.map(s => s.category))];

export const getShortcutMap = (handlers) =>
  Object.fromEntries(SHORTCUTS.map(s => {
    const key = s.keys.map(k => k.toLowerCase()).join('+').replace('ctrl','ctrl').replace('meta','meta');
    return [key, handlers[s.action]];
  }).filter(([, h]) => h));
