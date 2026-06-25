/**
 * IoT & Smart Device Remote Management Panel
 * Tabs: Overview | Devices | Network Map | Smart Home | NAS | Tunnels | Tasks | Alerts
 */

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = (window as any).ENV?.API_URL || "http://localhost:3000";

declare global {
  interface Window {
    iotManagement: {
      getLocalNetwork: () => Promise<any>;
      discoverMdns: () => Promise<any[]>;
      discoverSsdp: () => Promise<any[]>;
      arpScan: (subnet?: string) => Promise<any[]>;
      fullNetworkScan: (subnet?: string) => Promise<any[]>;
      ping: (host: string, port?: number) => Promise<any>;
      getLocalSystemInfo: () => Promise<any>;
      sendWoL: (mac: string) => Promise<any>;
      startTunnel: (tunnelId: string, localPort: number, remoteHost: string, remotePort: number, jumpHost?: string) => Promise<any>;
      stopTunnel: (tunnelId: string) => Promise<any>;
      listActiveTunnels: () => Promise<string[]>;
      sshCommand: (host: string, port: number, username: string, command: string) => Promise<any>;
      getCameraStreamUrl: (ip: string, port: number, protocol: string, username?: string, password?: string) => Promise<any>;
      browseNas: (host: string, port: number, path: string, protocol: string) => Promise<any>;
      restartService: (host: string, username: string, service: string) => Promise<any>;
      buildTopology: (devices: any[]) => Promise<any>;
    };
  }
}

type TabKey = "overview" | "devices" | "topology" | "smarthome" | "nas" | "tunnels" | "tasks" | "alerts";

const DEVICE_ICONS: Record<string, string> = {
  camera: "📷", nas: "🗄️", router: "📡", server: "🖥️",
  smart_light: "💡", thermostat: "🌡️", lock: "🔒", printer: "🖨️",
  switch: "🔌", hub: "🏠", sensor: "📊", other: "📟",
};

const STATUS_COLORS: Record<string, string> = {
  online: "#22c55e", offline: "#ef4444", warning: "#f59e0b",
  error: "#ef4444", unknown: "#6b7280",
};

interface Device {
  id: string; name: string; type: string; status: string;
  ipAddress?: string; macAddress?: string; lastPing?: number;
  vendor?: string; model?: string; port?: number; protocol?: string;
}

interface Alert {
  id: string; type: string; severity: string; title: string;
  message: string; acknowledged: boolean; createdAt: string;
  device?: { name: string; type: string };
}

interface SmartEntity {
  id: string; entityId: string; name: string; domain: string;
  state?: string; platform: string; isControllable: boolean;
}

interface Tunnel {
  id: string; name: string; localPort: number; remoteHost: string;
  remotePort: number; protocol: string; status: string;
}

interface Task {
  id: string; name: string; type: string; schedule: string;
  lastRunAt?: string; lastRunStatus?: string; isEnabled: boolean;
}

export default function IoTManagementPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [entities, setEntities] = useState<SmartEntity[]>([]);
  const [tunnels, setTunnels] = useState<Tunnel[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [topology, setTopology] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
  const [localInfo, setLocalInfo] = useState<any>(null);
  const [nasPath, setNasPath] = useState("/");
  const [nasFiles, setNasFiles] = useState<any[]>([]);
  const [selectedNasDevice, setSelectedNasDevice] = useState<Device | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Device | null>(null);
  const [cameraStreamUrl, setCameraStreamUrl] = useState<string>("");
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddSite, setShowAddSite] = useState(false);
  const [showAddTunnel, setShowAddTunnel] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("token") || "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/stats`, { headers: headers() });
      if (r.ok) setStats(await r.json());
    } catch {}
  }, []);

  const fetchSites = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/sites`, { headers: headers() });
      if (r.ok) {
        const data = await r.json();
        setSites(data.sites || []);
        if (!selectedSite && data.sites?.length > 0) setSelectedSite(data.sites[0].id);
      }
    } catch {}
  }, [selectedSite]);

  const fetchDevices = useCallback(async () => {
    if (!selectedSite) return;
    try {
      const r = await fetch(`${API_BASE}/api/iot/devices?siteId=${selectedSite}`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setDevices(d.devices || []); }
    } catch {}
  }, [selectedSite]);

  const fetchAlerts = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/alerts?acknowledged=false`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setAlerts(d.alerts || []); }
    } catch {}
  }, []);

  const fetchEntities = useCallback(async () => {
    if (!selectedSite) return;
    try {
      const r = await fetch(`${API_BASE}/api/iot/smart-home/entities?siteId=${selectedSite}`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setEntities(d.entities || []); }
    } catch {}
  }, [selectedSite]);

  const fetchTunnels = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/tunnels`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setTunnels(d.tunnels || []); }
    } catch {}
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/tasks`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setTasks(d.tasks || []); }
    } catch {}
  }, []);

  const fetchTopology = useCallback(async () => {
    if (!selectedSite) return;
    try {
      const r = await fetch(`${API_BASE}/api/iot/topology/${selectedSite}`, { headers: headers() });
      if (r.ok) { const d = await r.json(); setTopology(d); }
    } catch {}
  }, [selectedSite]);

  useEffect(() => {
    fetchStats();
    fetchSites();
    fetchAlerts();
    fetchTunnels();
    fetchTasks();
    // Load local system info
    if (window.iotManagement) {
      window.iotManagement.getLocalSystemInfo().then(setLocalInfo).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (selectedSite) {
      fetchDevices();
      fetchEntities();
      fetchTopology();
    }
  }, [selectedSite]);

  const handleDiscover = async () => {
    setScanning(true);
    setDiscoveredDevices([]);
    try {
      const localNet = await window.iotManagement?.getLocalNetwork();
      const subnet = localNet?.subnet || "192.168.1";

      const [arpResults, ssdpResults, mdnsResults] = await Promise.all([
        window.iotManagement?.arpScan(subnet) || Promise.resolve([]),
        window.iotManagement?.discoverSsdp() || Promise.resolve([]),
        window.iotManagement?.discoverMdns() || Promise.resolve([]),
      ]);

      const all = [...arpResults, ...ssdpResults, ...mdnsResults];
      setDiscoveredDevices(all);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleSaveDiscovered = async (device: any) => {
    if (!selectedSite) return;
    try {
      await fetch(`${API_BASE}/api/iot/discover/save`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ siteId: selectedSite, devices: [device] }),
      });
      fetchDevices();
    } catch {}
  };

  const handlePingDevice = async (device: Device) => {
    try {
      const r = await fetch(`${API_BASE}/api/iot/devices/${device.id}/ping`, {
        method: "POST", headers: headers(),
      });
      if (r.ok) fetchDevices();
    } catch {}
  };

  const handleWoL = async (device: Device) => {
    if (!device.macAddress) return alert("Device has no MAC address");
    try {
      await window.iotManagement?.sendWoL(device.macAddress);
      alert(`Wake-on-LAN packet sent to ${device.macAddress}`);
    } catch (err: any) {
      alert(`WoL failed: ${err.message}`);
    }
  };

  const handleControlEntity = async (entity: SmartEntity, action: string, value?: any) => {
    try {
      await fetch(`${API_BASE}/api/iot/smart-home/entities/${entity.id}/control`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ action, value }),
      });
      fetchEntities();
    } catch {}
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`${API_BASE}/api/iot/alerts/${alertId}/acknowledge`, {
        method: "POST", headers: headers(),
      });
      fetchAlerts();
    } catch {}
  };

  const handleStartTunnel = async (tunnel: Tunnel) => {
    try {
      await fetch(`${API_BASE}/api/iot/tunnels/${tunnel.id}/start`, {
        method: "POST", headers: headers(),
      });
      fetchTunnels();
    } catch {}
  };

  const handleStopTunnel = async (tunnel: Tunnel) => {
    try {
      await fetch(`${API_BASE}/api/iot/tunnels/${tunnel.id}/stop`, {
        method: "POST", headers: headers(),
      });
      fetchTunnels();
    } catch {}
  };

  const handleRunTask = async (task: Task) => {
    try {
      await fetch(`${API_BASE}/api/iot/tasks/${task.id}/run`, {
        method: "POST", headers: headers(),
      });
      fetchTasks();
    } catch {}
  };

  const handleBrowseNas = async (device: Device, path = "/") => {
    setSelectedNasDevice(device);
    setNasPath(path);
    try {
      const result = await window.iotManagement?.browseNas(
        device.ipAddress || "", device.port || 445, path, device.protocol || "smb"
      );
      setNasFiles(result?.files || []);
    } catch {}
  };

  const handleViewCamera = async (device: Device) => {
    setSelectedCamera(device);
    try {
      const result = await window.iotManagement?.getCameraStreamUrl(
        device.ipAddress || "", device.port || 554, device.protocol || "rtsp"
      );
      setCameraStreamUrl(result?.mjpegUrl || result?.rtspUrl || "");
    } catch {}
  };

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "overview", label: "📊 Overview" },
    { key: "devices", label: `📟 Devices (${devices.length})` },
    { key: "topology", label: "🗺️ Network Map" },
    { key: "smarthome", label: "🏠 Smart Home" },
    { key: "nas", label: "🗄️ NAS" },
    { key: "tunnels", label: "🔒 Tunnels" },
    { key: "tasks", label: "⏰ Tasks" },
    { key: "alerts", label: `🔔 Alerts`, badge: alerts.filter(a => !a.acknowledged).length },
  ];

  const styles = {
    container: { background: "#0f172a", color: "#e2e8f0", height: "100%", display: "flex", flexDirection: "column" as const, fontFamily: "system-ui, sans-serif", fontSize: 13 },
    header: { padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12 },
    tabBar: { display: "flex", gap: 2, padding: "8px 16px", borderBottom: "1px solid #1e293b", overflowX: "auto" as const },
    tab: (active: boolean) => ({ padding: "6px 12px", borderRadius: 6, cursor: "pointer", background: active ? "#1d4ed8" : "transparent", color: active ? "#fff" : "#94a3b8", border: "none", fontSize: 12, whiteSpace: "nowrap" as const, position: "relative" as const }),
    content: { flex: 1, overflowY: "auto" as const, padding: 16 },
    card: { background: "#1e293b", borderRadius: 8, padding: 12, marginBottom: 12 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 },
    statCard: { background: "#1e293b", borderRadius: 8, padding: 12, textAlign: "center" as const },
    btn: (color = "#1d4ed8") => ({ padding: "5px 10px", background: color, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11 }),
    badge: { background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", position: "absolute" as const, top: -4, right: -4 },
    input: { background: "#0f172a", border: "1px solid #334155", borderRadius: 5, padding: "5px 8px", color: "#e2e8f0", fontSize: 12, width: "100%" },
    select: { background: "#0f172a", border: "1px solid #334155", borderRadius: 5, padding: "5px 8px", color: "#e2e8f0", fontSize: 12 },
    label: { color: "#94a3b8", fontSize: 11, marginBottom: 3, display: "block" },
    row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
    divider: { borderTop: "1px solid #1e293b", margin: "12px 0" },
    dot: (status: string) => ({ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[status] || "#6b7280", display: "inline-block", marginRight: 6 }),
  };

  // ─── Overview Tab ──────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>IoT & Device Management</h3>
        <select style={styles.select} value={selectedSite} onChange={e => setSelectedSite(e.target.value)}>
          <option value="">All Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {stats && (
        <div style={styles.grid}>
          {[
            { label: "Total Sites", value: stats.totalSites, icon: "🌍", color: "#3b82f6" },
            { label: "Total Devices", value: stats.totalDevices, icon: "📟", color: "#8b5cf6" },
            { label: "Online", value: stats.onlineDevices, icon: "✅", color: "#22c55e" },
            { label: "Offline", value: stats.offlineDevices, icon: "❌", color: "#ef4444" },
            { label: "Unread Alerts", value: stats.unackedAlerts, icon: "🔔", color: "#f59e0b" },
            { label: "Active Tunnels", value: stats.activeTunnels, icon: "🔒", color: "#06b6d4" },
          ].map(s => (
            <div key={s.label} style={{ ...styles.statCard, borderLeft: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: s.color }}>{s.value}</div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Local System Info */}
      {localInfo && (
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8, color: "#f1f5f9" }}>🖥️ This Machine</div>
          <div style={styles.grid}>
            <div><span style={{ color: "#94a3b8" }}>Hostname:</span> {localInfo.hostname}</div>
            <div><span style={{ color: "#94a3b8" }}>Platform:</span> {localInfo.platform}</div>
            <div><span style={{ color: "#94a3b8" }}>CPU:</span> {localInfo.cpuCount}× {localInfo.cpuModel?.slice(0, 20)}</div>
            <div><span style={{ color: "#94a3b8" }}>RAM:</span> {localInfo.ramPercent}% used ({localInfo.freeMemMB}MB free)</div>
            <div><span style={{ color: "#94a3b8" }}>Uptime:</span> {Math.floor(localInfo.uptime / 3600)}h {Math.floor((localInfo.uptime % 3600) / 60)}m</div>
            <div><span style={{ color: "#94a3b8" }}>Docker:</span> {localInfo.dockerContainers?.length || 0} containers</div>
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8, color: "#f1f5f9" }}>🔔 Recent Alerts</div>
          {alerts.slice(0, 5).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0f172a" }}>
              <div>
                <span style={{ color: a.severity === "critical" ? "#ef4444" : a.severity === "warning" ? "#f59e0b" : "#3b82f6", marginRight: 8 }}>
                  {a.severity === "critical" ? "🔴" : a.severity === "warning" ? "🟡" : "🔵"}
                </span>
                <span style={{ color: "#f1f5f9" }}>{a.title}</span>
                {a.device && <span style={{ color: "#64748b", marginLeft: 8 }}>({a.device.name})</span>}
              </div>
              <button style={styles.btn("#374151")} onClick={() => handleAcknowledgeAlert(a.id)}>Ack</button>
            </div>
          ))}
        </div>
      )}

      {/* Device Discovery */}
      <div style={{ ...styles.card, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontWeight: "bold", color: "#f1f5f9" }}>🔍 Device Discovery</div>
          <button style={styles.btn(scanning ? "#374151" : "#1d4ed8")} onClick={handleDiscover} disabled={scanning}>
            {scanning ? "Scanning..." : "Scan Network"}
          </button>
        </div>
        {discoveredDevices.length > 0 && (
          <div>
            <div style={{ color: "#94a3b8", marginBottom: 8 }}>Found {discoveredDevices.length} devices</div>
            {discoveredDevices.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0f172a" }}>
                <div>
                  <span style={{ marginRight: 8 }}>{DEVICE_ICONS[d.type] || "📟"}</span>
                  <span style={{ color: "#f1f5f9" }}>{d.name || d.ipAddress}</span>
                  <span style={{ color: "#64748b", marginLeft: 8 }}>{d.ipAddress}</span>
                  <span style={{ color: "#22c55e", marginLeft: 8, fontSize: 11 }}>{d.discoveryMethod}</span>
                </div>
                <button style={styles.btn("#059669")} onClick={() => handleSaveDiscovered(d)}>Add</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Devices Tab ───────────────────────────────────────────────────────────
  const renderDevices = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>Devices</h3>
        <button style={styles.btn()} onClick={() => setShowAddDevice(true)}>+ Add Device</button>
      </div>
      {devices.length === 0 ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>No devices. Click "Scan Network" in Overview or add manually.</div>
      ) : (
        <div style={styles.grid}>
          {devices.map(d => (
            <div key={d.id} style={{ ...styles.card, margin: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{DEVICE_ICONS[d.type] || "📟"}</span>
                <span style={{ ...styles.dot(d.status), width: 10, height: 10 }} />
              </div>
              <div style={{ fontWeight: "bold", color: "#f1f5f9", marginBottom: 4 }}>{d.name}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{d.type} • {d.ipAddress || "—"}</div>
              {d.vendor && <div style={{ color: "#64748b", fontSize: 11 }}>{d.vendor} {d.model}</div>}
              {d.lastPing !== undefined && d.lastPing >= 0 && (
                <div style={{ color: "#22c55e", fontSize: 11 }}>⚡ {d.lastPing}ms</div>
              )}
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" as const }}>
                <button style={styles.btn("#374151")} onClick={() => handlePingDevice(d)}>Ping</button>
                {d.macAddress && <button style={styles.btn("#7c3aed")} onClick={() => handleWoL(d)}>WoL</button>}
                {d.type === "camera" && <button style={styles.btn("#0891b2")} onClick={() => handleViewCamera(d)}>View</button>}
                {d.type === "nas" && <button style={styles.btn("#059669")} onClick={() => handleBrowseNas(d)}>Browse</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── Network Topology Tab ──────────────────────────────────────────────────
  const renderTopology = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>Network Topology Map</h3>
        <button style={styles.btn()} onClick={fetchTopology}>Refresh</button>
      </div>
      {!topology ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>Select a site to view topology</div>
      ) : (
        <div style={{ background: "#0f172a", borderRadius: 8, padding: 16, minHeight: 400, position: "relative" as const }}>
          <svg width="100%" height="400" style={{ position: "absolute", top: 0, left: 0 }}>
            {topology.edges.map((e: any) => {
              const src = topology.nodes.find((n: any) => n.id === e.source);
              const tgt = topology.nodes.find((n: any) => n.id === e.target);
              if (!src || !tgt) return null;
              return (
                <line key={e.id} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke="#334155" strokeWidth={1.5} strokeDasharray="4,4" />
              );
            })}
          </svg>
          {topology.nodes.map((n: any) => (
            <div key={n.id} style={{
              position: "absolute", left: n.x - 30, top: n.y - 30,
              textAlign: "center", width: 60,
            }}>
              <div style={{ fontSize: 24, filter: n.status === "offline" ? "grayscale(1)" : "none" }}>
                {DEVICE_ICONS[n.type] || "📟"}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", wordBreak: "break-word" as const }}>{n.name}</div>
              <div style={{ ...styles.dot(n.status), display: "block", margin: "2px auto 0" }} />
            </div>
          ))}
          <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 8 }}>
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <span key={s} style={{ fontSize: 10, color: "#94a3b8" }}>
                <span style={{ ...styles.dot(s), display: "inline-block" }} />{s}
              </span>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: "bold", color: "#f1f5f9", marginBottom: 8 }}>Device List</div>
        {topology?.nodes.map((n: any) => (
          <div key={n.id} style={{ ...styles.row, padding: "6px 0", borderBottom: "1px solid #1e293b" }}>
            <span>{DEVICE_ICONS[n.type] || "📟"}</span>
            <span style={{ ...styles.dot(n.status), display: "inline-block" }} />
            <span style={{ color: "#f1f5f9", flex: 1 }}>{n.name}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>{n.ip}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>{n.type}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Smart Home Tab ────────────────────────────────────────────────────────
  const renderSmartHome = () => {
    const domains = [...new Set(entities.map(e => e.domain))];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: "#f1f5f9" }}>Smart Home Control</h3>
          <button style={styles.btn()} onClick={async () => {
            if (!selectedSite) return;
            await fetch(`${API_BASE}/api/iot/smart-home/sync`, {
              method: "POST", headers: headers(),
              body: JSON.stringify({ siteId: selectedSite }),
            });
            fetchEntities();
          }}>Sync HA</button>
        </div>
        {domains.map(domain => (
          <div key={domain} style={styles.card}>
            <div style={{ fontWeight: "bold", color: "#f1f5f9", marginBottom: 8, textTransform: "capitalize" as const }}>
              {domain === "light" ? "💡" : domain === "switch" ? "🔌" : domain === "climate" ? "🌡️" : domain === "lock" ? "🔒" : domain === "sensor" ? "📊" : domain === "camera" ? "📷" : "🏠"} {domain}
            </div>
            <div style={styles.grid}>
              {entities.filter(e => e.domain === domain).map(entity => (
                <div key={entity.id} style={{ background: "#0f172a", borderRadius: 6, padding: 10 }}>
                  <div style={{ color: "#f1f5f9", marginBottom: 4 }}>{entity.name}</div>
                  <div style={{ color: entity.state === "on" || entity.state === "locked" ? "#22c55e" : "#64748b", fontSize: 12, marginBottom: 8 }}>
                    {entity.state || "unknown"}
                  </div>
                  {entity.isControllable && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
                      {(domain === "light" || domain === "switch") && (
                        <>
                          <button style={styles.btn("#22c55e")} onClick={() => handleControlEntity(entity, "turn_on")}>On</button>
                          <button style={styles.btn("#ef4444")} onClick={() => handleControlEntity(entity, "turn_off")}>Off</button>
                          <button style={styles.btn("#374151")} onClick={() => handleControlEntity(entity, "toggle")}>Toggle</button>
                        </>
                      )}
                      {domain === "lock" && (
                        <>
                          <button style={styles.btn("#22c55e")} onClick={() => handleControlEntity(entity, "unlock")}>Unlock</button>
                          <button style={styles.btn("#ef4444")} onClick={() => handleControlEntity(entity, "lock")}>Lock</button>
                        </>
                      )}
                      {domain === "climate" && (
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button style={styles.btn("#374151")} onClick={() => handleControlEntity(entity, "set_temperature", Number(entity.state || 20) - 1)}>−</button>
                          <span style={{ color: "#f1f5f9" }}>{entity.state}°C</span>
                          <button style={styles.btn("#374151")} onClick={() => handleControlEntity(entity, "set_temperature", Number(entity.state || 20) + 1)}>+</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {entities.length === 0 && (
          <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>
            No smart home entities. Click "Sync HA" to import from Home Assistant.
          </div>
        )}
      </div>
    );
  };

  // ─── NAS Browser Tab ──────────────────────────────────────────────────────
  const renderNas = () => {
    const nasDevices = devices.filter(d => d.type === "nas");
    return (
      <div>
        <h3 style={{ margin: "0 0 12px", color: "#f1f5f9" }}>NAS File Browser</h3>
        {nasDevices.length === 0 ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>No NAS devices found. Add a NAS device in the Devices tab.</div>
        ) : (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 180, flexShrink: 0 }}>
              {nasDevices.map(d => (
                <div key={d.id} style={{
                  ...styles.card, cursor: "pointer", margin: "0 0 8px",
                  border: selectedNasDevice?.id === d.id ? "1px solid #1d4ed8" : "1px solid transparent",
                }} onClick={() => handleBrowseNas(d)}>
                  <div style={{ fontSize: 20 }}>🗄️</div>
                  <div style={{ color: "#f1f5f9", fontSize: 12 }}>{d.name}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>{d.ipAddress}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              {selectedNasDevice && (
                <>
                  <div style={{ ...styles.row, marginBottom: 8 }}>
                    <span style={{ color: "#94a3b8" }}>📂</span>
                    <span style={{ color: "#f1f5f9", flex: 1 }}>{nasPath}</span>
                    {nasPath !== "/" && (
                      <button style={styles.btn("#374151")} onClick={() => {
                        const parent = nasPath.split("/").slice(0, -1).join("/") || "/";
                        handleBrowseNas(selectedNasDevice, parent);
                      }}>↑ Up</button>
                    )}
                  </div>
                  {nasFiles.map((f, i) => (
                    <div key={i} style={{ ...styles.row, padding: "6px 0", borderBottom: "1px solid #1e293b", cursor: f.isDirectory ? "pointer" : "default" }}
                      onClick={() => f.isDirectory && handleBrowseNas(selectedNasDevice, `${nasPath}/${f.name}`.replace("//", "/"))}>
                      <span>{f.isDirectory ? "📁" : "📄"}</span>
                      <span style={{ flex: 1, color: "#f1f5f9" }}>{f.name}</span>
                      {!f.isDirectory && f.size && (
                        <span style={{ color: "#64748b", fontSize: 11 }}>{Math.round(Number(f.size) / 1024)}KB</span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
        {selectedCamera && (
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={{ fontWeight: "bold", color: "#f1f5f9", marginBottom: 8 }}>📷 {selectedCamera.name}</div>
            {cameraStreamUrl ? (
              <div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>Stream URL:</div>
                <div style={{ background: "#0f172a", padding: 8, borderRadius: 4, color: "#22c55e", fontSize: 11, wordBreak: "break-all" as const }}>{cameraStreamUrl}</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 8 }}>Use VLC or a compatible player to view the stream.</div>
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>Loading stream URL...</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── Tunnels Tab ──────────────────────────────────────────────────────────
  const renderTunnels = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>Secure Tunnels</h3>
        <button style={styles.btn()} onClick={() => setShowAddTunnel(true)}>+ New Tunnel</button>
      </div>
      {tunnels.length === 0 ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>No tunnels configured.</div>
      ) : (
        tunnels.map(t => (
          <div key={t.id} style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#f1f5f9" }}>{t.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>
                  localhost:{t.localPort} → {t.remoteHost}:{t.remotePort} ({t.protocol.toUpperCase()})
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ ...styles.dot(t.status === "running" ? "online" : "offline"), display: "inline-block" }} />
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{t.status}</span>
                {t.status !== "running" ? (
                  <button style={styles.btn("#22c55e")} onClick={() => handleStartTunnel(t)}>Start</button>
                ) : (
                  <button style={styles.btn("#ef4444")} onClick={() => handleStopTunnel(t)}>Stop</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ─── Tasks Tab ────────────────────────────────────────────────────────────
  const renderTasks = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>Scheduled Tasks</h3>
        <button style={styles.btn()} onClick={() => setShowAddTask(true)}>+ New Task</button>
      </div>
      {tasks.length === 0 ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>No scheduled tasks.</div>
      ) : (
        tasks.map(t => (
          <div key={t.id} style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#f1f5f9" }}>{t.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>Type: {t.type} • Schedule: {t.schedule}</div>
                {t.lastRunAt && (
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>
                    Last run: {new Date(t.lastRunAt).toLocaleString()} —
                    <span style={{ color: t.lastRunStatus === "success" ? "#22c55e" : t.lastRunStatus === "failed" ? "#ef4444" : "#f59e0b", marginLeft: 4 }}>
                      {t.lastRunStatus}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={styles.btn("#1d4ed8")} onClick={() => handleRunTask(t)}>▶ Run</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ─── Alerts Tab ───────────────────────────────────────────────────────────
  const renderAlerts = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#f1f5f9" }}>Alerts</h3>
        <button style={styles.btn("#374151")} onClick={fetchAlerts}>Refresh</button>
      </div>
      {alerts.length === 0 ? (
        <div style={{ color: "#22c55e", textAlign: "center", padding: 32 }}>✅ No unacknowledged alerts</div>
      ) : (
        alerts.map(a => (
          <div key={a.id} style={{ ...styles.card, borderLeft: `3px solid ${a.severity === "critical" ? "#ef4444" : a.severity === "warning" ? "#f59e0b" : "#3b82f6"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#f1f5f9" }}>{a.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{a.message}</div>
                {a.device && <div style={{ color: "#64748b", fontSize: 11 }}>Device: {a.device.name}</div>}
                <div style={{ color: "#475569", fontSize: 10 }}>{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={styles.btn("#374151")} onClick={() => handleAcknowledgeAlert(a.id)}>Ack</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const tabContent: Record<TabKey, () => JSX.Element> = {
    overview: renderOverview,
    devices: renderDevices,
    topology: renderTopology,
    smarthome: renderSmartHome,
    nas: renderNas,
    tunnels: renderTunnels,
    tasks: renderTasks,
    alerts: renderAlerts,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{ fontSize: 20 }}>🌐</span>
        <span style={{ fontWeight: "bold", color: "#f1f5f9" }}>IoT & Smart Device Management</span>
        {alerts.filter(a => !a.acknowledged).length > 0 && (
          <span style={{ background: "#ef4444", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: 11 }}>
            {alerts.filter(a => !a.acknowledged).length} alerts
          </span>
        )}
      </div>

      <div style={styles.tabBar}>
        {tabs.map(t => (
          <button key={t.key} style={styles.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
            {t.badge && t.badge > 0 ? <span style={styles.badge}>{t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #ef4444", borderRadius: 6, padding: 8, marginBottom: 12, color: "#fca5a5" }}>
            {error} <button style={{ ...styles.btn("#374151"), marginLeft: 8 }} onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {tabContent[activeTab]()}
      </div>
    </div>
  );
}
