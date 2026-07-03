import { useState, useRef, useEffect, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 },
  whiteboardPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", justifyContents: "space-between", height: 500 },
  
  canvas: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, display: "block", cursor: "crosshair" },
  
  chatArea: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10, marginBottom: 12 },
  chatBubble: (isUser) => ({ background: isUser ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.03)", alignSelf: isUser ? "flex-end" : "flex-start", padding: "8px 14px", borderRadius: 10, fontSize: 11, maxWidth: "80%" }),
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function SessionCollab({ onNav }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#22d3ee");
  const [chatLog, setChatLog] = useState([
    { isUser: false, text: "Welcome to the active support session chat portal." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  // Simple canvas drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast("Whiteboard canvas cleared!");
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatLog(prev => [...prev, { isUser: true, text: chatInput }]);
    const query = chatInput;
    setChatInput("");

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { isUser: false, text: "I am verifying the console inputs and system stats logs." }
      ]);
    }, 800);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🤝 Session Chat & Whiteboard</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Interact with clients in real-time, draw notes on screen during presentations, and resolve support tickets.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Whiteboard canvas */}
        <div style={S.whiteboardPanel}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Interactive Whiteboard</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                style={{ width: 32, height: 32, padding: 0, border: "none", cursor: "pointer", background: "none" }}
              />
              <button style={S.primaryBtn("#f87171")} onClick={clearCanvas}>Clear Screen</button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={S.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Sidebar chat */}
        <div style={S.sidebar}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 10 }}>Session Support Chat</div>
          
          <div style={S.chatArea}>
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
              placeholder="Type message..."
              style={S.input}
            />
            <button style={S.primaryBtn("#22d3ee")} onClick={sendChatMessage}>Send</button>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
