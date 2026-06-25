import React, { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceFingerprint {
  hardwareId: string;
  macAddress: string;
  secureBootEnabled: boolean;
  tpmHash: string | null;
  osVersion: string;
  platform: string;
}

interface E2EEKeyPair {
  publicKey: string;
  privateKey: string;
}

interface SecurityStatus {
  fingerprint: DeviceFingerprint | null;
  e2eeKeyPair: E2EEKeyPair | null;
  secureBootEnabled: boolean;
  dlpEnabled: boolean;
  watermarkEnabled: boolean;
  certPinned: boolean;
  registeredWithServer: boolean;
  approved: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function apiPost(path: string, body: unknown, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiGet(path: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ZeroTrustPanel() {
  const [status, setStatus] = useState<SecurityStatus>({
    fingerprint: null,
    e2eeKeyPair: null,
    secureBootEnabled: false,
    dlpEnabled: true,
    watermarkEnabled: true,
    certPinned: false,
    registeredWithServer: false,
    approved: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "fingerprint" | "e2ee" | "dlp" | "audit">("overview");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [dlpTest, setDlpTest] = useState("");
  const [dlpResult, setDlpResult] = useState<{ detected: boolean; type?: string } | null>(null);

  const zeroTrust = (window as any).zeroTrust;

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Initialize device fingerprint and E2EE keys
  const initializeSecurity = useCallback(async () => {
    if (!zeroTrust) return;
    setLoading(true);
    try {
      const [fp, bootStatus, keyPair] = await Promise.all([
        zeroTrust.getDeviceFingerprint(),
        zeroTrust.verifySecureBoot(),
        zeroTrust.generateECDHKeypair()
      ]);
      setStatus(prev => ({
        ...prev,
        fingerprint: fp,
        secureBootEnabled: bootStatus.enabled,
        e2eeKeyPair: keyPair
      }));
      showMessage("success", "Security initialized successfully");
    } catch (err: any) {
      showMessage("error", `Initialization failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [zeroTrust]);

  useEffect(() => {
    initializeSecurity();
  }, [initializeSecurity]);

  // Register device fingerprint with server
  const registerFingerprint = useCallback(async () => {
    if (!status.fingerprint) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const deviceId = localStorage.getItem("deviceId") || "";
      if (!deviceId) {
        showMessage("error", "No device ID found. Please log in first.");
        return;
      }
      const result = await apiPost("/api/zero-trust/fingerprint/register", {
        deviceId,
        ...status.fingerprint
      }, token);

      if (result.success) {
        setStatus(prev => ({ ...prev, registeredWithServer: true, approved: result.data.approved }));
        showMessage("success", "Device fingerprint registered. Awaiting admin approval.");
      } else {
        showMessage("error", result.message || "Registration failed");
      }
    } catch (err: any) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  }, [status.fingerprint]);

  // DLP scan test
  const runDlpScan = useCallback(async () => {
    if (!zeroTrust || !dlpTest) return;
    const result = await zeroTrust.dlpScan(dlpTest);
    setDlpResult(result);
  }, [zeroTrust, dlpTest]);

  // Load audit logs
  const loadAuditLogs = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const [logsRes, threatsRes] = await Promise.all([
        apiGet("/api/zero-trust/audit-logs", token),
        apiGet("/api/zero-trust/threats", token)
      ]);
      if (logsRes.success) setAuditLogs(logsRes.data || []);
      if (threatsRes.success) setThreats(threatsRes.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (activeTab === "audit") loadAuditLogs();
  }, [activeTab, loadAuditLogs]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const statusBadge = (ok: boolean, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: ok ? "#16a34a22" : "#dc262622", borderRadius: 8, border: `1px solid ${ok ? "#16a34a" : "#dc2626"}` }}>
      <span style={{ fontSize: 14 }}>{ok ? "✅" : "❌"}</span>
      <span style={{ color: ok ? "#4ade80" : "#f87171", fontSize: 13, fontWeight: 600 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", padding: 20, borderRadius: 12, border: "1px solid #1e293b", minHeight: 400 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Zero-Trust Security</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Enterprise E2EE, Device Fingerprinting & DLP</div>
          </div>
        </div>
        <button
          onClick={initializeSecurity}
          disabled={loading}
          style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}
        >
          {loading ? "Initializing..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding: "10px 16px", borderRadius: 8, marginBottom: 16, background: message.type === "success" ? "#16a34a22" : message.type === "error" ? "#dc262622" : "#0ea5e922", border: `1px solid ${message.type === "success" ? "#16a34a" : message.type === "error" ? "#dc2626" : "#0ea5e9"}`, color: message.type === "success" ? "#4ade80" : message.type === "error" ? "#f87171" : "#38bdf8", fontSize: 13 }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #1e293b", paddingBottom: 8 }}>
        {(["overview", "fingerprint", "e2ee", "dlp", "audit"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? "#6366f1" : "transparent", color: activeTab === tab ? "#fff" : "#64748b", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
            {tab === "overview" ? "🛡️ Overview" : tab === "fingerprint" ? "🖥️ Device" : tab === "e2ee" ? "🔑 E2EE" : tab === "dlp" ? "🚫 DLP" : "📋 Audit"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {statusBadge(status.secureBootEnabled, "Secure Boot")}
            {statusBadge(!!status.fingerprint, "Device Fingerprint")}
            {statusBadge(!!status.e2eeKeyPair, "E2EE Keys Generated")}
            {statusBadge(status.registeredWithServer, "Registered with Server")}
            {statusBadge(status.approved, "Device Approved")}
            {statusBadge(status.dlpEnabled, "DLP Active")}
            {statusBadge(status.watermarkEnabled, "Watermarking Active")}
            {statusBadge(status.certPinned, "Certificate Pinned")}
          </div>
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
            <strong style={{ color: "#f1f5f9" }}>Zero-Trust Architecture Active</strong><br />
            Every connection is verified against device identity, user identity, location, time, and risk score. AES-256-GCM encryption with ephemeral ECDH keys ensures perfect forward secrecy. All actions are logged in a tamper-proof blockchain-style audit trail.
          </div>
        </div>
      )}

      {/* Device Fingerprint Tab */}
      {activeTab === "fingerprint" && (
        <div>
          {status.fingerprint ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, color: "#e2e8f0" }}>🖥️ Hardware Identity</div>
                {[
                  ["Hardware ID", status.fingerprint.hardwareId],
                  ["MAC Address", status.fingerprint.macAddress],
                  ["OS Version", status.fingerprint.osVersion],
                  ["Platform", status.fingerprint.platform],
                  ["TPM Hash", status.fingerprint.tpmHash || "Not available"],
                  ["Secure Boot", status.fingerprint.secureBootEnabled ? "✅ Enabled" : "❌ Disabled"]
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>{label}</span>
                    <span style={{ color: "#e2e8f0", fontFamily: "monospace", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={registerFingerprint}
                disabled={loading || status.registeredWithServer}
                style={{ background: status.registeredWithServer ? "#334155" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: status.registeredWithServer ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600 }}
              >
                {status.registeredWithServer ? "✅ Registered with Server" : "📤 Register Device Fingerprint"}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div>Collecting device fingerprint...</div>
            </div>
          )}
        </div>
      )}

      {/* E2EE Tab */}
      {activeTab === "e2ee" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#e2e8f0" }}>🔑 ECDH Key Exchange (secp256k1)</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
              Ephemeral keys are generated fresh for each session. The private key never leaves this device. Perfect Forward Secrecy ensures past sessions cannot be decrypted even if a key is later compromised.
            </div>
            {status.e2eeKeyPair ? (
              <>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Public Key (shareable)</div>
                  <div style={{ background: "#0f172a", borderRadius: 6, padding: 10, fontFamily: "monospace", fontSize: 11, color: "#4ade80", wordBreak: "break-all" }}>
                    {status.e2eeKeyPair.publicKey}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Private Key (never transmitted)</div>
                  <div style={{ background: "#0f172a", borderRadius: 6, padding: 10, fontFamily: "monospace", fontSize: 11, color: "#f87171" }}>
                    ████████████████████████████████ (hidden)
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "#64748b", fontSize: 12 }}>Generating keys...</div>
            )}
          </div>
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, fontSize: 12, color: "#94a3b8" }}>
            <strong style={{ color: "#f1f5f9" }}>AES-256-GCM Session Encryption</strong><br />
            All session data (screen stream, clipboard, file transfers) is encrypted with AES-256-GCM using the derived shared secret. Authentication tags prevent tampering.
          </div>
        </div>
      )}

      {/* DLP Tab */}
      {activeTab === "dlp" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#e2e8f0" }}>🚫 Data Loss Prevention</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
              DLP scans clipboard content before sync. Detected patterns: Credit Cards, SSNs, Passwords, Private Keys, AWS Keys.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={dlpTest}
                onChange={e => setDlpTest(e.target.value)}
                placeholder="Test text (e.g. 4111-1111-1111-1111)"
                style={{ flex: 1, background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#f1f5f9", fontSize: 12 }}
              />
              <button onClick={runDlpScan} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12 }}>
                Scan
              </button>
            </div>
            {dlpResult && (
              <div style={{ padding: 12, borderRadius: 8, background: dlpResult.detected ? "#dc262622" : "#16a34a22", border: `1px solid ${dlpResult.detected ? "#dc2626" : "#16a34a"}`, color: dlpResult.detected ? "#f87171" : "#4ade80", fontSize: 12 }}>
                {dlpResult.detected ? `🚫 Sensitive data detected: ${dlpResult.type}` : "✅ No sensitive data detected"}
              </div>
            )}
          </div>
          <div style={{ background: "#1e293b", borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#e2e8f0" }}>💧 Session Watermarking</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Invisible watermarks are embedded in the screen stream containing your User ID, Device ID, and timestamp. Any leaked screenshots can be traced back to the source.
            </div>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <div>
          {threats.filter(t => !t.resolved).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: "#ef4444", marginBottom: 8, fontSize: 13 }}>⚠️ Active Threats ({threats.filter(t => !t.resolved).length})</div>
              {threats.filter(t => !t.resolved).slice(0, 5).map(t => (
                <div key={t.id} style={{ background: "#dc262622", border: "1px solid #dc2626", borderRadius: 8, padding: 10, marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: "#f87171", fontWeight: 600 }}>[{t.severity.toUpperCase()}]</span>{" "}
                  <span style={{ color: "#fca5a5" }}>{t.description}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 8, fontSize: 13 }}>📋 Audit Trail (Hash-Chained)</div>
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {auditLogs.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 12, textAlign: "center", padding: 20 }}>No audit logs yet</div>
            ) : auditLogs.slice(0, 50).map(log => (
              <div key={log.id} style={{ background: "#1e293b", borderRadius: 6, padding: "8px 12px", fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ color: "#818cf8", fontWeight: 600 }}>{log.action}</span>
                  {log.user && <span style={{ color: "#64748b" }}> · {log.user.email}</span>}
                  {log.ipAddress && <span style={{ color: "#64748b" }}> · {log.ipAddress}</span>}
                </div>
                <div style={{ color: "#475569", fontSize: 10, fontFamily: "monospace" }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
