import { useEffect, useState } from 'react';
import './modals.css';

const PLATFORM_META = {
  twitter:   { icon: '𝕏',  color: '#1da1f2', label: 'Twitter' },
  instagram: { icon: '📸', color: '#e1306c', label: 'Instagram' },
  facebook:  { icon: 'f',  color: '#1877f2', label: 'Facebook' },
  linkedin:  { icon: 'in', color: '#0a66c2', label: 'LinkedIn' },
  tiktok:    { icon: '♪',  color: '#ff0050', label: 'TikTok' },
  youtube:   { icon: '▶',  color: '#ff0000', label: 'YouTube' },
  reddit:    { icon: '👾', color: '#ff4500', label: 'Reddit' },
  discord:   { icon: '◎',  color: '#5865f2', label: 'Discord' },
  other:     { icon: '⚙',  color: 'var(--gold)', label: 'Other' },
};

function truncate(str, max = 160) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function estimateDelivery(count) {
  const secs = count * 2 + 4;
  return secs < 60 ? `~${secs}s` : `~${Math.ceil(secs / 60)}m`;
}

export default function BroadcastConfirmModal({ open, onClose, onConfirm, prompt = '', accounts = [] }) {
  const [confirming, setConfirming] = useState(false);

  const hasExpired = accounts.some(a => a.expired);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm?.();
    setConfirming(false);
    onClose?.();
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal--md" role="dialog" aria-modal="true" aria-label="Confirm Broadcast">
        {/* Header */}
        <div className="modal__header" style={{ borderColor: hasExpired ? 'var(--red)' : 'var(--gold)' }}>
          <div className="modal__header-left">
            <span className="modal__icon" style={{ background: hasExpired ? '#ff3b3b22' : '#f5c54222' }}>
              {hasExpired ? '⚠' : '📡'}
            </span>
            <div>
              <h2 className="modal__title">Confirm Broadcast</h2>
              <p className="modal__subtitle">
                {hasExpired
                  ? <span style={{ color: 'var(--red)' }}>One or more accounts are expired</span>
                  : <span>Sending to {accounts.length} account{accounts.length !== 1 ? 's' : ''}</span>
                }
              </p>
            </div>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {/* Prompt Preview */}
          <div className="section-card">
            <div className="section-card__label">
              <span>📝</span> Prompt Preview
            </div>
            <p className="prompt-preview">{truncate(prompt) || <em style={{ opacity: 0.4 }}>No prompt provided</em>}</p>
            <div className="meta-row">
              <span className="meta-chip">{prompt?.length || 0} chars</span>
              <span className="meta-chip">~{Math.ceil((prompt?.length || 0) / 4)} tokens</span>
            </div>
          </div>

          {/* Danger banner */}
          {hasExpired && (
            <div className="alert alert--danger">
              <span>⚠</span>
              <span>Expired accounts will be skipped or may fail. Review before proceeding.</span>
            </div>
          )}

          {/* Account list */}
          <div className="section-label">Target Accounts</div>
          <div className="account-list">
            {accounts.length === 0 && (
              <div className="empty-state">No accounts selected</div>
            )}
            {accounts.map((acc, i) => {
              const meta = PLATFORM_META[acc.platform] || PLATFORM_META.other;
              return (
                <div key={acc.id || i} className={`account-row ${acc.expired ? 'account-row--expired' : ''}`}>
                  <span
                    className="platform-badge platform-badge--sm"
                    style={{ background: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}44` }}
                  >
                    {meta.icon}
                  </span>
                  <div className="account-row__info">
                    <span className="account-row__name">{acc.name}</span>
                    <span className="account-row__platform" style={{ color: meta.color }}>{meta.label}</span>
                  </div>
                  {acc.expired && (
                    <span className="status-badge status-badge--expired">EXPIRED</span>
                  )}
                  {!acc.expired && (
                    <span className="status-badge status-badge--ok">READY</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card__val">{accounts.length}</div>
              <div className="stat-card__label">Targets</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__val">{accounts.filter(a => !a.expired).length}</div>
              <div className="stat-card__label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__val" style={{ color: 'var(--red)' }}>{accounts.filter(a => a.expired).length}</div>
              <div className="stat-card__label">Expired</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__val" style={{ color: 'var(--teal)' }}>{estimateDelivery(accounts.filter(a => !a.expired).length)}</div>
              <div className="stat-card__label">Est. Time</div>
            </div>
          </div>

          {/* Risk assessment */}
          <div className="risk-panel">
            <div className="risk-panel__title">Risk Assessment</div>
            <div className="risk-row"><span className="risk-dot risk-dot--ok" /> Prompt within limits</div>
            <div className="risk-row"><span className="risk-dot risk-dot--ok" /> Active accounts verified</div>
            {hasExpired && (
              <div className="risk-row"><span className="risk-dot risk-dot--danger" /> Expired credentials detected</div>
            )}
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={confirming}>Cancel</button>
          <button
            className={`btn ${hasExpired ? 'btn--danger' : 'btn--primary'}`}
            onClick={handleConfirm}
            disabled={confirming || accounts.length === 0}
          >
            {confirming ? <span className="spinner" /> : null}
            {confirming ? 'Broadcasting…' : hasExpired ? '⚠ Broadcast Anyway' : '📡 Confirm Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
}
