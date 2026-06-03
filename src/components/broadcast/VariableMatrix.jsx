// VariableMatrix.jsx — Variable input grid for prompt interpolation
import { useMemo } from 'react';
import { scanVariables } from '../../lib/interpolation/VariableScanner.js';

export function VariableMatrix({ prompt = '', values = {}, onChange }) {
  const variables = useMemo(() => scanVariables(prompt), [prompt]);

  if (!variables.length) return null;

  const set = (name, val) => onChange({ ...values, [name]: val });

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, overflow: 'hidden', fontFamily: 'monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2340' }}>
        <span style={{ color: '#555', fontSize: 12 }}>VARIABLES ({variables.length})</span>
      </div>
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {variables.map(name => (
          <div key={name}>
            <label style={{ display: 'block', color: '#FFB800', fontSize: 11, marginBottom: 4 }}>{`{{${name}}}`}</label>
            <input value={values[name] || ''} onChange={e => set(name, e.target.value)} placeholder={`Enter ${name}...`} style={{ width: '100%', background: '#080c14', border: `1px solid ${values[name] ? '#00FFAA44' : '#1e2340'}`, borderRadius: 6, color: '#e0e0e0', padding: '7px 10px', fontSize: 12, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
