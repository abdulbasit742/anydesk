import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';

/* ── helpers ────────────────────────────────────────────────────── */
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

function fmtUptime(ms) {
  const s = ~~(ms / 1000);
  const m = ~~(s / 60) % 60;
  const h = ~~(s / 3600);
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
}

/* ── SVG Sparkline ──────────────────────────────────────────────── */
function Sparkline({ data, color = 'var(--gold)', height = 36, glow = true }) {
  const W = 120, H = height;
  const pad = 2;
  const max = Math.max(1, ...data);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - (v / max) * (H - pad * 2);
    return `${x},${y}`;
  });
  const area = [`${pad},${H - pad}`, ...pts, `${W - pad},${H - pad}`].join(' ');
  const id = `sp-${color.replace(/[^a-z0-9]/gi, '')}-${height}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        {glow && (
          <filter id={`glow-${id}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.6" />
          </filter>
        )}
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={pts.join(' ')} fill="none"
        stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round"
        filter={glow ? `url(#glow-${id})` : undefined}
      />
      <circle
        cx={pts[pts.length - 1]?.split(',')[0]}
        cy={pts[pts.length - 1]?.split(',')[1]}
        r="2.5" fill={color}
        filter={glow ? `url(#glow-${id})` : undefined}
      />
    </svg>
  );
}

/* ── Animated Credit Ring ───────────────────────────────────────── */
function CreditRing({ pct, color, size = 56 }) {
  const R = (size - 6) / 2;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct / 100);
  const c = size / 2;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={c} cy={c} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx={c} cy={c} r={R} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x={c} y={c + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="800" fontFamily="DM Mono,monospace">
        {~~pct}%
      </text>
    </svg>
  );
}

/* ── Latency Bar ────────────────────────────────────────────────── */
function LatencyBar({ ms, max = 200 }) {
  const pct = Math.min(100, (ms / max) * 100);
  const color = ms < 50 ? 'var(--teal)' : ms < 100 ? 'var(--gold)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease', boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ fontSize: 9.5, color, fontFamily: 'DM Mono,monospace', minWidth: 36, textAlign: 'right', fontWeight: 700 }}>
        {ms.toFixed(0)}ms
      </span>
    </div>
  );
}

/* ── Live Event Feed Item ───────────────────────────────────────── */
function EventItem({ evt, isNew }) {
  const typeStyle = {
    broadcast: { color: 'var(--gold)',   icon: '📡' },
    success:   { color: 'var(--teal)',   icon: '✓' },
    error:     { color: 'var(--red)',    icon: '✕' },
    ping:      { color: 'var(--blue)',   icon: '⟳' },
    workflow:  { color: 'var(--purple)', icon: '⚙' },
    system:    { color: 'var(--muted2)', icon: '●' },
  }[evt.type] || { color: 'var(--muted2)', icon: '●' };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      animation: isNew ? 'fadeIn 0.3s ease' : 'none',
      opacity: isNew ? undefined : 0.8,
    }}>
      <span style={{ fontSize: 10, color: typeStyle.color, flexShrink: 0, marginTop: 1, fontWeight: 700, minWidth: 14 }}>
        {typeStyle.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#d4d4e4', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {evt.text}
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1 }}>{evt.ts}</div>
      </div>
    </div>
  );
}

/* ── Platform Health Card ───────────────────────────────────────── */
function PlatformCard({ platform, accounts, sparkData, latency, pinging }) {
  const active  = accounts.filter(a => a.status === 'active').length;
  const total   = accounts.length;
  const health  = total === 0 ? 0 : (active / total) * 100;
  const credits = accounts.reduce((s, a) => s + (a.credits || rand(20, 98)), 0) / Math.max(1, accounts.length);
  const creditColor = credits < 20 ? 'var(--red)' : credits < 50 ? 'var(--gold)' : 'var(--teal)';
  const statusColor = total === 0 ? 'var(--muted)' : active > 0 ? 'var(--teal)' : 'var(--red)';

  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${platform.color}`,
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${platform.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Glow blob */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: `${platform.color}18`, filter: 'blur(20px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{platform.icon}</span>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>{platform.name}</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{total} account{total !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <CreditRing pct={credits} color={creditColor} size={50} />
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, animation: active > 0 ? 'pulse 2s infinite' : 'none' }} />
        <span style={{ fontSize: 10, color: statusColor, fontWeight: 700 }}>
          {total === 0 ? 'No accounts' : `${active}/${total} active`}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
          {pinging ? '⟳ pinging…' : `${latency.toFixed(0)}ms`}
        </span>
      </div>

      {/* Latency bar */}
      <LatencyBar ms={latency} />

      {/* Sparkline */}
      <div style={{ marginTop: 2 }}>
        <Sparkline data={sparkData} color={platform.color} height={32} />
      </div>

      {/* Health bar */}
      {total > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: 'var(--muted)', marginBottom: 3 }}>
            <span>Health</span><span>{~~health}%</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${health}%`, background: platform.color, borderRadius: 99, transition: 'width 0.6s ease', boxShadow: `0 0 6px ${platform.color}` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Broadcast Volume Chart ─────────────────────────────────────── */
function VolumeChart({ data, color }) {
  const max = Math.max(1, ...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48, padding: '0 2px' }}>
      {data.map((d, i) => {
        const h = Math.max(4, (d.v / max) * 48);
        const isToday = i === data.length - 1;
        return (
          <div key={i} title={`${d.label}: ${d.v}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{
              width: '100%', height: h,
              background: isToday ? color : `${color}55`,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.5s ease',
              boxShadow: isToday ? `0 0 8px ${color}` : 'none',
            }} />
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
/*  BATCH OPERATIONS PANEL  (Day 10)                                   */
/* ════════════════════════════════════════════════════════════════════ */

const STATUS_META = {
  queued:  { icon: '⏳', color: '#64748b', label: 'Queued' },
  running: { icon: '⚡', color: '#f59e0b', label: 'Running' },
  done:    { icon: '✅', color: '#10b981', label: 'Done' },
  failed:  { icon: '❌', color: '#f43f5e', label: 'Failed' },
};

function makeQueueItem(id, name, platform, priority, status = 'queued') {
  return { id, name, platform, priority, status };
}

const SEED_QUEUE = [
  makeQueueItem('q1', 'Build landing page for SaaS product', 'bolt',    9, 'done'),
  makeQueueItem('q2', 'Generate React component library',    'lovable', 7, 'running'),
  makeQueueItem('q3', 'Write marketing copy variants',       'claude',  8, 'running'),
  makeQueueItem('q4', 'Automate deployment pipeline',        'manus',   6, 'queued'),
  makeQueueItem('q5', 'Fix CSS grid layout issues',          'cursor',  5, 'queued'),
  makeQueueItem('q6', 'Create API documentation site',       'v0',      4, 'failed'),
  makeQueueItem('q7', 'Refactor authentication module',      'replit',  3, 'queued'),
];

const PLATFORM_ICONS = { bolt: '⚡', lovable: '💜', manus: '🤖', replit: '🔵', claude: '🧠', cursor: '🎯', v0: '🌊' };

function QueueItem({ item, index, priority }) {
  const meta = STATUS_META[item.status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 8,
      background: item.status === 'running' ? 'rgba(245,158,11,0.06)' : item.status === 'done' ? 'rgba(16,185,129,0.04)' : item.status === 'failed' ? 'rgba(244,63,94,0.05)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${item.status === 'running' ? '#f59e0b33' : item.status === 'done' ? '#10b98122' : item.status === 'failed' ? '#f43f5e22' : 'rgba(255,255,255,0.05)'}`,
      transition: 'all 0.3s',
      animation: item.status === 'running' ? 'runningPulse 2s infinite' : 'none',
    }}>
      {/* Rank */}
      {priority && (
        <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace', minWidth: 16, textAlign: 'center', fontWeight: 700 }}>
          #{index + 1}
        </span>
      )}

      {/* Status icon */}
      <span style={{ fontSize: 14, flexShrink: 0 }}>{meta.icon}</span>

      {/* Platform icon */}
      <span style={{ fontSize: 12, flexShrink: 0 }}>{PLATFORM_ICONS[item.platform] || '🌐'}</span>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: item.status === 'done' ? 'var(--muted)' : '#e4e4ed', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>
          {item.name}
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1, fontFamily: 'DM Mono,monospace' }}>
          {item.platform} · priority {item.priority}
        </div>
      </div>

      {/* Status label */}
      <span style={{ fontSize: 9, color: meta.color, fontWeight: 700, fontFamily: 'DM Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
        {meta.label}
      </span>
    </div>
  );
}

/* ── DEPENDENCY ORCHESTRATOR (Day 26) ────────────────────────── */
const ORCH_NODES = [
  { id: 'auth',     label: '🔑 Key Exchange',  agent: 'VaultAgent',     x: 60,  y: 90,  details: 'Verify platform credentials' },
  { id: 'ping',     label: '📡 Ping Sweep',      agent: 'PingAgent',      x: 190, y: 40,  details: 'Measure health latency' },
  { id: 'index',    label: '🗂️ Prompt Cache',    agent: 'SearchAgent',    x: 190, y: 140, details: 'Sync local fuzzy query index' },
  { id: 'optimize', label: '✨ AI Refiner',      agent: 'OptimizeAgent',  x: 340, y: 90,  details: 'Refine tokens & structure' },
  { id: 'dispatch', label: '⚡ Multi-Broadcast', agent: 'BroadcastAgent', x: 490, y: 90,  details: 'Distribute prompts in parallel' },
  { id: 'verify',   label: '📥 Audit Receipts',  agent: 'AuditAgent',     x: 640, y: 40,  details: 'Collect delivery telemetry' },
  { id: 'report',   label: '📁 Report Archiver',  agent: 'ExportAgent',    x: 640, y: 140, details: 'Compile analytics log' },
];

const ORCH_EDGES = [
  { from: 'auth',     to: 'ping' },
  { from: 'auth',     to: 'index' },
  { from: 'ping',     to: 'optimize' },
  { from: 'index',    to: 'optimize' },
  { from: 'optimize', to: 'dispatch' },
  { from: 'dispatch', to: 'verify' },
  { from: 'dispatch', to: 'report' },
];

function DependencyOrchestrator({ onPushEvent }) {
  const [nodeStates, setNodeStates] = useState({
    auth: 'done',
    ping: 'done',
    index: 'done',
    optimize: 'running',
    dispatch: 'queued',
    verify: 'queued',
    report: 'queued',
  });
  const [activeNodeId, setActiveNodeId] = useState('optimize');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceStep, setSequenceStep] = useState(2);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSequenceStep(s => {
        const nextStep = (s + 1) % 6;
        
        const nextStates = {
          auth: 'queued', ping: 'queued', index: 'queued',
          optimize: 'queued', dispatch: 'queued', verify: 'queued', report: 'queued'
        };

        if (nextStep === 0) {
          nextStates.auth = 'running';
          onPushEvent?.('system', 'Agent: VaultAgent initiated system-wide validation sweep...');
        } else if (nextStep === 1) {
          nextStates.auth = 'done';
          nextStates.ping = 'running';
          nextStates.index = 'running';
          onPushEvent?.('system', 'Agent: VaultAgent exchange verified. Pinging platforms...');
          onPushEvent?.('ping', 'Agent: PingAgent sweeping 7 connected platforms...');
        } else if (nextStep === 2) {
          nextStates.auth = 'done'; nextStates.ping = 'done'; nextStates.index = 'done';
          nextStates.optimize = 'running';
          onPushEvent?.('success', 'Agent: SearchAgent cached 5,000 index tokens successfully.');
          onPushEvent?.('workflow', 'Agent: OptimizeAgent refining prompt structure & constraints...');
        } else if (nextStep === 3) {
          nextStates.auth = 'done'; nextStates.ping = 'done'; nextStates.index = 'done'; nextStates.optimize = 'done';
          nextStates.dispatch = 'running';
          onPushEvent?.('workflow', 'Agent: OptimizeAgent complete. Handing off to Broadcast...');
          onPushEvent?.('broadcast', 'Agent: BroadcastAgent spawning 12 concurrent API channels...');
        } else if (nextStep === 4) {
          nextStates.auth = 'done'; nextStates.ping = 'done'; nextStates.index = 'done'; nextStates.optimize = 'done'; nextStates.dispatch = 'done';
          nextStates.verify = 'running';
          nextStates.report = 'running';
          onPushEvent?.('success', 'Agent: BroadcastAgent batch dispatched. Verifying receipts...');
        } else if (nextStep === 5) {
          nextStates.auth = 'done'; nextStates.ping = 'done'; nextStates.index = 'done'; nextStates.optimize = 'done'; nextStates.dispatch = 'done'; nextStates.verify = 'done'; nextStates.report = 'done';
          onPushEvent?.('success', 'Agent: AuditAgent verified all receipts. Telemetry stored.');
          onPushEvent?.('success', 'Agent: ExportAgent compiled daily reports and saved to system.');
          setIsPlaying(false);
        }

        setNodeStates(nextStates);
        
        const activeIds = Object.keys(nextStates).filter(k => nextStates[k] === 'running');
        if (activeIds.length > 0) setActiveNodeId(activeIds[0]);
        else setActiveNodeId(Object.keys(nextStates).find(k => nextStates[k] === 'done') || 'auth');

        return nextStep;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, onPushEvent]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSequenceStep(0);
    setNodeStates({
      auth: 'running',
      ping: 'queued',
      index: 'queued',
      optimize: 'queued',
      dispatch: 'queued',
      verify: 'queued',
      report: 'queued',
    });
    setActiveNodeId('auth');
    onPushEvent?.('system', 'Orchestration console reset to Step 0: Auth Validation.');
  };

  const activeNode = ORCH_NODES.find(n => n.id === activeNodeId) || ORCH_NODES[0];
  const activeStatus = nodeStates[activeNode.id];

  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderTop: '2px solid var(--teal)', borderRadius: 16,
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(59,130,246,0.15))',
            border: '1px solid rgba(45,212,191,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🛰️</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Agent Orchestration Graph</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1, fontFamily: 'DM Mono,monospace' }}>
              {isPlaying ? (
                <span style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 1.5s infinite' }} />
                  Step {sequenceStep}/5 Active
                </span>
              ) : (
                'Sequence ready · Click Play to run simulation'
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {!isPlaying ? (
            <button
              onClick={handleStart}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(45,212,191,0.4)',
                background: 'rgba(45,212,191,0.1)', color: 'var(--teal)', cursor: 'pointer',
                fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono,monospace',
              }}
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={handlePause}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)',
                background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', cursor: 'pointer',
                fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono,monospace',
              }}
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)', color: 'var(--muted2)', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono,monospace',
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div style={{
        background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 10, padding: 8, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '16px 16px', pointerEvents: 'none'
        }} />

        <svg viewBox="0 0 740 180" style={{ width: '100%', height: 180, display: 'block', zIndex: 1, position: 'relative' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#334155" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--teal)" />
            </marker>
          </defs>

          {ORCH_EDGES.map((edge, idx) => {
            const fromNode = ORCH_NODES.find(n => n.id === edge.from);
            const toNode = ORCH_NODES.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const fromState = nodeStates[edge.from];
            const toState = nodeStates[edge.to];
            
            const isActiveFlow = fromState === 'done' && toState === 'running';
            const isDoneFlow = fromState === 'done' && toState === 'done';
            
            let strokeColor = '#27273a';
            let strokeDash = 'none';
            let animationClass = 'none';

            if (isActiveFlow) {
              strokeColor = 'var(--teal)';
              strokeDash = '5,5';
              animationClass = 'dashflow 1s linear infinite';
            } else if (isDoneFlow) {
              strokeColor = 'rgba(45,212,191,0.4)';
            }

            return (
              <line
                key={`edge-${idx}`}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke={strokeColor}
                strokeWidth={isActiveFlow ? 2 : 1.5}
                strokeDasharray={strokeDash}
                style={{ animation: animationClass }}
                markerEnd={isActiveFlow || isDoneFlow ? "url(#arrow-active)" : "url(#arrow)"}
              />
            );
          })}

          {ORCH_NODES.map(node => {
            const state = nodeStates[node.id];
            const isFocused = activeNodeId === node.id;
            
            let color = '#475569';
            let stroke = 'rgba(255,255,255,0.06)';
            let filter = 'none';
            let glowColor = 'transparent';

            if (state === 'done') {
              color = 'var(--teal)';
              stroke = 'rgba(45,212,191,0.3)';
              glowColor = 'rgba(45,212,191,0.1)';
            } else if (state === 'running') {
              color = 'var(--gold)';
              stroke = 'var(--gold)';
              glowColor = 'rgba(245,158,11,0.2)';
              filter = 'drop-shadow(0 0 6px var(--gold))';
            } else if (isFocused) {
              color = '#e2e8f0';
              stroke = '#fff';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setActiveNodeId(node.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="0" cy="0" r="14" fill={glowColor} stroke="none" />
                <circle
                  cx="0" cy="0" r="11"
                  fill="#0a0a0f"
                  stroke={stroke}
                  strokeWidth={isFocused ? 2.5 : 1.5}
                  filter={filter}
                  style={{ transition: 'all 0.2s' }}
                />
                <circle
                  cx="0" cy="0" r="4.5"
                  fill={color}
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  x="0" y="-18"
                  textAnchor="middle"
                  fill={isFocused ? '#fff' : '#94a3b8'}
                  fontSize="9.5"
                  fontWeight={isFocused ? '800' : '600'}
                  fontFamily="DM Mono, monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', minHeight: 42,
      }}>
        <div>
          <span style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Focus Agent</span>
          <div style={{ fontSize: 11.5, color: '#fff', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--teal)' }}>🤖 {activeNode.agent}</span>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
            <span style={{ color: 'var(--muted2)' }}>{activeNode.details}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Agent Status</span>
          <div style={{
            fontSize: 10.5, fontWeight: 800, fontFamily: 'DM Mono, monospace', marginTop: 2,
            color: activeStatus === 'done' ? 'var(--teal)' : activeStatus === 'running' ? 'var(--gold)' : 'var(--muted)'
          }}>
            {activeStatus?.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchOperationsPanel({ onPushEvent }) {
  const [queue, setQueue]               = useState(SEED_QUEUE);
  const [priorityMode, setPriorityMode] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [progress, setProgress]         = useState(0); // 0-100
  const [activeOp, setActiveOp]         = useState(''); // label shown in progress bar
  const timerRef                        = useRef(null);

  /* Sorted view */
  const displayQueue = useMemo(() => {
    if (!priorityMode) return queue;
    return [...queue].sort((a, b) => b.priority - a.priority);
  }, [queue, priorityMode]);

  /* Stats */
  const counts = useMemo(() => ({
    queued:  queue.filter(i => i.status === 'queued').length,
    running: queue.filter(i => i.status === 'running').length,
    done:    queue.filter(i => i.status === 'done').length,
    failed:  queue.filter(i => i.status === 'failed').length,
  }), [queue]);

  /* Animated progress helper */
  function animateProgress(label, onDone) {
    setActiveOp(label);
    setProgress(0);
    setBatchRunning(true);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += randInt(4, 12);
      if (p >= 100) {
        p = 100;
        clearInterval(timerRef.current);
        setProgress(100);
        setTimeout(() => { setBatchRunning(false); setProgress(0); setActiveOp(''); onDone?.(); }, 600);
      } else {
        setProgress(p);
      }
    }, 150);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  /* Batch actions */
  function runAllActive() {
    if (batchRunning) return;
    animateProgress('Running all active items…', () => {
      setQueue(prev => prev.map(i => i.status === 'queued' ? { ...i, status: 'running' } : i));
      onPushEvent?.('workflow', `Batch: Run All Active triggered — ${counts.queued} items queued`);
    });
  }

  function pauseAll() {
    if (batchRunning) return;
    animateProgress('Pausing all running…', () => {
      setQueue(prev => prev.map(i => i.status === 'running' ? { ...i, status: 'queued' } : i));
      onPushEvent?.('system', 'Batch: All running items paused');
    });
  }

  function resumeAll() {
    if (batchRunning) return;
    animateProgress('Resuming queue…', () => {
      setQueue(prev => prev.map(i => i.status === 'queued' ? { ...i, status: 'running' } : i));
      onPushEvent?.('workflow', 'Batch: Queue resumed — all queued items are now running');
    });
  }

  function clearCompleted() {
    if (batchRunning) return;
    const removed = queue.filter(i => i.status === 'done').length;
    setQueue(prev => prev.filter(i => i.status !== 'done'));
    onPushEvent?.('success', `Batch: Cleared ${removed} completed item${removed !== 1 ? 's' : ''} from queue`);
  }

  const batchBtnBase = (color, disabled) => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    border: `1px solid ${color}44`,
    background: `${color}12`,
    color, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'DM Mono,monospace', fontSize: 11, fontWeight: 700,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderTop: '2px solid var(--gold)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      {/* Progress bar */}
      {batchRunning && (
        <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--teal), var(--gold))',
            transition: 'width 0.15s ease',
            boxShadow: '0 0 8px var(--gold)',
          }} />
        </div>
      )}

      <div style={{ padding: '16px 20px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(45,212,191,0.1))',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>⚙️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Batch Operations</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1, fontFamily: 'DM Mono,monospace' }}>
                {batchRunning ? (
                  <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 1s infinite' }} />
                    {activeOp} {progress}%
                  </span>
                ) : (
                  `${queue.length} total · ${counts.running} running · ${counts.done} done`
                )}
              </div>
            </div>
          </div>

          {/* Priority toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Priority Queue</span>
            <button
              onClick={() => setPriorityMode(v => !v)}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: priorityMode ? 'linear-gradient(90deg, #2dd4bf, #f59e0b)' : 'rgba(255,255,255,0.08)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
                flexShrink: 0,
              }}
              aria-label="Toggle priority queue"
            >
              <div style={{
                position: 'absolute', top: 3, left: priorityMode ? 20 : 3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }} />
            </button>
            {priorityMode && (
              <span style={{ fontSize: 9, color: 'var(--gold)', fontFamily: 'DM Mono,monospace', fontWeight: 700 }}>ON</span>
            )}
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {Object.entries(counts).map(([status, count]) => {
            const meta = STATUS_META[status];
            return (
              <div key={status} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 20,
                background: `${meta.color}15`, border: `1px solid ${meta.color}33`,
                fontSize: 10, color: meta.color, fontFamily: 'DM Mono,monospace', fontWeight: 700,
              }}>
                <span>{meta.icon}</span> {count} {status}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button style={batchBtnBase('var(--teal)', batchRunning)} onClick={runAllActive} disabled={batchRunning}>
            ▶ Run All Active
          </button>
          <button style={batchBtnBase('var(--gold)', batchRunning)} onClick={pauseAll} disabled={batchRunning}>
            ⏸ Pause All
          </button>
          <button style={batchBtnBase('#8b5cf6', batchRunning)} onClick={resumeAll} disabled={batchRunning}>
            ⏭ Resume All
          </button>
          <button style={batchBtnBase('var(--muted)', batchRunning || counts.done === 0)} onClick={clearCompleted} disabled={batchRunning || counts.done === 0}>
            🗑 Clear Completed {counts.done > 0 ? `(${counts.done})` : ''}
          </button>
        </div>

        {/* Queue visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 260, overflowY: 'auto', paddingRight: 2 }}>
          {displayQueue.map((item, i) => (
            <QueueItem key={item.id} item={item} index={i} priority={priorityMode} />
          ))}
          {queue.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11, padding: '24px 0' }}>
              Queue is empty — all tasks cleared ✓
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes runningPulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
      `}</style>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────────────────────── */
const BOOT_TIME = Date.now();

export default function MissionControl({ onNav }) {
  const { accounts, broadcasts, workflows } = useStore();

  /* ── Simulated live state ─────────────────────────── */
  const [events, setEvents]       = useState([]);
  const [pinging, setPinging]     = useState(false);
  const [latencies, setLatencies] = useState({});
  const [sparkData, setSparkData] = useState({});
  const [uptime, setUptime]       = useState(0);
  const eventsRef                 = useRef([]);

  /* Generate initial sparklines per platform */
  useEffect(() => {
    const initial = {};
    PLATFORMS.forEach(p => {
      initial[p.id] = Array.from({ length: 20 }, () => randInt(0, 8));
    });

    const initialLat = {};
    PLATFORMS.forEach(p => { initialLat[p.id] = rand(12, 85); });

    const t = setTimeout(() => {
      setSparkData(initial);
      setLatencies(initialLat);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  /* Live tick — update sparklines + uptime every 2.5s */
  useEffect(() => {
    const iv = setInterval(() => {
      setUptime(Date.now() - BOOT_TIME);

      setSparkData(prev => {
        const next = { ...prev };
        PLATFORMS.forEach(p => {
          const arr = [...(prev[p.id] || [])];
          arr.shift();
          const accs = accounts.filter(a => a.platform === p.id);
          arr.push(randInt(accs.length > 0 ? 1 : 0, Math.max(2, accs.length * 3)));
          next[p.id] = arr;
        });
        return next;
      });

      setLatencies(prev => {
        const next = { ...prev };
        PLATFORMS.forEach(p => {
          const base = accounts.filter(a => a.platform === p.id).length > 0 ? rand(15, 70) : rand(60, 180);
          next[p.id] = prev[p.id] ? prev[p.id] * 0.7 + base * 0.3 : base;
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(iv);
  }, [accounts]);

  /* Event generator */
  const pushEvent = useCallback((type, text) => {
    const evt = { id: Math.random().toString(36).slice(2), type, text, ts: new Date().toLocaleTimeString('en-US', { hour12: false }), isNew: true };
    eventsRef.current = [evt, ...eventsRef.current].slice(0, 60);
    setEvents([...eventsRef.current]);
    setTimeout(() => {
      eventsRef.current = eventsRef.current.map(e => e.id === evt.id ? { ...e, isNew: false } : e);
      setEvents([...eventsRef.current]);
    }, 500);
  }, []);

  /* Seed events from real data + simulate live feed */
  useEffect(() => {
    broadcasts.slice(0, 5).forEach(b => {
      eventsRef.current.push({
        id: b.id || Math.random().toString(36).slice(2),
        type: 'broadcast',
        text: `Broadcast sent: "${(b.prompt || '').slice(0, 50)}…" → ${b.total || 0} accounts`,
        ts: b.createdAt ? new Date(b.createdAt).toLocaleTimeString('en-US', { hour12: false }) : '—',
        isNew: false,
      });
    });
    setEvents([...eventsRef.current]);
  }, [broadcasts]);

  useEffect(() => {
    const EVENT_POOL = [
      () => ({ type: 'ping',      text: `Platform handshake verified — avg ${(rand(12, 65)).toFixed(0)}ms` }),
      () => ({ type: 'system',    text: 'Vault integrity check passed — AES-256 credentials verified' }),
      () => ({ type: 'workflow',  text: `Workflow pipeline step ${randInt(1, 4)}/4 completed successfully` }),
      () => ({ type: 'success',   text: `Broadcast delivered to ${randInt(1, 12)} accounts — 100% success rate` }),
      () => ({ type: 'broadcast', text: `Prompt dispatched to ${PLATFORMS[randInt(0, PLATFORMS.length - 1)].name} workspace` }),
      () => ({ type: 'system',    text: `Session telemetry refreshed — ${randInt(200, 800)} events tracked` }),
      () => ({ type: 'ping',      text: `Latency sweep complete — all ${accounts.length || 0} hosts responding` }),
    ];
    const iv = setInterval(() => {
      const pool = EVENT_POOL[randInt(0, EVENT_POOL.length - 1)]();
      pushEvent(pool.type, pool.text);
    }, 3800);
    return () => clearInterval(iv);
  }, [accounts.length, pushEvent]);

  /* Manual ping sweep */
  const runPingSweep = useCallback(async () => {
    if (pinging) return;
    setPinging(true);
    pushEvent('ping', 'Manual ping sweep initiated…');
    for (const p of PLATFORMS) {
      await new Promise(r => setTimeout(r, 180 + Math.random() * 180));
      const lat = rand(12, 90);
      setLatencies(prev => ({ ...prev, [p.id]: lat }));
      pushEvent('ping', `${p.icon} ${p.name} → ${lat.toFixed(0)}ms ${lat < 60 ? '✓' : '⚠'}`);
    }
    pushEvent('success', 'Ping sweep complete — all platforms checked');
    setPinging(false);
  }, [pinging, pushEvent]);

  /* ── Derived stats ──────────────────────────────────── */
  const activeAccounts = useMemo(() => accounts.filter(a => a.status === 'active'), [accounts]);
  const totalBroadcasts = broadcasts.length;
  const todayBroadcasts = useMemo(() =>
    broadcasts.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()),
    [broadcasts]);
  const successRate = useMemo(() => {
    const total = broadcasts.reduce((s, b) => s + (b.total || 0), 0);
    const ok    = broadcasts.reduce((s, b) => s + (b.successCount || 0), 0);
    return total > 0 ? ((ok / total) * 100).toFixed(1) : '100.0';
  }, [broadcasts]);

  /* Volume chart data — last 14 days */
  const volumeData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i));
      return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), v: 0, key: d.toDateString() };
    });
    broadcasts.forEach(b => {
      const key = new Date(b.createdAt).toDateString();
      const day = days.find(d => d.key === key);
      if (day) day.v += b.total || 1;
    });
    return days;
  }, [broadcasts]);

  /* ── Global health score ─────────────────────────── */
  const healthScore = useMemo(() => {
    if (accounts.length === 0) return 100;
    const active = activeAccounts.length / accounts.length;
    const rate   = parseFloat(successRate) / 100;
    return ~~((active * 0.5 + rate * 0.5) * 100);
  }, [accounts, activeAccounts, successRate]);

  const healthColor = healthScore >= 90 ? 'var(--teal)' : healthScore >= 60 ? 'var(--gold)' : 'var(--red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(79,142,247,0.04) 50%, rgba(245,183,49,0.06) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated glow blobs */}
        <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,212,170,0.08)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, borderRadius: '50%', background: 'rgba(245,183,49,0.08)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(79,142,247,0.15))',
            border: '1px solid rgba(0,212,170,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            boxShadow: '0 0 20px rgba(0,212,170,0.15)',
          }}>🛰️</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Mission Control
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono,monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 2s infinite', boxShadow: '0 0 6px var(--teal)' }} />
              Live · Uptime {fmtUptime(uptime)} · {PLATFORMS.length} platforms monitored
            </div>
          </div>
        </div>

        {/* Global health */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: healthColor, lineHeight: 1, textShadow: `0 0 20px ${healthColor}` }}>
              {healthScore}%
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              System Health
            </div>
          </div>
          <button
            className={`btn btn-teal btn-sm ${pinging ? 'btn-pulse' : ''}`}
            onClick={runPingSweep}
            disabled={pinging}
            style={{ fontSize: 11 }}
          >
            {pinging ? <><span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> Pinging…</> : '⟳ Ping All'}
          </button>
          <button className="btn btn-gold btn-sm" onClick={() => onNav?.('broadcast')} style={{ fontSize: 11 }}>
            📡 Broadcast
          </button>
        </div>
      </div>

      {/* ── TOP STATS ROW ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Accounts', val: activeAccounts.length, total: accounts.length, color: 'var(--teal)',   icon: '🔌', sub: `of ${accounts.length} connected` },
          { label: 'Broadcasts Today', val: todayBroadcasts.length, color: 'var(--gold)',   icon: '📡', sub: `${totalBroadcasts} all time` },
          { label: 'Success Rate',    val: `${successRate}%`,        color: 'var(--teal)',   icon: '✓',  sub: 'delivery rate' },
          { label: 'Live Workflows',  val: workflows.filter(w => w.status === 'running').length, color: 'var(--purple)', icon: '⚙️', sub: `${workflows.length} total` },
          { label: 'Platforms',       val: PLATFORMS.length,          color: 'var(--blue)',   icon: '🌐', sub: 'monitored' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderTop: `2px solid ${s.color}`, borderRadius: 12, padding: '14px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 50, height: 50, borderRadius: '50%', background: `${s.color}12`, filter: 'blur(15px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>{s.label}</span>
              <span style={{ fontSize: 16, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1, letterSpacing: '-0.5px' }}>{s.val}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4, fontFamily: 'DM Mono,monospace' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ORCHESTRATION CONSOLE GRID (Day 26) ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 14 }}>
        <DependencyOrchestrator onPushEvent={pushEvent} />
        <BatchOperationsPanel onPushEvent={pushEvent} />
      </div>

      {/* ── MAIN GRID: Platform Cards + Live Feed ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 300px', gap: 14 }}>

        {/* Platform health cards */}
        <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {PLATFORMS.map(p => (
            <PlatformCard
              key={p.id}
              platform={p}
              accounts={accounts.filter(a => a.platform === p.id)}
              sparkData={sparkData[p.id] || Array(20).fill(0)}
              latency={latencies[p.id] || 60}
              pinging={pinging}
            />
          ))}
        </div>

        {/* Live event feed */}
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', flexDirection: 'column',
          maxHeight: 480, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 1.5s infinite', boxShadow: '0 0 6px var(--teal)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>Live Feed</span>
            </div>
            <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {events.length} events
            </span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11, padding: '30px 0' }}>
                No events yet — waiting for activity…
              </div>
            ) : (
              events.slice(0, 30).map((evt, i) => (
                <EventItem key={evt.id} evt={evt} isNew={evt.isNew && i === 0} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Volume Chart + Latency Table + Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 14 }}>

        {/* Broadcast volume — 14 day bar chart */}
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Broadcast Volume</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>Last 14 days</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)' }}>{totalBroadcasts}</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>total</div>
            </div>
          </div>
          <VolumeChart data={volumeData} color="var(--gold)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 8.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {volumeData[0]?.label}
            </span>
            <span style={{ fontSize: 8.5, color: 'var(--gold)', fontFamily: 'DM Mono,monospace', fontWeight: 700 }}>
              Today: {todayBroadcasts.length}
            </span>
          </div>
        </div>

        {/* Platform latency table */}
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Platform Latency
            {pinging && <span style={{ fontSize: 9, color: 'var(--teal)', marginLeft: 8, animation: 'pulse 1s infinite' }}>● sweeping…</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLATFORMS.map(p => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{p.icon}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted2)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name.split('.')[0]}
                  </span>
                </div>
                <LatencyBar ms={latencies[p.id] || 60} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions panel */}
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Quick Actions</div>
          {[
            { icon: '📡', label: 'Broadcast Studio', sub: 'Send to all accounts', page: 'broadcast', color: 'var(--gold)' },
            { icon: '🖥️', label: 'Screen Wall',      sub: '12 screens, one prompt', page: 'screenwall', color: 'var(--teal)' },
            { icon: '⚙️', label: 'Run Workflow',     sub: 'Automation pipeline', page: 'workflows', color: 'var(--purple)' },
            { icon: '🖥️', label: 'AI Terminal',      sub: 'Live shell console', page: 'terminal', color: 'var(--blue)' },
            { icon: '📊', label: 'Analytics',        sub: 'Detailed reports', page: 'analytics', color: 'var(--teal)' },
            { icon: '🔒', label: 'Security Vault',   sub: 'Credential audit', page: 'vault', color: 'var(--red)' },
          ].map(a => (
            <button
              key={a.page}
              onClick={() => onNav?.(a.page)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 9,
                background: 'transparent', border: '1px solid var(--border)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.borderColor = `${a.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.2 }}>{a.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>{a.sub}</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
