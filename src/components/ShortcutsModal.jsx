import { useState, useMemo } from 'react';

const DEFAULT_SHORTCUTS = [
  { id: 'palette',   category: 'Navigation', action: 'Open Command Palette', keys: ['Ctrl', 'Space'], description: 'Quick-access any feature' },
  { id: 'search',    category: 'Navigation', action: 'Global Search',         keys: ['Ctrl', 'K'],     description: 'Search pages and accounts' },
  { id: 'next',      category: 'Navigation', action: 'Next Page',             keys: ['→'],             description: 'Navigate to next page' },
  { id: 'prev',      category: 'Navigation', action: 'Previous Page',         keys: ['←'],             description: 'Navigate to previous page' },
  { id: 'scratchpad',category: 'Tools',      action: 'Toggle Scratchpad',     keys: ['N'],             description: 'Quick notes panel' },
  { id: 'shortcuts', category: 'Tools',      action: 'Show Shortcuts',        keys: ['?'],             description: 'Open this panel' },
  { id: 'broadcast', category: 'Broadcast',  action: 'Quick Broadcast',       keys: ['Ctrl', 'Enter'], description: 'Send broadcast' },
  { id: 'escape',    category: 'General',    action: 'Close / Cancel',        keys: ['Esc'],           description: 'Close any modal' },
  { id: 'copy',      category: 'Editing',    action: 'Copy Prompt',           keys: ['Ctrl', 'C'],     description: 'Copy selected prompt' },
  { id: 'save',      category: 'Editing',    action: 'Save',                  keys: ['Ctrl', 'S'],     description: 'Save current item' },
];

const CATEGORY_ICONS = {
  Navigation: '🧭',
  Tools:      '🔧',
  Broadcast:  '📡',
  General:    '⚙️',
  Editing:    '✏️',
};

/* ── Key badge ───────────────────────────────────────────── */
function KeyBadge({ k }) {
  return (
    <kbd style={{
      borderRadius: 5,
      border: '1px solid rgba(255,255,255,0.18)',
      borderBottom: '2px solid rgba(255,255,255,0.08)',
      padding: '3px 7px',
      fontSize: 10,
      fontFamily: 'DM Mono, monospace',
      background: 'rgba(255,255,255,0.07)',
      color: '#e4e4ed',
      lineHeight: 1,
      display: 'inline-block',
      userSelect: 'none',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      whiteSpace: 'nowrap',
    }}>
      {k}
    </kbd>
  );
}

/* ── Shortcut row ────────────────────────────────────────── */
function ShortcutRow({ shortcut }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px', borderRadius: 8,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.045)',
      gap: 12,
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e0e0f0', lineHeight: 1.2 }}>
          {shortcut.action}
        </div>
        <div style={{ fontSize: 10.5, color: 'rgba(180,180,200,0.6)', marginTop: 2 }}>
          {shortcut.description}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
        {shortcut.keys.map((k, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <KeyBadge k={k} />
            {i < shortcut.keys.length - 1 && (
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace' }}>+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Category section ────────────────────────────────────── */
function CategorySection({ category, shortcuts }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        marginBottom: 8, paddingLeft: 2,
      }}>
        <span style={{ fontSize: 13 }}>{CATEGORY_ICONS[category] || '📌'}</span>
        <span style={{
          fontSize: 10.5, fontWeight: 800,
          color: 'var(--gold, #f5b731)',
          textTransform: 'uppercase', letterSpacing: '.08em',
        }}>
          {category}
        </span>
        <div style={{
          flex: 1, height: 1,
          background: 'linear-gradient(90deg, rgba(245,183,49,0.25), transparent)',
          borderRadius: 1,
        }} />
      </div>
      {/* Shortcut rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {shortcuts.map(s => <ShortcutRow key={s.id} shortcut={s} />)}
      </div>
    </div>
  );
}

/* ── Main Modal ──────────────────────────────────────────── */
export default function ShortcutsModal({ open, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEFAULT_SHORTCUTS;
    return DEFAULT_SHORTCUTS.filter(s =>
      s.action.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keys.some(k => k.toLowerCase().includes(q))
    );
  }, [query]);

  // Group by category preserving insertion order
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filtered]);

  const categories = Object.keys(grouped);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99998,
        background: 'rgba(4,4,6,0.80)', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.12s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 720, maxHeight: '86vh',
        background: 'rgba(14,14,24,0.98)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        boxShadow: '0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(245,183,49,0.06)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'mIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(135deg, rgba(245,183,49,0.07), transparent)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 9, letterSpacing: '-0.3px' }}>
                <span>⌨️</span> Keyboard Shortcuts
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, rgba(255,255,255,0.4))', marginTop: 3 }}>
                Quick reference · {DEFAULT_SHORTCUTS.length} shortcuts across {Object.keys(CATEGORY_ICONS).length} categories
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >✕</button>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
            }}>🔍</span>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search shortcuts…"
              spellCheck={false}
              style={{
                width: '100%', boxSizing: 'border-box',
                paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                borderRadius: 10, fontSize: 13,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8e8f0', outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(245,183,49,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer', fontSize: 14, padding: '0 2px',
                }}
              >✕</button>
            )}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '18px 24px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          alignContent: 'start',
        }}>
          {categories.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center',
              padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              No shortcuts match "<span style={{ color: 'var(--gold)' }}>{query}</span>"
            </div>
          ) : (
            categories.map(cat => (
              <CategorySection key={cat} category={cat} shortcuts={grouped[cat]} />
            ))
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div style={{
          padding: '11px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: 11, color: 'var(--muted, rgba(255,255,255,0.35))',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0, background: 'rgba(0,0,0,0.25)',
        }}>
          <span>
            Press <KeyBadge k="?" /> anywhere to toggle · <KeyBadge k="Esc" /> to close
          </span>
          <span style={{ color: 'rgba(245,183,49,0.55)', fontWeight: 700, fontSize: 10.5 }}>
            ⚡ Bolt Studio Pro
          </span>
        </div>
      </div>
    </div>
  );
}
