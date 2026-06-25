/**
 * aiSupportIpc.ts — Main-process IPC handlers for AI-Powered IT Support.
 *
 * Provides:
 *  - System diagnostics collection (CPU, RAM, disk, processes, errors)
 *  - Auto-fix script execution (PowerShell / Bash)
 *  - Natural language command dispatch
 *  - Voice-to-action via Web Speech API bridge
 *  - Screen annotation event relay
 *  - Session event recording for replay
 *  - Knowledge base search proxy
 */

import { ipcMain } from "electron";
import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";

const execAsync = promisify(exec);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SystemState {
  cpuUsage: number;
  memoryUsage: number;
  totalMemory: number;
  diskUsage: number;
  totalDisk: number;
  activeProcesses: string[];
  recentErrors: string[];
  osVersion: string;
}

interface ScriptResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const cpus = os.cpus();
    const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const total = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b, 0), 0);
    resolve(Math.round(100 - (idle / total) * 100));
  });
}

async function getActiveProcesses(): Promise<string[]> {
  try {
    const platform = process.platform;
    if (platform === "win32") {
      const { stdout } = await execAsync("tasklist /FO CSV /NH | head -20");
      return stdout.split("\n").slice(0, 20).map(l => l.split(",")[0]?.replace(/"/g, "").trim()).filter(Boolean);
    } else {
      const { stdout } = await execAsync("ps aux --sort=-%cpu | head -20 | awk '{print $11}'");
      return stdout.split("\n").slice(1, 20).map(l => path.basename(l.trim())).filter(Boolean);
    }
  } catch {
    return [];
  }
}

async function getRecentErrors(): Promise<string[]> {
  try {
    const platform = process.platform;
    if (platform === "win32") {
      const { stdout } = await execAsync(
        `powershell -Command "Get-EventLog -LogName System -EntryType Error -Newest 5 | Select-Object -ExpandProperty Message"`,
        { timeout: 5000 }
      );
      return stdout.split("\n").filter(Boolean).slice(0, 5);
    } else if (platform === "darwin") {
      const { stdout } = await execAsync("log show --predicate 'eventType == logEvent AND messageType == error' --last 1h --info 2>/dev/null | tail -5");
      return stdout.split("\n").filter(Boolean).slice(0, 5);
    } else {
      const { stdout } = await execAsync("journalctl -p err -n 5 --no-pager --output=short 2>/dev/null || dmesg | grep -i error | tail -5");
      return stdout.split("\n").filter(Boolean).slice(0, 5);
    }
  } catch {
    return [];
  }
}

async function getDiskInfo(): Promise<{ used: number; total: number }> {
  try {
    const platform = process.platform;
    if (platform === "win32") {
      const { stdout } = await execAsync("wmic logicaldisk get size,freespace /format:csv");
      const lines = stdout.trim().split("\n").filter(l => l.includes(","));
      let total = 0, free = 0;
      for (const line of lines) {
        const parts = line.split(",");
        free += parseInt(parts[1] || "0", 10) || 0;
        total += parseInt(parts[2] || "0", 10) || 0;
      }
      return { used: Math.round((total - free) / 1e9), total: Math.round(total / 1e9) };
    } else {
      const { stdout } = await execAsync("df -BG / | tail -1 | awk '{print $2, $3}'");
      const parts = stdout.trim().split(" ");
      const total = parseInt(parts[0] || "0", 10);
      const used = parseInt(parts[1] || "0", 10);
      return { used, total };
    }
  } catch {
    return { used: 0, total: 0 };
  }
}

// ─── IPC Registration ─────────────────────────────────────────────────────────

export function registerAiSupportIpc(): void {

  // Collect full system state for AI diagnostics
  ipcMain.handle("ai:collect-system-state", async (): Promise<SystemState> => {
    const [cpuUsage, activeProcesses, recentErrors, diskInfo] = await Promise.all([
      getCpuUsage(),
      getActiveProcesses(),
      getRecentErrors(),
      getDiskInfo()
    ]);

    const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
    const freeMemory = Math.round(os.freemem() / 1024 / 1024);
    const memoryUsage = totalMemory - freeMemory;

    return {
      cpuUsage,
      memoryUsage,
      totalMemory,
      diskUsage: diskInfo.used,
      totalDisk: diskInfo.total,
      activeProcesses,
      recentErrors,
      osVersion: `${os.type()} ${os.release()} (${os.arch()})`
    };
  });

  // Execute an auto-fix script
  ipcMain.handle("ai:execute-script", async (_event, script: string): Promise<ScriptResult> => {
    const platform = process.platform;
    const tmpDir = os.tmpdir();
    const ext = platform === "win32" ? ".ps1" : ".sh";
    const scriptPath = path.join(tmpDir, `remotedesk_fix_${Date.now()}${ext}`);

    try {
      fs.writeFileSync(scriptPath, script, { encoding: "utf8", mode: 0o700 });

      const command = platform === "win32"
        ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
        : `bash "${scriptPath}"`;

      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      return { success: true, stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return {
        success: false,
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? String(err),
        exitCode: err.code ?? 1
      };
    } finally {
      try { fs.unlinkSync(scriptPath); } catch { /* ignore */ }
    }
  });

  // Restart a system service
  ipcMain.handle("ai:restart-service", async (_event, serviceName: string): Promise<ScriptResult> => {
    const platform = process.platform;
    let command: string;

    if (platform === "win32") {
      command = `powershell -Command "Restart-Service -Name '${serviceName}' -Force"`;
    } else if (platform === "darwin") {
      command = `sudo launchctl stop ${serviceName} && sudo launchctl start ${serviceName}`;
    } else {
      command = `sudo systemctl restart ${serviceName}`;
    }

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 15000 });
      return { success: true, stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return { success: false, stdout: err.stdout ?? "", stderr: err.stderr ?? String(err), exitCode: err.code ?? 1 };
    }
  });

  // Kill a process by name
  ipcMain.handle("ai:kill-process", async (_event, processName: string): Promise<ScriptResult> => {
    const platform = process.platform;
    const command = platform === "win32"
      ? `taskkill /F /IM "${processName}.exe"`
      : `pkill -f "${processName}"`;

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
      return { success: true, stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return { success: false, stdout: err.stdout ?? "", stderr: err.stderr ?? String(err), exitCode: err.code ?? 1 };
    }
  });

  // Run a diagnostic command and return output
  ipcMain.handle("ai:run-diagnostic-command", async (_event, command: string): Promise<ScriptResult> => {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
      return { success: true, stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return { success: false, stdout: err.stdout ?? "", stderr: err.stderr ?? String(err), exitCode: err.code ?? 1 };
    }
  });

  // Get platform info
  ipcMain.handle("ai:get-platform", () => ({
    platform: process.platform,
    arch: os.arch(),
    release: os.release(),
    type: os.type(),
    hostname: os.hostname()
  }));

  // Clear temp files (common fix)
  ipcMain.handle("ai:clear-temp-files", async (): Promise<ScriptResult> => {
    const platform = process.platform;
    let script: string;

    if (platform === "win32") {
      script = `
$tempFolders = @($env:TEMP, $env:TMP, "C:\\Windows\\Temp")
$totalFreed = 0
foreach ($folder in $tempFolders) {
  if (Test-Path $folder) {
    $files = Get-ChildItem -Path $folder -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $files) {
      try {
        $size = $file.Length
        Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
      } catch {}
    }
  }
}
Write-Output "Cleared approximately $([math]::Round($totalFreed / 1MB, 2)) MB of temp files"
`;
    } else {
      script = `
FREED=0
for dir in /tmp /var/tmp; do
  if [ -d "$dir" ]; then
    find "$dir" -type f -atime +1 -delete 2>/dev/null
  fi
done
echo "Temp files cleared"
`;
    }

    return ipcMain.emit("ai:execute-script", null, script);
  });

  // Reset network adapter (Windows)
  ipcMain.handle("ai:reset-network", async (): Promise<ScriptResult> => {
    const platform = process.platform;
    let command: string;

    if (platform === "win32") {
      command = `powershell -Command "
netsh winsock reset;
netsh int ip reset;
ipconfig /release;
ipconfig /flushdns;
ipconfig /renew;
Write-Output 'Network reset complete'
"`;
    } else if (platform === "darwin") {
      command = `sudo ifconfig en0 down && sudo ifconfig en0 up && echo 'Network reset complete'`;
    } else {
      command = `sudo systemctl restart NetworkManager && echo 'Network reset complete'`;
    }

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      return { success: true, stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return { success: false, stdout: err.stdout ?? "", stderr: err.stderr ?? String(err), exitCode: err.code ?? 1 };
    }
  });
}
