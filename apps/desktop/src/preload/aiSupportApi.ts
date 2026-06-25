import { contextBridge, ipcRenderer } from "electron";

export function exposeAiSupportApi(): void {
  contextBridge.exposeInMainWorld("aiSupport", {
    // Collect system state for AI diagnostics
    collectSystemState: () =>
      ipcRenderer.invoke("ai:collect-system-state"),

    // Execute an auto-fix script
    executeScript: (script: string) =>
      ipcRenderer.invoke("ai:execute-script", script),

    // Restart a named service
    restartService: (serviceName: string) =>
      ipcRenderer.invoke("ai:restart-service", serviceName),

    // Kill a process by name
    killProcess: (processName: string) =>
      ipcRenderer.invoke("ai:kill-process", processName),

    // Run a diagnostic command
    runDiagnosticCommand: (command: string) =>
      ipcRenderer.invoke("ai:run-diagnostic-command", command),

    // Get platform info
    getPlatform: () =>
      ipcRenderer.invoke("ai:get-platform"),

    // Clear temp files
    clearTempFiles: () =>
      ipcRenderer.invoke("ai:clear-temp-files"),

    // Reset network
    resetNetwork: () =>
      ipcRenderer.invoke("ai:reset-network"),
  });
}
