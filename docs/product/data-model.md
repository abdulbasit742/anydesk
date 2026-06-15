# Data Model Overview

## Core Entities

### User
- id, email, passwordHash, name, role, status
- orgId, stripeCustomerId
- createdAt, updatedAt, lastLoginAt

### Device
- id, userId, name, platform, remoteDeskId
- lastSeenAt, status, fingerprint
- capabilities (JSON)

### Session
- id, hostId, clientId, status
- startedAt, endedAt, duration
- terminationReason, signalingData (JSON)

### Organization
- id, name, plan, status
- billingEmail, stripeCustomerId

### AuditLog
- id, userId, eventType, metadata (JSON)
- ipAddress, userAgent, createdAt, expiresAt

## Relationships
- User has many Devices
- User has many Sessions (as host or client)
- Organization has many Users
- Organization has many Policies
- Session belongs to Host Device and Client User
- Device belongs to User

## Indexes
- Users: email (unique), orgId
- Devices: remoteDeskId (unique), userId, status
- Sessions: hostId, clientId, status, endedAt
- AuditLog: userId, eventType, createdAt, expiresAt
