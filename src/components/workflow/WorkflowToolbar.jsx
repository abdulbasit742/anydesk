// WorkflowToolbar.jsx — Canvas toolbar for workflow editor
export function WorkflowToolbar({ onAutoLayout, onClear, onExport, onZoomIn, onZoomOut, onFit }) {
  const btn = (label, fn, color = '#666') => (
    <button onClick={fn} style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 6, color, fontSize: 12, padding: '5px 10px', cursor: 'pointer', fontFamily: 'monospace' }}>{label}</button>
  );

  return (
    <div style={{ display: 'flex', gap: 6, padding: '8px 0', fontFamily: 'monospace' }}>
      {btn('Auto Layout', onAutoLayout, '#00FFAA')}
      {btn('Fit View', onFit)}
      {btn('+ Zoom', onZoomIn)}
      {btn('- Zoom', onZoomOut)}
      <div style={{ flex: 1 }} />
      {btn('Export SVG', onExport)}
      {btn('Clear', onClear, '#FF4D4D')}
    </div>
  );
}
