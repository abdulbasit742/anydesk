import { useState, useEffect } from "react";

/* ─────────────────────────── CSS VARS ─────────────────────────── */
const V = {
  gold:    "#f5b731",
  teal:    "#22d3ee",
  purple:  "#a78bfa",
  surface: "#0e0e16",
  surface2:"#16161e",
  surface3:"#1d1d28",
  border:  "rgba(255,255,255,0.07)",
  muted:   "#6e7191",
  red:     "#ef4444",
  green:   "#22c55e",
  text:    "#e2e8f0",
};

/* ─────────────────────────── SHARED STYLES ─────────────────────── */
const card = (extra = {}) => ({
  background: V.surface2,
  border: `1px solid ${V.border}`,
  borderRadius: 14,
  padding: "24px",
  ...extra,
});

const sectionTitle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  color: V.text,
  marginBottom: 6,
  letterSpacing: "-0.3px",
};

const sectionSub = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 12,
  color: V.muted,
  marginBottom: 20,
};

const btn = (color = V.gold, extra = {}) => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: 12,
  fontWeight: 600,
  color: V.surface,
  background: color,
  border: "none",
  borderRadius: 8,
  padding: "9px 18px",
  cursor: "pointer",
  letterSpacing: "0.5px",
  transition: "opacity 0.15s",
  ...extra,
});

const ghostBtn = (color = V.gold, extra = {}) => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  color: color,
  background: "transparent",
  border: `1px solid ${color}`,
  borderRadius: 7,
  padding: "6px 14px",
  cursor: "pointer",
  letterSpacing: "0.4px",
  transition: "background 0.15s",
  ...extra,
});

const Toggle = ({ on, onChange }) => (
  <div
    onClick={() => onChange(!on)}
    style={{
      width: 40, height: 22, borderRadius: 11,
      background: on ? V.teal : V.surface3,
      border: `1px solid ${on ? V.teal : V.border}`,
      cursor: "pointer",
      position: "relative",
      transition: "background 0.2s",
      flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute",
      top: 2, left: on ? 20 : 2,
      width: 16, height: 16,
      borderRadius: "50%",
      background: on ? V.surface : V.muted,
      transition: "left 0.2s",
    }} />
  </div>
);

const Slider = ({ min, max, step = 1, value, onChange, color = V.teal, label, unit = "" }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: V.muted }}>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: color, fontWeight: 700 }}>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: color, cursor: "pointer" }}
    />
  </div>
);

/* ─────────────────────────── DATA ──────────────────────────────── */
const THEMES = [
  { id: "midnight-gold",  name: "Midnight Gold",  swatches: ["#0e0e16","#f5b731","#22d3ee","#a78bfa","#16161e"] },
  { id: "arctic-blue",    name: "Arctic Blue",    swatches: ["#0a1628","#38bdf8","#e2e8f0","#0ea5e9","#0f172a"] },
  { id: "crimson-dark",   name: "Crimson Dark",   swatches: ["#110a0a","#ef4444","#fca5a5","#7f1d1d","#1c0606"] },
  { id: "matrix-green",   name: "Matrix Green",   swatches: ["#050f05","#22c55e","#86efac","#15803d","#0a1a0a"] },
  { id: "purple-haze",    name: "Purple Haze",    swatches: ["#0d0a1a","#a78bfa","#c4b5fd","#7c3aed","#1a1028"] },
  { id: "solar-orange",   name: "Solar Orange",   swatches: ["#120a00","#f97316","#fed7aa","#c2410c","#1c0f00"] },
  { id: "cyber-pink",     name: "Cyber Pink",     swatches: ["#0f0010","#ec4899","#f9a8d4","#be185d","#1a0020"] },
  { id: "ghost-white",    name: "Ghost White",    swatches: ["#f0f0f5","#1e1e2e","#6e7191","#e2e8f0","#d0d0e0"] },
];

const LAYOUTS = [
  { id: "default",   name: "Default",   desc: "Sidebar + main content" },
  { id: "compact",   name: "Compact",   desc: "Narrow sidebar, dense UI" },
  { id: "wide",      name: "Wide",      desc: "Full-width content area" },
  { id: "focus",     name: "Focus",     desc: "Centered, minimal chrome" },
  { id: "analytics", name: "Analytics", desc: "Multi-panel dashboard" },
  { id: "minimal",   name: "Minimal",   desc: "Just the essentials" },
];

const WIDGETS = [
  { id: "ticker",    name: "Live Ticker",       desc: "Real-time data stream indicator" },
  { id: "autopilot", name: "Autopilot Status",  desc: "Shows AI autopilot state" },
  { id: "credit",    name: "Credit Gauge",      desc: "Remaining credits display" },
  { id: "broadcast", name: "Broadcast Counter", desc: "Message broadcast stats" },
  { id: "response",  name: "Response Time",     desc: "Avg latency in ms" },
  { id: "agentq",    name: "Agent Queue",        desc: "Queued agent task count" },
  { id: "sessions",  name: "Active Sessions",   desc: "Live user session count" },
  { id: "tokens",    name: "Token Meter",        desc: "Token usage this period" },
  { id: "costalert", name: "Cost Alert",         desc: "Budget threshold monitor" },
  { id: "uptime",    name: "Uptime Badge",       desc: "Service uptime percentage" },
  { id: "ping",      name: "Ping Monitor",       desc: "API endpoint latency" },
  { id: "notif",     name: "Notif Bell",         desc: "Notification center bell" },
  { id: "quick",     name: "Quick Actions",      desc: "Pinned shortcut buttons" },
  { id: "recent",    name: "Recent Activity",    desc: "Last N events feed" },
  { id: "minichart", name: "Mini Chart",         desc: "Sparkline metric chart" },
  { id: "weather",   name: "Weather API",        desc: "Local weather display" },
];

const FONTS = [
  { id: "Syne",              name: "Syne",            category: "Display" },
  { id: "Inter",             name: "Inter",           category: "Sans-Serif" },
  { id: "'JetBrains Mono'",  name: "JetBrains Mono",  category: "Monospace" },
  { id: "'DM Mono'",         name: "DM Mono",         category: "Monospace" },
  { id: "Outfit",            name: "Outfit",          category: "Sans-Serif" },
  { id: "'Space Grotesk'",   name: "Space Grotesk",   category: "Grotesque" },
  { id: "Rajdhani",          name: "Rajdhani",        category: "Display" },
  { id: "Audiowide",         name: "Audiowide",       category: "Futuristic" },
];

const SHORTCUTS = [
  { id: 1, action: "Open Command Palette",   keys: "Ctrl+K" },
  { id: 2, action: "New Agent Session",      keys: "Ctrl+N" },
  { id: 3, action: "Toggle Sidebar",         keys: "Ctrl+B" },
  { id: 4, action: "Search Everywhere",      keys: "Ctrl+Shift+F" },
  { id: 5, action: "Quick Deploy",           keys: "Ctrl+D" },
  { id: 6, action: "Open Settings",          keys: "Ctrl+," },
  { id: 7, action: "Toggle Theme",           keys: "Ctrl+Alt+T" },
  { id: 8, action: "Close Tab",              keys: "Ctrl+W" },
  { id: 9, action: "Undo",                   keys: "Ctrl+Z" },
  { id: 10, action: "Save All",              keys: "Ctrl+Shift+S" },
  { id: 11, action: "Broadcast Message",     keys: "Ctrl+Shift+B" },
  { id: 12, action: "Export Config",         keys: "Ctrl+E" },
];

const EXTENSIONS = [
  { id: "pomodoro", name: "Pomodoro Timer",    desc: "Stay focused with timed work blocks and breaks.", color: ["#f97316","#fbbf24"] },
  { id: "whiteboard",name:"Whiteboard Canvas", desc: "Freeform drawing and diagram workspace.",          color: ["#22d3ee","#38bdf8"] },
  { id: "imgpreview",name:"AI Image Preview",  desc: "Inline AI-generated image thumbnails.",            color: ["#a78bfa","#c084fc"] },
  { id: "diffviewer",name:"Diff Viewer Pro",   desc: "Side-by-side code diff with syntax coloring.",     color: ["#22c55e","#86efac"] },
  { id: "voice",     name:"Voice Commands",    desc: "Speak to control your studio hands-free.",          color: ["#ec4899","#f9a8d4"] },
  { id: "ar",        name:"AR Overlay",        desc: "Augmented reality data overlay (experimental).",   color: ["#ef4444","#fca5a5"] },
];

/* ─────────────────────────── SVG LAYOUT THUMBNAILS ─────────────── */
const LayoutSVG = ({ id }) => {
  const map = {
    default:   <><rect x="0" y="0" width="18" height="40" fill="#22d3ee" opacity=".7" rx="2"/><rect x="20" y="0" width="44" height="40" fill="#f5b731" opacity=".3" rx="2"/></>,
    compact:   <><rect x="0" y="0" width="12" height="40" fill="#22d3ee" opacity=".7" rx="2"/><rect x="14" y="0" width="50" height="40" fill="#f5b731" opacity=".3" rx="2"/></>,
    wide:      <><rect x="0" y="0" width="64" height="40" fill="#f5b731" opacity=".3" rx="2"/></>,
    focus:     <><rect x="10" y="0" width="44" height="40" fill="#a78bfa" opacity=".4" rx="2"/></>,
    analytics: <><rect x="0" y="0" width="18" height="40" fill="#22d3ee" opacity=".7" rx="2"/><rect x="20" y="0" width="44" height="18" fill="#f5b731" opacity=".3" rx="2"/><rect x="20" y="22" width="20" height="18" fill="#a78bfa" opacity=".3" rx="2"/><rect x="44" y="22" width="20" height="18" fill="#22c55e" opacity=".3" rx="2"/></>,
    minimal:   <><rect x="6" y="6" width="52" height="28" fill="#6e7191" opacity=".2" rx="2"/></>,
  };
  return (
    <svg viewBox="0 0 64 40" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="64" height="40" fill={V.surface3} rx="3"/>
      {map[id]}
    </svg>
  );
};

/* ─────────────────────────── MAIN COMPONENT ────────────────────── */
export default function UiExtensions() {
  /* theme */
  const [activeTheme, setActiveTheme] = useState("midnight-gold");
  const [showColorForm, setShowColorForm] = useState(false);
  const [customColors, setCustomColors] = useState({ primary: "#f5b731", accent: "#22d3ee", bg: "#0e0e16" });

  /* layout */
  const [activeLayout, setActiveLayout] = useState("default");
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [contentPadding, setContentPadding] = useState(24);
  const [fontSize, setFontSize] = useState(14);

  /* widgets */
  const [widgets, setWidgets] = useState(() => {
    const init = {};
    WIDGETS.forEach(w => { init[w.id] = ["ticker","autopilot","credit","sessions","tokens","uptime","notif","quick"].includes(w.id); });
    return init;
  });

  /* animation */
  const [transSpeed, setTransSpeed] = useState(0.25);
  const [animToggles, setAnimToggles] = useState({
    pageTransitions: true, hoverEffects: true, loadingSpinners: true, soundEffects: false, confetti: true,
  });
  const [demoPlaying, setDemoPlaying] = useState(false);

  /* font */
  const [activeFont, setActiveFont] = useState("'DM Mono'");
  const [fontWeight, setFontWeight] = useState(400);
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog.");

  /* shortcuts */
  const [shortcuts, setShortcuts] = useState(SHORTCUTS.map(s => ({ ...s })));
  const [recording, setRecording] = useState(null);
  const [shortcutsSavedMsg, setShortcutsSavedMsg] = useState(false);

  /* density */
  const [density, setDensity] = useState("normal");
  const [borderRadius, setBorderRadius] = useState(14);
  const [borderOpacity, setBorderOpacity] = useState(7);

  /* extensions */
  const [notified, setNotified] = useState({});

  /* export/import */
  const [exportJson, setExportJson] = useState("");
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  /* ── animation demo ── */
  const playDemo = () => {
    setDemoPlaying(true);
    setTimeout(() => setDemoPlaying(false), 1800);
  };

  /* ── keyboard shortcut recording ── */
  useEffect(() => {
    if (recording === null) return;
    const handler = (e) => {
      e.preventDefault();
      const parts = [];
      if (e.ctrlKey)  parts.push("Ctrl");
      if (e.shiftKey) parts.push("Shift");
      if (e.altKey)   parts.push("Alt");
      if (e.metaKey)  parts.push("Meta");
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (!["Control","Shift","Alt","Meta"].includes(e.key)) parts.push(key);
      if (parts.length) {
        setShortcuts(prev => prev.map(s => s.id === recording ? { ...s, keys: parts.join("+") } : s));
        setRecording(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [recording]);

  /* ── export config ── */
  const handleExport = () => {
    const config = { activeTheme, customColors, activeLayout, sidebarWidth, contentPadding, fontSize, widgets, transSpeed, animToggles, activeFont, fontWeight, density, borderRadius, borderOpacity, shortcuts };
    setExportJson(JSON.stringify(config, null, 2));
  };

  /* ── import config ── */
  const handleImport = () => {
    try {
      const config = JSON.parse(importJson);
      if (config.activeTheme)     setActiveTheme(config.activeTheme);
      if (config.activeLayout)    setActiveLayout(config.activeLayout);
      if (config.sidebarWidth)    setSidebarWidth(config.sidebarWidth);
      if (config.contentPadding)  setContentPadding(config.contentPadding);
      if (config.fontSize)        setFontSize(config.fontSize);
      if (config.widgets)         setWidgets(config.widgets);
      if (config.transSpeed)      setTransSpeed(config.transSpeed);
      if (config.animToggles)     setAnimToggles(config.animToggles);
      if (config.activeFont)      setActiveFont(config.activeFont);
      if (config.fontWeight)      setFontWeight(config.fontWeight);
      if (config.density)         setDensity(config.density);
      if (config.borderRadius)    setBorderRadius(config.borderRadius);
      if (config.borderOpacity)   setBorderOpacity(config.borderOpacity);
      setImportError("");
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2500);
    } catch {
      setImportError("Invalid JSON — check your config and try again.");
    }
  };

  const handleReset = () => {
    setActiveTheme("midnight-gold");
    setActiveLayout("default");
    setSidebarWidth(240);
    setContentPadding(24);
    setFontSize(14);
    setTransSpeed(0.25);
    setAnimToggles({ pageTransitions: true, hoverEffects: true, loadingSpinners: true, soundEffects: false, confetti: true });
    setActiveFont("'DM Mono'");
    setFontWeight(400);
    setDensity("normal");
    setBorderRadius(14);
    setBorderOpacity(7);
    setShortcuts(SHORTCUTS.map(s => ({ ...s })));
    setShowResetModal(false);
  };

  const activeWidgetCount = Object.values(widgets).filter(Boolean).length;

  /* ── density padding map ── */
  const densityPad = { compact: 12, normal: 20, comfortable: 28 }[density];

  /* ─────────────────────────── RENDER ──────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: V.surface, fontFamily: "'DM Mono', monospace", color: V.text, paddingBottom: 80 }}>

      {/* ═══════════════ HERO HEADER ═══════════════ */}
      <div style={{
        background: `linear-gradient(135deg, #0e0e16 0%, #1a1030 40%, #0c1a22 100%)`,
        borderBottom: `1px solid ${V.border}`,
        padding: "48px 40px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow orbs */}
        <div style={{ position:"absolute", top:-80, right:80, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${V.gold}18 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:200, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${V.teal}12 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:20, left:400, width:150, height:150, borderRadius:"50%", background:`radial-gradient(circle, ${V.purple}10 0%, transparent 70%)`, pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <div style={{ fontSize:28 }}>🎨</div>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:36, fontWeight:800, margin:0, background:`linear-gradient(90deg, ${V.gold}, ${V.teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              UI Extensions
            </h1>
          </div>
          <p style={{ color: V.muted, fontSize:14, margin:"0 0 28px", fontFamily:"'DM Mono', monospace", letterSpacing:"0.3px" }}>
            Customize every pixel of your studio experience
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { label:"Extensions Active", val:"18", color: V.teal },
              { label:"Themes",            val:"6",  color: V.gold },
              { label:"Widgets",           val:"34", color: V.purple },
            ].map(b => (
              <div key={b.label} style={{ background: V.surface2, border:`1px solid ${V.border}`, borderRadius:10, padding:"10px 18px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:800, color:b.color }}>{b.val}</span>
                <span style={{ fontSize:11, color:V.muted }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div style={{ padding:"32px 40px", display:"flex", flexDirection:"column", gap:40, maxWidth:1400, margin:"0 auto" }}>

        {/* ═══════════════ THEME SELECTOR ═══════════════ */}
        <section>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
            <div>
              <div style={sectionTitle}>🎨 Theme Selector</div>
              <div style={sectionSub}>Click a theme to activate it across your studio</div>
            </div>
            <button style={btn(V.purple)} onClick={() => setShowColorForm(v => !v)}>
              ✦ Create Custom Theme
            </button>
          </div>

          {showColorForm && (
            <div style={{ ...card(), marginBottom:20, display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:12, color:V.muted }}>Custom Colors:</span>
              {Object.entries(customColors).map(([k, v]) => (
                <label key={k} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:V.muted }}>
                  {k}
                  <input type="color" value={v} onChange={e => setCustomColors(prev => ({ ...prev, [k]: e.target.value }))}
                    style={{ width:36, height:28, borderRadius:6, border:`1px solid ${V.border}`, background:"transparent", cursor:"pointer" }}
                  />
                </label>
              ))}
              <button style={btn(V.gold, { marginLeft:"auto" })} onClick={() => setShowColorForm(false)}>Apply Custom</button>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:14 }}>
            {THEMES.map(t => (
              <div
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                style={{
                  ...card({ padding:"18px", cursor:"pointer", position:"relative", overflow:"hidden" }),
                  border: activeTheme === t.id ? `2px solid ${V.gold}` : `1px solid ${V.border}`,
                  boxShadow: activeTheme === t.id ? `0 0 20px ${V.gold}30` : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              >
                {activeTheme === t.id && (
                  <div style={{ position:"absolute", top:8, right:8, width:18, height:18, borderRadius:"50%", background:V.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:V.surface, fontWeight:700 }}>✓</div>
                )}
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {t.swatches.map((s, i) => (
                    <div key={i} style={{ width:20, height:20, borderRadius:"50%", background:s, border:`1px solid rgba(255,255,255,0.1)` }} />
                  ))}
                </div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:700, color: activeTheme === t.id ? V.gold : V.text }}>{t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ LAYOUT CONFIGURATOR ═══════════════ */}
        <section>
          <div style={sectionTitle}>⚙ Layout Configurator</div>
          <div style={sectionSub}>Choose a preset and fine-tune your workspace geometry</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* layout grid */}
            <div style={card()}>
              <div style={{ marginBottom:12, fontSize:11, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Presets</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
                {LAYOUTS.map(l => (
                  <div
                    key={l.id}
                    onClick={() => setActiveLayout(l.id)}
                    style={{
                      cursor:"pointer",
                      borderRadius:9,
                      border: activeLayout === l.id ? `2px solid ${V.gold}` : `1px solid ${V.border}`,
                      overflow:"hidden",
                      boxShadow: activeLayout === l.id ? `0 0 12px ${V.gold}30` : "none",
                    }}
                  >
                    <div style={{ height:58, padding:4 }}><LayoutSVG id={l.id} /></div>
                    <div style={{ padding:"6px 8px", background:V.surface3 }}>
                      <div style={{ fontSize:11, fontWeight:700, color: activeLayout === l.id ? V.gold : V.text }}>{l.name}</div>
                      <div style={{ fontSize:9, color:V.muted, marginTop:1 }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* sliders */}
            <div style={card()}>
              <div style={{ marginBottom:12, fontSize:11, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Fine-Tune</div>
              <Slider min={200} max={340} value={sidebarWidth} onChange={setSidebarWidth} color={V.teal}    label="Sidebar Width"    unit="px" />
              <Slider min={12}  max={40}  value={contentPadding} onChange={setContentPadding} color={V.gold} label="Content Padding" unit="px" />
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:V.muted, marginBottom:8 }}>Font Size</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[12,13,14,15].map(s => (
                    <button key={s} onClick={() => setFontSize(s)} style={{
                      ...ghostBtn(fontSize === s ? V.gold : V.muted),
                      fontWeight: fontSize === s ? 700 : 400,
                      background: fontSize === s ? `${V.gold}18` : "transparent",
                    }}>{s}px</button>
                  ))}
                </div>
              </div>
              <button style={btn(V.teal)}>Apply Layout</button>
            </div>
          </div>
        </section>

        {/* ═══════════════ WIDGET MANAGER ═══════════════ */}
        <section>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:4 }}>
            <div>
              <div style={sectionTitle}>📦 Widget Manager</div>
              <div style={sectionSub}>Toggle dashboard widgets on or off</div>
            </div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:12, color:V.teal, background:`${V.teal}15`, border:`1px solid ${V.teal}40`, borderRadius:8, padding:"6px 14px" }}>
              {activeWidgetCount} / {WIDGETS.length} active
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:10 }}>
            {WIDGETS.map(w => (
              <div key={w.id} style={{
                ...card({ padding:"14px 16px" }),
                display:"flex", alignItems:"center", gap:12,
                border: widgets[w.id] ? `1px solid ${V.teal}40` : `1px solid ${V.border}`,
                transition:"border 0.2s",
              }}>
                <span style={{ color:V.muted, fontSize:14, cursor:"grab", flexShrink:0 }} title="Drag handle">⠿</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color: widgets[w.id] ? V.text : V.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{w.name}</div>
                  <div style={{ fontSize:10, color:V.muted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{w.desc}</div>
                </div>
                <Toggle on={widgets[w.id]} onChange={val => setWidgets(prev => ({ ...prev, [w.id]: val }))} />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ ANIMATION SETTINGS ═══════════════ */}
        <section>
          <div style={sectionTitle}>✨ Animation Settings</div>
          <div style={sectionSub}>Control motion and interactivity throughout the studio</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={card()}>
              <Slider min={0.1} max={0.5} step={0.05} value={transSpeed} onChange={setTransSpeed} color={V.purple} label="Transition Speed" unit="s" />
              {Object.entries(animToggles).map(([k, v]) => {
                const labels = { pageTransitions:"Page Transitions", hoverEffects:"Hover Effects", loadingSpinners:"Loading Spinners", soundEffects:"Sound Effects", confetti:"Confetti on Success" };
                return (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${V.border}` }}>
                    <span style={{ fontSize:12, color:V.text }}>{labels[k]}</span>
                    <Toggle on={v} onChange={val => setAnimToggles(prev => ({ ...prev, [k]: val }))} />
                  </div>
                );
              })}
            </div>

            {/* preview demo */}
            <div style={card({ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 })}>
              <div style={{ fontSize:12, color:V.muted, letterSpacing:"0.5px", textTransform:"uppercase", fontWeight:700 }}>Animation Preview</div>
              <div style={{
                width:80, height:80, borderRadius:"50%",
                background:`conic-gradient(${V.gold}, ${V.teal}, ${V.purple}, ${V.gold})`,
                animation: demoPlaying ? `spin ${transSpeed * 4}s linear` : "none",
                boxShadow: demoPlaying ? `0 0 30px ${V.gold}60` : "none",
                transition:"box-shadow 0.3s",
              }} />
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
              <div style={{
                width:120, height:6, borderRadius:3, background:V.surface3, overflow:"hidden",
                position:"relative",
              }}>
                {demoPlaying && (
                  <div style={{
                    position:"absolute", top:0, left:0, height:"100%",
                    background:`linear-gradient(90deg, ${V.teal}, ${V.gold})`,
                    animation:`progress ${transSpeed * 8}s ease-in-out`,
                    borderRadius:3,
                  }} />
                )}
              </div>
              <style>{`@keyframes progress { from{width:0%} to{width:100%} }`}</style>
              <button
                style={btn(demoPlaying ? V.muted : V.gold)}
                onClick={playDemo}
                disabled={demoPlaying}
              >
                {demoPlaying ? "Playing…" : "▶ Preview Animation"}
              </button>
              <div style={{ fontSize:10, color:V.muted, textAlign:"center" }}>
                Speed: <span style={{ color:V.purple }}>{transSpeed}s</span> &nbsp;|&nbsp; {animToggles.pageTransitions ? "Transitions ON" : "Transitions OFF"}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FONT SELECTOR ═══════════════ */}
        <section>
          <div style={sectionTitle}>Aa Font Selector</div>
          <div style={sectionSub}>Pick a typeface — preview updates instantly</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {FONTS.map(f => (
                <div
                  key={f.id}
                  onClick={() => setActiveFont(f.id)}
                  style={{
                    ...card({ padding:"14px 16px", cursor:"pointer" }),
                    border: activeFont === f.id ? `2px solid ${V.gold}` : `1px solid ${V.border}`,
                    boxShadow: activeFont === f.id ? `0 0 14px ${V.gold}25` : "none",
                    transition:"border 0.2s",
                  }}
                >
                  <div style={{ fontFamily:f.id, fontSize:18, fontWeight:700, color: activeFont === f.id ? V.gold : V.text, marginBottom:4 }}>Ag</div>
                  <div style={{ fontSize:11, fontWeight:700, color: activeFont === f.id ? V.gold : V.text }}>{f.name}</div>
                  <div style={{ fontSize:9, color:V.muted }}>{f.category}</div>
                </div>
              ))}
            </div>

            <div style={card({ display:"flex", flexDirection:"column", gap:18 })}>
              <div style={{ fontSize:11, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Live Preview</div>
              <div style={{
                background:V.surface3, borderRadius:10, padding:20,
                fontFamily:activeFont, fontSize:fontSize, fontWeight:fontWeight,
                color:V.text, lineHeight:1.7, minHeight:80,
                border:`1px solid ${V.border}`,
              }}>{previewText}</div>
              <textarea
                value={previewText}
                onChange={e => setPreviewText(e.target.value)}
                rows={2}
                placeholder="Type preview text…"
                style={{
                  background:V.surface3, border:`1px solid ${V.border}`, borderRadius:8,
                  color:V.text, fontFamily:"'DM Mono', monospace", fontSize:12,
                  padding:"10px 12px", resize:"vertical",
                }}
              />
              <div>
                <div style={{ fontSize:11, color:V.muted, marginBottom:8 }}>Font Weight</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[300,400,500,600,700,800].map(w => (
                    <button key={w} onClick={() => setFontWeight(w)} style={{
                      ...ghostBtn(fontWeight === w ? V.gold : V.muted),
                      background: fontWeight === w ? `${V.gold}15` : "transparent",
                      fontWeight: fontWeight === w ? 700 : 400,
                    }}>{w}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ KEYBOARD SHORTCUT EDITOR ═══════════════ */}
        <section>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:4 }}>
            <div>
              <div style={sectionTitle}>⌨ Keyboard Shortcut Editor</div>
              <div style={sectionSub}>Click Record then press your desired key combo</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {shortcutsSavedMsg && <span style={{ fontSize:11, color:V.green, alignSelf:"center" }}>✓ Saved!</span>}
              <button style={btn(V.gold)} onClick={() => { setShortcutsSavedMsg(true); setTimeout(() => setShortcutsSavedMsg(false), 2000); }}>
                Save Changes
              </button>
            </div>
          </div>
          <div style={card({ padding:0, overflow:"hidden" })}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:V.surface3 }}>
                  {["Action","Shortcut",""].map((h, i) => (
                    <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", borderBottom:`1px solid ${V.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shortcuts.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom:`1px solid ${V.border}`, background: idx % 2 === 0 ? "transparent" : `${V.surface3}50` }}>
                    <td style={{ padding:"12px 16px", fontSize:12, color:V.text }}>{s.action}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{
                        display:"inline-flex", gap:4, padding:"4px 10px",
                        background: recording === s.id ? `${V.gold}18` : V.surface3,
                        borderRadius:6, border:`1px solid ${recording === s.id ? V.gold : V.border}`,
                        animation: recording === s.id ? "pulse 0.8s infinite" : "none",
                      }}>
                        {s.keys.split("+").map((k, i) => (
                          <span key={i}>
                            <kbd style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color: recording === s.id ? V.gold : V.teal }}>{k}</kbd>
                            {i < s.keys.split("+").length - 1 && <span style={{ color:V.muted, margin:"0 2px" }}>+</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <button
                        onClick={() => setRecording(recording === s.id ? null : s.id)}
                        style={ghostBtn(recording === s.id ? V.gold : V.muted, { fontSize:10 })}
                      >
                        {recording === s.id ? "● Recording…" : "Record"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 ${V.gold}40} 50%{box-shadow:0 0 0 4px ${V.gold}20} }`}</style>
        </section>

        {/* ═══════════════ DENSITY CONTROLS ═══════════════ */}
        <section>
          <div style={sectionTitle}>📐 Density Controls</div>
          <div style={sectionSub}>Adjust UI density and spatial comfort</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={card()}>
              <div style={{ fontSize:11, color:V.muted, marginBottom:12, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Interface Density</div>
              <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                {["compact","normal","comfortable"].map(d => (
                  <button key={d} onClick={() => setDensity(d)} style={{
                    flex:1, padding:"12px 0", borderRadius:9, cursor:"pointer",
                    fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:12,
                    border: density === d ? `2px solid ${V.gold}` : `1px solid ${V.border}`,
                    background: density === d ? `${V.gold}15` : V.surface3,
                    color: density === d ? V.gold : V.muted,
                    textTransform:"capitalize",
                    transition:"all 0.2s",
                    boxShadow: density === d ? `0 0 12px ${V.gold}20` : "none",
                  }}>{d}</button>
                ))}
              </div>
              <div style={{ background:V.surface3, borderRadius:9, padding:`${densityPad}px`, border:`1px solid ${V.border}`, fontSize:11, color:V.muted, transition:"padding 0.3s" }}>
                Preview: Padding = <span style={{ color:V.gold }}>{densityPad}px</span> — {density} mode
              </div>
            </div>

            <div style={card()}>
              <Slider min={4} max={24} value={borderRadius} onChange={setBorderRadius} color={V.purple} label="Card Border Radius" unit="px" />
              <Slider min={1} max={20} value={borderOpacity} onChange={setBorderOpacity} color={V.teal}   label="Border Opacity"    unit="%" />
              <div style={{
                marginTop:8, borderRadius:borderRadius, border:`1px solid rgba(255,255,255,${borderOpacity/100})`,
                background:V.surface3, padding:"16px", fontSize:11, color:V.muted, textAlign:"center",
                transition:"all 0.2s",
              }}>
                Live border preview
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ EXTENSION STORE PREVIEW ═══════════════ */}
        <section>
          <div style={sectionTitle}>🛒 Extension Store</div>
          <div style={sectionSub}>Coming soon — next-gen studio add-ons</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
            {EXTENSIONS.map(ext => (
              <div key={ext.id} style={{ ...card({ padding:0, overflow:"hidden" }) }}>
                {/* gradient preview */}
                <div style={{
                  height:100,
                  background:`linear-gradient(135deg, ${ext.color[0]}, ${ext.color[1]})`,
                  position:"relative",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <div style={{ position:"absolute", top:8, right:10, background:"rgba(0,0,0,0.45)", borderRadius:20, padding:"3px 10px", fontSize:9, color:"rgba(255,255,255,0.8)", fontWeight:700, letterSpacing:"0.5px" }}>COMING SOON</div>
                  <div style={{ fontSize:32, filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}>
                    {["⏱","🖼","🖼","📋","🎙","🥽"][EXTENSIONS.indexOf(ext)]}
                  </div>
                </div>
                <div style={{ padding:"16px" }}>
                  <div style={{ fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:700, marginBottom:4 }}>{ext.name}</div>
                  <div style={{ fontSize:11, color:V.muted, lineHeight:1.5, marginBottom:14 }}>{ext.desc}</div>
                  <button
                    onClick={() => setNotified(prev => ({ ...prev, [ext.id]: true }))}
                    style={notified[ext.id] ? btn(V.green, { width:"100%" }) : ghostBtn(ext.color[0], { width:"100%", display:"block", textAlign:"center" })}
                  >
                    {notified[ext.id] ? "✓ You'll be notified" : "🔔 Notify Me"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ EXPORT / IMPORT ═══════════════ */}
        <section>
          <div style={sectionTitle}>📤 Export / Import Theme Config</div>
          <div style={sectionSub}>Save your studio settings as JSON or load a saved config</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* export */}
            <div style={card()}>
              <div style={{ fontSize:11, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Export Config</div>
              <button style={btn(V.gold, { marginBottom:14, width:"100%" })} onClick={handleExport}>
                📥 Generate Config JSON
              </button>
              {exportJson && (
                <textarea
                  readOnly
                  value={exportJson}
                  rows={10}
                  style={{
                    width:"100%", boxSizing:"border-box", background:V.surface3,
                    border:`1px solid ${V.border}`, borderRadius:8, color:V.teal,
                    fontFamily:"'DM Mono', monospace", fontSize:11, padding:"12px",
                    resize:"vertical",
                  }}
                />
              )}
            </div>

            {/* import */}
            <div style={card()}>
              <div style={{ fontSize:11, color:V.muted, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Import Config</div>
              <textarea
                value={importJson}
                onChange={e => { setImportJson(e.target.value); setImportError(""); }}
                placeholder='Paste your JSON config here…'
                rows={8}
                style={{
                  width:"100%", boxSizing:"border-box", background:V.surface3,
                  border:`1px solid ${importError ? V.red : V.border}`, borderRadius:8,
                  color:V.text, fontFamily:"'DM Mono', monospace", fontSize:11,
                  padding:"12px", resize:"vertical", marginBottom:10,
                }}
              />
              {importError && <div style={{ fontSize:11, color:V.red, marginBottom:8 }}>⚠ {importError}</div>}
              {importSuccess && <div style={{ fontSize:11, color:V.green, marginBottom:8 }}>✓ Config imported successfully!</div>}
              <div style={{ display:"flex", gap:10 }}>
                <button style={btn(V.teal, { flex:1 })} onClick={handleImport}>Import</button>
                <button style={ghostBtn(V.red, { flex:1, textAlign:"center" })} onClick={() => setShowResetModal(true)}>Reset to Defaults</button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ═══════════════ RESET CONFIRMATION MODAL ═══════════════ */}
      {showResetModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center",
          backdropFilter:"blur(6px)",
        }} onClick={() => setShowResetModal(false)}>
          <div
            style={{ ...card({ padding:36, maxWidth:400, width:"90%", position:"relative" }), boxShadow:`0 0 60px rgba(0,0,0,0.6)` }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize:32, marginBottom:12, textAlign:"center" }}>⚠️</div>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:800, color:V.text, textAlign:"center", marginBottom:8 }}>Reset to Defaults?</div>
            <div style={{ fontSize:12, color:V.muted, textAlign:"center", lineHeight:1.6, marginBottom:24 }}>
              All theme, layout, font, widget, and shortcut customizations will be lost. This action cannot be undone.
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button style={ghostBtn(V.muted, { flex:1, textAlign:"center", padding:"10px 0" })} onClick={() => setShowResetModal(false)}>Cancel</button>
              <button style={btn(V.red, { flex:1, color:"#fff" })} onClick={handleReset}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
