import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Colour palette (dark theme) ───────────────────────────────── */
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
  text:    '#e2e8f0',
  muted:   '#6b7280',
  purple:  '#a78bfa',
  pink:    '#f472b6',
  blue:    '#60a5fa',
};

const TABS = ['Short-term', 'Long-term', 'Entity', 'Episodic'];
const TYPES = ['fact', 'preference', 'context', 'instruction', 'persona', 'secret'];
const TYPE_COLORS = {
  fact:        C.blue,
  preference:  C.teal,
  context:     C.gold,
  instruction: C.purple,
  persona:     C.pink,
  secret:      C.red,
};
const AGENT_LIST = ['Hermes', 'AutoGen', 'CrewAI', 'LangChain', 'Custom'];
const LS_KEY = 'ag_agent_memory_v1';
const DECAY_KEY = 'ag_memory_decay_v1';

/* ── Token budget colours per tab ───────────────────────────────── */
const TAB_COLORS = ['#6c63ff', '#0ef0c0', '#fbbf24', '#f472b6'];
const MAX_TOKENS = 128000;

function estimateTokens(val) {
  return Math.max(1, Math.ceil((val || '').length / 4));
}

/* ─── Seed data ──────────────────────────────────────────────────── */
const SEED = [
  { id: 's1', tab: 'Short-term', key: 'current_task', value: 'Draft product roadmap for Q3', tags: ['task', 'active'], type: 'context',     expiry: '', tokens: 12 },
  { id: 's2', tab: 'Short-term', key: 'user_mood',    value: 'Focused and energetic',       tags: ['user'],          type: 'preference',  expiry: '', tokens: 6  },
  { id: 'l1', tab: 'Long-term',  key: 'user_name',    value: 'Abdul Basit',                 tags: ['identity'],      type: 'persona',     expiry: '', tokens: 4  },
  { id: 'l2', tab: 'Long-term',  key: 'preferred_model', value: 'gemini-2.5-pro',           tags: ['config'],        type: 'preference',  expiry: '', tokens: 5  },
  { id: 'e1', tab: 'Entity',     key: 'Project:AntiGravity', value: 'A premium AI dev platform built with React + Vite', tags: ['project'], type: 'fact', expiry: '', tokens: 14 },
  { id: 'ep1', tab: 'Episodic',  key: 'session_2024_10_01', value: 'Discussed vector DB integration strategy', tags: ['session'], type: 'instruction', expiry: '', tokens: 9 },
];

function loadMemories() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || SEED; }
  catch { return SEED; }
}
function saveMemories(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function loadDecay() {
  try { return JSON.parse(localStorage.getItem(DECAY_KEY)) || { shortTermTTL: 60, longTermTTL: 365, autoDecay: false, compressionThreshold: 80 }; }
  catch { return { shortTermTTL: 60, longTermTTL: 365, autoDecay: false, compressionThreshold: 80 }; }
}
function saveDecay(d) { localStorage.setItem(DECAY_KEY, JSON.stringify(d)); }

/* ─── Helpers ────────────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 10); }
function badge(type) {
  return {
    display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 10,
    fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
    background: TYPE_COLORS[type] + '22', color: TYPE_COLORS[type], border: `1px solid ${TYPE_COLORS[type]}44`,
  };
}
function pill(label, color) {
  return { display: 'inline-block', padding: '1px 6px', borderRadius: 99, fontSize: 10,
    background: color + '18', color, border: `1px solid ${color}33`, marginRight: 4, marginTop: 2 };
}

/* ─── SVG Token Budget Visualiser ───────────────────────────────── */
function TokenBudgetBar({ memories }) {
  const grouped = TABS.map((tab, i) => {
    const toks = memories.filter(m => m.tab === tab).reduce((s, m) => s + estimateTokens(m.value), 0);
    return { tab, toks, color: TAB_COLORS[i] };
  });
  const totalToks = grouped.reduce((s, g) => s + g.toks, 0);
  const pct = Math.min(100, (totalToks / MAX_TOKENS) * 100);

  let cursor = 0;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>🧮 Context Window Budget</span>
        <span style={{ fontSize: 12, color: pct > 80 ? C.red : C.teal }}>
          {totalToks.toLocaleString()} / {MAX_TOKENS.toLocaleString()} tokens ({pct.toFixed(1)}%)
        </span>
      </div>
      <svg width="100%" height={28} style={{ display: 'block', borderRadius: 8, overflow: 'hidden' }}>
        <rect x={0} y={0} width="100%" height={28} fill={C.surface} rx={8} />
        {grouped.map((g, i) => {
          const w = (g.toks / MAX_TOKENS) * 100;
          const x = cursor;
          cursor += w;
          return <rect key={i} x={`${x}%`} y={0} width={`${w}%`} height={28} fill={g.color} opacity={0.85} />;
        })}
        {pct > 80 && <rect x={0} y={0} width="100%" height={28} fill="none" rx={8} stroke={C.red} strokeWidth={2} />}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
        {grouped.map((g, i) => (
          <span key={i} style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: g.color, display: 'inline-block' }} />
            {g.tab}: <b style={{ color: g.color }}>{g.toks}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Memory Card ────────────────────────────────────────────────── */
function MemoryCard({ mem, onDelete, compressed }) {
  const [expanded, setExpanded] = useState(false);
  const toks = estimateTokens(mem.value);
  return (
    <div style={{
      background: compressed ? C.surface : C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 10,
      transition: 'all 0.2s',
      opacity: compressed ? 0.6 : 1,
      position: 'relative',
      animation: 'fadeSlideIn 0.25s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.text, fontFamily: 'DM Mono, monospace' }}>{mem.key}</span>
            <span style={badge(mem.type)}>{mem.type}</span>
            {mem.expiry && (
              <span style={{ fontSize: 10, color: C.gold, marginLeft: 4 }}>⏰ {mem.expiry}</span>
            )}
            <span style={{ fontSize: 10, color: C.muted, marginLeft: 'auto' }}>~{toks} tok</span>
          </div>
          <div
            onClick={() => setExpanded(e => !e)}
            style={{ fontSize: 13, color: C.muted, cursor: 'pointer', overflow: 'hidden',
              display: '-webkit-box', WebkitBoxOrient: 'vertical',
              WebkitLineClamp: expanded ? 999 : 2, lineClamp: expanded ? 999 : 2,
              userSelect: 'none',
            }}
          >{mem.value}</div>
          {mem.tags.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {mem.tags.map(t => <span key={t} style={pill('#' + t, C.purple)}>{t}</span>)}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(mem.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.red, fontSize: 16, padding: 0, flexShrink: 0 }}
          title="Delete"
        >🗑</button>
      </div>
    </div>
  );
}

/* ─── Add Memory Form ────────────────────────────────────────────── */
function AddMemoryForm({ activeTab, onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', type: 'fact', tags: '', expiry: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.key.trim() || !form.value.trim()) return;
    onAdd({
      id: uid(), tab: activeTab,
      key: form.key.trim(), value: form.value.trim(),
      type: form.type, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      expiry: form.expiry,
    });
    setForm({ key: '', value: '', type: 'fact', tags: '', expiry: '' });
    setOpen(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentD})`, color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, marginBottom: open ? 12 : 0 }}
      >
        {open ? '✕ Cancel' : '+ Add Memory'}
      </button>
      {open && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: '16px 18px', animation: 'fadeSlideIn 0.2s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input placeholder="Key (e.g. user_goal)" value={form.key} onChange={e => set('key', e.target.value)}
              style={inputStyle} />
            <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea placeholder="Value / content" value={form.value} onChange={e => set('value', e.target.value)}
            rows={3} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 10 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => set('tags', e.target.value)} style={inputStyle} />
            <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={submit} style={{ background: C.teal, color: '#000', border: 'none', borderRadius: 7, padding: '7px 20px', cursor: 'pointer', fontWeight: 700 }}>
              Save Memory
            </button>
            <button onClick={() => setOpen(false)} style={{ background: C.border, color: C.muted, border: 'none', borderRadius: 7, padding: '7px 14px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Decay Settings Panel ───────────────────────────────────────── */
function DecayPanel({ open, onClose }) {
  const [decay, setDecay] = useState(loadDecay);
  const set = (k, v) => setDecay(d => ({ ...d, [k]: v }));
  const save = () => { saveDecay(decay); onClose(); };

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0008', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 420, maxWidth: '95vw' }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ color: C.text, margin: '0 0 18px', fontSize: 16 }}>⏳ Memory Decay Settings</h3>
        {[
          ['shortTermTTL', 'Short-term TTL (minutes)', 1, 10080],
          ['longTermTTL', 'Long-term TTL (days)', 1, 3650],
          ['compressionThreshold', 'Compression threshold (%)', 10, 100],
        ].map(([key, label, min, max]) => (
          <label key={key} style={{ display: 'block', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="range" min={min} max={max} value={decay[key]}
                onChange={e => set(key, +e.target.value)}
                style={{ flex: 1, accentColor: C.accent }} />
              <span style={{ fontSize: 13, color: C.text, width: 50, textAlign: 'right' }}>{decay[key]}</span>
            </div>
          </label>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer' }}>
          <input type="checkbox" checked={decay.autoDecay} onChange={e => set('autoDecay', e.target.checked)}
            style={{ accentColor: C.accent, width: 16, height: 16 }} />
          <span style={{ fontSize: 13, color: C.text }}>Enable auto-decay</span>
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
          <button onClick={onClose} style={{ background: C.border, color: C.muted, border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Inject Dropdown ────────────────────────────────────────────── */
function InjectDropdown({ onInject }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: `linear-gradient(135deg, ${C.teal}, #0bc090)`, color: '#000', border: 'none',
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
        💉 Inject to Agent ▾
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, zIndex: 99, minWidth: 160, overflow: 'hidden', boxShadow: '0 8px 32px #0008' }}>
          {AGENT_LIST.map(a => (
            <button key={a} onClick={() => { onInject(a); setOpen(false); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none',
                border: 'none', color: C.text, cursor: 'pointer', fontSize: 13,
                borderBottom: `1px solid ${C.border}` }}>
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Auto-Summarise button ──────────────────────────────────────── */
function AutoSummariseBtn({ onSummarise }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const click = () => {
    setLoading(true); setDone(false);
    setTimeout(() => { setLoading(false); setDone(true); onSummarise(); setTimeout(() => setDone(false), 2500); }, 2000);
  };

  return (
    <button onClick={click} disabled={loading}
      style={{ background: loading ? C.border : `linear-gradient(135deg, ${C.purple}, ${C.accent})`,
        color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px',
        cursor: loading ? 'default' : 'pointer', fontWeight: 700, fontSize: 13,
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.3s' }}>
      {loading ? (
        <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>🔄</span> Compressing…</>
      ) : done ? '✅ Summarised!' : '🗜 Auto-Summarise'}
    </button>
  );
}

const inputStyle = {
  background: '#0d0f1a', border: `1px solid #252840`, color: '#e2e8f0',
  borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ═══════════════════════════════════════════════════════════════════ */
export default function AgentMemory({ onNav }) {
  const [memories, setMemories] = useState(loadMemories);
  const [activeTab, setActiveTab] = useState('Short-term');
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showDecay, setShowDecay] = useState(false);
  const [toast, setToast] = useState(null);
  const [compressed, setCompressed] = useState(new Set());

  const showToast = (msg, color = C.teal) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => { saveMemories(memories); }, [memories]);

  const addMemory = useCallback(mem => {
    setMemories(ms => [mem, ...ms]);
    showToast(`Memory "${mem.key}" saved ✓`);
  }, []);

  const deleteMemory = useCallback(id => {
    setMemories(ms => ms.filter(m => m.id !== id));
    showToast('Memory deleted', C.red);
  }, []);

  const handleSummarise = useCallback(() => {
    const tabMems = memories.filter(m => m.tab === activeTab);
    tabMems.forEach(m => setCompressed(s => new Set([...s, m.id])));
    showToast(`Compressed ${tabMems.length} memories in ${activeTab} ✓`);
    setTimeout(() => setCompressed(new Set()), 3000);
  }, [memories, activeTab]);

  const handleInject = useCallback(agent => {
    showToast(`Memory context injected to ${agent} ✓`);
  }, []);

  /* Search + filter */
  const tabMems = memories.filter(m => m.tab === activeTab);
  const displayed = tabMems.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q);
    const matchTag = !filterTag || m.tags.includes(filterTag);
    const matchType = !filterType || m.type === filterType;
    return matchSearch && matchTag && matchType;
  });

  /* All unique tags */
  const allTags = [...new Set(memories.flatMap(m => m.tags))];

  /* Import / Export */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(memories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'agent_memory.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('Memory exported ✓');
  };

  const importJSON = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) { setMemories(data); showToast(`Imported ${data.length} memories ✓`); }
        else showToast('Invalid format', C.red);
      } catch { showToast('Parse error', C.red); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const fileRef = useRef();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', padding: '28px 24px' }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        *:focus { outline: 2px solid #6c63ff55; }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        select option { background: #12151f; color: #e2e8f0; }
        button:hover { filter: brightness(1.12); }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0d0f1a; } ::-webkit-scrollbar-thumb { background: #252840; border-radius: 4px; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24, background: C.card, border: `1px solid ${toast.color}55`,
          borderRadius: 10, padding: '12px 20px', color: toast.color, fontWeight: 700, fontSize: 13, zIndex: 9999,
          animation: 'fadeSlideIn 0.2s ease', boxShadow: '0 8px 32px #0006',
        }}>{toast.msg}</div>
      )}

      <DecayPanel open={showDecay} onClose={() => setShowDecay(false)} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, background: `linear-gradient(135deg, ${C.purple}, ${C.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🧠 Agent Memory
          </h1>
          <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>Persistent memory store for your AI agents</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <AutoSummariseBtn onSummarise={handleSummarise} />
          <InjectDropdown onInject={handleInject} />
          <button onClick={() => setShowDecay(true)}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
            ⚙️ Decay
          </button>
          <button onClick={exportJSON}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.gold, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
            ⬆ Export
          </button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJSON} />
          <button onClick={() => fileRef.current.click()}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.blue, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
            ⬇ Import
          </button>
        </div>
      </div>

      {/* Token Budget */}
      <TokenBudgetBar memories={memories} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {TABS.map((tab, i) => {
          const count = memories.filter(m => m.tab === tab).length;
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                background: isActive ? TAB_COLORS[i] + '22' : 'none',
                border: `1px solid ${isActive ? TAB_COLORS[i] : 'transparent'}`,
                borderBottom: isActive ? `2px solid ${TAB_COLORS[i]}` : '2px solid transparent',
                borderRadius: '8px 8px 0 0', padding: '9px 18px',
                color: isActive ? TAB_COLORS[i] : C.muted,
                cursor: 'pointer', fontWeight: isActive ? 700 : 500, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
              }}>
              {tab}
              <span style={{ background: TAB_COLORS[i] + '33', color: TAB_COLORS[i], borderRadius: 99, padding: '1px 7px', fontSize: 11 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input placeholder="🔍 Search key / value…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: 260 }} />
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="">All Tags</option>
          {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {(search || filterTag || filterType) && (
          <button onClick={() => { setSearch(''); setFilterTag(''); setFilterType(''); }}
            style={{ background: C.red + '22', color: C.red, border: `1px solid ${C.red}44`, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 12 }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Add form */}
      <AddMemoryForm activeTab={activeTab} onAdd={addMemory} />

      {/* Memory cards */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0', fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          No memories in <b style={{ color: C.text }}>{activeTab}</b> match your filter.
        </div>
      ) : displayed.map(mem => (
        <MemoryCard key={mem.id} mem={mem} onDelete={deleteMemory} compressed={compressed.has(mem.id)} />
      ))}

      {/* Stats footer */}
      <div style={{ marginTop: 32, padding: '14px 18px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
        display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {TABS.map((tab, i) => (
          <span key={tab} style={{ fontSize: 12, color: C.muted }}>
            <span style={{ color: TAB_COLORS[i], fontWeight: 700 }}>{memories.filter(m => m.tab === tab).length}</span> {tab}
          </span>
        ))}
        <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>
          Total: <b style={{ color: C.text }}>{memories.length}</b> memories
        </span>
      </div>
    </div>
  );
}
