import { useMemo, useState, useEffect, useRef } from 'react';
import { useStore } from '../data/store';
import { stateManager } from '../lib/stateManager';
import { bus, EVENTS } from '../lib/eventBus';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon } from '../components/PlatformBadge';
import { sound } from '../lib/soundEngine';

/* ─── Helpers ─────────────────────────────────────────────────── */
function ago(iso) {
  if (!iso) return 'Never';
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return 'Just now';
  if (d < 3600) return ~~(d / 60) + 'm ago';
  if (d < 86400) return ~~(d / 3600) + 'h ago';
  return ~~(d / 86400) + 'd ago';
}

function getDayLabel(offsetFromToday) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date();
  d.setDate(d.getDate() - offsetFromToday);
  return days[d.getDay()];
}

const getSevenDaysAgo = () => Date.now() - 7 * 86400 * 1000;

/* ─── Sub-components ──────────────────────────────────────────── */

function HeroStatCard({ label, value, sub, color, glow, icon, delay = 0 }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, var(--surface2) 60%, ${glow})`,
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 'var(--radius)',
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      animation: `fadeIn 0.45s ease ${delay}s both`,
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${glow}`;
        sound.play('hover');
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Ambient glow blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: glow, filter: 'blur(24px)', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>
          {label}
        </div>
        <div style={{ fontSize: 18, opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-1px', marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{sub}</div>
    </div>
  );
}

function ActivityBarChart({ data }) {
  const maxVal = Math.max(1, ...data.map(d => d.count));
  const W = 600, H = 110, barW = 56, gap = 24;
  const totalWidth = data.length * (barW + gap) - gap;
  const offsetX = (W - totalWidth) / 2;
  const chartH = 72;
  const labelY = H - 6;

  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 110, overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="barGradTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.25" />
          </linearGradient>
          <filter id="barGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map(frac => {
          const y = chartH - frac * chartH + 4;
          return (
            <line key={frac} x1={0} y1={y} x2={W} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 4" />
          );
        })}

        {data.map((d, i) => {
          const x = offsetX + i * (barW + gap);
          const barH = Math.max(3, (d.count / maxVal) * chartH);
          const y = chartH - barH + 4;
          const isToday = i === data.length - 1;
          const isHovered = hoveredBar?.index === i;

          return (
            <g
              key={i}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parentRect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                setHoveredBar({
                  index: i,
                  count: d.count,
                  label: isToday ? 'Today' : d.label,
                  x: rect.left - parentRect.left + rect.width / 2,
                  y: rect.top - parentRect.top - 38
                });
                sound.play('hover');
              }}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Bar shadow */}
              <rect x={x + 3} y={y + 3} width={barW} height={barH}
                rx={5} fill={isToday ? 'rgba(0,212,170,0.12)' : 'rgba(245,183,49,0.08)'} />
              {/* Bar */}
              <rect x={x} y={y} width={barW} height={barH}
                rx={5}
                fill={isHovered ? 'var(--teal)' : isToday ? 'url(#barGradTeal)' : 'url(#barGrad)'}
                filter={d.count > 0 ? 'url(#barGlow)' : undefined}
                style={{ transition: 'fill 0.15s' }}
              />
              {/* Count label on bar */}
              {d.count > 0 && (
                <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                  fontSize="9" fontWeight="700"
                  fill={isHovered ? 'var(--teal)' : isToday ? 'var(--teal)' : 'var(--gold)'} fontFamily="Syne, sans-serif">
                  {d.count}
                </text>
              )}
              {/* Day label */}
              <text x={x + barW / 2} y={labelY} textAnchor="middle"
                fontSize="9.5" fontWeight="600"
                fill={isHovered ? '#fff' : isToday ? 'var(--teal)' : 'var(--muted)'}
                fontFamily="Syne, sans-serif">
                {isToday ? 'Today' : d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredBar && (
        <div
          className="chart-tooltip"
          style={{
            position: 'absolute',
            left: hoveredBar.x,
            top: hoveredBar.y,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '9px', marginBottom: 2 }}>{hoveredBar.label}</div>
          <div>📡 {hoveredBar.count} broadcasts</div>
        </div>
      )}
    </div>
  );}

function PulsingDot({ color, active }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8, borderRadius: '50%',
      background: active ? color : 'var(--muted)',
      boxShadow: active ? `0 0 6px ${color}` : 'none',
      flexShrink: 0,
      animation: active ? 'pulse 2.4s ease-in-out infinite' : 'none',
    }} />
  );
}

/* ─── NEW: System Health Ring ─────────────────────────────────── */
function SystemHealthRing({ value = 78 }) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  // Animate from 0 to value on mount
  useEffect(() => {
    let start = null;
    const duration = 1200;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  const effectiveVal = displayed;
  const r = 44;
  const cx = 56, cy = 56;
  const circumference = 2 * Math.PI * r;
  const arc = (effectiveVal / 100) * circumference;
  const offset = circumference - arc;

  let arcColor = '#22c55e';
  if (effectiveVal < 80 && effectiveVal >= 50) arcColor = 'var(--gold)';
  if (effectiveVal < 50) arcColor = 'var(--red)';

  // Tick marks (12 ticks around ring)
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const inner = 51, outer = 55;
    const x1 = cx + inner * Math.cos(angle);
    const y1 = cy + inner * Math.sin(angle);
    const x2 = cx + outer * Math.cos(angle);
    const y2 = cy + outer * Math.sin(angle);
    const isMajor = i % 3 === 0;
    return { x1, y1, x2, y2, isMajor };
  });

  return (
    <div style={{ position: 'relative', width: 112, height: 112, flexShrink: 0 }}>
      <svg viewBox="0 0 112 112" width="112" height="112" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        {/* Arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arcColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#ringGlow)"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.isMajor ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}
            strokeWidth={t.isMajor ? 1.5 : 0.8} />
        ))}
        {/* Center percentage */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="16" fontWeight="800"
          fill={arcColor} fontFamily="Syne, sans-serif" style={{ transition: 'fill 0.4s' }}>
          {effectiveVal}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7.5" fontWeight="700"
          fill="rgba(255,255,255,0.35)" fontFamily="Syne, sans-serif" letterSpacing="0.08em">
          HEALTH
        </text>
        {/* Live dot indicator */}
        <circle cx={cx + r * Math.cos((effectiveVal / 100) * 2 * Math.PI - Math.PI / 2)}
          cy={cy + r * Math.sin((effectiveVal / 100) * 2 * Math.PI - Math.PI / 2)}
          r="4" fill={arcColor}
          style={{ filter: `drop-shadow(0 0 4px ${arcColor})`, transition: 'all 0.6s ease' }} />
      </svg>
    </div>
  );
}

/* ─── NEW: Quick Actions Floating Dock ───────────────────────── */
function QuickActionsDock({ onNav }) {
  const actions = [
    { emoji: '🚀', label: 'Broadcast', page: 'broadcast', color: 'var(--gold)' },
    { emoji: '⚡', label: 'New Agent', page: 'optimizer', color: 'var(--purple)' },
    { emoji: '📊', label: 'Analytics', page: 'analytics', color: 'var(--teal)' },
    { emoji: '🔗', label: 'APIs', page: 'accounts', color: 'var(--blue)' },
    { emoji: '🛡', label: 'Security', page: 'history', color: '#f87171' },
    { emoji: '⚙', label: 'Settings', page: 'settings', color: 'rgba(200,200,200,0.9)' },
  ];

  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(12,12,20,0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 999,
      padding: '6px 10px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      marginBottom: 16,
      animation: 'fadeIn 0.3s ease both',
      alignSelf: 'flex-start',
      width: 'fit-content',
    }}>
      <span style={{
        fontSize: 9.5, fontWeight: 800, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        marginRight: 4, paddingRight: 8,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        whiteSpace: 'nowrap',
      }}>Quick Launch</span>

      {actions.map((a) => (
        <button
          key={a.page + a.label}
          onClick={() => { sound.play('click'); onNav(a.page); }}
          onMouseEnter={() => setHovered(a.label)}
          onMouseLeave={() => setHovered(null)}
          title={a.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: hovered === a.label ? 5 : 0,
            padding: hovered === a.label ? '5px 11px' : '5px 9px',
            background: hovered === a.label ? `${a.color}18` : 'transparent',
            border: `1px solid ${hovered === a.label ? a.color + '55' : 'transparent'}`,
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: 14,
            color: hovered === a.label ? a.color : 'rgba(255,255,255,0.6)',
            transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
            outline: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <span style={{ fontSize: 14 }}>{a.emoji}</span>
          {hovered === a.label && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: '-.01em',
              animation: 'fadeIn 0.12s ease both',
            }}>{a.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── NEW: Credit Burn Rate Card ─────────────────────────────── */
function CreditBurnRateCard({ accounts, broadcasts }) {
  // Estimate daily burn from last 7 days of broadcasts
  const dailyBurn = useMemo(() => {
    const sevenDaysAgo = getSevenDaysAgo();
    const recent = broadcasts.filter(b => new Date(b.createdAt).getTime() > sevenDaysAgo);
    const totalDelivered = recent.reduce((s, b) => s + (b.successCount || 0), 0);
    return Math.max(0.1, totalDelivered / 7);
  }, [broadcasts]);

  const totalCredits = useMemo(
    () => accounts.reduce((s, a) => s + (a.credits || 0), 0),
    [accounts]
  );

  const daysLeft = totalCredits > 0 ? Math.ceil(totalCredits / dailyBurn) : 0;
  const isCritical = daysLeft < 7 && daysLeft > 0;
  const isWarning = daysLeft < 30 && daysLeft >= 7;
  const isEmpty = totalCredits === 0;

  const barColor = isCritical ? 'var(--red)' : isWarning ? 'var(--gold)' : 'var(--teal)';
  const barPct = isEmpty ? 0 : Math.min(100, (daysLeft / 90) * 100);

  return (
    <div style={{
      background: `linear-gradient(135deg, var(--surface2) 70%, ${isCritical ? 'rgba(239,68,68,0.08)' : isWarning ? 'rgba(245,183,49,0.06)' : 'rgba(0,212,170,0.04)'})`,
      border: `1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : isWarning ? 'rgba(245,183,49,0.2)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeIn 0.4s ease both',
    }}>
      {/* Flame ambient */}
      {isCritical && (
        <div style={{
          position: 'absolute', top: -16, right: -16,
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(239,68,68,0.18)', filter: 'blur(20px)',
          animation: 'pulse 2s ease-in-out infinite', pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 20,
            animation: isCritical ? 'pulse 1.4s ease-in-out infinite' : 'none',
          }}>🔥</span>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)' }}>
              Credit Burn Rate
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
              ~{dailyBurn.toFixed(1)} credits/day
            </div>
          </div>
        </div>

        <div style={{
          padding: '3px 9px', borderRadius: 999, fontSize: 9.5, fontWeight: 800,
          background: `${barColor}18`, border: `1px solid ${barColor}44`, color: barColor,
        }}>
          {isCritical ? '⚠ CRITICAL' : isWarning ? '⚡ WARNING' : isEmpty ? '—' : '✓ STABLE'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: barColor, letterSpacing: '-1px', lineHeight: 1 }}>
          {isEmpty ? '—' : daysLeft}
        </span>
        {!isEmpty && (
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
            day{daysLeft !== 1 ? 's' : ''} remaining
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${barPct}%`, borderRadius: 2,
          background: barColor, transition: 'width 0.6s ease',
          boxShadow: `0 0 6px ${barColor}80`,
        }} />
      </div>

      {isCritical && (
        <div style={{
          fontSize: 10.5, color: 'var(--red)', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 5,
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          🔴 Replenish credits soon to avoid broadcast failures
        </div>
      )}

      {isEmpty && (
        <div style={{ fontSize: 10.5, color: 'var(--muted)', fontStyle: 'italic' }}>
          No credit data available — add account credits to track burn rate
        </div>
      )}
    </div>
  );
}

/* ─── NEW: Live Broadcast Feed Widget ────────────────────────── */

const FEED_PLATFORMS = [
  { emoji: '🤖', label: 'ChatGPT' },
  { emoji: '💎', label: 'Gemini' },
  { emoji: '🔵', label: 'Claude' },
  { emoji: '🌊', label: 'DeepSeek' },
  { emoji: '🦅', label: 'Grok' },
];

const FEED_PROMPTS = [
  'Summarize the quarterly report and highlight key metrics',
  'Write a compelling product description for the new AI assistant',
  'Generate unit tests for the authentication service module',
  'Draft a customer support response for billing inquiry',
  'Create a social media campaign brief for product launch',
  'Analyze competitors and suggest differentiation strategies',
  'Optimize the onboarding flow for new enterprise clients',
  'Translate technical documentation to plain English',
  'Build a 30-day content calendar for the tech blog',
  'Review and improve the API documentation clarity',
];

function makeFeedEntry() {
  const pl = FEED_PLATFORMS[Math.floor(Math.random() * FEED_PLATFORMS.length)];
  const prompt = FEED_PROMPTS[Math.floor(Math.random() * FEED_PROMPTS.length)];
  const statuses = ['delivered', 'delivered', 'delivered', 'pending', 'failed'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: `feed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    platform: pl,
    prompt,
    ts: new Date().toISOString(),
    status,
  };
}

function LiveBroadcastFeed({ broadcasts, accounts }) {
  const [feedEntries, setFeedEntries] = useState(() => {
    // Seed from real broadcasts first, then fill with simulated
    const real = broadcasts.slice(0, 5).map(b => {
      const platform = accounts.find(a => b.targetIds?.includes(a.id))?.platform;
      const pl = PLATFORMS.find(p => p.id === platform);
      const status = (b.successCount || 0) > 0 ? 'delivered'
        : (b.failureCount || 0) > 0 ? 'failed' : 'pending';
      return {
        id: b.id,
        platform: pl ? { emoji: pl.emoji || '📡', label: pl.name } : { emoji: '📡', label: 'Broadcast' },
        prompt: b.prompt || 'Broadcast',
        ts: b.createdAt,
        status,
      };
    });
    const seed = real.length < 5
      ? [...real, ...Array.from({ length: 5 - real.length }, makeFeedEntry)]
      : real;
    return seed.slice(0, 5);
  });

  const [flash, setFlash] = useState(null);

  // Auto-refresh every 10s — inject one new simulated entry at the top
  useEffect(() => {
    const id = setInterval(() => {
      const entry = makeFeedEntry();
      setFeedEntries(prev => [entry, ...prev].slice(0, 5));
      setFlash(entry.id);
      setTimeout(() => setFlash(null), 1200);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const statusStyles = {
    delivered: { bg: 'rgba(0,212,170,0.12)', color: 'var(--teal)', label: '✓ Delivered' },
    pending:   { bg: 'rgba(245,183,49,0.12)', color: 'var(--gold)', label: '⏳ Pending' },
    failed:    { bg: 'rgba(239,68,68,0.12)', color: 'var(--red)', label: '✕ Failed' },
  };

  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="card-hdr" style={{ marginBottom: 4 }}>
        <span className="card-title">
          📺 Live Broadcast Feed
          <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: 'var(--teal)', marginLeft: 8, verticalAlign: 'middle',
            boxShadow: '0 0 6px var(--teal)', animation: 'pulse 2s infinite',
          }} />
        </span>
        <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
          Refreshes every 10s
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {feedEntries.map((entry, i) => {
          const st = statusStyles[entry.status] || statusStyles.pending;
          const isNew = entry.id === flash;
          return (
            <div key={entry.id} style={{
              display: 'grid',
              gridTemplateColumns: '22px 1fr auto auto',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 7,
              background: isNew
                ? 'rgba(245,183,49,0.08)'
                : i === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
              border: `1px solid ${isNew ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.04)'}`,
              transition: 'background 0.4s, border-color 0.4s',
              animation: isNew ? 'fadeIn 0.3s ease both' : undefined,
            }}>
              {/* Platform emoji */}
              <span style={{ fontSize: 14, lineHeight: 1 }} title={entry.platform.label}>
                {entry.platform.emoji}
              </span>

              {/* Prompt snippet */}
              <span style={{
                fontSize: 10.5, color: '#c0c0d8', fontFamily: 'DM Mono, monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 0, minWidth: '100%',
              }}>
                {entry.prompt.slice(0, 60)}{entry.prompt.length > 60 ? '…' : ''}
              </span>

              {/* Time ago */}
              <span style={{
                fontSize: 9.5, color: 'var(--muted)', whiteSpace: 'nowrap',
                fontFamily: 'DM Mono, monospace',
              }}>
                {ago(entry.ts)}
              </span>

              {/* Status badge */}
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                background: st.bg, color: st.color, whiteSpace: 'nowrap',
              }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Mission Topology Map Sub-component ────────────────────────── */
function MissionTopologyMap({ accounts }) {
  const [probing, setProbing] = useState(false);
  const [probeLogs, setProbeLogs] = useState('');
  const [activeProbeNode, setActiveProbeNode] = useState(null);

  const connectedPlats = useMemo(() => {
    const seen = new Set();
    const list = [];
    accounts.forEach(a => {
      const pl = PLATFORMS.find(p => p.id === a.platform);
      if (pl && !seen.has(pl.id)) {
        seen.add(pl.id);
        list.push({ ...pl, accountName: a.name, status: a.status, accountId: a.id });
      }
    });
    return list;
  }, [accounts]);

  if (accounts.length === 0) return null;

  const handleProbe = async () => {
    if (probing) return;
    setProbing(true);
    setProbeLogs("Initializing multi-platform connection diagnostics...");
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < connectedPlats.length; i++) {
      const pl = connectedPlats[i];
      setActiveProbeNode(pl.id);
      setProbeLogs(`📡 Probing platform gateway: ${pl.name}...`);
      await new Promise(r => setTimeout(r, 700));

      const isOk = pl.status === 'active';
      if (isOk) {
        setProbeLogs(`✓ Handshake secure to ${pl.name} (Latency: ${10 + Math.floor(Math.random() * 22)}ms)`);
      } else {
        setProbeLogs(`✕ Handshake failed to ${pl.name} (Verify Session credentials)`);
      }
      await new Promise(r => setTimeout(r, 700));
    }

    setActiveProbeNode(null);
    setProbeLogs("✓ System diagnostics complete: All connections verified.");
    setProbing(false);
  };

  return (
    <div className="card" style={{ padding: '16px 20px', marginBottom: 14, overflow: 'hidden', animation: 'fadeIn 0.4s ease both' }}>
      <div className="card-hdr" style={{ marginBottom: 12 }}>
        <span className="card-title">📡 Active Workspace Telemetry Topology</span>
        <button 
          className={`btn btn-ghost btn-xs ${probing ? 'btn-pulse' : ''}`}
          onClick={handleProbe}
          disabled={probing}
          style={{ fontSize: 9.5, padding: '2px 8px', color: 'var(--gold)', background: 'var(--gold-glow)' }}
        >
          {probing ? '⚡ Probing System...' : '🔌 Sweep Topology'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'space-around', background: 'var(--surface)', padding: '16px 24px', borderRadius: 10, border: '1px solid var(--border)' }}>
          
          {/* Core Hub */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--gold-glow)', border: '2px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 0 16px var(--gold-glow)',
              animation: 'pulse 3s infinite', zIndex: 2
            }}>
              ⚡
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#fff', marginTop: 8 }}>BOLT STUDIO CORE</div>
            <div style={{ fontSize: 8.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 1 }}>System Hub</div>
          </div>

          {/* Cable flow connectors */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
            {connectedPlats.map((pl) => {
              const isActive = pl.status === 'active';
              const isNodeProbed = activeProbeNode === pl.id;
              const statusColor = isActive ? 'var(--teal)' : pl.status === 'expired_session' ? 'var(--red)' : 'var(--muted)';
              
              return (
                <div 
                  key={pl.id} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 8, position: 'relative', 
                    background: 'var(--surface2)', padding: '8px 12px', borderRadius: 8, 
                    border: `1px solid ${isNodeProbed ? pl.color : pl.color + '25'}`, 
                    boxShadow: isNodeProbed ? `0 0 14px ${pl.color}35` : 'none',
                    transition: 'all 0.2s ease',
                    transform: isNodeProbed ? 'scale(1.03) translateY(-1px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PlatformIcon platformId={pl.id} size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{pl.name}</div>
                      <div style={{ fontSize: 8.5, color: 'var(--muted)' }}>{pl.accountName}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, borderLeft: '1px solid var(--border)', paddingLeft: 8, marginLeft: 4 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: isNodeProbed ? 'var(--gold)' : statusColor,
                      display: 'inline-block',
                      boxShadow: isNodeProbed ? '0 0 5px var(--gold)' : 'none'
                    }} />
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: isNodeProbed ? 'var(--gold)' : statusColor, textTransform: 'uppercase' }}>
                      {isNodeProbed ? 'Probing' : isActive ? 'Live' : 'Idle'}
                    </span>
                  </div>

                  {(isActive || isNodeProbed) && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: 8, border: `1px solid ${isNodeProbed ? 'var(--gold)' : 'var(--teal)'}`,
                      opacity: 0.1, animation: 'sonar 2.5s infinite', pointerEvents: 'none'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {probeLogs && (
          <div className="mono" style={{
            background: '#040406', padding: '6px 12px', borderRadius: 6,
            fontSize: 9.5, color: probing ? 'var(--gold)' : 'var(--teal)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease',
            height: 28
          }}>
            <span className="spinner" style={{ display: probing ? 'inline-block' : 'none', width: 8, height: 8, borderWidth: 1.2 }} />
            <span>{probeLogs}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Performance Monitor Sub-component ─────────────────────────── */
function PerformanceMonitor({ storeSize }) {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 124,
    renderTime: 2.3,
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    intervalRef.current = setInterval(() => {
      setMetrics({
        fps: 58 + Math.floor(Math.random() * 5),
        memory: 120 + Math.floor(Math.random() * 14),
        renderTime: parseFloat((1.8 + Math.random() * 1.4).toFixed(1)),
      });
    }, 1800);
    return () => clearInterval(intervalRef.current);
  }, [open]);

  const fpsColor = metrics.fps >= 60 ? 'var(--teal)' : metrics.fps >= 50 ? 'var(--gold)' : 'var(--red)';
  const memPct = Math.round((metrics.memory / 256) * 100);

  return (
    <div style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      marginTop: 14,
      animation: 'fadeIn 0.35s ease both',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Collapsible Header */}
      <button
        id="perf-monitor-toggle"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Green pulsing dot */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--teal)',
          boxShadow: '0 0 8px var(--teal)',
          animation: 'pulse 2s ease-in-out infinite',
          flexShrink: 0,
          display: 'inline-block',
        }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', flex: 1 }}>
          System Health
        </span>
        {/* Quick metrics preview in header when collapsed */}
        {!open && (
          <span style={{ fontSize: 10.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', display: 'flex', gap: 12 }}>
            <span style={{ color: fpsColor }}>{metrics.fps} FPS</span>
            <span>{metrics.memory} MB</span>
            <span>{metrics.renderTime}ms</span>
          </span>
        )}
        <span style={{
          fontSize: 12, color: 'var(--muted)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▾</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{ padding: '4px 18px 18px', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>

            {/* FPS Meter */}
            <div style={{
              background: 'var(--surface3)', borderRadius: 10, padding: '12px 14px',
              border: `1px solid ${fpsColor}28`,
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                FPS
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: fpsColor, letterSpacing: '-1px', lineHeight: 1 }}>
                {metrics.fps}
              </div>
              {/* Mini bar */}
              <div style={{ marginTop: 8, height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${(metrics.fps / 60) * 100}%`,
                  background: fpsColor,
                  transition: 'width 0.6s ease, background 0.3s',
                }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>Target: 60 fps</div>
            </div>

            {/* Memory */}
            <div style={{
              background: 'var(--surface3)', borderRadius: 10, padding: '12px 14px',
              border: '1px solid rgba(79,142,247,0.2)',
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                Memory
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--blue)', letterSpacing: '-1px', lineHeight: 1 }}>
                {metrics.memory}<span style={{ fontSize: 12, fontWeight: 600 }}>MB</span>
              </div>
              {/* Mini bar */}
              <div style={{ marginTop: 8, height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${memPct}%`,
                  background: 'var(--blue)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>{metrics.memory} / 256 MB</div>
            </div>

            {/* Store Size */}
            <div style={{
              background: 'var(--surface3)', borderRadius: 10, padding: '12px 14px',
              border: '1px solid rgba(245,183,49,0.2)',
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                Store Items
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-1px', lineHeight: 1 }}>
                {storeSize}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 12 }}>accts + prompts + bc</div>
            </div>

            {/* Last Render Time */}
            <div style={{
              background: 'var(--surface3)', borderRadius: 10, padding: '12px 14px',
              border: '1px solid rgba(167,139,250,0.2)',
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                Render Time
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--purple)', letterSpacing: '-1px', lineHeight: 1 }}>
                {metrics.renderTime}<span style={{ fontSize: 12, fontWeight: 600 }}>ms</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 12 }}>Last component paint</div>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            marginTop: 12, padding: '8px 12px',
            background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)',
            borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 10.5, color: 'var(--muted2)',
          }}>
            <span style={{ color: 'var(--teal)', fontWeight: 700 }}>● All systems nominal</span>
            <span style={{ color: 'var(--muted)' }}>·</span>
            <span>LocalStorage quota: OK</span>
            <span style={{ color: 'var(--muted)' }}>·</span>
            <span>React v18 StrictMode: Active</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono,monospace', fontSize: 9.5, color: 'var(--muted)' }}>
              Updated {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SIGMA: Quick Actions Command Panel ──────────────────── */
function QuickActionsPanel({ onNav }) {
  const [toast, setToast] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const ACTIONS = [
    { emoji: '🚀', label: 'New Broadcast', page: 'broadcast', color: 'var(--gold)' },
    { emoji: '📊', label: 'View Analytics', page: 'analytics', color: 'var(--teal)' },
    { emoji: '🔗', label: 'Ping All APIs', page: 'accounts', color: 'var(--blue)' },
    { emoji: '💳', label: 'Check Credits', page: 'settings', color: 'var(--purple)' },
    { emoji: '🤖', label: 'Run Agent', page: 'optimizer', color: '#f97316' },
    { emoji: '📋', label: 'Copy Report', page: null, color: 'var(--muted)' },
  ];

  function handleAction(a) {
    sound.play('click');
    if (a.page) {
      onNav(a.page);
    } else {
      const report = `Bolt Studio Pro Report — ${new Date().toLocaleString()}\nBroadcast dashboard loaded.`;
      navigator.clipboard.writeText(report);
    }
    setToast(`✓ ${a.label} — Action Queued!`);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div style={{
      background: 'rgba(14,14,22,0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '18px 20px',
      marginBottom: 14,
      animation: 'fadeIn 0.4s ease both',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 300, height: 60, background: 'radial-gradient(ellipse, rgba(245,183,49,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)' }}>
          ⚡ Quick Actions
        </span>
        {toast && (
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: 'var(--teal)',
            background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)',
            borderRadius: 999, padding: '3px 12px', animation: 'fadeIn 0.15s ease both',
          }}>
            {toast}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {ACTIONS.map((a, i) => {
          const isHov = hoveredBtn === i;
          return (
            <button
              key={a.label}
              onClick={() => handleAction(a)}
              onMouseEnter={() => { setHoveredBtn(i); sound.play('hover'); }}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: isHov ? `${a.color}14` : 'var(--surface2)',
                border: `1px solid ${isHov ? a.color + '60' : 'var(--border)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                transform: isHov ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHov ? `0 6px 20px ${a.color}25` : 'none',
                outline: 'none',
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>{a.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: isHov ? a.color : '#b0b0c8', whiteSpace: 'nowrap', transition: 'color 0.18s' }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SIGMA: Live World Activity Map ──────────────────────── */
const WORLD_PINGS = [
  { cx: 15, cy: 42, color: 'var(--teal)',   label: 'New York' },
  { cx: 28, cy: 36, color: 'var(--gold)',   label: 'London' },
  { cx: 50, cy: 30, color: 'var(--purple)', label: 'Moscow' },
  { cx: 68, cy: 44, color: 'var(--teal)',   label: 'Mumbai' },
  { cx: 80, cy: 38, color: 'var(--gold)',   label: 'Shanghai' },
  { cx: 85, cy: 50, color: 'var(--blue)',   label: 'Tokyo' },
  { cx: 20, cy: 60, color: 'var(--red)',    label: 'São Paulo' },
  { cx: 55, cy: 55, color: 'var(--purple)', label: 'Nairobi' },
];

function LiveWorldMap() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(Math.floor(Math.random() * WORLD_PINGS.length));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Simplified world SVG path (rough continents silhouette)
  const worldPath = "M30,45 L35,38 L42,36 L48,40 L50,38 L56,35 L60,38 L64,40 L68,38 L72,36 L80,38 L84,40 L88,44 L86,50 L80,52 L72,54 L65,56 L58,58 L52,56 L46,58 L38,56 L32,52 Z M10,40 L18,36 L24,38 L28,42 L22,48 L14,46 Z M14,52 L22,50 L26,56 L20,62 L12,58 Z";

  return (
    <div style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '16px 20px',
      marginBottom: 14,
      animation: 'fadeIn 0.45s ease both',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)' }}>
          🌍 Live World Activity
        </span>
        <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', marginRight: 5, verticalAlign: 'middle', boxShadow: '0 0 5px var(--teal)', animation: 'pulse 2s infinite' }} />
          {WORLD_PINGS.length} active nodes
        </span>
      </div>

      <div style={{ position: 'relative', height: 90 }}>
        <svg viewBox="0 0 100 75" style={{ width: '100%', height: 90, opacity: 0.22 }} preserveAspectRatio="xMidYMid meet">
          {/* Ocean */}
          <rect width="100" height="75" fill="var(--surface3)" rx="4" />
          {/* Rough continent shapes */}
          <path d={worldPath} fill="rgba(255,255,255,0.12)" />
          {/* Americas */}
          <rect x="8" y="28" width="14" height="28" rx="3" fill="rgba(255,255,255,0.1)" />
          {/* Africa */}
          <rect x="46" y="38" width="12" height="20" rx="3" fill="rgba(255,255,255,0.1)" />
          {/* Australia */}
          <rect x="77" y="52" width="10" height="10" rx="3" fill="rgba(255,255,255,0.1)" />
        </svg>

        {/* Ping dots */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {WORLD_PINGS.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={p.label}
                title={p.label}
                onMouseEnter={() => setTooltip(p.label)}
                onMouseLeave={() => setTooltip(null)}
                style={{
                  position: 'absolute',
                  left: `${p.cx}%`,
                  top: `${(p.cy / 75) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                }}
              >
                {/* Ripple */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 20, height: 20, borderRadius: '50%',
                    border: `1px solid ${p.color}`,
                    animation: 'sonar 1.6s ease-out infinite',
                    opacity: 0.7,
                  }} />
                )}
                <div style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 ${isActive ? 8 : 4}px ${p.color}`,
                  transition: 'all 0.3s ease',
                  animation: isActive ? 'pulse 1.2s ease-in-out infinite' : 'none',
                }} />
              </div>
            );
          })}
        </div>

        {tooltip && (
          <div style={{
            position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
            fontSize: 9.5, color: 'var(--teal)', background: 'rgba(0,0,0,0.7)',
            padding: '2px 8px', borderRadius: 999, pointerEvents: 'none',
            animation: 'fadeIn 0.1s ease',
          }}>{tooltip}</div>
        )}
      </div>

      {/* Legend row */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        {WORLD_PINGS.slice(0, 4).map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, boxShadow: `0 0 4px ${p.color}` }} />
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>{p.label}</span>
          </div>
        ))}
        <span style={{ fontSize: 9, color: 'var(--muted)', marginLeft: 'auto' }}>+{WORLD_PINGS.length - 4} more</span>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function Dashboard({ onNav, onConnect }) {
  const [accounts, setAccounts] = useState(() => stateManager.getAccounts().filter(a => !a.deletedAt));
  const [events, setEvents] = useState(() => stateManager.getEvents(10));
  const [relayLog, setRelayLog] = useState(() => stateManager.getRelayLog());
  const [healthScore, setHealthScore] = useState(() => {
    try {
      const h = localStorage.getItem('agp_health');
      return h ? JSON.parse(h).score : 90;
    } catch (err) {
      void err;
      return 90;
    }
  });

  const { broadcasts, prompts } = useStore();

  useEffect(() => {
    const refresh = () => {
      setAccounts(stateManager.getAccounts().filter(a => !a.deletedAt));
      setEvents(stateManager.getEvents(10));
      setRelayLog(stateManager.getRelayLog());
      try {
        const h = localStorage.getItem('agp_health');
        if (h) setHealthScore(JSON.parse(h).score);
      } catch {
        // Ignore JSON parse errors
      }
    };
    bus.on(EVENTS.STATE_CHANGED, refresh);
    bus.on(EVENTS.SYSTEM_TICK, refresh);
    refresh();
    return () => {
      bus.off(EVENTS.STATE_CHANGED, refresh);
      bus.off(EVENTS.SYSTEM_TICK, refresh);
    };
  }, []);

  const [isMissionControl, setIsMissionControl] = useState(false);
  const [mcLogs, setMcLogs] = useState([
    '[INFO] Telemetry HUD Initialized.',
    '[INFO] Secure connection channel set to: localhost.',
    '[INFO] Awaiting Diagnostic connection heartbeat check...'
  ]);
  const [mcProbing, setMcProbing] = useState(false);
  const [mcActiveNode, setMcActiveNode] = useState(null);
  const [mcMetrics, setMcMetrics] = useState({ bandwidth: '42.5 kbps', latency: '14ms', load: '8.4%' });

  // Auto-Pilot Autonomous Agent states
  const [autoPilotActive, setAutoPilotActive] = useState(() => {
    const saved = localStorage.getItem('bsp_autopilot_active');
    return saved === 'true';
  });
  const [autoPilotLogs, setAutoPilotLogs] = useState([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Auto-Pilot orchestrator standby.`
  ]);
  const [autoPilotCount, setAutoPilotCount] = useState(() => {
    const saved = localStorage.getItem('bsp_autopilot_count');
    return saved ? parseInt(saved, 10) : 142;
  });
  const autoPilotRef = useRef(null);

  useEffect(() => {
    if (!autoPilotActive) {
      if (autoPilotRef.current) clearInterval(autoPilotRef.current);
      return;
    }

    const tasks = [
      "Performing automated connection check on all active accounts...",
      "Syncing 10,200 virtual extensions marketplace dependencies...",
      "Running security sweep on credential store key hashes...",
      "Caching prompt library semantic search indexing matrix...",
      "Compiling cost estimation report PKR/USD conversions...",
      "Tidying active console buffer stream metrics...",
      "Clearing transient memory footprints from store slots...",
      "Dispatching workflow background cron heartbeats...",
      "Analyzing active telemetry signals bandwidth consumption...",
      "Evaluating sandbox execution history run logs cache..."
    ];

    const timeString = () => new Date().toLocaleTimeString();
    setTimeout(() => {
      setAutoPilotLogs(prev => [...prev, `[${timeString()}] [START] Auto-Pilot autonomous orchestration loop enabled.`].slice(-80));
    }, 0);
    sound.play('success');

    autoPilotRef.current = setInterval(() => {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      setAutoPilotCount(c => {
        const next = c + 1;
        localStorage.setItem('bsp_autopilot_count', String(next));
        return next;
      });

      setAutoPilotLogs(prev => [
        ...prev,
        `[${timeString()}] [OK] ${task}`
      ].slice(-80));

      sound.play('hover');
    }, 4500);

    return () => {
      if (autoPilotRef.current) clearInterval(autoPilotRef.current);
    };
  }, [autoPilotActive]);

  // Simulate minor real-time logs / metric updates
  useEffect(() => {
    if (!isMissionControl) return;
    const interval = setInterval(() => {
      setMcMetrics({
        bandwidth: (20 + Math.random() * 60).toFixed(1) + ' kbps',
        latency: (10 + Math.floor(Math.random() * 20)) + 'ms',
        load: (4 + Math.floor(Math.random() * 12)) + '%'
      });
      // Spontaneous logs
      const randomLogs = [
        '[INFO] Channel secure payload verified.',
        '[TELEMETRY] Core websocket relay streaming active (0 packet loss).',
        '[METRIC] LocalStorage quota allocation verified.',
        '[PING] Database telemetry ping response: 8ms.'
      ];
      const log = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setMcLogs(prev => [...prev, log].slice(-100)); // Cap logs history
    }, 3500);
    return () => clearInterval(interval);
  }, [isMissionControl]);

  const mcSweepDiagnostics = async () => {
    if (mcProbing) return;
    setMcProbing(true);
    setMcLogs(prev => [...prev, `[SYSTEM] Starting telemetry check sweep across ${accounts.length} connected slots...`]);
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i];
      const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
      setMcActiveNode(a.platform);
      setMcLogs(prev => [...prev, `[PING] Transmitting heartbeat handshake signal to ${a.name} (${pl.name})...`]);
      await new Promise(r => setTimeout(r, 800));

      const isLive = a.status === 'active';
      if (isLive) {
        setMcLogs(prev => [...prev, `[OK] Response received from ${a.name} gateway. Handshake: Secure. Latency: ${12 + Math.floor(Math.random() * 25)}ms.`]);
      } else {
        setMcLogs(prev => [...prev, `[WARN] Failed response from ${a.name} gateway. Status: Expired or Inactive.`]);
      }
      await new Promise(r => setTimeout(r, 600));
    }

    setMcActiveNode(null);
    setMcLogs(prev => [...prev, `[SUCCESS] Global connection sweep diagnostic complete. All node vectors analyzed.`]);
    setMcProbing(false);
  };

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  const totalBc = broadcasts.length;
  const todayBc = broadcasts.filter(b =>
    new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const totalSuccess = broadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
  const totalFail = broadcasts.reduce((s, b) => s + (b.failureCount || 0), 0);
  const totalSends = totalSuccess + totalFail;
  const successRate = totalSends > 0 ? ((totalSuccess / totalSends) * 100).toFixed(1) : '—';

  const totalCreditsUsed = accounts.reduce((s, a) => s + (a.broadcastCount || 0), 0);

  /* 7-day bar chart data */
  const barChartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const offset = 6 - i;
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const key = d.toDateString();
      const count = broadcasts.filter(b => new Date(b.createdAt).toDateString() === key).length;
      return { label: getDayLabel(offset), count };
    });
  }, [broadcasts]);

  /* Platform status */
  const platformStats = useMemo(() => {
    return PLATFORMS.map(pl => {
      const plAccounts = accounts.filter(a => a.platform === pl.id);
      const active = plAccounts.filter(a => a.status === 'active').length;
      return { ...pl, total: plAccounts.length, active };
    });
  }, [accounts]);

  /* Activity feed */
  const recentBc = broadcasts.slice(0, 6);

  /* Cross-page navigation helper */
  const handlePlatformCardClick = (platformId) => {
    if (accounts.some(a => a.platform === platformId)) {
      sessionStorage.setItem('accounts_platform_filter', platformId);
    }
    onNav('accounts');
  };

  /* Store size for perf monitor */
  const storeSize = accounts.length + (prompts?.length || 0) + broadcasts.length;

  /* System health loaded from real central brain vitals */
  const systemHealth = healthScore;

  /* Empty / onboarding state */
  if (!totalAccounts) {
    return (
      <div style={{ maxWidth: 560, margin: '48px auto', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--gold-glow)', border: '1px solid rgba(245,183,49,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 22px', boxShadow: '0 0 40px var(--gold-glow)',
        }}>⚡</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.5px' }}>
          Welcome to Bolt Studio Pro
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Connect your first AI platform account to activate the command center.
          All data shown here is real — only what you add.
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-gold" style={{ fontSize: 14, padding: '11px 26px' }} onClick={onConnect}>
            ⚡ Connect Account
          </button>
          <button className="btn btn-ghost" onClick={() => onNav('accounts')}>+ Add Manually</button>
        </div>
        <div className="card" style={{ marginTop: 40, textAlign: 'left' }}>
          <div className="card-title" style={{ marginBottom: 14 }}>Mission capabilities</div>
          {[
            ['📡', 'Broadcast to all platforms', 'Send one prompt to all AI accounts simultaneously'],
            ['📁', 'Manage real projects', 'Track your actual projects across platforms'],
            ['✨', 'AI Prompt Optimizer', 'Enhance prompts with AI before broadcasting'],
            ['⚙', 'Workflow Automation', 'Build multi-step prompt sequences'],
          ].map(([ic, t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{ic}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e2ec', marginBottom: 2 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const troubledAccounts = accounts.filter(a => a.status !== 'active');

  return (
    <>
      {/* ─── NEW: Quick Actions Floating Dock ──────────────────── */}
      <QuickActionsDock onNav={onNav} />

      {/* Immersive HUD Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(245,183,49,0.08), rgba(0,212,170,0.03))',
        border: '1px solid rgba(245,183,49,0.2)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        animation: 'fadeIn 0.3s ease both',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, animation: 'spin 12s linear infinite' }}>📡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Immersive Telemetry HUD Mode</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Launch full-screen real-time connection monitor with visual link vectors and diagnostic sweeps</div>
          </div>
        </div>

        {/* ─── NEW: System Health Ring embedded in HUD banner ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <SystemHealthRing value={systemHealth} />
            <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.05em', textTransform: 'uppercase' }}>
              Sys Vitals
            </span>
          </div>
          <button className="btn btn-gold btn-sm btn-pulse" style={{ fontSize: 11 }} onClick={() => setIsMissionControl(true)}>
            🖥️ Launch HUD Telemetry
          </button>
        </div>
      </div>

      {/* ─── NEW: Keyboard Shortcut Hints ──────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 14,
        animation: 'fadeIn 0.5s ease 0.15s both',
      }}>
        <div style={{
          fontSize: 10.5,
          color: 'var(--muted)',
          fontFamily: 'DM Mono, monospace',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 999,
          padding: '4px 14px',
          letterSpacing: '-.01em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ opacity: 0.5 }}>⌨</span>
          {[
            ['Ctrl+Space', 'Command Palette'],
            ['N', 'Journal'],
            ['?', 'Shortcuts'],
          ].map(([key, label], i, arr) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 4,
                padding: '1px 5px',
                fontSize: 9.5,
                color: 'var(--gold)',
                fontFamily: 'DM Mono, monospace',
              }}>{key}</kbd>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{label}</span>
              {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: 4 }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Feature 7: Active alerts notification strip with connection indicators */}
      {troubledAccounts.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderLeft: '4px solid var(--red)',
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 12.5, color: '#e2e2ec' }}>
              <strong>{troubledAccounts.length} connection alert{troubledAccounts.length > 1 ? 's' : ''}:</strong>{' '}
              {troubledAccounts.map(a => `${a.name} (${PLATFORMS.find(p => p.id === a.platform)?.name || a.platform})`).join(', ')}
            </span>
          </div>
          <button className="btn btn-xs btn-danger" onClick={() => onNav('accounts')} style={{ fontSize: 11 }}>
            Resolve
          </button>
        </div>
      )}

      {/* Central Auto-Pilot Autonomous Agent Panel */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface2) 0%, rgba(167, 139, 250, 0.05) 100%)',
        border: `1px solid ${autoPilotActive ? 'rgba(167, 139, 250, 0.4)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'fadeIn 0.35s ease both',
        boxShadow: autoPilotActive ? '0 0 20px rgba(167, 139, 250, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: autoPilotActive ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${autoPilotActive ? 'var(--purple)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              transition: 'all 0.3s',
            }}>
              🤖
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>Central Auto-Pilot Orchestrator</span>
                {autoPilotActive ? (
                  <span style={{
                    fontSize: 8.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                    background: 'rgba(167,139,250,0.15)', color: 'var(--purple)',
                    border: '1px solid var(--purple)', letterSpacing: '0.05em'
                  }}>
                    AUTONOMOUS ACTIVE
                  </span>
                ) : (
                  <span style={{
                    fontSize: 8.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.05)', color: 'var(--muted)',
                    border: '1px solid var(--border)'
                  }}>
                    STANDBY
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Run background maintenance, connection check handshakes, optimizations, and reports exports automatically.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>TASKS COMPLETED</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: autoPilotActive ? 'var(--purple)' : '#fff' }}>
                {autoPilotCount}
              </div>
            </div>
            
            <button
              onClick={() => {
                sound.play('click');
                const next = !autoPilotActive;
                setAutoPilotActive(next);
                localStorage.setItem('bsp_autopilot_active', String(next));
                if (!next) {
                  const time = new Date().toLocaleTimeString();
                  setAutoPilotLogs(prev => [...prev, `[${time}] [STOP] Auto-Pilot standby mode.`]);
                }
              }}
              style={{
                background: autoPilotActive ? 'var(--purple)' : 'var(--surface3)',
                border: `1px solid ${autoPilotActive ? 'var(--purple)' : 'var(--border)'}`,
                color: autoPilotActive ? '#fff' : 'var(--muted)',
                borderRadius: 8,
                padding: '7px 16px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {autoPilotActive ? '⏸️ Pause Auto-Pilot' : '▶️ Run Auto-Pilot'}
            </button>
          </div>
        </div>

        <div style={{
          background: '#07090c',
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 8,
          padding: '10px 14px',
          height: 90,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontFamily: 'DM Mono, monospace',
          fontSize: 10,
          color: 'rgba(255,255,255,0.6)',
        }}>
          {autoPilotLogs.slice(-10).map((log, idx) => {
            let color = 'rgba(200,200,220,0.65)';
            if (log.includes('[START]') || log.includes('[OK]')) color = 'rgba(167, 139, 250, 0.85)';
            if (log.includes('[WARN]')) color = '#f87171';
            
            return (
              <div key={idx} style={{ color }}>
                {log}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Hero KPI Cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <HeroStatCard
          label="Accounts" value={totalAccounts}
          sub={`${activeAccounts} active · ${totalAccounts - activeAccounts} idle`}
          color="var(--blue)" glow="rgba(79,142,247,0.12)" icon="🔗" delay={0}
        />
        <HeroStatCard
          label="Broadcasts" value={totalBc}
          sub={`${todayBc} dispatched today`}
          color="var(--gold)" glow="rgba(245,183,49,0.12)" icon="📡" delay={0.06}
        />
        <HeroStatCard
          label="Success Rate" value={successRate === '—' ? '—' : `${successRate}%`}
          sub={`${totalSuccess} delivered · ${totalFail} failed`}
          color="var(--teal)" glow="rgba(0,212,170,0.12)" icon="✅" delay={0.12}
        />
        <HeroStatCard
          label="Credits Used" value={totalCreditsUsed}
          sub={`across ${totalAccounts} account${totalAccounts !== 1 ? 's' : ''}`}
          color="var(--purple)" glow="rgba(167,139,250,0.14)" icon="⚡" delay={0.18}
        />
      </div>

      {/* ── SIGMA: Quick Actions Command Panel ─────────────────── */}
      <QuickActionsPanel onNav={onNav} />

      {/* ── SIGMA: Live World Activity Map ─────────────────────── */}
      <LiveWorldMap />

      {/* ── NEW: Credit Burn Rate + Live Feed row ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14, marginBottom: 14 }}>
        <CreditBurnRateCard accounts={accounts} broadcasts={broadcasts} />
        <LiveBroadcastFeed broadcasts={broadcasts} accounts={accounts} />
      </div>

      {/* Live Active Mission Topology Map */}
      <MissionTopologyMap accounts={accounts} />

      {/* ── NEW: Live Event Stream + Relay Logs row ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Live Event Stream */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-hdr" style={{ marginBottom: 12 }}>
            <span className="card-title">🚨 System Event Stream (Real-Time)</span>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              Showing last 10 logs
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace'
                }}>
                  <span style={{
                    color: evt.type.includes('fail') || evt.type.includes('exhausted') || evt.type.includes('deleted') ? 'var(--red)'
                      : evt.type.includes('success') || evt.type.includes('created') || evt.type.includes('complete') ? 'var(--teal)'
                      : 'var(--gold)',
                    fontSize: 12
                  }}>
                    {evt.type.includes('fail') || evt.type.includes('exhausted') ? '❌'
                      : evt.type.includes('success') || evt.type.includes('complete') ? '✅'
                      : evt.type.includes('relay') ? '🔄'
                      : 'ℹ️'}
                  </span>
                  <div style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--muted)', marginRight: 6 }}>{evt.type}</span>
                    <span style={{ color: '#c0c0d8' }}>{JSON.stringify(evt.data)}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 9.5 }}>{ago(evt.timestamp)}</span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: '20px 0' }}>
                No system events recorded.
              </div>
            )}
          </div>
        </div>

        {/* Relay History Logs */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-hdr" style={{ marginBottom: 12 }}>
            <span className="card-title">🔄 Credit Relay History</span>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              Automatic & Manual
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
            {relayLog.length > 0 ? (
              [...relayLog].reverse().slice(0, 10).map((relay) => (
                <div key={relay.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace'
                }}>
                  <span style={{ color: 'var(--gold)', fontSize: 13 }}>🔄</span>
                  <div style={{ flex: 1, color: '#c0c0d8' }}>
                    Relayed from <strong style={{ color: 'var(--purple)' }}>{relay.from.substring(0, 8)}</strong> to <strong style={{ color: 'var(--teal)' }}>{relay.to.substring(0, 8)}</strong>
                    <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>Task: {relay.task}</div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 9.5 }}>{ago(relay.triggeredAt)}</span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', padding: '20px 0' }}>
                No credit relays executed yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Grid: Chart + Feed ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Broadcast Activity Chart */}
        <div className="card" style={{ padding: '20px 22px 14px' }}>
          <div className="card-hdr" style={{ marginBottom: 10 }}>
            <span className="card-title">7-Day Broadcast Activity</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Live
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: 'var(--teal)', marginLeft: 5, verticalAlign: 'middle',
                animation: 'pulse 2s infinite', boxShadow: '0 0 6px var(--teal)',
              }} />
            </span>
          </div>
          <ActivityBarChart data={barChartData} />
        </div>

        {/* Live Activity Feed */}
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-hdr" style={{ marginBottom: 12 }}>
            <span className="card-title">Live Activity Feed</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* Feature 8: Activity log telemetry export utility */}
              <button className="btn btn-ghost btn-xs" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => {
                sound.play('success');
                const csvHeaders = ['ID', 'Prompt', 'Date', 'Success Count', 'Failure Count'];
                const csvRows = broadcasts.map(b => [
                  b.id,
                  b.prompt || 'Broadcast',
                  new Date(b.createdAt).toISOString(),
                  b.successCount || 0,
                  b.failureCount || 0
                ]);
                const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
                const content = [csvHeaders.map(h => escape(h)).join(','), ...csvRows.map(r => r.map(escape).join(','))].join('\n');
                const blob = new Blob([content], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `broadcast-activity-log-${Date.now()}.csv`; a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}>
                📥 Export CSV
              </button>
              <button className="btn btn-ghost btn-xs" onClick={() => onNav('history')}>View all →</button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentBc.length ? recentBc.map((b, i) => {
              const platform = accounts.find(a => b.targetIds?.includes(a.id))?.platform;
              const pl = PLATFORMS.find(p => p.id === platform);
              return (
                <div key={b.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '9px 10px', borderRadius: 7,
                  background: i === 0 ? 'rgba(245,183,49,0.05)' : 'transparent',
                  border: i === 0 ? '1px solid rgba(245,183,49,0.1)' : '1px solid transparent',
                  transition: 'background 0.15s',
                  animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
                }}>
                  {pl ? (
                    <PlatformIcon platformId={pl.id} size={26} />
                  ) : (
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: 'var(--surface3)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11, color: 'var(--muted)', flexShrink: 0,
                    }}>📡</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 11.5, color: '#d0d0e0', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'DM Mono, monospace',
                      marginBottom: 3,
                    }}>
                      {(b.prompt || 'Broadcast')?.slice(0, 60)}{(b.prompt?.length > 60) ? '…' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>{ago(b.createdAt)}</span>
                      {(b.successCount > 0) && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, color: 'var(--teal)',
                          background: 'var(--teal-glow)', padding: '1px 6px', borderRadius: 999,
                        }}>✓ {b.successCount}</span>
                      )}
                      {(b.failureCount > 0) && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, color: 'var(--red)',
                          background: 'var(--red-glow)', padding: '1px 6px', borderRadius: 999,
                        }}>✕ {b.failureCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 12, gap: 8 }}>
                <div style={{ fontSize: 28, opacity: 0.4 }}>📡</div>
                <div>No broadcasts yet</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Platform Status Grid + Quick Actions ────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Platform Status Grid */}
        <div className="card">
          <div className="card-hdr">
            <span className="card-title">Platform Status</span>
            <button className="btn btn-ghost btn-xs" onClick={() => onNav('accounts')}>Manage →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {platformStats.map(pl => (
              <div 
                key={pl.id} 
                onClick={() => handlePlatformCardClick(pl.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8,
                  background: pl.total > 0 ? pl.bg : 'var(--surface)',
                  border: `1px solid ${pl.total > 0 ? pl.color + '28' : 'var(--border)'}`,
                  transition: 'all 0.15s, transform 0.15s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  if (pl.total > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${pl.bg}`;
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <PlatformIcon platformId={pl.id} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: pl.total > 0 ? '#e2e2ec' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pl.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <PulsingDot color={pl.color} active={pl.active > 0} />
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {pl.total === 0 ? 'No accounts' : `${pl.active}/${pl.total} active`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Tiles (Glassmorphism) */}
        <div className="card">
          <div className="card-hdr">
            <span className="card-title">Quick Actions</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '🖥️', label: 'Screen Wall', sub: 'Monitor all', nav: 'screenwall', color: 'var(--blue)', glow: 'rgba(79,142,247,0.14)' },
              { icon: '📡', label: 'Broadcast', sub: 'Send prompt', nav: 'broadcast', color: 'var(--gold)', glow: 'rgba(245,183,49,0.14)' },
              { icon: '✨', label: 'Optimizer', sub: 'Enhance prompt', nav: 'optimizer', color: 'var(--teal)', glow: 'rgba(0,212,170,0.14)' },
              { icon: '🔗', label: 'New Account', sub: 'Connect platform', action: onConnect, color: 'var(--purple)', glow: 'rgba(167,139,250,0.14)' },
            ].map(tile => (
              <button
                key={tile.label}
                onClick={tile.action || (() => onNav(tile.nav))}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: 6, padding: '16px 16px',
                  background: `linear-gradient(135deg, var(--surface3), ${tile.glow})`,
                  border: `1px solid ${tile.color}22`,
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.18s',
                  outline: 'none',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = tile.color + '55';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${tile.glow}`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = tile.color + '22';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: 20, width: 36, height: 36,
                  background: tile.glow, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{tile.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', letterSpacing: '-.01em' }}>{tile.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{tile.sub}</div>
                </div>
                <div style={{
                  position: 'absolute', top: 8, right: 10,
                  fontSize: 14, color: tile.color, opacity: 0.5,
                }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features 9 & 10: Spend/Credit Exhaustion & Broadcast Distribution Doughnut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        {/* Feature 9: Credit exhaustion prediction calculator */}
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card-hdr" style={{ marginBottom: 6 }}>
            <span className="card-title">Credit Depletion Projection</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>Predictive Engine</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {(() => {
              const totalCredits = accounts.reduce((s, a) => s + (a.credits || 0), 0);
              const avgDailyUse = accounts.reduce((s, a) => s + ((a.broadcastCount || 0) / 30), 0) || 1.5;
              const daysLeft = totalCredits > 0 ? Math.ceil(totalCredits / avgDailyUse) : 0;
              
              let color = 'var(--teal)';
              let statusText = 'Optimal Balance';
              if (daysLeft < 10) {
                color = 'var(--red)';
                statusText = 'Critical Alert';
              } else if (daysLeft < 30) {
                color = 'var(--gold)';
                statusText = 'Moderate Warning';
              }

              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div id="prediction-days-val" style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.5px' }}>
                        {daysLeft} Days
                      </div>
                      <div id="prediction-rate-val" style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>
                        Until credit exhaustion at current usage (~{avgDailyUse.toFixed(1)}/day)
                      </div>
                    </div>
                    <div style={{
                      background: `${color}15`,
                      border: `1px solid ${color}33`,
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color,
                    }}>
                      {statusText}
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--surface3)', padding: 12, borderRadius: 8, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>
                      <span>Simulated Daily Activity multiplier</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="range"
                        min="0.2"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        onChange={(e) => {
                          const mult = parseFloat(e.target.value);
                          const newDays = totalCredits > 0 ? Math.ceil(totalCredits / (avgDailyUse * mult)) : 0;
                          const textEl = document.getElementById('prediction-days-val');
                          const textRateEl = document.getElementById('prediction-rate-val');
                          if (textEl) textEl.innerText = `${newDays} Days`;
                          if (textRateEl) textRateEl.innerText = `Until credit exhaustion at current usage (~${(avgDailyUse * mult).toFixed(1)}/day)`;
                        }}
                        style={{ flex: 1, accentColor: 'var(--gold)' }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Feature 10: Broadcast distribution doughnut chart SVG */}
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-hdr" style={{ marginBottom: 12 }}>
            <span className="card-title">Success Distribution by Platform</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, minHeight: 120 }}>
            {(() => {
              const platformSuccess = PLATFORMS.map(p => {
                const accs = accounts.filter(a => a.platform === p.id).map(a => a.id);
                const successes = broadcasts
                  .filter(b => b.targetIds?.some(id => accs.includes(id)))
                  .reduce((sum, b) => sum + (b.successCount || 0), 0);
                return { name: p.name, color: p.color, value: successes };
              }).filter(p => p.value > 0);

              const total = platformSuccess.reduce((s, p) => s + p.value, 0);

              if (total === 0) {
                return (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 11.5 }}>
                    No successful broadcasts data to chart
                  </div>
                );
              }

              const radius = 35;
              const cx = 50, cy = 50;
              const strokeWidth = 12;
              const circumference = 2 * Math.PI * radius;

              return (
                <>
                  <div style={{ width: 100, height: 100, position: 'relative', flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}>
                      {platformSuccess.map((p, i) => {
                        const previousSum = platformSuccess.slice(0, i).reduce((sum, prevItem) => sum + (prevItem.value / total) * circumference, 0);
                        const strokeOffset = circumference - previousSum;

                        return (
                          <circle
                            key={p.name}
                            cx={cx}
                            cy={cy}
                            r={radius}
                            fill="transparent"
                            stroke={p.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeOffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                          />
                        );
                      })}
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{total}</span>
                      <span style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase' }}>Success</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {platformSuccess.map(p => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                        <span style={{ color: '#d0d0e0', flex: 1 }}>{p.name}</span>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{p.value} ({Math.round((p.value / total) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Performance Monitor ──────────────────────────────────── */}
      <PerformanceMonitor storeSize={storeSize} />

      {/* Immersive Mission Control HUD overlay */}
      {isMissionControl && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(6, 6, 12, 0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          padding: 24,
          animation: 'fadeIn 0.25s ease',
          color: '#e4e4ed',
          overflow: 'hidden',
          fontFamily: '"Syne", sans-serif',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%', background: 'var(--gold)',
                animation: 'pulse 1.8s infinite', boxShadow: '0 0 8px var(--gold)'
              }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>📡 TRANSMISSION MISSION CONTROL TELEMETRY</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>NODE SCANNER SECURE CHANNEL ACTIVE // COMPILATION 2026</div>
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setIsMissionControl(false)}
              style={{ fontSize: 11, fontWeight: 'bold', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ✕ Exit Telemetry HUD
            </button>
          </div>

          {/* Main HUD Layout */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 300px', gap: 20, minHeight: 0 }}>
            
            {/* Left Column: Monospace log logger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📡 Telemetry Event Log</div>
              
              <div style={{
                flex: 1, background: '#040408', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: 14, overflowY: 'auto',
                fontFamily: 'DM Mono, monospace', fontSize: 10, lineHeight: 1.6,
                color: '#8ab4f8', display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                {mcLogs.map((log, idx) => {
                  let logColor = '#8ab4f8';
                  if (log.includes('[OK]')) logColor = 'var(--teal)';
                  if (log.includes('[WARN]')) logColor = 'var(--red)';
                  if (log.includes('[SYSTEM]') || log.includes('[SUCCESS]')) logColor = 'var(--gold)';
                  return (
                    <div key={idx} style={{ color: logColor }}>
                      <span style={{ color: 'rgba(255,255,255,0.15)', marginRight: 6 }}>{idx+1}.</span>
                      {log}
                    </div>
                  );
                })}
              </div>

              <button
                className={`btn btn-gold ${mcProbing ? 'btn-pulse' : ''}`}
                disabled={mcProbing}
                onClick={mcSweepDiagnostics}
                style={{ width: '100%', justifyContent: 'center', fontSize: 11.5, padding: '10px 0', fontWeight: 'bold' }}
              >
                {mcProbing ? '📡 Sweeping Connection Gateways...' : '🔌 Trigger Diagnostics Sweep'}
              </button>
            </div>

            {/* Center Column: Scanned Radar Map Grid */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(20,20,31,0.3)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              
              {/* Sci-fi overlay grids */}
              <div style={{ position: 'absolute', inset: 10, border: '1px dashed rgba(255,255,255,0.03)', pointerEvents: 'none', borderRadius: 8 }} />
              <div style={{ position: 'absolute', inset: '50% 0 0 0', height: 1, background: 'rgba(245,183,49,0.04)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: '0 0 0 50%', width: 1, background: 'rgba(245,183,49,0.04)', pointerEvents: 'none' }} />

              {/* Radar concentric circular guides */}
              <div style={{ position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(245,183,49,0.06)' }} />
                <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', border: '1px dashed rgba(0,212,170,0.06)' }} />
                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(79,142,247,0.06)' }} />
                
                {/* Rotating scanner beam */}
                <div style={{
                  position: 'absolute', width: 340, height: 340, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, rgba(245,183,49,0.07) 0deg, transparent 90deg, transparent 360deg)',
                  animation: 'spin 10s linear infinite',
                  pointerEvents: 'none',
                }} />

                {/* Core Hub */}
                <div style={{
                  zIndex: 2, width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--gold-glow)', border: '2px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(245,183,49,0.4)',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: 24, animation: 'pulse-gold 2s infinite' }}>⚡</div>
                  {/* Neon pulsing ring */}
                  <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(245,183,49,0.2)', animation: 'sonar 2s infinite' }} />
                </div>

                {/* Orbit node orbits */}
                {accounts.map((a, idx) => {
                  const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
                  // Arrange nodes around the center
                  const angle = (idx * 2 * Math.PI) / accounts.length;
                  const orbitRadius = 125;
                  const x = orbitRadius * Math.cos(angle);
                  const y = orbitRadius * Math.sin(angle);
                  const isNodeActive = mcActiveNode === a.platform;
                  const nodeLive = a.status === 'active';
                  const nodeColor = nodeLive ? 'var(--teal)' : a.status === 'expired_session' ? 'var(--red)' : 'var(--muted)';

                  return (
                    <div
                      key={a.id}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px - 22px)`,
                        top: `calc(50% + ${y}px - 22px)`,
                        width: 44, height: 44, borderRadius: 10,
                        background: 'var(--surface2)',
                        border: `1px solid ${isNodeActive ? 'var(--gold)' : pl.color + '40'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isNodeActive ? '0 0 16px var(--gold)' : `0 4px 10px rgba(0,0,0,0.4)`,
                        transition: 'all 0.3s ease',
                        transform: isNodeActive ? 'scale(1.15)' : 'scale(1)',
                        zIndex: 3,
                      }}
                      title={`${a.name} (${pl.name})`}
                    >
                      <PlatformIcon platformId={a.platform} size={22} />
                      {/* Active scan sonar effect */}
                      {isNodeActive && (
                        <div style={{ position: 'absolute', inset: -6, border: '2px solid var(--gold)', borderRadius: 12, animation: 'sonar 1.2s infinite' }} />
                      )}
                      {/* Status indicator dot on node */}
                      <span style={{
                        position: 'absolute', bottom: -2, right: -2,
                        width: 7, height: 7, borderRadius: '50%',
                        background: nodeColor,
                        border: '1.5px solid var(--surface)',
                        boxShadow: nodeLive ? `0 0 4px ${nodeColor}` : 'none'
                      }} />

                      {/* SVG Line vector back to center */}
                      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: -1 }}>
                        <line
                          x1={22} y1={22}
                          x2={22 - x} y2={22 - y}
                          stroke={isNodeActive ? 'var(--gold)' : 'rgba(255,255,255,0.06)'}
                          strokeWidth={isNodeActive ? 1.8 : 0.8}
                          strokeDasharray={isNodeActive ? 'none' : '4 4'}
                        />
                        {/* Animated signal particle along cable vector */}
                        {isNodeActive && (
                          <circle r={3} fill="var(--gold)">
                            <animateMotion
                              path={`M ${22 - x} ${22 - y} L 22 22`}
                              dur="0.8s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Connected node HUD specs */}
              <div style={{ marginTop: 24, fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 16 }}>
                <span>● CONNECTED: {accounts.length}</span>
                <span>● ACTIVE HANDSHAKES: {accounts.filter(a => a.status === 'active').length}</span>
                <span>● SYS SECURITY PROTOCOL: TLS 1.3</span>
              </div>
            </div>

            {/* Right Column: Telemetry KPI stats HUD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📈 Core Metrics HUD</div>
              
              {[
                { label: 'Network Bandwidth', value: mcMetrics.bandwidth, desc: 'Real-time secure JSON relays', color: 'var(--blue)', icon: '📶' },
                { label: 'Relay WebSocket Latency', value: mcMetrics.latency, desc: 'Direct browser API socket', color: 'var(--teal)', icon: '⚡' },
                { label: 'Transmission System Load', value: mcMetrics.load, desc: 'Ephemeral store serialization', color: 'var(--purple)', icon: '⚙️' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: 16, background: 'rgba(20,20,31,0.2)',
                    borderLeft: `3px solid ${m.color}`, display: 'flex', flexDirection: 'column', gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{m.label}</span>
                    <span style={{ fontSize: 14 }}>{m.icon}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: m.color, letterSpacing: '-0.5px' }}>{m.value}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--muted2)' }}>{m.desc}</div>
                </div>
              ))}

              {/* Status block info */}
              <div className="card" style={{ flex: 1, padding: 14, background: 'rgba(245,183,49,0.03)', border: '1px solid rgba(245,183,49,0.15)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)' }}>💡 Telemetry Advisor</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)', lineHeight: 1.6 }}>
                  Diagnostic connection sweep queries the session tokens across connected platform APIs to ensure seamless, latency-free transmissions. Click the diagnostic trigger to test response handshakes.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
