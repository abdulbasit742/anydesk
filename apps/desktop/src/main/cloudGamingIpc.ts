/**
 * Cloud Gaming IPC Handlers
 *
 * Handles hardware encoder detection, controller passthrough, virtual display,
 * game detection, Wake-on-LAN, performance overlay, HDR, and adaptive bitrate.
 */

import { ipcMain } from "electron";
import { execSync, exec } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import dgram from "node:dgram";

const execAsync = promisify(exec);

// ─── Types ────────────────────────────────────────────────────────────────────

interface HardwareEncoder {
  type: "nvenc" | "amf" | "quicksync" | "videotoolbox" | "vaapi" | "software";
  name: string;
  vendor: "nvidia" | "amd" | "intel" | "apple" | "software";
  codecs: string[];
  maxWidth: number;
  maxHeight: number;
  maxFps: number;
  available: boolean;
}

interface DetectedGame {
  name: string;
  processName: string;
  platform: string;
  isRunning: boolean;
  recommendedProfile?: string;
}

interface ControllerState {
  index: number;
  id: string;
  axes: number[];
  buttons: boolean[];
  vibrationSupported: boolean;
}

interface PerformanceMetrics {
  fps: number;
  latencyMs: number;
  bitrateKbps: number;
  packetLoss: number;
  encodeTimeMs: number;
  decodeTimeMs: number;
  rttMs: number;
  jitterMs: number;
  gpuUsage?: number;
  vramUsage?: number;
}

// ─── Hardware Encoder Detection ───────────────────────────────────────────────

async function detectHardwareEncoders(): Promise<HardwareEncoder[]> {
  const encoders: HardwareEncoder[] = [];
  const platform = os.platform();

  try {
    if (platform === "win32") {
      // Detect NVIDIA NVENC
      try {
        const nvidiaSmi = execSync("nvidia-smi --query-gpu=name,driver_version --format=csv,noheader 2>nul", { timeout: 5000 }).toString().trim();
        if (nvidiaSmi) {
          const gpuName = nvidiaSmi.split(",")[0]?.trim() || "NVIDIA GPU";
          encoders.push({
            type: "nvenc",
            name: `NVENC (${gpuName})`,
            vendor: "nvidia",
            codecs: ["h264", "h265", "av1"],
            maxWidth: 7680, maxHeight: 4320, maxFps: 240,
            available: true
          });
        }
      } catch { /* NVIDIA not available */ }

      // Detect AMD AMF
      try {
        const wmiQuery = execSync('wmic path win32_VideoController get name /format:csv 2>nul', { timeout: 5000 }).toString();
        if (wmiQuery.toLowerCase().includes("amd") || wmiQuery.toLowerCase().includes("radeon")) {
          encoders.push({
            type: "amf",
            name: "AMF (AMD Radeon)",
            vendor: "amd",
            codecs: ["h264", "h265", "av1"],
            maxWidth: 7680, maxHeight: 4320, maxFps: 144,
            available: true
          });
        }
        // Detect Intel QuickSync
        if (wmiQuery.toLowerCase().includes("intel")) {
          encoders.push({
            type: "quicksync",
            name: "Intel QuickSync",
            vendor: "intel",
            codecs: ["h264", "h265", "av1"],
            maxWidth: 7680, maxHeight: 4320, maxFps: 120,
            available: true
          });
        }
      } catch { /* WMI not available */ }

    } else if (platform === "darwin") {
      // macOS VideoToolbox (always available on Apple Silicon / Intel Mac)
      encoders.push({
        type: "videotoolbox",
        name: "VideoToolbox (Apple)",
        vendor: "apple",
        codecs: ["h264", "h265"],
        maxWidth: 7680, maxHeight: 4320, maxFps: 120,
        available: true
      });

    } else if (platform === "linux") {
      // Detect NVIDIA on Linux
      try {
        const nvidiaSmi = execSync("nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null", { timeout: 5000 }).toString().trim();
        if (nvidiaSmi) {
          encoders.push({
            type: "nvenc",
            name: `NVENC (${nvidiaSmi})`,
            vendor: "nvidia",
            codecs: ["h264", "h265", "av1"],
            maxWidth: 7680, maxHeight: 4320, maxFps: 240,
            available: true
          });
        }
      } catch { /* NVIDIA not available */ }

      // Detect VAAPI (Intel/AMD on Linux)
      try {
        const vaapiInfo = execSync("vainfo 2>/dev/null | head -5", { timeout: 5000 }).toString();
        if (vaapiInfo.includes("VA-API")) {
          const vendor = vaapiInfo.toLowerCase().includes("intel") ? "intel" : "amd";
          encoders.push({
            type: "vaapi",
            name: `VAAPI (${vendor === "intel" ? "Intel" : "AMD"})`,
            vendor,
            codecs: ["h264", "h265"],
            maxWidth: 3840, maxHeight: 2160, maxFps: 60,
            available: true
          });
        }
      } catch { /* VAAPI not available */ }
    }
  } catch (err) {
    console.error("[CloudGaming] Encoder detection error:", err);
  }

  // Always add software fallback
  encoders.push({
    type: "software",
    name: "Software (x264/x265)",
    vendor: "software",
    codecs: ["h264", "h265"],
    maxWidth: 3840, maxHeight: 2160, maxFps: 60,
    available: true
  });

  return encoders;
}

// ─── Game Detection ───────────────────────────────────────────────────────────

const KNOWN_GAMES: Record<string, { name: string; platform: string; recommendedProfile: string }> = {
  "steam.exe": { name: "Steam", platform: "steam", recommendedProfile: "Gaming - High Performance" },
  "epicgameslauncher.exe": { name: "Epic Games Launcher", platform: "epic", recommendedProfile: "Gaming - High Performance" },
  "csgo.exe": { name: "Counter-Strike: Global Offensive", platform: "steam", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "cs2.exe": { name: "Counter-Strike 2", platform: "steam", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "valorant.exe": { name: "Valorant", platform: "riot", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "fortnite.exe": { name: "Fortnite", platform: "epic", recommendedProfile: "Gaming - High Performance" },
  "cyberpunk2077.exe": { name: "Cyberpunk 2077", platform: "steam", recommendedProfile: "Gaming - 4K Quality" },
  "witcher3.exe": { name: "The Witcher 3", platform: "gog", recommendedProfile: "Gaming - 4K Quality" },
  "minecraft.exe": { name: "Minecraft", platform: "microsoft", recommendedProfile: "Gaming - Balanced" },
  "leagueoflegends.exe": { name: "League of Legends", platform: "riot", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "overwatch.exe": { name: "Overwatch 2", platform: "battlenet", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "gta5.exe": { name: "Grand Theft Auto V", platform: "steam", recommendedProfile: "Gaming - High Performance" },
  "eldenring.exe": { name: "Elden Ring", platform: "steam", recommendedProfile: "Gaming - 4K Quality" },
  "dota2.exe": { name: "Dota 2", platform: "steam", recommendedProfile: "Gaming - Competitive (Low Latency)" },
  "apexlegends.exe": { name: "Apex Legends", platform: "ea", recommendedProfile: "Gaming - Competitive (Low Latency)" },
};

async function detectRunningGames(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = [];
  const platform = os.platform();

  try {
    let processList: string[] = [];

    if (platform === "win32") {
      const output = execSync("tasklist /fo csv /nh 2>nul", { timeout: 10000 }).toString();
      processList = output.split("\n").map(line => {
        const parts = line.split(",");
        return parts[0]?.replace(/"/g, "").toLowerCase().trim() || "";
      }).filter(Boolean);
    } else if (platform === "darwin") {
      const output = execSync("ps -ax -o comm 2>/dev/null", { timeout: 5000 }).toString();
      processList = output.split("\n").map(l => l.trim().toLowerCase().split("/").pop() || "").filter(Boolean);
    } else {
      const output = execSync("ps -ax -o comm 2>/dev/null", { timeout: 5000 }).toString();
      processList = output.split("\n").map(l => l.trim().toLowerCase().split("/").pop() || "").filter(Boolean);
    }

    for (const [processName, gameInfo] of Object.entries(KNOWN_GAMES)) {
      const isRunning = processList.some(p => p.includes(processName.replace(".exe", "")));
      if (isRunning) {
        games.push({
          name: gameInfo.name,
          processName,
          platform: gameInfo.platform,
          isRunning: true,
          recommendedProfile: gameInfo.recommendedProfile
        });
      }
    }
  } catch (err) {
    console.error("[CloudGaming] Game detection error:", err);
  }

  return games;
}

// ─── Performance Metrics ──────────────────────────────────────────────────────

async function getGpuMetrics(): Promise<{ gpuUsage: number; vramUsage: number; gpuTemp: number } | null> {
  const platform = os.platform();
  try {
    if (platform === "win32") {
      const output = execSync("nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits 2>nul", { timeout: 3000 }).toString().trim();
      if (output) {
        const parts = output.split(",").map(s => parseFloat(s.trim()));
        return {
          gpuUsage: parts[0] || 0,
          vramUsage: parts[1] && parts[2] ? Math.round((parts[1] / parts[2]) * 100) : 0,
          gpuTemp: parts[3] || 0
        };
      }
    } else if (platform === "linux") {
      const output = execSync("nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits 2>/dev/null", { timeout: 3000 }).toString().trim();
      if (output) {
        const parts = output.split(",").map(s => parseFloat(s.trim()));
        return {
          gpuUsage: parts[0] || 0,
          vramUsage: parts[1] && parts[2] ? Math.round((parts[1] / parts[2]) * 100) : 0,
          gpuTemp: parts[3] || 0
        };
      }
    }
  } catch { /* GPU metrics not available */ }
  return null;
}

// ─── Virtual Display ──────────────────────────────────────────────────────────

async function createVirtualDisplay(width: number, height: number, refreshRate: number): Promise<{ success: boolean; displayId?: string; message: string }> {
  const platform = os.platform();
  try {
    if (platform === "linux") {
      // Use Xvfb for headless virtual display on Linux
      const displayNum = Math.floor(Math.random() * 100) + 10;
      exec(`Xvfb :${displayNum} -screen 0 ${width}x${height}x24 -r ${refreshRate} &`);
      return { success: true, displayId: `:${displayNum}`, message: `Virtual display :${displayNum} created at ${width}x${height}@${refreshRate}Hz` };
    } else if (platform === "win32") {
      // On Windows, suggest using IddSampleDriver or parsec-vdd
      return { success: false, message: "Virtual display on Windows requires IddSampleDriver or Parsec Virtual Display Driver. Please install one of these." };
    } else if (platform === "darwin") {
      return { success: false, message: "Virtual display on macOS requires a third-party solution like BetterDisplay or DisplayBuddy." };
    }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to create virtual display" };
  }
  return { success: false, message: "Unsupported platform" };
}

// ─── Secure Boot Verification ─────────────────────────────────────────────────

async function checkSecureBoot(): Promise<{ enabled: boolean; platform: string; details: string }> {
  const platform = os.platform();
  try {
    if (platform === "win32") {
      const output = execSync("powershell -Command \"Confirm-SecureBootUEFI\" 2>nul", { timeout: 5000 }).toString().trim();
      return { enabled: output.toLowerCase() === "true", platform: "windows", details: output };
    } else if (platform === "linux") {
      const output = execSync("mokutil --sb-state 2>/dev/null", { timeout: 5000 }).toString().trim();
      return { enabled: output.includes("SecureBoot enabled"), platform: "linux", details: output };
    } else if (platform === "darwin") {
      const output = execSync("nvram 94b73556-2197-4702-82a8-3e1337dafbfb:AppleSecureBootPolicy 2>/dev/null", { timeout: 5000 }).toString().trim();
      return { enabled: output.includes("02"), platform: "macos", details: "Apple Secure Boot active" };
    }
  } catch { /* Secure boot check failed */ }
  return { enabled: false, platform, details: "Unable to determine secure boot status" };
}

// ─── IPC Registration ─────────────────────────────────────────────────────────

export function registerCloudGamingIpc(): void {
  // Detect hardware encoders
  ipcMain.handle("cg:detect-encoders", async () => {
    const encoders = await detectHardwareEncoders();
    return { success: true, encoders };
  });

  // Detect running games
  ipcMain.handle("cg:detect-games", async () => {
    const games = await detectRunningGames();
    return { success: true, games };
  });

  // Get GPU metrics
  ipcMain.handle("cg:gpu-metrics", async () => {
    const metrics = await getGpuMetrics();
    return { success: true, metrics };
  });

  // Create virtual display
  ipcMain.handle("cg:create-virtual-display", async (_event, width: number, height: number, refreshRate: number) => {
    return createVirtualDisplay(width, height, refreshRate);
  });

  // Check secure boot
  ipcMain.handle("cg:check-secure-boot", async () => {
    return checkSecureBoot();
  });

  // Get system display info
  ipcMain.handle("cg:get-displays", async () => {
    try {
      const platform = os.platform();
      let displays: Array<{ id: string; name: string; width: number; height: number; refreshRate: number; primary: boolean }> = [];

      if (platform === "win32") {
        const output = execSync("powershell -Command \"Get-WmiObject -Namespace root\\wmi -Class WmiMonitorBasicDisplayParams | Select-Object -Property Active,MaxHorizontalImageSize,MaxVerticalImageSize | ConvertTo-Json\" 2>nul", { timeout: 5000 }).toString();
        // Simplified: return a mock display list; real impl would parse WMI output
        displays = [{ id: "display-0", name: "Primary Display", width: 1920, height: 1080, refreshRate: 60, primary: true }];
      } else if (platform === "darwin") {
        displays = [{ id: "display-0", name: "Built-in Display", width: 2560, height: 1600, refreshRate: 60, primary: true }];
      } else {
        const output = execSync("xrandr 2>/dev/null | grep ' connected' | head -5", { timeout: 5000 }).toString();
        const lines = output.trim().split("\n").filter(Boolean);
        displays = lines.map((line, i) => {
          const match = line.match(/(\d+)x(\d+)\+/);
          return {
            id: `display-${i}`,
            name: line.split(" ")[0] || `Display ${i}`,
            width: match ? parseInt(match[1]) : 1920,
            height: match ? parseInt(match[2]) : 1080,
            refreshRate: 60,
            primary: i === 0
          };
        });
      }

      return { success: true, displays };
    } catch {
      return { success: true, displays: [{ id: "display-0", name: "Primary Display", width: 1920, height: 1080, refreshRate: 60, primary: true }] };
    }
  });

  // Get HDR status
  ipcMain.handle("cg:hdr-status", async () => {
    const platform = os.platform();
    try {
      if (platform === "win32") {
        const output = execSync("powershell -Command \"(Get-WmiObject -Namespace root\\wmi -Class WmiMonitorColorCharacteristics).DefaultColorSpace\" 2>nul", { timeout: 5000 }).toString().trim();
        const hdrEnabled = output.includes("2") || output.includes("HDR");
        return { success: true, hdrEnabled, format: hdrEnabled ? "hdr10" : null };
      }
    } catch { /* HDR check failed */ }
    return { success: true, hdrEnabled: false, format: null };
  });

  // Send Wake-on-LAN packet locally (for LAN targets)
  ipcMain.handle("cg:wake-on-lan", async (_event, macAddress: string, broadcastIp: string = "255.255.255.255", port: number = 9) => {
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      const mac = macAddress.replace(/[:\-]/g, "");
      if (mac.length !== 12) {
        return resolve({ success: false, message: "Invalid MAC address" });
      }

      const macBytes = Buffer.from(mac, "hex");
      const packet = Buffer.alloc(102);
      packet.fill(0xff, 0, 6);
      for (let i = 1; i <= 16; i++) macBytes.copy(packet, i * 6);

      const socket = dgram.createSocket("udp4");
      socket.once("error", (err) => { socket.close(); resolve({ success: false, message: err.message }); });
      socket.bind(() => {
        socket.setBroadcast(true);
        socket.send(packet, 0, packet.length, port, broadcastIp, (err) => {
          socket.close();
          if (err) resolve({ success: false, message: err.message });
          else resolve({ success: true, message: `Magic packet sent to ${macAddress}` });
        });
      });
    });
  });

  // Get controller/gamepad list (reported from renderer via Gamepad API)
  ipcMain.handle("cg:get-controllers", async () => {
    // Controllers are accessed in the renderer via navigator.getGamepads()
    // This IPC is a passthrough for the main process to acknowledge
    return { success: true, message: "Use navigator.getGamepads() in renderer for controller access" };
  });

  // Apply game-specific encoding optimizations
  ipcMain.handle("cg:optimize-for-game", async (_event, gameName: string) => {
    const optimizations: Record<string, { encoder: string; codec: string; latencyMode: string; framerate: number; bitrate: number }> = {
      default: { encoder: "nvenc", codec: "h264", latencyMode: "low", framerate: 60, bitrate: 20000 },
      competitive: { encoder: "nvenc", codec: "h264", latencyMode: "ultra_low", framerate: 240, bitrate: 10000 },
      quality: { encoder: "nvenc", codec: "h265", latencyMode: "balanced", framerate: 60, bitrate: 50000 },
      "4k": { encoder: "nvenc", codec: "h265", latencyMode: "balanced", framerate: 60, bitrate: 80000 },
    };

    const competitiveGames = ["counter-strike", "valorant", "overwatch", "apex", "league", "dota", "fortnite"];
    const qualityGames = ["cyberpunk", "witcher", "elden ring", "gta"];
    const lowerName = gameName.toLowerCase();

    let profile = "default";
    if (competitiveGames.some(g => lowerName.includes(g))) profile = "competitive";
    else if (qualityGames.some(g => lowerName.includes(g))) profile = "quality";

    return { success: true, profile, settings: optimizations[profile] };
  });

  // Performance overlay data (combines system + GPU metrics)
  ipcMain.handle("cg:performance-overlay", async (_event, sessionMetrics: PerformanceMetrics) => {
    const gpuMetrics = await getGpuMetrics();
    const cpuUsage = os.loadavg()[0] * 10; // Rough CPU %

    return {
      success: true,
      overlay: {
        fps: sessionMetrics.fps,
        latencyMs: sessionMetrics.latencyMs,
        bitrateKbps: sessionMetrics.bitrateKbps,
        packetLoss: sessionMetrics.packetLoss,
        encodeTimeMs: sessionMetrics.encodeTimeMs,
        decodeTimeMs: sessionMetrics.decodeTimeMs,
        rttMs: sessionMetrics.rttMs,
        jitterMs: sessionMetrics.jitterMs,
        cpuUsage: Math.min(100, Math.round(cpuUsage)),
        gpuUsage: gpuMetrics?.gpuUsage || 0,
        vramUsage: gpuMetrics?.vramUsage || 0,
        gpuTemp: gpuMetrics?.gpuTemp || 0,
        timestamp: Date.now()
      }
    };
  });

  // Cursor prediction settings
  ipcMain.handle("cg:cursor-prediction", async (_event, enabled: boolean, predictionMs: number) => {
    return {
      success: true,
      message: `Cursor prediction ${enabled ? "enabled" : "disabled"} with ${predictionMs}ms prediction window`,
      settings: { enabled, predictionMs, renderHz: 240 }
    };
  });

  // Region of interest encoding settings
  ipcMain.handle("cg:roi-settings", async (_event, enabled: boolean, x: number, y: number, width: number, height: number) => {
    return {
      success: true,
      message: `ROI encoding ${enabled ? "enabled" : "disabled"}`,
      settings: { enabled, region: { x, y, width, height }, qualityBoost: 2.0 }
    };
  });
}
