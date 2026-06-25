import { useState } from 'react';

const CATEGORIES = ['All', 'Analytics', 'Security', 'Storage', 'Communication', 'DevOps', 'AI/ML'];
const PLUGINS_DATA = [
  { id: 1, name: 'Prometheus Exporter', version: '2.1.0', author: 'metrics-team', category: 'Analytics', enabled: true, sandboxed: false, deps: ['openmetrics'], conflicts: [] },
  { id: 2, name: 'Vault Secrets', version: '1.4.2', author: 'hashicorp', category: 'Security', enabled: true, sandboxed: true, deps: [], conflicts: [] },
  { id: 3, name: 'S3 Adapter', version: '3.0.1', author: 'aws-oss', category: 'Storage', enabled: false, sandboxed: false, deps: [], conflicts: ['GCS Adapter'] },
  { id: 4, name: 'Slack Notifier', version: '1.2.0', author: 'community', category: 'Communication', enabled: true, sandboxed: true, deps: [], conflicts: [] },
  { id: 5, name: 'GitHub Actions Bridge', version: '0.9.5', author: 'github-team', category: 'DevOps', enabled: true, sandboxed: false, deps: [], conflicts: [] },
  { id: 6, name: 'OpenAI Embeddings', version: '1.0.0', author: 'openai', category: 'AI/ML', enabled: false, sandboxed: true, deps: [], conflicts: [] },
];
const MARKETPLACE = [
  { id: 101, name: 'Elastic APM', version: '2.0.0', author: 'elastic', category: 'Analytics', rating: 4.8, installs: '14k' },
  { id: 102, name: 'Warp Encrypt', version: '1.1.0', author: 'warp-security', category: 'Security', rating: 4.5, installs: '8k' },
  { id: 103, name: 'PlanetScale DB', version: '0.8.0', author: 'planetscale', category: 'Storage', rating: 4.2, installs: '5k' },
  { id: 104, name: 'Discord Alerts', version: '1.0.2', author: 'community', category: 'Communication', rating: 4.0, installs: '11k' },
];

const CAT_COLORS = { Analytics: '#22d3ee', Security: '#ef4444', Storage: '#f5b731', Communication: '#a78bfa', DevOps: '#60a5fa', 'AI/ML': '#34d399' };

export default function PluginManager() {
  const [plugins, setPlugins] = useState(PLUGINS_DATA);
  const [tab, setTab] = useState('installed');
  const [category, setCategory] = useState('All');
  const [configPlugin, setConfigPlugin] = useState(null);
  const [sandboxAll, setSandboxAll] = useState(false);
  const [logPlugin, setLogPlugin] = useState(null);
  const [installing, setInstalling] = useState({});
  const [search, setSearch] = useState('');

  const toggle = (id) => setPlugins(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  const toggleSandbox = (id) => setPlugins(prev => prev.map(p => p.id === id ? { ...p, sandboxed: !p.sandboxed } : p));

  const install = (mp) => {
    setInstalling(i => ({ ...i, [mp.id]: true }));
    setTimeout(() => {
      setInstalling(i => { const n = { ...i }; delete n[mp.id]; return n; });
      setPlugins(prev => [...prev, { id: mp.id, name: mp.name, version: mp.version, author: mp.author, category: mp.category, enabled: false, sandboxed: true, deps: [], conflicts: [] }]);
    }, 2000);
  };

  const filtered = plugins.filter(p => (category === 'All' || p.category === category) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase())));

  const conflicts = plugins.filter(p => p.conflicts.some(c => plugins.find(q => q.name === c && q.enabled) && p.enabled));

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #18101e 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    tabBtn: (active) => ({ background: active ? '#a78bfa22' : 'transparent', border: `1px solid ${active ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`, color: active ? '#a78bfa' : '#6e7191', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    catPill: (active, cat) => ({ background: active ? (CAT_COLORS[cat] || '#a78bfa') + '22' : '#1d1d28', border: `1px solid ${active ? (CAT_COLORS[cat] || '#a78bfa') : 'rgba(255,255,255,0.1)'}`, color: active ? (CAT_COLORS[cat] || '#a78bfa') : '#6e7191', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }),
    btn: (c = '#a78bfa') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }),
    pluginCard: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 },
    toggle: (on) => ({ width: 40, height: 22, borderRadius: 11, background: on ? '#a78bfa' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }),
    toggleThumb: (on) => ({ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: on ? 21 : 3, transition: 'left 0.2s' }),
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, minWidth: 440, maxWidth: 560 },
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
    statBadge: (c) => ({ background: c + '18', border: `1px solid ${c}33`, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Plugin Manager</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Manage, install and configure system plugins and extensions</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          {[{ l: 'Installed', v: plugins.length, c: '#a78bfa' }, { l: 'Enabled', v: plugins.filter(p => p.enabled).length, c: '#22d3ee' }, { l: 'Conflicts', v: conflicts.length, c: '#ef4444' }, { l: 'Sandboxed', v: plugins.filter(p => p.sandboxed).length, c: '#f5b731' }].map(b => (
            <div key={b.l} style={s.statBadge(b.c)}><div style={{ fontSize: 22, fontWeight: 800, color: b.c }}>{b.v}</div><div style={{ fontSize: 11, color: '#6e7191' }}>{b.l}</div></div>
          ))}
          {conflicts.length > 0 && <div style={{ background: '#ef444418', border: '1px solid #ef444433', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>⚠ Conflict: {conflicts.map(c => c.name).join(', ')}</div>}
        </div>
      </div>

      <div style={s.body}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {['installed', 'marketplace', 'dependency-graph'].map(t => <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>{t.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</button>)}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {tab === 'installed' && <button style={s.btn('#22d3ee')} onClick={() => setPlugins(prev => prev.map(p => ({ ...p, sandboxed: !sandboxAll }))) || setSandboxAll(!sandboxAll)}>
              {sandboxAll ? 'Disable' : 'Enable'} Sandbox All
            </button>}
            {tab === 'installed' && <button style={s.btn('#f5b731')}>⬆ Update All</button>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => <button key={cat} style={s.catPill(category === cat, cat)} onClick={() => setCategory(cat)}>{cat}</button>)}
          <input style={{ ...s.input, maxWidth: 220, marginLeft: 'auto' }} placeholder="Search plugins…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {tab === 'installed' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ ...s.pluginCard, borderColor: p.enabled ? (CAT_COLORS[p.category] || '#a78bfa') + '44' : 'rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>v{p.version} · by {p.author}</div>
                    <span style={{ fontSize: 11, background: (CAT_COLORS[p.category] || '#6e7191') + '22', color: CAT_COLORS[p.category] || '#6e7191', borderRadius: 4, padding: '1px 6px', fontWeight: 600, display: 'inline-block', marginTop: 6 }}>{p.category}</span>
                  </div>
                  <div style={s.toggle(p.enabled)} onClick={() => toggle(p.id)}>
                    <div style={s.toggleThumb(p.enabled)} />
                  </div>
                </div>
                {p.deps.length > 0 && <div style={{ marginTop: 10, fontSize: 11, color: '#6e7191' }}>Deps: {p.deps.join(', ')}</div>}
                {p.conflicts.length > 0 && <div style={{ marginTop: 4, fontSize: 11, color: '#ef4444' }}>Conflicts: {p.conflicts.join(', ')}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button style={{ ...s.btn('#a78bfa'), padding: '5px 10px', fontSize: 11 }} onClick={() => setConfigPlugin(p)}>⚙ Config</button>
                  <button style={{ ...s.btn('#22d3ee'), padding: '5px 10px', fontSize: 11 }} onClick={() => setLogPlugin(p)}>📋 Logs</button>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: p.sandboxed ? '#f5b731' : '#6e7191' }}>🔒 Sandbox</span>
                    <div style={{ ...s.toggle(p.sandboxed), width: 32, height: 18, background: p.sandboxed ? '#f5b731' : 'rgba(255,255,255,0.1)' }} onClick={() => toggleSandbox(p.id)}>
                      <div style={{ ...s.toggleThumb(p.sandboxed), width: 12, height: 12, top: 3, left: p.sandboxed ? 17 : 3 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'marketplace' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {MARKETPLACE.filter(m => category === 'All' || m.category === category).map(mp => (
              <div key={mp.id} style={s.pluginCard}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{mp.name}</div>
                <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 6 }}>v{mp.version} · by {mp.author}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, background: (CAT_COLORS[mp.category] || '#6e7191') + '22', color: CAT_COLORS[mp.category] || '#6e7191', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>{mp.category}</span>
                  <span style={{ fontSize: 11, color: '#f5b731' }}>★ {mp.rating}</span>
                  <span style={{ fontSize: 11, color: '#6e7191' }}>{mp.installs} installs</span>
                </div>
                {plugins.find(p => p.id === mp.id) ? (
                  <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600 }}>✓ Installed</span>
                ) : (
                  <button style={s.btn('#a78bfa')} onClick={() => install(mp)} disabled={!!installing[mp.id]}>
                    {installing[mp.id] ? '⏳ Installing…' : '+ Install'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'dependency-graph' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Dependency Graph</div>
            <svg width="100%" height={200} viewBox="0 0 600 200">
              {plugins.filter(p => p.deps.length > 0).map((p, i) => {
                const x1 = 80, y1 = 30 + i * 40, dep = plugins.find(q => q.name === p.deps[0]);
                const y2 = dep ? 30 + plugins.indexOf(dep) * 40 : y1;
                return <line key={p.id} x1={x1 + 120} y1={y1} x2={420} y2={y2} stroke="#a78bfa44" strokeWidth={2} strokeDasharray="4,4" />;
              })}
              {plugins.map((p, i) => (
                <g key={p.id}>
                  <rect x={40} y={18 + i * 40} width={160} height={24} rx={8} fill={p.enabled ? '#a78bfa22' : '#16161e'} stroke={p.enabled ? '#a78bfa88' : 'rgba(255,255,255,0.1)'} />
                  <text x={120} y={34 + i * 40} textAnchor="middle" fill={p.enabled ? '#a78bfa' : '#6e7191'} fontSize={11} fontWeight={600}>{p.name}</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {configPlugin && (
        <div style={s.modal} onClick={() => setConfigPlugin(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#a78bfa', marginTop: 0 }}>{configPlugin.name} — Config</h3>
            {['Endpoint URL', 'API Key', 'Timeout (ms)', 'Max Retries'].map(field => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 4 }}>{field}</label>
                <input style={s.input} placeholder={`Enter ${field}…`} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button style={s.btn('#a78bfa')} onClick={() => setConfigPlugin(null)}>Save Config</button>
              <button style={s.btn('#6e7191')} onClick={() => setConfigPlugin(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {logPlugin && (
        <div style={s.modal} onClick={() => setLogPlugin(null)}>
          <div style={{ ...s.modalBox, minWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#22d3ee', marginTop: 0 }}>{logPlugin.name} — Logs</h3>
            <div style={{ background: '#0e0e16', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, maxHeight: 280, overflowY: 'auto' }}>
              {['[INFO] Plugin initialized', '[DEBUG] Connecting to endpoint', '[INFO] Connection established', '[WARN] Rate limit: 95/100 requests', '[INFO] Request processed in 23ms'].map((l, i) => (
                <div key={i} style={{ color: l.includes('WARN') ? '#f5b731' : l.includes('ERROR') ? '#ef4444' : '#9ca3af', marginBottom: 4 }}>{l}</div>
              ))}
            </div>
            <button style={{ ...s.btn('#6e7191'), marginTop: 16 }} onClick={() => setLogPlugin(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
