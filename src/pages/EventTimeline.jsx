import { useState } from 'react';

const CATEGORY_COLORS = {
  Deploy: '#22d3ee',
  Alert: '#ef4444',
  Config: '#f5b731',
  Broadcast: '#a78bfa',
  Auth: '#60a5fa',
};

const ALL_EVENTS = [
  { id: 1, ts: '2026-06-02T08:09:00Z', cat: 'Deploy', title: 'v2.14.0 deployed to production', detail: 'Docker image sha256:a4b3c2 rolled out across 8 replicas. Zero downtime. Health checks passed.', user: 'ci-bot' },
  { id: 2, ts: '2026-06-02T07:47:00Z', cat: 'Alert', title: 'Scheduler latency spike', detail: 'P95 latency exceeded 400ms for 3 consecutive minutes. Auto-scaled scheduler pods from 2→4.', user: 'alertmanager' },
  { id: 3, ts: '2026-06-02T07:22:00Z', cat: 'Config', title: 'Rate limit updated: /api/broadcast', detail: 'Global rate limit changed from 100/min to 150/min. Applied immediately.', user: 'admin@acme.io' },
  { id: 4, ts: '2026-06-02T06:58:00Z', cat: 'Broadcast', title: 'Bulk broadcast #4821 completed', detail: '1,204 accounts reached. 98.7% delivery rate. 14 bounces. Duration: 3.2s.', user: 'aria@acme.io' },
  { id: 5, ts: '2026-06-02T05:30:00Z', cat: 'Auth', title: 'New admin account created', detail: 'Account leo@build.co granted Admin role. MFA enforced. IP: 203.0.113.42.', user: 'superadmin' },
  { id: 6, ts: '2026-06-02T04:11:00Z', cat: 'Alert', title: 'SSL certificate expiring in 14 days', detail: 'Certificate for api.antigravity.io expires 2026-06-16. Auto-renewal scheduled.', user: 'certbot' },
  { id: 7, ts: '2026-06-01T22:00:00Z', cat: 'Deploy', title: 'Hotfix v2.13.4 applied', detail: 'Fixed memory leak in queue-worker. Deployed to production without service interruption.', user: 'ci-bot' },
  { id: 8, ts: '2026-06-01T18:44:00Z', cat: 'Config', title: 'Analytics retention policy updated', detail: 'Event retention changed from 90d → 180d. Migration job queued.', user: 'priya@loop.dev' },
  { id: 9, ts: '2026-06-01T15:20:00Z', cat: 'Broadcast', title: 'Scheduled broadcast #4817 sent', detail: '500 accounts targeted for weekly digest. Subject: "Platform Update: June 2026".', user: 'scheduler' },
  { id: 10, ts: '2026-06-01T09:05:00Z', cat: 'Auth', title: 'Suspicious login attempt blocked', detail: '12 failed login attempts from IP 185.220.101.7. IP auto-banned for 24h.', user: 'auth-service' },
];

const TABS = ['Today', 'Week', 'Month'];

function PieChart({ cats }) {
  const total = Object.values(cats).reduce((a, b) => a + b, 0);
  let angle = -90;
  const r = 48, cx = 60, cy = 60;
  const slices = Object.entries(cats).map(([cat, count]) => {
    const pct = count / total;
    const startAngle = angle;
    angle += pct * 360;
    const endAngle = angle;
    const toRad = deg => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = pct > 0.5 ? 1 : 0;
    return { cat, pct, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {slices.map(s => <path key={s.cat} d={s.d} fill={CATEGORY_COLORS[s.cat]} opacity={0.85} stroke="#16161e" strokeWidth="1" />)}
      <circle cx={cx} cy={cy} r={28} fill="#16161e" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="700">{total}</text>
    </svg>
  );
}

export default function EventTimeline() {
  const [activeTab, setActiveTab] = useState('Today');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const catFilter = activeFilter === 'All' ? Object.keys(CATEGORY_COLORS) : [activeFilter];
  const filtered = ALL_EVENTS.filter(e => {
    const matchCat = catFilter.includes(e.cat);
    const matchSearch = search === '' || e.title.toLowerCase().includes(search.toLowerCase()) || e.detail.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catCounts = Object.keys(CATEGORY_COLORS).reduce((a, c) => { a[c] = ALL_EVENTS.filter(e => e.cat === c).length; return a; }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Event Timeline</h1>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Chronological log of all platform events and changes.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(catCounts).map(([c, n]) => (
            <div key={c} style={{ background: `${CATEGORY_COLORS[c]}12`, border: `1px solid ${CATEGORY_COLORS[c]}40`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: CATEGORY_COLORS[c], fontSize: 20 }}>{n}</div>
              <div style={{ fontSize: 11, color: '#6e7191' }}>{c}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '7px 18px', borderRadius: 20, border: activeTab === t ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', background: activeTab === t ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)', color: activeTab === t ? '#a78bfa' : '#6e7191', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {t}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
          {['All', ...Object.keys(CATEGORY_COLORS)].map(c => (
            <button key={c} onClick={() => setActiveFilter(c)} style={{ padding: '7px 14px', borderRadius: 20, border: activeFilter === c ? `1px solid ${CATEGORY_COLORS[c] || '#a78bfa'}` : '1px solid rgba(255,255,255,0.1)', background: activeFilter === c ? `${CATEGORY_COLORS[c] || '#a78bfa'}18` : 'rgba(255,255,255,0.03)', color: activeFilter === c ? (CATEGORY_COLORS[c] || '#a78bfa') : '#6e7191', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
              {c}
            </button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
            style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, outline: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 28 }}>
          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
            {filtered.map((e) => (
              <div key={e.id} style={{ display: 'flex', gap: 20, marginBottom: 0, position: 'relative' }}>
                {/* Node */}
                <div style={{ width: 34, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: CATEGORY_COLORS[e.cat], marginTop: 18, boxShadow: `0 0 10px ${CATEGORY_COLORS[e.cat]}`, zIndex: 1, flexShrink: 0 }} />
                </div>
                {/* Card */}
                <div onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  style={{ flex: 1, background: '#16161e', border: `1px solid ${expanded === e.id ? CATEGORY_COLORS[e.cat] + '60' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '16px 20px', marginBottom: 12, cursor: 'pointer', transition: 'border-color .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, background: `${CATEGORY_COLORS[e.cat]}18`, color: CATEGORY_COLORS[e.cat], padding: '2px 9px', borderRadius: 20, fontWeight: 700, marginRight: 8 }}>{e.cat}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{e.title}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#6e7191', whiteSpace: 'nowrap' }}>{new Date(e.ts).toLocaleString()}</span>
                  </div>
                  {expanded === e.id && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.6, margin: '0 0 8px' }}>{e.detail}</p>
                      <div style={{ fontSize: 12, color: '#6e7191' }}>By: <span style={{ color: '#a78bfa' }}>{e.user}</span></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: '40px 0', color: '#6e7191', textAlign: 'center' }}>No events found.</div>}
          </div>

          {/* Pie chart sidebar */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#6e7191', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>By Category</h3>
            <PieChart cats={catCounts} />
            <div style={{ marginTop: 12 }}>
              {Object.entries(catCounts).map(([c, n]) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[c] }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{c}</span>
                  <span style={{ fontSize: 12, color: CATEGORY_COLORS[c], fontWeight: 700 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
