/**
 * CloudGamingPanel — Desktop Renderer Component
 *
 * Provides the full cloud gaming UI:
 * - Hardware encoder detection & selection
 * - Streaming profile management
 * - Controller passthrough with Gamepad API
 * - Performance overlay (FPS, latency, bitrate, GPU)
 * - Adaptive bitrate controls
 * - HDR settings
 * - Multi-monitor selection
 * - Cursor prediction
 * - Virtual display creation
 * - Wake-on-LAN
 * - Game detection & auto-optimization
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Encoder {
  type: string;
  name: string;
  vendor: string;
  codecs: string[];
  maxWidth: number;
  maxHeight: number;
  maxFps: number;
  available: boolean;
}

interface DetectedGame {
  name: string;
  processName: string;
  platform: string;
  isRunning: boolean;
  recommendedProfile?: string;
}

interface Display {
  id: string;
  name: string;
  width: number;
  height: number;
  refreshRate: number;
  primary: boolean;
}

interface StreamingSettings {
  encoder: string;
  codec: string;
  resolution: string;
  framerate: number;
  bitrate: number;
  adaptiveBitrate: boolean;
  hdrEnabled: boolean;
  latencyMode: string;
  roiEnabled: boolean;
  audioChannels: number;
  cursorPrediction: boolean;
  predictionMs: number;
}

interface PerformanceMetrics {
  fps: number;
  latencyMs: number;
  bitrateKbps: number;
  packetLoss: number;
  encodeTimeMs: number;
  decodeTimeMs: number;
  rttMs: number;
  jitterMs: number;
  cpuUsage: number;
  gpuUsage: number;
  vramUsage: number;
  gpuTemp: number;
}

interface Controller {
  index: number;
  id: string;
  axes: readonly number[];
  buttons: readonly GamepadButton[];
  connected: boolean;
}

interface WolTarget {
  name: string;
  macAddress: string;
  broadcastIp: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

const cg = (window as any).cloudGaming;

const RESOLUTIONS = ["1280x720", "1920x1080", "2560x1440", "3840x2160"];
const FRAMERATES = [30, 60, 120, 144, 240];
const CODECS = ["h264", "h265", "av1"];
const LATENCY_MODES = [
  { value: "ultra_low", label: "Ultra Low (<8ms)" },
  { value: "low", label: "Low (<16ms)" },
  { value: "balanced", label: "Balanced (<50ms)" },
  { value: "quality", label: "Quality (>50ms)" },
];

function MetricBadge({ label, value, unit, color }: { label: string; value: number | string; unit?: string; color?: string }) {
  const bg = color || "#1e293b";
  return (
    <div style={{ background: bg, borderRadius: 6, padding: "6px 12px", minWidth: 80, textAlign: "center", border: "1px solid #334155" }}>
      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
        {typeof value === "number" ? value.toFixed(value < 10 ? 1 : 0) : value}
        {unit && <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer",
        background: active ? "#3b82f6" : "transparent",
        color: active ? "#fff" : "#94a3b8",
        fontSize: 13, fontWeight: active ? 600 : 400,
        transition: "all 0.15s"
      }}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CloudGamingPanel() {
  const [activeTab, setActiveTab] = useState<"encoder" | "stream" | "overlay" | "controllers" | "display" | "wol" | "games">("encoder");
  const [encoders, setEncoders] = useState<Encoder[]>([]);
  const [games, setGames] = useState<DetectedGame[]>([]);
  const [displays, setDisplays] = useState<Display[]>([]);
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [hdrEnabled, setHdrEnabled] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [wolTargets, setWolTargets] = useState<WolTarget[]>([]);
  const [newWol, setNewWol] = useState<WolTarget>({ name: "", macAddress: "", broadcastIp: "255.255.255.255" });
  const [virtualDisplaySettings, setVirtualDisplaySettings] = useState({ width: 1920, height: 1080, refreshRate: 60 });
  const [settings, setSettings] = useState<StreamingSettings>({
    encoder: "software", codec: "h264", resolution: "1920x1080", framerate: 60,
    bitrate: 20000, adaptiveBitrate: true, hdrEnabled: false, latencyMode: "low",
    roiEnabled: false, audioChannels: 2, cursorPrediction: true, predictionMs: 16
  });

  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gamepadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showMessage = useCallback((text: string, type: "success" | "error" | "info" = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const setLoadingKey = useCallback((key: string, val: boolean) => {
    setLoading(prev => ({ ...prev, [key]: val }));
  }, []);

  // ── Encoder Detection ──────────────────────────────────────────────────────

  const detectEncoders = useCallback(async () => {
    if (!cg) return;
    setLoadingKey("encoders", true);
    try {
      const result = await cg.detectEncoders();
      if (result.success) {
        setEncoders(result.encoders);
        const best = result.encoders.find((e: Encoder) => e.type !== "software");
        if (best) {
          setSettings(prev => ({ ...prev, encoder: best.type }));
          showMessage(`Detected ${result.encoders.length} encoder(s). Best: ${best.name}`, "success");
        }
      }
    } catch (err) {
      showMessage("Encoder detection failed", "error");
    } finally {
      setLoadingKey("encoders", false);
    }
  }, [showMessage, setLoadingKey]);

  // ── Game Detection ─────────────────────────────────────────────────────────

  const detectGames = useCallback(async () => {
    if (!cg) return;
    setLoadingKey("games", true);
    try {
      const result = await cg.detectGames();
      if (result.success) {
        setGames(result.games);
        const running = result.games.filter((g: DetectedGame) => g.isRunning);
        if (running.length > 0) {
          showMessage(`Detected ${running.length} running game(s): ${running.map((g: DetectedGame) => g.name).join(", ")}`, "info");
        }
      }
    } catch (err) {
      showMessage("Game detection failed", "error");
    } finally {
      setLoadingKey("games", false);
    }
  }, [showMessage, setLoadingKey]);

  // ── Auto-optimize for game ─────────────────────────────────────────────────

  const optimizeForGame = useCallback(async (gameName: string) => {
    if (!cg) return;
    try {
      const result = await cg.optimizeForGame(gameName);
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          encoder: result.settings.encoder,
          codec: result.settings.codec,
          latencyMode: result.settings.latencyMode,
          framerate: result.settings.framerate,
          bitrate: result.settings.bitrate
        }));
        showMessage(`Optimized settings for ${gameName} (${result.profile} profile)`, "success");
      }
    } catch { showMessage("Optimization failed", "error"); }
  }, [showMessage]);

  // ── Displays ───────────────────────────────────────────────────────────────

  const loadDisplays = useCallback(async () => {
    if (!cg) return;
    try {
      const result = await cg.getDisplays();
      if (result.success) setDisplays(result.displays);
    } catch { /* ignore */ }
  }, []);

  // ── HDR ────────────────────────────────────────────────────────────────────

  const checkHdr = useCallback(async () => {
    if (!cg) return;
    try {
      const result = await cg.getHdrStatus();
      setHdrEnabled(result.hdrEnabled);
      if (result.hdrEnabled) {
        setSettings(prev => ({ ...prev, hdrEnabled: true }));
        showMessage(`HDR detected: ${result.format?.toUpperCase() || "HDR10"}`, "success");
      }
    } catch { /* ignore */ }
  }, [showMessage]);

  // ── Performance Metrics Polling ────────────────────────────────────────────

  const startMetricsPolling = useCallback(() => {
    if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
    metricsIntervalRef.current = setInterval(async () => {
      if (!cg) return;
      // Simulate session metrics (in production these come from WebRTC stats)
      const mockMetrics = {
        fps: 55 + Math.random() * 10,
        latencyMs: 8 + Math.random() * 8,
        bitrateKbps: settings.bitrate - 2000 + Math.random() * 4000,
        packetLoss: Math.random() * 0.5,
        encodeTimeMs: 1 + Math.random() * 3,
        decodeTimeMs: 0.5 + Math.random() * 2,
        rttMs: 5 + Math.random() * 15,
        jitterMs: Math.random() * 2
      };
      try {
        const result = await cg.getPerformanceOverlay(mockMetrics);
        if (result.success) setMetrics(result.overlay);
      } catch { /* ignore */ }
    }, 1000);
  }, [settings.bitrate]);

  // ── Gamepad Polling ────────────────────────────────────────────────────────

  const startGamepadPolling = useCallback(() => {
    if (gamepadIntervalRef.current) clearInterval(gamepadIntervalRef.current);
    gamepadIntervalRef.current = setInterval(() => {
      const gamepads = navigator.getGamepads();
      const connected: Controller[] = [];
      for (const gp of gamepads) {
        if (gp) {
          connected.push({
            index: gp.index,
            id: gp.id,
            axes: gp.axes,
            buttons: gp.buttons,
            connected: gp.connected
          });
        }
      }
      setControllers(connected);
    }, 100);
  }, []);

  // ── Wake-on-LAN ────────────────────────────────────────────────────────────

  const sendWol = useCallback(async (target: WolTarget) => {
    if (!cg) return;
    setLoadingKey(`wol-${target.macAddress}`, true);
    try {
      const result = await cg.wakeOnLan(target.macAddress, target.broadcastIp);
      showMessage(result.message, result.success ? "success" : "error");
    } catch { showMessage("WoL failed", "error"); }
    finally { setLoadingKey(`wol-${target.macAddress}`, false); }
  }, [showMessage, setLoadingKey]);

  // ── Virtual Display ────────────────────────────────────────────────────────

  const createVirtualDisplay = useCallback(async () => {
    if (!cg) return;
    setLoadingKey("vdisplay", true);
    try {
      const result = await cg.createVirtualDisplay(
        virtualDisplaySettings.width,
        virtualDisplaySettings.height,
        virtualDisplaySettings.refreshRate
      );
      showMessage(result.message, result.success ? "success" : "error");
      if (result.success) loadDisplays();
    } catch { showMessage("Virtual display creation failed", "error"); }
    finally { setLoadingKey("vdisplay", false); }
  }, [virtualDisplaySettings, showMessage, setLoadingKey, loadDisplays]);

  // ── Cursor Prediction ──────────────────────────────────────────────────────

  const applyCursorPrediction = useCallback(async () => {
    if (!cg) return;
    try {
      const result = await cg.setCursorPrediction(settings.cursorPrediction, settings.predictionMs);
      showMessage(result.message, "success");
    } catch { /* ignore */ }
  }, [settings.cursorPrediction, settings.predictionMs, showMessage]);

  // ── Init ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    detectEncoders();
    loadDisplays();
    checkHdr();
    detectGames();
    startGamepadPolling();

    window.addEventListener("gamepadconnected", (e) => {
      showMessage(`Controller connected: ${(e as GamepadEvent).gamepad.id}`, "success");
    });
    window.addEventListener("gamepaddisconnected", (e) => {
      showMessage(`Controller disconnected: ${(e as GamepadEvent).gamepad.id}`, "info");
    });

    return () => {
      if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
      if (gamepadIntervalRef.current) clearInterval(gamepadIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (overlayVisible) startMetricsPolling();
    else if (metricsIntervalRef.current) { clearInterval(metricsIntervalRef.current); metricsIntervalRef.current = null; }
  }, [overlayVisible, startMetricsPolling]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = {
    background: "#0f172a", color: "#f1f5f9", fontFamily: "system-ui, sans-serif",
    height: "100%", display: "flex", flexDirection: "column", overflow: "hidden"
  };

  const sectionStyle: React.CSSProperties = {
    background: "#1e293b", borderRadius: 10, padding: 16, marginBottom: 12,
    border: "1px solid #334155"
  };

  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#94a3b8", marginBottom: 4, display: "block" };

  const selectStyle: React.CSSProperties = {
    width: "100%", background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155",
    borderRadius: 6, padding: "6px 10px", fontSize: 13
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155",
    borderRadius: 6, padding: "6px 10px", fontSize: 13, boxSizing: "border-box"
  };

  const btnStyle = (color = "#3b82f6"): React.CSSProperties => ({
    background: color, color: "#fff", border: "none", borderRadius: 6,
    padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600
  });

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
    background: active ? "#3b82f6" : "#334155", position: "relative", transition: "background 0.2s"
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>🎮 Cloud Gaming & Streaming</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>Parsec/Moonlight-style high-performance streaming</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setOverlayVisible(!overlayVisible)}
            style={{ ...btnStyle(overlayVisible ? "#10b981" : "#475569"), fontSize: 12 }}
          >
            {overlayVisible ? "📊 Overlay ON" : "📊 Overlay OFF"}
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div style={{
          padding: "8px 20px", fontSize: 13,
          background: message.type === "success" ? "#064e3b" : message.type === "error" ? "#7f1d1d" : "#1e3a5f",
          color: message.type === "success" ? "#6ee7b7" : message.type === "error" ? "#fca5a5" : "#93c5fd",
          borderBottom: "1px solid #1e293b"
        }}>
          {message.text}
        </div>
      )}

      {/* Performance Overlay */}
      {overlayVisible && metrics && (
        <div style={{
          background: "rgba(0,0,0,0.85)", padding: "10px 16px", display: "flex", gap: 8,
          flexWrap: "wrap", borderBottom: "1px solid #1e293b"
        }}>
          <MetricBadge label="FPS" value={metrics.fps} color={metrics.fps >= 55 ? "#064e3b" : metrics.fps >= 30 ? "#713f12" : "#7f1d1d"} />
          <MetricBadge label="Latency" value={metrics.latencyMs} unit="ms" color={metrics.latencyMs <= 16 ? "#064e3b" : metrics.latencyMs <= 50 ? "#713f12" : "#7f1d1d"} />
          <MetricBadge label="Bitrate" value={Math.round(metrics.bitrateKbps / 1000)} unit="Mbps" />
          <MetricBadge label="Loss" value={metrics.packetLoss} unit="%" color={metrics.packetLoss < 1 ? "#064e3b" : "#7f1d1d"} />
          <MetricBadge label="Encode" value={metrics.encodeTimeMs} unit="ms" />
          <MetricBadge label="Decode" value={metrics.decodeTimeMs} unit="ms" />
          <MetricBadge label="RTT" value={metrics.rttMs} unit="ms" />
          <MetricBadge label="CPU" value={metrics.cpuUsage} unit="%" />
          <MetricBadge label="GPU" value={metrics.gpuUsage} unit="%" color={metrics.gpuUsage > 90 ? "#7f1d1d" : "#1e293b"} />
          <MetricBadge label="VRAM" value={metrics.vramUsage} unit="%" />
          <MetricBadge label="GPU°C" value={metrics.gpuTemp} unit="°C" color={metrics.gpuTemp > 85 ? "#7f1d1d" : "#1e293b"} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #1e293b", display: "flex", gap: 4, flexWrap: "wrap" }}>
        {(["encoder", "stream", "overlay", "controllers", "display", "wol", "games"] as const).map(tab => (
          <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {{ encoder: "🔧 Encoder", stream: "📡 Stream", overlay: "📊 Overlay", controllers: "🎮 Controllers", display: "🖥️ Display", wol: "⚡ Wake-on-LAN", games: "🎯 Games" }[tab]}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

        {/* ── Encoder Tab ── */}
        {activeTab === "encoder" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Hardware Encoder Detection</h3>
              <button onClick={detectEncoders} disabled={loading.encoders} style={btnStyle()}>
                {loading.encoders ? "Scanning..." : "🔍 Scan"}
              </button>
            </div>

            {encoders.length === 0 ? (
              <div style={{ ...sectionStyle, textAlign: "center", color: "#64748b", padding: 32 }}>
                Click "Scan" to detect hardware encoders (NVENC, AMF, QuickSync, VideoToolbox, VAAPI)
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {encoders.map(enc => (
                  <div key={enc.type} style={{
                    ...sectionStyle,
                    border: settings.encoder === enc.type ? "1px solid #3b82f6" : "1px solid #334155",
                    cursor: "pointer"
                  }} onClick={() => setSettings(prev => ({ ...prev, encoder: enc.type }))}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {enc.type !== "software" ? "⚡" : "💻"} {enc.name}
                          {settings.encoder === enc.type && <span style={{ marginLeft: 8, fontSize: 11, color: "#3b82f6" }}>● SELECTED</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                          Vendor: {enc.vendor.toUpperCase()} · Codecs: {enc.codecs.join(", ").toUpperCase()} · Max: {enc.maxWidth}×{enc.maxHeight}@{enc.maxFps}fps
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 4,
                        background: enc.available ? "#064e3b" : "#7f1d1d",
                        color: enc.available ? "#6ee7b7" : "#fca5a5"
                      }}>
                        {enc.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...sectionStyle, marginTop: 12 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Codec Selection</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {CODECS.map(codec => (
                  <button
                    key={codec}
                    onClick={() => setSettings(prev => ({ ...prev, codec }))}
                    style={{
                      padding: "10px", border: "1px solid", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600,
                      borderColor: settings.codec === codec ? "#3b82f6" : "#334155",
                      background: settings.codec === codec ? "#1e3a5f" : "#0f172a",
                      color: settings.codec === codec ? "#93c5fd" : "#94a3b8"
                    }}
                  >
                    {codec.toUpperCase()}
                    <div style={{ fontSize: 10, fontWeight: 400, color: "#64748b", marginTop: 2 }}>
                      {{ h264: "Best compat.", h265: "50% smaller", av1: "Best quality" }[codec]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Stream Settings Tab ── */}
        {activeTab === "stream" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Resolution & Framerate</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Resolution</label>
                  <select style={selectStyle} value={settings.resolution} onChange={e => setSettings(prev => ({ ...prev, resolution: e.target.value }))}>
                    {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Framerate</label>
                  <select style={selectStyle} value={settings.framerate} onChange={e => setSettings(prev => ({ ...prev, framerate: parseInt(e.target.value) }))}>
                    {FRAMERATES.map(f => <option key={f} value={f}>{f} fps</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Bitrate & Adaptive Streaming</h4>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Target Bitrate: {(settings.bitrate / 1000).toFixed(0)} Mbps</label>
                <input type="range" min={1000} max={100000} step={1000} value={settings.bitrate}
                  onChange={e => setSettings(prev => ({ ...prev, bitrate: parseInt(e.target.value) }))}
                  style={{ width: "100%", accentColor: "#3b82f6" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
                  <span>1 Mbps</span><span>100 Mbps</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button style={toggleStyle(settings.adaptiveBitrate)} onClick={() => setSettings(prev => ({ ...prev, adaptiveBitrate: !prev.adaptiveBitrate }))} />
                <span style={{ fontSize: 13 }}>Adaptive Bitrate (ABR) — auto-adjusts to network conditions</span>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Latency Mode</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {LATENCY_MODES.map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setSettings(prev => ({ ...prev, latencyMode: mode.value }))}
                    style={{
                      padding: "10px", border: "1px solid", borderRadius: 6, cursor: "pointer", fontSize: 12,
                      borderColor: settings.latencyMode === mode.value ? "#3b82f6" : "#334155",
                      background: settings.latencyMode === mode.value ? "#1e3a5f" : "#0f172a",
                      color: settings.latencyMode === mode.value ? "#93c5fd" : "#94a3b8"
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Audio</h4>
              <div>
                <label style={labelStyle}>Audio Channels</label>
                <select style={selectStyle} value={settings.audioChannels} onChange={e => setSettings(prev => ({ ...prev, audioChannels: parseInt(e.target.value) }))}>
                  <option value={2}>Stereo (2.0)</option>
                  <option value={6}>5.1 Surround</option>
                  <option value={8}>7.1 Surround</option>
                </select>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Advanced</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button style={toggleStyle(settings.hdrEnabled)} onClick={() => setSettings(prev => ({ ...prev, hdrEnabled: !prev.hdrEnabled }))} />
                  <span style={{ fontSize: 13 }}>HDR10 / Dolby Vision {!hdrEnabled && <span style={{ color: "#64748b", fontSize: 11 }}>(display not HDR-capable)</span>}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button style={toggleStyle(settings.roiEnabled)} onClick={() => setSettings(prev => ({ ...prev, roiEnabled: !prev.roiEnabled }))} />
                  <span style={{ fontSize: 13 }}>Region-of-Interest Encoding (higher quality near cursor)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay Tab ── */}
        {activeTab === "overlay" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={sectionStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 13 }}>Performance Overlay</h4>
                <button onClick={() => setOverlayVisible(!overlayVisible)} style={btnStyle(overlayVisible ? "#10b981" : "#3b82f6")}>
                  {overlayVisible ? "Hide Overlay" : "Show Overlay"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>
                Real-time FPS, latency, bitrate, packet loss, encode/decode time, RTT, CPU/GPU usage, VRAM, and temperature.
              </p>
              {metrics && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
                  <MetricBadge label="FPS" value={metrics.fps} color={metrics.fps >= 55 ? "#064e3b" : "#7f1d1d"} />
                  <MetricBadge label="Latency" value={metrics.latencyMs} unit="ms" />
                  <MetricBadge label="Bitrate" value={Math.round(metrics.bitrateKbps / 1000)} unit="Mbps" />
                  <MetricBadge label="Pkt Loss" value={metrics.packetLoss} unit="%" />
                  <MetricBadge label="Encode" value={metrics.encodeTimeMs} unit="ms" />
                  <MetricBadge label="Decode" value={metrics.decodeTimeMs} unit="ms" />
                  <MetricBadge label="RTT" value={metrics.rttMs} unit="ms" />
                  <MetricBadge label="Jitter" value={metrics.jitterMs} unit="ms" />
                  <MetricBadge label="CPU" value={metrics.cpuUsage} unit="%" />
                  <MetricBadge label="GPU" value={metrics.gpuUsage} unit="%" />
                  <MetricBadge label="VRAM" value={metrics.vramUsage} unit="%" />
                  <MetricBadge label="GPU°C" value={metrics.gpuTemp} unit="°C" />
                </div>
              )}
              {!metrics && <div style={{ color: "#64748b", fontSize: 13 }}>Enable overlay to start collecting metrics.</div>}
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Cursor Prediction</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <button style={toggleStyle(settings.cursorPrediction)} onClick={() => setSettings(prev => ({ ...prev, cursorPrediction: !prev.cursorPrediction }))} />
                <span style={{ fontSize: 13 }}>Client-side cursor prediction (masks network latency)</span>
              </div>
              {settings.cursorPrediction && (
                <div>
                  <label style={labelStyle}>Prediction Window: {settings.predictionMs}ms</label>
                  <input type="range" min={0} max={100} step={4} value={settings.predictionMs}
                    onChange={e => setSettings(prev => ({ ...prev, predictionMs: parseInt(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#3b82f6" }} />
                </div>
              )}
              <button onClick={applyCursorPrediction} style={{ ...btnStyle(), marginTop: 8, fontSize: 12 }}>Apply</button>
            </div>
          </div>
        )}

        {/* ── Controllers Tab ── */}
        {activeTab === "controllers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Gamepad / Controller Passthrough</h3>
              <span style={{ fontSize: 12, color: "#64748b" }}>{controllers.length} connected</span>
            </div>

            {controllers.length === 0 ? (
              <div style={{ ...sectionStyle, textAlign: "center", color: "#64748b", padding: 32 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎮</div>
                <div>No controllers detected. Connect an Xbox, PS5, or generic HID gamepad.</div>
                <div style={{ fontSize: 11, marginTop: 8 }}>Controllers are detected automatically via the Gamepad API.</div>
              </div>
            ) : (
              controllers.map(ctrl => (
                <div key={ctrl.index} style={sectionStyle}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                    🎮 Controller {ctrl.index + 1}
                    <span style={{ marginLeft: 8, fontSize: 11, color: "#10b981" }}>● Connected</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{ctrl.id}</div>

                  {/* Axes visualization */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Axes</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {Array.from(ctrl.axes).map((axis, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#64748b" }}>A{i}</div>
                          <div style={{ width: 60, height: 6, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                              height: "100%", background: "#3b82f6",
                              width: `${Math.abs(axis) * 100}%`,
                              marginLeft: axis < 0 ? 0 : "50%",
                              transform: axis < 0 ? "translateX(0)" : undefined
                            }} />
                          </div>
                          <div style={{ fontSize: 9, color: "#64748b" }}>{axis.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons visualization */}
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Buttons</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {Array.from(ctrl.buttons).map((btn, i) => (
                        <div key={i} style={{
                          width: 28, height: 28, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                          background: btn.pressed ? "#3b82f6" : "#334155",
                          fontSize: 9, color: btn.pressed ? "#fff" : "#64748b", fontWeight: 700
                        }}>
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}

            <div style={{ ...sectionStyle, marginTop: 12 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13 }}>Vibration / Haptic Feedback</h4>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px" }}>
                Controller vibration is passed through via the Gamepad Haptics API. Supported on Xbox and PS5 controllers.
              </p>
              <button
                onClick={() => {
                  const gp = navigator.getGamepads()[0];
                  if (gp && (gp as any).vibrationActuator) {
                    (gp as any).vibrationActuator.playEffect("dual-rumble", { duration: 500, strongMagnitude: 0.5, weakMagnitude: 0.5 });
                    showMessage("Vibration test sent!", "success");
                  } else {
                    showMessage("No vibration-capable controller found", "error");
                  }
                }}
                style={btnStyle("#7c3aed")}
              >
                🔔 Test Vibration
              </button>
            </div>
          </div>
        )}

        {/* ── Display Tab ── */}
        {activeTab === "display" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={sectionStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 13 }}>Connected Displays</h4>
                <button onClick={loadDisplays} style={{ ...btnStyle(), fontSize: 12 }}>🔄 Refresh</button>
              </div>
              {displays.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: 13 }}>No displays detected.</div>
              ) : (
                displays.map(d => (
                  <div key={d.id} style={{ ...sectionStyle, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>🖥️ {d.name}</span>
                        {d.primary && <span style={{ marginLeft: 8, fontSize: 11, color: "#3b82f6" }}>Primary</span>}
                      </div>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{d.width}×{d.height}@{d.refreshRate}Hz</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Create Virtual Display</h4>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>
                Create a headless virtual monitor for cloud gaming servers without physical displays.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Width</label>
                  <input type="number" style={inputStyle} value={virtualDisplaySettings.width}
                    onChange={e => setVirtualDisplaySettings(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 })} />
                </div>
                <div>
                  <label style={labelStyle}>Height</label>
                  <input type="number" style={inputStyle} value={virtualDisplaySettings.height}
                    onChange={e => setVirtualDisplaySettings(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 })} />
                </div>
                <div>
                  <label style={labelStyle}>Refresh Rate</label>
                  <select style={selectStyle} value={virtualDisplaySettings.refreshRate}
                    onChange={e => setVirtualDisplaySettings(prev => ({ ...prev, refreshRate: parseInt(e.target.value) }))}>
                    {[30, 60, 120, 144, 240].map(r => <option key={r} value={r}>{r} Hz</option>)}
                  </select>
                </div>
              </div>
              <button onClick={createVirtualDisplay} disabled={loading.vdisplay} style={btnStyle()}>
                {loading.vdisplay ? "Creating..." : "➕ Create Virtual Display"}
              </button>
            </div>

            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13 }}>HDR Status</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 4,
                  background: hdrEnabled ? "#064e3b" : "#1e293b",
                  color: hdrEnabled ? "#6ee7b7" : "#64748b",
                  border: "1px solid " + (hdrEnabled ? "#065f46" : "#334155")
                }}>
                  {hdrEnabled ? "✓ HDR Available" : "✗ SDR Only"}
                </span>
                <button onClick={checkHdr} style={{ ...btnStyle("#475569"), fontSize: 12 }}>🔍 Re-check</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Wake-on-LAN Tab ── */}
        {activeTab === "wol" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={sectionStyle}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Add WoL Target</h4>
              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle} placeholder="Gaming PC" value={newWol.name}
                    onChange={e => setNewWol(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>MAC Address</label>
                  <input style={inputStyle} placeholder="AA:BB:CC:DD:EE:FF" value={newWol.macAddress}
                    onChange={e => setNewWol(prev => ({ ...prev, macAddress: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Broadcast IP</label>
                  <input style={inputStyle} placeholder="255.255.255.255" value={newWol.broadcastIp}
                    onChange={e => setNewWol(prev => ({ ...prev, broadcastIp: e.target.value }))} />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!newWol.name || !newWol.macAddress) { showMessage("Name and MAC address required", "error"); return; }
                  setWolTargets(prev => [...prev, newWol]);
                  setNewWol({ name: "", macAddress: "", broadcastIp: "255.255.255.255" });
                  showMessage(`WoL target "${newWol.name}" added`, "success");
                }}
                style={btnStyle()}
              >
                ➕ Add Target
              </button>
            </div>

            {wolTargets.length > 0 && (
              <div style={sectionStyle}>
                <h4 style={{ margin: "0 0 12px", fontSize: 13 }}>Saved Targets</h4>
                {wolTargets.map((target, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>⚡ {target.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{target.macAddress} · {target.broadcastIp}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => sendWol(target)} disabled={loading[`wol-${target.macAddress}`]} style={btnStyle("#10b981")}>
                        {loading[`wol-${target.macAddress}`] ? "Sending..." : "Wake"}
                      </button>
                      <button onClick={() => setWolTargets(prev => prev.filter((_, j) => j !== i))} style={btnStyle("#ef4444")}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Games Tab ── */}
        {activeTab === "games" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Game Detection & Auto-Optimization</h3>
              <button onClick={detectGames} disabled={loading.games} style={btnStyle()}>
                {loading.games ? "Scanning..." : "🔍 Scan Games"}
              </button>
            </div>

            {games.length === 0 ? (
              <div style={{ ...sectionStyle, textAlign: "center", color: "#64748b", padding: 32 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                <div>Click "Scan Games" to detect running games and apply optimal streaming settings.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {games.map((game, i) => (
                  <div key={i} style={{ ...sectionStyle, border: game.isRunning ? "1px solid #10b981" : "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          🎮 {game.name}
                          {game.isRunning && <span style={{ marginLeft: 8, fontSize: 11, color: "#10b981" }}>● Running</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                          Platform: {game.platform} · Process: {game.processName}
                        </div>
                        {game.recommendedProfile && (
                          <div style={{ fontSize: 11, color: "#3b82f6", marginTop: 4 }}>
                            Recommended: {game.recommendedProfile}
                          </div>
                        )}
                      </div>
                      {game.isRunning && (
                        <button onClick={() => optimizeForGame(game.name)} style={{ ...btnStyle("#7c3aed"), fontSize: 12 }}>
                          ⚡ Optimize
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
