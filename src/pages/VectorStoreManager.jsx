import { useState, useCallback } from "react";

const INITIAL_DOCS = [
  { id: "d1", name: "saas_terms_revision.txt", size: "12.4 KB", chunks: 8, status: "embedded" },
  { id: "d2", name: "employee_handbook_2026.pdf", size: "142.0 KB", chunks: 42, status: "embedded" },
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  uploadPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  vectorPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  docCard: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center",
  },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function VectorStoreManager({ onNav }) {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSize, setNewDocSize] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const addDocument = () => {
    if (!newDocName) {
      showToast("Document Title is required!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created = {
        id: `d_${Date.now()}`,
        name: newDocName,
        size: newDocSize || "1.2 KB",
        chunks: Math.floor(Math.random() * 12) + 4,
        status: "embedded",
      };
      setDocs(prev => [...prev, created]);
      setNewDocName("");
      setNewDocSize("");
      setLoading(false);
      showToast("Document chunks uploaded & embedded!");
    }, 1500);
  };

  const executeSearch = () => {
    if (!searchQuery.trim()) {
      showToast("Type query to search!");
      return;
    }
    setLoading(true);
    setSearchResults([]);

    setTimeout(() => {
      setSearchResults([
        { text: "Excerpt from saas_terms: The customer indemnification cap is set to $10,000 for standard accounts.", score: "0.942 similarity" },
        { text: "Excerpt from employee_handbook: All data tunnels must route securely over regional gateways.", score: "0.781 similarity" }
      ]);
      setLoading(false);
      showToast("Semantic RAG query completed!");
    }, 1000);
  };

  const removeDoc = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    showToast("Document deleted.");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🧬 Vector Store Manager</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Ingest text documents, configure RAG chunking parameters, and perform semantic similarity vector searches.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.uploadPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Ingest Document</div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>File Name</label>
            <input
              value={newDocName}
              onChange={e => setNewDocName(e.target.value)}
              placeholder="e.g. support_faq.md"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>File Size</label>
            <input
              value={newDocSize}
              onChange={e => setNewDocSize(e.target.value)}
              placeholder="e.g. 15.4 KB"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={addDocument} disabled={loading}>
            {loading ? "Embedding..." : "⚡ Ingest & Embed"}
          </button>
        </div>

        {/* Vector Panel */}
        <div style={S.vectorPanel}>
          
          {/* Docs list */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6e7191", marginBottom: 12 }}>Ingested Vector Documents ({docs.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {docs.map(d => (
                <div key={d.id} style={S.docCard}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: "#6e7191" }}>Size: {d.size} | Chunks: {d.chunks}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                      {d.status}
                    </span>
                    <button onClick={() => removeDoc(d.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Search */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <label style={S.label}>Semantic Similarity Query</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Query vector database..."
                style={S.input}
              />
              <button style={S.primaryBtn("#22d3ee")} onClick={executeSearch} disabled={loading}>Search</button>
            </div>

            {searchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {searchResults.map((r, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee" }}>Match #{i+1}</span>
                      <span style={{ fontSize: 9, color: "#10b981" }}>{r.score}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>{r.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
