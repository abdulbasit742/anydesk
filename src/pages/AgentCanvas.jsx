import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 },
  channelList: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10 },
  chatPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", justifyContents: "space-between", height: 460 },
  
  chatArea: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10, marginBottom: 12 },
  bubble: (agent) => {
    const colors = { Developer: "rgba(34,211,238,0.15)", Designer: "rgba(167,139,250,0.15)", Copywriter: "rgba(16,185,129,0.15)" };
    return {
      background: colors[agent] || "rgba(255,255,255,0.03)", alignSelf: "flex-start", padding: "8px 14px", borderRadius: 10, fontSize: 11, maxWidth: "80%"
    };
  },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function AgentCanvas({ onNav }) {
  const [activeChannel, setActiveChannel] = useState("development");
  const [chatLog, setChatLog] = useState([
    { agent: "Developer", text: "I've completed setup on the remote tunnels." },
    { agent: "Designer", text: "Looks good. I will adjust spacing on the sidebar container blocks." },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const sendQuery = () => {
    if (!inputVal.trim()) return;
    const query = inputVal;
    setInputVal("");
    setChatLog(prev => [...prev, { agent: "Manager", text: query }]);

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { agent: "Developer", text: `Understood. Analyzing code blocks to deliver ${query} adjustments now.` }
      ]);
    }, 800);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>👥 Multi-Agent Chat Canvas</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Orchestrate multiple specialized agents communicating collectively to solve tasks.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Channel list */}
        <div style={S.channelList}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", textTransform: "uppercase", marginBottom: 6 }}>Agent Channels</div>
          {["development", "marketing", "logistics"].map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{
                ...S.primaryBtn("#22d3ee"),
                background: activeChannel === ch ? "rgba(34,211,238,0.1)" : "transparent",
                color: activeChannel === ch ? "#22d3ee" : "#a0aec0",
                textAlign: "left",
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              # {ch}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div style={S.chatPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>#{activeChannel} Group Chat</div>

          <div style={S.chatArea}>
            {chatLog.map((c, i) => (
              <div key={i} style={S.bubble(c.agent)}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#22d3ee", display: "block", marginBottom: 4 }}>{c.agent}</span>
                {c.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendQuery()}
              placeholder="Broadcasting instruction..."
              style={S.input}
            />
            <button style={S.primaryBtn("#22d3ee")} onClick={sendQuery}>Broadcast</button>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
