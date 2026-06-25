import type { ClipboardSyncBlockReason, ClipboardSyncDirection, ClipboardSyncReadiness } from "./clipboardReadiness.js";

export type ClipboardSyncStatus = "available" | "blocked" | "waiting";

export type ClipboardSyncReadinessSummary = {
  readonly direction: ClipboardSyncDirection;
  readonly status: ClipboardSyncStatus;
  readonly title: string;
  readonly description: string;
  readonly canRetry: boolean;
};

function summaryForBlockReason(
  direction: ClipboardSyncDirection,
  blockReason: ClipboardSyncBlockReason,
): ClipboardSyncReadinessSummary {
  switch (blockReason) {
    case "unsupported-content":
      return {
        direction,
        status: "blocked",
        title: "Unsupported clipboard content",
        description: "Only safe text clipboard content is supported for sync.",
        canRetry: false,
      };
    case "empty-content":
      return {
        direction,
        status: "blocked",
        title: "Clipboard is empty",
        description: "There is no clipboard text available to sync.",
        canRetry: true,
      };
    case "content-too-large":
      return {
        direction,
        status: "blocked",
        title: "Clipboard content is too large",
        description: "Reduce the clipboard text size before syncing.",
        canRetry: true,
      };
    case "session-inactive":
      return {
        direction,
        status: "blocked",
        title: "Session inactive",
        description: "Start or rejoin a trusted session before syncing clipboard content.",
        canRetry: true,
      };
    case "channel-not-ready":
      return {
        direction,
        status: "waiting",
        title: "Waiting for data channel",
        description: "Clipboard sync will be available when the secure data channel is ready.",
        canRetry: true,
      };
    case "feature-disabled":
      return {
        direction,
        status: "blocked",
        title: "Clipboard sync disabled",
        description: "Clipboard sync is disabled by the current policy.",
        canRetry: false,
      };
    case "missing-consent":
      return {
        direction,
        status: "blocked",
        title: "Consent required",
        description: "User consent is required before clipboard sync can continue.",
        canRetry: true,
      };
    case "peer-not-trusted":
      return {
        direction,
        status: "blocked",
        title: "Peer not trusted",
        description: "Trust must be established before clipboard sync can be used.",
        canRetry: false,
      };
    case "none":
      return {
        direction,
        status: "available",
        title: "Clipboard sync ready",
        description: "Clipboard sync is ready for the current trusted session.",
        canRetry: false,
      };
  }
}

export function getClipboardSyncReadinessSummary(
  readiness: ClipboardSyncReadiness,
): ClipboardSyncReadinessSummary {
  return summaryForBlockReason(readiness.direction, readiness.blockReason);
}

export function shouldShowClipboardSyncRetry(summary: ClipboardSyncReadinessSummary): boolean {
  return summary.canRetry && summary.status !== "available";
}
