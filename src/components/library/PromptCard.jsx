// PromptCard.jsx — Prompt library card component
const CAT_COLORS = { business: '#6699FF', marketing: '#FF4D8F', backend: '#00FFAA', mobile: '#FFB800', saved: '#88FF00' };

export function PromptCard({ prompt, selected, onSelect }) {
  const catColor = CAT_COLORS[prompt.category] || '#555';
  return (
    <div onClick={() => onSelect?.(prompt)} style={{ background: selected ? '#0d1520' : '#0d1020', border: `1px solid ${selected ? '#00FFAA44' : '#1e2340'}`, borderRadius: 10, padding: 16, cursor: 'pointer', fontFamily: 'monospace', transition: 'border-color 0.15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ color: '#ccc', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{prompt.name}</h3>
        <span style={{ background: `${catColor}22`, color: catColor, fontSize: 10, padding: '2px 6px', borderRadius: 4, marginLeft: 8, flexShrink: 0 }}>{prompt.category}</span>
      </div>
      {prompt.description && <p style={{ color: '#444', fontSize: 11, margin: '0 0 8px', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prompt.description}</p>}
      <div style={{ color: '#333', fontSize: 10 }}>{prompt.source === 'saved' ? `Saved · ${prompt.savedAt?.slice(0, 10)}` : 'Built-in template'}</div>
    </div>
  );
}
