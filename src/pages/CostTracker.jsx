import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCY_RATES = { USD: 1, EUR: 0.92, GBP: 0.79, PKR: 278 };
const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", PKR: "₨" };

const MODELS = [
  { id: "gpt4o",       name: "GPT-4o",             lab: "OpenAI",    ppm: 5.00 },
  { id: "gpt4turbo",   name: "GPT-4 Turbo",         lab: "OpenAI",    ppm: 10.00 },
  { id: "gpt35",       name: "GPT-3.5 Turbo",       lab: "OpenAI",    ppm: 0.50 },
  { id: "claude35s",   name: "Claude 3.5 Sonnet",   lab: "Anthropic", ppm: 3.00 },
  { id: "claude3opus", name: "Claude 3 Opus",       lab: "Anthropic", ppm: 15.00 },
  { id: "claudeinst",  name: "Claude Instant",      lab: "Anthropic", ppm: 0.80 },
  { id: "gemini15pro", name: "Gemini 1.5 Pro",      lab: "Google",    ppm: 3.50 },
  { id: "geminiflash", name: "Gemini Flash",        lab: "Google",    ppm: 0.35 },
  { id: "mistralL",    name: "Mistral Large",       lab: "Mistral",   ppm: 8.00 },
  { id: "mistral7b",   name: "Mistral 7B",          lab: "Mistral",   ppm: 0.25 },
];

const TASK_TYPES = [
  { id: "chat",        label: "General Chat / Q&A" },
  { id: "summarize",   label: "Summarization" },
  { id: "code",        label: "Code Generation" },
  { id: "analysis",    label: "Data Analysis" },
  { id: "creative",    label: "Creative Writing" },
  { id: "embedding",   label: "Embeddings / Classification" },
];

const LABS = ["OpenAI", "Anthropic", "Google", "Mistral", "Cohere"];

const TODAY = new Date();
const DAYS_IN_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
const DAY_OF_MONTH = TODAY.getDate();

// ─── Mock history data ────────────────────────────────────────────────────────

function buildMockRows() {
  const rows = [];
  const modelsForHistory = MODELS.slice();
  for (let i = 0; i < 20; i++) {
    const d = new Date(TODAY);
    d.setDate(Math.max(1, DAY_OF_MONTH - i * 1.2));
    const model = modelsForHistory[i % modelsForHistory.length];
    const tokens = Math.floor(Math.random() * 90000) + 1000;
    const cost = parseFloat(((tokens / 1_000_000) * model.ppm).toFixed(4));
    rows.push({
      id: i,
      date: d.toISOString().split("T")[0],
      lab: model.lab,
      model: model.name,
      tokens,
      cost,
      ppm: model.ppm,
    });
  }
  return rows;
}

const MOCK_ROWS = buildMockRows();

// ─── Colour helpers ───────────────────────────────────────────────────────────

function pctColor(pct) {
  if (pct < 60) return "#22c55e";
  if (pct < 85) return "#f59e0b";
  return "#ef4444";
}

function labColor(lab) {
  const map = {
    OpenAI: "#10a37f",
    Anthropic: "#d97706",
    Google: "#3b82f6",
    Mistral: "#8b5cf6",
    Cohere: "#ec4899",
  };
  return map[lab] || "#94a3b8";
}

// ─── Inline style tokens ──────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e2e8f0",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    margin: "0 0 4px 0",
    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subheading: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 28px 0",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },
  card: {
    background: "#111118",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "22px",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "16px",
  },
  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    background: "#1a1a27",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#e2e8f0",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    background: "#1a1a27",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#e2e8f0",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    background: "#1a1a27",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#e2e8f0",
    padding: "10px 12px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    minHeight: "90px",
  },
  btn: {
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s,transform 0.1s",
  },
  btnSm: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: "#e2e8f0",
    padding: "5px 12px",
    fontSize: "12px",
    cursor: "pointer",
  },
  pill: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "99px",
    fontSize: "11px",
    fontWeight: 600,
  },
  row: { display: "flex", alignItems: "center", gap: "10px" },
  spaceBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  range: { width: "100%", accentColor: "#7c3aed", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "middle",
  },
  badge: (color) => ({
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: "99px",
    fontSize: "11px",
    fontWeight: 600,
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
  }),
  statVal: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#e2e8f0",
    lineHeight: 1.1,
  },
  statLabel: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
  toggle: (on) => ({
    width: "42px",
    height: "24px",
    borderRadius: "99px",
    background: on ? "#7c3aed" : "#2a2a3a",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.25s",
    flexShrink: 0,
  }),
  toggleKnob: (on) => ({
    position: "absolute",
    top: "3px",
    left: on ? "21px" : "3px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.25s",
    pointerEvents: "none",
  }),
};

// ─── Small reusable components ────────────────────────────────────────────────

function ProgressBar({ pct, height = 10, animated = true }) {
  const color = pctColor(pct);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: "99px",
        height,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: "99px",
          transition: animated ? "width 0.5s cubic-bezier(.4,0,.2,1)" : "none",
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button style={S.toggle(on)} onClick={() => onChange(!on)} aria-label="toggle">
      <div style={S.toggleKnob(on)} />
    </button>
  );
}

function SortIcon({ dir }) {
  if (!dir) return <span style={{ color: "#2a2a3a", marginLeft: 4 }}>⇅</span>;
  return <span style={{ color: "#7c3aed", marginLeft: 4 }}>{dir === "asc" ? "↑" : "↓"}</span>;
}

// ─── SVG Projected-Spend Bar chart ───────────────────────────────────────────

function ProjectedBar({ spent, projected, budget, symbol }) {
  const W = 320, H = 120, pad = 40;
  const max = Math.max(budget * 1.2, projected * 1.1, 1);
  const barW = W - pad * 2;
  const spentW = (spent / max) * barW;
  const projW = (projected / max) * barW;
  const budgetX = pad + (budget / max) * barW;

  const fmtK = (v) => (v >= 1000 ? `${symbol}${(v / 1000).toFixed(1)}k` : `${symbol}${v.toFixed(0)}`);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Background track */}
      <rect x={pad} y={44} width={barW} height={18} rx={9} fill="rgba(255,255,255,0.05)" />
      {/* Projected bar */}
      <rect x={pad} y={44} width={Math.min(projW, barW)} height={18} rx={9} fill="#7c3aed44" />
      {/* Spent bar */}
      <rect x={pad} y={44} width={Math.min(spentW, barW)} height={18} rx={9} fill={pctColor((spent / budget) * 100)} />
      {/* Budget line */}
      {budgetX <= W - 4 && (
        <>
          <line x1={budgetX} y1={36} x2={budgetX} y2={70} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4,2" />
          <text x={budgetX} y={30} textAnchor="middle" fill="#f59e0b" fontSize={10}>Budget</text>
        </>
      )}
      {/* Labels */}
      <text x={pad} y={90} fill="#64748b" fontSize={10}>0</text>
      <text x={pad + spentW / 2} y={90} textAnchor="middle" fill="#e2e8f0" fontSize={10}>{fmtK(spent)} spent</text>
      <text x={pad + projW / 2} y={102} textAnchor="middle" fill="#7c3aed" fontSize={10}>{fmtK(projected)} projected</text>
      <text x={W - 4} y={90} textAnchor="end" fill="#64748b" fontSize={10}>{fmtK(max)}</text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CostTracker({ onNav }) {
  // ── Currency ──────────────────────────────────────────────────────────────
  const [currency, setCurrency] = useState("USD");
  const rate = CURRENCY_RATES[currency];
  const sym = CURRENCY_SYMBOLS[currency];
  const cvt = useCallback((usd) => usd * rate, [rate]);
  const fmt = useCallback((usd, dp = 2) => `${sym}${cvt(usd).toFixed(dp)}`, [cvt, sym]);

  // ── Monthly budget ────────────────────────────────────────────────────────
  const [budgetInput, setBudgetInput] = useState("5000");
  const budget = useMemo(() => {
    const v = parseFloat(budgetInput);
    return isNaN(v) || v <= 0 ? 5000 : v;
  }, [budgetInput]);

  // ── Lab budgets ───────────────────────────────────────────────────────────
  const [labBudgets, setLabBudgets] = useState({
    OpenAI: 1500, Anthropic: 1000, Google: 800, Mistral: 400, Cohere: 300,
  });

  // ── Spent (sum of mock rows) ──────────────────────────────────────────────
  const totalSpentUSD = useMemo(
    () => MOCK_ROWS.reduce((s, r) => s + r.cost, 0),
    []
  );
  const spentPct = Math.min((totalSpentUSD / budget) * 100, 100);

  // ── Projected spend ───────────────────────────────────────────────────────
  const projected = useMemo(() => {
    const dailyRate = totalSpentUSD / Math.max(DAY_OF_MONTH, 1);
    return dailyRate * DAYS_IN_MONTH;
  }, [totalSpentUSD]);

  // ── Alert threshold ───────────────────────────────────────────────────────
  const [alertOn, setAlertOn] = useState(true);
  const [alertPct, setAlertPct] = useState(80);
  const alertTriggered = alertOn && spentPct >= alertPct;

  // ── Live cost calculator ──────────────────────────────────────────────────
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt4o");
  const modelInfo = useMemo(() => MODELS.find((m) => m.id === selectedModel), [selectedModel]);
  const estimatedTokens = useMemo(() => {
    const words = prompt.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(Math.round(words * 1.33), prompt.length > 0 ? 1 : 0);
  }, [prompt]);
  const estimatedCost = useMemo(
    () => (estimatedTokens / 1_000_000) * (modelInfo?.ppm ?? 0),
    [estimatedTokens, modelInfo]
  );

  // ── History table ─────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 7;

  const sortedRows = useMemo(() => {
    return [...MOCK_ROWS].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortDir]);

  const pagedRows = useMemo(
    () => sortedRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [sortedRows, page]
  );

  const totalPages = Math.ceil(sortedRows.length / PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  // ── Cheapest model recommender ────────────────────────────────────────────
  const [taskType, setTaskType] = useState("chat");
  const cheapestModels = useMemo(() => {
    return [...MODELS].sort((a, b) => a.ppm - b.ppm).slice(0, 3);
  }, []);

  // ── Hover states (minimal) ────────────────────────────────────────────────
  const [hoveredRow, setHoveredRow] = useState(null);

  // ── Animated number ref for budget ───────────────────────────────────────
  const prevSpentRef = useRef(totalSpentUSD);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ ...S.spaceBetween, marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={S.heading}>💸 Cost Tracker</h1>
          <p style={S.subheading}>
            Monitor AI spend, set budgets, and find the cheapest models for your tasks.
          </p>
        </div>
        <div style={{ ...S.row, gap: "10px" }}>
          {/* Currency selector */}
          <div style={{ position: "relative" }}>
            <label style={{ ...S.label, marginBottom: 0, marginRight: 6, display: "inline" }}>Currency</label>
            <select
              style={{ ...S.select, width: "90px" }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(CURRENCY_RATES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {onNav && (
            <button style={S.btnSm} onClick={() => onNav("dashboard")}>
              ← Dashboard
            </button>
          )}
        </div>
      </div>

      {/* ── Alert Banner ─────────────────────────────────────────────────── */}
      {alertTriggered && (
        <div
          style={{
            background: "linear-gradient(90deg,#7f1d1d22,#7f1d1d44)",
            border: "1px solid #ef444466",
            borderRadius: "10px",
            padding: "14px 20px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "pulse 2s infinite",
          }}
        >
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "#fca5a5" }}>Budget Alert Triggered</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              You've used {spentPct.toFixed(1)}% of your {fmt(budget)} budget — threshold set at {alertPct}%.
            </div>
          </div>
        </div>
      )}

      {/* ── Row 1: Stats ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "18px" }}>
        {[
          { label: "Total Spent (MTD)", val: fmt(totalSpentUSD), sub: `${spentPct.toFixed(1)}% of budget`, icon: "💰" },
          { label: "Monthly Budget", val: fmt(budget), sub: `Set below`, icon: "🎯" },
          { label: "Projected (EOM)", val: fmt(projected), sub: `${DAY_OF_MONTH}/${DAYS_IN_MONTH} days`, icon: "📈" },
          { label: "API Calls (MTD)", val: MOCK_ROWS.length, sub: "Mock dataset", icon: "⚡" },
        ].map((s) => (
          <div key={s.label} style={{ ...S.card, display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "22px" }}>{s.icon}</div>
            <div style={S.statVal}>{s.val}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "#7c3aed" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Budget + Projected ─────────────────────────────────────── */}
      <div style={S.grid2}>
        {/* Monthly budget card */}
        <div style={S.card}>
          <div style={S.cardTitle}>🎯 Monthly Budget</div>
          <div style={{ ...S.row, marginBottom: "16px" }}>
            <label style={{ ...S.label, marginBottom: 0, whiteSpace: "nowrap", minWidth: "80px" }}>
              Budget ({currency})
            </label>
            <input
              style={S.input}
              type="number"
              min={1}
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="5000"
            />
          </div>
          <div style={{ ...S.spaceBetween, marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Spent: <strong style={{ color: pctColor(spentPct) }}>{fmt(totalSpentUSD)}</strong>
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {spentPct.toFixed(1)}%
            </span>
          </div>
          <ProgressBar pct={spentPct} height={14} />
          <div style={{ ...S.spaceBetween, marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "#64748b" }}>{sym}0</span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>{fmt(budget)}</span>
          </div>
          {/* Color legend */}
          <div style={{ ...S.row, marginTop: "16px", gap: "14px", flexWrap: "wrap" }}>
            {[["< 60%", "#22c55e"], ["60–85%", "#f59e0b"], ["> 85%", "#ef4444"]].map(([l, c]) => (
              <div key={l} style={S.row}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: "11px", color: "#64748b" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projected spend */}
        <div style={S.card}>
          <div style={S.cardTitle}>📈 Projected Month-End Spend</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
            Based on {DAY_OF_MONTH} days of data, extrapolated to {DAYS_IN_MONTH} days.
          </div>
          <ProjectedBar
            spent={cvt(totalSpentUSD)}
            projected={cvt(projected)}
            budget={cvt(budget)}
            symbol={sym}
          />
          <div style={{ ...S.row, marginTop: "10px", gap: "20px", flexWrap: "wrap" }}>
            <div style={S.row}>
              <div style={{ width: 10, height: 10, borderRadius: "2px", background: pctColor(spentPct) }} />
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Spent</span>
            </div>
            <div style={S.row}>
              <div style={{ width: 10, height: 10, borderRadius: "2px", background: "#7c3aed" }} />
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Projected</span>
            </div>
            <div style={S.row}>
              <div style={{ width: 10, height: 10, borderRadius: "2px", background: "#f59e0b" }} />
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Budget</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Lab budgets + Alert threshold ─────────────────────────── */}
      <div style={S.grid2}>
        {/* Per-lab budget sliders */}
        <div style={S.card}>
          <div style={S.cardTitle}>🏢 Per-Lab Budget Allocation</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "14px" }}>
            Slide to adjust max spend per provider (0–{sym}{cvt(2000).toFixed(0)})
          </div>
          {LABS.map((lab) => {
            const labPct = (labBudgets[lab] / 2000) * 100;
            const color = labColor(lab);
            return (
              <div key={lab} style={{ marginBottom: "18px" }}>
                <div style={S.spaceBetween}>
                  <div style={S.row}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{lab}</span>
                  </div>
                  <span style={{ fontSize: "13px", color, fontWeight: 600 }}>
                    {fmt(labBudgets[lab])}
                  </span>
                </div>
                <div style={{ marginTop: "6px" }}>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={labBudgets[lab]}
                    style={{ ...S.range, accentColor: color }}
                    onChange={(e) =>
                      setLabBudgets((prev) => ({ ...prev, [lab]: Number(e.target.value) }))
                    }
                  />
                </div>
                <ProgressBar pct={labPct} height={4} />
              </div>
            );
          })}
        </div>

        {/* Alert threshold */}
        <div style={S.card}>
          <div style={S.cardTitle}>🔔 Budget Alert Settings</div>

          <div
            style={{
              background: alertOn ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${alertOn ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "18px",
              transition: "all 0.3s",
            }}
          >
            <div style={{ ...S.spaceBetween, marginBottom: "12px" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>Alert Notifications</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Get warned when budget threshold is hit
                </div>
              </div>
              <Toggle on={alertOn} onChange={setAlertOn} />
            </div>

            <label style={S.label}>
              Threshold: <strong style={{ color: "#e2e8f0" }}>{alertPct}%</strong>
              {" "}— triggers at {fmt(budget * alertPct / 100)} of {fmt(budget)}
            </label>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={alertPct}
              style={S.range}
              disabled={!alertOn}
              onChange={(e) => setAlertPct(Number(e.target.value))}
            />
            <div style={{ ...S.spaceBetween, fontSize: "10px", color: "#64748b" }}>
              <span>50%</span>
              <span>70%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Threshold indicator */}
          <div style={{ position: "relative", marginTop: "8px" }}>
            <ProgressBar pct={spentPct} height={16} />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${alertPct}%`,
                width: "2px",
                background: "#f59e0b",
                borderRadius: "1px",
              }}
            />
          </div>
          <div style={{ ...S.spaceBetween, marginTop: "6px", fontSize: "11px" }}>
            <span style={{ color: "#64748b" }}>Current: {spentPct.toFixed(1)}%</span>
            <span style={{ color: "#f59e0b" }}>Threshold: {alertPct}%</span>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: alertTriggered ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.06)",
              border: `1px solid ${alertTriggered ? "#ef444433" : "#22c55e33"}`,
              fontSize: "13px",
              fontWeight: 500,
              color: alertTriggered ? "#fca5a5" : "#86efac",
              textAlign: "center",
            }}
          >
            {!alertOn
              ? "🔕 Alerts disabled"
              : alertTriggered
              ? "🚨 Alert triggered — review your spend!"
              : `✅ Within budget — ${(alertPct - spentPct).toFixed(1)}% headroom`}
          </div>
        </div>
      </div>

      {/* ── Row 4: Live calculator + Recommender ─────────────────────────── */}
      <div style={S.grid2}>
        {/* Live cost calculator */}
        <div style={S.card}>
          <div style={S.cardTitle}>⚡ Live Cost Calculator</div>
          <label style={S.label}>Paste your prompt (cost estimated as you type)</label>
          <textarea
            style={S.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Start typing your prompt here…"
          />
          <div style={{ ...S.spaceBetween, marginTop: "12px", marginBottom: "8px" }}>
            <label style={{ ...S.label, marginBottom: 0 }}>Model</label>
            <select
              style={{ ...S.select, width: "220px" }}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({sym}{cvt(m.ppm).toFixed(2)}/1M)
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginTop: "14px",
            }}
          >
            {[
              { icon: "📝", label: "Est. Tokens", val: estimatedTokens.toLocaleString() },
              { icon: "💵", label: "Est. Cost", val: estimatedCost < 0.000001 ? "—" : fmt(estimatedCost, 6) },
              { icon: "📊", label: "Rate", val: `${sym}${cvt(modelInfo?.ppm ?? 0).toFixed(2)}/1M` },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: "10px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{item.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#a78bfa" }}>{item.val}</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "3px" }}>{item.label}</div>
              </div>
            ))}
          </div>

          {prompt.length > 0 && (
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "10px" }}>
              ✱ Estimate based on ~1.33 tokens/word. Actual usage may vary.
            </div>
          )}
        </div>

        {/* Cheapest model recommender */}
        <div style={S.card}>
          <div style={S.cardTitle}>🏆 Cheapest Model Recommender</div>
          <label style={S.label}>Task type</label>
          <select
            style={{ ...S.select, marginBottom: "16px" }}
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          >
            {TASK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
            Top 3 cheapest models for <strong style={{ color: "#e2e8f0" }}>
              {TASK_TYPES.find((t) => t.id === taskType)?.label}
            </strong>:
          </div>

          {cheapestModels.map((m, idx) => {
            const color = labColor(m.lab);
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: idx === 0 ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${idx === 0 ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "10px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "22px" }}>{medals[idx]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{m.name}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    <span style={{ ...S.badge(color) }}>{m.lab}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#22c55e", fontSize: "15px" }}>
                    {sym}{cvt(m.ppm).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>per 1M tokens</div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#86efac",
            }}
          >
            💡 Switching from <strong>{cheapestModels[2]?.name}</strong> to{" "}
            <strong>{cheapestModels[0]?.name}</strong> could save up to{" "}
            <strong>
              {sym}
              {cvt(
                ((cheapestModels[2]?.ppm ?? 0) - (cheapestModels[0]?.ppm ?? 0)) * 10
              ).toFixed(2)}
            </strong>{" "}
            per 10M tokens.
          </div>
        </div>
      </div>

      {/* ── Row 5: Cost History Table ─────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{ ...S.spaceBetween, marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={S.cardTitle}>📋 Cost History</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            {MOCK_ROWS.length} records · Page {page + 1}/{totalPages}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {[
                  { key: "date", label: "Date" },
                  { key: "lab", label: "Lab" },
                  { key: "model", label: "Model" },
                  { key: "tokens", label: "Tokens" },
                  { key: "ppm", label: "Rate/1M" },
                  { key: "cost", label: "Cost" },
                ].map((col) => (
                  <th
                    key={col.key}
                    style={S.th}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon dir={sortKey === col.key ? sortDir : null} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => {
                const color = labColor(row.lab);
                const isHovered = hoveredRow === row.id;
                return (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: isHovered ? "rgba(124,58,237,0.06)" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={S.td}>
                      <span style={{ fontVariantNumeric: "tabular-nums", fontSize: "12px", color: "#94a3b8" }}>
                        {row.date}
                      </span>
                    </td>
                    <td style={S.td}>
                      <span style={S.badge(color)}>{row.lab}</span>
                    </td>
                    <td style={{ ...S.td, fontWeight: 500 }}>{row.model}</td>
                    <td style={{ ...S.td, fontVariantNumeric: "tabular-nums", color: "#94a3b8" }}>
                      {row.tokens.toLocaleString()}
                    </td>
                    <td style={{ ...S.td, color: "#64748b", fontSize: "12px" }}>
                      {sym}{cvt(row.ppm).toFixed(2)}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700, color: "#22c55e" }}>
                      {fmt(row.cost, 4)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ ...S.spaceBetween, marginTop: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, MOCK_ROWS.length)} of {MOCK_ROWS.length}
          </div>
          <div style={S.row}>
            <button
              style={{ ...S.btnSm, opacity: page === 0 ? 0.4 : 1 }}
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                style={{
                  ...S.btnSm,
                  background: i === page ? "rgba(124,58,237,0.3)" : undefined,
                  border: i === page ? "1px solid rgba(124,58,237,0.5)" : undefined,
                  minWidth: "30px",
                  textAlign: "center",
                }}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              style={{ ...S.btnSm, opacity: page === totalPages - 1 ? 0.4 : 1 }}
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#2a2a3a",
        }}
      >
        CostTracker · Live currency: 1 USD = {CURRENCY_RATES.EUR} EUR · {CURRENCY_RATES.GBP} GBP · {CURRENCY_RATES.PKR} PKR
      </div>
    </div>
  );
}
