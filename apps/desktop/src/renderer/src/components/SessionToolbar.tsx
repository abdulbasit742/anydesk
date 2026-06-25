/**
 * Session Toolbar Component
 * Provides quick access to all session features during an active remote connection.
 */

import React, { useState } from "react";

export interface SessionToolbarProps {
  sessionId: string;
  role: "host" | "viewer";
  isRecording: boolean;
  isPrivacyMode: boolean;
  isAudioEnabled: boolean;
  isAudioMuted: boolean;
  isWhiteboardActive: boolean;
  onToggleRecording: () => void;
  onTakeScreenshot: () => void;
  onTogglePrivacyMode: () => void;
  onToggleAudio: () => void;
  onToggleMute: () => void;
  onToggleWhiteboard: () => void;
  onSwitchSide: () => void;
  onLockScreen: () => void;
  onRestart: () => void;
  onDisconnect: () => void;
  onToggleFileTransfer: () => void;
  onToggleChat: () => void;
  onToggleTcpTunnel: () => void;
  onToggleFullscreen: () => void;
}

export const SessionToolbar: React.FC<SessionToolbarProps> = ({
  role,
  isRecording,
  isPrivacyMode,
  isAudioEnabled,
  isAudioMuted,
  isWhiteboardActive,
  onToggleRecording,
  onTakeScreenshot,
  onTogglePrivacyMode,
  onToggleAudio,
  onToggleMute,
  onToggleWhiteboard,
  onSwitchSide,
  onLockScreen,
  onRestart,
  onDisconnect,
  onToggleFileTransfer,
  onToggleChat,
  onToggleTcpTunnel,
  onToggleFullscreen,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="session-toolbar" style={toolbarStyle}>
      {/* View Controls */}
      <div className="toolbar-group" style={groupStyle}>
        <ToolbarButton icon="⛶" label="Fullscreen" onClick={onToggleFullscreen} />
        <ToolbarButton
          icon="🎨"
          label="Whiteboard"
          onClick={onToggleWhiteboard}
          active={isWhiteboardActive}
        />
        <ToolbarButton icon="📷" label="Screenshot" onClick={onTakeScreenshot} />
        <ToolbarButton
          icon="⏺"
          label={isRecording ? "Stop Recording" : "Record"}
          onClick={onToggleRecording}
          active={isRecording}
          danger={isRecording}
        />
      </div>

      {/* Audio Controls */}
      <div className="toolbar-group" style={groupStyle}>
        <ToolbarButton
          icon="🔊"
          label={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
          onClick={onToggleAudio}
          active={isAudioEnabled}
        />
        {isAudioEnabled && (
          <ToolbarButton
            icon={isAudioMuted ? "🔇" : "🔈"}
            label={isAudioMuted ? "Unmute" : "Mute"}
            onClick={onToggleMute}
          />
        )}
      </div>

      {/* Communication */}
      <div className="toolbar-group" style={groupStyle}>
        <ToolbarButton icon="💬" label="Chat" onClick={onToggleChat} />
        <ToolbarButton icon="📁" label="File Transfer" onClick={onToggleFileTransfer} />
        <ToolbarButton icon="🔗" label="TCP Tunnel" onClick={onToggleTcpTunnel} />
      </div>

      {/* Actions */}
      <div className="toolbar-group" style={groupStyle}>
        <ToolbarButton
          icon="🔒"
          label="Privacy Mode"
          onClick={onTogglePrivacyMode}
          active={isPrivacyMode}
        />
        <ToolbarButton icon="🔄" label="Switch Side" onClick={onSwitchSide} />
        <div style={{ position: "relative" }}>
          <ToolbarButton
            icon="⚙"
            label="Actions"
            onClick={() => setShowActions(!showActions)}
          />
          {showActions && (
            <div style={dropdownStyle}>
              <button style={dropdownItemStyle} onClick={onLockScreen}>
                🔐 Lock Screen
              </button>
              <button style={dropdownItemStyle} onClick={onRestart}>
                🔄 Restart Machine
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Disconnect */}
      <div className="toolbar-group" style={groupStyle}>
        <ToolbarButton
          icon="✕"
          label="Disconnect"
          onClick={onDisconnect}
          danger
        />
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick, active, danger }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      ...buttonStyle,
      backgroundColor: active ? "#3b82f6" : danger ? "#ef4444" : "transparent",
      color: active || danger ? "#fff" : "#e5e7eb",
    }}
  >
    <span style={{ fontSize: "16px" }}>{icon}</span>
  </button>
);

// Styles
const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px 12px",
  backgroundColor: "#1f2937",
  borderBottom: "1px solid #374151",
  userSelect: "none",
};

const groupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "0 8px",
  borderRight: "1px solid #374151",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.15s",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "6px",
  padding: "4px",
  zIndex: 100,
  minWidth: "160px",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  border: "none",
  backgroundColor: "transparent",
  color: "#e5e7eb",
  textAlign: "left",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "13px",
};

export default SessionToolbar;
