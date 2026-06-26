import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";

export enum DeviceType {
  SMARTPHONE = "smartphone",
  COMPUTER = "computer",
  SMART_TV = "smart_tv",
  SMART_HOME = "smart_home",
  WEARABLE = "wearable",
  VEHICLE = "vehicle",
  DRONE = "drone",
  GAMING_CONSOLE = "gaming_console",
  NETWORK_EQUIPMENT = "network_equipment",
  ROBOT = "robot",
}

export enum DeviceStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  IDLE = "idle",
  BUSY = "busy",
  ERROR = "error",
  UNKNOWN = "unknown",
}

export interface DeviceCapability {
  name: string;
  description: string;
  supportsStream?: boolean;
  supportsControl?: boolean;
  supportsNotifications?: boolean;
}

export interface DeviceCommand {
  id: string;
  name: string;
  params?: Record<string, any>;
  timestamp: Date;
  status: "pending" | "executing" | "completed" | "failed";
  result?: any;
  error?: string;
}

export interface DeviceState {
  status: DeviceStatus;
  battery?: number;
  temperature?: number;
  location?: { latitude: number; longitude: number };
  metrics?: Record<string, any>;
  lastUpdated: Date;
}

export abstract class DeviceBase extends EventEmitter {
  protected deviceId: string;
  protected deviceType: DeviceType;
  protected deviceName: string;
  protected manufacturer: string;
  protected model: string;
  protected state: DeviceState;
  protected capabilities: Map<string, DeviceCapability> = new Map();
  protected commandHistory: DeviceCommand[] = [];

  constructor(
    deviceType: DeviceType,
    deviceName: string,
    manufacturer: string,
    model: string
  ) {
    super();
    this.deviceId = `${deviceType}_${uuidv4().substring(0, 8)}`;
    this.deviceType = deviceType;
    this.deviceName = deviceName;
    this.manufacturer = manufacturer;
    this.model = model;
    this.state = {
      status: DeviceStatus.UNKNOWN,
      lastUpdated: new Date(),
    };
  }

  /**
   * Initialize device connection
   */
  abstract initialize(): Promise<void>;

  /**
   * Disconnect from device
   */
  abstract disconnect(): Promise<void>;

  /**
   * Get current device state
   */
  abstract getState(): Promise<DeviceState>;

  /**
   * Send command to device
   */
  abstract sendCommand(command: DeviceCommand): Promise<any>;

  /**
   * Get device capabilities
   */
  getCapabilities(): DeviceCapability[] {
    return Array.from(this.capabilities.values());
  }

  /**
   * Register a capability
   */
  protected registerCapability(capability: DeviceCapability): void {
    this.capabilities.set(capability.name, capability);
  }

  /**
   * Log command
   */
  protected logCommand(command: DeviceCommand): void {
    this.commandHistory.push(command);
    this.emit("command", command);
  }

  /**
   * Get device info
   */
  getInfo(): {
    deviceId: string;
    deviceType: DeviceType;
    deviceName: string;
    manufacturer: string;
    model: string;
    status: DeviceStatus;
    capabilities: DeviceCapability[];
  } {
    return {
      deviceId: this.deviceId,
      deviceType: this.deviceType,
      deviceName: this.deviceName,
      manufacturer: this.manufacturer,
      model: this.model,
      status: this.state.status,
      capabilities: this.getCapabilities(),
    };
  }

  /**
   * Get command history
   */
  getCommandHistory(limit: number = 100): DeviceCommand[] {
    return this.commandHistory.slice(-limit);
  }

  /**
   * Update state
   */
  protected updateState(newState: Partial<DeviceState>): void {
    this.state = {
      ...this.state,
      ...newState,
      lastUpdated: new Date(),
    };
    this.emit("state-change", this.state);
  }
}
