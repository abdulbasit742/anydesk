// BulkActions.jsx — Multi-select bulk operations toolbar
export function BulkActions({ selected = [], onDelete, onClear }) {
  return (
    <div style={{ background: '#0d1520', border: '1px solid #00FFAA44', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'monospace' }}>
      <span style={{ color: '#00FFAA', fontSize: 13, fontWeight: 'bold' }}>{selected.length} selected</span>
      <div style={{ flex: 1 }} />
      <button onClick={onClear} style={{ background: 'transparent', border: '1px solid #1e2340', borderRadius: 6, color: '#666', fontSize: 12, padding: '5px 12px', cursor: 'pointer' }}>Deselect all</button>
      <button onClick={() => onDelete?.(selected)} style={{ background: '#2a0a0a', border: 'none', borderRadius: 6, color: '#FF4D4D', fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Delete selected</button>
    </div>
  );
}
