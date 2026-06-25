// TagManager.jsx — Add/remove tags from prompts
import { useState } from 'react';

export function TagManager({ tags = [], onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim().toLowerCase();
    if (t && !tags.includes(t)) { onChange([...tags, t]); setInput(''); }
  };

  const remove = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {tags.map(tag => (
          <span key={tag} style={{ background: '#1e2340', color: '#888', borderRadius: 4, padding: '3px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            {tag}
            <button onClick={() => remove(tag)} style={{ background: 'transparent', border: 'none', color: '#FF4D4D', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add tag..." style={{ flex: 1, background: '#080c14', border: '1px solid #1e2340', borderRadius: 6, color: '#e0e0e0', padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', outline: 'none' }} />
        <button onClick={add} style={{ background: '#1e2340', border: 'none', borderRadius: 6, color: '#00FFAA', fontSize: 13, padding: '6px 12px', cursor: 'pointer' }}>+</button>
      </div>
    </div>
  );
}
