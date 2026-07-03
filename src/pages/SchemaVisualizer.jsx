import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  canvasPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  tableNode: (selected) => ({
    background: selected ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${selected ? "#22d3ee" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 12, padding: 14, width: 150, cursor: "pointer", position: "absolute",
    transition: "all 0.2s",
  }),
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SchemaVisualizer({ onNav }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([
    { id: "t1", name: "users", x: 40, y: 60, fields: ["id (PK)", "name", "email", "status"] },
    { id: "t2", name: "transactions", x: 260, y: 120, fields: ["id (PK)", "user_id (FK)", "amount", "created_at"] },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const selectNode = (t) => {
    setSelectedTable(t);
    showToast(`✓ Selected ERD schema details for table: ${t.name}`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗺️ Database Schema ERD Visualizer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Verify keys bindings, foreign constraints links, and tables metadata mapping visually.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* ERD Canvas */}
        <div style={S.canvasPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Interactive Relationship Canvas</div>
          
          <div style={{ height: 320, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, position: "relative" }}>
            {tables.map(t => (
              <div
                key={t.id}
                onClick={() => selectNode(t)}
                style={{
                  ...S.tableNode(selectedTable?.id === t.id),
                  left: t.x,
                  top: t.y,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: "#22d3ee", borderBottom: "1px solid rgba(255,255,255,0.08)", pb: 4, mb: 4 }}>
                  🔑 {t.name}
                </div>
                <div style={{ fontSize: 9, color: "#a0aec0" }}>
                  {t.fields.slice(0, 2).map((f, i) => <div key={i}>{f}</div>)}
                  {t.fields.length > 2 && <div>...</div>}
                </div>
              </div>
            ))}

            <span style={{ position: "absolute", bottom: 12, left: 16, fontSize: 10, color: "#6e7191" }}>
              Click table boxes coordinates to inspect fields properties lists...
            </span>
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Fields Registry</div>
          
          {selectedTable ? (
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, marginBottom: 8 }}>Table: {selectedTable.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selectedTable.fields.map((f, idx) => (
                  <div key={idx} style={{ fontSize: 11, color: "#a0aec0", fontFamily: "monospace" }}>
                    ● {f}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Select table node on the left to verify constraint loops...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
