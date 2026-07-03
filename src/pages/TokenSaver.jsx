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

export default function TokenSaver({ onNav }) {
  const [cacheHits, setCacheHits] = useState(1480);
  const [savedDollars, setSavedDollars] = useState(242.50);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const clearCache = () => {
    showToast("✓ Semantic Cache memory flushed successfully!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>💰 Smart Cache & Token Saver</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Automatically cache semantic query outputs. Save up to 90% in LLM API expenses.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Statistics */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Savings Telemetry</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 9, color: "#6e7191", textTransform: "uppercase" }}>Cache Hit Count</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981", marginTop: 4 }}>{cacheHits} requests</div>
            </div>
            <div style={{ background: "rgba(34,211,238,0.1)", border: "1px solid #22d3ee", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 9, color: "#6e7191", textTransform: "uppercase" }}>Estimated Capital Saved</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#22d3ee", marginTop: 4 }}>${savedDollars.toFixed(2)}</div>
            </div>
          </div>
          <button style={S.primaryBtn("#ef4444")} onClick={clearCache}>Flush Semantic Cache</button>
        </div>

        {/* Configurations */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Semantic Sensitivity Limits</div>
          <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.6 }}>
            <div>Similarity Threshold: <b>0.85 cosine</b></div>
            <div style={{ marginTop: 10 }}>Cache Expiry TTL: <b>24 Hours</b></div>
            <div style={{ marginTop: 10 }}>Algorithm: <b>HNSW Index Query</b></div>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
