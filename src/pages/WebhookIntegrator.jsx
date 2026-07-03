import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function WebhookIntegrator({ onNav }) {
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: "Stripe Charge Trigger", url: "https://tunnels.antigravity.dev/wh_stripe", status: "Listening" },
    { id: 2, name: "GitHub Commit Hook", url: "https://tunnels.antigravity.dev/wh_github", status: "Listening" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const createWebhook = () => {
    const created = {
      id: Date.now(),
      name: "Custom Agent Trigger",
      url: `https://tunnels.antigravity.dev/wh_${Date.now().toString().slice(-4)}`,
      status: "Listening",
    };
    setWebhooks(prev => [...prev, created]);
    showToast("✓ Custom webhook listener registered!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔌 Dynamic Webhook Integrator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Receive events from external services (Stripe, GitHub, Shopify) and trigger custom agent workflows automatically.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Controls */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Integrations Configurer</div>
          <p style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5, marginBottom: 16 }}>
            Set up active webhook endpoints. Choose trigger actions to connect user queries directly to pipelines upon receiving payloads.
          </p>
          <button style={S.primaryBtn("#a78bfa")} onClick={createWebhook}>
            + Create Webhook Endpoint
          </button>
        </div>

        {/* Listeners list */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Active Listeners ({webhooks.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {webhooks.map(wh => (
              <div key={wh.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee" }}>{wh.name}</div>
                  <div style={{ fontSize: 9, color: "#6e7191", fontFamily: "monospace", marginTop: 2 }}>{wh.url}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                  {wh.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
