import { useEffect, useMemo, useState } from "react";
import { Activity, Globe2, LockKeyhole, Network, Power, RefreshCw, Route, Shield, Zap } from "lucide-react";
import type { DesktopDevice, DesktopUser } from "../../services/api.js";
import type { MeshSpeedTestResult, MeshSplitTunnelRule, MeshStatus } from "@shared/index";

declare global {
  interface Window {
    remoteDeskMesh: {
      connect(input: Record<string, unknown>): Promise<MeshStatus>;
      disconnect(): Promise<{ state: string }>;
      status(): Promise<MeshStatus>;
      setExitNode(exitNodeId: string | null): Promise<MeshStatus>;
      setSplitTunnel(rules: MeshSplitTunnelRule[]): Promise<MeshStatus>;
      setAlwaysOn(enabled: boolean): Promise<{ enabled: boolean }>;
      speedTest(targetNodeId: string): Promise<MeshSpeedTestResult>;
    };
  }
}

interface MeshPanelProps {
  user: DesktopUser;
  token: string;
  device: DesktopDevice | null;
  apiUrl: string;
}

type MeshOverview = {
  network: { id: string; name: string; magicDnsDomain: string };
  nodes: Array<{ id: string; deviceId: string; name: string; virtualIpV4: string; magicDnsName: string; online: boolean; isExitNode: boolean; exitNodeEnabled: boolean }>;
};

const initialRule: MeshSplitTunnelRule = { kind: "cidr", value: "", action: "include", enabled: true };

export function MeshPanel({ user, token, device, apiUrl }: MeshPanelProps) {
  const [overview, setOverview] = useState<MeshOverview | null>(null);
  const [status, setStatus] = useState<MeshStatus>({ state: "stopped", bytesSent: 0, bytesReceived: 0 });
  const [alwaysOn, setAlwaysOn] = useState(true);
  const [rule, setRule] = useState<MeshSplitTunnelRule>(initialRule);
  const [rules, setRules] = useState<MeshSplitTunnelRule[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [speed, setSpeed] = useState<MeshSpeedTestResult | null>(null);

  const apiRoot = useMemo(() => apiUrl.replace(/\/$/, ""), [apiUrl]);

  async function loadOverview() {
    const response = await fetch(`${apiRoot}/mesh/network`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Mesh network could not be loaded");
    const payload = await response.json() as { success: boolean; data: MeshOverview };
    setOverview(payload.data);
  }

  useEffect(() => {
    void loadOverview().catch((error) => setNotice(error instanceof Error ? error.message : "Mesh network unavailable"));
    const interval = window.setInterval(() => void window.remoteDeskMesh.status().then(setStatus).catch(() => undefined), 5_000);
    return () => window.clearInterval(interval);
  }, [apiRoot, token]);

  async function connect() {
    if (!device) {
      setNotice("Register this desktop before connecting it to the mesh.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const platform = await window.remoteDesk.platform();
      const next = await window.remoteDeskMesh.connect({
        apiBaseUrl: apiRoot,
        accessToken: token,
        deviceId: device.id,
        deviceName: device.name,
        platform,
        clientVersion: "desktop-mesh-v1",
        alwaysOn,
        splitTunnelRules: rules
      });
      setStatus(next);
      await loadOverview();
      setNotice("Encrypted mesh tunnel connected.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Mesh connection failed");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    try {
      await window.remoteDeskMesh.disconnect();
      setStatus({ state: "stopped", bytesSent: 0, bytesReceived: 0 });
      setNotice("Mesh tunnel disconnected.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Disconnect failed");
    } finally {
      setBusy(false);
    }
  }

  async function addRule() {
    if (!rule.value.trim()) return;
    const nextRules = [...rules, { ...rule, value: rule.value.trim() }];
    setRules(nextRules);
    setRule(initialRule);
    if (status.state !== "stopped") await window.remoteDeskMesh.setSplitTunnel(nextRules);
  }

  async function toggleAlwaysOn() {
    const next = !alwaysOn;
    setAlwaysOn(next);
    await window.remoteDeskMesh.setAlwaysOn(next);
  }

  async function testNode(nodeId: string) {
    setSpeed(null);
    try {
      setSpeed(await window.remoteDeskMesh.speedTest(nodeId));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Speed test failed");
    }
  }

  const currentNodeId = overview?.nodes.find((node) => node.deviceId === device?.id)?.id;
  const exitNodes = overview?.nodes.filter((node) => node.isExitNode && node.exitNodeEnabled && node.id !== currentNodeId) ?? [];

  return (
    <section className="panel meshPanel">
      <div className="meshHeader">
        <div>
          <div className="eyebrow"><Network size={14} /> PRIVATE MESH VPN</div>
          <h2>RemoteDesk Mesh</h2>
          <p>WireGuard-encrypted device-to-device networking with Magic DNS, subnet routes, and secure exit nodes.</p>
        </div>
        <div className={`meshStatus meshStatus-${status.state}`}><span className="meshStatusDot" /> {status.state}</div>
      </div>

      <div className="meshStats">
        <div><strong>{overview?.nodes.length ?? 0}</strong><span>devices</span></div>
        <div><strong>{overview?.nodes.filter((node) => node.online).length ?? 0}</strong><span>online</span></div>
        <div><strong>{overview?.network.magicDnsDomain ?? "remotedesk.net"}</strong><span>Magic DNS</span></div>
      </div>

      <div className="buttonRow">
        {status.state === "stopped" || status.state === "error" ? (
          <button onClick={() => void connect()} disabled={busy}><Power size={16} /> {busy ? "Connecting…" : "Connect mesh"}</button>
        ) : (
          <button className="dangerButton" onClick={() => void disconnect()} disabled={busy}><Power size={16} /> Disconnect</button>
        )}
        <button className="ghostButton" onClick={() => void loadOverview()}><RefreshCw size={16} /> Refresh</button>
        <button className={alwaysOn ? "toggleButton active" : "toggleButton"} onClick={() => void toggleAlwaysOn()}><Zap size={16} /> Always-on {alwaysOn ? "on" : "off"}</button>
      </div>

      <div className="meshGrid">
        <div className="meshCard">
          <h3><Globe2 size={16} /> Mesh devices</h3>
          <div className="meshNodeList">
            {overview?.nodes.map((node) => (
              <div className="meshNode" key={node.id}>
                <span className={node.online ? "onlineDot" : "offlineDot"} />
                <div><strong>{node.name}</strong><small>{node.magicDnsName} · {node.virtualIpV4}</small></div>
                {node.id !== currentNodeId ? <button className="miniButton" onClick={() => void testNode(node.id)} title="Run speed test"><Activity size={14} /></button> : null}
              </div>
            )) ?? <p className="muted">Register a device to create your private mesh.</p>}
          </div>
          {speed ? <div className="speedResult">{speed.latencyMs.toFixed(0)} ms latency · {speed.via} path</div> : null}
        </div>

        <div className="meshCard">
          <h3><Route size={16} /> Exit node</h3>
          <p className="muted">Route internet traffic through an approved device without exposing router ports.</p>
          <select defaultValue="" onChange={(event) => void window.remoteDeskMesh.setExitNode(event.target.value || null)}>
            <option value="">Direct internet</option>
            {exitNodes.map((node) => <option key={node.id} value={node.id}>{node.name} ({node.virtualIpV4})</option>)}
          </select>
          <h3><LockKeyhole size={16} /> Split tunneling</h3>
          <div className="inlineForm">
            <input value={rule.value} onChange={(event) => setRule({ ...rule, value: event.target.value })} placeholder="192.168.1.0/24 or app id" />
            <select value={rule.action} onChange={(event) => setRule({ ...rule, action: event.target.value as "include" | "exclude" })}><option value="include">Include</option><option value="exclude">Exclude</option></select>
            <button className="miniButton" onClick={() => void addRule()}>Add</button>
          </div>
          {rules.map((item, index) => <div className="ruleRow" key={`${item.value}-${index}`}><Shield size={13} /> {item.action} {item.value}</div>)}
        </div>
      </div>
      {notice ? <p className="meshNotice">{notice}</p> : null}
    </section>
  );
}
