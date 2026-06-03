import { useState } from 'react';

const PERIODS = ['7d', '30d', '90d'];

const KPI_DATA = {
  '7d':  { revenue: '$142,830', mrr: '$48,200', dau: '12,447', retention: '78.4%', nps: 62, tickets: 34, revChange: +8.2, mrrChange: +3.1, dauChange: +12.5, retChange: -1.2, npsChange: +5, ticketChange: -18 },
  '30d': { revenue: '$589,420', mrr: '$48,200', dau: '11,832', retention: '79.1%', nps: 59, tickets: 128, revChange: +22.4, mrrChange: +11.8, dauChange: +8.3, retChange: +0.9, npsChange: +12, ticketChange: +4 },
  '90d': { revenue: '$1.74M', mrr: '$48,200', dau: '10,204', retention: '76.8%', nps: 54, tickets: 394, revChange: +41.0, mrrChange: +34.2, dauChange: +31.1, retChange: +2.4, npsChange: +21, ticketChange: +11 },
};

const GOALS = { '7d': [155000, 50000, 13000, 80, 65, 30], '30d': [600000, 52000, 12500, 81, 65, 120], '90d': [1800000, 55000, 11000, 80, 62, 380] };

const TOP_USERS = [
  { rank: 1, name: 'Aria Chen', account: 'aria@acme.io', usage: 98, revenue: '$4,200' },
  { rank: 2, name: 'Marcus Webb', account: 'mwebb@nova.ai', usage: 94, revenue: '$3,800' },
  { rank: 3, name: 'Priya Nair', account: 'priya@loop.dev', usage: 89, revenue: '$2,950' },
  { rank: 4, name: 'Leo Straus', account: 'leo@build.co', usage: 84, revenue: '$2,400' },
  { rank: 5, name: 'Sana Khoury', account: 'sana@edge.io', usage: 80, revenue: '$1,990' },
];

function TrendBadge({ val }) {
  const up = val >= 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: up ? '#22d3ee' : '#ef4444', background: up ? 'rgba(34,211,238,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 10 }}>
      {up ? '▲' : '▼'} {Math.abs(val)}%
    </span>
  );
}

function MiniLineChart({ points, color }) {
  const h = 48, w = 200;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`).join(' L ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${coords} ${w},${h}`} fill={`url(#g${color.replace('#','')})`} />
      <polyline points={coords} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function generateTrend(n = 30) {
  let v = 50 + Math.random() * 20;
  return Array.from({ length: n }, () => { v += (Math.random() - 0.46) * 6; return Math.max(10, v); });
}

const trends = {
  revenue: generateTrend(), mrr: generateTrend(), dau: generateTrend(),
  retention: generateTrend(), nps: generateTrend(), tickets: generateTrend(),
};

export default function KPIDashboard() {
  const [period, setPeriod] = useState('30d');
  const d = KPI_DATA[period];
  const goals = GOALS[period];

  const kpis = [
    { key: 'revenue', label: 'Total Revenue', value: d.revenue, change: d.revChange, color: '#f5b731', goal: goals[0], actual: 589420, trendKey: 'revenue' },
    { key: 'mrr', label: 'MRR', value: d.mrr, change: d.mrrChange, color: '#22d3ee', goal: goals[1], actual: 48200, trendKey: 'mrr' },
    { key: 'dau', label: 'Daily Active Users', value: d.dau, change: d.dauChange, color: '#a78bfa', goal: goals[2], actual: 11832, trendKey: 'dau' },
    { key: 'retention', label: 'Retention Rate', value: d.retention, change: d.retChange, color: '#60a5fa', goal: goals[3], actual: 79, trendKey: 'retention' },
    { key: 'nps', label: 'NPS Score', value: String(d.nps), change: d.npsChange, color: '#22d3ee', goal: goals[4], actual: d.nps, trendKey: 'nps' },
    { key: 'tickets', label: 'Support Tickets', value: String(d.tickets), change: d.ticketChange, color: '#ef4444', goal: goals[5], actual: d.tickets, trendKey: 'tickets' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1d1d28, #0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#f5b731,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KPI Dashboard</h1>
            <p style={{ color: '#6e7191', margin: 0, fontSize: 15 }}>Executive performance metrics and goal tracking.</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 20px', borderRadius: 10, border: period === p ? '1px solid #f5b731' : '1px solid rgba(255,255,255,0.1)', background: period === p ? 'rgba(245,183,49,0.12)' : 'rgba(255,255,255,0.03)', color: period === p ? '#f5b731' : '#6e7191', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* KPI tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 36 }}>
          {kpis.map(kpi => {
            const pct = Math.min(100, Math.round((kpi.actual / kpi.goal) * 100));
            return (
              <div key={kpi.key} style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 22px 18px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                  <TrendBadge val={kpi.change} />
                </div>
                <MiniLineChart points={trends[kpi.trendKey]} color={kpi.color} />
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6e7191', marginBottom: 5 }}>
                    <span>Goal Progress</span><span style={{ color: kpi.color }}>{pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}99)`, borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Users */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Top 5 Users</h2>
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px 80px 100px', padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>#</span><span>User</span><span>Account</span><span>Usage</span><span>Revenue</span>
          </div>
          {TOP_USERS.map(u => (
            <div key={u.rank} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px 80px 100px', padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: ['#f5b731','#6e7191','#60a5fa','#6e7191','#6e7191'][u.rank - 1], fontSize: 14 }}>{u.rank}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
              <span style={{ color: '#6e7191', fontSize: 12 }}>{u.account}</span>
              <div>
                <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 3 }}>{u.usage}%</div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4 }}>
                  <div style={{ width: `${u.usage}%`, height: '100%', background: '#a78bfa', borderRadius: 3 }} />
                </div>
              </div>
              <span style={{ color: '#f5b731', fontWeight: 700, fontSize: 14 }}>{u.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
