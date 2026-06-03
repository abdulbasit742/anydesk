// PreviewPane.jsx — Live prompt preview with variable resolution
import { useMemo } from 'react';
import { resolveString } from '../../lib/interpolation/ConfigResolver.js';

export function PreviewPane({ prompt = '', variables = {} }) {
  const resolved = useMemo(() => resolveString(prompt, variables), [prompt, variables]);
  const hasUnresolved = resolved.includes('{{');

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, overflow: 'hidden', fontFamily: 'monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2340', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#555', fontSize: 12 }}>PREVIEW</span>
        {hasUnresolved && <span style={{ color: '#FFB800', fontSize: 11 }}>⚠ Unresolved variables</span>}
        {!hasUnresolved && prompt && <span style={{ color: '#00FF88', fontSize: 11 }}>✓ Ready to send</span>}
      </div>
      <div style={{ padding: 16, color: '#ccc', fontSize: 13, lineHeight: 1.6, minHeight: 100, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {resolved.split(/(\{\{[^}]+\}\})/).map((part, i) =>
          /^\{\{.+\}\}$/.test(part)
            ? <mark key={i} style={{ background: '#FFB80033', color: '#FFB800', borderRadius: 3 }}>{part}</mark>
            : part
        )}
        {!prompt && <span style={{ color: '#333' }}>Preview will appear here...</span>}
      </div>
    </div>
  );
}
