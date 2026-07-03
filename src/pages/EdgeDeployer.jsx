import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function EdgeDeployer({ onNav }) {
  const [code, setCode] = useState(`export async function onRequest(context) {\n  return new Response("Hello from the Edge!");\n}`);
  const [deploying, setDeploying] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const deployFunction = () => {
    setDeploying(true);
    setTimeout(() => {
      setEndpoint(`https://edge-fn-${Math.floor(Math.random() * 9000) + 1000}.antigravity.dev`);
      setDeploying(false);
      showToast("✓ Edge Function compiled and deployed to global network edge nodes!");
    }, 1500);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🚂 Serverless Edge Deployer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Paste standard JavaScript edge functions, compile code dynamically, and deploy globally instantly.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Editor */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Edge Function Code Workspace</div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ width: "100%", height: 260, background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", resize: "none", outline: "none", marginBottom: 16 }}
          />
          <button style={S.primaryBtn("#22d3ee")} onClick={deployFunction} disabled={deploying}>
            {deploying ? "Deploying Code..." : "⚡ Deploy to Edge"}
          </button>
        </div>

        {/* Deployment Info */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Deployment Meta Stats</div>
          
          {endpoint ? (
            <div>
              <div style={{ fontSize: 11, color: "#6e7191", marginBottom: 4 }}>Active Public HTTP Endpoint:</div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#a78bfa", textDecoration: "underline", wordBreak: "break-all", marginBottom: 16 }}>
                <a href={endpoint} target="_blank" rel="noreferrer" style={{ color: "#a78bfa" }}>{endpoint}</a>
              </div>
              <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>● Live Status: Active</div>
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Configure edge code functions and trigger compilation...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
