import { useState, useCallback } from "react";

const INITIAL_DEVICES = [
  { id: "d1", name: "Office Workstation 4", os: "Windows 11", token: "ua_tok_90218x120", status: "online" },
  { id: "d2", name: "Backup Data Node", os: "Ubuntu Server", token: "ua_tok_30129x890", status: "offline" },
];

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
  
  deviceCard: (online) => ({
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14, display: "flex", justifyContents: "space-between", alignItems: "center",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function UnattendedAccess({ onNav }) {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [deviceName, setDeviceName] = useState("");
  const [deviceOs, setDeviceOs] = useState("Windows 11");
  const [permPass, setPermPass] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const registerUnattendedDevice = () => {
    if (!deviceName || !permPass) {
      showToast("Device Name and Permanent Password are required!");
      return;
    }
    const created = {
      id: `d_${Date.now()}`,
      name: deviceName,
      os: deviceOs,
      token: `ua_tok_${Math.floor(Math.random() * 900000) + 100000}`,
      status: "online",
    };
    setDevices(prev => [...prev, created]);
    setDeviceName("");
    setPermPass("");
    showToast("Unattended access device registered!");
  };

  const removeDevice = (id) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    showToast("Device removed.");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔑 Unattended Access Manager</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Configure permanent access passwords, register remote servers, and verify wake-on-LAN hooks.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Register Unattended Client</div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Device Host Name</label>
            <input
              value={deviceName}
              onChange={e => setDeviceName(e.target.value)}
              placeholder="e.g. My Ubuntu VPS"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Operating System</label>
            <select value={deviceOs} onChange={e => setDeviceOs(e.target.value)} style={S.input}>
              <option value="Windows 11">Windows 11</option>
              <option value="Ubuntu Server">Ubuntu Server</option>
              <option value="macOS Sequoia">macOS Sequoia</option>
              <option value="Android Mobile">Android Mobile</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Set Permanent Connection Password</label>
            <input
              type="password"
              value={permPass}
              onChange={e => setPermPass(e.target.value)}
              placeholder="Password Keyphrase"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn("#22d3ee")} onClick={registerUnattendedDevice}>
            Generate Access Token
          </button>
        </div>

        {/* List Panel */}
        <div style={S.previewPanel}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Registered Devices ({devices.length})</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {devices.map(d => (
              <div key={d.id} style={S.deviceCard(d.status === "online")}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: 10, color: "#6e7191" }}>OS: {d.os} | Token: <code>{d.token}</code></div>
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: d.status === "online" ? "#10b981" : "#f87171" }}>
                    ● {d.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => removeDevice(d.id)}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 12 }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wake on LAN */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>Wake-on-LAN Relay Hooks</div>
            <p style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5, margin: 0 }}>
              Broadcast Magic Packets to registered MAC addresses. Wake up remote nodes inside the same franchise/office tunnel subnet automatically.
            </p>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}
