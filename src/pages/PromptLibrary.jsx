import { useState, useCallback } from "react";

// ─── DATA & PRESETS ───────────────────────────────────────────────────────────

const INITIAL_PROMPTS = [
  {
    id: "p1", title: "React Infinite Loop Fixer", category: "Code",
    desc: "Explains and patches infinite rendering loops in React useEffect blocks.",
    prompt: "I am experiencing an infinite loop in a React component's useEffect. Here is my code: \n\n[INJECT_CODE]\n\nExplain the cause of the loop (e.g. referential identity of dependencies, state updates inside render, closure state sync issues) and provide the correct, optimized refactored version.",
    favorites: true,
  },
  {
    id: "p2", title: "SQL Window Function Finder", category: "Code",
    desc: "Generates optimal SQL queries using window functions for complex cohort sorting.",
    prompt: "Write a SQL query that retrieves the top [N] records per category based on [SORT_COLUMN] using partition window functions. Optimize the query for high-performance indexing.",
    favorites: false,
  },
  {
    id: "p3", title: "Business MVP GTM Strategy", category: "Business",
    desc: "Drafts a step-by-step Go-To-Market strategy for launching a digital SaaS product.",
    prompt: "Design a 30-day Go-To-Market (GTM) plan for a digital SaaS product in the [NICHE] industry. Focus on zero-budget marketing channels, early adopter validation, and initial pricing tier adjustments.",
    favorites: true,
  },
  {
    id: "p4", title: "Real Estate Property Copywriter", category: "Real Estate",
    desc: "Creates persuasive listing descriptions emphasizing key luxury selling points.",
    prompt: "Write an appealing and professional real estate listing description for a [BEDS] bedroom, [BATHS] bathroom property located in [NEIGHBORHOOD]. Highlights should include: [HIGHLIGHTS].",
    favorites: false,
  },
  {
    id: "p5", title: "Curriculum Planning Guide", category: "Education",
    desc: "Structures educational curriculum plans with balanced assessment metrics.",
    prompt: "Draft a 4-week learning curriculum plan for teaching [TOPIC] to intermediate-level learners. Include weekly concepts, code exercises, reading assignments, and mini-assessments.",
    favorites: false,
  },
  {
    id: "p6", title: "Cold Email Sales Hook", category: "Marketing",
    desc: "Drafts high-conversion outbound cold emails for SaaS customer acquisition.",
    prompt: "Write a short, engaging cold outbound email targeting decision makers at [COMPANY_TYPE] offering our solution: [VALUE_PROP]. Keep the email under 150 words and include a clear, low-friction CTA.",
    favorites: true,
  },
];

const CATEGORIES = ["All", "Code", "Business", "Real Estate", "Education", "Marketing", "Research"];
const LABS = ["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.0 Flash", "Llama 3.3 70B", "DeepSeek-R1"];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 },
  card: (fav) => ({
    background: "rgba(255,255,255,0.02)", border: `1px solid ${fav ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: 18, transition: "all 0.2s",
  }),
  cardHeader: { display: "flex", alignItems: "center", justifyContents: "space-between", marginBottom: 10 },
  categoryBadge: { fontSize: 9, fontWeight: 700, background: "rgba(34,211,238,0.1)", color: "#22d3ee", borderRadius: 4, padding: "2px 6px" },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function PromptLibrary({ onNav }) {
  const [prompts, setPrompts] = useState(INITIAL_PROMPTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [testResponse, setTestResponse] = useState("");
  const [testingLab, setTestingLab] = useState(LABS[0]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, favorites: !p.favorites } : p));
    showToast("Favorites list updated!");
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    showToast("Copied prompt template to clipboard!");
  };

  const handleTestPrompt = (p) => {
    setSelectedPrompt(p);
    setTestResponse("");
  };

  const executePromptTest = () => {
    if (loadingTest) return;
    setLoadingTest(true);
    setTestResponse("");
    
    setTimeout(() => {
      setTestResponse(`[${testingLab} Simulation Output]\n\nPrompt template processed successfully. Variables resolved. Custom context parsed correctly. Output is syntactically correct and aligns with best practices.`);
      setLoadingTest(false);
      showToast("Mock model testing finished!");
    }, 1200);
  };

  const filteredPrompts = prompts.filter(p => {
    if (category !== "All" && p.category !== category) return false;
    if (favoritesOnly && !p.favorites) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📚 Prompt Library</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Structured template prompts library. Expose directly to connected AI models.</div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search prompt templates..."
          style={{ ...S.input, width: 280 }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                ...S.primaryBtn("#a78bfa"),
                background: category === c ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.03)",
                border: category === c ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: category === c ? "#fff" : "#a0aec0",
                padding: "6px 12px",
                fontSize: 11,
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFavoritesOnly(prev => !prev)}
          style={{
            ...S.primaryBtn("#f59e0b"),
            background: favoritesOnly ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(255,255,255,0.03)",
            border: favoritesOnly ? "none" : "1px solid rgba(255,255,255,0.1)",
            color: favoritesOnly ? "#fff" : "#a0aec0",
            padding: "6px 12px",
            fontSize: 11,
          }}
        >
          ★ Favorites
        </button>
      </div>

      {/* Prompt Grid */}
      <div style={S.grid}>
        {filteredPrompts.map(p => (
          <div key={p.id} style={S.card(p.favorites)}>
            <div style={S.cardHeader}>
              <span style={S.categoryBadge}>{p.category}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={(e) => toggleFavorite(p.id, e)} style={{ background: "none", border: "none", color: p.favorites ? "#f59e0b" : "#6e7191", cursor: "pointer", fontSize: 13 }}>
                  ★
                </button>
                <button onClick={(e) => copyToClipboard(p.prompt, e)} style={{ background: "none", border: "none", color: "#6e7191", cursor: "pointer", fontSize: 11 }}>
                  copy
                </button>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5, marginBottom: 12 }}>{p.desc}</div>
            <button style={{ ...S.primaryBtn("#a78bfa"), width: "100%", fontSize: 10, padding: "5px 0" }} onClick={() => handleTestPrompt(p)}>
              ⚡ Test Prompt
            </button>
          </div>
        ))}
      </div>

      {/* Testing Panel Modal */}
      {selectedPrompt && (
        <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Test Prompt Template: {selectedPrompt.title}</span>
            <button onClick={() => setSelectedPrompt(null)} style={{ background: "none", border: "none", color: "#6e7191", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Prompt Template</label>
            <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 11, color: "#a0aec0", whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.04)" }}>
              {selectedPrompt.prompt}
            </pre>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Test Lab Target</label>
              <select value={testingLab} onChange={e => setTestingLab(e.target.value)} style={S.input}>
                {LABS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button style={{ ...S.primaryBtn("#10b981"), marginTop: 14 }} onClick={executePromptTest} disabled={loadingTest}>
              {loadingTest ? "Running Test..." : "Execute Test"}
            </button>
          </div>

          {testResponse && (
            <div>
              <label style={S.label}>Test Output Response</label>
              <pre style={{ margin: 0, background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 8, padding: 12, fontSize: 11, color: "#c0caf5", whiteSpace: "pre-wrap" }}>
                {testResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
