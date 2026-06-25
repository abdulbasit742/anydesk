import { useState } from 'react';

const nodes = [
  { id: 'lint', label: 'Lint', x: 40, y: 120, color: '#60a5fa' },
  { id: 'test', label: 'Test', x: 180, y: 120, color: '#22d3ee' },
  { id: 'build', label: 'Build', x: 320, y: 120, color: '#f5b731' },
  { id: 'security', label: 'Security\nScan', x: 460, y: 120, color: '#ef4444' },
  { id: 'deploy', label: 'Deploy', x: 600, y: 120, color: '#a78bfa' },
  { id: 'verify', label: 'Verify', x: 740, y: 120, color: '#22d3ee' },
];

const edges = [
  ['lint', 'test'], ['test', 'build'], ['build', 'security'], ['security', 'deploy'], ['deploy', 'verify'],
];

const nodeStatus = { lint: 'success', test: 'success', build: 'success', security: 'warning', deploy: 'running', verify: 'idle' };
const statusColorsMap = { success: '#22d3ee', failed: '#ef4444', running: '#f5b731', idle: '#6e7191', warning: '#f5b731' };

const pipelineHistory = [
  { run: '#88', trigger: 'push', branch: 'main', duration: '4m 12s', status: 'success', time: '5 min ago' },
  { run: '#87', trigger: 'PR', branch: 'feat/oauth', duration: '3m 58s', status: 'failed', time: '22 min ago' },
  { run: '#86', trigger: 'schedule', branch: 'main', duration: '4m 05s', status: 'success', time: '1 hr ago' },
  { run: '#85', trigger: 'push', branch: 'fix/perf', duration: '4m 31s', status: 'success', time: '3 hr ago' },
];

const nodeLogs = {
  lint: ['✓ ESLint: 0 errors, 3 warnings', '✓ Prettier check passed', '✓ TypeScript strict mode OK'],
  test: ['✓ 312/312 unit tests passed', '✓ 48/48 integration tests passed', '⏱ Duration: 1m 22s'],
  build: ['✓ Vite build completed', '✓ Bundle size: 412 kB', '✓ Tree-shaking applied'],
  security: ['⚠ 1 moderate severity found', '⚠ lodash CVE-2021-23337', '✓ No critical vulnerabilities'],
  deploy: ['⚙ Deploying to k8s cluster...', '⚙ Rolling update in progress (3/5 pods)'],
  verify: ['— Waiting for deployment to complete'],
};

export default function CICDPipeline() {
  const [selectedNode, setSelectedNode] = useState('build');
  const [trigger, setTrigger] = useState('push');

  const getNodePos = (id) => nodes.find(n => n.id === id);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 60%, #160e28 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CI/CD Pipeline</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Visual pipeline DAG manager with real-time execution tracking</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['Active Pipelines', '3', '#f5b731'], ['Success Rate', '91.2%', '#22d3ee'], ['Avg Duration', '4m 08s', '#a78bfa'], ['Runs Today', '24', '#60a5fa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Triggers */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6e7191', fontWeight: 600 }}>TRIGGER:</span>
          {['push', 'PR', 'schedule', 'manual'].map(t => (
            <button key={t} onClick={() => setTrigger(t)} style={{ background: trigger === t ? 'rgba(167,139,250,0.15)' : 'transparent', border: `1px solid ${trigger === t ? '#a78bfa' : 'var(--border)'}`, color: trigger === t ? '#a78bfa' : '#6e7191', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{t}</button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button style={{ background: 'linear-gradient(90deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>▶ Run Pipeline</button>
          </div>
        </div>

        {/* DAG Visualization */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Pipeline DAG</h2>
          <div style={{ overflowX: 'auto' }}>
            <svg width="860" height="240" style={{ display: 'block' }}>
              {edges.map(([from, to]) => {
                const f = getNodePos(from); const t2 = getNodePos(to);
                if (!f || !t2) return null;
                const x1 = f.x + 56; const x2 = t2.x;
                const y = 120;
                return <g key={`${from}-${to}`}>
                  <defs><marker id={`arr-${from}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill={nodeStatus[to] === 'idle' ? '#3d3d55' : '#a78bfa'} /></marker></defs>
                  <path d={`M${x1},${y} C${(x1+x2)/2},${y} ${(x1+x2)/2},${y} ${x2},${y}`} stroke={nodeStatus[to] === 'idle' ? '#3d3d55' : '#a78bfa'} strokeWidth="2" fill="none" markerEnd={`url(#arr-${from})`} strokeDasharray={nodeStatus[to] === 'running' ? '6,3' : ''} />
                </g>;
              })}
              {nodes.map(node => {
                const st = nodeStatus[node.id];
                const c = statusColorsMap[st];
                return (
                  <g key={node.id} onClick={() => setSelectedNode(node.id)} style={{ cursor: 'pointer' }}>
                    <rect x={node.x} y={node.y - 36} width="112" height="72" rx="12" fill={selectedNode === node.id ? 'rgba(255,255,255,0.1)' : '#1d1d28'} stroke={selectedNode === node.id ? node.color : '#2d2d40'} strokeWidth="2" />
                    <circle cx={node.x + 96} cy={node.y - 22} r="6" fill={c} />
                    <text x={node.x + 56} y={node.y + 6} textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">{node.label.split('\n')[0]}</text>
                    {node.label.includes('\n') && <text x={node.x + 56} y={node.y + 22} textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">{node.label.split('\n')[1]}</text>}
                    <text x={node.x + 56} y={node.y + 40} textAnchor="middle" fill={c} fontSize="10">{st}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Node Logs */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Stage Logs — <span style={{ color: '#a78bfa' }}>{selectedNode}</span></h2>
            <div style={{ background: '#0a0a12', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 12 }}>
              {(nodeLogs[selectedNode] || []).map((line, i) => (
                <div key={i} style={{ color: line.startsWith('✓') ? '#22d3ee' : line.startsWith('⚠') ? '#f5b731' : line.startsWith('⚙') ? '#60a5fa' : '#6e7191', marginBottom: 6 }}>{line}</div>
              ))}
            </div>
          </div>

          {/* Pipeline History */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Pipeline History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr>{['Run', 'Trigger', 'Branch', 'Duration', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
              <tbody>{pipelineHistory.map(p => (
                <tr key={p.run} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700 }}>{p.run}</td>
                  <td style={{ padding: '10px 8px', color: '#6e7191' }}>{p.trigger}</td>
                  <td style={{ padding: '10px 8px', color: '#60a5fa' }}>🌿 {p.branch}</td>
                  <td style={{ padding: '10px 8px' }}>{p.duration}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ background: p.status === 'success' ? 'rgba(34,211,238,0.12)' : 'rgba(239,68,68,0.12)', color: p.status === 'success' ? '#22d3ee' : '#ef4444', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{p.status}</span>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        {/* Success Rate Chart */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginTop: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Success Rate — Last 14 Runs</h2>
          <svg width="100%" height="80" viewBox="0 0 700 80">
            {[1,1,1,0,1,1,1,1,0,1,1,1,1,1].map((s, i) => (
              <rect key={i} x={i * 50 + 5} y={s ? 10 : 40} width="40" height={s ? 60 : 30} rx="5" fill={s ? 'rgba(34,211,238,0.3)' : 'rgba(239,68,68,0.3)'} stroke={s ? '#22d3ee' : '#ef4444'} strokeWidth="1" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
