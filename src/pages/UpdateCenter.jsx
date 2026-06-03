import { useState } from 'react';

const CURRENT_VERSION = { major: 2, minor: 4, patch: 1 };
const UPDATES = [
  { id: 1, package: 'react', current: '18.2.0', latest: '18.3.1', breaking: false, selected: true, changelog: 'Improved concurrent rendering, bug fixes for suspense boundaries.' },
  { id: 2, package: 'vite', current: '4.5.0', latest: '5.1.0', breaking: true, selected: false, changelog: '⚠ Breaking: Node 18+ required. New plugin API, faster cold start.' },
  { id: 3, package: '@tanstack/query', current: '4.36.1', latest: '5.17.0', breaking: true, selected: false, changelog: '⚠ Breaking: Renamed useQuery options. New devtools. Smaller bundle.' },
  { id: 4, package: 'tailwindcss', current: '3.4.0', latest: '3.4.3', breaking: false, selected: true, changelog: 'Bug fixes for JIT, improved arbitrary value support.' },
  { id: 5, package: 'axios', current: '1.6.0', latest: '1.6.7', breaking: false, selected: true, changelog: 'Security patch for CVE-2024-28849, improved error handling.' },
  { id: 6, package: 'typescript', current: '5.2.2', latest: '5.3.3', breaking: false, selected: true, changelog: 'Import attributes, const type params, narrowing improvements.' },
  { id: 7, package: 'eslint', current: '8.56.0', latest: '9.0.0', breaking: true, selected: false, changelog: '⚠ Breaking: New flat config format, dropped Node 14 support.' },
];
const ROLLBACK_LOG = [
  { date: '2026-05-20', packages: ['react@18.2.0', 'vite@4.5.0'], reason: 'Performance regression in prod' },
  { date: '2026-04-10', packages: ['axios@1.5.1'], reason: 'CVE patch caused auth header issue' },
];

export default function UpdateCenter() {
  const [updates, setUpdates] = useState(UPDATES);
  const [changelog, setChangelog] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState([]);
  const [schedule, setSchedule] = useState('manual');
  const [autoPolicy, setAutoPolicy] = useState('patch-only');

  const toggleSelect = (id) => setUpdates(prev => prev.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
  const selected = updates.filter(u => u.selected);

  const runUpdates = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdated(selected.map(u => u.id));
      setUpdates(prev => prev.map(u => u.selected ? { ...u, current: u.latest } : u));
      setUpdating(false);
    }, 3000);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #0e1428 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    btn: (c = '#60a5fa') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }),
    statBadge: (c) => ({ background: c + '18', border: `1px solid ${c}33`, borderRadius: 12, padding: '12px 20px', textAlign: 'center', flex: 1 }),
    updateRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, marginBottom: 8, background: '#1d1d28', border: '1px solid rgba(255,255,255,0.06)' },
    checkbox: (on) => ({ width: 18, height: 18, borderRadius: 4, border: `2px solid ${on ? '#60a5fa' : 'rgba(255,255,255,0.2)'}`, background: on ? '#60a5fa' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
    breakingBadge: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
    select: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, minWidth: 440 },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Update Center</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Manage software updates, changelogs and rollback history</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>v{CURRENT_VERSION.major}.{CURRENT_VERSION.minor}.{CURRENT_VERSION.patch}</div>
            <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>Current Version</div>
          </div>
          <div style={s.statBadge('#f5b731')}><div style={{ fontSize: 22, fontWeight: 800, color: '#f5b731' }}>{updates.length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Available Updates</div></div>
          <div style={s.statBadge('#ef4444')}><div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{updates.filter(u => u.breaking).length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Breaking Changes</div></div>
          <div style={s.statBadge('#22d3ee')}><div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee' }}>{selected.length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Selected</div></div>
          <button style={{ ...s.btn('#60a5fa'), padding: '14px 28px', fontSize: 14, marginLeft: 'auto' }} onClick={runUpdates} disabled={updating || selected.length === 0}>
            {updating ? '⏳ Updating…' : `⬆ Update ${selected.length} Package${selected.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      <div style={s.body}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={s.cardTitle}>Available Updates</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ ...s.btn('#6e7191'), padding: '5px 12px', fontSize: 12 }} onClick={() => setUpdates(prev => prev.map(u => ({ ...u, selected: !u.breaking })))}>Select Safe Only</button>
                  <button style={{ ...s.btn('#6e7191'), padding: '5px 12px', fontSize: 12 }} onClick={() => setUpdates(prev => prev.map(u => ({ ...u, selected: false })))}>Deselect All</button>
                </div>
              </div>
              {updates.map(u => (
                <div key={u.id} style={{ ...s.updateRow, borderColor: updated.includes(u.id) ? '#22d3ee44' : 'rgba(255,255,255,0.06)', background: updated.includes(u.id) ? '#22d3ee08' : '#1d1d28' }}>
                  <div style={s.checkbox(u.selected)} onClick={() => toggleSelect(u.id)}>
                    {u.selected && <span style={{ color: '#fff', fontSize: 13, lineHeight: 1 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{u.package}</span>
                      {u.breaking && <span style={s.breakingBadge}>⚠ BREAKING</span>}
                      {updated.includes(u.id) && <span style={{ background: '#22d3ee22', color: '#22d3ee', border: '1px solid #22d3ee44', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Updated</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#6e7191', marginTop: 3 }}>
                      <span style={{ color: '#ef4444' }}>{u.current}</span> → <span style={{ color: '#22d3ee', fontWeight: 700 }}>{u.latest}</span>
                    </div>
                  </div>
                  <button style={{ ...s.btn('#a78bfa'), padding: '5px 12px', fontSize: 11 }} onClick={() => setChangelog(u)}>Changelog</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 300 }}>
            <div style={s.card}>
              <div style={s.cardTitle}>Auto-Update Policy</div>
              <label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 6 }}>Policy</label>
              <select style={{ ...s.select, width: '100%', marginBottom: 16 }} value={autoPolicy} onChange={e => setAutoPolicy(e.target.value)}>
                {['disabled', 'patch-only', 'minor-safe', 'all-stable'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <label style={{ fontSize: 12, color: '#6e7191', display: 'block', marginBottom: 6 }}>Schedule</label>
              <select style={{ ...s.select, width: '100%', marginBottom: 16 }} value={schedule} onChange={e => setSchedule(e.target.value)}>
                {['manual', 'daily-3am', 'weekly-sunday', 'monthly-1st'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button style={{ ...s.btn('#60a5fa'), width: '100%' }}>Save Policy</button>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>Rollback Log</div>
              {ROLLBACK_LOG.map((r, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 12, color: '#f5b731', fontWeight: 600 }}>{r.date}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{r.packages.join(', ')}</div>
                  <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2, fontStyle: 'italic' }}>{r.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {changelog && (
        <div style={s.modal} onClick={() => setChangelog(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#60a5fa', marginTop: 0, fontFamily: 'monospace' }}>{changelog.package} v{changelog.latest}</h3>
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>{changelog.current} → {changelog.latest}</div>
            {changelog.breaking && <div style={{ background: '#ef444418', border: '1px solid #ef444433', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#ef4444' }}>⚠ Contains breaking changes</div>}
            <div style={{ background: '#1d1d28', borderRadius: 10, padding: 16, fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{changelog.changelog}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button style={s.btn('#60a5fa')} onClick={() => { toggleSelect(changelog.id); setChangelog(null); }}>
                {changelog.selected ? 'Deselect' : 'Select for Update'}
              </button>
              <button style={s.btn('#6e7191')} onClick={() => setChangelog(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
