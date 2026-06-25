// TopBar.jsx — Top navigation bar with actions
import { useState } from 'react';
import { CommandPalette } from './CommandPalette.jsx';

export function TopBar({ onToggleSidebar, onToggleNotif, activePage }) {
  const [showCmd, setShowCmd] = useState(false);

  return (
    <>
      <header style={{ height: 48, background: '#0a0e1a', borderBottom: '1px solid #1e2340', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
        <button onClick={onToggleSidebar} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, padding: 4 }}>☰</button>

        <div style={{ color: '#333', fontSize: 12, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 2 }}>
          {activePage}
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={() => setShowCmd(true)} style={{ background: '#1a1e2e', border: '1px solid #1e2340', borderRadius: 6, color: '#555', padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⌘</span><span>Search commands...</span><span style={{ marginLeft: 8, opacity: 0.5 }}>Ctrl+K</span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onToggleNotif} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, padding: 4 }}>🔔</button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1e2e', border: '2px solid #00FFAA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FFAA', fontSize: 13, fontFamily: 'monospace' }}>U</div>
        </div>
      </header>
      {showCmd && <CommandPalette onClose={() => setShowCmd(false)} />}
    </>
  );
}
