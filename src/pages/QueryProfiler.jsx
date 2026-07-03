import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 },
  queryPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  profilePanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", maxHeight: 200, overflowY: "auto" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  statCard: (slow) => ({ background: slow ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${slow ? "#ef4444" : "#10b981"}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 4 }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function QueryProfiler({ onNav }) {
  const [sql, setSql] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [execTime, setExecTime] = useState(0);
  const [explainPlan, setExplainPlan] = useState("");
  const [indexes, setIndexes] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runProfiler = () => {
    if (!sql.trim()) {
      showToast("Type query to profile!");
      return;
    }
    setLoading(true);
    setAnalyzed(false);

    setTimeout(() => {
      let duration = 120; // ms
      let plan = "";
      let recommendations = [];

      if (sql.toLowerCase().includes("join") || sql.toLowerCase().includes("where")) {
        duration = 450;
        plan = `-> Hash Join (cost=25.50..1205.10 rows=450)\n   -> Seq Scan on users u (cost=0.00..842.10)\n   -> Hash (cost=12.20..12.20)\n      -> Seq Scan on transactions t (cost=0.00..12.20)`;
        recommendations = [
          "⚠ Sequential Scan detected on large table 'users'! Recommend creating index: CREATE INDEX idx_users_id ON users(id);",
          "💡 Query join is un-indexed. Create foreign key indexes on transactions(user_id) to convert Hash Join to Index Scan."
        ];
      } else {
        duration = 15;
        plan = `-> Index Scan using pk_users on users (cost=0.15..8.10 rows=1)`;
        recommendations = [
          "✓ Query is highly optimized. Index scan utilizing primary key constraint."
        ];
      }

      setExecTime(duration);
      setExplainPlan(plan);
      setIndexes(recommendations);
      setAnalyzed(true);
      setLoading(false);
      showToast("Query profile compiled!");
    }, 1200);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗄️ Database Query Profiler</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Analyze SQL queries, inspect EXPLAIN plans, monitor execution latency, and get index recommendations.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Input Panel */}
        <div style={S.queryPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Profile SQL Query</div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Query SQL Input</label>
            <textarea
              value={sql}
              onChange={e => setSql(e.target.value)}
              placeholder="e.g. SELECT * FROM users u JOIN transactions t ON u.id = t.user_id WHERE u.status = 'active';"
              style={{ ...S.input, height: 180, fontFamily: "monospace", fontSize: 11, resize: "none" }}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={runProfiler} disabled={loading}>
            {loading ? "Profiling..." : "⚡ Run Profiler"}
          </button>
        </div>

        {/* Output Panel */}
        <div style={S.profilePanel}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Performance Analysis</div>

          {analyzed ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* Latency Stat */}
              <div style={S.statCard(execTime > 200)}>
                <span style={{ fontSize: 10, color: "#6e7191", textTransform: "uppercase" }}>Query Latency (ms)</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: execTime > 200 ? "#ef4444" : "#10b981" }}>
                  {execTime}ms — {execTime > 200 ? "Slow Query Warning" : "Optimal Speed"}
                </span>
              </div>

              {/* Explain plan */}
              <div>
                <label style={S.label}>EXPLAIN execution plan</label>
                <pre style={S.codeFrame}>
                  {explainPlan}
                </pre>
              </div>

              {/* Index Recs */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", marginBottom: 8, display: "block" }}>Database Index Recommendations</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {indexes.map((idx, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#a0aec0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                      {idx}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input SQL query statement and trigger latency performance checks...
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
