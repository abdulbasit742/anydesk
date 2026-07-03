import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  tunnelsPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  tunnelCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function TunnelsMonitor({ onNav }) {
  const [port, setPort] = useState("3000");
  const [loading, setLoading] = useState(false);
  const [tunnels, setTunnels] = useState([
    { id: 1, port: "8080", url: "https://expose-8080.antigravity.dev", status: "Active" },
    { id: 2, port: "5000", url: "https://expose-5000.antigravity.dev", status: "Active" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const exposePort = () => {
    if (!port) {
      showToast("Port number is required!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created = {
        id: Date.now(),
        port,
        url: `https://expose-${port}-${Math.floor(Math.random() * 900) + 100}.antigravity.dev`,
        status: "Active",
      };
      setTunnels(prev => [...prev, created]);
      setPort("");
      setLoading(false);
      showToast("✓ Port tunnel exposed successfully!");
    }, 1500);
  };

  const closeTunnel = (id) => {
    setTunnels(prev => prev.filter(t => t.id !== id));
    showToast("Tunnel closed.");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🚇 Tunnel Exposer & Port Mapper</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Tunnel local services to dynamic public HTTPS endpoints with secure forwarding configurations.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Controls */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Expose Local Port</div>
          <div style={{ marginBottom: 16 }}>
            <input
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="e.g. 8080"
              style={S.input}
            />
          </div>
          <button style={S.primaryBtn("#a78bfa")} onClick={exposePort} disabled={loading}>
            {loading ? "Exposing..." : "⚡ Expose Port"}
          </button>
        </div>

        {/* List */}
        <div style={S.tunnelsPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Active Port Tunnels ({tunnels.length})</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tunnels.map(t => (
              <div key={t.id} style={S.tunnelCard}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>Port Forward: {t.port}</div>
                  <div style={{ fontSize: 10, color: "#6e7191", fontFamily: "monospace" }}>{t.url}</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                    {t.status}
                  </span>
                  <button onClick={() => closeTunnel(t.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
