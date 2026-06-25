import { useState } from 'react';

const SCHEMA_TYPES = [
  { name: 'Query', fields: ['user(id: ID!): User', 'users(limit: Int): [User]', 'product(id: ID!): Product', 'orders: [Order]'] },
  { name: 'User', fields: ['id: ID!', 'name: String!', 'email: String!', 'createdAt: DateTime', 'orders: [Order]'] },
  { name: 'Product', fields: ['id: ID!', 'title: String!', 'price: Float!', 'sku: String', 'inventory: Int'] },
  { name: 'Order', fields: ['id: ID!', 'total: Float!', 'status: OrderStatus', 'items: [OrderItem]', 'user: User'] },
];

const SAVED_QUERIES = [
  { name: 'Get User', query: 'query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n  }\n}' },
  { name: 'List Users', query: 'query ListUsers {\n  users(limit: 10) {\n    id\n    name\n    email\n  }\n}' },
  { name: 'Get Orders', query: 'query GetOrders {\n  orders {\n    id\n    total\n    status\n  }\n}' },
];

const MOCK_RESPONSE = {
  data: {
    user: {
      id: "u_123",
      name: "Alice Johnson",
      email: "alice@example.com",
      createdAt: "2026-01-15T10:00:00Z",
      orders: [
        { id: "ord_001", total: 149.99, status: "DELIVERED" },
        { id: "ord_002", total: 89.50, status: "SHIPPED" }
      ]
    }
  },
  extensions: { duration: 42, complexity: 7 }
};

export default function GraphQLStudio() {
  const [endpoint, setEndpoint] = useState('https://api.example.com/graphql');
  const [query, setQuery] = useState('query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n    orders {\n      id\n      total\n      status\n    }\n  }\n}');
  const [variables, setVariables] = useState('{\n  "id": "u_123"\n}');
  const [headers, setHeaders] = useState('{\n  "Authorization": "Bearer eyJhbGc..."\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('query');
  const [expandedType, setExpandedType] = useState('Query');
  const [queryHistory, setQueryHistory] = useState(SAVED_QUERIES);
  const [operationName, setOperationName] = useState('GetUser');

  const runQuery = () => {
    setLoading(true);
    setTimeout(() => { setResponse(MOCK_RESPONSE); setLoading(false); setQueryHistory(h => [{ name: operationName || 'Unnamed', query }, ...h.slice(0, 9)]); }, 800);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1a1828 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 40px' },
    heroTitle: { fontSize: 28, fontWeight: 800, background: 'linear-gradient(90deg, #f5b731, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 140px)' },
    sidebar: { width: 240, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0e0e16', overflow: 'auto' },
    center: { flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)' },
    right: { width: 320, display: 'flex', flexDirection: 'column', background: '#0e0e16' },
    sideHead: { padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    typeItem: (exp) => ({ background: exp ? 'rgba(167,139,250,0.08)' : 'transparent', cursor: 'pointer' }),
    typeHeader: { padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#a78bfa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    fieldItem: { padding: '5px 16px 5px 28px', fontSize: 12, fontFamily: 'monospace', color: '#6e7191', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    tabBar: { display: 'flex', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    tab: (a) => ({ padding: '10px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', color: a ? '#f5b731' : '#6e7191', borderBottom: `2px solid ${a ? '#f5b731' : 'transparent'}` }),
    editor: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', resize: 'none', border: 'none', padding: 16, outline: 'none', lineHeight: 1.7 },
    topBar: { display: 'flex', gap: 8, padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
    urlInput: { flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '8px 14px', fontSize: 13, outline: 'none' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }),
    responseBox: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', fontSize: 12, padding: 16, overflow: 'auto', lineHeight: 1.6 },
    histItem: { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 12 },
    opInput: { background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e2e8f0', padding: '6px 10px', fontSize: 12, outline: 'none', width: 140 },
  };

  const colorizeJSON = (obj) => {
    const str = JSON.stringify(obj, null, 2);
    return str.split('\n').map((line, i) => {
      let color = '#e2e8f0';
      if (line.includes('"') && line.includes(':')) color = '#60a5fa';
      else if (line.match(/:\s*"[^"]*"/)) color = '#22d3ee';
      else if (line.match(/:\s*\d/)) color = '#f5b731';
      else if (line.match(/:\s*(true|false)/)) color = '#a78bfa';
      return <div key={i} style={{ color }}>{line}</div>;
    });
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#f5b731')}>⚡ GraphQL</span>
              <span style={s.badge('#a78bfa')}>IDE v1.0</span>
            </div>
            <h1 style={s.heroTitle}>GraphQL Studio</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Explore schemas, write queries, inspect responses</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['4', 'Types', '#a78bfa'], ['3', 'Saved', '#f5b731'], ['42ms', 'Latency', '#22d3ee']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.topBar}>
        <span style={{ fontSize: 12, color: '#6e7191', fontWeight: 600 }}>Endpoint</span>
        <input value={endpoint} onChange={e => setEndpoint(e.target.value)} style={s.urlInput} />
        <span style={{ fontSize: 12, color: '#6e7191' }}>Operation</span>
        <input value={operationName} onChange={e => setOperationName(e.target.value)} style={s.opInput} placeholder="OperationName" />
        <button onClick={runQuery} disabled={loading} style={{ ...s.btn('#f5b731'), opacity: loading ? 0.6 : 1 }}>
          {loading ? '⟳ Running...' : '▶ Run Query'}
        </button>
        <button style={s.btn('#22d3ee')}>💾 Save</button>
      </div>

      <div style={s.layout}>
        <div style={s.sidebar}>
          <div style={s.sideHead}>Schema Explorer</div>
          {SCHEMA_TYPES.map(t => (
            <div key={t.name} style={s.typeItem(expandedType === t.name)}>
              <div style={s.typeHeader} onClick={() => setExpandedType(expandedType === t.name ? null : t.name)}>
                <span>{t.name}</span>
                <span style={{ fontSize: 10, color: '#6e7191' }}>{expandedType === t.name ? '▾' : '▸'}</span>
              </div>
              {expandedType === t.name && t.fields.map((f, i) => (
                <div key={i} style={s.fieldItem}>{f}</div>
              ))}
            </div>
          ))}
          <div style={s.sideHead}>Saved Queries</div>
          {queryHistory.slice(0, 5).map((q, i) => (
            <div key={i} style={s.histItem} onClick={() => setQuery(q.query)}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#f5b731' }}>{q.name}</div>
              <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.query.split('\n')[0]}</div>
            </div>
          ))}
        </div>

        <div style={s.center}>
          <div style={s.tabBar}>
            {['query', 'variables', 'headers'].map(t => (
              <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
                {t === 'query' ? '⌨ Query' : t === 'variables' ? '{ } Variables' : '📋 Headers'}
              </button>
            ))}
          </div>
          {activeTab === 'query' && <textarea style={s.editor} value={query} onChange={e => setQuery(e.target.value)} spellCheck={false} />}
          {activeTab === 'variables' && <textarea style={s.editor} value={variables} onChange={e => setVariables(e.target.value)} spellCheck={false} />}
          {activeTab === 'headers' && <textarea style={s.editor} value={headers} onChange={e => setHeaders(e.target.value)} spellCheck={false} />}
        </div>

        <div style={s.right}>
          <div style={{ padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Response</span>
            {response && (
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ ...s.badge('#22d3ee'), fontSize: 10 }}>200 OK</span>
                <span style={{ ...s.badge('#f5b731'), fontSize: 10 }}>{response.extensions.duration}ms</span>
              </div>
            )}
          </div>
          <div style={s.responseBox}>
            {loading && <div style={{ color: '#f5b731', textAlign: 'center', marginTop: 40 }}>⟳ Executing query...</div>}
            {!loading && !response && <div style={{ color: '#6e7191', textAlign: 'center', marginTop: 40 }}>Run a query to see results</div>}
            {!loading && response && colorizeJSON(response)}
          </div>
        </div>
      </div>
    </div>
  );
}
