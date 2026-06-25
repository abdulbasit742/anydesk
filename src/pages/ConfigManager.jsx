import { useState } from 'react';
import { store } from '../lib/store';

const NAMESPACES = ['app', 'db', 'cache', 'auth', 'features', 'integrations'];
const CONFIG_DATA = {
  app: [
    { key: 'name', value: 'MyApp', type: 'string', valid: true },
    { key: 'version', value: '2.4.1', type: 'string', valid: true },
    { key: 'debug', value: false, type: 'bool', valid: true },
    { key: 'max_upload_mb', value: 50, type: 'number', valid: true },
    { key: 'allowed_origins', value: '["https://app.io"]', type: 'json', valid: true },
  ],
  db: [
    { key: 'host', value: 'db.internal', type: 'string', valid: true },
    { key: 'port', value: 5432, type: 'number', valid: true },
    { key: 'pool_size', value: 20, type: 'number', valid: true },
    { key: 'ssl_mode', value: 'require', type: 'string', valid: true },
    { key: 'connection_string', value: '***hidden***', type: 'string', valid: false },
  ],
  cache: [
    { key: 'host', value: 'redis.internal', type: 'string', valid: true },
    { key: 'ttl_seconds', value: 3600, type: 'number', valid: true },
    { key: 'max_memory_mb', value: 512, type: 'number', valid: true },
  ],
  auth: [
    { key: 'mfa_required', value: false, type: 'bool', valid: true },
    { key: 'token_ttl_seconds', value: 86400, type: 'number', valid: true },
    { key: 'allowed_providers', value: '["google","github"]', type: 'json', valid: true },
  ],
  features: [
    { key: 'beta_dashboard', value: true, type: 'bool', valid: true },
    { key: 'ai_suggestions', value: false, type: 'bool', valid: true },
    { key: 'dark_mode_default', value: true, type: 'bool', valid: true },
  ],
  integrations: [
    { key: 'slack_webhook', value: 'https://hooks.slack.com/…', type: 'string', valid: true },
    { key: 'github_app_id', value: '12345', type: 'string', valid: true },
    { key: 'sentry_dsn', value: 'https://sentry.io/…', type: 'string', valid: true },
  ],
};

const INITIAL_CHANGE_LOG = [
  { ts: '2026-06-02 07:42', user: 'admin', ns: 'auth', key: 'mfa_required', from: 'true', to: 'false' },
  { ts: '2026-06-01 15:30', user: 'system', ns: 'app', key: 'version', from: '2.4.0', to: '2.4.1' },
  { ts: '2026-06-01 10:00', user: 'alice', ns: 'cache', key: 'ttl_seconds', from: '1800', to: '3600' },
];

const TYPE_COLORS = { string: '#22d3ee', number: '#f5b731', bool: '#a78bfa', json: '#60a5fa' };

export default function ConfigManager() {
  const [activeNs, setActiveNs] = useState('app');
  const [configs, setConfigs] = useState(() => store.get('configs', CONFIG_DATA));
  const [changelog, setChangelog] = useState(() => store.get('config_changelog', INITIAL_CHANGE_LOG));
  const [tab, setTab] = useState('editor');
  const [envOverride, setEnvOverride] = useState('production');
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const currentConfigs = configs[activeNs] || [];

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const startEdit = (cfg) => {
    setEditingKey(cfg.key);
    setEditValue(String(cfg.value));
  };

  const saveEdit = (key) => {
    const originalValue = configs[activeNs].find(c => c.key === key)?.value;
    const finalVal = configs[activeNs].find(c => c.key === key)?.type === 'number' ? +editValue :
                     configs[activeNs].find(c => c.key === key)?.type === 'bool' ? editValue === 'true' : editValue;

    const updated = {
      ...configs,
      [activeNs]: configs[activeNs].map(c => c.key === key ? { ...c, value: finalVal } : c)
    };

    setConfigs(updated);
    store.set('configs', updated);

    // Add changelog entry
    const newLog = {
      ts: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'admin',
      ns: activeNs,
      key,
      from: String(originalValue),
      to: String(finalVal)
    };
    const updatedLogs = [newLog, ...changelog];
    setChangelog(updatedLogs);
    store.set('config_changelog', updatedLogs);

    store.addEvent('config:updated', { namespace: activeNs, key, value: finalVal });
    setEditingKey(null);
    showStatus(`Successfully updated "${key}" in namespace "${activeNs}".`);
  };

  const rollbackConfig = () => {
    const updated = {
      ...configs,
      [activeNs]: CONFIG_DATA[activeNs]
    };
    setConfigs(updated);
    store.set('configs', updated);

    const newLog = {
      ts: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'system',
      ns: activeNs,
      key: 'all',
      from: 'custom',
      to: 'default_rollback'
    };
    const updatedLogs = [newLog, ...changelog];
    setChangelog(updatedLogs);
    store.set('config_changelog', updatedLogs);

    store.addEvent('config:rollback', { namespace: activeNs });
    showStatus(`Rolled back namespace "${activeNs}" to default configurations.`);
  };

  const exportJSON = () => {
    const out = Object.fromEntries(currentConfigs.map(c => [c.key, c.value]));
    navigator.clipboard.writeText(JSON.stringify(out, null, 2));
    showStatus(`Copied namespace "${activeNs}" configurations to clipboard as JSON.`);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #141028 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
    nsItem: (active) => ({ padding: '10px 16px', borderRadius: 8, cursor: 'pointer', background: active ? '#60a5fa22' : 'transparent', color: active ? '#60a5fa' : '#9ca3af', fontWeight: active ? 700 : 400, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, border: `1px solid ${active ? '#60a5fa44' : 'transparent'}` }),
    tabBtn: (active) => ({ background: active ? '#60a5fa22' : 'transparent', border: `1px solid ${active ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`, color: active ? '#60a5fa' : '#6e7191', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    btn: (c = '#60a5fa') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }),
    typeBadge: (t) => ({ background: TYPE_COLORS[t] + '22', color: TYPE_COLORS[t], border: `1px solid ${TYPE_COLORS[t]}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }),
    select: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 13, outline: 'none' },
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#22d3ee', borderRadius: 6, padding: '5px 10px', fontSize: 13, outline: 'none', flex: 1, fontFamily: 'monospace' },
    configRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    validDot: (v) => ({ width: 8, height: 8, borderRadius: '50%', background: v ? '#22d3ee' : '#ef4444', flexShrink: 0 }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Config Manager</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Manage application configuration namespaces, keys and environments</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 16px', fontSize: 13 }}>
            Env: <select style={{ ...s.select, background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: 700, padding: 0, fontSize: 13 }} value={envOverride} onChange={e => setEnvOverride(e.target.value)}>
              {['production', 'staging', 'development'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <button style={s.btn('#22d3ee')} onClick={exportJSON}>📋 Copy as JSON</button>
          <button style={s.btn('#ef4444')} onClick={rollbackConfig}>↩ Rollback Config</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['editor', 'diff', 'changelog'].map(t => <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Namespaces</div>
          {NAMESPACES.map(ns => {
            const nsConfigs = configs[ns] || [];
            const invalid = nsConfigs.filter(c => !c.valid).length;
            return (
              <div key={ns} style={s.nsItem(ns === activeNs)} onClick={() => setActiveNs(ns)}>
                <span style={{ fontFamily: 'monospace' }}>{ns}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6e7191' }}>{nsConfigs.length}</span>
                {invalid > 0 && <span style={{ fontSize: 10, background: '#ef444422', color: '#ef4444', borderRadius: 4, padding: '1px 5px' }}>{invalid}</span>}
              </div>
            );
          })}
        </div>

        <div>
          {statusMsg && (
            <div style={{ background: '#1d1d28', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>ℹ️</span>
              <span>{statusMsg}</span>
            </div>
          )}

          {tab === 'editor' && (
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>{activeNs}</span>
                <span style={{ fontSize: 12, color: '#6e7191' }}>{currentConfigs.length} keys</span>
              </div>
              {currentConfigs.map(cfg => (
                <div key={cfg.key} style={s.configRow}>
                  <div style={s.validDot(cfg.valid)} title={cfg.valid ? 'Valid' : 'Schema error'} />
                  <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#9ca3af', minWidth: 160 }}>{cfg.key}</span>
                  <span style={s.typeBadge(cfg.type)}>{cfg.type}</span>
                  {editingKey === cfg.key ? (
                    <>
                      <input style={s.input} value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus />
                      <button style={s.btn('#22d3ee')} onClick={() => saveEdit(cfg.key)}>✓</button>
                      <button style={s.btn('#6e7191')} onClick={() => setEditingKey(null)}>✗</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: cfg.type === 'bool' ? (cfg.value ? '#22d3ee' : '#ef4444') : '#e2e8f0' }}>
                        {cfg.type === 'bool' ? (cfg.value ? 'true' : 'false') : String(cfg.value)}
                      </span>
                      <button style={{ ...s.btn('#6e7191'), padding: '4px 10px', fontSize: 11 }} onClick={() => startEdit(cfg)}>Edit</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'diff' && (
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#6e7191', marginBottom: 16 }}>Diff vs Production</div>
              <div style={{ background: '#0e0e16', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12 }}>
                <div style={{ color: '#22d3ee', marginBottom: 6 }}>--- production/{activeNs}</div>
                <div style={{ color: '#a78bfa', marginBottom: 12 }}>+++ staging/{activeNs}</div>
                {currentConfigs.slice(0, 3).map(c => (
                  <div key={c.key}>
                    <div style={{ color: '#ef4444' }}>- {c.key}: {String(c.value)}</div>
                    <div style={{ color: '#22d3ee' }}>+ {c.key}: {String(c.value)} {c.type === 'number' ? '(+5%)' : ''}</div>
                  </div>
                ))}
                <div style={{ color: '#6e7191', marginTop: 10 }}>// {currentConfigs.length - 3} keys unchanged</div>
              </div>
            </div>
          )}

          {tab === 'changelog' && (
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#6e7191', marginBottom: 16 }}>Config Change Log</div>
              {changelog.map((cl, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                  <span style={{ color: '#6e7191', fontFamily: 'monospace', fontSize: 12, minWidth: 140 }}>{cl.ts}</span>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{cl.user}</span>
                  <span style={{ color: '#6e7191' }}>{cl.ns}.{cl.key}</span>
                  <span style={{ color: '#ef4444' }}>{cl.from}</span>
                  <span style={{ color: '#6e7191' }}>→</span>
                  <span style={{ color: '#22d3ee' }}>{cl.to}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
