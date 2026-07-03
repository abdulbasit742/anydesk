import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────

const CONNECTABLE_TECHS = [
  { id: "ssh", name: "SSH Terminal", emoji: "🐚", color: "#a78bfa", defaultPort: 22, desc: "Secure shell access to remote servers or VMs" },
  { id: "docker", name: "Docker Daemon", emoji: "🐳", color: "#22d3ee", defaultPort: 2375, desc: "Remote container orchestration and management" },
  { id: "k8s", name: "Kubernetes Cluster", emoji: "☸️", color: "#10b981", defaultPort: 6443, desc: "Kubeconfig connection to coordinate clusters" },
  { id: "postgres", name: "PostgreSQL DB", emoji: "🐘", color: "#60a5fa", defaultPort: 5432, desc: "Relational database remote queries" },
  { id: "mongodb", name: "MongoDB Instance", emoji: "🍃", color: "#34d399", defaultPort: 27017, desc: "Document database collection browser" },
  { id: "redis", name: "Redis Cache", emoji: "🟥", color: "#f87171", defaultPort: 6379, desc: "Remote key-value cache and pub-sub monitor" },
  { id: "ollama", name: "Ollama (Local AI)", emoji: "🦙", color: "#f59e0b", defaultPort: 11434, desc: "Expose local AI models over remote API tunnel" },
  { id: "webhook", name: "Custom Webhook", emoji: "🔌", color: "#fb923c", defaultPort: 80, desc: "HTTP REST triggers for web services" },
];

const INITIAL_CONNECTIONS = [
  { id: "c1", name: "AWS Production EC2", type: "ssh", host: "18.220.45.19", port: 22, user: "ubuntu", status: "online", latency: "42ms", cpu: "14%", ram: "48%" },
  { id: "c2", name: "Staging Docker Host", type: "docker", host: "192.168.1.105", port: 2375, user: "root", status: "online", latency: "8ms", cpu: "32%", ram: "65%" },
  { id: "c3", name: "Local DB Server", type: "postgres", host: "localhost", port: 5432, user: "postgres", status: "online", latency: "1ms", cpu: "3%", ram: "12%" },
];

const S = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #070714 0%, #0c0c1e 50%, #08080f 100%)", color: "#f0f0f5", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" },
  glow: (c, t, l) => ({ position: "absolute", top: t, left: l, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${c}05 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }),
  
  hero: { position: "relative", zIndex: 1, padding: "40px 40px 24px", background: "linear-gradient(180deg, rgba(34,211,238,0.06) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  heroTitle: { margin: 0, fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #22d3ee, #a78bfa, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  heroSub: { margin: "6px 0 16px", fontSize: 13, color: "#6e7191", lineHeight: 1.6 },
  badges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badge: (c) => ({ padding: "4px 12px", borderRadius: 20, background: `${c}12`, border: `1px solid ${c}33`, color: c, fontSize: 10, fontWeight: 700 }),

  layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, padding: "24px 40px", position: "relative", zIndex: 1 },
  mainArea: { display: "flex", flexDirection: "column", gap: 24 },
  
  sectionTitle: { fontSize: 14, fontWeight: 700, color: "#6e7191", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  
  techGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  techCard: (color) => ({
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s",
    ":hover": { borderColor: color, background: `${color}06` }
  }),
  
  connList: { display: "flex", flexDirection: "column", gap: 10 },
  connCard: (active, color) => ({
    background: active ? `${color}0d` : "rgba(255,255,255,0.02)", border: `1px solid ${active ? color + "44" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContents: "space-between", cursor: "pointer", transition: "all 0.2s",
  }),
  
  terminal: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#a0aec0", height: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 },
  termLine: (type) => ({ color: type === "cmd" ? "#22d3ee" : type === "err" ? "#f87171" : type === "ok" ? "#34d399" : "#a0aec0" }),
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }),
  
  sidebar: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 20 },
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s", pointerEvents: "none" }),
};

export default function RemoteTechHub({ onNav }) {
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [activeConn, setActiveConn] = useState(INITIAL_CONNECTIONS[0]);
  const [selectedTech, setSelectedTech] = useState(CONNECTABLE_TECHS[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnForm, setNewConnForm] = useState({ name: "", host: "", port: "", user: "", password: "", apiKey: "" });

  const [tunnels, setTunnels] = useState([
    { id: "t1", localPort: 8080, publicUrl: "https://ag-tunnel-8080.antigravity.dev", status: "active", hits: 142 },
    { id: "t2", localPort: 11434, publicUrl: "https://ag-ollama-remote.antigravity.dev", status: "active", hits: 87 },
  ]);
  const [newTunnelPort, setNewTunnelPort] = useState("");

  const [termLog, setTermLog] = useState([
    { type: "info", text: "AWS Production EC2: Connection initialized." },
    { type: "info", text: "Type shell command to interact with target server." },
    { type: "info", text: "" },
  ]);
  const [termInput, setTermInput] = useState("");
  const termEndRef = useRef(null);

  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const appendTermLog = useCallback((type, text) => {
    setTermLog(prev => [...prev, { type, text, ts: new Date().toLocaleTimeString() }]);
  }, []);

  useEffect(() => {
    if (termEndRef.current) termEndRef.current.scrollTop = termEndRef.current.scrollHeight;
  }, [termLog]);

  const selectConnection = (conn) => {
    setActiveConn(conn);
    setTermLog([
      { type: "info", text: `${conn.name} (${conn.host}:${conn.port}): Connected.` },
      { type: "info", text: "Ready to receive commands." },
      { type: "info", text: "" },
    ]);
  };

  const executeCommand = (cmd) => {
    if (!cmd.trim()) return;
    appendTermLog("cmd", `$ ${cmd}`);
    setTermInput("");

    setTimeout(() => {
      if (cmd === "help") {
        appendTermLog("info", "Supported CLI operations:");
        appendTermLog("info", "  ls / dir     - List workspace directories");
        appendTermLog("info", "  docker ps    - List active containers");
        appendTermLog("info", "  pm2 status   - Monitor background processes");
        appendTermLog("info", "  netstat -pln - Inspect port bindings");
        appendTermLog("info", "  clear        - Clear console screen");
      } else if (cmd === "clear") {
        setTermLog([]);
      } else if (cmd === "docker ps" && activeConn.type === "docker") {
        appendTermLog("ok", "CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS");
        appendTermLog("ok", "a1b2c3d4e5f6   nginx:latest  \"/docker-entrypoint.…\"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp");
        appendTermLog("ok", "f6e5d4c3b2a1   redis:alpine  \"docker-entrypoint.s…\"   5 hours ago     Up 5 hours     0.0.0.0:6379->6379/tcp");
      } else if (cmd.startsWith("ping")) {
        appendTermLog("ok", `PING ${activeConn.host} (${activeConn.host}) 56(84) bytes of data.`);
        appendTermLog("ok", `64 bytes from ${activeConn.host}: icmp_seq=1 ttl=64 time=${activeConn.latency}`);
        appendTermLog("ok", `64 bytes from ${activeConn.host}: icmp_seq=2 ttl=64 time=${activeConn.latency}`);
        appendTermLog("ok", "--- statistics ---");
        appendTermLog("ok", "2 packets transmitted, 2 received, 0% packet loss");
      } else {
        appendTermLog("info", `Executing command on ${activeConn.name} remote shell...`);
        appendTermLog("ok", `Mock Output: command completed successfully with exit code 0.`);
      }
    }, 300);
  };

  const createConnection = () => {
    if (!newConnForm.name || !newConnForm.host) {
      showToast("Name and Host are required!");
      return;
    }
    const newConn = {
      id: `c_${Date.now()}`,
      name: newConnForm.name,
      type: selectedTech.id,
      host: newConnForm.host,
      port: newConnForm.port || selectedTech.defaultPort,
      user: newConnForm.user || "root",
      status: "online",
      latency: `${Math.floor(Math.random() * 50) + 2}ms`,
      cpu: `${Math.floor(Math.random() * 20) + 1}%`,
      ram: `${Math.floor(Math.random() * 40) + 10}%`,
    };
    setConnections(prev => [...prev, newConn]);
    setActiveConn(newConn);
    setShowAddForm(false);
    setNewConnForm({ name: "", host: "", port: "", user: "", password: "", apiKey: "" });
    showToast(`Connected to ${newConn.name}!`);
    selectConnection(newConn);
  };

  const createTunnel = () => {
    const port = parseInt(newTunnelPort);
    if (!port || isNaN(port)) {
      showToast("Invalid port number!");
      return;
    }
    const newTun = {
      id: `t_${Date.now()}`,
      localPort: port,
      publicUrl: `https://ag-tunnel-${port}.antigravity.dev`,
      status: "active",
      hits: 0,
    };
    setTunnels(prev => [newTun, ...prev]);
    setNewTunnelPort("");
    showToast(`Tunnel active: Port ${port} exposed!`);
    appendTermLog("ok", `✓ Tunnel created: Exposed localhost:${port} to ${newTun.publicUrl}`);
  };

  const disconnectTunnel = (id) => {
    setTunnels(prev => prev.filter(t => t.id !== id));
    showToast("Tunnel disconnected");
  };

  const disconnectConnection = (id, e) => {
    e.stopPropagation();
    setConnections(prev => prev.filter(c => c.id !== id));
    if (activeConn?.id === id) {
      setActiveConn(null);
    }
    showToast("Connection removed.");
  };

  return (
    <div style={S.page}>
      <div style={S.glow("#22d3ee", "-200px", "-200px")} />
      <div style={S.glow("#a78bfa", "60%", "70%")} />

      {/* Hero Header */}
      <div style={S.hero}>
        <h1 style={S.heroTitle}>🔌 Remote Tech Hub</h1>
        <p style={S.heroSub}>
          Connect all your technology stacks remotely. Terminal access, remote databases, container monitors, and fast tunnels.
        </p>
        <div style={S.badges}>
          <span style={S.badge("#22d3ee")}>🐚 SSH Terminal</span>
          <span style={S.badge("#a78bfa")}>🐳 Docker Manager</span>
          <span style={S.badge("#10b981")}>☸️ Kubernetes Integration</span>
          <span style={S.badge("#60a5fa")}>📁 Remote Databases</span>
          <span style={S.badge("#f59e0b")}>⚡ Port Tunnelling</span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={S.layout}>
        {/* Left Side: Tech selector, active connections & Terminal */}
        <div style={S.mainArea}>
          
          {/* Connection Targets Selection */}
          <div>
            <div style={S.sectionTitle}>1. Select Target Technology</div>
            <div style={S.techGrid}>
              {CONNECTABLE_TECHS.map(t => {
                const active = selectedTech.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedTech(t); setShowAddForm(true); }}
                    style={{
                      ...S.techCard(t.color),
                      border: active ? `2px solid ${t.color}` : "1px solid rgba(255,255,255,0.06)",
                      background: active ? `${t.color}0a` : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{t.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: "#6e7191", lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Add Form */}
          {showAddForm && (
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: selectedTech.color }}>
                  🔌 Configure Remote {selectedTech.name}
                </div>
                <button onClick={() => setShowAddForm(false)} style={{ background: "none", border: "none", color: "#6e7191", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>Connection Name</label>
                  <input
                    value={newConnForm.name}
                    onChange={e => setNewConnForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. My Production Box"
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>Host Address / IP</label>
                  <input
                    value={newConnForm.host}
                    onChange={e => setNewConnForm(p => ({ ...p, host: e.target.value }))}
                    placeholder="e.g. 192.168.1.1 or example.com"
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>Port</label>
                  <input
                    value={newConnForm.port}
                    onChange={e => setNewConnForm(p => ({ ...p, port: e.target.value }))}
                    placeholder={selectedTech.defaultPort.toString()}
                    style={S.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Username / Auth User</label>
                  <input
                    value={newConnForm.user}
                    onChange={e => setNewConnForm(p => ({ ...p, user: e.target.value }))}
                    placeholder="ubuntu / root"
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>Password / API Key</label>
                  <input
                    type="password"
                    value={newConnForm.password}
                    onChange={e => setNewConnForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Auth Credentials"
                    style={S.input}
                  />
                </div>
              </div>

              <button style={S.primaryBtn(selectedTech.color)} onClick={createConnection}>
                Establish Remote Tunnel
              </button>
            </div>
          )}

          {/* Active Connections List */}
          <div>
            <div style={S.sectionTitle}>2. Connected Tech Devices & Hosts</div>
            <div style={S.connList}>
              {connections.map(c => {
                const active = activeConn?.id === c.id;
                const tech = CONNECTABLE_TECHS.find(t => t.id === c.type) || { color: "#22d3ee", emoji: "🔌" };
                return (
                  <div
                    key={c.id}
                    onClick={() => selectConnection(c)}
                    style={S.connCard(active, tech.color)}
                  >
                    <span style={{ fontSize: 22, marginRight: 14 }}>{tech.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: "#6e7191" }}>{c.user}@{c.host}:{c.port}</div>
                    </div>

                    <div style={{ display: "flex", gap: 20, marginRight: 20, fontSize: 11 }}>
                      <div>
                        <span style={{ color: "#6e7191" }}>Ping:</span> <span style={{ color: "#10b981", fontWeight: 600 }}>{c.latency}</span>
                      </div>
                      <div>
                        <span style={{ color: "#6e7191" }}>CPU:</span> <span style={{ color: "#f59e0b", fontWeight: 600 }}>{c.cpu}</span>
                      </div>
                      <div>
                        <span style={{ color: "#6e7191" }}>RAM:</span> <span style={{ color: "#a78bfa", fontWeight: 600 }}>{c.ram}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: 4, padding: "2px 6px" }}>● Connected</span>
                      <button
                        onClick={(e) => disconnectConnection(c.id, e)}
                        style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, cursor: "pointer" }}
                      >✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLI Terminal Console */}
          {activeConn && (
            <div>
              <div style={S.sectionTitle}>3. Remote CLI Terminal - {activeConn.name}</div>
              <div style={S.terminal} ref={termEndRef}>
                {termLog.map((line, idx) => (
                  <div key={idx} style={S.termLine(line.type)}>
                    {line.text}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={termInput}
                  onChange={e => setTermInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && executeCommand(termInput)}
                  placeholder="Type shell command (e.g. ls, docker ps, clear, help)…"
                  style={S.input}
                />
                <button
                  onClick={() => executeCommand(termInput)}
                  style={{ ...S.primaryBtn(CONNECTABLE_TECHS.find(t => t.id === activeConn.type)?.color || "#22d3ee"), padding: "0 20px" }}
                >Execute</button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Fast Tunneling Config */}
        <div style={S.sidebar}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 6 }}>⚡ Remote Tunnel Manager</div>
            <div style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.5 }}>
              Expose any local developer server or API port to a public endpoint instantly. Great for webhook testing, sharing mock APIs, or remote pairing.
            </div>
          </div>

          {/* Expose Port Form */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <label style={S.label}>Local Target Port</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={newTunnelPort}
                onChange={e => setNewTunnelPort(e.target.value)}
                placeholder="e.g. 3000, 8080, 5000"
                style={S.input}
              />
              <button style={S.primaryBtn("#22d3ee")} onClick={createTunnel}>Expose</button>
            </div>
          </div>

          {/* Active Tunnels */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", marginBottom: 12 }}>Active Tunnels ({tunnels.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tunnels.map(t => (
                <div key={t.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee" }}>Port {t.localPort} ↔ Exposed</span>
                    <button
                      onClick={() => disconnectTunnel(t.id)}
                      style={{ background: "none", border: "none", color: "#f87171", fontSize: 9, cursor: "pointer", padding: 0 }}
                    >disconnect</button>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#a0aec0", textDecoration: "underline", wordBreak: "break-all", marginBottom: 6 }}>
                    <a href={t.publicUrl} target="_blank" rel="noreferrer" style={{ color: "#a78bfa" }}>{t.publicUrl}</a>
                  </div>
                  <div style={{ display: "flex", justifyContents: "space-between", fontSize: 9, color: "#6e7191" }}>
                    <span>Hits: <b>{t.hits}</b> requests</span>
                    <span style={{ color: "#10b981", marginLeft: "auto" }}>● online</span>
                  </div>
                </div>
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
