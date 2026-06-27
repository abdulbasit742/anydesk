import dgram from "dgram";
export const wakeOnLanService = {
  async wakeDevice(macAddress: string, broadcastAddress: string = "255.255.255.255"): Promise<boolean> {
    const mac = macAddress.replace(/[:-]/g, "");
    const magicPacket = Buffer.alloc(102);
    for (let i = 0; i < 6; i++) magicPacket[i] = 0xff;
    for (let i = 0; i < 16; i++) { for (let j = 0; j < 6; j++) magicPacket[6 + i * 6 + j] = parseInt(mac.substr(j * 2, 2), 16); }
    return new Promise((resolve) => {
      const socket = dgram.createSocket("udp4");
      socket.once("error", () => { socket.close(); resolve(false); });
      socket.bind(() => { socket.setBroadcast(true); socket.send(magicPacket, 0, magicPacket.length, 9, broadcastAddress, () => { socket.close(); resolve(true); }); });
    });
  },
  async scheduleWake(deviceId: string, time: Date, macAddress: string) {
    const delay = time.getTime() - Date.now();
    if (delay > 0) setTimeout(() => this.wakeDevice(macAddress), delay);
    return { scheduled: true, wakeTime: time };
  },
};
