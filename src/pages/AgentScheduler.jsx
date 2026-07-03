import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Colours ─────────────────────────────────────────────────────── */
const C = {
  bg:      '#0d0f1a',
  surface: '#12151f',
  card:    '#181c2e',
  border:  '#252840',
  accent:  '#6c63ff',
  accentD: '#4f46e5',
  teal:    '#0ef0c0',
  gold:    '#fbbf24',
  red:     '#f87171',
  green:   '#4ade80',
  text:    '#e2e8f0',
  muted:   '#6b7280',
  purple:  '#a78bfa',
  blue:    '#60a5fa',
  orange:  '#fb923c',
};

const AGENTS = ['Hermes', 'AutoGen', 'CrewAI', 'LangChain', 'Custom'];
const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Karachi', 'Asia/Tokyo', 'Australia/Sydney'];
const LS_TASKS_KEY = 'ag_scheduler_tasks_v1';
const LS_HISTORY_KEY = 'ag_scheduler_history_v1';

const TEMPLATES = [
  { name: 'Daily Report', cron: '0 8 * * *',   agent: 'Hermes',  prompt: 'Generate a comprehensive daily summary of all agent activities and metrics.' },
  { name: 'Hourly Sync',  cron: '0 * * * *',   agent: 'AutoGen', prompt: 'Sync all data sources and check for any anomalies or updates.' },
  { name: 'Weekly Summary', cron: '0 9 * * 1', agent: 'CrewAI',  prompt: 'Produce a weekly performance summary with charts and insights.' },
];

const STATUS_COLORS = { success: C.green, failed: C.red, running: C.blue, idle: C.muted, disabled: C.border };
const STATUS_ICONS  = { success: '✅', failed: '❌', running: '🔵', idle: '⏸', disabled: '⛔' };

/* ── Seed ───────────────────────────────────────────────────────────── */
const SEED_TASKS = [
  { id: 't1', name: 'Daily Report',   agent: 'Hermes',  cron: '0 8 * * *',   prompt: 'Generate daily summary', enabled: true,  status: 'idle', lastRun: '2026-06-29T08:00:00Z', tz: 'UTC' },
  { id: 't2', name: 'Hourly Sync',    agent: 'AutoGen', cron: '0 * * * *',   prompt: 'Sync all data sources', enabled: true,  status: 'idle', lastRun: '2026-06-30T09:00:00Z', tz: 'UTC' },
  { id: 't3', name: 'Weekly Summary', agent: 'CrewAI',  cron: '0 9 * * 1',   prompt: 'Produce weekly summary', enabled: false, status: 'disabled', lastRun: '2026-06-23T09:00:00Z', tz: 'UTC' },
];
const SEED_HISTORY = [
  { id: 'h1', taskId: 't1', taskName: 'Daily Report', date: '2026-06-29T08:00:00Z', status: 'success', duration: 3400, output: 'Report generated. 48 actions summarised. Export sent.' },
  { id: 'h2', taskId: 't2', taskName: 'Hourly Sync',  date: '2026-06-30T09:00:00Z', status: 'success', duration: 820,  output: 'Sync OK. 3 sources updated. No anomalies detected.' },
  { id: 'h3', taskId: 't1', taskName: 'Daily Report', date: '2026-06-28T08:00:00Z', status: 'failed',  duration: 1200, output: 'ERROR: Upstream API timeout after 1.2s. Retry scheduled.' },
];

function loadTasks()   { try { return JSON.parse(localStorage.getItem(LS_TASKS_KEY))   || SEED_TASKS;   } catch { return SEED_TASKS;   } }
function loadHistory() { try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY)) || SEED_HISTORY; } catch { return SEED_HISTORY; } }
function saveTasks(d)   { localStorage.setItem(LS_TASKS_KEY,   JSON.stringify(d)); }
function saveHistory(d) { localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(d)); }

function uid() { return Math.random().toString(36).slice(2, 10); }

/* ─── Cron utilities ─────────────────────────────────────────────── */
function parseCron(expr) {
  const [min, hr, dom, mon, dow] = (expr || '* * * * *').split(' ');
  return { min, hr, dom, mon, dow };
}

function nextRunTimes(cronExpr, count = 5) {
  /* Very simple heuristic — real implem would use a proper parser */
  const [min, hr] = parseCron(cronExpr);
  const results = [];
  const now = new Date();
  let d = new Date(now);
  d.setSeconds(0); d.setMilliseconds(0);

  const targetMin = min === '*' ? null : parseInt(min, 10);
  const targetHr  = hr  === '*' ? null : parseInt(hr, 10);

  for (let i = 0; i < count * 30 && results.length < count; i++) {
    d = new Date(d.getTime() + 60000);
    if (targetMin !== null && d.getMinutes() !== targetMin) continue;
    if (targetHr  !== null && d.getHours()   !== targetHr)  continue;
    results.push(new Date(d));
  }
  return results;
}

function fmtDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
function fmtDur(ms) {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const inputStyle = {
  background: '#0d0f1a', border: `1px solid #252840`, color: '#e2e8f0',
  borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
};

/* ─── Visual Cron Builder ──────────────────────────────────────────── */
const MINUTES   = Array.from({ length: 12 }, (_, i) => i * 5);  // 0,5,10…55
const HOURS     = Array.from({ length: 24 }, (_, i) => i);
const WEEKDAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHDAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function CronBuilder({ value, onChange }) {
  const { min: initMin, hr: initHr, dom: initDom, dow: initDow } = parseCron(value);

  const [selMin, setSelMin] = useState(initMin === '*' ? [] : [parseInt(initMin, 10)]);
  const [selHr,  setSelHr]  = useState(initHr  === '*' ? [] : [parseInt(initHr,  10)]);
  const [selDom, setSelDom] = useState(initDom === '*' ? [] : [parseInt(initDom, 10)]);
  const [selDow, setSelDow] = useState(initDow === '*' ? [] : [parseInt(initDow, 10)]);

  const toggleItem = (arr, setArr, v) => {
    const next = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
    return next;
  };

  const build = useCallback((min, hr, dom, dow) => {
    const f = a => a.length === 0 ? '*' : a.sort((a,b)=>a-b).join(',');
    onChange(`${f(min)} ${f(hr)} ${f(dom)} * ${f(dow)}`);
  }, [onChange]);

  const handleMin = v => { const n = toggleItem(selMin, setSelMin, v); setSelMin(n); build(n, selHr, selDom, selDow); };
  const handleHr  = v => { const n = toggleItem(selHr,  setSelHr,  v); setSelHr(n);  build(selMin, n, selDom, selDow); };
  const handleDom = v => { const n = toggleItem(selDom, setSelDom, v); setSelDom(n); build(selMin, selHr, n, selDow); };
  const handleDow = v => { const n = toggleItem(selDow, setSelDow, v); setSelDow(n); build(selMin, selHr, selDom, n); };

  const chipStyle = (active, color = C.accent) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '3px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
    background: active ? color + '33' : C.surface, color: active ? color : C.muted,
    border: `1px solid ${active ? color : C.border}`, margin: '2px', userSelect: 'none',
    transition: 'all 0.15s', fontWeight: active ? 700 : 400,
  });

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px', marginTop: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 10 }}>🎛 Visual Cron Builder</div>
      <div style={{ marginBottom: 10, padding: '8px 12px', background: C.bg, borderRadius: 8, fontFamily: 'DM Mono, monospace', fontSize: 13, color: C.teal }}>
        {value}
      </div>

      {[
        { label: '⏱ Minutes (every N minutes)', items: MINUTES, sel: selMin, onToggle: handleMin, color: C.teal },
        { label: '🕐 Hours',    items: HOURS,     sel: selHr,  onToggle: handleHr,  color: C.blue   },
        { label: '📅 Weekday', items: WEEKDAYS,  sel: selDow, onToggle: handleDow, color: C.purple  },
        { label: '🗓 Month Day',items: MONTHDAYS, sel: selDom, onToggle: handleDom, color: C.gold   },
      ].map(({ label, items, sel, onToggle, color }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label} {sel.length === 0 ? '(* = any)' : ''}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: 90, overflowY: 'auto' }}>
            {items.map((item, i) => (
              <span key={i} style={chipStyle(sel.includes(typeof item === 'string' ? i : item), color)}
                onClick={() => onToggle(typeof item === 'string' ? i : item)}>
                {typeof item === 'string' ? item : String(item).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Next Runs Preview ──────────────────────────────────────────── */
function NextRunsPreview({ cron, tz }) {
  const runs = nextRunTimes(cron, 5);
  if (!runs.length) return <span style={{ color: C.muted, fontSize: 12 }}>—</span>;
  return (
    <div>
      {runs.map((r, i) => (
        <div key={i} style={{ fontSize: 11, color: i === 0 ? C.teal : C.muted, marginBottom: 2 }}>
          {i + 1}. {r.toLocaleString()} {tz !== 'UTC' ? `(${tz})` : ''}
        </div>
      ))}
    </div>
  );
}

/* ─── Streaming output panel ─────────────────────────────────────── */
function StreamPanel({ task, onClose }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const ref = useRef();

  const MOCK_LINES = [
    `[00:00] 🚀 Starting task: ${task.name}`,
    `[00:01] 🤖 Agent: ${task.agent} — initializing`,
    `[00:02] 📋 Prompt loaded (${task.prompt.length} chars)`,
    `[00:03] 🔍 Gathering context and tool mappings…`,
    `[00:05] ⚡ LLM inference started…`,
    `[00:12] 📨 Streaming response chunk 1/4`,
    `[00:14] 📨 Streaming response chunk 2/4`,
    `[00:17] 📨 Streaming response chunk 3/4`,
    `[00:19] 📨 Streaming response chunk 4/4`,
    `[00:20] ✅ Task complete. Tokens used: 1,847. Duration: 20s`,
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_LINES.length) {
        setLines(l => [...l, MOCK_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
      if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, 700);
    return () => clearInterval(interval);
  }, [task.id]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0009', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, width: 580, maxWidth: '95vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>▶ Running: {task.name}</span>
          {done && <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>✅ Done</span>}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div ref={ref} style={{
          flex: 1, overflowY: 'auto', background: C.bg, borderRadius: 10, padding: '12px 14px',
          fontFamily: 'DM Mono, monospace', fontSize: 12, color: C.text, lineHeight: 1.7,
          maxHeight: 380,
        }}>
          {lines.map((l, i) => (
            <div key={i} style={{ color: l.includes('✅') ? C.green : l.includes('ERROR') ? C.red : C.muted }}>
              {l}
            </div>
          ))}
          {!done && <span style={{ color: C.blue, animation: 'blink 1s step-end infinite' }}>▍</span>}
        </div>
        {done && (
          <button onClick={onClose} style={{ marginTop: 14, background: C.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontWeight: 700 }}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Create / Edit Task Form ────────────────────────────────────── */
function TaskForm({ onSave, onCancel, initial, tz }) {
  const blank = { name: '', agent: 'Hermes', prompt: '', cron: '0 8 * * *', tz };
  const [form, setForm] = useState(initial || blank);
  const [showBuilder, setShowBuilder] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadTemplate = t => setForm(f => ({ ...f, name: t.name, agent: t.agent, cron: t.cron, prompt: t.prompt }));

  return (
    <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: 22, marginBottom: 24, animation: 'fadeSlideIn 0.2s ease' }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>
        {initial ? '✏️ Edit Task' : '➕ New Scheduled Task'}
      </div>

      {/* Templates */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>📦 Quick Templates</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TEMPLATES.map(t => (
            <button key={t.name} onClick={() => loadTemplate(t)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.blue, borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <input placeholder="Task name" value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
        <select value={form.agent} onChange={e => set('agent', e.target.value)} style={inputStyle}>
          {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <textarea placeholder="Prompt / instructions for the agent…" value={form.prompt} onChange={e => set('prompt', e.target.value)}
        rows={3} style={{ ...inputStyle, marginBottom: 10, resize: 'vertical' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 4 }}>
        <div>
          <input placeholder="Cron expression (e.g. 0 8 * * *)" value={form.cron} onChange={e => set('cron', e.target.value)} style={inputStyle} />
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>min hr dom mon dow</div>
        </div>
        <select value={form.tz || tz} onChange={e => set('tz', e.target.value)} style={inputStyle}>
          {TIMEZONES.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      <button onClick={() => setShowBuilder(b => !b)}
        style={{ background: 'none', border: 'none', color: C.purple, cursor: 'pointer', fontSize: 12, padding: 0, marginBottom: 4 }}>
        {showBuilder ? '▲ Hide' : '▼ Visual Cron Builder'}
      </button>
      {showBuilder && <CronBuilder value={form.cron} onChange={v => set('cron', v)} />}

      {/* Next runs preview */}
      {form.cron && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: C.bg, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>⏭ Next 5 runs:</div>
          <NextRunsPreview cron={form.cron} tz={form.tz || tz} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => form.name.trim() && onSave(form)}
          style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentD})`, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', cursor: 'pointer', fontWeight: 700 }}>
          {initial ? 'Update Task' : 'Create Task'}
        </button>
        <button onClick={onCancel}
          style={{ background: C.border, color: C.muted, border: 'none', borderRadius: 8, padding: '9px 14px', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Schedule Table ─────────────────────────────────────────────── */
function ScheduleTable({ tasks, onToggle, onRunNow, onDelete, onEdit }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 28 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Name', 'Agent', 'Cron', 'Last Run', 'Next Run', 'Status', 'Actions'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: C.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const nextRuns = nextRunTimes(task.cron, 1);
            const st = task.enabled ? task.status : 'disabled';
            return (
              <tr key={task.id} style={{ borderBottom: `1px solid ${C.border}18`, background: task.enabled ? 'transparent' : '#ffffff04' }}>
                <td style={{ padding: '11px 12px', color: C.text, fontWeight: 600 }}>{task.name}</td>
                <td style={{ padding: '11px 12px' }}>
                  <span style={{ background: C.accent + '22', color: C.accent, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{task.agent}</span>
                </td>
                <td style={{ padding: '11px 12px', fontFamily: 'DM Mono, monospace', color: C.teal, fontSize: 12 }}>{task.cron}</td>
                <td style={{ padding: '11px 12px', color: C.muted, fontSize: 12 }}>{fmtDate(task.lastRun)}</td>
                <td style={{ padding: '11px 12px', color: task.enabled ? C.teal : C.muted, fontSize: 12 }}>
                  {task.enabled && nextRuns[0] ? nextRuns[0].toLocaleString() : '—'}
                </td>
                <td style={{ padding: '11px 12px' }}>
                  <span style={{ color: STATUS_COLORS[st], fontWeight: 700, fontSize: 12 }}>
                    {STATUS_ICONS[st]} {st}
                  </span>
                </td>
                <td style={{ padding: '11px 12px' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {/* Toggle */}
                    <label style={{ position: 'relative', display: 'inline-block', width: 36, height: 20, flexShrink: 0 }}>
                      <input type="checkbox" checked={task.enabled} onChange={() => onToggle(task.id)}
                        style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', inset: 0, borderRadius: 20,
                        background: task.enabled ? C.teal : C.border, transition: '0.3s',
                      }}>
                        <span style={{
                          position: 'absolute', height: 14, width: 14, left: task.enabled ? 18 : 3, bottom: 3,
                          background: '#fff', borderRadius: '50%', transition: '0.3s',
                        }} />
                      </span>
                    </label>
                    <button onClick={() => onRunNow(task)}
                      style={{ background: C.green + '22', color: C.green, border: `1px solid ${C.green}44`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                      ▶ Run
                    </button>
                    <button onClick={() => onEdit(task)}
                      style={{ background: C.blue + '22', color: C.blue, border: `1px solid ${C.blue}44`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>
                      ✏
                    </button>
                    <button onClick={() => onDelete(task.id)}
                      style={{ background: C.red + '22', color: C.red, border: `1px solid ${C.red}44`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── History log ────────────────────────────────────────────────── */
function HistoryLog({ history, tasks }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? history : history.filter(h => h.status === filter);
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>📋 Run History</span>
        {['all', 'success', 'failed', 'running'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ background: filter === s ? C.accent + '22' : 'none', color: filter === s ? C.accent : C.muted,
              border: `1px solid ${filter === s ? C.accent : C.border}`, borderRadius: 7, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontWeight: filter === s ? 700 : 400 }}>
            {s === 'all' ? 'All' : STATUS_ICONS[s] + ' ' + s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ color: C.muted, textAlign: 'center', padding: '40px 0', fontSize: 13 }}>No runs recorded yet.</div>
      ) : filtered.map(h => (
        <div key={h.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 8,
          borderLeft: `3px solid ${STATUS_COLORS[h.status]}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{h.taskName}</span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: STATUS_COLORS[h.status], fontWeight: 700, fontSize: 12 }}>{STATUS_ICONS[h.status]} {h.status}</span>
              <span style={{ color: C.gold, fontSize: 12 }}>{fmtDur(h.duration)}</span>
              <span style={{ color: C.muted, fontSize: 11 }}>{fmtDate(h.date)}</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: 'DM Mono, monospace', background: C.bg, borderRadius: 6, padding: '6px 10px' }}>
            {h.output}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ═══════════════════════════════════════════════════════════════════ */
export default function AgentScheduler({ onNav }) {
  const [tasks,   setTasks]   = useState(loadTasks);
  const [history, setHistory] = useState(loadHistory);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [runTask,  setRunTask]  = useState(null);
  const [tz, setTz] = useState('UTC');
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'history'

  useEffect(() => { saveTasks(tasks);     }, [tasks]);
  useEffect(() => { saveHistory(history); }, [history]);

  const showToast = (msg, color = C.teal) => {
    setToast({ msg, color }); setTimeout(() => setToast(null), 2500);
  };

  const createTask = useCallback(form => {
    if (editTask) {
      setTasks(ts => ts.map(t => t.id === editTask.id ? { ...t, ...form } : t));
      showToast(`Task "${form.name}" updated ✓`);
      setEditTask(null);
    } else {
      setTasks(ts => [...ts, { id: uid(), ...form, enabled: true, status: 'idle', lastRun: null }]);
      showToast(`Task "${form.name}" created ✓`);
    }
    setShowForm(false);
  }, [editTask]);

  const toggleTask = useCallback(id => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, enabled: !t.enabled, status: !t.enabled ? 'idle' : 'disabled' } : t));
  }, []);

  const deleteTask = useCallback(id => {
    setTasks(ts => ts.filter(t => t.id !== id));
    showToast('Task deleted', C.red);
  }, []);

  const runNow = useCallback(task => {
    setRunTask(task);
    /* Mock: update history after 12s (stream simulation) */
    const dur = 8000 + Math.random() * 6000;
    const success = Math.random() > 0.2;
    setTimeout(() => {
      const entry = {
        id: uid(), taskId: task.id, taskName: task.name,
        date: new Date().toISOString(), status: success ? 'success' : 'failed',
        duration: Math.round(dur), output: success
          ? `Task completed successfully. Agent ${task.agent} processed ${task.prompt.slice(0, 40)}…`
          : `ERROR: Agent ${task.agent} timed out. Retry in 60s.`,
      };
      setHistory(h => [entry, ...h]);
      setTasks(ts => ts.map(t => t.id === task.id ? { ...t, lastRun: entry.date, status: 'idle' } : t));
    }, dur);
  }, []);

  const exportJSON = () => {
    const data = { tasks, history };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'agent_scheduler.json'; a.click();
    showToast('Exported ✓');
  };

  const fileRef = useRef();
  const importJSON = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.tasks) setTasks(d.tasks);
        if (d.history) setHistory(d.history);
        showToast('Imported ✓');
      } catch { showToast('Invalid format', C.red); }
    };
    reader.readAsText(file); e.target.value = '';
  };

  /* stats */
  const enabled  = tasks.filter(t => t.enabled).length;
  const disabled = tasks.filter(t => !t.enabled).length;
  const successes = history.filter(h => h.status === 'success').length;
  const failures  = history.filter(h => h.status === 'failed').length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', padding: '28px 24px' }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        button:hover { filter: brightness(1.12); }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        select option { background: #12151f; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0d0f1a; } ::-webkit-scrollbar-thumb { background: #252840; border-radius: 4px; }
        *:focus { outline: 2px solid #6c63ff55; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 24, background: C.card, border: `1px solid ${toast.color}55`,
          borderRadius: 10, padding: '12px 20px', color: toast.color, fontWeight: 700, fontSize: 13, zIndex: 9999,
          animation: 'fadeSlideIn 0.2s ease', boxShadow: '0 8px 32px #0006' }}>
          {toast.msg}
        </div>
      )}

      {/* Stream panel modal */}
      {runTask && <StreamPanel task={runTask} onClose={() => setRunTask(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⏰ Agent Scheduler
          </h1>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>Cron-style task scheduler for autonomous agents</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={tz} onChange={e => setTz(e.target.value)} style={{ ...inputStyle, width: 180 }}>
            {TIMEZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <button onClick={() => { setShowForm(true); setEditTask(null); }}
            style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentD})`, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            + New Task
          </button>
          <button onClick={exportJSON}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.gold, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}>
            ⬆ Export
          </button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJSON} />
          <button onClick={() => fileRef.current.click()}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.blue, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}>
            ⬇ Import
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Tasks',  value: tasks.length,  color: C.blue,   icon: '📋' },
          { label: 'Enabled',      value: enabled,        color: C.green,  icon: '✅' },
          { label: 'Disabled',     value: disabled,       color: C.muted,  icon: '⛔' },
          { label: 'Successes',    value: successes,      color: C.teal,   icon: '🎯' },
          { label: 'Failures',     value: failures,       color: C.red,    icon: '❌' },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {[['tasks', '📋 Tasks'], ['history', '📜 Run History']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ background: activeTab === id ? C.accent + '22' : 'none', color: activeTab === id ? C.accent : C.muted,
              border: `1px solid ${activeTab === id ? C.accent : 'transparent'}`,
              borderBottom: activeTab === id ? `2px solid ${C.accent}` : '2px solid transparent',
              borderRadius: '8px 8px 0 0', padding: '9px 20px', cursor: 'pointer', fontWeight: activeTab === id ? 700 : 500, fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* New / edit form */}
      {(showForm || editTask) && (
        <TaskForm
          onSave={createTask}
          onCancel={() => { setShowForm(false); setEditTask(null); }}
          initial={editTask}
          tz={tz}
        />
      )}

      {activeTab === 'tasks' && (
        tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏰</div>
            No tasks yet. Create your first scheduled task above.
          </div>
        ) : (
          <ScheduleTable
            tasks={tasks}
            onToggle={toggleTask}
            onRunNow={runNow}
            onDelete={deleteTask}
            onEdit={t => { setEditTask(t); setShowForm(false); }}
          />
        )
      )}

      {activeTab === 'history' && <HistoryLog history={history} tasks={tasks} />}

      {/* Next runs overview */}
      {activeTab === 'tasks' && tasks.some(t => t.enabled) && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', marginTop: 16 }}>
          <div style={{ fontWeight: 700, color: C.text, fontSize: 14, marginBottom: 14 }}>⏭ Upcoming Runs (Next 5)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {tasks.filter(t => t.enabled).map(task => (
              <div key={task.id} style={{ background: C.surface, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 13, marginBottom: 6 }}>
                  {task.name}
                  <span style={{ background: C.accent + '22', color: C.accent, borderRadius: 6, padding: '2px 7px', fontSize: 10, fontWeight: 700, marginLeft: 8 }}>{task.agent}</span>
                </div>
                <NextRunsPreview cron={task.cron} tz={task.tz || tz} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
