// ResultsPanel.jsx — Broadcast results display with success/failure breakdown
export function ResultsPanel({ results = [] }) {
  const success = results.filter(r => r.success).length;
  const failed = results.length - success;

  return (
    <div style={{ background: '#0d1020', border: `1px solid ${failed > 0 ? '#FF4D4D44' : '#00FFAA44'}`, borderRadius: 12, padding: 16, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
        <span style={{ color: '#00FF88', fontSize: 13, fontWeight: 'bold' }}>✓ {success} succeeded</span>
        {failed > 0 && <span style={{ color: '#FF4D4D', fontSize: 13, fontWeight: 'bold' }}>✗ {failed} failed</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
        {results.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: '#080c14', borderRadius: 6, fontSize: 12 }}>
            <span style={{ color: r.success ? '#00FF88' : '#FF4D4D', fontSize: 14 }}>{r.success ? '✓' : '✗'}</span>
            <span style={{ color: '#aaa', flex: 1 }}>{r.label || r.accountId}</span>
            {r.previewUrl && <a href={r.previewUrl} target="_blank" rel="noreferrer" style={{ color: '#6699FF', fontSize: 11, textDecoration: 'none' }}>↗ Preview</a>}
            {r.error && <span style={{ color: '#FF4D4D', fontSize: 11 }}>{r.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
