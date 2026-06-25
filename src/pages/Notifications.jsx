import { useState, useMemo } from 'react';

/* ─── Priority Meta ─────────────────────────────────────────────── */
const PRIORITY = {
  critical: { label: 'Critical', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.3)', icon: '🔴', order: 0 },
  warning:  { label: 'Warning',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', icon: '🟡', order: 1 },
  info:     { label: 'Info',     color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.3)', icon: '🔵', order: 2 },
  success:  { label: 'Success',  color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', icon: '🟢', order: 3 },
};

const TYPE_META = {
  account:   { label: 'Account',   icon: '👤', color: '#a78bfa' },
  broadcast: { label: 'Broadcast', icon: '📡', color: 'var(--teal)' },
  credits:   { label: 'Credits',   icon: '💳', color: 'var(--gold)' },
  system:    { label: 'System',    icon: '⚙️', color: '#64748b' },
  security:  { label: 'Security',  icon: '🔐', color: '#f43f5e' },
  feature:   { label: 'Feature',   icon: '✨', color: '#06b6d4' },
};

/* ─── 12 Pre-seeded Notifications ───────────────────────────────── */
const SEED_NOTIFS = [
  {
    id: 1, type: 'account', priority: 'critical',
    title: 'Account Subscription Expired',
    body: 'Your Bolt.new Pro subscription expired 2 days ago. Broadcasts are paused for this account. Renew now to resume.',
    ts: Date.now() - 1000 * 60 * 8, read: false, archived: false,
  },
  {
    id: 2, type: 'credits', priority: 'critical',
    title: 'Credit Balance Critical',
    body: 'Your credit balance has dropped below 50 credits. All scheduled broadcasts will stop when balance reaches 0.',
    ts: Date.now() - 1000 * 60 * 22, read: false, archived: false,
  },
  {
    id: 3, type: 'security', priority: 'critical',
    title: 'Unusual Login Detected',
    body: 'A login was detected from IP 45.32.101.44 (Amsterdam, NL). If this wasn\'t you, revoke the session immediately.',
    ts: Date.now() - 1000 * 60 * 45, read: false, archived: false,
  },
  {
    id: 4, type: 'broadcast', priority: 'warning',
    title: 'Broadcast Partially Failed',
    body: 'Broadcast #8821 to 12 accounts completed with 3 failures. Replit rate-limited 2 accounts; Claude session expired on 1.',
    ts: Date.now() - 1000 * 60 * 90, read: false, archived: false,
  },
  {
    id: 5, type: 'account', priority: 'warning',
    title: 'Session Expiring Soon',
    body: 'Your Claude.ai session (bolt_main@example.com) expires in 2 hours. Re-authenticate to avoid broadcast interruptions.',
    ts: Date.now() - 1000 * 60 * 60 * 2, read: false, archived: false,
  },
  {
    id: 6, type: 'credits', priority: 'warning',
    title: 'Low Credit Warning',
    body: 'Your credit balance is at 187 — below the recommended 200 threshold. Top up to ensure continuous broadcast delivery.',
    ts: Date.now() - 1000 * 60 * 60 * 4, read: false, archived: false,
  },
  {
    id: 7, type: 'broadcast', priority: 'success',
    title: 'Broadcast Delivered Successfully',
    body: 'Your broadcast to 12 accounts on Claude completed. 97% delivery rate — 389 messages delivered in 2.1 seconds average.',
    ts: Date.now() - 1000 * 60 * 60 * 6, read: true, archived: false,
  },
  {
    id: 8, type: 'credits', priority: 'success',
    title: 'Credits Auto-Renewed',
    body: 'Your monthly credit package of 5,000 credits has been applied. Balance is now 4,843 credits. Good for ~97 broadcasts.',
    ts: Date.now() - 1000 * 60 * 60 * 8, read: true, archived: false,
  },
  {
    id: 9, type: 'feature', priority: 'info',
    title: 'New Feature: Radar Chart Comparison',
    body: 'The AI Models page now includes a pentagon radar chart for side-by-side model comparison across 5 dimensions.',
    ts: Date.now() - 1000 * 60 * 60 * 20, read: true, archived: false,
  },
  {
    id: 10, type: 'system', priority: 'info',
    title: 'Maintenance Completed',
    body: 'Scheduled maintenance on the broadcast infrastructure is complete. All platforms are now fully operational.',
    ts: Date.now() - 1000 * 60 * 60 * 28, read: true, archived: false,
  },
  {
    id: 11, type: 'broadcast', priority: 'success',
    title: 'Scheduled Broadcast Executed',
    body: 'Your daily morning broadcast "Summarize AI news" ran at 09:00 and reached all 8 active accounts successfully.',
    ts: Date.now() - 1000 * 60 * 60 * 34, read: true, archived: false,
  },
  {
    id: 12, type: 'feature', priority: 'info',
    title: 'Onboarding Wizard Available',
    body: 'A new 5-step interactive setup wizard is available. New users can now connect accounts, create prompts, and run their first broadcast guided step-by-step.',
    ts: Date.now() - 1000 * 60 * 60 * 48, read: true, archived: false,
  },
];

const FILTER_TABS = ['All', 'Unread', 'Critical', 'System'];

const DEFAULT_SETTINGS = {
  broadcast: true, credits: true, system: true,
  account: true, security: true, feature: true,
};

function timeLabel(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)    return 'just now';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function Notifications() {
  const [filter, setFilter]   = useState('All');
  const [notifs, setNotifs]   = useState(SEED_NOTIFS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [archiveView, setArchiveView]   = useState(false);

  const unreadCount = notifs.filter(n => !n.read && !n.archived).length;

  const filtered = useMemo(() => {
    const base = archiveView
      ? notifs.filter(n => n.archived)
      : notifs.filter(n => !n.archived && settings[n.type]);

    if (filter === 'All')      return base;
    if (filter === 'Unread')   return base.filter(n => !n.read);
    if (filter === 'Critical') return base.filter(n => n.priority === 'critical');
    if (filter === 'System')   return base.filter(n => n.type === 'system');
    return base;
  }, [notifs, filter, settings, archiveView]);

  // Sort by priority order then ts
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) =>
      PRIORITY[a.priority].order - PRIORITY[b.priority].order ||
      b.ts - a.ts
    ), [filtered]);

  const markRead    = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()   => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const dismiss     = (id) => setNotifs(p => p.filter(n => n.id !== id));
  const archive     = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, archived: true, read: true } : n));
  const unarchive   = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, archived: false } : n));

  const toggleSetting = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(244,63,94,.15),rgba(79,142,247,.1))', border: '1px solid rgba(244,63,94,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, position: 'relative' }}>
            🔔
            {unreadCount > 0 && (
              <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 800, color: '#fff' }}>{unreadCount}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>
              Notifications
              {unreadCount > 0 && <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 8px', borderRadius: 99, background: '#f43f5e', color: '#fff', fontWeight: 700 }}>{unreadCount} unread</span>}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Priority sorted · system alerts · broadcast events</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setArchiveView(v => !v)} className={`btn btn-xs ${archiveView ? 'btn-teal' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
            {archiveView ? '← Back' : '📁 Archive'}
          </button>
          <button onClick={markAllRead} className="btn btn-xs btn-ghost" style={{ fontSize: 10 }}>✓ Mark all read</button>
          <button onClick={() => setShowSettings(s => !s)} className={`btn btn-xs ${showSettings ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>⚙ Settings</button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff', marginBottom: 12 }}>🔔 Notification Settings</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
            {Object.keys(DEFAULT_SETTINGS).map(key => {
              const meta = TYPE_META[key];
              const on = settings[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: on ? `${meta.color}0c` : 'rgba(0,0,0,0.1)', border: `1px solid ${on ? meta.color + '30' : 'var(--border)'}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 15 }}>{meta.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: on ? '#e4e4ed' : 'var(--muted)' }}>{meta.label}</span>
                  </div>
                  <button onClick={() => toggleSetting(key)} style={{
                    width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer',
                    background: on ? meta.color : 'rgba(255,255,255,0.08)', position: 'relative', transition: 'background 0.2s',
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 19 : 3, transition: 'left 0.2s' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {FILTER_TABS.map(tab => {
          const count = tab === 'All' ? notifs.filter(n => !n.archived).length :
                        tab === 'Unread' ? unreadCount :
                        tab === 'Critical' ? notifs.filter(n => n.priority === 'critical' && !n.archived).length :
                        notifs.filter(n => n.type === 'system' && !n.archived).length;
          return (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`btn btn-xs ${filter === tab ? (tab === 'Critical' ? 'btn-danger' : 'btn-teal') : 'btn-ghost'}`}
              style={{ fontSize: 10 }}>
              {tab === 'Critical' && '🔴 '}
              {tab}{count > 0 && ` (${count})`}
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: 9.5, color: 'var(--muted)' }}>
          {sorted.length} notification{sorted.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Priority legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {Object.entries(PRIORITY).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10 }}>{v.icon}</span>
            <span style={{ fontSize: 9.5, color: v.color, fontWeight: 700 }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Notification list */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface2)', borderRadius: 14, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{archiveView ? '📁' : '🔕'}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>
            {archiveView ? 'Archive is empty' : 'No notifications'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {archiveView ? 'Archived items will appear here' : "You're all caught up!"}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map(n => {
            const p = PRIORITY[n.priority];
            const tm = TYPE_META[n.type];
            return (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                background: n.read ? 'var(--surface2)' : p.bg,
                border: `1px solid ${n.read ? 'var(--border)' : p.border}`,
                borderLeft: `3px solid ${p.color}`,
                borderRadius: 12, padding: '12px 14px',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                animation: 'fadeIn 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = n.read ? 'rgba(255,255,255,0.02)' : p.bg}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? 'var(--surface2)' : p.bg}>
                {/* Unread dot */}
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.read ? 'transparent' : p.color, marginTop: 5, flexShrink: 0, boxShadow: n.read ? 'none' : `0 0 6px ${p.color}` }} />

                {/* Icon */}
                <span style={{ fontSize: 18, flexShrink: 0 }}>{tm.icon}</span>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: n.read ? 600 : 800, color: n.read ? '#94a3b8' : '#fff' }}>{n.title}</span>
                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 99, background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40`, fontWeight: 700, textTransform: 'uppercase' }}>{p.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 6 }}>{n.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 8.5, padding: '1px 6px', borderRadius: 4, background: `${tm.color}15`, color: tm.color, border: `1px solid ${tm.color}30` }}>{tm.label}</span>
                    <span style={{ fontSize: 9.5, color: '#475569', fontFamily: 'DM Mono,monospace' }}>{timeLabel(n.ts)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button title="View" style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted2)', cursor: 'pointer', fontSize: 9.5, fontFamily: 'DM Mono,monospace', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = '#fff'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--muted2)'; }}>
                    View
                  </button>
                  {!n.read && (
                    <button title="Mark as read" onClick={() => markRead(n.id)} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--teal)', cursor: 'pointer', fontSize: 9.5, fontFamily: 'DM Mono,monospace', transition: 'all 0.15s' }}>✓</button>
                  )}
                  {archiveView ? (
                    <button title="Unarchive" onClick={() => unarchive(n.id)} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: '#4f8ef7', cursor: 'pointer', fontSize: 9.5, fontFamily: 'DM Mono,monospace' }}>↩</button>
                  ) : (
                    <button title="Archive" onClick={() => archive(n.id)} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 9.5, fontFamily: 'DM Mono,monospace', transition: 'all 0.15s' }}>📁</button>
                  )}
                  <button title="Dismiss" onClick={() => dismiss(n.id)} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)', background: 'transparent', color: '#f43f5e', cursor: 'pointer', fontSize: 9.5, fontFamily: 'DM Mono,monospace', transition: 'all 0.15s' }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
