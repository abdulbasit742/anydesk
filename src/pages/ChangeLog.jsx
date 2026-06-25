import { useState } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── Data ───────────────────────────────────────────────────────── */
const CHANGELOG = [
  {
    version: 'v2.5.0',
    date: '2026-06-01',
    badge: 'Latest',
    badgeColor: 'var(--teal)',
    tags: ['Feature', 'Enhancement'],
    changes: [
      { type: 'feature',     text: 'ChangeLog Timeline — full scrollable version history with badge filtering and search' },
      { type: 'feature',     text: 'SmartSuggest on Broadcast — ✨ AI panel suggests prompts contextually next to textarea' },
      { type: 'enhancement', text: 'Dashboard System Health Panel — collapsible FPS, Memory, Store Size & Render time monitor' },
      { type: 'enhancement', text: 'Sandbox Request History — last 10 API runs clickable to restore prompt + output' },
      { type: 'feature',     text: 'Sandbox Response Formatter — JSON pretty-print with color-coded syntax highlighting' },
      { type: 'enhancement', text: 'Sandbox Auth Header Helper — Bearer token injector from connected account dropdown' },
      { type: 'feature',     text: 'Sandbox Timing Breakdown — DNS / TCP / TTFB / Total latency breakdown per request' },
      { type: 'performance', text: 'Reduced layout repaints during broadcast sweep via memoized slot rendering' },
    ],
  },
  {
    version: 'v2.4.0',
    date: '2026-05-30',
    badge: null,
    badgeColor: 'var(--blue)',
    tags: ['Feature', 'Fix'],
    changes: [
      { type: 'feature',     text: 'AI Terminal — hacker-style CLI with platform pings and health commands' },
      { type: 'feature',     text: 'Screen Wall — 12-account grid with real-time broadcast sweep visualization' },
      { type: 'feature',     text: 'Security Vault — credential audit with encrypted localStorage export' },
      { type: 'feature',     text: 'Broadcast History — full log with retry and prompt copy actions' },
      { type: 'enhancement', text: 'Mission Control HUD — animated radar, signal particles, telemetry advisor panel' },
      { type: 'fix',         text: 'Account credits not persisting after page reload in Firefox' },
      { type: 'fix',         text: 'Broadcast progress bar not resetting between consecutive sends' },
      { type: 'performance', text: 'LocalStorage batch writes now debounced at 100ms to reduce I/O churn' },
    ],
  },
  {
    version: 'v2.3.0',
    date: '2026-05-27',
    badge: null,
    badgeColor: 'var(--purple)',
    tags: ['Feature', 'Enhancement'],
    changes: [
      { type: 'feature',     text: 'AI Sandbox — prompt playground with model selector, temperature control, typewriter output' },
      { type: 'feature',     text: 'Automation Scheduler — cron-style job manager with weekly calendar heatmap' },
      { type: 'feature',     text: 'Credit Monitor — live burn rate tracking with 14-point sparklines' },
      { type: 'feature',     text: 'Prompt Builder — visual block-based composer with {{variable}} injection support' },
      { type: 'feature',     text: 'Response Inbox — aggregate AI responses from all connected platforms' },
      { type: 'feature',     text: 'Reports — generate and export broadcast / health / usage PDF reports' },
      { type: 'enhancement', text: 'Mission Control — added live latency table and 14-day broadcast bar chart' },
      { type: 'enhancement', text: 'Screen Wall — one-Enter broadcast sweep with live per-account delivery tracking' },
    ],
  },
  {
    version: 'v2.2.0',
    date: '2026-05-24',
    badge: null,
    badgeColor: 'var(--gold)',
    tags: ['Feature', 'Enhancement', 'Fix'],
    changes: [
      { type: 'feature',     text: 'AI Optimizer — one-click prompt enhancement with quality scoring and diff view' },
      { type: 'feature',     text: 'Prompt Library — save, tag, search, and reuse prompts across broadcasts' },
      { type: 'feature',     text: 'Workflows — multi-step automation pipeline builder with conditional branching' },
      { type: 'feature',     text: 'Projects — group accounts and broadcast to project-scoped subsets' },
      { type: 'enhancement', text: 'Accounts page — credit bar with dynamic gradient colors and status badges' },
      { type: 'enhancement', text: 'Broadcast Studio — per-account variable interpolation table with smart defaults' },
      { type: 'fix',         text: 'Sidebar not highlighting active page on browser back navigation' },
      { type: 'performance', text: 'Accounts list now virtualised above 50 items — no more jank' },
    ],
  },
  {
    version: 'v2.1.0',
    date: '2026-05-21',
    badge: null,
    badgeColor: 'var(--muted)',
    tags: ['Feature', 'Fix'],
    changes: [
      { type: 'feature',     text: 'Command Palette — Cmd+K quick navigation with fuzzy page search' },
      { type: 'feature',     text: 'Keyboard Shortcuts — full shortcut system with interactive cheat-sheet modal' },
      { type: 'feature',     text: 'Settings — transmission delay, theme, and export/import JSON controls' },
      { type: 'feature',     text: 'Toast notification system — success / error / info / bolt types with queue' },
      { type: 'enhancement', text: 'Modal system — escape key, click-outside, and scale-in animation' },
      { type: 'fix',         text: 'Data not saving across sessions in Chromium-based browser with strict SameSite' },
      { type: 'fix',         text: 'Long broadcast prompts overflowing outside the compose card on mobile' },
    ],
  },
  {
    version: 'v2.0.0',
    date: '2026-05-18',
    badge: 'Initial',
    badgeColor: 'var(--muted)',
    tags: ['Feature'],
    changes: [
      { type: 'feature', text: 'Initial release of Bolt Studio Pro v2 — full dark mission-control redesign' },
      { type: 'feature', text: 'Connect accounts for Bolt.new, Lovable, Manus, Replit, Claude, Cursor, v0.dev' },
      { type: 'feature', text: 'Broadcast Studio — send prompts to all connected accounts simultaneously' },
      { type: 'feature', text: 'Dashboard — overview of all accounts and recent broadcast activity' },
      { type: 'feature', text: 'Analytics — heatmap and per-platform breakdown charts' },
      { type: 'feature', text: 'LocalStorage persistence — all data survives page reloads and tab closes' },
    ],
  },
];

/* ─── Type config ─────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  feature:     { label: 'Feature',     color: 'var(--teal)',   bg: 'rgba(0,212,170,0.12)',  icon: '✦' },
  enhancement: { label: 'Enhancement', color: 'var(--blue)',   bg: 'rgba(79,142,247,0.12)', icon: '↑' },
  fix:         { label: 'Fix',         color: 'var(--gold)',   bg: 'rgba(245,183,49,0.12)', icon: '✓' },
  performance: { label: 'Performance', color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)',icon: '⚡' },
};

const FILTER_OPTS = [
  { id: 'all',         label: 'All' },
  { id: 'feature',     label: 'Features' },
  { id: 'fix',         label: 'Bug Fixes' },
  { id: 'performance', label: 'Performance' },
  { id: 'enhancement', label: 'Enhancements' },
];

/* ─── Component ──────────────────────────────────────────────────── */
export default function ChangeLog() {
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subscribed, setSubscribed] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('releases'); // 'releases' | 'roadmap'
  const [roadmap, setRoadmap] = useState(() => {
    const stored = localStorage.getItem('agentflow_roadmap_votes');
    if (stored) return JSON.parse(stored);
    return [
      { id: 'rm-1', title: 'v2.6.0 — Multi-Agent Communication Protocol', desc: 'Allows connected profiles to trade execution context and cross-relay code files directly.', votes: 142, upvoted: false },
      { id: 'rm-2', title: 'v2.7.0 — Zero-Knowledge Credentials Vault', desc: 'Client-side hardware security module (HSM) validation for API tokens.', votes: 98, upvoted: false },
      { id: 'rm-3', title: 'v3.0.0 — Autonomous Project Refactor Bot', desc: 'Self-correcting lint sweeper that runs background compilation tests and auto-generates git commits.', votes: 254, upvoted: false }
    ];
  });

  const handleUpvote = (id) => {
    sound.play('success');
    const nextRoadmap = roadmap.map(item => {
      if (item.id === id) {
        return {
          ...item,
          votes: item.upvoted ? item.votes - 1 : item.votes + 1,
          upvoted: !item.upvoted
        };
      }
      return item;
    });
    setRoadmap(nextRoadmap);
    localStorage.setItem('agentflow_roadmap_votes', JSON.stringify(nextRoadmap));
  };

  const handleSubscribe = () => {
    setSubscribed(true);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const totalChanges = CHANGELOG.reduce((s, v) => s + v.changes.length, 0);

  const filtered = CHANGELOG.map(v => ({
    ...v,
    changes: v.changes.filter(c => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || c.text.toLowerCase().includes(q) || v.version.includes(q);
      const matchType   = typeFilter === 'all' || c.type === typeFilter;
      return matchSearch && matchType;
    }),
  })).filter(v => v.changes.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>

      {/* ── Subscribe toast ───────────────────────────────────────── */}
      {toastVisible && (
        <div style={{
          position: 'fixed', bottom: 28, right: 24, zIndex: 9999,
          background: 'linear-gradient(135deg,var(--surface2),var(--surface3))',
          border: '1px solid var(--teal)', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,212,170,0.18)',
          animation: 'fadeIn 0.2s ease',
          fontSize: 13, fontWeight: 700, color: 'var(--teal)',
        }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          Subscribed! You'll get updates on new releases.
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,rgba(245,183,49,.18),rgba(0,212,170,.12))',
            border: '1px solid rgba(245,183,49,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>📝</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>
              Changelog
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', marginTop: 1 }}>
              {CHANGELOG.length} releases · {totalChanges} changes total
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--muted)', pointerEvents: 'none' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search changelog…"
              style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 12px 7px 30px',
                color: '#e4e4ed', fontSize: 11.5, outline: 'none', width: 200,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Subscribe */}
          <button
            id="changelog-subscribe-btn"
            onClick={handleSubscribe}
            disabled={subscribed}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: subscribed ? 'default' : 'pointer',
              background: subscribed ? 'rgba(0,212,170,0.12)' : 'linear-gradient(135deg,rgba(245,183,49,0.15),rgba(0,212,170,0.1))',
              border: `1px solid ${subscribed ? 'var(--teal)' : 'rgba(245,183,49,0.4)'}`,
              color: subscribed ? 'var(--teal)' : 'var(--gold)',
              transition: 'all 0.2s',
            }}
          >
            {subscribed ? '🔔 Subscribed!' : '🔔 Subscribe to Updates'}
          </button>
        </div>
      </div>

      {/* ── Tab Switcher ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        <button
          onClick={() => { sound.play('click'); setActiveTab('releases'); }}
          style={{
            background: activeTab === 'releases' ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: `1px solid ${activeTab === 'releases' ? 'var(--border)' : 'transparent'}`,
            borderRadius: 8, padding: '8px 16px', color: activeTab === 'releases' ? '#fff' : 'var(--muted)',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Syne', sans-serif"
          }}
        >
          📄 Release Notes
        </button>
        <button
          onClick={() => { sound.play('click'); setActiveTab('roadmap'); }}
          style={{
            background: activeTab === 'roadmap' ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: `1px solid ${activeTab === 'roadmap' ? 'var(--border)' : 'transparent'}`,
            borderRadius: 8, padding: '8px 16px', color: activeTab === 'roadmap' ? '#fff' : 'var(--muted)',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Syne', sans-serif"
          }}
        >
          🗺️ Upcoming Roadmap
        </button>
      </div>

      {activeTab === 'roadmap' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {roadmap.map(item => (
            <div key={item.id} style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, paddingRight: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{item.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <button
                onClick={() => handleUpvote(item.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 18px', borderRadius: 8, border: `1.5px solid ${item.upvoted ? 'var(--gold)' : 'var(--border)'}`,
                  background: item.upvoted ? 'rgba(245,183,49,0.08)' : 'var(--surface3)',
                  color: item.upvoted ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer',
                  transition: 'all 0.2s', minWidth: 70
                }}
              >
                <span style={{ fontSize: 16 }}>▲</span>
                <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'DM Mono' }}>{item.votes}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ── Type filter pills ──────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTER_OPTS.map(opt => {
              const isActive = typeFilter === opt.id;
              const cfg = TYPE_CONFIG[opt.id];
              return (
                <button
                  key={opt.id}
                  id={`changelog-filter-${opt.id}`}
                  onClick={() => setTypeFilter(opt.id)}
                  style={{
                    padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: isActive ? (cfg ? cfg.bg : 'rgba(245,183,49,0.14)') : 'var(--surface2)',
                    border: `1px solid ${isActive ? (cfg ? cfg.color : 'var(--gold)') : 'var(--border)'}`,
                    color: isActive ? (cfg ? cfg.color : 'var(--gold)') : 'var(--muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {cfg && <span style={{ marginRight: 4 }}>{cfg.icon}</span>}
                  {opt.label}
                </button>
              );
            })}

            {/* Active filter result count */}
            {(search || typeFilter !== 'all') && (
              <span style={{ fontSize: 10.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                {filtered.reduce((s, v) => s + v.changes.length, 0)} results
              </span>
            )}
          </div>

          {/* ── Timeline ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtered.map((ver, vi) => {
              const isLast = vi === filtered.length - 1;
              const isFirst = vi === 0;
              return (
                <div key={ver.version} style={{ position: 'relative', paddingLeft: 32, paddingBottom: isLast ? 0 : 28 }}>

                  {/* Timeline vertical line */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute', left: 7, top: 28, bottom: 0, width: 2,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                    }} />
                  )}

                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: 0, top: 12,
                    width: 16, height: 16, borderRadius: '50%',
                    background: ver.badgeColor || 'var(--surface3)',
                    border: `2px solid ${ver.badgeColor || 'var(--border)'}`,
                    boxShadow: isFirst && ver.badgeColor ? `0 0 10px ${ver.badgeColor}66, 0 0 24px ${ver.badgeColor}22` : 'none',
                    animation: isFirst ? 'pulse 3s ease-in-out infinite' : 'none',
                    zIndex: 2,
                  }} />

                  {/* Version header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 17, fontWeight: 800, color: '#fff',
                      fontFamily: 'DM Mono,monospace', letterSpacing: '-.5px',
                    }}>
                      {ver.version}
                    </span>

                    {/* Badge */}
                    {ver.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 99,
                        background: `${ver.badgeColor}1a`, color: ver.badgeColor,
                        border: `1px solid ${ver.badgeColor}40`, textTransform: 'uppercase',
                        letterSpacing: '.06em',
                      }}>
                        {ver.badge}
                      </span>
                    )}

                    {/* Type tags */}
                    {ver.tags?.map(tag => {
                      const tKey = tag.toLowerCase() === 'bug fixes' ? 'fix' : tag.toLowerCase();
                      const c = TYPE_CONFIG[tKey] || TYPE_CONFIG.feature;
                      return (
                        <span key={tag} style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                          background: c.bg, color: c.color, border: `1px solid ${c.color}30`,
                        }}>
                          {c.icon} {tag}
                        </span>
                      );
                    })}

                    <span style={{
                      fontSize: 10.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace',
                      marginLeft: 'auto',
                    }}>
                      {ver.date}
                    </span>
                  </div>

                  {/* Changes list card */}
                  <div style={{
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 12, overflow: 'hidden',
                    boxShadow: isFirst ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
                  }}>
                    {ver.changes.map((change, ci) => {
                      const cfg = TYPE_CONFIG[change.type] || TYPE_CONFIG.feature;
                      const isLast = ci === ver.changes.length - 1;
                      return (
                        <div key={ci} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '10px 16px',
                          borderBottom: !isLast ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          transition: 'background 0.12s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Type pill */}
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                            background: cfg.bg, color: cfg.color,
                            border: `1px solid ${cfg.color}28`,
                            flexShrink: 0, marginTop: 1, letterSpacing: '.03em',
                            whiteSpace: 'nowrap',
                          }}>
                            {cfg.icon} {cfg.label}
                          </span>

                          {/* Text */}
                          <span style={{ fontSize: 12, color: '#dde0f0', lineHeight: 1.55 }}>
                            {change.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
                background: 'var(--surface2)', border: '1px dashed var(--border)', borderRadius: 14,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>🔍</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>No changes match your filter</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  Try clearing the search or selecting a different type
                </div>
                <button
                  onClick={() => { setSearch(''); setTypeFilter('all'); }}
                  style={{
                    marginTop: 14, padding: '6px 18px', borderRadius: 8,
                    background: 'var(--surface3)', border: '1px solid var(--border)',
                    color: 'var(--muted2)', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
