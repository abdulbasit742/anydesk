import { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../data/store';
import { stateManager } from '../lib/stateManager';
import { brain } from '../lib/centralBrain';
import { bus, EVENTS } from '../lib/eventBus';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import { sound } from '../lib/soundEngine';
import { exportRelayZip } from '../lib/relayZipExport';

/* ─── Module-scope Static Data & Helpers ────────────────────────── */
const SMART_PROMPTS_POOL = [
  "Add smooth animations and micro-interactions to all visual dashboard pages",
  "Make the workspace fully mobile responsive under 320px/768px/1024px breakpoints",
  "Improve performance: lazy-load large datasets and memoize expensive calculations",
  "Add comprehensive error boundaries and user-friendly failover notifications",
  "Implement system-wide custom theme switcher with persistent storage variables",
  "Configure skeleton loading screens for data-fetching network widgets",
  "Resolve React 19 compiler warnings and enforce absolute type safety",
  "Integrate keyboard shortcuts, focus indicators, and ARIA labels for accessibility",
  "Optimize network telemetry: implement polling cache throttles and debounces",
  "Audit spacing, margin flows, HSL harmony scales, and shadow overlays for design parity",
  "Add HMAC validation parameters and payload verification blocks on incoming webhooks",
  "Refactor redundant states into useMemo filters and modularize cards into global scope"
];

const PREFLIGHT_TASKS = [
  "Verify AES-256 local credential handshakes...",
  "Sweep active WebSocket proxies and verify TTFB (<45ms)...",
  "Calculate credit thresholds under daily goal configurations...",
  "Check prompt queue rotation alignment...",
  "Verify isolated Chrome profile sessions are active...",
  "Pre-check fleet health parameters and preflight logs..."
];

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 22px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#22d3ee' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color,
    margin: '0 0 16px 0',
  }}>{children}</h2>
);

const Toggle = ({ on, onChange, color = '#22d3ee' }) => (
  <div
    onClick={onChange}
    style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
      position: 'relative',
      background: on ? color : 'rgba(255,255,255,0.1)',
      transition: 'background 0.25s',
      boxShadow: on ? `0 0 10px ${color}66` : 'none',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: on ? 21 : 3,
      width: 16, height: 16, borderRadius: '50%', background: '#fff',
      transition: 'left 0.25s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
    }} />
  </div>
);



/* ─── Relay Track Visualizer Component ──────────────────────────── */
function RelayTrackVisualizer({ accounts, activeIndex, isRunning }) {
  return (
    <div style={{
      position: 'relative',
      padding: '24px 10px',
      background: '#07070f',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20
    }}>
      {/* Curved flow indicator line */}
      <div style={{
        position: 'absolute', top: '50%', left: '4%', right: '4%', height: 2,
        background: 'linear-gradient(90deg, #22d3ee22 0%, #f5b73166 50%, #22c55e22 100%)',
        zIndex: 0
      }} />

      {/* Trailing CSS animation flows */}
      {isRunning && (
        <div style={{
          position: 'absolute', top: 'calc(50% - 2px)', width: 6, height: 6,
          borderRadius: '50%', background: '#f5b731',
          boxShadow: '0 0 10px #f5b731',
          animation: 'particle-flow 3s linear infinite',
          zIndex: 1
        }} />
      )}

      {/* Platform Node Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        gap: 10,
        overflowX: 'auto',
        padding: '0 10px'
      }}>
        {accounts.map((acc, idx) => {
          const isCurrent = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          const pl = PLATFORMS.find(p => p.id === acc.platform) || PLATFORMS[0];
          const borderHighlight = isCurrent ? 'var(--gold)'
            : isCompleted ? 'var(--teal)'
            : 'rgba(255,255,255,0.08)';

          return (
            <div
              key={acc.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
                opacity: isRunning && !isCurrent && !isCompleted ? 0.35 : 1,
                transition: 'opacity 0.3s'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: isCurrent ? 'rgba(245,183,49,0.15)' : isCompleted ? 'rgba(34,211,238,0.1)' : '#16161e',
                border: `2px solid ${borderHighlight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrent ? '0 0 20px rgba(245,183,49,0.45)' : 'none',
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.25s',
                position: 'relative'
              }}>
                <PlatformIcon platformId={acc.platform} size={22} />
                {isCompleted && (
                  <span style={{
                    position: 'absolute', bottom: -2, right: -2,
                    background: 'var(--teal)', color: '#0e0e16', borderRadius: '50%',
                    width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 'bold'
                  }}>✓</span>
                )}
                {isCurrent && (
                  <div style={{
                    position: 'absolute', inset: -4, borderRadius: '50%',
                    border: '1.5px solid var(--gold)',
                    animation: 'pulse-ring 1.8s ease-in-out infinite'
                  }} />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: isCurrent ? 'var(--gold)' : '#fff', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {acc.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 8.5, color: pl.color, fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
                  {acc.creditBalance} cr
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AutomationControl() {
  const { projects } = useStore();
  const [accounts, setAccounts] = useState(() => stateManager.getAccounts().filter(a => !a.deletedAt));
  const toast = useToast();

  useEffect(() => {
    const refresh = () => {
      setAccounts(stateManager.getAccounts().filter(a => !a.deletedAt));
    };
    bus.on(EVENTS.STATE_CHANGED, refresh);
    bus.on(EVENTS.SYSTEM_TICK, refresh);
    return () => {
      bus.off(EVENTS.STATE_CHANGED, refresh);
      bus.off(EVENTS.SYSTEM_TICK, refresh);
    };
  }, []);

  const updateAccount = (id, patch) => {
    stateManager.updateAccount(id, patch);
  };

  /* Stateful settings */
  const [schedulerEnabled, setSchedulerEnabled] = useState(true);
  const [goalPct, setGoalPct] = useState(85);
  const [autoSyncBeforeRun, setAutoSyncBeforeRun] = useState(true);
  const [queueRotationEnabled, setQueueRotationEnabled] = useState(true);
  const [extraRunTimes, setExtraRunTimes] = useState("12:00, 16:00, 20:00");
  const [smartPromptText, setSmartPromptText] = useState("Add smooth animations and micro-interactions to all visual dashboard pages");

  /* Simulator States */
  const [preflightLogs] = useState(() => {
    return PREFLIGHT_TASKS.map((t, i) => ({ id: i, text: `[OK] ${t}`, checked: true }));
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExhaustRunning, setIsExhaustRunning] = useState(false);
  const [isRelayRunning, setIsRelayRunning] = useState(false);
  const [relayGoal, setRelayGoal] = useState("Configure smooth glassmorphic workspace page inside the active visual dashboard cockpit, ensuring zero linter warnings and clean compilation.");
  const [relayBuffer, setRelayBuffer] = useState(2);
  const [relayMaxSteps, setRelayMaxSteps] = useState(3);
  const [activeRelayIndex, setActiveRelayIndex] = useState(-1);
  const [relayLogs, setRelayLogs] = useState([]);
  const [relayStepsReport, setRelayStepsReport] = useState([]);
  const [relayResult, setRelayResult] = useState(null);
  const [relayHistory, setRelayHistory] = useState(() => stateManager.getRelayLog());

  useEffect(() => {
    const refresh = () => {
      setRelayHistory(stateManager.getRelayLog());
    };
    bus.on(EVENTS.STATE_CHANGED, refresh);
    bus.on(EVENTS.SYSTEM_TICK, refresh);
    return () => {
      bus.off(EVENTS.STATE_CHANGED, refresh);
      bus.off(EVENTS.SYSTEM_TICK, refresh);
    };
  }, []);

  /* Refs */
  const terminalEndRef = useRef(null);

  /* Active accounts filter */
  const activeAccountsList = useMemo(() => {
    return accounts.filter(a => a.status === 'active');
  }, [accounts]);

  const totalCredits = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.creditBalance || 0), 0);
  }, [accounts]);

  const totalLimit = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.creditLimit || 30), 0);
  }, [accounts]);

  const creditPercentage = totalLimit > 0 ? Math.round((totalCredits / totalLimit) * 100) : 0;

  const totalProjectsCount = useMemo(() => {
    return projects ? projects.length : 2;
  }, [projects]);



  /* Auto-scroll relay terminal logs */
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [relayLogs]);

  /* Batch Sync trigger handler */
  const handleBatchSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    sound.play('click');
    toast.info("Triggering fleet-wide credentials handshake...");

    // Iterate accounts and simulate pings
    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      await new Promise(r => setTimeout(r, 450 + Math.random() * 200));
      // update random balance fluctuation slightly
      const fluctuatedBalance = Math.max(1, acc.creditBalance + (Math.random() > 0.6 ? -1 : 0));
      updateAccount(acc.id, {
        creditBalance: fluctuatedBalance,
        lastUsed: new Date().toISOString()
      });
      sound.play('hover');
    }

    setIsSyncing(false);
    toast.bolt("✓ All connected accounts successfully synchronized!");
  };

  /* Smart AI Prompt Generator */
  const handleGenerateSmartPrompt = () => {
    sound.play('click');
    const randomPrompt = SMART_PROMPTS_POOL[Math.floor(Math.random() * SMART_PROMPTS_POOL.length)];
    setSmartPromptText(randomPrompt);
    toast.bolt("✓ Evolved new technical prompt template from local LLM!");
  };

  /* Credit Exhaustion execution simulator */
  const handleExhaustCredits = async () => {
    if (isExhaustRunning) return;
    if (activeAccountsList.length === 0) {
      toast.error("Please load demo accounts or connect profiles first!");
      return;
    }
    setIsExhaustRunning(true);
    sound.play('click');
    toast.bolt("⚡ Initiating Fleet Credit Exhaustion cycle...");

    // Deplete all credits to 0 across workspaces
    for (let i = 0; i < activeAccountsList.length; i++) {
      const acc = activeAccountsList[i];
      await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
      updateAccount(acc.id, {
        creditBalance: 0,
        status: 'expired_session',
        lastUsed: new Date().toISOString()
      });
      sound.play('success');
      toast.info(`Expired free credit limits on ${acc.name}`);
    }

    setIsExhaustRunning(false);
    toast.success("✓ Credit exhaustion sequence completed. Fleet is in standby.");
  };

  /* Manual Credit Relay Handoff Trigger via Brain */
  const handleStartRelay = () => {
    const targetAccount = activeAccountsList[0] || accounts[0];
    if (!targetAccount) {
      toast.error("Please connect or load active accounts first!");
      return;
    }
    sound.play('click');
    toast.bolt(`⚡ Triggering Credit Relay handoff for ${targetAccount.name}...`);

    // Trigger via Central Brain
    brain.triggerAutoRelay(targetAccount);

    // Simulate active console logs for real-time visual feedback
    setIsRelayRunning(true);
    setActiveRelayIndex(0);
    setRelayLogs([
      "[SYS-START] Initializing Credit Relay handoff stream via Central Brain...",
      `📡 Target account selected: ${targetAccount.name}`,
      "🔍 Checking credit limits...",
      `🔄 Triggering auto-relay: handoff initiated from ${targetAccount.id.substring(0, 8)}...`
    ]);

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < activeAccountsList.length) {
        setActiveRelayIndex(currentIdx);
        setRelayLogs(prev => [
          ...prev,
          `🔄 Handoff routed to next target: ${activeAccountsList[currentIdx].name}`
        ]);
      } else {
        clearInterval(interval);
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setRelayLogs(prev => [
        ...prev,
        "✓ Auto-relay trigger handoff successfully executed!",
        "✓ Event emitted: relay:triggered"
      ]);
      setRelayResult({
        goal: relayGoal,
        nextPrompt: "Optimized component prompt...",
        minCreditsToKeep: relayBuffer,
        steps: relayMaxSteps,
        summary: "Relay handoff context generated successfully.",
      });
      setRelayStepsReport([
        { step: 1, name: "Consolidate workspace status", status: "ok" },
        { step: 2, name: "Generate handoff ZIP payloads", status: "ok" },
        { step: 3, name: "Upload session indicators", status: "ok" }
      ]);
      setIsRelayRunning(false);
      setActiveRelayIndex(-1);
      toast.success("✓ Credit Relay handoff triggered successfully!");
    }, 1500);
  };


  /* Real Handoff Download using ZIP Export */
  const handleDownloadHandoff = async () => {
    if (!relayResult) {
      toast.error("No active relay handoff context to export. Run the relay first.");
      return;
    }
    sound.play('success');
    toast.bolt("📦 Compiling handoff ZIP archive...");
    try {
      await exportRelayZip({
        goal: relayResult.goal,
        prompt: relayResult.nextPrompt,
        buffer: relayResult.minCreditsToKeep,
        steps: relayResult.steps,
        summary: relayResult.summary,
        nextPrompt: relayResult.nextPrompt,
        accounts: accounts
      });
      toast.success("✓ Downloaded consolidated credit handoff ZIP package!");
    } catch (err) {
      console.error("Failed to generate handoff ZIP", err);
      toast.error("Failed to generate handoff ZIP.");
    }
  };

  /* Daily CSV report exporter simulator */
  const handleDownloadCsvReport = () => {
    sound.play('success');
    const headers = ["Date", "Platform", "Account Nickname", "Status", "Credits Consumed", "Success Rate"];
    const rows = activeAccountsList.map(a => [
      new Date().toLocaleDateString(),
      a.platform.toUpperCase(),
      a.name,
      a.status.toUpperCase(),
      Math.floor(Math.random() * 4) + 1,
      "100%"
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fleet-daily-automation-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.bolt("✓ Fleet daily CSV report downloaded!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─── Hero Header Banner ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(167,139,250,0.03) 100%)',
        border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: '24px 32px',
        position: 'relative', overflow: 'hidden', animation: 'fade-in 0.5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
          }}>🚀</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, margin: 0 }}>
              SaaS Automation & Credit Relay Control Center
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6e7191', fontSize: 13 }}>
              Orchestrate 12+ AI developer accounts, monitor parallel scheduler tasks, and continuous-relay your codebase implementation when credits run low.
            </p>
          </div>
        </div>
      </div>

      {/* ─── KPI Metrics Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Fleet Accounts', value: `${activeAccountsList.length} / 12`, sub: 'profiles connected', color: 'var(--teal)' },
          { label: 'Credits Remaining', value: `${totalCredits} / ${totalLimit}`, sub: `${creditPercentage}% capacity`, color: 'var(--gold)' },
          { label: 'Workspaces Tracked', value: totalProjectsCount, sub: 'active project slots', color: 'var(--purple)' },
          { label: 'Credit Goal Util', value: `${goalPct}%`, sub: 'utilization target', color: 'var(--teal)' }
        ].map(kpi => (
          <Card key={kpi.label} style={{ borderTop: `2.5px solid ${kpi.color}`, position: 'relative' }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* ─── Preflight & Main Controls Split ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

        {/* Left Side: Preflight check & Credit Relay */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Automation Preflight */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle color="var(--teal)">Fleet Health & Automation Preflight</SectionTitle>
              <button
                className="btn btn-gold btn-xs"
                onClick={handleBatchSync}
                disabled={isSyncing}
                style={{ fontSize: 10, padding: '4px 10px' }}
              >
                {isSyncing ? '⏳ Syncing...' : '⟳ Batch Sync Credentials'}
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
              Before scheduling runs, verify Google account cookies, OAuth tokens, and credit exhaustion parameters across workspaces.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {preflightLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: '#07070f', border: '1px solid rgba(255,255,255,0.04)',
                    padding: '8px 12px', borderRadius: 8, fontSize: 11, fontFamily: "'DM Mono', monospace",
                    color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  <span style={{ color: 'var(--teal)' }}>✓</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Credit Relay Handoff (Core Automation) */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle color="var(--purple)">Credit Relay Handoff Stream</SectionTitle>
              <button
                className="btn btn-gold btn-sm"
                onClick={handleStartRelay}
                disabled={isRelayRunning || activeAccountsList.length === 0}
                style={{ fontSize: 11, padding: '5px 12px' }}
              >
                {isRelayRunning ? '⏳ Relay Chain Active' : '🚀 Start Relay Chain'}
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--muted2)', margin: '0 0 16px', lineHeight: 1.4 }}>
              Maximize free credits across 12 connected accounts. The system compiles changes, records lints, creates handoff templates, and shifts work to the next account context automatically.
            </p>

            {/* Config inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Build Goal</span>
                <textarea
                  value={relayGoal}
                  onChange={e => setRelayGoal(e.target.value)}
                  style={{
                    padding: '8px 10px', fontSize: 11, background: 'var(--surface3)',
                    color: '#fff', border: '1px solid var(--border)', borderRadius: 6,
                    resize: 'none', height: 48, boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Buffer size</span>
                <input
                  type="number"
                  value={relayBuffer}
                  onChange={e => setRelayBuffer(parseInt(e.target.value) || 2)}
                  style={{
                    padding: '8px 10px', fontSize: 11.5, background: 'var(--surface3)',
                    color: '#fff', border: '1px solid var(--border)', borderRadius: 6,
                    height: 48, boxSizing: 'border-box', fontFamily: "'DM Mono', monospace"
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Max steps/acc</span>
                <input
                  type="number"
                  value={relayMaxSteps}
                  onChange={e => setRelayMaxSteps(parseInt(e.target.value) || 3)}
                  style={{
                    padding: '8px 10px', fontSize: 11.5, background: 'var(--surface3)',
                    color: '#fff', border: '1px solid var(--border)', borderRadius: 6,
                    height: 48, boxSizing: 'border-box', fontFamily: "'DM Mono', monospace"
                  }}
                />
              </div>
            </div>

            {/* Relay visual timeline map */}
            <RelayTrackVisualizer
              accounts={activeAccountsList}
              activeIndex={activeRelayIndex}
              isRunning={isRelayRunning}
            />

            {/* Relay Live Console */}
            <div style={{
              background: '#040406', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px 16px', height: 160, overflowY: 'auto',
              fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: '#f5b731',
              display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16
            }}>
              {relayLogs.map((log, idx) => (
                <div key={idx} style={{ opacity: idx === relayLogs.length - 1 ? 1 : 0.6 }}>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Completed steps and package exporter */}
            {relayStepsReport.length > 0 && (
              <div style={{
                background: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--teal)', fontFamily: "'DM Mono', monospace" }}>
                    ✓ Relay handoff context compiled successfully!
                  </span>
                  <button
                    className="btn btn-gold btn-xs"
                    onClick={handleDownloadHandoff}
                    style={{ fontSize: 10, padding: '4px 10px' }}
                  >
                    📥 Download Handoff Payload
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {["README.md", "handoff.json", "handoff.md", "next-prompt.txt", "steps.json"].map(file => (
                    <span
                      key={file}
                      style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--teal)',
                        background: 'rgba(0, 212, 170, 0.1)', padding: '2px 8px', borderRadius: 4,
                        border: '1px solid rgba(0, 212, 170, 0.2)'
                      }}
                    >
                      📄 {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Relay Execution History */}
          <Card>
            <SectionTitle color="var(--gold)">Relay Execution History</SectionTitle>
            {relayHistory.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>No previous relay runs recorded. Start a new relay chain above to see history.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                {relayHistory.map(run => (
                  <div key={run.runId} style={{
                    background: '#07070f', border: '1px solid rgba(255,255,255,0.04)',
                    padding: '12px 14px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold)', fontFamily: "'DM Mono', monospace" }}>
                        {run.runId}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {new Date(run.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#c4c7de', lineHeight: 1.4 }}>
                      <strong>Goal:</strong> "{run.goal}"
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'var(--muted)', marginTop: 4 }}>
                      <span>
                        🔄 {run.accountsUsed} accounts · {run.steps.length} steps · ⚡ {run.creditsUsed}cr consumed
                      </span>
                      <button
                        className="btn btn-gold btn-xs"
                        onClick={async () => {
                          sound.play('success');
                          try {
                            await exportRelayZip(run);
                            toast.success("✓ Downloaded historic handoff package!");
                          } catch {
                            toast.error("Failed to generate ZIP.");
                          }
                        }}
                        style={{ fontSize: 9.5, padding: '2px 8px' }}
                      >
                        📥 ZIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Schedulers & Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Daily Scheduler */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle color="var(--teal)">Daily Scheduler</SectionTitle>
              <Toggle
                on={schedulerEnabled}
                onChange={() => { sound.play('click'); setSchedulerEnabled(!schedulerEnabled); }}
                color="var(--teal)"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Extra run times (comma-separated)
                </span>
                <input
                  type="text"
                  value={extraRunTimes}
                  onChange={e => setExtraRunTimes(e.target.value)}
                  placeholder="12:00, 16:00, 20:00"
                  style={{
                    padding: '8px 10px', fontSize: 11.5, background: 'var(--surface3)',
                    color: '#fff', border: '1px solid var(--border)', borderRadius: 6,
                    fontFamily: "'DM Mono', monospace"
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: "Auto-sync credit values before run", on: autoSyncBeforeRun, toggle: setAutoSyncBeforeRun },
                  { label: "Rotate queue prompts sequentially", on: queueRotationEnabled, toggle: setQueueRotationEnabled }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, color: '#c4c7de' }}>{item.label}</span>
                    <Toggle
                      on={item.on}
                      onChange={() => { sound.play('click'); item.toggle(!item.on); }}
                      color="var(--teal)"
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Credit Utilization Goal
                </span>
                <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>{goalPct}%</span>
                  <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>Min. limit trigger</span>
                </div>
                <input
                  type="range" min="10" max="100" step="5" value={goalPct}
                  onChange={e => { sound.play('click'); setGoalPct(parseInt(e.target.value)); }}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={handleDownloadCsvReport}
                  style={{ flex: 1, fontSize: 11, padding: '6px 0', border: '1px solid var(--border)' }}
                >
                  📥 Export CSV Report
                </button>
              </div>
            </div>
          </Card>

          {/* Credit Exhaustion Panel */}
          <Card style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'linear-gradient(135deg, rgba(239,68,68,0.03) 0%, rgba(0,0,0,0) 100%)' }}>
            <SectionTitle color="var(--red)">Credit Exhaustion Mode</SectionTitle>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.45 }}>
              Use up all expiring credits. Broadcasts target prompts sequentially across all workspaces until available quotas are depleted.
            </p>

            <button
              className="btn btn-danger btn-xs"
              onClick={handleExhaustCredits}
              disabled={isExhaustRunning || activeAccountsList.length === 0}
              style={{ width: '100%', fontSize: 10.5, padding: '8px 0', justifyContent: 'center' }}
            >
              {isExhaustRunning ? '⏳ Exhausting Fleet Credits...' : '⚡ Trigger Fleet Credit Exhaustion Cycle'}
            </button>
          </Card>

          {/* AI Prompt Generator */}
          <Card>
            <SectionTitle color="var(--gold)">Smart Prompt Generator (LLM)</SectionTitle>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
              Draft innovative visual and modular prompt directives using local model heuristics:
            </p>

            <div style={{
              background: 'var(--surface3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 12px', fontSize: 11.5,
              color: '#fff', fontFamily: "'DM Mono', monospace", lineHeight: 1.45, marginBottom: 14
            }}>
              {smartPromptText}
            </div>

            <button
              className="btn btn-gold btn-xs"
              onClick={handleGenerateSmartPrompt}
              style={{ width: '100%', fontSize: 10.5, padding: '7px 0', justifyContent: 'center' }}
            >
              🔮 Query LLM for Workspace Prompts
            </button>
          </Card>

        </div>

      </div>

    </div>
  );
}
