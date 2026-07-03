import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  editorPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  diffPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", minHeight: 260, maxHeight: 300, overflowY: "auto" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function RefactorStudio({ onNav }) {
  const [code, setCode] = useState(`function calcSum(arr) {\n  let sum = 0;\n  for(let i=0; i<arr.length; i++) {\n    sum = sum + arr[i];\n  }\n  return sum;\n}`);
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerRefactor = () => {
    setLoading(true);
    setDiff("");
    setTimeout(() => {
      setDiff(`// AI Refactored Code Diff:\n- function calcSum(arr) {\n-   let sum = 0;\n-   for(let i=0; i<arr.length; i++) {\n-     sum = sum + arr[i];\n-   }\n-   return sum;\n- }\n+ const calcSum = (arr) => arr.reduce((acc, val) => acc + val, 0);`);
      setLoading(false);
      showToast("✓ AI Code Refactoring draft complete!");
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>💻 AI Refactoring Studio</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Refactor source scripts, simplify code complexities, and see visual changes side-by-side.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Editor */}
        <div style={S.editorPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Source Script Input</div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ width: "100%", height: 200, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", resize: "none", outline: "none", marginBottom: 16 }}
          />
          <button style={S.primaryBtn("#a78bfa")} onClick={triggerRefactor} disabled={loading}>
            {loading ? "Refactoring..." : "⚡ Refactor Code"}
          </button>
        </div>

        {/* Diff preview */}
        <div style={S.diffPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Visual Refactor Diff</div>
          {diff ? (
            <pre style={S.codeFrame}>{diff}</pre>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input source code on the left and click refactor to trace code updates...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
