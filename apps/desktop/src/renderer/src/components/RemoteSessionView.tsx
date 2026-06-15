import { useEffect, useMemo, useRef } from "react";
import { Maximize2, PhoneOff, Wifi } from "lucide-react";
import type { FormEvent, KeyboardEvent, MouseEvent, WheelEvent } from "react";
import { ClipboardSyncPanel } from "../features/clipboard/ClipboardSyncPanel.js";
import { FileTransferPanel } from "../features/fileTransfer/FileTransferPanel.js";
import { EmergencyStopButton } from "./EmergencyStopButton.js";
import { FileTransferChannel } from "../services/fileTransferChannel.js";
import { PolicyStatusBanner } from "./PolicyStatusBanner.js";
import {
  createBlockedKeyPolicy,
  shouldForwardKeyboardEvent,
  type RemoteInputMessage
} from "../services/remoteInput.js";
import type { SessionChatMessage, SessionDataChannelLike } from "../services/sessionDataChannel.js";
import type { WebRtcQualityLabel, WebRtcQualitySnapshot } from "../services/webrtcStats.js";
import type { DeviceAccessPolicySnapshot, SessionPermissionSet } from "@shared/index";

interface RemoteSessionViewProps {
  sessionId: string;
  stream: MediaStream | null;
  dataChannel?: SessionDataChannelLike;
  status: string;
  peerLabel: string;
  qualityLabel: WebRtcQualityLabel;
  quality: WebRtcQualitySnapshot | null;
  chatMessages: SessionChatMessage[];
  chatDraft: string;
  chatReady: boolean;
  role: "host" | "viewer";
  remoteInputMouseEnabled: boolean;
  remoteInputKeyboardEnabled: boolean;
  remoteInputEmergencyStopped: boolean;
  devicePolicy: DeviceAccessPolicySnapshot | null;
  sessionPermissions: SessionPermissionSet | null;
  policyMessage?: string;
  policyFromCache?: boolean;
  onChatDraftChange: (value: string) => void;
  onSendChat: () => void;
  onRemoteInput: (message: RemoteInputMessage) => void;
  onToggleRemoteInput: (kind: "mouse" | "keyboard", enabled: boolean) => void;
  onEmergencyStop: () => void;
  onClearEmergencyStop: () => void;
  onDisconnect: () => void;
}

export function RemoteSessionView({
  sessionId,
  stream,
  dataChannel,
  status,
  peerLabel,
  qualityLabel,
  quality,
  chatMessages,
  chatDraft,
  chatReady,
  role,
  remoteInputMouseEnabled,
  remoteInputKeyboardEnabled,
  remoteInputEmergencyStopped,
  devicePolicy,
  sessionPermissions,
  policyMessage,
  policyFromCache,
  onChatDraftChange,
  onSendChat,
  onRemoteInput,
  onToggleRemoteInput,
  onEmergencyStop,
  onClearEmergencyStop,
  onDisconnect
}: RemoteSessionViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputLayerRef = useRef<HTMLDivElement | null>(null);
  const lastMouseMoveRef = useRef(0);
  const fileTransferChannel = useMemo(
    () => (dataChannel ? new FileTransferChannel(dataChannel) : undefined),
    [dataChannel]
  );
  const blockedKeyPolicy = useMemo(() => createBlockedKeyPolicy(), []);
  const policyAllowsRemoteInput = sessionPermissions?.remoteInput === "enabled";
  const canViewerCaptureMouse = role === "viewer" && policyAllowsRemoteInput && remoteInputMouseEnabled && !remoteInputEmergencyStopped;
  const canViewerCaptureKeyboard = role === "viewer" && policyAllowsRemoteInput && remoteInputKeyboardEnabled && !remoteInputEmergencyStopped;
  const canViewerCaptureAnyInput = canViewerCaptureMouse || canViewerCaptureKeyboard;
  const hostRemoteInputDisabled = remoteInputEmergencyStopped || !policyAllowsRemoteInput;
  const clipboardAllowed = sessionPermissions?.clipboardSync === "enabled";
  const fileTransferAllowed = sessionPermissions?.fileTransfer === "enabled";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => () => fileTransferChannel?.dispose(), [fileTransferChannel]);

  async function enterFullscreen() {
    await videoRef.current?.requestFullscreen().catch(() => undefined);
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSendChat();
  }

  function emitPointer(event: MouseEvent<HTMLDivElement>, type: "mouse-move" | "mouse-down" | "mouse-up") {
    const layer = inputLayerRef.current;
    if (!layer || !canViewerCaptureMouse) return;
    const rect = layer.getBoundingClientRect();
    const x = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
    const y = rect.height <= 0 ? 0 : (event.clientY - rect.top) / rect.height;
    const point = {
      x: Math.max(0, Math.min(1, Number(x.toFixed(4)))),
      y: Math.max(0, Math.min(1, Number(y.toFixed(4))))
    };

    if (type === "mouse-move") {
      const now = Date.now();
      if (now - lastMouseMoveRef.current < 30) return;
      lastMouseMoveRef.current = now;
      onRemoteInput({ type, ...point, timestamp: now });
      return;
    }

    onRemoteInput({ type, ...point, button: event.button, timestamp: Date.now() });
  }

  function emitWheel(event: WheelEvent<HTMLDivElement>) {
    const layer = inputLayerRef.current;
    if (!layer || !canViewerCaptureMouse) return;
    event.preventDefault();
    const rect = layer.getBoundingClientRect();
    const x = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
    const y = rect.height <= 0 ? 0 : (event.clientY - rect.top) / rect.height;
    onRemoteInput({
      type: "wheel",
      x: Math.max(0, Math.min(1, Number(x.toFixed(4)))),
      y: Math.max(0, Math.min(1, Number(y.toFixed(4)))),
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      timestamp: Date.now()
    });
  }

  function emitKey(event: KeyboardEvent<HTMLDivElement>, type: "key-down" | "key-up") {
    if (!canViewerCaptureKeyboard) return;
    if (!shouldForwardKeyboardEvent({
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    }, blockedKeyPolicy)) {
      return;
    }

    event.preventDefault();
    onRemoteInput({
      type,
      key: event.key,
      code: event.code,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
      timestamp: Date.now()
    });
  }

  return (
    <section className="sessionView">
      <div className="sessionToolbar">
        <div>
          <strong>{peerLabel}</strong>
          <span>
            <Wifi size={14} /> {status}
          </span>
          <span className={`qualityBadge ${qualityLabel}`}>
            Quality {qualityLabel}
            {quality?.rttMs !== null && quality?.rttMs !== undefined ? ` - ${quality.rttMs}ms` : ""}
          </span>
        </div>
        <div className="buttonRow">
          <button className="secondaryButton" onClick={enterFullscreen} disabled={!stream}>
            <Maximize2 size={16} /> Fullscreen
          </button>
          <button onClick={onDisconnect}>
            <PhoneOff size={16} /> Disconnect
          </button>
        </div>
      </div>

      <PolicyStatusBanner
        policy={devicePolicy}
        permissions={sessionPermissions}
        message={policyMessage}
        fromCache={policyFromCache}
      />

      <div className="sessionBody">
        <div className="remoteVideoFrame">
          {stream ? (
            <>
              <video ref={videoRef} autoPlay playsInline />
              {canViewerCaptureAnyInput ? (
                <div
                  ref={inputLayerRef}
                  className="remoteInputLayer"
                  tabIndex={0}
                  role="application"
                  aria-label="Remote input capture layer"
                  onMouseMove={(event) => emitPointer(event, "mouse-move")}
                  onMouseDown={(event) => emitPointer(event, "mouse-down")}
                  onMouseUp={(event) => emitPointer(event, "mouse-up")}
                  onWheel={emitWheel}
                  onKeyDown={(event) => emitKey(event, "key-down")}
                  onKeyUp={(event) => emitKey(event, "key-up")}
                  onContextMenu={(event) => event.preventDefault()}
                />
              ) : role === "viewer" ? (
                <div className="readOnlyOverlay">
                  <span>Read-only mode</span>
                  <small>{remoteInputEmergencyStopped ? "Emergency stop is active." : "Host policy or host toggles have disabled remote input."}</small>
                </div>
              ) : null}
            </>
          ) : (
            <div className="previewEmpty">
              <Wifi size={34} />
              <span>Waiting for remote video stream</span>
            </div>
          )}
        </div>

        <aside className="sessionChat">
          <div className="sessionChatHeader">
            <strong>Chat</strong>
            <span>{chatReady ? "Ready" : "Opening channel"}</span>
          </div>

          <div className="remoteInputPanel">
            <strong>Remote input</strong>
            {role === "host" ? (
              <>
                <label className="toggleLine">
                  <input
                    type="checkbox"
                    checked={remoteInputMouseEnabled}
                    disabled={hostRemoteInputDisabled}
                    onChange={(event) => onToggleRemoteInput("mouse", event.target.checked)}
                  />
                  Mouse
                </label>
                <label className="toggleLine">
                  <input
                    type="checkbox"
                    checked={remoteInputKeyboardEnabled}
                    disabled={hostRemoteInputDisabled}
                    onChange={(event) => onToggleRemoteInput("keyboard", event.target.checked)}
                  />
                  Keyboard
                </label>
                <EmergencyStopButton
                  engaged={remoteInputEmergencyStopped}
                  onEngage={onEmergencyStop}
                  onRelease={onClearEmergencyStop}
                />
                {!policyAllowsRemoteInput ? <p className="muted">Remote input is blocked by current device policy.</p> : null}
              </>
            ) : (
              <>
                <p className="muted">
                  Mouse {remoteInputMouseEnabled ? "enabled" : "blocked"} / Keyboard {remoteInputKeyboardEnabled ? "enabled" : "blocked"}
                </p>
                <p className="muted">Protected system shortcuts stay local.</p>
              </>
            )}
            {remoteInputEmergencyStopped ? <p className="errorText">Emergency stop active. Input is blocked.</p> : null}
          </div>

          <div className="sessionChatMessages">
            {chatMessages.length === 0 ? (
              <p className="muted">No messages yet.</p>
            ) : (
              chatMessages.map((message) => (
                <div className={`chatBubble ${message.sender}`} key={message.id}>
                  <p>{message.content}</p>
                  <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))
            )}
          </div>

          <form className="sessionChatForm" onSubmit={submitChat}>
            <input
              value={chatDraft}
              onChange={(event) => onChatDraftChange(event.target.value)}
              placeholder={chatReady ? "Type a message" : "Waiting for data channel"}
              disabled={!chatReady}
            />
            <button type="submit" disabled={!chatReady || !chatDraft.trim()}>
              Send
            </button>
          </form>

          <div className="sessionTools">
            {fileTransferAllowed ? (
              <FileTransferPanel channel={fileTransferChannel} compact />
            ) : (
              <div className="toolBlocked">
                <strong>File transfer blocked</strong>
                <span>Device policy does not allow file transfer in this session.</span>
              </div>
            )}
            {clipboardAllowed ? (
              <ClipboardSyncPanel dataChannel={dataChannel} sessionId={sessionId} />
            ) : (
              <div className="toolBlocked">
                <strong>Clipboard sync blocked</strong>
                <span>Device policy does not allow clipboard sync in this session.</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
