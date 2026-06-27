import { EventEmitter } from "events";
class SecurityEventEmitter extends EventEmitter { emitThreatDetected(deviceId: string, threat: any) { this.emit("security.threat", { deviceId, threat, timestamp: new Date() }); } emitVulnerabilityFound(deviceId: string, vuln: any) { this.emit("security.vulnerability", { deviceId, vuln, timestamp: new Date() }); } emitLoginAttempt(userId: string, success: boolean, ip: string) { this.emit("security.login", { userId, success, ip, timestamp: new Date() }); } }
export const securityEmitter = new SecurityEventEmitter();
