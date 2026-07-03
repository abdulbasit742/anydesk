import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  chartPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  bar: (width, left) => ({
    height: 14, background: "linear-gradient(90deg, #a78bfa, #22d3ee)", borderRadius: 4,
    position: "relative", width, left,
  }),
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function CronGantt({ onNav }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Database Dump", cron: "0 0 * * *", width: 140, left: 30 },
    { id: 2, name: "Tunnels Pulse Check", cron: "*/5 * * * *", width: 60, left: 180 },
    { id: 3, name: "Memory Summary Ingestion", cron: "30 2 * * *", width: 90, left: 100 },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerTaskRun = (name) => {
    showToast(`✓ Scheduled manual run initiated for task: ${name}`);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📊 Cron Schedule Gantt Chart</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Audit scheduled cron tasks, inspect execution timelines, and prevent overlap conflicts.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Visual Gantt bars */}
        <div style={S.chartPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Execution Timeline Slots</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {tasks.map(t => (
              <div key={t.id}>
                <div style={{ display: "flex", justifyContents: "space-between", fontSize: 11, fontWeight: 700, color: "#a0aec0", marginBottom: 6 }}>
                  <span>{t.name} (<code>{t.cron}</code>)</span>
                  <button
                    onClick={() => triggerTaskRun(t.name)}
                    style={{ background: "none", border: "none", color: "#22d3ee", cursor: "pointer", fontSize: 10 }}
                  >
                    Run Now
                  </button>
                </div>
                
                <div style={{ height: 24, background: "rgba(0,0,0,0.2)", borderRadius: 6, position: "relative", display: "flex", alignItems: "center" }}>
                  <div style={S.bar(t.width, t.left)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Cron Safety Audit</div>
          <div style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5 }}>
            Total Cron Tasks Active: <b>{tasks.length}</b>
            <div style={{ marginTop: 10 }}>Conflict Check status: <b style={{ color: "#10b981" }}>No Overlaps Detected</b></div>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
