/**
 * Device Location Tracking & Geofencing for RemoteDesk.
 * Adapted from live-location-tracker repo.
 * Tracks device locations, supports geofencing alerts, and location history.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DeviceLocation {
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  ip?: string;
  city?: string;
  country?: string;
  isp?: string;
  timestamp: Date;
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  type: 'allowed' | 'restricted';
  alertOnEnter: boolean;
  alertOnExit: boolean;
}

export interface GeofenceEvent {
  type: 'enter' | 'exit';
  geofence: Geofence;
  deviceId: string;
  timestamp: Date;
}

// In-memory location cache for real-time tracking
const locationCache = new Map<string, DeviceLocation>();
const deviceGeofenceState = new Map<string, Set<string>>(); // deviceId -> set of geofence IDs inside

/**
 * Calculate distance between two GPS coordinates (Haversine formula).
 */
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Update device location.
 */
export async function updateLocation(location: DeviceLocation): Promise<GeofenceEvent[]> {
  // Update cache
  locationCache.set(location.deviceId, location);

  // Store in database (async, non-blocking)
  storeLocationHistory(location).catch(console.error);

  // Check geofences
  return checkGeofences(location);
}

/**
 * Store location in database for history.
 */
async function storeLocationHistory(location: DeviceLocation): Promise<void> {
  try {
    await prisma.deviceLocation.create({
      data: {
        deviceId: location.deviceId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null,
        altitude: location.altitude || null,
        speed: location.speed || null,
        heading: location.heading || null,
        ip: location.ip || null,
        city: location.city || null,
        country: location.country || null,
        isp: location.isp || null,
        timestamp: location.timestamp,
      },
    });
  } catch (error) {
    // Table might not exist yet, log and continue
    console.warn('[Location] Failed to store location:', (error as Error).message);
  }
}

/**
 * Get latest location for a device.
 */
export function getLatestLocation(deviceId: string): DeviceLocation | null {
  return locationCache.get(deviceId) || null;
}

/**
 * Get all device locations (for fleet map).
 */
export function getAllLocations(): DeviceLocation[] {
  return Array.from(locationCache.values());
}

/**
 * Check if device is inside any geofences and emit events.
 */
function checkGeofences(location: DeviceLocation): GeofenceEvent[] {
  const events: GeofenceEvent[] = [];
  const geofences = getActiveGeofences();
  const currentInside = new Set<string>();

  for (const fence of geofences) {
    const distance = haversineDistance(
      location.latitude, location.longitude,
      fence.latitude, fence.longitude
    );

    const isInside = distance <= fence.radiusMeters;
    if (isInside) currentInside.add(fence.id);

    // Check for state changes
    const previousState = deviceGeofenceState.get(location.deviceId) || new Set();
    const wasInside = previousState.has(fence.id);

    if (isInside && !wasInside && fence.alertOnEnter) {
      events.push({ type: 'enter', geofence: fence, deviceId: location.deviceId, timestamp: location.timestamp });
    } else if (!isInside && wasInside && fence.alertOnExit) {
      events.push({ type: 'exit', geofence: fence, deviceId: location.deviceId, timestamp: location.timestamp });
    }
  }

  // Update state
  deviceGeofenceState.set(location.deviceId, currentInside);
  return events;
}

// In-memory geofence storage (would be in DB in production)
const activeGeofences: Geofence[] = [];

/**
 * Add a geofence.
 */
export function addGeofence(fence: Geofence): void {
  activeGeofences.push(fence);
}

/**
 * Remove a geofence.
 */
export function removeGeofence(fenceId: string): void {
  const idx = activeGeofences.findIndex((f) => f.id === fenceId);
  if (idx >= 0) activeGeofences.splice(idx, 1);
}

/**
 * Get all active geofences.
 */
export function getActiveGeofences(): Geofence[] {
  return activeGeofences;
}

/**
 * Get location history for a device.
 */
export async function getLocationHistory(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 1000
): Promise<DeviceLocation[]> {
  try {
    const records = await prisma.deviceLocation.findMany({
      where: {
        deviceId,
        timestamp: { gte: startDate, lte: endDate },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
    return records as unknown as DeviceLocation[];
  } catch {
    return [];
  }
}

/**
 * Get IP-based location (fallback when GPS unavailable).
 */
export async function getIPLocation(ip: string): Promise<Partial<DeviceLocation> | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,city,country,isp`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      country: data.country,
      isp: data.isp,
      ip,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate total distance traveled by a device in a time period.
 */
export async function calculateDistanceTraveled(
  deviceId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const history = await getLocationHistory(deviceId, startDate, endDate);
  let totalDistance = 0;

  for (let i = 1; i < history.length; i++) {
    totalDistance += haversineDistance(
      history[i - 1].latitude, history[i - 1].longitude,
      history[i].latitude, history[i].longitude
    );
  }

  return totalDistance;
}

export default {
  updateLocation,
  getLatestLocation,
  getAllLocations,
  addGeofence,
  removeGeofence,
  getActiveGeofences,
  getLocationHistory,
  getIPLocation,
  calculateDistanceTraveled,
};
