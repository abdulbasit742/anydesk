import { DeviceBase, DeviceType, DeviceStatus } from "./DeviceBase.js";
import { prisma } from "../../lib/prisma.js";
import Redis from "ioredis";

export class DeviceRegistry {
  private devices: Map<string, DeviceBase> = new Map();
  private redis: any;
  private stateCache: Map<string, any> = new Map();

  constructor(redis: any) {
    this.redis = redis;
  }

  /**
   * Register a device
   */
  async registerDevice(device: DeviceBase, userId: string): Promise<void> {
    const info = device.getInfo();

    this.devices.set(info.deviceId, device);

    // Store in database
    await prisma.universalDevice.create({
      data: {
        deviceId: info.deviceId,
        userId,
        deviceType: info.deviceType,
        deviceName: info.deviceName,
        status: info.status,
        metrics: {
          manufacturer: info.manufacturer,
          model: info.model,
          capabilities: info.capabilities,
        } as any,
      },
    });

    // Cache in Redis
    await this.redis.set(
      `device:${info.deviceId}`,
      JSON.stringify(info),
      "EX",
      3600
    );

    // Listen to device events
    device.on("state-change", (state) => {
      this.onDeviceStateChange(info.deviceId, state);
    });

    device.on("command", (command) => {
      this.onDeviceCommand(info.deviceId, command);
    });

    console.log(`[DeviceRegistry] Device registered: ${info.deviceId}`);
  }

  /**
   * Unregister a device
   */
  async unregisterDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);

    if (device) {
      await device.disconnect();
      this.devices.delete(deviceId);
    }

    // Remove from database
    await prisma.universalDevice.delete({
      where: { deviceId },
    });

    // Remove from cache
    await this.redis.del(`device:${deviceId}`);

    console.log(`[DeviceRegistry] Device unregistered: ${deviceId}`);
  }

  /**
   * Get device by ID
   */
  getDevice(deviceId: string): DeviceBase | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Get all devices for user
   */
  async getDevices(userId: string): Promise<any[]> {
    return prisma.universalDevice.findMany({
      where: { userId },
    });
  }

  /**
   * Get devices by type
   */
  async getDevicesByType(userId: string, deviceType: DeviceType): Promise<any[]> {
    return prisma.universalDevice.findMany({
      where: { userId, deviceType },
    });
  }

  /**
   * Get device state
   */
  async getDeviceState(deviceId: string): Promise<any> {
    const device = this.devices.get(deviceId);

    if (!device) {
      return null;
    }

    return device.getState();
  }

  /**
   * Send command to device
   */
  async sendCommand(deviceId: string, command: any): Promise<any> {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    return device.sendCommand(command);
  }

  /**
   * Get all online devices
   */
  async getOnlineDevices(userId: string): Promise<any[]> {
    const devices = await this.getDevices(userId);
    return devices.filter((d) => d.status === DeviceStatus.ONLINE);
  }

  /**
   * Get device statistics
   */
  async getStatistics(userId: string): Promise<any> {
    const devices = await this.getDevices(userId);

    const stats = {
      total: devices.length,
      online: devices.filter((d) => d.status === DeviceStatus.ONLINE).length,
      offline: devices.filter((d) => d.status === DeviceStatus.OFFLINE).length,
      byType: {} as Record<string, number>,
    };

    for (const device of devices) {
      stats.byType[device.deviceType] = (stats.byType[device.deviceType] || 0) + 1;
    }

    return stats;
  }

  /**
   * Handle device state change
   */
  private async onDeviceStateChange(deviceId: string, state: any): Promise<void> {
    // Update database
    await prisma.universalDevice.update({
      where: { deviceId },
      data: {
        status: state.status,
        lastSeen: new Date(),
      },
    });

    // Update cache
    this.stateCache.set(deviceId, state);
    await this.redis.set(
      `device:state:${deviceId}`,
      JSON.stringify(state),
      "EX",
      300
    );
  }

  /**
   * Handle device command
   */
  private async onDeviceCommand(deviceId: string, command: any): Promise<void> {
    // Store command in database
    await prisma.deviceCommand.create({
      data: {
        deviceId,
        commandName: command.name,
        params: command.params,
        status: command.status,
        result: command.result,
        failureReason: command.error,
      },
    });
  }

  /**
   * Get registry statistics
   */
  getRegistryStats(): {
    totalDevices: number;
    registeredDevices: number;
  } {
    return {
      totalDevices: this.devices.size,
      registeredDevices: this.devices.size,
    };
  }
}
