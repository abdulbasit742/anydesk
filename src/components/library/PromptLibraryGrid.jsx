// PromptLibraryGrid.jsx — Full prompt library grid
import { PromptCard } from './PromptCard.jsx';

export function PromptLibraryGrid({ prompts = [], onSelect, selectedId }) {
  if (!prompts.length) return <div style={{ color: '#333', fontSize: 12, fontFamily: 'monospace', padding: 40, textAlign: 'center' }}>No prompts found</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {prompts.map(p => <PromptCard key={p.id} prompt={p} selected={p.id === selectedId} onSelect={onSelect} />)}
    </div>
  );
}
