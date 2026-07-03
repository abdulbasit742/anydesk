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

export default function BackupRestore({ onNav }) {
  const [backups, setBackups] = useState([
    { id: 1, name: "Daily Auto Backup", time: "12h ago", size: "42.4 MB" },
    { id: 2, name: "Manual Pre-Refactor", time: "2d ago", size: "41.8 MB" },
  ]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerBackup = () => {
    setLoading(true);
    setTimeout(() => {
      const created = {
        id: Date.now(),
        name: "Immediate SQL Backup",
        time: "Just now",
        size: "42.5 MB",
      };
      setBackups(prev => [created, ...prev]);
      setLoading(false);
      showToast("✓ SQL database backup dump created successfully!");
    }, 1500);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🗄️ Database Backup & Restore</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Schedule database backups, review storage compression ratios, and trigger instant restore checkpoints.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Trigger */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Backup Management</div>
          <p style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5, marginBottom: 16 }}>
            Run database backup procedures or check current schemas compression ratings to secure transactions.
          </p>
          <button style={S.primaryBtn("#a78bfa")} onClick={triggerBackup} disabled={loading}>
            {loading ? "Backing up..." : "⚡ Run Backup Dump"}
          </button>
        </div>

        {/* Backups List */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Available Restore Checkpoints ({backups.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {backups.map(b => (
              <div key={b.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee" }}>{b.name}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>Size: {b.size} | {b.time}</div>
                </div>
                <button
                  onClick={() => showToast(`✓ Initiated data restore checkpoint: ${b.name}`)}
                  style={{ ...S.primaryBtn("#10b981"), padding: "4px 10px", fontSize: 10 }}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
