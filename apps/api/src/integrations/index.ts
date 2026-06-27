/**
 * RemoteDesk Integrations Hub
 * All external service integrations and advanced features.
 */

// AI Services
export { askAI, remoteDesk_AI, AI_MODELS } from './ai/orchestrator.js';
export { scheduler, AUTOMATION_TEMPLATES } from './ai/automationEngine.js';

// Notifications
export { TelegramNotifier, createTelegramNotifier } from './notifications/telegram.js';
export type { NotificationPayload, TelegramConfig } from './notifications/telegram.js';

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
} from './security/suspiciousActivity.js';

// Payments
export {
  PLANS,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  handleWebhook as handleStripeWebhook,
} from './payments/stripe.js';
export type { PlanId } from './payments/stripe.js';

// Location
export {
  updateLocation,
  getLatestLocation,
  getAllLocations,
  addGeofence,
  removeGeofence,
  getLocationHistory,
  getIPLocation,
} from './location/deviceLocation.js';
export type { DeviceLocation, Geofence, GeofenceEvent } from './location/deviceLocation.js';
