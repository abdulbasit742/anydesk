import { spawn } from "child_process";
import { EventEmitter } from "events";
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma.js";

interface PTYOptions {
  cols?: number;
  rows?: number;
  shell?: string;
}

export class RemoteShellManager extends EventEmitter {
  private sessions: Map<string, PTYSession> = new Map();
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes

  async createSession(
    deviceId: string,
    userId: string,
    options: PTYOptions = {}
  ): Promise<string> {
    const sessionToken = randomBytes(32).toString("hex");
    const shell = options.shell || "bash";

    // Create PTY session
    const ptyProcess: any = spawn(shell, [], {
      stdio: ["pipe", "pipe", "pipe"]
    } as any);

    const session: PTYSession = {
      token: sessionToken,
      deviceId,
      userId,
      process: ptyProcess,
      shell,
      createdAt: new Date(),
      commandHistory: [],
      outputBuffer: ""
    };

    this.sessions.set(sessionToken, session);

    // Save to database
    await prisma.remoteShellSession.create({
      data: {
        deviceId,
        userId,
        sessionToken,
        shell,
        status: "active"
      }
    });

    // Setup event handlers
    ptyProcess.stdout?.on("data", (data: any) => {
      session.outputBuffer += data.toString();
      this.emit("output", { token: sessionToken, data: data.toString() });
    });

    ptyProcess.stderr?.on("data", (data: any) => {
      this.emit("error", { token: sessionToken, data: data.toString() });
    });

    ptyProcess.on("close", () => {
      this.closeSession(sessionToken);
    });

    // Auto-close after timeout
    setTimeout(() => {
      if (this.sessions.has(sessionToken)) {
        this.closeSession(sessionToken);
      }
    }, this.sessionTimeout);

    return sessionToken;
  }

  async executeCommand(sessionToken: string, command: string): Promise<void> {
    const session = this.sessions.get(sessionToken);
    if (!session) throw new Error("Session not found");

    session.commandHistory.push({
      command,
      timestamp: new Date(),
      status: "executed"
    });

    session.process.stdin?.write(command + "\n");
  }

  async resizeTerminal(
    sessionToken: string,
    cols: number,
    rows: number
  ): Promise<void> {
    const session = this.sessions.get(sessionToken);
    if (!session) throw new Error("Session not found");

    // Resize PTY
    if (session.process.stdout) {
      (session.process.stdout as any).resize?.(cols, rows);
    }
  }

  async closeSession(sessionToken: string): Promise<void> {
    const session = this.sessions.get(sessionToken);
    if (!session) return;

    session.process.kill();
    this.sessions.delete(sessionToken);

    await prisma.remoteShellSession.update({
      where: { sessionToken },
      data: {
        status: "closed",
        endedAt: new Date()
      }
    });
  }

  getSessionOutput(sessionToken: string): string {
    const session = this.sessions.get(sessionToken);
    if (!session) throw new Error("Session not found");
    return session.outputBuffer;
  }

  clearSessionOutput(sessionToken: string): void {
    const session = this.sessions.get(sessionToken);
    if (!session) return;
    session.outputBuffer = "";
  }
}

interface PTYSession {
  token: string;
  deviceId: string;
  userId: string;
  process: any;
  shell: string;
  createdAt: Date;
  commandHistory: Array<{
    command: string;
    timestamp: Date;
    status: string;
  }>;
  outputBuffer: string;
}

export const remoteShellManager = new RemoteShellManager();
