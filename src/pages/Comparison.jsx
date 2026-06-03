import { useState, useMemo, useCallback } from 'react';
import { useStore } from '../data/store';

// ─── Line Diff ────────────────────────────────────────────────────────────────
function lineDiff(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const maxLen = Math.max(aLines.length, bLines.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    lineNum: i + 1,
    aLine: aLines[i] ?? null,
    bLine: bLines[i] ?? null,
    changed: aLines[i] !== bLines[i],
  }));
}

// ─── Jaccard Similarity ────────────────────────────────────────────────────────
function jaccardSimilarity(a, b) {
  if (!a && !b) return 100;
  if (!a || !b) return 0;
  const clean = str => str.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const setA = new Set(clean(a));
  const setB = new Set(clean(b));
  const intersection = new Set([...setA].filter(w => setB.has(w)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 100;
  return Math.round((intersection.size / union.size) * 100);
}

function highlightWords(lineA, lineB, type) {
  if (!lineA || !lineB) return type === 'removed' ? lineA : lineB;
  const wordsA = lineA.split(/(\s+)/);
  const wordsB = lineB.split(/(\s+)/);
  
  if (type === 'removed') {
    return wordsA.map((w, i) => {
      const exists = wordsB.includes(w);
      if (!exists && w.trim()) {
        return <span key={i} style={{ background: 'rgba(239, 68, 68, 0.35)', border: '1px solid rgba(239, 68, 68, 0.6)', borderRadius: 2, padding: '0 2px' }}>{w}</span>;
      }
      return w;
    });
  } else {
    return wordsB.map((w, i) => {
      const exists = wordsA.includes(w);
      if (!exists && w.trim()) {
        return <span key={i} style={{ background: 'rgba(34, 197, 94, 0.35)', border: '1px solid rgba(34, 197, 94, 0.6)', borderRadius: 2, padding: '0 2px' }}>{w}</span>;
      }
      return w;
    });
  }
}

function highlightChars(lineA, lineB, type) {
  if (!lineA || !lineB) return type === 'removed' ? lineA : lineB;
  const charsA = lineA.split('');
  const charsB = lineB.split('');
  
  if (type === 'removed') {
    return charsA.map((c, i) => {
      const exists = charsB.includes(c);
      if (!exists) {
        return <span key={i} style={{ background: 'rgba(239, 68, 68, 0.45)', color: '#fff', fontWeight: 'bold' }}>{c}</span>;
      }
      return c;
    });
  } else {
    return charsB.map((c, i) => {
      const exists = charsA.includes(c);
      if (!exists) {
        return <span key={i} style={{ background: 'rgba(34, 197, 94, 0.45)', color: '#fff', fontWeight: 'bold' }}>{c}</span>;
      }
      return c;
    });
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  page: {
    padding: '2rem',
    fontFamily: 'DM Mono, monospace',
    color: 'var(--fg, #e2e8f0)',
    background: 'var(--bg, #0d0f14)',
    minHeight: '100vh',
  },
  header: { marginBottom: '1.5rem' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' },
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg,#1a1a2e,#2d1b69)',
    border: '1px solid #7c3aed',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
  },
  title: { margin: 0, fontSize: '1.6rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 },
  sub: { margin: 0, fontSize: '0.82rem', color: '#64748b' },

  configRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem',
  },
  panelConfig: {
    background: '#131720', border: '1px solid #1e293b', borderRadius: 12, padding: '1rem',
  },
  labelRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem',
  },
  label: { fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 },
  select: {
    padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #334155',
    background: '#1e293b', color: '#e2e8f0', fontFamily: 'DM Mono, monospace',
    fontSize: '0.82rem', cursor: 'pointer', outline: 'none', width: '100%', marginBottom: '0.6rem',
  },
  textarea: {
    padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #334155',
    background: '#0d1117', color: '#e2e8f0', fontFamily: 'DM Mono, monospace',
    fontSize: '0.8rem', resize: 'vertical', minHeight: 90, outline: 'none',
    width: '100%', boxSizing: 'border-box', lineHeight: 1.6,
  },

  toolbar: {
    display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap',
  },
  btn: (variant) => ({
    padding: '0.55rem 1.2rem', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.15s',
    ...(variant === 'primary'
      ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff' }
      : variant === 'teal'
      ? { background: 'transparent', color: '#2dd4bf', border: '1px solid #2dd4bf' }
      : { background: 'transparent', color: '#94a3b8', border: '1px solid #334155' }),
  }),

  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem', marginBottom: '1rem',
  },
  statCard: {
    background: '#131720', border: '1px solid #1e293b', borderRadius: 10,
    padding: '0.65rem 0.75rem', textAlign: 'center',
  },
  statVal: { fontSize: '1.1rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#e2e8f0' },
  statLabel: { fontSize: '0.62rem', color: '#475569', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' },

  diffGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 12,
    border: '1px solid #1e293b', overflow: 'hidden', fontFamily: 'DM Mono, monospace',
    background: '#0d1117',
  },
  diffHeader: (color) => ({
    padding: '0.6rem 1rem', background: '#131720', borderBottom: '1px solid #1e293b',
    fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  }),
  diffBody: { maxHeight: 420, overflowY: 'auto' },

  diffRow: (state) => ({
    display: 'flex', minHeight: 24,
    background:
      state === 'added' ? 'rgba(34,197,94,0.12)' :
      state === 'removed' ? 'rgba(239,68,68,0.12)' :
      'transparent',
    borderLeft: `3px solid ${
      state === 'added' ? '#22c55e' :
      state === 'removed' ? '#ef4444' :
      'transparent'
    }`,
  }),
  lineNum: {
    width: 36, flexShrink: 0, padding: '3px 6px', textAlign: 'right',
    fontSize: '0.7rem', color: '#334155', userSelect: 'none', borderRight: '1px solid #1e293b',
    lineHeight: 1.8,
  },
  lineText: (state) => ({
    padding: '3px 10px', fontSize: '0.78rem', lineHeight: 1.8,
    color:
      state === 'added' ? '#86efac' :
      state === 'removed' ? '#fca5a5' :
      '#94a3b8',
    whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1,
  }),
  emptyLine: {
    padding: '3px 10px', fontSize: '0.78rem', lineHeight: 1.8, flex: 1,
    background: 'rgba(255,255,255,0.02)', color: 'transparent', userSelect: 'none',
  },

  divider: { width: 1, background: '#1e293b' },

  legend: {
    display: 'flex', gap: '1.5rem', alignItems: 'center',
    fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem',
  },
  legendDot: (c, bg) => ({
    display: 'inline-block', width: 10, height: 10, borderRadius: 2,
    background: bg, border: `1px solid ${c}`, marginRight: 5,
  }),

  similarityBar: (pct) => ({
    height: 6, borderRadius: 3, marginTop: 6,
    background: `linear-gradient(90deg, ${pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'} ${pct}%, #1e293b ${pct}%)`,
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Comparison() {
  const { prompts = [] } = useStore();

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [promptSelA, setPromptSelA] = useState('');
  const [promptSelB, setPromptSelB] = useState('');
  const [copied, setCopied] = useState(false);
  const [diffMode, setDiffMode] = useState('line'); // 'line' | 'word' | 'char'
  const [fontFamily, setFontFamily] = useState('DM Mono'); // 'DM Mono' | 'Fira Code' | 'Courier' | 'Monospace'

  const fontStyle = fontFamily === 'DM Mono' ? 'DM Mono, monospace' : fontFamily === 'Fira Code' ? 'Fira Code, monospace' : fontFamily === 'Courier' ? 'Courier New, monospace' : 'monospace';

  // Load prompt into panel when selector changes
  const handlePromptSelA = useCallback((e) => {
    const id = e.target.value;
    setPromptSelA(id);
    if (id) {
      const p = prompts.find(p => p.id === id);
      if (p) setTextA(p.content || p.text || p.prompt || '');
    }
  }, [prompts]);

  const handlePromptSelB = useCallback((e) => {
    const id = e.target.value;
    setPromptSelB(id);
    if (id) {
      const p = prompts.find(p => p.id === id);
      if (p) setTextB(p.content || p.text || p.prompt || '');
    }
  }, [prompts]);

  // Swap A and B
  const handleSwap = () => {
    setTextA(textB);
    setTextB(textA);
    setPromptSelA(promptSelB);
    setPromptSelB(promptSelA);
  };

  // Computed diff
  const diff = useMemo(() => lineDiff(textA, textB), [textA, textB]);

  // Stats
  const charsA = textA.length;
  const charsB = textB.length;
  const wordsA = textA.trim() ? textA.trim().split(/\s+/).length : 0;
  const wordsB = textB.trim() ? textB.trim().split(/\s+/).length : 0;
  const linesA = textA ? textA.split('\n').length : 0;
  const linesB = textB ? textB.split('\n').length : 0;
  const similarity = useMemo(() => jaccardSimilarity(textA, textB), [textA, textB]);
  const changedLines = diff.filter(r => r.changed).length;

  // Copy diff as markdown
  const copyDiff = useCallback(() => {
    const md = [
      '# Line Diff',
      '',
      '| # | Panel A | Panel B |',
      '|---|---------|---------|',
      ...diff.map(r =>
        `| ${r.lineNum} | ${r.aLine !== null ? r.aLine.replace(/\|/g, '\\|') : '_empty_'} | ${r.bLine !== null ? r.bLine.replace(/\|/g, '\\|') : '_empty_'} |`
      ),
      '',
      `**Similarity:** ${similarity}%`,
      `**Changed lines:** ${changedLines}`,
    ].join('\n');
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [diff, similarity, changedLines]);

  const simColor = similarity >= 70 ? '#22c55e' : similarity >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.titleRow}>
          <div style={s.iconBox}>⚖️</div>
          <div>
            <h1 style={s.title}>Prompt Diff</h1>
            <p style={s.sub}>Side-by-side line diff with Jaccard similarity — Day 16</p>
          </div>
        </div>
      </div>

      {/* Config panels */}
      <div style={s.configRow}>
        {/* Panel A */}
        <div style={s.panelConfig}>
          <div style={s.labelRow}>
            <span style={{ ...s.label, color: '#818cf8' }}>◀ Panel A</span>
          </div>
          <select style={s.select} value={promptSelA} onChange={handlePromptSelA}>
            <option value="">— Load from saved prompts —</option>
            {prompts.slice(0, 200).map(p => (
              <option key={p.id} value={p.id}>
                {(p.title || p.name || p.id || '').slice(0, 60)}
              </option>
            ))}
          </select>
          <textarea
            style={{ ...s.textarea, fontFamily: fontStyle }}
            value={textA}
            onChange={e => setTextA(e.target.value)}
            placeholder="Type or paste text for Panel A…"
          />
        </div>

        {/* Panel B */}
        <div style={s.panelConfig}>
          <div style={s.labelRow}>
            <span style={{ ...s.label, color: '#34d399' }}>Panel B ▶</span>
          </div>
          <select style={s.select} value={promptSelB} onChange={handlePromptSelB}>
            <option value="">— Load from saved prompts —</option>
            {prompts.slice(0, 200).map(p => (
              <option key={p.id} value={p.id}>
                {(p.title || p.name || p.id || '').slice(0, 60)}
              </option>
            ))}
          </select>
          <textarea
            style={{ ...s.textarea, fontFamily: fontStyle }}
            value={textB}
            onChange={e => setTextB(e.target.value)}
            placeholder="Type or paste text for Panel B…"
          />
        </div>
      </div>


      {/* Toolbar */}
      <div style={s.toolbar}>
        <button style={s.btn('default')} onClick={handleSwap} title="Swap A and B">
          ⇄ Swap A / B
        </button>
        <button style={s.btn('teal')} onClick={copyDiff} title="Copy diff as Markdown">
          {copied ? '✓ Copied!' : '⎘ Copy Diff (MD)'}
        </button>
        <button
          style={s.btn('default')}
          onClick={() => { setTextA(''); setTextB(''); setPromptSelA(''); setPromptSelB(''); }}
        >
          ✕ Clear
        </button>

        {/* Feature 38: Word-level vs character-level difference highlighting toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1e293b', borderRadius: 8, padding: 3, border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', padding: '0 4px', fontWeight: 'bold' }}>Diff Mode</span>
          {['line', 'word', 'char'].map(m => (
            <button
              key={m}
              onClick={() => setDiffMode(m)}
              style={{
                background: diffMode === m ? 'var(--gold, #f5b731)' : 'transparent',
                color: diffMode === m ? '#000' : '#e2e8f0',
                border: 'none', borderRadius: 6, fontSize: '0.72rem', padding: '3px 8px',
                cursor: 'pointer', fontWeight: 700, textTransform: 'capitalize'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Feature 39: Editor custom monospace font chooser */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Font</span>
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
            style={{
              padding: '4px 8px', borderRadius: 8, border: '1px solid #334155',
              background: '#1e293b', color: '#e2e8f0', fontFamily: 'sans-serif',
              fontSize: '0.72rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="DM Mono">DM Mono</option>
            <option value="Fira Code">Fira Code</option>
            <option value="Courier">Courier</option>
            <option value="Monospace">Monospace</option>
          </select>
        </div>

        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#475569' }}>
          {changedLines} changed line{changedLines !== 1 ? 's' : ''} · {diff.length} total
        </span>
      </div>

      {/* Stats row */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#818cf8' }}>{charsA.toLocaleString()}</div>
          <div style={s.statLabel}>Chars A</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#34d399' }}>{charsB.toLocaleString()}</div>
          <div style={s.statLabel}>Chars B</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#818cf8' }}>{wordsA.toLocaleString()}</div>
          <div style={s.statLabel}>Words A</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#34d399' }}>{wordsB.toLocaleString()}</div>
          <div style={s.statLabel}>Words B</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#818cf8' }}>{linesA}</div>
          <div style={s.statLabel}>Lines A</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: '#34d399' }}>{linesB}</div>
          <div style={s.statLabel}>Lines B</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statVal, color: simColor }}>{similarity}%</div>
          <div style={s.statLabel}>Similarity</div>
          <div style={s.similarityBar(similarity)} />
        </div>
      </div>

      {/* Legend */}
      <div style={s.legend}>
        <span>
          <span style={s.legendDot('#22c55e', 'rgba(34,197,94,0.18)')} />
          Added / only in B
        </span>
        <span>
          <span style={s.legendDot('#ef4444', 'rgba(239,68,68,0.18)')} />
          Removed / only in A
        </span>
        <span>
          <span style={s.legendDot('#475569', 'transparent')} />
          Unchanged
        </span>
      </div>

      {/* Diff view */}
      <div style={s.diffGrid}>
        {/* Left column header */}
        <div style={s.diffHeader('#818cf8')}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
          Panel A
        </div>
        {/* Right column header */}
        <div style={{ ...s.diffHeader('#34d399'), borderLeft: '1px solid #1e293b' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          Panel B
        </div>

        {/* Left body */}
        <div style={{ ...s.diffBody, fontFamily: fontStyle }}>
          {diff.map(({ lineNum, aLine, bLine, changed }) => {
            const state = !changed ? 'same' : aLine === null ? 'empty' : 'removed';
            return (
              <div key={`a-${lineNum}`} style={s.diffRow(state)}>
                <div style={s.lineNum}>{lineNum}</div>
                {aLine !== null
                  ? (
                    <div style={{ ...s.lineText(state), fontFamily: fontStyle }}>
                      {state === 'removed' && diffMode === 'word' ? highlightWords(aLine, bLine, 'removed') :
                       state === 'removed' && diffMode === 'char' ? highlightChars(aLine, bLine, 'removed') :
                       aLine || ' '}
                    </div>
                  )
                  : <div style={s.emptyLine}>·</div>
                }
              </div>
            );
          })}
          {diff.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#334155', fontSize: '0.8rem' }}>
              Type something in Panel A to see the diff
            </div>
          )}
        </div>

        {/* Right body */}
        <div style={{ ...s.diffBody, borderLeft: '1px solid #1e293b', fontFamily: fontStyle }}>
          {diff.map(({ lineNum, aLine, bLine, changed }) => {
            const state = !changed ? 'same' : bLine === null ? 'empty' : 'added';
            return (
              <div key={`b-${lineNum}`} style={s.diffRow(state)}>
                <div style={s.lineNum}>{lineNum}</div>
                {bLine !== null
                  ? (
                    <div style={{ ...s.lineText(state), fontFamily: fontStyle }}>
                      {state === 'added' && diffMode === 'word' ? highlightWords(aLine, bLine, 'added') :
                       state === 'added' && diffMode === 'char' ? highlightChars(aLine, bLine, 'added') :
                       bLine || ' '}
                    </div>
                  )
                  : <div style={s.emptyLine}>·</div>
                }
              </div>
            );
          })}
          {diff.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#334155', fontSize: '0.8rem' }}>
              Type something in Panel B to see the diff
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
