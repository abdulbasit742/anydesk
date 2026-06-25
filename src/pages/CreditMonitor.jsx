import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { sound } from '../lib/soundEngine';

/* ── helpers ─────────────────────────────────────────────── */
function rand(min, max) { return Math.random() * (max - min) + min; }

function ago(iso) {
  if (!iso) return '—';
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return `${~~d}s ago`;
  if (d < 3600) return `${~~(d / 60)}m ago`;
  return `${~~(d / 3600)}h ago`;
}



/* ── Radial burn gauge ───────────────────────────────────── */
function BurnGauge({ pct, color, label, size = 80 }) {
  const R = size / 2 - 8;
  const circ = 2 * Math.PI * R;
  const arc  = circ * 0.75; // 270° sweep
  const fill = arc * Math.min(1, pct / 100);
  const cx = size / 2, cy = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="7"
          strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease', filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="13" fontWeight="800" fontFamily="DM Mono,monospace"
          style={{ transform: 'rotate(-135deg)', transformOrigin: `${cx}px ${cy}px` }}>
          {~~pct}%
        </text>
      </svg>
      <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}

/* ── Mini sparkline bar ──────────────────────────────────── */
function MiniBar({ history, color }) {
  const max = Math.max(1, ...history);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28, flex: 1 }}>
      {history.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${Math.max(8, (v / max) * 100)}%`,
          background: i === history.length - 1 ? color : `${color}55`,
          borderRadius: '2px 2px 0 0',
          transition: 'height 0.4s ease',
          boxShadow: i === history.length - 1 ? `0 0 6px ${color}` : 'none',
        }} />
      ))}
    </div>
  );
}

/* ── Credit alert banner ─────────────────────────────────── */
function AlertBanner({ account, platform }) {
  const credits = account.credits ?? 0;
  const isEmpty = credits <= 0;
  const color   = isEmpty ? 'var(--red)' : 'var(--gold)';
  const pl      = PLATFORMS.find(p => p.id === platform);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: isEmpty ? 'rgba(255,95,95,0.07)' : 'rgba(245,183,49,0.07)',
      border: `1px solid ${isEmpty ? 'rgba(255,95,95,0.25)' : 'rgba(245,183,49,0.25)'}`,
      borderRadius: 10, animation: 'fadeIn 0.3s ease',
    }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{pl?.icon || '⚠️'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color, lineHeight: 1.3 }}>
          {isEmpty ? 'Credits exhausted' : 'Low credits'} — {account.name || pl?.name}
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
          {credits} credits remaining · {platform} platform
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color, fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
        {credits}cr
      </span>
    </div>
  );
}

/* ── Per-account credit row ──────────────────────────────── */
function AccountRow({ account, history }) {
  const pl     = PLATFORMS.find(p => p.id === account.platform);
  const credits = account.credits ?? Math.round(rand(5, 95));
  const burnRate = account.burnRate ?? Math.round(rand(1, 8));
  const est     = burnRate > 0 ? Math.round(credits / burnRate) : 999;
  const color   = credits < 20 ? 'var(--red)' : credits < 50 ? 'var(--gold)' : 'var(--teal)';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr 90px 120px 80px 60px',
      alignItems: 'center', gap: 10,
      padding: '9px 14px',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 15 }}>{pl?.icon || '?'}</span>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.2 }}>{account.name || 'Unnamed'}</div>
        <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>{pl?.name} · {ago(account.lastUsed)}</div>
      </div>
      {/* Credit bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>
          <span style={{ color, fontWeight: 700 }}>{credits}</span>
          <span>/ 100</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${credits}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease', boxShadow: `0 0 5px ${color}` }} />
        </div>
      </div>
      {/* Mini bar history */}
      <MiniBar history={history || Array.from({ length: 10 }, () => rand(20, 90))} color={color} />
      {/* Burn rate */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted2)', fontFamily: 'DM Mono,monospace' }}>{burnRate}/hr</div>
        <div style={{ fontSize: 9, color: 'var(--muted)' }}>burn rate</div>
      </div>
      {/* ETA */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: est < 12 ? 'var(--red)' : 'var(--muted2)', fontFamily: 'DM Mono,monospace' }}>
          {est > 500 ? '∞' : `${est}h`}
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)' }}>est. left</div>
      </div>
    </div>
  );
}

/* ── Platform summary card ───────────────────────────────── */
function PlatformSummaryCard({ platform, accounts }) {
  const accs    = accounts.filter(a => a.platform === platform.id);
  const avgCr   = accs.length > 0
    ? Math.round(accs.reduce((s, a) => s + (a.credits ?? rand(10, 90)), 0) / accs.length)
    : 0;
  const color   = avgCr < 20 ? 'var(--red)' : avgCr < 50 ? 'var(--gold)' : 'var(--teal)';
  const active  = accs.filter(a => a.status === 'active').length;

  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${platform.color}`,
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: `${platform.color}14`, filter: 'blur(20px)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{platform.icon}</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{platform.name}</div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>{active}/{accs.length} active</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <BurnGauge pct={avgCr} color={color} label="avg cr" size={56} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted)' }}>
        <span>Accounts: <strong style={{ color: '#e4e4ed' }}>{accs.length}</strong></span>
        <span style={{ color }}>Avg: <strong>{avgCr}cr</strong></span>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────── */
export default function CreditMonitor({ onNav }) {
  const { accounts } = useStore();

  const [histMap, setHistMap] = useState({});
  const [filter, setFilter] = useState('all'); // all | low | active
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState('idle'); // idle | sending | success

  /* Seed stable credits + burn rates per account */
  const enriched = useMemo(() => {
    return accounts.map(a => ({
      ...a,
      credits:  a.credits  ?? (Math.abs(hashCode(a.id)) % 91) + 5,
      burnRate: a.burnRate ?? (Math.abs(hashCode(a.id + 'b')) % 8) + 1,
    }));
  }, [accounts]);

  /* Live tick: push new history point every 3s */
  useEffect(() => {
    const iv = setInterval(() => {
      setHistMap(prev => {
        const next = { ...prev };
        enriched.forEach(a => {
          const arr = [...(prev[a.id] || Array.from({ length: 14 }, () => rand(20, 90)))];
          arr.shift();
          arr.push(Math.max(0, (arr[arr.length - 1] || 50) - rand(0, 2)));
          next[a.id] = arr;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, [enriched]);

  /* Totals */
  const totalAccounts = enriched.length;
  const lowCreditAccts = enriched.filter(a => (a.credits ?? 50) < 20);
  const avgCredit = totalAccounts > 0
    ? Math.round(enriched.reduce((s, a) => s + (a.credits ?? 50), 0) / totalAccounts)
    : 0;
  const totalBurnRate = enriched.reduce((s, a) => s + (a.burnRate ?? 2), 0);
  const estHours = totalBurnRate > 0
    ? Math.round(enriched.reduce((s, a) => s + (a.credits ?? 50), 0) / totalBurnRate)
    : 999;

  /* Filtered accounts */
  const filteredAccounts = useMemo(() => {
    if (filter === 'low')    return enriched.filter(a => (a.credits ?? 50) < 20);
    if (filter === 'active') return enriched.filter(a => a.status === 'active');
    return enriched;
  }, [enriched, filter]);

  const avgColor = avgCredit < 20 ? 'var(--red)' : avgCredit < 50 ? 'var(--gold)' : 'var(--teal)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg,rgba(245,183,49,.18),rgba(255,95,95,.1))',
            border: '1px solid rgba(245,183,49,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>💳</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Credit Monitor</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {totalAccounts} accounts · live burn tracking · updates every 3s
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowWebhookModal(true)} style={{ fontSize: 11 }}>🤖 Test Webhook simulation</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav?.('accounts')} style={{ fontSize: 11 }}>🔌 Manage Accounts</button>
          <button className="btn btn-gold btn-sm" onClick={() => onNav?.('screenwall')} style={{ fontSize: 11 }}>⚡ Screen Wall</button>
        </div>
      </div>

      {/* ── Hero Stats ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Avg Credits',    val: avgCredit,             suffix: 'cr', color: avgColor,         icon: '💳', sub: 'across all accounts' },
          { label: 'Total Burn/hr',  val: totalBurnRate,         suffix: '/hr', color: 'var(--red)',    icon: '🔥', sub: 'combined consumption' },
          { label: 'Est. Lifetime',  val: estHours > 500 ? '∞' : estHours, suffix: estHours > 500 ? '' : 'h', color: 'var(--teal)', icon: '⏱', sub: 'until depletion' },
          { label: 'Low Credit',     val: lowCreditAccts.length, suffix: '',    color: lowCreditAccts.length > 0 ? 'var(--red)' : 'var(--teal)', icon: '⚠️', sub: 'accounts < 20cr' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderTop: `2px solid ${s.color}`, borderRadius: 12, padding: '16px 18px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 55, height: 55, borderRadius: '50%', background: `${s.color}10`, filter: 'blur(16px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{s.label}</span>
              <span style={{ fontSize: 16, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {s.val}{s.suffix}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Platform Summary Grid ────────────────────────────── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
          Platform Overview
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {PLATFORMS.map(p => (
            <PlatformSummaryCard key={p.id} platform={p} accounts={enriched} />
          ))}
        </div>
      </div>

      {/* ── Low Credit Alerts ────────────────────────────────── */}
      {lowCreditAccts.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse 1.2s infinite', boxShadow: '0 0 6px var(--red)' }} />
            Credit Alerts ({lowCreditAccts.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lowCreditAccts.map(a => (
              <AlertBanner key={a.id} account={a} platform={a.platform} />
            ))}
          </div>
        </div>
      )}

      {/* Features 26 & 27: Credit exhaustion timeline display and webhook simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, alignItems: 'start' }}>

        {/* ── Per-Account Table ────────────────────────────────── */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Account Credit Tracker</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {['all', 'low', 'active'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-xs ${filter === f ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ fontSize: 10, textTransform: 'capitalize' }}
                >
                  {f === 'low' ? '⚠ Low' : f === 'active' ? '● Active' : 'All'}
                  {f === 'all' && ` (${totalAccounts})`}
                  {f === 'low' && ` (${lowCreditAccts.length})`}
                  {f === 'active' && ` (${enriched.filter(a => a.status === 'active').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 90px 120px 80px 60px',
            gap: 10, padding: '7px 14px',
            background: 'rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            {['', 'Account', 'Credits', 'History (14pts)', 'Burn/hr', 'Est.'].map((col, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          {filteredAccounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💳</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                {totalAccounts === 0 ? 'No accounts connected' : 'No accounts match filter'}
              </div>
              <div style={{ fontSize: 11, marginBottom: 14 }}>
                {totalAccounts === 0 ? 'Connect accounts to track credit usage.' : 'Try a different filter.'}
              </div>
              {totalAccounts === 0 && (
                <button className="btn btn-gold btn-sm" onClick={() => onNav?.('accounts')}>
                  + Connect Accounts
                </button>
              )}
            </div>
          ) : (
            filteredAccounts.map(a => (
              <AccountRow
                key={a.id}
                account={a}
                history={histMap[a.id]}
              />
            ))
          )}

          {/* Footer summary */}
          {filteredAccounts.length > 0 && (
            <div style={{
              padding: '10px 14px', background: 'rgba(0,0,0,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono,monospace',
            }}>
              <span>Showing {filteredAccounts.length} of {totalAccounts} accounts</span>
              <span>Combined burn: <strong style={{ color: 'var(--gold)' }}>{totalBurnRate}/hr</strong> · Est. <strong style={{ color: 'var(--teal)' }}>{estHours > 500 ? '∞' : estHours + 'h'}</strong> remaining</span>
            </div>
          )}
        </div>

        {/* Feature 26: Credit exhaustion timeline display */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-hdr" style={{ marginBottom: 12 }}>
            <span className="card-title">Credit Exhaustion Timeline</span>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>Depletion Schedule</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {enriched
              .map(a => {
                const est = a.burnRate > 0 ? Math.round(a.credits / a.burnRate) : 999;
                const pl = PLATFORMS.find(p => p.id === a.platform);
                return { ...a, est, pl };
              })
              .sort((a, b) => a.est - b.est)
              .slice(0, 6)
              .map((a) => {
                const pct = Math.min(100, Math.round((a.est / 24) * 100)); // Normalized to 24h
                let barColor = 'var(--teal)';
                if (a.est < 6) barColor = 'var(--red)';
                else if (a.est < 24) barColor = 'var(--gold)';

                return (
                  <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{a.pl?.icon}</span>
                        <span style={{ fontWeight: 700, color: '#e4e4ed' }}>{a.name}</span>
                      </span>
                      <span style={{ fontFamily: 'DM Mono, monospace', color: barColor, fontWeight: 700 }}>
                        {a.est > 500 ? 'Stable' : `~${a.est} hrs left`}
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        height: '100%',
                        width: a.est > 500 ? '100%' : `${pct}%`,
                        background: barColor,
                        borderRadius: 3,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>

      {/* Feature 27: Low credit webhook simulation modal */}
      {showWebhookModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(6,6,12,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div className="modal" style={{
            width: 500, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 24, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', gap: 16,
            transform: 'scale(1)', transition: 'transform 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>🤖 Low Credit Webhook Simulator</span>
              <button className="btn btn-ghost btn-xs" onClick={() => {
                setShowWebhookModal(false);
                setWebhookStatus('idle');
              }}>✕</button>
            </div>

            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              Simulates sending a real-time `account.credits.low` webhook event trigger payload to your configured webhook endpoint.
            </div>

            <div style={{ background: '#040408', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, fontFamily: 'DM Mono, monospace', fontSize: 10.5 }}>
              <div style={{ color: 'var(--muted)', marginBottom: 6 }}>// POST https://api.boltstudio.pro/v1/webhooks/credits</div>
              <pre style={{ margin: 0, color: 'var(--gold)', overflowX: 'auto', textAlign: 'left' }}>
                {JSON.stringify({
                  event: 'account.credits.low',
                  timestamp: new Date().toISOString(),
                  data: {
                    accountId: lowCreditAccts[0]?.id || enriched[0]?.id || 'acc_01',
                    accountName: lowCreditAccts[0]?.name || enriched[0]?.name || 'Bolt Staging',
                    platform: lowCreditAccts[0]?.platform || enriched[0]?.platform || 'bolt',
                    creditsRemaining: lowCreditAccts[0]?.credits || enriched[0]?.credits || 12,
                    threshold: 20
                  }
                }, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: webhookStatus === 'success' ? 'var(--teal)' : webhookStatus === 'sending' ? 'var(--gold)' : 'var(--muted)' }}>
                {webhookStatus === 'idle' && 'Status: Ready to transmit'}
                {webhookStatus === 'sending' && '⚡ Dispatching webhook relay...'}
                {webhookStatus === 'success' && '✓ Transmitted: 200 OK (latency: 48ms)'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  setShowWebhookModal(false);
                  setWebhookStatus('idle');
                }}>Close</button>
                <button
                  className={`btn btn-gold btn-sm ${webhookStatus === 'sending' ? 'btn-pulse' : ''}`}
                  disabled={webhookStatus === 'sending'}
                  onClick={async () => {
                    sound.play('click');
                    setWebhookStatus('sending');
                    await new Promise(r => setTimeout(r, 1500));
                    sound.play('success');
                    setWebhookStatus('success');
                  }}
                >
                  {webhookStatus === 'success' ? 'Trigger Again' : 'Simulate Transmit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stable hash for seeding ─────────────────────────────── */
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}
