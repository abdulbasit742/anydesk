import { useState, useEffect, useRef, useCallback } from 'react';
import './modals.css';

function tryParseJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return { ok: true, data: parsed };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function summarize(data) {
  if (typeof data !== 'object' || data === null) return null;
  const counts = {};
  for (const key of ['accounts', 'broadcasts', 'workflows', 'prompts', 'settings']) {
    if (Array.isArray(data[key])) counts[key] = data[key].length;
    else if (data[key] !== undefined) counts[key] = 1;
  }
  return counts;
}

export default function ImportModal({ open, onClose, onImport }) {
  const [tab,         setTab]         = useState('drop'); // drop | paste
  const [pasted,      setPasted]      = useState('');
  const [dragging,    setDragging]    = useState(false);
  const [parsed,      setParsed]      = useState(null);
  const [parseError,  setParseError]  = useState('');
  const [mergeMode,   setMergeMode]   = useState(true);
  const [importing,   setImporting]   = useState(false);
  const [done,        setDone]        = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setTab('drop'); setPasted(''); setDragging(false);
        setParsed(null); setParseError(''); setMergeMode(true);
        setImporting(false); setDone(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);


  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const processText = useCallback((text) => {
    const result = tryParseJSON(text);
    if (result.ok) {
      setParsed(result.data);
      setParseError('');
    } else {
      setParsed(null);
      setParseError(`Invalid JSON: ${result.error}`);
    }
  }, []);

  const handlePasteChange = (e) => {
    const val = e.target.value;
    setPasted(val);
    if (val.trim()) processText(val.trim());
    else { setParsed(null); setParseError(''); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processText(ev.target.result);
    reader.readAsText(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processText(ev.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    await onImport?.({ data: parsed, mergeMode });
    setImporting(false);
    setDone(true);
    setTimeout(() => onClose?.(), 1200);
  };

  const summary = parsed ? summarize(parsed) : null;

  if (!open) return null;

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal--md" role="dialog" aria-modal="true" aria-label="Import Data">
        <div className="modal__header" style={{ borderColor: 'var(--teal)' }}>
          <div className="modal__header-left">
            <span className="modal__icon" style={{ background: '#00ffd122' }}>📥</span>
            <div>
              <h2 className="modal__title">Import Data</h2>
              <p className="modal__subtitle">Load a Bolt Studio Pro backup</p>
            </div>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {/* Tabs */}
          <div className="tab-bar">
            <button className={`tab-btn ${tab === 'drop' ? 'tab-btn--active' : ''}`} onClick={() => setTab('drop')}>
              📁 Drop / Browse
            </button>
            <button className={`tab-btn ${tab === 'paste' ? 'tab-btn--active' : ''}`} onClick={() => setTab('paste')}>
              📋 Paste JSON
            </button>
          </div>

          {/* Drop zone */}
          {tab === 'drop' && (
            <div
              ref={dropRef}
              className={`drop-zone ${dragging ? 'drop-zone--active' : ''} ${parsed ? 'drop-zone--success' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span className="drop-icon">{parsed ? '✓' : '📂'}</span>
              <div className="drop-text">
                {parsed ? 'File loaded successfully!' : dragging ? 'Drop it here!' : 'Drag & drop a .json file here'}
              </div>
              <div className="drop-sub">or</div>
              <label className="btn btn--ghost btn--sm" style={{ cursor: 'pointer' }}>
                Browse File
                <input type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleFileInput} />
              </label>
            </div>
          )}

          {/* Paste zone */}
          {tab === 'paste' && (
            <textarea
              className={`form-input form-textarea form-textarea--code ${parseError ? 'form-input--error' : ''} ${parsed ? 'form-input--success' : ''}`}
              rows={8}
              value={pasted}
              onChange={handlePasteChange}
              placeholder='Paste JSON here… {"accounts": [], "broadcasts": [], …}'
              spellCheck={false}
            />
          )}

          {/* Validation */}
          {parseError && (
            <div className="alert alert--danger" style={{ marginTop: 8 }}>
              <span>✗</span><span>{parseError}</span>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="section-card" style={{ marginTop: 12 }}>
              <div className="section-card__label">📊 Import Summary</div>
              <div className="import-summary">
                {Object.entries(summary).map(([key, count]) => (
                  <div key={key} className="summary-row">
                    <span className="summary-key">{key}</span>
                    <span className="summary-val" style={{ color: 'var(--teal)' }}>{count} item{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merge / Replace toggle */}
          {parsed && (
            <div className="toggle-row" style={{ marginTop: 12 }}>
              <div>
                <div className="toggle-label">Merge with Existing</div>
                <div className="toggle-desc">
                  {mergeMode
                    ? 'New items added; existing items updated by ID'
                    : '⚠ All existing data will be replaced'}
                </div>
              </div>
              <button
                className={`toggle-btn ${mergeMode ? 'toggle-btn--on' : 'toggle-btn--danger'}`}
                onClick={() => setMergeMode(v => !v)}
              >
                {mergeMode ? '●' : '○'}
              </button>
            </div>
          )}

          {done && (
            <div className="alert alert--success" style={{ marginTop: 12 }}>
              <span>✓</span><span>Import successful!</span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            onClick={handleImport}
            disabled={!parsed || importing || done}
          >
            {importing ? <span className="spinner" /> : null}
            {importing ? 'Importing…' : done ? '✓ Done' : mergeMode ? '📥 Merge Import' : '📥 Replace Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
