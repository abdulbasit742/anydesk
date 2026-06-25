import { useState } from 'react';

const SCHOLARSHIPS = [
  { id: 1, name: 'STEM Excellence Award', org: 'National Science Foundation', amount: '$12,000', deadline: '2024-03-15', match: 96, status: 'applying', field: 'Engineering' },
  { id: 2, name: 'Women in Tech Scholarship', org: 'Google.org', amount: '$8,500', deadline: '2024-04-01', match: 88, status: 'found', field: 'CS' },
  { id: 3, name: 'Future Leaders Grant', org: 'Microsoft', amount: '$15,000', deadline: '2024-02-28', match: 91, status: 'submitted', field: 'Business' },
  { id: 4, name: 'AI Research Fellowship', org: 'OpenAI Foundation', amount: '$25,000', deadline: '2024-05-01', match: 99, status: 'found', field: 'AI/ML' },
  { id: 5, name: 'Community Impact Award', org: 'Local Foundation', amount: '$3,000', deadline: '2024-03-30', match: 78, status: 'found', field: 'Any' },
];

const STATUS_CFG = {
  found: { label: 'Found', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  applying: { label: 'Applying', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  submitted: { label: 'Submitted', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

export default function ScholarshipAgent() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scholarships] = useState(SCHOLARSHIPS);
  const [filter, setFilter] = useState('all');

  const runScan = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const filtered = filter === 'all' ? scholarships : scholarships.filter(s => s.status === filter);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🎓 Scholarship Agent</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>AI-powered scholarship discovery and auto-application system.</p>
        </div>
        <button
          onClick={runScan}
          disabled={running}
          style={{
            padding: '9px 20px',
            borderRadius: 8,
            border: 'none',
            background: running ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            cursor: running ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {running ? `🔍 Scanning... ${progress}%` : '🔍 Run AI Scan'}
        </button>
      </div>

      {running && (
        <div style={{ marginBottom: 16, background: 'var(--card)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span>AI scanning scholarship databases...</span>
            <span style={{ color: '#6366f1' }}>{progress}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 4 }}>
            <div style={{
              height: '100%',
              borderRadius: 99,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Found', value: scholarships.filter(s => s.status === 'found').length, icon: '🔍' },
          { label: 'Applying', value: scholarships.filter(s => s.status === 'applying').length, icon: '📝' },
          { label: 'Submitted', value: scholarships.filter(s => s.status === 'submitted').length, icon: '✅' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'found', 'applying', 'submitted'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 99,
            border: `1px solid ${filter === f ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
            background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: filter === f ? '#6366f1' : 'var(--muted)',
            cursor: 'pointer', fontSize: 12, textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(s => {
          const cfg = STATUS_CFG[s.status];
          return (
            <div key={s.id} style={{
              background: 'var(--card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}>🎓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.org} · {s.field} · Deadline: {s.deadline}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>{s.amount}</div>
                <div style={{ fontSize: 11, color: '#6366f1' }}>Match: {s.match}%</div>
              </div>
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 99,
                background: cfg.bg, color: cfg.color, fontWeight: 600,
              }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
