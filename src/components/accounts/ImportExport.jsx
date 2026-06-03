// ImportExport.jsx — Account import/export panel
import { sanitizeObject } from '../../data/store/ExportSanitizer.js';

export function ImportExport({ accounts = [], onImport }) {
  const handleExport = () => {
    const sanitized = accounts.map(a => sanitizeObject(a));
    const blob = new Blob([JSON.stringify(sanitized, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bsp-accounts-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        const valid = Array.isArray(imported) ? imported : [imported];
        onImport?.(valid.map(a => ({ ...a, id: `imported_${Date.now()}_${Math.random().toString(36).slice(2)}` })));
      } catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={handleExport} style={{ background: '#1e2340', border: '1px solid #2a2e4e', borderRadius: 8, color: '#888', fontSize: 12, padding: '7px 14px', cursor: 'pointer', fontFamily: 'monospace' }}>Export JSON</button>
      <label style={{ background: '#1e2340', border: '1px solid #2a2e4e', borderRadius: 8, color: '#888', fontSize: 12, padding: '7px 14px', cursor: 'pointer', fontFamily: 'monospace' }}>
        Import
        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </label>
    </div>
  );
}
