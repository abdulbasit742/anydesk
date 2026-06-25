import { useState, useEffect } from 'react';

const generateRequests = () => Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  method: ['GET', 'POST', 'PUT', 'DELETE', 'GET', 'GET', 'POST'][i % 7],
  url: ['/api/users', '/api/orders', '/api/products/42', '/api/auth/token', '/api/stats', '/api/logs', '/api/events'][i % 7],
  domain: 'api.example.com',
  status: [200, 201, 404, 401, 200, 200, 500, 304][i % 8],
  size: Math.floor(Math.random() * 50000 + 200),
  time: Math.floor(Math.random() * 800 + 20),
  dns: Math.floor(Math.random() * 30 + 1),
  connect: Math.floor(Math.random() * 40 + 5),
  ssl: Math.floor(Math.random() * 50 + 10),
  reqHeaders: { 'host': 'api.example.com', 'accept': 'application/json', 'authorization': 'Bearer tok...', 'user-agent': 'Mozilla/5.0' },
  respHeaders: { 'content-type': 'application/json', 'x-request-id': `req_${i}`, 'cache-control': 'no-cache', 'server': 'nginx/1.24' },
  reqBody: i % 3 === 1 ? '{"key":"value"}' : null,
  respBody: i % 8 === 6 ? '{"error":"Internal Server Error","code":500}' : '{"data":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2}',
}));

const MC = { GET: '#22d3ee', POST: '#22c55e', PUT: '#f5b731', DELETE: '#ef4444' };
const SC = (s) => s < 300 ? '#22c55e' : s < 400 ? '#60a5fa' : s < 500 ? '#f5b731' : '#ef4444';

export default function HTTPDebugger() {
  const [requests, setRequests] = useState(generateRequests());
  const [selected, setSelected] = useState(null);
  const [respTab, setRespTab] = useState('body');
  const [filter, setFilter] = useState({ method: 'ALL', status: 'ALL', search: '' });


  useEffect(() => {
    const interval = setInterval(() => {
      const newReq = {
        id: Date.now(),
        method: ['GET', 'POST', 'GET'][Math.floor(Math.random() * 3)],
        url: ['/api/health', '/api/metrics', '/api/events/stream'][Math.floor(Math.random() * 3)],
        domain: 'api.example.com',
        status: [200, 200, 200, 201, 404][Math.floor(Math.random() * 5)],
        size: Math.floor(Math.random() * 10000 + 100),
        time: Math.floor(Math.random() * 300 + 20),
        dns: 5, connect: 12, ssl: 20,
        reqHeaders: { host: 'api.example.com', accept: 'application/json' },
        respHeaders: { 'content-type': 'application/json', 'server': 'nginx' },
        reqBody: null,
        respBody: '{"status":"ok","ts":"' + new Date().toISOString() + '"}',
      };
      setRequests(r => [newReq, ...r.slice(0, 49)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = requests.filter(r =>
    (filter.method === 'ALL' || r.method === filter.method) &&
    (filter.status === 'ALL' || (filter.status === '2xx' && r.status < 300) || (filter.status === '4xx' && r.status >= 400 && r.status < 500) || (filter.status === '5xx' && r.status >= 500)) &&
    (r.url.includes(filter.search) || r.domain.includes(filter.search))
  );

  const sel = selected !== null ? requests.find(r => r.id === selected) : null;

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1e1a18 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px 40px' },
    heroTitle: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 165px)' },
    list: { width: 360, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    detail: { flex: 1, display: 'flex', flexDirection: 'column' },
    toolbar: { display: 'flex', gap: 8, padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
    filterSelect: { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e2e8f0', padding: '6px 10px', fontSize: 12, outline: 'none', cursor: 'pointer' },
    searchInput: { flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '7px 12px', fontSize: 12, outline: 'none' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }),
    reqRow: (sel) => ({ display: 'flex', alignItems: 'center', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: sel ? 'rgba(96,165,250,0.1)' : 'transparent', gap: 8 }),
    tab: (a) => ({ padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#60a5fa' : '#6e7191', borderBottom: `2px solid ${a ? '#60a5fa' : 'transparent'}` }),
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    code: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 12, padding: 16, overflow: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#22d3ee' },
    headersGrid: { padding: 16, overflow: 'auto', flex: 1 },
    headerRow: { display: 'flex', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#60a5fa')}>🔍 Debugger</span>
              <span style={{ ...s.badge('#22d3ee'), animation: 'pulse 2s infinite' }}>● Live</span>
            </div>
            <h1 style={s.heroTitle}>HTTP Debugger</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Intercept, inspect and analyze HTTP traffic in real-time</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[[requests.length, 'Captured', '#60a5fa'], [requests.filter(r => r.status >= 400).length, 'Errors', '#ef4444'], [Math.round(requests.reduce((s, r) => s + r.time, 0) / requests.length) + 'ms', 'Avg Time', '#22d3ee']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.toolbar}>
        <input placeholder="Filter by URL or domain..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} style={s.searchInput} />
        <select value={filter.method} onChange={e => setFilter(f => ({ ...f, method: e.target.value }))} style={s.filterSelect}>
          {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} style={s.filterSelect}>
          {['ALL', '2xx', '4xx', '5xx'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setRequests([])} style={s.btn('#ef4444')}>🗑 Clear</button>
        <button style={s.btn('#f5b731')}>⬇ HAR</button>
      </div>

      <div style={s.layout}>
        <div style={s.list}>
          <div style={{ padding: '6px 12px', background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, fontSize: 10, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase' }}>
            <span style={{ width: 48 }}>Method</span><span style={{ width: 36 }}>Status</span><span style={{ flex: 1 }}>URL</span><span style={{ width: 50 }}>Time</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filtered.map(r => (
              <div key={r.id} style={s.reqRow(selected === r.id)} onClick={() => { setSelected(r.id); setRespTab('body'); }}>
                <span style={{ width: 44, fontSize: 10, fontWeight: 700, color: MC[r.method] || '#6e7191' }}>{r.method}</span>
                <span style={{ width: 34, fontSize: 11, fontWeight: 700, color: SC(r.status) }}>{r.status}</span>
                <span style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#e2e8f0' }}>{r.url}</span>
                <span style={{ width: 46, fontSize: 10, color: r.time > 500 ? '#ef4444' : '#6e7191', textAlign: 'right' }}>{r.time}ms</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.detail}>
          {!sel && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e7191', fontSize: 14 }}>Select a request to inspect</div>}
          {sel && (
            <>
              <div style={{ padding: '12px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: MC[sel.method], fontSize: 13 }}>{sel.method}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0' }}>{sel.domain}{sel.url}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <span style={{ ...s.badge(SC(sel.status)), fontSize: 11 }}>{sel.status}</span>
                  <span style={{ ...s.badge('#6e7191'), fontSize: 11 }}>{sel.time}ms</span>
                  <span style={{ ...s.badge('#a78bfa'), fontSize: 11 }}>{(sel.size / 1024).toFixed(1)} KB</span>
                </span>
              </div>
              {/* Waterfall timing */}
              <div style={{ padding: '12px 16px', background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 8, fontWeight: 700 }}>WATERFALL TIMING</div>
                <svg width="100%" height="28">
                  {[['DNS', sel.dns, 0, '#a78bfa'], ['Connect', sel.connect, sel.dns, '#22d3ee'], ['SSL', sel.ssl, sel.dns + sel.connect, '#f5b731'], ['Request', sel.time - sel.dns - sel.connect - sel.ssl, sel.dns + sel.connect + sel.ssl, '#22c55e']].map(([label, dur, start, color]) => {
                    const total = sel.time;
                    const x = (start / total) * 100;
                    const w = (dur / total) * 100;
                    return <g key={label}><rect x={`${x}%`} y="0" width={`${w}%`} height="12" fill={color} rx="2" /><text x={`${x + w / 2}%`} y="26" fill={color} fontSize="9" textAnchor="middle">{label} {dur}ms</text></g>;
                  })}
                </svg>
              </div>
              <div style={s.tabBar}>
                {[['body', 'Response Body'], ['req-headers', 'Request Headers'], ['resp-headers', 'Response Headers'], ['req-body', 'Request Body']].map(([t, label]) => (
                  <button key={t} style={s.tab(respTab === t)} onClick={() => setRespTab(t)}>{label}</button>
                ))}
              </div>
              {respTab === 'body' && <div style={s.code}>{(() => { try { return JSON.stringify(JSON.parse(sel.respBody), null, 2); } catch { return sel.respBody; } })()}</div>}
              {respTab === 'req-body' && <div style={s.code}>{sel.reqBody || '(no request body)'}</div>}
              {(respTab === 'req-headers' || respTab === 'resp-headers') && (
                <div style={s.headersGrid}>
                  {Object.entries(respTab === 'req-headers' ? sel.reqHeaders : sel.respHeaders).map(([k, v]) => (
                    <div key={k} style={s.headerRow}>
                      <span style={{ width: 200, color: '#a78bfa', fontFamily: 'monospace' }}>{k}</span>
                      <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
