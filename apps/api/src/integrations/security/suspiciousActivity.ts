/**
 * Suspicious Activity Detection for RemoteDesk.
 * Adapted from researchcollab2 security module.
 * Detects: brute force, rapid connections, unusual hours, geo-anomalies.
 */

import { PrismaClient } from '@prisma/client';

// securityEvent model requires a Prisma migration before use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient() as any;

type FlagSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityFlag {
  userId: string;
  flagType: string;
  severity: FlagSeverity;
  details: Record<string, unknown>;
  autoBlock: boolean;
}

interface SecurityEvent {
  type: string;
  userId: string;
  ip: string;
  deviceId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// In-memory tracking for rate limiting
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const connectionAttempts = new Map<string, { count: number; firstAttempt: number }>();
const blockedIPs = new Set<string>();

/**
 * Check for brute force login attempts.
 * Flags if > 5 failed logins in 10 minutes from same IP.
 */
export function checkBruteForce(ip: string): SecurityFlag | null {
  const key = `login_${ip}`;
  const now = Date.now();
  const window = 10 * 60 * 1000; // 10 minutes

  const record = loginAttempts.get(key);
  if (!record || now - record.firstAttempt > window) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return null;
  }

  record.count++;
  if (record.count >= 5) {
    blockedIPs.add(ip);
    loginAttempts.delete(key);
    return {
      userId: 'unknown',
      flagType: 'brute_force_login',
      severity: 'critical',
      details: { ip, attempts: record.count, windowMinutes: 10 },
      autoBlock: true,
    };
  }

  return null;
}

/**
 * Check for rapid connection attempts.
 * Flags if > 20 connections in 5 minutes from same user.
 */
export function checkRapidConnections(userId: string): SecurityFlag | null {
  const key = `conn_${userId}`;
  const now = Date.now();
  const window = 5 * 60 * 1000; // 5 minutes

  const record = connectionAttempts.get(key);
  if (!record || now - record.firstAttempt > window) {
    connectionAttempts.set(key, { count: 1, firstAttempt: now });
    return null;
  }

  record.count++;
  if (record.count >= 20) {
    connectionAttempts.delete(key);
    return {
      userId,
      flagType: 'rapid_connections',
      severity: 'high',
      details: { count: record.count, windowMinutes: 5 },
      autoBlock: false,
    };
  }

  return null;
}

/**
 * Check for unusual access hours.
 * Flags connections outside user's normal hours (configurable).
 */
export function checkUnusualHours(
  userId: string,
  currentHour: number,
  normalHoursStart: number = 6,
  normalHoursEnd: number = 23
): SecurityFlag | null {
  if (currentHour < normalHoursStart || currentHour > normalHoursEnd) {
    return {
      userId,
      flagType: 'unusual_hours_access',
      severity: 'medium',
      details: { hour: currentHour, normalRange: `${normalHoursStart}-${normalHoursEnd}` },
      autoBlock: false,
    };
  }
  return null;
}

/**
 * Check for geo-anomaly (impossible travel).
 * Flags if user connects from two locations too far apart in too short a time.
 */
export function checkGeoAnomaly(
  userId: string,
  currentIP: string,
  currentCountry: string,
  lastCountry: string | null,
  minutesSinceLastConnection: number
): SecurityFlag | null {
  if (!lastCountry || lastCountry === currentCountry) return null;

  // If different country within 2 hours, flag it
  if (minutesSinceLastConnection < 120) {
    return {
      userId,
      flagType: 'impossible_travel',
      severity: 'critical',
      details: {
        currentCountry,
        lastCountry,
        minutesBetween: minutesSinceLastConnection,
        ip: currentIP,
      },
      autoBlock: true,
    };
  }

  return null;
}

/**
 * Check if IP is blocked.
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

/**
 * Unblock an IP.
 */
export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
}

/**
 * Record a security event to the database.
 */
export async function recordSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        type: event.type,
        userId: event.userId,
        ip: event.ip,
        deviceId: event.deviceId || null,
        metadata: event.metadata || {},
        createdAt: event.timestamp,
      },
    });
  } catch (error) {
    console.error('[Security] Failed to record event:', error);
  }
}

/**
 * Run all security checks for a connection attempt.
 */
export function runSecurityChecks(params: {
  userId: string;
  ip: string;
  country?: string;
  lastCountry?: string | null;
  minutesSinceLastConnection?: number;
}): SecurityFlag[] {
  const flags: SecurityFlag[] = [];

  // Brute force check
  const bruteForce = checkBruteForce(params.ip);
  if (bruteForce) flags.push(bruteForce);

  // Rapid connections check
  const rapid = checkRapidConnections(params.userId);
  if (rapid) flags.push(rapid);

  // Unusual hours check
  const currentHour = new Date().getHours();
  const unusual = checkUnusualHours(params.userId, currentHour);
  if (unusual) flags.push(unusual);

  // Geo-anomaly check
  if (params.country && params.lastCountry !== undefined) {
    const geo = checkGeoAnomaly(
      params.userId,
      params.ip,
      params.country,
      params.lastCountry || null,
      params.minutesSinceLastConnection || 999
    );
    if (geo) flags.push(geo);
  }

  return flags;
}

/**
 * Advanced rate limiter with sliding window.
 */
export class RateLimiter {
  private windows = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.windows.get(key) || [];

    // Remove expired timestamps
    const valid = timestamps.filter((t) => now - t < this.windowMs);
    this.windows.set(key, valid);

    if (valid.length >= this.maxRequests) return false;

    valid.push(now);
    return true;
  }

  remaining(key: string): number {
    const now = Date.now();
    const timestamps = this.windows.get(key) || [];
    const valid = timestamps.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - valid.length);
  }

  reset(key: string): void {
    this.windows.delete(key);
  }
}

export default {
  checkBruteForce,
  checkRapidConnections,
  checkUnusualHours,
  checkGeoAnomaly,
  isIPBlocked,
  unblockIP,
  recordSecurityEvent,
  runSecurityChecks,
  RateLimiter,
};
