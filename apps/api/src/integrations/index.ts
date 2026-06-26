/**
 * RemoteDesk Integrations Hub
 * All external service integrations and advanced features.
 */

// AI Services
export { askAI, remoteDesk_AI, AI_MODELS } from './ai/orchestrator';
export { scheduler, AUTOMATION_TEMPLATES } from './ai/automationEngine';

// Notifications
export { TelegramNotifier, createTelegramNotifier } from './notifications/telegram';
export type { NotificationPayload, TelegramConfig } from './notifications/telegram';

// Security
export {
  runSecurityChecks,
  checkBruteForce,
  checkRapidConnections,
  checkGeoAnomaly,
  isIPBlocked,
  unblockIP,
  recordSecurityEvent,
  RateLimiter,
} from './security/suspiciousActivity';

// Payments
export {
  PLANS,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  handleWebhook as handleStripeWebhook,
} from './payments/stripe';
export type { PlanId } from './payments/stripe';

// Location
export {
  updateLocation,
  getLatestLocation,
  getAllLocations,
  addGeofence,
  removeGeofence,
  getLocationHistory,
  getIPLocation,
} from './location/deviceLocation';
export type { DeviceLocation, Geofence, GeofenceEvent } from './location/deviceLocation';
