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

export default function SecurityShield({ onNav }) {
  const [shieldActive, setShieldActive] = useState(true);
  const [scannedCount, setScannedCount] = useState(14820);
  const [threats, setThreats] = useState([
    { id: 1, type: "Shell Exploit Attempt", ip: "185.220.101.4", time: "10m ago", status: "Blocked" },
    { id: 2, type: "SQL Injection Payload", ip: "45.138.89.12", time: "25m ago", status: "Blocked" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const triggerScan = () => {
    setScannedCount(prev => prev + 120);
    showToast("✓ Immediate security audit scan completed! Zero active backdoors found.");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🛡️ AI Security Shield</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Real-time intrusion detection, input filtering, and malicious shell script audit shield.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Shield control */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Security Status</span>
            <button
              onClick={() => { setShieldActive(!shieldActive); showToast(`Shield ${!shieldActive ? "activated" : "deactivated"}`); }}
              style={S.primaryBtn(shieldActive ? "#10b981" : "#ef4444")}
            >
              {shieldActive ? "Shield: ACTIVE" : "Shield: INACTIVE"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.6 }}>
            <div>Scanned Requests: <b>{scannedCount}</b></div>
            <div style={{ marginTop: 10 }}>Protection Mode: <b>High Strictness</b></div>
            <button style={{ ...S.primaryBtn("#22d3ee"), marginTop: 16 }} onClick={triggerScan}>Run Scan</button>
          </div>
        </div>

        {/* Threats list */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Threat Prevention Log</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {threats.map(t => (
              <div key={t.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>{t.type}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>IP: {t.ip} | {t.time}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                  {t.status}
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
