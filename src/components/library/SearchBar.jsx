// SearchBar.jsx — Library search bar with debounce
import { useRef } from 'react';

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const inputRef = useRef(null);
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none', fontSize: 14 }}>⌕</span>
      <input ref={inputRef} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: '#0d1020', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '8px 12px 8px 34px', fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }} onFocus={e => e.target.style.borderColor = '#00FFAA44'} onBlur={e => e.target.style.borderColor = '#1e2340'} />
      {value && <button onClick={() => onChange('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>×</button>}
    </div>
  );
}
