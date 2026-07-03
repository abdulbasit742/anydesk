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

export default function CloudCostAdvisor({ onNav }) {
  const [savings, setSavings] = useState(240); // $
  const [recommendations, setRecommendations] = useState([
    { id: 1, resource: "AWS EC2 instance i-091a", action: "Downsize from t3.xlarge to t3.medium", status: "Open" },
    { id: 2, resource: "GCP Cloud SQL database", action: "Convert single zone to spot pricing", status: "Open" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const applyRecommendation = (id) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
    setSavings(prev => prev + 80);
    showToast("✓ Applied cost resizing recommendation! Savings updated.");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>💰 Cloud Cost & Resource Optimizer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Scan connected cloud services to fetch underutilized sizing limits and reduce monthly server expenditures.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Cost stats */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Monthly Optimization Telemetry</div>
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: "#6e7191", textTransform: "uppercase" }}>Estimated Monthly Savings</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", marginTop: 4 }}>${savings} / month</div>
          </div>
          <p style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>
            Verify server resource loads. Automatically resize instances to ensure minimal idle overheads.
          </p>
        </div>

        {/* Action recommendations */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Resizing Recommendations ({recommendations.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recommendations.map(r => (
              <div key={r.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{r.resource}</div>
                  <div style={{ fontSize: 9, color: "#6e7191", marginTop: 2 }}>{r.action}</div>
                </div>
                <button
                  onClick={() => applyRecommendation(r.id)}
                  style={{ ...S.primaryBtn("#22d3ee"), padding: "4px 10px", fontSize: 10 }}
                >
                  Apply
                </button>
              </div>
            ))}
            {recommendations.length === 0 && (
              <div style={{ color: "#10b981", fontSize: 12, fontStyle: "italic" }}>
                ● All cloud servers are fully optimized. Great job!
              </div>
            )}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
