import { useState, useRef, useCallback } from 'react';

const chipStyle = (active) => ({
  fontFamily: 'DM Mono, monospace',
  fontSize: '12px',
  padding: '5px 12px',
  borderRadius: '20px',
  border: `1px solid ${active ? 'var(--gold, #f5c518)' : 'var(--border, #2a2a3e)'}`,
  background: active ? 'rgba(245,197,24,0.15)' : 'transparent',
  color: active ? 'var(--gold, #f5c518)' : 'var(--text-muted, #888)',
  cursor: 'pointer',
  transition: 'all 0.18s ease',
  userSelect: 'none',
  whiteSpace: 'nowrap',
});

const defaultFilters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'idle', label: 'Idle' },
  { id: 'error', label: 'Error' },
  { id: 'archived', label: 'Archived' },
];

export default function FilterBar({
  filters = [],
  onChange,
  multi = false,
  placeholder = 'Search...',
  defaultSelected = [],
}) {
  const data = filters.length > 0 ? filters : defaultFilters;
  const [selected, setSelected] = useState(new Set(defaultSelected));
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (multi) {
        next.has(id) ? next.delete(id) : next.add(id);
      } else {
        if (next.has(id) && next.size === 1) {
          next.clear();
        } else {
          next.clear();
          next.add(id);
        }
      }
      onChange?.({ selected: [...next], search });
      return next;
    });
  }, [multi, onChange, search]);

  const clearAll = () => {
    setSelected(new Set());
    setSearch('');
    onChange?.({ selected: [], search: '' });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onChange?.({ selected: [...selected], search: e.target.value });
  };

  const hasActive = selected.size > 0 || search.length > 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
      padding: '10px 14px',
      background: 'var(--surface, #1a1a2e)',
      border: '1px solid var(--border, #2a2a3e)',
      borderRadius: '10px',
    }}>
      <div style={{
        position: 'relative',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted, #888)',
          fontSize: '13px',
          pointerEvents: 'none',
        }}>🔍</span>
        <input
          ref={inputRef}
          value={search}
          onChange={handleSearchChange}
          placeholder={placeholder}
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            color: 'var(--text, #f0f0f0)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border, #2a2a3e)',
            borderRadius: '8px',
            padding: '6px 10px 6px 30px',
            outline: 'none',
            width: '180px',
            transition: 'border-color 0.18s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--gold, #f5c518)'}
          onBlur={e => e.target.style.borderColor = 'var(--border, #2a2a3e)'}
        />
      </div>
      <div style={{ width: '1px', height: '24px', background: 'var(--border, #2a2a3e)', flexShrink: 0 }} />
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
        {data.map(f => (
          <button
            key={f.id}
            onClick={() => toggle(f.id)}
            style={chipStyle(selected.has(f.id))}
            onMouseEnter={e => {
              if (!selected.has(f.id)) {
                e.currentTarget.style.borderColor = 'rgba(245,197,24,0.4)';
                e.currentTarget.style.color = 'var(--text, #f0f0f0)';
              }
            }}
            onMouseLeave={e => {
              if (!selected.has(f.id)) {
                e.currentTarget.style.borderColor = 'var(--border, #2a2a3e)';
                e.currentTarget.style.color = 'var(--text-muted, #888)';
              }
            }}
          >
            {selected.has(f.id) && <span style={{ marginRight: '4px' }}>✓</span>}
            {f.label}
          </button>
        ))}
      </div>
      {hasActive && (
        <button
          onClick={clearAll}
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: 'var(--red, #ff4757)',
            background: 'rgba(255,71,87,0.08)',
            border: '1px solid rgba(255,71,87,0.25)',
            borderRadius: '8px',
            padding: '5px 10px',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,71,87,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,71,87,0.08)'}
        >
          Clear ×
        </button>
      )}
    </div>
  );
}
