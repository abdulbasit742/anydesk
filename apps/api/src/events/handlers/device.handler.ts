import { deviceEmitter } from "../emitters/device.emitter.js";
deviceEmitter.on("device.online", async (event) => { console.log(`[Event] Device ${event.deviceId} came online`); /* Update device status, notify user */ });
deviceEmitter.on("device.offline", async (event) => { console.log(`[Event] Device ${event.deviceId} went offline`); /* Update status, check if alert needed */ });
deviceEmitter.on("device.alert", async (event) => { console.log(`[Event] Alert on device ${event.deviceId}`); /* Process alert, notify relevant users */ });
export {};
