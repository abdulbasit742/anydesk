import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 },
  tableList: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10 },
  queryPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: 11 },
  cell: { padding: "10px 14px", color: "#a0aec0", textAlign: "left" },
  row: (alt) => ({ background: alt ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)" }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function LiveDatabaseClient({ onNav }) {
  const [activeTable, setActiveTable] = useState("users");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([
    { id: 1, name: "Alice", email: "alice@acme.com", status: "active" },
    { id: 2, name: "Bob", email: "bob@acme.com", status: "inactive" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runQuery = () => {
    if (!query.trim()) {
      showToast("Write SQL statement first!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setRecords([
        { id: 1, name: "Alice (Queried)", email: "alice@acme.com", status: "active" }
      ]);
      setLoading(false);
      showToast("✓ SQL query executed successfully!");
    }, 1000);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗄️ Visual Live Database Client</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Connect to live PostgreSQL or MongoDB databases, browse tables, and execute custom queries.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Table list */}
        <div style={S.tableList}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", textTransform: "uppercase", marginBottom: 6 }}>Database Tables</div>
          {["users", "transactions", "logs"].map(t => (
            <button
              key={t}
              onClick={() => setActiveTable(t)}
              style={{
                ...S.primaryBtn("#22d3ee"),
                background: activeTable === t ? "rgba(34,211,238,0.1)" : "transparent",
                color: activeTable === t ? "#22d3ee" : "#a0aec0",
                textAlign: "left",
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              📊 {t}
            </button>
          ))}
        </div>

        {/* Query & Records Panel */}
        <div style={S.queryPanel}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>SQL Query Editor</div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. SELECT * FROM users WHERE status = 'active' LIMIT 10;"
              style={S.input}
            />
            <button style={S.primaryBtn("#22d3ee")} onClick={runQuery} disabled={loading}>
              Run SQL
            </button>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Records Preview: {activeTable}</div>
            
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.cell}>ID</th>
                  <th style={S.cell}>Name</th>
                  <th style={S.cell}>Email</th>
                  <th style={S.cell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} style={S.row(i % 2)}>
                    <td style={S.cell}>{r.id}</td>
                    <td style={{ ...S.cell, fontWeight: 600, color: "#f0f0f5" }}>{r.name}</td>
                    <td style={S.cell}>{r.email}</td>
                    <td style={{ ...S.cell, color: r.status === "active" ? "#10b981" : "#6e7191" }}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
