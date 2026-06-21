import { useState, useEffect, useMemo } from 'react';
import { stateManager } from '../lib/stateManager';
import { brain } from '../lib/centralBrain';
import { bus, EVENTS } from '../lib/eventBus';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon, StatusBadge } from '../components/PlatformBadge';
import { sound } from '../lib/soundEngine';

function ago(timestamp) {
  if (!timestamp) return 'Never';
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export default function SystemStatus() {
  // Sync state with stateManager and eventBus
  const [accounts, setAccounts] = useState(() => stateManager.getAccounts().filter(a => !a.deletedAt));
  const [events, setEvents] = useState(() => stateManager.getEvents(50));
  const [relayLog, setRelayLog] = useState(() => stateManager.getRelayLog());
  const [health, setHealth] = useState(() => {
    try {
      const h = localStorage.getItem('agp_health');
      return h ? JSON.parse(h) : { score: 100, exhausted: 0, low: 0, active: 4 };
    } catch (err) {
      void err;
      return { score: 100, exhausted: 0, low: 0, active: 4 };
    }
  });

  const [brainRunning, setBrainRunning] = useState(() => brain.interval !== null);
  const [tickCount, setTickCount] = useState(() => brain.tickCount);

  // Toggles for automated systems
  const [autoRelay, setAutoRelay] = useState(() => stateManager.get('auto_relay_enabled', true));
  const [autoScheduler, setAutoScheduler] = useState(() => stateManager.get('auto_scheduler_enabled', true));
  const [creditSnapshots, setCreditSnapshots] = useState(() => stateManager.get('credit_snapshots_enabled', true));
  const [healthMonitor, setHealthMonitor] = useState(() => stateManager.get('health_monitor_enabled', true));

  // Filter state for event stream
  const [eventFilter, setEventFilter] = useState('all'); // 'all' | 'relay' | 'schedule' | 'task' | 'error'

  // Expand details drawer/modal for selected account
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Sync state when eventBus fires
  useEffect(() => {
    const refresh = () => {
      setAccounts(stateManager.getAccounts().filter(a => !a.deletedAt));
      setEvents(stateManager.getEvents(50));
      setRelayLog(stateManager.getRelayLog());
      setTickCount(brain.tickCount);
      try {
        const h = localStorage.getItem('agp_health');
        if (h) setHealth(JSON.parse(h));
      } catch {
        // Ignore JSON exceptions
      }
    };

    bus.on(EVENTS.STATE_CHANGED, refresh);
    bus.on(EVENTS.SYSTEM_TICK, refresh);
    bus.on(EVENTS.HEALTH_UPDATED, refresh);

    return () => {
      bus.off(EVENTS.STATE_CHANGED, refresh);
      bus.off(EVENTS.SYSTEM_TICK, refresh);
      bus.off(EVENTS.HEALTH_UPDATED, refresh);
    };
  }, []);

  // Update configuration switches
  const handleToggleBrain = () => {
    sound.play('click');
    if (brainRunning) {
      brain.stop();
      setBrainRunning(false);
    } else {
      brain.start(60000);
      setBrainRunning(true);
    }
  };

  const handleToggleConfig = (key, val, setter) => {
    sound.play('click');
    stateManager.set(key, !val);
    setter(!val);
  };

  // Determine current active issues list
  const systemIssues = useMemo(() => {
    const issues = [];
    accounts.forEach(a => {
      if (a.status === 'exhausted') {
        issues.push({ id: `iss-ex-${a.id}`, severity: 'high', text: `Account credits fully depleted: ${a.name}` });
      } else if (a.status === 'low') {
        issues.push({ id: `iss-low-${a.id}`, severity: 'medium', text: `Account is running low on credits: ${a.name}` });
      } else if (a.status === 'expired_session') {
        issues.push({ id: `iss-exp-${a.id}`, severity: 'high', text: `API Session credentials expired: ${a.name}` });
      }
    });
    return issues;
  }, [accounts]);

  // SVG Health trend sparkline (mock trend for premium design)
  const healthTrendData = useMemo(() => {
    return [95, 96, 92, 94, 98, 90, 88, 92, 94, 96, 95, health.score];
  }, [health.score]);

  // Event stream filtered view
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter(e => {
      if (eventFilter === 'relay') return e.type.includes('relay');
      if (eventFilter === 'schedule') return e.type.includes('schedule');
      if (eventFilter === 'task') return e.type.includes('task');
      if (eventFilter === 'error') return e.type.includes('fail') || e.type.includes('exhausted') || e.type.includes('expired');
      return true;
    });
  }, [events, eventFilter]);

  // Color mapping based on score
  const getHealthColor = (score) => {
    if (score > 70) return 'var(--teal)';
    if (score > 40) return 'var(--gold)';
    return 'var(--red)';
  };

  const currentHealthColor = getHealthColor(health.score);

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Dynamic Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(245,183,49,0.03) 100%)',
        border: '1px solid var(--border)', borderRadius: 16, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--gold-glow)', border: '1px solid rgba(245,183,49,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>🌡️</div>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, margin: 0, color: '#fff' }}>
              System Status & Diagnostics
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 12 }}>
              Active overview of credit relays, health scoring metrics, background automation, and log streams.
            </p>
          </div>
        </div>

        {/* Brain Active Status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Automation Brain
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: brainRunning ? 'var(--teal)' : 'var(--muted)' }}>
              {brainRunning ? '● RUNNING' : '○ STOPPED'}
            </span>
          </div>
          <button
            onClick={handleToggleBrain}
            className={`btn btn-xs ${brainRunning ? 'btn-danger' : 'btn-gold'}`}
            style={{ padding: '6px 12px', fontSize: 10 }}
          >
            {brainRunning ? 'Pause Engine' : 'Resume Engine'}
          </button>
        </div>
      </div>

      {/* SECTION A & D Grid: Health & Automation Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>

        {/* SECTION A — Health Overview */}
        <div className="card" style={{ display: 'flex', gap: 24, padding: '24px 28px', alignItems: 'center' }}>
          {/* Big Score Ring */}
          <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="48" fill="none"
                stroke={currentHealthColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - health.score / 100)}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="Syne, sans-serif">
                {health.score}
              </text>
              <text x="60" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--muted)" letterSpacing="0.08em">
                VITAL INDEX
              </text>
            </svg>
          </div>

          {/* Details & Trend sparkline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Overall Vital Health
            </h2>

            {/* Health Trend sparkline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 24 }}>
                <svg viewBox="0 0 120 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path
                    d={healthTrendData.map((val, i) => `${i === 0 ? 'M' : 'L'} ${(i / (healthTrendData.length - 1)) * 120} ${24 - (val - 50) * 0.4}`).join(' ')}
                    fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
                24h trend
              </span>
            </div>

            {/* Current Issues list */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                Issues Detected ({systemIssues.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {systemIssues.length > 0 ? (
                  systemIssues.map(issue => (
                    <div key={issue.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: issue.severity === 'high' ? 'var(--red)' : 'var(--gold)' }}>
                      <span>{issue.severity === 'high' ? '🚨' : '⚠'}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {issue.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--teal)' }}>✓ All systems operational. Zero critical issues detected.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION D — Automation Status */}
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Automation Engine Settings
            </h2>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              Ticks: {tickCount}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Auto Relay */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Auto Credit Relay</span>
                <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Triggers under 5% balance</span>
              </div>
              <div
                onClick={() => handleToggleConfig('auto_relay_enabled', autoRelay, setAutoRelay)}
                style={{ width: 34, height: 18, borderRadius: 9, background: autoRelay ? 'var(--teal)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: autoRelay ? 19 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>

            {/* Auto Scheduler */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Cron Scheduler</span>
                <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Executes pending prompts</span>
              </div>
              <div
                onClick={() => handleToggleConfig('auto_scheduler_enabled', autoScheduler, setAutoScheduler)}
                style={{ width: 34, height: 18, borderRadius: 9, background: autoScheduler ? 'var(--teal)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: autoScheduler ? 19 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>

            {/* Credit Snapshots */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Credit Snapshots</span>
                <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Records daily burn averages</span>
              </div>
              <div
                onClick={() => handleToggleConfig('credit_snapshots_enabled', creditSnapshots, setCreditSnapshots)}
                style={{ width: 34, height: 18, borderRadius: 9, background: creditSnapshots ? 'var(--teal)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: creditSnapshots ? 19 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>

            {/* Health Monitor */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>Health Monitor</span>
                <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Recalculates sys vitals index</span>
              </div>
              <div
                onClick={() => handleToggleConfig('health_monitor_enabled', healthMonitor, setHealthMonitor)}
                style={{ width: 34, height: 18, borderRadius: 9, background: healthMonitor ? 'var(--teal)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: healthMonitor ? 19 : 3, transition: 'all 0.2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B — All Accounts Grid */}
      <div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12,
          letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12
        }}>
          🖥️ Connected API Accounts Vitals
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {accounts.map(acc => {
            const pl = PLATFORMS.find(p => p.id === acc.platform) || PLATFORMS[0];
            const usagePct = acc.maxCredits > 0 ? Math.round((acc.credits / acc.maxCredits) * 100) : 0;

            // Color based on balance
            let stateColor = 'var(--teal)';
            if (usagePct <= 20) stateColor = 'var(--gold)';
            if (usagePct <= 5) stateColor = 'var(--red)';

            return (
              <div
                key={acc.id}
                onClick={() => { sound.play('click'); setSelectedAccount(acc); }}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                  transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = pl.color + '60';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Platform color indicator strip */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: pl.color }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <PlatformIcon platformId={acc.platform} size={22} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                      {pl.name}
                    </div>
                  </div>
                  <StatusBadge status={acc.status} />
                </div>

                {/* Credit progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
                    <span>Credits Balance</span>
                    <strong style={{ color: stateColor }}>{acc.credits} / {acc.maxCredits} ({usagePct}%)</strong>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${usagePct}%`, background: stateColor, transition: 'width 0.4s' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION C — Live Event Stream */}
      <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            🛰️ Live Event Stream Telemetry
          </h2>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'relay', 'schedule', 'task', 'error'].map(f => (
              <button
                key={f}
                onClick={() => { sound.play('click'); setEventFilter(f); }}
                style={{
                  background: eventFilter === f ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  color: eventFilter === f ? '#000' : 'var(--muted2)',
                  fontSize: 10, padding: '4px 10px', cursor: 'pointer',
                  textTransform: 'uppercase', fontWeight: 800, transition: 'all 0.15s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable event list */}
        <div style={{
          maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4,
          background: '#040406', padding: 8, borderRadius: 8, border: '1px solid var(--border)'
        }}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(e => (
              <div
                key={e.id}
                style={{
                  display: 'grid', gridTemplateColumns: '24px 120px 1fr 80px',
                  alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)',
                  fontSize: 11, fontFamily: 'DM Mono, monospace'
                }}
              >
                <span>
                  {e.type.includes('fail') || e.type.includes('exhausted') ? '🚨'
                    : e.type.includes('success') || e.type.includes('complete') ? '✓'
                    : e.type.includes('relay') ? '🔄'
                    : '⚙️'}
                </span>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  {e.type}
                </span>
                <span style={{ color: '#e2e8f0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {JSON.stringify(e.data)}
                </span>
                <span style={{ color: 'var(--muted)', textAlign: 'right', fontSize: 9.5 }}>
                  {ago(e.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '32px 0', color: 'var(--muted)', textAlign: 'center', fontSize: 12 }}>
              No recorded events match the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Account Deep-Dive Drawer Modal */}
      {selectedAccount && (() => {
        const acc = selectedAccount;
        const pl = PLATFORMS.find(p => p.id === acc.platform) || PLATFORMS[0];
        const burnRate = stateManager.getBurnRate(acc.id);
        const daysLeft = burnRate > 0 ? Math.ceil(acc.credits / burnRate) : '—';

        // Find relay logs involving this account
        const accountRelays = relayLog.filter(r => r.from === acc.id || r.to === acc.id);

        return (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setSelectedAccount(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9000,
                background: 'rgba(4,4,6,0.6)', backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s'
              }}
            />
            {/* Drawer */}
            <div style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9001,
              width: 400, background: 'var(--surface)', borderLeft: '1px solid var(--border)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
              animation: 'slideInRight 0.3s cubic-bezier(0.34,1.56,0.64,1)'
            }}>
              {/* Header */}
              <div style={{ padding: 24, borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <PlatformIcon platformId={acc.platform} size={28} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#fff' }}>{acc.name}</h3>
                      <span style={{ fontSize: 10.5, color: pl.color }}>{pl.name} Gateway</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAccount(null)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--muted)', cursor: 'pointer', borderRadius: 4, width: 24, height: 24 }}
                  >
                    ✕
                  </button>
                </div>
                <StatusBadge status={acc.status} />
              </div>

              {/* Scrollable details */}
              <div style={{ padding: 24, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--surface2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 800 }}>BURN RATE</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginTop: 4 }}>
                      {burnRate.toFixed(1)} cr/day
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 800 }}>DEPLETION EST.</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--teal)', marginTop: 4 }}>
                      {daysLeft} {daysLeft !== '—' ? 'days left' : ''}
                    </div>
                  </div>
                </div>

                {/* Relay History inside selected account */}
                <div>
                  <h4 style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 10px' }}>
                    Linked Relay History
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {accountRelays.length > 0 ? (
                      accountRelays.map(r => (
                        <div key={r.id} style={{
                          background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                          padding: 10, borderRadius: 8, fontSize: 11, fontFamily: 'DM Mono, monospace'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold)', marginBottom: 4 }}>
                            <span>{r.from === acc.id ? '📤 Handoff Out' : '📥 Handoff In'}</span>
                            <span>{ago(r.triggeredAt)}</span>
                          </div>
                          <div style={{ color: 'var(--muted2)' }}>Task: {r.task}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--muted)', fontSize: 11, fontStyle: 'italic' }}>
                        No relays logged for this account.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
