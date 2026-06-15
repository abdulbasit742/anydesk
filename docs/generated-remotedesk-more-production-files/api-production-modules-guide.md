# RemoteDesk API Production Modules Guide

This pack adds Express-compatible modules for audit logging, support tickets, team invites, billing usage, device heartbeats, session lifecycle logs, security events, trusted devices, admin metrics, health checks, and Socket.IO authorization.

The in-memory repositories are useful for unit tests and local wiring. Production should use the Prisma repositories after schema review and migration.
