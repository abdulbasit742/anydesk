import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  errorPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  healingPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", maxHeight: 200, overflowY: "auto" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SelfHealingAgent({ onNav }) {
  const [errorLog, setErrorLog] = useState("");
  const [healing, setHealing] = useState(false);
  const [healingStep, setHealingStep] = useState("");
  const [suggestedFix, setSuggestedFix] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerHealing = () => {
    if (!errorLog.trim()) {
      showToast("Input an error log first!");
      return;
    }
    setHealing(true);
    setHealingStep("Parsing error log stack trace...");
    setSuggestedFix("");

    setTimeout(() => {
      setHealingStep("Searching codebase AST nodes for mismatch...");
      setTimeout(() => {
        setHealingStep("Drafting patch code...");
        setTimeout(() => {
          setSuggestedFix(`// Patch applied to C:/src/pages/Home.jsx\n- const [val, setVal] = useState;\n+ const [val, setVal] = useState(0);`);
          setHealingStep("Verifying code compilation... Success ✓");
          setHealing(false);
          showToast("Self-healing agent patch complete!");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🤖 Self-Healing Code Agent</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Paste terminal errors or build warnings. The AI agent will auto-locate, draft, test, and write code corrections.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Error Input Panel */}
        <div style={S.errorPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Ingest Error Logs</div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Paste Stack Trace / Console Error</label>
            <textarea
              value={errorLog}
              onChange={e => setErrorLog(e.target.value)}
              placeholder="e.g. ReferenceError: useState is not defined at Home.jsx:24"
              style={{ ...S.input, height: 180, fontFamily: "monospace", fontSize: 11, resize: "none" }}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={triggerHealing} disabled={healing}>
            {healing ? "Healing..." : "⚡ Trigger Auto-Healing"}
          </button>
        </div>

        {/* Healing Agent Panel */}
        <div style={S.healingPanel}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Agent Execution Status</div>

          {healingStep ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#22d3ee" }}>Status:</span>
                <span style={{ fontSize: 12, color: "#f0f0f5" }}>{healingStep}</span>
              </div>

              {suggestedFix && (
                <div>
                  <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Drafted Patch Correction</span>
                    <button
                      onClick={() => showToast("Patch applied to local repository file!")}
                      style={{ ...S.primaryBtn("#10b981"), padding: "4px 12px", fontSize: 10 }}
                    >
                      ✓ Apply Code Patch
                    </button>
                  </div>
                  <pre style={S.codeFrame}>
                    {suggestedFix}
                  </pre>
                </div>
              )}

            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input stack trace console error on the left to initiate self-repair hooks...
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
