import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../data/store';

const SESSION_START = Date.now();

/* ─── Mock preview data ─────────────────────────────────────────── */
const MOCK_WEEKLY = {
  broadcasts: 42, delivered: 389, failed: 11, successRate: 97.2,
  topPlatform: 'Claude.ai', avgResponseTime: '2.1s', creditsUsed: 820,
  topPrompt: 'Summarize the latest AI news', peakHour: '09:00',
};
const MOCK_MONTHLY = {
  broadcasts: 187, delivered: 1702, failed: 43, successRate: 97.5,
  topPlatform: 'Bolt.new', avgResponseTime: '1.9s', creditsUsed: 3540,
  newAccounts: 3, workflowsRun: 22,
};
const MOCK_PLATFORM = [
  { name: 'Claude.ai',  broadcasts: 58, delivered: 541, rate: 98.2, color: '#f97316' },
  { name: 'Bolt.new',   broadcasts: 47, delivered: 428, rate: 97.7, color: '#f5b731' },
  { name: 'Lovable',    broadcasts: 34, delivered: 301, rate: 96.5, color: '#a78bfa' },
  { name: 'Manus.ai',   broadcasts: 28, delivered: 248, rate: 95.4, color: '#06b6d4' },
  { name: 'Replit',     broadcasts: 12, delivered: 104, rate: 93.1, color: '#f97316' },
  { name: 'Cursor',     broadcasts: 8,  delivered: 68,  rate: 91.8, color: '#4f8ef7' },
];
const MOCK_COST = {
  totalSpend: 42.18, inputTokens: '12.4M', outputTokens: '3.2M',
  breakdown: [
    { model: 'Claude 3.5', cost: 18.40, pct: 44 },
    { model: 'GPT-4o',     cost: 12.80, pct: 30 },
    { model: 'Gemini Pro', cost:  6.60, pct: 16 },
    { model: 'Others',     cost:  4.38, pct: 10 },
  ],
};

const TEMPLATES = [
  { id: 'weekly',    label: 'Weekly Summary',     icon: '📅', color: 'var(--gold)',   desc: 'Key stats for the past 7 days' },
  { id: 'monthly',   label: 'Monthly Overview',   icon: '📆', color: '#a78bfa',       desc: 'Full month breakdown & trends' },
  { id: 'platform',  label: 'Platform Breakdown', icon: '🔌', color: 'var(--teal)',   desc: 'Per-platform delivery rates' },
  { id: 'cost',      label: 'Cost Report',        icon: '💰', color: '#f59e0b',       desc: 'Spend breakdown by model & period' },
];



function MiniBarChart({ data, color }) {
  const max = Math.max(1, ...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 48, marginTop: 8 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${Math.max(4, (v / max) * 100)}%`,
          background: i === data.length - 1 ? color : `${color}55`,
          borderRadius: '2px 2px 0 0', transition: 'height 0.4s ease',
        }} />
      ))}
    </div>
  );
}

function StatGrid({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 16 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '12px 14px', borderTop: `2px solid ${s.color}` }}>
          <div style={{ fontSize: 8.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Preview Panels ────────────────────────────────────────────── */
function WeeklyPreview() {
  return (
    <div>
      <StatGrid stats={[
        { label: 'Broadcasts', val: MOCK_WEEKLY.broadcasts, color: 'var(--gold)' },
        { label: 'Delivered',  val: MOCK_WEEKLY.delivered,  color: 'var(--teal)' },
        { label: 'Failed',     val: MOCK_WEEKLY.failed,     color: 'var(--red)'  },
        { label: 'Success %',  val: `${MOCK_WEEKLY.successRate}%`, color: '#10b981' },
        { label: 'Credits',    val: MOCK_WEEKLY.creditsUsed, color: '#a78bfa' },
      ]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['Top Platform', MOCK_WEEKLY.topPlatform],
          ['Avg Response', MOCK_WEEKLY.avgResponseTime],
          ['Peak Hour', MOCK_WEEKLY.peakHour],
          ['Top Prompt', MOCK_WEEKLY.topPrompt],
        ].map(([k, v]) => (
          <div key={k} style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 11, color: '#e4e4ed', fontFamily: 'DM Mono,monospace' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyPreview() {
  return (
    <div>
      <StatGrid stats={[
        { label: 'Broadcasts',  val: MOCK_MONTHLY.broadcasts,  color: 'var(--gold)' },
        { label: 'Delivered',   val: MOCK_MONTHLY.delivered,   color: 'var(--teal)' },
        { label: 'Failed',      val: MOCK_MONTHLY.failed,      color: 'var(--red)'  },
        { label: 'Success %',   val: `${MOCK_MONTHLY.successRate}%`, color: '#10b981' },
        { label: 'Credits',     val: MOCK_MONTHLY.creditsUsed, color: '#a78bfa' },
        { label: 'New Accts',   val: MOCK_MONTHLY.newAccounts, color: '#4f8ef7' },
      ]} />
    </div>
  );
}

function PlatformPreview() {
  const max = Math.max(...MOCK_PLATFORM.map(p => p.delivered));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {MOCK_PLATFORM.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#dde0f0', width: 80, flexShrink: 0 }}>{p.name}</span>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${(p.delivered / max) * 100}%`, background: p.color, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 10, color: p.color, fontFamily: 'DM Mono,monospace', width: 40, textAlign: 'right' }}>{p.rate}%</span>
          <span style={{ fontSize: 9.5, color: 'var(--muted)', width: 28 }}>{p.broadcasts}b</span>
        </div>
      ))}
    </div>
  );
}

function CostPreview() {
  return (
    <div>
      <StatGrid stats={[
        { label: 'Total Spend',   val: `$${MOCK_COST.totalSpend}`, color: '#f59e0b' },
        { label: 'Input Tokens',  val: MOCK_COST.inputTokens,      color: 'var(--teal)' },
        { label: 'Output Tokens', val: MOCK_COST.outputTokens,     color: '#a78bfa' },
      ]} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MOCK_COST.breakdown.map(b => (
          <div key={b.model} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#dde0f0', width: 90, flexShrink: 0 }}>{b.model}</span>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${b.pct}%`, background: '#f59e0b', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'DM Mono,monospace', width: 40, textAlign: 'right' }}>${b.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Reports() {
  const { broadcasts } = useStore();
  const [template, setTemplate]   = useState('weekly');
  const [fromDate, setFromDate]   = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate]       = useState(() => new Date().toISOString().slice(0, 10));
  const [showPreview, setPreview] = useState(false);
  const [generating, setGen]      = useState(false);
  const [scheduled, setScheduled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bsp_weekly_report') || 'false'); } catch { return false; }
  });
  const [dailyEmail, setDailyEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bsp_daily_email_sim') || 'false'); } catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem('bsp_weekly_report', JSON.stringify(scheduled));
  }, [scheduled]);

  useEffect(() => {
    localStorage.setItem('bsp_daily_email_sim', JSON.stringify(dailyEmail));
  }, [dailyEmail]);

  const activeTemplate = TEMPLATES.find(t => t.id === template);

  const filteredBroadcasts = useMemo(() => {
    const from = new Date(fromDate); const to = new Date(toDate); to.setHours(23, 59, 59);
    return broadcasts.filter(b => { const d = new Date(b.createdAt); return d >= from && d <= to; });
  }, [broadcasts, fromDate, toDate]);

  const totalDelivered = filteredBroadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
  const totalFailed    = filteredBroadcasts.reduce((s, b) => s + (b.failureCount || 0), 0);
  const successRate    = (totalDelivered + totalFailed) > 0
    ? Math.round((totalDelivered / (totalDelivered + totalFailed)) * 100) : 0;

  const activityBars = useMemo(() => {
    const bars = Array(14).fill(0);
    broadcasts.forEach(b => {
      const daysAgo = Math.floor((SESSION_START - new Date(b.createdAt)) / 86400000);
      if (daysAgo < 14) bars[13 - daysAgo]++;
    });
    return bars;
  }, [broadcasts]);

  const downloadChartSVG = () => {
    const max = Math.max(1, ...activityBars);
    let rects = '';
    activityBars.forEach((v, i) => {
      const height = (v / max) * 100;
      rects += `<rect x="${i * 24 + 16}" y="${120 - height}" width="16" height="${height}" rx="2" fill="#f5b731" />`;
    });
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 150" width="380" height="150" style="background:#151521; border-radius:12px;">
      <text x="16" y="25" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="12">14-Day Broadcast Activity</text>
      ${rects}
      <line x1="16" y1="120" x2="360" y2="120" stroke="#333344" stroke-width="1" />
      <text x="16" y="138" fill="#777788" font-family="sans-serif" font-size="9">14d ago</text>
      <text x="330" y="138" fill="#777788" font-family="sans-serif" font-size="9">Today</text>
    </svg>`;
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `broadcast-activity-chart.svg`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    setGen(true);
    await new Promise(r => setTimeout(r, 900));
    setGen(false);
    setPreview(true);
  };

  const downloadCSV = () => {
    const header = 'Date,Platform,Prompt,Delivered,Failed,SuccessRate%\n';
    const rows = filteredBroadcasts.length > 0
      ? filteredBroadcasts.map(b => {
          const rate = (b.successCount || 0) + (b.failureCount || 0) > 0
            ? Math.round(((b.successCount || 0) / ((b.successCount || 0) + (b.failureCount || 0))) * 100) : 0;
          return `${b.createdAt},"${b.platform || ''}","${(b.prompt || '').replace(/"/g,'""')}",${b.successCount || 0},${b.failureCount || 0},${rate}`;
        }).join('\n')
      : 'N/A,N/A,No broadcasts in range,0,0,0';
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `bolt-${template}-${fromDate}-to-${toDate}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const t = activeTemplate;
    const lines = [
      `BOLT STUDIO PRO — ${t.label.toUpperCase()}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Date Range: ${fromDate} to ${toDate}`,
      '',
      '══════════════════════════════════════════════',
      '',
      template === 'weekly' ? [
        `Broadcasts:      ${MOCK_WEEKLY.broadcasts}`,
        `Delivered:       ${MOCK_WEEKLY.delivered}`,
        `Failed:          ${MOCK_WEEKLY.failed}`,
        `Success Rate:    ${MOCK_WEEKLY.successRate}%`,
        `Credits Used:    ${MOCK_WEEKLY.creditsUsed}`,
        `Top Platform:    ${MOCK_WEEKLY.topPlatform}`,
        `Peak Hour:       ${MOCK_WEEKLY.peakHour}`,
      ].join('\n') :
      template === 'cost' ? [
        `Total Spend:     $${MOCK_COST.totalSpend}`,
        `Input Tokens:    ${MOCK_COST.inputTokens}`,
        `Output Tokens:   ${MOCK_COST.outputTokens}`,
        '',
        'BREAKDOWN:',
        ...MOCK_COST.breakdown.map(b => `  ${b.model.padEnd(15)} $${b.cost}  (${b.pct}%)`),
      ].join('\n') :
      template === 'platform' ? [
        'PLATFORM DELIVERY RATES:',
        ...MOCK_PLATFORM.map(p => `  ${p.name.padEnd(12)} ${p.broadcasts} broadcasts  ${p.rate}% rate`),
      ].join('\n') :
      [
        `Broadcasts:      ${MOCK_MONTHLY.broadcasts}`,
        `Delivered:       ${MOCK_MONTHLY.delivered}`,
        `Failed:          ${MOCK_MONTHLY.failed}`,
        `Success Rate:    ${MOCK_MONTHLY.successRate}%`,
        `New Accounts:    ${MOCK_MONTHLY.newAccounts}`,
        `Workflows Run:   ${MOCK_MONTHLY.workflowsRun}`,
      ].join('\n'),
      '',
      '══════════════════════════════════════════════',
      `LIVE DATA (${fromDate} to ${toDate}):`,
      `Broadcasts: ${filteredBroadcasts.length}`,
      `Delivered:  ${totalDelivered}`,
      `Failed:     ${totalFailed}`,
      `Rate:       ${successRate}%`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `bolt-${template}-${fromDate}-to-${toDate}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(79,142,247,.18),rgba(167,139,250,.12))', border: '1px solid rgba(79,142,247,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📊</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Reports</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Templates · export · scheduled delivery</div>
          </div>
        </div>
        {showPreview && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={downloadCSV} style={{ fontSize: 10 }}>⬇ Download CSV</button>
            <button className="btn btn-ghost btn-sm" onClick={downloadPDF} style={{ fontSize: 10 }}>⬇ Download PDF</button>
          </div>
        )}
      </div>

      {/* Template selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => { setTemplate(t.id); setPreview(false); }} style={{
            padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            border: `1px solid ${template === t.id ? t.color : 'var(--border)'}`,
            background: template === t.id ? `${t.color}12` : 'var(--surface2)',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{t.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: template === t.id ? '#fff' : 'var(--muted2)', lineHeight: 1.2 }}>{t.label}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Date Range Picker + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
        <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Date Range:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 10, color: 'var(--muted)' }}>From</label>
          <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPreview(false); }}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface3)', color: '#e4e4ed', fontSize: 10, fontFamily: 'DM Mono,monospace', cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 10, color: 'var(--muted)' }}>To</label>
          <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPreview(false); }}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface3)', color: '#e4e4ed', fontSize: 10, fontFamily: 'DM Mono,monospace', cursor: 'pointer' }} />
        </div>
        {/* Quick presets */}
        {[['7d', 7], ['30d', 30], ['90d', 90]].map(([l, d]) => (
          <button key={l} className="btn btn-xs btn-ghost" style={{ fontSize: 9.5 }} onClick={() => {
            const from = new Date(); from.setDate(from.getDate() - d);
            setFromDate(from.toISOString().slice(0, 10));
            setToDate(new Date().toISOString().slice(0, 10));
            setPreview(false);
          }}>{l}</button>
        ))}
        <button className={`btn btn-gold btn-sm ${generating ? 'btn-pulse' : ''}`}
          onClick={handleGenerate} disabled={generating} style={{ marginLeft: 'auto', fontSize: 11 }}>
          {generating ? '⟳ Generating…' : '⚡ Generate Report'}
        </button>
      </div>

      {/* Scheduled reports toggle grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#e4e4ed' }}>📬 Weekly Scheduled Report</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
              {scheduled ? 'Reports will be auto-generated every Monday · preference saved' : 'Auto-generate this report every Monday'}
            </div>
          </div>
          <button onClick={() => setScheduled(s => !s)} style={{
            width: 42, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: scheduled ? 'var(--teal)' : 'rgba(255,255,255,0.1)', position: 'relative',
            transition: 'background 0.2s',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, left: scheduled ? 21 : 3, transition: 'left 0.2s',
            }} />
          </button>
          <span style={{ fontSize: 10, color: scheduled ? 'var(--teal)' : 'var(--muted)', fontWeight: 700 }}>
            {scheduled ? 'ON' : 'OFF'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#e4e4ed' }}>📧 Daily Email Simulation</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
              {dailyEmail ? 'Daily email simulated updates enabled · sending to inbox' : 'Simulate daily telemetry report emails'}
            </div>
          </div>
          <button onClick={() => setDailyEmail(s => !s)} style={{
            width: 42, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: dailyEmail ? 'var(--gold)' : 'rgba(255,255,255,0.1)', position: 'relative',
            transition: 'background 0.2s',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, left: dailyEmail ? 21 : 3, transition: 'left 0.2s',
            }} />
          </button>
          <span style={{ fontSize: 10, color: dailyEmail ? 'var(--gold)' : 'var(--muted)', fontWeight: 700 }}>
            {dailyEmail ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
          {/* Preview header */}
          <div style={{ padding: '14px 18px', background: 'rgba(0,0,0,0.18)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{activeTemplate.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{activeTemplate.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{fromDate} → {toDate} · generated {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-xs btn-teal" onClick={downloadCSV} style={{ fontSize: 9.5 }}>⬇ CSV</button>
              <button className="btn btn-xs btn-ghost" onClick={downloadPDF} style={{ fontSize: 9.5 }}>⬇ PDF</button>
            </div>
          </div>

          <div style={{ padding: '18px 20px' }}>
            {template === 'weekly'   && <WeeklyPreview />}
            {template === 'monthly'  && <MonthlyPreview />}
            {template === 'platform' && <PlatformPreview />}
            {template === 'cost'     && <CostPreview />}

            {/* Live data from store */}
            {filteredBroadcasts.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>
                    📅 Live Broadcast Data ({fromDate} → {toDate})
                  </span>
                  <button className="btn btn-ghost btn-xs" onClick={downloadChartSVG} style={{ fontSize: 9.5, color: 'var(--gold)', border: '1px solid rgba(245,183,49,0.3)' }}>
                    📊 Download Chart SVG
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                  {[
                    { label: 'Broadcasts', val: filteredBroadcasts.length, color: 'var(--gold)' },
                    { label: 'Delivered',  val: totalDelivered, color: 'var(--teal)' },
                    { label: 'Failed',     val: totalFailed, color: 'var(--red)' },
                    { label: 'Rate',       val: `${successRate}%`, color: '#10b981' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '10px 12px', borderTop: `2px solid ${s.color}` }}>
                      <div style={{ fontSize: 8.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <MiniBarChart data={activityBars} color="var(--gold)" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: 'var(--muted)', marginTop: 4, fontFamily: 'DM Mono,monospace' }}>
                  <span>14d ago</span><span>Today</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!showPreview && !generating && (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--surface2)', borderRadius: 14, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{activeTemplate.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>{activeTemplate.label}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 18 }}>{activeTemplate.desc} — select a date range and click Generate</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-gold btn-sm" onClick={handleGenerate}>⚡ Generate Report</button>
            <button className="btn btn-ghost btn-sm" onClick={downloadCSV} style={{ fontSize: 11 }}>⬇ Export CSV</button>
          </div>
        </div>
      )}
    </div>
  );
}
