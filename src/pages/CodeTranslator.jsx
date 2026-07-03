import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  editorPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  outputPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", minHeight: 260, maxHeight: 300, overflowY: "auto" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function CodeTranslator({ onNav }) {
  const [sourceCode, setSourceCode] = useState(`def greet(name):\n    print("Hello, " + name)`);
  const [targetLang, setTargetLang] = useState("JavaScript");
  const [translatedCode, setTranslatedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const translateCode = () => {
    setLoading(true);
    setTranslatedCode("");
    setTimeout(() => {
      if (targetLang === "JavaScript") {
        setTranslatedCode(`// AI Translated to JavaScript:\nfunction greet(name) {\n    console.log("Hello, " + name);\n}`);
      } else {
        setTranslatedCode(`// AI Translated to Go:\npackage main\nimport "fmt"\n\nfunc greet(name string) {\n    fmt.Println("Hello, " + name)\n}`);
      }
      setLoading(false);
      showToast(`✓ Translated script to ${targetLang}!`);
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📝 AI Code Language Translator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Parse algorithms structures and translate script lines between popular programming languages automatically.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Editor */}
        <div style={S.editorPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Source Script</span>
            
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", fontSize: 11, borderRadius: 6, padding: "4px 8px" }}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Go">Go</option>
            </select>
          </div>

          <textarea
            value={sourceCode}
            onChange={e => setSourceCode(e.target.value)}
            style={{ width: "100%", height: 200, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", resize: "none", outline: "none", marginBottom: 16 }}
          />

          <button style={S.primaryBtn("#a78bfa")} onClick={translateCode} disabled={loading}>
            {loading ? "Translating..." : "⚡ Translate Code"}
          </button>
        </div>

        {/* Output */}
        <div style={S.outputPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Translated Script: {targetLang}</div>
          {translatedCode ? (
            <pre style={S.codeFrame}>{translatedCode}</pre>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input source script on the left and trigger compilation checks...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
