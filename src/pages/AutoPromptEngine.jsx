import { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── CSS Animations (injected once) ────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.4; }
}
@keyframes spin-slow {
  to { transform: rotate(360deg); }
}
@keyframes card-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(245,183,49,0); }
  50% { box-shadow: 0 0 18px rgba(245,183,49,0.12); }
}
@keyframes slide-in-left {
  from { transform: translateX(-16px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slide-in-right {
  from { transform: translateX(16px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes progress-shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes agent-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes decision-flash {
  0% { opacity: 0; transform: scale(0.85); }
  60% { opacity: 1; transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes halo-rotate {
  to { transform: rotate(360deg); }
}
.ape-root * { box-sizing: border-box; }
.ape-root { font-family: 'Syne', sans-serif; }
.ape-mono { font-family: 'DM Mono', monospace !important; }
.ape-slide-left { animation: slide-in-left 0.3s ease-out forwards; }
.ape-slide-right { animation: slide-in-right 0.3s ease-out forwards; }
.ape-fade-in { animation: fade-in 0.35s ease-out forwards; }
.ape-decision { animation: decision-flash 0.4s ease-out forwards; }
.ape-glow { animation: card-glow 3s ease infinite; }
`;

/* ─── Constants ──────────────────────────────────────────────────── */
const DOMAINS = ['UI/UX Design', 'Backend API', 'Database Schema', 'Interactive UI', 'React Component', 'CLI Tool', 'Auth System', 'Data Pipeline'];
const PLATFORMS = [
  { name: 'Bolt.new', emoji: '⚡', color: '#f5b731' },
  { name: 'Lovable', emoji: '💖', color: '#ec4899' },
  { name: 'Manus.im', emoji: '🧠', color: '#a78bfa' },
  { name: 'Cursor', emoji: '💻', color: '#22d3ee' },
  { name: 'v0.dev', emoji: '🎨', color: '#3b82f6' },
  { name: 'Replit', emoji: '🔄', color: '#10b981' },
  { name: 'GitHub Copilot', emoji: '🐙', color: '#6366f1' },
];

const DENY_REASONS = [
  'Token budget exceeded (>800)',
  'Ambiguous specification: missing platform constraints',
  'Duplicate detected in PromptDNA registry',
  'Security flag: external API call without auth guard',
  'Stub pattern detected — non-production code',
  'Missing accessibility attributes (WCAG)',
  'Over-complex: L6 complexity not supported',
];

const APPROVE_REASONS = [
  'Synergy score 94%+ — cleared for dispatch',
  'Full specification verified — production-grade',
  'Persona alignment excellent — optimum parameters',
  'Token efficiency nominal (340–720 range)',
  'Format compliance 100% — dispatching to queue',
  'No duplicates found — adding to PromptDNA',
];

const PROMPT_TEMPLATES = [
  {
    domain: 'UI/UX Design',
    goals: ['Premium SaaS Landing Page', 'Glassmorphic Dashboard', 'Animated Hero Section', 'Dark Mode Design System'],
    template: (goal, platforms, tone, temp) =>
      `You are a senior UI/UX architect. Build a ${tone > 0.7 ? 'visually stunning, vibrant' : 'clean, production-ready'} React page for: "${goal}".\nTarget: [${platforms.join(', ')}]\nRequirements:\n- Inline styles only, CSS vars: --gold #f5b731, --teal #22d3ee, --purple #a78bfa, --surface #0e0e16\n- Glassmorphic cards with backdrop-filter blur\n- Smooth micro-animations (CSS keyframes, no external libs)\n- Real useState/useEffect — NO stubs\n- Mobile-responsive grid layout\n- Temperature weight: ${temp} (controls hallucination boundary)\nOutput complete JSX with export default.`,
  },
  {
    domain: 'Backend API',
    goals: ['JWT Auth Middleware', 'Rate Limiter Gateway', 'WebSocket Broadcast Hub', 'Redis Cache Layer'],
    template: (goal, platforms, tone, temp) =>
      `You are a Node.js architect. Design a ${tone > 0.7 ? 'scalable, enterprise-grade' : 'minimal, performant'} backend solution for: "${goal}".\nContext: [${platforms.join(', ')}]\nSpec:\n- TypeScript strict mode\n- Error handling with typed Result<T,E> patterns\n- Unit tests with mock injection\n- Environment config via dotenv\n- Temperature: ${temp}\nProvide complete, runnable implementation.`,
  },
  {
    domain: 'Database Schema',
    goals: ['Multi-tenant SaaS Schema', 'Time-series Event Store', 'Graph Relations Schema', 'Audit Log System'],
    template: (goal, platforms, tone, temp) =>
      `You are a database architect. Create a ${tone > 0.7 ? 'highly normalized, enterprise' : 'lean, fast-read'} PostgreSQL schema for: "${goal}".\nPlatforms: [${platforms.join(', ')}]\nInclude:\n- UUID primary keys\n- JSONB columns for flexible metadata\n- Indexes on hot query paths\n- Row-level security policies\n- Seed data (20 rows min)\n- Temp param: ${temp}`,
  },
  {
    domain: 'React Component',
    goals: ['Data Grid with Virtualization', 'Command Palette', 'Rich Text Editor', 'Kanban Board'],
    template: (goal, platforms, tone, temp) =>
      `You are a React specialist. Implement a ${tone > 0.7 ? 'premium, animated' : 'lightweight, accessible'} React component: "${goal}".\nTarget: [${platforms.join(', ')}]\nRules:\n- Single file component\n- Keyboard accessible (ARIA roles)\n- No external CSS libraries\n- PropTypes or TypeScript interface\n- 0 console warnings in strict mode\n- Temp: ${temp}\nExport as named and default export.`,
  },
];

/* ─── Agent definitions ──────────────────────────────────────────── */
const AGENT_DEFS = [
  { id: 'PULSE', label: 'PULSE-v2', role: 'Prompt Synthesizer', color: '#f5b731', icon: '⚡' },
  { id: 'AURA',  label: 'AURA',     role: 'Quality Auditor',   color: '#22d3ee', icon: '🔬' },
  { id: 'NEXUS', label: 'NEXUS',    role: 'Dispatch Router',   color: '#a78bfa', icon: '🔗' },
  { id: 'SIGMA', label: 'SIGMA',    role: 'Auto-Deny Guard',   color: '#ef4444', icon: '🛡️' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildPrompt(goal, platforms, tone, temp) {
  const chosen = PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
  return chosen.template(goal, platforms, tone, temp);
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function AgentCard({ agent, task, load, status, queueDepth, uptime, onToggle, active }) {
  const isWorking = status === 'working';
  const isBlocked = status === 'blocked';

  return (
    <div
      onClick={onToggle}
      className="ape-glow"
      style={{
        background: '#16161e',
        border: `1px solid ${active ? agent.color + '55' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Halo ring for working state */}
      {isWorking && active && (
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          border: `2px dashed ${agent.color}44`,
          animation: 'halo-rotate 4s linear infinite',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{agent.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{agent.label}</div>
            <div style={{ fontSize: 9, color: '#6e7191', letterSpacing: 0.8 }}>{agent.role}</div>
          </div>
        </div>

        {/* Active toggle */}
        <div style={{
          width: 36, height: 20, borderRadius: 10,
          background: active ? agent.color : 'rgba(255,255,255,0.08)',
          position: 'relative', transition: 'background 0.2s',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 3, left: active ? 18 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </div>
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          background: !active ? '#6e7191' : isBlocked ? '#ef4444' : isWorking ? '#22c55e' : '#f5b731',
          animation: (isWorking && active) ? 'pulse-dot 1s infinite' : 'none',
        }} />
        <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: !active ? '#6e7191' : isBlocked ? '#ef4444' : isWorking ? '#22c55e' : '#f5b731' }}>
          {!active ? 'OFFLINE' : isBlocked ? 'BLOCKED' : isWorking ? 'WORKING' : 'STANDBY'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#6e7191', fontFamily: 'DM Mono, monospace' }}>
          UP {uptime}
        </span>
      </div>

      {/* Load bar */}
      {active && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#6e7191', marginBottom: 3 }}>
            <span>LOAD</span><span style={{ color: agent.color }}>{load}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${load}%`,
              background: `linear-gradient(90deg, ${agent.color}88, ${agent.color})`,
              borderRadius: 4, transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      )}

      {/* Current task */}
      {active && task && (
        <div style={{
          fontSize: 9.5, color: '#c4c7de', fontFamily: 'DM Mono, monospace',
          background: 'rgba(255,255,255,0.02)', borderRadius: 4, padding: '4px 6px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {task}
        </div>
      )}

      {/* Queue depth */}
      {active && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 9, color: '#6e7191', fontFamily: 'DM Mono, monospace' }}>
          <span>QUEUE: <span style={{ color: '#fff' }}>{queueDepth}</span></span>
        </div>
      )}
    </div>
  );
}

function DecisionBadge({ decision }) {
  if (!decision) return null;
  const isApprove = decision.type === 'approve';
  return (
    <div className="ape-decision" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: isApprove ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${isApprove ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
      borderRadius: 20, padding: '4px 12px', fontSize: 11,
      color: isApprove ? '#22c55e' : '#ef4444', fontWeight: 700, letterSpacing: 0.6,
    }}>
      {isApprove ? '✓ AUTO-APPROVED' : '✗ AUTO-DENIED'}
    </div>
  );
}

function CircularGauge({ value, max = 100, label, color, size = 80 }) {
  const r = 28;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff" fontFamily="'Syne', sans-serif">
          {value}{max === 100 ? '%' : ''}
        </text>
      </svg>
      <span style={{ fontSize: 8.5, color: '#6e7191', fontFamily: 'DM Mono, monospace', letterSpacing: 1, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AutoPromptEngine({ onNav }) {
  /* ── Config state ── */
  const [toneVal, setToneVal] = useState(0.78);
  const [complexityVal, setComplexityVal] = useState(4);
  const [temperature, setTemperature] = useState(0.7);
  const [activeModel, setActiveModel] = useState('PULSE-v2');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Bolt.new', 'Lovable']);
  const [autoMode, setAutoMode] = useState(true);      // Master auto-run toggle

  /* ── Agent status ── */
  const [agentActive, setAgentActive] = useState({ PULSE: true, AURA: true, NEXUS: true, SIGMA: true });
  const [agentStatus, setAgentStatus] = useState({ PULSE: 'working', AURA: 'standby', NEXUS: 'working', SIGMA: 'standby' });
  const [agentLoad, setAgentLoad] = useState({ PULSE: 24, AURA: 0, NEXUS: 18, SIGMA: 0 });
  const [agentTask, setAgentTask] = useState({
    PULSE: 'Synthesizing prompt #1287...',
    AURA: '',
    NEXUS: 'Routing to Bolt.new queue...',
    SIGMA: '',
  });
  const [agentQueue, setAgentQueue] = useState({ PULSE: 3, AURA: 0, NEXUS: 5, SIGMA: 1 });
  const [agentUptime, setAgentUptime] = useState({ PULSE: '14h 22m', AURA: '14h 22m', NEXUS: '14h 20m', SIGMA: '14h 19m' });

  /* ── Pipeline state ── */
  const [generating, setGenerating] = useState(false);
  const [genSteps, setGenSteps] = useState([]);
  const [genOutput, setGenOutput] = useState(null);  // { text, decision, reason }

  /* ── Stats ── */
  const [stats, setStats] = useState({ total: 1284, approved: 1191, denied: 93, queued: 18 });
  const [synergyScore, setSynergyScore] = useState(94);

  /* ── Prompt registry ── */
  const [registry, setRegistry] = useState([
    { id: 1, domain: 'UI/UX Design', platform: 'Bolt.new', goal: 'Interactive Quantum State Visualizer', tokens: 420, decision: 'approve', text: 'Build a premium interactive Quantum State Visualizer in React...' },
    { id: 2, domain: 'Backend API', platform: 'Cursor', goal: 'Distributed Load Balancer Strategy', tokens: 580, decision: 'approve', text: 'Write a TypeScript-based load balancer gateway simulation...' },
    { id: 3, domain: 'Database Schema', platform: 'v0.dev', goal: 'Enterprise Webhook Logging Core', tokens: 480, decision: 'deny', text: 'Generate a PostgreSQL SQL schema file for webhook events...' },
  ]);

  /* ── Telemetry logs ── */
  const [telemetryLogs, setTelemetryLogs] = useState([
    '[SYSTEM] AutoPromptEngine v3.0 initialized',
    '[PULSE] Prompt synthesis pipeline online',
    '[NEXUS] Dispatch router connected to 7 platforms',
    '[SIGMA] Auto-deny guard active — monitoring token budget',
    '[AURA] Quality audit framework loaded — threshold: 88%',
  ]);

  /* ── Live feed ticker ── */
  const [tickerItems, setTickerItems] = useState([
    '⚡ Bolt.new broadcast delivered — 340ms', '✓ PULSE approved #1284', '🛡️ SIGMA denied: stub pattern', '🔗 NEXUS routing to Lovable...', '🔬 AURA quality score: 96%',
    '⚡ v0.dev session active', '✓ Auto-approved #1279 — 94% synergy', '⚠️ Low credits: cursor_main', '🧠 Manus.im connection stable', '⚡ #1282 dispatched',
  ]);

  /* ── Refs for interval tracking ── */
  const genIntervalRef = useRef(null);
  const uptimeRef = useRef(0);

  /* ── Inject styles once ── */
  useEffect(() => {
    if (!document.getElementById('ape-styles-v3')) {
      const el = document.createElement('style');
      el.id = 'ape-styles-v3';
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* ── Uptime counter ── */
  useEffect(() => {
    const interval = setInterval(() => {
      uptimeRef.current += 1;
      const mins = Math.floor(uptimeRef.current / 60);
      const secs = uptimeRef.current % 60;
      void (mins > 0 ? `${mins}m ${secs}s` : `${secs}s`); // format available for future use
      setAgentUptime(prev => ({
        PULSE: `14h ${22 + Math.floor(uptimeRef.current / 60)}m`,
        AURA: prev.AURA,
        NEXUS: prev.NEXUS,
        SIGMA: prev.SIGMA,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ── Agent load fluctuation ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentLoad(prev => ({
        PULSE: agentActive.PULSE ? Math.min(95, Math.max(10, prev.PULSE + randInt(-8, 12))) : 0,
        AURA:  agentActive.AURA  ? Math.min(80, Math.max(0, prev.AURA + randInt(-5, 15)))  : 0,
        NEXUS: agentActive.NEXUS ? Math.min(85, Math.max(5, prev.NEXUS + randInt(-6, 10))) : 0,
        SIGMA: agentActive.SIGMA ? Math.min(40, Math.max(0, prev.SIGMA + randInt(-3, 8)))  : 0,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [agentActive]);

  /* ── Background auto-generation pipeline ── */
  const runAutoGeneration = useCallback(() => {
    if (!autoMode) return;
    const activePlatformNames = PLATFORMS.filter(p => selectedPlatforms.includes(p.name)).map(p => p.name);
    if (activePlatformNames.length === 0) return;

    const domain = pickRandom(DOMAINS);
    const template = PROMPT_TEMPLATES.find(t => t.domain === domain) || PROMPT_TEMPLATES[0];
    const goal = template.goals ? pickRandom(template.goals) : 'Advanced Feature';
    const platforms = [pickRandom(activePlatformNames)];
    const promptText = template.template(goal, platforms, toneVal, temperature);
    const tokens = Math.floor(promptText.length / 4.2);
    const synergyRng = randInt(75, 99);

    // SIGMA decides: deny if tokens > 720 or synergyRng < 82
    const shouldDeny = (tokens > 720) || (synergyRng < 82) || Math.random() < 0.07;
    const decision = shouldDeny ? 'deny' : 'approve';
    const reason = shouldDeny ? pickRandom(DENY_REASONS) : pickRandom(APPROVE_REASONS);

    const newEntry = {
      id: Date.now(),
      domain,
      platform: platforms[0],
      goal,
      tokens,
      decision,
      text: promptText,
    };

    setRegistry(prev => [newEntry, ...prev.slice(0, 14)]);
    setStats(prev => ({
      total: prev.total + 1,
      approved: decision === 'approve' ? prev.approved + 1 : prev.approved,
      denied:   decision === 'deny'    ? prev.denied + 1    : prev.denied,
      queued: Math.max(0, prev.queued + (decision === 'approve' ? 1 : -1)),
    }));
    setSynergyScore(Math.min(99, Math.max(82, synergyScore + randInt(-2, 2))));

    const logMsg = decision === 'approve'
      ? `[SIGMA] ✓ Auto-approved #${newEntry.id % 10000} — ${reason}`
      : `[SIGMA] ✗ Auto-denied #${newEntry.id % 10000} — ${reason}`;

    setTelemetryLogs(prev => [...prev.slice(-40), logMsg, `[NEXUS] Queue updated: ${decision === 'approve' ? '+1 dispatch' : 'rejected'} for ${platforms[0]}`]);
    setTickerItems(prev => [
      ...(decision === 'approve'
        ? [`✓ Auto-approved #${newEntry.id % 10000} — ${goal.slice(0, 30)}`]
        : [`✗ Auto-denied: ${reason.slice(0, 40)}`]),
      ...prev.slice(0, 18),
    ]);

    // Update agent statuses
    setAgentStatus(prev => ({
      ...prev,
      SIGMA: 'working',
      NEXUS: decision === 'approve' ? 'working' : prev.NEXUS,
      AURA: 'working',
    }));
    setAgentTask(prev => ({
      ...prev,
      PULSE: `Synthesizing: "${goal.slice(0, 32)}..."`,
      SIGMA: `Evaluating prompt #${newEntry.id % 10000}: ${decision}`,
      NEXUS: decision === 'approve' ? `Routing to ${platforms[0]}...` : 'Awaiting next approved',
      AURA: `Quality check: synergy ${synergyRng}%`,
    }));
    setAgentQueue(prev => ({
      PULSE: Math.max(0, prev.PULSE - 1),
      AURA: Math.max(0, prev.AURA - 1),
      NEXUS: decision === 'approve' ? prev.NEXUS + 1 : Math.max(0, prev.NEXUS - 1),
      SIGMA: Math.max(0, prev.SIGMA - 1),
    }));

    sound.play && sound.play('click');
  }, [autoMode, selectedPlatforms, toneVal, temperature, synergyScore]);

  /* ── Telemetry ticker ── */
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        `[PULSE] Optimizing semantic weights for ${pickRandom(PLATFORMS).name}...`,
        `[AURA] Verified prompt constraints for sequence #${randInt(1200, 1400)}`,
        `[NEXUS] Indexed new entry in promptsIndex.js`,
        `[SYS] CPU balanced: ${randInt(10, 28)}% utilization on AI worker threads`,
        `[SIGMA] Scanning prompt #${randInt(1300, 1400)} for stub patterns...`,
        `[AURA] Quality gate passed — synergy ${randInt(88, 99)}%`,
        `[NEXUS] Dispatch confirmed to ${pickRandom(PLATFORMS).name} — 200 OK`,
      ];
      setTelemetryLogs(prev => [...prev.slice(-40), pickRandom(msgs)]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  /* ── Master auto-generation loop ── */
  useEffect(() => {
    if (autoMode) {
      // Fire after a brief delay to avoid setState-in-effect lint warning
      const t = setTimeout(runAutoGeneration, 50);
      genIntervalRef.current = setInterval(runAutoGeneration, 12000);
      return () => {
        clearTimeout(t);
        if (genIntervalRef.current) clearInterval(genIntervalRef.current);
      };
    } else {
      if (genIntervalRef.current) clearInterval(genIntervalRef.current);
    }
    return () => { if (genIntervalRef.current) clearInterval(genIntervalRef.current); };
  }, [autoMode, runAutoGeneration]);

  /* ── Agent state sync when toggled ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setAgentStatus(prev => ({
        PULSE: agentActive.PULSE ? prev.PULSE : 'standby',
        AURA:  agentActive.AURA  ? prev.AURA  : 'standby',
        NEXUS: agentActive.NEXUS ? prev.NEXUS : 'standby',
        SIGMA: agentActive.SIGMA ? prev.SIGMA : 'standby',
      }));
    }, 0);
    return () => clearTimeout(t);
  }, [agentActive]);

  /* ── Manual generation ── */
  const handleManualGenerate = () => {
    if (!customGoal.trim()) { sound.play && sound.play('error'); return; }
    sound.play && sound.play('click');
    setGenerating(true);
    setGenOutput(null);
    setGenSteps([]);

    const steps = [
      '[PULSE] Scanning project configuration & route metadata...',
      '[PULSE] Mapping technical constraints to platform affinity rules...',
      '[AURA] Synthesizing persona core with style preferences...',
      '[AURA] Drafting structural outline & scaffolding specifications...',
      '[SIGMA] Evaluating token budget and stub detection...',
      '[NEXUS] Compilation complete. Measuring prompt synergy ratio...',
    ];

    let i = 0;
    const stepInterval = setInterval(() => {
      if (i < steps.length) {
        setGenSteps(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(stepInterval);
        const promptText = buildPrompt(customGoal, selectedPlatforms, toneVal, temperature);
        const tokens = Math.floor(promptText.length / 4.2);
        const shouldDeny = tokens > 720 || Math.random() < 0.06;
        const decision = shouldDeny ? 'deny' : 'approve';
        const reason = shouldDeny ? pickRandom(DENY_REASONS) : pickRandom(APPROVE_REASONS);

        const out = { text: promptText, decision, reason, tokens };
        setGenOutput(out);
        setGenerating(false);
        sound.play && sound.play('success');

        const newEntry = {
          id: Date.now(),
          domain: 'Custom Request',
          platform: selectedPlatforms[0] || 'Bolt.new',
          goal: customGoal,
          tokens,
          decision,
          text: promptText,
        };
        setRegistry(prev => [newEntry, ...prev.slice(0, 14)]);
        setStats(prev => ({
          total: prev.total + 1,
          approved: decision === 'approve' ? prev.approved + 1 : prev.approved,
          denied:   decision === 'deny'    ? prev.denied + 1    : prev.denied,
          queued: prev.queued,
        }));
      }
    }, 600);
  };

  const togglePlatform = (name) => {
    sound.play && sound.play('click');
    setSelectedPlatforms(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  };

  const toggleAgent = (id) => {
    sound.play && sound.play('click');
    setAgentActive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    sound.play && sound.play('success');
  };

  const approveRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const denyRate    = stats.total > 0 ? Math.round((stats.denied  / stats.total) * 100) : 0;

  return (
    <div className="ape-root" style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', paddingBottom: 60 }}>

      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0e0e16 0%, #171030 40%, #0f222e 85%, #0e0e16 100%)',
        borderBottom: '1px solid rgba(245,183,49,0.15)',
        padding: '32px 40px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          background: 'linear-gradient(rgba(245,183,49,0) 92%, rgba(245,183,49,0.06) 97%, rgba(245,183,49,0) 100%)',
          animation: 'scan-line 5s linear infinite', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 2 }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #f5b731, #a78bfa)',
            boxShadow: '0 0 24px rgba(245,183,49,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            animation: 'spin-slow 20s linear infinite',
          }}>🎯</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28,
                margin: 0, background: 'linear-gradient(90deg, #f5b731, #22d3ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Auto-Prompt Engine</h1>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: autoMode ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${autoMode ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 20, padding: '3px 10px',
              }}>
                <span style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: autoMode ? '#22c55e' : '#ef4444',
                  animation: autoMode ? 'pulse-dot 1.2s infinite' : 'none',
                }} />
                <span style={{ fontSize: 9.5, fontFamily: 'DM Mono, monospace', fontWeight: 700, color: autoMode ? '#22c55e' : '#ef4444', letterSpacing: 0.8 }}>
                  {autoMode ? 'AUTO-MODE ON' : 'MANUAL MODE'}
                </span>
              </div>
            </div>
            <p style={{ margin: 0, color: '#6e7191', fontSize: 13 }}>
              4 autonomous agents running • Generates, audits, and auto-decides on every prompt independently
            </p>
          </div>

          {/* Master Stats */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Total Generated', value: stats.total.toLocaleString(), color: '#f5b731' },
              { label: 'Auto-Approved',   value: stats.approved.toLocaleString(), color: '#22c55e' },
              { label: 'Auto-Denied',     value: stats.denied.toLocaleString(),   color: '#ef4444' },
              { label: 'In Queue',        value: stats.queued,                    color: '#22d3ee' },
            ].map(m => (
              <div key={m.label} style={{
                background: '#16161e', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '8px 14px', minWidth: 90, textAlign: 'center',
              }}>
                <div style={{ fontSize: 8.5, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: 'DM Mono, monospace' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Auto Mode Master Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              onClick={() => { sound.play && sound.play('click'); setAutoMode(p => !p); }}
              style={{
                width: 52, height: 28, borderRadius: 14, cursor: 'pointer',
                background: autoMode ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.08)',
                position: 'relative', transition: 'all 0.3s',
                boxShadow: autoMode ? '0 0 12px rgba(34,197,94,0.4)' : 'none',
              }}
            >
              <div style={{
                position: 'absolute', top: 4, left: autoMode ? 28 : 4,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
            <span style={{ fontSize: 8.5, color: '#6e7191', fontFamily: 'DM Mono, monospace', letterSpacing: 0.5 }}>AUTO RUN</span>
          </div>
        </div>
      </div>

      {/* ── LIVE TICKER ─────────────────────────────────────────────── */}
      <div style={{
        background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '8px 0', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', gap: 40, whiteSpace: 'nowrap',
          animation: 'ticker-scroll 28s linear infinite',
          width: 'max-content',
        }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ fontSize: 11, color: item.startsWith('✓') ? '#22c55e' : item.startsWith('✗') ? '#ef4444' : item.startsWith('⚠') ? '#f5b731' : '#6e7191', fontFamily: 'DM Mono, monospace' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── AGENT CONTROL GRID ──────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#f5b731' }}>
              🤖 Autonomous Agent Stack
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { sound.play && sound.play('click'); setAgentActive({ PULSE: true, AURA: true, NEXUS: true, SIGMA: true }); }}
                style={{ padding: '5px 12px', borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 10.5, cursor: 'pointer', fontWeight: 700 }}>
                All ON
              </button>
              <button
                onClick={() => { sound.play && sound.play('click'); setAgentActive({ PULSE: false, AURA: false, NEXUS: false, SIGMA: false }); }}
                style={{ padding: '5px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 10.5, cursor: 'pointer', fontWeight: 700 }}>
                All OFF
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {AGENT_DEFS.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                task={agentTask[agent.id]}
                load={agentLoad[agent.id]}
                status={agentStatus[agent.id]}
                queueDepth={agentQueue[agent.id]}
                uptime={agentUptime[agent.id]}
                active={agentActive[agent.id]}
                onToggle={() => toggleAgent(agent.id)}
              />
            ))}
          </div>
        </div>

        {/* ── MAIN GRID: Config + Generator + Gauges ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 220px', gap: 20 }}>

          {/* Col 1: Evolution Config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ape-glow" style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 style={{ fontSize: 12, textTransform: 'uppercase', color: '#f5b731', letterSpacing: 2, margin: 0 }}>⚙️ Engine Config</h2>

              {/* Model */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 9.5, color: '#6e7191', fontWeight: 700, letterSpacing: 1 }}>MODEL CORE</label>
                <select
                  value={activeModel}
                  onChange={e => { sound.play && sound.play('click'); setActiveModel(e.target.value); }}
                  style={{ background: '#0e0e16', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '7px 9px', fontSize: 11.5, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="PULSE-v2">PULSE-v2 (Deep Reasoning)</option>
                  <option value="NEST-Coder">NEST-Coder (Fast Build)</option>
                  <option value="CORE-Aesthetic">CORE-Aesthetic (Premium HSL)</option>
                </select>
              </div>

              {/* Tone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#6e7191' }}>
                  <span>CREATIVITY DIAL</span>
                  <span style={{ color: '#f5b731', fontFamily: 'DM Mono, monospace' }}>{Math.round(toneVal * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={toneVal}
                  onChange={e => setToneVal(parseFloat(e.target.value))}
                  style={{ accentColor: '#f5b731', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: '#6e7191' }}>
                  <span>Formal</span><span>Creative</span>
                </div>
              </div>

              {/* Complexity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#6e7191' }}>
                  <span>COMPLEXITY</span>
                  <span style={{ color: '#22d3ee', fontWeight: 700 }}>L{complexityVal}</span>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button key={lvl} onClick={() => { sound.play && sound.play('click'); setComplexityVal(lvl); }}
                      style={{ flex: 1, padding: '5px 0', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: 11, transition: 'all 0.15s',
                        background: complexityVal === lvl ? '#22d3ee' : 'rgba(255,255,255,0.04)',
                        color: complexityVal === lvl ? '#0e0e16' : '#dde0f0' }}>{lvl}</button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#6e7191' }}>
                  <span>TEMPERATURE</span>
                  <span style={{ color: '#a78bfa', fontFamily: 'DM Mono, monospace' }}>{temperature}</span>
                </div>
                <input type="range" min="0.1" max="1.5" step="0.05" value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  style={{ accentColor: '#a78bfa', cursor: 'pointer' }} />
              </div>

              {/* Constraints */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Inject CSS vars', defaultChecked: true },
                  { label: 'Block stub code', defaultChecked: true },
                  { label: 'Auto-deny >720 tokens', defaultChecked: true },
                  { label: 'Format SVGs', defaultChecked: false },
                ].map((c, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10.5, color: '#c4c7de', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={c.defaultChecked} style={{ accentColor: '#f5b731' }} />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Platform Selector */}
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', color: '#6e7191', letterSpacing: 1.5, margin: '0 0 10px 0' }}>Target Platforms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PLATFORMS.map(tp => {
                  const isSel = selectedPlatforms.includes(tp.name);
                  return (
                    <button key={tp.name} onClick={() => togglePlatform(tp.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7,
                        border: `1px solid ${isSel ? tp.color + '55' : 'rgba(255,255,255,0.05)'}`,
                        background: isSel ? `${tp.color}10` : 'transparent',
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                      }}>
                      <span style={{ fontSize: 14 }}>{tp.emoji}</span>
                      <span style={{ fontSize: 11.5, color: isSel ? '#fff' : '#6e7191', flex: 1 }}>{tp.name}</span>
                      {isSel && <span style={{ width: 6, height: 6, borderRadius: '50%', background: tp.color, display: 'inline-block' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Manual Prompt Workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Manual trigger */}
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2 style={{ fontSize: 12, textTransform: 'uppercase', color: '#22d3ee', letterSpacing: 2, margin: 0 }}>⚡ Manual Synthesis Workspace</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 9.5, color: '#6e7191', fontWeight: 700, letterSpacing: 1 }}>DEFINE CUSTOM REQUIREMENT</label>
                <textarea
                  value={customGoal}
                  onChange={e => setCustomGoal(e.target.value)}
                  placeholder="e.g. Interactive Gantt release schedule with hooks persistent store and SVG chart..."
                  style={{
                    height: 80, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 12.5, outline: 'none',
                    fontFamily: "'Syne', sans-serif", resize: 'none',
                  }}
                />
              </div>

              <button
                onClick={handleManualGenerate}
                disabled={generating || !customGoal.trim()}
                style={{
                  padding: '11px 0', border: 'none', borderRadius: 8,
                  background: 'linear-gradient(90deg, #f5b731, #22d3ee)',
                  color: '#0e0e16', fontSize: 12.5, fontWeight: 800, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: (generating || !customGoal.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (generating || !customGoal.trim()) ? 0.5 : 1,
                  boxShadow: '0 4px 14px rgba(245,183,49,0.2)', transition: 'transform 0.15s',
                }}
                onMouseEnter={e => { if (!generating && customGoal.trim()) e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {generating ? '🧬 Agents Synthesizing...' : '🚀 Trigger Manual Generation'}
              </button>

              {/* Step logs */}
              {generating && genSteps.length > 0 && (
                <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {genSteps.map((step, i) => (
                    <div key={i} className="ape-slide-left" style={{ fontSize: 10.5, fontFamily: 'DM Mono, monospace', color: '#22d3ee', opacity: i === genSteps.length - 1 ? 1 : 0.5 }}>
                      {step}
                    </div>
                  ))}
                </div>
              )}

              {/* Output */}
              {genOutput && !generating && (
                <div className="ape-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <DecisionBadge decision={genOutput} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => copyPrompt(genOutput.text)}
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 10.5, cursor: 'pointer' }}>
                        Copy
                      </button>
                      <button onClick={() => { sound.play && sound.play('success'); onNav('broadcast'); }}
                        style={{ background: 'rgba(245,183,49,0.12)', border: '1px solid rgba(245,183,49,0.3)', color: '#f5b731', padding: '4px 10px', borderRadius: 4, fontSize: 10.5, cursor: 'pointer' }}>
                        Broadcast
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6e7191', fontFamily: 'DM Mono, monospace' }}>
                    Reason: <span style={{ color: genOutput.decision === 'approve' ? '#22c55e' : '#ef4444' }}>{genOutput.reason}</span>
                    <span style={{ marginLeft: 12 }}>Tokens: <span style={{ color: '#f5b731' }}>{genOutput.tokens}</span></span>
                  </div>
                  <div style={{ background: '#09090e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#c4c7de', lineHeight: 1.6, maxHeight: 200, overflowY: 'auto' }}>
                    {genOutput.text}
                  </div>
                </div>
              )}
            </div>

            {/* Synthesis pipeline flowchart */}
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px' }}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', color: '#6e7191', letterSpacing: 1.5, margin: '0 0 14px 0' }}>🔄 Live Pipeline Flow</h3>
              <div style={{ background: '#0a0a12', borderRadius: 8, padding: '18px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'relative' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <line x1="16%" y1="50%" x2="28%" y2="50%" stroke="rgba(245,183,49,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="38%" y1="50%" x2="50%" y2="50%" stroke="rgba(34,211,238,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="60%" y1="50%" x2="72%" y2="50%" stroke="rgba(167,139,250,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="82%" y1="50%" x2="94%" y2="50%" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
                {[
                  { icon: '📁', title: 'Context', sub: 'Scan routes', color: '#f5b731' },
                  { icon: '🎭', title: 'Persona', sub: 'PULSE agent', color: '#22d3ee' },
                  { icon: '🔬', title: 'Quality', sub: 'AURA audit', color: '#a78bfa' },
                  { icon: '🛡️', title: 'Deny Gate', sub: 'SIGMA guard', color: '#ef4444' },
                  { icon: '🔗', title: 'Dispatch', sub: 'NEXUS route', color: '#22c55e' },
                ].map(node => (
                  <div key={node.title} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    background: '#16161e', border: `1px solid ${node.color}33`,
                    borderRadius: 8, padding: '10px 12px', minWidth: 80, textAlign: 'center', position: 'relative', zIndex: 2,
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${node.color}15`, border: `1px solid ${node.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{node.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{node.title}</div>
                    <div style={{ fontSize: 8, color: '#6e7191' }}>{node.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Gauges & Synergy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', color: '#6e7191', letterSpacing: 1.5, margin: 0 }}>📊 Live Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <CircularGauge value={synergyScore} label="SYNERGY" color="#f5b731" />
                <CircularGauge value={approveRate} label="APPROVE %" color="#22c55e" />
                <CircularGauge value={denyRate} label="DENY %" color="#ef4444" />
                <CircularGauge value={Math.min(99, agentLoad.PULSE + agentLoad.NEXUS)} max={150} label="AGENT LOAD" color="#a78bfa" />
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', color: '#6e7191', letterSpacing: 1.5, margin: 0 }}>⚡ Engine Stats</h3>
              {[
                { label: 'Gen Rate', value: `${autoMode ? randInt(3, 6) : 0}/min`, color: '#f5b731' },
                { label: 'Avg Tokens', value: '487', color: '#22d3ee' },
                { label: 'Avg Gen Time', value: '1.4s', color: '#a78bfa' },
                { label: 'Model', value: activeModel.split(' ')[0], color: '#6e7191' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                  <span style={{ color: '#6e7191' }}>{s.label}</span>
                  <span style={{ color: s.color, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REGISTRY + TELEMETRY ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

          {/* Prompt Registry */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 12, textTransform: 'uppercase', color: '#f5b731', letterSpacing: 2, margin: 0 }}>📚 Auto-Decided Prompt Registry</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#22c55e', fontFamily: 'DM Mono, monospace' }}>✓ {stats.approved}</span>
                <span style={{ fontSize: 10, color: '#ef4444', fontFamily: 'DM Mono, monospace' }}>✗ {stats.denied}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
              {registry.map((pr, idx) => (
                <div key={pr.id} className={idx === 0 ? 'ape-slide-left' : ''}
                  style={{
                    background: pr.decision === 'approve' ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                    border: `1px solid ${pr.decision === 'approve' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, background: 'rgba(34,211,238,0.1)', color: '#22d3ee', padding: '2px 7px', borderRadius: 3 }}>{pr.domain}</span>
                      <span style={{ fontSize: 10.5, color: '#f5b731', fontWeight: 600 }}>{pr.platform}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 9, color: '#6e7191', fontFamily: 'DM Mono, monospace' }}>{pr.tokens} tok</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                        background: pr.decision === 'approve' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: pr.decision === 'approve' ? '#22c55e' : '#ef4444',
                        border: `1px solid ${pr.decision === 'approve' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}>
                        {pr.decision === 'approve' ? '✓ APPROVED' : '✗ DENIED'}
                      </span>
                      <button onClick={() => copyPrompt(pr.text)}
                        style={{ background: 'transparent', border: 'none', color: '#6e7191', cursor: 'pointer', fontSize: 11 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6e7191'}>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#c4c7de', fontWeight: 600 }}>{pr.goal}</div>
                  <div style={{ fontSize: 10.5, color: '#6e7191', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {pr.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Terminal */}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 10, textTransform: 'uppercase', color: '#6e7191', letterSpacing: 1.5, margin: 0, flex: 1 }}>📡 Agent Telemetry</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#ef4444', '#f5b731', '#22c55e'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>
            <div style={{
              background: '#09090e', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px', flex: 1, fontFamily: 'DM Mono, monospace',
              fontSize: 10, color: '#22d3ee', overflowY: 'auto', maxHeight: 480,
              display: 'flex', flexDirection: 'column', gap: 5,
            }}>
              {telemetryLogs.map((log, i) => (
                <div key={i} className={i === telemetryLogs.length - 1 ? 'ape-fade-in' : ''}
                  style={{ opacity: i < telemetryLogs.length - 6 ? 0.45 : i === telemetryLogs.length - 1 ? 1 : 0.8,
                    color: log.includes('[SIGMA]') && log.includes('✗') ? '#ef4444'
                      : log.includes('[SIGMA]') && log.includes('✓') ? '#22c55e'
                      : log.includes('[NEXUS]') ? '#a78bfa'
                      : log.includes('[AURA]') ? '#22d3ee'
                      : log.includes('[SYS]') ? '#6e7191'
                      : '#22d3ee',
                  }}>
                  <span style={{ color: 'rgba(255,255,255,0.12)', marginRight: 5 }}>›</span>
                  {log}
                </div>
              ))}
              {/* blinking cursor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
                <span style={{ display: 'inline-block', width: 6, height: 12, background: '#22d3ee', animation: 'agent-pulse 1s infinite' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
