import { useState, useEffect, useRef } from 'react';

/* ─── Data ─────────────────────────────────────────────────────── */
const WORKSPACES = [
  { id: 'ws-prod', name: 'Production (Main)', branch: 'main', color: 'var(--gold)' },
  { id: 'ws-stage', name: 'Staging Integration', branch: 'staging', color: 'var(--teal)' },
  { id: 'ws-dev', name: 'R&D Sandbox', branch: 'dev', color: 'var(--purple)' },
];

const CAPABILITIES = [
  { id: 'hsm', label: 'Hardware HSM Vault Encryption', prod: true, stage: true, dev: false },
  { id: 'webhook', label: 'Outgoing Webhook Integration', prod: true, stage: true, dev: true },
  { id: 'analytics', label: 'Advanced Token Analytics', prod: true, stage: false, dev: false },
  { id: 'parallel', label: 'Parallel Platform Pings', prod: true, stage: true, dev: true },
  { id: 'audit', label: 'Security Compliance Auditing', prod: true, stage: false, dev: false },
];

const ROLES = [
  { id: 'admin',  label: 'Admin',  color: '#f5b731' },
  { id: 'editor', label: 'Editor', color: '#5eead4' },
  { id: 'viewer', label: 'Viewer', color: '#a78bfa' },
];

const PERMISSIONS = [
  { id: 'broadcast',  label: 'Broadcast Prompts',  icon: '📡', admin: true,  editor: true,  viewer: false },
  { id: 'accounts',   label: 'Manage Accounts',    icon: '🔌', admin: true,  editor: false, viewer: false },
  { id: 'workflows',  label: 'Edit Workflows',     icon: '⚙️', admin: true,  editor: true,  viewer: false },
  { id: 'settings',   label: 'App Settings',       icon: '🛠', admin: true,  editor: false, viewer: false },
  { id: 'members',    label: 'Invite Members',     icon: '👥', admin: true,  editor: false, viewer: false },
  { id: 'collections',label: 'Edit Collections',  icon: '📚', admin: true,  editor: true,  viewer: false },
  { id: 'export',     label: 'Export Data',        icon: '⬇️', admin: true,  editor: true,  viewer: true  },
  { id: 'view',       label: 'View & Read',        icon: '👁', admin: true,  editor: true,  viewer: true  },
];

const MOCK_MEMBERS = [
  { id: '1', name: 'Alex Chen',    role: 'admin',  email: 'alex@company.com',   lastActive: '2 min ago',  status: 'online',  color: '#f5b731' },
  { id: '2', name: 'Sarah Kim',    role: 'editor', email: 'sarah@company.com',  lastActive: '15 min ago', status: 'online',  color: '#5eead4' },
  { id: '3', name: 'Marcus Webb',  role: 'editor', email: 'marcus@company.com', lastActive: '1 hr ago',   status: 'away',    color: '#a78bfa' },
  { id: '4', name: 'Priya Nair',   role: 'viewer', email: 'priya@company.com',  lastActive: '3 hrs ago',  status: 'offline', color: '#f87171' },
  { id: '5', name: 'Jordan Lee',   role: 'editor', email: 'jordan@company.com', lastActive: '30 min ago', status: 'online',  color: '#34d399' },
  { id: '6', name: 'Yuki Tanaka',  role: 'viewer', email: 'yuki@company.com',   lastActive: '5 hrs ago',  status: 'offline', color: '#60a5fa' },
  { id: '7', name: 'Dev Bot',      role: 'viewer', email: 'bot@automation.io',  lastActive: 'just now',   status: 'online',  color: '#fb923c' },
  { id: '8', name: 'Nina Vasquez', role: 'editor', email: 'nina@company.com',   lastActive: '45 min ago', status: 'away',    color: '#e879f9' },
];

const INITIAL_FEED = [
  { id: 'f1',  user: 'Sarah Kim',   action: 'added a prompt',               detail: '"Refactor auth module for TypeScript"',           ts: Date.now() - 60000 * 2  },
  { id: 'f2',  user: 'Alex Chen',   action: 'broadcast to 3 accounts',      detail: 'Bolt.new, Lovable, Claude.ai',                    ts: Date.now() - 60000 * 8  },
  { id: 'f3',  user: 'Jordan Lee',  action: 'created a workflow',            detail: '"CI/CD Deploy Pipeline"',                         ts: Date.now() - 60000 * 14 },
  { id: 'f4',  user: 'Marcus Webb', action: 'edited a shared collection',    detail: '"UI Components Library"',                         ts: Date.now() - 60000 * 22 },
  { id: 'f5',  user: 'Nina Vasquez','action': 'invited a new member',        detail: 'tom@company.com as Viewer',                       ts: Date.now() - 60000 * 35 },
  { id: 'f6',  user: 'Dev Bot',     action: 'exported workspace data',       detail: 'Auto-backup triggered (8.4 MB)',                  ts: Date.now() - 60000 * 50 },
  { id: 'f7',  user: 'Sarah Kim',   action: 'optimized a prompt',            detail: 'Score improved from 62% → 91%',                   ts: Date.now() - 3600000   },
  { id: 'f8',  user: 'Alex Chen',   action: 'connected a new account',       detail: 'Cursor (cursor@company.com)',                     ts: Date.now() - 3600000 * 2 },
  { id: 'f9',  user: 'Priya Nair',  action: 'viewed the knowledge base',     detail: '"Security Vault" article',                       ts: Date.now() - 3600000 * 3 },
  { id: 'f10', user: 'Jordan Lee',  action: 'scheduled a broadcast',         detail: 'Daily at 09:00 — "Morning health check"',        ts: Date.now() - 3600000 * 5 },
  { id: 'f11', user: 'Marcus Webb', action: 'deleted a stale account',       detail: 'Manus (unused for 14 days)',                     ts: Date.now() - 3600000 * 8 },
  { id: 'f12', user: 'Yuki Tanaka', action: 'starred a prompt template',     detail: '"Full-Stack Feature Builder"',                   ts: Date.now() - 86400000   },
];

const SHARED_COLLECTIONS = [
  { id: 'c1', name: 'UI Components Library', icon: '🎨', members: 5, prompts: 24, updated: '10 min ago',  color: '#5eead4' },
  { id: 'c2', name: 'Backend Automation',    icon: '⚙️', members: 3, prompts: 18, updated: '2 hrs ago',   color: '#a78bfa' },
  { id: 'c3', name: 'Onboarding Templates',  icon: '🚀', members: 8, prompts: 9,  updated: 'Yesterday',   color: '#f5b731' },
];

const STATUS_COLOR = { online: '#34d399', away: '#f5b731', offline: '#6b7280' };

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function relTime(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60)    return 'just now';
  if (d < 3600)  return `${~~(d / 60)}m ago`;
  if (d < 86400) return `${~~(d / 3600)}h ago`;
  return `${~~(d / 86400)}d ago`;
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function TeamHub() {
  const [members, setMembers]         = useState(MOCK_MEMBERS);
  const [feed, setFeed]               = useState(INITIAL_FEED);
  const [activeTab, setActiveTab]     = useState('members');
  const [showInvite, setShowInvite]   = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]   = useState('editor');
  const [inviteSent, setInviteSent]   = useState(false);
  const [pendingMembers, setPending]  = useState([]);
  const emailRef = useRef(null);

  // Auto-focus email when modal opens
  useEffect(() => {
    if (showInvite) setTimeout(() => emailRef.current?.focus(), 50);
  }, [showInvite]);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const pName = inviteEmail.split('@')[0];
    const newMember = {
      id: `p${Date.now()}`,
      name: pName,
      role: inviteRole,
      email: inviteEmail.trim(),
      lastActive: 'Pending',
      status: 'pending',
      color: '#6b7280',
      pending: true,
    };
    setPending(prev => [...prev, newMember]);
    setFeed(prev => [{
      id: `f${Date.now()}`,
      user: 'You',
      action: 'invited a new member',
      detail: `${inviteEmail} as ${inviteRole}`,
      ts: Date.now(),
    }, ...prev]);
    setInviteEmail('');
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 1600);
  };

  const removeM = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setPending(prev => prev.filter(m => m.id !== id));
  };

  const changeRole = (id, role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  const allMembers = [...members, ...pendingMembers];
  const onlineCount = members.filter(m => m.status === 'online').length;

  const tabs = [
    { id: 'members',     label: '👥 Members' },
    { id: 'activity',    label: '🕐 Activity' },
    { id: 'collections', label: '📚 Collections' },
    { id: 'permissions', label: '🔑 Permissions' },
    { id: 'matrix',      label: '🕸️ Workspace Matrix' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(79,142,247,.18),rgba(0,212,170,.12))', border: '1px solid rgba(79,142,247,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👥</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Team Hub</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {allMembers.length} members · <span style={{ color: '#34d399' }}>●</span> {onlineCount} online
            </div>
          </div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setShowInvite(true)} style={{ fontSize: 11 }}>
          + Invite Member
        </button>
      </div>

      {/* ── Stat chips ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Admins',  value: allMembers.filter(m => m.role === 'admin').length,  color: '#f5b731' },
          { label: 'Editors', value: allMembers.filter(m => m.role === 'editor').length, color: '#5eead4' },
          { label: 'Viewers', value: allMembers.filter(m => m.role === 'viewer').length, color: '#a78bfa' },
          { label: 'Pending', value: pendingMembers.length,                              color: '#6b7280' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface2)', border: `1px solid ${s.color}33`, borderTop: `2px solid ${s.color}`, borderRadius: 10, padding: '8px 16px', minWidth: 70 }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`btn btn-xs ${activeTab === t.id ? 'btn-gold' : 'btn-ghost'}`}
            style={{ fontSize: 11 }}>{t.label}</button>
        ))}
      </div>

      {/* ═══════════════════════════════
          TAB: MEMBERS
      ═══════════════════════════════ */}
      {activeTab === 'members' && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {allMembers.map((m, i) => {
            const roleObj = ROLES.find(r => r.id === m.role);
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px',
                borderBottom: i < allMembers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Avatar + status dot */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${m.color}22`, border: `2px solid ${m.color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: m.color,
                  }}>
                    {initials(m.name)}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 10, height: 10, borderRadius: '50%',
                    background: m.pending ? '#6b7280' : STATUS_COLOR[m.status],
                    border: '2px solid var(--surface2)',
                  }} />
                </div>

                {/* Name / email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{m.name}</span>
                    {m.pending && (
                      <span style={{ fontSize: 8.5, padding: '2px 6px', borderRadius: 99, background: 'rgba(107,114,128,0.15)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.3)', fontWeight: 700 }}>PENDING</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', marginTop: 1 }}>{m.email}</div>
                </div>

                {/* Last active */}
                <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', textAlign: 'right', minWidth: 70 }}>
                  {m.lastActive}
                </div>

                {/* Role selector */}
                <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                  disabled={m.pending}
                  style={{
                    background: `${roleObj?.color}14`, border: `1px solid ${roleObj?.color}44`,
                    borderRadius: 7, padding: '4px 8px', color: roleObj?.color,
                    fontSize: 10.5, fontWeight: 700, outline: 'none',
                    cursor: m.pending ? 'default' : 'pointer', flexShrink: 0,
                  }}>
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>

                {/* Remove */}
                <button className="btn btn-ghost btn-xs" onClick={() => removeM(m.id)}
                  style={{ color: 'var(--red)', fontSize: 10, flexShrink: 0 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════
          TAB: ACTIVITY FEED
      ═══════════════════════════════ */}
      {activeTab === 'activity' && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '.05em' }}>LIVE FEED</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{feed.length} events</span>
          </div>
          {feed.map((ev, i) => {
            // find member color
            const m = allMembers.find(mm => mm.name === ev.user || ev.user === 'You');
            const col = m?.color || '#f5b731';
            return (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 16px',
                borderBottom: i < feed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                animation: 'fadeIn 0.3s ease',
              }}>
                {/* Avatar mini */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: `${col}22`, border: `1.5px solid ${col}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: col,
                }}>
                  {initials(ev.user === 'You' ? 'You' : ev.user)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700, color: col }}>{ev.user}</span>
                    <span style={{ color: 'var(--muted2)' }}> {ev.action} </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono,monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.detail}</div>
                </div>
                <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>{relTime(ev.ts)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════
          TAB: SHARED COLLECTIONS
      ═══════════════════════════════ */}
      {activeTab === 'collections' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {SHARED_COLLECTIONS.map(col => (
            <div key={col.id} style={{
              background: 'var(--surface2)', border: `1px solid ${col.color}33`,
              borderTop: `3px solid ${col.color}`, borderRadius: 14, padding: '16px 18px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${col.color}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, fontSize: 18,
                  background: `${col.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {col.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1 }}>{col.name}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
                <span>👥 {col.members} members</span>
                <span>📝 {col.prompts} prompts</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
                Updated {col.updated}
              </div>
              {/* Mini member avatars */}
              <div style={{ display: 'flex', marginTop: 12, gap: -6 }}>
                {allMembers.slice(0, col.members).map((m, idx) => (
                  <div key={m.id} style={{
                    width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--surface2)',
                    background: `${m.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7, fontWeight: 800, color: m.color,
                    marginLeft: idx > 0 ? -6 : 0, zIndex: col.members - idx,
                  }}>
                    {initials(m.name)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Add collection card */}
          <div style={{
            background: 'var(--surface2)', border: '1px dashed var(--border)',
            borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, minHeight: 140, transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: 24, color: 'var(--muted)' }}>+</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>New Collection</div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          TAB: PERMISSION MATRIX
      ═══════════════════════════════ */}
      {activeTab === 'permissions' && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3,90px)', padding: '10px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Permission</span>
            {ROLES.map(r => (
              <span key={r.id} style={{ fontSize: 11, fontWeight: 800, color: r.color, textAlign: 'center' }}>{r.label}</span>
            ))}
          </div>
          {PERMISSIONS.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr repeat(3,90px)',
              padding: '10px 16px',
              borderBottom: i < PERMISSIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{p.icon}</span>
                <span style={{ fontSize: 11, color: '#dde0f0', fontWeight: 600 }}>{p.label}</span>
              </div>
              {[
                { key: 'admin',  color: '#f5b731', val: p.admin  },
                { key: 'editor', color: '#5eead4', val: p.editor },
                { key: 'viewer', color: '#a78bfa', val: p.viewer },
              ].map(cell => (
                <div key={cell.key} style={{ textAlign: 'center' }}>
                  {cell.val
                    ? <span style={{ color: cell.color, fontSize: 16, fontWeight: 700 }}>✓</span>
                    : <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 14 }}>—</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Workspace Capability Matrix Tab */}
      {activeTab === 'matrix' && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', padding: '16px 20px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>🕸️ Workspace Capability Matrix</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Compare features & system capabilities activated across branched workspaces</div>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', padding: '10px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>System Capability</span>
              {WORKSPACES.map(w => (
                <span key={w.id} style={{ fontSize: 11, fontWeight: 800, color: w.color, textAlign: 'center' }}>{w.name} ({w.branch})</span>
              ))}
            </div>
            {CAPABILITIES.map((c, i) => (
              <div key={c.id} style={{
                display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)',
                padding: '12px 16px',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                borderBottom: i < CAPABILITIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: 11, color: '#dde0f0', fontWeight: 600 }}>{c.label}</span>
                {[
                  { id: 'prod', val: c.prod, color: 'var(--gold)' },
                  { id: 'stage', val: c.stage, color: 'var(--teal)' },
                  { id: 'dev', val: c.dev, color: 'var(--purple)' },
                ].map(cell => (
                  <div key={cell.id} style={{ textAlign: 'center' }}>
                    {cell.val ? (
                      <span style={{ color: cell.color, fontWeight: 700, fontSize: 11 }}>✓ ACTIVE</span>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          INVITE MODAL
      ═══════════════════════════════ */}
      {showInvite && (
        <div className="overlay" onClick={() => { if (!inviteSent) setShowInvite(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            {inviteSent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Invite Sent!</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{inviteEmail || 'Invitation dispatched'}</div>
              </div>
            ) : (
              <>
                <div className="modal-title">📨 Invite Team Member</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Email Address</label>
                    <input ref={emailRef} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      onKeyDown={e => e.key === 'Enter' && handleInvite()}
                      style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>

                  {/* Role selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Role</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {ROLES.map(r => (
                        <button key={r.id} onClick={() => setInviteRole(r.id)} style={{
                          padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                          border: `1px solid ${inviteRole === r.id ? r.color : 'var(--border)'}`,
                          background: inviteRole === r.id ? `${r.color}14` : 'transparent',
                          transition: 'all 0.15s',
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: inviteRole === r.id ? r.color : 'var(--muted2)' }}>{r.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3 }}>
                            {r.id === 'admin' ? 'Full access' : r.id === 'editor' ? 'Can edit & broadcast' : 'View only'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: 20 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowInvite(false)}>Cancel</button>
                  <button className="btn btn-gold btn-sm" onClick={handleInvite} disabled={!inviteEmail.trim()}>Send Invite</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
