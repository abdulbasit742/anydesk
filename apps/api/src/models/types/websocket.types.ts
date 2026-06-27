export type WSMessageType = "auth" | "heartbeat" | "device_status" | "remote_input" | "screen_frame" | "file_chunk" | "clipboard" | "chat" | "notification" | "metrics";
export interface WSMessage { type: WSMessageType; payload: any; timestamp: number; sessionId?: string; }
export interface WSAuthMessage { type: "auth"; payload: { token: string; deviceId?: string } }
export interface WSScreenFrame { type: "screen_frame"; payload: { data: ArrayBuffer; width: number; height: number; format: "jpeg" | "png" | "webp"; quality: number } }
export interface WSRemoteInput { type: "remote_input"; payload: { inputType: "mouse" | "keyboard" | "touch"; event: string; x?: number; y?: number; key?: string; modifiers?: string[] } }
