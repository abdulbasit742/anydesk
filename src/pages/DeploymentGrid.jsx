import { useState } from 'react';

const environments = ['Dev', 'Staging', 'Prod'];
const services = ['frontend', 'api', 'worker', 'ml-service', 'gateway'];

const initialGrid = {
  frontend:   { Dev: { version: 'v2.3.2', health: 'healthy', locked: false }, Staging: { version: 'v2.3.1', health: 'healthy', locked: false }, Prod: { version: 'v2.3.0', health: 'healthy', locked: true } },
  api:        { Dev: { version: 'v1.9.4', health: 'healthy', locked: false }, Staging: { version: 'v1.9.3', health: 'degraded', locked: false }, Prod: { version: 'v1.9.2', health: 'healthy', locked: true } },
  worker:     { Dev: { version: 'v0.8.1', health: 'healthy', locked: false }, Staging: { version: 'v0.8.0', health: 'healthy', locked: false }, Prod: { version: 'v0.7.9', health: 'healthy', locked: false } },
  'ml-service': { Dev: { version: 'v3.2.0', health: 'down', locked: false }, Staging: { version: 'v3.1.5', health: 'healthy', locked: false }, Prod: { version: 'v3.1.4', health: 'healthy', locked: true } },
  gateway:    { Dev: { version: 'v1.1.0', health: 'healthy', locked: false }, Staging: { version: 'v1.0.9', health: 'healthy', locked: false }, Prod: { version: 'v1.0.8', health: 'healthy', locked: true } },
};

const healthColor = { healthy: '#22d3ee', degraded: '#f5b731', down: '#ef4444' };
const healthIcon = { healthy: '●', degraded: '●', down: '●' };
const envColors = { Dev: '#60a5fa', Staging: '#f5b731', Prod: '#ef4444' };

const historyByService = {
  frontend: ['v2.3.2 → Dev (2m ago)', 'v2.3.1 → Staging (3h ago)', 'v2.3.0 → Prod (2d ago)'],
  api: ['v1.9.4 → Dev (10m ago)', 'v1.9.3 → Staging (5h ago)', 'v1.9.2 → Prod (3d ago)'],
};

export default function DeploymentGrid() {
  const [grid, setGrid] = useState(initialGrid);
  const [selectedCell, setSelectedCell] = useState(null);
  const [calendarView, setCalendarView] = useState(false);
  const [promoting, setPromoting] = useState(null);

  const promote = (service, fromEnv) => {
    const toEnv = fromEnv === 'Dev' ? 'Staging' : 'Prod';
    if (!toEnv) return;
    const key = `${service}-${fromEnv}`;
    setPromoting(key);
    setTimeout(() => {
      setGrid(g => ({
        ...g,
        [service]: {
          ...g[service],
          [toEnv]: { ...g[service][toEnv], version: g[service][fromEnv].version, health: 'healthy' }
        }
      }));
      setPromoting(null);
    }, 1500);
  };

  const rollback = (service, env) => {
    const cur = grid[service][env].version;
    const parts = cur.replace('v', '').split('.').map(Number);
    parts[2] = Math.max(0, parts[2] - 1);
    const prev = 'v' + parts.join('.');
    setGrid(g => ({ ...g, [service]: { ...g[service], [env]: { ...g[service][env], version: prev } } }));
  };

  const toggleLock = (service, env) => {
    setGrid(g => ({ ...g, [service]: { ...g[service], [env]: { ...g[service][env], locked: !g[service][env].locked } } }));
  };

  const schedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const schedSlots = [['gateway', 'Staging', '09:00'], ['frontend', 'Prod', '14:00'], ['api', 'Staging', '10:30']];

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 55%, #1e0e28 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -40, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deployment Grid</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Multi-environment deployment tracking with promote, rollback, and lock controls</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['Services', '5', '#a78bfa'], ['Environments', '3', '#60a5fa'], ['Healthy', '12/15', '#22d3ee'], ['Locked', '4', '#f5b731']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <button onClick={() => setCalendarView(v => !v)} style={{ marginLeft: 'auto', background: calendarView ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${calendarView ? 'rgba(96,165,250,0.4)' : 'var(--border)'}`, color: calendarView ? '#60a5fa' : '#6e7191', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>📅 {calendarView ? 'Grid View' : 'Calendar View'}</button>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {calendarView ? (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Scheduled Deployments — This Week</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {schedDays.map(d => (
                <div key={d} style={{ background: 'var(--surface3)', borderRadius: 10, padding: 12, minHeight: 100 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6e7191', marginBottom: 8, textAlign: 'center' }}>{d}</div>
                  {schedSlots.filter((_, i) => ['Mon', 'Wed', 'Fri'][i % 3] === d).map((s, i) => (
                    <div key={i} style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 6, padding: '4px 6px', marginBottom: 4, fontSize: 10 }}>
                      <div style={{ color: '#a78bfa', fontWeight: 700 }}>{s[0]}</div>
                      <div style={{ color: '#6e7191' }}>{s[1]} @ {s[2]}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            {/* Grid */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface3)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)', width: 120 }}>Service</th>
                    {environments.map(env => (
                      <th key={env} style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: envColors[env], fontWeight: 800 }}>{env}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map(svc => (
                    <tr key={svc} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{svc}</td>
                      {environments.map(env => {
                        const cell = grid[svc][env];
                        const promKey = `${svc}-${env}`;
                        const isPromoting = promoting === promKey;
                        const canPromote = env !== 'Prod' && !cell.locked;
                        return (
                          <td key={env} style={{ padding: '10px 16px', textAlign: 'center' }}>
                            <div onClick={() => setSelectedCell(selectedCell === promKey ? null : promKey)} style={{ background: selectedCell === promKey ? 'rgba(255,255,255,0.07)' : 'var(--surface3)', border: `1px solid ${selectedCell === promKey ? envColors[env] + '55' : 'var(--border)'}`, borderRadius: 10, padding: '10px', cursor: 'pointer', position: 'relative' }}>
                              {cell.locked && <span style={{ position: 'absolute', top: 4, right: 6, fontSize: 10 }}>🔒</span>}
                              <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: envColors[env], marginBottom: 4 }}>{cell.version}</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, color: healthColor[cell.health] }}>
                                <span>{healthIcon[cell.health]}</span>{cell.health}
                              </div>
                              {isPromoting && <div style={{ marginTop: 4, height: 3, background: '#1d1d28', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '60%', background: '#a78bfa', borderRadius: 2, animation: 'slide 1s infinite' }} />
                              </div>}
                            </div>
                            {selectedCell === promKey && (
                              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {canPromote && (
                                  <button onClick={() => promote(svc, env)} disabled={isPromoting} style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: 6, padding: '4px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                                    ↑ Promote to {env === 'Dev' ? 'Staging' : 'Prod'}
                                  </button>
                                )}
                                <button onClick={() => rollback(svc, env)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 6, padding: '4px', cursor: 'pointer', fontSize: 11 }}>↩ Rollback</button>
                                <button onClick={() => toggleLock(svc, env)} style={{ background: cell.locked ? 'rgba(245,183,49,0.08)' : 'rgba(96,165,250,0.08)', border: `1px solid ${cell.locked ? 'rgba(245,183,49,0.3)' : 'rgba(96,165,250,0.3)'}`, color: cell.locked ? '#f5b731' : '#60a5fa', borderRadius: 6, padding: '4px', cursor: 'pointer', fontSize: 11 }}>
                                  {cell.locked ? '🔓 Unlock' : '🔒 Lock'}
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <h2 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Deployment History</h2>
                {['frontend', 'api'].map(svc => (
                  <div key={svc} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 6 }}>{svc}</div>
                    {(historyByService[svc] || []).map((h, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#6e7191', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>{h}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Health Summary</h2>
                {['healthy', 'degraded', 'down'].map(h => {
                  const count = services.flatMap(s => environments.map(e => grid[s][e].health)).filter(x => x === h).length;
                  return (
                    <div key={h} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: healthColor[h] }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: healthColor[h] }} />{h}
                      </span>
                      <span style={{ fontWeight: 700, color: healthColor[h] }}>{count}/15</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
