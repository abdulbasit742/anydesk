import { DeviceBase, DeviceType, DeviceStatus, DeviceCommand, DeviceState } from "../core/DeviceBase.js";

export class SmartHomeDevice extends DeviceBase {
  private protocol: string; // mqtt, matter, homekit, etc.
  private mqttClient: any;
  private homeKitAccessory: any;

  constructor(
    deviceName: string,
    manufacturer: string,
    model: string,
    protocol: string,
    client: any
  ) {
    super(DeviceType.SMART_HOME, deviceName, manufacturer, model);
    this.protocol = protocol;

    if (protocol === "mqtt") {
      this.mqttClient = client;
    } else if (protocol === "homekit") {
      this.homeKitAccessory = client;
    }

    this.registerCapabilities();
  }

  /**
   * Register smart home capabilities
   */
  private registerCapabilities(): void {
    this.registerCapability({
      name: "power_control",
      description: "Turn device on/off",
      supportsControl: true,
    });

    this.registerCapability({
      name: "brightness_control",
      description: "Adjust brightness (for lights)",
      supportsControl: true,
    });

    this.registerCapability({
      name: "temperature_control",
      description: "Adjust temperature (for thermostats)",
      supportsControl: true,
    });

    this.registerCapability({
      name: "lock_control",
      description: "Lock/unlock (for smart locks)",
      supportsControl: true,
    });

    this.registerCapability({
      name: "status_query",
      description: "Get device status",
      supportsControl: true,
    });
  }

  /**
   * Initialize device connection
   */
  async initialize(): Promise<void> {
    try {
      if (this.protocol === "mqtt") {
        // Subscribe to MQTT topics
        this.mqttClient.subscribe(`${this.deviceId}/status`);
        this.mqttClient.subscribe(`${this.deviceId}/state`);

        this.mqttClient.on("message", (topic: string, message: string) => {
          this.handleMqttMessage(topic, message);
        });
      } else if (this.protocol === "homekit") {
        // HomeKit setup
        console.log(`[SmartHomeDevice] HomeKit device initialized: ${this.deviceId}`);
      }

      this.updateState({ status: DeviceStatus.ONLINE });

      console.log(`[SmartHomeDevice] Connected: ${this.deviceId}`);
    } catch (error) {
      console.error(`[SmartHomeDevice] Connection failed:`, error);
      this.updateState({ status: DeviceStatus.ERROR });
      throw error;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.protocol === "mqtt" && this.mqttClient) {
      this.mqttClient.unsubscribe(`${this.deviceId}/status`);
      this.mqttClient.unsubscribe(`${this.deviceId}/state`);
    }

    this.updateState({ status: DeviceStatus.OFFLINE });
    console.log(`[SmartHomeDevice] Disconnected: ${this.deviceId}`);
  }

  /**
   * Get current device state
   */
  async getState(): Promise<DeviceState> {
    try {
      if (this.protocol === "mqtt") {
        // Query MQTT for state
        return new Promise((resolve) => {
          this.mqttClient.publish(`${this.deviceId}/get`, "state", (err: any) => {
            if (err) {
              resolve({
                status: DeviceStatus.ERROR,
                lastUpdated: new Date(),
              });
            } else {
              resolve({
                status: DeviceStatus.ONLINE,
                metrics: this.state.metrics,
                lastUpdated: new Date(),
              });
            }
          });
        });
      }

      return {
        status: DeviceStatus.ONLINE,
        metrics: this.state.metrics,
        lastUpdated: new Date(),
      };
    } catch (error) {
      return {
        status: DeviceStatus.ERROR,
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Send command to device
   */
  async sendCommand(command: DeviceCommand): Promise<any> {
    try {
      let result: any;

      switch (command.name) {
        case "power_on":
          result = await this.setPower(true);
          break;

        case "power_off":
          result = await this.setPower(false);
          break;

        case "set_brightness":
          result = await this.setBrightness(command.params?.value || 100);
          break;

        case "set_temperature":
          result = await this.setTemperature(command.params?.value || 72);
          break;

        case "lock":
          result = await this.setLock(true);
          break;

        case "unlock":
          result = await this.setLock(false);
          break;

        case "get_status":
          result = await this.getStatus();
          break;

        default:
          throw new Error(`Unknown command: ${command.name}`);
      }

      command.status = "completed";
      command.result = result;

      this.logCommand(command);

      return result;
    } catch (error: any) {
      command.status = "failed";
      command.error = error.message;

      this.logCommand(command);

      throw error;
    }
  }

  /**
   * Set power state
   */
  private async setPower(on: boolean): Promise<any> {
    const payload = JSON.stringify({ power: on ? "on" : "off" });

    if (this.protocol === "mqtt") {
      return new Promise((resolve, reject) => {
        this.mqttClient.publish(`${this.deviceId}/command`, payload, (err: any) => {
          if (err) reject(err);
          else resolve({ action: "power_set", state: on ? "on" : "off" });
        });
      });
    }

    return { action: "power_set", state: on ? "on" : "off" };
  }

  /**
   * Set brightness
   */
  private async setBrightness(value: number): Promise<any> {
    const payload = JSON.stringify({ brightness: Math.min(100, Math.max(0, value)) });

    if (this.protocol === "mqtt") {
      return new Promise((resolve, reject) => {
        this.mqttClient.publish(`${this.deviceId}/command`, payload, (err: any) => {
          if (err) reject(err);
          else resolve({ action: "brightness_set", value });
        });
      });
    }

    return { action: "brightness_set", value };
  }

  /**
   * Set temperature
   */
  private async setTemperature(value: number): Promise<any> {
    const payload = JSON.stringify({ temperature: value });

    if (this.protocol === "mqtt") {
      return new Promise((resolve, reject) => {
        this.mqttClient.publish(`${this.deviceId}/command`, payload, (err: any) => {
          if (err) reject(err);
          else resolve({ action: "temperature_set", value });
        });
      });
    }

    return { action: "temperature_set", value };
  }

  /**
   * Set lock state
   */
  private async setLock(locked: boolean): Promise<any> {
    const payload = JSON.stringify({ lock: locked ? "locked" : "unlocked" });

    if (this.protocol === "mqtt") {
      return new Promise((resolve, reject) => {
        this.mqttClient.publish(`${this.deviceId}/command`, payload, (err: any) => {
          if (err) reject(err);
          else resolve({ action: "lock_set", state: locked ? "locked" : "unlocked" });
        });
      });
    }

    return { action: "lock_set", state: locked ? "locked" : "unlocked" };
  }

  /**
   * Get device status
   */
  private async getStatus(): Promise<any> {
    return {
      action: "status_retrieved",
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      status: this.state.status,
      metrics: this.state.metrics,
    };
  }

  /**
   * Handle MQTT message
   */
  private handleMqttMessage(topic: string, message: string): void {
    try {
      const data = JSON.parse(message);

      if (topic.includes("status")) {
        this.updateState({
          status: data.online ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE,
          metrics: data,
        });
      }
    } catch (error) {
      console.error(`[SmartHomeDevice] Error handling MQTT message:`, error);
    }
  }
}
