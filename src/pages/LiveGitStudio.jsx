import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  graphPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  commitCard: (selected) => ({
    background: selected ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${selected ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 12, padding: 14, cursor: "pointer", display: "flex", justifyContents: "space-between", alignItems: "center",
  }),
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function LiveGitStudio({ onNav }) {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commits, setCommits] = useState([
    { id: "c1", hash: "a8f2e41", author: "Alice", msg: "feat: add secure tunnels manager module", time: "2h ago" },
    { id: "c2", hash: "9d3c5f1", author: "Bob", msg: "fix: resolve EADDRINUSE server socket collisions", time: "4h ago" },
    { id: "c3", hash: "7b4c2b9", author: "Alice", msg: "refactor: simplify container AST nodes parser", time: "1d ago" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const checkoutCommit = (c) => {
    setSelectedCommit(c);
    showToast(`✓ Checked out head to commit hash: ${c.hash}`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🌿 Live Git Studio & Graph</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Inspect visual repository timelines, checkout previous commit trees, and review code diff versions.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Main commit timeline */}
        <div style={S.graphPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Repository Commit Timeline</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {commits.map(c => (
              <div key={c.id} onClick={() => checkoutCommit(c)} style={S.commitCard(selectedCommit?.id === c.id)}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{c.msg}</div>
                  <div style={{ fontSize: 10, color: "#6e7191" }}>Author: {c.author} | Hash: <code>{c.hash}</code></div>
                </div>
                <span style={{ fontSize: 10, color: "#a0aec0" }}>{c.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Commit Specs</div>
          
          {selectedCommit ? (
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, marginBottom: 6 }}>Hash: {selectedCommit.hash}</div>
              <div style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>"{selectedCommit.msg}"</div>
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Select a commit node on the left to inspect git logs details...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
