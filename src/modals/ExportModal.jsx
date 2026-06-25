import { useState, useEffect } from 'react';
import './modals.css';

const EXPORT_ITEMS = [
  { key: 'accounts',   label: 'Accounts',   icon: '👤', desc: 'All connected accounts and platform configs' },
  { key: 'broadcasts', label: 'Broadcasts',  icon: '📡', desc: 'Broadcast history and scheduled jobs' },
  { key: 'workflows',  label: 'Workflows',   icon: '⚙',  desc: 'Workflow definitions and step configs' },
  { key: 'prompts',    label: 'Prompts',     icon: '📋', desc: 'Prompt templates and variables' },
  { key: 'settings',   label: 'Settings',    icon: '🔧', desc: 'App preferences and theme settings' },
];

const FORMATS = [
  { key: 'json',     label: 'JSON',     icon: '{ }', desc: 'Full fidelity, machine-readable' },
  { key: 'csv',      label: 'CSV',      icon: '≡',   desc: 'Spreadsheet-compatible' },
  { key: 'markdown', label: 'Markdown', icon: 'MD',  desc: 'Human-readable report' },
];

function slugDate() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

export default function ExportModal({ open, onClose, onExport }) {
  const [selected,        setSelected]        = useState({ accounts: true, broadcasts: true, workflows: true, prompts: true, settings: false });
  const [format,          setFormat]          = useState('json');
  const [includeCreds,    setIncludeCreds]    = useState(false);
  const [filename,        setFilename]        = useState(`boltexport_${slugDate()}`);
  const [exporting,       setExporting]       = useState(false);
  const [done,            setDone]            = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setSelected({ accounts: true, broadcasts: true, workflows: true, prompts: true, settings: false });
        setFormat('json');
        setIncludeCreds(false);
        setFilename(`boltexport_${slugDate()}`);
        setExporting(false);
        setDone(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);


  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const anySelected = Object.values(selected).some(Boolean);
  const ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'md';

  const toggleItem = (key) => setSelected(s => ({ ...s, [key]: !s[key] }));

  const handleExport = async () => {
    if (!anySelected) return;
    setExporting(true);
    await onExport?.({ selected, format, includeCreds, filename: `${filename}.${ext}` });
    setExporting(false);
    setDone(true);
    setTimeout(() => { onClose?.(); }, 1200);
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal--md" role="dialog" aria-modal="true" aria-label="Export Data">
        <div className="modal__header" style={{ borderColor: 'var(--gold)' }}>
          <div className="modal__header-left">
            <span className="modal__icon" style={{ background: '#f5c54222' }}>📤</span>
            <div>
              <h2 className="modal__title">Export Data</h2>
              <p className="modal__subtitle">Choose what to export and the format</p>
            </div>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {/* What to export */}
          <div className="section-label">What to Export</div>
          <div className="checkbox-list">
            {EXPORT_ITEMS.map(item => (
              <label key={item.key} className={`check-row ${selected[item.key] ? 'check-row--on' : ''}`}>
                <input
                  type="checkbox"
                  className="check-input"
                  checked={!!selected[item.key]}
                  onChange={() => toggleItem(item.key)}
                />
                <span className="check-icon">{item.icon}</span>
                <div className="check-content">
                  <span className="check-label">{item.label}</span>
                  <span className="check-desc">{item.desc}</span>
                </div>
                <span className={`check-mark ${selected[item.key] ? 'check-mark--on' : ''}`}>
                  {selected[item.key] ? '✓' : ''}
                </span>
              </label>
            ))}
          </div>

          {/* Format */}
          <div className="section-label" style={{ marginTop: 16 }}>Export Format</div>
          <div className="format-grid">
            {FORMATS.map(f => (
              <button
                key={f.key}
                className={`format-btn ${format === f.key ? 'format-btn--active' : ''}`}
                onClick={() => setFormat(f.key)}
              >
                <span className="format-icon">{f.icon}</span>
                <span className="format-label">{f.label}</span>
                <span className="format-desc">{f.desc}</span>
              </button>
            ))}
          </div>

          {/* Credentials toggle */}
          <div className="toggle-row" style={{ marginTop: 16 }}>
            <div>
              <div className="toggle-label">Include Credentials</div>
              <div className="toggle-desc" style={{ color: includeCreds ? 'var(--red)' : undefined }}>
                {includeCreds ? '⚠ API keys will be included in plaintext' : 'Credentials excluded (safer)'}
              </div>
            </div>
            <button
              className={`toggle-btn ${includeCreds ? 'toggle-btn--danger' : ''}`}
              onClick={() => setIncludeCreds(v => !v)}
              aria-pressed={includeCreds}
            >
              {includeCreds ? '●' : '○'}
            </button>
          </div>

          {/* Filename */}
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Filename</label>
            <div className="input-row">
              <input
                className="form-input"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                placeholder="export_filename"
              />
              <span className="input-suffix">.{ext}</span>
            </div>
          </div>

          {done && (
            <div className="alert alert--success">
              <span>✓</span><span>Export complete! File saved.</span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            onClick={handleExport}
            disabled={!anySelected || exporting || done}
          >
            {exporting ? <span className="spinner" /> : null}
            {exporting ? 'Exporting…' : done ? '✓ Done' : `📤 Export .${ext}`}
          </button>
        </div>
      </div>
    </div>
  );
}
