import { useState } from 'react';

const WEEKS = ['Jun 2 – Jun 8', 'May 26 – Jun 1', 'May 19 – May 25'];

const HIGHLIGHTS = {
  wins: [
    'MRR grew 11.8% month-over-month to $48,200 — strongest quarter in company history.',
    'DAU crossed 12,000 for the first time; retention held at 79.1%.',
    'P95 API latency reduced from 210ms → 88ms after infra optimization.',
  ],
  risks: [
    'Scheduler service SLA breached twice this week (4.5h total downtime).',
    'EU market share declined 3% — investigate UX friction in sign-up flow.',
  ],
  focus: 'Prioritize Scheduler reliability: scale pods and implement circuit-breaker pattern.',
};

const THIS_WEEK = [
  { metric: 'Revenue', this: '$142,830', last: '$131,950', delta: +8.2 },
  { metric: 'New Accounts', this: '384', last: '312', delta: +23.1 },
  { metric: 'API Calls', this: '28.4M', last: '24.1M', delta: +17.8 },
  { metric: 'Broadcasts Sent', this: '14,820', last: '13,900', delta: +6.6 },
  { metric: 'Avg Response Time', this: '88ms', last: '210ms', delta: +58.1 },
  { metric: 'Support Tickets', this: '34', last: '41', delta: -17.1 },
];

const TEAM_ACTIVITY = [
  { team: 'Engineering', actions: 482, color: '#22d3ee' },
  { team: 'Growth', actions: 311, color: '#a78bfa' },
  { team: 'Support', actions: 198, color: '#f5b731' },
  { team: 'Product', actions: 144, color: '#60a5fa' },
];

const AI_SUMMARY = `This week showed strong momentum with MRR growth and record DAU. The infrastructure team's latency improvements are paying dividends — API response time dropped 58% while handling 18% more calls. The primary risk is Scheduler reliability, which caused two SLA breaches; capacity planning should be escalated to leadership this week. EU growth stagnation warrants a dedicated investigation sprint. Overall platform health score: 97.3%.`;

export default function ExecutiveSummary() {
  const [week, setWeek] = useState(0);
  const [shared, setShared] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1800);
  };
  const handleShare = () => { setShared(true); setTimeout(() => setShared(false), 2000); };

  const maxActions = Math.max(...TEAM_ACTIVITY.map(t => t.actions));

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#a78bfa,#f5b731)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Executive Summary</h1>
            <p style={{ color: '#6e7191', margin: '0 0 20px', fontSize: 15 }}>Weekly leadership report — key wins, risks, and strategic focus.</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {WEEKS.map((w, i) => (
                <button key={i} onClick={() => setWeek(i)} style={{ padding: '8px 16px', borderRadius: 10, border: week === i ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', background: week === i ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)', color: week === i ? '#a78bfa' : '#6e7191', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownload} disabled={downloading} style={{ padding: '10px 22px', borderRadius: 12, border: '1px solid rgba(245,183,49,0.4)', background: 'rgba(245,183,49,0.1)', color: '#f5b731', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: downloading ? 0.7 : 1 }}>
              {downloading ? '⟳ Generating...' : '⬇ Download PDF'}
            </button>
            <button onClick={handleShare} style={{ padding: '10px 22px', borderRadius: 12, border: '1px solid rgba(34,211,238,0.4)', background: 'rgba(34,211,238,0.1)', color: shared ? '#22d3ee' : '#22d3ee', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {shared ? '✓ Copied Link!' : '↗ Share'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 24 }}>
          {/* Highlights */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Highlights</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22d3ee', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>✓ Wins</div>
              {HIGHLIGHTS.wins.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', marginTop: 5, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 13, color: '#ddd', lineHeight: 1.5 }}>{w}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>⚠ Risks</div>
              {HIGHLIGHTS.risks.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', marginTop: 5, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 13, color: '#ddd', lineHeight: 1.5 }}>{r}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(245,183,49,0.07)', border: '1px solid rgba(245,183,49,0.3)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f5b731', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>◎ Focus Area</div>
              <p style={{ margin: 0, fontSize: 13, color: '#ddd', lineHeight: 1.5 }}>{HIGHLIGHTS.focus}</p>
            </div>
          </div>

          {/* Metrics Table */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>This Week vs Last Week</div>
            {THIS_WEEK.map(row => (
              <div key={row.metric} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px', padding: '13px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{row.metric}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{row.this}</span>
                <span style={{ fontSize: 13, color: '#6e7191' }}>{row.last}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: row.delta > 0 ? '#22d3ee' : '#ef4444', background: row.delta > 0 ? 'rgba(34,211,238,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 8 }}>
                  {row.delta > 0 ? '+' : ''}{row.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Activity + AI Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Team Activity</h3>
            {TEAM_ACTIVITY.map(t => (
              <div key={t.team} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{t.team}</span>
                  <span style={{ color: t.color, fontWeight: 700 }}>{t.actions} actions</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 5, height: 8 }}>
                  <div style={{ width: `${(t.actions / maxActions) * 100}%`, height: '100%', background: `linear-gradient(90deg,${t.color},${t.color}80)`, borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>AI Summary</h3>
            </div>
            <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '16px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#ccc', lineHeight: 1.7 }}>{AI_SUMMARY}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
