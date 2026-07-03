import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function LoadBalancerConfig({ onNav }) {
  const [routes, setRoutes] = useState([
    { id: 1, path: "/api", target: "Server A (Port 8080)", weight: 70 },
    { id: 2, path: "/app", target: "Server B (Port 3000)", weight: 30 },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const adjustWeight = (id, newWeight) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, weight: parseInt(newWeight) || 0 } : r));
    showToast(`✓ Updated server routing weight to ${newWeight}%!`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🌐 Load Balancer Configurator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Configure round-robin ingress paths, target servers weight distribution, and health checking protocols.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Rules configurator list */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Traffic Distribution Rules</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {routes.map(r => (
              <div key={r.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContents: "space-between", fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>
                  <span>Path: {r.path}</span>
                  <span style={{ color: "#22d3ee" }}>Target: {r.target}</span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: "#6e7191" }}>Weight:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={r.weight}
                    onChange={e => adjustWeight(r.id, e.target.value)}
                    style={{ flex: 1, accentColor: "#22d3ee" }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#22d3ee", width: 34 }}>{r.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global LB status */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Ingress Status Telemetry</div>
          <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.6 }}>
            <div>Active Connections: <b>1480 concurrent</b></div>
            <div style={{ marginTop: 10 }}>Ingress status: <b style={{ color: "#10b981" }}>Healthy</b></div>
            <div style={{ marginTop: 10 }}>Health check intervals: <b>30 seconds</b></div>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
