import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Copy, KeyRound, LogOut, Monitor, PhoneCall, PlugZap, Search, ShieldCheck } from "lucide-react";
import type { IncomingRequestPayload } from "@shared/index";
import {
  canEnableRemoteInput,
  getPolicyDenialMessage,
  type DeviceAccessPolicySnapshot,
  type SessionPermissionSet
} from "@shared/index";
import { IncomingRequestModal } from "./components/IncomingRequestModal.js";
import { RemoteSessionView } from "./components/RemoteSessionView.js";
import { ScreenPreview } from "./components/ScreenPreview.js";
import { ScreenSourcePicker } from "./components/ScreenSourcePicker.js";
import { createSocketClient } from "./services/socket.js";
import { createScreenCaptureStream, loadScreenSources, stopScreenCaptureStream } from "./services/screenCapture.js";
import {
  activateEmergencyStop,
  canSendRemoteInput,
  clearEmergencyStop,
  defaultRemoteInputPermissions,
  type RemoteInputMessage,
  type RemoteInputPermissionState
} from "./services/remoteInput.js";
import {
  createPermissionSnapshotFrame,
  isPermissionSnapshotFrame,
  SessionDataChannel,
  type SessionChatMessage,
  type SessionChatPayload,
  type SessionDataChannelLike,
  type PermissionSnapshotFrame
} from "./services/sessionDataChannel.js";
import { fetchDeviceAccessPolicy } from "./services/devicePolicyClient.js";
import { buildHostSessionPermissions, coerceRemoteInputWithSessionPermissions } from "./services/permissionState.js";
import { inputAllowedByPolicy } from "./services/remoteInputGate.js";
import { PeerConnectionManager } from "./services/webrtc.js";
import { formatQualityLabel, type WebRtcQualitySnapshot } from "./services/webrtcStats.js";
import {
  getPendingDeviceCommands,
  heartbeatDevice,
  loadMe,
  login,
  lookupRemoteDesk,
  registerDevice,
  setDevicePassword,
  signup,
  updateDeviceCommand,
  type DesktopDevice,
  type DesktopUser,
  type DeviceCommand
} from "./services/api.js";
import type { CaptureState, ScreenSource } from "./types/screen.js";
import "./styles.css";

declare global {
  interface Window {
    remoteDesk: {
      platform: () => Promise<NodeJS.Platform>;
      screenSources: () => Promise<ScreenSource[]>;
      inputSetPermissions: (
        sessionId: string,
        permissions: RemoteInputPermissionState
      ) => Promise<{ success: boolean }>;
      inputEmergencyStop: (sessionId: string) => Promise<{ success: boolean }>;
      inputExecute: (command: {
        sessionId: string;
        type: string;
        payload: Record<string, unknown>;
      }) => Promise<{ success: boolean; mode: "noop"; reason?: string; commandType?: string; executedAt: number }>;
    };
  }
}

const tokenKey = "rd_desktop_access_token";
const refreshKey = "rd_desktop_refresh_token";

interface ActiveSession {
  sessionId: string;
  peerSocketId: string;
  role: "host" | "viewer";
  status: "connecting" | "connected" | "disconnected" | "failed";
}

function formatId(id?: string) {
  return id ? id.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : "000 000 000";
}

function AuthScreen({ onAuthed }: { onAuthed: (user: DesktopUser, token: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const result =
        mode === "login"
          ? await login(String(form.get("email")), String(form.get("password")))
          : await signup({
              fullName: String(form.get("fullName")),
              email: String(form.get("email")),
              password: String(form.get("password"))
            });
      localStorage.setItem(tokenKey, result.accessToken);
      localStorage.setItem(refreshKey, result.refreshToken);
      onAuthed(result.user, result.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="authShell">
      <section className="authPanel">
        <div className="brand">
          <Monitor size={22} /> RemoteDesk
        </div>
        <h1>{mode === "login" ? "Login to desktop client" : "Create RemoteDesk account"}</h1>
        <p>Use the same account as the web dashboard. Your desktop client will connect to the signaling server after login.</p>

        <form onSubmit={submit} className="formStack">
          {mode === "signup" ? (
            <>
              <label>Full name</label>
              <input name="fullName" required placeholder="Abdul Basit" />
            </>
          ) : null}

          <label>Email</label>
          <input name="email" type="email" required placeholder="you@example.com" />

          <label>Password</label>
          <input name="password" type="password" minLength={8} required placeholder="At least 8 characters" />

          {error ? <p className="errorText">{error}</p> : null}

          <button disabled={busy} type="submit">
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button className="ghostButton" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ user, token, onLogout }: { user: DesktopUser; token: string; onLogout: () => void }) {
  const [remoteId, setRemoteId] = useState("");
  const [connectPassword, setConnectPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sources, setSources] = useState<ScreenSource[]>([]);
  const [capture, setCapture] = useState<CaptureState>({
    source: null,
    stream: null,
    status: "idle",
    error: ""
  });
  const [lookup, setLookup] = useState<{ fullName: string; remoteDeskId: string; isOnline: boolean } | null>(null);
  const [log, setLog] = useState<string[]>(["Desktop client ready."]);
  const [incomingRequest, setIncomingRequest] = useState<IncomingRequestPayload | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [quality, setQuality] = useState<WebRtcQualitySnapshot | null>(null);
  const [chatMessages, setChatMessages] = useState<SessionChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const [sessionDataChannel, setSessionDataChannel] = useState<SessionDataChannelLike | undefined>(undefined);
  const [remoteInputPermissions, setRemoteInputPermissions] = useState<RemoteInputPermissionState>(defaultRemoteInputPermissions);
  const [registeredDevice, setRegisteredDevice] = useState<DesktopDevice | null>(null);
  const [devicePolicy, setDevicePolicy] = useState<DeviceAccessPolicySnapshot | null>(null);
  const [sessionPermissions, setSessionPermissions] = useState<SessionPermissionSet | null>(null);
  const [policyMessage, setPolicyMessage] = useState("Device policy has not loaded yet. Remote input, clipboard, and file transfer stay disabled.");
  const [policyFromCache, setPolicyFromCache] = useState(false);
  const peerRef = useRef<PeerConnectionManager | null>(null);
  const sessionChannelRef = useRef<SessionDataChannel | null>(null);
  const remoteInputPermissionsRef = useRef<RemoteInputPermissionState>(defaultRemoteInputPermissions);
  const devicePolicyRef = useRef<DeviceAccessPolicySnapshot | null>(null);
  const sessionPermissionsRef = useRef<SessionPermissionSet | null>(null);
  const sessionRef = useRef<ActiveSession | null>(null);
  const sessionStartedAtRef = useRef<Date | null>(null);
  const permissionVersionRef = useRef(0);
  const captureStreamRef = useRef<MediaStream | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const handledCommandIdsRef = useRef<Set<string>>(new Set());

  const socketClient = useMemo(
    () =>
      createSocketClient(token, {
        onIncoming: (payload) => {
          setIncomingRequest(payload);
          append(`Incoming request from ${formatId(payload.requesterRemoteDeskId)}.`);
        },
        onAccepted: (payload) => void startViewerOffer(payload.sessionId, payload.hostSocketId),
        onRejected: (payload) => {
          append(`Connection request rejected. Session ${payload.sessionId}`);
          setActiveSession(null);
        },
        onOffer: (payload) => void answerHostOffer(payload.sessionId, payload.fromSocketId, payload.signal),
        onAnswer: (payload) => void acceptViewerAnswer(payload.sessionId, payload.signal),
        onIce: (payload) => void addRemoteIce(payload.sessionId, payload.signal),
        onPeerDisconnected: () => endCurrentSession(false),
        onError: (message) => append(message)
      }),
    [token]
  );

  useEffect(() => {
    refreshSources();
    socketClient.connect();
    append("Connected to signaling server.");
    return () => socketClient.disconnect();
  }, [socketClient]);

  useEffect(() => {
    let disposed = false;
    let heartbeatId: number | undefined;
    let pollId: number | undefined;

    async function registerAndPoll() {
      try {
        const platform = await window.remoteDesk.platform();
        const device = await registerDevice(token, {
          name: `${user.fullName}'s ${platform} desktop`,
          platform,
          remoteDeskId: user.remoteDeskId
        });
        if (disposed) return;

        setRegisteredDevice(device);
        append(`Registered this desktop as ${device.name}.`);
        void refreshDevicePolicy(device.id);

        heartbeatId = window.setInterval(() => {
          void heartbeatDevice(token, device.id).catch(() => append("Device heartbeat failed."));
        }, 60_000);

        async function pollCommands() {
          const commands = await getPendingDeviceCommands(token, device.id);
          for (const command of commands) {
            if (handledCommandIdsRef.current.has(command.id)) continue;
            handledCommandIdsRef.current.add(command.id);
            await handleDeviceCommand(device.id, command);
          }
        }

        await pollCommands();
        pollId = window.setInterval(() => {
          void pollCommands().catch(() => append("Device command polling failed."));
        }, 15_000);
      } catch (err) {
        append(err instanceof Error ? `Device registration failed: ${err.message}` : "Device registration failed.");
      }
    }

    void registerAndPoll();

    return () => {
      disposed = true;
      if (heartbeatId) window.clearInterval(heartbeatId);
      if (pollId) window.clearInterval(pollId);
    };
  }, [token, user.fullName, user.remoteDeskId]);

  useEffect(() => {
    const stream = capture.stream;
    captureStreamRef.current = stream;
    return () => stopScreenCaptureStream(stream);
  }, [capture.stream]);

  useEffect(() => {
    sessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    remoteInputPermissionsRef.current = remoteInputPermissions;
  }, [remoteInputPermissions]);

  useEffect(() => {
    devicePolicyRef.current = devicePolicy;
  }, [devicePolicy]);

  useEffect(() => {
    sessionPermissionsRef.current = sessionPermissions;
  }, [sessionPermissions]);

  useEffect(() => {
    if (!activeSession || !peerRef.current) {
      setQuality(null);
      return;
    }

    let cancelled = false;

    async function refreshQuality() {
      const peer = peerRef.current;
      if (!peer) return;
      const snapshot = await peer.collectQualitySnapshot().catch(() => null);
      if (!cancelled && snapshot) setQuality(snapshot);
    }

    void refreshQuality();
    const intervalId = window.setInterval(refreshQuality, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeSession?.sessionId]);

  function append(message: string) {
    setLog((items) => [message, ...items].slice(0, 8));
  }

  async function refreshDevicePolicy(deviceId = registeredDevice?.id) {
    if (!deviceId) {
      setPolicyMessage("Device is not registered yet. Remote input, clipboard, and file transfer stay disabled.");
      return { policy: null, fromCache: false, error: "device-not-registered" };
    }

    const result = await fetchDeviceAccessPolicy(token, deviceId);
    devicePolicyRef.current = result.policy;
    setDevicePolicy(result.policy);
    setPolicyFromCache(result.fromCache);

    if (result.policy) {
      const cacheNote = result.fromCache ? " Cached policy is being used." : "";
      const errorNote = result.error ? ` Last refresh failed: ${result.error}.` : "";
      setPolicyMessage(`Device policy loaded.${cacheNote}${errorNote}`);
      if (sessionRef.current?.role === "host") {
        applyHostPolicySnapshot("policy_refresh");
      }
    } else {
      setPolicyMessage(`Device policy unavailable${result.error ? `: ${result.error}` : ""}. Risky features stay disabled.`);
      if (sessionRef.current?.role === "host") {
        applyHostPolicySnapshot("policy_missing");
      }
    }

    return result;
  }

  function buildCurrentHostPermissions(inputPermissions = remoteInputPermissionsRef.current) {
    const startedAt = sessionStartedAtRef.current ?? new Date();
    sessionStartedAtRef.current = startedAt;
    const nextSessionPermissions = buildHostSessionPermissions({
      policy: devicePolicyRef.current,
      hostAccepted: true,
      emergencyStopped: inputPermissions.emergencyStopped,
      startedAt,
      version: ++permissionVersionRef.current
    });
    const coercedInput = coerceRemoteInputWithSessionPermissions(inputPermissions, nextSessionPermissions);

    sessionPermissionsRef.current = nextSessionPermissions;
    remoteInputPermissionsRef.current = coercedInput;
    setSessionPermissions(nextSessionPermissions);
    setRemoteInputPermissions(coercedInput);

    if (sessionRef.current?.role === "host") {
      void window.remoteDesk.inputSetPermissions(sessionRef.current.sessionId, coercedInput).catch(() => undefined);
    }

    return { input: coercedInput, sessionPermissions: nextSessionPermissions, version: permissionVersionRef.current };
  }

  function applyHostPolicySnapshot(reason?: string, inputPermissions = remoteInputPermissionsRef.current) {
    const snapshot = buildCurrentHostPermissions(inputPermissions);
    void sessionChannelRef.current
      ?.send(
        "permission",
        createPermissionSnapshotFrame({
          input: snapshot.input,
          sessionPermissions: snapshot.sessionPermissions,
          policy: devicePolicyRef.current,
          reason,
          version: snapshot.version
        })
      )
      .catch(() => undefined);

    return snapshot;
  }

  function applyPermissionPayload(payload: RemoteInputPermissionState | PermissionSnapshotFrame) {
    if (isPermissionSnapshotFrame(payload)) {
      remoteInputPermissionsRef.current = payload.input;
      sessionPermissionsRef.current = payload.sessionPermissions;
      devicePolicyRef.current = payload.policy;
      setRemoteInputPermissions(payload.input);
      setSessionPermissions(payload.sessionPermissions);
      setDevicePolicy(payload.policy);
      setPolicyMessage(payload.reason ? `Host policy update: ${payload.reason}.` : "Host policy update received.");
      return;
    }

    remoteInputPermissionsRef.current = payload;
    setRemoteInputPermissions(payload);
  }

  function attachSessionChannel(channel: RTCDataChannel, sessionId: string, role: ActiveSession["role"]) {
    sessionChannelRef.current?.close();
    const sessionChannel = new SessionDataChannel(channel, sessionId, role);
    sessionChannelRef.current = sessionChannel;
    setSessionDataChannel(sessionChannel.asDataChannelLike());
    setChatMessages([]);
    setChatReady(sessionChannel.ready);

    sessionChannel.onReadyChange((ready) => {
      setChatReady(ready);
      if (ready) append("Session data channel is ready.");
      if (ready && role === "host") {
        applyHostPolicySnapshot("channel_ready");
      }
    });

    sessionChannel.subscribe<SessionChatPayload>("chat", (envelope) => {
      setChatMessages((messages) => [
        ...messages,
        {
          id: envelope.payload.messageId,
          sender: "remote",
          content: envelope.payload.content,
          timestamp: envelope.timestamp
        }
      ]);
    });

    sessionChannel.subscribe<RemoteInputMessage>("remote-input", (envelope) => {
      if (role !== "host") return;
      if (
        !inputAllowedByPolicy(envelope.payload, remoteInputPermissionsRef.current, sessionPermissionsRef.current) ||
        !canSendRemoteInput(envelope.payload, remoteInputPermissionsRef.current)
      ) {
        append(`Blocked remote input: ${envelope.payload.type}.`);
        return;
      }
      void window.remoteDesk.inputExecute({
        sessionId,
        type: envelope.payload.type,
        payload: envelope.payload as unknown as Record<string, unknown>
      }).then((result) => {
        if (!result.success) append(`Native input blocked: ${result.reason ?? "unknown"}.`);
      });
      append(`Remote input received (${envelope.payload.type}); native execution is disabled.`);
    });

    sessionChannel.subscribe<RemoteInputPermissionState | PermissionSnapshotFrame>("permission", (envelope) => {
      applyPermissionPayload(envelope.payload);
    });

    sessionChannel.startHeartbeat();
  }

  async function refreshSources() {
    const nextSources = await loadScreenSources().catch(() => []);
    setSources(nextSources);
    setCapture((current) => {
      if (current.source || nextSources.length === 0) return current;
      return { ...current, source: nextSources[0] };
    });
  }

  function selectSource(source: ScreenSource) {
    setCapture((current) => ({ ...current, source, error: "" }));
    append(`Selected ${source.name}.`);
  }

  async function startCapture() {
    if (!capture.source) {
      append("Select a screen source before starting capture.");
      return;
    }

    stopScreenCaptureStream(capture.stream);
    setCapture((current) => ({ ...current, status: "starting", error: "" }));

    try {
      const stream = await createScreenCaptureStream({
        sourceId: capture.source.id,
        width: 1920,
        height: 1080,
        frameRate: 30
      });
      setCapture((current) => ({ ...current, stream, status: "capturing", error: "" }));
      append(`Screen capture started for ${capture.source.name}.`);
    } catch (err) {
      setCapture((current) => ({
        ...current,
        stream: null,
        status: "failed",
        error: err instanceof Error ? err.message : "Unable to start screen capture"
      }));
      append("Screen capture failed.");
    }
  }

  function stopCapture() {
    stopScreenCaptureStream(capture.stream);
    setCapture((current) => ({ ...current, stream: null, status: "idle", error: "" }));
    append("Screen capture stopped.");
  }

  function ensurePeer(role: "host" | "viewer", sessionId: string, targetSocketId: string) {
    peerRef.current?.close();
    pendingIceRef.current = [];
    const peer = new PeerConnectionManager();

    peer.onIceCandidate((candidate) => {
      socketClient.sendIce(sessionId, targetSocketId, candidate.toJSON());
    });
    peer.onTrack((stream) => {
      setRemoteStream(stream);
      setActiveSession((current) => (current ? { ...current, status: "connected" } : current));
      append("Remote video stream received.");
    });
    peer.onConnectionState((state) => {
      if (state === "connected") {
        setActiveSession((current) => (current ? { ...current, status: "connected" } : current));
      }
      if (state === "failed" || state === "disconnected" || state === "closed") {
        setActiveSession((current) => (current ? { ...current, status: state === "failed" ? "failed" : "disconnected" } : current));
      }
      append(`WebRTC connection state: ${state}.`);
    });
    peer.onDataChannel((channel) => {
      attachSessionChannel(channel, sessionId, role);
      append(`Data channel opened by peer: ${channel.label}.`);
    });

    if (role === "host" && captureStreamRef.current) {
      peer.addStream(captureStreamRef.current);
      append("Host screen stream attached to WebRTC peer.");
    }

    peerRef.current = peer;
    return peer;
  }

  async function flushPendingIce() {
    const peer = peerRef.current;
    if (!peer) return;
    const candidates = pendingIceRef.current.splice(0);
    for (const candidate of candidates) {
      await peer.addIceCandidate(candidate).catch(() => undefined);
    }
  }

  async function startViewerOffer(sessionId: string, hostSocketId: string) {
    setActiveSession({ sessionId, peerSocketId: hostSocketId, role: "viewer", status: "connecting" });
    setRemoteStream(null);
    setSessionPermissions(null);
    setDevicePolicy(null);
    setPolicyMessage("Waiting for host policy snapshot. Viewer stays read-only until the host allows control.");
    const peer = ensurePeer("viewer", sessionId, hostSocketId);
    const channel = peer.createDataChannel("control");
    attachSessionChannel(channel, sessionId, "viewer");
    const offer = await peer.createOffer();
    socketClient.sendOffer(sessionId, hostSocketId, offer);
    append(`WebRTC offer sent for session ${sessionId}.`);
  }

  async function answerHostOffer(sessionId: string, requesterSocketId: string, offer: RTCSessionDescriptionInit) {
    if (!captureStreamRef.current) {
      append("Start capture before accepting a WebRTC offer.");
      return;
    }
    setActiveSession({ sessionId, peerSocketId: requesterSocketId, role: "host", status: "connecting" });
    sessionStartedAtRef.current = new Date();
    applyHostPolicySnapshot("host_answering_offer");
    const peer = ensurePeer("host", sessionId, requesterSocketId);
    const answer = await peer.acceptOffer(offer);
    await flushPendingIce();
    socketClient.sendAnswer(sessionId, requesterSocketId, answer);
    append(`WebRTC answer sent for session ${sessionId}.`);
  }

  async function acceptViewerAnswer(sessionId: string, answer: RTCSessionDescriptionInit) {
    if (sessionRef.current?.sessionId !== sessionId || !peerRef.current) return;
    await peerRef.current.acceptAnswer(answer);
    await flushPendingIce();
    append(`WebRTC answer accepted for session ${sessionId}.`);
  }

  async function addRemoteIce(sessionId: string, candidate: RTCIceCandidateInit) {
    if (sessionRef.current && sessionRef.current.sessionId !== sessionId) return;
    if (!peerRef.current) {
      pendingIceRef.current.push(candidate);
      return;
    }
    await peerRef.current.addIceCandidate(candidate).catch(() => pendingIceRef.current.push(candidate));
  }

  function endCurrentSession(notifyPeer = true) {
    const session = sessionRef.current;
    if (notifyPeer && session) {
      socketClient.endSession(session.sessionId, session.peerSocketId);
    }
    peerRef.current?.close();
    peerRef.current = null;
    pendingIceRef.current = [];
    setRemoteStream(null);
    setQuality(null);
    setChatMessages([]);
    setChatDraft("");
    setChatReady(false);
    setSessionDataChannel(undefined);
    setRemoteInputPermissions(defaultRemoteInputPermissions);
    setSessionPermissions(null);
    sessionPermissionsRef.current = null;
    sessionStartedAtRef.current = null;
    sessionChannelRef.current?.close();
    sessionChannelRef.current = null;
    setActiveSession(null);
    append("Remote session ended.");
  }

  function connectSignaling() {
    socketClient.connect();
    append("Connected to signaling server.");
  }

  async function lookupPeer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const peer = await lookupRemoteDesk(token, remoteId);
    setLookup(peer);
    append(`${peer.fullName} is ${peer.isOnline ? "online" : "offline"}.`);
  }

  function requestConnection() {
    if (!remoteId || !connectPassword) {
      append("Remote ID and device password are required.");
      return;
    }
    socketClient.connect();
    socketClient.requestConnection(remoteId, connectPassword);
    append(`Connection request sent to ${formatId(remoteId.replace(/\s/g, ""))}.`);
  }

  function respondToIncomingRequest(accepted: boolean, reason?: string) {
    if (!incomingRequest) return;
    if (accepted && !capture.stream) {
      append("Start screen capture before accepting an incoming session.");
      return;
    }
    if (accepted && devicePolicyRef.current?.trustStatus === "blocked") {
      socketClient.respondToConnection(incomingRequest.sessionId, false, incomingRequest.requesterSocketId);
      append(`Rejected ${formatId(incomingRequest.requesterRemoteDeskId)} because this device is blocked by policy.`);
      setIncomingRequest(null);
      return;
    }
    socketClient.respondToConnection(incomingRequest.sessionId, accepted, incomingRequest.requesterSocketId);
    if (accepted) {
      sessionStartedAtRef.current = new Date();
      setActiveSession({
        sessionId: incomingRequest.sessionId,
        peerSocketId: incomingRequest.requesterSocketId,
        role: "host",
        status: "connecting"
      });
      applyHostPolicySnapshot(devicePolicyRef.current ? "host_accepted" : "policy_missing");
    }
    append(
      accepted
        ? `Accepted ${formatId(incomingRequest.requesterRemoteDeskId)}. Waiting for WebRTC offer.`
        : `Rejected ${formatId(incomingRequest.requesterRemoteDeskId)}${reason ? ` (${reason})` : ""}.`
    );
    setIncomingRequest(null);
  }

  async function saveDevicePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await setDevicePassword(token, newPassword);
    setNewPassword("");
    append("Device password saved for incoming remote access.");
  }

  function createPeer() {
    const peer = new PeerConnectionManager();
    if (capture.stream) {
      peer.addStream(capture.stream);
      append("Local screen stream attached to WebRTC peer.");
    }
    peer.createDataChannel("control");
    append("WebRTC peer created with control data channel.");
  }

  async function sendChatMessage() {
    const channel = sessionChannelRef.current;
    if (!channel || !chatDraft.trim()) return;

    try {
      const message = await channel.sendChat(chatDraft);
      if (message) {
        setChatMessages((messages) => [...messages, message]);
        setChatDraft("");
      }
    } catch (err) {
      append(err instanceof Error ? err.message : "Unable to send chat message.");
    }
  }

  async function handleDeviceCommand(deviceId: string, command: DeviceCommand) {
    if (!command.safe) {
      await updateDeviceCommand(token, deviceId, command.id, {
        status: "failed",
        failureReason: "unsafe-command-blocked-by-desktop"
      });
      append(`Blocked unsafe device command: ${command.type}.`);
      return;
    }

    await updateDeviceCommand(token, deviceId, command.id, { status: "delivered" });

    let result: Record<string, unknown>;
    switch (command.type) {
      case "refresh_policy": {
        const policyResult = await refreshDevicePolicy(deviceId);
        result = {
          message: "Policy refresh completed by desktop client.",
          policyLoaded: Boolean(policyResult.policy),
          fromCache: policyResult.fromCache,
          error: policyResult.error ?? null
        };
        break;
      }
      case "collect_diagnostics":
        result = { message: "Diagnostics collection acknowledged. Support bundle export remains user initiated." };
        break;
      case "check_update":
        result = { message: "Update check acknowledged. Auto-update provider is not configured yet." };
        break;
      case "sign_out":
        result = { message: "Desktop sign out command acknowledged." };
        break;
      default:
        result = { message: "Command acknowledged." };
    }

    await updateDeviceCommand(token, deviceId, command.id, {
      status: "completed",
      result
    });

    append(`${command.type.replace(/_/g, " ")} command completed.`);
    if (command.type === "sign_out") onLogout();
  }

  async function sendRemoteInput(message: RemoteInputMessage) {
    const channel = sessionChannelRef.current;
    if (
      !channel ||
      !chatReady ||
      !inputAllowedByPolicy(message, remoteInputPermissions, sessionPermissions) ||
      !canSendRemoteInput(message, remoteInputPermissions)
    ) {
      return;
    }
    await channel.send("remote-input", message).catch(() => append("Unable to send remote input."));
  }

  function toggleRemoteInput(kind: "mouse" | "keyboard", enabled: boolean) {
    const current = remoteInputPermissionsRef.current;
    if (current.emergencyStopped) return;

    if (enabled) {
      const decision = canEnableRemoteInput(devicePolicyRef.current, {
        hostAccepted: true,
        emergencyStopped: current.emergencyStopped,
        sessionExpiresAt: sessionPermissionsRef.current?.sessionExpiresAt ?? null
      });
      if (!decision.allowed || sessionPermissionsRef.current?.remoteInput !== "enabled") {
        const blockedPermissions = {
          ...current,
          [kind]: false,
          lastChangedAt: Date.now()
        };
        const snapshot = applyHostPolicySnapshot(decision.reason ?? "remote_input_blocked", blockedPermissions);
        append(decision.message || getPolicyDenialMessage(decision.reason));
        if (snapshot.sessionPermissions?.remoteInput !== "enabled") {
          setPolicyMessage(decision.message || "Remote input is blocked by current device policy.");
        }
        return;
      }
    }

    const nextPermissions = { ...current, [kind]: enabled, lastChangedAt: Date.now() };
    applyHostPolicySnapshot(`${kind}_${enabled ? "enabled" : "disabled"}`, nextPermissions);
    append(`${kind === "mouse" ? "Mouse" : "Keyboard"} remote input ${enabled ? "enabled" : "disabled"}.`);
  }

  function emergencyStopRemoteInput() {
    const nextPermissions = activateEmergencyStop();
    if (sessionRef.current?.role === "host") {
      void window.remoteDesk.inputEmergencyStop(sessionRef.current.sessionId).catch(() => undefined);
    }
    applyHostPolicySnapshot("emergency_stop", nextPermissions);
    append("Emergency stop activated. Remote input revoked.");
  }

  function clearRemoteInputStop() {
    const nextPermissions = clearEmergencyStop();
    applyHostPolicySnapshot("emergency_stop_cleared", nextPermissions);
    append("Emergency stop cleared. Remote input remains disabled until re-enabled.");
  }

  return (
    <main className="shell">
      {incomingRequest ? (
        <IncomingRequestModal
          request={incomingRequest}
          onAccept={() => respondToIncomingRequest(true)}
          onReject={(reason) => respondToIncomingRequest(false, reason)}
        />
      ) : null}

      <section className="panel hero">
        <div>
          <div className="brand">
            <Monitor size={22} /> RemoteDesk Desktop
          </div>
          <h1>{user.fullName}</h1>
          <p>Plan {user.plan}. Your computer is ready to receive or request secure remote sessions.</p>
        </div>
        <button className="secondaryButton" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Your address</h2>
          <div className="addressBox">{formatId(user.remoteDeskId)}</div>
          {registeredDevice ? <p className="muted">Device record: {registeredDevice.name}</p> : <p className="muted">Registering device record...</p>}
          <button onClick={() => navigator.clipboard.writeText(user.remoteDeskId)}>
            <Copy size={16} /> Copy address
          </button>
        </article>

        <article className="panel">
          <h2>Security</h2>
          <form onSubmit={saveDevicePassword} className="formStack compact">
            <label>Device password for incoming sessions</label>
            <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" minLength={4} required />
            <button type="submit">
              <KeyRound size={16} /> Save password
            </button>
          </form>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Remote desk</h2>
          <form onSubmit={lookupPeer} className="formStack compact">
            <label>Remote ID</label>
            <input value={remoteId} onChange={(event) => setRemoteId(event.target.value)} placeholder="123 456 789" required />
            <button type="submit">
              <Search size={16} /> Lookup
            </button>
          </form>

          {lookup ? (
            <div className="lookupCard">
              <strong>{lookup.fullName}</strong>
              <span>{formatId(lookup.remoteDeskId)} - {lookup.isOnline ? "Online" : "Offline"}</span>
            </div>
          ) : null}

          <label>Device password</label>
          <input value={connectPassword} onChange={(event) => setConnectPassword(event.target.value)} type="password" />
          <button onClick={requestConnection}>
            <PhoneCall size={16} /> Request connection
          </button>
        </article>

        <article className="panel">
          <h2>Connection core</h2>
          <p className="muted">Signaling exchanges session requests and WebRTC offer/answer/ICE. Screen video and control data stay peer-to-peer.</p>
          <div className="buttonRow">
            <button onClick={connectSignaling}>
              <PlugZap size={16} /> Connect signaling
            </button>
            <button onClick={createPeer}>
              <ShieldCheck size={16} /> Create peer
            </button>
          </div>
          <div className="log">
            {log.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="grid">
        <ScreenSourcePicker
          sources={sources}
          selectedId={capture.source?.id ?? ""}
          onRefresh={refreshSources}
          onSelect={selectSource}
        />
        <ScreenPreview
          capture={capture}
          onStart={startCapture}
          onStop={stopCapture}
          disabled={!capture.source}
        />
      </section>

      {activeSession ? (
        <RemoteSessionView
          sessionId={activeSession.sessionId}
          stream={remoteStream}
          dataChannel={sessionDataChannel}
          status={`${activeSession.role} - ${activeSession.status}`}
          peerLabel={`Session ${activeSession.sessionId.slice(0, 8)}`}
          quality={quality}
          qualityLabel={formatQualityLabel(quality)}
          chatMessages={chatMessages}
          chatDraft={chatDraft}
          chatReady={chatReady}
          role={activeSession.role}
          remoteInputMouseEnabled={remoteInputPermissions.mouse}
          remoteInputKeyboardEnabled={remoteInputPermissions.keyboard}
          remoteInputEmergencyStopped={remoteInputPermissions.emergencyStopped}
          devicePolicy={devicePolicy}
          sessionPermissions={sessionPermissions}
          policyMessage={policyMessage}
          policyFromCache={policyFromCache}
          onChatDraftChange={setChatDraft}
          onSendChat={() => void sendChatMessage()}
          onRemoteInput={(message) => void sendRemoteInput(message)}
          onToggleRemoteInput={toggleRemoteInput}
          onEmergencyStop={emergencyStopRemoteInput}
          onClearEmergencyStop={clearRemoteInputStop}
          onDisconnect={() => endCurrentSession(true)}
        />
      ) : null}
    </main>
  );
}

function App() {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<DesktopUser | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenKey);
    if (!storedToken) {
      setBooting(false);
      return;
    }
    loadMe(storedToken)
      .then((nextUser) => {
        setUser(nextUser);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(refreshKey);
      })
      .finally(() => setBooting(false));
  }, []);

  if (booting) {
    return (
      <main className="authShell">
        <section className="authPanel">
          <div className="brand">
            <Monitor size={22} /> RemoteDesk
          </div>
          <h1>Starting desktop client...</h1>
        </section>
      </main>
    );
  }

  if (!user || !token) {
    return <AuthScreen onAuthed={(nextUser, nextToken) => {
      setUser(nextUser);
      setToken(nextToken);
    }} />;
  }

  return (
    <Dashboard
      user={user}
      token={token}
      onLogout={() => {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(refreshKey);
        setUser(null);
        setToken("");
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
