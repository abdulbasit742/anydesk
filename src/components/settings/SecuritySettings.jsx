// SecuritySettings.jsx — MFA, session timeout, encryption, audit log settings
import React from 'react';
import { MfaVerifier } from '../../lib/security/MfaVerifier.js';

const mfa = new MfaVerifier();

export function SecuritySettings({ settings = {}, onChange }) {
  const [mfaCode, setMfaCode] = React.useState('');
  const [mfaStatus, setMfaStatus] = React.useState(null);
  const set = (key, value) => onChange?.({ ...settings, [key]: value });

  const handleMfaRequest = async () => {
    await mfa.requestCode('local-user');
    setMfaStatus('sent');
  };

  const handleMfaVerify = async () => {
    const result = mfa.verify(mfaCode);
    setMfaStatus(result.valid ? 'verified' : 'invalid');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13 }}>Two-Factor Authentication</div>
          <div style={{ color: '#555', fontSize: 11 }}>Require MFA on credential access</div>
        </div>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={!!settings.mfaEnabled} onChange={e => set('mfaEnabled', e.target.checked)} style={{ display: 'none' }} />
          <div style={{ width: 36, height: 20, background: settings.mfaEnabled ? '#00FFAA' : '#1e2340', borderRadius: 10, position: 'relative', transition: '0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: settings.mfaEnabled ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: settings.mfaEnabled ? '#000' : '#555', transition: '0.2s' }} />
          </div>
        </label>
      </div>

      {settings.mfaEnabled && (
        <div style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: 14 }}>
          <div style={{ color: '#888', fontSize: 11, marginBottom: 8 }}>MFA VERIFICATION</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={mfaCode} onChange={e => setMfaCode(e.target.value)} placeholder="6-digit code"
              style={{ flex: 1, background: '#0d1117', border: '1px solid #1e2340', borderRadius: 6, color: '#ccc', fontSize: 13, padding: '6px 10px' }} />
            <button onClick={handleMfaVerify} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 6, color: '#00FFAA', fontSize: 11, padding: '6px 12px', cursor: 'pointer' }}>Verify</button>
            <button onClick={handleMfaRequest} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 6, color: '#888', fontSize: 11, padding: '6px 12px', cursor: 'pointer' }}>Send Code</button>
          </div>
          {mfaStatus === 'verified' && <div style={{ color: '#00FFAA', fontSize: 11 }}>✓ Verified</div>}
          {mfaStatus === 'invalid' && <div style={{ color: '#FF4D4D', fontSize: 11 }}>✕ Invalid code</div>}
          {mfaStatus === 'sent' && <div style={{ color: '#FFB800', fontSize: 11 }}>Code sent (check console in demo)</div>}
        </div>
      )}

      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 6 }}>SESSION TIMEOUT (MINUTES)</label>
        <input type="number" min={5} max={480} value={settings.sessionTimeout || 30} onChange={e => set('sessionTimeout', parseInt(e.target.value))}
          style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, color: '#ccc', fontSize: 13, padding: '8px 12px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13 }}>Encrypt local state</div>
          <div style={{ color: '#555', fontSize: 11 }}>AES-CBC encrypted localStorage persistence</div>
        </div>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.encryptState !== false} onChange={e => set('encryptState', e.target.checked)} style={{ display: 'none' }} />
          <div style={{ width: 36, height: 20, background: settings.encryptState !== false ? '#00FFAA' : '#1e2340', borderRadius: 10, position: 'relative', transition: '0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: settings.encryptState !== false ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: settings.encryptState !== false ? '#000' : '#555', transition: '0.2s' }} />
          </div>
        </label>
      </div>
    </div>
  );
}
