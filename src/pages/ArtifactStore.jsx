import { useState } from 'react';

const artifacts = [
  { id: 1, name: 'frontend-dist', version: 'v2.3.1', size: '24.1 MB', type: 'binary', created: '2024-05-28 14:22', checksum: 'sha256:a3f9c12b...', promoted: true },
  { id: 2, name: 'api-docker', version: 'v2.3.1', size: '312 MB', type: 'docker', created: '2024-05-28 14:25', checksum: 'sha256:b8e2d44c...', promoted: true },
  { id: 3, name: 'sdk-npm', version: '1.4.2', size: '2.3 MB', type: 'npm', created: '2024-05-27 09:10', checksum: 'sha256:c1f4a90d...', promoted: false },
  { id: 4, name: 'worker-wasm', version: 'v0.9.1', size: '1.1 MB', type: 'wasm', created: '2024-05-26 16:44', checksum: 'sha256:d5b7e33e...', promoted: false },
  { id: 5, name: 'mobile-binary', version: 'v1.2.0', size: '48.7 MB', type: 'binary', created: '2024-05-25 11:30', checksum: 'sha256:e9c4d21f...', promoted: false },
  { id: 6, name: 'ml-model', version: 'v3.1.0', size: '890 MB', type: 'binary', created: '2024-05-24 08:00', checksum: 'sha256:f1a2b3c4...', promoted: false },
];

const typeColors = { binary: '#60a5fa', docker: '#22d3ee', npm: '#ef4444', wasm: '#a78bfa' };
const typeIcons = { binary: '📦', docker: '🐳', npm: '⬡', wasm: '⚡' };

const usedGB = 1.28; const totalGB = 5;

export default function ArtifactStore() {
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [bulkSelected, setBulkSelected] = useState([]);
  const [retentionDays, setRetentionDays] = useState(30);

  const filtered = artifacts.filter(a => filterType === 'all' || a.type === filterType);
  const sel = artifacts.find(a => a.id === selected);

  const toggleBulk = (id) => setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 55%, #0e1e28 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: 0, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🗃</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Artifact Store</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Build artifact management, promotion pipeline, and retention policies</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['Artifacts', '6', '#60a5fa'], ['In Production', '2', '#22d3ee'], ['Total Size', '1.28 GB', '#f5b731'], ['Types', '4', '#a78bfa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Storage Bar */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Storage Usage</h2>
            <span style={{ fontSize: 13, color: '#6e7191' }}>{usedGB} GB / {totalGB} GB used</span>
          </div>
          <div style={{ background: '#1d1d28', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(usedGB / totalGB) * 100}%`, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', borderRadius: 8, transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12 }}>
            {['binary', 'docker', 'npm', 'wasm'].map(t => (
              <span key={t} style={{ color: typeColors[t] }}>{typeIcons[t]} {t}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Table */}
          <div>
            {/* Filters + Bulk */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {['all', 'binary', 'docker', 'npm', 'wasm'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} style={{ background: filterType === t ? (typeColors[t] || '#e2e8f0') + '22' : 'transparent', border: `1px solid ${filterType === t ? (typeColors[t] || '#e2e8f0') : 'var(--border)'}`, color: filterType === t ? (typeColors[t] || '#e2e8f0') : '#6e7191', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {t !== 'all' && typeIcons[t]} {t}
                </button>
              ))}
              {bulkSelected.length > 0 && (
                <button onClick={() => setBulkSelected([])} style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>🗑 Delete ({bulkSelected.length})</button>
              )}
            </div>

            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface3)' }}>
                    <th style={{ width: 32, padding: '12px 10px' }}></th>
                    {['Name', 'Version', 'Type', 'Size', 'Created', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 10px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} onClick={() => setSelected(a.id)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected === a.id ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                      <td style={{ padding: '12px 10px' }} onClick={e => { e.stopPropagation(); toggleBulk(a.id); }}>
                        <div style={{ width: 16, height: 16, border: `2px solid ${bulkSelected.includes(a.id) ? '#60a5fa' : 'var(--border)'}`, borderRadius: 4, background: bulkSelected.includes(a.id) ? 'rgba(96,165,250,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {bulkSelected.includes(a.id) && <span style={{ color: '#60a5fa', fontSize: 10 }}>✓</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                        {a.name}{a.promoted && <span style={{ marginLeft: 6, background: 'rgba(34,211,238,0.12)', color: '#22d3ee', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>PROD</span>}
                      </td>
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#a78bfa' }}>{a.version}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ background: typeColors[a.type] + '22', color: typeColors[a.type], borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{typeIcons[a.type]} {a.type}</span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#6e7191' }}>{a.size}</td>
                      <td style={{ padding: '12px 10px', color: '#6e7191', fontSize: 12 }}>{a.created}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                          <button style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>⬇ DL</button>
                          {!a.promoted && <button style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>↑ Promote</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail + Retention */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sel ? (
              <div style={{ background: 'var(--surface2)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 14, padding: 20 }}>
                <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{sel.name}</h2>
                {[['Version', sel.version], ['Type', `${typeIcons[sel.type]} ${sel.type}`], ['Size', sel.size], ['Created', sel.created], ['Promoted', sel.promoted ? '✓ Production' : '— Not promoted'], ['Checksum', sel.checksum]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{k}</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#e2e8f0' }}>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, textAlign: 'center', color: '#6e7191', fontSize: 13 }}>Select an artifact to view details</div>
            )}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <h2 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Retention Policy</h2>
              <label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 8 }}>Keep artifacts for (days)</label>
              <input type="range" min={7} max={365} value={retentionDays} onChange={e => setRetentionDays(Number(e.target.value))} style={{ width: '100%', accentColor: '#f5b731', marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f5b731', marginBottom: 12 }}>{retentionDays} days</div>
              <button style={{ width: '100%', background: 'linear-gradient(90deg, #1d4ed8, #1e40af)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Save Policy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
