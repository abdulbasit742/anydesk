// TemplateSelector.jsx — Pick a prompt template to pre-fill the editor
import { getAllTemplates, getCategories } from '../../lib/interpolation/TemplateLibrary.js';
import { useState } from 'react';

export function TemplateSelector({ onSelect }) {
  const [cat, setCat] = useState('all');
  const templates = getAllTemplates();
  const cats = ['all', ...getCategories()];
  const filtered = cat === 'all' ? templates : templates.filter(t => t.category === cat);

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? '#00FFAA22' : 'transparent', border: `1px solid ${cat === c ? '#00FFAA44' : '#1e2340'}`, borderRadius: 6, color: cat === c ? '#00FFAA' : '#555', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <div key={t.id} onClick={() => onSelect(t)} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' }}>
            <div style={{ color: '#ccc', fontSize: 13, marginBottom: 4 }}>{t.name}</div>
            <div style={{ color: '#555', fontSize: 11 }}>{t.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
