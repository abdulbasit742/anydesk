import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 24 },
  mapPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function ActivityPulse({ onNav }) {
  const [pulseActive, setPulseActive] = useState(true);
  const [activeNodes, setActiveNodes] = useState([
    { id: 1, region: "US East (N. Virginia)", ping: "38ms", sessions: 42, load: "24%" },
    { id: 2, region: "EU West (Dublin)", ping: "84ms", sessions: 18, load: "12%" },
    { id: 3, region: "AP South (Mumbai)", ping: "142ms", sessions: 67, load: "56%" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const refreshPulse = () => {
    setActiveNodes(prev => prev.map(n => ({
      ...n,
      ping: `${Math.floor(Math.random() * 60) + 20}ms`,
      load: `${Math.floor(Math.random() * 40) + 10}%`,
    })));
    showToast("✓ Active network nodes state refreshed!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🌐 Network Activity Pulse</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Monitor connection signals, server node coordinates load factors, and latency values.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Visual Map Mock representing data streams */}
        <div style={S.mapPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Regional Data Flow Visualizer</div>
          <div style={{ height: 260, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, display: "flex", alignItems: "center", justifyContents: "center", position: "relative" }}>
            {/* SVG Visual mock map coordinates */}
            <svg width="400" height="200" viewBox="0 0 400 200">
              <circle cx="100" cy="80" r="6" fill="#22d3ee" />
              <circle cx="260" cy="90" r="6" fill="#a78bfa" />
              <circle cx="180" cy="140" r="6" fill="#10b981" />
              <path d="M100 80 Q 180 40 260 90" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M260 90 Q 220 120 180 140" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M180 140 Q 140 110 100 80" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>
            <span style={{ position: "absolute", bottom: 12, left: 16, fontSize: 10, color: "#6e7191" }}>Active global edge network loops: <b>3</b></span>
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Regional Nodes</span>
            <button
              onClick={refreshPulse}
              style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "rgba(255,255,255,0.05)", color: "#a0aec0", fontSize: 10, cursor: "pointer" }}
            >
              Refresh
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeNodes.map(n => (
              <div key={n.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContents: "space-between", fontSize: 11, fontWeight: 700, color: "#f0f0f5" }}>
                  <span>{n.region}</span>
                  <span style={{ color: "#22d3ee" }}>{n.ping}</span>
                </div>
                <div style={{ display: "flex", justifyContents: "space-between", fontSize: 9, color: "#6e7191", marginTop: 4 }}>
                  <span>Active Sessions: <b>{n.sessions}</b></span>
                  <span>CPU Load: <b>{n.load}</b></span>
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
