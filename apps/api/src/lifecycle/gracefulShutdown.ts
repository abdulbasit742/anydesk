import type { Server as HttpServer } from "node:http";
import type { Server as SocketIoServer } from "socket.io";
import { prisma } from "../lib/prisma.js";
import { health } from "../observability/health.js";
import { logger } from "../observability/safeLogger.js";

interface GracefulShutdownOptions {
  server: HttpServer;
  io: SocketIoServer;
  timeoutMs?: number;
}

function closeHttpServer(server: HttpServer): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function closeSocketServer(io: SocketIoServer): Promise<void> {
  return new Promise((resolve) => {
    io.close(() => resolve());
  });
}

export function installGracefulShutdown({ server, io, timeoutMs = 10_000 }: GracefulShutdownOptions) {
  let shuttingDown = false;

  async function shutdown(signal: NodeJS.Signals) {
    if (shuttingDown) return;
    shuttingDown = true;
    health.markNotReady();

    logger.info("RemoteDesk API shutdown started", {
      event: "api.shutdown.start",
      status: "shutting_down",
      signal
    });

    const forceTimer = setTimeout(() => {
      logger.error("RemoteDesk API shutdown timed out", {
        event: "api.shutdown.timeout",
        status: "forced_exit",
        signal,
        timeoutMs
      });
      process.exit(1);
    }, timeoutMs);
    forceTimer.unref();

    try {
      await Promise.allSettled([closeSocketServer(io), closeHttpServer(server)]);
      await prisma.$disconnect();
      clearTimeout(forceTimer);
      logger.info("RemoteDesk API shutdown completed", {
        event: "api.shutdown.complete",
        status: "stopped",
        signal
      });
      process.exit(0);
    } catch (error) {
      clearTimeout(forceTimer);
      logger.error("RemoteDesk API shutdown failed", {
        event: "api.shutdown.error",
        status: "failed",
        signal,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : "Unknown shutdown error"
      });
      process.exit(1);
    }
  }

  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));

  return shutdown;
}
