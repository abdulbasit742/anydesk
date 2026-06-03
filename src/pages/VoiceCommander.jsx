import { useState, useEffect, useRef, useMemo } from "react";

/* ─── CSS keyframes injected once ───────────────────────────── */
const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes pulse-ring2 {
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0; }
}
@keyframes pulse-ring3 {
  0%   { transform: scale(1);   opacity: 0.3; }
  100% { transform: scale(2.3); opacity: 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes bar-idle {
  0%, 100% { height: 6px; }
  50%       { height: 18px; }
}
@keyframes bar-active {
  0%   { height: 6px; }
  25%  { height: 40px; }
  50%  { height: 20px; }
  75%  { height: 50px; }
  100% { height: 6px; }
}
@keyframes typewriter {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes eq-bar {
  0%,100% { transform: scaleY(0.3); }
  50%     { transform: scaleY(1); }
}
@keyframes step-highlight {
  0%,100% { background: rgba(245,183,49,0.08); }
  50%     { background: rgba(245,183,49,0.22); }
}
@keyframes gold-glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(245,183,49,0); }
  50%     { box-shadow: 0 0 18px 4px rgba(245,183,49,0.25); }
}
`;

/* ─── Constants ──────────────────────────────────────────────── */
const CSS_VARS = {
  gold: "#f5b731",
  teal: "#22d3ee",
  purple: "#a78bfa",
  surface: "#0e0e16",
  surface2: "#16161e",
  surface3: "#1d1d28",
  border: "rgba(255,255,255,0.07)",
  muted: "#6e7191",
  red: "#ef4444",
};

const INITIAL_HISTORY = [
  { id: 1,  time: "05:41:12", cmd: "Open Analytics Dashboard",   action: "Navigated to /analytics",           status: "Executed" },
  { id: 2,  time: "05:39:54", cmd: "Start Broadcast Session",    action: "Broadcast session initiated",       status: "Executed" },
  { id: 3,  time: "05:38:20", cmd: "Show account status",        action: "Account panel opened",              status: "Executed" },
  { id: 4,  time: "05:36:45", cmd: "Mute all sounds",            action: "Audio muted globally",              status: "Executed" },
  { id: 5,  time: "05:35:02", cmd: "Run diagnostic workflow",    action: "Workflow engine triggered",         status: "Executed" },
  { id: 6,  time: "05:33:11", cmd: "Switch to Broadcast view",   action: "View switch attempted",             status: "Partial"  },
  { id: 7,  time: "05:31:00", cmd: "Check credit balance",       action: "Credits API called",                status: "Executed" },
  { id: 8,  time: "05:29:40", cmd: "Reset all filters",          action: "Filter reset",                      status: "Executed" },
  { id: 9,  time: "05:27:18", cmd: "Pause automation engine",    action: "Command not recognized",            status: "Failed"   },
  { id: 10, time: "05:25:55", cmd: "Deploy quick export",        action: "Export initiated in background",    status: "Executed" },
];

const COMMAND_LIBRARY = {
  Navigation: [
    "Go to Dashboard", "Open Analytics", "Switch to Broadcast",
    "Show Workflows", "Navigate to Billing", "Open Settings",
    "View Integrations", "Go to Reports", "Open Credits Panel",
  ],
  Actions: [
    "Start Broadcast", "Pause Automation", "Run Workflow",
    "Deploy Project", "Stop All Tasks", "Clear Queue",
    "Restart Engine", "Sync Data", "Export Results",
  ],
  Queries: [
    "Show account status", "What is my credit balance",
    "List active workflows", "Check API health",
    "How many broadcasts today", "Show error log",
    "List integrations", "Show pending tasks",
  ],
  Settings: [
    "Enable dark mode", "Mute sounds", "Reset filters",
    "Toggle notifications", "Set auto-save", "Change language",
    "Update API key", "Enable two-factor", "Clear cache",
  ],
};

const VOICE_PROFILES = [
  { id: 1, emoji: "🎙️", name: "Primary Profile",   accent: "US English",    lang: "English",    acc: 97, wake: "Hey Studio", active: true  },
  { id: 2, emoji: "🌍", name: "International",      accent: "British",       lang: "English",    acc: 91, wake: "Bolt",       active: false },
  { id: 3, emoji: "🇩🇪", name: "German Mode",       accent: "High German",   lang: "German",     acc: 88, wake: "Aktiviere",  active: false },
  { id: 4, emoji: "🇯🇵", name: "Japanese Mode",     accent: "Tokyo",         lang: "Japanese",   acc: 85, wake: "スタジオ",     active: false },
  { id: 5, emoji: "🇪🇸", name: "Spanish Mode",      accent: "Castilian",     lang: "Spanish",    acc: 89, wake: "Activa",     active: false },
  { id: 6, emoji: "🤖", name: "Robot / Clear",      accent: "Neutral AI",    lang: "English",    acc: 99, wake: "Activate",   active: false },
];

const LANGUAGES = [
  "English (US)", "English (UK)", "German", "French", "Spanish",
  "Japanese", "Korean", "Portuguese", "Italian", "Dutch", "Mandarin", "Arabic",
];

const MACROS = [
  {
    id: 1, icon: "🌅", name: "Morning Routine",
    steps: ["Open Dashboard", "Load Analytics", "Start Broadcast"],
    trigger: "Good morning studio", lastRun: "Today 05:00",
  },
  {
    id: 2, icon: "🚀", name: "Deploy Workflow",
    steps: ["Validate config", "Queue deployment", "Notify team"],
    trigger: "Deploy now", lastRun: "Yesterday 18:22",
  },
  {
    id: 3, icon: "🔍", name: "Full Diagnostic",
    steps: ["Check API health", "Scan integrations", "Generate report"],
    trigger: "Run diagnostics", lastRun: "2 days ago",
  },
  {
    id: 4, icon: "💳", name: "Credit Check",
    steps: ["Fetch balance", "Show tier status", "List usage"],
    trigger: "Credit report", lastRun: "Today 04:55",
  },
  {
    id: 5, icon: "📦", name: "Quick Export",
    steps: ["Compress data", "Upload to storage", "Send download link"],
    trigger: "Export everything", lastRun: "3 hours ago",
  },
  {
    id: 6, icon: "🛑", name: "Emergency Stop",
    steps: ["Halt all broadcasts", "Pause automations", "Alert admin"],
    trigger: "Emergency stop", lastRun: "Never",
  },
];

const INTEGRATION_ACTIONS = [
  { icon: "📡", name: "Live Broadcast",   phrase: "Start broadcast"   },
  { icon: "🤖", name: "Run Automation",   phrase: "Run automation"    },
  { icon: "📊", name: "Open Analytics",   phrase: "Show analytics"    },
  { icon: "💳", name: "Check Credits",    phrase: "Credit balance"    },
  { icon: "⚙️", name: "Open Settings",   phrase: "Open settings"     },
  { icon: "🔗", name: "Integrations",     phrase: "List integrations" },
  { icon: "📤", name: "Export Data",      phrase: "Export data"       },
  { icon: "🔔", name: "Notifications",    phrase: "Show alerts"       },
  { icon: "🛡️", name: "Security Scan",   phrase: "Security check"    },
  { icon: "📁", name: "File Manager",     phrase: "Open files"        },
  { icon: "🧪", name: "Test Suite",       phrase: "Run tests"         },
  { icon: "🚨", name: "Emergency Stop",   phrase: "Emergency stop"    },
];

const ANALYTICS_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ANALYTICS_ACC  = [91, 94, 88, 96, 93, 97, 94];
const TOP_COMMANDS = [
  { cmd: "Open Analytics",     count: 142 },
  { cmd: "Start Broadcast",    count: 118 },
  { cmd: "Show account status",count: 97  },
  { cmd: "Run Workflow",       count: 83  },
  { cmd: "Check credit balance",count: 71 },
  { cmd: "Go to Dashboard",    count: 65  },
  { cmd: "Mute sounds",        count: 54  },
  { cmd: "Deploy Project",     count: 49  },
];
const FAILED_COMMANDS = [
  "Pause automation engine",
  "Switch to Broadcast view",
  "Enable advanced mode",
];
const RESPONSE_TIMES = [8, 12, 10, 15, 9, 11, 14, 10, 13, 8];

/* ─── Helpers ────────────────────────────────────────────────── */
const statusColor = (s) =>
  s === "Executed" ? CSS_VARS.teal : s === "Failed" ? CSS_VARS.red : CSS_VARS.gold;

const pct = (v, max) => `${((v / max) * 100).toFixed(1)}%`;

/* ─── Sub-components ─────────────────────────────────────────── */

function SectionCard({ title, subtitle, children, accentColor }) {
  const color = accentColor || CSS_VARS.gold;
  return (
    <div style={{
      background: CSS_VARS.surface2,
      border: `1px solid ${CSS_VARS.border}`,
      borderRadius: 16,
      padding: "28px 28px 24px",
      marginBottom: 28,
      animation: "fade-in 0.4s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 20 }}>
        <div style={{ width: 4, height: 22, borderRadius: 2, background: color }} />
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h2>
      </div>
      {subtitle && (
        <p style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, margin: "0 0 20px 14px" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
      borderRadius: 20,
      padding: "3px 12px",
      fontFamily: "DM Mono, monospace",
      fontSize: 11,
      fontWeight: 500,
      display: "inline-block",
    }}>{label}</span>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: CSS_VARS.surface3,
      border: `1px solid ${CSS_VARS.gold}50`,
      borderRadius: 12,
      padding: "14px 22px",
      fontFamily: "DM Mono, monospace",
      fontSize: 13,
      color: CSS_VARS.gold,
      animation: "toast-in 0.3s ease",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <span>⚡</span> {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", color: CSS_VARS.muted, cursor: "pointer", fontSize: 15, marginLeft: 8 }}>×</button>
    </div>
  );
}

/* ─── Section 2: Voice Visualizer ─────────────────────────────── */
function VoiceVisualizer({ listening, processing, onToggle, transcript }) {
  const BAR_COUNT = 24;
  return (
    <SectionCard title="Voice Visualizer" subtitle="Click the microphone to start listening" accentColor={CSS_VARS.teal}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* Waveform bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div key={i} style={{
              width: 5, borderRadius: 3,
              background: listening
                ? `hsl(${180 + i * 5}, 80%, 60%)`
                : CSS_VARS.muted,
              animation: listening
                ? `bar-active ${0.6 + (i % 5) * 0.15}s ease-in-out infinite`
                : `bar-idle ${1.2 + (i % 4) * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.04}s`,
              alignSelf: "flex-end",
            }} />
          ))}
        </div>

        {/* Microphone button */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 140, height: 140 }}>
          {listening && (
            <>
              <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${CSS_VARS.teal}`, animation: "pulse-ring 1.2s ease-out infinite" }} />
              <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${CSS_VARS.teal}`, animation: "pulse-ring2 1.2s ease-out infinite 0.35s" }} />
              <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${CSS_VARS.teal}`, animation: "pulse-ring3 1.2s ease-out infinite 0.7s" }} />
            </>
          )}
          {!listening && !processing && (
            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${CSS_VARS.gold}50`, animation: "pulse-ring 2.5s ease-out infinite" }} />
          )}
          <button
            onClick={onToggle}
            style={{
              width: 96, height: 96, borderRadius: "50%",
              background: listening ? `linear-gradient(135deg, ${CSS_VARS.teal}, #0ea5e9)` : processing ? CSS_VARS.surface3 : `linear-gradient(135deg, ${CSS_VARS.gold}, #f59e0b)`,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: processing ? 13 : 36,
              color: "#000",
              fontFamily: "DM Mono, monospace",
              fontWeight: 700,
              boxShadow: listening ? `0 0 28px ${CSS_VARS.teal}60` : `0 0 22px ${CSS_VARS.gold}50`,
              transition: "all 0.3s ease",
              position: "relative", zIndex: 2,
            }}
          >
            {processing ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, border: `3px solid ${CSS_VARS.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              </div>
            ) : "🎤"}
          </button>
        </div>

        {/* State label */}
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: listening ? CSS_VARS.teal : processing ? CSS_VARS.gold : CSS_VARS.muted, letterSpacing: 1 }}>
          {processing ? "Processing..." : listening ? "● Listening..." : "Click to activate"}
        </div>

        {/* Transcript */}
        <div style={{
          width: "100%", maxWidth: 560,
          background: CSS_VARS.surface3,
          borderRadius: 10,
          border: `1px solid ${CSS_VARS.border}`,
          padding: "12px 18px",
          minHeight: 48,
          fontFamily: "DM Mono, monospace",
          fontSize: 14,
          color: "#fff",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
          {transcript ? (
            <>
              <span style={{ color: CSS_VARS.gold }}>▶ </span>
              <span style={{
                display: "inline-block",
                overflow: "hidden",
                animation: "typewriter 0.8s steps(40) forwards",
                width: "auto",
                maxWidth: "100%",
              }}>{transcript}</span>
              <span style={{ animation: "blink 1s step-end infinite", color: CSS_VARS.teal }}>|</span>
            </>
          ) : (
            <span style={{ color: CSS_VARS.muted }}>Your speech will appear here...</span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── Section 3: Command History ───────────────────────────────── */
function CommandHistory({ history, onReplay }) {
  return (
    <SectionCard title="Command History" subtitle="Last 10 voice commands with status" accentColor={CSS_VARS.purple}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item) => (
          <div key={item.id} style={{
            background: CSS_VARS.surface3,
            borderRadius: 10,
            border: `1px solid ${CSS_VARS.border}`,
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted, minWidth: 60 }}>{item.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: "#fff", marginBottom: 2 }}>{item.cmd}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted }}>{item.action}</div>
            </div>
            <span style={{
              fontFamily: "DM Mono, monospace", fontSize: 11,
              color: statusColor(item.status),
              background: `${statusColor(item.status)}15`,
              border: `1px solid ${statusColor(item.status)}35`,
              borderRadius: 20, padding: "2px 10px", minWidth: 68, textAlign: "center",
            }}>{item.status}</span>
            <button onClick={() => onReplay(item.cmd)} style={{ background: `${CSS_VARS.teal}15`, border: `1px solid ${CSS_VARS.teal}30`, color: CSS_VARS.teal, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Replay</button>
            <button style={{ background: `${CSS_VARS.muted}12`, border: `1px solid ${CSS_VARS.border}`, color: CSS_VARS.muted, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Edit</button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── Section 4: Command Library ───────────────────────────────── */
function CommandLibrary({ onExecute }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Navigation");

  const filtered = useMemo(() => {
    if (!search) return COMMAND_LIBRARY[activeCategory] || [];
    return Object.values(COMMAND_LIBRARY).flat().filter(c =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, activeCategory]);

  return (
    <SectionCard title="Command Library" subtitle="Search and execute voice commands" accentColor={CSS_VARS.gold}>
      <input
        placeholder="🔍  Search commands..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`,
          borderRadius: 8, padding: "10px 14px",
          fontFamily: "DM Mono, monospace", fontSize: 13, color: "#fff",
          outline: "none", marginBottom: 16,
        }}
      />
      {!search && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.keys(COMMAND_LIBRARY).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? `${CSS_VARS.gold}20` : CSS_VARS.surface3,
              border: `1px solid ${activeCategory === cat ? CSS_VARS.gold : CSS_VARS.border}`,
              color: activeCategory === cat ? CSS_VARS.gold : CSS_VARS.muted,
              borderRadius: 20, padding: "5px 16px",
              fontFamily: "DM Mono, monospace", fontSize: 12, cursor: "pointer",
            }}>{cat}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {filtered.map((cmd, i) => (
          <button key={i} onClick={() => onExecute(cmd)} style={{
            background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`,
            color: "#d4d4f0", borderRadius: 20, padding: "6px 14px",
            fontFamily: "DM Mono, monospace", fontSize: 12, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CSS_VARS.gold; e.currentTarget.style.color = CSS_VARS.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CSS_VARS.border; e.currentTarget.style.color = "#d4d4f0"; }}
          >{cmd}</button>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── Section 5: Voice Profiles ────────────────────────────────── */
function VoiceProfiles({ showToast }) {
  const [profiles, setProfiles] = useState(VOICE_PROFILES);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");

  const activate = (id) => {
    setProfiles(ps => ps.map(p => ({ ...p, active: p.id === id })));
    const p = profiles.find(x => x.id === id);
    showToast(`Profile "${p.name}" activated`);
  };
  const deleteProfile = (id) => {
    setProfiles(ps => ps.filter(p => p.id !== id));
    showToast("Profile removed");
  };
  const addProfile = () => {
    if (!newName.trim()) return;
    setProfiles(ps => [...ps, {
      id: Date.now(), emoji: "🎤", name: newName, accent: "US English",
      lang: "English", acc: 85, wake: "Hey Studio", active: false,
    }]);
    setNewName(""); setAddingNew(false);
    showToast(`Profile "${newName}" created`);
  };

  return (
    <SectionCard title="Voice Profiles" subtitle="Pre-trained speaker profiles" accentColor={CSS_VARS.teal}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {profiles.map(p => (
          <div key={p.id} style={{
            background: p.active ? `${CSS_VARS.gold}0a` : CSS_VARS.surface3,
            border: `1px solid ${p.active ? CSS_VARS.gold : CSS_VARS.border}`,
            borderRadius: 12, padding: "16px",
            animation: p.active ? "gold-glow 2s ease infinite" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{p.emoji}</span>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: p.active ? CSS_VARS.gold : "#fff" }}>{p.name}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted }}>{p.lang} · {p.accent}</div>
              </div>
              {p.active && <span style={{ marginLeft: "auto", color: CSS_VARS.gold, fontSize: 11, fontFamily: "DM Mono, monospace" }}>ACTIVE</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted }}>Accuracy</span>
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.teal }}>{p.acc}%</span>
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted, marginBottom: 12 }}>Wake: <span style={{ color: CSS_VARS.purple }}>{p.wake}</span></div>
            <div style={{ display: "flex", gap: 6 }}>
              {!p.active && (
                <button onClick={() => activate(p.id)} style={{ flex: 1, background: `${CSS_VARS.gold}18`, border: `1px solid ${CSS_VARS.gold}40`, color: CSS_VARS.gold, borderRadius: 6, padding: "5px 8px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Activate</button>
              )}
              <button style={{ flex: 1, background: `${CSS_VARS.muted}12`, border: `1px solid ${CSS_VARS.border}`, color: CSS_VARS.muted, borderRadius: 6, padding: "5px 8px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Edit</button>
              <button onClick={() => deleteProfile(p.id)} style={{ background: `${CSS_VARS.red}15`, border: `1px solid ${CSS_VARS.red}30`, color: CSS_VARS.red, borderRadius: 6, padding: "5px 8px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {addingNew ? (
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <input
            placeholder="New profile name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addProfile()}
            style={{ flex: 1, background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.gold}50`, borderRadius: 8, padding: "8px 12px", color: "#fff", fontFamily: "DM Mono, monospace", fontSize: 13, outline: "none" }}
          />
          <button onClick={addProfile} style={{ background: CSS_VARS.gold, border: "none", color: "#000", borderRadius: 8, padding: "8px 18px", fontFamily: "DM Mono, monospace", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create</button>
          <button onClick={() => setAddingNew(false)} style={{ background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`, color: CSS_VARS.muted, borderRadius: 8, padding: "8px 14px", fontFamily: "DM Mono, monospace", fontSize: 13, cursor: "pointer" }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAddingNew(true)} style={{ marginTop: 16, background: `${CSS_VARS.gold}15`, border: `1px dashed ${CSS_VARS.gold}50`, color: CSS_VARS.gold, borderRadius: 10, padding: "10px 24px", fontFamily: "DM Mono, monospace", fontSize: 13, cursor: "pointer", width: "100%" }}>
          + Add Profile
        </button>
      )}
    </SectionCard>
  );
}

const Toggle = ({ val, onChange, label }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${CSS_VARS.border}` }}>
    <span style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: "#d4d4f0" }}>{label}</span>
    <div onClick={() => onChange(!val)} style={{ width: 44, height: 24, borderRadius: 12, background: val ? CSS_VARS.teal : CSS_VARS.surface3, border: `1px solid ${val ? CSS_VARS.teal : CSS_VARS.border}`, cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
      <div style={{ position: "absolute", top: 3, left: val ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.3s" }} />
    </div>
  </div>
);

/* ─── Section 6: Language & Accent Settings ─────────────────────── */
function LanguageSettings({ showToast }) {
  const [lang, setLang] = useState("English (US)");
  const [accent, setAccent] = useState("American");
  const [sensitivity, setSensitivity] = useState(72);
  const [noiseCancel, setNoiseCancel] = useState(true);
  const [keywordDetect, setKeywordDetect] = useState(true);
  const [wakeWord, setWakeWord] = useState("Hey Studio");
  const [testing, setTesting] = useState(false);

  const runTest = () => {
    setTesting(true);
    setTimeout(() => { setTesting(false); showToast("Audio test complete — quality: Excellent"); }, 2200);
  };

  return (
    <SectionCard title="Language & Accent Settings" subtitle="Configure speech recognition parameters" accentColor={CSS_VARS.purple}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted, display: "block", marginBottom: 6 }}>Language</label>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: "100%", background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`, borderRadius: 8, padding: "9px 12px", color: "#fff", fontFamily: "DM Mono, monospace", fontSize: 13, outline: "none" }}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted, display: "block", marginBottom: 6 }}>Accent</label>
          <select value={accent} onChange={e => setAccent(e.target.value)} style={{ width: "100%", background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`, borderRadius: 8, padding: "9px 12px", color: "#fff", fontFamily: "DM Mono, monospace", fontSize: 13, outline: "none" }}>
            {["American", "British", "Australian", "Irish", "Indian", "South African"].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted }}>Sensitivity</label>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.gold }}>{sensitivity}%</span>
        </div>
        <input type="range" min={0} max={100} value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))} style={{ width: "100%", accentColor: CSS_VARS.gold }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <Toggle val={noiseCancel} onChange={setNoiseCancel} label="Noise Cancellation" />
        <Toggle val={keywordDetect} onChange={setKeywordDetect} label="Keyword Detection" />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.muted, display: "block", marginBottom: 6 }}>Wake Word</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={wakeWord} onChange={e => setWakeWord(e.target.value)} style={{ flex: 1, background: CSS_VARS.surface3, border: `1px solid ${CSS_VARS.border}`, borderRadius: 8, padding: "9px 14px", color: "#fff", fontFamily: "DM Mono, monospace", fontSize: 13, outline: "none" }} />
          {["Hey Studio", "Bolt", "Activate"].map(w => (
            <button key={w} onClick={() => setWakeWord(w)} style={{ background: wakeWord === w ? `${CSS_VARS.purple}20` : CSS_VARS.surface3, border: `1px solid ${wakeWord === w ? CSS_VARS.purple : CSS_VARS.border}`, color: wakeWord === w ? CSS_VARS.purple : CSS_VARS.muted, borderRadius: 8, padding: "6px 12px", fontFamily: "DM Mono, monospace", fontSize: 11, cursor: "pointer" }}>{w}</button>
          ))}
        </div>
      </div>

      <button onClick={runTest} style={{ marginTop: 18, background: testing ? CSS_VARS.surface3 : `${CSS_VARS.teal}18`, border: `1px solid ${CSS_VARS.teal}40`, color: testing ? CSS_VARS.muted : CSS_VARS.teal, borderRadius: 8, padding: "10px 24px", fontFamily: "DM Mono, monospace", fontSize: 13, cursor: "pointer" }}>
        {testing ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${CSS_VARS.teal}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Testing...
          </span>
        ) : "🎚️  Live Audio Test"}
      </button>
    </SectionCard>
  );
}

/* ─── Section 7: Smart Macros ──────────────────────────────────── */
function SmartMacros({ showToast }) {
  const [macros, setMacros] = useState(MACROS);
  const [running, setRunning] = useState(null);
  const [runStep, setRunStep] = useState(0);

  const runMacro = (macro) => {
    setRunning(macro.id);
    setRunStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRunStep(step);
      if (step >= macro.steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setRunning(null);
          setRunStep(0);
          setMacros(ms => ms.map(m => m.id === macro.id ? { ...m, lastRun: "Just now" } : m));
          showToast(`Macro "${macro.name}" completed`);
        }, 500);
      }
    }, 700);
  };

  const deleteMacro = (id) => {
    setMacros(ms => ms.filter(m => m.id !== id));
    showToast("Macro deleted");
  };

  return (
    <SectionCard title="Smart Macros" subtitle="Chained voice command sequences" accentColor={CSS_VARS.gold}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {macros.map(macro => (
          <div key={macro.id} style={{
            background: CSS_VARS.surface3,
            border: `1px solid ${running === macro.id ? CSS_VARS.gold : CSS_VARS.border}`,
            borderRadius: 12, padding: 16,
            transition: "border-color 0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{macro.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{macro.name}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: CSS_VARS.purple }}>"{macro.trigger}"</div>
              </div>
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: CSS_VARS.muted }}>{macro.lastRun}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              {macro.steps.map((step, si) => (
                <div key={si} style={{
                  fontFamily: "DM Mono, monospace", fontSize: 11,
                  color: running === macro.id && si < runStep ? CSS_VARS.teal : running === macro.id && si === runStep ? CSS_VARS.gold : CSS_VARS.muted,
                  padding: "3px 8px", borderRadius: 4, marginBottom: 2,
                  animation: running === macro.id && si === runStep ? "step-highlight 0.7s ease infinite" : "none",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {running === macro.id && si < runStep ? "✓" : running === macro.id && si === runStep ? "▶" : `${si + 1}.`} {step}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => runMacro(macro)}
                disabled={running === macro.id}
                style={{ flex: 1, background: `${CSS_VARS.gold}18`, border: `1px solid ${CSS_VARS.gold}40`, color: CSS_VARS.gold, borderRadius: 6, padding: "6px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer", opacity: running === macro.id ? 0.5 : 1 }}
              >
                {running === macro.id ? "Running..." : "▶ Run"}
              </button>
              <button style={{ background: `${CSS_VARS.muted}12`, border: `1px solid ${CSS_VARS.border}`, color: CSS_VARS.muted, borderRadius: 6, padding: "6px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Edit</button>
              <button onClick={() => deleteMacro(macro.id)} style={{ background: `${CSS_VARS.red}15`, border: `1px solid ${CSS_VARS.red}30`, color: CSS_VARS.red, borderRadius: 6, padding: "6px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Del</button>
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 16, width: "100%", background: `${CSS_VARS.gold}10`, border: `1px dashed ${CSS_VARS.gold}40`, color: CSS_VARS.gold, borderRadius: 10, padding: "10px", fontFamily: "DM Mono, monospace", fontSize: 13, cursor: "pointer" }}>
        + Add Macro
      </button>
    </SectionCard>
  );
}

/* ─── Section 8: Accuracy Analytics ───────────────────────────── */
function AccuracyAnalytics() {
  const maxAcc = Math.max(...ANALYTICS_ACC);
  const maxRt  = Math.max(...RESPONSE_TIMES);
  const successRate = 91;

  const circumference = 2 * Math.PI * 45;
  const dashOffset    = circumference * (1 - successRate / 100);

  return (
    <SectionCard title="Accuracy Analytics" subtitle="7-day performance metrics" accentColor={CSS_VARS.teal}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Bar Chart */}
        <div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 12 }}>7-Day Accuracy</div>
          <svg width="100%" viewBox="0 0 280 100" style={{ overflow: "visible" }}>
            {ANALYTICS_ACC.map((v, i) => {
              const barH = (v / maxAcc) * 75;
              const x = 10 + i * 38;
              return (
                <g key={i}>
                  <rect x={x} y={100 - barH - 16} width={26} height={barH} rx={4} fill={`${CSS_VARS.teal}60`} />
                  <rect x={x} y={100 - barH - 16} width={26} height={4} rx={2} fill={CSS_VARS.teal} />
                  <text x={x + 13} y={98} textAnchor="middle" fill={CSS_VARS.muted} fontSize={9} fontFamily="DM Mono, monospace">{ANALYTICS_DAYS[i]}</text>
                  <text x={x + 13} y={100 - barH - 20} textAnchor="middle" fill={CSS_VARS.teal} fontSize={9} fontFamily="DM Mono, monospace">{v}%</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Donut */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 12 }}>Success Rate</div>
          <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx={60} cy={60} r={45} fill="none" stroke={`${CSS_VARS.surface3}`} strokeWidth={12} />
            <circle cx={60} cy={60} r={45} fill="none" stroke={CSS_VARS.gold} strokeWidth={12}
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 60 60)" />
            <text x={60} y={56} textAnchor="middle" fill="#fff" fontSize={18} fontFamily="Syne, sans-serif" fontWeight="700">{successRate}%</text>
            <text x={60} y={72} textAnchor="middle" fill={CSS_VARS.muted} fontSize={9} fontFamily="DM Mono, monospace">Success</text>
          </svg>
        </div>
      </div>

      {/* Top Commands */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 10 }}>Most Used Commands</div>
        {TOP_COMMANDS.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: CSS_VARS.muted, minWidth: 14 }}>{i + 1}</span>
            <div style={{ flex: 1, fontFamily: "DM Mono, monospace", fontSize: 12, color: "#d4d4f0" }}>{item.cmd}</div>
            <div style={{ width: 120, height: 6, background: CSS_VARS.surface3, borderRadius: 3 }}>
              <div style={{ width: pct(item.count, 142), height: "100%", background: CSS_VARS.purple, borderRadius: 3 }} />
            </div>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: CSS_VARS.purple, minWidth: 30 }}>{item.count}</span>
          </div>
        ))}
      </div>

      {/* Response Time Histogram */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 10 }}>Response Time (ms)</div>
        <svg width="100%" viewBox="0 0 280 60" style={{ overflow: "visible" }}>
          {RESPONSE_TIMES.map((v, i) => {
            const bH = (v / maxRt) * 45;
            const x = 8 + i * 27;
            return (
              <g key={i}>
                <rect x={x} y={55 - bH} width={20} height={bH} rx={3} fill={`${CSS_VARS.gold}55`} />
                <rect x={x} y={55 - bH} width={20} height={3} rx={1} fill={CSS_VARS.gold} />
                <text x={x + 10} y={70} textAnchor="middle" fill={CSS_VARS.muted} fontSize={8} fontFamily="DM Mono, monospace">{v}ms</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Failed commands */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 10 }}>Failed Commands</div>
        {FAILED_COMMANDS.map((cmd, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: `${CSS_VARS.red}08`, border: `1px solid ${CSS_VARS.red}20`, borderRadius: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.red }}>{cmd}</span>
            <button style={{ background: `${CSS_VARS.gold}15`, border: `1px solid ${CSS_VARS.gold}35`, color: CSS_VARS.gold, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontFamily: "DM Mono, monospace", cursor: "pointer" }}>Retrain</button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── Section 9: Integration Actions ──────────────────────────── */
function IntegrationActions({ showToast }) {
  const [recentTriggered, setRecentTriggered] = useState([
    { icon: "📡", name: "Live Broadcast",   phrase: "Start broadcast",   time: "05:41" },
    { icon: "📊", name: "Open Analytics",   phrase: "Show analytics",    time: "05:39" },
    { icon: "💳", name: "Check Credits",    phrase: "Credit balance",    time: "05:37" },
    { icon: "⚙️", name: "Open Settings",   phrase: "Open settings",     time: "05:35" },
    { icon: "📤", name: "Export Data",      phrase: "Export data",       time: "05:30" },
  ]);

  const triggerAction = (action) => {
    showToast(`Voice action triggered: ${action.name}`);
    setRecentTriggered(prev => [
      { ...action, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <SectionCard title="Integration Actions" subtitle="Voice-controlled platform actions" accentColor={CSS_VARS.gold}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
        {INTEGRATION_ACTIONS.map((action, i) => (
          <button key={i} onClick={() => triggerAction(action)} style={{
            background: CSS_VARS.surface3,
            border: `1px solid ${CSS_VARS.border}`,
            borderRadius: 12, padding: "16px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CSS_VARS.gold; e.currentTarget.style.boxShadow = `0 0 14px ${CSS_VARS.gold}30`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CSS_VARS.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ fontSize: 24 }}>{action.icon}</span>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "center" }}>{action.name}</span>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 9, color: CSS_VARS.muted, textAlign: "center" }}>"{action.phrase}"</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 10 }}>Recently Triggered</div>
        {recentTriggered.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < recentTriggered.length - 1 ? `1px solid ${CSS_VARS.border}` : "none" }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#fff" }}>{item.name}</div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: CSS_VARS.muted }}>"{item.phrase}"</div>
            </div>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: CSS_VARS.muted }}>{item.time}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── Section 10: Noise & Quality Monitor ─────────────────────── */
function NoiseQualityMonitor({ showToast }) {
  const [signalQuality, setSignalQuality] = useState(82);
  const [noiseLevel, setNoiseLevel] = useState(14);
  const [eqHeights, setEqHeights] = useState([30, 55, 40, 70, 45, 60, 35, 50]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setSignalQuality(prev => Math.max(60, Math.min(99, prev + (Math.floor(Date.now() % 3) - 1) * 3)));
      setNoiseLevel(prev => Math.max(5, Math.min(40, prev + (Math.floor(Date.now() % 5) - 2))));
      setEqHeights(prev => prev.map((h, i) => {
        const delta = ((Date.now() + i * 137) % 7) - 3;
        return Math.max(15, Math.min(80, h + delta * 2));
      }));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const micTest = () => {
    setTesting(true);
    setTimeout(() => { setTesting(false); showToast("Microphone test passed — SNR: 28dB"); }, 2500);
  };

  const qualityColor = signalQuality > 80 ? CSS_VARS.teal : signalQuality > 60 ? CSS_VARS.gold : CSS_VARS.red;
  const noiseColor   = noiseLevel < 20 ? CSS_VARS.teal : noiseLevel < 35 ? CSS_VARS.gold : CSS_VARS.red;

  return (
    <SectionCard title="Noise & Quality Monitor" subtitle="Live audio environment diagnostics" accentColor={CSS_VARS.teal}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted }}>Signal Quality</span>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: qualityColor }}>{signalQuality}%</span>
          </div>
          <div style={{ width: "100%", height: 10, background: CSS_VARS.surface3, borderRadius: 5 }}>
            <div style={{ width: `${signalQuality}%`, height: "100%", background: qualityColor, borderRadius: 5, transition: "width 1.5s ease, background 1s" }} />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted }}>Background Noise</span>
            <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: noiseColor }}>{noiseLevel} dB</span>
          </div>
          <div style={{ width: "100%", height: 10, background: CSS_VARS.surface3, borderRadius: 5 }}>
            <div style={{ width: `${(noiseLevel / 40) * 100}%`, height: "100%", background: noiseColor, borderRadius: 5, transition: "width 1.5s ease, background 1s" }} />
          </div>
        </div>
      </div>

      {/* Equalizer */}
      <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: CSS_VARS.muted, marginBottom: 10 }}>Live Equalizer</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 20 }}>
        {eqHeights.map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{
              width: "100%", height: `${h}px`,
              background: `linear-gradient(180deg, ${CSS_VARS.teal}, ${CSS_VARS.purple}80)`,
              borderRadius: "3px 3px 0 0",
              transition: "height 1.8s ease",
            }} />
          </div>
        ))}
      </div>

      <button onClick={micTest} style={{ background: testing ? CSS_VARS.surface3 : `${CSS_VARS.gold}18`, border: `1px solid ${CSS_VARS.gold}40`, color: testing ? CSS_VARS.muted : CSS_VARS.gold, borderRadius: 8, padding: "10px 22px", fontFamily: "DM Mono, monospace", fontSize: 13, cursor: "pointer" }}>
        {testing ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${CSS_VARS.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Testing microphone...
          </span>
        ) : "🎙️  Microphone Test"}
      </button>
    </SectionCard>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function VoiceCommander() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [toast, setToast] = useState(null);
  const nextIdRef = useRef(11);
  const listenTimerRef = useRef(null);

  const MOCK_TRANSCRIPTS = useMemo(() => [
    "Open Analytics Dashboard",
    "Show account status",
    "Start Broadcast Session",
    "Check credit balance",
    "Run diagnostic workflow",
    "Go to Dashboard",
    "Enable dark mode",
    "Mute all sounds",
  ], []);

  const transcriptIdxRef = useRef(0);

  const showToast = (msg) => setToast(msg);

  const toggleListening = () => {
    if (processing) return;

    if (listening) {
      clearTimeout(listenTimerRef.current);
      setListening(false);
      setProcessing(true);
      const cmd = MOCK_TRANSCRIPTS[transcriptIdxRef.current % MOCK_TRANSCRIPTS.length];
      transcriptIdxRef.current += 1;
      setTranscript(cmd);
      setTimeout(() => {
        setProcessing(false);
        const newEntry = {
          id: nextIdRef.current++,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          cmd,
          action: `Executed: ${cmd}`,
          status: "Executed",
        };
        setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
        showToast(`Command executed: "${cmd}"`);
      }, 1600);
    } else {
      setListening(true);
      setTranscript("");
      listenTimerRef.current = setTimeout(() => {
        setListening(false);
        setProcessing(true);
        const cmd = MOCK_TRANSCRIPTS[transcriptIdxRef.current % MOCK_TRANSCRIPTS.length];
        transcriptIdxRef.current += 1;
        setTranscript(cmd);
        setTimeout(() => {
          setProcessing(false);
          const newEntry = {
            id: nextIdRef.current++,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
            cmd,
            action: `Executed: ${cmd}`,
            status: "Executed",
          };
          setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
          showToast(`Command executed: "${cmd}"`);
        }, 1600);
      }, 4000);
    }
  };

  const replayCommand = (cmd) => {
    showToast(`Replaying: "${cmd}"`);
  };

  const executeLibraryCommand = (cmd) => {
    showToast(`⚡ Executing: "${cmd}"`);
    const newEntry = {
      id: nextIdRef.current++,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      cmd,
      action: `Library command executed`,
      status: "Executed",
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    return () => clearTimeout(listenTimerRef.current);
  }, []);

  return (
    <div style={{ background: CSS_VARS.surface, minHeight: "100vh", padding: "32px 24px", fontFamily: "DM Mono, monospace" }}>
      <style>{KEYFRAMES}</style>

      {/* ─── HERO ─── */}
      <div style={{ marginBottom: 36, animation: "fade-in 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: -0.5 }}>
              <span style={{ color: CSS_VARS.gold }}>Voice</span> Commander
            </h1>
            <p style={{ fontFamily: "DM Mono, monospace", fontSize: 13, color: CSS_VARS.muted, margin: 0 }}>
              Control your entire AI workspace with natural speech commands
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge label="94% Accuracy" color={CSS_VARS.teal} />
            <Badge label="12ms Latency" color={CSS_VARS.gold} />
            <Badge label="200+ Commands" color={CSS_VARS.purple} />
          </div>
        </div>
        <div style={{ marginTop: 16, height: 1, background: `linear-gradient(90deg, ${CSS_VARS.gold}60, transparent)` }} />
      </div>

      {/* ─── VOICE VISUALIZER ─── */}
      <VoiceVisualizer
        listening={listening}
        processing={processing}
        onToggle={toggleListening}
        transcript={transcript}
      />

      {/* ─── TWO-COLUMN LAYOUT ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <CommandHistory history={history} onReplay={replayCommand} />
          <VoiceProfiles showToast={showToast} />
          <SmartMacros showToast={showToast} />
          <NoiseQualityMonitor showToast={showToast} />
        </div>
        <div>
          <CommandLibrary onExecute={executeLibraryCommand} />
          <LanguageSettings showToast={showToast} />
          <AccuracyAnalytics />
          <IntegrationActions showToast={showToast} />
        </div>
      </div>

      {/* ─── TOAST ─── */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
