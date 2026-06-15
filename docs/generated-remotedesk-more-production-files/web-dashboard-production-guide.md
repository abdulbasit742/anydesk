# RemoteDesk Web Dashboard Production Guide

The web files are small React modules for support, audit logs, sessions, trusted devices, billing usage, team invites, security events, and admin metrics.

They intentionally avoid router rewrites. Use `PATCHES/web-integration.patch.md` to mount them into the existing dashboard routes.
