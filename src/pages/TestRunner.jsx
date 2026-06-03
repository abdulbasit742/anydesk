import { useState } from 'react';

const suites = [
  { id: 'unit', label: 'Unit Tests', total: 312, pass: 309, fail: 2, skip: 1, duration: '14.2s', coverage: 87 },
  { id: 'integration', label: 'Integration Tests', total: 48, pass: 46, fail: 2, skip: 0, duration: '42.1s', coverage: 73 },
  { id: 'e2e', label: 'E2E Tests', total: 24, pass: 22, fail: 1, skip: 1, duration: '3m 12s', coverage: 61 },
  { id: 'perf', label: 'Performance Tests', total: 8, pass: 7, fail: 0, skip: 1, duration: '1m 48s', coverage: 55 },
];

const failedTests = {
  unit: [
    { name: 'AuthService > refreshToken should handle concurrent requests', file: 'src/auth/auth.test.ts:142', error: 'Expected resolved value to be truthy', flaky: true },
    { name: 'UserStore > updateProfile throws on invalid email', file: 'src/store/user.test.ts:87', error: 'AssertionError: expected false to equal true', flaky: false },
  ],
  integration: [
    { name: 'POST /api/users > should return 201 with valid payload', file: 'tests/api/users.test.ts:34', error: 'Timeout: Server did not respond within 5000ms', flaky: true },
    { name: 'GET /api/reports > should paginate results', file: 'tests/api/reports.test.ts:102', error: 'Expected status 200, received 500', flaky: false },
  ],
  e2e: [
    { name: 'Checkout flow > payment step should show error on declined card', file: 'e2e/checkout.spec.ts:211', error: 'Element not found: [data-testid="error-msg"]', flaky: false },
  ],
  perf: [],
};

const CoverageDonut = ({ pct, color }) => {
  const r = 28; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={r} fill="none" stroke="#1d1d28" strokeWidth="8" />
      <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 35 35)" />
      <text x="35" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">{pct}%</text>
    </svg>
  );
};

export default function TestRunner() {
  const [selectedSuite, setSelectedSuite] = useState('unit');
  const [running, setRunning] = useState(null);
  const [runningAll, setRunningAll] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [progress, setProgress] = useState({});

  const runSuite = (id) => {
    setRunning(id);
    setProgress(p => ({ ...p, [id]: 0 }));
    const iv = setInterval(() => {
      setProgress(p => {
        const next = (p[id] || 0) + 10;
        if (next >= 100) { clearInterval(iv); setRunning(null); return { ...p, [id]: 100 }; }
        return { ...p, [id]: next };
      });
    }, 300);
  };

  const runAll = () => {
    setRunningAll(true);
    setTimeout(() => setRunningAll(false), 4000);
  };

  const suite = suites.find(s => s.id === selectedSuite);
  const failed = failedTests[selectedSuite] || [];

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1e14 0%, #16161e 55%, #0e1e1e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🧪</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Test Runner</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Automated test suite execution, coverage analysis & flaky test detection</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {[['Total Tests', '392', '#60a5fa'], ['Passing', '384', '#22d3ee'], ['Failing', '5', '#ef4444'], ['Coverage', '82%', '#f5b731']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#6e7191' }}>
              <div onClick={() => setScheduled(s => !s)} style={{ width: 36, height: 20, background: scheduled ? '#22d3ee' : '#2d2d40', borderRadius: 10, position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 2, left: scheduled ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
              Schedule
            </label>
            <button onClick={runAll} disabled={runningAll} style={{ background: runningAll ? '#1d1d28' : 'linear-gradient(90deg, #065f46, #047857)', color: runningAll ? '#6e7191' : '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: runningAll ? 'not-allowed' : 'pointer', fontSize: 14 }}>
              {runningAll ? '⏳ Running All…' : '▶ Run All Suites'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Suite List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suites.map(s => (
            <div key={s.id} onClick={() => setSelectedSuite(s.id)} style={{ background: selectedSuite === s.id ? 'rgba(255,255,255,0.07)' : 'var(--surface2)', border: `1px solid ${selectedSuite === s.id ? 'rgba(34,211,238,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                <button onClick={e => { e.stopPropagation(); runSuite(s.id); }} disabled={running === s.id} style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                  {running === s.id ? '…' : '▶'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: '#22d3ee' }}>✓ {s.pass}</span>
                <span style={{ color: '#ef4444' }}>✗ {s.fail}</span>
                <span style={{ color: '#6e7191' }}>◯ {s.skip}</span>
                <span style={{ color: '#6e7191', marginLeft: 'auto' }}>⏱ {s.duration}</span>
              </div>
              {running === s.id && (
                <div style={{ background: '#1d1d28', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress[s.id] || 0}%`, background: '#22d3ee', transition: 'width 0.3s', borderRadius: 4 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Coverage + Stats */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
            <CoverageDonut pct={suite.coverage} color="#22d3ee" />
            <div>
              <div style={{ fontSize: 13, color: '#6e7191', marginBottom: 4 }}>Code Coverage</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee' }}>{suite.coverage}%</div>
            </div>
            <div style={{ height: 60, width: 1, background: 'var(--border)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Test Duration Breakdown</div>
              {[['Setup', 12], ['Run', 68], ['Teardown', 20]].map(([label, pct]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: '#6e7191' }}>{label}</span><span style={{ color: '#e2e8f0' }}>{pct}%</span>
                  </div>
                  <div style={{ background: '#1d1d28', borderRadius: 4, height: 6 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Failed Tests */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Failed Tests {failed.length > 0 && <span style={{ color: '#ef4444', fontSize: 13 }}>({failed.length})</span>}</h2>
            {failed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#22d3ee', fontSize: 14 }}>✓ All tests passing in this suite!</div>
            ) : (
              failed.map((t, i) => (
                <div key={i} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#ef4444', flex: 1, marginRight: 12 }}>{t.name}</span>
                    {t.flaky && <span style={{ background: 'rgba(245,183,49,0.15)', color: '#f5b731', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ FLAKY</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#6e7191', fontFamily: 'monospace', marginBottom: 4 }}>{t.file}</div>
                  <div style={{ fontSize: 12, color: '#ef4444', fontFamily: 'monospace', background: '#0a0a12', padding: 8, borderRadius: 6 }}>{t.error}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
