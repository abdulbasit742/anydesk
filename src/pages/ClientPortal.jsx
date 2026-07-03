import { useState, useCallback } from "react";

const PRESETS = [
  { id: "p1", name: "Acme Agency Portal", client: "Acme Corp", agent: "SEO Specialist", color: "#10b981", domain: "acme.myportal.ai" },
  { id: "p2", name: "Delta Growth Hub", client: "Delta Inc", agent: "Lead Gen Strategist", color: "#a78bfa", domain: "delta.myportal.ai" },
];

const AGENTS = ["SEO Specialist", "Lead Gen Strategist", "Customer Support Bot", "Financial Auditor", "Legal Reviewer"];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  previewPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  chatArea: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, height: 280, display: "flex", flexDirection: "column", justifyContents: "space-between", padding: 12 },
  chatBubble: (isUser) => ({ background: isUser ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.03)", alignSelf: isUser ? "flex-end" : "flex-start", padding: "8px 14px", borderRadius: 10, fontSize: 11, maxWidth: "75%", marginBottom: 8 }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function ClientPortal({ onNav }) {
  const [portals, setPortals] = useState(PRESETS);
  const [activePortal, setActivePortal] = useState(PRESETS[0]);
  const [newPortal, setNewPortal] = useState({ name: "", client: "", agent: AGENTS[0], color: "#10b981", domain: "" });
  const [chatLog, setChatLog] = useState([
    { isUser: false, text: "Hello! I am your custom-branded assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const createPortal = () => {
    if (!newPortal.name || !newPortal.client || !newPortal.domain) {
      showToast("All fields are required!");
      return;
    }
    const created = {
      id: `p_${Date.now()}`,
      ...newPortal,
    };
    setPortals(prev => [...prev, created]);
    setActivePortal(created);
    setNewPortal({ name: "", client: "", agent: AGENTS[0], color: "#10b981", domain: "" });
    showToast("White-Label Portal generated!");
    setChatLog([
      { isUser: false, text: `Hello! I am your custom-branded ${created.agent} assistant. How can I help Delta/Acme today?` }
    ]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatLog(prev => [...prev, { isUser: true, text: chatInput }]);
    const query = chatInput;
    setChatInput("");

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { isUser: false, text: `As your custom ${activePortal.agent}, I've processed that query. We can coordinate with our API endpoint to deliver structured answers.` }
      ]);
    }, 800);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🏢 White-Label Client Portals</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Let clients access custom-branded chatbots under your custom domain namespace.</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Create Client Portal</div>
          
          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Portal Name</label>
            <input
              value={newPortal.name}
              onChange={e => setNewPortal(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Acme Marketing Portal"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Client Name</label>
            <input
              value={newPortal.client}
              onChange={e => setNewPortal(p => ({ ...p, client: e.target.value }))}
              placeholder="e.g. Acme Corporation"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Select AI Agent Role</label>
            <select
              value={newPortal.agent}
              onChange={e => setNewPortal(p => ({ ...p, agent: e.target.value }))}
              style={S.input}
            >
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Custom Brand Color</label>
            <input
              type="color"
              value={newPortal.color}
              onChange={e => setNewPortal(p => ({ ...p, color: e.target.value }))}
              style={{ ...S.input, height: 36, padding: 2, cursor: "pointer" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Custom Domain Namespace</label>
            <input
              value={newPortal.domain}
              onChange={e => setNewPortal(p => ({ ...p, domain: e.target.value }))}
              placeholder="acme.myportal.ai"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn(newPortal.color || "#a78bfa")} onClick={createPortal}>
            Generate Client Portal
          </button>
        </div>

        {/* Preview Panel */}
        <div style={S.previewPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: activePortal.color }} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{activePortal.name} Preview</span>
            </div>
            <span style={{ fontSize: 10, color: "#6e7191" }}>Target: <u>{activePortal.domain}</u></span>
          </div>

          {/* Chat Preview Frame */}
          <div style={S.chatArea}>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {chatLog.map((c, i) => (
                <div key={i} style={S.chatBubble(c.isUser)}>
                  {c.text}
                </div>
              ))}
            </div>
            
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                placeholder="Client message..."
                style={S.input}
              />
              <button style={S.primaryBtn(activePortal.color)} onClick={sendChatMessage}>Send</button>
            </div>
          </div>

          {/* Active Portals list */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", marginBottom: 10 }}>Active Client Portals</div>
            <div style={{ display: "flex", gap: 10 }}>
              {portals.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePortal(p);
                    setChatLog([
                      { isUser: false, text: `Hello! I am your custom-branded ${p.agent} assistant. How can I help ${p.client} today?` }
                    ]);
                  }}
                  style={{
                    ...S.primaryBtn(p.color),
                    background: activePortal.id === p.id ? `linear-gradient(135deg, ${p.color}, ${p.color}b3)` : "rgba(255,255,255,0.02)",
                    border: activePortal.id === p.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: activePortal.id === p.id ? "#fff" : "#a0aec0",
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
