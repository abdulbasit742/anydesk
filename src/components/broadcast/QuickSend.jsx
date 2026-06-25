// QuickSend.jsx — Quick broadcast shortcut panel
import { useState } from 'react';

const QUICK_PROMPTS = [
  { label: 'Fix all TypeScript errors', prompt: 'Review the code and fix all TypeScript type errors. Ensure strict mode compatibility.' },
  { label: 'Add responsive design', prompt: 'Make all components fully responsive for mobile (480px), tablet (768px), and desktop (1280px).' },
  { label: 'Optimize performance', prompt: 'Audit and optimize React component rendering. Add useMemo and useCallback where appropriate. Lazy-load heavy components.' },
  { label: 'Add dark mode', prompt: 'Implement a complete dark/light mode toggle using CSS variables and localStorage persistence.' },
];

export function QuickSend({ onSend }) {
  const [custom, setCustom] = useState('');

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, padding: 16, fontFamily: 'monospace' }}>
      <div style={{ color: '#555', fontSize: 12, marginBottom: 12 }}>QUICK PROMPTS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {QUICK_PROMPTS.map((q, i) => (
          <button key={i} onClick={() => onSend(q.prompt)} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#aaa', fontSize: 12, padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}>
            {q.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === 'Enter' && custom.trim() && (onSend(custom), setCustom(''))} placeholder="Custom quick prompt..." style={{ flex: 1, background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '8px 12px', fontSize: 12, fontFamily: 'monospace', outline: 'none' }} />
        <button onClick={() => { if (custom.trim()) { onSend(custom); setCustom(''); } }} style={{ background: '#00FFAA', color: '#080c14', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 'bold' }}>→</button>
      </div>
    </div>
  );
}
