import { useEffect, useRef, useState } from 'react';
import './modals.css';

const PLATFORM_COMPAT = {
  twitter:   { label: 'Twitter',   color: '#1da1f2', maxTokens: 280 },
  instagram: { label: 'Instagram', color: '#e1306c', maxTokens: 2200 },
  linkedin:  { label: 'LinkedIn',  color: '#0a66c2', maxTokens: 3000 },
  facebook:  { label: 'Facebook',  color: '#1877f2', maxTokens: 63206 },
  tiktok:    { label: 'TikTok',    color: '#ff0050', maxTokens: 2200 },
};

const VAR_REGEX = /(\{\{[^}]+\}\})/g;

function HighlightedPrompt({ text }) {
  if (!text) return <span style={{ opacity: 0.35 }}>No prompt content…</span>;
  const parts = text.split(VAR_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        VAR_REGEX.test(part)
          ? <mark key={i} className="var-highlight">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

function countVars(text) {
  return [...(text?.matchAll(VAR_REGEX) || [])].length;
}

function countTokens(text) {
  return Math.ceil((text?.length || 0) / 4);
}

export default function PromptPreviewModal({ open, onClose, onUseInBuilder, prompt = null }) {
  const [copied, setCopied]     = useState(false);
  const textRef                 = useRef(null);

  const text     = prompt?.content || '';
  const name     = prompt?.name    || 'Untitled Prompt';
  const tokens   = countTokens(text);
  const chars    = text.length;
  const vars     = countVars(text);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const compatPlatforms = Object.entries(PLATFORM_COMPAT).map(([key, p]) => ({
    ...p,
    key,
    ok: tokens <= p.maxTokens,
  }));

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal--lg" role="dialog" aria-modal="true" aria-label="Prompt Preview">
        {/* Header */}
        <div className="modal__header" style={{ borderColor: 'var(--gold)' }}>
          <div className="modal__header-left">
            <span className="modal__icon" style={{ background: '#f5c54222' }}>📋</span>
            <div>
              <h2 className="modal__title">{name}</h2>
              <p className="modal__subtitle" style={{ color: 'var(--gold)' }}>Prompt Preview</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn--ghost btn--sm" onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button className="modal__close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal__body">
          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card__val" style={{ color: 'var(--gold)' }}>{tokens}</div>
              <div className="stat-card__label">Tokens</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__val">{chars}</div>
              <div className="stat-card__label">Chars</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__val" style={{ color: 'var(--teal)' }}>{vars}</div>
              <div className="stat-card__label">Variables</div>
            </div>
          </div>

          {/* Prompt Text */}
          <div className="section-label">Prompt Content</div>
          <div className="prompt-display" ref={textRef}>
            <HighlightedPrompt text={text} />
          </div>

          {/* Variable legend */}
          {vars > 0 && (
            <div className="var-legend">
              <span className="var-highlight" style={{ fontSize: '0.75rem' }}>{'{{variable}}'}</span>
              <span style={{ fontSize: '0.75rem', marginLeft: 8, opacity: 0.6 }}>
                — template variables highlighted in gold
              </span>
            </div>
          )}

          {/* Platform compatibility */}
          <div className="section-label" style={{ marginTop: 16 }}>Platform Compatibility</div>
          <div className="compat-grid">
            {compatPlatforms.map(p => (
              <div
                key={p.key}
                className={`compat-chip ${p.ok ? 'compat-chip--ok' : 'compat-chip--fail'}`}
                style={{ borderColor: p.ok ? p.color + '66' : 'var(--red)' }}
              >
                <span style={{ color: p.ok ? p.color : 'var(--red)' }}>{p.ok ? '✓' : '✗'}</span>
                <span className="compat-label" style={{ color: p.ok ? 'var(--fg)' : 'var(--red)' }}>{p.label}</span>
                <span className="compat-limit" style={{ opacity: 0.5 }}>/{p.maxTokens}t</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
          <button className="btn btn--primary" onClick={() => { onUseInBuilder?.(prompt); onClose?.(); }}>
            Use in Builder →
          </button>
        </div>
      </div>
    </div>
  );
}
