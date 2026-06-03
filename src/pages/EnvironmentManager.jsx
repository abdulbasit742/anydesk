import { useState } from 'react';

const environments = [
  { id: 'prod', label: 'Production', color: '#ef4444', health: 'healthy', region: 'us-east-1' },
  { id: 'staging', label: 'Staging', color: '#f5b731', health: 'healthy', region: 'us-east-1' },
  { id: 'dev', label: 'Development', color: '#22d3ee', health: 'degraded', region: 'us-west-2' },
  { id: 'preview', label: 'Preview', color: '#a78bfa', health: 'healthy', region: 'eu-west-1' },
];

const defaultVars = {
  prod: [
    { key: 'DATABASE_URL', value: 'postgresql://prod-db:5432/app', secret: true },
    { key: 'API_KEY', value: 'pk_live_xxxxxxxxxxxx', secret: true },
    { key: 'LOG_LEVEL', value: 'warn', secret: false },
    { key: 'CACHE_TTL', value: '3600', secret: false },
  ],
  staging: [
    { key: 'DATABASE_URL', value: 'postgresql://staging-db:5432/app', secret: true },
    { key: 'API_KEY', value: 'pk_test_xxxxxxxxxxxx', secret: true },
    { key: 'LOG_LEVEL', value: 'info', secret: false },
    { key: 'CACHE_TTL', value: '300', secret: false },
  ],
  dev: [
    { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/app', secret: false },
    { key: 'API_KEY', value: 'pk_dev_local', secret: false },
    { key: 'LOG_LEVEL', value: 'debug', secret: false },
    { key: 'CACHE_TTL', value: '60', secret: false },
  ],
  preview: [
    { key: 'DATABASE_URL', value: 'postgresql://preview-db:5432/app', secret: true },
    { key: 'API_KEY', value: 'pk_preview_xxxx', secret: true },
    { key: 'LOG_LEVEL', value: 'info', secret: false },
  ],
};

const healthColor = { healthy: '#22d3ee', degraded: '#f5b731', down: '#ef4444' };

export default function EnvironmentManager() {
  const [selectedEnv, setSelectedEnv] = useState('prod');
  const [vars, setVars] = useState(defaultVars);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newSecret, setNewSecret] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffEnv, setDiffEnv] = useState('staging');

  const currentVars = vars[selectedEnv] || [];
  const env = environments.find(e => e.id === selectedEnv);

  const toggleReveal = (key) => setRevealedKeys(r => ({ ...r, [key]: !r[key] }));

  const addVar = () => {
    if (!newKey) return;
    setVars(v => ({ ...v, [selectedEnv]: [...(v[selectedEnv] || []), { key: newKey, value: newValue, secret: newSecret }] }));
    setNewKey(''); setNewValue(''); setNewSecret(false);
  };

  const removeVar = (key) => setVars(v => ({ ...v, [selectedEnv]: v[selectedEnv].filter(x => x.key !== key) }));

  const diffVars = vars[diffEnv] || [];

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 55%, #1e0e0e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🌐</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #60a5fa, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Environment Manager</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Centralized environment configuration, secrets, and deployment variable management</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['Environments', '4', '#60a5fa'], ['Total Vars', '15', '#22d3ee'], ['Secrets', '7', '#ef4444'], ['Healthy', '3/4', '#a78bfa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>⬆ Import .env</button>
            <button style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>↻ Sync Remote</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Env List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {environments.map(e => (
            <div key={e.id} onClick={() => setSelectedEnv(e.id)} style={{ background: selectedEnv === e.id ? 'rgba(255,255,255,0.07)' : 'var(--surface2)', border: `1px solid ${selectedEnv === e.id ? e.color + '55' : 'var(--border)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>{e.label}</span>
              </div>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 4 }}>{e.region}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: healthColor[e.health] }} />
                <span style={{ color: healthColor[e.health] }}>{e.health}</span>
              </div>
            </div>
          ))}
          <button onClick={() => setShowDiff(!showDiff)} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 12, marginTop: 8 }}>⇄ Diff Environments</button>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Vars Table */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                {env?.label} Variables
                <span style={{ marginLeft: 10, width: 8, height: 8, borderRadius: '50%', background: env?.color, display: 'inline-block' }} />
              </h2>
              <select onChange={e => setSelectedEnv(e.target.value)} value={selectedEnv} style={{ display: 'none' }} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>{['Key', 'Value', 'Secret', 'Actions'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {currentVars.map(v => (
                  <tr key={v.key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#60a5fa', fontWeight: 600 }}>{v.key}</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#e2e8f0', maxWidth: 280 }}>
                      {v.secret && !revealedKeys[v.key] ? '••••••••••••' : v.value}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {v.secret && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🔒 Secret</span>}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {v.secret && <button onClick={() => toggleReveal(v.key)} style={{ background: 'transparent', border: '1px solid var(--border)', color: '#6e7191', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>{revealedKeys[v.key] ? '🙈' : '👁'}</button>}
                        <button onClick={() => removeVar(v.key)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Var */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center', background: 'var(--surface3)', borderRadius: 10, padding: 12 }}>
              <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="KEY" style={{ flex: 1, background: '#0a0a12', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13 }} />
              <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="value" style={{ flex: 2, background: '#0a0a12', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#6e7191', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={newSecret} onChange={e => setNewSecret(e.target.checked)} style={{ accentColor: '#ef4444' }} />Secret
              </label>
              <button onClick={addVar} style={{ background: 'linear-gradient(90deg, #1d4ed8, #1e40af)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>+ Add</button>
            </div>
          </div>

          {/* Diff View */}
          {showDiff && (
            <div style={{ background: 'var(--surface2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Environment Diff: <span style={{ color: env?.color }}>{env?.label}</span> vs <span style={{ color: '#a78bfa' }}>{environments.find(e => e.id === diffEnv)?.label}</span></h2>
                <select value={diffEnv} onChange={e => setDiffEnv(e.target.value)} style={{ background: 'var(--surface3)', color: '#e2e8f0', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px' }}>
                  {environments.filter(e => e.id !== selectedEnv).map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                </select>
              </div>
              {currentVars.map(v => {
                const other = diffVars.find(x => x.key === v.key);
                const diff = other && other.value !== v.value;
                return (
                  <div key={v.key} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12 }}>
                    <span style={{ color: '#60a5fa', width: 200, flexShrink: 0 }}>{v.key}</span>
                    <span style={{ color: diff ? '#ef4444' : '#22d3ee', flex: 1 }}>{v.secret ? '••••••' : v.value}</span>
                    <span style={{ color: diff ? '#ef4444' : '#6e7191', flex: 1 }}>{other ? (other.secret ? '••••••' : other.value) : <span style={{ color: '#6e7191' }}>— not set</span>}</span>
                    {diff && <span style={{ color: '#f5b731' }}>⚠ differs</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
