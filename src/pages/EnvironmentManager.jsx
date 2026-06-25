import { useState } from 'react';
import { store } from '../lib/store';

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
  const [vars, setVars] = useState(() => store.get('env_vars', defaultVars));
  const [revealedKeys, setRevealedKeys] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newSecret, setNewSecret] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffEnv, setDiffEnv] = useState('staging');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [syncing, setSyncing] = useState(false);

  const currentVars = vars[selectedEnv] || [];
  const env = environments.find(e => e.id === selectedEnv);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const toggleReveal = (key) => setRevealedKeys(r => ({ ...r, [key]: !r[key] }));

  const addVar = () => {
    if (!newKey) return;
    const keyFormatted = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (currentVars.some(v => v.key === keyFormatted)) {
      showStatus(`Variable "${keyFormatted}" already exists in ${selectedEnv}.`);
      return;
    }
    const updated = {
      ...vars,
      [selectedEnv]: [...currentVars, { key: keyFormatted, value: newValue.trim(), secret: newSecret }]
    };
    setVars(updated);
    store.set('env_vars', updated);
    store.addEvent('env:var_added', { env: selectedEnv, key: keyFormatted });
    setNewKey('');
    setNewValue('');
    setNewSecret(false);
    showStatus(`Added variable "${keyFormatted}" to ${selectedEnv}.`);
  };

  const removeVar = (key) => {
    const updated = {
      ...vars,
      [selectedEnv]: currentVars.filter(x => x.key !== key)
    };
    setVars(updated);
    store.set('env_vars', updated);
    store.addEvent('env:var_removed', { env: selectedEnv, key });
    showStatus(`Removed variable "${key}" from ${selectedEnv}.`);
  };

  const handleImportEnv = () => {
    const lines = importText.split('\n');
    const updatedVars = [...currentVars];
    let importedCount = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
        const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
        if (key && !updatedVars.some(v => v.key === key)) {
          const isSecret = key.toLowerCase().includes('key') ||
                          key.toLowerCase().includes('secret') ||
                          key.toLowerCase().includes('password') ||
                          key.toLowerCase().includes('token');
          updatedVars.push({ key, value, secret: isSecret });
          importedCount++;
        }
      }
    });

    const nextVars = { ...vars, [selectedEnv]: updatedVars };
    setVars(nextVars);
    store.set('env_vars', nextVars);
    store.addEvent('env:imported', { env: selectedEnv, count: importedCount });
    setShowImportModal(false);
    setImportText('');
    showStatus(`Successfully imported ${importedCount} variables into ${selectedEnv}.`);
  };

  const handleSyncRemote = () => {
    setSyncing(true);
    showStatus('Syncing remote environment variables...');
    setTimeout(() => {
      setSyncing(false);
      store.addEvent('env:synced', { env: selectedEnv });
      showStatus('Environment variables successfully synced with remote vault.');
    }, 1500);
  };

  const diffVars = vars[diffEnv] || [];
  const allDiffKeys = Array.from(new Set([
    ...currentVars.map(v => v.key),
    ...diffVars.map(v => v.key)
  ])).sort();

  // Metrics calculations
  const totalVarsCount = Object.values(vars).reduce((acc, current) => acc + (current?.length || 0), 0);
  const secretsCount = Object.values(vars).reduce((acc, current) => acc + (current?.filter(v => v.secret)?.length || 0), 0);
  const healthyCount = environments.filter(e => e.health === 'healthy').length;

  return (
    <div style={{ background: '#0e0e16', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 55%, #1e0e0e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🌐</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #60a5fa, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Environment Manager</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Centralized environment configuration, secrets, and deployment variable management</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            ['Environments', String(environments.length), '#60a5fa'],
            ['Total Vars', String(totalVarsCount), '#22d3ee'],
            ['Secrets', String(secretsCount), '#ef4444'],
            ['Healthy', `${healthyCount}/${environments.length}`, '#a78bfa']
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={() => setShowImportModal(true)} style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>⬆ Import .env</button>
            <button onClick={handleSyncRemote} disabled={syncing} style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', borderRadius: 8, padding: '8px 16px', cursor: syncing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, opacity: syncing ? 0.6 : 1 }}>
              {syncing ? '⌛ Syncing...' : '↻ Sync Remote'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Env List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {environments.map(e => (
            <div key={e.id} onClick={() => setSelectedEnv(e.id)} style={{ background: selectedEnv === e.id ? 'rgba(255,255,255,0.07)' : '#16161e', border: `1px solid ${selectedEnv === e.id ? e.color + '55' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>
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
          {statusMsg && (
            <div style={{ background: '#16161e', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 10, padding: '12px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>ℹ️</span>
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Vars Table */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                {env?.label} Variables
                <span style={{ marginLeft: 10, width: 8, height: 8, borderRadius: '50%', background: env?.color, display: 'inline-block' }} />
              </h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>{['Key', 'Value', 'Secret', 'Actions'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {currentVars.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px 10px', textAlign: 'center', color: '#6e7191', fontStyle: 'italic' }}>
                      No variables defined in this environment. Click "Import .env" or add below.
                    </td>
                  </tr>
                ) : (
                  currentVars.map(v => (
                    <tr key={v.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#60a5fa', fontWeight: 600 }}>{v.key}</td>
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#e2e8f0', maxWidth: 280, wordBreak: 'break-all' }}>
                        {v.secret && !revealedKeys[v.key] ? '••••••••••••' : v.value}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        {v.secret && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🔒 Secret</span>}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {v.secret && <button onClick={() => toggleReveal(v.key)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6e7191', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>{revealedKeys[v.key] ? '🙈' : '👁'}</button>}
                          <button onClick={() => removeVar(v.key)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Add Var */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center', background: '#1d1d28', borderRadius: 10, padding: 12 }}>
              <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="KEY" style={{ flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13, outline: 'none' }} />
              <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="value" style={{ flex: 2, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13, outline: 'none' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#6e7191', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={newSecret} onChange={e => setNewSecret(e.target.checked)} style={{ accentColor: '#ef4444' }} />Secret
              </label>
              <button onClick={addVar} style={{ background: 'linear-gradient(90deg, #1d4ed8, #1e40af)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>+ Add</button>
            </div>
          </div>

          {/* Diff View */}
          {showDiff && (
            <div style={{ background: '#16161e', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Environment Diff: <span style={{ color: env?.color }}>{env?.label}</span> vs <span style={{ color: '#a78bfa' }}>{environments.find(e => e.id === diffEnv)?.label}</span></h2>
                <select value={diffEnv} onChange={e => setDiffEnv(e.target.value)} style={{ background: '#1d1d28', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 12px', outline: 'none' }}>
                  {environments.filter(e => e.id !== selectedEnv).map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                </select>
              </div>
              {allDiffKeys.length === 0 ? (
                <div style={{ color: '#6e7191', fontStyle: 'italic', fontSize: 12, padding: 8 }}>No variables found in either environment.</div>
              ) : (
                allDiffKeys.map(k => {
                  const v = currentVars.find(x => x.key === k);
                  const other = diffVars.find(x => x.key === k);
                  const diff = (v && other && v.value !== other.value) || (!v && other) || (v && !other);
                  return (
                    <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 12 }}>
                      <span style={{ color: '#60a5fa', width: 200, flexShrink: 0 }}>{k}</span>
                      <span style={{ color: !v ? '#6e7191' : diff ? '#ef4444' : '#22d3ee', flex: 1 }}>
                        {!v ? '— not set' : (v.secret ? '••••••' : v.value)}
                      </span>
                      <span style={{ color: !other ? '#6e7191' : diff ? '#ef4444' : '#6e7191', flex: 1 }}>
                        {!other ? '— not set' : (other.secret ? '••••••' : other.value)}
                      </span>
                      {diff && <span style={{ color: '#f5b731' }}>⚠ differs</span>}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }}>
          <div style={{
            background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
            padding: 24, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#fff', fontWeight: 800 }}>Import .env Variables</h3>
            <p style={{ fontSize: 13, color: '#6e7191', margin: 0, lineHeight: 1.4 }}>
              Paste your `.env` file contents below. Lines starting with `#` are ignored. Keys like `API_KEY` or `SECRET` will be flagged as secrets automatically.
            </p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={"DATABASE_URL=postgresql://localhost:5432\nAPI_KEY=pk_test_123\nLOG_LEVEL=info"}
              style={{
                height: 180, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
                padding: 12, color: '#22d3ee', fontFamily: 'monospace', fontSize: 13, outline: 'none', resize: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => { setShowImportModal(false); setImportText(''); }}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#e2e8f0', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleImportEnv}
                style={{ background: '#60a5fa', color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
