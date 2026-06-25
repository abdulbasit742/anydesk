import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { sound } from '../lib/soundEngine';

/* ─── Constants ───────────────────────────────────────────────── */

const RECENT_KEY = 'bsp_recent_cmds_v1';
const MAX_RECENT = 5;

const GROUP_META = {
  Recent:   { emoji: '🕐', color: '#a78bfa' },
  Pages:    { emoji: '🗂️', color: '#60a5fa' },
  Accounts: { emoji: '🔌', color: '#34d399' },
  Prompts:  { emoji: '💬', color: '#f59e0b' },
  Actions:  { emoji: '⚡', color: '#f87171' },
};

const PAGE_ACTIONS = [
  { id: 'nav-dashboard',  group: 'Pages', icon: '🏠', label: 'Dashboard',        hint: 'Go to Dashboard',        shortcut: 'D', pageId: 'dashboard'  },
  { id: 'nav-broadcast',  group: 'Pages', icon: '📡', label: 'Broadcast Studio',  hint: 'Live broadcast control', shortcut: 'B', pageId: 'broadcast'  },
  { id: 'nav-analytics',  group: 'Pages', icon: '📊', label: 'Analytics',         hint: 'Stats & charts',         shortcut: 'A', pageId: 'analytics'  },
  { id: 'nav-screenwall', group: 'Pages', icon: '🖥️', label: 'Screen Wall',       hint: 'Multi-screen view',      shortcut: 'S', pageId: 'screenwall' },
  { id: 'nav-workflows',  group: 'Pages', icon: '⚙',  label: 'Workflows',          hint: 'Automate your flow',     shortcut: 'W', pageId: 'workflows'  },
  { id: 'nav-projects',   group: 'Pages', icon: '📁', label: 'Projects',           hint: 'Manage projects',        shortcut: 'P', pageId: 'projects'   },
  { id: 'nav-library',    group: 'Pages', icon: '📚', label: 'Prompt Library',     hint: 'Browse all prompts',     shortcut: 'L', pageId: 'library'    },
  { id: 'nav-optimizer',  group: 'Pages', icon: '✨', label: 'AI Optimizer',       hint: 'Optimize with AI',       shortcut: 'O', pageId: 'optimizer'  },
  { id: 'nav-vault',      group: 'Pages', icon: '🔒', label: 'Security Vault',     hint: 'Manage credentials',     shortcut: 'V', pageId: 'vault'      },
  { id: 'nav-settings',   group: 'Pages', icon: '⚙️', label: 'Settings',           hint: 'App configuration',      shortcut: null, pageId: 'settings'  },
];

const FIXED_ACTIONS = [
  { id: 'action-connect', group: 'Actions', icon: '⚡', label: 'Connect New Account', hint: 'Link a social platform', shortcut: null },
  { id: 'action-export',  group: 'Actions', icon: '⬇', label: 'Export All Data',      hint: 'Download JSON backup',   shortcut: null },
];

/* ─── localStorage helpers ───────────────────────────────────── */

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function saveRecent(ids) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT))); }
  catch { /* ignore */ }
}

/* ─── Fuzzy match helper ─────────────────────────────────────── */

function fuzzyMatch(text, query) {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  // Simple inclusive contains first
  if (t.includes(q)) return true;
  // Character-order fuzzy
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

/* ─── Component ──────────────────────────────────────────────── */

export default function CommandPalette({ open, onClose, onNav, onConnect, onExport }) {
  const { accounts, prompts } = useStore();
  const [query, setQuery]         = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentIds, setRecentIds] = useState(loadRecent);
  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const itemRefs = useRef([]);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setRecentIds(loadRecent());
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIdx(0);
  }

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* Build account actions */
  const accountActions = useMemo(() =>
    accounts.slice(0, 8).map(a => {
      const pl = PLATFORMS.find(p => p.id === a.platform);
      return {
        id: `acc-${a.id}`,
        group: 'Accounts',
        icon: pl?.icon || '🔌',
        label: a.name,
        hint: `${pl?.name || a.platform} · ${a.status}`,
        shortcut: null,
        pageId: 'accounts',
      };
    }),
  [accounts]);

  /* Build prompt actions — fuzzy search across ALL prompts */
  const promptActions = useMemo(() => {
    const q = query.trim();
    const pool = q
      ? prompts.filter(p =>
          fuzzyMatch(p.title || p.text?.slice(0, 80) || '', q) ||
          fuzzyMatch(p.category || '', q) ||
          fuzzyMatch(p.tags?.join(' ') || '', q)
        )
      : prompts.slice(0, 6);

    return pool.slice(0, q ? 8 : 6).map(p => ({
      id: `prompt-${p.id}`,
      group: 'Prompts',
      icon: '💬',
      label: p.title || p.text?.slice(0, 50) || 'Untitled Prompt',
      hint: p.category ? `${p.category} · Used ${p.useCount || 0}×` : `Used ${p.useCount || 0}×`,
      shortcut: null,
      promptData: p,
      pageId: 'broadcast',
      badge: 'Use',
    }));
  }, [prompts, query]);

  /* All actions flat */
  const allActions = useMemo(() => [
    ...PAGE_ACTIONS,
    ...accountActions,
    ...promptActions,
    ...FIXED_ACTIONS,
  ], [accountActions, promptActions]);

  /* Recent items resolved */
  const recentActions = useMemo(() => {
    if (recentIds.length === 0) return [];
    return recentIds
      .map(id => allActions.find(a => a.id === id))
      .filter(Boolean)
      .map(a => ({ ...a, group: 'Recent' }));
  }, [recentIds, allActions]);

  /* Filtered results */
  const filteredStatic = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allActions.filter(a => a.group !== 'Prompts').concat(promptActions.slice(0, 6));
    return allActions.filter(a =>
      fuzzyMatch(a.label, q) ||
      fuzzyMatch(a.hint || '', q) ||
      fuzzyMatch(a.group, q)
    );
  }, [query, allActions, promptActions]);

  /* Final flat list with recent at top when no query */
  const flatList = useMemo(() => {
    if (!query.trim()) {
      const rest = filteredStatic.filter(a => !recentIds.includes(a.id));
      return [...recentActions, ...rest];
    }
    return filteredStatic;
  }, [query, recentActions, filteredStatic, recentIds]);

  /* Group the flat list */
  const grouped = useMemo(() => {
    const map = new Map();
    flatList.forEach(a => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group).push(a);
    });
    return [...map.entries()];
  }, [flatList]);

  // selection reset handled during render on query change

  /* Scroll selected item into view */
  useEffect(() => {
    itemRefs.current[selectedIdx]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  /* Keyboard handler */
  const handleSelect = useCallback((action) => {
    // Track recent
    const newRecent = [action.id, ...recentIds.filter(id => id !== action.id)].slice(0, MAX_RECENT);
    setRecentIds(newRecent);
    saveRecent(newRecent);

    sound.play('click');
    onClose();

    if (action.group === 'Prompts' && action.pageId) { onNav(action.pageId); return; }
    if (action.pageId) { onNav(action.pageId); return; }
    if (action.id === 'action-connect') { onConnect?.(); return; }
    if (action.id === 'action-export')  { onExport?.();  return; }
  }, [onClose, onNav, onConnect, onExport, recentIds]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape')    { sound.play('click'); onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); sound.play('hover'); setSelectedIdx(i => Math.min(i + 1, flatList.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); sound.play('hover'); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (flatList[selectedIdx]) handleSelect(flatList[selectedIdx]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flatList, selectedIdx, handleSelect, onClose]);

  if (!open) return null;

  /* Build a flat index map for item refs */
  let globalIdx = -1;

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes cpBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cpSlideDown {
          from { opacity: 0; transform: translateY(-18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes cpBorderPulse {
          0%,100% { box-shadow: 0 0 0 1px rgba(245,183,49,0.25), 0 0 40px rgba(245,183,49,0.08), 0 32px 96px rgba(0,0,0,0.75); }
          50%      { box-shadow: 0 0 0 1px rgba(245,183,49,0.45), 0 0 64px rgba(245,183,49,0.18), 0 32px 96px rgba(0,0,0,0.75); }
        }
        .cp-result-row { transition: background 0.08s, border-color 0.08s; }
        .cp-result-row:hover { background: rgba(245,183,49,0.07) !important; }
        .cp-scrollarea::-webkit-scrollbar { width: 4px; }
        .cp-scrollarea::-webkit-scrollbar-track { background: transparent; }
        .cp-scrollarea::-webkit-scrollbar-thumb { background: rgba(245,183,49,0.2); border-radius: 4px; }
        .cp-badge {
          font-size: 9px; font-weight: 700; padding: 2px 7px;
          background: rgba(245,183,49,0.15); color: #f5b731;
          border: 1px solid rgba(245,183,49,0.3); border-radius: 20px;
          letter-spacing: .06em; text-transform: uppercase;
          transition: background 0.1s;
        }
        .cp-badge-active { background: rgba(245,183,49,0.3) !important; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(3,3,10,0.80)',
          backdropFilter: 'blur(16px) saturate(150%)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '10vh',
          animation: 'cpBackdropIn 0.15s ease',
        }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* ── Modal ── */}
        <div style={{
          width: '100%', maxWidth: 600,
          background: 'linear-gradient(160deg, rgba(18,18,32,0.99) 0%, rgba(12,12,22,0.99) 100%)',
          border: '1px solid rgba(245,183,49,0.3)',
          borderRadius: 18,
          overflow: 'hidden',
          animation: 'cpSlideDown 0.22s cubic-bezier(0.34,1.56,0.64,1), cpBorderPulse 3s ease-in-out 0.3s infinite',
          maxHeight: 500,
          display: 'flex', flexDirection: 'column',
        }}>

          {/* ── Search bar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.015)',
          }}>
            {/* Animated search icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg,rgba(245,183,49,0.25),rgba(245,183,49,0.08))',
              border: '1px solid rgba(245,183,49,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>
              {query ? '🔍' : '⚡'}
            </div>

            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search pages, accounts, prompts, actions…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#e8e8f0', fontSize: 15, fontFamily: 'Syne, sans-serif', fontWeight: 500,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, color: 'var(--muted)', fontSize: 11,
                    padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Clear
                </button>
              )}
              <kbd style={{
                fontSize: 10, padding: '3px 7px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, color: 'var(--muted)', fontFamily: 'DM Mono, monospace',
              }}>ESC</kbd>
            </div>
          </div>

          {/* ── Results ── */}
          <div
            ref={listRef}
            className="cp-scrollarea"
            style={{ overflowY: 'auto', flex: 1, padding: '6px 0' }}
          >
            {flatList.length === 0 && (
              <div style={{
                padding: '40px 24px', textAlign: 'center',
                color: 'var(--muted)', fontSize: 13,
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔮</div>
                <div>No results for <strong style={{ color: '#c0c0d4' }}>"{query}"</strong></div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>Try a page name, account, or prompt keyword</div>
              </div>
            )}

            {grouped.map(([group, items]) => {
              const meta = GROUP_META[group] || { emoji: '•', color: 'var(--muted)' };
              return (
                <div key={group}>
                  {/* Section header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px 4px',
                  }}>
                    <span style={{ fontSize: 11 }}>{meta.emoji}</span>
                    <span style={{
                      fontSize: 9.5, fontWeight: 800, color: meta.color,
                      textTransform: 'uppercase', letterSpacing: '.1em',
                      opacity: 0.85,
                    }}>
                      {group}
                    </span>
                    <div style={{
                      flex: 1, height: 1,
                      background: `linear-gradient(90deg, ${meta.color}30, transparent)`,
                      marginLeft: 4,
                    }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                      {items.length}
                    </span>
                  </div>

                  {/* Items */}
                  {items.map(action => {
                    globalIdx++;
                    const thisIdx  = globalIdx;
                    const isActive = selectedIdx === thisIdx;

                    return (
                      <div
                        key={action.id}
                        ref={el => { itemRefs.current[thisIdx] = el; }}
                        className="cp-result-row"
                        onMouseEnter={() => {
                          if (selectedIdx !== thisIdx) {
                            sound.play('hover');
                            setSelectedIdx(thisIdx);
                          }
                        }}
                        onClick={() => handleSelect(action)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '9px 18px', cursor: 'pointer',
                          background: isActive
                            ? 'linear-gradient(90deg,rgba(245,183,49,0.13),rgba(245,183,49,0.04))'
                            : 'transparent',
                          borderLeft: `2.5px solid ${isActive ? '#f5b731' : 'transparent'}`,
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: isActive
                            ? `linear-gradient(135deg, ${meta.color}30, ${meta.color}10)`
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isActive ? meta.color + '40' : 'rgba(255,255,255,0.06)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14,
                          transition: 'all 0.1s',
                        }}>
                          {action.icon}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 600,
                            color: isActive ? '#fff' : '#bbbbd0',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {action.label}
                          </div>
                          {action.hint && (
                            <div style={{
                              fontSize: 10.5, color: 'var(--muted)',
                              marginTop: 1,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {action.hint}
                            </div>
                          )}
                        </div>

                        {/* Right side: badge or shortcut */}
                        {action.badge && (
                          <span className={`cp-badge${isActive ? ' cp-badge-active' : ''}`}>
                            {action.badge}
                          </span>
                        )}
                        {action.shortcut && !action.badge && (
                          <kbd style={{
                            fontSize: 10, padding: '3px 8px',
                            background: isActive ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isActive ? 'rgba(245,183,49,0.4)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 6, color: isActive ? '#f5b731' : 'var(--muted)',
                            fontFamily: 'DM Mono, monospace',
                            transition: 'all 0.1s',
                          }}>
                            {action.shortcut}
                          </kbd>
                        )}

                        {/* Active indicator arrow */}
                        {isActive && (
                          <span style={{
                            fontSize: 12, color: '#f5b731', opacity: 0.7,
                            marginLeft: 2, flexShrink: 0,
                          }}>›</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '9px 18px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.2)',
            fontSize: 10.5, color: 'rgba(255,255,255,0.3)',
            flexShrink: 0,
          }}>
            <span>↑↓ navigate</span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
            <span>↵ select</span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
            <span>ESC close</span>

            {/* Result count */}
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>
              {flatList.length} result{flatList.length !== 1 ? 's' : ''}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
            <span style={{
              background: 'linear-gradient(90deg,#f5b731,#f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontWeight: 800, fontSize: 10,
            }}>
              ⚡ Bolt Studio Pro
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
