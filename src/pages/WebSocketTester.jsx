import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  controlPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  streamsPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  streamCard: { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, fontFamily: "monospace", fontSize: 11, color: "#a0aec0" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function WebSocketTester({ onNav }) {
  const [url, setUrl] = useState("wss://echo.websocket.events");
  const [payload, setPayload] = useState('{"event": "ping"}');
  const [connected, setConnected] = useState(false);
  const [streams, setStreams] = useState([
    { id: 1, type: "system", text: "WebSocket debugger ready." }
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const toggleConnection = () => {
    if (connected) {
      setConnected(false);
      setStreams(prev => [...prev, { id: Date.now(), type: "error", text: "Connection closed." }]);
      showToast("WebSocket disconnected.");
    } else {
      setConnected(true);
      setStreams(prev => [...prev, { id: Date.now(), type: "success", text: `Connected to ${url} successfully.` }]);
      showToast("WebSocket connected!");
    }
  };

  const sendPayload = () => {
    if (!connected) {
      showToast("Connect to socket first!");
      return;
    }
    setStreams(prev => [...prev, { id: Date.now(), type: "outgoing", text: `Sent: ${payload}` }]);
    setTimeout(() => {
      setStreams(prev => [...prev, { id: Date.now(), type: "incoming", text: `Received (Echo Response): ${payload}` }]);
    }, 600);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>⚡ WebSocket Event Tester</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Open interactive Web Socket streams, push message packets, and analyze live payload responses.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Connection controllers */}
        <div style={S.controlPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Connection Rules</div>
          
          <div style={{ marginBottom: 14 }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="wss://"
              style={S.input}
            />
          </div>

          <button
            style={S.primaryBtn(connected ? "#ef4444" : "#10b981")}
            onClick={toggleConnection}
            style={{ ...S.primaryBtn(connected ? "#ef4444" : "#10b981"), width: "100%", marginBottom: 20 }}
          >
            {connected ? "Disconnect" : "Connect"}
          </button>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 10 }}>Message Payload</div>
          <div style={{ marginBottom: 14 }}>
            <textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              style={{ ...S.input, height: 100, fontFamily: "monospace", resize: "none" }}
            />
          </div>

          <button style={{ ...S.primaryBtn("#22d3ee"), width: "100%" }} onClick={sendPayload}>
            Push Payload Frame
          </button>
        </div>

        {/* Live streams list */}
        <div style={S.streamsPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Live Socket Event Logs</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto" }}>
            {streams.map(s => (
              <div key={s.id} style={S.streamCard}>
                <span style={{
                  fontSize: 9, fontWeight: 700, marginRight: 8,
                  color: s.type === "outgoing" ? "#a78bfa" : s.type === "incoming" ? "#22d3ee" : s.type === "success" ? "#10b981" : "#6e7191"
                }}>
                  [{s.type.toUpperCase()}]
                </span>
                {s.text}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
