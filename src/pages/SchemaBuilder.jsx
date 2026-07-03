import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  previewPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  fieldRow: { display: "flex", gap: 10, marginBottom: 8, alignItems: "center" },
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", maxHeight: 300, overflowY: "auto" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SchemaBuilder({ onNav }) {
  const [tableName, setTableName] = useState("users");
  const [fields, setFields] = useState([
    { name: "id", type: "SERIAL PRIMARY KEY" },
    { name: "username", type: "VARCHAR(255)" },
  ]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("VARCHAR(255)");
  const [sqlOutput, setSqlOutput] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const addField = () => {
    if (!newFieldName.trim()) {
      showToast("Field Name is required!");
      return;
    }
    setFields(prev => [...prev, { name: newFieldName.trim(), type: newFieldType }]);
    setNewFieldName("");
    showToast("Field definition added!");
  };

  const removeField = (idx) => {
    setFields(prev => prev.filter((_, i) => i !== idx));
    showToast("Field removed.");
  };

  const generateSchema = () => {
    const fieldsSql = fields.map(f => `  ${f.name} ${f.type}`).join(",\n");
    const sql = `CREATE TABLE ${tableName} (\n${fieldsSql}\n);`;
    setSqlOutput(sql);
    showToast("SQL Schema generated!");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗄️ Database Schema Builder</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Design relational database schemas and generate SQL table definition scripts.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Table Configuration</div>
          
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Table Name</label>
            <input
              value={tableName}
              onChange={e => setTableName(e.target.value)}
              placeholder="users"
              style={S.input}
            />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, marginBottom: 14 }}>
            <label style={S.label}>Add Table Column</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                placeholder="Column Name (e.g. email)"
                style={S.input}
              />
              <select
                value={newFieldType}
                onChange={e => setNewFieldType(e.target.value)}
                style={S.input}
              >
                <option value="VARCHAR(255)">VARCHAR(255)</option>
                <option value="INT">INT (Integer)</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="TIMESTAMP">TIMESTAMP</option>
                <option value="JSONB">JSONB</option>
              </select>
              <button style={S.primaryBtn("#22d3ee")} onClick={addField}>
                + Add Column
              </button>
            </div>
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={generateSchema}>
            Generate SQL Script
          </button>
        </div>

        {/* Preview Panel */}
        <div style={S.previewPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 10 }}>Columns Registry</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {fields.map((f, idx) => (
              <div key={idx} style={S.fieldRow}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#22d3ee", width: 140 }}>{f.name}</span>
                <span style={{ fontSize: 11, color: "#6e7191", flex: 1 }}>{f.type}</span>
                <button
                  onClick={() => removeField(idx)}
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {sqlOutput && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6e7191" }}>SQL CREATE TABLE Statement</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(sqlOutput); showToast("SQL Copied!"); }}
                  style={{ ...S.primaryBtn("#10b981"), padding: "4px 10px", fontSize: 9 }}
                >
                  copy
                </button>
              </div>
              <pre style={S.codeFrame}>
                {sqlOutput}
              </pre>
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
