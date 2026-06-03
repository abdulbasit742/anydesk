import { useState, useEffect, useRef } from "react";

const C = {
  gold: "#f5b731",
  teal: "#22d3ee",
  purple: "#a78bfa",
  surface: "#0e0e16",
  surface2: "#16161e",
  surface3: "#1d1d28",
  border: "rgba(255,255,255,0.07)",
  muted: "#6e7191",
  red: "#ef4444",
  green: "#22c55e",
  text: "#e2e8f0",
  white: "#ffffff",
};

const css = {
  page: {
    background: C.surface,
    minHeight: "100vh",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    color: C.text,
    padding: "0 0 60px 0",
  },
  hero: {
    background: `linear-gradient(135deg, ${C.surface2} 0%, #0a0a14 60%, #10121e 100%)`,
    borderBottom: `1px solid ${C.border}`,
    padding: "48px 40px 36px",
    position: "relative",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "340px",
    height: "340px",
    background: `radial-gradient(circle, ${C.teal}20 0%, transparent 70%)`,
    pointerEvents: "none",
  },
  heroTitle: {
    fontSize: "2.2rem",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 14px 0",
  },
  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color: color,
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "0.72rem",
    fontWeight: 600,
    marginRight: "10px",
    letterSpacing: "0.04em",
  }),
  section: {
    margin: "32px 40px 0",
  },
  sectionTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  card: {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
    padding: "20px",
  },
  btn: (color = C.gold, ghost = false) => ({
    background: ghost ? "transparent" : `${color}18`,
    border: `1px solid ${color}55`,
    color: color,
    borderRadius: "8px",
    padding: "7px 16px",
    fontSize: "0.73rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    transition: "all 0.18s",
  }),
  input: {
    background: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    color: C.text,
    padding: "8px 12px",
    fontSize: "0.8rem",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
};

// ── PRESENCE BAR ──────────────────────────────────────────────────
const MEMBERS = [
  { initials: "AK", name: "Aisha Khan", activity: "Editing NeuralChat", status: "online", color: "#f5b731", tokens: 12340 },
  { initials: "MR", name: "Marcos Rivera", activity: "Reviewing PRs", status: "online", color: "#22d3ee", tokens: 8920 },
  { initials: "SP", name: "Sophie Park", activity: "In a meeting", status: "away", color: "#a78bfa", tokens: 6450 },
  { initials: "JL", name: "Jin Lee", activity: "Idle", status: "away", color: "#fb923c", tokens: 4280 },
  { initials: "TN", name: "Tom Nkosi", activity: "Building DataVault", status: "online", color: "#4ade80", tokens: 9780 },
  { initials: "EV", name: "Elena Vasquez", activity: "Offline", status: "offline", color: "#f472b6", tokens: 3200 },
  { initials: "RB", name: "Raj Bhat", activity: "Deploying AudioForge", status: "online", color: "#60a5fa", tokens: 15600 },
  { initials: "CW", name: "Cara Wong", activity: "Offline", status: "offline", color: "#34d399", tokens: 2100 },
];

const statusDot = { online: C.green, away: C.gold, offline: C.muted };

function PresenceBar() {
  const [tooltip, setTooltip] = useState(null);
  const [profile, setProfile] = useState(null);
  const refs = useRef({});

  return (
    <div style={{ ...css.card, display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", position: "relative" }}>
      {MEMBERS.map((m, i) => (
        <div key={i} style={{ position: "relative" }}
          ref={(el) => (refs.current[i] = el)}
          onMouseEnter={() => setTooltip(i)}
          onMouseLeave={() => setTooltip(null)}
          onClick={() => setProfile(profile === i ? null : i)}>
          {/* Avatar */}
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: `${m.color}28`, border: `2px solid ${m.color}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.72rem", fontWeight: 700, color: m.color,
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: profile === i ? `0 0 0 3px ${m.color}55` : "none",
          }}>{m.initials}</div>
          {/* Status dot */}
          <div style={{
            position: "absolute", bottom: "1px", right: "1px",
            width: "10px", height: "10px", borderRadius: "50%",
            background: statusDot[m.status], border: `2px solid ${C.surface2}`,
          }} />
          {/* Tooltip */}
          {tooltip === i && (
            <div style={{
              position: "absolute", top: "52px", left: "50%", transform: "translateX(-50%)",
              background: C.surface3, border: `1px solid ${C.border}`, borderRadius: "8px",
              padding: "8px 12px", zIndex: 100, whiteSpace: "nowrap", pointerEvents: "none",
            }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text }}>{m.name}</div>
              <div style={{ fontSize: "0.68rem", color: C.muted, marginTop: "3px" }}>{m.activity}</div>
            </div>
          )}
          {/* Mini Profile Card */}
          {profile === i && (
            <div style={{
              position: "absolute", top: "52px", left: "50%", transform: "translateX(-50%)",
              background: C.surface2, border: `1px solid ${m.color}44`,
              borderRadius: "12px", padding: "14px 16px", zIndex: 200,
              minWidth: "180px", boxShadow: `0 8px 32px #00000088`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: `${m.color}28`, border: `2px solid ${m.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 700, color: m.color,
                }}>{m.initials}</div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text }}>{m.name}</div>
                  <div style={{ fontSize: "0.65rem", color: statusDot[m.status] }}>{m.status}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: C.muted }}>{m.activity}</div>
              <div style={{ fontSize: "0.68rem", color: C.teal, marginTop: "6px" }}>
                {m.tokens.toLocaleString()} tokens used
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: C.muted }}>
        <span style={{ color: C.green }}>● </span>4 online
        <span style={{ color: C.gold, marginLeft: "10px" }}>● </span>2 away
      </div>
    </div>
  );
}

// ── KANBAN BOARD ──────────────────────────────────────────────────
const PRIORITY_COLOR = { high: C.red, medium: C.gold, low: C.teal };
const PLATFORM_COLOR = { Vercel: C.white, Railway: C.purple, Netlify: C.teal, GitHub: C.muted };

const INITIAL_KANBAN = {
  Backlog: [
    { id: 1, title: "Set up error monitoring", assignee: "AK", platform: "Vercel", priority: "medium" },
    { id: 2, title: "Design system tokens audit", assignee: "SP", platform: "GitHub", priority: "low" },
    { id: 3, title: "Rate limiting middleware", assignee: "RB", platform: "Railway", priority: "high" },
  ],
  "In Progress": [
    { id: 4, title: "Refactor auth flow", assignee: "MR", platform: "Vercel", priority: "high" },
    { id: 5, title: "Optimize bundle size", assignee: "TN", platform: "Netlify", priority: "medium" },
    { id: 6, title: "Dark mode polish", assignee: "AK", platform: "GitHub", priority: "low" },
  ],
  Review: [
    { id: 7, title: "Add OpenAI streaming", assignee: "JL", platform: "Railway", priority: "high" },
    { id: 8, title: "CI/CD pipeline update", assignee: "RB", platform: "GitHub", priority: "medium" },
    { id: 9, title: "Mobile responsive fixes", assignee: "EV", platform: "Netlify", priority: "low" },
  ],
  Done: [
    { id: 10, title: "Initial deployment", assignee: "MR", platform: "Vercel", priority: "high" },
    { id: 11, title: "Database schema v2", assignee: "TN", platform: "Railway", priority: "medium" },
    { id: 12, title: "API documentation", assignee: "CW", platform: "GitHub", priority: "low" },
  ],
};

const COL_COLOR = { Backlog: C.muted, "In Progress": C.gold, Review: C.purple, Done: C.green };

function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_KANBAN);
  const [expandedCard, setExpandedCard] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = (col) => {
    if (!newTaskTitle.trim()) return;
    const newCard = {
      id: Date.now(), title: newTaskTitle, assignee: "AK", platform: "Vercel", priority: "medium",
    };
    setColumns((c) => ({ ...c, [col]: [...c[col], newCard] }));
    setNewTaskTitle("");
    setAddingTo(null);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {Object.entries(columns).map(([col, cards]) => (
          <div key={col}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COL_COLOR[col] }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text }}>{col}</span>
              </div>
              <span style={{
                background: `${COL_COLOR[col]}18`, color: COL_COLOR[col],
                borderRadius: "10px", padding: "1px 8px", fontSize: "0.65rem", fontWeight: 700,
              }}>{cards.length}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "80px" }}>
              {cards.map((card) => (
                <div key={card.id} onClick={() => setExpandedCard(expandedCard?.id === card.id ? null : card)}
                  style={{
                    background: C.surface2, border: `1px solid ${C.border}`,
                    borderRadius: "10px", padding: "12px", cursor: "pointer",
                    transition: "all 0.2s",
                    borderLeft: `3px solid ${PRIORITY_COLOR[card.priority]}`,
                    boxShadow: expandedCard?.id === card.id ? `0 0 0 2px ${C.teal}44` : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.surface3)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.surface2)}>
                  <div style={{ fontSize: "0.78rem", color: C.text, marginBottom: "8px", lineHeight: 1.4 }}>{card.title}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: `${MEMBERS.find((m) => m.initials === card.assignee)?.color || C.muted}28`,
                      border: `1px solid ${MEMBERS.find((m) => m.initials === card.assignee)?.color || C.muted}66`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.6rem", fontWeight: 700,
                      color: MEMBERS.find((m) => m.initials === card.assignee)?.color || C.muted,
                    }}>{card.assignee}</div>
                    <span style={{
                      background: `${PLATFORM_COLOR[card.platform] || C.muted}18`,
                      color: PLATFORM_COLOR[card.platform] || C.muted,
                      border: `1px solid ${PLATFORM_COLOR[card.platform] || C.muted}33`,
                      borderRadius: "20px", padding: "1px 7px", fontSize: "0.6rem",
                    }}>{card.platform}</span>
                  </div>
                </div>
              ))}

              {/* Add task inline */}
              {addingTo === col ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..." autoFocus
                    onKeyDown={(e) => e.key === "Enter" && addTask(col)}
                    style={{ ...css.input, fontSize: "0.75rem", padding: "7px 10px" }} />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => addTask(col)} style={{ ...css.btn(C.green), padding: "5px 10px", fontSize: "0.68rem" }}>Add</button>
                    <button onClick={() => setAddingTo(null)} style={{ ...css.btn(C.muted, true), padding: "5px 10px", fontSize: "0.68rem" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingTo(col)} style={{
                  background: "transparent", border: `1px dashed ${C.border}`, borderRadius: "8px",
                  color: C.muted, padding: "8px", fontSize: "0.72rem", cursor: "pointer", width: "100%",
                }}>+ Add Task</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {expandedCard && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setExpandedCard(null)}>
          <div style={{
            background: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: "16px", padding: "28px", width: "420px", maxWidth: "90vw",
            boxShadow: "0 24px 64px #000000cc",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: PRIORITY_COLOR[expandedCard.priority] }} />
              <span style={{ fontSize: "0.65rem", color: PRIORITY_COLOR[expandedCard.priority], textTransform: "uppercase", fontWeight: 700 }}>{expandedCard.priority} priority</span>
              <span style={{ marginLeft: "auto", cursor: "pointer", color: C.muted, fontSize: "1.2rem" }} onClick={() => setExpandedCard(null)}>✕</span>
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.text, margin: "0 0 14px" }}>{expandedCard.title}</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={css.badge(PLATFORM_COLOR[expandedCard.platform] || C.muted)}>{expandedCard.platform}</span>
              <span style={css.badge(C.teal)}>Assignee: {expandedCard.assignee}</span>
            </div>
            <div style={{ marginTop: "16px", fontSize: "0.75rem", color: C.muted, lineHeight: 1.6 }}>
              Task created via Bolt Studio Pro. All changes are tracked and synced across your team in real-time.
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={css.btn(C.teal)}>Comment</button>
              <button style={css.btn(C.purple)}>Reassign</button>
              <button style={{ ...css.btn(C.red, true), marginLeft: "auto" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LIVE ACTIVITY STREAM ──────────────────────────────────────────
const ACTIVITY_TEMPLATES = [
  (m) => `${m.name} deployed ${["NeuralChat", "VisionBoard", "DataVault"][Math.floor(Math.random() * 3)]}`,
  (m) => `${m.name} added a comment on task #${Math.floor(Math.random() * 20 + 1)}`,
  (m) => `${m.name} updated env variable DATABASE_URL`,
  (m) => `${m.name} rolled back to v${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}.0`,
  (m) => `${m.name} triggered a manual deploy`,
  (m) => `${m.name} cloned prompt "Refactor Wizard"`,
];

function timeSince(d) {
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function ActivityStream() {
  const [events, setEvents] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      member: MEMBERS[i % MEMBERS.length],
      text: ACTIVITY_TEMPLATES[i % ACTIVITY_TEMPLATES.length](MEMBERS[i % MEMBERS.length]),
      ts: Date.now() - (5 - i) * 60000,
      fresh: false,
    }))
  );
  const counterRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const m = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
      const tmpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const newEvent = { id: counterRef.current++, member: m, text: tmpl(m), ts: Date.now(), fresh: true };
      setEvents((e) => [newEvent, ...e.slice(0, 19)]);
      setTimeout(() => {
        setEvents((e) => e.map((ev) => ev.id === newEvent.id ? { ...ev, fresh: false } : ev));
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ ...css.card, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "0.7rem", color: C.green, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: C.green }} />
        Live Feed
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {events.map((ev) => (
          <div key={ev.id} style={{
            display: "flex", gap: "10px", alignItems: "flex-start",
            animation: ev.fresh ? "slideIn 0.4s ease" : "none",
            background: ev.fresh ? `${C.teal}0a` : "transparent",
            borderRadius: "8px", padding: "8px", transition: "background 0.5s",
          }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              background: `${ev.member.color}28`, border: `1px solid ${ev.member.color}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem", fontWeight: 700, color: ev.member.color,
            }}>{ev.member.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.72rem", color: C.text, lineHeight: 1.4 }}>{ev.text}</div>
              <div style={{ fontSize: "0.62rem", color: C.muted, marginTop: "3px" }}>{timeSince(ev.ts)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROMPT LIBRARY ────────────────────────────────────────────────
const PROMPTS_INIT = [
  { id: 1, title: "Refactor Wizard", creator: "AK", usage: 142, liked: true },
  { id: 2, title: "Bug Hunter Pro", creator: "MR", usage: 97, liked: false },
  { id: 3, title: "Doc Generator", creator: "SP", usage: 208, liked: true },
  { id: 4, title: "Test Suite Builder", creator: "TN", usage: 83, liked: false },
  { id: 5, title: "API Scaffold", creator: "RB", usage: 315, liked: true },
  { id: 6, title: "Color Palette AI", creator: "EV", usage: 54, liked: false },
  { id: 7, title: "SQL Optimizer", creator: "JL", usage: 127, liked: false },
  { id: 8, title: "README Composer", creator: "CW", usage: 189, liked: true },
];

function PromptLibrary() {
  const [prompts, setPrompts] = useState(PROMPTS_INIT);
  const [search, setSearch] = useState("");
  const [cloned, setCloned] = useState(null);

  const toggleLike = (id) =>
    setPrompts((p) => p.map((r) => r.id === id ? { ...r, liked: !r.liked, usage: r.liked ? r.usage - 1 : r.usage + 1 } : r));
  const handleClone = (id) => { setCloned(id); setTimeout(() => setCloned(null), 1500); };

  const filtered = prompts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={css.card}>
      <div style={{ marginBottom: "14px" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts..." style={css.input} />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["Prompt", "Creator", "Uses", "Actions"].map((h) => (
              <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: C.muted, fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surface3)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <td style={{ padding: "10px 10px", color: C.text, fontWeight: 600 }}>{p.title}</td>
              <td style={{ padding: "10px 10px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: `${MEMBERS.find((m) => m.initials === p.creator)?.color || C.muted}28`,
                  color: MEMBERS.find((m) => m.initials === p.creator)?.color || C.muted,
                  fontSize: "0.62rem", fontWeight: 700, border: `1px solid currentColor`,
                }}>{p.creator}</div>
              </td>
              <td style={{ padding: "10px 10px", color: C.muted }}>{p.usage.toLocaleString()}</td>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => toggleLike(p.id)}
                    style={{ ...css.btn(p.liked ? C.red : C.muted, !p.liked), padding: "4px 10px", fontSize: "0.68rem" }}>
                    {p.liked ? "♥" : "♡"}
                  </button>
                  <button onClick={() => handleClone(p.id)}
                    style={{ ...css.btn(cloned === p.id ? C.green : C.teal), padding: "4px 10px", fontSize: "0.68rem" }}>
                    {cloned === p.id ? "✓ Cloned" : "⎘ Clone"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── TEAM ANALYTICS ────────────────────────────────────────────────
const BROADCASTS = [
  { name: "Raj Bhat", value: 87, color: "#60a5fa" },
  { name: "Aisha Khan", value: 74, color: "#f5b731" },
  { name: "Tom Nkosi", value: 68, color: "#4ade80" },
  { name: "Marcos Rivera", value: 55, color: "#22d3ee" },
  { name: "Sophie Park", value: 42, color: "#a78bfa" },
  { name: "Jin Lee", value: 31, color: "#fb923c" },
];

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEATMAP_HOURS = ["9am", "12pm", "3pm", "6pm", "9pm"];

function TeamAnalytics() {
  const maxVal = Math.max(...BROADCASTS.map((b) => b.value));
  const heatmap = Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 10))
  );
  const heatMax = 10;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
      {/* Bar chart */}
      <div style={css.card}>
        <div style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "14px" }}>Broadcasts per Team Member</div>
        <svg width="100%" height={BROADCASTS.length * 38} style={{ overflow: "visible" }}>
          {BROADCASTS.map((b, i) => {
            const barW = (b.value / maxVal) * 70;
            return (
              <g key={b.name} transform={`translate(0, ${i * 38})`}>
                <text x="0" y="14" fontSize="11" fill={C.muted} fontFamily="DM Mono">{b.name}</text>
                <rect x="140" y="2" width={`${barW}%`} height="18" rx="4"
                  fill={b.color} fillOpacity="0.8" />
                <text x={`calc(${barW}% + 148px)`} y="16" fontSize="11" fill={b.color} fontFamily="DM Mono">{b.value}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Heatmap */}
      <div style={css.card}>
        <div style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "14px" }}>Activity Heatmap (Day × Hour)</div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "4px", paddingLeft: "28px" }}>
          {HEATMAP_HOURS.map((h) => (
            <div key={h} style={{ flex: 1, fontSize: "0.58rem", color: C.muted, textAlign: "center" }}>{h}</div>
          ))}
        </div>
        {HEATMAP_DAYS.map((d, di) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
            <div style={{ width: "24px", fontSize: "0.58rem", color: C.muted, textAlign: "right", flexShrink: 0 }}>{d}</div>
            {heatmap[di].map((v, hi) => {
              const intensity = v / heatMax;
              return (
                <div key={hi} title={`${v} events`} style={{
                  flex: 1, height: "22px", borderRadius: "3px",
                  background: `rgba(34, 211, 238, ${0.05 + intensity * 0.8})`,
                  border: `1px solid rgba(34, 211, 238, ${0.1 + intensity * 0.3})`,
                  cursor: "default",
                }} />
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: "12px", borderTop: `1px solid ${C.border}`, paddingTop: "12px" }}>
          {MEMBERS.slice(0, 6).map((m) => (
            <div key={m.initials} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "0.65rem", color: C.muted }}>{m.name.split(" ")[0]}</span>
              <span style={{ fontSize: "0.65rem", color: m.color }}>{m.tokens.toLocaleString()} tk</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PERMISSIONS MATRIX ────────────────────────────────────────────
const ROLES = ["Owner", "Admin", "Editor", "Viewer"];
const ACTIONS = ["Broadcast", "Edit Code", "Delete", "Invite", "Deploy", "Manage Keys"];
const ROLE_COLOR = { Owner: C.gold, Admin: C.purple, Editor: C.teal, Viewer: C.muted };

const DEFAULT_PERMS = {
  Owner:   { Broadcast: true,  "Edit Code": true,  Delete: true,  Invite: true,  Deploy: true,  "Manage Keys": true  },
  Admin:   { Broadcast: true,  "Edit Code": true,  Delete: true,  Invite: true,  Deploy: true,  "Manage Keys": false },
  Editor:  { Broadcast: true,  "Edit Code": true,  Delete: false, Invite: false, Deploy: false, "Manage Keys": false },
  Viewer:  { Broadcast: false, "Edit Code": false, Delete: false, Invite: false, Deploy: false, "Manage Keys": false },
};

function PermissionsMatrix() {
  const [perms, setPerms] = useState(DEFAULT_PERMS);
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [transferDone, setTransferDone] = useState(false);

  const toggle = (role, action) => {
    if (role === "Owner") return; // Owner always has all
    setPerms((p) => ({
      ...p,
      [role]: { ...p[role], [action]: !p[role][action] },
    }));
  };

  const handleTransfer = () => {
    setTransferDone(true);
    setConfirmTransfer(false);
    setTimeout(() => setTransferDone(false), 3000);
  };

  return (
    <div style={css.card}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: "8px 14px", textAlign: "left", color: C.muted, fontWeight: 600 }}>Role</th>
              {ACTIONS.map((a) => (
                <th key={a} style={{ padding: "8px 14px", textAlign: "center", color: C.muted, fontWeight: 600 }}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role} style={{ borderBottom: `1px solid ${C.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surface3)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    background: `${ROLE_COLOR[role]}18`, color: ROLE_COLOR[role],
                    border: `1px solid ${ROLE_COLOR[role]}44`,
                    borderRadius: "20px", padding: "3px 12px", fontSize: "0.72rem", fontWeight: 700,
                  }}>{role}</span>
                </td>
                {ACTIONS.map((action) => {
                  const enabled = perms[role][action];
                  const isOwner = role === "Owner";
                  return (
                    <td key={action} style={{ padding: "12px 14px", textAlign: "center" }}>
                      <div onClick={() => toggle(role, action)} style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: enabled ? `${ROLE_COLOR[role]}20` : `${C.surface3}`,
                        border: `1px solid ${enabled ? ROLE_COLOR[role] + "66" : C.border}`,
                        cursor: isOwner ? "default" : "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.75rem",
                      }}>
                        {enabled ? <span style={{ color: ROLE_COLOR[role] }}>✓</span> : <span style={{ color: C.muted }}>—</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        {!confirmTransfer && !transferDone && (
          <button onClick={() => setConfirmTransfer(true)} style={css.btn(C.red, true)}>
            Transfer Ownership
          </button>
        )}
        {confirmTransfer && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: `${C.red}10`, border: `1px solid ${C.red}44`,
            borderRadius: "8px", padding: "10px 16px",
          }}>
            <span style={{ fontSize: "0.75rem", color: C.text }}>Are you sure? This cannot be undone.</span>
            <button onClick={handleTransfer} style={{ ...css.btn(C.red), padding: "5px 12px", fontSize: "0.7rem" }}>Confirm</button>
            <button onClick={() => setConfirmTransfer(false)} style={{ ...css.btn(C.muted, true), padding: "5px 12px", fontSize: "0.7rem" }}>Cancel</button>
          </div>
        )}
        {transferDone && (
          <div style={{ fontSize: "0.75rem", color: C.green }}>✓ Ownership transferred successfully.</div>
        )}
        <span style={{ fontSize: "0.7rem", color: C.muted, marginLeft: "auto" }}>
          Click any cell to toggle permission. Owner permissions are fixed.
        </span>
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function CollaborationHub() {
  return (
    <div style={css.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0e0e16; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
      `}</style>

      {/* Hero */}
      <div style={css.hero}>
        <div style={css.heroGlow} />
        <h1 style={css.heroTitle}>Collaboration Hub</h1>
        <div>
          <span style={css.badge(C.green)}>● 8 Online</span>
          <span style={css.badge(C.teal)}>⚡ 3 Active Sessions</span>
          <span style={css.badge(C.purple)}>📋 47 Today's Actions</span>
        </div>
        <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: "12px", maxWidth: "560px" }}>
          Real-time team coordination, shared workspaces, and unified project visibility — all in one place.
        </p>
      </div>

      {/* Presence Bar */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.green }}>◈</span> Team Presence</div>
        <PresenceBar />
      </div>

      {/* Kanban + Activity — side by side */}
      <div style={{ ...css.section, display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>
        <div>
          <div style={css.sectionTitle}><span style={{ color: C.gold }}>◈</span> Shared Kanban Board</div>
          <KanbanBoard />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={css.sectionTitle}><span style={{ color: C.teal }}>◈</span> Live Activity</div>
          <div style={{ height: "520px" }}>
            <ActivityStream />
          </div>
        </div>
      </div>

      {/* Prompt Library */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.purple }}>◈</span> Shared Prompt Library</div>
        <PromptLibrary />
      </div>

      {/* Team Analytics */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.gold }}>◈</span> Team Analytics</div>
        <TeamAnalytics />
      </div>

      {/* Permissions Matrix */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.red }}>◈</span> Permissions Matrix</div>
        <PermissionsMatrix />
      </div>
    </div>
  );
}
