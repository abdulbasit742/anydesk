export type RemoteInputMessage =
  | {
      type: "mouse-move";
      x: number;
      y: number;
      timestamp: number;
    }
  | {
      type: "mouse-down" | "mouse-up";
      x: number;
      y: number;
      button: number;
      timestamp: number;
    }
  | {
      type: "wheel";
      x: number;
      y: number;
      deltaX: number;
      deltaY: number;
      timestamp: number;
    }
  | {
      type: "key-down" | "key-up";
      key: string;
      code: string;
      ctrl: boolean;
      alt: boolean;
      shift: boolean;
      meta: boolean;
      timestamp: number;
    };

export interface RemoteInputPermissionState {
  mouse: boolean;
  keyboard: boolean;
  emergencyStopped: boolean;
  lastChangedAt: number;
}

export interface RemoteInputBatchEnvelope {
  type: "remote-input-batch";
  sessionId: string;
  events: RemoteInputMessage[];
  timestamp: number;
}

export interface RemoteInputBatcher {
  push: (message: RemoteInputMessage) => void;
  flush: () => void;
  start: () => void;
  stop: () => void;
  size: () => number;
}

export interface BlockedKeyPolicyConfig {
  blockedCodes?: readonly string[];
  blockMetaCombinations?: boolean;
  blockSystemShortcuts?: boolean;
}

export interface RemoteInputKeyboardEventLike {
  key?: string;
  code: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export interface BlockedKeyPolicy {
  isBlocked: (input: string | RemoteInputKeyboardEventLike) => boolean;
}

export const defaultRemoteInputPermissions: RemoteInputPermissionState = {
  mouse: false,
  keyboard: false,
  emergencyStopped: false,
  lastChangedAt: Date.now()
};

export const defaultBlockedKeyCodes = [
  "MetaLeft",
  "MetaRight",
  "OSLeft",
  "OSRight",
  "ContextMenu",
  "BrowserBack",
  "BrowserForward",
  "Power",
  "Sleep",
  "WakeUp",
  "PrintScreen"
] as const;

export function normalizePointerEvent(event: Pick<MouseEvent, "clientX" | "clientY">, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const x = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
  const y = rect.height <= 0 ? 0 : (event.clientY - rect.top) / rect.height;

  return {
    x: clamp01(x),
    y: clamp01(y)
  };
}

export function createBlockedKeyPolicy(config: BlockedKeyPolicyConfig = {}): BlockedKeyPolicy {
  const blockedCodes = new Set(config.blockedCodes ?? defaultBlockedKeyCodes);
  const blockMetaCombinations = config.blockMetaCombinations ?? true;
  const blockSystemShortcuts = config.blockSystemShortcuts ?? true;

  return {
    isBlocked(input) {
      const event = typeof input === "string" ? { code: input } : input;

      if (blockedCodes.has(event.code)) return true;
      if (blockMetaCombinations && event.metaKey) return true;

      if (blockSystemShortcuts) {
        if (event.altKey && (event.code === "Tab" || event.code === "F4" || event.code === "Space")) return true;
        if (event.ctrlKey && event.altKey && event.code === "Delete") return true;
      }

      return false;
    }
  };
}

export const defaultBlockedKeyPolicy = createBlockedKeyPolicy();

export function shouldForwardKeyboardEvent(
  event: RemoteInputKeyboardEventLike,
  policy: BlockedKeyPolicy = defaultBlockedKeyPolicy
) {
  return !policy.isBlocked(event);
}

export function canSendRemoteInput(
  message: RemoteInputMessage,
  permissions: RemoteInputPermissionState,
  policy: BlockedKeyPolicy = defaultBlockedKeyPolicy
) {
  if (permissions.emergencyStopped) return false;
  if (message.type === "key-down" || message.type === "key-up") {
    return permissions.keyboard && shouldForwardKeyboardEvent({
      key: message.key,
      code: message.code,
      ctrlKey: message.ctrl,
      altKey: message.alt,
      shiftKey: message.shift,
      metaKey: message.meta
    }, policy);
  }
  return permissions.mouse;
}

export function createRemoteInputBatcher(
  sessionId: string,
  flushBatch: (envelope: RemoteInputBatchEnvelope) => void,
  intervalMs = 16,
  maxBatchSize = 64
): RemoteInputBatcher {
  let timer: ReturnType<typeof globalThis.setInterval> | null = null;
  let queue: RemoteInputMessage[] = [];

  const stopTimer = () => {
    if (timer) {
      globalThis.clearInterval(timer);
      timer = null;
    }
  };

  const flush = () => {
    if (queue.length === 0) return;
    const events = queue;
    queue = [];
    flushBatch({
      type: "remote-input-batch",
      sessionId,
      events,
      timestamp: Date.now()
    });
    if (queue.length === 0) stopTimer();
  };

  const start = () => {
    if (!timer) timer = globalThis.setInterval(flush, intervalMs);
  };

  return {
    push(message) {
      queue.push(message);
      if (queue.length >= maxBatchSize) {
        flush();
      } else {
        start();
      }
    },
    flush,
    start,
    stop() {
      flush();
      stopTimer();
    },
    size() {
      return queue.length;
    }
  };
}

export function revokeRemoteInputPermissions(state: RemoteInputPermissionState): RemoteInputPermissionState {
  return {
    ...state,
    mouse: false,
    keyboard: false,
    lastChangedAt: Date.now()
  };
}

export function activateEmergencyStop(): RemoteInputPermissionState {
  return {
    mouse: false,
    keyboard: false,
    emergencyStopped: true,
    lastChangedAt: Date.now()
  };
}

export function clearEmergencyStop(): RemoteInputPermissionState {
  return {
    mouse: false,
    keyboard: false,
    emergencyStopped: false,
    lastChangedAt: Date.now()
  };
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}
