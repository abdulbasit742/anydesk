// SavePrompt.jsx — Save prompt to library form
import { useState } from 'react';
import { saveDraft } from '../../lib/interpolation/DraftSaves.js';

export function SavePrompt({ prompt, variables, onSave, onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('general');

  const handleSave = () => {
    if (!name.trim()) return;
    const id = `saved_${Date.now()}`;
    const success = saveDraft(id, { name, prompt, variables, category });
    if (success) onSave?.({ id, name, prompt, variables, category });
    onClose?.();
  };

  return (
    <div style={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Prompt name..." style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', outline: 'none' }}>
          {['general', 'business', 'backend', 'frontend', 'mobile', 'devops'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={!name.trim()} style={{ flex: 1, background: '#00FFAA', color: '#080c14', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}>Save to Library</button>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #1e2340', borderRadius: 8, color: '#555', padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}
