import { useState, useCallback, useEffect, useRef } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

const INITIAL_TEAM = [
  { id: 0, name: 'Alex K.', avatar: 'AK', color: '#f5b731', capacity: 40, allocated: 34, role: 'Lead Dev' },
  { id: 1, name: 'Sam R.', avatar: 'SR', color: '#22d3ee', capacity: 40, allocated: 38, role: 'AI Engineer' },
  { id: 2, name: 'Jordan M.', avatar: 'JM', color: '#a78bfa', capacity: 32, allocated: 28, role: 'UX Designer' },
  { id: 3, name: 'Casey T.', avatar: 'CT', color: '#60a5fa', capacity: 40, allocated: 30, role: 'Backend Dev' },
  { id: 4, name: 'Morgan L.', avatar: 'ML', color: '#f97316', capacity: 24, allocated: 18, role: 'QA Engineer' },
  { id: 5, name: 'Riley P.', avatar: 'RP', color: '#22c55e', capacity: 36, allocated: 20, role: 'DevOps' },
];

const VELOCITY_DATA = [
  { sprint: 'S7', points: 34, completed: 30 },
  { sprint: 'S8', points: 40, completed: 38 },
  { sprint: 'S9', points: 38, completed: 35 },
  { sprint: 'S10', points: 42, completed: 40 },
  { sprint: 'S11', points: 45, completed: 44 },
  { sprint: 'S12', points: 47, completed: 47 },
];

const INITIAL_BURNDOWN = [
  { day: 1, ideal: 48, actual: 48 },
  { day: 2, ideal: 42.5, actual: 46 },
  { day: 3, ideal: 37, actual: 42 },
  { day: 4, ideal: 31.5, actual: 36 },
  { day: 5, ideal: 26, actual: 30 },
  { day: 6, ideal: 20.5, actual: 23 },
  { day: 7, ideal: 15, actual: 17 },
];

const INITIAL_BACKLOG = [
  { id: 101, title: 'Multi-modal prompt input', points: 8, priority: 'Critical', tags: ['AI', 'UX'] },
  { id: 102, title: 'Rate limiting dashboard', points: 5, priority: 'High', tags: ['Infra'] },
  { id: 103, title: 'Webhook retry logic', points: 3, priority: 'High', tags: ['Backend'] },
  { id: 104, title: 'Dark mode for mobile', points: 5, priority: 'Medium', tags: ['UX'] },
  { id: 105, title: 'Token usage CSV export', points: 2, priority: 'Low', tags: ['Data'] },
  { id: 106, title: 'API key rotation flow', points: 5, priority: 'Critical', tags: ['Security'] },
  { id: 107, title: 'Prompt versioning system', points: 13, priority: 'High', tags: ['AI', 'Core'] },
  { id: 108, title: 'SSO via Okta', points: 8, priority: 'High', tags: ['Auth'] },
];

const INITIAL_SPRINT = {
  todo: [
    { id: 1, title: 'Implement streaming responses', points: 8, priority: 'Critical', tags: ['AI', 'Core'], assignee: 1 },
    { id: 2, title: 'Fix context window overflow', points: 5, priority: 'High', tags: ['Bug', 'AI'], assignee: 0 },
    { id: 3, title: 'Add model selector UI', points: 3, priority: 'High', tags: ['UX'], assignee: 2 },
  ],
  inprogress: [
    { id: 4, title: 'GPT-4 Vision integration', points: 13, priority: 'Critical', tags: ['AI', 'Vision'], assignee: 1 },
    { id: 5, title: 'Prompt template library v2', points: 8, priority: 'High', tags: ['Feature'], assignee: 0 },
    { id: 6, title: 'Cost breakdown by model', points: 5, priority: 'Medium', tags: ['Analytics'], assignee: 3 },
  ],
  done: [
    { id: 7, title: 'Auth middleware refactor', points: 8, priority: 'High', tags: ['Security', 'Backend'], assignee: 3 },
    { id: 8, title: 'Latency monitoring setup', points: 3, priority: 'Medium', tags: ['Infra'], assignee: 4 },
    { id: 9, title: 'Onboarding tour wizard', points: 5, priority: 'Medium', tags: ['UX'], assignee: 2 },
    { id: 10, title: 'Database query optimizer', points: 3, priority: 'High', tags: ['Backend', 'Perf'], assignee: 3 },
  ],
};

const RETRO_TEMPLATES = {
  'Went Well': [
    '✅ GPT-4 Vision integration ahead of schedule',
    '✅ Zero production incidents this sprint',
    '✅ Great async communication across timezones',
  ],
  'Improve': [
    '⚠️ PR review turnaround still slow (~2.5 days)',
    '⚠️ Test coverage dropped below 80% threshold',
    '⚠️ Daily standups running 10+ minutes over',
  ],
  'Action Items': [
    '📌 Implement PR review SLA with auto-notify',
    '📌 Add coverage checks to CI pipeline',
    '📌 Timebox standups to 15 min with timer',
  ],
};

const RELEASES_DATA = [
  { name: 'v2.0 Core', sprints: ['S10', 'S11', 'S12'], date: 'Jun 30, 2026', status: 'In Progress' },
  { name: 'v2.1 AI+', sprints: ['S13', 'S14'], date: 'Aug 15, 2026', status: 'Planned' },
  { name: 'v3.0 Enterprise', sprints: ['S15', 'S16', 'S17', 'S18'], date: 'Nov 1, 2026', status: 'Planned' },
];

const COMPLEXITY_FACTORS = ['Uncertainty', 'Dependencies', 'Tech Debt', 'External APIs', 'Data Migration'];
const PRIORITY_COLORS = { Critical: '#ef4444', High: '#f97316', Medium: '#f5b731', Low: '#6e7191' };

// ─── Sub-components (all at module scope) ────────────────────────────────────

function StoryCard({ story, onMove, columns, currentCol, team }) {
  const assignee = team[story.assignee] || team[0];
  return (
    <div
      style={{
        background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
        padding: '10px 12px', marginBottom: 8, cursor: 'pointer',
        borderLeft: `3px solid ${PRIORITY_COLORS[story.priority]}`,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#202030'}
      onMouseLeave={e => e.currentTarget.style.background = '#16161e'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#e4e4ed', lineHeight: 1.3, flex: 1 }}>{story.title}</div>
        <div style={{
          fontSize: 11, fontWeight: 800, color: '#f5b731', flexShrink: 0,
          width: 24, height: 24, borderRadius: '50%', background: 'rgba(245,183,49,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(245,183,49,0.3)',
        }}>{story.points}</div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
        {story.tags.map(t => (
          <span key={t} style={{
            fontSize: 9, padding: '1px 5px', borderRadius: 3,
            background: 'rgba(255,255,255,0.05)', color: '#6e7191',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: assignee.color,
          color: '#000', fontSize: 7.5, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{assignee.avatar}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {columns.filter(c => c !== currentCol).map(col => (
            <button key={col} onClick={() => onMove(story, currentCol, col)} style={{
              fontSize: 8.5, padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)',
              background: '#0e0e16', color: '#6e7191', cursor: 'pointer',
            }}>→ {col === 'todo' ? 'Todo' : col === 'inprogress' ? 'In Prog' : 'Done'}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PokerModal({ story, onClose, onEstimate, team }) {
  const [selected, setSelected] = useState(null);
  const [votes, setVotes] = useState({});

  const submitVote = (points) => {
    setSelected(points);
    const idx = FIBONACCI.indexOf(points);
    const memberVotes = {};
    team.forEach((m, i) => {
      const spread = [0, -1, 1, -1, 0, 1][i % 6];
      const vIdx = Math.max(0, Math.min(FIBONACCI.length - 1, idx + spread));
      memberVotes[m.name] = FIBONACCI[vIdx];
    });
    memberVotes[team[0].name] = points;
    setVotes(memberVotes);
  };

  const allVoted = Object.keys(votes).length > 0;
  const consensus = allVoted ? FIBONACCI.find(f => {
    const count = Object.values(votes).filter(v => v === f).length;
    return count >= team.length * 0.6;
  }) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, background: '#16161e', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🃏 Planning Poker</div>
        <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 20 }}>{story.title}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {FIBONACCI.map(f => (
            <button key={f} onClick={() => submitVote(f)} style={{
              width: 60, height: 80, borderRadius: 10,
              border: `2px solid ${selected === f ? '#f5b731' : 'rgba(255,255,255,0.07)'}`,
              background: selected === f ? 'rgba(245,183,49,0.15)' : '#0e0e16',
              color: selected === f ? '#f5b731' : '#e4e4ed',
              fontSize: 22, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: selected === f ? '0 0 16px rgba(245,183,49,0.2)' : 'none',
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
        {allVoted && (
          <div>
            <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Team Estimates</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {team.map(m => (
                <div key={m.name} style={{
                  padding: '8px 12px', background: '#0e0e16', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: m.color,
                    color: '#000', fontSize: 9, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px',
                  }}>{m.avatar}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{votes[m.name]}</div>
                  <div style={{ fontSize: 9, color: '#6e7191' }}>{m.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
            {consensus ? (
              <div style={{
                padding: '12px 16px', background: 'rgba(34,211,238,0.1)', borderRadius: 10,
                border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
              }}>
                <div style={{ fontSize: 24 }}>🎯</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#22d3ee' }}>Consensus: <strong>{consensus} points</strong></div>
                  <div style={{ fontSize: 10, color: '#6e7191' }}>60%+ of team agreed</div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '12px 16px', background: 'rgba(245,183,49,0.1)', borderRadius: 10,
                border: '1px solid rgba(245,183,49,0.3)', marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f5b731' }}>⚠️ No consensus — discuss and revote</div>
              </div>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          {allVoted && (
            <button onClick={() => { onEstimate(story, consensus || selected); onClose(); }} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#f5b731,#e0a020)', color: '#000',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>Accept ({consensus || selected} pts)</button>
          )}
        </div>
      </div>
    </div>
  );
}

function VelocityChart({ data }) {
  const maxVal = Math.max(...data.map(v => v.points));
  const avgCompleted = Math.round(data.reduce((a, v) => a + v.completed, 0) / data.length);
  const W = 580, H = 200, PAD_L = 50, PAD_B = 30, PAD_T = 20, PAD_R = 20;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const barGroupW = chartW / data.length;
  const barW = Math.min(36, barGroupW * 0.6);

  const trendPoints = data.map((v, i) => {
    const x = PAD_L + i * barGroupW + barGroupW / 2;
    const y = PAD_T + chartH - (v.completed / maxVal) * chartH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>Sprint Velocity — Last 6 Sprints</div>
        <span style={{
          padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
          background: 'rgba(245,183,49,0.15)', color: '#f5b731', border: '1px solid rgba(245,183,49,0.3)',
        }}>⚡ Velocity: {avgCompleted} pts/sprint</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = PAD_T + chartH - pct * chartH;
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="8" fill="#6e7191" fontFamily="DM Mono, monospace">
                {Math.round(pct * maxVal)}
              </text>
            </g>
          );
        })}

        {data.map((v, i) => {
          const x = PAD_L + i * barGroupW + (barGroupW - barW) / 2;
          const planH = (v.points / maxVal) * chartH;
          const compH = (v.completed / maxVal) * chartH;
          const planY = PAD_T + chartH - planH;
          const compY = PAD_T + chartH - compH;
          return (
            <g key={v.sprint}>
              {/* Planned bar - gold outline */}
              <rect x={x} y={planY} width={barW} height={planH} rx="4"
                fill="rgba(245,183,49,0.15)" stroke="rgba(245,183,49,0.5)" strokeWidth="1" />
              {/* Completed bar - teal fill */}
              {v.completed > 0 && (
                <rect x={x + 3} y={compY} width={barW - 6} height={compH} rx="3"
                  fill="rgba(34,211,238,0.75)" />
              )}
              <text x={x + barW / 2} y={PAD_T + chartH + 16} textAnchor="middle" fontSize="9" fill="#6e7191" fontFamily="DM Mono, monospace">
                {v.sprint}
              </text>
              <text x={x + barW / 2} y={planY - 5} textAnchor="middle" fontSize="8" fill="#f5b731" fontFamily="DM Mono, monospace">
                {v.points}
              </text>
            </g>
          );
        })}

        {/* Velocity trend line */}
        <polyline points={trendPoints} fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="none" />
        {data.map((v, i) => {
          const cx = PAD_L + i * barGroupW + barGroupW / 2;
          const cy = PAD_T + chartH - (v.completed / maxVal) * chartH;
          return <circle key={i} cx={cx} cy={cy} r="4" fill="#22d3ee" stroke="#0e0e16" strokeWidth="2" />;
        })}

        {/* Avg line */}
        <line
          x1={PAD_L} y1={PAD_T + chartH - (avgCompleted / maxVal) * chartH}
          x2={W - PAD_R} y2={PAD_T + chartH - (avgCompleted / maxVal) * chartH}
          stroke="rgba(245,183,49,0.4)" strokeWidth="1.5" strokeDasharray="5 3"
        />
        <text x={W - PAD_R + 2} y={PAD_T + chartH - (avgCompleted / maxVal) * chartH + 4} fontSize="8" fill="#f5b731" fontFamily="DM Mono, monospace">avg</text>
      </svg>
      <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 10, background: 'rgba(245,183,49,0.15)', border: '1px solid rgba(245,183,49,0.5)', borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: '#6e7191' }}>Planned</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 10, background: 'rgba(34,211,238,0.75)', borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: '#6e7191' }}>Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 2, background: '#22d3ee', borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: '#6e7191' }}>Trend line</span>
        </div>
      </div>
    </div>
  );
}

function BurndownChart() {
  const [burndown, setBurndown] = useState(INITIAL_BURNDOWN);
  const maxPts = 48;
  const days = 14;
  const W = 600, H = 260, PAD_L = 55, PAD_B = 35, PAD_T = 24, PAD_R = 20;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  useEffect(() => {
    const interval = setInterval(() => {
      setBurndown(prev => {
        const lastActual = prev.filter(d => d.actual !== null);
        const nextDay = lastActual.length + 1;
        if (nextDay > days) return prev;
        const lastVal = lastActual[lastActual.length - 1].actual;
        const idealRate = maxPts / (days - 1);
        const delta = idealRate * (0.8 + 0.4 * (nextDay % 3 === 0 ? 0.5 : 1));
        const nextActual = Math.max(0, lastVal - delta);
        return prev.map(d => d.day === nextDay ? { ...d, actual: Math.round(nextActual * 10) / 10 } : d);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const idealPoints = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    ideal: maxPts - (maxPts / (days - 1)) * i,
  }));

  const actualPoints = burndown.filter(d => d.actual !== null);
  const lastActual = actualPoints[actualPoints.length - 1];
  const lastIdeal = idealPoints[actualPoints.length - 1];
  const delta = lastIdeal ? lastActual.actual - lastIdeal.ideal : 0;
  const isAhead = delta < 0;
  const statusBadge = isAhead ? '✅ Ahead of schedule' : '⚠️ Behind schedule';
  const statusColor = isAhead ? '#22c55e' : '#ef4444';

  const toX = (day) => PAD_L + ((day - 1) / (days - 1)) * chartW;
  const toY = (pts) => PAD_T + chartH - (pts / maxPts) * chartH;

  const idealPath = idealPoints.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.day)},${toY(d.ideal)}`).join(' ');
  const actualPath = actualPoints.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.day)},${toY(d.actual)}`).join(' ');

  return (
    <div style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>Burndown — Sprint 12 (14 Days)</div>
        <span style={{
          padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
          background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40`,
        }}>{statusBadge}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* Grid lines */}
        {[0, 12, 24, 36, 48].map(pts => (
          <g key={pts}>
            <line x1={PAD_L} y1={toY(pts)} x2={W - PAD_R} y2={toY(pts)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD_L - 8} y={toY(pts) + 4} textAnchor="end" fontSize="9" fill="#6e7191" fontFamily="DM Mono, monospace">{pts}</text>
          </g>
        ))}
        {Array.from({ length: days }, (_, i) => i + 1).map(day => (
          <g key={day}>
            <line x1={toX(day)} y1={PAD_T} x2={toX(day)} y2={PAD_T + chartH} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={toX(day)} y={PAD_T + chartH + 16} textAnchor="middle" fontSize="8" fill="#6e7191" fontFamily="DM Mono, monospace">D{day}</text>
          </g>
        ))}

        {/* Ideal burndown (gray dashed) */}
        <path d={idealPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />

        {/* Actual area fill */}
        {actualPoints.length > 1 && (
          <path
            d={`${actualPath} L${toX(actualPoints[actualPoints.length - 1].day)},${toY(0)} L${toX(1)},${toY(0)} Z`}
            fill="rgba(245,183,49,0.06)"
          />
        )}

        {/* Actual burndown (gold solid) */}
        {actualPoints.length > 1 && (
          <path d={actualPath} fill="none" stroke="#f5b731" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Actual dots */}
        {actualPoints.map((d, i) => (
          <circle key={i} cx={toX(d.day)} cy={toY(d.actual)} r="5" fill="#f5b731" stroke="#0e0e16" strokeWidth="2" />
        ))}

        {/* Today indicator */}
        <line x1={toX(actualPoints.length)} y1={PAD_T} x2={toX(actualPoints.length)} y2={PAD_T + chartH}
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={toX(actualPoints.length)} y={PAD_T - 6} textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="DM Mono, monospace">TODAY</text>

        {/* Axis labels */}
        <text x={PAD_L - 36} y={PAD_T + chartH / 2} textAnchor="middle" fontSize="8" fill="#6e7191" fontFamily="DM Mono, monospace"
          transform={`rotate(-90,${PAD_L - 36},${PAD_T + chartH / 2})`}>Story Points</text>
      </svg>
      <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="6 4" /></svg>
          <span style={{ fontSize: 10, color: '#6e7191' }}>Ideal burndown</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 2, background: '#f5b731', borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: '#6e7191' }}>Actual burn (live)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 2, height: 14, background: '#ef4444' }} />
          <span style={{ fontSize: 10, color: '#6e7191' }}>Today</span>
        </div>
      </div>
    </div>
  );
}

function TeamCapacityPlanner({ team, setTeam }) {
  const [addForm, setAddForm] = useState({ name: '', role: '', capacity: 40, allocated: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const totalCap = team.reduce((a, m) => a + m.capacity, 0);
  const totalAlloc = team.reduce((a, m) => a + m.allocated, 0);
  const overCount = team.filter(m => (m.allocated / m.capacity) > 1).length;

  const AVATAR_COLORS = ['#f5b731', '#22d3ee', '#a78bfa', '#60a5fa', '#f97316', '#22c55e', '#ec4899'];

  const addMember = () => {
    if (!addForm.name.trim()) return;
    const initials = addForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    setTeam(prev => [...prev, {
      id: Date.now(), name: addForm.name, avatar: initials,
      color: AVATAR_COLORS[prev.length % AVATAR_COLORS.length],
      capacity: addForm.capacity, allocated: addForm.allocated, role: addForm.role,
    }]);
    setAddForm({ name: '', role: '', capacity: 40, allocated: 0 });
    setShowAdd(false);
  };

  const updateMember = (id, field, value) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>Team Capacity — Sprint 12</div>
          {overCount > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 11, fontWeight: 700 }}>
              ⚠ {overCount} member{overCount > 1 ? 's' : ''} over 100% utilization
            </div>
          )}
        </div>
        <button onClick={() => setShowAdd(s => !s)} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: 'linear-gradient(135deg,#22d3ee,#0891b2)', color: '#000',
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
        }}>+ Add Member</button>
      </div>

      {showAdd && (
        <div style={{ padding: '16px', background: '#16161e', borderRadius: 12, border: '1px solid rgba(34,211,238,0.3)', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px', gap: 10, marginBottom: 10 }}>
            {[['Name', 'name', 'text'], ['Role', 'role', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <input type={type} value={addForm[key]} onChange={e => setAddForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '6px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            {[['Capacity (h)', 'capacity'], ['Allocated (h)', 'allocated']].map(([label, key]) => (
              <div key={key}>
                <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <input type="number" value={addForm[key]} onChange={e => setAddForm(f => ({ ...f, [key]: +e.target.value }))} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '6px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addMember} style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: '#22d3ee', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {team.map(member => {
          const util = Math.round((member.allocated / member.capacity) * 100);
          const overloaded = util > 100;
          const nearLimit = util > 85 && !overloaded;
          const barColor = overloaded
            ? 'linear-gradient(90deg,#ef4444,#dc2626)'
            : nearLimit
            ? 'linear-gradient(90deg,#f97316,#ea580c)'
            : `linear-gradient(90deg,${member.color}cc,${member.color}80)`;
          return (
            <div key={member.id} style={{
              padding: '14px 18px', background: '#16161e', borderRadius: 12,
              border: `1px solid ${overloaded ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.07)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: member.color,
                  color: '#000', fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{member.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#e4e4ed' }}>{member.name}</div>
                  <div style={{ fontSize: 10, color: '#6e7191' }}>{member.role}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: overloaded ? '#ef4444' : member.color }}>{util}%</div>
                    <div style={{ fontSize: 9.5, color: '#6e7191' }}>
                      <input type="number" value={member.allocated} min="0" max={member.capacity * 2}
                        onChange={e => updateMember(member.id, 'allocated', +e.target.value)}
                        style={{ width: 32, background: 'transparent', border: 'none', color: '#6e7191', fontSize: 9.5, textAlign: 'right', outline: 'none' }}
                      />/{member.capacity}h
                    </div>
                  </div>
                  {overloaded && (
                    <span style={{ fontSize: 9.5, padding: '2px 6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: 4, border: '1px solid rgba(239,68,68,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>OVERLOADED</span>
                  )}
                  <button onClick={() => removeMember(member.id)} style={{
                    width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)',
                    background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                </div>
              </div>
              <div style={{ height: 7, background: '#0e0e16', borderRadius: 999 }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  width: `${Math.min(util, 100)}%`,
                  background: barColor, transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: '16px 20px', background: '#16161e', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed', marginBottom: 14 }}>Team Total Capacity</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Available', value: `${totalCap}h`, color: '#22d3ee' },
            { label: 'Total Allocated', value: `${totalAlloc}h`, color: '#f5b731' },
            { label: 'Team Utilization', value: `${Math.round((totalAlloc / totalCap) * 100)}%`, color: '#a78bfa' },
            { label: 'Remaining Hours', value: `${totalCap - totalAlloc}h`, color: '#22c55e' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#6e7191', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryPointEstimator() {
  const [description, setDescription] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(null);
  const [complexityFactors, setComplexityFactors] = useState({});
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const toggleFactor = (factor) => {
    setComplexityFactors(prev => ({ ...prev, [factor]: !prev[factor] }));
  };

  const runEstimate = () => {
    if (!description.trim()) return;
    setLoading(true);
    setEstimate(null);
    timerRef.current = setTimeout(() => {
      const activeFactors = Object.values(complexityFactors).filter(Boolean).length;
      const low = activeFactors >= 2 ? 3 : 2;
      const expected = activeFactors >= 3 ? 8 : activeFactors >= 1 ? 5 : 3;
      const high = activeFactors >= 2 ? 13 : 8;
      setEstimate({
        low, expected, high,
        explanation: `Based on ${description.length > 60 ? 'detailed' : 'brief'} description with ${activeFactors} complexity factor${activeFactors !== 1 ? 's' : ''} detected. ${activeFactors >= 3 ? 'High complexity — consider breaking this story down.' : activeFactors >= 1 ? 'Moderate scope with some risk areas.' : 'Straightforward task with clear requirements.'}`,
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 14 }}>🤖 AI Story Point Estimator</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Task Description</div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task in detail... e.g. 'Implement OAuth2 flow with refresh token rotation and session management'"
            style={{
              width: '100%', minHeight: 100, background: '#0e0e16',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
              padding: '10px 12px', color: '#e4e4ed', fontSize: 12,
              outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5,
              fontFamily: 'DM Mono, monospace',
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complexity Factors</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COMPLEXITY_FACTORS.map(factor => {
              const active = complexityFactors[factor];
              return (
                <button key={factor} onClick={() => toggleFactor(factor)} style={{
                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: active ? 'rgba(239,68,68,0.15)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? '#ef4444' : '#6e7191', transition: 'all 0.15s',
                }}>{active ? '☑' : '☐'} {factor}</button>
              );
            })}
          </div>
        </div>

        <button onClick={runEstimate} disabled={loading || !description.trim()} style={{
          padding: '10px 20px', borderRadius: 8, border: 'none', cursor: description.trim() ? 'pointer' : 'not-allowed',
          background: loading ? 'rgba(245,183,49,0.3)' : 'linear-gradient(135deg,#f5b731,#e0a020)',
          color: '#000', fontSize: 13, fontWeight: 700, width: '100%',
          opacity: !description.trim() ? 0.5 : 1, transition: 'all 0.2s',
        }}>
          {loading ? '⏳ Analyzing...' : '✨ AI Estimate'}
        </button>

        {estimate && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(245,183,49,0.05)', borderRadius: 10, border: '1px solid rgba(245,183,49,0.2)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              {[
                { label: 'Low', value: estimate.low, color: '#22c55e' },
                { label: 'Expected', value: estimate.expected, color: '#f5b731' },
                { label: 'High', value: estimate.high, color: '#ef4444' },
              ].map(e => (
                <div key={e.label} style={{
                  flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 8,
                  background: `${e.color}12`, border: `1px solid ${e.color}30`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: e.color }}>{e.value}</div>
                  <div style={{ fontSize: 9.5, color: '#6e7191', marginTop: 2 }}>pts — {e.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#a0a0c8', lineHeight: 1.5 }}>{estimate.explanation}</div>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 14 }}>🎯 Point Selector</div>
        <div style={{ fontSize: 10, color: '#6e7191', marginBottom: 10 }}>Fibonacci sequence — select your estimate</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {FIBONACCI.map(f => (
            <button key={f} onClick={() => setSelectedPoints(f)} style={{
              width: 56, height: 72, borderRadius: 10, cursor: 'pointer', fontSize: 20, fontWeight: 800,
              border: `2px solid ${selectedPoints === f ? '#f5b731' : 'rgba(255,255,255,0.07)'}`,
              background: selectedPoints === f ? 'rgba(245,183,49,0.15)' : '#0e0e16',
              color: selectedPoints === f ? '#f5b731' : '#c0c0d8',
              boxShadow: selectedPoints === f ? '0 0 20px rgba(245,183,49,0.2)' : 'none',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{f}</button>
          ))}
        </div>

        {selectedPoints && (
          <div style={{ padding: '14px 16px', background: 'rgba(34,211,238,0.08)', borderRadius: 10, border: '1px solid rgba(34,211,238,0.25)' }}>
            <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700, marginBottom: 6 }}>Selected: {selectedPoints} Story Points</div>
            <div style={{ fontSize: 10.5, color: '#6e7191', lineHeight: 1.5 }}>
              {selectedPoints <= 2 && 'Simple task. Clear requirements, minimal risk, can be completed in a few hours.'}
              {selectedPoints === 3 && 'Small task. Well-understood with minor unknowns. Roughly half a day of work.'}
              {selectedPoints === 5 && 'Medium task. Some complexity or dependencies. About 1–2 days of focused work.'}
              {selectedPoints === 8 && 'Large task. Significant complexity. Multiple components or integration points. 2–3 days.'}
              {selectedPoints === 13 && 'Very large task. High uncertainty or many dependencies. Consider breaking down further.'}
              {selectedPoints === 21 && '⚠️ Epic-level complexity. Should be split into smaller stories before sprint planning.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RetroPanel() {
  const [items, setItems] = useState(() => {
    const init = {};
    Object.entries(RETRO_TEMPLATES).forEach(([col, arr]) => {
      init[col] = arr.map((text, i) => ({ id: i, text, votes: 0 }));
    });
    return init;
  });
  const [drafts, setDrafts] = useState({ 'Went Well': '', 'Improve': '', 'Action Items': '' });
  const [exported, setExported] = useState(false);

  const addItem = (col) => {
    if (!drafts[col].trim()) return;
    setItems(prev => ({
      ...prev,
      [col]: [...prev[col], { id: Date.now(), text: drafts[col].trim(), votes: 0 }],
    }));
    setDrafts(prev => ({ ...prev, [col]: '' }));
  };

  const vote = (col, id) => {
    setItems(prev => ({
      ...prev,
      [col]: prev[col].map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item),
    }));
  };

  const removeItem = (col, id) => {
    setItems(prev => ({ ...prev, [col]: prev[col].filter(item => item.id !== id) }));
  };

  const exportMarkdown = () => {
    const lines = ['# Sprint 12 Retrospective\n'];
    Object.entries(items).forEach(([col, arr]) => {
      lines.push(`## ${col}\n`);
      arr.forEach(item => lines.push(`- ${item.text} (👍 ${item.votes})\n`));
      lines.push('');
    });
    const md = lines.join('');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sprint-12-retro.md'; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const COL_CONFIG = {
    'Went Well': { color: '#22c55e', icon: '✅' },
    'Improve': { color: '#f5b731', icon: '⚠️' },
    'Action Items': { color: '#22d3ee', icon: '📌' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed' }}>Sprint 12 Retrospective</div>
          <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>Reflect · Vote · Improve</div>
        </div>
        <button onClick={exportMarkdown} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.4)',
          background: exported ? 'rgba(34,197,94,0.1)' : 'rgba(167,139,250,0.1)',
          color: exported ? '#22c55e' : '#a78bfa', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          transition: 'all 0.2s',
        }}>
          {exported ? '✅ Exported!' : '⬇ Export Markdown'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {Object.entries(COL_CONFIG).map(([col, cfg]) => (
          <div key={col} style={{ background: '#16161e', borderRadius: 14, border: `1px solid ${cfg.color}25`, overflow: 'hidden' }}>
            <div style={{
              padding: '12px 14px', borderBottom: `1px solid ${cfg.color}25`,
              background: `${cfg.color}08`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.icon} {col}</div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: `${cfg.color}15`, color: cfg.color, fontWeight: 700 }}>
                {(items[col] || []).length}
              </span>
            </div>
            <div style={{ padding: 12 }}>
              {(items[col] || []).sort((a, b) => b.votes - a.votes).map(item => (
                <div key={item.id} style={{
                  padding: '8px 10px', marginBottom: 7, background: '#0e0e16',
                  borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: '#c0c0d8', lineHeight: 1.4, marginBottom: 6 }}>{item.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={() => vote(col, item.id)} style={{
                      padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.07)',
                      background: 'transparent', color: item.votes > 0 ? '#f5b731' : '#6e7191',
                      cursor: 'pointer', fontSize: 10.5, fontWeight: 700,
                    }}>👍 {item.votes}</button>
                    <button onClick={() => removeItem(col, item.id)} style={{
                      padding: '1px 5px', borderRadius: 4, border: 'none',
                      background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 11,
                    }}>×</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <input
                  value={drafts[col]}
                  onChange={e => setDrafts(prev => ({ ...prev, [col]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addItem(col)}
                  placeholder="Add item..."
                  style={{
                    flex: 1, background: '#0e0e16', border: `1px solid ${cfg.color}30`,
                    borderRadius: 6, padding: '6px 9px', color: '#e4e4ed', fontSize: 11, outline: 'none',
                  }}
                />
                <button onClick={() => addItem(col)} style={{
                  padding: '6px 10px', borderRadius: 6, border: 'none',
                  background: cfg.color, color: '#000', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SprintPlanner() {
  const [sprintBoard, setSprintBoard] = useState(INITIAL_SPRINT);
  const [backlog, setBacklog] = useState(INITIAL_BACKLOG);
  const [activeTab, setActiveTab] = useState('sprint');
  const [pokerStory, setPokerStory] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', points: 3, priority: 'Medium', tags: '', assignee: 0 });
  const [team, setTeam] = useState(INITIAL_TEAM);
  const nextIdRef = useRef(200);

  const totalPoints = Object.values(sprintBoard).flat().reduce((a, t) => a + t.points, 0);
  const donePoints = sprintBoard.done.reduce((a, t) => a + t.points, 0);
  const inProgPoints = sprintBoard.inprogress.reduce((a, t) => a + t.points, 0);
  const completionPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  const avgVelocity = Math.round(VELOCITY_DATA.reduce((a, v) => a + v.completed, 0) / VELOCITY_DATA.length);

  const handleMove = useCallback((story, fromCol, toCol) => {
    setSprintBoard(prev => {
      const nb = { ...prev };
      nb[fromCol] = nb[fromCol].filter(s => s.id !== story.id);
      nb[toCol] = [...nb[toCol], story];
      return nb;
    });
  }, []);

  const moveToSprint = useCallback((item) => {
    setBacklog(prev => prev.filter(b => b.id !== item.id));
    setSprintBoard(prev => ({ ...prev, todo: [...prev.todo, { ...item, assignee: 0 }] }));
  }, []);

  const handlePokerEstimate = useCallback((story, points) => {
    setBacklog(prev => prev.map(b => b.id === story.id ? { ...b, points } : b));
  }, []);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const id = ++nextIdRef.current;
    const task = {
      id,
      title: newTask.title,
      points: newTask.points,
      priority: newTask.priority,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean),
      assignee: newTask.assignee,
    };
    setSprintBoard(prev => ({ ...prev, todo: [task, ...prev.todo] }));
    setNewTask({ title: '', points: 3, priority: 'Medium', tags: '', assignee: 0 });
    setShowAddTask(false);
  };

  const KANBAN_COLS = [
    { key: 'todo', label: 'To Do', color: '#6e7191' },
    { key: 'inprogress', label: 'In Progress', color: '#f5b731' },
    { key: 'done', label: 'Done', color: '#22d3ee' },
  ];

  const TABS = [
    ['sprint', '🗂️ Kanban'],
    ['backlog', '📋 Backlog'],
    ['burndown', '📉 Burndown'],
    ['velocity', '⚡ Velocity'],
    ['capacity', '👥 Capacity'],
    ['estimator', '🤖 Estimator'],
    ['retro', '🔍 Retro'],
    ['releases', '🚀 Releases'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#e4e4ed', paddingBottom: 80, fontFamily: 'DM Mono, Syne, monospace' }}>
      {/* Hero */}
      <div style={{
        padding: '32px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(96,165,250,0.04) 0%, transparent 60%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
              📅 Sprint Planner
            </div>
            <div style={{ fontSize: 13, color: '#6e7191', marginBottom: 16 }}>Agile sprint management for AI projects</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Sprint 12 Active', color: '#22d3ee' },
                { label: '8 Days Left', color: '#f5b731' },
                { label: `${completionPct}% Complete`, color: '#60a5fa' },
                { label: `${donePoints}/${totalPoints} pts`, color: '#a78bfa' },
                { label: `Avg ${avgVelocity} pts/sprint`, color: '#6e7191' },
              ].map((b, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                  background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30`,
                }}>{b.label}</span>
              ))}
            </div>
          </div>
          {activeTab === 'sprint' && (
            <button onClick={() => setShowAddTask(true)} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}>+ Add Task</button>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', background: '#16161e' }}>
            <div style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg,#60a5fa,#22d3ee)', transition: 'width 0.5s' }} />
            <div style={{ width: `${(inProgPoints / totalPoints) * 100}%`, background: 'rgba(245,183,49,0.5)' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 10, color: '#6e7191' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, background: '#22d3ee', borderRadius: 2 }} />Done ({donePoints} pts)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, background: 'rgba(245,183,49,0.5)', borderRadius: 2 }} />In Progress ({inProgPoints} pts)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, background: '#16161e', borderRadius: 2, border: '1px solid rgba(255,255,255,0.07)' }} />Remaining ({totalPoints - donePoints - inProgPoints} pts)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 2, overflowX: 'auto' }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: 'transparent', color: activeTab === id ? '#60a5fa' : '#6e7191',
            borderBottom: activeTab === id ? '2px solid #60a5fa' : '2px solid transparent',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* KANBAN */}
        {activeTab === 'sprint' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, minWidth: 860, overflowX: 'auto' }}>
            {KANBAN_COLS.map(col => {
              const colStories = sprintBoard[col.key];
              const colPts = colStories.reduce((a, s) => a + s.points, 0);
              return (
                <div key={col.key} style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: `3px solid ${col.color}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: '#6e7191' }}>{colPts} pts</span>
                      <span style={{
                        fontSize: 10, width: 20, height: 20, borderRadius: '50%',
                        background: `${col.color}20`, color: col.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                      }}>{colStories.length}</span>
                    </div>
                  </div>
                  <div style={{ padding: 12, minHeight: 200 }}>
                    {colStories.map(story => (
                      <StoryCard
                        key={story.id} story={story}
                        onMove={handleMove}
                        columns={['todo', 'inprogress', 'done']}
                        currentCol={col.key}
                        team={team}
                      />
                    ))}
                    {colStories.length === 0 && (
                      <div style={{ textAlign: 'center', padding: 20, color: '#6e7191', fontSize: 12 }}>Drop stories here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BACKLOG */}
        {activeTab === 'backlog' && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 16 }}>Product Backlog — Prioritized</div>
            {backlog.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
                padding: '12px 16px', background: '#16161e', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${PRIORITY_COLORS[item.priority]}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e4e4ed', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.tags.map(t => (
                      <span key={t} style={{ fontSize: 9.5, padding: '1px 5px', background: '#0e0e16', color: '#6e7191', borderRadius: 3, border: '1px solid rgba(255,255,255,0.07)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${PRIORITY_COLORS[item.priority]}20`, color: PRIORITY_COLORS[item.priority], fontWeight: 700 }}>{item.priority}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,183,49,0.15)',
                    color: '#f5b731', fontSize: 12, fontWeight: 800, border: '1px solid rgba(245,183,49,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{item.points}</div>
                  <button onClick={() => setPokerStory(item)} style={{
                    padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)',
                    background: '#0e0e16', color: '#6e7191', cursor: 'pointer', fontSize: 10,
                  }}>🃏 Poker</button>
                  <button onClick={() => moveToSprint(item)} style={{
                    padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(34,211,238,0.4)',
                    background: 'rgba(34,211,238,0.1)', color: '#22d3ee', cursor: 'pointer', fontSize: 10, fontWeight: 600,
                  }}>→ Sprint</button>
                </div>
              </div>
            ))}
            {backlog.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#6e7191', fontSize: 13 }}>🎉 Backlog empty — all items in sprint!</div>
            )}
          </div>
        )}

        {/* BURNDOWN */}
        {activeTab === 'burndown' && <BurndownChart />}

        {/* VELOCITY */}
        {activeTab === 'velocity' && (
          <div>
            <VelocityChart data={VELOCITY_DATA} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 20 }}>
              {[
                { label: 'Current Sprint Target', value: '48 pts', color: '#f5b731', icon: '🎯' },
                { label: 'Average Velocity', value: `${avgVelocity} pts`, color: '#60a5fa', icon: '📊' },
                { label: 'Velocity Trend', value: '↑ +14%', color: '#22d3ee', icon: '📈' },
              ].map(s => (
                <div key={s.label} style={{ padding: '16px 20px', background: '#16161e', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: '#6e7191' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAPACITY */}
        {activeTab === 'capacity' && <TeamCapacityPlanner team={team} setTeam={setTeam} />}

        {/* ESTIMATOR */}
        {activeTab === 'estimator' && (
          <div style={{ background: '#16161e', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', padding: 24 }}>
            <StoryPointEstimator />
          </div>
        )}

        {/* RETROSPECTIVE */}
        {activeTab === 'retro' && <RetroPanel />}

        {/* RELEASES */}
        {activeTab === 'releases' && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', marginBottom: 16 }}>Release Planning</div>
            {RELEASES_DATA.map((release, i) => {
              const statusColor = release.status === 'In Progress' ? '#22d3ee' : release.status === 'Released' ? '#22c55e' : '#a78bfa';
              return (
                <div key={i} style={{
                  marginBottom: 16, padding: 20, background: '#16161e', borderRadius: 14,
                  border: `1px solid ${release.status === 'In Progress' ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#e4e4ed', marginBottom: 4 }}>🚀 {release.name}</div>
                      <div style={{ fontSize: 11, color: '#6e7191' }}>Target: <span style={{ color: '#f5b731', fontWeight: 600 }}>{release.date}</span></div>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '3px 10px', borderRadius: 999, fontWeight: 700,
                      background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`,
                    }}>{release.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10.5, color: '#6e7191' }}>Sprints:</span>
                    {release.sprints.map(s => (
                      <span key={s} style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 10.5, fontWeight: 700,
                        background: s === 'S12' ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
                        color: s === 'S12' ? '#22d3ee' : '#6e7191',
                        border: s === 'S12' ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.07)',
                      }}>{s}{s === 'S12' ? ' ◉' : ''}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowAddTask(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 460, background: '#16161e', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 20 }}>+ Add Sprint Task</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Title</div>
              <input value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e4e4ed', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Points</div>
                <select value={newTask.points} onChange={e => setNewTask(t => ({ ...t, points: +e.target.value }))} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none' }}>
                  {FIBONACCI.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Priority</div>
                <select value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none' }}>
                  {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assignee</div>
                <select value={newTask.assignee} onChange={e => setNewTask(t => ({ ...t, assignee: +e.target.value }))} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px', color: '#e4e4ed', fontSize: 12, outline: 'none' }}>
                  {team.map((m, i) => <option key={m.id} value={i}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10.5, color: '#6e7191', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags (comma-separated)</div>
              <input value={newTask.tags} onChange={e => setNewTask(t => ({ ...t, tags: e.target.value }))} placeholder="AI, Backend, UX"
                style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e4e4ed', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddTask(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#6e7191', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button onClick={addTask} style={{
                padding: '8px 20px', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', color: '#fff',
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
              }}>Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Planning Poker Modal */}
      {pokerStory && (
        <PokerModal
          story={pokerStory}
          onClose={() => setPokerStory(null)}
          onEstimate={handlePokerEstimate}
          team={team}
        />
      )}
    </div>
  );
}
