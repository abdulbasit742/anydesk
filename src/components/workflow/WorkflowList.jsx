// WorkflowList.jsx — List of saved workflows with run control
export function WorkflowList({ workflows = [], activeId, onSelect, onRun, running }) {
  return (
    <div style={{ background: '#0a0e1a', borderRight: '1px solid #1e2340', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e2340', color: '#555', fontSize: 12 }}>WORKFLOWS ({workflows.length})</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {workflows.map(wf => (
          <div key={wf.id} onClick={() => onSelect(wf)} style={{ padding: '10px 12px', borderRadius: 8, background: activeId === wf.id ? '#0d1020' : 'transparent', cursor: 'pointer', marginBottom: 4, border: `1px solid ${activeId === wf.id ? '#00FFAA22' : 'transparent'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{wf.icon || '⟳'}</span>
              <span style={{ color: '#ccc', fontSize: 13, flex: 1 }}>{wf.name}</span>
            </div>
            <div style={{ color: '#444', fontSize: 11, marginBottom: 8 }}>{wf.steps?.length || 0} steps</div>
            <button onClick={e => { e.stopPropagation(); onRun(wf.id); }} disabled={running} style={{ width: '100%', background: running ? '#1e2340' : '#00FFAA22', border: `1px solid ${running ? '#1e2340' : '#00FFAA44'}`, borderRadius: 6, color: running ? '#444' : '#00FFAA', fontSize: 11, padding: '4px', cursor: running ? 'not-allowed' : 'pointer' }}>
              {running ? '...' : '▶ Run'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
