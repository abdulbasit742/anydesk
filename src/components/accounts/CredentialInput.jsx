// CredentialInput.jsx — Secure credential input with show/hide toggle
import { useState } from 'react';
import { evaluateEntropy } from '../../lib/security/EntropyEvaluator.js';

export function CredentialInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  const entropy = value ? evaluateEntropy(value) : null;

  const strengthColor = !entropy ? '#333' :
    entropy.strength === 'very_strong' ? '#00FF88' :
    entropy.strength === 'strong' ? '#00FFAA' :
    entropy.strength === 'moderate' ? '#FFB800' : '#FF4D4D';

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Enter API key or session cookie...'}
          style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '10px 44px 10px 14px', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }}
        />
        <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>
          {show ? '🙈' : '👁'}
        </button>
      </div>
      {entropy && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 3, background: '#1a1e2e', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${entropy.score}%`, height: '100%', background: strengthColor, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
          </div>
          <span style={{ color: strengthColor, fontSize: 10, fontFamily: 'monospace', minWidth: 80 }}>{entropy.bits} bits · {entropy.strength.replace('_', ' ')}</span>
        </div>
      )}
    </div>
  );
}
