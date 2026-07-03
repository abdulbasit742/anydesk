import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  chatPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", justifyContents: "space-between", height: 460 },
  
  chatArea: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10, marginBottom: 12 },
  bubble: (isUser) => ({ background: isUser ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.03)", alignSelf: isUser ? "flex-end" : "flex-start", padding: "8px 14px", borderRadius: 10, fontSize: 11, maxWidth: "80%" }),
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function DocQA({ onNav }) {
  const [docName, setDocName] = useState("");
  const [chatLog, setChatLog] = useState([
    { isUser: false, text: "Upload a document to begin conversation analysis." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const uploadDoc = () => {
    if (!docName) {
      showToast("Please write file name first!");
      return;
    }
    setChatLog([
      { isUser: false, text: `Loaded document: ${docName}. Ask me anything about its contents!` }
    ]);
    showToast(`✓ Ingested ${docName} successfully!`);
  };

  const sendQuery = () => {
    if (!chatInput.trim()) return;
    setChatLog(prev => [...prev, { isUser: true, text: chatInput }]);
    const query = chatInput;
    setChatInput("");

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { isUser: false, text: `RAG search on ${docName || "document"}: I found relevant clauses suggesting optimal configurations.` }
      ]);
    }, 800);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📖 Document QA & Conversator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Ingest PDF, Docx, or CSV files to extract summaries, outline clauses, and converse with file knowledgebases.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Document upload mock */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Ingest File</div>
          <div style={{ marginBottom: 16 }}>
            <input
              value={docName}
              onChange={e => setDocName(e.target.value)}
              placeholder="e.g. employee_rules.pdf"
              style={S.input}
            />
          </div>
          <button style={S.primaryBtn("#a78bfa")} onClick={uploadDoc}>
            Ingest File Context
          </button>
        </div>

        {/* Chat area */}
        <div style={S.chatPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Document Chat Console</div>

          <div style={S.chatArea}>
            {chatLog.map((c, i) => (
              <div key={i} style={S.bubble(c.isUser)}>
                {c.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendQuery()}
              placeholder="Ask document question..."
              style={S.input}
            />
            <button style={S.primaryBtn("#22d3ee")} onClick={sendQuery}>Query</button>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
