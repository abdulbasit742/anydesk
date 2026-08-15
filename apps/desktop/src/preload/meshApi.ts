import { contextBridge, ipcRenderer } from "electron";
import type { MeshSplitTunnelRule } from "@shared/index";

export function exposeMeshApi(): void {
  contextBridge.exposeInMainWorld("remoteDeskMesh", {
    generateKeyPair: () => ipcRenderer.invoke("mesh:generate-keypair"),
    connect: (input: Record<string, unknown>) => ipcRenderer.invoke("mesh:connect", input),
    disconnect: () => ipcRenderer.invoke("mesh:disconnect"),
    status: () => ipcRenderer.invoke("mesh:status"),
    setExitNode: (exitNodeId: string | null) => ipcRenderer.invoke("mesh:set-exit-node", exitNodeId),
    setSplitTunnel: (rules: MeshSplitTunnelRule[]) => ipcRenderer.invoke("mesh:set-split-tunnel", rules),
    setAlwaysOn: (enabled: boolean) => ipcRenderer.invoke("mesh:set-always-on", enabled),
    speedTest: (targetNodeId: string) => ipcRenderer.invoke("mesh:speed-test", targetNodeId)
  });
}
