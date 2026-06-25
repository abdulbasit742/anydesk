import { useState, useMemo, useEffect } from 'react';
import { stateManager } from '../lib/stateManager';
import { bus, EVENTS } from '../lib/eventBus';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon, StatusBadge } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { sound } from '../lib/soundEngine';
import * as planGate from '../lib/planGate';
import UpgradeModal from '../components/UpgradeModal';

function ago(iso) {
  if (!iso) return 'Never';
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return 'Just now';
  if (d < 3600) return ~~(d / 60) + 'm ago';
  if (d < 86400) return ~~(d / 3600) + 'h ago';
  return ~~(d / 86400) + 'd ago';
}

function getNowIso() {
  return new Date().toISOString();
}

const normalizeAccount = (a) => {
  const credits = a.credits !== undefined ? Number(a.credits) : (a.creditBalance !== undefined ? Number(a.creditBalance) : 20);
  const maxCredits = a.maxCredits !== undefined ? Number(a.maxCredits) : (a.creditLimit !== undefined ? Number(a.creditLimit) : 100);
  
  let creditThreshold = 2;
  if (a.creditThreshold !== undefined) {
    creditThreshold = Number(a.creditThreshold);
  } else if (a.threshold !== undefined) {
    const t = Number(a.threshold);
    if (t <= 1) {
      creditThreshold = Math.round(t * maxCredits);
    } else {
      creditThreshold = t;
    }
  }
  
  const threshold = a.threshold !== undefined ? Number(a.threshold) : (maxCredits > 0 ? creditThreshold / maxCredits : 0.2);

  return {
    ...a,
    credits,
    maxCredits,
    threshold,
    creditBalance: credits,
    creditLimit: maxCredits,
    creditThreshold,
  };
};

function getSyncCredits(creditLimit, creditBalance) {
  const creditDelta = Math.floor(Math.random() * 5) - 2;
  return Math.max(0, Math.min(creditLimit || 30, (creditBalance || 20) + creditDelta));
}

function getRandomDelay() {
  return 100 + Math.random() * 400;
}

function getSweepResult() {
  const isSuccess = Math.random() > 0.05;
  const pingTime = Math.floor(10 + Math.random() * 45);
  return { isSuccess, latency: isSuccess ? `${pingTime}ms` : 'FAIL' };
}

export default function Accounts({ onConnect, onNav }) {
  const [accounts, setAccounts] = useState(() => {
    return stateManager.getAccounts().filter(a => !a.deletedAt).map(normalizeAccount);
  });
  const toast = useToast();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleConnectClick = () => {
    if (accounts.length >= planGate.getLimit('accounts')) {
      setShowUpgrade(true);
    } else {
      onConnect();
    }
  };

  useEffect(() => {
    const refresh = () => {
      setAccounts(stateManager.getAccounts().filter(a => !a.deletedAt).map(normalizeAccount));
    };
    bus.on(EVENTS.STATE_CHANGED, refresh);
    bus.on(EVENTS.SYSTEM_TICK, refresh);
    return () => {
      bus.off(EVENTS.STATE_CHANGED, refresh);
      bus.off(EVENTS.SYSTEM_TICK, refresh);
    };
  }, []);

  const updateAccount = (id, patch) => {
    const updatedPatch = { ...patch };
    if (patch.creditBalance !== undefined) {
      updatedPatch.credits = Number(patch.creditBalance);
    } else if (patch.credits !== undefined) {
      updatedPatch.creditBalance = Number(patch.credits);
    }
    if (patch.creditLimit !== undefined) {
      updatedPatch.maxCredits = Number(patch.creditLimit);
    } else if (patch.maxCredits !== undefined) {
      updatedPatch.creditLimit = Number(patch.maxCredits);
    }
    if (patch.creditThreshold !== undefined) {
      const limit = updatedPatch.creditLimit ?? 100;
      updatedPatch.threshold = limit > 0 ? Number(patch.creditThreshold) / limit : 0.2;
    } else if (patch.threshold !== undefined) {
      const limit = updatedPatch.creditLimit ?? 100;
      const t = Number(patch.threshold);
      updatedPatch.creditThreshold = t <= 1 ? Math.round(t * limit) : t;
    }
    stateManager.updateAccount(id, updatedPatch);
  };

  // State for view preferences & filters
  const [showPlatformOverview, setShowPlatformOverview] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState(() => {
    const saved = sessionStorage.getItem('accounts_platform_filter');
    if (saved) {
      sessionStorage.removeItem('accounts_platform_filter');
      return saved;
    }
    return 'all';
  });
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Drawer states
  const [confirmDel, setConfirmDel] = useState(null);
  const [editAcc, setEditAcc] = useState(null);
  const [syncingId, setSyncingId] = useState(null);
  const [sweeping, setSweeping] = useState(false);
  const [latencies, setLatencies] = useState({});
  const [drawerAcc, setDrawerAcc] = useState(null);
  const [showDrawerCredMap, setShowDrawerCredMap] = useState({}); // Feature 24

  // Compute platform connection counts
  const platformCounts = useMemo(() => {
    const counts = {};
    PLATFORMS.forEach(p => {
      counts[p.id] = accounts.filter(a => a.platform === p.id).length;
    });
    return counts;
  }, [accounts]);

  // Filter accounts list (Feature 25)
  const filteredAccounts = useMemo(() => {
    return accounts.filter(a => {
      const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.email && a.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pl.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = platformFilter === 'all' || a.platform === platformFilter;

      // Fixed status filter safety checks (Feature 25)
      let matchesStatus;
      if (statusFilter === 'all') matchesStatus = true;
      else if (statusFilter === 'low_credits') matchesStatus = (a.creditBalance || 20) < 15;
      else if (statusFilter === 'inactive') matchesStatus = a.status === 'inactive' || a.status === 'paused';
      else matchesStatus = a.status === statusFilter;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [accounts, searchQuery, platformFilter, statusFilter]);

  const toggleStatus = (id) => {
    sound.play('click');
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    const isCurrentlyActive = acc.status === 'active';
    if (isCurrentlyActive) {
      stateManager.pauseAccount(id);
      toast.success(`Paused ${acc.name}`);
    } else {
      stateManager.resumeAccount(id);
      toast.success(`Enabled ${acc.name}`);
    }
  };

  const handleSync = async (id) => {
    sound.play('click');
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    setSyncingId(id);
    toast.info(`Connecting to ${acc.name}...`);

    // Simulate active sync verification
    await new Promise(r => setTimeout(r, 1200));

    // Update random values for demo interactivity
    const newCredits = getSyncCredits(acc.creditLimit, acc.creditBalance);

    updateAccount(id, {
      creditBalance: newCredits,
      status: 'active',
      lastSync: getNowIso()
    });

    setSyncingId(null);
    sound.play('success');
    toast.bolt(`Synced ${acc.name} — status is Active`);
  };

  const handleDelete = (id) => {
    sound.play('warning');
    const acc = accounts.find(a => a.id === id);
    stateManager.deleteAccount(id);
    toast.success(
      <span>
        Removed account {acc?.name}.{' '}
        <button
          onClick={() => {
            stateManager.restoreAccount(id);
            toast.success(`Restored account ${acc?.name}`);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--gold)',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Undo
        </button>
      </span>
    );
    setConfirmDel(null);
  };

  // Feature 23: Parallel ping sweeper trigger
  const handleSweepStack = async () => {
    if (sweeping) return;
    setSweeping(true);
    sound.play('dispatch');
    toast.info("Initializing multi-platform parallel connection ping sweep...");

    await Promise.all(filteredAccounts.map(async (a) => {
      // Small artificial offset to make indicators feel sequential but running in parallel
      await new Promise(r => setTimeout(r, getRandomDelay()));

      const { isSuccess, latency } = getSweepResult();

      setLatencies(prev => ({ ...prev, [a.id]: latency }));
      updateAccount(a.id, {
        status: isSuccess ? 'active' : 'expired_session',
        lastSync: getNowIso()
      });
    }));

    setSweeping(false);
    sound.play('success');
    toast.bolt("✓ Parallel connection ping sweep completed successfully!");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editAcc.name.trim()) return;
    updateAccount(editAcc.id, {
      name: editAcc.name.trim(),
      email: editAcc.email.trim() || null,
      planType: editAcc.planType,
      creditBalance: Number(editAcc.creditBalance),
      creditLimit: Number(editAcc.creditLimit),
      creditThreshold: Number(editAcc.creditThreshold || 2),
      status: editAcc.status,
    });
    toast.success(`Updated details for ${editAcc.name}`);
    sound.play('success');
    setEditAcc(null);
  };

  if (!accounts.length) {
    return (
      <EmptyState icon="🔌" title="No accounts connected" subtitle="Connect your AI platform accounts to manage limits, monitor usage, and broadcast prompts.">
        <button className="btn btn-gold" onClick={handleConnectClick}>⚡ Connect Account</button>
        {showUpgrade && (
          <UpgradeModal
            feature="accounts"
            requiredPlan="pro"
            onClose={() => setShowUpgrade(false)}
            onNav={onNav}
          />
        )}
      </EmptyState>
    );
  }

  return (
    <>
      {/* Header Panel */}
      <div className="sec-hdr" style={{ marginBottom: 14 }}>
        <div>
          <span className="sec-lbl">{accounts.length} Accounts Connected</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { sound.play('click'); setShowPlatformOverview(!showPlatformOverview); }}
          >
            {showPlatformOverview ? '👁️ Hide Overview' : '👁️ Show Overview'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              sound.play('click');
              accounts.forEach(a => stateManager.resumeAccount(a.id));
              toast.success('Enabled all accounts');
            }}
          >
            ▶ Enable All
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              sound.play('click');
              accounts.forEach(a => stateManager.pauseAccount(a.id));
              toast.info('Paused all accounts');
            }}
          >
            ⏸ Pause All
          </button>

          {/* Feature 23 Sweeper Button */}
          <button
            className={`btn btn-ghost btn-sm ${sweeping ? 'btn-pulse' : ''}`}
            onClick={handleSweepStack}
            disabled={sweeping}
          >
            {sweeping ? '📶 Sweeping...' : '📶 Sweep Ping Stack'}
          </button>
          <button className="btn btn-gold btn-sm" onClick={handleConnectClick}>⚡ Connect Account</button>
        </div>
      </div>

      {/* Platform Overview Grid */}
      {showPlatformOverview && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {PLATFORMS.map(p => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: 12,
                  borderTop: `3px solid ${p.color}`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => window.open(p.url, '_blank')}
              >
                <div style={{ fontSize: 26, marginBottom: 4 }}>{p.icon}</div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)' }}>
                  {platformCounts[p.id]} account{platformCounts[p.id] !== 1 ? 's' : ''} connected
                </p>
                <div style={{ marginTop: 6, fontSize: 10, color: p.color, fontWeight: 600 }}>
                  Open Website ↗
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search accounts by name, email, platform..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: 13 }}
            />
          </div>

          {/* Platform Filter Select */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Platform:</span>
            <select
              value={platformFilter}
              onChange={e => { sound.play('click'); setPlatformFilter(e.target.value); }}
              style={{ padding: '6px 10px', fontSize: 12, width: 120 }}
            >
              <option value="all">All Platforms</option>
              {PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter Select (Feature 25) */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => { sound.play('click'); setStatusFilter(e.target.value); }}
              style={{ padding: '6px 10px', fontSize: 12, width: 130 }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Status</option>
              <option value="inactive">Inactive Status</option>
              <option value="low_credits">Low Credits (&lt;15)</option>
              <option value="expired_session">Expired Session</option>
            </select>
          </div>

          {/* Grid vs List Toggler */}
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            <button
              className="btn btn-sm"
              onClick={() => { sound.play('click'); setViewMode('grid'); }}
              style={{
                borderRadius: 0,
                padding: '6px 12px',
                background: viewMode === 'grid' ? 'var(--gold)' : 'transparent',
                color: viewMode === 'grid' ? '#000' : 'var(--muted2)',
                border: 'none'
              }}
            >
              田 Grid
            </button>
            <button
              className="btn btn-sm"
              onClick={() => { sound.play('click'); setViewMode('list'); }}
              style={{
                borderRadius: 0,
                padding: '6px 12px',
                background: viewMode === 'list' ? 'var(--gold)' : 'transparent',
                color: viewMode === 'list' ? '#000' : 'var(--muted2)',
                border: 'none'
              }}
            >
              ☰ List
            </button>
          </div>

        </div>
      </div>

      {/* Main accounts display list/grid */}
      {filteredAccounts.length === 0 ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No accounts match the filters</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Try resetting the search query or status filters.</div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => { sound.play('click'); setSearchQuery(''); setPlatformFilter('all'); setStatusFilter('all'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="acc-grid">
          {filteredAccounts.map(a => {
            const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
            const creditPct = a.creditLimit > 0 ? Math.min(100, Math.round((a.creditBalance / a.creditLimit) * 100)) : 0;
            const isSyncing = syncingId === a.id;

            return (
              <div key={a.id} className="acc-card">
                <div className="acc-top">
                  <PlatformIcon platformId={a.platform} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="acc-name">{a.name}</div>
                    <div className="acc-sub">{a.email || pl.name}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <StatusBadge status={a.status} />
                    {latencies[a.id] && (
                      <span
                        className="mono"
                        style={{
                          fontSize: 8.5,
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: latencies[a.id] === 'FAIL' ? 'rgba(255,95,95,0.1)' : 'rgba(0,212,170,0.1)',
                          color: latencies[a.id] === 'FAIL' ? 'var(--red)' : 'var(--teal)',
                          border: `1px solid ${latencies[a.id] === 'FAIL' ? 'rgba(255,95,95,0.2)' : 'rgba(0,212,170,0.2)'}`,
                          boxShadow: latencies[a.id] === 'FAIL' ? 'none' : '0 0 6px var(--teal-glow)'
                        }}
                      >
                        📶 {latencies[a.id]}
                      </span>
                    )}
                  </div>
                </div>

                {a.creditLimit > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                      <span>Usage Credits</span>
                      <span style={{ fontWeight: 600, color: pl.color }}>{a.creditBalance} / {a.creditLimit} ({creditPct}%)</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${creditPct}%`,
                          background: creditPct < 20 ? 'var(--red)' : creditPct < 50 ? 'var(--gold)' : `linear-gradient(90deg, var(--gold), var(--teal))`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
                  <div>📅 Connected: <strong>{ago(a.createdAt)}</strong></div>
                  <div>📡 Broadcasts sent: <strong>{a.broadcastCount || 0}</strong></div>
                  {a.lastSync && <div>🔄 Last Synced: <strong>{ago(a.lastSync)}</strong></div>}
                </div>

                <div className="acc-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => toggleStatus(a.id)}
                    style={{ flex: 1 }}
                  >
                    {a.status === 'active' ? '⏸️ Pause' : '▶️ Resume'}
                  </button>
                  <button
                    className={`btn btn-ghost btn-xs ${isSyncing ? 'btn-pulse' : ''}`}
                    onClick={() => handleSync(a.id)}
                    disabled={isSyncing}
                    style={{ flex: 1 }}
                  >
                    {isSyncing ? '⏳ Syncing' : '🔄 Sync'}
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => { sound.play('click'); setDrawerAcc(a.id); }}
                  >
                    📊 Details
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => { sound.play('click'); setEditAcc({ ...a }); }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => { sound.play('click'); setConfirmDel(a.id); }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredAccounts.map(a => {
            const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
            const creditPct = a.creditLimit > 0 ? Math.min(100, Math.round((a.creditBalance / a.creditLimit) * 100)) : 0;
            const isSyncing = syncingId === a.id;

            return (
              <div
                key={a.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '10px 14px',
                  flexWrap: 'wrap',
                  borderLeft: `3px solid ${a.status === 'active' ? 'var(--teal)' : 'var(--muted)'}`
                }}
              >
                {/* Platform Avatar */}
                <PlatformIcon platformId={a.platform} size={28} />

                {/* Account Name and details */}
                <div style={{ flex: '1 1 200px', minWidth: 150 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e2ec' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.email || pl.name} ({pl.name})</div>
                </div>

                {/* Status Badge */}
                <div style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                  <StatusBadge status={a.status} />
                  {latencies[a.id] && (
                    <span
                      className="mono"
                      style={{
                        fontSize: 8.5,
                        padding: '1px 5px',
                        borderRadius: 4,
                        background: latencies[a.id] === 'FAIL' ? 'rgba(255,95,95,0.1)' : 'rgba(0,212,170,0.1)',
                        color: latencies[a.id] === 'FAIL' ? 'var(--red)' : 'var(--teal)',
                        border: `1px solid ${latencies[a.id] === 'FAIL' ? 'rgba(255,95,95,0.2)' : 'rgba(0,212,170,0.2)'}`,
                        boxShadow: latencies[a.id] === 'FAIL' ? 'none' : '0 0 6px var(--teal-glow)'
                      }}
                    >
                      📶 {latencies[a.id]}
                    </span>
                  )}
                </div>

                {/* Credits Progress */}
                {a.creditLimit > 0 ? (
                  <div style={{ flex: '1 1 180px', minWidth: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>
                      <span>Credits</span>
                      <span>{a.creditBalance}/{a.creditLimit} ({creditPct}%)</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${creditPct}%`,
                          background: creditPct < 20 ? 'var(--red)' : creditPct < 50 ? 'var(--gold)' : 'var(--teal)'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: '1 1 180px', minWidth: 120, fontSize: 11, color: 'var(--muted)' }}>Unlimited credits</div>
                )}

                {/* Metadata info */}
                <div style={{ flex: '1 1 150px', fontSize: 11, color: 'var(--muted)' }}>
                  <div>📅 Conn: {ago(a.createdAt)}</div>
                  <div>📡 Broadcasts: {a.broadcastCount || 0}</div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => toggleStatus(a.id)}
                  >
                    {a.status === 'active' ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className={`btn btn-ghost btn-xs ${isSyncing ? 'btn-pulse' : ''}`}
                    onClick={() => handleSync(a.id)}
                    disabled={isSyncing}
                  >
                    {isSyncing ? '⏳' : '🔄'}
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => { sound.play('click'); setDrawerAcc(a.id); }}
                  >
                    📊 Details
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => { sound.play('click'); setEditAcc({ ...a }); }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => { sound.play('click'); setConfirmDel(a.id); }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Details Modal */}
      {editAcc && (
        <div className="overlay" onClick={() => setEditAcc(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-title">✏️ Edit Account Settings</div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-row">
                <label>Account Label / Name</label>
                <input
                  type="text"
                  value={editAcc.name}
                  onChange={e => setEditAcc({ ...editAcc, name: e.target.value })}
                  placeholder="e.g. My Workspace Account"
                  required
                />
              </div>

              <div className="form-row">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editAcc.email || ''}
                  onChange={e => setEditAcc({ ...editAcc, email: e.target.value })}
                  placeholder="yourname@gmail.com"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div className="form-row">
                  <label>Plan Type</label>
                  <select
                    value={editAcc.planType || 'free'}
                    onChange={e => setEditAcc({ ...editAcc, planType: e.target.value })}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Credits Bal</label>
                  <input
                    type="number"
                    value={editAcc.creditBalance || 0}
                    onChange={e => setEditAcc({ ...editAcc, creditBalance: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-row">
                  <label>Credit Limit</label>
                  <input
                    type="number"
                    value={editAcc.creditLimit || 0}
                    onChange={e => setEditAcc({ ...editAcc, creditLimit: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div className="form-row">
                  <label>Handoff Threshold (cr)</label>
                  <input
                    type="number"
                    value={editAcc.creditThreshold || 2}
                    onChange={e => setEditAcc({ ...editAcc, creditThreshold: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-row">
                  <label>Account Status</label>
                  <select
                    value={editAcc.status || 'active'}
                    onChange={e => setEditAcc({ ...editAcc, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused / Inactive</option>
                    <option value="exhausted">Exhausted / Low Credits</option>
                    <option value="expired_session">Expired / Error</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditAcc(null)}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗑️</div>
            <div className="modal-title" style={{ textAlign: 'center' }}>Delete this account?</div>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
              Are you sure you want to remove this account? This will disconnect it from the dashboard.
            </p>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(confirmDel)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Account Deep-Dive Drawer ──────────────────────────── */}
      {drawerAcc && (() => {
        const acc = accounts.find(a => a.id === drawerAcc);
        if (!acc) return null;
        const pl = PLATFORMS.find(p => p.id === acc.platform) || PLATFORMS[0];
        const statusColor = acc.status === 'active' ? 'var(--teal)' : acc.status === 'expired_session' ? 'var(--red)' : 'var(--muted)';
        const usedPct = acc.creditLimit > 0 ? Math.min(100, Math.round(((acc.creditLimit - (acc.creditBalance || 0)) / acc.creditLimit) * 100)) : 0;
        const sparkData = Array.from({ length: 10 }, (_, i) => Math.max(0, Math.round(Math.sin(i + 2) * (acc.broadcastCount || 5))));
        const sparkMax = Math.max(1, ...sparkData);

        // Feature 24: credential reveal toggler
        const isCredRevealed = !!showDrawerCredMap[acc.id];
        const displayCred = isCredRevealed ? (acc.token || 'd93b4a...api_key_session') : '••••••••••••••••••••';

        return (
          <>
            {/* Backdrop */}
            <div onClick={() => setDrawerAcc(null)} style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(4,4,6,0.6)', backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.15s ease',
            }} />
            {/* Drawer panel */}
            <div style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9001,
              width: 380, background: 'var(--surface)',
              borderLeft: '1px solid var(--border2)',
              boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '20px 22px 16px',
                borderBottom: '1px solid var(--border)',
                background: `linear-gradient(135deg, var(--surface2), ${pl.bg})`,
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: pl.bg, border: `1px solid ${pl.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                    }}>{pl.icon}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{pl.name} · {acc.email || 'No email'}</div>
                    </div>
                  </div>
                  <button onClick={() => setDrawerAcc(null)} style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                    color: 'var(--muted)', cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 999,
                    background: statusColor + '20', color: statusColor, border: `1px solid ${statusColor}30`,
                    textTransform: 'uppercase', letterSpacing: '.05em',
                  }}>● {acc.status?.replace('_', ' ')}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.05)', color: 'var(--muted2)', border: '1px solid var(--border)',
                    textTransform: 'uppercase',
                  }}>{acc.planType || 'Free'} Plan</span>
                </div>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* KPI mini-row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Broadcasts', val: acc.broadcastCount || 0, color: 'var(--gold)', icon: '📡' },
                    { label: 'Credits Left', val: acc.creditBalance ?? 20, color: 'var(--teal)', icon: '💳' },
                    { label: 'Latency', val: latencies[acc.id] || '—', color: latencies[acc.id] === 'FAIL' ? 'var(--red)' : 'var(--blue)', icon: '📶' },
                  ].map(kpi => (
                    <div key={kpi.label} style={{
                      background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px',
                      border: `1px solid ${kpi.color}20`,
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{kpi.icon}</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.val}</div>
                      <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 }}>{kpi.label}</div>
                    </div>
                  ))}
                </div>

                {/* Credit bar */}
                <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Credit Consumption</span>
                    <span style={{ color: usedPct > 80 ? 'var(--red)' : 'var(--gold)', fontFamily: 'DM Mono, monospace' }}>{usedPct}% used</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, transition: 'width 0.5s',
                      width: `${usedPct}%`,
                      background: usedPct > 80 ? 'var(--red)' : usedPct > 50 ? 'var(--gold)' : 'var(--teal)',
                      boxShadow: `0 0 8px ${usedPct > 80 ? 'var(--red)' : 'var(--teal)'}`,
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 5, fontFamily: 'DM Mono, monospace' }}>
                    <span>{acc.creditBalance ?? 20} remaining</span>
                    <span>{acc.creditLimit || 30} limit</span>
                  </div>
                </div>

                {/* Broadcast sparkline */}
                <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Broadcast Activity (10-period)</div>
                  <svg viewBox="0 0 200 40" style={{ width: '100%', height: 44, overflow: 'visible' }}>
                    <defs>
                      <linearGradient id={`spark-${acc.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={pl.color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={pl.color} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {sparkData.map((v, i) => {
                      const x = (i / (sparkData.length - 1)) * 196 + 2;
                      const h = Math.max(2, (v / sparkMax) * 34);
                      const y = 36 - h;
                      return (
                        <g key={i}>
                          <rect x={x - 6} y={y} width={12} height={h} rx={3}
                            fill={`url(#spark-${acc.id})`} stroke={pl.color} strokeWidth="0.5" strokeOpacity="0.6" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Metadata with credential reveal (Feature 24) */}
                <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>Account Details</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Platform</span>
                    <span style={{ color: '#d0d0e0', fontWeight: 600 }}>{pl.name}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Handoff Threshold</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{acc.creditThreshold || 2} cr</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Credential</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{displayCred}</span>
                      <button
                        onClick={() => {
                          sound.play('click');
                          setShowDrawerCredMap(prev => ({ ...prev, [acc.id]: !prev[acc.id] }));
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 11, padding: 0 }}
                        title={isCredRevealed ? "Hide credential" : "Reveal credential"}
                      >
                        {isCredRevealed ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Connected</span>
                    <span style={{ color: '#d0d0e0', fontWeight: 600 }}>{acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Last Sync</span>
                    <span style={{ color: '#d0d0e0', fontWeight: 600 }}>{acc.lastSync ? new Date(acc.lastSync).toLocaleString() : 'Never'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)' }}>Last Used</span>
                    <span style={{ color: '#d0d0e0', fontWeight: 600 }}>{acc.lastUsed ? new Date(acc.lastUsed).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0, background: 'var(--surface2)' }}>
                <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => { handleSync(acc.id); drawerAcc && setDrawerAcc(null); }}>
                  🔄 Sync Now
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditAcc({ ...acc }); setDrawerAcc(null); }}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => { setConfirmDel(acc.id); setDrawerAcc(null); }}>
                  🗑️
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {showUpgrade && (
        <UpgradeModal
          feature="accounts"
          requiredPlan="pro"
          onClose={() => setShowUpgrade(false)}
          onNav={onNav}
        />
      )}
    </>
  );
}
