import { billingEmitter } from "../emitters/billing.emitter.js";
billingEmitter.on("billing.payment_received", async (event) => { console.log(`[Event] Payment received from ${event.userId}: $${event.amount}`); /* Send receipt, update subscription */ });
billingEmitter.on("billing.payment_failed", async (event) => { console.log(`[Event] Payment failed for ${event.userId}: ${event.reason}`); /* Start dunning process */ });
billingEmitter.on("billing.subscription_cancelled", async (event) => { console.log(`[Event] Subscription cancelled for ${event.userId}`); /* Send win-back email, schedule downgrade */ });
export {};
