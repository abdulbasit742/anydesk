# Implementation Notes

## RemoteDesk Production Ecosystem

This document tracks implementation decisions and notes.

## Decisions
- Documentation stored in `docs/` directory
- TypeScript used for all code examples
- Markdown for all documentation
- JSON for configuration and data
- Shell scripts for automation

## Conventions
- File naming: kebab-case.md|ts|json|sh
- Error codes: RD_{CATEGORY}{NUMBER}
- IDs: {type}_{uuid} or 9-digit for desk IDs
- Dates: ISO 8601 format

## Integration Points
- Prisma for database
- Socket.IO for signaling
- WebRTC for media
- Express for API
- Next.js for web
- Electron for desktop

## Security Defaults
- All features disabled by default
- Approval required for sensitive operations
- Full audit logging
- Rate limiting on all endpoints
