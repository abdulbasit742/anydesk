export type DomainEvent = DeviceEvent | BillingEvent | SecurityEvent | UserEvent;
export interface DeviceEvent { type: "device.connected" | "device.disconnected" | "device.registered" | "device.removed" | "device.alert"; deviceId: string; userId: string; data: any; timestamp: Date; }
export interface BillingEvent { type: "billing.subscription_created" | "billing.payment_received" | "billing.payment_failed" | "billing.subscription_cancelled"; userId: string; data: any; timestamp: Date; }
export interface SecurityEvent { type: "security.threat_detected" | "security.vulnerability_found" | "security.policy_violation"; deviceId: string; data: any; timestamp: Date; }
export interface UserEvent { type: "user.registered" | "user.login" | "user.logout" | "user.mfa_enabled" | "user.password_changed"; userId: string; data: any; timestamp: Date; }
