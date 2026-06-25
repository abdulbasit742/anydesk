import { useState, useEffect } from 'react';

const injectStyles = () => {
  if (document.getElementById('usagequotas-styles')) return;
  const s = document.createElement('style');
  s.id = 'usagequotas-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes uq-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes uq-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes uq-fill { from{stroke-dashoffset:283} to{stroke-dashoffset:var(--to,0)} }
    @keyframes uq-bar { from{width:0} to{width:var(--w,0)} }
    .uq-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .uq-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .uq-row:hover { background:rgba(255,255,255,0.03)!important; }
    .uq-tier-card { transition:all 0.2s; cursor:pointer; }
    .uq-tier-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.5)!important; }
  `;
  document.head.appendChild(s);
};

const V = { gold:'#f5b731', teal:'#22d3ee', purple:'#a78bfa', surface:'#0e0e16', surface2:'#16161e', surface3:'#1d1d28', border:'rgba(255,255,255,0.07)', muted:'#6e7191', red:'#ef4444', blue:'#3b82f6', green:'#22c55e', orange:'#fb923c' };

const TIERS = [
  { id:'free', name:'Free', price:0, color:'#888', features:['500 API calls/month','2 connected accounts','1 active workflow','Community support','1GB storage'], limits:{ api:500, accounts:2, workflows:1, storage:1 } },
  { id:'pro', name:'Pro', price:49, color:V.gold, popular:true, features:['50,000 API calls/month','12 connected accounts','Unlimited workflows','Priority email support','50GB storage','AI Optimizer','Broadcast Studio'], limits:{ api:50000, accounts:12, workflows:999, storage:50 } },
  { id:'team', name:'Team', price:149, color:V.teal, features:['500,000 API calls/month','50 connected accounts','Unlimited everything','24/7 chat support','500GB storage','All Pro features','Team Hub + Collab','Advanced analytics'], limits:{ api:500000, accounts:50, workflows:999, storage:500 } },
  { id:'enterprise', name:'Enterprise', price:499, color:V.purple, features:['Unlimited API calls','Unlimited accounts','Dedicated infrastructure','SLA + phone support','5TB storage','All Team features','Custom AI models','On-prem deployment'], limits:{ api:Infinity, accounts:Infinity, workflows:999, storage:5000 } },
];

const CURRENT_USAGE = {
  api: { used: 38420, limit: 50000, label: 'API Calls' },
  accounts: { used: 8, limit: 12, label: 'Connected Accounts' },
  workflows: { used: 14, limit: 999, label: 'Active Workflows' },
  storage: { used: 22.4, limit: 50, label: 'Storage (GB)' },
  broadcasts: { used: 847, limit: 5000, label: 'Broadcasts/month' },
  tokens: { used: 1240000, limit: 5000000, label: 'AI Tokens' },
};

const BILLING_HISTORY = [
  { id:1, date:'2026-06-01', amount:49, status:'paid', desc:'Pro Plan — June 2026', inv:'INV-2026-06-001' },
  { id:2, date:'2026-05-01', amount:49, status:'paid', desc:'Pro Plan — May 2026', inv:'INV-2026-05-001' },
  { id:3, date:'2026-04-01', amount:49, status:'paid', desc:'Pro Plan — April 2026', inv:'INV-2026-04-001' },
  { id:4, date:'2026-03-01', amount:49, status:'paid', desc:'Pro Plan — March 2026', inv:'INV-2026-03-001' },
  { id:5, date:'2026-02-01', amount:0, status:'trial', desc:'Free Trial — February 2026', inv:'INV-2026-02-001' },
];

const OVERAGE_RATES = [
  { metric:'API Calls', unit:'per 1K calls', rate:'$0.10', tier:'Pro', current:'$0.00' },
  { metric:'Storage', unit:'per GB/month', rate:'$0.08', tier:'Pro', current:'$0.00' },
  { metric:'Broadcasts', unit:'per 100 sends', rate:'$0.50', tier:'Pro', current:'$0.00' },
  { metric:'AI Tokens', unit:'per 1M tokens', rate:'$2.00', tier:'Pro', current:'$0.00' },
];

function CircleGauge({ pct, color, size = 90 }) {
  const r = 38, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const col = pct > 90 ? V.red : pct > 70 ? V.gold : color;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke={V.surface3} strokeWidth="7" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={col} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s' }} />
      <text x="45" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="800" fill={col} fontFamily="Syne, sans-serif">{Math.round(pct)}%</text>
    </svg>
  );
}


function DailyChart({ data, color }) {
  const w = 300, h = 60;
  const max = Math.max(...data, 1);
  const bw = w / data.length - 2;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * (h - 4));
        const pct = v / CURRENT_USAGE.api.limit * 100;
        const col = pct > 90 ? V.red : pct > 70 ? V.gold : color;
        return (
          <rect key={i} x={i * (bw + 2)} y={h - bh} width={bw} height={bh}
            fill={col} opacity="0.8" rx="1" style={{ transition: 'all 0.3s' }}>
            <title>{v.toLocaleString()} calls</title>
          </rect>
        );
      })}
    </svg>
  );
}

export default function UsageQuotas() {
  useEffect(() => { injectStyles(); }, []);
  const [activeTier, setActiveTier] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [payMethod, setPayMethod] = useState('card');
  const [usage] = useState(CURRENT_USAGE);

  const [dailyData] = useState(() => Array.from({ length: 30 }, (_, i) => {
    const day = i / 30;
    return Math.floor(800 + Math.sin(day * Math.PI * 3) * 400 + day * 1200 + Math.random() * 200);
  }));

  const predictedOverage = (usage.api.used / usage.api.limit) > 0.75;

  const annualDiscount = 0.2;


  const fmtNum = (n) => {
    if (n === Infinity) return '∞';
    if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #0f1420 50%, #0e0e16 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>📊</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Usage & Quotas</h1>
              <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Monitor consumption, manage billing, and upgrade plans</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(245,183,49,0.15)', border: `1px solid ${V.gold}44`, fontSize: 11, fontWeight: 800, color: V.gold }}>⚡ PRO PLAN</div>
            <button className="uq-btn" onClick={() => setShowUpgrade(v => !v)} style={{ padding: '8px 18px', borderRadius: 10, background: `linear-gradient(135deg, ${V.gold}, #e0a020)`, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, transition: 'all 0.2s', fontFamily: 'Syne, sans-serif' }}>⬆ Upgrade Plan</button>
          </div>
        </div>

        {/* Usage Gauges Row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {Object.entries(usage).map(([key, q]) => {
            const pct = q.limit === Infinity ? 0 : (q.used / q.limit) * 100;
            return (
              <div key={key} className="uq-card" style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 180, transition: 'all 0.2s' }}>
                <CircleGauge pct={pct} color={V.teal} size={72} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: V.muted, marginBottom: 4, fontWeight: 700 }}>{q.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'DM Mono, monospace' }}>
                    {fmtNum(q.used)}<span style={{ color: V.muted, fontSize: 11, fontWeight: 400 }}> / {fmtNum(q.limit)}</span>
                  </div>
                  {pct > 75 && <div style={{ fontSize: 10, color: pct > 90 ? V.red : V.gold, marginTop: 3, fontWeight: 700 }}>⚠ {pct > 90 ? 'CRITICAL' : 'HIGH USAGE'}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Predicted overage banner */}
        {predictedOverage && (
          <div style={{ marginTop: 16, padding: '12px 18px', borderRadius: 10, background: 'rgba(245,183,49,0.08)', border: `1px solid ${V.gold}44`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: V.gold }}>API quota 76% consumed — projected overage in 8 days</div>
              <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>Upgrade to Team plan to avoid overage charges of ~$12.40 at current rate</div>
            </div>
            <button className="uq-btn" onClick={() => setShowUpgrade(true)} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, background: `linear-gradient(135deg,${V.gold},#e0a020)`, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 11, transition: 'all 0.2s', flexShrink: 0 }}>Upgrade Now</button>
          </div>
        )}
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* DAILY USAGE CHART */}
        <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>📈 Daily API Call Volume</div>
              <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>Last 30 days — color transitions to red near quota limit</div>
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: V.muted }}>Avg: <span style={{ color: V.gold, fontWeight: 700 }}>1,281/day</span></div>
          </div>
          <DailyChart data={dailyData} color={V.teal} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: V.muted, marginTop: 8, fontFamily: 'DM Mono, monospace' }}>
            <span>May 2</span><span>May 10</span><span>May 18</span><span>May 26</span><span>Jun 1</span>
          </div>
        </div>

        {/* PLAN COMPARISON / UPGRADE */}
        {showUpgrade && (
          <div style={{ animation: 'uq-fadeup 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>🚀 Choose Your Plan</div>
              <div style={{ display: 'flex', gap: 0, border: `1px solid ${V.border}`, borderRadius: 8, overflow: 'hidden' }}>
                {['monthly', 'annual'].map(c => (
                  <button key={c} onClick={() => setBillingCycle(c)} style={{ padding: '6px 16px', border: 'none', background: billingCycle === c ? V.gold : 'transparent', color: billingCycle === c ? '#000' : V.muted, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Syne, sans-serif', transition: 'all 0.2s' }}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}{c === 'annual' && ' (-20%)'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {TIERS.map(tier => {
                const price = billingCycle === 'annual' ? Math.round(tier.price * (1 - annualDiscount)) : tier.price;
                const isCurrent = tier.id === 'pro';
                const isSelected = tier.id === activeTier;
                return (
                  <div key={tier.id} className="uq-tier-card" onClick={() => setActiveTier(tier.id)} style={{ background: V.surface2, border: `2px solid ${isSelected ? tier.color : V.border}`, borderRadius: 16, padding: '24px', position: 'relative', boxShadow: isSelected ? `0 0 20px ${tier.color}33` : 'none' }}>
                    {tier.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: V.gold, color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 999 }}>POPULAR</div>}
                    {isCurrent && <div style={{ position: 'absolute', top: -10, left: 16, background: V.teal, color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 999 }}>CURRENT</div>}
                    <div style={{ fontSize: 16, fontWeight: 800, color: tier.color, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>
                      ${price}<span style={{ fontSize: 12, color: V.muted, fontWeight: 400 }}>/mo</span>
                    </div>
                    {billingCycle === 'annual' && tier.price > 0 && (
                      <div style={{ fontSize: 10, color: V.green, marginBottom: 12, fontWeight: 700 }}>Save ${(tier.price * 12 * annualDiscount).toFixed(0)}/year</div>
                    )}
                    <div style={{ height: 1, background: V.border, margin: '12px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {tier.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#dde0f0' }}>
                          <span style={{ color: tier.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button className="uq-btn" style={{ width: '100%', padding: '10px', borderRadius: 10, background: isCurrent ? 'transparent' : `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`, color: isCurrent ? V.muted : tier.id === 'pro' || tier.id === 'free' ? '#000' : '#fff', border: isCurrent ? `1px solid ${V.border}` : 'none', cursor: isCurrent ? 'default' : 'pointer', fontWeight: 800, fontSize: 12, transition: 'all 0.2s', fontFamily: 'Syne, sans-serif' }}>
                      {isCurrent ? 'Current Plan' : `Upgrade to ${tier.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUOTA DETAILS TABLE */}
        <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${V.border}` }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>📋 Quota Details</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: V.surface3 }}>{['Resource', 'Used', 'Limit', 'Usage %', 'Status', 'Resets'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {Object.entries(usage).map(([key, q]) => {
                  const pct = q.limit === Infinity ? 0 : Math.min(100, (q.used / q.limit) * 100);
                  const col = pct > 90 ? V.red : pct > 70 ? V.gold : V.green;
                  return (
                    <tr key={key} className="uq-row" style={{ borderTop: `1px solid ${V.border}`, transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px', color: '#e4e4ed', fontWeight: 600 }}>{q.label}</td>
                      <td style={{ padding: '12px 16px', color: '#e4e4ed', fontFamily: 'DM Mono, monospace' }}>{fmtNum(q.used)}</td>
                      <td style={{ padding: '12px 16px', color: V.muted, fontFamily: 'DM Mono, monospace' }}>{fmtNum(q.limit)}</td>
                      <td style={{ padding: '12px 16px', minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: V.surface3, borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 999, transition: 'width 1s ease' }} />
                          </div>
                          <span style={{ fontSize: 11, color: col, fontWeight: 700, fontFamily: 'DM Mono, monospace', minWidth: 36 }}>{Math.round(pct)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: `${col}22`, color: col }}>
                          {pct > 90 ? '🔴 Critical' : pct > 70 ? '🟡 High' : '🟢 Normal'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: V.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Jun 30, 2026</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OVERAGE RATES */}
        <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${V.border}` }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>💸 Overage Rates</div>
            <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>Charges applied automatically if quota limits are exceeded</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: V.surface3 }}>{['Resource', 'Unit', 'Rate', 'Your Plan', 'Est. Current Overage'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {OVERAGE_RATES.map(r => (
                  <tr key={r.metric} className="uq-row" style={{ borderTop: `1px solid ${V.border}`, transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 16px', color: '#e4e4ed', fontWeight: 600 }}>{r.metric}</td>
                    <td style={{ padding: '12px 16px', color: V.muted, fontSize: 11 }}>{r.unit}</td>
                    <td style={{ padding: '12px 16px', color: V.gold, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{r.rate}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(245,183,49,0.15)', color: V.gold, fontSize: 10, fontWeight: 700 }}>{r.tier}</span></td>
                    <td style={{ padding: '12px 16px', color: V.green, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{r.current}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BILLING HISTORY */}
        <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>🧾 Billing History</div>
            <button className="uq-btn" style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.2s' }}>Export All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: V.surface3 }}>{['Date', 'Description', 'Amount', 'Status', 'Invoice'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {BILLING_HISTORY.map(b => (
                  <tr key={b.id} className="uq-row" style={{ borderTop: `1px solid ${V.border}`, transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 16px', color: V.muted, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{b.date}</td>
                    <td style={{ padding: '12px 16px', color: '#e4e4ed' }}>{b.desc}</td>
                    <td style={{ padding: '12px 16px', color: '#fff', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>${b.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: b.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: b.status === 'paid' ? V.green : V.blue }}>
                        {b.status === 'paid' ? '✓ Paid' : '🎟 Trial'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button className="uq-btn" style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${V.border}`, background: 'transparent', color: V.teal, cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace', transition: 'all 0.2s' }}>⬇ {b.inv}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 18 }}>💳 Payment Method</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            {['card', 'paypal', 'crypto'].map(m => (
              <div key={m} onClick={() => setPayMethod(m)} style={{ padding: '12px 20px', borderRadius: 10, border: `1px solid ${payMethod === m ? V.gold : V.border}`, background: payMethod === m ? 'rgba(245,183,49,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{m === 'card' ? '💳' : m === 'paypal' ? '🅿️' : '₿'}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: payMethod === m ? V.gold : V.muted, textTransform: 'capitalize' }}>{m}</span>
              </div>
            ))}
          </div>
          {payMethod === 'card' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {[['Card Number', '•••• •••• •••• 4242'], ['Name on Card', 'Bolt Studio User'], ['Expiry', '12/28'], ['CVV', '•••']].map(([label, val]) => (
                <div key={label}>
                  <label style={{ fontSize: 10, color: V.muted, fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <input defaultValue={val} style={{ width: '100%', padding: '8px 12px', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Mono, monospace' }} />
                </div>
              ))}
            </div>
          )}
          {payMethod === 'paypal' && <div style={{ padding: '20px', textAlign: 'center', color: V.muted, fontSize: 12, border: `1px solid ${V.border}`, borderRadius: 10 }}>🅿️ PayPal connected — billing@myworkspace.com</div>}
          {payMethod === 'crypto' && <div style={{ padding: '20px', textAlign: 'center', color: V.muted, fontSize: 12, border: `1px solid ${V.border}`, borderRadius: 10 }}>₿ Pay with USDC, BTC, or ETH on Ethereum Mainnet</div>}
          <div style={{ marginTop: 14 }}>
            <button className="uq-btn" style={{ padding: '10px 24px', borderRadius: 10, background: `linear-gradient(135deg, ${V.gold}, #e0a020)`, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, transition: 'all 0.2s', fontFamily: 'Syne, sans-serif' }}>Save Payment Details</button>
          </div>
        </div>

      </div>
    </div>
  );
}
