import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagnosticReport {
  cpuStatus: "normal" | "high" | "critical";
  memoryStatus: "normal" | "high" | "critical";
  diskStatus: "normal" | "high" | "critical";
  networkStatus: "normal" | "high" | "critical";
  securityStatus: "secure" | "warning" | "critical";
  aiAnalysis: string;
  recommendedActions: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  action?: { type: string; payload?: Record<string, unknown> };
}

interface ScriptResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

const API_BASE = (window as any).REMOTEDESK_API_BASE || "http://localhost:3000";

async function callApi(path: string, method: string, body?: unknown, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusColor = (s: string) => {
  if (s === "critical") return "#ef4444";
  if (s === "high" || s === "warning") return "#f59e0b";
  return "#22c55e";
};

const StatusDot: React.FC<{ status: string; label: string }> = ({ status, label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(status), display: "inline-block" }} />
    {label}: <strong>{status}</strong>
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface AiSupportPanelProps {
  token?: string;
  deviceId?: string;
}

export const AiSupportPanel: React.FC<AiSupportPanelProps> = ({ token, deviceId }) => {
  const [activeTab, setActiveTab] = useState<"chat" | "diagnostics" | "tickets" | "replay">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI IT Support Agent. I can diagnose issues, run fixes, and help you troubleshoot this machine. Type a command like \"why is my PC slow\" or \"fix my wifi\" to get started.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [sessionEvents, setSessionEvents] = useState<any[]>([]);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{ x: number; y: number; label: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Record session events for replay
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setSessionEvents(prev => [...prev.slice(-200), {
        type: "mouse",
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }]);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, "timestamp">) => {
    setMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
  }, []);

  // ── Natural Language Command Handler ──────────────────────────────────────

  const handleSendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isProcessing) return;

    setInput("");
    addMessage({ role: "user", content: text });
    setIsProcessing(true);

    try {
      // Collect system state
      const systemState = await (window as any).aiSupport?.collectSystemState();
      const platform = await (window as any).aiSupport?.getPlatform();

      // Parse command via API
      if (deviceId && token) {
        const parseResult = await callApi("/api/ai-support/commands/parse", "POST", {
          deviceId,
          command: text
        }, token);

        if (parseResult.success) {
          const action = parseResult.data;
          addMessage({
            role: "assistant",
            content: `🤖 **Understood:** ${action.explanation}\n\nExecuting...`,
            action
          });

          // Execute the action
          let result: ScriptResult | null = null;
          if (action.type === "run_script" && action.payload?.script) {
            result = await (window as any).aiSupport?.executeScript(action.payload.script);
          } else if (action.type === "restart_service" && action.payload?.serviceName) {
            result = await (window as any).aiSupport?.restartService(action.payload.serviceName);
          } else if (action.type === "kill_process" && action.payload?.processName) {
            result = await (window as any).aiSupport?.killProcess(action.payload.processName);
          } else if (action.type === "run_diagnostic_command" && action.payload?.command) {
            result = await (window as any).aiSupport?.runDiagnosticCommand(action.payload.command);
          } else if (action.type === "clear_temp_files") {
            result = await (window as any).aiSupport?.clearTempFiles();
          } else if (action.type === "reset_network") {
            result = await (window as any).aiSupport?.resetNetwork();
          }

          if (result) {
            const status = result.success ? "✅ Success" : "❌ Failed";
            const output = result.stdout || result.stderr || "(no output)";
            addMessage({
              role: "assistant",
              content: `${status}\n\`\`\`\n${output.substring(0, 500)}\n\`\`\``
            });
          }
        } else {
          // Fallback: generate fix script
          const scriptResult = await callApi("/api/ai-support/commands/generate-script", "POST", {
            deviceId,
            issue: text
          }, token);

          if (scriptResult.success) {
            const { script, explanation, requiresReboot } = scriptResult.data;
            addMessage({
              role: "assistant",
              content: `🔧 **Auto-Fix Script Generated**\n\n${explanation}\n\n${requiresReboot ? "⚠️ A reboot may be required after this fix." : ""}\n\nRunning script...`
            });

            const execResult = await (window as any).aiSupport?.executeScript(script);
            const status = execResult?.success ? "✅ Fix applied successfully!" : "❌ Script failed";
            addMessage({
              role: "assistant",
              content: `${status}\n\`\`\`\n${(execResult?.stdout || execResult?.stderr || "").substring(0, 500)}\n\`\`\``
            });
          }
        }
      } else {
        // No device context — just provide guidance
        addMessage({
          role: "assistant",
          content: `💡 To execute commands on a remote machine, please connect to a device first. I can see you're asking about: "${text}". Connect to a device and I'll be able to run diagnostics and fixes automatically.`
        });
      }
    } catch (err: any) {
      addMessage({
        role: "assistant",
        content: `⚠️ Error: ${err.message || "Something went wrong. Please try again."}`
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, deviceId, token, addMessage]);

  // ── AI Diagnostics ────────────────────────────────────────────────────────

  const runDiagnostics = useCallback(async () => {
    if (!deviceId || !token) {
      addMessage({ role: "assistant", content: "⚠️ Please connect to a device to run diagnostics." });
      return;
    }
    setIsDiagnosing(true);
    setActiveTab("diagnostics");

    try {
      const systemState = await (window as any).aiSupport?.collectSystemState();
      const result = await callApi("/api/ai-support/diagnostics/analyze", "POST", {
        deviceId,
        systemState
      }, token);

      if (result.success) {
        const report = result.data;
        setDiagnosticReport({
          cpuStatus: report.cpuStatus,
          memoryStatus: report.memoryStatus,
          diskStatus: report.diskStatus,
          networkStatus: report.networkStatus,
          securityStatus: report.securityStatus,
          aiAnalysis: report.aiAnalysis,
          recommendedActions: report.recommendedActions
        });
        addMessage({
          role: "assistant",
          content: `🔍 **Diagnostics Complete**\n\nCPU: ${report.cpuStatus} | Memory: ${report.memoryStatus} | Disk: ${report.diskStatus} | Security: ${report.securityStatus}\n\n${report.aiAnalysis}`
        });
      }
    } catch (err: any) {
      addMessage({ role: "assistant", content: `⚠️ Diagnostics failed: ${err.message}` });
    } finally {
      setIsDiagnosing(false);
    }
  }, [deviceId, token, addMessage]);

  // ── Voice-to-Action ───────────────────────────────────────────────────────

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage({ role: "system", content: "⚠️ Speech recognition is not supported in this browser." });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, addMessage]);

  // ── Session Replay & Summary ──────────────────────────────────────────────

  const generateSessionSummary = useCallback(async () => {
    if (!token) return;
    setActiveTab("replay");

    try {
      const eventsJson = JSON.stringify(sessionEvents.slice(-100));
      const result = await callApi("/api/ai-support/replays", "POST", {
        sessionId: `local-${Date.now()}`,
        eventsJson
      }, token);

      if (result.success && result.data.aiSummary) {
        const summary = JSON.parse(result.data.aiSummary);
        setSessionSummary(
          `**Session Summary**\n\n${summary.summary}\n\n**Issues Addressed:** ${summary.issuesAddressed?.join(", ")}\n\n**Resolution:** ${summary.resolutionStatus}\n\n**Recommendations:** ${summary.recommendations}`
        );
      }
    } catch (err: any) {
      setSessionSummary(`Failed to generate summary: ${err.message}`);
    }
  }, [token, sessionEvents]);

  // ── Create Ticket ─────────────────────────────────────────────────────────

  const createTicket = useCallback(async (title: string, description: string) => {
    if (!deviceId || !token) return;

    const result = await callApi("/api/ai-support/tickets", "POST", {
      deviceId,
      title,
      description,
      priority: "medium"
    }, token);

    if (result.success) {
      setTickets(prev => [result.data, ...prev]);
      addMessage({ role: "assistant", content: `🎫 **Ticket Created:** #${result.data.id.slice(0, 8)} — ${title}` });
    }
  }, [deviceId, token, addMessage]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: activeTab === t ? 700 : 400,
    background: activeTab === t ? "#6366f1" : "transparent",
    color: activeTab === t ? "#fff" : "#94a3b8"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0f172a", color: "#e2e8f0", fontFamily: "system-ui, sans-serif", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>AI IT Support Agent</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Powered by GPT-4o</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={runDiagnostics} disabled={isDiagnosing} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 12 }}>
            {isDiagnosing ? "Scanning..." : "🔍 Run Diagnostics"}
          </button>
          <button onClick={generateSessionSummary} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#0ea5e9", color: "#fff", cursor: "pointer", fontSize: 12 }}>
            📋 Session Summary
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "8px 16px", background: "#1e293b", borderBottom: "1px solid #334155" }}>
        {["chat", "diagnostics", "tickets", "replay"].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} style={tabStyle(t)}>
            {t === "chat" ? "💬 Chat" : t === "diagnostics" ? "🔬 Diagnostics" : t === "tickets" ? "🎫 Tickets" : "📹 Replay"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#6366f1" : "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  background: msg.role === "user" ? "#6366f1" : "#1e293b",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}>
                  {msg.content}
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div style={{ padding: "10px 14px", background: "#1e293b", borderRadius: "12px 12px 12px 4px", fontSize: 13, color: "#64748b" }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Diagnostics Tab */}
        {activeTab === "diagnostics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {isDiagnosing && (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div>Scanning system for issues...</div>
              </div>
            )}
            {!isDiagnosing && !diagnosticReport && (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
                <div>Click "Run Diagnostics" to scan this machine</div>
              </div>
            )}
            {diagnosticReport && (
              <>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>System Health Overview</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <StatusDot status={diagnosticReport.cpuStatus} label="CPU" />
                    <StatusDot status={diagnosticReport.memoryStatus} label="Memory" />
                    <StatusDot status={diagnosticReport.diskStatus} label="Disk" />
                    <StatusDot status={diagnosticReport.networkStatus} label="Network" />
                    <StatusDot status={diagnosticReport.securityStatus} label="Security" />
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>AI Analysis</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "#cbd5e1" }}>{diagnosticReport.aiAnalysis}</div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Recommended Actions</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "#cbd5e1" }}>{diagnosticReport.recommendedActions}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => createTicket("Diagnostic Report", diagnosticReport.aiAnalysis)}
                    style={{ flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 13 }}
                  >
                    🎫 Create Support Ticket
                  </button>
                  <button
                    onClick={() => {
                      setInput(diagnosticReport.recommendedActions.split("\n")[0] || "fix the issues found");
                      setActiveTab("chat");
                    }}
                    style={{ flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", background: "#0ea5e9", color: "#fff", cursor: "pointer", fontSize: 13 }}
                  >
                    🔧 Auto-Fix Issues
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Support Tickets</div>
              <button
                onClick={() => createTicket("New Issue", "Reported via AI Support Agent")}
                style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 12 }}
              >
                + New Ticket
              </button>
            </div>
            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎫</div>
                <div>No tickets yet. Run diagnostics to auto-generate one.</div>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{ticket.title}</div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: ticket.status === "resolved" ? "#166534" : "#7c3aed", color: "#fff" }}>
                      {ticket.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{ticket.description}</div>
                  {ticket.aiSummary && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{ticket.aiSummary}</div>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Replay Tab */}
        {activeTab === "replay" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Session Replay & AI Summary</div>
            {sessionSummary ? (
              <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {sessionSummary}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📹</div>
                <div>Click "Session Summary" to generate an AI summary of this session</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>Events recorded: {sessionEvents.length}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{ padding: "12px 16px", background: "#1e293b", borderTop: "1px solid #334155", display: "flex", gap: 8 }}>
        <button
          onClick={toggleVoice}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: isListening ? "#ef4444" : "#334155",
            color: "#fff",
            cursor: "pointer",
            fontSize: 16
          }}
          title="Voice command"
        >
          {isListening ? "🔴" : "🎤"}
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder='Type "fix my wifi", "why is my PC slow", or any IT command...'
          style={{
            flex: 1,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e2e8f0",
            fontSize: 13,
            outline: "none"
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isProcessing || !input.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: isProcessing || !input.trim() ? "#334155" : "#6366f1",
            color: "#fff",
            cursor: isProcessing || !input.trim() ? "default" : "pointer",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          {isProcessing ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AiSupportPanel;
