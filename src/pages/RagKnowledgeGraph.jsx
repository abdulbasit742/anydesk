import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  canvasPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  nodeDot: (selected) => ({
    width: 14, height: 14, borderRadius: "50%",
    background: selected ? "#22d3ee" : "#a78bfa",
    border: selected ? "2px solid #fff" : "none",
    cursor: "pointer", display: "inline-block", position: "absolute",
    boxShadow: selected ? "0 0 10px #22d3ee" : "none",
    transition: "all 0.2s",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function RagKnowledgeGraph({ onNav }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([
    { id: 1, x: 80, y: 120, text: "Customer terms set liability indemnifications cap to $10k.", file: "saas_terms.txt" },
    { id: 2, x: 220, y: 70, text: "Employee handbook mandates regional secure tunnels.", file: "employee_handbook.pdf" },
    { id: 3, x: 160, y: 210, text: "Wake-on-LAN hooks wake server clusters using MAC broadcasts.", file: "wake_on_lan.md" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const selectNode = (n) => {
    setSelectedNode(n);
    showToast(`✓ Selected RAG chunk node from ${n.file}!`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🧠 RAG Knowledge Graph</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Visualize how semantic document segments, code files, and texts cluster inside vector database space.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Visual 2D coordinate clusters space */}
        <div style={S.canvasPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Semantic Embeddings Cluster Map</div>
          
          <div style={{ height: 320, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, position: "relative" }}>
            {nodes.map(n => (
              <div
                key={n.id}
                onClick={() => selectNode(n)}
                style={{
                  ...S.nodeDot(selectedNode?.id === n.id),
                  left: n.x,
                  top: n.y,
                }}
              />
            ))}
            <span style={{ position: "absolute", bottom: 12, left: 16, fontSize: 10, color: "#6e7191" }}>
              Click any colored node dot to inspect semantic text contents...
            </span>
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Embed Chunk Details</div>
          
          {selectedNode ? (
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, marginBottom: 6 }}>Source: {selectedNode.file}</div>
              <div style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>"{selectedNode.text}"</div>
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              No chunk node selected. Click a dot on the left.
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
