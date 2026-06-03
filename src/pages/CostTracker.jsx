import { useState, useMemo } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { useToast } from '../components/Toast';
import { sound } from '../lib/soundEngine';

function Sparkline({ data, color, showArea = false }) {
  if (!data?.length) return null;
  const max = Math.max(1, ...data);
  const h = 28, w = 80;
  
  // Safe divisor check to avoid division-by-zero (yielding NaN)
  const divisor = data.length > 1 ? data.length - 1 : 1;
  const pts = data.map((v, i) => `${(i / divisor) * w},${h - (v / max) * h}`).join(' ');
  
  const lastX = w;
  const lastY = h - (data[data.length - 1] / max) * h;

  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {showArea && data.length > 1 && (
        <polygon
          points={`0,${h} ${pts} ${w},${h}`}
          fill={color}
          opacity="0.12"
        />
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

function generateSpend(days, base) {
  // Stable random generation seeded roughly by base index to prevent flickering
  return Array.from({ length: days }, (_, i) => +(base * (0.75 + Math.sin(i) * 0.45)).toFixed(2));
}

const PLANS = {
  bolt:    { free: 5,   pro: 20,   team: 50,   price: { pro: 20, team: 40 } },
  lovable: { free: 100, pro: 1000, team: 5000, price: { pro: 25, team: 75 } },
  manus:   { free: 10,  pro: 100,  team: 500,  price: { pro: 30, team: 80 } },
  replit:  { free: 0,   pro: 50,   team: 200,  price: { pro: 20, team: 65 } },
  claude:  { free: 0,   pro: 100,  team: 500,  price: { pro: 20, team: 60 } },
  cursor:  { free: 50,  pro: 500,  team: 2000, price: { pro: 20, team: 40 } },
  v0:      { free: 200, pro: 2000, team: 10000,price: { pro: 20, team: 50 } },
};

export default function CostTracker({ onNav }) {
  const { accounts } = useStore();
  const toast = useToast();
  const [period, setPeriod]   = useState(30);
  const [currency, setCurrency] = useState('USD');
  const [showArea, setShowArea] = useState(false);
  const [spendLimit, setSpendLimit] = useState(150);

  const rates = { USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278 };
  const fx = rates[currency] || 1;
  const sym = { USD: '$', EUR: '€', GBP: '£', PKR: '₨' }[currency] || '$';

  // Generate cost data per account
  const costData = useMemo(() => accounts.map(acc => {
    const pl = PLATFORMS.find(p => p.id === acc.platform);
    const plan = PLANS[acc.platform] || PLANS.bolt;
    const dailyBase = plan.price.pro / 30;
    const spend = generateSpend(period, dailyBase);
    const total  = spend.reduce((s, v) => s + v, 0);
    const avg    = total / period;
    const trend  = spend[spend.length-1] - spend[0];
    return { acc, pl, plan, spend, total, avg, trend };
  }), [accounts, period]);

  const totalSpend  = costData.reduce((s, d) => s + d.total, 0);
  const avgDaily    = totalSpend / period;
  const projected   = avgDaily * 30;

  const byPlatform = PLATFORMS.map(p => ({
    ...p,
    spend: costData.filter(d => d.acc.platform === p.id).reduce((s, d) => s + d.total, 0),
    count: accounts.filter(a => a.platform === p.id).length,
  })).filter(p => p.count > 0).sort((a, b) => b.spend - a.spend);

  const fmt = (n) => `${sym}${(n * fx).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isLimitExceeded = totalSpend > spendLimit;

  // Feature 14: Export spend CSV report
  const handleExportCSV = () => {
    sound.play('success');
    if (!costData.length) {
      toast.error('No cost data to export');
      return;
    }
    const headers = ['Account Name', 'Platform', 'Subscription Cost', 'Total Period Spend', 'Daily Average', 'Trend Direction'];
    const rows = costData.map(d => [
      d.acc.name,
      d.pl?.name || d.acc.platform,
      d.plan.price.pro,
      (d.total * fx).toFixed(2),
      (d.avg * fx).toFixed(2),
      d.trend > 0 ? 'Increase' : 'Decrease'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bsp_cost_report_${period}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Cost breakdown exported as CSV!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Spend Limit Warning Alert Banner (Feature 11) */}
      {isLimitExceeded && (
        <div style={{
          background: 'rgba(255,95,95,0.08)',
          border: '1px solid rgba(255,95,95,0.25)',
          color: 'var(--red)',
          padding: '12px 16px',
          borderRadius: 12,
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'pulse 3s infinite'
        }}>
          <span>⚠️</span>
          <span>
            <strong>Spend Limit Alert:</strong> Total actual spend of <strong>{fmt(totalSpend)}</strong> exceeds your configured target budget threshold limit of <strong>{fmt(spendLimit)}</strong>. Consider pausing automated workflows.
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(245,183,49,.2),rgba(249,115,22,.12))', border: '1px solid rgba(245,183,49,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Cost Tracker</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Spending analytics across all platforms</div>
          </div>
        </div>
        
        {/* Toggle switches and selectors */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Sparkline style toggle (Feature 13) */}
          <button
            onClick={() => { sound.play('click'); setShowArea(!showArea); }}
            className={`btn btn-xs ${showArea ? 'btn-teal' : 'btn-ghost'}`}
            style={{ fontSize: 10, padding: '4px 8px' }}
          >
            📉 {showArea ? 'Fill Area' : 'Line Only'}
          </button>

          {/* Export Report CSV button (Feature 14) */}
          <button
            onClick={handleExportCSV}
            className="btn btn-xs btn-ghost"
            style={{ fontSize: 10, padding: '4px 8px', color: 'var(--gold)' }}
          >
            📥 Export CSV
          </button>

          <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>

          {/* Period selector */}
          {[7, 30, 90].map(p => (
            <button key={p} onClick={() => { sound.play('click'); setPeriod(p); }} className={`btn btn-xs ${period === p ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
              {p}d
            </button>
          ))}

          {/* Currency selection (Feature 12) */}
          <select value={currency} onChange={e => { sound.play('click'); setCurrency(e.target.value); }}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, padding: '4px 8px', color: '#e4e4ed', fontSize: 10, outline: 'none', cursor: 'pointer' }}>
            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Target spend setting panel (Feature 11) */}
      <div style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Monthly Budget Target</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Set a spend alarm threshold to prevent credit exhaustion</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="range"
            min="20"
            max="500"
            step="10"
            value={spendLimit}
            onChange={e => setSpendLimit(Number(e.target.value))}
            style={{ width: 140, accentColor: 'var(--gold)' }}
          />
          <span style={{ minWidth: 60, fontSize: 12, fontWeight: 900, color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}>
            {fmt(spendLimit)}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          { label: `${period}d Spend`,    val: fmt(totalSpend),   color: 'var(--gold)',   sub: 'total across all accounts' },
          { label: 'Daily Average',       val: fmt(avgDaily),     color: 'var(--teal)',   sub: `last ${period} days` },
          { label: '30d Projection',      val: fmt(projected),    color: isLimitExceeded ? 'var(--red)' : 'var(--blue)', sub: 'if current rate continues' },
          { label: 'Accounts Tracked',    val: accounts.length,   color: 'var(--purple)', sub: 'with cost data' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderTop: `2px solid ${s.color}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1.1 }}>{s.val}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Platform breakdown */}
      {byPlatform.length > 0 && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,.15)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Platform Breakdown</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {byPlatform.map(p => {
              const pct = totalSpend > 0 ? (p.spend / totalSpend * 100) : 0;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px' }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#dde0f0' }}>{p.name}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: p.color, fontFamily: 'DM Mono,monospace' }}>{fmt(p.spend)}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', width: 35, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-account table */}
      {costData.length > 0 ? (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,.15)', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '180px 80px 80px 80px 80px 1fr', gap: 0 }}>
            {['Account','Platform','Total','Daily Avg','Trend','Sparkline'].map(h => (
              <span key={h} style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</span>
            ))}
          </div>
          {costData.map((d, i) => (
            <div key={d.acc.id} style={{ display: 'grid', gridTemplateColumns: '180px 80px 80px 80px 80px 1fr', gap: 0, padding: '10px 16px', borderBottom: i < costData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#dde0f0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d.acc.name}</span>
              <span style={{ fontSize: 10.5, color: d.pl?.color || 'var(--muted2)' }}>{d.pl?.icon} {d.pl?.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', fontFamily: 'DM Mono,monospace' }}>{fmt(d.total)}</span>
              <span style={{ fontSize: 10.5, color: 'var(--muted2)', fontFamily: 'DM Mono,monospace' }}>{fmt(d.avg)}</span>
              <span style={{ fontSize: 11, color: d.trend > 0 ? 'var(--red)' : 'var(--teal)', fontFamily: 'DM Mono,monospace' }}>
                {d.trend > 0 ? '↑' : '↓'} {fmt(Math.abs(d.trend))}
              </span>
              <Sparkline data={d.spend} color={d.pl?.color || 'var(--gold)'} showArea={showArea} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--surface2)', borderRadius: 14, border: '1px dashed var(--border)', color: 'var(--muted)', fontSize: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💰</div>
          <div style={{ fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>No accounts connected</div>
          <div style={{ fontSize: 11, marginBottom: 16 }}>Connect accounts to track spending across platforms</div>
          <button className="btn btn-gold btn-sm" onClick={() => onNav?.('accounts')}>⚡ Connect Account</button>
        </div>
      )}
    </div>
  );
}
