import { useState } from 'react';

const repos = [
  { id: 1, name: 'org/frontend', branch: 'main', commit: 'a3f9c12', author: 'alice', status: 'passing', ago: '3 min ago', changes: '+124 -38' },
  { id: 2, name: 'org/api-service', branch: 'feat/oauth', commit: 'b8e2d44', author: 'bob', status: 'failing', ago: '18 min ago', changes: '+87 -12' },
  { id: 3, name: 'org/ml-pipeline', branch: 'main', commit: 'c1f4a90', author: 'carol', status: 'passing', ago: '1 hr ago', changes: '+402 -210' },
  { id: 4, name: 'org/mobile-app', branch: 'fix/crash', commit: 'd5b7e33', author: 'dave', status: 'pending', ago: '2 hr ago', changes: '+15 -8' },
];

const prs = [
  { id: '#441', title: 'Add OAuth2 PKCE support', author: 'bob', base: 'main', head: 'feat/oauth', status: 'open', reviews: 2, comments: 7 },
  { id: '#440', title: 'Fix memory leak in worker pool', author: 'alice', base: 'main', head: 'fix/memory', status: 'merged', reviews: 3, comments: 4 },
  { id: '#439', title: 'Update dependencies to latest', author: 'carol', base: 'main', head: 'chore/deps', status: 'closed', reviews: 1, comments: 2 },
  { id: '#438', title: 'Performance optimization for list rendering', author: 'dave', base: 'main', head: 'perf/list', status: 'open', reviews: 0, comments: 1 },
];

const webhookEvents = [
  { event: 'push', repo: 'org/frontend', time: '08:43:12', status: '200' },
  { event: 'pull_request', repo: 'org/api-service', time: '08:22:04', status: '200' },
  { event: 'push', repo: 'org/frontend', time: '07:58:31', status: '200' },
  { event: 'release', repo: 'org/frontend', time: '07:30:00', status: '500' },
];

const commits = [
  { hash: 'a3f9c12', msg: 'fix: resolve auth token race condition', author: 'alice', time: '3m ago' },
  { hash: 'b8e2d44', msg: 'feat: add PKCE flow for OAuth2', author: 'bob', time: '18m ago' },
  { hash: 'c7e1b93', msg: 'chore: bump vite to 5.4.2', author: 'carol', time: '1h ago' },
  { hash: 'd2a0f66', msg: 'fix: crash on empty cart state', author: 'dave', time: '2h ago' },
  { hash: 'e9c4d21', msg: 'refactor: extract payment hook', author: 'alice', time: '4h ago' },
];

const prStatusColor = { open: '#22d3ee', merged: '#a78bfa', closed: '#6e7191' };
const statusColors = { passing: '#22d3ee', failing: '#ef4444', pending: '#f5b731' };

export default function GitIntegration() {
  const [selectedRepo, setSelectedRepo] = useState(1);
  const [search, setSearch] = useState('');
  const [branch1, setBranch1] = useState('main');
  const [branch2, setBranch2] = useState('feat/oauth');

  const filteredCommits = commits.filter(c => !search || c.msg.toLowerCase().includes(search.toLowerCase()) || c.hash.includes(search));

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1420 0%, #16161e 55%, #1a0e1a 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 40, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,183,49,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🔗</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #f5b731, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Git Integration</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Repository hub — commits, PRs, webhooks, and branch management</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['Repos', '4', '#f5b731'], ['Open PRs', '2', '#22d3ee'], ['Commits Today', '14', '#a78bfa'], ['Webhooks', '3', '#60a5fa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['Clone', 'Pull', 'Push'].map(a => (
              <button key={a} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#e2e8f0', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Repos */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Connected Repositories</h2>
          {repos.map(r => (
            <div key={r.id} onClick={() => setSelectedRepo(r.id)} style={{ background: selectedRepo === r.id ? 'rgba(255,255,255,0.06)' : 'transparent', border: `1px solid ${selectedRepo === r.id ? 'rgba(245,183,49,0.3)' : 'var(--border)'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#f5b731' }}>{r.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: statusColors[r.status] }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[r.status] }} />{r.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6e7191' }}>
                <span>🌿 {r.branch}</span>
                <span style={{ fontFamily: 'monospace', color: '#a78bfa' }}>{r.commit}</span>
                <span>👤 {r.author}</span>
                <span style={{ color: '#22d3ee' }}>{r.changes}</span>
              </div>
              <div style={{ fontSize: 11, color: '#6e7191', marginTop: 4 }}>{r.ago}</div>
            </div>
          ))}
        </div>

        {/* PR List */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Pull Requests</h2>
          {prs.map(pr => (
            <div key={pr.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{pr.id} {pr.title}</span>
                <span style={{ background: prStatusColor[pr.status] + '22', color: prStatusColor[pr.status], borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{pr.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#6e7191' }}>
                <span>👤 {pr.author}</span>
                <span>{pr.head} → {pr.base}</span>
                <span>👁 {pr.reviews}</span>
                <span>💬 {pr.comments}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Commit History */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Commit History</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search commits…" style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', color: '#e2e8f0', fontSize: 12, width: 180 }} />
          </div>
          <div style={{ position: 'relative', paddingLeft: 16 }}>
            <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #f5b731, #a78bfa)' }} />
            {filteredCommits.map((c) => (
              <div key={c.hash} style={{ position: 'relative', marginBottom: 14 }}>
                <div style={{ position: 'absolute', left: -13, top: 4, width: 8, height: 8, borderRadius: '50%', background: '#f5b731', border: '2px solid var(--surface2)' }} />
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#a78bfa', marginBottom: 2 }}>{c.hash}</div>
                <div style={{ fontSize: 13, marginBottom: 2 }}>{c.msg}</div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>👤 {c.author} · {c.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks + Branch Compare */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Branch Comparison</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <select value={branch1} onChange={e => setBranch1(e.target.value)} style={{ background: 'var(--surface3)', border: '1px solid var(--border)', color: '#e2e8f0', borderRadius: 8, padding: '6px 10px', fontSize: 12, flex: 1 }}>
                {['main', 'feat/oauth', 'fix/crash', 'perf/list'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <span style={{ color: '#6e7191' }}>←→</span>
              <select value={branch2} onChange={e => setBranch2(e.target.value)} style={{ background: 'var(--surface3)', border: '1px solid var(--border)', color: '#e2e8f0', borderRadius: 8, padding: '6px 10px', fontSize: 12, flex: 1 }}>
                {['feat/oauth', 'main', 'fix/crash', 'perf/list'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ background: 'var(--surface3)', borderRadius: 8, padding: 12, fontSize: 12, display: 'flex', gap: 20 }}>
              <span style={{ color: '#22d3ee' }}>+12 commits ahead</span>
              <span style={{ color: '#ef4444' }}>-3 commits behind</span>
              <span style={{ color: '#f5b731' }}>8 files changed</span>
            </div>
          </div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, flex: 1 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Webhook Events</h2>
            {webhookEvents.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', borderRadius: 6, padding: '2px 8px', fontWeight: 700, width: 100, textAlign: 'center' }}>{w.event}</span>
                <span style={{ color: '#6e7191', flex: 1 }}>{w.repo}</span>
                <span style={{ color: '#6e7191', fontFamily: 'monospace' }}>{w.time}</span>
                <span style={{ color: w.status === '200' ? '#22d3ee' : '#ef4444', fontWeight: 700 }}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
