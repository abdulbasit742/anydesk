import { useState, useMemo, useCallback, useEffect } from 'react';
import { useStore } from '../data/store';
import { useToast } from '../components/Toast';
import { PLATFORMS } from '../data/constants';
import EmptyState from '../components/EmptyState';

const AVAILABLE_TAGS = ['🚀 Production', '🛠️ Bugfix', '🧪 Sandbox', '✨ Creative', '💡 Guide'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatFull(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDateOnly(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const FILTERS = [
  { id: 'all',   label: 'All Time',   icon: '∞' },
  { id: 'today', label: 'Today',      icon: '☀' },
  { id: 'week',  label: 'This Week',  icon: '📅' },
  { id: 'month', label: 'This Month', icon: '🗓' },
];

function isInRange(dateStr, filter) {
  if (filter === 'all') return true;
  const now = new Date();
  const d = new Date(dateStr);
  if (filter === 'today') return d.toDateString() === now.toDateString();
  if (filter === 'week')  return d >= new Date(now - 7 * 864e5);
  if (filter === 'month') return d >= new Date(now - 30 * 864e5);
  return true;
}

function getSuccessRate(b) {
  const ok = b.successCount || 0;
  const fail = b.failureCount || b.failCount || 0;
  const total = ok + fail;
  if (total === 0) return null;
  return Math.round((ok / total) * 100);
}

function RateBar({ rate }) {
  if (rate === null) return null;
  const color = rate >= 80 ? 'var(--teal)' : rate >= 50 ? 'var(--gold)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 60, height: 4, background: 'var(--surface3)', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${rate}%`, background: color, borderRadius: 99, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color }}>{rate}%</span>
    </div>
  );
}

/* ── Timeline dot with animated entrance ─────────────────── */
function TimelineDot({ ok, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);
  const color = ok ? 'var(--teal)' : 'var(--red)';
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      background: `${color}22`,
      border: `2px solid ${color}`,
      boxShadow: visible ? `0 0 8px ${color}60` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      transition: 'box-shadow 0.4s, opacity 0.4s',
      opacity: visible ? 1 : 0,
      position: 'relative',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
    </div>
  );
}

/* ── Stats Banner ─────────────────────────────────────────── */
function StatsBanner({ broadcasts, accounts }) {
  const stats = useMemo(() => {
    const total   = broadcasts.length;
    const success = broadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
    const failed  = broadcasts.reduce((s, b) => s + (b.failureCount || b.failCount || 0), 0);
    const rate    = (success + failed) > 0 ? Math.round((success / (success + failed)) * 100) : 0;

    // Accounts hit = unique targetIds across all broadcasts
    const allTargets = new Set();
    broadcasts.forEach(b => (b.targetIds || []).forEach(id => allTargets.add(id)));

    // Most used platform
    const platCount = {};
    broadcasts.forEach(b => {
      (b.targetIds || []).forEach(tid => {
        const acc = accounts.find(a => a.id === tid);
        if (acc?.platform) platCount[acc.platform] = (platCount[acc.platform] || 0) + 1;
      });
    });
    const topPlat = Object.entries(platCount).sort((a, b) => b[1] - a[1])[0];
    const topPlatLabel = topPlat
      ? (PLATFORMS.find(p => p.id === topPlat[0])?.name || topPlat[0])
      : '—';

    return { total, success, failed, rate, accountsHit: allTargets.size, topPlatLabel };
  }, [broadcasts, accounts]);

  const items = [
    { label: 'Total Broadcasts', val: stats.total,         color: 'var(--blue)',   icon: '📡' },
    { label: 'Success Rate',     val: `${stats.rate}%`,    color: stats.rate >= 70 ? 'var(--teal)' : 'var(--gold)', icon: '✓' },
    { label: 'Accounts Hit',     val: stats.accountsHit,   color: 'var(--purple)', icon: '👤' },
    { label: 'Top Platform',     val: stats.topPlatLabel,  color: 'var(--cyan)',   icon: '🏆', small: true },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 4 }}>
      {items.map(s => (
        <div key={s.label} style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderTop: `2px solid ${s.color}`, borderRadius: 12, padding: '14px 16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: 50, height: 50, borderRadius: '50%', background: `${s.color}12`, filter: 'blur(14px)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{s.label}</span>
            <span style={{ fontSize: 14, opacity: .7 }}>{s.icon}</span>
          </div>
          <div style={{ fontSize: s.small ? 14 : 24, fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.val}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Vertical Timeline Card ──────────────────────────────── */
function TimelineEntry({ b, index, isLeft, expandedId, setExpandedId, handleUpdateBroadcast, handleReuse, accounts, toast }) {
  const isExpanded = expandedId === b.id;
  const successCount = b.successCount || 0;
  const failCount    = b.failureCount || b.failCount || 0;
  const targetCount  = b.targetIds?.length || b.accountCount || 0;
  const rate         = getSuccessRate(b);
  const prompt       = b.prompt || b.content || '';
  const ok           = failCount === 0 && successCount > 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 32px 1fr',
      gap: 0,
      animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
      marginBottom: 4,
    }}>
      {/* Left side content */}
      <div style={{
        paddingRight: 16,
        paddingBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isLeft ? 'flex-end' : 'flex-start',
        opacity: isLeft ? 1 : 0,
        pointerEvents: isLeft ? 'all' : 'none',
      }}>
        {isLeft && (
          <TimelineCard
            b={b}
            isExpanded={isExpanded}
            setExpandedId={setExpandedId}
            handleUpdateBroadcast={handleUpdateBroadcast}
            handleReuse={handleReuse}
            accounts={accounts}
            toast={toast}
            successCount={successCount}
            failCount={failCount}
            targetCount={targetCount}
            rate={rate}
            prompt={prompt}
            ok={ok}
          />
        )}
      </div>

      {/* Center spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Connecting line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05))', left: '50%', transform: 'translateX(-50%)' }} />
        {/* Dot */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 12 }}>
          <TimelineDot ok={ok} index={index} />
        </div>
      </div>

      {/* Right side content */}
      <div style={{
        paddingLeft: 16,
        paddingBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        opacity: !isLeft ? 1 : 0,
        pointerEvents: !isLeft ? 'all' : 'none',
      }}>
        {!isLeft && (
          <TimelineCard
            b={b}
            isExpanded={isExpanded}
            setExpandedId={setExpandedId}
            handleUpdateBroadcast={handleUpdateBroadcast}
            handleReuse={handleReuse}
            accounts={accounts}
            toast={toast}
            successCount={successCount}
            failCount={failCount}
            targetCount={targetCount}
            rate={rate}
            prompt={prompt}
            ok={ok}
          />
        )}
      </div>
    </div>
  );
}

function TimelineCard({ b, isExpanded, setExpandedId, handleUpdateBroadcast, handleReuse, accounts, toast, successCount, failCount, targetCount, rate, prompt, ok }) {
  const dotColor = ok ? 'var(--teal)' : failCount > 0 ? 'var(--red)' : 'var(--muted)';

  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid ${isExpanded ? dotColor : 'var(--border)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      width: '100%',
      transition: 'all 0.2s',
      boxShadow: isExpanded ? `0 0 16px ${dotColor}20` : 'none',
      cursor: 'pointer',
    }}
      onClick={() => setExpandedId(isExpanded ? null : b.id)}
    >
      {/* Card top accent */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${dotColor}00, ${dotColor}, ${dotColor}00)` }} />

      <div style={{ padding: '10px 14px' }}>
        {/* Time badge */}
        <div style={{
          fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace',
          marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: dotColor, fontWeight: 700 }}>{ok ? '✓' : failCount > 0 ? '✕' : '○'}</span>
          {formatFull(b.createdAt)} · {timeAgo(b.createdAt)}
        </div>

        {/* Prompt preview */}
        <div style={{
          fontSize: 11.5, color: '#c8d0e0', fontFamily: 'DM Mono,monospace',
          lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          marginBottom: 8,
        }}>
          {prompt || '(no prompt text)'}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>👤 {targetCount} acct</span>
          {successCount > 0 && <span style={{ fontSize: 9.5, color: 'var(--teal)', fontWeight: 700 }}>✓ {successCount}</span>}
          {failCount > 0 && <span style={{ fontSize: 9.5, color: 'var(--red)', fontWeight: 700 }}>✕ {failCount}</span>}
          {rate !== null && <RateBar rate={rate} />}
          {b.tags?.slice(0, 1).map(t => (
            <span key={t} style={{ fontSize: 8, background: 'var(--surface3)', padding: '1px 5px', borderRadius: 3 }}>{t}</span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'var(--surface)' }}
          onClick={e => e.stopPropagation()}>

          {/* Topology */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Transmission Topology</div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
              <div className="topo-node success" title="Central Broadcaster">📡</div>
              <div className="topo-line success" style={{ maxWidth: 40 }} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {b.targetIds && b.targetIds.length > 0 ? b.targetIds.map((tid, tIdx) => {
                  const acc = accounts.find(a => a.id === tid);
                  if (!acc) return null;
                  const isNodeOk = !(failCount > 0 && tIdx === b.targetIds.length - 1);
                  const pl = PLATFORMS.find(p => p.id === acc.platform);
                  return (
                    <div key={tid} style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={`topo-node ${isNodeOk ? 'success' : 'failed'}`} title={`${acc.name} (${acc.email})`}>
                        {pl?.abbr || 'AI'}
                      </div>
                      {tIdx < b.targetIds.length - 1 && <div className={`topo-line ${isNodeOk ? 'success' : 'failed'}`} style={{ width: 14, flex: 'none' }} />}
                    </div>
                  );
                }) : <span style={{ fontSize: 10, color: 'var(--muted)' }}>No accounts mapped</span>}
              </div>
            </div>
          </div>

          {/* Full prompt */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Full Prompt Payload</div>
          <pre style={{
            fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#c8d0e0',
            lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            background: 'var(--surface2)', padding: '10px 12px', borderRadius: 8,
            border: '1px solid var(--border)', maxHeight: 180, overflowY: 'auto', marginBottom: 12,
          }}>
            {prompt || '(empty)'}
          </pre>

          {/* Tags + Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Classification Tags</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {AVAILABLE_TAGS.map(t => {
                  const isTagged = b.tags?.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        const currentTags = b.tags || [];
                        const nextTags = isTagged ? currentTags.filter(x => x !== t) : [...currentTags, t];
                        handleUpdateBroadcast(b.id, { tags: nextTags });
                      }}
                      style={{
                        padding: '4px 8px', borderRadius: 6, fontSize: 9.5, fontWeight: 600, cursor: 'pointer',
                        border: `1px solid ${isTagged ? 'var(--gold)' : 'var(--border)'}`,
                        background: isTagged ? 'var(--gold-glow)' : 'transparent',
                        color: isTagged ? 'var(--gold)' : 'var(--muted2)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Annotations</div>
              <input
                value={b.notes || ''}
                onChange={e => handleUpdateBroadcast(b.id, { notes: e.target.value })}
                placeholder="Add telemetry notes…"
                style={{ width: '100%', padding: '6px 10px', fontSize: 11, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            <button className="btn btn-gold btn-sm" onClick={() => handleReuse(prompt)}>📡 Reuse Prompt</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(prompt); toast.success('Copied!'); }}>📋 Copy</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 9.5, color: 'var(--muted)', alignSelf: 'center', fontFamily: 'DM Mono, monospace' }}>ID: {b.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Date Separator marker ────────────────────────────────── */
function DateMarker({ date }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 32px 1fr',
      marginBottom: 4,
    }}>
      <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.07)', margin: 'auto 0', height: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontSize: 8.5, fontWeight: 800, color: 'var(--muted)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '3px 10px',
          textTransform: 'uppercase', letterSpacing: '.06em',
          whiteSpace: 'nowrap', zIndex: 1,
        }}>
          {date}
        </div>
      </div>
      <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.07)', margin: 'auto 0', height: 1 }} />
    </div>
  );
}

export default function History({ onNav }) {
  const store = useStore();
  const toast = useToast();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'list'

  // Tag Annotation filters
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');
  const [tagSearch, setTagSearch] = useState('');

  // Comparative Diff Mode state
  const [compareList, setCompareList] = useState([]);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const broadcasts = useMemo(() => store.broadcasts || [], [store.broadcasts]);
  const accounts = useMemo(() => store.accounts || [], [store.accounts]);

  const handleUpdateBroadcast = (id, updates) => {
    store.setState(prev => ({
      ...prev,
      broadcasts: prev.broadcasts.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  // Sparkline SVG Trend path builder
  const getTrendPath = useCallback((type) => {
    if (broadcasts.length < 2) return '';
    const points = broadcasts.slice(-10).map((b, i) => {
      const x = (i / Math.max(1, broadcasts.slice(-10).length - 1)) * 120;
      const count = type === 'success' ? (b.successCount || 0) : (b.failureCount || b.failCount || 0);
      const y = 22 - Math.min(20, (count * 4));
      return `${x},${y}`;
    });
    return points.join(' ');
  }, [broadcasts]);

  // Telemetry KPIs calculations
  const stats = useMemo(() => {
    const total   = broadcasts.length;
    const success = broadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
    const failed  = broadcasts.reduce((s, b) => s + (b.failureCount || b.failCount || 0), 0);
    const rate    = (success + failed) > 0 ? Math.round((success / (success + failed)) * 100) : 0;
    const today   = broadcasts.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()).length;
    return { total, success, failed, rate, today };
  }, [broadcasts]);

  // Filtered + Sorted Telemetry list
  const filtered = useMemo(() => {
    let list = broadcasts.filter(b => isInRange(b.createdAt, filter));
    if (selectedTagFilter !== 'All') {
      list = list.filter(b => b.tags?.includes(selectedTagFilter));
    }
    if (tagSearch.trim()) {
      const ts = tagSearch.toLowerCase();
      list = list.filter(b => b.tags && b.tags.some(t => t.toLowerCase().includes(ts)));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        (b.prompt || '').toLowerCase().includes(q) ||
        (b.notes || '').toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'oldest':  list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'success': list = [...list].sort((a, b) => (b.successCount || 0) - (a.successCount || 0)); break;
      case 'failed':  list = [...list].sort((a, b) => (b.failureCount || b.failCount || 0) - (a.failureCount || a.failCount || 0)); break;
      default:        list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [broadcasts, filter, search, sortBy, selectedTagFilter, tagSearch]);

  const handleClear = useCallback(() => {
    if (!confirmClear) { setConfirmClear(true); return; }
    store.setState(prev => ({ ...prev, broadcasts: [] }));
    toast.info('Broadcast history cleared');
    setConfirmClear(false);
  }, [confirmClear, store, toast]);

  const handleReuse = useCallback((prompt) => {
    navigator.clipboard.writeText(prompt);
    toast.bolt('Prompt copied → heading to Broadcast!');
    onNav?.('broadcast');
  }, [onNav, toast]);

  const handleExportCSV = useCallback(() => {
    const rows = [
      ['ID', 'Date', 'Prompt', 'Accounts', 'Success', 'Failed', 'Tags', 'Notes'].join(','),
      ...broadcasts.map(b => [
        b.id,
        new Date(b.createdAt).toISOString(),
        `"${(b.prompt || '').replace(/"/g, '""')}"`,
        b.targetIds?.length || 0,
        b.successCount || 0,
        b.failureCount || b.failCount || 0,
        `"${(b.tags || []).join(', ')}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`,
      ].join(',')),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `broadcasts-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  }, [broadcasts, toast]);

  const handleToggleCompare = (id, e) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) {
        toast.info('You can select a maximum of 2 broadcasts for comparison');
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const computedDiffs = useMemo(() => {
    if (compareList.length !== 2) return null;
    const b1 = broadcasts.find(b => b.id === compareList[0]);
    const b2 = broadcasts.find(b => b.id === compareList[1]);
    if (!b1 || !b2) return null;
    const lines1 = (b1.prompt || '').split('\n');
    const lines2 = (b2.prompt || '').split('\n');
    return {
      title1: `Prompt #${b1.id.slice(0, 4)} (${formatFull(b1.createdAt)})`,
      title2: `Prompt #${b2.id.slice(0, 4)} (${formatFull(b2.createdAt)})`,
      lines1: lines1.map((l, idx) => ({ text: l, type: l !== lines2[idx] ? 'del' : 'normal' })),
      lines2: lines2.map((l, idx) => ({ text: l, type: l !== lines1[idx] ? 'ins' : 'normal' })),
    };
  }, [compareList, broadcasts]);

  // Group filtered by date for timeline date markers
  const groupedByDate = useMemo(() => {
    const groups = [];
    let lastDate = null;
    filtered.forEach((b, i) => {
      const dateStr = formatDateOnly(b.createdAt);
      if (dateStr !== lastDate) {
        groups.push({ type: 'date', date: dateStr, key: `date-${dateStr}-${i}` });
        lastDate = dateStr;
      }
      groups.push({ type: 'entry', b, index: i, key: b.id });
    });
    return groups;
  }, [filtered]);

  if (!broadcasts.length) {
    return (
      <EmptyState icon="📡" title="No broadcasts yet"
        description="Send your first broadcast and it will be logged here with full results.">
        <button className="btn btn-gold" onClick={() => onNav?.('broadcast')}>⚡ Go to Broadcast</button>
      </EmptyState>
    );
  }

  return (
    <>
      {/* ── Stats Banner ──────────────────────────────────────── */}
      <StatsBanner broadcasts={broadcasts} accounts={accounts} />

      {/* ── Existing KPI Cards with Sparklines ─────────────── */}
      <div className="tel-grid">
        {/* Total Sent */}
        <div className="tel-card" style={{ borderTop: '2px solid var(--blue)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Broadcasts</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', marginTop: 2 }}>{stats.total}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>all time transmissions</div>
        </div>

        {/* Today */}
        <div className="tel-card" style={{ borderTop: '2px solid var(--purple)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)', marginTop: 2 }}>{stats.today}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>dispatched today</div>
        </div>

        {/* Delivered Sparkline */}
        <div className="tel-card" style={{ borderTop: '2px solid var(--teal)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delivered</span>
            <span style={{ fontSize: 9.5, color: 'var(--teal)', fontWeight: 800 }}>✓ {stats.success}</span>
          </div>
          <svg className="tel-sparkline">
            <polyline fill="none" stroke="var(--teal)" strokeWidth="1.8" points={getTrendPath('success')} />
          </svg>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>success trend sparkline</div>
        </div>

        {/* Failed Sparkline */}
        <div className="tel-card" style={{ borderTop: '2px solid var(--red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Failed</span>
            <span style={{ fontSize: 9.5, color: 'var(--red)', fontWeight: 800 }}>✕ {stats.failed}</span>
          </div>
          <svg className="tel-sparkline">
            <polyline fill="none" stroke="var(--red)" strokeWidth="1.8" points={getTrendPath('fail')} />
          </svg>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>failure trend sparkline</div>
        </div>

        {/* Global Success Rate */}
        <div className="tel-card" style={{ borderTop: `2px solid ${stats.rate >= 70 ? 'var(--teal)' : 'var(--gold)'}` }}>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Success Rate</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: stats.rate >= 70 ? 'var(--teal)' : 'var(--gold)', marginTop: 2 }}>{stats.rate}%</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>overall handshake ratio</div>
        </div>
      </div>

      {/* ── Controls Bar ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts or annotations..."
            style={{ paddingLeft: 30, width: '100%' }}
          />
        </div>

        {/* Sort select */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: '#e4e4ed', fontSize: 12, cursor: 'pointer' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="success">Most Successful</option>
          <option value="failed">Most Failed</option>
        </select>

        {/* View mode toggle */}
        <div style={{
          display: 'flex', gap: 2,
          background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 2,
          border: '1px solid var(--border)',
        }}>
          {[
            { id: 'timeline', label: '⟳ Timeline' },
            { id: 'list',     label: '☰ List' },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: viewMode === v.id ? 'var(--gold)' : 'transparent',
                color: viewMode === v.id ? '#0e0e16' : 'var(--muted)',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Export */}
        <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>⬇ Export CSV</button>

        {/* Clear */}
        <button
          className="btn btn-sm"
          onClick={handleClear}
          style={{
            background: confirmClear ? 'var(--red)' : 'rgba(255,95,95,0.12)',
            color: confirmClear ? '#fff' : 'var(--red)',
            border: `1px solid ${confirmClear ? 'var(--red)' : 'rgba(255,95,95,0.3)'}`,
            borderRadius: 8, cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s',
          }}
        >
          {confirmClear ? '⚠ Confirm Clear' : '🗑 Clear'}
        </button>
        {confirmClear && (
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>Cancel</button>
        )}
      </div>

      {/* ── Tag + Time Filters ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
              border: `1px solid ${filter === f.id ? 'var(--gold)' : 'var(--border)'}`,
              background: filter === f.id ? 'var(--gold-glow)' : 'transparent',
              color: filter === f.id ? 'var(--gold)' : 'var(--muted)',
              transition: 'all 0.15s',
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}

        <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={e => setTagSearch(e.target.value)}
            style={{
              padding: '4px 8px 4px 20px',
              fontSize: 10.5,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: '#dde0f0',
              outline: 'none',
              width: 110,
            }}
          />
          <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 10, pointerEvents: 'none' }}>🏷️</span>
          {tagSearch && (
            <button
              onClick={() => setTagSearch('')}
              style={{
                position: 'absolute', right: 6, background: 'none', border: 'none', color: 'var(--muted)',
                cursor: 'pointer', fontSize: 9, padding: 0
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`annotation-badge ${selectedTagFilter === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedTagFilter('All')}
        >
          🏷️ All
        </button>
        {AVAILABLE_TAGS.map(t => {
          const hasTag = broadcasts.some(b => b.tags?.includes(t));
          if (!hasTag) return null;
          return (
            <button
              key={t}
              className={`annotation-badge ${selectedTagFilter === t ? 'active' : ''}`}
              onClick={() => setSelectedTagFilter(t)}
            >
              {t}
            </button>
          );
        })}

        <span style={{ fontSize: 10, color: 'var(--muted)', alignSelf: 'center', marginLeft: 'auto', fontFamily: 'DM Mono, monospace' }}>
          {filtered.length} broadcasts
        </span>
      </div>

      {/* ── MAIN CONTENT: Timeline or List ───────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>🔍</div>
          No telemetry logs match your filters.
        </div>
      ) : viewMode === 'timeline' ? (

        /* ── TIMELINE VIEW ── */
        <div style={{ paddingBottom: 70 }}>
          {groupedByDate.map((item) => {
            if (item.type === 'date') {
              return <DateMarker key={item.key} date={item.date} />;
            }
            const { b, index } = item;
            const isLeft = index % 2 === 0;
            return (
              <TimelineEntry
                key={item.key}
                b={b}
                index={index}
                isLeft={isLeft}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                handleUpdateBroadcast={handleUpdateBroadcast}
                handleReuse={handleReuse}
                accounts={accounts}
                toast={toast}
              />
            );
          })}

          {/* Timeline end cap */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr' }}>
            <div />
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: 'var(--surface3)', border: '2px solid var(--border)',
              }} />
            </div>
            <div />
          </div>
        </div>

      ) : (

        /* ── LIST VIEW (original) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 70 }}>
          {filtered.map((b) => {
            const successCount = b.successCount || 0;
            const failCount    = b.failureCount || b.failCount || 0;
            const targetCount  = b.targetIds?.length || b.accountCount || 0;
            const rate         = getSuccessRate(b);
            const isExpanded   = expandedId === b.id;
            const prompt       = b.prompt || b.content || '';
            const isCheckedForCompare = compareList.includes(b.id);

            return (
              <div
                key={b.id}
                style={{
                  background: 'var(--surface2)',
                  border: `1px solid ${isExpanded ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s',
                  boxShadow: isExpanded ? '0 0 20px rgba(245,183,49,0.08)' : 'none',
                }}
              >
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                  style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  {/* Select Checkbox */}
                  <div
                    onClick={(e) => handleToggleCompare(b.id, e)}
                    style={{
                      width: 16, height: 16, borderRadius: 4, border: `1px solid ${isCheckedForCompare ? 'var(--gold)' : 'var(--border2)'}`,
                      background: isCheckedForCompare ? 'var(--gold)' : 'var(--surface3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#0e0e16', fontWeight: 'bold', flexShrink: 0,
                    }}
                  >
                    {isCheckedForCompare && '✓'}
                  </div>

                  {/* Counter */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--surface3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: 'var(--muted)', flexShrink: 0, fontFamily: 'DM Mono, monospace',
                  }}>
                    {broadcasts.length - broadcasts.findIndex(x => x.id === b.id)}
                  </div>

                  {/* Prompt Preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: '#d0d0e0', fontFamily: 'DM Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prompt || '(no prompt text)'}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>🕓 {formatFull(b.createdAt)}</span>
                      <span style={{ fontSize: 10, color: 'var(--muted2)' }}>👤 {targetCount} accounts</span>
                      {b.tags?.map(t => (
                        <span key={t} style={{ fontSize: 9, background: 'var(--surface3)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {successCount > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal)' }}>✓ {successCount}</div>
                        <div style={{ fontSize: 8.5, color: 'var(--muted)' }}>sent</div>
                      </div>
                    )}
                    {failCount > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--red)' }}>✕ {failCount}</div>
                        <div style={{ fontSize: 8.5, color: 'var(--muted)' }}>failed</div>
                      </div>
                    )}
                    <RateBar rate={rate} />
                    <span style={{ fontSize: 14, color: 'var(--muted)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'var(--surface)' }}>
                    {/* Topology */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Handshake Transmission Topology</div>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                        <div className="topo-node success" title="Central Telemetry Broadcaster Hub">📡</div>
                        <div className="topo-line success" style={{ maxWidth: 40 }} />
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          {b.targetIds && b.targetIds.length > 0 ? b.targetIds.map((tid, tIdx) => {
                            const acc = accounts.find(a => a.id === tid);
                            if (!acc) return null;
                            const isNodeOk = !(failCount > 0 && tIdx === b.targetIds.length - 1);
                            const pl = PLATFORMS.find(p => p.id === acc.platform);
                            return (
                              <div key={tid} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={`topo-node ${isNodeOk ? 'success' : 'failed'}`} title={`${acc.name} (${acc.email})`}>
                                  {pl?.abbr || 'AI'}
                                </div>
                                {tIdx < b.targetIds.length - 1 && <div className={`topo-line ${isNodeOk ? 'success' : 'failed'}`} style={{ width: 14, flex: 'none' }} />}
                              </div>
                            );
                          }) : <span style={{ fontSize: 10, color: 'var(--muted)' }}>No accounts mapped to project slots</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Full Telemetry Prompt Payload</div>
                    <pre style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 11.5, color: '#c8d0e0',
                      lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      background: 'var(--surface2)', padding: '12px 14px', borderRadius: 8,
                      border: '1px solid var(--border)', maxHeight: 200, overflowY: 'auto', marginBottom: 14,
                    }}>
                      {prompt || '(empty)'}
                    </pre>

                    {/* Tags + Notes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14, marginBottom: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Telemetry Classification tags</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {AVAILABLE_TAGS.map(t => {
                            const isTagged = b.tags?.includes(t);
                            return (
                              <button
                                key={t}
                                onClick={() => {
                                  const currentTags = b.tags || [];
                                  const nextTags = isTagged ? currentTags.filter(x => x !== t) : [...currentTags, t];
                                  handleUpdateBroadcast(b.id, { tags: nextTags });
                                }}
                                style={{
                                  padding: '4px 8px', borderRadius: 6, fontSize: 9.5, fontWeight: 600, cursor: 'pointer',
                                  border: `1px solid ${isTagged ? 'var(--gold)' : 'var(--border)'}`,
                                  background: isTagged ? 'var(--gold-glow)' : 'transparent',
                                  color: isTagged ? 'var(--gold)' : 'var(--muted2)',
                                  transition: 'all 0.15s',
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Custom Annotations / Telemetry notes</div>
                        <input
                          value={b.notes || ''}
                          onChange={e => handleUpdateBroadcast(b.id, { notes: e.target.value })}
                          placeholder="Annotate telemetry details…"
                          style={{ width: '100%', padding: '6px 10px', fontSize: 11, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <button className="btn btn-gold btn-sm" onClick={() => handleReuse(prompt)}>📡 Reuse Prompt</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(prompt); toast.success('Copied!'); }}>📋 Copy</button>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 10.5, color: 'var(--muted)', alignSelf: 'center', fontFamily: 'DM Mono, monospace' }}>TELEMETRY ID: {b.id}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Comparative Diff Bar ───────────────────────────────── */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 16, right: 24, left: 'calc(var(--sidebar-w) + 24px)',
          background: 'rgba(20,20,31,0.95)', border: '1px solid var(--gold)', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 0 30px rgba(245, 183, 49, 0.15)', backdropFilter: 'blur(10px)',
          animation: 'slideInRight 0.25s ease', zindex: 9,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🔬</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Comparative Prompt Workbench</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>Compare side-by-side versions ({compareList.length} of 2 selected)</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCompareList([])}>Reset</button>
            <button
              className="btn btn-gold btn-sm"
              disabled={compareList.length !== 2}
              onClick={() => setShowDiffModal(true)}
            >
              🔍 Run Visual Code Diff
            </button>
          </div>
        </div>
      )}

      {/* ── Diff Modal ─────────────────────────────────────────── */}
      {showDiffModal && computedDiffs && (
        <div className="overlay" onClick={() => setShowDiffModal(false)}>
          <div className="modal" style={{ maxWidth: 840, width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="modal-title">🔍 Visual Prompt Comparison Diffs</span>
              <button className="pw-close-btn" style={{ fontSize: 20 }} onClick={() => setShowDiffModal(false)}>✕</button>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: -6, marginBottom: 12 }}>
              Monospace difference highlights. Green highlights additions, Red highlights deletions.
            </p>

            <div className="diff-split">
              <div className="diff-pane">
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6, marginBottom: 8, fontSize: 10, fontWeight: 700, color: 'var(--red)' }}>
                  ➖ Deletions / Old Prompt Base ({computedDiffs.title1})
                </div>
                {computedDiffs.lines1.map((line, idx) => (
                  <span key={idx} className={`diff-line ${line.type === 'del' ? 'diff-del' : ''}`}>
                    {line.type === 'del' ? `- ` : `  `}{line.text || ' '}
                  </span>
                ))}
              </div>
              <div className="diff-pane">
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6, marginBottom: 8, fontSize: 10, fontWeight: 700, color: 'var(--teal)' }}>
                  ➕ Additions / New Prompt Target ({computedDiffs.title2})
                </div>
                {computedDiffs.lines2.map((line, idx) => (
                  <span key={idx} className={`diff-line ${line.type === 'ins' ? 'diff-ins' : ''}`}>
                    {line.type === 'ins' ? `+ ` : `  `}{line.text || ' '}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: 16 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDiffModal(false)}>Close Diff</button>
              <button
                className="btn btn-gold btn-sm"
                onClick={() => {
                  const b2 = broadcasts.find(b => b.id === compareList[1]);
                  if (b2) handleReuse(b2.prompt);
                  setShowDiffModal(false);
                }}
              >
                📡 Reuse Latest Prompt Version
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
