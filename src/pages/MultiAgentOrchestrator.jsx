import { useState, useEffect, useRef, useMemo } from 'react';
import { sound } from '../lib/soundEngine';

// ─── CSS VARIABLES ────────────────────────────────────────────────────────────
const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  orange: '#f97316',
};

// ─── STATIC DATA (no Math.random() in render) ────────────────────────────────
const AGENT_DEFINITIONS = [
  { id: 1, name: 'ResearchBot',      emoji: '🔍', platform: 'Gemini',       color: V.teal,   status: 'Running', task: 'Fetching market data',         tasksToday: 142, success: 98.6, latency: '0.9s', cpu: 72, mem: 512,  quota: 68 },
  { id: 2, name: 'CodeGen',          emoji: '💻', platform: 'Claude',       color: V.purple, status: 'Running', task: 'Generating API handlers',      tasksToday: 87,  success: 96.2, latency: '1.4s', cpu: 85, mem: 768,  quota: 82 },
  { id: 3, name: 'DataMiner',        emoji: '⛏️',  platform: 'Antigravity',  color: V.gold,   status: 'Running', task: 'Scraping competitor prices',   tasksToday: 203, success: 97.8, latency: '0.7s', cpu: 60, mem: 384,  quota: 55 },
  { id: 4, name: 'ContentWriter',    emoji: '✍️',  platform: 'ChatGPT',     color: V.green,  status: 'Running', task: 'Drafting blog post #34',       tasksToday: 56,  success: 99.1, latency: '1.1s', cpu: 40, mem: 256,  quota: 38 },
  { id: 5, name: 'SecurityAudit',    emoji: '🛡️',  platform: 'Claude',       color: V.red,    status: 'Idle',    task: 'Awaiting scan request',        tasksToday: 12,  success: 100,  latency: '2.1s', cpu: 10, mem: 128,  quota: 12 },
  { id: 6, name: 'PromptOptimizer',  emoji: '⚡',  platform: 'Gemini',       color: V.teal,   status: 'Running', task: 'A/B testing prompt variants',  tasksToday: 321, success: 94.7, latency: '0.5s', cpu: 55, mem: 320,  quota: 60 },
  { id: 7, name: 'CreditWatcher',    emoji: '💳',  platform: 'Antigravity',  color: V.gold,   status: 'Running', task: 'Monitoring API credit pools',  tasksToday: 1024,success: 99.9, latency: '0.3s', cpu: 30, mem: 192,  quota: 25 },
  { id: 8, name: 'BroadcastBot',     emoji: '📡',  platform: 'Bolt',         color: V.purple, status: 'Idle',    task: 'Idle — next broadcast 14:00',  tasksToday: 18,  success: 97.2, latency: '0.8s', cpu: 5,  mem: 64,   quota: 8  },
  { id: 9, name: 'WorkflowMaster',   emoji: '🔄',  platform: 'Manus',        color: V.blue,   status: 'Running', task: 'Orchestrating pipeline #7',    tasksToday: 445, success: 95.5, latency: '1.6s', cpu: 78, mem: 640,  quota: 74 },
  { id: 10,name: 'AnalyticsBot',     emoji: '📊',  platform: 'Replit',       color: V.teal,   status: 'Running', task: 'Building weekly report',       tasksToday: 67,  success: 98.1, latency: '1.0s', cpu: 62, mem: 448,  quota: 58 },
  { id: 11,name: 'ScraperBot',       emoji: '🕷️',  platform: 'Lovable',      color: V.orange, status: 'Error',   task: 'Rate limited — retrying',      tasksToday: 89,  success: 82.3, latency: '3.2s', cpu: 20, mem: 160,  quota: 95 },
  { id: 12,name: 'DeployBot',        emoji: '🚀',  platform: 'Bolt',         color: V.green,  status: 'Idle',    task: 'Awaiting build artifact',      tasksToday: 9,   success: 100,  latency: '4.5s', cpu: 8,  mem: 96,   quota: 10 },
  { id: 13,name: 'TestBot',          emoji: '🧪',  platform: 'Replit',       color: V.purple, status: 'Running', task: 'Running integration suite',    tasksToday: 334, success: 93.4, latency: '2.8s', cpu: 90, mem: 896,  quota: 88 },
  { id: 14,name: 'MonitorBot',       emoji: '👁️',  platform: 'Antigravity',  color: V.teal,   status: 'Running', task: 'Watching 47 endpoints',        tasksToday: 2048,success: 99.7, latency: '0.2s', cpu: 25, mem: 208,  quota: 22 },
  { id: 15,name: 'ReportBot',        emoji: '📋',  platform: 'Claude',       color: V.gold,   status: 'Idle',    task: 'Awaiting data from DataMiner', tasksToday: 31,  success: 98.9, latency: '1.7s', cpu: 12, mem: 144,  quota: 15 },
];

const PIPELINES_DEF = [
  { id: 'content',  name: 'Content Factory',  color: V.teal,   stages: ['ResearchBot','ContentWriter','PromptOptimizer','BroadcastBot'], lastRun: '2h ago',  rate: '98.2%' },
  { id: 'security', name: 'Security Sweep',   color: V.red,    stages: ['SecurityAudit','DataMiner','ReportBot'],                        lastRun: '6h ago',  rate: '100%'  },
  { id: 'deploy',   name: 'Full Deploy',      color: V.green,  stages: ['CodeGen','TestBot','DeployBot','MonitorBot'],                   lastRun: '1d ago',  rate: '95.6%' },
  { id: 'credit',   name: 'Credit Relay',     color: V.gold,   stages: ['CreditWatcher','BroadcastBot','AnalyticsBot'],                  lastRun: '30m ago', rate: '99.9%' },
];

const VOTES_DEF = [
  { id: 1, question: 'Should we prioritize API integrations?',   yes: 11, no: 2,  total: 15, deadline: '2h 14m', resolved: false, outcome: null },
  { id: 2, question: 'Increase broadcast frequency to 15min?',   yes: 7,  no: 6,  total: 15, deadline: '45m',    resolved: false, outcome: null },
  { id: 3, question: 'Switch primary model to GPT-4 Turbo?',     yes: 5,  no: 8,  total: 15, deadline: 'Closed', resolved: true,  outcome: 'Rejected — 5/13' },
];

const COMM_MSGS_INIT = [
  { id: 1,  from: 'ResearchBot',    to: 'ContentWriter',   type: 'DATA',    content: 'Sending market analysis Q2 dataset (4.2MB)',       ts: '05:49:51' },
  { id: 2,  from: 'CodeGen',        to: 'TestBot',         type: 'TASK',    content: 'New API handler ready for integration tests',       ts: '05:49:44' },
  { id: 3,  from: 'CreditWatcher',  to: 'BroadcastBot',    type: 'ALERT',   content: 'Anthropic credit pool below 20% threshold',        ts: '05:49:38' },
  { id: 4,  from: 'MonitorBot',     to: 'WorkflowMaster',  type: 'STATUS',  content: 'All 47 endpoints nominal. Avg latency 142ms',      ts: '05:49:30' },
  { id: 5,  from: 'ScraperBot',     to: 'WorkflowMaster',  type: 'ERROR',   content: 'Rate limit hit on target. Backing off 60s',        ts: '05:49:22' },
  { id: 6,  from: 'AnalyticsBot',   to: 'ReportBot',       type: 'DATA',    content: 'Weekly metrics compiled — 2,847 tasks processed',  ts: '05:49:15' },
];

const LOG_LINES_INIT = [
  { id: 1,  level: 'info',    agent: 'MonitorBot',      msg: 'Heartbeat OK — all systems nominal',               ts: '05:49:55' },
  { id: 2,  level: 'success', agent: 'CodeGen',         msg: 'Generated 348 lines for /api/agents/deploy',      ts: '05:49:52' },
  { id: 3,  level: 'info',    agent: 'CreditWatcher',   msg: 'Gemini pool: 82% remaining (41,000 tokens)',       ts: '05:49:49' },
  { id: 4,  level: 'error',   agent: 'ScraperBot',      msg: '429 Too Many Requests — entering backoff mode',    ts: '05:49:46' },
  { id: 5,  level: 'success', agent: 'ResearchBot',     msg: 'Fetched 1,204 records from market data API',       ts: '05:49:43' },
  { id: 6,  level: 'info',    agent: 'WorkflowMaster',  msg: 'Pipeline #7 stage 2/4 in progress',               ts: '05:49:40' },
  { id: 7,  level: 'success', agent: 'TestBot',         msg: '218/220 tests passed — 2 warnings',               ts: '05:49:37' },
  { id: 8,  level: 'info',    agent: 'PromptOptimizer', msg: 'Variant B outperforms A by 12.4% CTR',            ts: '05:49:34' },
];

const LEADERBOARD_DEF = [
  { rank: 1, name: 'MonitorBot',      tasks: 2048, rate: 99.7, speed: '0.2s', trend: [80,85,90,88,95,99,100] },
  { rank: 2, name: 'CreditWatcher',   tasks: 1024, rate: 99.9, speed: '0.3s', trend: [70,78,82,88,92,98,100] },
  { rank: 3, name: 'WorkflowMaster',  tasks: 445,  rate: 95.5, speed: '1.6s', trend: [60,65,70,75,80,88,95]  },
  { rank: 4, name: 'PromptOptimizer', tasks: 321,  rate: 94.7, speed: '0.5s', trend: [50,58,65,70,78,85,92]  },
  { rank: 5, name: 'TestBot',         tasks: 334,  rate: 93.4, speed: '2.8s', trend: [45,52,60,68,75,82,88]  },
];

const LOG_POOL = [
  { level: 'success', agent: 'CodeGen',         msg: 'Completed function scaffold for auth module' },
  { level: 'info',    agent: 'DataMiner',        msg: 'Processing batch 14/20 — 2,340 rows ingested' },
  { level: 'success', agent: 'ContentWriter',    msg: 'Blog post #34 finalized — 1,842 words' },
  { level: 'info',    agent: 'PromptOptimizer',  msg: 'New variant deployed to 10% traffic split' },
  { level: 'error',   agent: 'ScraperBot',       msg: 'Retry attempt 3/5 — connection timeout' },
  { level: 'success', agent: 'TestBot',          msg: 'E2E suite completed in 4m 12s — all green' },
  { level: 'info',    agent: 'MonitorBot',       msg: 'Memory usage spike on node-7 — 88% utilized' },
  { level: 'success', agent: 'DeployBot',        msg: 'Artifact v2.4.1 staged to production mirror' },
  { level: 'info',    agent: 'AnalyticsBot',     msg: 'Trend detected: 23% uptick in API errors' },
  { level: 'success', agent: 'ReportBot',        msg: 'Executive summary delivered to Slack channel' },
  { level: 'info',    agent: 'CreditWatcher',    msg: 'Claude credits replenished — pool at 95%' },
  { level: 'success', agent: 'BroadcastBot',     msg: 'Notification dispatched to 1,204 subscribers' },
  { level: 'error',   agent: 'WorkflowMaster',   msg: 'Dependency loop detected in pipeline #9' },
  { level: 'info',    agent: 'SecurityAudit',    msg: 'Scanning 342 endpoints for OWASP Top-10' },
  { level: 'success', agent: 'ResearchBot',      msg: 'Knowledge graph updated — 89 new nodes' },
];

const COMM_POOL = [
  { from: 'TestBot',         to: 'DeployBot',       type: 'READY',   content: 'All tests passed — safe to promote artifact'      },
  { from: 'DataMiner',       to: 'AnalyticsBot',    type: 'DATA',    content: 'Sending cleaned dataset (12,440 rows)'             },
  { from: 'WorkflowMaster',  to: 'CodeGen',         type: 'TASK',    content: 'Next task: refactor authentication service'        },
  { from: 'MonitorBot',      to: 'WorkflowMaster',  type: 'ALERT',   content: 'CPU spike on CodeGen — throttling recommended'    },
  { from: 'BroadcastBot',    to: 'CreditWatcher',   type: 'STATUS',  content: 'Broadcast sent — 1,204 recipients confirmed'      },
  { from: 'ReportBot',       to: 'AnalyticsBot',    type: 'REQUEST', content: 'Need last 7-day conversion funnel data'            },
  { from: 'SecurityAudit',   to: 'ReportBot',       type: 'DATA',    content: '3 medium-severity findings — report attached'     },
  { from: 'PromptOptimizer', to: 'ContentWriter',   type: 'CONFIG',  content: 'Updated system prompt — use new tone guidelines'  },
];

const TASK_QUEUE_INIT = [
  { id: 't1', desc: 'Generate product descriptions for Q3 catalog', agents: ['ContentWriter','PromptOptimizer'], priority: 'High',     status: 'Running',   progress: 62 },
  { id: 't2', desc: 'Full security audit of payment endpoints',      agents: ['SecurityAudit','ReportBot'],      priority: 'Critical', status: 'Pending',   progress: 0  },
  { id: 't3', desc: 'Scrape competitor pricing — 50 SKUs',          agents: ['ScraperBot','DataMiner'],         priority: 'Normal',   status: 'Pending',   progress: 0  },
  { id: 't4', desc: 'Deploy hotfix v2.4.2 to production',           agents: ['TestBot','DeployBot','MonitorBot'],priority: 'Critical', status: 'Completed', progress: 100},
  { id: 't5', desc: 'Generate weekly analytics digest',             agents: ['AnalyticsBot','ReportBot'],       priority: 'Low',      status: 'Completed', progress: 100},
];

// ─── TINY HELPERS ─────────────────────────────────────────────────────────────
const statusColor = (s) => ({ Running: V.green, Idle: V.muted, Error: V.red }[s] || V.muted);
const priorityColor = (p) => ({ Low: V.muted, Normal: V.teal, High: V.gold, Critical: V.red }[p] || V.muted);
const taskStatusColor = (s) => ({ Running: V.teal, Pending: V.gold, Completed: V.green }[s] || V.muted);
const levelColor = (l) => ({ success: V.green, info: V.teal, error: V.red }[l] || V.muted);
const msgTypeColor = (t) => ({ DATA: V.teal, TASK: V.purple, ALERT: V.red, STATUS: V.green, READY: V.green, REQUEST: V.gold, CONFIG: V.orange, ERROR: V.red }[t] || V.muted);
const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
};

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 80, height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── ARC GAUGE ────────────────────────────────────────────────────────────────
function ArcGauge({ value, max, color, label, size = 120 }) {
  const r = size / 2 - 12;
  const circ = Math.PI * r;
  const pct = value / max;
  const dash = pct * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size / 2 + 14}>
        <path
          d={`M 12 ${size / 2} A ${r} ${r} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none" stroke={V.border} strokeWidth="8" strokeLinecap="round"
        />
        <path
          d={`M 12 ${size / 2} A ${r} ${r} 0 0 1 ${size - 12} ${size / 2}`}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="DM Mono, monospace">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <span style={{ color: V.muted, fontSize: 11 }}>{label}</span>
    </div>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ title, icon, children, style }) {
  return (
    <div style={{
      background: V.surface2,
      border: `1px solid ${V.border}`,
      borderRadius: 16,
      padding: '24px 28px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', letterSpacing: '0.02em' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── SVG NETWORK MAP ─────────────────────────────────────────────────────────
function AgentSwarmMap({ agents, selectedId, onSelect }) {
  const cx = 260, cy = 230, r = 175;
  const agentPositions = useMemo(() => agents.map((a, i) => {
    const angle = (i / agents.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }), [agents]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width="520" height="460" style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <style>{`
            @keyframes flowDot { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
            @keyframes nodePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
          `}</style>
          <radialGradient id="masterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={V.gold} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c98a00" stopOpacity="1" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {agentPositions.map((pos, i) => {
          const a = agents[i];
          const isSelected = a.id === selectedId;
          return (
            <g key={`line-${a.id}`}>
              <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                stroke={isSelected ? a.color : 'rgba(255,255,255,0.08)'}
                strokeWidth={isSelected ? 1.5 : 1}
              />
              {a.status === 'Running' && (
                <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                  stroke={a.color} strokeWidth="2" strokeOpacity="0.6"
                  strokeDasharray="5 15"
                  style={{ animation: `flowDot ${1 + (i % 3) * 0.4}s linear infinite` }}
                />
              )}
            </g>
          );
        })}

        {/* Master node */}
        <circle cx={cx} cy={cy} r={36} fill="url(#masterGrad)" filter="url(#glow)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#000" fontSize="10" fontWeight="900" fontFamily="Syne, sans-serif">MASTER</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(0,0,0,0.6)" fontSize="8">ORCHESTRATOR</text>

        {/* Agent nodes */}
        {agentPositions.map((pos, i) => {
          const a = agents[i];
          const isSelected = a.id === selectedId;
          const isRunning = a.status === 'Running';
          return (
            <g key={`node-${a.id}`} style={{ cursor: 'pointer' }} onClick={() => onSelect(a)}>
              {isRunning && (
                <circle cx={pos.x} cy={pos.y} r={20} fill="none"
                  stroke={a.color} strokeWidth="1"
                  style={{ animation: 'nodePulse 2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
                />
              )}
              <circle cx={pos.x} cy={pos.y} r={16}
                fill={isSelected ? a.color : V.surface3}
                stroke={a.color}
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter={isSelected ? 'url(#glow)' : undefined}
              />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="11">{a.emoji}</text>
              <text x={pos.x} y={pos.y + 29} textAnchor="middle" fill={isSelected ? '#fff' : V.muted}
                fontSize="7.5" fontFamily="DM Mono, monospace">
                {a.name.replace('Bot','').replace('Master','').replace('Watcher','Wtch').replace('Writer','Wrtr').replace('Optimizer','Opt')}
              </text>
              {a.status === 'Error' && (
                <text x={pos.x + 11} y={pos.y - 11} fontSize="9" textAnchor="middle">🔴</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── AGENT DETAIL PANEL ───────────────────────────────────────────────────────
function AgentDetailPanel({ agent, onClose }) {
  if (!agent) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: V.muted, fontSize: 13, flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 32 }}>🔵</span>
      <span>Click an agent node to inspect</span>
    </div>
  );
  return (
    <div style={{ flex: 1, background: V.surface3, borderRadius: 12, padding: 20, border: `1px solid ${agent.color}33` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 28 }}>{agent.emoji}</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginTop: 4 }}>{agent.name}</div>
          <div style={{ color: V.muted, fontSize: 11, marginTop: 2 }}>{agent.platform}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: V.muted, cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        <span style={{ background: `${statusColor(agent.status)}22`, color: statusColor(agent.status), borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{agent.status}</span>
        <span style={{ background: `${agent.color}22`, color: agent.color, borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>Latency: {agent.latency}</span>
      </div>
      <div style={{ marginTop: 14, color: V.muted, fontSize: 11 }}>CURRENT TASK</div>
      <div style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>{agent.task}</div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[['Tasks Today', agent.tasksToday], ['Success Rate', `${agent.success}%`]].map(([k, v]) => (
          <div key={k} style={{ background: V.surface2, borderRadius: 8, padding: 10 }}>
            <div style={{ color: V.muted, fontSize: 10 }}>{k}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        {[['CPU', agent.cpu], ['Memory', agent.mem, 1024, 'MB'], ['API Quota', agent.quota]].map(([lbl, val, maxV, unit]) => (
          <div key={lbl} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: V.muted, marginBottom: 3 }}>
              <span>{lbl}</span><span style={{ color: '#fff' }}>{val}{unit || '%'}</span>
            </div>
            <div style={{ height: 4, background: V.surface, borderRadius: 9 }}>
              <div style={{ height: '100%', width: `${maxV ? (val / maxV) * 100 : val}%`, background: agent.color, borderRadius: 9, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        {['Restart', 'Stop'].map(a => (
          <button key={a} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${V.border}`, background: V.surface2, color: a === 'Stop' ? V.red : V.teal, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{a}</button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MultiAgentOrchestrator() {
  const [agents] = useState(() => AGENT_DEFINITIONS);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [logs, setLogs] = useState(LOG_LINES_INIT);
  const [logsPaused, setLogsPaused] = useState(false);
  const [logFilter, setLogFilter] = useState('All');
  const [logAgentFilter, setLogAgentFilter] = useState('All');
  const logsRef = useRef(null);
  const logCounter = useRef(LOG_LINES_INIT.length + 1);

  const [taskDesc, setTaskDesc] = useState('');
  const [taskAgents, setTaskAgents] = useState([]);
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskQueue, setTaskQueue] = useState(TASK_QUEUE_INIT);
  const [dispatching, setDispatching] = useState(false);

  const [pipelines] = useState(PIPELINES_DEF);
  const [runningPipeline, setRunningPipeline] = useState(null);
  const [pipelineStage, setPipelineStage] = useState(0);

  const [votes, setVotes] = useState(VOTES_DEF);
  const [commFeed, setCommFeed] = useState(COMM_MSGS_INIT);
  const commCounter = useRef(COMM_MSGS_INIT.length + 1);

  const [resources, setResources] = useState(() => agents.map(a => ({ id: a.id, name: a.name, cpu: a.cpu, mem: a.mem, quota: a.quota })));
  const [rebalancing, setRebalancing] = useState(false);
  const [leaderboard] = useState(LEADERBOARD_DEF);
  const [lbRange, setLbRange] = useState('Week');

  const platforms = useMemo(() => ['All', ...Array.from(new Set(agents.map(a => a.platform)))], [agents]);

  // ── 12-AGENT PROJECT SPLITTER STATES ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('swarm');
  const [projectPlan, setProjectPlan] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitterProgress, setSplitterProgress] = useState(0);
  const [splitterLogs, setSplitterLogs] = useState([]);
  const [workPackages, setWorkPackages] = useState([]);
  const [dispatchLogs, setDispatchLogs] = useState([]);
  const [isDispatchingAll, setIsDispatchingAll] = useState(false);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assembleProgress, setAssembleProgress] = useState(0);
  const [assembleLogs, setAssembleLogs] = useState([]);
  const [assemblyComplete, setAssemblyComplete] = useState(false);

  // ── Splitter logic ──
  const handleSplitProject = () => {
    if (!projectPlan.trim()) return;
    sound.play('click');
    setIsSplitting(true);
    setSplitterProgress(0);
    setSplitterLogs([`[Orchestrator] Ingested plan: "${projectPlan}"`, '[Orchestrator] Starting software architecture analysis...']);
    setWorkPackages([]);
    setAssemblyComplete(false);
    setAssembleLogs([]);

    const steps = [
      'Decompiling monolithic system design into 12 decoupled microservice layers...',
      'Mapping functional components to active developer agent contexts...',
      'Validating platform constraints & credentials keys for targets...',
      'Generation complete! 12 autonomous work package prompts configured.'
    ];

    let step = 0;
    const t = setInterval(() => {
      step++;
      setSplitterProgress(step * 25);
      if (step <= steps.length) {
        setSplitterLogs(prev => [...prev, `[Splitter] ${steps[step - 1]}`]);
        sound.play('hover');
      }
      if (step >= 4) {
        clearInterval(t);
        sound.play('success');

        const planStr = projectPlan;
        const packages = [
          { id: 1,  title: 'Landing Page & Visual Grids',   agent: 'ContentWriter', emoji: '✍️',  platform: 'Lovable',  status: 'Ready', progress: 0,  prompt: `Design and compile a high-converting, premium landing page for: "${planStr}". Features include a glassmorphic hero section, custom grid widgets, sliding testimonial cards, sound triggers, and visual HSL status indicators.` },
          { id: 2,  title: 'Authentication & Session Guards',agent: 'SecurityAudit', emoji: '🛡️',  platform: 'Claude',   status: 'Ready', progress: 0,  prompt: `Build a secure, stateless authentication middleware for: "${planStr}". Implement JWT session cookies, password hashing (bcrypt), login/signup frontend modal widgets, and role-based route access controls.` },
          { id: 3,  title: 'Database Schema & Relational Seeds',agent: 'DataMiner',  emoji: '⛏️',  platform: 'Replit',   status: 'Ready', progress: 0,  prompt: `Construct the complete database schema layout for: "${planStr}". Use PostgreSQL structures via Prisma/Drizzle ORM. Write mock database seeds containing 150+ rows of relational user/billing entries.` },
          { id: 4,  title: 'Core Express.js Router APIs',    agent: 'CodeGen',       emoji: '💻',  platform: 'Claude',   status: 'Ready', progress: 0,  prompt: `Implement Express.js API routers for: "${planStr}". Set up endpoints for CRUD resources, JSON input sanitization filters, request logging middlewares, and error handlers.` },
          { id: 5,  title: 'Stripe Billing & Subscriptions', agent: 'CreditWatcher', emoji: '💳',  platform: 'Bolt',     status: 'Ready', progress: 0,  prompt: `Design a checkout billing portal simulation for: "${planStr}". Configure Stripe checkout sessions, state updates local storage callbacks, and webhook receivers tracking user plan subscriptions.` },
          { id: 6,  title: 'Glassmorphic Telemetry KPIs',   agent: 'AnalyticsBot',  emoji: '📊',  platform: 'Lovable',  status: 'Ready', progress: 0,  prompt: `Build an analytics command cockpit dashboard for: "${planStr}". Create custom SVG progress rings, a 7-day conversion line chart, and tabular listing layouts with CSV exporters.` },
          { id: 7,  title: 'Workflow Orchestrator Layer',   agent: 'WorkflowMaster',emoji: '🔄',  platform: 'Manus',    status: 'Ready', progress: 0,  prompt: `Write the business workflow logic controller for: "${planStr}". Connect data transformers, handle job dispatch status queues, and bind web audio chimes to state updates.` },
          { id: 8,  title: 'Theme Settings Customizer',     agent: 'PromptOptimizer',emoji: '⚡',  platform: 'Gemini',   status: 'Ready', progress: 0,  prompt: `Build a settings configuration hub for: "${planStr}". Implement a CSS variable custom palette chooser, username profile field validations, and daily quota target sliders.` },
          { id: 9,  title: 'API Playground Sandbox Panel',   agent: 'ResearchBot',   emoji: '🔍',  platform: 'Gemini',   status: 'Ready', progress: 0,  prompt: `Create a Swagger-like interactive sandbox console for: "${planStr}". Let developers select API paths, enter request parameters, execute mock pings, and view response JSON headers.` },
          { id: 10, title: 'Vitest Unit & E2E Test Suites',   agent: 'TestBot',       emoji: '🧪',  platform: 'Replit',   status: 'Ready', progress: 0,  prompt: `Write a Vitest test package targeting: "${planStr}". Code 20+ assertions validating user signups, auth tokens expiration, and checkout session redirects.` },
          { id: 11, title: 'Docker Orchestration Config',   agent: 'MonitorBot',    emoji: '👁️',  platform: 'Antigravity',status: 'Ready',progress: 0,  prompt: `Configure a Dockerfile multi-stage container build and Nginx reverse proxy configuration for: "${planStr}". Map subdomains and setup SSL certificate redirects.` },
          { id: 12, title: 'GitHub Actions CI/CD Script',    agent: 'DeployBot',     emoji: '🚀',  platform: 'Bolt',     status: 'Ready', progress: 0,  prompt: `Write a GitHub Actions pipeline runner script for: "${planStr}". Automate code checking (ESlint), unit tests execution, production compilation, and Discord alert notifications.` },
        ];
        setWorkPackages(packages);
        setIsSplitting(false);
      }
    }, 700);
  };

  // ── Dispatch individual package ──
  const handleDispatchPackage = (id) => {
    sound.play('click');
    setWorkPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: 'Running', progress: 0 };
    }));

    const target = workPackages.find(p => p.id === id);
    setDispatchLogs(prev => [`[Dispatcher] Dispatched package #${id} (${target.title}) to agent ${target.agent} on ${target.platform}`, ...prev]);

    let prog = 0;
    const t = setInterval(() => {
      prog += 20;
      setWorkPackages(prev => prev.map(p => {
        if (p.id !== id) return p;
        if (prog >= 100) {
          clearInterval(t);
          sound.play('success');
          return { ...p, status: 'Completed', progress: 100 };
        }
        return { ...p, progress: prog };
      }));
    }, 300);
  };

  // ── Dispatch all packages in parallel ──
  const handleDispatchAll = () => {
    sound.play('click');
    setIsDispatchingAll(true);
    setDispatchLogs(['[System] Initiating parallel broadcast transmission for all 12 work packages...']);

    workPackages.forEach(pkg => {
      setWorkPackages(prev => prev.map(p => {
        if (p.id !== pkg.id) return p;
        return { ...p, status: 'Running', progress: 0 };
      }));

      let progress = 0;
      const intervalTime = 150 + Math.random() * 250;
      const t = setInterval(() => {
        progress += Math.floor(10 + Math.random() * 20);
        if (progress >= 100) {
          progress = 100;
          clearInterval(t);
        }

        setWorkPackages(prev => prev.map(p => {
          if (p.id !== pkg.id) return p;
          const newStatus = progress === 100 ? 'Completed' : 'Running';
          return { ...p, progress, status: newStatus };
        }));

        if (progress === 100) {
          setDispatchLogs(prev => [`[System] Package #${pkg.id} (${pkg.title}) compiled successfully by ${pkg.agent}!`, ...prev]);
          sound.play('hover');
        }
      }, intervalTime);
    });

    const checkAll = setInterval(() => {
      setWorkPackages(currentPkgs => {
        const allDone = currentPkgs.every(p => p.status === 'Completed');
        if (allDone) {
          clearInterval(checkAll);
          setIsDispatchingAll(false);
          setDispatchLogs(prev => [`[System] All 12 developer agents completed their tasks. Code fragments ready for assembly.`, ...prev]);
          sound.play('success');
        }
        return currentPkgs;
      });
    }, 500);
  };

  // ── Assemble all packages into project codebase ──
  const handleAssembleCodebase = () => {
    sound.play('click');
    setIsAssembling(true);
    setAssembleProgress(0);
    setAssemblyComplete(false);
    setAssembleLogs(['[Assembler] Scanning local agent workspaces... 12 codebases verified.']);

    const steps = [
      'Resolving file directory mapping boundaries and modules import structure...',
      'Merging static design assets, stylesheets, and custom color variables...',
      'Bundling Express API routers under unified web server ports...',
      'Executing static linter scan (eslint .) and correcting scope warnings...',
      'Running production bundler compile via Vite compiler (Build 18)...',
      'Assembled bundle verified successfully! Codebase ready for execution.'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      setAssembleProgress(Math.min(100, Math.round((stepIdx / steps.length) * 100)));
      if (stepIdx <= steps.length) {
        setAssembleLogs(prev => [...prev, `[Assembler] ${steps[stepIdx - 1]}`]);
        sound.play('hover');
      }
      if (stepIdx >= steps.length) {
        clearInterval(interval);
        setIsAssembling(false);
        setAssemblyComplete(true);
        sound.play('success');
      }
    }, 700);
  };

  // ── Download assembled code zip package ──
  const handleDownloadPayload = () => {
    sound.play('success');
    const readmeContent = `# ${projectPlan}\n\nAssembled automatically by Bolt Studio Pro's 12-Agent Project Splitter.\n\n## Structure\n- 12 independent component packages successfully integrated.\n- React 19 + Express.js unified environment.\n`;
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assembled-project-payload.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Auto-scroll logs ──
  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  // ── Log ticker ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (logsPaused) return;
      const pool = LOG_POOL;
      const entry = pool[logCounter.current % pool.length];
      const id = logCounter.current++;
      setLogs(prev => [...prev.slice(-60), { ...entry, id, ts: now() }]);
    }, 2500);
    return () => clearInterval(interval);
  }, [logsPaused]);

  // ── Comm feed ticker ──
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = COMM_POOL;
      const entry = pool[commCounter.current % pool.length];
      const id = commCounter.current++;
      setCommFeed(prev => [{ ...entry, id, ts: now() }, ...prev.slice(0, 19)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Pipeline animation ──
  useEffect(() => {
    if (!runningPipeline) return;
    const pipe = pipelines.find(p => p.id === runningPipeline);
    if (!pipe) return;
    const stages = pipe.stages.length;
    let s = 0;
    const t = setInterval(() => {
      s++;
      setPipelineStage(s);
      if (s >= stages) { clearInterval(t); setTimeout(() => { setRunningPipeline(null); setPipelineStage(0); }, 800); }
    }, 900);
    return () => clearInterval(t);
  }, [runningPipeline, pipelines]);

  const filteredAgents = useMemo(() => agents.filter(a =>
    (statusFilter === 'All' || a.status === statusFilter) &&
    (platformFilter === 'All' || a.platform === platformFilter)
  ), [agents, statusFilter, platformFilter]);

  const filteredLogs = useMemo(() => logs.filter(l =>
    (logFilter === 'All' || l.level === logFilter) &&
    (logAgentFilter === 'All' || l.agent === logAgentFilter)
  ), [logs, logFilter, logAgentFilter]);

  const totalCpu = useMemo(() => Math.round(resources.reduce((s, r) => s + r.cpu, 0) / resources.length), [resources]);

  function handleDispatch() {
    if (!taskDesc.trim() || taskAgents.length === 0) return;
    setDispatching(true);
    setTimeout(() => {
      const newTask = {
        id: `t${Date.now()}`, desc: taskDesc,
        agents: taskAgents, priority: taskPriority,
        status: 'Pending', progress: 0,
      };
      setTaskQueue(prev => [newTask, ...prev]);
      setTaskDesc(''); setTaskAgents([]); setTaskPriority('Normal'); setTaskDeadline('');
      setDispatching(false);
    }, 1200);
  }

  function handleRebalance() {
    setRebalancing(true);
    setTimeout(() => {
      setResources(prev => prev.map(r => ({
        ...r,
        cpu:   Math.min(95, Math.max(5,  r.cpu   + (r.cpu   > 50 ? -8 : 8))),
        mem:   Math.min(900, Math.max(64, r.mem   + (r.mem   > 400 ? -48 : 48))),
        quota: Math.min(95, Math.max(5,  r.quota + (r.quota > 50 ? -6 : 6))),
      })));
      setRebalancing(false);
    }, 1400);
  }

  function castVote(voteId, choice) {
    setVotes(prev => prev.map(v => {
      if (v.id !== voteId || v.resolved) return v;
      return { ...v, yes: choice === 'yes' ? v.yes + 1 : v.yes, no: choice === 'no' ? v.no + 1 : v.no, resolved: true, outcome: `${choice === 'yes' ? 'Approved' : 'Rejected'} by your vote` };
    }));
  }

  const medalColors = ['#f5b731', '#9ca3af', '#c97c2a'];

  return (
    <div style={{ background: V.surface, minHeight: '100vh', color: '#fff', fontFamily: 'DM Mono, monospace', padding: '32px 28px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes dispatchFly { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.7} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${V.gold}33, ${V.teal}22)`, border: `1px solid ${V.gold}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🕹️</div>
              <div>
                <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', background: `linear-gradient(90deg, ${V.gold}, ${V.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Multi-Agent Orchestrator
                </h1>
                <p style={{ margin: 0, color: V.muted, fontSize: 12, marginTop: 2 }}>Deploy and coordinate swarms of specialized AI agents across 15+ platforms</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Active Agents',    value: '15',     color: V.teal,   icon: '🤖' },
              { label: 'Tasks Completed',  value: '2,847',  color: V.gold,   icon: '✅' },
              { label: 'Success Rate',     value: '97.3%',  color: V.green,  icon: '📈' },
              { label: 'Avg Response',     value: '1.2s',   color: V.purple, icon: '⚡' },
            ].map(stat => (
              <div key={stat.label} style={{ background: V.surface2, border: `1px solid ${stat.color}33`, borderRadius: 12, padding: '12px 18px', minWidth: 120 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span>{stat.icon}</span>
                  <span style={{ color: V.muted, fontSize: 10 }}>{stat.label}</span>
                </div>
                <div style={{ color: stat.color, fontSize: 22, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: `1px solid ${V.border}`, paddingBottom: 16 }}>
        <button
          onClick={() => { setActiveTab('swarm'); setSelectedAgent(null); sound.play('click'); }}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: activeTab === 'swarm' ? `linear-gradient(135deg, ${V.gold}22, ${V.gold}11)` : 'transparent',
            border: `1px solid ${activeTab === 'swarm' ? V.gold : 'transparent'}`,
            color: activeTab === 'swarm' ? V.gold : V.muted,
            fontFamily: 'Syne, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          🤖 Swarm Topology & Cockpit
        </button>
        <button
          onClick={() => { setActiveTab('splitter'); sound.play('click'); }}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: activeTab === 'splitter' ? `linear-gradient(135deg, ${V.teal}22, ${V.teal}11)` : 'transparent',
            border: `1px solid ${activeTab === 'splitter' ? V.teal : 'transparent'}`,
            color: activeTab === 'splitter' ? V.teal : V.muted,
            fontFamily: 'Syne, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          🧬 12-Agent Project Splitter & Assembler
        </button>
      </div>

      {activeTab === 'swarm' && (
        <>
          {/* ── ROW 1: SWARM MAP + AGENT ROSTER ──────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 20, marginBottom: 20 }}>
        {/* SWARM MAP */}
        <Section title="Agent Swarm Map" icon="🌐">
          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            <AgentSwarmMap agents={agents} selectedId={selectedAgent?.id} onSelect={setSelectedAgent} />
            <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
          </div>
        </Section>

        {/* AGENT ROSTER */}
        <Section title="Agent Roster" icon="📋">
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div>
              <label style={{ color: V.muted, fontSize: 10, display: 'block', marginBottom: 4 }}>STATUS</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', padding: '6px 10px', fontSize: 12, outline: 'none' }}>
                {['All','Running','Idle','Error'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: V.muted, fontSize: 10, display: 'block', marginBottom: 4 }}>PLATFORM</label>
              <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
                style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', padding: '6px 10px', fontSize: 12, outline: 'none' }}>
                {platforms.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                  {['Agent','Platform','Status','Task','Today','%','Lat','Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: V.muted, fontWeight: 500, fontSize: 10, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${V.border}`, background: i % 2 === 0 ? 'transparent' : `${V.surface3}55`, cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setSelectedAgent(a)}>
                    <td style={{ padding: '9px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}22`, border: `1px solid ${a.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{a.emoji}</div>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{a.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 10px', color: V.muted }}>{a.platform}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor(a.status), boxShadow: a.status === 'Running' ? `0 0 6px ${statusColor(a.status)}` : 'none', animation: a.status === 'Running' ? 'pulse 2s infinite' : 'none', flexShrink: 0 }} />
                        <span style={{ color: statusColor(a.status) }}>{a.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '9px 10px', color: V.muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.task}</td>
                    <td style={{ padding: '9px 10px', color: V.teal, fontWeight: 600 }}>{a.tasksToday}</td>
                    <td style={{ padding: '9px 10px', color: a.success >= 98 ? V.green : a.success >= 90 ? V.gold : V.red }}>{a.success}%</td>
                    <td style={{ padding: '9px 10px', color: V.muted }}>{a.latency}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[['↺', V.teal], ['■', V.red], ['⊕', V.gold]].map(([lbl, clr]) => (
                          <button key={lbl} onClick={e => e.stopPropagation()} style={{ background: `${clr}18`, border: `1px solid ${clr}44`, color: clr, borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>{lbl}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* ── ROW 2: TASK DISTRIBUTION + LOGS ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* TASK DISTRIBUTION */}
        <Section title="Task Distribution Center" icon="🎯">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ color: V.muted, fontSize: 10 }}>TASK DESCRIPTION</label>
              <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Describe the task for your agents..."
                style={{ width: '100%', marginTop: 6, background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, color: '#fff', padding: '10px 12px', fontSize: 12, resize: 'vertical', minHeight: 70, outline: 'none', fontFamily: 'DM Mono, monospace' }} />
            </div>
            <div>
              <label style={{ color: V.muted, fontSize: 10, display: 'block', marginBottom: 8 }}>TARGET AGENTS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {agents.map(a => {
                  const checked = taskAgents.includes(a.name);
                  return (
                    <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: checked ? `${a.color}22` : V.surface3, border: `1px solid ${checked ? a.color : V.border}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 11, transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={checked} style={{ display: 'none' }}
                        onChange={() => setTaskAgents(prev => checked ? prev.filter(n => n !== a.name) : [...prev, a.name])} />
                      <span>{a.emoji}</span>
                      <span style={{ color: checked ? '#fff' : V.muted }}>{a.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ color: V.muted, fontSize: 10 }}>PRIORITY</label>
                <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}
                  style={{ width: '100%', marginTop: 6, background: V.surface3, border: `1px solid ${priorityColor(taskPriority)}55`, borderRadius: 8, color: priorityColor(taskPriority), padding: '8px 10px', fontSize: 12, outline: 'none' }}>
                  {['Low','Normal','High','Critical'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: V.muted, fontSize: 10 }}>DEADLINE</label>
                <input type="datetime-local" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)}
                  style={{ width: '100%', marginTop: 6, background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', padding: '8px 10px', fontSize: 12, outline: 'none', fontFamily: 'DM Mono, monospace' }} />
              </div>
            </div>
            <button onClick={handleDispatch} disabled={dispatching}
              style={{ padding: '12px', borderRadius: 10, border: 'none', background: dispatching ? V.surface3 : `linear-gradient(90deg, ${V.gold}, #e0a000)`, color: dispatching ? V.muted : '#000', fontWeight: 700, fontSize: 13, cursor: dispatching ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em', animation: dispatching ? 'dispatchFly 0.6s ease infinite' : 'none', transition: 'all 0.2s' }}>
              {dispatching ? '📡 Dispatching to agents...' : '🚀 Dispatch Task'}
            </button>
            <div>
              <div style={{ color: V.muted, fontSize: 10, marginBottom: 8 }}>TASK QUEUE ({taskQueue.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                {taskQueue.map(t => (
                  <div key={t.id} style={{ background: V.surface3, borderRadius: 10, padding: '10px 12px', border: `1px solid ${V.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, flex: 1, marginRight: 8 }}>{t.desc}</span>
                      <span style={{ background: `${priorityColor(t.priority)}22`, color: priorityColor(t.priority), borderRadius: 6, padding: '1px 7px', fontSize: 10, whiteSpace: 'nowrap' }}>{t.priority}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: taskStatusColor(t.status) }} />
                      <span style={{ color: taskStatusColor(t.status), fontSize: 11 }}>{t.status}</span>
                      <span style={{ color: V.muted, fontSize: 11 }}>→ {t.agents.join(', ')}</span>
                    </div>
                    {t.status !== 'Completed' && (
                      <div style={{ marginTop: 6, height: 3, background: V.surface, borderRadius: 9 }}>
                        <div style={{ height: '100%', width: `${t.progress}%`, background: taskStatusColor(t.status), borderRadius: 9, transition: 'width 0.5s ease' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* REAL-TIME LOGS */}
        <Section title="Real-Time Agent Logs" icon="🖥️">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select value={logFilter} onChange={e => setLogFilter(e.target.value)}
              style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', padding: '5px 10px', fontSize: 11, outline: 'none' }}>
              {['All','success','info','error'].map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l.toUpperCase()}</option>)}
            </select>
            <select value={logAgentFilter} onChange={e => setLogAgentFilter(e.target.value)}
              style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, color: '#fff', padding: '5px 10px', fontSize: 11, outline: 'none' }}>
              <option value="All">All Agents</option>
              {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
            <div style={{ flex: 1 }} />
            {[
              [logsPaused ? '▶ Resume' : '⏸ Pause', () => setLogsPaused(p => !p), logsPaused ? V.green : V.gold],
              ['🗑 Clear', () => setLogs([]), V.red],
              ['⬇ Export', () => {}, V.teal],
            ].map(([lbl, fn, clr]) => (
              <button key={lbl} onClick={fn}
                style={{ background: `${clr}18`, border: `1px solid ${clr}44`, color: clr, borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
                {lbl}
              </button>
            ))}
          </div>
          <div ref={logsRef} style={{ background: '#070710', borderRadius: 10, border: `1px solid ${V.border}`, height: 480, overflowY: 'auto', padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
            {filteredLogs.map(l => (
              <div key={l.id} style={{ display: 'flex', gap: 8, marginBottom: 5, animation: 'fadeUp 0.3s ease' }}>
                <span style={{ color: V.muted, flexShrink: 0 }}>[{l.ts}]</span>
                <span style={{ color: levelColor(l.level), fontWeight: 700, minWidth: 54 }}>[{l.level.toUpperCase()}]</span>
                <span style={{ color: V.purple, minWidth: 110, flexShrink: 0 }}>[{l.agent}]</span>
                <span style={{ color: l.level === 'error' ? V.red : l.level === 'success' ? V.green : '#d1d5db' }}>{l.msg}</span>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div style={{ color: V.muted, textAlign: 'center', marginTop: 40 }}>No logs match current filters</div>
            )}
          </div>
        </Section>
      </div>

      {/* ── ROW 3: PIPELINES + CONSENSUS ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* PIPELINES */}
        <Section title="Orchestration Pipelines" icon="🔗">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pipelines.map(pipe => {
              const isRunning = runningPipeline === pipe.id;
              return (
                <div key={pipe.id} style={{ background: V.surface3, borderRadius: 12, padding: 16, border: `1px solid ${isRunning ? pipe.color : V.border}`, transition: 'border 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{pipe.name}</div>
                      <div style={{ color: V.muted, fontSize: 11, marginTop: 2 }}>Last run: {pipe.lastRun} · Success: <span style={{ color: V.green }}>{pipe.rate}</span></div>
                    </div>
                    <button onClick={() => {
                      if (isRunning) {
                        setRunningPipeline(null);
                        setPipelineStage(0);
                      } else {
                        setPipelineStage(0);
                        setRunningPipeline(pipe.id);
                      }
                    }}
                      style={{ background: isRunning ? `${V.red}22` : `${pipe.color}22`, border: `1px solid ${isRunning ? V.red : pipe.color}`, color: isRunning ? V.red : pipe.color, borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                      {isRunning ? '⏹ Stop' : '▶ Run Now'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {pipe.stages.map((stage, si) => {
                      const done = isRunning && si < pipelineStage;
                      const active = isRunning && si === pipelineStage - 1;
                      return (
                        <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                              padding: '5px 8px', borderRadius: 7, fontSize: 10, fontWeight: 600,
                              background: done || active ? `${pipe.color}33` : V.surface,
                              border: `1px solid ${done || active ? pipe.color : V.border}`,
                              color: done ? pipe.color : active ? '#fff' : V.muted,
                              transition: 'all 0.4s',
                              animation: active ? 'pulse 0.8s infinite' : 'none',
                            }}>{stage}</div>
                          </div>
                          {si < pipe.stages.length - 1 && (
                            <div style={{ height: 2, width: 14, background: done ? pipe.color : V.border, flexShrink: 0, transition: 'background 0.4s' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* CONSENSUS VOTING */}
        <Section title="Consensus Voting" icon="🗳️">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {votes.map(v => {
              const total = v.yes + v.no;
              const yesPct = total > 0 ? Math.round((v.yes / total) * 100) : 0;
              return (
                <div key={v.id} style={{ background: V.surface3, borderRadius: 12, padding: 16, border: `1px solid ${V.border}` }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>{v.question}</div>
                  {v.resolved ? (
                    <div style={{ color: v.outcome?.startsWith('Approved') ? V.green : V.red, fontSize: 12, fontWeight: 700 }}>
                      {v.outcome?.startsWith('Approved') ? '✅' : '❌'} {v.outcome}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <div style={{ height: 8, flex: yesPct, background: V.green, borderRadius: 9, transition: 'flex 0.6s ease', minWidth: yesPct > 0 ? 4 : 0 }} />
                        <div style={{ height: 8, flex: 100 - yesPct, background: V.red, borderRadius: 9, transition: 'flex 0.6s ease', minWidth: 100 - yesPct > 0 ? 4 : 0 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: V.muted, marginBottom: 10 }}>
                        <span><span style={{ color: V.green }}>✓ Yes: {v.yes}</span> agents</span>
                        <span>Deadline: {v.deadline}</span>
                        <span><span style={{ color: V.red }}>✗ No: {v.no}</span> agents</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => castVote(v.id, 'yes')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${V.green}55`, background: `${V.green}18`, color: V.green, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✓ Vote Yes</button>
                        <button onClick={() => castVote(v.id, 'no')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${V.red}55`, background: `${V.red}18`, color: V.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✗ Vote No</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* ── ROW 4: RESOURCES + COMM FEED ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* RESOURCE ALLOCATION */}
        <Section title="Resource Allocation" icon="⚙️">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <ArcGauge value={totalCpu} max={100} color={V.gold} label="Fleet CPU Avg" size={110} />
              <ArcGauge value={Math.round(resources.reduce((s,r)=>s+r.quota,0)/resources.length)} max={100} color={V.teal} label="Quota Usage" size={110} />
            </div>
            <button onClick={handleRebalance} disabled={rebalancing}
              style={{ padding: '9px 18px', borderRadius: 10, border: `1px solid ${V.purple}55`, background: `${V.purple}22`, color: V.purple, cursor: rebalancing ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Syne, sans-serif' }}>
              {rebalancing ? <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> : '⟳'} Rebalance
            </button>
          </div>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {resources.map(r => (
              <div key={r.id} style={{ marginBottom: 12, padding: '10px 12px', background: V.surface3, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: V.muted, fontSize: 10 }}>CPU {r.cpu}% · {r.mem}MB · Quota {r.quota}%</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[
                    [r.cpu, V.gold, 100],
                    [(r.mem / 1024) * 100, V.teal, 100],
                    [r.quota, V.purple, 100],
                  ].map(([val, clr], bi) => (
                    <div key={bi} style={{ flex: 1, height: 4, background: V.surface, borderRadius: 9 }}>
                      <div style={{ height: '100%', width: `${Math.min(100, val)}%`, background: clr, borderRadius: 9, transition: 'width 1.2s ease' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* COMMUNICATION FEED */}
        <Section title="Agent Communication Feed" icon="📨">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto' }}>
            {commFeed.map((m, i) => (
              <div key={m.id} style={{ background: V.surface3, borderRadius: 10, padding: '11px 14px', border: `1px solid ${V.border}`, animation: i === 0 ? 'slideIn 0.4s ease' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: V.teal, fontWeight: 700, fontSize: 11 }}>{m.from}</span>
                  <span style={{ color: V.muted, fontSize: 10 }}>→</span>
                  <span style={{ color: V.purple, fontWeight: 700, fontSize: 11 }}>{m.to}</span>
                  <span style={{ background: `${msgTypeColor(m.type)}22`, color: msgTypeColor(m.type), borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 700, marginLeft: 'auto' }}>{m.type}</span>
                  <span style={{ color: V.muted, fontSize: 10 }}>{m.ts}</span>
                </div>
                <div style={{ color: '#c4c4d4', fontSize: 11 }}>{m.content}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── PERFORMANCE LEADERBOARD ───────────────────────────────────────── */}
      <Section title="Performance Leaderboard" icon="🏆">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ color: V.muted, fontSize: 12 }}>Agent rankings by performance</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Today','Week','Month'].map(r => (
              <button key={r} onClick={() => setLbRange(r)}
                style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${lbRange === r ? V.gold : V.border}`, background: lbRange === r ? `${V.gold}22` : 'transparent', color: lbRange === r ? V.gold : V.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leaderboard.map((a) => (
            <div key={a.rank} style={{
              display: 'grid', gridTemplateColumns: '44px 1fr 120px 90px 80px 100px',
              alignItems: 'center', gap: 16,
              background: a.rank <= 3 ? `${medalColors[a.rank - 1]}10` : V.surface3,
              border: `1px solid ${a.rank <= 3 ? medalColors[a.rank - 1] + '33' : V.border}`,
              borderRadius: 12, padding: '12px 16px',
            }}>
              <div style={{ textAlign: 'center' }}>
                {a.rank === 1 && <span style={{ fontSize: 22 }}>🥇</span>}
                {a.rank === 2 && <span style={{ fontSize: 22 }}>🥈</span>}
                {a.rank === 3 && <span style={{ fontSize: 22 }}>🥉</span>}
                {a.rank > 3 && <span style={{ color: V.muted, fontWeight: 700, fontSize: 16 }}>#{a.rank}</span>}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                <div style={{ color: V.muted, fontSize: 10, marginTop: 2 }}>{lbRange} performance</div>
              </div>
              <div>
                <div style={{ color: V.muted, fontSize: 10, marginBottom: 4 }}>TASKS</div>
                <div style={{ height: 20, background: V.surface, borderRadius: 5, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(a.tasks / 2048) * 100}%`, background: `linear-gradient(90deg, ${V.gold}, ${V.teal})`, borderRadius: 5 }} />
                  <span style={{ position: 'absolute', right: 6, top: 2, fontSize: 10, color: '#fff', fontWeight: 700 }}>{a.tasks.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div style={{ color: V.muted, fontSize: 10 }}>SUCCESS</div>
                <div style={{ color: a.rate >= 99 ? V.green : a.rate >= 95 ? V.teal : V.gold, fontWeight: 700, fontSize: 18, fontFamily: 'Syne, sans-serif' }}>{a.rate}%</div>
              </div>
              <div>
                <div style={{ color: V.muted, fontSize: 10 }}>AVG SPEED</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 2 }}>{a.speed}</div>
              </div>
              <div>
                <div style={{ color: V.muted, fontSize: 10, marginBottom: 4 }}>TREND</div>
                <Sparkline data={a.trend} color={a.rank === 1 ? V.gold : a.rank === 2 ? '#9ca3af' : a.rank === 3 ? '#c97c2a' : V.teal} width={88} height={26} />
              </div>
            </div>
          ))}
        </div>
      </Section>
      </>
      )}

      {activeTab === 'splitter' && (
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          {/* Main Plan Input panel */}
          <div style={{
            background: V.surface2,
            border: `1px solid ${V.border}`,
            borderRadius: 16,
            padding: '24px 28px',
            marginBottom: 20,
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 18, fontFamily: 'Syne, sans-serif', color: '#fff', fontWeight: 800 }}>
              🧬 12-Agent Project Splitter
            </h2>
            <p style={{ margin: '0 0 20px 0', color: V.muted, fontSize: 12 }}>
              Input your custom SaaS project idea. Our system will automatically decompile the architecture into 12 distinct work packages, assign them to your connected agent accounts, and merge them into a unified project download.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ color: V.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>ENTER PROJECT PLAN / IDEA</label>
                <textarea
                  value={projectPlan}
                  onChange={e => setProjectPlan(e.target.value)}
                  placeholder="e.g. Build a premium SaaS AI Chatbot Dashboard with Express.js backend, Stripe subscription plan integration, and real-time alerts..."
                  style={{
                    width: '100%',
                    marginTop: 6,
                    background: V.surface3,
                    border: `1px solid ${V.border}`,
                    borderRadius: 10,
                    color: '#fff',
                    padding: '12px 14px',
                    fontSize: 13,
                    resize: 'vertical',
                    minHeight: 80,
                    outline: 'none',
                    fontFamily: 'DM Mono, monospace',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, color: V.muted }}>
                  <span>🎯 Platforms target:</span>
                  <span style={{ color: V.teal, fontWeight: 700 }}>Claude.ai, Lovable, Bolt.new, Gemini, Replit, Manus</span>
                </div>
                <button
                  onClick={handleSplitProject}
                  disabled={isSplitting || !projectPlan.trim()}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: isSplitting ? V.surface3 : `linear-gradient(90deg, ${V.teal}, ${V.gold})`,
                    color: isSplitting ? V.muted : '#000',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: isSplitting || !projectPlan.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    transition: 'all 0.2s',
                    boxShadow: isSplitting ? 'none' : `0 0 15px rgba(34, 211, 238, 0.25)`,
                  }}
                >
                  {isSplitting ? '⚡ Decompiling...' : '⚡ Split into 12 Packages'}
                </button>
              </div>
            </div>

            {/* Split progression bar */}
            {isSplitting && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: V.teal, marginBottom: 6 }}>
                  <span>Processing architectural modules...</span>
                  <span>{splitterProgress}%</span>
                </div>
                <div style={{ height: 4, background: V.surface, borderRadius: 9, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${splitterProgress}%`, background: V.teal, borderRadius: 9, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            {/* Splitter logs */}
            {splitterLogs.length > 0 && (
              <div style={{
                marginTop: 20,
                background: '#070710',
                borderRadius: 10,
                border: `1px solid ${V.border}`,
                padding: '12px 16px',
                maxHeight: 120,
                overflowY: 'auto',
                fontFamily: 'DM Mono, monospace',
                fontSize: 11,
              }}>
                {splitterLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.startsWith('[Splitter]') ? V.teal : V.muted, marginBottom: 4 }}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 12 Work Packages Grid */}
          {workPackages.length > 0 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontFamily: 'Syne, sans-serif', color: '#fff', fontWeight: 700 }}>
                    🛠️ 12 Work Packages Configuration
                  </h3>
                  <p style={{ margin: '2px 0 0 0', color: V.muted, fontSize: 11 }}>
                    Click dispatch on individual cards or trigger parallel execution for all accounts
                  </p>
                </div>

                <button
                  onClick={handleDispatchAll}
                  disabled={isDispatchingAll || workPackages.every(p => p.status === 'Completed')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: `1px solid ${V.gold}`,
                    background: isDispatchingAll ? 'transparent' : `${V.gold}18`,
                    color: V.gold,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: isDispatchingAll || workPackages.every(p => p.status === 'Completed') ? 'not-allowed' : 'pointer',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  {isDispatchingAll ? '📡 Executing swarm...' : '📡 Parallel Dispatch All (12 Agents)'}
                </button>
              </div>

              {/* Grid of 12 packages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
                {workPackages.map(pkg => {
                  const isDone = pkg.status === 'Completed';
                  const isRunning = pkg.status === 'Running';
                  return (
                    <div
                      key={pkg.id}
                      style={{
                        background: V.surface2,
                        border: `1px solid ${isDone ? V.green : isRunning ? V.teal : V.border}`,
                        borderRadius: 12,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 12,
                        transition: 'all 0.3s',
                        boxShadow: isRunning ? `0 0 15px rgba(34, 211, 238, 0.1)` : 'none',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 10, color: V.muted, fontWeight: 700 }}>PART {pkg.id}/12</span>
                          <span style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: isDone ? `${V.green}22` : isRunning ? `${V.teal}22` : V.surface3,
                            color: isDone ? V.green : isRunning ? V.teal : V.muted,
                            fontWeight: 700,
                          }}>
                            {pkg.status}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                          {pkg.title}
                        </h4>
                        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: V.muted, marginBottom: 8 }}>
                          <span>Assignee:</span>
                          <span style={{ color: V.purple }}>{pkg.emoji} {pkg.agent}</span>
                          <span>·</span>
                          <span style={{ color: V.gold }}>{pkg.platform}</span>
                        </div>
                        <div style={{
                          background: V.surface3,
                          border: `1px solid ${V.border}`,
                          borderRadius: 8,
                          padding: '8px 10px',
                          fontSize: 10.5,
                          color: '#c4c4d4',
                          maxHeight: 100,
                          overflowY: 'auto',
                          fontFamily: 'DM Mono, monospace',
                          lineHeight: 1.4,
                        }}>
                          {pkg.prompt}
                        </div>
                      </div>

                      <div>
                        {isRunning && (
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: V.teal, marginBottom: 3 }}>
                              <span>Running compiler builds...</span>
                              <span>{pkg.progress}%</span>
                            </div>
                            <div style={{ height: 3, background: V.surface, borderRadius: 9, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pkg.progress}%`, background: V.teal, borderRadius: 9 }} />
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(pkg.prompt);
                              sound.play('click');
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 0',
                              borderRadius: 6,
                              background: 'transparent',
                              border: `1px solid ${V.border}`,
                              color: V.muted,
                              cursor: 'pointer',
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            📋 Copy
                          </button>
                          <button
                            onClick={() => handleDispatchPackage(pkg.id)}
                            disabled={isDone || isRunning}
                            style={{
                              flex: 1.2,
                              padding: '6px 0',
                              borderRadius: 6,
                              background: isDone ? `${V.green}18` : `${V.teal}18`,
                              border: `1px solid ${isDone ? V.green : V.teal}`,
                              color: isDone ? V.green : V.teal,
                              cursor: isDone || isRunning ? 'not-allowed' : 'pointer',
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {isDone ? '✓ Dispatched' : '📡 Dispatch'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Parallel Dispatch Logs */}
              {dispatchLogs.length > 0 && (
                <div style={{
                  background: '#070710',
                  borderRadius: 12,
                  border: `1px solid ${V.border}`,
                  padding: '16px 20px',
                  marginBottom: 24,
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 12, color: V.muted, fontWeight: 700, letterSpacing: '0.05em' }}>
                    PARALLEL EXECUTION TRANSCEIVER LOGS
                  </h4>
                  <div style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 11.5,
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}>
                    {dispatchLogs.map((log, idx) => (
                      <div key={idx} style={{
                        color: log.includes('successfully') ? V.green : log.includes('broadcast') ? V.gold : '#d0d0e0',
                        marginBottom: 6,
                      }}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Assembler Section */}
              {workPackages.every(p => p.status === 'Completed') && (
                <div style={{
                  background: `linear-gradient(135deg, ${V.surface2}, rgba(34, 211, 238, 0.03))`,
                  border: `1px solid ${assemblyComplete ? V.green : V.teal}`,
                  borderRadius: 16,
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  animation: 'fadeUp 0.4s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontFamily: 'Syne, sans-serif', color: '#fff', fontWeight: 700 }}>
                        🧬 12-Agent Code Assembler
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: V.muted, fontSize: 12 }}>
                        All 12 codebases are completed by independent agents. Trigger the assembler to merge diff overlays and bundle output assets.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={handleAssembleCodebase}
                        disabled={isAssembling || assemblyComplete}
                        style={{
                          padding: '10px 24px',
                          borderRadius: 8,
                          border: 'none',
                          background: assemblyComplete ? `${V.green}22` : `linear-gradient(90deg, ${V.teal}, ${V.purple})`,
                          color: assemblyComplete ? V.green : '#000',
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: isAssembling || assemblyComplete ? 'not-allowed' : 'pointer',
                          fontFamily: 'Syne, sans-serif',
                        }}
                      >
                        {isAssembling ? '⏳ Merging...' : assemblyComplete ? '✓ Codebase Assembled' : '🧬 Merge & Assemble Code'}
                      </button>

                      {assemblyComplete && (
                        <button
                          onClick={handleDownloadPayload}
                          style={{
                            padding: '10px 24px',
                            borderRadius: 8,
                            border: `1px solid ${V.gold}`,
                            background: `${V.gold}18`,
                            color: V.gold,
                            fontWeight: 700,
                            fontSize: 12.5,
                            cursor: 'pointer',
                            fontFamily: 'Syne, sans-serif',
                            boxShadow: `0 0 10px rgba(245, 183, 49, 0.15)`,
                          }}
                        >
                          ⬇ Download Code (.ZIP)
                        </button>
                      )}
                    </div>
                  </div>

                  {isAssembling && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: V.teal, marginBottom: 6 }}>
                        <span>Compiling unified project payload...</span>
                        <span>{assembleProgress}%</span>
                      </div>
                      <div style={{ height: 4, background: V.surface, borderRadius: 9, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${assembleProgress}%`, background: V.teal, borderRadius: 9, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  )}

                  {assembleLogs.length > 0 && (
                    <div style={{
                      background: '#04040a',
                      borderRadius: 10,
                      border: `1px solid ${V.border}`,
                      padding: '12px 16px',
                      maxHeight: 150,
                      overflowY: 'auto',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 11,
                    }}>
                      {assembleLogs.map((log, idx) => (
                        <div key={idx} style={{
                          color: log.includes('verified') ? V.green : log.includes('eslint') ? V.gold : '#a4a4b4',
                          marginBottom: 4
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
