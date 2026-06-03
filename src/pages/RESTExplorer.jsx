import { useState } from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const METHOD_COLORS = { GET: '#22d3ee', POST: '#22c55e', PUT: '#f5b731', DELETE: '#ef4444', PATCH: '#a78bfa' };

const HISTORY = [
  { method: 'GET', url: 'https://api.example.com/users', status: 200, time: 142 },
  { method: 'POST', url: 'https://api.example.com/users', status: 201, time: 89 },
  { method: 'DELETE', url: 'https://api.example.com/users/42', status: 404, time: 34 },
  { method: 'GET', url: 'https://api.example.com/products?limit=10', status: 200, time: 201 },
  { method: 'PUT', url: 'https://api.example.com/orders/7', status: 200, time: 167 },
];

const ENVS = { production: 'https://api.example.com', staging: 'https://staging.api.example.com', local: 'http://localhost:3000' };

const MOCK_RESP = {
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'application/json', 'x-request-id': 'req_abc123', 'x-ratelimit-remaining': '99' },
  body: { users: [{ id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' }, { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' }], total: 2, page: 1 }
};

export default function RESTExplorer() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('{{base}}/users');
  const [env, setEnv] = useState('production');
  const [bodyTab, setBodyTab] = useState('none');
  const [reqBody, setReqBody] = useState('{\n  "name": "Alice",\n  "email": "alice@example.com"\n}');
  const [headers, setHeaders] = useState([{ key: 'Authorization', value: 'Bearer token123', enabled: true }, { key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRespTab, setActiveRespTab] = useState('body');
  const [history, setHistory] = useState(HISTORY);
  const [collections] = useState([{ name: 'Users API', count: 5 }, { name: 'Orders API', count: 3 }]);
  const [showCurl, setShowCurl] = useState(false);

  const send = () => {
    setLoading(true);
    const resolvedUrl = url.replace('{{base}}', ENVS[env]);
    setTimeout(() => {
      setResponse(MOCK_RESP);
      setLoading(false);
      setHistory(h => [{ method, url: resolvedUrl, status: MOCK_RESP.status, time: Math.floor(Math.random() * 200 + 50) }, ...h.slice(0, 9)]);
    }, 600);
  };

  const curlCmd = `curl -X ${method} '${url.replace('{{base}}', ENVS[env])}' \\\n  -H 'Authorization: Bearer token123' \\\n  -H 'Content-Type: application/json'${method !== 'GET' ? ` \\\n  -d '${reqBody}'` : ''}`;

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1a2020 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' },
    heroTitle: { fontSize: 28, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 160px)' },
    sidebar: { width: 240, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    topBar: { display: 'flex', padding: '12px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center', gap: 8 },
    methodBtn: (m, active) => ({ background: active ? METHOD_COLORS[m] + '22' : 'transparent', border: `1px solid ${active ? METHOD_COLORS[m] + '66' : 'rgba(255,255,255,0.07)'}`, color: active ? METHOD_COLORS[m] : '#6e7191', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }),
    urlInput: { flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '9px 14px', fontSize: 13, outline: 'none', fontFamily: 'monospace' },
    sendBtn: { background: '#22d3ee22', border: '1px solid #22d3ee44', color: '#22d3ee', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    tab: (a) => ({ padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#22d3ee' : '#6e7191', borderBottom: `2px solid ${a ? '#22d3ee' : 'transparent'}` }),
    editor: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', resize: 'none', border: 'none', padding: 16, outline: 'none', lineHeight: 1.6, minHeight: 120 },
    histItem: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', fontSize: 12 },
    respSection: { flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.07)' },
    statusBadge: (s) => ({ background: s < 300 ? '#22c55e22' : s < 400 ? '#f5b73122' : '#ef444422', color: s < 300 ? '#22c55e' : s < 400 ? '#f5b731' : '#ef4444', border: `1px solid ${s < 300 ? '#22c55e44' : s < 400 ? '#f5b73144' : '#ef444444'}`, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }),
    envSelect: { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f5b731', padding: '6px 10px', fontSize: 12, outline: 'none', cursor: 'pointer' },
    sideHead: { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#22d3ee')}>🌐 REST</span>
              <span style={s.badge('#22c55e')}>API Explorer</span>
            </div>
            <h1 style={s.heroTitle}>REST Explorer</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Test APIs, manage collections, generate cURL commands</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['5', 'History', '#22d3ee'], ['2', 'Collections', '#f5b731'], ['3', 'Envs', '#a78bfa']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.topBar}>
        {METHODS.map(m => <button key={m} style={s.methodBtn(m, method === m)} onClick={() => setMethod(m)}>{m}</button>)}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <select value={env} onChange={e => setEnv(e.target.value)} style={s.envSelect}>
          {Object.keys(ENVS).map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} style={s.urlInput} placeholder="URL or {{base}}/path" />
        <button onClick={send} disabled={loading} style={{ ...s.sendBtn, opacity: loading ? 0.6 : 1 }}>{loading ? '⟳' : '▶ Send'}</button>
        <button onClick={() => setShowCurl(!showCurl)} style={{ ...s.sendBtn, background: '#a78bfa22', borderColor: '#a78bfa44', color: '#a78bfa' }}>cURL</button>
      </div>

      {showCurl && (
        <div style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: 12 }}>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: '#22d3ee', whiteSpace: 'pre-wrap' }}>{curlCmd}</pre>
        </div>
      )}

      <div style={s.layout}>
        <div style={s.sidebar}>
          <div style={s.sideHead}>Request History</div>
          {history.map((h, i) => (
            <div key={i} style={s.histItem} onClick={() => { setMethod(h.method); setUrl(h.url); }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                <span style={{ color: METHOD_COLORS[h.method], fontWeight: 700, fontSize: 11 }}>{h.method}</span>
                <span style={s.statusBadge(h.status)}>{h.status}</span>
                <span style={{ color: '#6e7191', fontSize: 11, marginLeft: 'auto' }}>{h.time}ms</span>
              </div>
              <div style={{ fontSize: 11, color: '#6e7191', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{h.url.replace('https://api.example.com', '…')}</div>
            </div>
          ))}
          <div style={s.sideHead}>Collections</div>
          {collections.map((c, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13 }}>📁 {c.name}</span>
              <span style={s.badge('#6e7191')}>{c.count}</span>
            </div>
          ))}
        </div>

        <div style={s.main}>
          <div style={s.tabBar}>
            {['headers', 'body', 'params'].map(t => <button key={t} style={s.tab(bodyTab === t)} onClick={() => setBodyTab(t)}>{t === 'headers' ? '📋 Headers' : t === 'body' ? '{ } Body' : '⚙ Params'}</button>)}
          </div>
          {bodyTab === 'headers' && (
            <div style={{ padding: 16, flex: 1, overflow: 'auto' }}>
              {headers.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input style={{ flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e2e8f0', padding: '7px 10px', fontSize: 12, outline: 'none' }} value={h.key} onChange={e => setHeaders(hs => hs.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} placeholder="Header name" />
                  <input style={{ flex: 2, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e2e8f0', padding: '7px 10px', fontSize: 12, outline: 'none' }} value={h.value} onChange={e => setHeaders(hs => hs.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="Value" />
                  <input type="checkbox" checked={h.enabled} onChange={e => setHeaders(hs => hs.map((x, j) => j === i ? { ...x, enabled: e.target.checked } : x))} />
                  <button onClick={() => setHeaders(hs => hs.filter((_, j) => j !== i))} style={{ background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>
                </div>
              ))}
              <button onClick={() => setHeaders(h => [...h, { key: '', value: '', enabled: true }])} style={{ background: '#22d3ee22', border: '1px solid #22d3ee44', color: '#22d3ee', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>+ Add Header</button>
            </div>
          )}
          {bodyTab === 'body' && <textarea style={s.editor} value={reqBody} onChange={e => setReqBody(e.target.value)} spellCheck={false} />}
          {bodyTab === 'params' && <div style={{ padding: 16, color: '#6e7191', fontSize: 13 }}>Query params extracted from URL: <span style={{ color: '#f5b731', fontFamily: 'monospace' }}>?limit=10&page=1</span></div>}

          {response && (
            <div style={s.respSection}>
              <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={s.statusBadge(response.status)}>{response.status} {response.statusText}</span>
                <span style={{ ...s.badge('#22d3ee'), fontSize: 10 }}>JSON</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  {['body', 'resp-headers'].map(t => <button key={t} style={s.tab(activeRespTab === t)} onClick={() => setActiveRespTab(t)}>{t === 'body' ? 'Body' : 'Headers'}</button>)}
                </div>
              </div>
              <div style={{ flex: 1, background: '#0a0a12', padding: 16, overflow: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                {activeRespTab === 'body' && <pre style={{ margin: 0, color: '#22d3ee', whiteSpace: 'pre-wrap' }}>{JSON.stringify(response.body, null, 2)}</pre>}
                {activeRespTab === 'resp-headers' && Object.entries(response.headers).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#a78bfa', width: 200 }}>{k}</span>
                    <span style={{ color: '#e2e8f0' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
