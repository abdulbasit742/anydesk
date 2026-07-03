import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  deadlockCard: (resolved) => ({
    background: resolved ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    border: `1px solid ${resolved ? "#10b981" : "#ef4444"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center"
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function DbPerformance({ onNav }) {
  const [pools, setPools] = useState({ active: 14, idle: 6, max: 20 });
  const [deadlockResolved, setDeadlockResolved] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const resolveDeadlock = () => {
    setDeadlockResolved(true);
    showToast("✓ SQL transaction deadlock cleared successfully!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗄️ Database Connection Pools Monitor</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Verify PostgreSQL active connection pool limits, trace transaction locks, and clear query blocks.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Pool telemetry */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Connection Pool Telemetry</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "#a0aec0" }}>
            <div>Active Connections: <b>{pools.active} / {pools.max}</b></div>
            <div>Idle Connections: <b>{pools.idle}</b></div>
            <div style={{ marginTop: 10 }}>Pool Capacity status: <b style={{ color: "#10b981" }}>Optimal</b></div>
          </div>
        </div>

        {/* Lock logs */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Transaction Lock Warnings</div>
          
          <div style={S.deadlockCard(deadlockResolved)}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>
                {deadlockResolved ? "All Locks Cleared" : "Deadlock: transaction #894"}
              </div>
              <div style={{ fontSize: 9, color: "#6e7191" }}>
                {deadlockResolved ? "Connection pools are clean." : "PID 983 blocked by PID 102."}
              </div>
            </div>

            {!deadlockResolved && (
              <button
                onClick={resolveDeadlock}
                style={{ ...S.primaryBtn("#ef4444"), padding: "4px 10px", fontSize: 10 }}
              >
                Kill Block PID
              </button>
            )}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
