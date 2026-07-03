import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  pingPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  regionCard: (speed) => ({
    background: speed < 50 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    border: `1px solid ${speed < 50 ? "#10b981" : "#ef4444"}`,
    borderRadius: 12, padding: 14, display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 12,
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function GeoPingTester({ onNav }) {
  const [testing, setTesting] = useState(false);
  const [regions, setRegions] = useState([
    { id: 1, name: "US East (Virginia)", latency: 24, load: "12%" },
    { id: 2, name: "AP East (Tokyo)", latency: 142, load: "34%" },
    { id: 3, name: "EU Central (Frankfurt)", latency: 45, load: "8%" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerTest = () => {
    setTesting(true);
    setTimeout(() => {
      setRegions(prev => prev.map(r => ({
        ...r,
        latency: r.latency + Math.floor(Math.random() * 10 - 5),
      })));
      setTesting(false);
      showToast("✓ Global latency speed checks completed!");
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🌐 Global Network Ping Tester</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Verify latency values and routing paths from international edge network server locations.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Main list */}
        <div style={S.pingPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Edge Network Latency Logs</span>
            <button style={S.primaryBtn("#22d3ee")} onClick={triggerTest} disabled={testing}>
              {testing ? "Testing Latencies..." : "▶ Test Ping Speeds"}
            </button>
          </div>

          <div>
            {regions.map(r => (
              <div key={r.id} style={S.regionCard(r.latency)}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 9, color: "#a0aec0" }}>Load: {r.load}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: r.latency < 50 ? "#10b981" : "#ef4444" }}>
                  {r.latency}ms
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Summary */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Telemetry Insights</div>
          <p style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5 }}>
            Ensure routing routes are optimized. Select nearest servers to maintain minimum latencies.
          </p>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
