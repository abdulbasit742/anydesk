import { useState, useCallback } from "react";

const INITIAL_RECORDINGS = [
  { id: "r1", title: "Support Session - Thomas Anderson", date: "2026-06-29", duration: "12m 40s", size: "24.5 MB" },
  { id: "r2", title: "HQ Server Configuration Audit", date: "2026-06-28", duration: "45m 12s", size: "112.8 MB" },
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  playerPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  videoPlaceholder: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, height: 280, display: "flex", alignItems: "center", justifyContents: "center", fontSize: 13, color: "#6e7191", position: "relative" },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  recCard: (active) => ({
    background: active ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${active ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.25s",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SessionRecorder({ onNav }) {
  const [recordings, setRecordings] = useState(INITIAL_RECORDINGS);
  const [activeRec, setActiveRec] = useState(INITIAL_RECORDINGS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recTitle, setRecTitle] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      const created = {
        id: `r_${Date.now()}`,
        title: recTitle || `Session Recording #${recordings.length + 1}`,
        date: new Date().toISOString().split("T")[0],
        duration: "03m 15s",
        size: "7.2 MB",
      };
      setRecordings(prev => [created, ...prev]);
      setActiveRec(created);
      setIsRecording(false);
      setRecTitle("");
      showToast("Session recording saved successfully!");
    } else {
      setIsRecording(true);
      showToast("Recording started...");
    }
  };

  const deleteRecording = (id, e) => {
    e.stopPropagation();
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (activeRec?.id === id) {
      setActiveRec(null);
    }
    showToast("Recording deleted.");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📼 Session Recorder</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Record active remote desktop and WebRTC sessions for audit reviews, logs, or education training.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Active Player Panel */}
        <div style={S.playerPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {activeRec ? activeRec.title : "No Recording Selected"}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {isRecording ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#ef4444" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
                  <span>REC 03:15</span>
                </div>
              ) : null}
              <button
                style={S.primaryBtn(isRecording ? "#ef4444" : "#10b981")}
                onClick={toggleRecording}
              >
                {isRecording ? "⏹ Stop Recording" : "⏺ Start Session Record"}
              </button>
            </div>
          </div>

          {/* Player Screen Mock */}
          <div style={S.videoPlaceholder}>
            {isRecording ? (
              <span style={{ color: "#ef4444", fontWeight: 700 }}>🎥 Live Stream Recording Active...</span>
            ) : activeRec ? (
              <span style={{ color: "#a78bfa" }}>▶ Video Playback Node Ready ({activeRec.duration})</span>
            ) : (
              <span>Select recording block from logs...</span>
            )}
          </div>
        </div>

        {/* Sidebar logs */}
        <div style={S.sidebar}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Recorded Sessions ({recordings.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recordings.map(r => {
                const active = activeRec?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => { if (!isRecording) setActiveRec(r); }}
                    style={S.recCard(active)}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{r.title}</div>
                      <div style={{ fontSize: 10, color: "#6e7191" }}>{r.date} | {r.size}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#22d3ee" }}>{r.duration}</span>
                      <button onClick={(event) => deleteRecording(r.id, event)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
