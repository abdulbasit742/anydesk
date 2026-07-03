import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  pipelinePanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  nodeCard: (status) => ({
    background: status === "running" ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${status === "running" ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 12, padding: 14, display: "flex", justifyContents: "space-between", alignItems: "center",
  }),
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function DevOpsOrchestrator({ onNav }) {
  const [nodes, setNodes] = useState([
    { id: 1, name: "Lint Check", status: "completed" },
    { id: 2, name: "Unit Test suite", status: "completed" },
    { id: 3, name: "Vite Asset Bundle", status: "running" },
    { id: 4, name: "Dockerize Matrix", status: "idle" },
  ]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState(["DevOps Orchestrator initialized."]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const startPipeline = () => {
    setRunning(true);
    setLogs(prev => [...prev, "[Pipeline] Executing task series..."]);
    
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === 3 ? { ...n, status: "completed" } : n));
      setNodes(prev => prev.map(n => n.id === 4 ? { ...n, status: "running" } : n));
      setLogs(prev => [...prev, "[Pipeline] Vite bundle completed. Initiating container compilation..."]);
      
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id === 4 ? { ...n, status: "completed" } : n));
        setLogs(prev => [...prev, "✓ [Pipeline] DevOps deployment matrix fully compiled!"]);
        setRunning(false);
        showToast("✓ Pipeline deployment completed successfully!");
      }, 1200);
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>⚙️ DevOps Pipeline Designer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Design drag-and-drop build sequences, configure docker registries, and deploy containers.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Main canvas list representing tasks */}
        <div style={S.pipelinePanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Task Execution Pipeline</span>
            <button style={S.primaryBtn("#a78bfa")} onClick={startPipeline} disabled={running}>
              {running ? "Orchestrating..." : "▶ Start Pipeline"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {nodes.map(n => (
              <div key={n.id} style={S.nodeCard(n.status)}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{n.name}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>State: <b>{n.status.toUpperCase()}</b></div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: n.status === "completed" ? "#10b981" : n.status === "running" ? "#22d3ee" : "#a0aec0"
                }}>
                  {n.status === "completed" ? "✓" : n.status === "running" ? "●" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>CI/CD Execution Terminal</div>
          <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 10, color: "#22d3ee", fontFamily: "monospace", whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>{log}</div>
            ))}
          </pre>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
