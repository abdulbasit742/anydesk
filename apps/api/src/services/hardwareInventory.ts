import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "../lib/prisma.js";

const execAsync = promisify(exec);

export interface HardwareInfo {
  cpuModel?: string;
  cpuCores?: number;
  cpuFrequencyGhz?: number;
  ramGb?: number;
  ramType?: string;
  diskType?: string;
  diskCapacityGb?: number;
  gpuModel?: string;
  networkInterfaces?: any[];
  osVersion?: string;
  osKernel?: string;
  installedSoftware?: string[];
  peripherals?: any[];
}

export class HardwareInventoryManager {
  async detectHardware(deviceId: string): Promise<HardwareInfo> {
    const info: HardwareInfo = {};

    try {
      // Detect CPU info
      const cpuInfo = await this.detectCPU();
      info.cpuModel = cpuInfo.model;
      info.cpuCores = cpuInfo.cores;
      info.cpuFrequencyGhz = cpuInfo.frequency;

      // Detect RAM info
      const ramInfo = await this.detectRAM();
      info.ramGb = ramInfo.totalGb;
      info.ramType = ramInfo.type;

      // Detect Disk info
      const diskInfo = await this.detectDisk();
      info.diskType = diskInfo.type;
      info.diskCapacityGb = diskInfo.capacityGb;

      // Detect GPU info
      const gpuInfo = await this.detectGPU();
      info.gpuModel = gpuInfo || undefined;

      // Detect Network interfaces
      const networkInterfaces = await this.detectNetworkInterfaces();
      info.networkInterfaces = networkInterfaces;

      // Detect OS info
      const osInfo = await this.detectOS();
      info.osVersion = osInfo.version;
      info.osKernel = osInfo.kernel;

      // Detect installed software
      const software = await this.detectInstalledSoftware();
      info.installedSoftware = software;

      // Detect peripherals
      const peripherals = await this.detectPeripherals();
      info.peripherals = peripherals;

      // Save to database
      await prisma.hardwareInventory.upsert({
        where: { deviceId },
        update: {
          ...info,
          lastUpdated: new Date()
        },
        create: {
          deviceId,
          ...info
        }
      });

      return info;
    } catch (error) {
      console.error(`Failed to detect hardware for device ${deviceId}:`, error);
      throw error;
    }
  }

  private async detectCPU(): Promise<{ model: string; cores: number; frequency: number }> {
    try {
      const { stdout } = await execAsync("lscpu");
      const lines = stdout.split("\n");
      const model = lines.find(l => l.includes("Model name"))?.split(":")[1]?.trim() || "Unknown";
      const cores = parseInt(
        lines.find(l => l.includes("CPU(s)"))?.split(":")[1]?.trim() || "1"
      );
      const frequency = parseFloat(
        lines.find(l => l.includes("CPU max MHz"))?.split(":")[1]?.trim() || "0"
      ) / 1000;

      return { model, cores, frequency };
    } catch {
      return { model: "Unknown", cores: 1, frequency: 0 };
    }
  }

  private async detectRAM(): Promise<{ totalGb: number; type: string }> {
    try {
      const { stdout } = await execAsync("free -h");
      const lines = stdout.split("\n");
      const memLine = lines[1];
      const totalGb = parseInt(memLine.split(/\s+/)[1]) || 0;

      // Try to detect RAM type
      let ramType = "Unknown";
      try {
        const { stdout: dmidecode } = await execAsync("sudo dmidecode -t memory");
        if (dmidecode.includes("DDR4")) ramType = "DDR4";
        else if (dmidecode.includes("DDR5")) ramType = "DDR5";
        else if (dmidecode.includes("DDR3")) ramType = "DDR3";
      } catch {
        ramType = "Unknown";
      }

      return { totalGb, type: ramType };
    } catch {
      return { totalGb: 0, type: "Unknown" };
    }
  }

  private async detectDisk(): Promise<{ type: string; capacityGb: number }> {
    try {
      const { stdout } = await execAsync("lsblk -d -o NAME,TYPE,SIZE");
      const lines = stdout.split("\n").slice(1);
      const diskLine = lines[0];
      const parts = diskLine.split(/\s+/);
      const type = parts[1] || "Unknown";
      const sizeStr = parts[2] || "0";
      const capacityGb = parseInt(sizeStr);

      return { type, capacityGb };
    } catch {
      return { type: "Unknown", capacityGb: 0 };
    }
  }

  private async detectGPU(): Promise<string | null> {
    try {
      const { stdout } = await execAsync("lspci | grep -i vga");
      return stdout.split("\n")[0]?.split(": ")[1] || null;
    } catch {
      return null;
    }
  }

  private async detectNetworkInterfaces(): Promise<any[]> {
    try {
      const { stdout } = await execAsync("ip link show");
      const interfaces: any[] = [];
      const lines = stdout.split("\n");

      let currentInterface: any = null;
      for (const line of lines) {
        if (/^\d+:/.test(line)) {
          if (currentInterface) interfaces.push(currentInterface);
          const match = line.match(/^\d+:\s+(\w+)/);
          currentInterface = { name: match?.[1] || "unknown", status: line.includes("UP") ? "up" : "down" };
        }
      }
      if (currentInterface) interfaces.push(currentInterface);

      return interfaces;
    } catch {
      return [];
    }
  }

  private async detectOS(): Promise<{ version: string; kernel: string }> {
    try {
      const { stdout: osRelease } = await execAsync("cat /etc/os-release");
      const { stdout: kernel } = await execAsync("uname -r");

      const versionMatch = osRelease.match(/VERSION="([^"]+)"/);
      const version = versionMatch?.[1] || "Unknown";

      return { version, kernel: kernel.trim() };
    } catch {
      return { version: "Unknown", kernel: "Unknown" };
    }
  }

  private async detectInstalledSoftware(): Promise<string[]> {
    try {
      const { stdout } = await execAsync("dpkg -l | awk '{print $2}' | head -20");
      return stdout.split("\n").filter(line => line.trim());
    } catch {
      return [];
    }
  }

  private async detectPeripherals(): Promise<any[]> {
    try {
      const { stdout } = await execAsync("lsusb");
      return stdout
        .split("\n")
        .filter(line => line.trim())
        .map(line => ({ device: line }));
    } catch {
      return [];
    }
  }
}

export const hardwareInventoryManager = new HardwareInventoryManager();
