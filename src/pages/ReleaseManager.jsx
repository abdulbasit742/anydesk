import { useState } from 'react';

const releases = [
  { version: 'v2.3.1', date: '2024-05-28', status: 'latest', type: 'patch', notes: 'Fixed auth token refresh race condition. Updated lodash to 4.17.21.' },
  { version: 'v2.3.0', date: '2024-05-15', status: 'stable', type: 'minor', notes: 'Added OAuth2 PKCE support. New dashboard analytics module. Performance improvements.' },
  { version: 'v2.2.4', date: '2024-04-30', status: 'stable', type: 'patch', notes: 'Security patch for XSS vulnerability in markdown renderer.' },
  { version: 'v2.2.3', date: '2024-04-18', status: 'old', type: 'patch', notes: 'Fixed pagination bug in user list view.' },
  { version: 'v2.2.0', date: '2024-04-01', status: 'old', type: 'minor', notes: 'Major UI overhaul with dark theme. Added real-time notifications.' },
];

const checklist = [
  { id: 'tests', label: 'All tests pass (CI green)', done: true },
  { id: 'docs', label: 'Documentation updated', done: true },
  { id: 'changelog', label: 'Changelog written', done: true },
  { id: 'security', label: 'Security review complete', done: false },
  { id: 'perf', label: 'Performance benchmarks run', done: true },
  { id: 'staging', label: 'Deployed to staging & verified', done: false },
];

const typeColor = { patch: '#22d3ee', minor: '#f5b731', major: '#ef4444' };
const statusColor = { latest: '#a78bfa', stable: '#22d3ee', old: '#6e7191' };

export default function ReleaseManager() {
  const [selectedRelease, setSelectedRelease] = useState(releases[0]);
  const [checks, setChecks] = useState(checklist);
  const [showModal, setShowModal] = useState(false);
  const [newVersion, setNewVersion] = useState('v2.4.0');
  const [notes, setNotes] = useState(selectedRelease.notes);
  const [showDiff, setShowDiff] = useState(false);

  const toggleCheck = (id) => setChecks(cs => cs.map(c => c.id === id ? { ...c, done: !c.done } : c));
  const completed = checks.filter(c => c.done).length;

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1220 0%, #16161e 55%, #1a120e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,183,49,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🏷</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #f5b731, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Release Manager</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Semantic versioning, release notes & deployment lifecycle management</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['Latest', 'v2.3.1', '#a78bfa'], ['Type', 'Patch', '#22d3ee'], ['Checklist', `${completed}/${checks.length}`, '#f5b731'], ['Total Releases', '5', '#60a5fa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <button onClick={() => setShowModal(true)} style={{ marginLeft: 'auto', background: 'linear-gradient(90deg, #b45309, #92400e)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ Create Release</button>
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        {/* Timeline */}
        <div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Release Timeline</h2>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
              {releases.map(r => (
                <div key={r.version} onClick={() => { setSelectedRelease(r); setNotes(r.notes); }} style={{ position: 'relative', marginBottom: 20, cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', left: -16, top: 6, width: 10, height: 10, borderRadius: '50%', background: statusColor[r.status], border: '2px solid var(--surface2)' }} />
                  <div style={{ background: selectedRelease.version === r.version ? 'rgba(255,255,255,0.07)' : 'transparent', borderRadius: 8, padding: '8px 10px', border: `1px solid ${selectedRelease.version === r.version ? 'rgba(255,255,255,0.15)' : 'transparent'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{r.version}</span>
                      <span style={{ background: typeColor[r.type] + '22', color: typeColor[r.type], fontSize: 10, borderRadius: 4, padding: '2px 6px', fontWeight: 700 }}>{r.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#6e7191' }}>{r.date}</div>
                    <div style={{ fontSize: 11, color: statusColor[r.status], marginTop: 2 }}>{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Release Notes Editor */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{selectedRelease.version}</h2>
                <span style={{ background: typeColor[selectedRelease.type] + '22', color: typeColor[selectedRelease.type], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{selectedRelease.type}</span>
                <span style={{ background: statusColor[selectedRelease.status] + '22', color: statusColor[selectedRelease.status], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{selectedRelease.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowDiff(!showDiff)} style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>⇄ Diff View</button>
                <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>↩ Rollback</button>
              </div>
            </div>
            <label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 6 }}>Release Notes (Markdown)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', background: '#0a0a12', border: '1px solid var(--border)', borderRadius: 8, padding: 14, color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13, resize: 'vertical', minHeight: 120, boxSizing: 'border-box' }} />
            {showDiff && (
              <div style={{ background: '#0a0a12', borderRadius: 8, padding: 14, marginTop: 12, fontFamily: 'monospace', fontSize: 12 }}>
                <div style={{ color: '#6e7191', marginBottom: 6 }}>--- v2.3.0 +++ v2.3.1</div>
                <div style={{ color: '#ef4444' }}>- Fixed minor typo in login page</div>
                <div style={{ color: '#22d3ee' }}>+ Fixed auth token refresh race condition</div>
                <div style={{ color: '#22d3ee' }}>+ Updated lodash to 4.17.21</div>
              </div>
            )}
          </div>

          {/* Release Checklist */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Release Checklist</h2>
              <span style={{ color: completed === checks.length ? '#22d3ee' : '#f5b731', fontWeight: 700, fontSize: 13 }}>{completed}/{checks.length} Complete</span>
            </div>
            <div style={{ background: 'var(--surface3)', borderRadius: 8, height: 6, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(completed / checks.length) * 100}%`, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', borderRadius: 8, transition: 'width 0.3s' }} />
            </div>
            {checks.map(c => (
              <div key={c.id} onClick={() => toggleCheck(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${c.done ? '#22d3ee' : 'var(--border)'}`, background: c.done ? 'rgba(34,211,238,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.done && <span style={{ color: '#22d3ee', fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, color: c.done ? '#e2e8f0' : '#6e7191', textDecoration: c.done ? 'none' : 'none' }}>{c.label}</span>
              </div>
            ))}
            <button style={{ marginTop: 16, width: '100%', background: completed === checks.length ? 'linear-gradient(90deg, #065f46, #047857)' : '#1d1d28', color: completed === checks.length ? '#fff' : '#6e7191', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, cursor: completed === checks.length ? 'pointer' : 'not-allowed', fontSize: 14 }}>
              {completed === checks.length ? '🚀 Publish Release' : `Complete ${checks.length - completed} remaining items`}
            </button>
          </div>

          {/* Tag Manager */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Tag Manager</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['v2.3.1', 'v2.3.0', 'latest', 'stable', 'v2.2.4'].map(tag => (
                <div key={tag} style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#a78bfa', fontFamily: 'monospace' }}>{tag}</div>
              ))}
              <button style={{ background: 'rgba(167,139,250,0.1)', border: '1px dashed rgba(167,139,250,0.4)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#a78bfa', cursor: 'pointer' }}>+ Add Tag</button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Release Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: 480 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Create New Release</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 6 }}>Version</label>
                <input value={newVersion} onChange={e => setNewVersion(e.target.value)} style={{ width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 6 }}>Release Type</label>
                <select style={{ width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }}>
                  <option>patch</option><option>minor</option><option>major</option>
                </select></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'var(--surface3)', border: '1px solid var(--border)', color: '#e2e8f0', borderRadius: 8, padding: '10px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'linear-gradient(90deg, #b45309, #92400e)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', fontWeight: 700 }}>Create Release</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
