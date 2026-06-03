import { useState } from 'react';

const SERVICES = [
  { name: 'UserService', methods: ['GetUser', 'ListUsers', 'CreateUser', 'DeleteUser', 'UpdateUser'] },
  { name: 'OrderService', methods: ['GetOrder', 'ListOrders', 'CreateOrder', 'CancelOrder'] },
  { name: 'ProductService', methods: ['GetProduct', 'ListProducts', 'UpdateInventory'] },
  { name: 'NotificationService', methods: ['SendNotification', 'StreamNotifications'] },
];

const SAVED_RPCS = [
  { service: 'UserService', method: 'GetUser', desc: 'Fetch user by ID' },
  { service: 'OrderService', method: 'ListOrders', desc: 'Paginated order listing' },
];

export default function GRPCConsole() {
  const [serviceUrl, setServiceUrl] = useState('grpc://api.example.com:50051');
  const [selectedService, setSelectedService] = useState('UserService');
  const [selectedMethod, setSelectedMethod] = useState('GetUser');
  const [requestJson, setRequestJson] = useState('{\n  "id": "usr_123",\n  "include_orders": true\n}');
  const [metadata, setMetadata] = useState('{\n  "authorization": "Bearer token123",\n  "x-request-id": "req_001"\n}');
  const [response, setResponse] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('request');
  const [tlsEnabled, setTlsEnabled] = useState(true);
  const [streamLog, setStreamLog] = useState([]);
  const [showProto, setShowProto] = useState(false);

  const MOCK_RESPONSES = {
    GetUser: { user: { id: 'usr_123', name: 'Alice Johnson', email: 'alice@example.com', role: 'ADMIN', created_at: '2026-01-15T10:00:00Z' } },
    ListUsers: { users: [{ id: 'usr_1', name: 'Alice' }, { id: 'usr_2', name: 'Bob' }], total: 2, next_page_token: 'tok_abc' },
    GetOrder: { order: { id: 'ord_001', status: 'DELIVERED', total: 149.99, items: 3 } },
    ListOrders: { orders: [{ id: 'ord_001', status: 'DELIVERED' }, { id: 'ord_002', status: 'SHIPPED' }], total: 2 },
    GetProduct: { product: { id: 'prd_001', title: 'Pro Plan', price: 99.00, sku: 'PRO-M' } },
  };

  const invokeRPC = () => {
    setLoading(true);
    setStreamLog([]);
    if (streaming) {
      setLoading(false);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setStreamLog(l => [...l, { seq: count, data: { event: `stream_event_${count}`, ts: new Date().toISOString(), value: Math.random() * 100 | 0 } }]);
        if (count >= 5) { clearInterval(interval); }
      }, 600);
    } else {
      setTimeout(() => {
        const resp = MOCK_RESPONSES[selectedMethod] || { result: 'OK', code: 0, message: 'Success' };
        setResponse({ data: resp, status: 'OK', code: 0, elapsed_ms: Math.floor(Math.random() * 100 + 20) });
        setLoading(false);
      }, 700);
    }
  };


  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 40%, #1e1628 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' },
    heroTitle: { fontSize: 28, fontWeight: 800, background: 'linear-gradient(90deg, #a78bfa, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 170px)' },
    sidebar: { width: 240, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0e0e16', overflow: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    right: { width: 300, borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' },
    topBar: { display: 'flex', gap: 8, padding: '12px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
    urlInput: { flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '8px 14px', fontSize: 13, outline: 'none', fontFamily: 'monospace' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }),
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    tab: (a) => ({ padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#a78bfa' : '#6e7191', borderBottom: `2px solid ${a ? '#a78bfa' : 'transparent'}` }),
    editor: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', resize: 'none', border: 'none', padding: 16, outline: 'none', lineHeight: 1.6 },
    svcItem: (a) => ({ padding: '10px 14px', cursor: 'pointer', background: a ? 'rgba(167,139,250,0.08)' : 'transparent', borderLeft: `3px solid ${a ? '#a78bfa' : 'transparent'}` }),
    methodItem: (a) => ({ padding: '7px 28px', cursor: 'pointer', fontSize: 12, background: a ? 'rgba(167,139,250,0.06)' : 'transparent', color: a ? '#a78bfa' : '#6e7191' }),
    sideHead: { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    toggle: (on) => ({ background: on ? '#a78bfa22' : 'rgba(255,255,255,0.05)', border: `1px solid ${on ? '#a78bfa55' : 'rgba(255,255,255,0.1)'}`, color: on ? '#a78bfa' : '#6e7191', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#a78bfa')}>⚡ gRPC</span>
              <span style={s.badge(tlsEnabled ? '#22d3ee' : '#6e7191')}>{tlsEnabled ? '🔒 TLS' : '⚠ Insecure'}</span>
              {streaming && <span style={s.badge('#f5b731')}>📡 Streaming</span>}
            </div>
            <h1 style={s.heroTitle}>gRPC Console</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Invoke RPCs, browse proto services, inspect streaming responses</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['4', 'Services', '#a78bfa'], ['14', 'Methods', '#22d3ee'], ['2', 'Saved', '#f5b731']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.topBar}>
        <input value={serviceUrl} onChange={e => setServiceUrl(e.target.value)} style={s.urlInput} placeholder="grpc://host:port" />
        <button style={s.toggle(tlsEnabled)} onClick={() => setTlsEnabled(!tlsEnabled)}>{tlsEnabled ? '🔒 TLS' : '🔓 Plain'}</button>
        <button style={s.toggle(streaming)} onClick={() => setStreaming(!streaming)}>📡 {streaming ? 'Stream ON' : 'Unary'}</button>
        <button onClick={invokeRPC} disabled={loading} style={{ ...s.btn('#a78bfa'), opacity: loading ? 0.6 : 1 }}>
          {loading ? '⟳ Invoking...' : '▶ Invoke RPC'}
        </button>
      </div>

      <div style={s.layout}>
        <div style={s.sidebar}>
          <div style={s.sideHead}>Services</div>
          {SERVICES.map(svc => (
            <div key={svc.name}>
              <div style={s.svcItem(selectedService === svc.name)} onClick={() => { setSelectedService(svc.name); setSelectedMethod(svc.methods[0]); }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>⬡ {svc.name}</span>
              </div>
              {selectedService === svc.name && svc.methods.map(m => (
                <div key={m} style={s.methodItem(selectedMethod === m)} onClick={() => setSelectedMethod(m)}>{m}</div>
              ))}
            </div>
          ))}
          <div style={s.sideHead}>Saved RPCs</div>
          {SAVED_RPCS.map((r, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }} onClick={() => { setSelectedService(r.service); setSelectedMethod(r.method); }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>{r.method}</div>
              <div style={{ fontSize: 11, color: '#6e7191' }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={s.main}>
          <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={s.badge('#a78bfa')}>{selectedService}</span>
            <span style={{ color: '#6e7191' }}>/</span>
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{selectedMethod}</span>
            <button onClick={() => setShowProto(!showProto)} style={{ marginLeft: 'auto', ...s.btn('#6e7191'), padding: '4px 10px', fontSize: 11 }}>Proto Def</button>
          </div>
          {showProto && (
            <div style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: 14 }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: '#a78bfa' }}>{`rpc ${selectedMethod}(${selectedMethod}Request) returns (${selectedMethod}Response);`}</pre>
            </div>
          )}
          <div style={s.tabBar}>
            {['request', 'metadata', 'tls'].map(t => <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>{t === 'request' ? '{ } Request' : t === 'metadata' ? '📋 Metadata' : '🔒 TLS Config'}</button>)}
          </div>
          {activeTab === 'request' && <textarea style={s.editor} value={requestJson} onChange={e => setRequestJson(e.target.value)} spellCheck={false} />}
          {activeTab === 'metadata' && <textarea style={s.editor} value={metadata} onChange={e => setMetadata(e.target.value)} spellCheck={false} />}
          {activeTab === 'tls' && (
            <div style={{ padding: 20, flex: 1 }}>
              {[['CA Certificate', 'ca.crt'], ['Client Certificate', 'client.crt'], ['Client Key', 'client.key'], ['Server Name Override', 'api.example.com']].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 4 }}>{label}</div>
                  <input defaultValue={val} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e2e8f0', padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.right}>
          <div style={{ padding: '10px 14px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Response</span>
            {response && <span style={s.badge('#22c55e')}>{response.elapsed_ms}ms</span>}
          </div>
          <div style={{ flex: 1, background: '#0a0a12', padding: 14, overflow: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
            {loading && !streaming && <div style={{ color: '#a78bfa', textAlign: 'center', marginTop: 30 }}>⟳ Invoking RPC...</div>}
            {!loading && !response && !streamLog.length && <div style={{ color: '#6e7191', textAlign: 'center', marginTop: 30 }}>No response yet</div>}
            {streaming && streamLog.length > 0 && (
              <div>
                <div style={{ color: '#f5b731', marginBottom: 8, fontSize: 11 }}>📡 Stream messages ({streamLog.length})</div>
                {streamLog.map((msg, i) => (
                  <div key={i} style={{ background: '#16161e', borderRadius: 6, padding: 8, marginBottom: 6, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ color: '#6e7191', fontSize: 10, marginBottom: 4 }}>SEQ {msg.seq}</div>
                    <pre style={{ margin: 0, color: '#22d3ee', fontSize: 11 }}>{JSON.stringify(msg.data, null, 2)}</pre>
                  </div>
                ))}
              </div>
            )}
            {!streaming && response && (
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span style={s.badge('#22c55e')}>Status: {response.status}</span>
                  <span style={s.badge('#6e7191')}>Code: {response.code}</span>
                </div>
                <pre style={{ margin: 0, color: '#22d3ee', whiteSpace: 'pre-wrap' }}>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
