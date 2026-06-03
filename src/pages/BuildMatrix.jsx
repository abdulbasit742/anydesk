import { useState } from 'react';

const osRows = ['Linux', 'macOS', 'Windows'];
const nodeVersions = ['18', '20', '22'];

const initialMatrix = {
  Linux: { '18': { status: 'pass', time: '4m 12s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] },
           '20': { status: 'pass', time: '3m 58s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] },
           '22': { status: 'fail', time: '4m 03s', logs: ['✓ npm install', '✗ Test failed: crypto.hash is undefined', '✗ build failed'] } },
  macOS:  { '18': { status: 'pass', time: '5m 01s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] },
            '20': { status: 'pass', time: '4m 42s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] },
            '22': { status: 'flaky', time: '5m 18s', logs: ['✓ npm install', '⚠ 1 flaky test re-ran', '✓ build success'] } },
  Windows:{ '18': { status: 'pass', time: '6m 21s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] },
            '20': { status: 'running', time: '—', logs: ['✓ npm install', '⚙ Running tests...'] },
            '22': { status: 'pass', time: '6m 08s', logs: ['✓ npm install', '✓ tests pass (312)', '✓ build success'] } },
};

const statusConfig = {
  pass:    { color: '#22d3ee', bg: 'rgba(34,211,238,0.08)', icon: '✓', border: 'rgba(34,211,238,0.25)' },
  fail:    { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '✗', border: 'rgba(239,68,68,0.25)' },
  flaky:   { color: '#f5b731', bg: 'rgba(245,183,49,0.08)', icon: '⚡', border: 'rgba(245,183,49,0.25)' },
  running: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', icon: '⚙', border: 'rgba(167,139,250,0.25)' },
  idle:    { color: '#6e7191', bg: 'transparent', icon: '—', border: 'var(--border)' },
};

const osIcons = { Linux: '🐧', macOS: '🍎', Windows: '🪟' };

export default function BuildMatrix() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [expandedCell, setExpandedCell] = useState(null);
  const [filter, setFilter] = useState('all');

  const totalTime = (os) => {
    const times = nodeVersions.map(v => matrix[os][v]?.time).filter(t => t && t !== '—');
    return times.length ? times[times.length - 1] : '—';
  };

  const colTotals = (node) => {
    const times = osRows.map(os => matrix[os][node]?.time).filter(t => t && t !== '—');
    return times.length ? times[times.length - 1] : '—';
  };

  const rerunCell = (os, node) => {
    setMatrix(m => ({ ...m, [os]: { ...m[os], [node]: { ...m[os][node], status: 'running', time: '—' } } }));
    setTimeout(() => {
      setMatrix(m => ({ ...m, [os]: { ...m[os], [node]: { ...m[os][node], status: 'pass', time: '4m 00s' } } }));
    }, 3000);
  };

  const allCells = osRows.flatMap(os => nodeVersions.map(n => matrix[os][n]));
  const passCount = allCells.filter(c => c.status === 'pass').length;
  const failCount = allCells.filter(c => c.status === 'fail').length;
  const flakyCount = allCells.filter(c => c.status === 'flaky').length;

  const shouldShow = (status) => filter === 'all' || filter === status;

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1628 0%, #16161e 55%, #1a1e0e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🔲</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #22d3ee, #f5b731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build Matrix</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Multi-platform, multi-version build matrix with per-cell log drill-down</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['Passing', passCount, '#22d3ee'], ['Failing', failCount, '#ef4444'], ['Flaky', flakyCount, '#f5b731'], ['Running', 1, '#a78bfa']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['all', 'pass', 'fail', 'flaky'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${filter === f ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`, color: filter === f ? '#e2e8f0' : '#6e7191', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Matrix Grid */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 24, overflowX: 'auto' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>Build Matrix — OS × Node.js Version</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ width: 100, padding: '8px 12px', textAlign: 'left', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>OS / Node</th>
                {nodeVersions.map(n => (
                  <th key={n} style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 700 }}>Node {n}</div>
                    <div style={{ fontSize: 11, color: '#6e7191' }}>{colTotals(n)}</div>
                  </th>
                ))}
                <th style={{ padding: '8px 12px', textAlign: 'center', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Slowest</th>
              </tr>
            </thead>
            <tbody>
              {osRows.map(os => (
                <tr key={os} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 700, fontSize: 14 }}>{osIcons[os]} {os}</td>
                  {nodeVersions.map(node => {
                    const cell = matrix[os][node];
                    const cfg = statusConfig[cell.status];
                    if (!shouldShow(cell.status) && cell.status !== 'running') return (
                      <td key={node} style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ opacity: 0.2, background: 'var(--surface3)', borderRadius: 8, padding: '14px 8px', fontSize: 12, color: '#6e7191' }}>—</div>
                      </td>
                    );
                    const isExp = expandedCell === `${os}-${node}`;
                    return (
                      <td key={node} style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'top' }}>
                        <div onClick={() => setExpandedCell(isExp ? null : `${os}-${node}`)} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>{cfg.icon}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', marginBottom: 2 }}>{cell.status}</div>
                          <div style={{ fontSize: 11, color: '#6e7191' }}>{cell.time}</div>
                          {cell.status === 'flaky' && <div style={{ fontSize: 10, color: '#f5b731', marginTop: 3 }}>⚡ flaky</div>}
                        </div>
                        {isExp && (
                          <div style={{ background: '#0a0a12', border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginTop: 6, textAlign: 'left' }}>
                            {cell.logs.map((l, i) => (
                              <div key={i} style={{ fontSize: 10, fontFamily: 'monospace', color: l.startsWith('✓') ? '#22d3ee' : l.startsWith('✗') ? '#ef4444' : l.startsWith('⚠') ? '#f5b731' : '#a78bfa', marginBottom: 3 }}>{l}</div>
                            ))}
                            <button onClick={() => rerunCell(os, node)} style={{ marginTop: 6, width: '100%', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: 6, padding: '4px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>↻ Re-run</button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontSize: 13, color: '#f5b731', fontWeight: 600 }}>{totalTime(os)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Build Time', value: '46m 03s', sub: 'Sum across all cells', color: '#60a5fa' },
            { label: 'Fastest Cell', value: 'Linux × Node 18', sub: '3m 58s', color: '#22d3ee' },
            { label: 'Slowest Cell', value: 'Windows × Node 18', sub: '6m 21s', color: '#f5b731' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.color, marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: '#6e7191' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
