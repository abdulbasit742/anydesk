#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const socketPath = join(root, "apps", "api", "src", "socket", "index.ts");
const shutdownPath = join(root, "apps", "api", "src", "lifecycle", "gracefulShutdown.ts");

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const socketSource = read(socketPath);
const shutdownSource = read(shutdownPath);

const checks = {
  socketFileExists: existsSync(socketPath),
  exportsSocketServer: socketSource.includes("export function initSocketServer"),
  returnsSocketInstance: socketSource.includes("return io"),
  hasSafeHandlerHelper: socketSource.includes("function bindSafeSocketHandler"),
  safeHandlerCatchesErrors: socketSource.includes("Promise.resolve") && socketSource.includes(".catch((error)"),
  safeHandlerLogsErrors: socketSource.includes("socket.event.error") && socketSource.includes("logger.error"),
  safeHandlerEmitsGenericError: socketSource.includes("SOCKET_EVENT_FAILED"),
  connectRequestWrapped: socketSource.includes("bindSafeSocketHandler<ConnectRequestPayload>(socket, ClientEvents.ConnectRequest"),
  connectResponseWrapped: socketSource.includes("bindSafeSocketHandler<SessionResponsePayload>(socket, ClientEvents.ConnectResponse"),
  webRtcOfferWrapped: socketSource.includes("bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcOffer"),
  webRtcAnswerWrapped: socketSource.includes("bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcAnswer"),
  webRtcIceWrapped: socketSource.includes("bindSafeSocketHandler<SignalPayload>(socket, ClientEvents.WebrtcIce"),
  sessionEndWrapped: socketSource.includes("bindSafeSocketHandler<{ sessionId: string; peerSocketId?: string }>(socket, ClientEvents.SessionEnd"),
  disconnectWrapped: socketSource.includes('bindSafeSocketHandler(socket, "disconnect"'),
  signalingGateStillPresent: socketSource.includes('isBetaApiFeatureEnabled("signaling_access")'),
  socketGateStillPresent: socketSource.includes('isBetaApiFeatureEnabled("socket_access")'),
  gracefulShutdownClosesIo: shutdownSource.includes("io.close"),
};

const failures = Object.entries(checks)
  .filter(([, ok]) => !ok)
  .map(([name]) => name);

const status = failures.length > 0 ? "FAIL" : "PASS";
const report = {
  repo: "abdulbasit742/anydesk",
  generatedAt: new Date().toISOString(),
  status,
  checks,
  failures,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/socket-async-handler-check.json", JSON.stringify(report, null, 2));
writeFileSync(
  "reports/socket-async-handler-check.md",
  [
    "# Socket Async Handler Check",
    "",
    `Status: **${status}**`,
    `Failures: **${failures.length}**`,
    "",
    "| Check | Passed |",
    "|---|---:|",
    ...Object.entries(checks).map(([name, ok]) => `| ${name} | ${ok ? "yes" : "no"} |`),
    "",
    failures.length ? "## Failures" : "",
    ...failures.map((name) => `- ${name}`),
  ].filter(Boolean).join("\n")
);

console.log(`[socket-async:check] ${status} - ${failures.length} failures`);
if (failures.length > 0) process.exit(1);
