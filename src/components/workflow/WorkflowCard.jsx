// WorkflowCard.jsx — Workflow summary card
export function WorkflowCard({ workflow, onRun, onEdit, running }) {
  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, padding: 20, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{workflow.icon || '⟳'}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#e0e0e0', margin: '0 0 4px', fontSize: 14 }}>{workflow.name}</h3>
          <p style={{ color: '#555', fontSize: 12, margin: 0 }}>{workflow.description}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
        {(workflow.tags || []).map(tag => (
          <span key={tag} style={{ background: '#1e2340', color: '#666', borderRadius: 4, padding: '2px 8px', fontSize: 10 }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onRun(workflow.id)} disabled={running} style={{ flex: 1, background: running ? '#1e2340' : '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 8, color: running ? '#444' : '#00FFAA', fontSize: 12, padding: '8px', cursor: running ? 'not-allowed' : 'pointer' }}>
          ▶ Run
        </button>
        {onEdit && <button onClick={() => onEdit(workflow)} style={{ background: '#1e2340', border: 'none', borderRadius: 8, color: '#666', fontSize: 12, padding: '8px 14px', cursor: 'pointer' }}>Edit</button>}
      </div>
    </div>
  );
}
