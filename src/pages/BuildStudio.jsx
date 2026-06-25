import { useState, useEffect, useRef } from 'react';

const stages = [
  { id: 'source', label: 'Source', icon: '⬡', color: '#60a5fa' },
  { id: 'build', label: 'Build', icon: '⚙', color: '#f5b731' },
  { id: 'test', label: 'Test', icon: '✓', color: '#22d3ee' },
  { id: 'deploy', label: 'Deploy', icon: '🚀', color: '#a78bfa' },
];

const recentBuilds = [
  { id: '#1042', branch: 'main', time: '2m 14s', status: 'success', ago: '3 min ago', size: '24.1 MB' },
  { id: '#1041', branch: 'feat/auth', time: '3m 02s', status: 'failed', ago: '18 min ago', size: '23.8 MB' },
  { id: '#1040', branch: 'main', time: '2m 47s', status: 'success', ago: '1 hr ago', size: '24.0 MB' },
  { id: '#1039', branch: 'fix/bug-221', time: '1m 58s', status: 'success', ago: '2 hr ago', size: '23.5 MB' },
  { id: '#1038', branch: 'main', time: '2m 33s', status: 'cancelled', ago: '5 hr ago', size: '—' },
];

const logLines = [
  '[00:00.01] ✓ Cloning repository git@github.com/org/repo.git',
  '[00:00.43] ✓ Checkout branch: main @ a3f9c12',
  '[00:01.20] ✓ Restoring cache (node_modules)...',
  '[00:03.11] ✓ npm install completed (1340 packages)',
  '[00:03.45] ⚙ Running build: vite build --mode production',
  '[00:07.22] ✓ Bundle complete — dist/index.js 412 kB (gzip: 128 kB)',
  '[00:07.50] ⚙ Running tests: vitest run',
  '[00:11.30] ✓ 142/142 tests passed (0 failed)',
  '[00:11.88] ⚙ Deploying to production cluster...',
  '[00:13.10] ✓ Deployment successful. Revision: v2.3.1-prod',
  '[00:13.12] ✓ Health checks passed (3/3)',
  '[00:13.14] 🎉 Build #1042 completed in 2m 14s',
];

const statusColors = { success: '#22d3ee', failed: '#ef4444', running: '#f5b731', cancelled: '#6e7191' };
const statusDot = (s) => ({ width: 8, height: 8, borderRadius: '50%', background: statusColors[s] || '#6e7191', display: 'inline-block', marginRight: 6 });

export default function BuildStudio() {
  const [activeStage, setActiveStage] = useState('build');
  const [stageStatus, setStageStatus] = useState({ source: 'success', build: 'running', test: 'idle', deploy: 'idle' });
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [env, setEnv] = useState('staging');
  const [logVisible, setLogVisible] = useState(true);
  const [shownLogs, setShownLogs] = useState(4);
  const logRef = useRef();

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const triggerBuild = () => {
    setRunning(true);
    setElapsed(0);
    setShownLogs(0);
    setStageStatus({ source: 'running', build: 'idle', test: 'idle', deploy: 'idle' });
    let i = 0;
    const advance = () => {
      setShownLogs(n => n + 1);
      i++;
      if (i < 3) setStageStatus(s => ({ ...s, source: 'running' }));
      else if (i === 3) setStageStatus({ source: 'success', build: 'running', test: 'idle', deploy: 'idle' });
      else if (i === 6) setStageStatus({ source: 'success', build: 'success', test: 'running', deploy: 'idle' });
      else if (i === 9) setStageStatus({ source: 'success', build: 'success', test: 'success', deploy: 'running' });
      else if (i >= 11) { setStageStatus({ source: 'success', build: 'success', test: 'success', deploy: 'success' }); setRunning(false); clearInterval(interval); }
    };
    const interval = setInterval(advance, 600);
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 50%, #1a1028 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🏗</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build Studio</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Visual build pipeline orchestration & monitoring</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['Pipeline Status', running ? '🟡 Running' : '🟢 Idle', '#f5b731'], ['Last Build', '2m 14s', '#22d3ee'], ['Success Rate', '94.3%', '#a78bfa'], ['Artifact Size', '24.1 MB', '#60a5fa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          {/* Pipeline Canvas */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Pipeline Canvas</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select value={env} onChange={e => setEnv(e.target.value)} style={{ background: 'var(--surface3)', color: '#e2e8f0', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}>
                  {['dev', 'staging', 'prod'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button onClick={triggerBuild} disabled={running} style={{ background: running ? '#1d1d28' : 'linear-gradient(90deg, #1d4ed8, #1e40af)', color: running ? '#6e7191' : '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                  {running ? `Running… ${fmtTime(elapsed)}` : '▶ Trigger Build'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {stages.map((stage, i) => {
                const st = stageStatus[stage.id] || 'idle';
                return (
                  <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div onClick={() => setActiveStage(stage.id)} style={{ flex: 1, background: activeStage === stage.id ? 'rgba(255,255,255,0.07)' : 'var(--surface3)', border: `2px solid ${activeStage === stage.id ? stage.color : 'var(--border)'}`, borderRadius: 12, padding: '18px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{stage.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{stage.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12 }}>
                        <span style={{ ...statusDot(st) }} />
                        <span style={{ color: statusColors[st] || '#6e7191', textTransform: 'capitalize' }}>{st}</span>
                      </div>
                    </div>
                    {i < stages.length - 1 && <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg, var(--border), rgba(255,255,255,0.2))', position: 'relative', flexShrink: 0 }}><div style={{ position: 'absolute', right: -4, top: -4, color: '#6e7191', fontSize: 10 }}>▶</div></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Build Logs */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Build Logs</h2>
              <button onClick={() => setLogVisible(v => !v)} style={{ background: 'none', border: '1px solid var(--border)', color: '#6e7191', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>{logVisible ? 'Hide' : 'Show'}</button>
            </div>
            {logVisible && (
              <div ref={logRef} style={{ background: '#0a0a12', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 12, maxHeight: 260, overflowY: 'auto', border: '1px solid var(--border)' }}>
                {logLines.slice(0, shownLogs || logLines.length).map((line, i) => (
                  <div key={i} style={{ color: line.includes('✓') ? '#22d3ee' : line.includes('⚙') ? '#f5b731' : line.includes('🎉') ? '#a78bfa' : '#6e7191', marginBottom: 4 }}>{line}</div>
                ))}
                {running && <div style={{ color: '#f5b731', animation: 'pulse 1s infinite' }}>▌</div>}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Recent Builds */}
        <div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Recent Builds</h2>
            {recentBuilds.map(b => (
              <div key={b.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{b.id}</span>
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: statusColors[b.status] }}>
                    <span style={{ ...statusDot(b.status) }} />{b.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6e7191' }}>
                  <span>🌿 {b.branch}</span><span>⏱ {b.time}</span><span>📦 {b.size}</span>
                </div>
                <div style={{ fontSize: 11, color: '#6e7191' }}>{b.ago}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Artifact Info</h2>
            {[['Latest Size', '24.1 MB'], ['Compressed', '8.3 MB'], ['Type', 'dist bundle'], ['Hash', 'a3f9c12']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: '#6e7191' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
