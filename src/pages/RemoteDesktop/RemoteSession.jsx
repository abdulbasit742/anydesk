import { useMemo, useState } from 'react';
import {
  approveSupportRequest,
  createAuditEntry,
  createSupportRequest,
  endSupportRequest,
  HIGH_RISK_SCOPES,
  SESSION_STATUS,
  startLocalPreview,
  SUPPORT_SCOPES,
} from '../../security/remoteSessionPolicy';

const SCOPE_LABELS = {
  [SUPPORT_SCOPES.SCREEN_VIEW]: 'View shared screen',
  [SUPPORT_SCOPES.POINTER_CONTROL]: 'Control pointer',
  [SUPPORT_SCOPES.KEYBOARD_CONTROL]: 'Send keyboard input',
  [SUPPORT_SCOPES.CLIPBOARD_READ]: 'Read host clipboard',
  [SUPPORT_SCOPES.CLIPBOARD_WRITE]: 'Write host clipboard',
  [SUPPORT_SCOPES.FILE_RECEIVE]: 'Receive files from host',
  [SUPPORT_SCOPES.FILE_SEND]: 'Send files to host',
};

const ALL_SCOPES = Object.values(SUPPORT_SCOPES);
const panelStyle = {
  background: 'var(--card)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 18,
};

function statusLabel(status) {
  return {
    [SESSION_STATUS.CONSENT_PENDING]: 'Awaiting host consent',
    [SESSION_STATUS.APPROVED]: 'Consent approved',
    [SESSION_STATUS.PREVIEW]: 'Local preview open',
    [SESSION_STATUS.ENDED]: 'Request ended',
  }[status] ?? 'Not created';
}

export default function RemoteSession({ onNav }) {
  const [requesterLabel, setRequesterLabel] = useState('Support operator');
  const [hostLabel, setHostLabel] = useState('Host user');
  const [targetLabel, setTargetLabel] = useState('Demo workstation');
  const [selectedScopes, setSelectedScopes] = useState([SUPPORT_SCOPES.SCREEN_VIEW]);
  const [request, setRequest] = useState(null);
  const [audit, setAudit] = useState([]);
  const [hostConfirmed, setHostConfirmed] = useState(false);
  const [highRiskConfirmed, setHighRiskConfirmed] = useState(false);
  const [error, setError] = useState('');

  const hasHighRisk = useMemo(
    () => selectedScopes.some((scope) => HIGH_RISK_SCOPES.has(scope)),
    [selectedScopes],
  );

  const record = (nextRequest, action, details = {}) => {
    setRequest(nextRequest);
    setAudit((entries) => [...entries, createAuditEntry(nextRequest, action, { details })]);
  };

  const toggleScope = (scope) => {
    if (request || scope === SUPPORT_SCOPES.SCREEN_VIEW) return;
    setSelectedScopes((current) => current.includes(scope)
      ? current.filter((item) => item !== scope)
      : [...current, scope]);
  };

  const createRequest = () => {
    setError('');
    try {
      const next = createSupportRequest({ requesterLabel, hostLabel, targetLabel, scopes: selectedScopes });
      record(next, 'request_created', { target: next.targetLabel });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create request.');
    }
  };

  const approve = () => {
    setError('');
    try {
      const next = approveSupportRequest(request, { hostConfirmed, highRiskConfirmed });
      record(next, 'consent_approved', { scopes: next.scopes.join('|') });
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : 'Unable to record consent.');
    }
  };

  const startPreview = () => {
    setError('');
    try {
      const next = startLocalPreview(request);
      record(next, 'preview_started', { transport: next.transport });
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Unable to open preview.');
    }
  };

  const endRequest = (reason = 'operator_ended') => {
    setError('');
    try {
      const next = endSupportRequest(request, { reason });
      record(next, 'request_ended', { reason });
    } catch (endError) {
      setError(endError instanceof Error ? endError.message : 'Unable to end request.');
    }
  };

  const reset = () => {
    setRequest(null);
    setAudit([]);
    setHostConfirmed(false);
    setHighRiskConfirmed(false);
    setSelectedScopes([SUPPORT_SCOPES.SCREEN_VIEW]);
    setError('');
  };

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <button type="button" onClick={() => onNav?.('remote')} style={{ border: 0, background: 'transparent', color: '#a5b4fc', cursor: 'pointer', padding: 0, marginBottom: 8 }}>
            ← Remote support overview
          </button>
          <h1 style={{ fontSize: 23, marginBottom: 6 }}>Support request and consent preview</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 760, lineHeight: 1.55 }}>
            This screen validates the consent lifecycle only. It does not connect to another device or capture, transmit, or control anything.
          </p>
        </div>
        <span role="status" style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#c7d2fe', fontSize: 12, fontWeight: 650 }}>
          {statusLabel(request?.status)}
        </span>
      </div>

      {error && <div role="alert" style={{ ...panelStyle, color: '#fecaca', borderColor: 'rgba(239,68,68,.4)', background: 'rgba(127,29,29,.22)', marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <section style={panelStyle} aria-labelledby="request-details-title">
            <h2 id="request-details-title" style={{ fontSize: 16, marginBottom: 14 }}>1. Request details</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['Requester', requesterLabel, setRequesterLabel],
                ['Host who must consent', hostLabel, setHostLabel],
                ['Target label', targetLabel, setTargetLabel],
              ].map(([label, value, setter]) => (
                <label key={label} style={{ display: 'grid', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
                  {label}
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => setter(event.target.value)}
                    disabled={Boolean(request)}
                    maxLength={80}
                    style={{ padding: '9px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: '#fff' }}
                  />
                </label>
              ))}
            </div>

            <fieldset disabled={Boolean(request)} style={{ border: 0, padding: 0, margin: '18px 0 0' }}>
              <legend style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 9 }}>Requested capabilities</legend>
              <div style={{ display: 'grid', gap: 8 }}>
                {ALL_SCOPES.map((scope) => (
                  <label key={scope} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope)}
                      disabled={scope === SUPPORT_SCOPES.SCREEN_VIEW || Boolean(request)}
                      onChange={() => toggleScope(scope)}
                    />
                    <span>{SCOPE_LABELS[scope]}</span>
                    {HIGH_RISK_SCOPES.has(scope) && <span style={{ color: '#fbbf24', fontSize: 10 }}>HIGH RISK</span>}
                  </label>
                ))}
              </div>
            </fieldset>

            {!request && (
              <button type="button" onClick={createRequest} style={{ marginTop: 18, padding: '9px 14px', borderRadius: 8, border: 0, background: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 650 }}>
                Create 10-minute request
              </button>
            )}
          </section>

          {request?.status === SESSION_STATUS.CONSENT_PENDING && (
            <section style={panelStyle} aria-labelledby="consent-title">
              <h2 id="consent-title" style={{ fontSize: 16, marginBottom: 8 }}>2. Record explicit host consent</h2>
              <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.55 }}>
                The host must understand that this prototype only opens a local preview. Selected capabilities are documented for review but are not executed.
              </p>
              <label style={{ display: 'flex', gap: 9, marginTop: 12, fontSize: 13 }}>
                <input type="checkbox" checked={hostConfirmed} onChange={(event) => setHostConfirmed(event.target.checked)} />
                The named host explicitly approves this request.
              </label>
              {hasHighRisk && (
                <label style={{ display: 'flex', gap: 9, marginTop: 10, fontSize: 13, color: '#fde68a' }}>
                  <input type="checkbox" checked={highRiskConfirmed} onChange={(event) => setHighRiskConfirmed(event.target.checked)} />
                  The host separately acknowledges the requested input, clipboard, or file capabilities.
                </label>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                <button type="button" onClick={approve} style={{ padding: '9px 14px', borderRadius: 8, border: 0, background: '#047857', color: '#fff', cursor: 'pointer' }}>Approve request</button>
                <button type="button" onClick={() => endRequest('host_declined')} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,.45)', background: 'transparent', color: '#fca5a5', cursor: 'pointer' }}>Host declines</button>
              </div>
            </section>
          )}

          {request?.status === SESSION_STATUS.APPROVED && (
            <section style={panelStyle} aria-labelledby="preview-title">
              <h2 id="preview-title" style={{ fontSize: 16, marginBottom: 8 }}>3. Open local preview</h2>
              <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.55 }}>
                Consent is recorded. Opening the preview changes only this page state; transport remains <code>not_configured</code>.
              </p>
              <button type="button" onClick={startPreview} style={{ marginTop: 10, padding: '9px 14px', borderRadius: 8, border: 0, background: '#4f46e5', color: '#fff', cursor: 'pointer' }}>
                Open local preview
              </button>
            </section>
          )}

          {request?.status === SESSION_STATUS.PREVIEW && (
            <section style={{ ...panelStyle, minHeight: 270, display: 'grid', placeItems: 'center', textAlign: 'center', background: 'rgba(0,0,0,.28)' }} aria-labelledby="local-preview-title">
              <div>
                <div style={{ fontSize: 44, marginBottom: 10 }} aria-hidden="true">🛡️</div>
                <h2 id="local-preview-title" style={{ fontSize: 18, marginBottom: 7 }}>Consent-approved local preview</h2>
                <p style={{ color: 'var(--muted)', fontSize: 12, maxWidth: 520, lineHeight: 1.55 }}>
                  No remote screen, camera, microphone, clipboard, file, keyboard, or pointer data is connected. A real transport must be implemented and independently security-reviewed before this state can represent a live session.
                </p>
                <button type="button" onClick={() => endRequest('operator_ended')} style={{ marginTop: 14, padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,.45)', background: 'transparent', color: '#fca5a5', cursor: 'pointer' }}>
                  End preview
                </button>
              </div>
            </section>
          )}

          {request?.status === SESSION_STATUS.ENDED && (
            <section style={panelStyle}>
              <h2 style={{ fontSize: 16, marginBottom: 7 }}>Request ended</h2>
              <p style={{ color: 'var(--muted)', fontSize: 12 }}>Reason: {request.endReason}. No capability remains active.</p>
              <button type="button" onClick={reset} style={{ marginTop: 10, padding: '9px 14px', borderRadius: 8, border: 0, background: '#334155', color: '#fff', cursor: 'pointer' }}>Prepare another request</button>
            </section>
          )}
        </div>

        <aside style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <section style={panelStyle} aria-labelledby="boundary-title">
            <h2 id="boundary-title" style={{ fontSize: 15, marginBottom: 10 }}>Enforced boundary</h2>
            <dl style={{ margin: 0, display: 'grid', gap: 9, fontSize: 12 }}>
              {[
                ['Session ID', request?.id ?? 'Not created'],
                ['Expires', request ? new Date(request.expiresAt).toLocaleString() : '—'],
                ['Transport', request?.transport ?? 'not_configured'],
                ['Media capture', 'Disabled'],
                ['Remote input', 'Disabled'],
                ['Persistence', 'None'],
              ].map(([term, value]) => (
                <div key={term} style={{ display: 'grid', gridTemplateColumns: '105px 1fr', gap: 8 }}>
                  <dt style={{ color: 'var(--muted)' }}>{term}</dt>
                  <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section style={panelStyle} aria-labelledby="audit-title">
            <h2 id="audit-title" style={{ fontSize: 15, marginBottom: 10 }}>Session-local audit timeline</h2>
            {audit.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 12 }}>No events yet.</p>
            ) : (
              <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
                {audit.map((entry) => (
                  <li key={entry.id} style={{ fontSize: 12 }}>
                    <strong>{entry.action.replaceAll('_', ' ')}</strong>
                    <div style={{ color: 'var(--muted)', fontSize: 10 }}>{new Date(entry.at).toLocaleString()} · {entry.status}</div>
                  </li>
                ))}
              </ol>
            )}
            <p style={{ color: 'var(--muted)', fontSize: 10, lineHeight: 1.5, marginTop: 12 }}>
              This audit list is in memory only and is not tamper-evident or durable.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
