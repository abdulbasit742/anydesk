// KeyRotator.js — Token expiration thresholds and alerts for keys older than 90 days
const ROTATION_THRESHOLD_DAYS = 90;
const WARNING_THRESHOLD_DAYS = 75;

export class KeyRotator {
  constructor(onAlert) {
    this.onAlert = onAlert || (() => {});
    this.schedule = new Map();
  }

  registerKey(keyId, createdAt, platformId, label) {
    const entry = { keyId, createdAt: new Date(createdAt), platformId, label };
    this.schedule.set(keyId, entry);
    this._checkKey(entry);
    return entry;
  }

  _checkKey(entry) {
    const ageDays = (Date.now() - entry.createdAt.getTime()) / (1000 * 86400);
    if (ageDays >= ROTATION_THRESHOLD_DAYS) {
      this.onAlert({ level: 'critical', keyId: entry.keyId, platform: entry.platformId, ageDays: Math.round(ageDays), message: `Key "${entry.label}" is ${Math.round(ageDays)} days old — IMMEDIATE rotation required` });
    } else if (ageDays >= WARNING_THRESHOLD_DAYS) {
      this.onAlert({ level: 'warn', keyId: entry.keyId, platform: entry.platformId, ageDays: Math.round(ageDays), message: `Key "${entry.label}" expires in ${Math.round(ROTATION_THRESHOLD_DAYS - ageDays)} days` });
    }
  }

  auditAll() {
    const report = [];
    for (const entry of this.schedule.values()) {
      const ageDays = (Date.now() - entry.createdAt.getTime()) / (1000 * 86400);
      report.push({
        ...entry,
        ageDays: Math.round(ageDays),
        daysUntilExpiry: Math.max(0, Math.round(ROTATION_THRESHOLD_DAYS - ageDays)),
        status: ageDays >= ROTATION_THRESHOLD_DAYS ? 'expired' : ageDays >= WARNING_THRESHOLD_DAYS ? 'warning' : 'ok',
      });
    }
    return report.sort((a, b) => b.ageDays - a.ageDays);
  }

  markRotated(keyId, newCreatedAt = new Date()) {
    const entry = this.schedule.get(keyId);
    if (entry) {
      entry.createdAt = new Date(newCreatedAt);
      this.onAlert({ level: 'success', keyId, message: `Key rotated successfully` });
    }
  }

  remove(keyId) { this.schedule.delete(keyId); }
  getStats() {
    const all = this.auditAll();
    return { total: all.length, ok: all.filter(k => k.status === 'ok').length, warning: all.filter(k => k.status === 'warning').length, expired: all.filter(k => k.status === 'expired').length };
  }
}
