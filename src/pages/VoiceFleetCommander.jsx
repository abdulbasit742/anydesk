import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  commandPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  transcriptionBox: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, minHeight: 80, fontSize: 12, color: "#a0aec0", lineHeight: 1.5, marginBottom: 16 },
  nodeLog: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, fontSize: 11, fontFamily: "monospace", color: "#22d3ee" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function VoiceFleetCommander({ onNav }) {
  const [listening, setListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [logs, setLogs] = useState(["Fleet Voice Commander initialized. Ready for speech..."]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const startVoiceInput = () => {
    setListening(true);
    setTranscription("Listening to speech frequencies...");
    
    // Simulate speech detection
    setTimeout(() => {
      const phrases = [
        "restart all connected lab nodes",
        "flush memory cache on active hosts",
        "run port shield security scan"
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setTranscription(`"${randomPhrase}"`);
      setListening(false);
      
      // Execute command log
      setLogs(prev => [
        ...prev,
        `[Voice Command] Detected: "${randomPhrase}"`,
        `[Orchestrator] Dispatching tasks to connected fleet devices...`,
        `✓ PC-01 (Teacher Node): Command completed.`,
        `✓ PC-02 (Student Lab): Command completed.`
      ]);
      showToast("✓ Voice command compiled and executed!");
    }, 2000);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🎙️ Voice-Controlled AI Fleet Commander</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Capture local speech patterns, convert commands via AI, and execute bulk tasks on all active network nodes.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Command capture */}
        <div style={S.commandPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Speech Transcription Console</div>
          
          <div style={S.transcriptionBox}>
            {transcription || "Click the microphone button below and dictate commands (e.g. 'restart all connected lab nodes')."}
          </div>

          <button
            style={S.primaryBtn(listening ? "#ef4444" : "#a78bfa")}
            onClick={startVoiceInput}
            disabled={listening}
          >
            {listening ? "🎙️ Listening to Voice..." : "🎙️ Record Voice Command"}
          </button>
        </div>

        {/* Fleet Logs */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Execution Logs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 300, overflowY: "auto" }}>
            {logs.map((log, idx) => (
              <div key={idx} style={S.nodeLog}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
