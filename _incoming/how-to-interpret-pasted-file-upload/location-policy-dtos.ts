import { z } from 'zod';

export const GeoFenceType = z.enum([
  'circle',
  'polygon',
  'country',
  'ip_range',
]);

export const GeoFenceAction = z.enum([
  'allow_access',
  'deny_access',
  'require_mfa',
  'log_event',
]);

export const GeoFenceCoordinateSchema = z.object({
  latitude: z.number().min(-90).max(90).describe('Latitude of the coordinate.'),
  longitude: z.number().min(-180).max(180).describe('Longitude of the coordinate.'),
});

export const GeoFenceSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the geo-fence.'),
  name: z.string().min(1).describe('Name of the geo-fence.'),
  description: z.string().optional().describe('Description of the geo-fence.'),
  type: GeoFenceType.describe('Type of the geo-fence (e.g., circle, polygon, country, IP range).'),
  isEnabled: z.boolean().default(true).describe('Whether the geo-fence is active.'),
  actions: z.array(GeoFenceAction).min(1).describe('Actions to take when a device is within/outside the geo-fence.'),
  // Specific properties based on GeoFenceType
  radiusKm: z.number().positive().optional().describe('Radius in kilometers for circle geo-fences.'),
  coordinates: z.array(GeoFenceCoordinateSchema).optional().describe('Array of coordinates for polygon geo-fences.'),
  countryCodes: z.array(z.string().length(2)).optional().describe('List of ISO 3166-1 alpha-2 country codes.'),
  ipRanges: z.array(z.string().ip()).optional().describe('List of IP CIDR ranges.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the geo-fence was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the geo-fence was last updated.'),
});

export type GeoFence = z.infer<typeof GeoFenceSchema>;

export const CreateGeoFenceSchema = GeoFenceSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateGeoFence = z.infer<typeof CreateGeoFenceSchema>;

export const UpdateGeoFenceSchema = GeoFenceSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateGeoFence = z.infer<typeof UpdateGeoFenceSchema>;

export const LocationPolicySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the location policy.'),
  name: z.string().min(1).describe('Name of the location policy.'),
  description: z.string().optional().describe('Description of the location policy.'),
  isEnabled: z.boolean().default(true).describe('Whether the policy is active.'),
  priority: z.number().int().min(1).max(100).default(50).describe('Priority of the policy (lower number = higher priority).'),
  geoFenceIds: z.array(z.string().uuid()).min(1).describe('List of geo-fence IDs associated with this policy.'),
  appliesToUserIds: z.array(z.string().uuid()).optional().describe('List of user IDs this policy applies to.'),
  appliesToDeviceIds: z.array(z.string().uuid()).optional().describe('List of device IDs this policy applies to.'),
  defaultAction: GeoFenceAction.describe('Default action if no specific geo-fence matches.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the policy was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the policy was last updated.'),
});

export type LocationPolicy = z.infer<typeof LocationPolicySchema>;

export const CreateLocationPolicySchema = LocationPolicySchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateLocationPolicy = z.infer<typeof CreateLocationPolicySchema>;

export const UpdateLocationPolicySchema = LocationPolicySchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateLocationPolicy = z.infer<typeof UpdateLocationPolicySchema>;
