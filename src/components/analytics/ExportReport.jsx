// ExportReport.jsx — Report export panel
import { sanitizeForExport } from '../../data/store/ExportSanitizer.js';

export function ExportReport({ state = {} }) {
  const handleExport = (format) => {
    const sanitized = sanitizeForExport(state);
    if (format === 'json') {
      const blob = new Blob([sanitized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `bsp-report-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => handleExport('json')} style={{ background: '#1e2340', border: '1px solid #2a2e4e', borderRadius: 8, color: '#888', fontSize: 12, padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}>Export JSON</button>
    </div>
  );
}
