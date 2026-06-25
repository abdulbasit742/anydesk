import React from 'react';
const KEY_DISPLAY = { ctrl: '⌃', shift: '⇧', alt: '⌥', meta: '⌘', enter: '↵', escape: 'Esc', space: '␣', tab: '⇥' };

function KeyBadge({ k }) {
  const display = KEY_DISPLAY[k.toLowerCase()] || k.toUpperCase();
  return (
    <kbd style={{
      display: 'inline-block', background: '#1a1e2e', border: '1px solid #2a2e3e',
      borderBottom: '2px solid #2a2e3e', borderRadius: 4, color: '#888', fontFamily: 'monospace',
      fontSize: 10, padding: '1px 5px', lineHeight: '16px',
    }}>{display}</kbd>
  );
}

export function KeyboardHint({ keys = [], label, inline = false }) {
  const parts = keys.map((k, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span style={{ color: '#333', margin: '0 2px' }}>+</span>}
      <KeyBadge k={k} />
    </React.Fragment>
  ));

  if (inline) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {label && <span style={{ color: '#555', fontSize: 11, fontFamily: 'monospace' }}>{label}</span>}
      {parts}
    </span>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {label && <span style={{ color: '#555', fontSize: 11, fontFamily: 'monospace' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center' }}>{parts}</div>
    </div>
  );
}

export function ShortcutList({ shortcuts = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {shortcuts.map((s, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{s.label}</span>
          <KeyboardHint keys={s.keys} inline />
        </div>
      ))}
    </div>
  );
}
