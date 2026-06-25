import { DeviceBase, DeviceType, DeviceStatus, DeviceCommand, DeviceState } from "../core/DeviceBase.js";

export class SmartphoneDevice extends DeviceBase {
  private adbClient: any;
  private scrcpyStream: any;

  constructor(deviceName: string, manufacturer: string, model: string, adbClient: any) {
    super(DeviceType.SMARTPHONE, deviceName, manufacturer, model);
    this.adbClient = adbClient;
    this.registerCapabilities();
  }

  /**
   * Register smartphone capabilities
   */
  private registerCapabilities(): void {
    this.registerCapability({
      name: "screen_mirror",
      description: "Mirror phone screen to PC",
      supportsStream: true,
    });

    this.registerCapability({
      name: "control_input",
      description: "Send touch/keyboard input to phone",
      supportsControl: true,
    });

    this.registerCapability({
      name: "file_transfer",
      description: "Transfer files between phone and PC",
      supportsControl: true,
    });

    this.registerCapability({
      name: "notifications",
      description: "Receive phone notifications",
      supportsNotifications: true,
    });

    this.registerCapability({
      name: "clipboard_sync",
      description: "Sync clipboard between phone and PC",
      supportsControl: true,
    });

    this.registerCapability({
      name: "call_control",
      description: "Answer/reject calls from PC",
      supportsControl: true,
    });

    this.registerCapability({
      name: "message_reply",
      description: "Reply to messages from PC",
      supportsControl: true,
    });
  }

  /**
   * Initialize device connection
   */
  async initialize(): Promise<void> {
    try {
      // Connect via ADB
      const connected = await this.adbClient.connect(this.deviceId);

      if (!connected) {
        throw new Error("Failed to connect via ADB");
      }

      this.updateState({ status: DeviceStatus.ONLINE });

      // Start monitoring device
      this.startMonitoring();

      console.log(`[SmartphoneDevice] Connected: ${this.deviceId}`);
    } catch (error) {
      console.error(`[SmartphoneDevice] Connection failed:`, error);
      this.updateState({ status: DeviceStatus.ERROR });
      throw error;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.scrcpyStream) {
      this.scrcpyStream.destroy();
    }

    this.updateState({ status: DeviceStatus.OFFLINE });
    console.log(`[SmartphoneDevice] Disconnected: ${this.deviceId}`);
  }

  /**
   * Get current device state
   */
  async getState(): Promise<DeviceState> {
    try {
      // Get battery level
      const batteryInfo = await this.adbClient.shell("dumpsys battery");
      const batteryMatch = batteryInfo.match(/level: (\d+)/);
      const battery = batteryMatch ? parseInt(batteryMatch[1]) : 0;

      // Get screen state
      const screenState = await this.adbClient.shell("dumpsys display | grep mScreenState");

      return {
        status: DeviceStatus.ONLINE,
        battery,
        metrics: {
          screenOn: screenState.includes("ON"),
        },
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
        case "screen_mirror":
          result = await this.startScreenMirror();
          break;

        case "send_input":
          result = await this.sendInput(command.params);
          break;

        case "transfer_file":
          result = await this.transferFile(command.params);
          break;

        case "answer_call":
          result = await this.answerCall();
          break;

        case "send_message":
          result = await this.sendMessage(command.params);
          break;

        case "get_notifications":
          result = await this.getNotifications();
          break;

        case "sync_clipboard":
          result = await this.syncClipboard(command.params);
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
   * Start screen mirroring
   */
  private async startScreenMirror(): Promise<any> {
    // Use Scrcpy protocol to stream screen
    const stream = await this.adbClient.shell("scrcpy-server");

    this.scrcpyStream = stream;

    return {
      action: "screen_mirror_started",
      streamId: this.deviceId,
    };
  }

  /**
   * Send input to device
   */
  private async sendInput(params: any): Promise<any> {
    const { type, data } = params;

    if (type === "text") {
      // Send text input
      await this.adbClient.shell(`input text "${data}"`);
    } else if (type === "tap") {
      // Send tap input
      const { x, y } = data;
      await this.adbClient.shell(`input tap ${x} ${y}`);
    } else if (type === "swipe") {
      // Send swipe input
      const { x1, y1, x2, y2 } = data;
      await this.adbClient.shell(`input swipe ${x1} ${y1} ${x2} ${y2}`);
    }

    return { action: "input_sent", type, data };
  }

  /**
   * Transfer file
   */
  private async transferFile(params: any): Promise<any> {
    const { sourcePath, destinationPath, direction } = params;

    if (direction === "phone_to_pc") {
      // Pull file from phone
      await this.adbClient.pull(sourcePath, destinationPath);
    } else if (direction === "pc_to_phone") {
      // Push file to phone
      await this.adbClient.push(sourcePath, destinationPath);
    }

    return { action: "file_transferred", sourcePath, destinationPath, direction };
  }

  /**
   * Answer call
   */
  private async answerCall(): Promise<any> {
    await this.adbClient.shell("input keyevent KEYCODE_CALL");

    return { action: "call_answered" };
  }

  /**
   * Send message
   */
  private async sendMessage(params: any): Promise<any> {
    const { appPackage, phoneNumber, message } = params;

    // Send SMS via app
    await this.adbClient.shell(
      `am start -a android.intent.action.SENDTO -d sms:${phoneNumber} --es sms_body "${message}" -n ${appPackage}`
    );

    return { action: "message_sent", phoneNumber, message };
  }

  /**
   * Get notifications
   */
  private async getNotifications(): Promise<any> {
    const notifications = await this.adbClient.shell("dumpsys notification");

    return { action: "notifications_retrieved", notifications };
  }

  /**
   * Sync clipboard
   */
  private async syncClipboard(params: any): Promise<any> {
    const { content, direction } = params;

    if (direction === "pc_to_phone") {
      // Set clipboard on phone
      await this.adbClient.shell(`echo "${content}" | xclip -selection clipboard`);
    } else if (direction === "phone_to_pc") {
      // Get clipboard from phone
      const clipboard = await this.adbClient.shell("xclip -selection clipboard -o");
      return { action: "clipboard_synced", content: clipboard };
    }

    return { action: "clipboard_synced", content };
  }

  /**
   * Start monitoring device
   */
  private startMonitoring(): void {
    setInterval(async () => {
      try {
        const state = await this.getState();
        this.updateState(state);
      } catch (error) {
        console.error(`[SmartphoneDevice] Monitoring error:`, error);
      }
    }, 5000);
  }
}
