# Remote-support reference review

Reviewed on 2026-07-15 before implementing the consent-first session baseline.

## RustDesk

Repository: `rustdesk/rustdesk`.

Adopted:

- an explicit misuse boundary against unauthorized access and privacy invasion;
- separation between rendezvous/relay infrastructure and endpoint media/control services;
- self-hosting as a trust and data-ownership option.

Not adopted:

- native capture, input injection, clipboard, file transfer, rendezvous, or relay code. SkyDesk does not yet have the authentication, consent, transport, and audit foundation required to enable those capabilities safely.

## MeshCentral

Repository: `Ylianst/MeshCentral`.

Adopted:

- consent as a configurable, visible control-plane concern;
- explicit user-notification/consent flags rather than inferring permission from connectivity;
- server-owned policy as the eventual direction for remote desktop and terminal access.

Not adopted:

- agent installation, background management, multiplexed desktop transport, terminal access, or unattended device management.

## Apache Guacamole client

Repository: `apache/guacamole-client`.

Adopted:

- authenticated connection resources and permission-aware access;
- managed client/session lifecycle rather than UI-only connected flags;
- a clear boundary between frontend state and backend connection authorization.

Not adopted:

- protocol gateways, RDP/VNC/SSH connectivity, JDBC authorization modules, or connection sharing.

## Resulting decision

The safest useful improvement was not to add WebRTC or input control. It was to replace fabricated live-session behavior with a validated state machine:

`consent_pending -> approved -> local preview -> ended`

Requests expire quickly, capabilities come from a fixed allowlist, high-risk capabilities require separate acknowledgement, and the UI repeatedly states that no transport or remote action exists.
