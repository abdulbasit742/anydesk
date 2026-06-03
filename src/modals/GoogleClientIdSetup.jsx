import { useState } from 'react';
import { saveClientId, getSavedClientId } from '../lib/googleAuth';

/**
 * One-time setup dialog for Google Client ID.
 * User only needs to enter it once — saved to localStorage.
 */
export default function GoogleClientIdSetup({ onDone, onCancel }) {
  const [clientId, setClientId] = useState(getSavedClientId());
  const [error, setError] = useState('');

  const handleSave = () => {
    const id = clientId.trim();
    if (!id) {
      setError('Please paste your Google Client ID');
      return;
    }
    if (!id.endsWith('.apps.googleusercontent.com') && !id.includes('.apps.google')) {
      setError('That doesn\'t look like a valid Client ID. It should end with .apps.googleusercontent.com');
      return;
    }
    saveClientId(id);
    onDone(id);
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 500 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40,
            background: '#fff',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <div>
            <div className="modal-title" style={{ marginBottom: 2 }}>Setup Real Google OAuth</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>One-time setup · takes 2 minutes</div>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 16,
          marginBottom: 18,
          fontSize: 12,
          lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: 10, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            📋 Quick Setup Steps
          </div>

          {[
            { n: '1', text: 'Go to', link: 'https://console.cloud.google.com/apis/credentials', label: 'console.cloud.google.com' },
            { n: '2', text: 'Create Project → "Bolt Studio" (or use existing)' },
            { n: '3', text: 'Click "+ Create Credentials" → OAuth 2.0 Client ID' },
            { n: '4', text: 'App type: Web application' },
            { n: '5', text: 'Authorised JavaScript origins: add', code: 'http://localhost:5173' },
            { n: '6', text: 'Copy the Client ID and paste below ↓' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
              <div style={{
                minWidth: 20, height: 20,
                background: 'var(--gold-glow)',
                color: 'var(--gold)',
                borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>{s.n}</div>
              <div style={{ color: 'var(--muted2)' }}>
                {s.text}
                {s.link && (
                  <a href={s.link} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', marginLeft: 4 }}>
                    {s.label} ↗
                  </a>
                )}
                {s.code && (
                  <code style={{
                    marginLeft: 4,
                    padding: '1px 6px',
                    background: 'var(--surface3)',
                    borderRadius: 4,
                    color: 'var(--teal)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 11,
                  }}>{s.code}</code>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Client ID input */}
        <div style={{ marginBottom: 14 }}>
          <label>Your Google Client ID</label>
          <input
            value={clientId}
            onChange={e => { setClientId(e.target.value); setError(''); }}
            placeholder="xxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          {error && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5 }}>{error}</div>
          )}
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>
            💾 Saved to your browser — only need to do this once
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-teal btn-sm btn-pulse"
            onClick={() => {
              saveClientId('sandbox-demo-mode');
              onDone('sandbox-demo-mode');
            }}
            style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            ⚡ Sandbox Demo Mode (No Setup)
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-gold btn-sm" onClick={handleSave}>
            <svg viewBox="0 0 24 24" width="14" height="14" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 }}>
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Save & Enable Google OAuth
          </button>
        </div>
      </div>
    </div>
  );
}
