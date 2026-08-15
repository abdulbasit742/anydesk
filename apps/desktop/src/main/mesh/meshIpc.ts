import { ipcMain } from "electron";
import { app } from "electron";
import { MeshService, type MeshConnectInput } from "./meshService.js";
import type { MeshSplitTunnelRule } from "@shared/index";

let service: MeshService | undefined;

function getService(): MeshService {
  if (!service) {
    service = new MeshService({
      dataDir: `${app.getPath("userData")}/mesh-vpn`,
      wireguardGoBinary: process.env.REMOTEDESK_WIREGUARD_GO,
      wgBinary: process.env.REMOTEDESK_WG,
      routeBinary: process.env.REMOTEDESK_ROUTE,
      dnsBinary: process.env.REMOTEDESK_DNS
    });
  }
  return service;
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} is required`);
  return value.trim();
}

export function registerMeshIpc(): void {
  ipcMain.handle("mesh:generate-keypair", async () => getService().generateKeyPair());

  ipcMain.handle("mesh:connect", async (_event, input: MeshConnectInput) => {
    const safeInput: MeshConnectInput = {
      apiBaseUrl: assertString(input?.apiBaseUrl, "apiBaseUrl"),
      accessToken: assertString(input?.accessToken, "accessToken"),
      deviceId: assertString(input?.deviceId, "deviceId"),
      deviceName: assertString(input?.deviceName, "deviceName"),
      platform: assertString(input?.platform, "platform"),
      clientVersion: typeof input?.clientVersion === "string" ? input.clientVersion.slice(0, 40) : undefined,
      interfaceName: typeof input?.interfaceName === "string" ? input.interfaceName.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 15) : "remotedesk0",
      listenPort: Number.isInteger(input?.listenPort) ? Math.max(1024, Math.min(65535, input.listenPort!)) : 51820,
      alwaysOn: input?.alwaysOn !== false,
      exitNodeId: typeof input?.exitNodeId === "string" ? input.exitNodeId : null,
      splitTunnelRules: Array.isArray(input?.splitTunnelRules) ? input.splitTunnelRules.slice(0, 200) : []
    };
    return getService().connect(safeInput);
  });

  ipcMain.handle("mesh:disconnect", async () => {
    await getService().disconnect();
    return { state: "stopped" };
  });

  ipcMain.handle("mesh:status", async () => getService().status());

  ipcMain.handle("mesh:set-exit-node", async (_event, exitNodeId: string | null) => {
    return getService().setExitNode(exitNodeId ? assertString(exitNodeId, "exitNodeId") : null);
  });

  ipcMain.handle("mesh:set-split-tunnel", async (_event, rules: MeshSplitTunnelRule[]) => {
    if (!Array.isArray(rules)) throw new Error("rules must be an array");
    return getService().setSplitTunnelRules(rules.slice(0, 200));
  });

  ipcMain.handle("mesh:set-always-on", async (_event, enabled: boolean) => {
    await getService().setAlwaysOn(Boolean(enabled));
    return { enabled: Boolean(enabled) };
  });

  ipcMain.handle("mesh:speed-test", async (_event, targetNodeId: string) => {
    return getService().speedTest(assertString(targetNodeId, "targetNodeId"));
  });
}

export async function stopMeshIpc(): Promise<void> {
  await service?.disconnect();
  service = undefined;
}
