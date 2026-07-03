import { useState, useCallback } from "react";

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────

const COMPART_LABS = [
  { id: "openai", name: "OpenAI", emoji: "🤖", color: "#10b981", response: "GPT-4o response: I've processed your request. Here's a clean coding solution utilizing ES2024 features and standard type safety guards." },
  { id: "anthropic", name: "Anthropic", emoji: "🧠", color: "#a78bfa", response: "Claude response: Looking at this problem, I'd suggest referential checks and functional paradigms inside useEffect to avoid render cycles." },
  { id: "google", name: "Google DeepMind", emoji: "✨", color: "#22d3ee", response: "Gemini response: Understood. Let's analyze this using a multi-modal context framework. Standard libraries should execute in under 400ms." },
  { id: "meta", name: "Meta (Llama)", emoji: "🦙", color: "#f97316", response: "Llama response: Here's a quick Python solution optimized for low latency and zero memory fragmentation. Run standard unit tests next." },
  { id: "deepseek", name: "DeepSeek", emoji: "🔬", color: "#34d399", response: "DeepSeek response: Formal logic verification shows that a binary tree lookup runs at O(log n) efficiency. Standard caching yields 3x gains." },
];

const PRESETS = [
  "Write a Python function to sort a list of numbers.",
  "Explain quantum computing in simple terms.",
  "Draft an introductory email to a potential customer.",
  "What causes a React useEffect loop and how to fix it?"
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  cardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  card: (color) => ({
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 18, position: "relative",
  }),
  cardHeader: { display: "flex", alignItems: "center", justifyContents: "space-between", marginBottom: 12 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function LabComparison({ onNav }) {
  const [selectedLabs, setSelectedLabs] = useState(["openai", "anthropic"]);
  const [prompt, setPrompt] = useState("");
  const [outputs, setOutputs] = useState({});
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const toggleLab = (id) => {
    setSelectedLabs(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter(l => l !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    setRunning(true);
    setOutputs({});
    setWinner(null);

    selectedLabs.forEach((labId, idx) => {
      const lab = COMPART_LABS.find(l => l.id === labId);
      setTimeout(() => {
        setOutputs(prev => ({
          ...prev,
          [labId]: {
            text: lab.response,
            latency: `${Math.floor(Math.random() * 400) + 300}ms`,
            cost: `$${(Math.random() * 0.005 + 0.001).toFixed(4)}`,
            tokens: Math.floor(Math.random() * 200) + 120,
          }
        }));
        if (idx === selectedLabs.length - 1) {
          setRunning(false);
          showToast("Responses loaded!");
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>⚖️ Lab Comparison</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Compare multiple model outputs side by side.</div>
        </div>
      </div>

      {/* Select Labs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {COMPART_LABS.map(l => {
          const active = selectedLabs.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => toggleLab(l.id)}
              style={{
                ...S.primaryBtn(l.color),
                background: active ? `linear-gradient(135deg, ${l.color}, ${l.color}b3)` : "rgba(255,255,255,0.03)",
                border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: active ? "#fff" : "#a0aec0",
              }}
            >
              {l.emoji} {l.name}
            </button>
          );
        })}
      </div>

      {/* Shared Prompt Bar */}
      <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <label style={S.label}>Prompt Broadcast Query</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type query to test models concurrently..."
          style={{ ...S.input, height: 70, resize: "none", marginBottom: 12 }}
        />
        <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                style={{ fontSize: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, color: "#6e7191", padding: "4px 8px", cursor: "pointer" }}
              >
                {p.slice(0, 24)}...
              </button>
            ))}
          </div>
          <button style={S.primaryBtn("#a78bfa")} onClick={handleSend} disabled={running}>
            {running ? "Comparing..." : "▶ Compare Models"}
          </button>
        </div>
      </div>

      {/* Response Cards Grid */}
      <div style={S.cardGrid}>
        {selectedLabs.map(labId => {
          const lab = COMPART_LABS.find(l => l.id === labId);
          const data = outputs[labId];
          const isWinner = winner === labId;

          return (
            <div key={labId} style={S.card(lab.color)}>
              <div style={S.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{lab.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{lab.name}</span>
                </div>
                {data && (
                  <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#6e7191" }}>
                    <span>Latency: <b>{data.latency}</b></span>
                    <span>Cost: <b>{data.cost}</b></span>
                  </div>
                )}
              </div>

              {data ? (
                <div>
                  <div style={{ fontSize: 12, color: "#f0f0f5", lineHeight: 1.6, marginBottom: 12 }}>
                    {data.text}
                  </div>
                  <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                    <button
                      onClick={() => { setWinner(labId); showToast(`${lab.name} rated as winner!`); }}
                      style={{ ...S.primaryBtn(lab.color), padding: "4px 10px", fontSize: 10 }}
                    >
                      {isWinner ? "✓ Rated Winner" : "Rate Winner"}
                    </button>
                    <span style={{ fontSize: 10, color: "#6e7191" }}>{data.tokens} tokens</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#6e7191", fontSize: 11, fontStyle: "italic" }}>
                  {running ? "Generating stream response..." : "Query pending prompt submission..."}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
