import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  previewPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", maxHeight: 300, overflowY: "auto" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function CodeGenerator({ onNav }) {
  const [desc, setDesc] = useState("");
  const [compType, setCompType] = useState("React View");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const generateCode = () => {
    if (!desc.trim()) {
      showToast("Describe the system first!");
      return;
    }
    setLoading(true);
    setGeneratedCode("");

    setTimeout(() => {
      let code = "";
      if (compType === "React View") {
        code = `import React from 'react';\n\n// Generated component: ${desc}\nexport default function CustomView() {\n  return (\n    <div style={{ padding: 20, background: '#111', color: '#fff', borderRadius: 8 }}>\n      <h3>${desc}</h3>\n      <p>This is a custom auto-generated template workspace view.</p>\n    </div>\n  );\n}`;
      } else {
        code = `// Generated utility modules: ${desc}\nexport function processData(input) {\n  console.log('Processing input for: ${desc}');\n  return { success: true, timestamp: Date.now() };\n}`;
      }
      setGeneratedCode(code);
      setLoading(false);
      showToast("System Code generated successfully!");
    }, 1500);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>💻 AI Code Generator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Describe the next system or feature you want to build and let AI write the boilerplate structures.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>System Description</div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>What do you want to build?</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="e.g. A user profile card with animated charts"
              style={{ ...S.input, height: 100, resize: "none" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>File Extension Type</label>
            <select
              value={compType}
              onChange={e => setCompType(e.target.value)}
              style={S.input}
            >
              <option value="React View">React View (.jsx)</option>
              <option value="Utility Module">Utility Module (.js)</option>
            </select>
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={generateCode} disabled={loading}>
            {loading ? "Generating..." : "⚡ Generate Code"}
          </button>
        </div>

        {/* Preview Panel */}
        <div style={S.previewPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Code Workspace Preview</span>
            {generatedCode && (
              <button
                onClick={() => showToast("Source files downloaded!")}
                style={{ ...S.primaryBtn("#10b981"), padding: "4px 12px", fontSize: 10 }}
              >
                📥 Export Files
              </button>
            )}
          </div>

          {generatedCode ? (
            <pre style={S.codeFrame}>
              {generatedCode}
            </pre>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              {loading ? "Writing boilerplate..." : "Describe target modules and click Generate..."}
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
