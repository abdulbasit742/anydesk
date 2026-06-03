// CommandPalette.jsx — Spotlight-style command palette (Ctrl+K)
import { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigate', shortcut: 'D' },
  { id: 'nav-accounts', label: 'Go to Accounts', category: 'Navigate', shortcut: 'A' },
  { id: 'nav-broadcast', label: 'Go to Broadcast', category: 'Navigate', shortcut: 'B' },
  { id: 'nav-workflows', label: 'Go to Workflows', category: 'Navigate', shortcut: 'W' },
  { id: 'new-account', label: 'Add New Account', category: 'Action', shortcut: 'N' },
  { id: 'run-audit', label: 'Run Security Audit', category: 'Action' },
  { id: 'export-data', label: 'Export Project Data', category: 'Action' },
  { id: 'clear-cache', label: 'Clear Cache', category: 'System' },
];

export function CommandPalette({ onClose, onCommand }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter') { onCommand?.(filtered[cursor]); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, zIndex: 2000 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 560, background: '#0d1020', border: '1px solid #1e2340', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', fontFamily: 'monospace' }}>
        <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setCursor(0); }} onKeyDown={handleKeyDown} placeholder="Search commands..." style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #1e2340', padding: '14px 20px', fontSize: 15, color: '#e0e0e0', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }} />
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {filtered.length === 0 && <div style={{ padding: 24, color: '#333', textAlign: 'center', fontSize: 13 }}>No commands found</div>}
          {filtered.map((cmd, i) => (
            <div key={cmd.id} onClick={() => { onCommand?.(cmd); onClose(); }} style={{ padding: '12px 20px', background: cursor === i ? '#1a1e2e' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#444', fontSize: 11, minWidth: 60 }}>{cmd.category}</span>
              <span style={{ flex: 1, color: '#ccc', fontSize: 14 }}>{cmd.label}</span>
              {cmd.shortcut && <kbd style={{ background: '#1e2340', border: '1px solid #2a2e4e', borderRadius: 4, padding: '2px 6px', color: '#555', fontSize: 11 }}>{cmd.shortcut}</kbd>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
