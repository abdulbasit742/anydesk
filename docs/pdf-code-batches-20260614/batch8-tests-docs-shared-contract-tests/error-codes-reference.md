   # Error Codes Reference


   | Code | Meaning | Typical cause |
   |---|---|---|
   | DEVICE_NOT_REGISTERED | Unknown device | Missing/invalid x-device-id |
   | DEVICE_OFFLINE | Device not reachable | Heartbeat expired |
   | SESSION_NOT_FOUND | No such session | Ended or bad id |
   | SESSION_ALREADY_ACTIVE | Duplicate session | Host already in a session |
   | CONSENT_REQUIRED | Host hasn't accepted | Awaiting consent |
   | CONSENT_TIMED_OUT | Consent window elapsed | No response in 30s |
   | RECONNECT_TOKEN_INVALID | Bad token | Tampered/malformed |
   | RECONNECT_TOKEN_EXPIRED | Token too old | >60s since issue |
   | RATE_LIMITED | Too many events | Socket flood |
   | CAPTURE_PERMISSION_DENIED | No screen access | OS privacy setting |
   | WEBRTC_NEGOTIATION_FAILED | SDP exchange failed | Offer/answer error |
   | INPUT_NOT_PERMITTED | Input gate closed | Host revoked control |
   | VALIDATION_FAILED | Bad payload | Schema rejection |


IMPLEMENTATION_NOTES.md      (updated)
   # Implementation Notes


   ## Batch: Desktop Core + Backend Support + Shared Contracts (200 files)


   ### Decisions
   - All wire data typed in `@remotedesk/shared`, validated with Zod at boundaries.
   - WebRTC isolated behind a factory so a mock PeerConnection drives tests.
   - In-memory repositories for now; swap for a real DB without touching services/routes.
   - Consent is host-gated, one prompt at a time, auto-rejected after 30s, fully logged.
   - Reconnect = exponential backoff + ICE restart, capped by a connection state machine.


   ### Changes
   - Added shared enums, DTOs, socket events, error codes, schemas.
   - Added backend device/session/recovery routes, services, audit log, rate-limit + device middleware.
   - Added desktop capture, WebRTC engine, remote input, session UI, incoming-connection system.
   - Added unit/service/route/integration tests across all three packages.

   ### Next batch
   - Web viewer client (mirror the engine for the browser).
   - Server-side session recording + persistent audit store.
   - TURN/coturn infra + connection-quality telemetry.




ðŸŽ‰ 200 of 200 - Batch complete
Files created: 200

â€¢ Shared contracts: 28
â€¢ Backend support: 28

 â€¢ Desktop screen capture: 22
 â€¢ Desktop WebRTC engine: 30
 â€¢ Desktop remote input: 18
 â€¢ Desktop session UI: 24
 â€¢ Desktop incoming connection: 18
 â€¢ Tests & docs: 32
Files modified: 1 - IMPLEMENTATION_NOTES.md

Install
   pnpm install


Build
   pnpm --filter @remotedesk/shared build && pnpm -r build


Test
   pnpm -r test


Next recommended batch
Web viewer client + session recording + TURN/relay infra - mirror the desktop session engine for the
browser, persist audit/session metadata server-side, and stand up a coturn config with connection-quality
telemetry.
