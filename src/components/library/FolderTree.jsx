// FolderTree.jsx — Folder/category tree navigation
import { useState } from 'react';

export function FolderTree({ folders = [], activeId, onSelect }) {
  const [expanded, setExpanded] = useState(new Set(['root']));

  const toggle = (id) => setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const demo = folders.length ? folders : [
    { id: 'root', label: 'All Prompts', icon: '📚', children: ['business', 'backend', 'marketing'] },
    { id: 'business', label: 'Business', icon: '💼', children: [] },
    { id: 'backend', label: 'Backend', icon: '⚙', children: [] },
    { id: 'marketing', label: 'Marketing', icon: '📣', children: [] },
  ];

  const renderNode = (folder, depth = 0) => (
    <div key={folder.id}>
      <div onClick={() => { onSelect?.(folder.id); if (folder.children?.length) toggle(folder.id); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: `6px ${8 + depth * 16}px`, background: activeId === folder.id ? '#0d1520' : 'transparent', cursor: 'pointer', borderRadius: 6, color: activeId === folder.id ? '#00FFAA' : '#888', fontSize: 13, fontFamily: 'monospace' }}>
        {folder.children?.length > 0 && <span style={{ color: '#333', fontSize: 10 }}>{expanded.has(folder.id) ? '▾' : '▸'}</span>}
        <span>{folder.icon}</span>
        <span>{folder.label}</span>
      </div>
      {expanded.has(folder.id) && folder.children?.map(childId => {
        const child = demo.find(f => f.id === childId);
        return child ? renderNode(child, depth + 1) : null;
      })}
    </div>
  );

  return <div>{demo.filter(f => !demo.some(p => p.children?.includes(f.id))).map(f => renderNode(f))}</div>;
}
