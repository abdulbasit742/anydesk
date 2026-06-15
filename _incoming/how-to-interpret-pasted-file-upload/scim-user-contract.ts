import { z } from 'zod';

export const ScimUserSchema = z.object({
  schemas: z.array(z.literal('urn:ietf:params:scim:schemas:core:2.0:User')).default(['urn:ietf:params:scim:schemas:core:2.0:User']),
  id: z.string().optional().describe('A unique identifier for the SCIM resource as defined by the service provider.'),
  externalId: z.string().optional().describe('A unique identifier for the resource as defined by the provisioning client.'),
  meta: z.object({
    resourceType: z.literal('User').default('User'),
    created: z.string().datetime().optional(),
    lastModified: z.string().datetime().optional(),
    location: z.string().url().optional(),
    version: z.string().optional(),
  }).optional(),
  userName: z.string().min(1).describe('Unique identifier for the user, typically used by the user to log in.'),
  name: z.object({
    formatted: z.string().optional(),
    familyName: z.string().optional(),
    givenName: z.string().optional(),
    middleName: z.string().optional(),
    honorificPrefix: z.string().optional(),
    honorificSuffix: z.string().optional(),
  }).optional(),
  displayName: z.string().optional(),
  nickName: z.string().optional(),
  profileUrl: z.string().url().optional(),
  title: z.string().optional(),
  userType: z.string().optional(),
  preferredLanguage: z.string().optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  active: z.boolean().default(true),
  password: z.string().optional().describe('The user’s clear text password. This attribute is intended to be used for setting a password.'),
  emails: z.array(z.object({
    value: z.string().email(),
    type: z.string().optional(),
    primary: z.boolean().optional(),
  })).optional(),
  phoneNumbers: z.array(z.object({
    value: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  ims: z.array(z.object({
    value: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  photos: z.array(z.object({
    value: z.string().url(),
    type: z.string().optional(),
  })).optional(),
  addresses: z.array(z.object({
    formatted: z.string().optional(),
    streetAddress: z.string().optional(),
    locality: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  groups: z.array(z.object({
    value: z.string().optional(),
    display: z.string().optional(),
    type: z.enum(['direct', 'indirect']).optional(),
    $ref: z.string().url().optional(),
  })).optional(),
  entitlements: z.array(z.object({
    value: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  roles: z.array(z.object({
    value: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  x509Certificates: z.array(z.object({
    value: z.string().optional(),
  })).optional(),
});

export type ScimUser = z.infer<typeof ScimUserSchema>;

export const CreateScimUserSchema = ScimUserSchema.omit({ id: true, meta: true, createdAt: true, updatedAt: true });
export type CreateScimUser = z.infer<typeof CreateScimUserSchema>;

export const UpdateScimUserSchema = ScimUserSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateScimUser = z.infer<typeof UpdateScimUserSchema>;
