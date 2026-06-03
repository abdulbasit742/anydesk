// BackupRestore.jsx — Export full state JSON + import/restore from file
import React from 'react';
import { sanitizeForExport } from '../../data/store/ExportSanitizer.js';

export function BackupRestore({ state, onRestore }) {
  const [importError, setImportError] = React.useState(null);
  const [importSuccess, setImportSuccess] = React.useState(false);

  const handleExport = () => {
    const clean = sanitizeForExport(state || {});
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bsp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        onRestore?.(parsed);
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        setImportError('Invalid JSON file.');
        setImportSuccess(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#888', fontSize: 11, marginBottom: 16 }}>BACKUP & RESTORE</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: 16 }}>
          <div style={{ color: '#ccc', fontSize: 13, marginBottom: 4 }}>Export backup</div>
          <div style={{ color: '#555', fontSize: 11, marginBottom: 12 }}>Download a sanitized JSON snapshot of all state (API keys are masked).</div>
          <button onClick={handleExport} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 6, color: '#00FFAA', fontSize: 12, padding: '7px 16px', cursor: 'pointer' }}>
            Download backup.json
          </button>
        </div>

        <div style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: 16 }}>
          <div style={{ color: '#ccc', fontSize: 13, marginBottom: 4 }}>Import backup</div>
          <div style={{ color: '#555', fontSize: 11, marginBottom: 12 }}>Restore state from a previously exported JSON file.</div>
          <label style={{ display: 'inline-block', background: 'none', border: '1px solid #1e2340', borderRadius: 6, color: '#888', fontSize: 12, padding: '7px 16px', cursor: 'pointer' }}>
            Choose file
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          {importSuccess && <div style={{ color: '#00FFAA', fontSize: 11, marginTop: 8 }}>✓ State restored successfully</div>}
          {importError && <div style={{ color: '#FF4D4D', fontSize: 11, marginTop: 8 }}>✕ {importError}</div>}
        </div>
      </div>
    </div>
  );
}
