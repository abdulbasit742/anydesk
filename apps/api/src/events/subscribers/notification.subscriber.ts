import { deviceEmitter } from "../emitters/device.emitter.js";
import { billingEmitter } from "../emitters/billing.emitter.js";
import { securityEmitter } from "../emitters/security.emitter.js";
// Subscribe to all events and create notifications
deviceEmitter.on("device.offline", (event) => { /* Create in-app notification */ });
billingEmitter.on("billing.payment_failed", (event) => { /* Send email + push notification */ });
securityEmitter.on("security.threat", (event) => { /* Send urgent notification on all channels */ });
export {};
