// PromptOptimizer.jsx — Inline prompt optimization widget
import { useState, useMemo } from 'react';
import { runFullAudit } from '../../lib/optimizer/PromptArchitect.js';
import ScoreDial from '../telemetry/ScoreDial.jsx';

function generateOptimizedText(text) {
  if (!text || !text.trim()) return '';

  const hasRole = /role|you are|act as|persona/i.test(text);
  const hasContext = /context|project is|system configuration/i.test(text);
  const hasConstraints = /constraints|rules|do not|avoid/i.test(text);
  const hasFormat = /format|respond with|output format/i.test(text);

  let result = '';

  if (!hasRole) {
    result += `## Role\nYou are a lead AI systems engineer specializing in React, state management, and high-performance frontend interfaces.\n\n`;
  }

  if (!hasContext) {
    result += `## Context\nThis feature is part of the AgentFlow SaaS dashboard, using a premium dark-themed CSS variable design token system.\n\n`;
  }

  result += `## Task\n${text}\n\n`;

  if (!hasConstraints) {
    result += `## Constraints\n- Write 100% complete files without placeholders or TODO markers.\n- Avoid duplicate declarations or style keys.\n- Strictly adhere to responsive design guidelines (min 320px layout support).\n- Zero ESLint errors or warnings are acceptable.\n\n`;
  }

  if (!hasFormat) {
    result += `## Format\nProvide modular code snippets enclosed in markdown blocks. Avoid verbose explanations.`;
  }

  return result.trim();
}

function computeLineDiff(originalText, optimizedText) {
  const oLines = originalText.split('\n');
  const nLines = optimizedText.split('\n');

  // Standard DP LCS diff
  const dp = Array(oLines.length + 1).fill(null).map(() => Array(nLines.length + 1).fill(0));
  for (let i = 1; i <= oLines.length; i++) {
    for (let j = 1; j <= nLines.length; j++) {
      if (oLines[i-1] === nLines[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }

  let i = oLines.length;
  let j = nLines.length;
  const diff = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oLines[i-1] === nLines[j-1]) {
      diff.unshift({ type: 'normal', line: oLines[i-1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      diff.unshift({ type: 'addition', line: nLines[j-1] });
      j--;
    } else {
      diff.unshift({ type: 'deletion', line: oLines[i-1] });
      i--;
    }
  }
  return diff;
}

export function PromptOptimizer({ prompt, onApply }) {
  const [audit, setAudit] = useState(null);
  const [viewMode, setViewMode] = useState('suggestions'); // 'suggestions' | 'diff'
  const text = prompt?.template || prompt?.prompt || '';

  const run = () => {
    setAudit(runFullAudit(text));
  };

  const optimizedText = useMemo(() => generateOptimizedText(text), [text]);
  const diffResult = useMemo(() => computeLineDiff(text, optimizedText), [text, optimizedText]);

  const handleApply = () => {
    if (onApply && optimizedText) {
      onApply(optimizedText);
    }
  };

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, padding: 20, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ color: '#e0e0e0', margin: 0, fontSize: 13 }}>🔬 Prompt Optimization Engine</h3>
          <span style={{ fontSize: 9.5, color: '#6e7191' }}>{prompt?.name || 'Composing Space'}</span>
        </div>
        <button onClick={run} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 8, color: '#00FFAA', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold' }}>
          Analyze Prompt
        </button>
      </div>

      {text && !audit && (
        <div style={{ background: '#080c14', borderRadius: 8, padding: 12, color: '#888', fontSize: 11.5, lineHeight: 1.6, maxHeight: 90, overflowY: 'auto' }}>
          {text.slice(0, 200)}{text.length > 200 ? '...' : ''}
        </div>
      )}

      {audit && (
        <div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #161a35', paddingBottom: 14 }}>
            <ScoreDial score={audit.pct} label="Fidelity" size={90} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#ccc', fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Grade {audit.grade}</div>
              <div style={{ color: '#6e7191', fontSize: 11 }}>{audit.passed}/{audit.total} semantic checks passed</div>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: 4, background: '#080c14', padding: 2, borderRadius: 6, border: '1px solid #161a35' }}>
              <button
                onClick={() => setViewMode('suggestions')}
                style={{ background: viewMode === 'suggestions' ? '#1e2340' : 'transparent', border: 'none', color: viewMode === 'suggestions' ? '#fff' : '#6e7191', fontSize: 10, padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
              >
                Tips
              </button>
              <button
                onClick={() => setViewMode('diff')}
                style={{ background: viewMode === 'diff' ? '#1e2340' : 'transparent', border: 'none', color: viewMode === 'diff' ? '#fff' : '#6e7191', fontSize: 10, padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
              >
                Diff View
              </button>
            </div>
          </div>

          {/* Suggestions view */}
          {viewMode === 'suggestions' && (
            <div>
              {audit.suggestions.length > 0 ? (
                <div>
                  <div style={{ color: '#f5b731', fontSize: 11, fontWeight: 'bold', marginBottom: 8, letterSpacing: '0.04em' }}>OPTIMIZATION ADVICE:</div>
                  <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {audit.suggestions.map((s, i) => (
                      <div key={i} style={{ color: '#a7a9be', fontSize: 11, padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, borderLeft: '3px solid #f5b731' }}>
                        △ {s}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#22d3ee', fontSize: 11.5, textAlign: 'center', padding: '12px 0' }}>
                  ✓ This prompt is perfectly structured and matches all semantic design criteria!
                </div>
              )}
            </div>
          )}

          {/* Diff view */}
          {viewMode === 'diff' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ color: '#22d3ee', fontSize: 11, fontWeight: 'bold' }}>PROPOSED STRUCTURAL DIFF:</span>
                {onApply && (
                  <button
                    onClick={handleApply}
                    style={{ background: '#22d3ee22', border: '1px solid #22d3ee44', borderRadius: 6, color: '#22d3ee', fontSize: 10.5, padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Apply Optimization
                  </button>
                )}
              </div>
              <div style={{ background: '#080c14', borderRadius: 8, border: '1px solid #161a35', maxHeight: 200, overflowY: 'auto', padding: 8, fontSize: 10.5, lineHeight: 1.6 }}>
                {diffResult.map((d, idx) => {
                  let bgColor = 'transparent';
                  let color = '#a7a9be';
                  let prefix = ' ';

                  if (d.type === 'addition') {
                    bgColor = 'rgba(34,211,238,0.08)';
                    color = '#22d3ee';
                    prefix = '+';
                  } else if (d.type === 'deletion') {
                    bgColor = 'rgba(239,68,68,0.08)';
                    color = '#ef4444';
                    prefix = '-';
                  }

                  return (
                    <div key={idx} style={{ background: bgColor, color: color, whiteSpace: 'pre-wrap', padding: '2px 6px', borderRadius: 4, display: 'flex', gap: 8 }}>
                      <span style={{ opacity: 0.5, userSelect: 'none', width: 12 }}>{prefix}</span>
                      <span>{d.line || ' '}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
