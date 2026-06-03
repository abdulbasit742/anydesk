// PromptEditor.jsx — Rich prompt editor with variable highlighting
import { useRef, useMemo } from 'react';
import { scanAll } from '../../lib/interpolation/VariableScanner.js';
import { estimateTokens } from '../../lib/interpolation/TokenEstimator.js';

export function PromptEditor({ value, onChange, variables = {}, placeholder }) {
  const textareaRef = useRef(null);
  const scannedVars = useMemo(() => scanAll(value || ''), [value]);
  const tokens = useMemo(() => estimateTokens(value || ''), [value]);
  const unresolved = scannedVars.filter(v => !variables[v.name] || variables[v.name] === '');

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, overflow: 'hidden', fontFamily: 'monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2340', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#555', fontSize: 12 }}>PROMPT EDITOR</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: tokens > 4000 ? '#FF4D4D' : '#555', fontSize: 11 }}>~{tokens} tokens</span>
        {scannedVars.length > 0 && <span style={{ color: unresolved.length ? '#FFB800' : '#00FF88', fontSize: 11 }}>{scannedVars.length} var{scannedVars.length !== 1 ? 's' : ''}{unresolved.length ? ` (${unresolved.length} unset)` : ' ✓'}</span>}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Write your prompt here...\nUse {{variableName}} for dynamic variables.'}
        style={{ width: '100%', minHeight: 200, background: 'transparent', border: 'none', color: '#e0e0e0', padding: '16px', fontSize: 14, lineHeight: 1.6, fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
      />
      {scannedVars.length > 0 && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid #1e2340', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {scannedVars.map(v => (
            <span key={v.name} style={{ fontSize: 11, background: variables[v.name] ? '#0d3321' : '#1a1000', color: variables[v.name] ? '#00FF88' : '#FFB800', padding: '2px 8px', borderRadius: 4 }}>
              {`{{${v.name}}}`} ×{v.occurrences}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
