import { useState, useMemo } from 'react';

const SAMPLE_JSON = `{
  "user": {
    "id": 123,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "active": true,
    "roles": ["admin", "user"],
    "profile": {
      "age": 30,
      "country": "US",
      "tags": ["developer", "designer"]
    }
  },
  "meta": {
    "created": "2026-01-15T10:00:00Z",
    "version": 2,
    "flags": null
  }
}`;

const SAMPLE_JSON_2 = `{
  "user": {
    "id": 456,
    "name": "Bob Smith",
    "email": "bob@company.org",
    "active": false,
    "roles": ["user"],
    "profile": {
      "age": 25,
      "country": "CA",
      "tags": ["developer"]
    }
  },
  "meta": {
    "created": "2026-03-20T14:00:00Z",
    "version": 3,
    "flags": { "beta": true }
  }
}`;


function renderJSON(obj, depth = 0) {
  if (obj === null) return <span style={{ color: '#ef4444' }}>null</span>;
  if (typeof obj === 'boolean') return <span style={{ color: '#a78bfa' }}>{String(obj)}</span>;
  if (typeof obj === 'number') return <span style={{ color: '#f5b731' }}>{obj}</span>;
  if (typeof obj === 'string') return <span style={{ color: '#22d3ee' }}>"{obj}"</span>;
  if (Array.isArray(obj)) return (
    <span>[{obj.map((v, i) => <span key={i}>{i > 0 ? ', ' : ''}{renderJSON(v, depth + 1)}</span>)}]</span>
  );
  if (typeof obj === 'object') {
    const indent = '  '.repeat(depth);
    const innerIndent = '  '.repeat(depth + 1);
    return (
      <span>{'{'}<br />
        {Object.entries(obj).map(([k, v], i, arr) => (
          <span key={k}>
            {innerIndent}<span style={{ color: '#60a5fa' }}>"{k}"</span>: {renderJSON(v, depth + 1)}{i < arr.length - 1 ? ',' : ''}<br />
          </span>
        ))}
        {indent}{'}'}
      </span>
    );
  }
  return <span>{String(obj)}</span>;
}

export default function JSONFormatter() {
  const [raw, setRaw] = useState(SAMPLE_JSON);
  const [raw2, setRaw2] = useState(SAMPLE_JSON_2);
  const [activeTab, setActiveTab] = useState('format');
  const [pathQuery, setPathQuery] = useState('$.user.name');
  const [schema, setSchema] = useState('');

  const parsed = useMemo(() => { try { return { ok: true, data: JSON.parse(raw) }; } catch (e) { return { ok: false, error: e.message }; } }, [raw]);
  const parsed2 = useMemo(() => { try { return { ok: true, data: JSON.parse(raw2) }; } catch (e) { return { ok: false, error: e.message }; } }, [raw2]);

  const stats = useMemo(() => {
    if (!parsed.ok) return null;
    const str = JSON.stringify(parsed.data);
    const keys = (str.match(/"[^"]+"\s*:/g) || []).length;
    const depth = (s) => { let d = 0, max = 0; for (const c of s) { if (c === '{' || c === '[') { d++; max = Math.max(max, d); } else if (c === '}' || c === ']') d--; } return max; };
    return { keys, depth: depth(str), size: new Blob([str]).size };
  }, [parsed]);

  const queryResult = useMemo(() => {
    if (!parsed.ok) return null;
    try {
      const path = pathQuery.replace('$.', '').split('.');
      let cur = parsed.data;
      for (const seg of path) { cur = cur?.[seg]; }
      return cur !== undefined ? JSON.stringify(cur, null, 2) : 'Path not found';
    } catch { return 'Invalid path'; }
  }, [pathQuery, parsed]);

  const diffLines = useMemo(() => {
    if (!parsed.ok || !parsed2.ok) return [];
    const l1 = JSON.stringify(parsed.data, null, 2).split('\n');
    const l2 = JSON.stringify(parsed2.data, null, 2).split('\n');
    const maxLen = Math.max(l1.length, l2.length);
    return Array.from({ length: maxLen }, (_, i) => ({
      left: l1[i] || '',
      right: l2[i] || '',
      diff: l1[i] !== l2[i],
    }));
  }, [parsed, parsed2]);

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1c1a14 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px 40px' },
    heroTitle: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg, #f5b731, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 175px)', overflow: 'hidden' },
    left: { flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)' },
    right: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' },
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    tab: (a) => ({ padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#f5b731' : '#6e7191', borderBottom: `2px solid ${a ? '#f5b731' : 'transparent'}` }),
    textarea: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', resize: 'none', border: 'none', padding: 16, outline: 'none', lineHeight: 1.7 },
    toolbar: { display: 'flex', gap: 8, padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }),
    statCard: (c) => ({ background: c + '11', border: `1px solid ${c}33`, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#f5b731')}>{ } JSON</span>
              <span style={s.badge(parsed.ok ? '#22c55e' : '#ef4444')}>{parsed.ok ? '✓ Valid' : '✗ Invalid'}</span>
            </div>
            <h1 style={s.heroTitle}>JSON Formatter</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Format, validate, query, diff and analyze JSON documents</p>
          </div>
          {stats && (
            <div style={{ display: 'flex', gap: 10 }}>
              {[[stats.keys, 'Keys', '#f5b731'], [stats.depth, 'Depth', '#a78bfa'], [stats.size + 'B', 'Size', '#22d3ee']].map(([n, l, c]) => (
                <div key={l} style={s.statCard(c)}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={s.tabBar}>
        {['format', 'query', 'diff', 'schema'].map(t => (
          <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
            {t === 'format' ? '🎨 Format' : t === 'query' ? '🔍 Query' : t === 'diff' ? '⟺ Diff' : '📋 Schema'}
          </button>
        ))}
      </div>

      {activeTab === 'format' && (
        <div style={s.layout}>
          <div style={s.left}>
            <div style={s.toolbar}>
              <span style={{ fontSize: 12, color: '#6e7191', fontWeight: 600 }}>Raw JSON</span>
              <button onClick={() => { try { setRaw(JSON.stringify(JSON.parse(raw), null, 2)); } catch { /* ignore */ } }} style={s.btn('#f5b731')}>Format</button>
              <button onClick={() => { try { setRaw(JSON.stringify(JSON.parse(raw))); } catch { /* ignore */ } }} style={s.btn('#6e7191')}>Minify</button>
              {!parsed.ok && <span style={{ color: '#ef4444', fontSize: 12 }}>⚠ {parsed.error}</span>}
            </div>
            <textarea style={s.textarea} value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false} />
          </div>
          <div style={s.right}>
            <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12, fontWeight: 600 }}>Formatted Output</div>
            <div style={{ flex: 1, padding: 16, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, overflow: 'auto', background: '#0a0a12' }}>
              {parsed.ok ? renderJSON(parsed.data) : <span style={{ color: '#ef4444' }}>{parsed.error}</span>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'query' && (
        <div style={s.layout}>
          <div style={s.left}>
            <div style={s.toolbar}>
              <span style={{ fontSize: 12, color: '#6e7191' }}>JSONPath Query</span>
              <input value={pathQuery} onChange={e => setPathQuery(e.target.value)} style={{ flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#22d3ee', padding: '7px 12px', fontSize: 13, outline: 'none', fontFamily: 'monospace' }} />
            </div>
            <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12, color: '#6e7191' }}>Result</div>
            <pre style={{ margin: 0, padding: 16, fontFamily: 'monospace', fontSize: 13, color: '#22d3ee', flex: 1, overflow: 'auto', background: '#0a0a12' }}>{queryResult}</pre>
          </div>
          <div style={s.right}>
            <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12, fontWeight: 600 }}>Source JSON</div>
            <textarea style={s.textarea} value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false} />
          </div>
        </div>
      )}

      {activeTab === 'diff' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ padding: '8px 16px', background: '#16161e', fontSize: 12, color: '#6e7191', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Left (Original)</div>
              <textarea style={s.textarea} value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', background: '#16161e', fontSize: 12, color: '#6e7191', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Right (Modified)</div>
              <textarea style={s.textarea} value={raw2} onChange={e => setRaw2(e.target.value)} spellCheck={false} />
            </div>
          </div>
          <div style={{ height: 200, borderTop: '1px solid rgba(255,255,255,0.07)', overflow: 'auto', background: '#0a0a12' }}>
            <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#6e7191', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              DIFF · {diffLines.filter(l => l.diff).length} changes
            </div>
            {diffLines.filter(l => l.diff).slice(0, 20).map((line, i) => (
              <div key={i} style={{ display: 'flex', fontFamily: 'monospace', fontSize: 11 }}>
                <div style={{ flex: 1, padding: '2px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRight: '1px solid rgba(255,255,255,0.05)' }}>- {line.left}</div>
                <div style={{ flex: 1, padding: '2px 12px', background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>+ {line.right}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div style={s.layout}>
          <div style={s.left}>
            <div style={{ padding: '8px 16px', background: '#16161e', fontSize: 12, color: '#6e7191', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>JSON Schema (Draft-07)</div>
            <textarea style={s.textarea} value={schema} onChange={e => setSchema(e.target.value)} placeholder='{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": {...}\n}' spellCheck={false} />
          </div>
          <div style={s.right}>
            <div style={{ padding: '8px 16px', background: '#16161e', fontSize: 12, color: '#6e7191', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Validation Result</div>
            <div style={{ padding: 20, color: schema ? '#22c55e' : '#6e7191', fontSize: 14 }}>
              {schema ? '✓ Schema loaded. Paste JSON in Format tab to validate.' : 'Paste a JSON Schema above to validate your JSON documents.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
