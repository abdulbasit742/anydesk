import { useState, useCallback, useRef } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const SWIMLANES = ['Infrastructure', 'AI Features', 'UX Polish', 'Integrations', 'Security'];
const QUARTERS = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
const STATUSES = ['Done', 'In Progress', 'Planned', 'Blocked'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const OWNERS = [
  { name: 'Alex K.', avatar: 'AK', color: '#f5b731' },
  { name: 'Sam R.', avatar: 'SR', color: '#22d3ee' },
  { name: 'Jordan M.', avatar: 'JM', color: '#a78bfa' },
  { name: 'Casey T.', avatar: 'CT', color: '#60a5fa' },
  { name: 'Morgan L.', avatar: 'ML', color: '#f97316' },
];

const STATUS_COLORS = {
  'Done': '#22d3ee',
  'In Progress': '#f5b731',
  'Planned': '#6e7191',
  'Blocked': '#ef4444',
};

const PRIORITY_COLORS = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#f5b731',
  'Low': '#6e7191',
};

const CATEGORY_COLORS = {
  'Product': '#a78bfa',
  'Tech': '#22d3ee',
  'Design': '#f97316',
  'Marketing': '#22c55e',
};

// 12-month Gantt feature items (start/end = 0-11 month indices)
const GANTT_FEATURES = [
  { id: 'g1', title: 'Core Platform v2', category: 'Tech', start: 0, end: 2, milestone: 2 },
  { id: 'g2', title: 'AI Model Suite', category: 'Product', start: 1, end: 5, milestone: 5 },
  { id: 'g3', title: 'Design System 3.0', category: 'Design', start: 0, end: 3, milestone: 3 },
  { id: 'g4', title: 'Brand Refresh Campaign', category: 'Marketing', start: 3, end: 5, milestone: null },
  { id: 'g5', title: 'Auto-Scaling Infra', category: 'Tech', start: 2, end: 7, milestone: 7 },
  { id: 'g6', title: 'Enterprise SSO', category: 'Tech', start: 5, end: 8, milestone: 8 },
  { id: 'g7', title: 'Mobile App v1', category: 'Product', start: 6, end: 10, milestone: 10 },
  { id: 'g8', title: 'Partner Integrations', category: 'Marketing', start: 8, end: 11, milestone: 11 },
];

const GANTT_MILESTONES = [
  { month: 2, label: 'Platform Launch' },
  { month: 5, label: 'AI Beta' },
  { month: 8, label: 'Enterprise GA' },
  { month: 11, label: 'EOY Release' },
];

// Epic dependency graph (6 epics)
const EPICS = [
  { id: 'e1', title: 'Core API v2', x: 80, y: 80, status: 'Done' },
  { id: 'e2', title: 'Auth & SSO', x: 280, y: 40, status: 'In Progress' },
  { id: 'e3', title: 'AI Engine', x: 480, y: 80, status: 'In Progress' },
  { id: 'e4', title: 'Data Pipeline', x: 80, y: 220, status: 'Planned' },
  { id: 'e5', title: 'Dashboard UI', x: 280, y: 220, status: 'Planned' },
  { id: 'e6', title: 'Mobile Apps', x: 480, y: 220, status: 'Planned' },
];

// Edges: [from, to, isCritical]
const EPIC_EDGES = [
  ['e1', 'e2', true],
  ['e1', 'e4', false],
  ['e2', 'e3', true],
  ['e3', 'e6', true],
  ['e4', 'e5', false],
  ['e5', 'e6', false],
];

const INITIAL_RELEASES = [
  {
    id: 'r1', version: 'v1.0', name: 'Foundation', date: 'Mar 2026', status: 'Released',
    features: [
      { id: 'f1', name: 'Core API v2', pts: 34 },
      { id: 'f2', name: 'Auth Middleware', pts: 21 },
      { id: 'f3', name: 'Basic Dashboard', pts: 13 },
    ],
  },
  {
    id: 'r2', version: 'v1.1', name: 'AI Boost', date: 'Jun 2026', status: 'In Progress',
    features: [
      { id: 'f4', name: 'GPT-4 Integration', pts: 21 },
      { id: 'f5', name: 'Prompt Library', pts: 13 },
    ],
  },
  {
    id: 'r3', version: 'v2.0', name: 'Enterprise', date: 'Sep 2026', status: 'Planned',
    features: [
      { id: 'f6', name: 'Enterprise SSO', pts: 34 },
      { id: 'f7', name: 'Audit Logs', pts: 8 },
    ],
  },
  {
    id: 'r4', version: 'v3.0', name: 'Platform', date: 'Dec 2026', status: 'Planned',
    features: [
      { id: 'f8', name: 'Mobile App v1', pts: 55 },
      { id: 'f9', name: 'Partner API', pts: 21 },
    ],
  },
];

const INITIAL_OKRS = [
  {
    id: 'o1', objective: 'Achieve market leadership in AI developer tools',
    quarter: 'Q2 2026',
    krs: [
      { id: 'k1', text: 'Reach 10k active users', progress: 72 },
      { id: 'k2', text: 'NPS score ≥ 50', progress: 85 },
      { id: 'k3', text: 'Ship 3 flagship AI features', progress: 67 },
    ],
  },
  {
    id: 'o2', objective: 'Build a world-class engineering culture',
    quarter: 'Q2 2026',
    krs: [
      { id: 'k4', text: 'Reduce P1 incident MTTR to < 30min', progress: 60 },
      { id: 'k5', text: '80%+ test coverage across all services', progress: 78 },
      { id: 'k6', text: 'Deploy 2x/day with zero downtime', progress: 50 },
    ],
  },
  {
    id: 'o3', objective: 'Expand into enterprise segment',
    quarter: 'Q2 2026',
    krs: [
      { id: 'k7', text: 'Close 5 enterprise contracts', progress: 40 },
      { id: 'k8', text: 'Complete SOC2 Type II audit', progress: 90 },
      { id: 'k9', text: 'Launch partner marketplace', progress: 20 },
    ],
  },
];

const INITIAL_MILESTONES = [
  { id: 1, title: 'Core API v2 Launch', lane: 'Infrastructure', quarter: 'Q1 2025', status: 'Done', owner: 0, priority: 'Critical', tags: ['API', 'Launch'], startQ: 0, endQ: 1 },
  { id: 2, title: 'GPT-4 Integration', lane: 'AI Features', quarter: 'Q1 2025', status: 'Done', owner: 1, priority: 'High', tags: ['AI', 'GPT'], startQ: 0, endQ: 0 },
  { id: 3, title: 'Dark Mode UI Overhaul', lane: 'UX Polish', quarter: 'Q2 2025', status: 'Done', owner: 2, priority: 'Medium', tags: ['UI', 'Design'], startQ: 1, endQ: 2 },
  { id: 4, title: 'Slack & Teams Connector', lane: 'Integrations', quarter: 'Q2 2025', status: 'Done', owner: 3, priority: 'High', tags: ['Slack', 'Teams'], startQ: 1, endQ: 1 },
  { id: 5, title: 'SOC2 Type II Audit', lane: 'Security', quarter: 'Q3 2025', status: 'Done', owner: 4, priority: 'Critical', tags: ['SOC2', 'Audit'], startQ: 2, endQ: 3 },
  { id: 6, title: 'Auto-Scaling Infra', lane: 'Infrastructure', quarter: 'Q3 2025', status: 'In Progress', owner: 0, priority: 'High', tags: ['Scale', 'k8s'], startQ: 2, endQ: 4 },
  { id: 7, title: 'Claude 3.5 Fine-tuning', lane: 'AI Features', quarter: 'Q3 2025', status: 'In Progress', owner: 1, priority: 'Critical', tags: ['Claude', 'Fine-tune'], startQ: 2, endQ: 3 },
  { id: 8, title: 'Prompt Flow Builder', lane: 'UX Polish', quarter: 'Q4 2025', status: 'In Progress', owner: 2, priority: 'High', tags: ['Builder', 'UX'], startQ: 3, endQ: 4 },
  { id: 9, title: 'Zapier Connector', lane: 'Integrations', quarter: 'Q4 2025', status: 'Planned', owner: 3, priority: 'Medium', tags: ['Zapier'], startQ: 3, endQ: 4 },
  { id: 10, title: 'Zero-Trust Auth', lane: 'Security', quarter: 'Q4 2025', status: 'Planned', owner: 4, priority: 'Critical', tags: ['Auth', 'Zero-Trust'], startQ: 3, endQ: 5 },
  { id: 11, title: 'Edge CDN Network', lane: 'Infrastructure', quarter: 'Q1 2026', status: 'Planned', owner: 0, priority: 'Medium', tags: ['CDN', 'Edge'], startQ: 4, endQ: 5 },
  { id: 12, title: 'Multi-modal AI Engine', lane: 'AI Features', quarter: 'Q1 2026', status: 'Planned', owner: 1, priority: 'Critical', tags: ['Vision', 'Audio'], startQ: 4, endQ: 6 },
  { id: 13, title: 'Accessibility Audit', lane: 'UX Polish', quarter: 'Q2 2026', status: 'Planned', owner: 2, priority: 'High', tags: ['A11y', 'WCAG'], startQ: 5, endQ: 5 },
  { id: 14, title: 'Enterprise SSO', lane: 'Security', quarter: 'Q2 2026', status: 'Planned', owner: 4, priority: 'High', tags: ['SSO', 'SAML'], startQ: 5, endQ: 6 },
  { id: 15, title: 'Salesforce Bridge', lane: 'Integrations', quarter: 'Q3 2026', status: 'Planned', owner: 3, priority: 'High', tags: ['CRM', 'SF'], startQ: 6, endQ: 7 },
  { id: 16, title: 'Quantum-Ready Encryption', lane: 'Security', quarter: 'Q3 2026', status: 'Blocked', owner: 4, priority: 'Medium', tags: ['Quantum', 'Crypto'], startQ: 6, endQ: 7 },
];

const DEPENDENCIES = [
  { from: 1, to: 6 },
  { from: 2, to: 7 },
  { from: 7, to: 12 },
  { from: 5, to: 10 },
  { from: 10, to: 14 },
];

// ─── Sub-components (all at module scope) ────────────────────────────────────

function MilestoneCard({ ms, onDragStart, onClick }) {
  const [hovered, setHovered] = useState(false);
  const owner = OWNERS[ms.owner];
  return (
    <div
      onMouseDown={() => onDragStart(ms)}
      onClick={() => onClick(ms)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#202030' : '#16161e',
        border: `1px solid ${hovered ? STATUS_COLORS[ms.status] : `${STATUS_COLORS[ms.status]}40`}`,
        borderLeft: `3px solid ${STATUS_COLORS[ms.status]}`,
        borderRadius: 8, padding: '8px 10px', cursor: 'grab', userSelect: 'none',
        marginBottom: 6, transition: 'all 0.15s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 5 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.3, flex: 1 }}>{ms.title}</div>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 3,
          background: PRIORITY_COLORS[ms.priority],
          boxShadow: `0 0 6px ${PRIORITY_COLORS[ms.priority]}80`,
        }} title={ms.priority} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ms.tags.map(t => (
            <span key={t} style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 4,
              background: 'rgba(255,255,255,0.05)', color: '#6e7191',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: owner.color, color: '#000', fontSize: 8, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{owner.avatar}</div>
      </div>
      <div style={{ marginTop: 5 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
          background: `${STATUS_COLORS[ms.status]}20`, color: STATUS_COLORS[ms.status],
          border: `1px solid ${STATUS_COLORS[ms.status]}40`,
        }}>{ms.status}</span>
      </div>
    </div>
  );
}

function NewMilestoneModal({ onClose, onAdd, quarters }) {
  const [form, setForm] = useState({
    title: '', lane: SWIMLANES[0], quarter: quarters[0],
    status: 'Planned', owner: 0, priority: 'Medium', tags: '',
    startQ: 0, endQ: 0,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      startQ: quarters.indexOf(form.quarter),
      endQ: quarters.indexOf(form.quarter),
    });
    onClose();
  };
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 480, background: '#16161e', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20 }}>✦ New Milestone</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</div>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e4e4ed', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          {[['Swimlane', 'lane', SWIMLANES], ['Status', 'status', STATUSES], ['Priority', 'priority', PRIORITIES], ['Quarter', 'quarter', quarters]].map(([label, key, opts]) => (
            <div key={key}>
              <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <select value={form[key]} onChange={e => set(key, e.target.value)} style={{
                width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '8px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none',
              }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags (comma-separated)</div>
          <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="API, Launch, Core"
            style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e4e4ed', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#f5b731,#e0a020)', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Add Milestone</button>
        </div>
      </div>
    </div>
  );
}

function GanttTimeline() {
  const [features, setFeatures] = useState(GANTT_FEATURES);
  const [draggingId, setDraggingId] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartRange, setDragStartRange] = useState(null);
  const svgRef = useRef(null);

  const SVG_W = 900;
  const ROW_H = 36;
  const LABEL_W = 160;
  const HEADER_H = 36;
  const MONTH_W = (SVG_W - LABEL_W) / 12;
  const SVG_H = HEADER_H + GANTT_FEATURES.length * (ROW_H + 6) + 40;
  const currentMonth = 5; // June (0-indexed) = current month

  const handleMouseMove = (e) => {
    if (!draggingId || dragStartX === null) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - dragStartX;
    const monthDelta = Math.round(dx / MONTH_W);
    if (monthDelta === 0) return;
    setFeatures(prev => prev.map(f => {
      if (f.id !== draggingId) return f;
      const newStart = Math.max(0, Math.min(11, dragStartRange.start + monthDelta));
      const len = dragStartRange.end - dragStartRange.start;
      const newEnd = Math.min(11, newStart + len);
      return { ...f, start: newStart, end: newEnd };
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDragStartX(null);
    setDragStartRange(null);
  };

  return (
    <div style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 20, overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>📅 12-Month Gantt Timeline</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 10, color: '#6e7191' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '100%', cursor: draggingId ? 'grabbing' : 'default', userSelect: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Month headers */}
        {MONTHS.map((m, i) => (
          <g key={m}>
            <rect x={LABEL_W + i * MONTH_W} y={0} width={MONTH_W} height={HEADER_H}
              fill={i === currentMonth ? 'rgba(239,68,68,0.08)' : i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'} />
            <text x={LABEL_W + i * MONTH_W + MONTH_W / 2} y={HEADER_H / 2 + 4}
              textAnchor="middle" fontSize="9.5" fill={i === currentMonth ? '#ef4444' : '#6e7191'} fontFamily="DM Mono, monospace" fontWeight={i === currentMonth ? '700' : '400'}>
              {m}
            </text>
            <line x1={LABEL_W + i * MONTH_W} y1={0} x2={LABEL_W + i * MONTH_W} y2={SVG_H - 30}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </g>
        ))}

        {/* Grid h-lines */}
        {GANTT_FEATURES.map((_, i) => (
          <line key={i}
            x1={0} y1={HEADER_H + i * (ROW_H + 6)}
            x2={SVG_W} y2={HEADER_H + i * (ROW_H + 6)}
            stroke="rgba(255,255,255,0.03)" strokeWidth="1"
          />
        ))}

        {/* Feature bars */}
        {features.map((f, rowIdx) => {
          const y = HEADER_H + rowIdx * (ROW_H + 6) + 4;
          const barX = LABEL_W + f.start * MONTH_W + 2;
          const barW = (f.end - f.start + 1) * MONTH_W - 4;
          const color = CATEGORY_COLORS[f.category] || '#6e7191';
          const isDragging = draggingId === f.id;
          return (
            <g key={f.id}>
              <text x={LABEL_W - 8} y={y + ROW_H / 2 + 4} textAnchor="end"
                fontSize="9.5" fill="#c0c0d8" fontFamily="DM Mono, monospace">
                {f.title.length > 18 ? f.title.slice(0, 16) + '…' : f.title}
              </text>
              <rect
                x={barX} y={y} width={barW} height={ROW_H - 4} rx="5"
                fill={`${color}30`} stroke={color} strokeWidth={isDragging ? '2' : '1'}
                style={{ cursor: 'grab' }}
                onMouseDown={(e) => {
                  setDraggingId(f.id);
                  setDragStartX(e.clientX);
                  setDragStartRange({ start: f.start, end: f.end });
                }}
              />
              <text x={barX + 8} y={y + ROW_H / 2 - 1} dominantBaseline="middle"
                fontSize="9" fill={color} fontWeight="700" fontFamily="DM Mono, monospace"
                style={{ pointerEvents: 'none' }}>
                {f.title.length > 12 ? f.title.slice(0, 10) + '…' : f.title}
              </text>
              {/* Drag handles */}
              <rect x={barX + 2} y={y + 4} width={4} height={ROW_H - 12} rx="2" fill={color} opacity="0.5" style={{ cursor: 'ew-resize' }} />
              <rect x={barX + barW - 6} y={y + 4} width={4} height={ROW_H - 12} rx="2" fill={color} opacity="0.5" style={{ cursor: 'ew-resize' }} />
              {/* Milestone diamond */}
              {f.milestone !== null && (
                <polygon
                  points={`${LABEL_W + f.milestone * MONTH_W + MONTH_W / 2},${y - 4} ${LABEL_W + f.milestone * MONTH_W + MONTH_W / 2 + 7},${y + ROW_H / 2 - 4} ${LABEL_W + f.milestone * MONTH_W + MONTH_W / 2},${y + ROW_H - 12} ${LABEL_W + f.milestone * MONTH_W + MONTH_W / 2 - 7},${y + ROW_H / 2 - 4}`}
                  fill={color} opacity="0.9"
                />
              )}
            </g>
          );
        })}

        {/* Named milestone diamonds */}
        {GANTT_MILESTONES.map(ms => (
          <g key={ms.month}>
            <polygon
              points={`${LABEL_W + ms.month * MONTH_W + MONTH_W / 2},${SVG_H - 38} ${LABEL_W + ms.month * MONTH_W + MONTH_W / 2 + 8},${SVG_H - 24} ${LABEL_W + ms.month * MONTH_W + MONTH_W / 2},${SVG_H - 10} ${LABEL_W + ms.month * MONTH_W + MONTH_W / 2 - 8},${SVG_H - 24}`}
              fill="#f5b731"
            />
            <text x={LABEL_W + ms.month * MONTH_W + MONTH_W / 2} y={SVG_H - 6}
              textAnchor="middle" fontSize="8" fill="#f5b731" fontFamily="DM Mono, monospace">
              {ms.label}
            </text>
          </g>
        ))}

        {/* Current date vertical red line */}
        <line
          x1={LABEL_W + currentMonth * MONTH_W + MONTH_W / 2} y1={HEADER_H}
          x2={LABEL_W + currentMonth * MONTH_W + MONTH_W / 2} y2={SVG_H - 32}
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
        />
        <text x={LABEL_W + currentMonth * MONTH_W + MONTH_W / 2 + 4} y={HEADER_H + 10}
          fontSize="8" fill="#ef4444" fontFamily="DM Mono, monospace">TODAY</text>
      </svg>
    </div>
  );
}

function EpicDependencyMap() {
  const [selectedEpic, setSelectedEpic] = useState(null);
  const NODE_R = 40;

  const getConnected = (id) => {
    const connected = new Set();
    EPIC_EDGES.forEach(([from, to]) => {
      if (from === id) connected.add(to);
      if (to === id) connected.add(from);
    });
    return connected;
  };

  const connected = selectedEpic ? getConnected(selectedEpic) : new Set();

  const criticalIds = new Set();
  EPIC_EDGES.filter(e => e[2]).forEach(([from, to]) => { criticalIds.add(from); criticalIds.add(to); });

  return (
    <div style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 20, marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>🔗 Epic Dependency Map</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, background: '#ef4444' }} />
            <span style={{ fontSize: 10, color: '#6e7191' }}>Critical path</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 10, color: '#6e7191' }}>Non-critical</span>
          </div>
          {selectedEpic && (
            <button onClick={() => setSelectedEpic(null)} style={{
              padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 10,
            }}>Clear selection</button>
          )}
        </div>
      </div>
      <svg viewBox="0 0 620 320" style={{ width: '100%' }}>
        <defs>
          <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
          </marker>
          <marker id="arrow-gray" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.2)" />
          </marker>
          <marker id="arrow-gold" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#f5b731" />
          </marker>
        </defs>

        {/* Edges */}
        {EPIC_EDGES.map(([fromId, toId, isCritical], i) => {
          const from = EPICS.find(e => e.id === fromId);
          const to = EPICS.find(e => e.id === toId);
          if (!from || !to) return null;

          const isHighlighted = selectedEpic && (connected.has(fromId) && connected.has(toId) || selectedEpic === fromId || selectedEpic === toId);
          const color = isCritical ? '#ef4444' : 'rgba(255,255,255,0.2)';
          const markerId = isHighlighted ? 'arrow-gold' : isCritical ? 'arrow-red' : 'arrow-gray';
          const strokeColor = isHighlighted ? '#f5b731' : color;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          const x1 = from.x + nx * NODE_R;
          const y1 = from.y + ny * NODE_R;
          const x2 = to.x - nx * (NODE_R + 5);
          const y2 = to.y - ny * (NODE_R + 5);

          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={strokeColor} strokeWidth={isHighlighted ? 2.5 : isCritical ? 2 : 1.2}
              markerEnd={`url(#${markerId})`} opacity={selectedEpic && !isHighlighted ? 0.2 : 1}
              style={{ transition: 'all 0.2s' }}
            />
          );
        })}

        {/* Nodes */}
        {EPICS.map(epic => {
          const isSelected = selectedEpic === epic.id;
          const isConn = connected.has(epic.id);
          const isCrit = criticalIds.has(epic.id);
          const statusColor = STATUS_COLORS[epic.status] || '#6e7191';
          const dimmed = selectedEpic && !isSelected && !isConn;

          return (
            <g key={epic.id} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} opacity={dimmed ? 0.25 : 1}
              onClick={() => setSelectedEpic(prev => prev === epic.id ? null : epic.id)}>
              <circle cx={epic.x} cy={epic.y} r={NODE_R + (isSelected ? 4 : 0)}
                fill={isSelected ? `${statusColor}25` : '#0e0e16'}
                stroke={isSelected ? '#f5b731' : isCrit ? '#ef4444' : statusColor}
                strokeWidth={isSelected ? 2.5 : isCrit ? 2 : 1.5}
              />
              <circle cx={epic.x} cy={epic.y} r={6}
                fill={statusColor} opacity={0.9}
                transform={`translate(${NODE_R * 0.6}, ${-NODE_R * 0.6})`}
              />
              <text x={epic.x} y={epic.y - 6} textAnchor="middle" fontSize="10" fontWeight="700"
                fill={isSelected ? '#f5b731' : '#e4e4ed'} fontFamily="DM Mono, monospace">
                {epic.title.split(' ').slice(0, 2).join(' ')}
              </text>
              <text x={epic.x} y={epic.y + 9} textAnchor="middle" fontSize="8.5"
                fill={statusColor} fontFamily="DM Mono, monospace">
                {epic.status}
              </text>
            </g>
          );
        })}

        {/* Legend note */}
        {selectedEpic && (
          <text x={310} y={305} textAnchor="middle" fontSize="9" fill="#f5b731" fontFamily="DM Mono, monospace">
            {EPICS.find(e => e.id === selectedEpic)?.title} — {connected.size} dependent epic{connected.size !== 1 ? 's' : ''} highlighted
          </text>
        )}
      </svg>
    </div>
  );
}

function ReleasePlanner() {
  const [releases, setReleases] = useState(INITIAL_RELEASES);
  const [draggingFeature, setDraggingFeature] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [generatedNotes, setGeneratedNotes] = useState(null);

  const handleFeatureDragStart = (feature, fromReleaseId) => {
    setDraggingFeature({ feature, fromReleaseId });
  };

  const handleFeatureDrop = (toReleaseId) => {
    if (!draggingFeature || draggingFeature.fromReleaseId === toReleaseId) {
      setDraggingFeature(null);
      setDragTarget(null);
      return;
    }
    setReleases(prev => prev.map(r => {
      if (r.id === draggingFeature.fromReleaseId) {
        return { ...r, features: r.features.filter(f => f.id !== draggingFeature.feature.id) };
      }
      if (r.id === toReleaseId) {
        return { ...r, features: [...r.features, draggingFeature.feature] };
      }
      return r;
    }));
    setDraggingFeature(null);
    setDragTarget(null);
  };

  const generateReleaseNotes = (release) => {
    const notes = [
      `# ${release.version} — ${release.name}`,
      `**Release Date:** ${release.date}`,
      `**Status:** ${release.status}`,
      '',
      '## Features Included',
      ...release.features.map(f => `- **${f.name}** (${f.pts} story points)`),
      '',
      '## Breaking Changes',
      '- None',
      '',
      '## Migration Guide',
      '- No migration steps required.',
      '',
      `*Generated by Bolt Studio Pro — ${new Date().toLocaleDateString()}*`,
    ].join('\n');
    setGeneratedNotes({ version: release.version, content: notes });
  };

  const STATUS_CFG = {
    'Released': { color: '#22c55e' },
    'In Progress': { color: '#f5b731' },
    'Planned': { color: '#a78bfa' },
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 6 }}>Release Planner</div>
      <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 16 }}>Drag features between releases to plan scope</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {releases.map(release => {
          const cfg = STATUS_CFG[release.status] || { color: '#6e7191' };
          const totalPts = release.features.reduce((a, f) => a + f.pts, 0);
          const isDropTarget = dragTarget === release.id;
          return (
            <div
              key={release.id}
              onMouseEnter={() => draggingFeature && setDragTarget(release.id)}
              onMouseLeave={() => setDragTarget(null)}
              onMouseUp={() => handleFeatureDrop(release.id)}
              style={{
                background: '#16161e', borderRadius: 12,
                border: `1px solid ${isDropTarget ? cfg.color : 'rgba(255,255,255,0.07)'}`,
                overflow: 'hidden', transition: 'border-color 0.15s',
                boxShadow: isDropTarget ? `0 0 16px ${cfg.color}20` : 'none',
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: `${cfg.color}08` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: cfg.color }}>{release.version}</div>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 700,
                    background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30`,
                  }}>{release.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#e4e4ed', fontWeight: 600 }}>{release.name}</div>
                <div style={{ fontSize: 10, color: '#6e7191', marginTop: 2 }}>
                  {release.date} · {release.features.length} features · {totalPts} pts
                </div>
              </div>
              <div style={{ padding: '10px 12px', minHeight: 80 }}>
                {release.features.map(feature => (
                  <div
                    key={feature.id}
                    onMouseDown={() => handleFeatureDragStart(feature, release.id)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 10px', marginBottom: 5, background: '#0e0e16',
                      borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'grab', userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#c0c0d8' }}>⠿ {feature.name}</span>
                    <span style={{ fontSize: 10, color: '#f5b731', fontWeight: 700 }}>{feature.pts}pt</span>
                  </div>
                ))}
                {release.features.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: '#6e7191', fontSize: 11 }}>Drop features here</div>
                )}
              </div>
              <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => generateReleaseNotes(release)} style={{
                  width: '100%', padding: '6px', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.07)', background: 'transparent',
                  color: '#6e7191', cursor: 'pointer', fontSize: 10.5, fontWeight: 600,
                }}>📝 Generate Release Notes</button>
              </div>
            </div>
          );
        })}
      </div>

      {generatedNotes && (
        <div style={{ marginTop: 20, padding: 16, background: '#16161e', borderRadius: 12, border: '1px solid rgba(167,139,250,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>📄 Release Notes — {generatedNotes.version}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => {
                const blob = new Blob([generatedNotes.content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `${generatedNotes.version}-release-notes.md`; a.click();
                URL.revokeObjectURL(url);
              }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', cursor: 'pointer', fontSize: 10.5, fontWeight: 700 }}>⬇ Download</button>
              <button onClick={() => setGeneratedNotes(null)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 10.5 }}>✕</button>
            </div>
          </div>
          <pre style={{
            fontSize: 11, color: '#c0c0d8', background: '#0e0e16', borderRadius: 8, padding: 14,
            margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'DM Mono, monospace',
          }}>{generatedNotes.content}</pre>
        </div>
      )}
    </div>
  );
}

function OKRSection() {
  const [okrs, setOkrs] = useState(INITIAL_OKRS);
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2026');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOkr, setNewOkr] = useState({ objective: '', quarter: 'Q2 2026', krs: ['', '', ''] });

  const QUARTERS_OKR = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

  const updateKrProgress = (okrId, krId, value) => {
    setOkrs(prev => prev.map(o => o.id === okrId ? {
      ...o, krs: o.krs.map(kr => kr.id === krId ? { ...kr, progress: Math.max(0, Math.min(100, value)) } : kr),
    } : o));
  };

  const getHealthScore = (okr) => {
    const avg = Math.round(okr.krs.reduce((a, k) => a + k.progress, 0) / okr.krs.length);
    return avg;
  };

  const getHealthColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f5b731';
    return '#ef4444';
  };

  const addOkr = () => {
    if (!newOkr.objective.trim()) return;
    const krs = newOkr.krs.filter(k => k.trim()).map((text, i) => ({
      id: `k_new_${Date.now()}_${i}`, text, progress: 0,
    }));
    setOkrs(prev => [...prev, {
      id: `o_${Date.now()}`, objective: newOkr.objective, quarter: newOkr.quarter, krs,
    }]);
    setNewOkr({ objective: '', quarter: 'Q2 2026', krs: ['', '', ''] });
    setShowAddForm(false);
  };

  const filteredOkrs = okrs.filter(o => o.quarter === selectedQuarter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>OKR Alignment</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} style={{
            background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7,
            padding: '6px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none', cursor: 'pointer',
          }}>
            {QUARTERS_OKR.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <button onClick={() => setShowAddForm(s => !s)} style={{
            padding: '7px 14px', borderRadius: 7, border: 'none',
            background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff',
            cursor: 'pointer', fontSize: 11.5, fontWeight: 700,
          }}>+ Add OKR</button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ padding: 16, background: '#16161e', borderRadius: 12, border: '1px solid rgba(167,139,250,0.3)', marginBottom: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Objective</div>
            <input value={newOkr.objective} onChange={e => setNewOkr(o => ({ ...o, objective: e.target.value }))} placeholder="What do you want to achieve?"
              style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '8px 12px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {newOkr.krs.map((kr, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Result {i + 1}</div>
              <input value={kr} onChange={e => setNewOkr(o => ({ ...o, krs: o.krs.map((k, j) => j === i ? e.target.value : k) }))} placeholder={`KR${i + 1}: Measurable outcome...`}
                style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 12px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <select value={newOkr.quarter} onChange={e => setNewOkr(o => ({ ...o, quarter: e.target.value }))} style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none' }}>
              {QUARTERS_OKR.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <button onClick={addOkr} style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: '#a78bfa', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Add</button>
            <button onClick={() => setShowAddForm(false)} style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      )}

      {filteredOkrs.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6e7191', fontSize: 13 }}>No OKRs for {selectedQuarter}. Click "+ Add OKR" to create one.</div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {filteredOkrs.map(okr => {
          const health = getHealthScore(okr);
          const healthColor = getHealthColor(health);
          return (
            <div key={okr.id} style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.4, maxWidth: 500 }}>{okr.objective}</div>
                  <div style={{ fontSize: 10, color: '#6e7191', marginTop: 3 }}>{okr.quarter}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: healthColor }}>{health}%</div>
                  <div style={{ fontSize: 9, color: '#6e7191' }}>Health Score</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: healthColor }}>
                    {health >= 70 ? '🟢 On Track' : health >= 40 ? '🟡 At Risk' : '🔴 Off Track'}
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 18px' }}>
                {okr.krs.map(kr => (
                  <div key={kr.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ fontSize: 11, color: '#c0c0d8', flex: 1 }}>{kr.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                        <input
                          type="range" min="0" max="100" value={kr.progress}
                          onChange={e => updateKrProgress(okr.id, kr.id, +e.target.value)}
                          style={{ width: 80, accentColor: getHealthColor(kr.progress) }}
                        />
                        <span style={{ fontSize: 11, fontWeight: 700, color: getHealthColor(kr.progress), minWidth: 34, textAlign: 'right' }}>{kr.progress}%</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: '#0e0e16', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999,
                        width: `${kr.progress}%`,
                        background: `linear-gradient(90deg,${getHealthColor(kr.progress)},${getHealthColor(kr.progress)}aa)`,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoadmapBuilder() {
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLane, setFilterLane] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [selectedMs, setSelectedMs] = useState(null);
  const [activeView, setActiveView] = useState('board');
  const [stakeholderView, setStakeholderView] = useState('technical');
  const [activeTab, setActiveTab] = useState('roadmap');

  const stats = {
    active: milestones.filter(m => m.status === 'In Progress').length,
    total: milestones.length,
    done: milestones.filter(m => m.status === 'Done').length,
    blocked: milestones.filter(m => m.status === 'Blocked').length,
  };

  const filtered = milestones.filter(m => {
    if (filterStatus !== 'All' && m.status !== filterStatus) return false;
    if (filterLane !== 'All' && m.lane !== filterLane) return false;
    if (filterOwner !== 'All' && OWNERS[m.owner].name !== filterOwner) return false;
    if (filterPriority !== 'All' && m.priority !== filterPriority) return false;
    return true;
  });

  const getMsInCell = (lane, quarter) =>
    filtered.filter(m => m.lane === lane && m.quarter === quarter);

  const handleDragStart = useCallback((ms) => {
    setDragging(ms);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragging && dragTarget) {
      setMilestones(prev => prev.map(m => m.id === dragging.id
        ? { ...m, quarter: dragTarget.quarter, lane: dragTarget.lane }
        : m));
    }
    setDragging(null);
    setDragTarget(null);
  }, [dragging, dragTarget]);

  const handleAddMilestone = useCallback((ms) => {
    setMilestones(prev => [...prev, { ...ms, id: Date.now() }]);
  }, []);

  const completionPct = Math.round((stats.done / stats.total) * 100);

  const inputStyle = {
    background: '#16161e', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8, padding: '6px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none', cursor: 'pointer',
  };

  const TABS = [
    ['roadmap', '🗺️ Roadmap'],
    ['gantt', '📅 Gantt'],
    ['deps', '🔗 Dependencies'],
    ['releases', '🚀 Releases'],
    ['okrs', '🎯 OKRs'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#e4e4ed', paddingBottom: 80, fontFamily: 'DM Mono, Syne, monospace' }}>
      {/* Hero Header */}
      <div style={{
        padding: '32px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(245,183,49,0.04) 0%, transparent 60%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#f5b731,#ffd77a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
              🗺️ Roadmap Builder
            </div>
            <div style={{ fontSize: 13, color: '#6e7191', marginBottom: 16 }}>Visual product roadmap • Track milestones across quarters</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: `${stats.active} Active`, color: '#f5b731' },
                { label: `${stats.total} Total`, color: '#22d3ee' },
                { label: 'Q3 2026 Target', color: '#a78bfa' },
                { label: `${completionPct}% Complete`, color: '#22c55e' },
                { label: `${stats.blocked} Blocked`, color: '#ef4444' },
              ].map((b, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                  background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30`,
                }}>{b.label}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Stakeholder view toggle */}
            <div style={{ display: 'flex', background: '#16161e', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              {[['technical', '⚙️ Technical'], ['executive', '📊 Executive']].map(([v, label]) => (
                <button key={v} onClick={() => setStakeholderView(v)} style={{
                  padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 600,
                  background: stakeholderView === v ? 'rgba(245,183,49,0.15)' : 'transparent',
                  color: stakeholderView === v ? '#f5b731' : '#6e7191',
                  transition: 'all 0.15s',
                }}>{label}</button>
              ))}
            </div>
            <button onClick={() => setActiveView(v => v === 'board' ? 'gantt' : 'board')} style={{
              padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
              background: '#16161e', color: '#6e7191', cursor: 'pointer', fontSize: 12,
            }}>
              {activeView === 'board' ? '📊 Gantt View' : '🗂️ Board View'}
            </button>
            <button onClick={() => setShowModal(true)} style={{
              padding: '9px 16px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#f5b731,#e0a020)', color: '#000',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>+ New Milestone</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#6e7191', minWidth: 100 }}>Overall Progress</div>
          <div style={{ flex: 1, height: 6, background: '#16161e', borderRadius: 999 }}>
            <div style={{
              height: '100%', borderRadius: 999, width: `${completionPct}%`,
              background: 'linear-gradient(90deg,#f5b731,#22d3ee)', transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: 11, color: '#f5b731', fontWeight: 700, minWidth: 36 }}>{completionPct}%</div>
        </div>
      </div>

      {/* Executive view banner */}
      {stakeholderView === 'executive' && (
        <div style={{ padding: '12px 32px', background: 'rgba(245,183,49,0.05)', borderBottom: '1px solid rgba(245,183,49,0.15)' }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#f5b731', fontWeight: 700 }}>📊 Executive View</span>
            <span style={{ fontSize: 11, color: '#6e7191' }}>Simplified roadmap — milestones and key dates only</span>
            {[
              { label: '5 milestones in flight', color: '#f5b731' },
              { label: '5 shipped', color: '#22c55e' },
              { label: 'On track for Q3 2026', color: '#22d3ee' },
            ].map((b, i) => (
              <span key={i} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10.5, background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30`, fontWeight: 700 }}>{b.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 2, overflowX: 'auto' }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: 'transparent', color: activeTab === id ? '#f5b731' : '#6e7191',
            borderBottom: activeTab === id ? '2px solid #f5b731' : '2px solid transparent',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{label}</button>
        ))}
      </div>

      {/* Filters (only for roadmap tab) */}
      {activeTab === 'roadmap' && (
        <div style={{
          padding: '12px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          background: 'rgba(14,14,22,0.5)',
        }}>
          <span style={{ fontSize: 11, color: '#6e7191', fontWeight: 600 }}>Filter:</span>
          {[
            ['Status', filterStatus, setFilterStatus, ['All', ...STATUSES]],
            ['Lane', filterLane, setFilterLane, ['All', ...SWIMLANES]],
            ['Priority', filterPriority, setFilterPriority, ['All', ...PRIORITIES]],
            ['Owner', filterOwner, setFilterOwner, ['All', ...OWNERS.map(o => o.name)]],
          ].map(([label, val, setter, opts]) => (
            <select key={label} value={val} onChange={e => setter(e.target.value)} style={inputStyle}>
              {opts.map(o => <option key={o} value={o}>{label}: {o}</option>)}
            </select>
          ))}
          <button onClick={() => { setFilterStatus('All'); setFilterLane('All'); setFilterOwner('All'); setFilterPriority('All'); }} style={{
            padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
            background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 11,
          }}>Clear</button>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#6e7191' }}>
            Showing <span style={{ color: '#f5b731', fontWeight: 700 }}>{filtered.length}</span> of {milestones.length} milestones
          </div>
        </div>
      )}

      <div style={{ padding: '24px 32px' }}>
        {/* ROADMAP BOARD / GANTT */}
        {activeTab === 'roadmap' && (
          activeView === 'board' ? (
            <div style={{ overflowX: 'auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `160px repeat(${QUARTERS.length}, minmax(160px, 1fr))`,
                minWidth: 1440,
              }}>
                <div style={{ padding: '10px 12px', fontSize: 11, color: '#6e7191', fontWeight: 700 }}>SWIMLANE</div>
                {QUARTERS.map(q => (
                  <div key={q} style={{
                    padding: '10px 12px', fontSize: 11, color: '#f5b731', fontWeight: 700,
                    textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.07)',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                    background: q.includes('2026') ? 'rgba(245,183,49,0.03)' : 'transparent',
                  }}>
                    {q}
                    {q === 'Q3 2025' && (
                      <div style={{ fontSize: 9, color: '#22d3ee', fontWeight: 600, marginTop: 2 }}>◉ NOW</div>
                    )}
                  </div>
                ))}

                {SWIMLANES.map(lane => (
                  <div key={lane} style={{ display: 'contents' }}>
                    <div style={{
                      padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 11.5, fontWeight: 700, color: '#c0c0d8',
                      display: 'flex', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)',
                    }}>{lane}</div>
                    {QUARTERS.map(q => {
                      const cellMs = getMsInCell(lane, q);
                      const isTarget = dragTarget?.lane === lane && dragTarget?.quarter === q;
                      return (
                        <div
                          key={`${lane}-${q}`}
                          onMouseEnter={() => dragging && setDragTarget({ lane, quarter: q })}
                          onMouseUp={handleDragEnd}
                          style={{
                            padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.07)',
                            borderLeft: '1px solid rgba(255,255,255,0.07)', minHeight: 80,
                            background: isTarget ? 'rgba(245,183,49,0.07)' : q.includes('2026') ? 'rgba(245,183,49,0.02)' : 'transparent',
                            transition: 'background 0.15s',
                            outline: isTarget ? '1px dashed rgba(245,183,49,0.4)' : 'none',
                          }}
                        >
                          {cellMs.map(ms => (
                            <MilestoneCard key={ms.id} ms={ms} onDragStart={handleDragStart} onClick={setSelectedMs} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Quarter Gantt View */
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 900 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e4e4ed', marginBottom: 16 }}>📊 Quarter Gantt</div>
                <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${QUARTERS.length}, 1fr)`, marginBottom: 2 }}>
                  <div />
                  {QUARTERS.map(q => (
                    <div key={q} style={{ fontSize: 9.5, color: '#f5b731', fontWeight: 700, textAlign: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{q}</div>
                  ))}
                </div>
                {filtered.map(ms => (
                  <div key={ms.id} style={{
                    display: 'grid', gridTemplateColumns: `200px repeat(${QUARTERS.length}, 1fr)`,
                    marginBottom: 4, alignItems: 'center',
                  }}>
                    <div style={{ fontSize: 11, color: '#c0c0d8', paddingRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ms.title}</div>
                    {QUARTERS.map((q, qi) => {
                      const active = qi >= ms.startQ && qi <= ms.endQ;
                      const start = qi === ms.startQ;
                      const end = qi === ms.endQ;
                      return (
                        <div key={q} style={{ height: 28, padding: '3px 2px' }}>
                          {active && (
                            <div style={{
                              height: '100%',
                              background: `linear-gradient(90deg,${STATUS_COLORS[ms.status]}cc,${STATUS_COLORS[ms.status]}80)`,
                              borderRadius: `${start ? 6 : 0}px ${end ? 6 : 0}px ${end ? 6 : 0}px ${start ? 6 : 0}px`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 9, color: '#000', fontWeight: 700, overflow: 'hidden',
                            }}>
                              {start && ms.title.substring(0, 12)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div style={{ marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 8, borderRadius: 4, background: STATUS_COLORS[s] }} />
                      <span style={{ fontSize: 10, color: '#6e7191' }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Dependencies */}
                {stakeholderView === 'technical' && (
                  <div style={{ marginTop: 32, padding: 20, background: '#16161e', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 14 }}>🔗 Milestone Dependencies</div>
                    {DEPENDENCIES.map((dep, i) => {
                      const from = milestones.find(m => m.id === dep.from);
                      const to = milestones.find(m => m.id === dep.to);
                      if (!from || !to) return null;
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                          padding: '8px 12px', background: '#0e0e16', borderRadius: 8,
                        }}>
                          <span style={{ fontSize: 11, color: '#f5b731', fontWeight: 600 }}>{from.title}</span>
                          <span style={{ color: '#6e7191', fontSize: 14 }}>→</span>
                          <span style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600 }}>{to.title}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${STATUS_COLORS[to.status]}20`, color: STATUS_COLORS[to.status] }}>{to.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* GANTT TIMELINE TAB */}
        {activeTab === 'gantt' && <GanttTimeline />}

        {/* EPIC DEPENDENCY MAP TAB */}
        {activeTab === 'deps' && <EpicDependencyMap />}

        {/* RELEASES TAB */}
        {activeTab === 'releases' && <ReleasePlanner />}

        {/* OKRs TAB */}
        {activeTab === 'okrs' && <OKRSection />}
      </div>

      {/* Stats summary (always visible) */}
      <div style={{ padding: '0 32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          {[
            { label: 'Done', value: stats.done, color: '#22d3ee', icon: '✅' },
            { label: 'In Progress', value: milestones.filter(m => m.status === 'In Progress').length, color: '#f5b731', icon: '🔄' },
            { label: 'Planned', value: milestones.filter(m => m.status === 'Planned').length, color: '#6e7191', icon: '📋' },
            { label: 'Blocked', value: stats.blocked, color: '#ef4444', icon: '🚫' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '14px 18px', background: '#16161e', borderRadius: 12,
              border: `1px solid ${s.color}20`, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: '#6e7191' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div style={{ padding: '0 32px', display: 'flex', gap: 10 }}>
        <button onClick={() => alert('PNG export simulated!')} style={{
          padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
          background: '#16161e', color: '#e4e4ed', cursor: 'pointer', fontSize: 12,
        }}>📸 Export PNG</button>
        <button onClick={() => {
          const data = JSON.stringify(milestones, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'roadmap.json'; a.click();
          URL.revokeObjectURL(url);
        }} style={{
          padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
          background: '#16161e', color: '#e4e4ed', cursor: 'pointer', fontSize: 12,
        }}>⬇ Export JSON</button>
      </div>

      {/* Milestone Detail Panel */}
      {selectedMs && (
        <div style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: 360,
          background: '#16161e', borderLeft: '1px solid rgba(255,255,255,0.07)',
          zIndex: 8000, padding: 24, overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Milestone Detail</div>
            <button onClick={() => setSelectedMs(null)} style={{
              width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)',
              background: '#0e0e16', color: '#6e7191', cursor: 'pointer', fontSize: 14,
            }}>✕</button>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e4e4ed', marginBottom: 16 }}>{selectedMs.title}</div>
          {[
            ['Swimlane', selectedMs.lane],
            ['Quarter', selectedMs.quarter],
            ['Priority', selectedMs.priority],
            ['Owner', OWNERS[selectedMs.owner].name],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 11, color: '#6e7191' }}>{k}</span>
              <span style={{ fontSize: 11, color: '#e4e4ed', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          {stakeholderView === 'technical' && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Change Status</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => {
                    setMilestones(prev => prev.map(m => m.id === selectedMs.id ? { ...m, status: s } : m));
                    setSelectedMs(prev => ({ ...prev, status: s }));
                  }} style={{
                    padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    background: selectedMs.status === s ? `${STATUS_COLORS[s]}20` : 'transparent',
                    border: `1px solid ${selectedMs.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.07)'}`,
                    color: selectedMs.status === s ? STATUS_COLORS[s] : '#6e7191',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedMs.tags.map(t => (
                <span key={t} style={{
                  padding: '3px 8px', borderRadius: 4, fontSize: 10,
                  background: 'rgba(255,255,255,0.05)', color: '#6e7191',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => {
            setMilestones(prev => prev.filter(m => m.id !== selectedMs.id));
            setSelectedMs(null);
          }} style={{
            marginTop: 24, width: '100%', padding: '10px', borderRadius: 8,
            border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)',
            color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>Delete Milestone</button>
        </div>
      )}

      {showModal && (
        <NewMilestoneModal onClose={() => setShowModal(false)} onAdd={handleAddMilestone} quarters={QUARTERS} />
      )}
    </div>
  );
}
