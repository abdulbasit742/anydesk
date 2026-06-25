// PlatformSelector.jsx — Platform picker dropdown
import { resolveAll } from '../../hooks/usePlatformResolver.js';

export function PlatformSelector({ value, options, onChange }) {
  const platformMap = resolveAll();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(options || Object.keys(platformMap)).map(id => {
        const p = platformMap[id] || { label: id, icon: '🔷', color: '#888' };
        const active = value === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: active ? `${p.color}22` : '#0d1020', border: `1px solid ${active ? p.color : '#1e2340'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: active ? p.color : '#666', fontSize: 12, fontFamily: 'monospace', transition: 'all 0.15s' }}>
            <span>{p.icon}</span><span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
