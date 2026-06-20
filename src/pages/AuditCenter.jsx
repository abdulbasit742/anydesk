import { useState, useEffect } from 'react';

const FRAMEWORKS = ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS'];
const AUDIT_EVENTS = [
  { id: 1, who: 'admin@co.io', what: 'DELETE user #4421', when: '2026-06-02 07:45:11', where: '192.168.1.1', result: 'SUCCESS' },
  { id: 2, who: 'system', what: 'Config updated: auth.mfa_required', when: '2026-06-02 07:30:02', where: 'scheduler', result: 'SUCCESS' },
  { id: 3, who: 'alice@co.io', what: 'Export user data CSV', when: '2026-06-02 07:12:44', where: '10.0.0.55', result: 'SUCCESS' },
  { id: 4, who: 'unknown', what: 'Login failed: brute force', when: '2026-06-02 06:55:21', where: '203.0.113.5', result: 'FAIL' },
  { id: 5, who: 'bob@co.io', what: 'Role escalation: admin', when: '2026-06-02 06:40:10', where: '10.0.0.22', result: 'SUCCESS' },
  { id: 6, who: 'ci-bot', what: 'Deploy v2.4.1 to production', when: '2026-06-01 23:15:00', where: 'ci-runner-3', result: 'SUCCESS' },
  { id: 7, who: 'alice@co.io', what: 'Access denied: billing', when: '2026-06-01 22:01:05', where: '10.0.0.55', result: 'FAIL' },
  { id: 8, who: 'admin@co.io', what: 'Bulk delete logs > 90d', when: '2026-06-01 20:00:00', where: '192.168.1.1', result: 'SUCCESS' },
];
const VIOLATIONS = [
  { id: 1, policy: 'MFA Required for Admin', severity: 'HIGH', framework: 'SOC2', status: 'Open' },
  { id: 2, policy: 'Data Retention > 2 Years', severity: 'MEDIUM', framework: 'GDPR', status: 'Remediated' },
  { id: 3, policy: 'Encryption at Rest', severity: 'HIGH', framework: 'ISO27001', status: 'Open' },
  { id: 4, policy: 'Audit Logging Disabled on Dev', severity: 'LOW', framework: 'SOC2', status: 'Open' },
  { id: 5, policy: 'Access Review Overdue', severity: 'MEDIUM', framework: 'HIPAA', status: 'In Progress' },
];
const TASKS = [
  { id: 1, task: 'Enable MFA for all admin accounts', due: '2026-06-10', priority: 'HIGH' },
  { id: 2, task: 'Encrypt S3 bucket: backups-prod', due: '2026-06-15', priority: 'HIGH' },
  { id: 3, task: 'Run quarterly access review', due: '2026-06-30', priority: 'MEDIUM' },
  { id: 4, task: 'Update data retention policy doc', due: '2026-07-01', priority: 'LOW' },
];
const SEV_COLORS = { HIGH: '#ef4444', MEDIUM: '#f5b731', LOW: '#22d3ee' };

function ComplianceGauge({ score }) {
  const r = 60, cx = 75, cy = 75;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const dashArr = circ;
  const dashOff = circ * (1 - pct);
  const color = score >= 80 ? '#22d3ee' : score >= 60 ? '#f5b731' : '#ef4444';
  return (
    <svg width={150} height={150} viewBox="0 0 150 150">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12}
        strokeDasharray={dashArr} strokeDashoffset={dashOff}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 1s' }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize={26} fontWeight={800}>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#6e7191" fontSize={11}>/ 100</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill="#6e7191" fontSize={10}>Compliance</text>
    </svg>
  );
}

export default function AuditCenter() {
  const [framework, setFramework] = useState('SOC2');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('events');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [events, setEvents] = useState([]);
  const score = 73;

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/system/audit-logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        const mapped = data.logs.map((log, idx) => ({
          id: log.id || idx + 1,
          who: log.user,
          what: log.action + (log.details ? ` (${log.details})` : ''),
          when: log.ts,
          where: log.ip,
          result: log.result === 'Allow' ? 'SUCCESS' : 'FAIL'
        }));
        setEvents(mapped);
      } else {
        setEvents(AUDIT_EVENTS);
      }
    } catch (e) {
      console.error(e);
      setEvents(AUDIT_EVENTS);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = events.filter(e =>
    e.who.includes(search) || e.what.toLowerCase().includes(search.toLowerCase()) || e.where.includes(search)
  );

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #0e1a28 60%, #10100e 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #f5b731, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    heroSub: { color: '#6e7191', marginTop: 8, fontSize: 15 },
    body: { padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    tabBtn: (active) => ({ background: active ? '#f5b73122' : 'transparent', border: `1px solid ${active ? '#f5b731' : 'rgba(255,255,255,0.1)'}`, color: active ? '#f5b731' : '#6e7191', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { padding: '8px 10px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'left' },
    td: { padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    resultBadge: (r) => ({ background: r === 'SUCCESS' ? '#22d3ee22' : '#ef444422', color: r === 'SUCCESS' ? '#22d3ee' : '#ef4444', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }),
    pill: (active) => ({ background: active ? '#f5b73122' : '#1d1d28', border: `1px solid ${active ? '#f5b731' : 'rgba(255,255,255,0.1)'}`, color: active ? '#f5b731' : '#6e7191', borderRadius: 20, padding: '4px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }),
    btn: (c = '#22d3ee') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    sevBadge: (sev) => ({ background: SEV_COLORS[sev] + '22', color: SEV_COLORS[sev], border: `1px solid ${SEV_COLORS[sev]}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }),
    statBadge: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 18px', textAlign: 'center' },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Audit Center</h1>
        <p style={s.heroSub}>Compliance tracking, audit trail and policy violation management</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          {[{ label: 'Audit Events', val: AUDIT_EVENTS.length, color: '#22d3ee' }, { label: 'Open Violations', val: VIOLATIONS.filter(v => v.status === 'Open').length, color: '#ef4444' }, { label: 'Remediation Tasks', val: TASKS.length, color: '#f5b731' }, { label: 'Score', val: `${score}/100`, color: '#a78bfa' }].map(b => (
            <div key={b.label} style={{ ...s.statBadge, borderColor: b.color + '44' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>{b.val}</div>
              <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>{b.label}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap', alignItems: 'center' }}>
            {FRAMEWORKS.map(fw => <button key={fw} style={s.pill(fw === framework)} onClick={() => setFramework(fw)}>{fw}</button>)}
          </div>
        </div>
      </div>

      <div style={{ ...s.body, gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          {['events', 'violations', 'tasks'].map(t => <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
          <button style={{ ...s.btn('#a78bfa'), marginLeft: 'auto' }} onClick={handleGenerate} disabled={generating}>
            {generating ? '⏳ Generating…' : generated ? '✅ Report Ready' : '📄 Generate Audit Report'}
          </button>
        </div>

        {tab === 'events' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={s.cardTitle}>Audit Events — {framework}</span>
              <input style={{ ...s.input, maxWidth: 220 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <table style={s.table}>
              <thead><tr>{['WHO', 'WHAT', 'WHEN', 'WHERE', 'RESULT'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id}>
                    <td style={s.td}>{ev.who}</td>
                    <td style={{ ...s.td, color: '#c4c9e2' }}>{ev.what}</td>
                    <td style={{ ...s.td, color: '#6e7191', fontFamily: 'monospace', fontSize: 12 }}>{ev.when}</td>
                    <td style={{ ...s.td, color: '#6e7191', fontFamily: 'monospace' }}>{ev.where}</td>
                    <td style={s.td}><span style={s.resultBadge(ev.result)}>{ev.result}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'violations' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
            <div style={{ ...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ComplianceGauge score={score} />
              <div style={{ marginTop: 16, fontSize: 13, color: '#6e7191', textAlign: 'center' }}>
                Framework: <strong style={{ color: '#f5b731' }}>{framework}</strong>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>⚠ {VIOLATIONS.filter(v => v.status === 'Open').length} open violations</div>
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Policy Violations</div>
              {VIOLATIONS.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={s.sevBadge(v.severity)}>{v.severity}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#e2e8f0' }}>{v.policy}</div>
                    <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>{v.framework}</div>
                  </div>
                  <span style={{ fontSize: 12, color: v.status === 'Remediated' ? '#22d3ee' : v.status === 'In Progress' ? '#f5b731' : '#ef4444', fontWeight: 600 }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Remediation Tasks</div>
            {TASKS.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={s.sevBadge(t.priority)}>{t.priority}</span>
                <span style={{ flex: 1, color: '#e2e8f0', fontSize: 13 }}>{t.task}</span>
                <span style={{ fontSize: 12, color: '#6e7191' }}>Due: {t.due}</span>
                <button style={s.btn('#22d3ee')}>Mark Done</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
