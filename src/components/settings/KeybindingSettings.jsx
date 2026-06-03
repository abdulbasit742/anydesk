// KeybindingSettings.jsx — View and customize keyboard shortcut bindings
import React from 'react';
import { ShortcutList } from '../system/KeyboardHint.jsx';

const DEFAULT_SHORTCUTS = [
  { action: 'save',        label: 'Save state',        keys: ['ctrl', 's'] },
  { action: 'newPrompt',   label: 'New scratchpad',    keys: ['ctrl', 'n'] },
  { action: 'palette',     label: 'Command palette',   keys: ['ctrl', 'k'] },
  { action: 'broadcast',   label: 'Quick broadcast',   keys: ['ctrl', 'enter'] },
  { action: 'search',      label: 'Global search',     keys: ['ctrl', 'f'] },
  { action: 'undo',        label: 'Undo',               keys: ['ctrl', 'z'] },
  { action: 'redo',        label: 'Redo',               keys: ['ctrl', 'y'] },
  { action: 'zoomIn',      label: 'Canvas zoom in',    keys: ['ctrl', '+'] },
  { action: 'zoomOut',     label: 'Canvas zoom out',   keys: ['ctrl', '-'] },
  { action: 'fitCanvas',   label: 'Fit canvas to view',keys: ['ctrl', '0'] },
];

export function KeybindingSettings({ customBindings = {}, onChange }) {
  const [editing, setEditing] = React.useState(null);

  const handleReset = () => onChange?.({});

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: '#888', fontSize: 11 }}>KEYBOARD SHORTCUTS</div>
        <button onClick={handleReset} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 5, color: '#888', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>Reset to defaults</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {DEFAULT_SHORTCUTS.map(s => (
          <div key={s.action} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 10px', borderRadius: 6, background: editing === s.action ? '#1a1e2e' : 'transparent',
            cursor: 'pointer',
          }} onClick={() => setEditing(editing === s.action ? null : s.action)}>
            <span style={{ color: '#aaa', fontSize: 12 }}>{s.label}</span>
            <ShortcutList shortcuts={[{ label: '', keys: customBindings[s.action] || s.keys }]} />
          </div>
        ))}
      </div>
      {editing && (
        <div style={{ background: '#080c14', border: '1px solid #00FFAA44', borderRadius: 8, padding: 12, marginTop: 12 }}>
          <div style={{ color: '#00FFAA', fontSize: 11, marginBottom: 8 }}>Press new key combination for "{DEFAULT_SHORTCUTS.find(s => s.action === editing)?.label}"</div>
          <div style={{ color: '#555', fontSize: 11 }}>Key rebinding coming in v2. Press Escape to cancel.</div>
          <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 5, color: '#888', fontSize: 11, padding: '4px 10px', cursor: 'pointer', marginTop: 8 }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
