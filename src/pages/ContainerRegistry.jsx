import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 },
  reposList: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10 },
  tagsPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  tagCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10 },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function ContainerRegistry({ onNav }) {
  const [activeRepo, setActiveRepo] = useState("auth-api");
  const [tags, setTags] = useState([
    { version: "v1.2.0", size: "142 MB", date: "2h ago", status: "Ready" },
    { version: "v1.1.9", size: "141 MB", date: "1d ago", status: "Archived" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerDeploy = (version) => {
    showToast(`✓ Deployment request for tag ${version} pushed to multi-cloud provisioner!`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style style={S.title}>🐋 Container Registry Browser</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Inspect active docker image repositories, inspect tag versions, and verify size payloads.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Repo list */}
        <div style={S.reposList}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", textTransform: "uppercase", marginBottom: 6 }}>Repositories</div>
          {["auth-api", "payment-service", "web-front"].map(r => (
            <button
              key={r}
              onClick={() => setActiveRepo(r)}
              style={{
                ...S.primaryBtn("#22d3ee"),
                background: activeRepo === r ? "rgba(34,211,238,0.1)" : "transparent",
                color: activeRepo === r ? "#22d3ee" : "#a0aec0",
                textAlign: "left",
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              🐋 {r}
            </button>
          ))}
        </div>

        {/* Tags list */}
        <div style={S.tagsPanel}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>Available Tags: {activeRepo}</div>
          
          <div>
            {tags.map((t, idx) => (
              <div key={idx} style={S.tagCard}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{t.version}</div>
                  <div style={{ fontSize: 10, color: "#6e7191" }}>Size: {t.size} | Created: {t.date}</div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: t.status === "Ready" ? "#10b981" : "#6e7191", background: "rgba(255,255,255,0.02)", padding: "2px 6px", borderRadius: 4 }}>
                    {t.status}
                  </span>
                  <button style={S.primaryBtn("#22d3ee")} onClick={() => triggerDeploy(t.version)}>Deploy Version</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
