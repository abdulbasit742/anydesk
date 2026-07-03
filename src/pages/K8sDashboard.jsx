import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  podPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  podCard: (status) => ({
    background: status === "Running" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    border: `1px solid ${status === "Running" ? "#10b981" : "#ef4444"}`,
    borderRadius: 12, padding: 14, display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 12,
  }),
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function K8sDashboard({ onNav }) {
  const [pods, setPods] = useState([
    { id: 1, name: "auth-service-pod-93", status: "Running", CPU: "12%", RAM: "142 MB" },
    { id: 2, name: "payment-gateway-pod-12", status: "CrashLoopBackOff", CPU: "0%", RAM: "4 MB" },
  ]);
  const [logs, setLogs] = useState(["K8s Dashboard listening on cluster context."]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const restartPod = (id) => {
    setPods(prev => prev.map(p => p.id === id ? { ...p, status: "Running", CPU: "4%", RAM: "45 MB" } : p));
    setLogs(prev => [...prev, `[K8s] Triggered clean restart on Pod ID #${id}...`]);
    showToast(`✓ Pod #${id} restarted successfully!`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>☸️ Kubernetes Pod Dashboard</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Monitor container orchestration clusters, check pods telemetry, and trigger clean restarts.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Main pod list */}
        <div style={S.podPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Active Cluster Pods</div>

          {pods.map(p => (
            <div key={p.id} style={S.podCard(p.status)}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#a0aec0" }}>CPU: {p.CPU} | RAM: {p.RAM}</div>
              </div>

              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: p.status === "Running" ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                  ● {p.status}
                </span>
                <button style={S.primaryBtn("#a78bfa")} onClick={() => restartPod(p.id)}>Restart</button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>K8s System Log Streams</div>
          <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 10, color: "#a78bfa", fontFamily: "monospace", whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>
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
