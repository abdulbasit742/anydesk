import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '../data/store';

/* ── helpers ─────────────────────────────────────────────── */
function genId() { return Math.random().toString(36).slice(2, 10); }
function pad2(n) { return String(n).padStart(2, '0'); }

function nextRunLabel(job) {
  if (!job.enabled) return 'Paused';
  const now = new Date();
  const [h, m] = job.time.split(':').map(Number);
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diff = next - now;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  if (hrs > 0) return `in ${hrs}h ${mins % 60}m`;
  return `in ${mins}m`;
}

function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

/* Week helper — returns Mon-Sun of the current week */
function getWeekDates() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_KEYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const JOB_TYPES = [
  { id: 'broadcast',    label: 'Broadcast',      icon: '📡', color: 'var(--gold)',   desc: 'Send a prompt to selected accounts' },
  { id: 'health_check', label: 'Health Check',   icon: '🩺', color: 'var(--teal)',   desc: 'Ping all platforms and log results' },
  { id: 'credit_check', label: 'Credit Check',   icon: '💳', color: 'var(--blue)',   desc: 'Alert if any account falls below threshold' },
  { id: 'workflow',     label: 'Run Workflow',   icon: '⚙️', color: 'var(--purple)', desc: 'Execute an automation workflow' },
  { id: 'export',       label: 'Auto Export',    icon: '⬇️', color: 'var(--cyan)',   desc: 'Export workspace data to JSON' },
  { id: 'ping_sweep',   label: 'Ping Sweep',     icon: '⟳',  color: 'var(--muted2)', desc: 'Full platform latency sweep' },
];

const REPEAT_OPTIONS = [
  { id: 'once',    label: 'Once' },
  { id: 'daily',   label: 'Daily' },
  { id: 'weekly',  label: 'Weekly' },
  { id: 'weekdays',label: 'Weekdays' },
  { id: 'hourly',  label: 'Hourly' },
];

const QUICK_TIMES = ['06:00', '08:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

/* ── Job Card ────────────────────────────────────────────── */
function JobCard({ job, onToggle, onDelete, onRunNow, isRunning }) {
  const jt = JOB_TYPES.find(t => t.id === job.type) || JOB_TYPES[0];
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid ${job.enabled ? 'var(--border)' : 'rgba(255,255,255,0.04)'}`,
      borderLeft: `3px solid ${job.enabled ? jt.color : 'var(--muted)'}`,
      borderRadius: 12, overflow: 'hidden',
      opacity: job.enabled ? 1 : 0.6,
      transition: 'all 0.2s',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{jt.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: job.enabled ? '#fff' : 'var(--muted2)', lineHeight: 1.2 }}>
            {job.name}
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2, fontFamily: 'DM Mono,monospace', display: 'flex', gap: 10 }}>
            <span>🕐 {job.time}</span>
            <span>🔁 {REPEAT_OPTIONS.find(r => r.id === job.repeat)?.label || job.repeat}</span>
            <span style={{ color: job.enabled ? jt.color : 'var(--muted)' }}>{nextRunLabel(job)}</span>
          </div>
        </div>

        {/* Status / run indicator */}
        {isRunning ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--teal)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 0.8s infinite', display: 'inline-block' }} />
            Running…
          </div>
        ) : job.lastRun ? (
          <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
            ✓ {fmtTime(job.lastRun)}
          </span>
        ) : null}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => onRunNow(job)}
            disabled={isRunning}
            title="Run now"
            style={{ fontSize: 10, padding: '3px 8px' }}
          >▶</button>
          {/* Feature 31: Suspend cron execution job toggle switch */}
          <div
            onClick={() => onToggle(job.id)}
            title={job.enabled ? 'Suspend job' : 'Activate job'}
            style={{
              width: 30, height: 16, borderRadius: 8,
              background: job.enabled ? 'var(--teal)' : 'var(--surface3)',
              border: '1px solid var(--border)',
              position: 'relative', cursor: 'pointer',
              display: 'inline-block',
              transition: 'background 0.2s',
              margin: '0 4px',
              verticalAlign: 'middle'
            }}
          >
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#fff', position: 'absolute',
              top: 1, left: job.enabled ? 15 : 1,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => onDelete(job.id)}
            style={{ fontSize: 10, padding: '3px 8px', color: 'var(--red)' }}
            title="Delete"
          >✕</button>
        </div>
        <span style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {[
              { label: 'Type',    val: jt.label },
              { label: 'Repeat',  val: REPEAT_OPTIONS.find(r => r.id === job.repeat)?.label },
              { label: 'Time',    val: job.time },
              { label: 'Days',    val: job.days?.length > 0 ? job.days.join(', ') : 'Every day' },
              { label: 'Created', val: fmtTime(job.createdAt) },
              { label: 'Runs',    val: job.runCount || 0 },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 11.5, color: '#dde0f0', marginTop: 2, fontFamily: 'DM Mono,monospace' }}>{val}</div>
              </div>
            ))}
          </div>
          {job.prompt && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Prompt</div>
              <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: 'DM Mono,monospace', background: 'var(--surface3)', borderRadius: 7, padding: '7px 10px', lineHeight: 1.5 }}>
                {job.prompt.slice(0, 140)}{job.prompt.length > 140 ? '…' : ''}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── New Job Modal ───────────────────────────────────────── */
function NewJobModal({ onClose, onSave, workflows }) {
  const [type, setType]     = useState('broadcast');
  const [name, setName]     = useState('');
  const [time, setTime]     = useState('09:00');
  const [repeat, setRepeat] = useState('daily');
  const [days, setDays]     = useState([]);
  const [prompt, setPrompt] = useState('');
  const [wfId, setWfId]     = useState('');

  const jt = JOB_TYPES.find(t => t.id === type);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: genId(), type, name: name.trim(), time, repeat, days,
      prompt: type === 'broadcast' ? prompt : '',
      workflowId: type === 'workflow' ? wfId : '',
      enabled: true, runCount: 0,
      createdAt: new Date().toISOString(),
      lastRun: null,
    });
    onClose();
  };

  const toggleDay = (d) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="modal-title">⏱ New Scheduled Job</div>
          <button className="btn btn-ghost btn-xs" onClick={onClose}>✕</button>
        </div>

        {/* Job type grid */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Job Type</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {JOB_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              style={{
                padding: '10px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                border: `1px solid ${type === t.id ? t.color : 'var(--border)'}`,
                background: type === t.id ? `${t.color}12` : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 3 }}>{t.icon}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: type === t.id ? '#fff' : 'var(--muted2)' }}>{t.label}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1, lineHeight: 1.3 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Feature 30: Cron preset dropdown selector */}
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Cron / Schedule Preset</label>
        <select
          onChange={e => {
            const val = e.target.value;
            if (!val) return;
            const [pTime, pRepeat, pDays] = val.split('|');
            setTime(pTime);
            setRepeat(pRepeat);
            if (pDays) setDays(pDays.split(','));
            else setDays([]);
          }}
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: 14 }}
        >
          <option value="">-- Select a Preset (or configure manually) --</option>
          <option value="09:00|daily">Daily at 9:00 AM</option>
          <option value="00:00|daily">Daily at Midnight</option>
          <option value="09:00|weekdays">Weekdays at 9:00 AM</option>
          <option value="00:00|hourly">Every Hour (Hourly)</option>
          <option value="08:00|weekly|Mon">Weekly on Monday at 8:00 AM</option>
          <option value="18:00|weekly|Fri">Weekly on Friday at 6:00 PM</option>
        </select>

        {/* Name */}
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Job Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={`e.g. "${jt?.label} – Daily"`}
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: 14 }}
        />

        {/* Time + Repeat row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 7 }}>
              {QUICK_TIMES.map(t => (
                <button key={t} className={`btn btn-xs ${time === t ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setTime(t)} style={{ fontSize: 9.5, padding: '2px 7px' }}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Repeat</label>
            <select value={repeat} onChange={e => setRepeat(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }}>
              {REPEAT_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Day picker (weekly / weekdays) */}
        {(repeat === 'weekly') && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Run on Days</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {DAYS.map(d => (
                <button key={d}
                  onClick={() => toggleDay(d)}
                  className={`btn btn-xs ${days.includes(d) ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ fontSize: 10, flex: 1 }}>{d}</button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt (broadcast type) */}
        {type === 'broadcast' && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Broadcast Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter the prompt to broadcast automatically…"
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
        )}

        {/* Workflow picker */}
        {type === 'workflow' && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Select Workflow</label>
            <select value={wfId} onChange={e => setWfId(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }}>
              <option value="">— Choose workflow —</option>
              {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        )}

        <div className="modal-footer" style={{ marginTop: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold btn-sm" onClick={handleSave} disabled={!name.trim()}>
            ⏱ Schedule Job
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Full Week Calendar Grid (7 cols × 24 rows) ──────────── */
function WeekCalendarGrid({ jobs, onCellClick }) {
  const now = useMemo(() => new Date(), []);
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayIdx  = useMemo(() => {
    return weekDates.findIndex(d => d.toDateString() === now.toDateString());
  }, [weekDates, now]);

  // Map dayKey → hour → [jobs]
  const grid = useMemo(() => {
    const g = {};
    DAY_KEYS.forEach(dk => { g[dk] = {}; HOURS.forEach(h => { g[dk][h] = []; }); });

    jobs.forEach(job => {
      const h = parseInt(job.time.split(':')[0]);
      let targetDays = [];
      if (job.repeat === 'daily' || job.repeat === 'hourly') targetDays = DAY_KEYS;
      else if (job.repeat === 'weekdays') targetDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      else if (job.repeat === 'weekly') {
        // map DAYS (Sun=0) to DAY_KEYS (Mon=0)
        const mapped = (job.days || []).map(d => {
          const map = { Sun: 'Sun', Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat' };
          return map[d] || d;
        });
        targetDays = mapped.length > 0 ? mapped : [DAY_KEYS[todayIdx >= 0 ? todayIdx : 0]];
      } else if (job.repeat === 'once') {
        targetDays = todayIdx >= 0 ? [DAY_KEYS[todayIdx]] : ['Mon'];
      } else {
        targetDays = DAY_KEYS;
      }

      if (job.repeat === 'hourly') {
        HOURS.forEach(hr => {
          targetDays.forEach(dk => { if (g[dk]?.[hr] !== undefined) g[dk][hr].push(job); });
        });
      } else {
        targetDays.forEach(dk => { if (g[dk]?.[h] !== undefined) g[dk][h].push(job); });
      }
    });
    return g;
  }, [jobs, todayIdx]);

  const CELL_H = 36;
  const STATUS_COLOR = {
    active:  'var(--teal)',
    paused:  'var(--gold)',
    expired: 'var(--red)',
  };

  function jobColor(job) {
    if (!job.enabled) return STATUS_COLOR.paused;
    const jt = JOB_TYPES.find(t => t.id === job.type);
    return jt?.color || STATUS_COLOR.active;
  }

  const currentHour = now.getHours();

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 600 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `44px repeat(7, minmax(80px, 1fr))`,
        minWidth: 620,
      }}>
        {/* ── Sticky column header ── */}
        {/* Top-left corner */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 3,
          background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          height: 44,
        }} />
        {DAY_KEYS.map((dk, i) => {
          const date = weekDates[i];
          const isToday = i === todayIdx;
          return (
            <div key={dk} style={{
              position: 'sticky', top: 0, zIndex: 2,
              background: isToday ? 'rgba(0,212,170,0.08)' : 'var(--surface2)',
              borderBottom: `2px solid ${isToday ? 'var(--teal)' : 'var(--border)'}`,
              borderLeft: '1px solid rgba(255,255,255,0.04)',
              padding: '6px 4px', textAlign: 'center',
              height: 44, boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: isToday ? 'var(--teal)' : 'var(--muted)' }}>{dk}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? '#fff' : 'var(--muted2)', marginTop: 1 }}>
                {date ? pad2(date.getDate()) : ''}
              </div>
            </div>
          );
        })}

        {/* ── Hour rows ── */}
        {HOURS.map(h => (
          <>
            {/* Hour label */}
            <div key={`lbl-${h}`} style={{
              fontSize: 8.5, color: h === currentHour ? 'var(--gold)' : 'var(--muted)',
              fontFamily: 'DM Mono,monospace',
              textAlign: 'right', paddingRight: 6,
              height: CELL_H, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              fontWeight: h === currentHour ? 800 : 400,
            }}>
              {pad2(h)}
            </div>

            {/* Day cells for this hour */}
            {DAY_KEYS.map((dk, i) => {
              const cellJobs = grid[dk]?.[h] || [];
              const isToday  = i === todayIdx;
              const isNowH   = isToday && h === currentHour;
              const hasJobs  = cellJobs.length > 0;
              const firstJob = cellJobs[0];
              const color    = firstJob ? jobColor(firstJob) : null;
              const jt       = firstJob ? JOB_TYPES.find(t => t.id === firstJob.type) : null;

              return (
                <div
                  key={`${dk}-${h}`}
                  onClick={() => onCellClick(dk, h, cellJobs)}
                  title={hasJobs ? cellJobs.map(j => `${j.name} (${j.time})`).join('\n') : `${dk} ${pad2(h)}:00`}
                  style={{
                    height: CELL_H,
                    borderLeft: '1px solid rgba(255,255,255,0.04)',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: isNowH
                      ? 'rgba(245,183,49,0.06)'
                      : isToday
                        ? 'rgba(0,212,170,0.02)'
                        : 'transparent',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = hasJobs ? `${color}18` : 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isNowH
                      ? 'rgba(245,183,49,0.06)'
                      : isToday ? 'rgba(0,212,170,0.02)' : 'transparent';
                  }}
                >
                  {/* Current time line */}
                  {isNowH && (
                    <div style={{
                      position: 'absolute', top: `${(now.getMinutes() / 60) * 100}%`,
                      left: 0, right: 0, height: 1.5,
                      background: 'var(--gold)', opacity: 0.7, zIndex: 1,
                    }} />
                  )}

                  {/* Job blocks */}
                  {hasJobs && (
                    <div style={{
                      position: 'absolute', inset: '3px 3px',
                      background: `${color}22`,
                      border: `1px solid ${color}55`,
                      borderLeft: `3px solid ${color}`,
                      borderRadius: 5,
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '0 5px',
                      overflow: 'hidden',
                    }}>
                      <span style={{ fontSize: 10, flexShrink: 0 }}>{jt?.icon || '📡'}</span>
                      {cellJobs.length === 1 && (
                        <span style={{ fontSize: 8.5, color, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {firstJob.name}
                        </span>
                      )}
                      {cellJobs.length > 1 && (
                        <span style={{ fontSize: 9, color, fontWeight: 800 }}>+{cellJobs.length}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

/* ── Compact Heatmap (existing sidebar widget) ───────────── */
function WeekCalendar({ jobs }) {
  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => DAYS[now.getDay()], [now]);

  const grid = useMemo(() => {
    const g = {};
    DAYS.forEach(d => { g[d] = {}; HOURS.forEach(h => { g[d][h] = []; }); });
    jobs.filter(j => j.enabled).forEach(j => {
      const h = parseInt(j.time.split(':')[0]);
      const targetDays =
        j.repeat === 'daily'    ? DAYS :
        j.repeat === 'weekdays' ? ['Mon','Tue','Wed','Thu','Fri'] :
        j.repeat === 'weekly'   ? (j.days.length > 0 ? j.days : [DAYS[now.getDay()]]) :
        j.repeat === 'once'     ? [today] :
        j.repeat === 'hourly'   ? DAYS : DAYS;
      targetDays.forEach(d => { if (g[d]?.[h] !== undefined) g[d][h].push(j); });
    });
    return g;
  }, [jobs, today, now]);

  const maxCount = useMemo(() => Math.max(1, ...DAYS.flatMap(d => HOURS.map(h => grid[d][h].length))), [grid]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(7, 1fr)`, gap: 2, minWidth: 420 }}>
        {/* Column headers */}
        <div />
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 9.5, fontWeight: 800, color: d === today ? 'var(--gold)' : 'var(--muted)', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            {d}
          </div>
        ))}

        {/* Hour rows — show every 3h for compactness */}
        {HOURS.filter(h => h % 3 === 0).map(h => (
          <>
            <div key={`lbl-${h}`} style={{ fontSize: 8.5, color: 'var(--muted)', textAlign: 'right', paddingRight: 6, lineHeight: '22px', fontFamily: 'DM Mono,monospace' }}>
              {pad2(h)}:00
            </div>
            {DAYS.map(d => {
              const jobsInSlot = [...(grid[d][h] || []), ...(grid[d][h+1] || []), ...(grid[d][h+2] || [])];
              const count = jobsInSlot.length;
              const intensity = count / maxCount;
              const isNow = d === today && now.getHours() >= h && now.getHours() < h + 3;
              const firstJob = jobsInSlot[0];
              const jt = firstJob ? JOB_TYPES.find(t => t.id === firstJob.type) : null;
              return (
                <div key={`${d}-${h}`}
                  title={count > 0 ? jobsInSlot.map(j => j.name).join(', ') : ''}
                  style={{
                    height: 22, borderRadius: 4,
                    background: count === 0
                      ? (isNow ? 'rgba(245,183,49,0.06)' : 'rgba(255,255,255,0.02)')
                      : `${jt?.color || 'var(--gold)'}${Math.round(20 + intensity * 80).toString(16).padStart(2,'0')}`,
                    border: isNow ? '1px solid rgba(245,183,49,0.3)' : '1px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700,
                    color: count > 0 ? (jt?.color || 'var(--gold)') : 'transparent',
                    cursor: count > 0 ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                    boxSizing: 'border-box',
                  }}
                >
                  {count > 0 ? count : ''}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}



/* ── Toast helper (simple local toast) ──────────────────── */
function useLocalToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback((text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  }, []);
  return { msg, show };
}

/* ── MAIN PAGE ───────────────────────────────────────────── */
const DEMO_JOBS = [
  { id: 'j1', type: 'health_check', name: 'Morning Health Check',  time: '08:00', repeat: 'daily',    days: [], enabled: true,  runCount: 14, createdAt: new Date().toISOString(), lastRun: new Date(Date.now() - 3600000 * 18).toISOString() },
  { id: 'j2', type: 'broadcast',    name: 'Daily Standup Prompt',  time: '09:30', repeat: 'weekdays', days: [], enabled: true,  runCount: 8,  createdAt: new Date().toISOString(), lastRun: new Date(Date.now() - 3600000 * 14).toISOString(), prompt: 'Good morning! Please review the latest project status and suggest any improvements or blockers to address today.' },
  { id: 'j3', type: 'credit_check', name: 'Credit Alert Sweep',    time: '12:00', repeat: 'daily',    days: [], enabled: true,  runCount: 22, createdAt: new Date().toISOString(), lastRun: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: 'j4', type: 'export',       name: 'Nightly Data Backup',   time: '23:00', repeat: 'daily',    days: [], enabled: false, runCount: 5,  createdAt: new Date().toISOString(), lastRun: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'j5', type: 'ping_sweep',   name: 'Hourly Latency Sweep',  time: '00:00', repeat: 'hourly',   days: [], enabled: true,  runCount: 47, createdAt: new Date().toISOString(), lastRun: new Date(Date.now() - 60000 * 45).toISOString() },
];

const DEMO_HISTORY = [
  { id: 'r1', type: 'health_check', name: 'Morning Health Check', at: new Date(Date.now() - 3600000 * 18).toISOString(), ok: true },
  { id: 'r2', type: 'broadcast',    name: 'Daily Standup Prompt', at: new Date(Date.now() - 3600000 * 14).toISOString(), ok: true },
  { id: 'r3', type: 'credit_check', name: 'Credit Alert Sweep',   at: new Date(Date.now() - 3600000 * 10).toISOString(), ok: true },
  { id: 'r4', type: 'ping_sweep',   name: 'Hourly Latency Sweep', at: new Date(Date.now() - 60000 * 45).toISOString(),   ok: true },
  { id: 'r5', type: 'export',       name: 'Nightly Data Backup',  at: new Date(Date.now() - 3600000 * 24).toISOString(), ok: false },
];

export default function Scheduler() {
  const { workflows } = useStore();
  const [jobs, setJobs]       = useState(DEMO_JOBS);
  const [history, setHistory] = useState(DEMO_HISTORY);
  const [showModal, setShowModal] = useState(false);
  const [runningId, setRunningId] = useState(null);
  const [filter, setFilter]   = useState('all');
  const [calView, setCalView] = useState('week'); // 'week' | 'list'
  const toast = useLocalToast();

  /* Simulate tick — update next-run labels every 30s */
  // eslint-disable-next-line no-unused-vars
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  const addJob    = useCallback((job) => setJobs(prev => [...prev, job]), []);
  const deleteJob = useCallback((id) => setJobs(prev => prev.filter(j => j.id !== id)), []);
  const toggleJob = useCallback((id) => setJobs(prev => prev.map(j => j.id === id ? { ...j, enabled: !j.enabled } : j)), []);

  const runNow = useCallback(async (job) => {
    setRunningId(job.id);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const ok = Math.random() > 0.1;
    setJobs(prev => prev.map(j => j.id === job.id
      ? { ...j, runCount: (j.runCount || 0) + 1, lastRun: new Date().toISOString() }
      : j));
    setHistory(prev => [{
      id: genId(), type: job.type, name: job.name,
      at: new Date().toISOString(), ok,
    }, ...prev].slice(0, 40));
    setRunningId(null);
  }, []);

  const filteredJobs = useMemo(() => {
    if (filter === 'enabled')  return jobs.filter(j => j.enabled);
    if (filter === 'disabled') return jobs.filter(j => !j.enabled);
    return jobs;
  }, [jobs, filter]);

  const enabledCount  = jobs.filter(j => j.enabled).length;
  const totalRuns     = jobs.reduce((s, j) => s + (j.runCount || 0), 0);
  const successRuns   = history.filter(r => r.ok).length;
  const successRate   = history.length > 0 ? Math.round((successRuns / history.length) * 100) : 100;

  /* Week header label */
  const weekDates = useMemo(() => getWeekDates(), []);
  const weekLabel = useMemo(() => {
    const mon = weekDates[0];
    const sun = weekDates[6];
    const fmtD = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    return `${fmtD(mon)} – ${fmtD(sun)}`;
  }, [weekDates]);

  const handleCellClick = useCallback((dk, h, cellJobs) => {
    if (cellJobs.length === 0) {
      toast.show(`Switch to List view to add a job at ${pad2(h)}:00`);
    } else {
      toast.show('Click List view to manage scheduled items');
    }
  }, [toast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Local Toast ──────────────────────────────────────── */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(20,20,31,0.96)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 18px', fontSize: 12, color: '#dde0f0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
          zIndex: 9999, animation: 'fadeIn 0.2s ease',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>💡</span> {toast.msg}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg,rgba(0,212,170,.18),rgba(79,142,247,.12))',
            border: '1px solid rgba(0,212,170,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>⏱</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Automation Scheduler</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {enabledCount} active · {jobs.length} total · {totalRuns} runs
            </div>
          </div>
        </div>
        <button className="btn btn-gold btn-sm btn-pulse" onClick={() => setShowModal(true)} style={{ fontSize: 11 }}>
          + New Job
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Jobs',   val: enabledCount,  color: 'var(--teal)',   icon: '▶', sub: `${jobs.length} total` },
          { label: 'Total Runs',    val: totalRuns,     color: 'var(--gold)',   icon: '⚡', sub: 'all time' },
          { label: 'Success Rate',  val: `${successRate}%`, color: successRate > 90 ? 'var(--teal)' : 'var(--gold)', icon: '✓', sub: 'last 40 runs' },
          { label: 'Job Types',     val: [...new Set(jobs.map(j => j.type))].length, color: 'var(--purple)', icon: '⚙', sub: 'in use' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderTop: `2px solid ${s.color}`, borderRadius: 12, padding: '14px 16px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 50, height: 50, borderRadius: '50%', background: `${s.color}10`, filter: 'blur(15px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{s.label}</span>
              <span style={{ fontSize: 14, opacity: .7 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── VIEW TOGGLE + CALENDAR HEADER ──────────────────── */}
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {/* Header bar */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.15)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>📅 Schedule View</div>
            {calView === 'week' && (
              <div style={{
                fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono,monospace',
                background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '2px 8px',
              }}>
                {weekLabel}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 2,
            background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 2,
            border: '1px solid var(--border)',
          }}>
            {[
              { id: 'week', label: '⊞ Week', title: 'Calendar week grid view' },
              { id: 'list', label: '☰ List', title: 'Job list view' },
            ].map(v => (
              <button
                key={v.id}
                title={v.title}
                onClick={() => setCalView(v.id)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: calView === v.id ? 'var(--teal)' : 'transparent',
                  color: calView === v.id ? '#0e0e16' : 'var(--muted)',
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── WEEK CALENDAR VIEW ─── */}
        {calView === 'week' && (
          <>
            {/* Legend row */}
            <div style={{
              padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <span style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Color by type:</span>
              {JOB_TYPES.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                  <span style={{ color: 'var(--muted)' }}>{t.label}</span>
                </div>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--muted)', fontStyle: 'italic' }}>
                Read-only · Switch to List to manage
              </span>
            </div>

            <WeekCalendarGrid jobs={jobs} onCellClick={handleCellClick} />
          </>
        )}

        {/* ── LIST VIEW ─── */}
        {calView === 'list' && (
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 5 }}>
              {['all', 'enabled', 'disabled'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn btn-xs ${filter === f ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ fontSize: 10, textTransform: 'capitalize' }}>
                  {f === 'all' ? `All (${jobs.length})` : f === 'enabled' ? `▶ Active (${enabledCount})` : `⏸ Paused (${jobs.length - enabledCount})`}
                </button>
              ))}
            </div>

            {filteredJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--surface3)', borderRadius: 14, border: '1px dashed var(--border)', color: 'var(--muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⏱</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>No jobs yet</div>
                <button className="btn btn-gold btn-sm" onClick={() => setShowModal(true)}>+ Create first job</button>
              </div>
            ) : (
              filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggle={toggleJob}
                  onDelete={deleteJob}
                  onRunNow={runNow}
                  isRunning={runningId === job.id}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL: Calendar heatmap + History + Presets ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 14, alignItems: 'start' }}>
        {/* LEFT: Run history (full width when in week view, otherwise below jobs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Run history */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>🕐 Run History</div>
              <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{history.length} runs</span>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: 11 }}>No runs recorded yet</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.1)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px 14px', color: 'var(--muted)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Job</th>
                      <th style={{ padding: '8px 14px', color: 'var(--muted)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Triggered At</th>
                      <th style={{ padding: '8px 14px', color: 'var(--muted)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Latency</th>
                      <th style={{ padding: '8px 14px', color: 'var(--muted)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 20).map(r => {
                      const jt = JOB_TYPES.find(t => t.id === r.type) || JOB_TYPES[0];
                      const latency = r.latency || `${(40 + (r.name.charCodeAt(0) % 21) * 10)}ms`;
                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{jt.icon}</span>
                            <span style={{ fontWeight: 700, color: '#dde0f0' }}>{r.name}</span>
                          </td>
                          <td style={{ padding: '8px 14px', color: 'var(--muted2)', fontFamily: 'DM Mono, monospace' }}>
                            {fmtTime(r.at)}
                          </td>
                          <td style={{ padding: '8px 14px', color: 'var(--muted2)', fontFamily: 'DM Mono, monospace' }}>
                            {latency}
                          </td>
                          <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                            <span style={{
                              fontSize: 9.5, padding: '2px 8px', borderRadius: 6,
                              background: r.ok ? 'rgba(0,212,170,0.12)' : 'rgba(255,95,95,0.12)',
                              color: r.ok ? 'var(--teal)' : 'var(--red)',
                              fontWeight: 700,
                            }}>
                              {r.ok ? '✓ OK' : '✕ Fail'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Compact heatmap + Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Weekly heatmap (compact sidebar) */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>🔥 Activity Heatmap</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>Active jobs across the week</div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <WeekCalendar jobs={jobs} />
            </div>
            {/* Legend */}
            <div style={{ padding: '8px 14px 12px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {JOB_TYPES.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                  <span style={{ color: 'var(--muted)' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick presets */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 10 }}>⚡ Quick Presets</div>
            {[
              { label: 'Daily Health Check at 8am',    type: 'health_check', time: '08:00', repeat: 'daily' },
              { label: 'Standup Broadcast at 9:30am',  type: 'broadcast',    time: '09:30', repeat: 'weekdays', prompt: 'Good morning! Please review the latest status and highlight any blockers.' },
              { label: 'Nightly Credit Alert at 11pm', type: 'credit_check', time: '23:00', repeat: 'daily' },
              { label: 'Weekly Export on Sunday',      type: 'export',       time: '22:00', repeat: 'weekly', days: ['Sun'] },
            ].map((preset, i) => (
              <button key={i} onClick={() => addJob({
                id: genId(), ...preset,
                name: preset.label, days: preset.days || [],
                enabled: true, runCount: 0,
                createdAt: new Date().toISOString(), lastRun: null,
              })} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 10px', marginBottom: 5, borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,183,49,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: 13 }}>{JOB_TYPES.find(t => t.id === preset.type)?.icon}</span>
                <span style={{ fontSize: 10.5, color: '#dde0f0' }}>{preset.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 11 }}>+</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────── */}
      {showModal && (
        <NewJobModal
          onClose={() => setShowModal(false)}
          onSave={addJob}
          workflows={workflows}
        />
      )}
    </div>
  );
}
