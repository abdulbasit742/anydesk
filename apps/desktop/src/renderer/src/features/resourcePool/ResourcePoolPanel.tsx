/**
 * ResourcePoolPanel — Distributed Computing UI for the desktop client.
 *
 * Provides:
 *  - Live hardware stats gauges (CPU, RAM, GPU, temperature, network)
 *  - Cluster list with create/join/leave actions
 *  - Node resource limit sliders
 *  - Task submission form and task queue table
 *  - Worker agent start/stop controls
 */

import React, { useState } from "react";
import { Cpu, MemoryStick, Monitor, Thermometer, Network, Play, Square, Plus, LogIn, LogOut, Send, RefreshCw, Server } from "lucide-react";
import { useResourcePool, type Cluster, type ClusterNode } from "./useResourcePool.ts";

interface ResourcePoolPanelProps {
  apiBase: string;
  token: string;
  userId: string;
}

// ─── Gauge component ──────────────────────────────────────────────────────────

function Gauge({ label, value, max = 100, unit = "%", color = "#3b82f6", icon: Icon }: {
  label: string;
  value: number | null;
  max?: number;
  unit?: string;
  color?: string;
  icon: React.ElementType;
}) {
  const pct = value == null ? 0 : Math.min(100, (value / max) * 100);
  const displayColor = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : color;
  return (
    <div style={{ background: "#1e293b", borderRadius: 8, padding: "12px 14px", minWidth: 120 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon size={14} color="#94a3b8" />
        <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: value == null ? "#475569" : displayColor }}>
        {value == null ? "N/A" : `${Math.round(value * 10) / 10}${unit}`}
      </div>
      <div style={{ marginTop: 6, height: 4, background: "#334155", borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: displayColor, borderRadius: 2, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

// ─── Node card ────────────────────────────────────────────────────────────────

function NodeCard({ node, onLeave, onStartAgent, agentRunning }: {
  node: ClusterNode;
  onLeave: () => void;
  onStartAgent: () => void;
  agentRunning: boolean;
}) {
  const t = node.latestTelemetry;
  const statusColor: Record<string, string> = {
    online: "#22c55e", idle: "#22c55e", busy: "#f59e0b", offline: "#ef4444", draining: "#94a3b8",
  };
  return (
    <div style={{ background: "#1e293b", borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{node.nickname ?? `Node ${node.id.slice(0, 8)}`}</span>
          <span style={{ marginLeft: 8, fontSize: 11, color: statusColor[node.status] ?? "#94a3b8", background: "#0f172a", padding: "2px 7px", borderRadius: 10 }}>
            {node.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!agentRunning && (
            <button onClick={onStartAgent} style={btnStyle("#3b82f6")} title="Start worker agent on this node">
              <Play size={12} /> Agent
            </button>
          )}
          <button onClick={onLeave} style={btnStyle("#ef4444")} title="Leave cluster">
            <LogOut size={12} />
          </button>
        </div>
      </div>
      {t && (
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <MiniStat label="CPU" value={`${t.cpuPercent.toFixed(1)}%`} />
          <MiniStat label="RAM" value={`${t.ramPercent.toFixed(1)}%`} />
          {t.activeTaskCount > 0 && <MiniStat label="Tasks" value={String(t.activeTaskCount)} />}
          <MiniStat label="↑" value={`${(t.networkUpKbps / 1024).toFixed(1)} MB/s`} />
          <MiniStat label="↓" value={`${(t.networkDownKbps / 1024).toFixed(1)} MB/s`} />
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
        CPU limit: {Math.round(node.cpuShareLimit * 100)}% · RAM limit: {Math.round(node.ramShareLimit * 100)}% · GPU limit: {Math.round(node.gpuShareLimit * 100)}% · Priority: {node.priorityLevel}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#94a3b8" }}>
      <span style={{ color: "#64748b" }}>{label} </span>{value}
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: 4, background: bg + "22", border: `1px solid ${bg}44`,
    color: bg, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600,
  };
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ResourcePoolPanel({ apiBase, token, userId }: ResourcePoolPanelProps) {
  const rp = useResourcePool(apiBase, token);
  const [tab, setTab] = useState<"stats" | "clusters" | "tasks">("stats");
  const [createName, setCreateName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [joinDeviceId, setJoinDeviceId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("custom");
  const [taskPriority, setTaskPriority] = useState(5);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!createName.trim()) return;
    try {
      await rp.createCluster(createName.trim());
      setCreateName("");
      setShowCreateForm(false);
      setActionError(null);
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim() || !joinDeviceId.trim()) return;
    try {
      await rp.joinCluster(inviteCode.trim(), joinDeviceId.trim());
      setInviteCode("");
      setJoinDeviceId("");
      setShowJoinForm(false);
      setActionError(null);
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  const handleSubmitTask = async () => {
    if (!rp.selectedCluster || !taskName.trim()) return;
    try {
      await rp.submitTask(rp.selectedCluster.id, { name: taskName.trim(), type: taskType, priority: taskPriority });
      setTaskName("");
      setShowTaskForm(false);
      setActionError(null);
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  const s = rp.stats;

  return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", fontFamily: "system-ui, sans-serif", padding: 20, minHeight: "100%", fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Server size={20} color="#3b82f6" />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Resource Pool</h2>
        {rp.agentStatus?.running && (
          <span style={{ fontSize: 11, background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44", borderRadius: 10, padding: "2px 8px" }}>
            Agent running
          </span>
        )}
        <button onClick={rp.loadClusters} style={{ marginLeft: "auto", ...btnStyle("#94a3b8") }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid #1e293b", paddingBottom: 8 }}>
        {(["stats", "clusters", "tasks"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? "#1e293b" : "transparent",
            border: "none", color: tab === t ? "#f1f5f9" : "#64748b",
            borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: tab === t ? 600 : 400, fontSize: 13,
            textTransform: "capitalize",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {(rp.error || actionError) && (
        <div style={{ background: "#ef444422", border: "1px solid #ef444444", borderRadius: 6, padding: "8px 12px", marginBottom: 12, color: "#ef4444", fontSize: 12 }}>
          {rp.error ?? actionError}
        </div>
      )}

      {/* Stats tab */}
      {tab === "stats" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
            <Gauge label="CPU" value={s?.cpuPercent ?? null} icon={Cpu} color="#3b82f6" />
            <Gauge label="RAM" value={s?.ramPercent ?? null} icon={MemoryStick} color="#8b5cf6" />
            <Gauge label="GPU" value={s?.gpuPercent ?? null} icon={Monitor} color="#06b6d4" />
            <Gauge label="CPU Temp" value={s?.cpuTempC ?? null} max={100} unit="°C" icon={Thermometer} color="#f59e0b" />
            <Gauge label="GPU Temp" value={s?.gpuTempC ?? null} max={100} unit="°C" icon={Thermometer} color="#f97316" />
            <Gauge label="Net ↑" value={s ? s.networkUpKbps / 1024 : null} max={1000} unit=" MB/s" icon={Network} color="#22c55e" />
            <Gauge label="Net ↓" value={s ? s.networkDownKbps / 1024 : null} max={1000} unit=" MB/s" icon={Network} color="#22c55e" />
          </div>
          {s && (
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 12, fontSize: 12, color: "#94a3b8" }}>
              <strong style={{ color: "#f1f5f9" }}>{s.hostname}</strong> · {s.platform} ·
              RAM: {(s.ramUsedMb / 1024).toFixed(1)} GB / {(s.ramTotalMb / 1024).toFixed(1)} GB
              {s.gpuVramTotalMb && ` · VRAM: ${(s.gpuVramUsedMb! / 1024).toFixed(1)} / ${(s.gpuVramTotalMb / 1024).toFixed(1)} GB`}
            </div>
          )}

          {/* Agent controls */}
          <div style={{ marginTop: 16 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>Worker Agent</h3>
            {rp.agentStatus?.running ? (
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                  Node: {rp.agentStatus.nodeId?.slice(0, 8)} · Cluster: {rp.agentStatus.clusterId?.slice(0, 8)} ·
                  Active tasks: {rp.agentStatus.activeTasks} ·
                  Last heartbeat: {rp.agentStatus.lastHeartbeatAt ? new Date(rp.agentStatus.lastHeartbeatAt).toLocaleTimeString() : "—"}
                </div>
                <button onClick={rp.stopAgent} style={btnStyle("#ef4444")}>
                  <Square size={12} /> Stop Agent
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Select a cluster node and click "Agent" to start reporting resources.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clusters tab */}
      {tab === "clusters" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button onClick={() => setShowCreateForm(!showCreateForm)} style={btnStyle("#3b82f6")}>
              <Plus size={12} /> Create Cluster
            </button>
            <button onClick={() => setShowJoinForm(!showJoinForm)} style={btnStyle("#22c55e")}>
              <LogIn size={12} /> Join Cluster
            </button>
          </div>

          {showCreateForm && (
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <input
                value={createName} onChange={(e) => setCreateName(e.target.value)}
                placeholder="Cluster name" style={inputStyle}
              />
              <button onClick={handleCreate} style={{ ...btnStyle("#3b82f6"), marginTop: 8 }}>Create</button>
            </div>
          )}

          {showJoinForm && (
            <div style={{ background: "#1e293b", borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Invite code (UUID)" style={inputStyle} />
              <input value={joinDeviceId} onChange={(e) => setJoinDeviceId(e.target.value)} placeholder="Your Device ID" style={{ ...inputStyle, marginTop: 8 }} />
              <button onClick={handleJoin} style={{ ...btnStyle("#22c55e"), marginTop: 8 }}>Join</button>
            </div>
          )}

          {rp.clusters.length === 0 && !rp.loading && (
            <div style={{ color: "#475569", textAlign: "center", padding: "30px 0" }}>No clusters yet. Create or join one above.</div>
          )}

          {rp.clusters.map((cluster) => (
            <div key={cluster.id} style={{
              background: rp.selectedCluster?.id === cluster.id ? "#1e3a5f" : "#1e293b",
              borderRadius: 8, padding: 14, marginBottom: 10, cursor: "pointer",
              border: rp.selectedCluster?.id === cluster.id ? "1px solid #3b82f6" : "1px solid transparent",
            }} onClick={() => rp.selectCluster(cluster)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{cluster.name}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: cluster.status === "active" ? "#22c55e" : "#94a3b8" }}>
                    {cluster.status}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {cluster.onlineNodeCount}/{cluster.nodeCount} nodes online
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                Invite: <code style={{ color: "#94a3b8" }}>{cluster.inviteCode}</code>
              </div>
            </div>
          ))}

          {/* Selected cluster nodes */}
          {rp.selectedCluster && rp.nodes.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>
                Nodes in "{rp.selectedCluster.name}"
              </h3>
              {rp.nodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  onLeave={() => rp.leaveCluster(node.clusterId, node.id)}
                  onStartAgent={() => rp.startAgent(node.id, node.clusterId)}
                  agentRunning={rp.agentStatus?.running === true && rp.agentStatus.nodeId === node.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks tab */}
      {tab === "tasks" && (
        <div>
          {rp.selectedCluster ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>Cluster: {rp.selectedCluster.name}</span>
                <button onClick={() => setShowTaskForm(!showTaskForm)} style={btnStyle("#3b82f6")}>
                  <Send size={12} /> Submit Task
                </button>
              </div>

              {showTaskForm && (
                <div style={{ background: "#1e293b", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Task name" style={inputStyle} />
                  <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={{ ...inputStyle, marginTop: 8 }}>
                    <option value="custom">Custom</option>
                    <option value="video_render">Video Render</option>
                    <option value="ai_inference">AI Inference</option>
                    <option value="compilation">Compilation</option>
                    <option value="game_stream">Game Stream</option>
                    <option value="scientific_compute">Scientific Compute</option>
                  </select>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
                    Priority: {taskPriority}
                    <input type="range" min={1} max={10} value={taskPriority} onChange={(e) => setTaskPriority(Number(e.target.value))}
                      style={{ width: "100%", marginTop: 4 }} />
                  </div>
                  <button onClick={handleSubmitTask} style={{ ...btnStyle("#3b82f6"), marginTop: 8 }}>Submit</button>
                </div>
              )}

              {rp.tasks.length === 0 ? (
                <div style={{ color: "#475569", textAlign: "center", padding: "30px 0" }}>No tasks yet.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderBottom: "1px solid #1e293b" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px" }}>Name</th>
                      <th style={{ textAlign: "left", padding: "6px 8px" }}>Type</th>
                      <th style={{ textAlign: "left", padding: "6px 8px" }}>Status</th>
                      <th style={{ textAlign: "left", padding: "6px 8px" }}>Progress</th>
                      <th style={{ textAlign: "left", padding: "6px 8px" }}>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rp.tasks.map((task) => (
                      <tr key={task.id} style={{ borderBottom: "1px solid #0f172a" }}>
                        <td style={{ padding: "6px 8px", color: "#f1f5f9" }}>{task.name}</td>
                        <td style={{ padding: "6px 8px", color: "#94a3b8" }}>{task.type.replace("_", " ")}</td>
                        <td style={{ padding: "6px 8px" }}>
                          <span style={{
                            color: task.status === "completed" ? "#22c55e" : task.status === "failed" ? "#ef4444" : task.status === "running" ? "#3b82f6" : "#94a3b8",
                            fontWeight: 500,
                          }}>
                            {task.status}
                          </span>
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <div style={{ width: 80, height: 4, background: "#334155", borderRadius: 2 }}>
                            <div style={{ width: `${task.progressPercent}%`, height: "100%", background: "#3b82f6", borderRadius: 2 }} />
                          </div>
                        </td>
                        <td style={{ padding: "6px 8px", color: "#94a3b8" }}>{task.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <div style={{ color: "#475569", textAlign: "center", padding: "30px 0" }}>
              Select a cluster in the Clusters tab to view and submit tasks.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 6,
  color: "#f1f5f9", padding: "7px 10px", fontSize: 13, boxSizing: "border-box",
};
