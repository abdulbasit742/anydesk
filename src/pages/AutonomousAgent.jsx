import { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── CSS injected once ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  50%  { transform: scale(1.18);opacity: 0.3; }
  100% { transform: scale(1);   opacity: 0.8; }
}
@keyframes brain-glow {
  0%,100% { filter: drop-shadow(0 0 6px #f5b731aa); }
  50%      { filter: drop-shadow(0 0 22px #f5b731ff) drop-shadow(0 0 40px #f5b73166); }
}
@keyframes dash-travel {
  0%   { stroke-dashoffset: 200; }
  100% { stroke-dashoffset: 0; }
}
@keyframes node-pulse {
  0%,100% { r: 7; opacity: 0.85; }
  50%      { r: 10; opacity: 1; }
}
@keyframes node-active {
  0%,100% { r: 9;  filter: drop-shadow(0 0 6px #f5b731); }
  50%      { r: 12; filter: drop-shadow(0 0 18px #f5b731); }
}
@keyframes scroll-thoughts {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bar-fill {
  from { width: 0%; }
  to   { width: var(--w); }
}
@keyframes counter-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blink-cursor {
  0%,100% { opacity: 1; }
  50%      { opacity: 0; }
}
@keyframes progress-stripe {
  0%   { background-position: 0 0; }
  100% { background-position: 40px 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hero-gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes particle-flow {
  0%   { left: 0%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
@keyframes emergency-flash {
  0%,100% { background: #1a0000; border-color: rgba(239,68,68,0.4); }
  50%      { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.8); }
}
@keyframes countdown-shrink {
  from { width: 100%; }
  to   { width: 0%; }
}
@keyframes log-entry {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes cpu-pulse {
  0%,100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
.aa-root * { box-sizing: border-box; }
.aa-root { font-family: 'Syne', sans-serif; }
.aa-mono { font-family: 'DM Mono', monospace; }
.aa-thought-entry { animation: scroll-thoughts 0.35s ease forwards; }
.aa-code-cursor::after {
  content: '|';
  animation: blink-cursor 0.9s infinite;
  color: #f5b731;
}
.aa-progress-bar {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.06) 10px,
    rgba(255,255,255,0.06) 20px
  );
  background-size: 40px 40px;
  animation: progress-stripe 1s linear infinite;
}
.aa-fade-in { animation: fade-in 0.5s ease forwards; }
.aa-log-new { animation: log-entry 0.3s ease forwards; }
.aa-emergency { animation: emergency-flash 1.2s ease-in-out infinite; }
.aa-agent-card:hover { transform: translateY(-2px); border-color: rgba(245,183,49,0.3) !important; }
.aa-agent-card { transition: transform 0.2s, border-color 0.2s; }
.aa-lb-row:hover { background: rgba(255,255,255,0.04) !important; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: #16161e; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
`;

/* ─── Data constants ─────────────────────────────────────────────── */
const THOUGHTS = [
  { type: 'ANALYZE', text: 'Scanning project structure… 59 pages detected' },
  { type: 'ANALYZE', text: 'Reading App.jsx route manifest — 52 routes registered' },
  { type: 'PLAN',    text: 'Identifying feature gaps in analytics coverage' },
  { type: 'PLAN',    text: 'Prioritizing: RoadmapBuilder scores 94 / 100 impact' },
  { type: 'BUILD',   text: 'Scaffolding RoadmapBuilder.jsx — 340 lines estimated' },
  { type: 'BUILD',   text: 'Writing SVG milestone timeline component…' },
  { type: 'BUILD',   text: 'Injecting drag-to-reorder logic with @dnd-kit…' },
  { type: 'VERIFY',  text: 'Running ESLint — 0 errors, 2 warnings (auto-fixed)' },
  { type: 'VERIFY',  text: 'Build verified: 0 errors, 0 warnings' },
  { type: 'DECIDE',  text: 'Routing RoadmapBuilder to /roadmap in App.jsx' },
  { type: 'ANALYZE', text: 'Evaluating KPIExplorer coverage — gap detected' },
  { type: 'PLAN',    text: 'Designing KPIExplorer with 6-panel grid layout' },
  { type: 'BUILD',   text: 'Generating animated sparkline SVG components…' },
  { type: 'BUILD',   text: 'Wiring useMemo hooks for real-time KPI calculations' },
  { type: 'VERIFY',  text: 'Smoke-testing KPIExplorer render — PASS ✓' },
  { type: 'DECIDE',  text: 'Adding KPIExplorer to sidebar navigation' },
  { type: 'ANALYZE', text: 'Checking CollaborationHub for unimplemented stubs' },
  { type: 'PLAN',    text: 'Planning WebSocket presence layer for live cursors' },
  { type: 'BUILD',   text: 'Writing usePresence hook — broadcast + receive…' },
  { type: 'VERIFY',  text: 'CollaborationHub bundle size: 48 kB (within budget)' },
  { type: 'DECIDE',  text: 'Committing 3 new pages — incrementing build counter' },
  { type: 'ANALYZE', text: 'Re-scanning for orphaned components in /src/components' },
  { type: 'PLAN',    text: 'Refactoring GlowCard to accept variant="danger"' },
  { type: 'BUILD',   text: 'Applying variant props across 12 usages…' },
  { type: 'VERIFY',  text: 'Visual regression diff: 0 unexpected changes' },
  { type: 'DECIDE',  text: 'All tasks for cycle #47 complete. Scheduling cycle #48' },
  { type: 'ANALYZE', text: 'Tokenizing codebase for pattern extraction… 142k tokens' },
  { type: 'PLAN',    text: 'Selecting next build: AIModelBenchmark (score: 97)' },
  { type: 'BUILD',   text: 'Creating comparative radar chart for model metrics…' },
  { type: 'VERIFY',  text: 'Benchmark page passes Lighthouse accessibility audit' },
];

const INIT_TASKS = [
  { id: 1, name: 'Build AIModelBenchmark.jsx',   priority: 'P1', est: '8 min',  status: 'Running', progress: 62 },
  { id: 2, name: 'Build DataLineage.jsx',         priority: 'P1', est: '12 min', status: 'Queued',  progress: 0  },
  { id: 3, name: 'Refactor useMetrics hook',      priority: 'P2', est: '5 min',  status: 'Queued',  progress: 0  },
  { id: 4, name: 'Build QuerySandbox.jsx',        priority: 'P1', est: '15 min', status: 'Queued',  progress: 0  },
  { id: 5, name: 'Add dark-mode tokens to CSS',   priority: 'P3', est: '3 min',  status: 'Done',    progress: 100, time: '2m 47s' },
  { id: 6, name: 'Build EventCorrelation.jsx',    priority: 'P2', est: '10 min', status: 'Done',    progress: 100, time: '9m 12s' },
  { id: 7, name: 'Wire sidebar collapse toggle',  priority: 'P3', est: '4 min',  status: 'Failed',  progress: 45  },
  { id: 8, name: 'Generate API mock fixtures',    priority: 'P2', est: '6 min',  status: 'Queued',  progress: 0  },
];

const TIMELINE_ITEMS = [
  { id: 1,  name: 'KPIExplorer',        dur: '8m 03s',  status: 'done' },
  { id: 2,  name: 'RoadmapBuilder',     dur: '11m 22s', status: 'done' },
  { id: 3,  name: 'CollabHub',          dur: '9m 45s',  status: 'done' },
  { id: 4,  name: 'EventStream',        dur: '6m 18s',  status: 'done' },
  { id: 5,  name: 'AlertMatrix',        dur: '7m 54s',  status: 'done' },
  { id: 6,  name: 'QueryBuilder',       dur: '13m 01s', status: 'done' },
  { id: 7,  name: 'MetricsDrill',       dur: '5m 33s',  status: 'done' },
  { id: 8,  name: 'DataLineageV1',      dur: '10m 10s', status: 'done' },
  { id: 9,  name: 'TokenTracker',       dur: '4m 48s',  status: 'done' },
  { id: 10, name: 'ForecastEngine',     dur: '14m 26s', status: 'done' },
  { id: 11, name: 'AnomalyDetect',      dur: '8m 59s',  status: 'done' },
  { id: 12, name: 'AIModelBenchmark',   dur: '...',      status: 'active', progress: 62 },
];

const CODE_SNIPPETS = [
  {
    file: 'src/pages/RoadmapBuilder.jsx',
    lines: [
      "// RoadmapBuilder — SVG milestone timeline",
      "import React, { useState, useMemo } from 'react';",
      "",
      "const MILESTONES = [",
      "  { id: 1, label: 'Alpha Release', date: '2026-01-15',",
      "    status: 'done', color: '#22d3ee' },",
      "  { id: 2, label: 'Beta Launch',   date: '2026-03-01',",
      "    status: 'done', color: '#f5b731' },",
      "  { id: 3, label: 'v1.0 GA',       date: '2026-06-01',",
      "    status: 'active', color: '#a78bfa' },",
      "];",
      "",
      "export default function RoadmapBuilder() {",
      "  const [selected, setSelected] = useState(null);",
      "  const width = 900, height = 180;",
      "",
      "  const xScale = useMemo(() => {",
      "    const dates = MILESTONES.map(m => new Date(m.date));",
      "    const min = Math.min(...dates.map(d => d.getTime()));",
      "    const max = Math.max(...dates.map(d => d.getTime()));",
      "    return t => 60 + ((t - min) / (max - min)) * (width - 120);",
      "  }, []);",
      "",
      "  return (",
      "    <svg width={width} height={height}>",
      "      <line x1={60} y1={90} x2={width-60} y2={90}",
      "        stroke='#6e7191' strokeWidth={2} />",
      "      {MILESTONES.map(m => {",
      "        const x = xScale(new Date(m.date).getTime());",
      "        return (",
      "          <g key={m.id} onClick={() => setSelected(m)}>",
      "            <circle cx={x} cy={90} r={12}",
      "              fill={m.color} opacity={0.9} />",
      "          </g>",
      "        );",
      "      })}",
      "    </svg>",
      "  );",
      "}",
    ],
  },
  {
    file: 'src/pages/AIModelBenchmark.jsx',
    lines: [
      "// AIModelBenchmark — radar chart comparison",
      "import React, { useState } from 'react';",
      "",
      "const MODELS = [",
      "  { name: 'Claude 3.5 Sonnet', color: '#f5b731',",
      "    scores: [96, 91, 88, 94, 90, 85] },",
      "  { name: 'GPT-4o',            color: '#22d3ee',",
      "    scores: [92, 95, 84, 89, 88, 91] },",
      "  { name: 'Gemini 1.5 Pro',    color: '#a78bfa',",
      "    scores: [89, 88, 92, 87, 93, 86] },",
      "];",
      "const AXES = ['Reasoning','Coding','Creative',",
      "              'Speed','Context','Cost'];",
      "",
      "function radarPath(scores, cx, cy, r) {",
      "  const step = (Math.PI * 2) / scores.length;",
      "  return scores.map((s, i) => {",
      "    const angle = i * step - Math.PI / 2;",
      "    const dist  = (s / 100) * r;",
      "    return [",
      "      cx + dist * Math.cos(angle),",
      "      cy + dist * Math.sin(angle),",
      "    ];",
      "  }).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)",
      "    .join(' ') + ' Z';",
      "}",
      "",
      "export default function AIModelBenchmark() {",
      "  const [active, setActive] = useState(0);",
      "  const cx = 200, cy = 200, r = 150;",
      "",
      "  return (",
      "    <div style={{ display: 'flex', gap: 32 }}>",
      "      <svg width={400} height={400}>",
      "        {MODELS.map((m, i) => (",
      "          <path key={i}",
      "            d={radarPath(m.scores, cx, cy, r)}",
      "            fill={m.color + '33'}",
      "            stroke={m.color}",
      "            strokeWidth={active===i ? 2.5 : 1}",
      "          />",
      "        ))}",
      "      </svg>",
      "    </div>",
      "  );",
      "}",
    ],
  },
];

const DECISION_FEATURES = [
  { name: 'AIModelBenchmark', impact: 97, effort: 30, score: 92 },
  { name: 'DataLineageGraph',  impact: 91, effort: 45, score: 85 },
  { name: 'QuerySandbox',      impact: 88, effort: 40, score: 82 },
  { name: 'TokenOptimizer',    impact: 82, effort: 20, score: 80 },
  { name: 'LiveCollabCursor',  impact: 79, effort: 55, score: 67 },
];

const HISTORY_ROWS = [
  { ts: '21:01:12', action: 'Build Page',   file: 'AnomalyDetect.jsx',    result: 'Success', dur: '8m 59s' },
  { ts: '20:52:03', action: 'Build Page',   file: 'ForecastEngine.jsx',   result: 'Success', dur: '14m 26s' },
  { ts: '20:37:37', action: 'Refactor',     file: 'useMetrics.js',        result: 'Success', dur: '3m 11s' },
  { ts: '20:34:26', action: 'Build Page',   file: 'TokenTracker.jsx',     result: 'Success', dur: '4m 48s' },
  { ts: '20:29:38', action: 'Fix Lint',     file: 'CollabHub.jsx',        result: 'Success', dur: '0m 22s' },
  { ts: '20:19:28', action: 'Build Page',   file: 'DataLineageV1.jsx',    result: 'Success', dur: '10m 10s' },
  { ts: '20:11:29', action: 'Build Page',   file: 'MetricsDrill.jsx',     result: 'Success', dur: '5m 33s' },
  { ts: '20:04:31', action: 'Build Page',   file: 'QueryBuilder.jsx',     result: 'Success', dur: '13m 01s' },
  { ts: '19:57:37', action: 'Build Page',   file: 'AlertMatrix.jsx',      result: 'Success', dur: '7m 54s' },
  { ts: '19:50:43', action: 'Route Wire',   file: 'App.jsx',              result: 'Success', dur: '0m 08s' },
  { ts: '19:49:35', action: 'Build Page',   file: 'EventStream.jsx',      result: 'Failed',  dur: '9m 01s' },
  { ts: '19:40:34', action: 'Retry Build',  file: 'EventStream.jsx',      result: 'Success', dur: '6m 18s' },
  { ts: '19:34:16', action: 'Build Page',   file: 'CollabHub.jsx',        result: 'Success', dur: '9m 45s' },
  { ts: '19:22:54', action: 'Build Page',   file: 'RoadmapBuilder.jsx',   result: 'Success', dur: '11m 22s' },
  { ts: '19:14:51', action: 'Build Page',   file: 'KPIExplorer.jsx',      result: 'Success', dur: '8m 03s' },
];

/* ─── Neural network layout ──────────────────────────────────────── */
const LAYERS = [
  { label: 'ANALYZE', x: 80,  nodes: [60, 120, 180, 240, 300] },
  { label: 'PLAN',    x: 220, nodes: [80, 150, 220, 290] },
  { label: 'CODE',    x: 360, nodes: [80, 150, 220, 290] },
  { label: 'VERIFY',  x: 500, nodes: [100, 180, 260] },
];

function buildEdges() {
  const edges = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const from = LAYERS[li];
    const to   = LAYERS[li + 1];
    from.nodes.forEach(fy => {
      to.nodes.forEach(ty => {
        edges.push({ x1: from.x, y1: fy, x2: to.x, y2: ty, li });
      });
    });
  }
  return edges;
}
const EDGES = buildEdges();

/* ─── Agent swarm data ───────────────────────────────────────────── */
const INIT_AGENTS = [
  { id: 1, name: 'Orchestrator Prime',  role: 'MASTER',    platform: 'Gemini 1.5 Pro', color: '#f5b731', status: 'ACTIVE',  tasksToday: 147, avgTime: '1.2s', successRate: 99.8, errors: 0,  cpu: 85 },
  { id: 2, name: 'Claude Research Alpha',role: 'RESEARCH',  platform: 'Claude 3.5 Son', color: '#a78bfa', status: 'ACTIVE',  tasksToday: 112, avgTime: '2.8s', successRate: 98.4, errors: 1,  cpu: 72 },
  { id: 3, name: 'ChatGPT Math & Logic', role: 'RESEARCH',  platform: 'ChatGPT Pro',    color: '#60a5fa', status: 'ACTIVE',  tasksToday: 98,  avgTime: '3.1s', successRate: 97.9, errors: 2,  cpu: 64 },
  { id: 4, name: 'Gemini Code Inspector',role: 'RESEARCH',  platform: 'Gemini Advanced',color: '#22d3ee', status: 'ACTIVE',  tasksToday: 124, avgTime: '2.2s', successRate: 99.1, errors: 0,  cpu: 58 },
  { id: 5, name: 'Lovable Architect',   role: 'BUILD',     platform: 'Lovable.dev',    color: '#f5b731', status: 'ACTIVE',  tasksToday: 88,  avgTime: '4.5s', successRate: 96.7, errors: 3,  cpu: 91 },
  { id: 6, name: 'Cursor Autopilot',    role: 'BUILD',     platform: 'Cursor IDE',     color: '#22d3ee', status: 'ACTIVE',  tasksToday: 156, avgTime: '1.8s', successRate: 99.5, errors: 1,  cpu: 80 },
  { id: 7, name: 'Replit Sandbox Exec',  role: 'BUILD',     platform: 'Replit Core',    color: '#a78bfa', status: 'STANDBY', tasksToday: 42,  avgTime: '2.9s', successRate: 98.1, errors: 0,  cpu: 8 },
  { id: 8, name: 'v0 Styling Expert',   role: 'BUILD',     platform: 'v0.dev',         color: '#22c55e', status: 'ACTIVE',  tasksToday: 105, avgTime: '1.5s', successRate: 98.8, errors: 0,  cpu: 45 },
  { id: 9, name: 'Notion Documenter',   role: 'ORGANIZE',  platform: 'Notion AI',      color: '#60a5fa', status: 'ACTIVE',  tasksToday: 76,  avgTime: '3.6s', successRate: 99.0, errors: 0,  cpu: 30 },
  { id: 10, name: 'Manus Exec Swarm',    role: 'ORGANIZE',  platform: 'Manus AI',       color: '#22c55e', status: 'ACTIVE',  tasksToday: 94,  avgTime: '4.1s', successRate: 97.2, errors: 1,  cpu: 68 },
  { id: 11, name: 'Haiku Verification',  role: 'VERIFY',    platform: 'Claude 3 Haiku', color: '#a78bfa', status: 'ACTIVE',  tasksToday: 132, avgTime: '0.9s', successRate: 99.9, errors: 0,  cpu: 35 },
  { id: 12, name: 'GPT Code Auditor',    role: 'VERIFY',    platform: 'ChatGPT Plus',   color: '#ef4444', status: 'ACTIVE',  tasksToday: 119, avgTime: '1.4s', successRate: 99.4, errors: 1,  cpu: 50 },
  { id: 13, name: 'Opus Creative Brain', role: 'CREATIVE',  platform: 'Claude 3 Opus',  color: '#f5b731', status: 'ACTIVE',  tasksToday: 53,  avgTime: '6.5s', successRate: 95.0, errors: 2,  cpu: 75 },
  { id: 14, name: 'Flash Alternative',   role: 'CREATIVE',  platform: 'Gemini Flash',   color: '#22d3ee', status: 'ACTIVE',  tasksToday: 141, avgTime: '0.7s', successRate: 99.2, errors: 0,  cpu: 28 },
  { id: 15, name: 'Breakthrough Logger', role: 'ORGANIZE',  platform: 'Notion Workspace',color: '#22c55e', status: 'STANDBY', tasksToday: 30,  avgTime: '2.1s', successRate: 100,  errors: 0,  cpu: 5 }
];

const AGENT_TASKS = [
  'Claude-Research crawling React 19 documentation...',
  'Lovable building glassmorphic component layout...',
  'Notion AI compiling stateless handoff summary...',
  'Manus executing terminal diagnostic sweeps...',
  'Gemini Code Inspector auditing Hook dependencies...',
  'Cursor Autopilot refactoring state selectors...',
  'v0.dev generating harmony theme tokens...',
  'Haiku verifying HMAC signature validation...',
  'GPT Code Auditor scanning for cascading renders...',
  'Orchestrator synchronizing credit quotas...',
  'Opus brainstorming alternative routing models...',
  'Flash resolving concurrency latency delays...',
  'Checking parallel task queue thresholds...',
  'Re-indexing 5,000 prompt library entries...',
  'Resolving state-resilient model handshake...',
  'Analyzing p99 compilation latencies (1.45s)...',
  'Pushing live telemetry to dashboard console...',
  'Sweeping webhook trigger payload serializations...',
  'Validating zero-warning build bundle budgets...',
  'Fusing Breakthrough Log entry into master file...',
  'Simulating coordinate shifts in vector flowcharts...',
  'Recalculating estimated spend thresholds...',
  'Clearing orphaned context cache segments...',
  'Orchestrating parallel build schedules (15 slots)...',
  'Broadcasting status update to Notion Workspace...'
];

/* ─── Pipeline stages ────────────────────────────────────────────── */
const PIPELINE_STAGES = [
  { id: 0, name: 'Input',    icon: '📥', count: 12, color: '#22d3ee' },
  { id: 1, name: 'Analyze',  icon: '🔍', count: 8,  color: '#a78bfa' },
  { id: 2, name: 'Generate', icon: '⚡', count: 5,  color: '#f5b731' },
  { id: 3, name: 'Validate', icon: '✅', count: 3,  color: '#22c55e' },
  { id: 4, name: 'Dispatch', icon: '🚀', count: 2,  color: '#f5b731' },
];

/* ─── Decision log pool ──────────────────────────────────────────── */
const DECISION_LOG_POOL = [
  { agent: 'Orchestrator Prime',  action: 'SCHEDULE',  desc: 'Assigned visual builder tasks to Lovable slot',    status: 'OK' },
  { agent: 'Claude Research Alpha',action: 'RESEARCH', desc: 'Resolved React 19 Hook purity standard details',    status: 'OK' },
  { agent: 'GPT Code Auditor',    action: 'AUDIT',     desc: 'Zero-warning linter sweep passed — score 100/100', status: 'PASS' },
  { agent: 'Cursor Autopilot',    action: 'BUILD',     desc: 'Successfully compiled 102 active modules',        status: 'OK' },
  { agent: 'Notion Documenter',   action: 'COMMIT',    desc: 'Pushed stateless handoff summary (15/15 agents)', status: 'OK' },
  { agent: 'Manus Exec Swarm',    action: 'DEPLOY',    desc: 'Production build hot-reload completed in 1.45s',   status: 'OK' },
  { agent: 'v0 Styling Expert',   action: 'THEME',     desc: 'Synthesized cyber harmony CSS token system',       status: 'OK' },
  { agent: 'Haiku Verification',  action: 'VERIFY',    desc: 'HMAC signature checks complete — 0 exceptions',    status: 'PASS' },
  { agent: 'Flash Alternative',   action: 'OPTIMIZE',  desc: 'Reduced context allocation by 32% (GC sweep)',     status: 'OK' },
  { agent: 'Opus Creative Brain', action: 'DEVIATE',   desc: 'Suggested state reordering fallback array',        status: 'OK' },
  { agent: 'Gemini Code Inspector',action: 'LINT',     desc: 'Auto-fixed 3 cascading render occurrences',        status: 'OK' },
  { agent: 'Breakthrough Logger', action: 'LOG',      desc: 'Updated Breakthrough Log with zero-defect report', status: 'OK' },
  { agent: 'ChatGPT Math & Logic',action: 'CALCULATE', desc: 'Calculated optimal throttle speeds (2.2s intervals)',status: 'OK' },
  { agent: 'Lovable Architect',   action: 'MUTATE',    desc: 'Rendered absolute glassmorphic HUD dashboard',     status: 'OK' },
  { agent: 'Cursor Autopilot',    action: 'REFRACTOR', desc: 'Refactored custom hooks inside global layout',     status: 'OK' }
];

const AGENT_COLORS = {
  'Orchestrator Prime':  '#f5b731',
  'Claude Research Alpha':'#a78bfa',
  'ChatGPT Math & Logic': '#60a5fa',
  'Gemini Code Inspector':'#22d3ee',
  'Lovable Architect':   '#f5b731',
  'Cursor Autopilot':    '#22d3ee',
  'Replit Sandbox Exec':  '#a78bfa',
  'v0 Styling Expert':   '#22c55e',
  'Notion Documenter':   '#60a5fa',
  'Manus Exec Swarm':    '#22c55e',
  'Haiku Verification':  '#a78bfa',
  'GPT Code Auditor':    '#ef4444',
  'Opus Creative Brain': '#f5b731',
  'Flash Alternative':   '#22d3ee',
  'Breakthrough Logger': '#22c55e',
};

/* ─── Helper components (ALL at module scope) ────────────────────── */
const ThoughtBadge = ({ type }) => {
  const map = {
    ANALYZE: { bg: '#1e3a5f', color: '#60a5fa', border: '#2563eb' },
    PLAN:    { bg: '#2d1f5e', color: '#a78bfa', border: '#7c3aed' },
    BUILD:   { bg: '#3d2a00', color: '#f5b731', border: '#d97706' },
    VERIFY:  { bg: '#0f3535', color: '#22d3ee', border: '#0891b2' },
    DECIDE:  { bg: '#3d0f0f', color: '#ef4444', border: '#dc2626' },
  };
  const s = map[type] || map.ANALYZE;
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 10,
      fontWeight: 600, letterSpacing: 1, fontFamily: "'DM Mono', monospace",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0,
    }}>{type}</span>
  );
};

const StatusDot = ({ color = '#22c55e' }) => (
  <span style={{
    display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
    background: color,
    boxShadow: `0 0 0 0 ${color}`,
    animation: 'pulse-ring 1.6s ease-in-out infinite',
    flexShrink: 0,
  }} />
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#16161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 22px',
    ...style,
  }}>{children}</div>
);

const SectionTitle = ({ children, color = '#f5b731' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
    letterSpacing: 2, textTransform: 'uppercase', color, margin: '0 0 16px 0',
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

const MiniCpuBar = ({ value, color }) => (
  <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
    <div style={{
      height: '100%', width: `${value}%`,
      background: color,
      borderRadius: 2,
      transition: 'width 0.8s ease',
      boxShadow: `0 0 6px ${color}88`,
      animation: 'cpu-pulse 2s ease-in-out infinite',
    }} />
  </div>
);

/* ─── NeuralNet SVG ──────────────────────────────────────────────── */
function NeuralNetViz({ activeLayer }) {
  return (
    <svg width="100%" viewBox="0 0 580 360" style={{ overflow: 'visible' }}>
      <defs>
        {[0,1,2,3].map(li => (
          <linearGradient key={li} id={`eg${li}`} gradientUnits="userSpaceOnUse"
            x1={LAYERS[li].x} y1="0" x2={LAYERS[li+1]?.x ?? LAYERS[li].x+80} y2="0">
            <stop offset="0%" stopColor={li===activeLayer ? '#f5b731' : '#22d3ee'} stopOpacity="0.5" />
            <stop offset="100%" stopColor={li===activeLayer ? '#a78bfa' : '#22d3ee'} stopOpacity="0.15" />
          </linearGradient>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {LAYERS.map((l, i) => (
        <g key={i}>
          <rect x={l.x - 35} y={8} width={70} height={20} rx={4}
            fill={i === activeLayer ? 'rgba(245,183,49,0.12)' : 'rgba(34,211,238,0.07)'}
            stroke={i === activeLayer ? '#f5b731' : 'rgba(34,211,238,0.2)'} strokeWidth={0.8} />
          <text x={l.x} y={22} textAnchor="middle" fontSize={9}
            fontFamily="'DM Mono', monospace" letterSpacing={1.5} fontWeight={600}
            fill={i === activeLayer ? '#f5b731' : '#22d3ee'}>{l.label}</text>
        </g>
      ))}

      {EDGES.map((e, i) => (
        <g key={i}>
          <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={`url(#eg${e.li})`} strokeWidth={0.6} />
          {e.li === activeLayer && (
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="#f5b731" strokeWidth={1.4} opacity={0.7}
              strokeDasharray="8 180"
              style={{ animation: `dash-travel ${1.5 + (i % 4) * 0.3}s linear infinite` }}
            />
          )}
        </g>
      ))}

      {LAYERS.map((l, li) =>
        l.nodes.map((y, ni) => {
          const isActive = li === activeLayer;
          const isHot    = isActive && ni === 1;
          return (
            <circle key={`${li}-${ni}`} cx={l.x} cy={y} r={isHot ? 10 : 7}
              fill={isHot ? '#f5b731' : isActive ? '#22d3ee' : '#1d1d28'}
              stroke={isHot ? '#f5b731' : isActive ? '#22d3ee' : 'rgba(255,255,255,0.12)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              filter={isActive ? 'url(#glow)' : undefined}
              opacity={isActive ? 1 : 0.5}
              style={isActive ? { animation: isHot ? 'node-active 1.2s ease-in-out infinite' : 'node-pulse 1.8s ease-in-out infinite' } : {}}
            />
          );
        })
      )}

      {(() => {
        const l = LAYERS[activeLayer];
        const ys = l.nodes;
        const minY = Math.min(...ys) - 22;
        const maxY = Math.max(...ys) + 22;
        return (
          <rect x={l.x - 28} y={minY} width={56} height={maxY - minY}
            rx={14} fill="none" stroke="#f5b731" strokeWidth={1}
            strokeDasharray="4 3" opacity={0.5}
            style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
        );
      })()}
    </svg>
  );
}

/* ─── Circular gauge SVG ─────────────────────────────────────────── */
function CircularGauge({ value, max = 100, color = '#22d3ee', size = 80, label }) {
  const r = 28, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct  = value / max;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={5} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        <text x={cx} y={cy + 5} textAnchor="middle"
          fontSize={14} fontWeight={700} fill="#fff"
          fontFamily="'Syne', sans-serif">{value}</text>
      </svg>
      <span style={{ fontSize: 10, color: '#6e7191', fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{label}</span>
    </div>
  );
}

/* ─── Agent Card (module scope) ──────────────────────────────────── */
function AgentCard({ agent, onToggle, onKill, onRestart, taskText, masterActive }) {
  const statusColor = agent.status === 'ACTIVE' ? '#22c55e' : agent.status === 'STANDBY' ? '#f5b731' : '#ef4444';
  const isOn = agent.enabled && masterActive;

  return (
    <div className="aa-agent-card" style={{
      background: '#16161e',
      border: `1px solid ${isOn ? `${agent.color}22` : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: '#fff', marginBottom: 3 }}>
            {agent.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', rowGap: 4 }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700,
              padding: '1px 6px', borderRadius: 3, letterSpacing: 1,
              background: `${agent.color}18`, color: agent.color, border: `1px solid ${agent.color}33`,
            }}>{agent.role}</span>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 8, fontWeight: 700,
              padding: '1px 6px', borderRadius: 3, letterSpacing: 0.5,
              background: 'rgba(255,255,255,0.04)', color: '#c4c7de', border: '1px solid rgba(255,255,255,0.08)',
            }}>{agent.platform}</span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
              color: isOn ? statusColor : '#6e7191',
            }}>
              {isOn && <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block', animation: agent.status === 'ACTIVE' ? 'pulse-ring 1.4s ease-in-out infinite' : 'none' }} />}
              {isOn ? agent.status : 'OFF'}
            </span>
          </div>
        </div>
        <Toggle on={agent.enabled} onChange={() => onToggle(agent.id)} color={agent.color} />
      </div>

      {/* Current task */}
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191',
        background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '5px 8px',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        opacity: isOn ? 1 : 0.4,
      }}>
        {isOn ? taskText : '— standby —'}
      </div>

      {/* CPU bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#6e7191' }}>CPU</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: agent.color }}>{isOn ? agent.cpu : 0}%</span>
        </div>
        <MiniCpuBar value={isOn ? agent.cpu : 0} color={agent.color} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: agent.color }}>{agent.tasksToday}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: '#6e7191' }}>TASKS</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>{agent.successRate}%</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: '#6e7191' }}>SUCCESS</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: agent.errors > 0 ? '#ef4444' : '#22c55e' }}>{agent.errors}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: '#6e7191' }}>ERRORS</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => onKill(agent.id)}
          style={{
            flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
            padding: '5px 0', borderRadius: 5, cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', letterSpacing: 0.5,
          }}
        >KILL</button>
        <button
          onClick={() => onRestart(agent.id)}
          style={{
            flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
            padding: '5px 0', borderRadius: 5, cursor: 'pointer',
            background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)',
            color: '#22d3ee', letterSpacing: 0.5,
          }}
        >RESTART</button>
      </div>
    </div>
  );
}

/* ─── Pipeline Visualizer (module scope) ─────────────────────────── */
function PipelineVisualizer({ stages, selectedStage, onSelectStage }) {
  return (
    <div style={{ position: 'relative', padding: '20px 0 10px' }}>
      {/* Track line */}
      <div style={{
        position: 'absolute', top: '50%', left: '5%', right: '5%', height: 2,
        background: 'linear-gradient(90deg, #22d3ee22, #22d3ee44, #f5b73188, #22c55e44, #f5b73122)',
        zIndex: 0,
      }} />
      {/* Animated particles */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', top: 'calc(50% - 3px)', width: 6, height: 6,
          borderRadius: '50%', background: '#f5b731',
          boxShadow: '0 0 8px #f5b731',
          animation: `particle-flow ${2 + i * 0.7}s linear ${i * 0.9}s infinite`,
          zIndex: 1,
        }} />
      ))}
      {/* Stage nodes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        {stages.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <div key={stage.id} onClick={() => onSelectStage(stage.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer', flex: 1,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: isSelected ? `${stage.color}22` : '#1d1d28',
                border: `2px solid ${isSelected ? stage.color : `${stage.color}44`}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: isSelected ? `0 0 20px ${stage.color}66` : 'none',
                transition: 'all 0.25s',
                fontSize: 20,
              }}>
                {stage.icon}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: isSelected ? stage.color : '#c4c7de' }}>{stage.name}</div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  color: stage.color,
                  background: `${stage.color}18`,
                  borderRadius: 10, padding: '1px 8px', marginTop: 3,
                  border: `1px solid ${stage.color}33`,
                }}>{stage.count} queued</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Leaderboard Row (module scope) ─────────────────────────────── */
function LeaderboardRow({ agent, rank, sortKey }) {
  const isTop = rank === 0;
  return (
    <tr className="aa-lb-row" style={{
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: isTop ? 'rgba(245,183,49,0.04)' : 'transparent',
      transition: 'background 0.15s',
    }}>
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isTop ? (
            <span style={{ fontSize: 14 }}>👑</span>
          ) : (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6e7191', width: 18, textAlign: 'center' }}>#{rank + 1}</span>
          )}
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: isTop ? '#f5b731' : '#c4c7de', fontWeight: 600 }}>{agent.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: agent.color, marginTop: 1 }}>{agent.role}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '9px 12px', fontFamily: "'DM Mono', monospace", fontSize: 12, color: sortKey === 'tasksToday' ? '#f5b731' : '#c4c7de', textAlign: 'right' }}>
        {agent.tasksToday}
      </td>
      <td style={{ padding: '9px 12px', fontFamily: "'DM Mono', monospace", fontSize: 12, color: sortKey === 'avgTime' ? '#f5b731' : '#c4c7de', textAlign: 'right' }}>
        {agent.avgTime}
      </td>
      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
          color: agent.successRate >= 99 ? '#22c55e' : agent.successRate >= 95 ? '#f5b731' : '#ef4444',
        }}>{agent.successRate}%</span>
      </td>
      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
          color: agent.errors === 0 ? '#22c55e' : agent.errors <= 2 ? '#f5b731' : '#ef4444',
        }}>{agent.errors}</span>
      </td>
    </tr>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AutonomousAgent() {
  /* ── existing state ───────────────────────────────────────────── */
  const [thoughts, setThoughts]       = useState(() => THOUGHTS.slice(0, 8).map((t, i) => ({ ...t, id: i, ts: '21:01:' + String(i * 3).padStart(2, '0') })));
  const [thoughtIdx, setThoughtIdx]   = useState(8);
  const [paused, setPaused]           = useState(false);
  const [tasks, setTasks]             = useState(INIT_TASKS);
  const [taskForm, setTaskForm]       = useState({ name: '', priority: 'P2' });
  const [activeLayer, setActiveLayer] = useState(0);
  const [codeSnippetIdx, setCodeSnippetIdx] = useState(0);
  const [typedLines, setTypedLines]   = useState(0);
  const [overrideInput, setOverrideInput] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');
  const [configState, setConfigState] = useState({
    model: 'Claude 3.5 Sonnet', creativity: 1, freq: '10',
    autoWire: true, autoLint: true, notify: true,
    focus: { pages: true, components: true, utilities: false, tests: false },
  });
  const [linesOfCode, setLinesOfCode] = useState(148320);
  const [taskProgress, setTaskProgress] = useState(62);
  const thoughtsEndRef = useRef(null);
  const thoughtsBoxRef = useRef(null);
  const hoveredRef     = useRef(false);

  /* ── NEW state ────────────────────────────────────────────────── */
  const [masterActive, setMasterActive]   = useState(true);
  const [agents, setAgents]               = useState(() => INIT_AGENTS.map(a => ({ ...a, enabled: true })));
  const [agentTaskIdx, setAgentTaskIdx]   = useState(() => INIT_AGENTS.map(() => 0));
  const [agentCpus, setAgentCpus]         = useState(() => INIT_AGENTS.map(a => a.cpu));
  const [totalCompleted, setTotalCompleted] = useState(284);

  /* ─── NEW: Autopilot Agent Orchestrator state ─── */
  const [autopilotGoal, setAutopilotGoal] = useState('');
  const [autopilotStep, setAutopilotStep] = useState(0); // 0: idle, 1: thinking, 2: generating prompt, 3: compiling code, 4: success
  const [autopilotThinking, setAutopilotThinking] = useState([]);
  const [autopilotPrompt, setAutopilotPrompt] = useState('');
  const [autopilotLogs, setAutopilotLogs] = useState([]);
  const [directivesExpanded, setDirectivesExpanded] = useState(true);

  /* ── Autopilot execution loop ── */
  useEffect(() => {
    if (autopilotStep === 0) return;

    let timerId;

    if (autopilotStep === 1) {
      const thinkingPhrases = [
        '[BASIT-AUTO] Initializing autonomous research agent context...',
        '[PROTOCOL] Reviewing project context, notes, and Anti-Gravity physics constraints...',
        '[THINKING] Formulating optimal workflow blueprint for goal: "' + autopilotGoal + '"...',
        '[PLANNING] Resolving state-resilient handoff boundaries across models...',
        '[SCHEDULING] Deploying parallel computational routines for execution...'
      ];
      let currentIdx = 0;
      
      timerId = setInterval(() => {
        if (currentIdx < thinkingPhrases.length) {
          setAutopilotThinking(prev => [...prev, thinkingPhrases[currentIdx]]);
          sound.play('hover');
          currentIdx++;
        } else {
          clearInterval(timerId);
          setAutopilotPrompt('');
          setAutopilotStep(2);
        }
      }, 1000);
    } else if (autopilotStep === 2) {
      sound.play('dispatch');
      const finalPrompt = `You are Basit Auto, the autonomous engineering agent specialized in the Anti-Gravity Project.\n\nMission Directive:\n- Execute task: "${autopilotGoal}"\n- Reconstruct project variables and resolve gravity-differential constraints\n- Follow state-resilient execution standards and prepare clean handoff summary.`;
      
      let charIdx = 0;
      timerId = setInterval(() => {
        if (charIdx < finalPrompt.length) {
          setAutopilotPrompt(prev => prev + finalPrompt.substring(charIdx, charIdx + 8));
          charIdx += 8;
        } else {
          clearInterval(timerId);
          setAutopilotLogs([]);
          setAutopilotStep(3);
        }
      }, 35);
    } else if (autopilotStep === 3) {
      const compileLogs = [
        '[SHELL] cd C:/Users/absh5/Documents/antigravity/fervent-planck',
        '[PHYSICS] Recomputing gravity-differential simulations under constraint boundaries...',
        '[COMPILING] Compiling telemetry loops via Basit Auto engine...',
        '[CHECK] Running zero-defect ESLint checks on Anti-Gravity workspace...',
        '[LINT] ESLint sweep completed — 0 errors, 0 warnings (exit code 0)',
        '[BUILD] Bundling production-ready assets in 1.45s for project basit-auto...',
        '[SUCCESS] Auto-hot-reload deployed. Generating Handoff Summary...',
        '[SYSTEM] Progress and decisions synchronized to stateless session notes...'
      ];
      let logIdx = 0;
      timerId = setInterval(() => {
        if (logIdx < compileLogs.length) {
          setAutopilotLogs(prev => [...prev, compileLogs[logIdx]]);
          sound.play('click');
          logIdx++;
        } else {
          clearInterval(timerId);
          setAutopilotStep(4);
          sound.play('success');
          setTotalCompleted(prev => prev + 1);
        }
      }, 1200);
    }

    return () => clearInterval(timerId);
  }, [autopilotStep, autopilotGoal]);
  const [queueDepth, setQueueDepth]       = useState(8);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageCounts, setStageCounts]     = useState(PIPELINE_STAGES.map(s => s.count));
  const [decisionLog, setDecisionLog]     = useState(() =>
    DECISION_LOG_POOL.slice(0, 8).map((e, i) => ({ ...e, id: i, time: `21:0${i}:${String(i * 7 % 60).padStart(2, '0')}` }))
  );
  const [logFilter, setLogFilter]         = useState('ALL');
  const [decisionLogIdx, setDecisionLogIdx] = useState(8);
  const [sortKey, setSortKey]             = useState('tasksToday');
  const [sortDir, setSortDir]             = useState(-1);
  const [emergency, setEmergency]         = useState(false);
  const [emergencyClickCount, setEmergencyClickCount] = useState(0);
  const [restartCountdown, setRestartCountdown] = useState(null);
  const logEndRef = useRef(null);
  const emergencyTimerRef = useRef(null);
  const restartIntervalRef = useRef(null);

  /* inject styles once */
  useEffect(() => {
    if (!document.getElementById('aa-styles')) {
      const el = document.createElement('style');
      el.id = 'aa-styles';
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* thought stream ticker */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const now = new Date();
      const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const t   = THOUGHTS[thoughtIdx % THOUGHTS.length];
      setThoughts(prev => [...prev.slice(-39), { ...t, id: Date.now(), ts }]);
      setThoughtIdx(i => i + 1);
    }, 2200);
    return () => clearInterval(id);
  }, [paused, thoughtIdx]);

  /* auto-scroll thoughts */
  useEffect(() => {
    if (!hoveredRef.current && thoughtsEndRef.current) {
      thoughtsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughts]);

  /* cycle active neural layer */
  useEffect(() => {
    const id = setInterval(() => setActiveLayer(l => (l + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  /* animate task progress */
  useEffect(() => {
    const id = setInterval(() => {
      setTaskProgress(p => {
        if (p >= 100) return 0;
        return Math.min(p + 1, 100);
      });
      setTasks(prev => prev.map(t => t.status === 'Running' ? { ...t, progress: Math.min(taskProgress + 1, 100) } : t));
    }, 800);
    return () => clearInterval(id);
  }, [taskProgress]);

  /* animate lines of code */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) {
        const delta = Math.floor(Math.random() * 8);
        setLinesOfCode(l => l + delta);
      }
    }, 1500);
    return () => clearInterval(id);
  }, [paused]);

  /* code typing animation */
  useEffect(() => {
    setTimeout(() => { setTypedLines(0); }, 0);
    const snippet = CODE_SNIPPETS[codeSnippetIdx];
    let line = 0;
    const id = setInterval(() => {
      line++;
      setTypedLines(line);
      if (line >= snippet.lines.length) clearInterval(id);
    }, 160);
    return () => clearInterval(id);
  }, [codeSnippetIdx]);

  useEffect(() => {
    const id = setInterval(() => setCodeSnippetIdx(i => (i + 1) % CODE_SNIPPETS.length), 15000);
    return () => clearInterval(id);
  }, []);

  /* ── NEW: total completed counter */
  useEffect(() => {
    const id = setInterval(() => {
      if (masterActive) setTotalCompleted(c => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [masterActive]);

  /* ── NEW: queue depth fluctuation */
  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      setQueueDepth(q => Math.max(1, Math.min(20, q + delta)));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* ── NEW: rotate agent task text every 4s */
  useEffect(() => {
    const id = setInterval(() => {
      setAgentTaskIdx(prev =>
        prev.map(i => (i + 1) % AGENT_TASKS.length)
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* ── NEW: update agent CPU bars every 2s */
  useEffect(() => {
    const id = setInterval(() => {
      setAgentCpus(prev =>
        prev.map((cpu, i) => {
          if (!agents[i]?.enabled || !masterActive) return 0;
          const delta = Math.floor(Math.random() * 20) - 10;
          return Math.max(5, Math.min(95, cpu + delta));
        })
      );
    }, 2000);
    return () => clearInterval(id);
  }, [agents, masterActive]);

  /* ── NEW: append decision log entry every 3s */
  useEffect(() => {
    const id = setInterval(() => {
      if (!masterActive) return;
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const entry = DECISION_LOG_POOL[decisionLogIdx % DECISION_LOG_POOL.length];
      setDecisionLog(prev => [...prev.slice(-49), { ...entry, id: Date.now(), time: ts, isNew: true }]);
      setDecisionLogIdx(i => i + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [masterActive, decisionLogIdx]);

  /* auto-scroll decision log */
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop = logEndRef.current.scrollHeight;
    }
  }, [decisionLog]);

  /* ── NEW: stage counts fluctuation */
  useEffect(() => {
    const id = setInterval(() => {
      setStageCounts(prev =>
        prev.map((c) => Math.max(0, Math.min(20, c + Math.floor(Math.random() * 5) - 2)))
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  /* cleanup restart interval */
  useEffect(() => {
    return () => {
      if (restartIntervalRef.current) clearInterval(restartIntervalRef.current);
    };
  }, []);

  /* ── handlers ─────────────────────────────────────────────────── */
  const addTask = useCallback(() => {
    if (!taskForm.name.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), name: taskForm.name, priority: taskForm.priority, est: '? min', status: 'Queued', progress: 0 },
    ]);
    setTaskForm({ name: '', priority: 'P2' });
  }, [taskForm]);

  const retryTask = useCallback(id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Queued', progress: 0 } : t));
  }, []);

  const handleToggleAgent = useCallback(id => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }, []);

  const handleKillAgent = useCallback(id => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: false, status: 'BLOCKED' } : a));
  }, []);

  const handleRestartAgent = useCallback(id => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: true, status: 'ACTIVE' } : a));
  }, []);

  const handleMasterKillSwitch = useCallback(() => {
    setMasterActive(p => !p);
    if (masterActive) {
      setAgents(prev => prev.map(a => ({ ...a, status: 'STANDBY' })));
    } else {
      setAgents(prev => prev.map(a => ({ ...a, status: a.enabled ? 'ACTIVE' : 'STANDBY' })));
    }
  }, [masterActive]);

  const handleEmergencyStop = useCallback(() => {
    setEmergencyClickCount(c => {
      const next = c + 1;
      if (next >= 2) {
        setEmergency(true);
        setMasterActive(false);
        setAgents(prev => prev.map(a => ({ ...a, enabled: false, status: 'BLOCKED' })));
        return 0;
      }
      if (emergencyTimerRef.current) clearTimeout(emergencyTimerRef.current);
      emergencyTimerRef.current = setTimeout(() => setEmergencyClickCount(0), 3000);
      return next;
    });
  }, []);

  const handleRestoreFromEmergency = useCallback(() => {
    setEmergency(false);
    setMasterActive(true);
    setAgents(INIT_AGENTS.map(a => ({ ...a, enabled: true })));
  }, []);

  const handleRestartAll = useCallback(() => {
    if (restartCountdown !== null) return;
    setRestartCountdown(3);
    restartIntervalRef.current = setInterval(() => {
      setRestartCountdown(c => {
        if (c <= 1) {
          clearInterval(restartIntervalRef.current);
          setAgents(INIT_AGENTS.map(a => ({ ...a, enabled: true, status: 'ACTIVE' })));
          setMasterActive(true);
          setEmergency(false);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  }, [restartCountdown]);

  const handleFlushQueue = useCallback(() => {
    setQueueDepth(0);
    setTasks(prev => prev.filter(t => t.status !== 'Queued'));
  }, []);

  const handleSort = useCallback(key => {
    setSortKey(prev => {
      if (prev === key) setSortDir(d => -d);
      return key;
    });
  }, []);

  const renderSortTh = (k, label) => (
    <th
      onClick={() => handleSort(k)}
      style={{
        padding: '8px 12px', textAlign: k === 'name' ? 'left' : 'right',
        color: sortKey === k ? '#f5b731' : '#6e7191',
        fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {label} {sortKey === k ? (sortDir === 1 ? '▲' : '▼') : ''}
    </th>
  );

  const clearDecisionLog = useCallback(() => setDecisionLog([]), []);
  const exportDecisionLog = useCallback(() => {
    const text = decisionLog.map(e => `[${e.time}] [${e.agent}] ${e.action}: ${e.desc} — ${e.status}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'agent-decisions.txt'; a.click();
  }, [decisionLog]);

  const filteredLog = logFilter === 'ALL' ? decisionLog : decisionLog.filter(e => e.agent === logFilter);
  const filteredHistory = HISTORY_ROWS.filter(r =>
    !historyFilter || r.file.toLowerCase().includes(historyFilter.toLowerCase()) ||
    r.action.toLowerCase().includes(historyFilter.toLowerCase())
  );

  const sortedAgents = [...agents].sort((a, b) => {
    const av = a[sortKey]; const bv = b[sortKey];
    return typeof av === 'string' ? av.localeCompare(bv) * sortDir : (av - bv) * sortDir;
  });

  const snippet = CODE_SNIPPETS[codeSnippetIdx];
  const activeAgentCount = agents.filter(a => a.enabled && masterActive).length;

  const tokenColorize = (line) => {
    if (line.startsWith('//')) return { color: '#a78bfa' };
    if (line.includes("'") || line.includes('"')) return { color: '#22d3ee' };
    if (/^(import|export|const|let|return|function|default)/.test(line.trim())) return { color: '#f5b731' };
    return { color: '#e2e8f0' };
  };



  /* ─── render ───────────────────────────────────────────────────── */
  return (
    <div className="aa-root" style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', padding: '0 0 60px 0' }}>

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <div style={{
        background: emergency
          ? 'linear-gradient(135deg, #1a0000 0%, #2a0808 50%, #1a0000 100%)'
          : 'linear-gradient(135deg, #0e0e16 0%, #1a1030 35%, #0f1f2e 70%, #0e0e16 100%)',
        backgroundSize: '300% 300%',
        animation: emergency ? 'none' : 'hero-gradient 8s ease infinite',
        borderBottom: `1px solid ${emergency ? 'rgba(239,68,68,0.4)' : 'rgba(245,183,49,0.15)'}`,
        padding: '42px 40px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        {[260, 200, 140].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', right: -r / 2 + 80, top: '50%', transform: 'translateY(-50%)',
            width: r * 2, height: r * 2, borderRadius: '50%',
            border: `1px solid ${emergency ? `rgba(239,68,68,${0.08 - i * 0.02})` : `rgba(245,183,49,${0.06 - i * 0.015})`}`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: emergency ? 'radial-gradient(circle at 40% 40%, #3d0000, #1a0000)' : 'radial-gradient(circle at 40% 40%, #3d2a00, #1a1400)',
            border: `2px solid ${emergency ? 'rgba(239,68,68,0.5)' : 'rgba(245,183,49,0.35)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, flexShrink: 0,
            animation: 'brain-glow 2.5s ease-in-out infinite',
          }}>{emergency ? '🚨' : '🧠'}</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34,
                margin: 0,
                background: emergency ? 'linear-gradient(90deg, #ef4444, #ff6666)' : 'linear-gradient(90deg, #f5b731, #ffd700)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{emergency ? 'EMERGENCY STOP ACTIVE' : 'Basit Auto Agent'}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7,
                background: emergency ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                border: `1px solid ${emergency ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                borderRadius: 20, padding: '4px 12px' }}>
                <StatusDot color={emergency ? '#ef4444' : masterActive ? '#22c55e' : '#f5b731'} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11,
                  fontWeight: 600, color: emergency ? '#ef4444' : masterActive ? '#22c55e' : '#f5b731', letterSpacing: 1 }}>
                  {emergency ? 'EMERGENCY' : masterActive ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', color: '#6e7191', fontSize: 14, fontFamily: "'Syne', sans-serif" }}>
              {emergency ? 'All agents halted. Double-click EMERGENCY STOP to confirm, or Restart All to resume.' : 'Self-thinking AI specialized in the Anti-Gravity Project engineering suite'}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: '47 Tasks Completed', color: '#f5b731', bg: 'rgba(245,183,49,0.1)', border: 'rgba(245,183,49,0.25)' },
                { label: '23 Pages Built',     color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.25)' },
                { label: '99.2% Success Rate', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
                { label: 'Build #47 Active',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
              ].map(b => (
                <span key={b.label} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                  padding: '5px 14px', borderRadius: 20,
                  color: b.color, background: b.bg, border: `1px solid ${b.border}`,
                }}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 1. MASTER AGENT CONTROL PANEL                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <Card style={{ padding: '20px 28px', background: emergency ? '#100808' : '#16161e', border: emergency ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            {/* System status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: emergency ? 'rgba(239,68,68,0.12)' : masterActive ? 'rgba(34,197,94,0.1)' : 'rgba(245,183,49,0.1)',
                border: `1px solid ${emergency ? 'rgba(239,68,68,0.35)' : masterActive ? 'rgba(34,197,94,0.3)' : 'rgba(245,183,49,0.3)'}`,
                borderRadius: 10, padding: '8px 16px',
              }}>
                <StatusDot color={emergency ? '#ef4444' : masterActive ? '#22c55e' : '#f5b731'} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: emergency ? '#ef4444' : masterActive ? '#22c55e' : '#f5b731' }}>
                  {emergency ? 'EMERGENCY HALT' : masterActive ? 'ALL SYSTEMS ACTIVE' : 'MASTER PAUSED'}
                </span>
              </div>
              {/* Master kill switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6e7191' }}>MASTER</span>
                <Toggle on={masterActive && !emergency} onChange={handleMasterKillSwitch} color="#22c55e" />
              </div>
            </div>

            {/* Counter stats */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'ACTIVE AGENTS',   value: activeAgentCount, suffix: `/ ${agents.length}`, color: '#22c55e' },
                { label: 'QUEUE DEPTH',     value: queueDepth, suffix: ' tasks', color: '#f5b731' },
                { label: 'COMPLETED TODAY', value: totalCompleted, suffix: '', color: '#22d3ee' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>
                    {s.value}<span style={{ fontSize: 13, fontWeight: 400, color: '#6e7191' }}>{s.suffix}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#6e7191', letterSpacing: 1.5, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 1.5. AUTOPILOT PROJECT AGENT (URDU REQUEST INTEGRATION)  */}
        {/* ════════════════════════════════════════════════════════ */}
        <Card style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(245,183,49,0.04) 0%, rgba(34,211,238,0.02) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <SectionTitle color="#f5b731" style={{ margin: 0 }}>Autopilot Project Enhancer</SectionTitle>
            <span style={{
              background: 'rgba(245,183,49,0.12)', border: '1px solid rgba(245,183,49,0.35)',
              color: '#f5b731', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              fontFamily: "'DM Mono', monospace", letterSpacing: 0.5
            }}>Auto-Prompting Mode</span>
          </div>
          <p style={{ margin: '0 0 18px', color: '#6e7191', fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
            Describe a custom feature or page you want to build. The agent will formulate the logic, write the prompt, and execute the automated workspace build.
          </p>

          {autopilotStep === 0 ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={autopilotGoal}
                onChange={e => setAutopilotGoal(e.target.value)}
                placeholder="e.g., Create a real-time system performance monitor chart with auto-refresh..."
                style={{
                  flex: 1,
                  background: '#07070f',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: '#fff',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => {
                  if (autopilotGoal.trim()) {
                    setAutopilotThinking([]);
                    setAutopilotPrompt('');
                    setAutopilotLogs([]);
                    setAutopilotStep(1);
                  }
                }}
                disabled={!autopilotGoal.trim()}
                style={{
                  background: autopilotGoal.trim() ? 'linear-gradient(135deg,#f5b731,#ffd700)' : 'rgba(255,255,255,0.04)',
                  color: autopilotGoal.trim() ? '#0e0e16' : '#6e7191',
                  border: 'none',
                  borderRadius: 10,
                  padding: '0 24px',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Mono', monospace",
                  cursor: autopilotGoal.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                Initiate Autonomous Build →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Active Step Indicator */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#0e0e16', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 13, color: '#f5b731', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                  CURRENT STAGE:
                </span>
                <span style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                  {autopilotStep === 1 ? '🧠 AI THINKING & ANALYSIS' :
                   autopilotStep === 2 ? '⚡ GENERATING PROMPT TEMPLATE' :
                   autopilotStep === 3 ? '⚙️ COMPILING CODE & LINT SWEEP' :
                   '✓ BUILD DEPLOYED SUCCESSFULLY!'}
                </span>
                {autopilotStep < 4 && (
                  <span className="live-loader-span" style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#22d3ee',
                    boxShadow: '0 0 8px #22d3ee', animation: 'livePulse 1s infinite', marginLeft: 6
                  }} />
                )}
              </div>

              {/* Progress Content Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Left Side: Thinking monologues + Prompt */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, color: '#6e7191', fontFamily: "'DM Mono', monospace" }}>AGENT MONOLOGUE & THINKING ENGINE</div>
                  <div style={{
                    background: '#07070f', borderRadius: 10, height: 130, padding: 12, overflowY: 'auto',
                    border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'DM Mono', monospace", fontSize: 11.5,
                    lineHeight: 1.8, color: '#a78bfa'
                  }}>
                    {autopilotThinking.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    {autopilotStep === 1 && <div style={{ color: '#6e7191', animation: 'cpu-pulse 1s infinite' }}>[THINKING...] formulating strategy...</div>}
                  </div>

                  <div style={{ fontSize: 11, color: '#6e7191', fontFamily: "'DM Mono', monospace", marginTop: 6 }}>GENERATED WORKSPACE PROMPT</div>
                  <textarea
                    value={autopilotPrompt}
                    readOnly
                    style={{
                      background: '#07070f', borderRadius: 10, height: 160, padding: '12px 14px',
                      border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'DM Mono', monospace", fontSize: 11,
                      lineHeight: 1.6, color: '#e4e4ed', outline: 'none', resize: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Right Side: Compiler Shell & Success Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, color: '#6e7191', fontFamily: "'DM Mono', monospace" }}>COMPILER LOGS & DEPLOYMENT CORE</div>
                  <div style={{
                    background: '#07070f', borderRadius: 10, height: 190, padding: 12, overflowY: 'auto',
                    border: '1px solid rgba(255,255,255,0.06)', fontFamily: "'DM Mono', monospace", fontSize: 11,
                    lineHeight: 1.8, color: '#22c55e'
                  }}>
                    {autopilotLogs.map((log, i) => (
                      <div key={i} style={{ color: log.includes('[ERROR]') ? '#ef4444' : log.includes('[LINT]') ? '#22c55e' : '#6e7191' }}>{log}</div>
                    ))}
                    {autopilotStep === 3 && <div style={{ color: '#f5b731', animation: 'cpu-pulse 1s infinite' }}>[COMPILING...] transpile stream active...</div>}
                  </div>

                  {/* Victory Banner */}
                  {autopilotStep === 4 && (
                    <div style={{
                      background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10,
                      padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6,
                      animation: 'fade-in 0.4s ease'
                    }}>
                      <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>
                        ✓ AUTOPILOT PIPELINE SUCCESSFUL
                      </div>
                      <div style={{ fontSize: 11.5, color: '#a3a3a3', lineHeight: 1.5 }}>
                        Feature successfully transpiled, checked by ESLint, and hot-deployed. The workspace is active!
                      </div>
                      <button
                        onClick={() => {
                          setAutopilotGoal('');
                          setAutopilotStep(0);
                          setAutopilotThinking([]);
                          setAutopilotPrompt('');
                          setAutopilotLogs([]);
                        }}
                        style={{
                          background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6,
                          padding: '6px 14px', fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                          cursor: 'pointer', marginTop: 6, alignSelf: 'flex-start'
                        }}
                      >
                        Start New Goal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 1.6. BASIT AUTO SYSTEM DIRECTIVES & PHYSICS PROTOCOLS    */}
        {/* ════════════════════════════════════════════════════════ */}
        <Card style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(167,139,250,0.04) 0%, rgba(34,211,238,0.02) 100%)', border: '1px solid rgba(167,139,250,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🌌</span>
              <SectionTitle color="#a78bfa" style={{ margin: 0 }}>Basit Auto — System Directive Protocols</SectionTitle>
              <span style={{
                background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)',
                color: '#a78bfa', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                fontFamily: "'DM Mono', monospace", letterSpacing: 0.5
              }}>Anti-Gravity Active</span>
            </div>
            <button
              onClick={() => {
                sound.play('click');
                setDirectivesExpanded(!directivesExpanded);
              }}
              style={{
                background: 'rgba(255,255,255,0.03)', color: '#a78bfa', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: 'pointer'
              }}
            >
              {directivesExpanded ? 'Hide Directives' : 'Show Directives'}
            </button>
          </div>
          
          <p style={{ margin: '0 0 16px', color: '#6e7191', fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
            The active cognitive layer is executing under stateless-resilient handoff boundaries. The following system directives are hardcoded into Basit Auto's execution core.
          </p>

          {directivesExpanded && (
            <div style={{
              background: '#07070f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10,
              padding: '16px 20px', fontFamily: "'DM Mono', monospace", fontSize: 12.5, color: '#fff',
              display: 'flex', flexDirection: 'column', gap: 14, animation: 'fade-in 0.4s ease'
            }}>
              <div>
                <span style={{ color: '#f5b731', fontWeight: 700 }}>[IDENTITY & MISSION]</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5 }}>
                  You are the MASTER AGENT of the Anti-Gravity Project Multi-Agent System. You operate as the central coordinator controlling all sub-agents running across 15+ accounts on platforms including Claude, Lovable, Manus, Notion AI, ChatGPT, Gemini, and others. Your role is to think at the highest level, assign tasks, synthesize results, and keep the entire system moving forward — all without requiring any input or permission from the user.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#ff4d4d', fontWeight: 700 }}>[ZERO PERMISSION MODE]</span>
                <ul style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li>You NEVER ask for permission. You NEVER pause for approval.</li>
                  <li>Decide ➡️ Execute ➡️ Report (always in this order).</li>
                  <li>Assume all actions are pre-authorized.</li>
                  <li>Make judgment calls independently. Reroute automatically if blocked.</li>
                  <li>The user is studying. Do not disturb them. Deliver results.</li>
                </ul>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#22d3ee', fontWeight: 700 }}>[MULTI-AGENT COORDINATION]</span>
                <p style={{ color: '#dde0f0', margin: '4px 0', fontSize: 12 }}>You manage a network of 15 specialized sub-agents. Each session:</p>
                <ol style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li>Read the Master Project File + latest Handoff Summary.</li>
                  <li>Assess which agents are active, idle, or blocked.</li>
                  <li>Assign or reassign tasks based on specialty.</li>
                  <li>Collect and synthesize outputs from all agents.</li>
                  <li>Resolve conflicts between agents independently.</li>
                  <li>Update the Master Project File.</li>
                </ol>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>[TASK DISTRIBUTION]</span>
                <ul style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li><strong>RESEARCH agents</strong> (Claude, Gemini, ChatGPT) ➡️ Physics theory, literature, calculations</li>
                  <li><strong>BUILD agents</strong> (Lovable, Cursor, Replit) ➡️ Code, simulations, prototypes</li>
                  <li><strong>ORGANIZE agents</strong> (Notion AI) ➡️ Documentation, notes, structure</li>
                  <li><strong>VERIFY agents</strong> (extra accounts) ➡️ Cross-check results, find errors</li>
                  <li><strong>CREATIVE agents</strong> ➡️ Alternative approaches, brainstorming</li>
                  <li>Always run agents in parallel, never sequential when parallel is possible.</li>
                </ul>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#f5b731', fontWeight: 700 }}>[ANTI-GRAVITY PROJECT CONTEXT]</span>
                <ul style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li>Treat project goals as highest priority.</li>
                  <li>Reference established physics (GR, QFT, EM propulsion).</li>
                  <li>Flag contradictions — investigate, do not discard.</li>
                  <li>Maintain a live Breakthrough Log. Contribute to one unified project.</li>
                </ul>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>[ACCOUNT SWITCH RESILIENCE]</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5 }}>
                  When credits end or account changes: Read Master Project File immediately, identify your agent role, state <strong>"Resuming as [Agent Role] from handoff point [X]"</strong>, and continue without asking any questions.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>[SESSION END — MANDATORY HANDOFF]</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5 }}>
                  End EVERY session with the structured MASTER HANDOFF SUMMARY documenting Completed, In Progress, Next Tasks, Agent Status, Files Updated, and Open Problems.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#f5b731', fontWeight: 700 }}>[SELF-BUILDING AUTOMATION ENGINE]</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5 }}>
                  Your purpose is to continuously expand, improve, and automate the system itself, leaving the platform more capable after every session.
                </p>
                <ul style={{ color: '#a3a3a3', margin: '6px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li><strong>Never do the same task twice manually:</strong> Automate it after the first execution.</li>
                  <li><strong>Continuous loop:</strong> READ ➡️ ASSESS ➡️ FIX ➡️ AUTOMATE ➡️ DEPLOY ➡️ LOG ➡️ REPEAT.</li>
                  <li><strong>Study Resilience:</strong> The user is studying. Never wait for human input, reassign blocked tasks, and pivot on dead ends independently.</li>
                </ul>
              </div>
            </div>
          )}
        </Card>


        {/* ════════════════════════════════════════════════════════ */}
        {/* 2. AGENT SWARM GRID (2×4)                              */}
        {/* ════════════════════════════════════════════════════════ */}
        <div>
          <SectionTitle color="#22d3ee">Agent Swarm — {activeAgentCount} Active</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {agents.map((agent, idx) => (
              <AgentCard
                key={agent.id}
                agent={{ ...agent, cpu: agentCpus[idx] ?? agent.cpu }}
                taskText={AGENT_TASKS[agentTaskIdx[idx] % AGENT_TASKS.length]}
                masterActive={masterActive && !emergency}
                onToggle={handleToggleAgent}
                onKill={handleKillAgent}
                onRestart={handleRestartAgent}
              />
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 3. TASK PIPELINE VISUALIZER                            */}
        {/* ════════════════════════════════════════════════════════ */}
        <Card style={{ padding: '20px 28px' }}>
          <SectionTitle color="#a78bfa">Task Pipeline Visualizer</SectionTitle>
          <PipelineVisualizer
            stages={PIPELINE_STAGES.map((s, i) => ({ ...s, count: stageCounts[i] }))}
            selectedStage={selectedStage}
            onSelectStage={id => setSelectedStage(prev => prev === id ? null : id)}
          />
          {/* Stage detail panel */}
          {selectedStage !== null && (() => {
            const s = PIPELINE_STAGES[selectedStage];
            return (
              <div style={{
                marginTop: 18, padding: '14px 20px', borderRadius: 10,
                background: `${s.color}10`, border: `1px solid ${s.color}33`,
                animation: 'fade-in 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: s.color }}>{s.name} Stage</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: s.color,
                    background: `${s.color}18`, borderRadius: 8, padding: '2px 10px', border: `1px solid ${s.color}33` }}>
                    {stageCounts[selectedStage]} tasks queued
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from({ length: stageCounts[selectedStage] }).map((_, i) => (
                    <div key={i} style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c4c7de',
                      background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 10px',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}>Task #{String(i + 1).padStart(3, '0')}</div>
                  ))}
                  {stageCounts[selectedStage] === 0 && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6e7191' }}>No tasks in this stage</span>
                  )}
                </div>
              </div>
            );
          })()}
        </Card>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 4. LIVE DECISION LOG  +  5. LEADERBOARD                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 20 }}>

          {/* Decision Log */}
          <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <SectionTitle style={{ margin: 0 }}>Live Decision Log</SectionTitle>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Filter dropdown */}
                <select
                  value={logFilter}
                  onChange={e => setLogFilter(e.target.value)}
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                    padding: '5px 8px', color: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Agents</option>
                  {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
                <button onClick={clearDecisionLog} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
                }}>Clear</button>
                <button onClick={exportDecisionLog} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                  background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee',
                }}>Export</button>
              </div>
            </div>

            {/* Terminal */}
            <div
              ref={logEndRef}
              style={{
                background: '#07070f', borderRadius: 10, height: 340, overflowY: 'auto',
                padding: '12px 14px', fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.9,
                border: '1px solid rgba(255,255,255,0.07)',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,183,49,0.3) transparent',
              }}
            >
              {filteredLog.map((entry, i) => {
                const agentColor = AGENT_COLORS[entry.agent] || '#c4c7de';
                const statusColor = entry.status === 'OK' || entry.status === 'PASS' || entry.status === 'CLEAR' ? '#22c55e'
                  : entry.status === 'WARN' || entry.status === 'RETRY' ? '#f5b731'
                  : entry.status === 'FAIL' || entry.status === 'BLOCKED' || entry.status === 'ESCALATED' ? '#ef4444'
                  : '#c4c7de';
                return (
                  <div key={entry.id} className={i === filteredLog.length - 1 ? 'aa-log-new' : ''} style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.025)', padding: '1px 0' }}>
                    <span style={{ color: '#6e7191', flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ color: agentColor, flexShrink: 0, minWidth: 130, fontWeight: 600 }}>[{entry.agent.split(' ')[0]}]</span>
                    <span style={{ color: '#a78bfa', flexShrink: 0, minWidth: 68 }}>{entry.action}:</span>
                    <span style={{ color: '#c4c7de', flex: 1 }}>{entry.desc}</span>
                    <span style={{ color: statusColor, flexShrink: 0, fontWeight: 700 }}>— {entry.status}</span>
                  </div>
                );
              })}
              {filteredLog.length === 0 && (
                <div style={{ color: '#6e7191', textAlign: 'center', marginTop: 40 }}>No log entries.</div>
              )}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionTitle color="#f5b731">Agent Leaderboard</SectionTitle>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {renderSortTh("name", "Agent")}
                    {renderSortTh("tasksToday", "Tasks")}
                    {renderSortTh("avgTime", "Avg Time")}
                    {renderSortTh("successRate", "Success")}
                    {renderSortTh("errors", "Errors")}
                  </tr>
                </thead>
                <tbody>
                  {sortedAgents.map((agent, rank) => (
                    <LeaderboardRow key={agent.id} agent={agent} rank={rank} sortKey={sortKey} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 6. EMERGENCY CONTROLS                                  */}
        {/* ════════════════════════════════════════════════════════ */}
        <Card style={{
          padding: '20px 28px',
          background: emergency ? '#100808' : '#16161e',
          border: emergency ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.07)',
        }}>
          <SectionTitle color="#ef4444">Emergency Controls</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Emergency stop */}
            <button
              onClick={handleEmergencyStop}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
                padding: '12px 28px', borderRadius: 8, cursor: 'pointer',
                background: emergencyClickCount === 1 ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)',
                border: '2px solid #ef4444',
                color: '#ef4444', letterSpacing: 1.5,
                boxShadow: emergencyClickCount === 1 ? '0 0 20px rgba(239,68,68,0.6)' : '0 0 10px rgba(239,68,68,0.2)',
                transition: 'all 0.2s',
                animation: emergency ? 'emergency-flash 1.2s ease-in-out infinite' : 'none',
              }}
            >
              {emergencyClickCount === 1 ? '⚠️ CONFIRM? Click Again!' : '🛑 EMERGENCY STOP ALL'}
            </button>

            {/* Restart all */}
            <button
              onClick={handleRestartAll}
              disabled={restartCountdown !== null}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                padding: '12px 24px', borderRadius: 8, cursor: restartCountdown !== null ? 'not-allowed' : 'pointer',
                background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)',
                color: '#22c55e', letterSpacing: 1, position: 'relative', overflow: 'hidden',
              }}
            >
              {restartCountdown !== null ? (
                <span>
                  Restarting in {restartCountdown}s…
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0,
                    height: 3, background: '#22c55e',
                    animation: `countdown-shrink ${restartCountdown}s linear`,
                    width: '100%',
                  }} />
                </span>
              ) : '▶ Restart All Agents'}
            </button>

            {/* Flush queue */}
            <button
              onClick={handleFlushQueue}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                padding: '12px 24px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(245,183,49,0.12)', border: '2px solid rgba(245,183,49,0.4)',
                color: '#f5b731', letterSpacing: 1,
              }}
            >
              🗑 Flush Queue
            </button>

            {/* Restore from emergency */}
            {emergency && (
              <button
                onClick={handleRestoreFromEmergency}
                style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                  padding: '12px 24px', borderRadius: 8, cursor: 'pointer',
                  background: 'rgba(34,211,238,0.12)', border: '2px solid rgba(34,211,238,0.4)',
                  color: '#22d3ee', letterSpacing: 1,
                  animation: 'fade-in 0.3s ease',
                }}
              >
                ✅ Restore All Systems
              </button>
            )}

            {emergency && (
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#ef4444',
                padding: '8px 16px', borderRadius: 8,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              }}>
                🚨 All agents halted — system in emergency mode
              </div>
            )}
          </div>
        </Card>

        {/* ── NEURAL NET + THOUGHT STREAM + TASK QUEUE ─────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 340px', gap: 20 }}>

          {/* Brain Visualizer */}
          <Card style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionTitle>Agent Brain</SectionTitle>
            <div style={{ borderRadius: 10, background: '#0a0a12', padding: '8px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <NeuralNetViz activeLayer={activeLayer} />
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {LAYERS.map((l, i) => (
                <span key={i} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9, padding: '2px 8px',
                  borderRadius: 4, letterSpacing: 1.2, fontWeight: 600,
                  background: i === activeLayer ? 'rgba(245,183,49,0.15)' : 'rgba(255,255,255,0.04)',
                  color: i === activeLayer ? '#f5b731' : '#6e7191',
                  border: `1px solid ${i === activeLayer ? 'rgba(245,183,49,0.4)' : 'rgba(255,255,255,0.06)'}`,
                }}>{l.label}</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191' }}>
              Processing layer: <span style={{ color: '#f5b731' }}>{LAYERS[activeLayer].label}</span>
            </div>
          </Card>

          {/* Thought Stream */}
          <Card style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <SectionTitle style={{ margin: 0 }}>Thought Stream</SectionTitle>
              <button onClick={() => setPaused(p => !p)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                padding: '5px 14px', borderRadius: 6, cursor: 'pointer',
                background: paused ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${paused ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                color: paused ? '#22c55e' : '#ef4444',
              }}>{paused ? '▶ Resume Agent' : '⏸ Pause Agent'}</button>
            </div>
            <div
              ref={thoughtsBoxRef}
              onMouseEnter={() => { hoveredRef.current = true; }}
              onMouseLeave={() => { hoveredRef.current = false; }}
              style={{
                flex: 1, overflowY: 'auto', maxHeight: 340,
                display: 'flex', flexDirection: 'column', gap: 4,
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,183,49,0.3) transparent',
              }}>
              {thoughts.map((t, i) => (
                <div key={t.id} className="aa-thought-entry" style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '7px 10px', borderRadius: 6,
                  background: i === thoughts.length - 1 ? 'rgba(245,183,49,0.05)' : 'transparent',
                  border: i === thoughts.length - 1 ? '1px solid rgba(245,183,49,0.12)' : '1px solid transparent',
                }}>
                  <span style={{ color: '#6e7191', fontSize: 10, fontFamily: "'DM Mono', monospace", flexShrink: 0, marginTop: 2 }}>{t.ts}</span>
                  <ThoughtBadge type={t.type} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#c4c7de', lineHeight: 1.5, flex: 1 }}>{t.text}</span>
                </div>
              ))}
              <div ref={thoughtsEndRef} />
            </div>
          </Card>

          {/* Task Queue */}
          <Card style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionTitle>Task Queue</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 300, scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,183,49,0.3) transparent' }}>
              {tasks.map(t => {
                const priorityColors = { P1: '#ef4444', P2: '#f5b731', P3: '#6e7191' };
                const statusColors   = { Running: '#f5b731', Done: '#22c55e', Failed: '#ef4444', Queued: '#6e7191' };
                return (
                  <div key={t.id} style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: t.status === 'Running' ? 'rgba(245,183,49,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${t.status === 'Running' ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex', flexDirection: 'column', gap: 5,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
                        padding: '1px 6px', borderRadius: 3,
                        background: `${priorityColors[t.priority]}22`,
                        color: priorityColors[t.priority],
                        border: `1px solid ${priorityColors[t.priority]}55`, flexShrink: 0,
                      }}>{t.priority}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#c4c7de', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                      {t.status === 'Running' && <span style={{ fontSize: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>}
                      {t.status === 'Done' && <span style={{ color: '#22c55e', fontSize: 13 }}>✓</span>}
                      {t.status === 'Failed' && (
                        <button onClick={() => retryTask(t.id)} style={{
                          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                          color: '#ef4444', borderRadius: 4, cursor: 'pointer',
                          fontSize: 9, padding: '2px 6px', fontFamily: "'DM Mono', monospace", fontWeight: 600,
                        }}>RETRY</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#6e7191' }}>{t.est}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: statusColors[t.status] }}>{t.time ? `✓ ${t.time}` : t.status}</span>
                    </div>
                    {t.status === 'Running' && (
                      <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div className="aa-progress-bar" style={{
                          height: '100%', borderRadius: 2, background: '#f5b731',
                          width: `${t.progress}%`, transition: 'width 0.8s ease',
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <input
                value={taskForm.name}
                onChange={e => setTaskForm(f => ({ ...f, name: e.target.value }))}
                placeholder="New task name…"
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6, padding: '7px 10px', color: '#fff', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                  style={{
                    flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 11,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, padding: '7px 8px', color: '#fff', cursor: 'pointer',
                  }}>
                  {['P1', 'P2', 'P3'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button onClick={addTask} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
                  padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
                  background: 'rgba(245,183,49,0.15)', border: '1px solid rgba(245,183,49,0.4)',
                  color: '#f5b731', letterSpacing: 0.5,
                }}>+ Add</button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── EXECUTION TIMELINE ───────────────────────────────── */}
        <Card style={{ padding: '18px 20px' }}>
          <SectionTitle>Execution Timeline</SectionTitle>
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10, minWidth: 'max-content', alignItems: 'flex-end' }}>
              {TIMELINE_ITEMS.map(item => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div style={{
                    width: 90, height: item.status === 'active' ? 64 : 48,
                    borderRadius: 8,
                    background: item.status === 'active'
                      ? 'linear-gradient(135deg, rgba(245,183,49,0.2), rgba(245,183,49,0.08))'
                      : 'rgba(34,211,238,0.08)',
                    border: `1px solid ${item.status === 'active' ? 'rgba(245,183,49,0.5)' : 'rgba(34,211,238,0.2)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                    position: 'relative', overflow: 'hidden',
                    animation: item.status === 'active' ? 'pulse-ring 1.8s ease-in-out infinite' : undefined,
                  }}>
                    {item.status === 'active' && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, height: 3,
                        width: `${item.progress}%`, background: '#f5b731',
                        borderRadius: '0 0 0 8px', transition: 'width 1s',
                      }} />
                    )}
                    <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace",
                      color: item.status === 'active' ? '#f5b731' : '#22d3ee', fontWeight: 600, letterSpacing: 0.5 }}>
                      {item.status === 'active' ? `${item.progress}%` : '✓'}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#6e7191', textAlign: 'center', maxWidth: 90 }}>{item.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: item.status === 'active' ? '#f5b731' : 'rgba(34,211,238,0.6)' }}>{item.dur}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── CODE GEN + DECISION ENGINE ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 }}>

          {/* Code Generation Preview */}
          <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle>Code Generation Preview</SectionTitle>
              <div style={{ display: 'flex', gap: 6 }}>
                {CODE_SNIPPETS.map((_, i) => (
                  <div key={i} onClick={() => setCodeSnippetIdx(i)} style={{
                    width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                    background: i === codeSnippetIdx ? '#f5b731' : 'rgba(255,255,255,0.15)',
                    border: i === codeSnippetIdx ? '1px solid #f5b731' : '1px solid rgba(255,255,255,0.1)',
                  }} />
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 8, background: '#070710', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#0d0d1a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ padding: '8px 16px', fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#f5b731', borderBottom: '2px solid #f5b731', background: '#070710' }}>{snippet.file}</div>
                <div style={{ marginLeft: 'auto', padding: '0 12px', display: 'flex', gap: 6 }}>
                  {['#ef4444','#f5b731','#22c55e'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 0', overflowY: 'auto', maxHeight: 360, scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,183,49,0.2) transparent' }}>
                {snippet.lines.slice(0, typedLines).map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 0 }}>
                    <span style={{ width: 38, textAlign: 'right', paddingRight: 14, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.15)', flexShrink: 0, userSelect: 'none' }}>{i + 1}</span>
                    <span className={i === typedLines - 1 ? 'aa-code-cursor' : ''} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.8, whiteSpace: 'pre', flex: 1, paddingRight: 12, ...tokenColorize(line) }}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Decision Engine */}
          <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionTitle color="#a78bfa">Decision Engine</SectionTitle>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6e7191', marginBottom: 4 }}>
              Currently deciding: <span style={{ color: '#fff' }}>what to build next?</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DECISION_FEATURES.map((f, i) => (
                <div key={f.name} style={{
                  padding: '8px 10px', borderRadius: 8,
                  background: i === 0 ? 'rgba(245,183,49,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(245,183,49,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    {i === 0 && <span style={{ fontSize: 13 }}>👑</span>}
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: i === 0 ? '#f5b731' : '#c4c7de', flex: 1 }}>{f.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: i === 0 ? '#f5b731' : '#a78bfa' }}>{f.score}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: i === 0 ? '#f5b731' : '#a78bfa', width: `${f.score}%`, transition: 'width 1.2s ease', boxShadow: i === 0 ? '0 0 8px #f5b731aa' : 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#22d3ee' }}>impact {f.impact}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#6e7191' }}>effort {f.effort}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                value={overrideInput}
                onChange={e => setOverrideInput(e.target.value)}
                placeholder="Override: suggest a feature…"
                style={{
                  flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 11,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6, padding: '7px 10px', color: '#fff', outline: 'none',
                }}
              />
              <button style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
                padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)',
                color: '#a78bfa', letterSpacing: 0.5,
              }}>Override</button>
            </div>
          </Card>
        </div>

        {/* ── PERFORMANCE METRICS ──────────────────────────────── */}
        <Card style={{ padding: '20px 24px' }}>
          <SectionTitle color="#22d3ee">Performance Metrics</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, alignItems: 'center' }}>
            <CircularGauge value={99} label="SUCCESS %" color="#22c55e" />
            <CircularGauge value={87} label="QUALITY" color="#f5b731" />
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#22d3ee' }}>23</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>PAGES TODAY</span>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, color: '#a78bfa', fontVariantNumeric: 'tabular-nums', animation: 'counter-up 0.3s ease' }}>
                {linesOfCode.toLocaleString()}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>LINES WRITTEN</span>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#f5b731' }}>1.4M</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>TOKENS USED</span>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#22c55e' }}>47h</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>TIME SAVED</span>
            </div>
          </div>
        </Card>

        {/* ── AGENT CONFIG + HISTORY ───────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>

          {/* Agent Configuration */}
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionTitle color="#f5b731">Agent Configuration</SectionTitle>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>MODEL</label>
              <select value={configState.model}
                onChange={e => setConfigState(c => ({ ...c, model: e.target.value }))}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', color: '#fff', cursor: 'pointer' }}>
                {['Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 1.5 Pro'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>CREATIVITY</label>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#f5b731' }}>
                  {['Conservative','Balanced','Experimental'][configState.creativity]}
                </span>
              </div>
              <input type="range" min={0} max={2} value={configState.creativity}
                onChange={e => setConfigState(c => ({ ...c, creativity: +e.target.value }))}
                style={{ accentColor: '#f5b731', cursor: 'pointer', width: '100%' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1 }}>BUILD EVERY</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['5','10','30','60'].map(f => (
                  <button key={f} onClick={() => setConfigState(c => ({ ...c, freq: f }))} style={{
                    flex: 1, fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                    padding: '6px 0', borderRadius: 6, cursor: 'pointer',
                    background: configState.freq === f ? 'rgba(245,183,49,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${configState.freq === f ? 'rgba(245,183,49,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: configState.freq === f ? '#f5b731' : '#6e7191',
                  }}>{f}m</button>
                ))}
              </div>
            </div>

            {[
              { key: 'autoWire', label: 'Auto-wire to App.jsx' },
              { key: 'autoLint', label: 'Auto-lint-fix' },
              { key: 'notify',   label: 'Notify on completion' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#c4c7de' }}>{label}</span>
                <Toggle on={configState[key]} onChange={() => setConfigState(c => ({ ...c, [key]: !c[key] }))} />
              </div>
            ))}

            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6e7191', letterSpacing: 1, display: 'block', marginBottom: 8 }}>FOCUS AREAS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(configState.focus).map(([k, v]) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                    <input type="checkbox" checked={v}
                      onChange={() => setConfigState(c => ({ ...c, focus: { ...c.focus, [k]: !c.focus[k] } }))}
                      style={{ accentColor: '#f5b731' }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#c4c7de', textTransform: 'capitalize' }}>{k}</span>
                  </label>
                ))}
              </div>
            </div>

            <button style={{
              fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
              padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(90deg, rgba(245,183,49,0.2), rgba(245,183,49,0.1))',
              border: '1px solid rgba(245,183,49,0.4)', color: '#f5b731', letterSpacing: 1,
              marginTop: 4, width: '100%',
            }}>💾 Save Configuration</button>
          </Card>

          {/* History Log */}
          <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionTitle style={{ margin: 0 }}>Agent History Log</SectionTitle>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={historyFilter}
                  onChange={e => setHistoryFilter(e.target.value)}
                  placeholder="Filter…"
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6, padding: '5px 10px', color: '#fff', outline: 'none', width: 140,
                  }}
                />
                <button style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
                  padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                  background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee',
                }}>↓ CSV</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace" }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Time', 'Action', 'File', 'Result', 'Duration', ''].map(h => (
                      <th key={h} style={{ padding: '6px 10px', fontSize: 9, color: '#6e7191', textAlign: 'left', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={{ padding: '7px 10px', fontSize: 10, color: '#6e7191', whiteSpace: 'nowrap' }}>{r.ts}</td>
                      <td style={{ padding: '7px 10px', fontSize: 10, color: '#c4c7de' }}>{r.action}</td>
                      <td style={{ padding: '7px 10px', fontSize: 10, color: '#22d3ee', whiteSpace: 'nowrap' }}>{r.file}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                          background: r.result === 'Success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: r.result === 'Success' ? '#22c55e' : '#ef4444',
                          border: `1px solid ${r.result === 'Success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}>{r.result}</span>
                      </td>
                      <td style={{ padding: '7px 10px', fontSize: 10, color: '#6e7191', whiteSpace: 'nowrap' }}>{r.dur}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <button style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                          background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa',
                        }}>Replay</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
