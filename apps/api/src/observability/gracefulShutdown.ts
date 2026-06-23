/**
 * Graceful shutdown handler.
 * Ensures the API server:
 * - Stops accepting new connections
 * - Closes Socket.IO safely
 * - Disconnects clients with safe reason
 * - Closes DB connection
 * - Exits cleanly
 */

import type { Server as HttpServer } from "node:http";
import type { Server as SocketServer } from "socket.io";
import { safeLogger } from "./safeLogger.js";

let isShuttingDown = false;

export function isServerShuttingDown(): boolean {
  return isShuttingDown;
}

export function setupGracefulShutdown(
  httpServer: HttpServer,
  io: SocketServer | null,
  onCleanup?: () => Promise<void>
): void {
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    safeLogger.info("Graceful shutdown initiated", { signal });

    // Stop accepting new connections
    httpServer.close(() => {
      safeLogger.info("HTTP server closed");
    });

    // Close Socket.IO connections with reason
    if (io) {
      try {
        io.emit("server:shutdown", { reason: "server_restart" });
        io.disconnectSockets(true);
        safeLogger.info("Socket.IO connections closed");
      } catch (err) {
        safeLogger.warn("Error closing Socket.IO", {
          error: err instanceof Error ? err.message : "unknown",
        });
      }
    }

    // Run cleanup (e.g., close DB)
    if (onCleanup) {
      try {
        await onCleanup();
        safeLogger.info("Cleanup completed");
      } catch (err) {
        safeLogger.error("Cleanup error", {
          error: err instanceof Error ? err.message : "unknown",
        });
      }
    }

    safeLogger.info("Shutdown complete, exiting");
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
