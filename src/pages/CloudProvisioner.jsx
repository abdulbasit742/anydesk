import { useState, useCallback } from "react";

const PROVIDERS = [
  { id: "vercel", name: "Vercel", emoji: "▲", color: "#ffffff", cost: "$20/mo", status: "idle" },
  { id: "railway", name: "Railway", emoji: "🚂", color: "#f472b6", cost: "$5/mo", status: "active" },
  { id: "aws", name: "AWS EC2", emoji: "☁️", color: "#fb923c", cost: "$12/mo", status: "idle" },
  { id: "gcp", name: "Google Cloud", emoji: "✨", color: "#60a5fa", cost: "$15/mo", status: "idle" },
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  provisionPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  card: (active) => ({
    background: active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, display: "flex", justifyContents: "space-between", alignItems: "center",
  }),
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function CloudProvisioner({ onNav }) {
  const [clouds, setClouds] = useState(PROVIDERS);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState(["Cloud Provisioner initialized. Ready."]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerDeploy = (id) => {
    setLoading(true);
    setLogs(prev => [...prev, `[Deploying] Initializing handshake with ${id} API gateway...`]);

    setTimeout(() => {
      setLogs(prev => [...prev, `[Deploying] Bundling production source assets...`]);
      setTimeout(() => {
        setLogs(prev => [...prev, `[Deploying] Pushing build matrix container...`]);
        setTimeout(() => {
          setClouds(prev => prev.map(c => c.id === id ? { ...c, status: "active" } : c));
          setLogs(prev => [...prev, `✓ [Success] Deployment complete on ${id}. Public URL ready.`]);
          setLoading(false);
          showToast(`✓ Deployed successfully to ${id}!`);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🚂 Multi-Cloud Provisioner</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Deploy and coordinate active server containers concurrently across Vercel, Railway, AWS, and Google Cloud networks.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Main Panel */}
        <div style={S.provisionPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Select Target Host Providers</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {clouds.map(c => (
              <div key={c.id} style={S.card(c.status === "active")}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>
                    {c.emoji} {c.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#6e7191" }}>Estimated Cost: {c.cost}</div>
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: c.status === "active" ? "#10b981" : "#6e7191" }}>
                    ● {c.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => triggerDeploy(c.id)}
                    disabled={loading}
                    style={{
                      ...S.primaryBtn(c.color),
                      background: c.status === "active" ? "rgba(255,255,255,0.03)" : `linear-gradient(135deg, ${c.color}, ${c.color}b3)`,
                      color: c.status === "active" ? "#a0aec0" : "#fff",
                      border: c.status === "active" ? "1px solid rgba(255,255,255,0.1)" : "none",
                    }}
                  >
                    {c.status === "active" ? "Redeploy" : "Deploy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Deployment Actions Logs</div>
            <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 10, color: "#a78bfa", fontFamily: "monospace", whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: 4 }}>{log}</div>
              ))}
            </pre>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
