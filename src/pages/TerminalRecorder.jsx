import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  recordPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  terminalBox: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#22d3ee", minHeight: 200 },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  sessionCard: (active) => ({
    background: active ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${active ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", cursor: "pointer"
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function TerminalRecorder({ onNav }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([
    { id: 1, name: "Vercel Deploy run", time: "2h ago", steps: ["npm run build", "vercel --prod", "✓ Deployment succeeded."] },
    { id: 2, name: "Docker Container assembly", time: "1d ago", steps: ["docker build -t app:latest .", "docker push hub.docker.com/app:latest"] },
  ]);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const playSession = (s) => {
    setSelectedSession(s);
    setPlaying(true);
    setCurrentStep(">>> Initiating session replay...");
    
    setTimeout(() => {
      setCurrentStep(`$ ${s.steps[0]}`);
      setTimeout(() => {
        setCurrentStep(prev => prev + `\n$ ${s.steps[1] || ""}`);
        setPlaying(false);
        showToast("✓ Terminal session playback finished!");
      }, 1000);
    }, 1000);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📼 Terminal Session Recorder</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Capture interactive SSH console sessions command sequences and review step histories.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Playback terminal screen */}
        <div style={S.recordPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 16 }}>Interactive Playback Console</div>
          
          <pre style={S.terminalBox}>
            {currentStep || "Select a session from the sidebar to inspect command playbacks..."}
          </pre>
        </div>

        {/* Sessions list */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Recorded Step Sessions</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => playSession(s)} style={S.sessionCard(selectedSession?.id === s.id)}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>Steps: {s.steps.length} | {s.time}</div>
                </div>
                <span style={{ fontSize: 10, color: "#22d3ee" }}>▶</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
