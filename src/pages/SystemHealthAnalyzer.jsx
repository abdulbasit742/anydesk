import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  alertCard: (active) => ({
    background: active ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
    border: `1px solid ${active ? "#ef4444" : "#10b981"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center"
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SystemHealthAnalyzer({ onNav }) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 58, temp: 62 });
  const [alerts, setAlerts] = useState([
    { id: 1, type: "High Temp Warning", details: "Node API-Server reached 82C.", active: true },
    { id: 2, type: "Disk Space Check", details: "Auth Database Disk is 92% full.", active: true },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const refreshMetrics = () => {
    setLoading(true);
    setTimeout(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30) + 20,
        ram: Math.floor(Math.random() * 20) + 40,
        temp: Math.floor(Math.random() * 15) + 50,
      });
      setLoading(false);
      showToast("✓ Telemetry specs refreshed successfully!");
    }, 1000);
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: false } : a));
    showToast("✓ Triggered alert resolution sequence!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🖥️ System Health Analyzer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Audit local hardware loads, inspect temperature ratings, and track warning signals.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Core telemetry */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Host Node Status</span>
            <button style={S.primaryBtn("#22d3ee")} onClick={refreshMetrics} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh Status"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "#a0aec0" }}>
            <div>CPU Load: <b>{metrics.cpu}%</b></div>
            <div>RAM Allocation: <b>{metrics.ram}%</b></div>
            <div>Core Temperature: <b style={{ color: metrics.temp > 60 ? "#ef4444" : "#10b981" }}>{metrics.temp}°C</b></div>
          </div>
        </div>

        {/* Alerts logs */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Active Warnings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map(a => (
              <div key={a.id} style={S.alertCard(a.active)}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{a.type}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>{a.details}</div>
                </div>

                {a.active && (
                  <button
                    onClick={() => resolveAlert(a.id)}
                    style={{ ...S.primaryBtn("#ef4444"), padding: "4px 10px", fontSize: 10 }}
                  >
                    Mute
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
