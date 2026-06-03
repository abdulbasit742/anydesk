import { useState, useEffect, useRef } from 'react';
import './modals.css';

const PLATFORM_META = {
  twitter:   { label: 'Twitter / X',  icon: '𝕏',  color: '#1da1f2' },
  instagram: { label: 'Instagram',     icon: '📸', color: '#e1306c' },
  facebook:  { label: 'Facebook',      icon: 'f',  color: '#1877f2' },
  linkedin:  { label: 'LinkedIn',      icon: 'in', color: '#0a66c2' },
  tiktok:    { label: 'TikTok',        icon: '♪',  color: '#ff0050' },
  youtube:   { label: 'YouTube',       icon: '▶',  color: '#ff0000' },
  reddit:    { label: 'Reddit',        icon: '👾', color: '#ff4500' },
  discord:   { label: 'Discord',       icon: '◎',  color: '#5865f2' },
  other:     { label: 'Other',         icon: '⚙',  color: 'var(--gold)' },
};

export default function EditAccountModal({ open, onClose, account, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: '',
    platform: 'twitter',
    credential: '',
    notes: '',
  });
  const [showCred, setShowCred] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setForm({
          name:       account?.name       || '',
          platform:   account?.platform   || 'twitter',
          credential: account?.credential || '',
          notes:      account?.notes      || '',
        });
        setShowCred(false);
        setDeleteMode(false);
        setDeleteConfirm('');
        setErrors({});
        firstInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, account]);


  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const platform = PLATFORM_META[form.platform] || PLATFORM_META.other;

  const validate = () => {
    const errs = {};
    if (!form.name.trim())       errs.name       = 'Account name is required.';
    if (!form.credential.trim()) errs.credential = 'Credential cannot be empty.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await onSave?.({ ...account, ...form });
    setSaving(false);
    onClose?.();
  };

  const handleDelete = async () => {
    if (deleteConfirm.trim().toLowerCase() !== form.name.trim().toLowerCase()) return;
    await onDelete?.(account);
    onClose?.();
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal--md" role="dialog" aria-modal="true" aria-label="Edit Account">
        {/* Header */}
        <div className="modal__header" style={{ borderColor: platform.color }}>
          <div className="modal__header-left">
            <span
              className="platform-badge"
              style={{ background: platform.color + '22', color: platform.color, border: `1px solid ${platform.color}55` }}
            >
              {platform.icon}
            </span>
            <div>
              <h2 className="modal__title">Edit Account</h2>
              <p className="modal__subtitle" style={{ color: platform.color }}>{platform.label}</p>
            </div>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {/* Platform Selector */}
          <div className="form-group">
            <label className="form-label">Platform</label>
            <div className="platform-grid">
              {Object.entries(PLATFORM_META).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  className={`platform-chip ${form.platform === key ? 'platform-chip--active' : ''}`}
                  style={form.platform === key ? { borderColor: meta.color, color: meta.color, background: meta.color + '18' } : {}}
                  onClick={() => setForm(f => ({ ...f, platform: key }))}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Account Name <span className="required">*</span></label>
            <input
              ref={firstInputRef}
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
              placeholder="e.g. @myhandle"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Credential */}
          <div className="form-group">
            <label className="form-label">Credential / API Key <span className="required">*</span></label>
            <div className="input-row">
              <input
                className={`form-input ${errors.credential ? 'form-input--error' : ''}`}
                type={showCred ? 'text' : 'password'}
                value={form.credential}
                onChange={e => { setForm(f => ({ ...f, credential: e.target.value })); setErrors(er => ({ ...er, credential: '' })); }}
                placeholder="Paste API key or token"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowCred(v => !v)}
                aria-label={showCred ? 'Hide credential' : 'Show credential'}
              >
                {showCred ? '🙈' : '👁'}
              </button>
            </div>
            {errors.credential && <span className="form-error">{errors.credential}</span>}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input form-textarea"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes about this account..."
              rows={3}
            />
          </div>

          {/* Delete Section */}
          {account && (
            <div className="danger-zone">
              <div className="danger-zone__header">
                <span className="danger-icon">⚠</span>
                <span>Danger Zone</span>
              </div>
              {!deleteMode ? (
                <button className="btn btn--ghost-danger" onClick={() => setDeleteMode(true)}>
                  Delete Account
                </button>
              ) : (
                <div className="delete-confirm">
                  <p className="delete-confirm__text">
                    Type <strong>{form.name}</strong> to confirm deletion:
                  </p>
                  <input
                    className="form-input form-input--danger"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder={form.name}
                  />
                  <div className="btn-row">
                    <button className="btn btn--ghost" onClick={() => { setDeleteMode(false); setDeleteConfirm(''); }}>
                      Cancel
                    </button>
                    <button
                      className="btn btn--danger"
                      disabled={deleteConfirm.trim().toLowerCase() !== form.name.trim().toLowerCase()}
                      onClick={handleDelete}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
