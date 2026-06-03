// CategoryFilter.jsx — Filter prompts by category
export function CategoryFilter({ categories = [], active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {categories.map(cat => (
        <button key={cat} onClick={() => onChange(cat)} style={{ background: active === cat ? '#00FFAA22' : 'transparent', border: `1px solid ${active === cat ? '#00FFAA44' : '#1e2340'}`, borderRadius: 6, color: active === cat ? '#00FFAA' : '#555', fontSize: 12, padding: '6px 12px', cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.15s' }}>
          {cat}
        </button>
      ))}
    </div>
  );
}
