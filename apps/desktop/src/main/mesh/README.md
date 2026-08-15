# Desktop Mesh VPN Runtime

The desktop client uses a small Electron main-process adapter around **wireguard-go** and the `wg` control utility. The renderer never receives the private WireGuard key or invokes operating-system commands directly.

## Runtime contract

The service stores the node private key under the Electron user-data directory with mode `0600`, registers only the public key with the coordination API, starts `wireguard-go` on a platform-specific interface, applies peers through `wg setconf`, installs approved routes, and configures Magic DNS through the host resolver where supported.

The background service sends a control-plane heartbeat every 25 seconds and refreshes peer configuration every 10 seconds. If a peer sync fails while Always-on is enabled, the local status transitions to `reconnecting` and the next successful refresh reapplies the WireGuard configuration without requiring an application restart.

## Environment overrides

The default binary names are `wireguard-go`, `wg`, `ip`, and `resolvectl`. Packagers can override them with `REMOTEDESK_WIREGUARD_GO`, `REMOTEDESK_WG`, `REMOTEDESK_ROUTE`, and `REMOTEDESK_DNS`.

On Linux, the process needs permission to create a TUN device and update routes. On macOS and Windows, the production packager should provide the signed WireGuard system/user-space adapter and route/DNS bridge appropriate to the platform. The TypeScript service intentionally fails closed when those binaries are absent rather than claiming a connected state.

## NAT traversal

The client gathers local UDP candidates and performs a STUN binding request. Direct candidates are preferred. The coordination API exposes configured STUN/TURN relay metadata at `/api/mesh/relays`; a production deployment should provide short-lived TURN credentials through the coordination service and should never embed static relay credentials in the client.

## Native mobile bridge

React Native uses the same control-plane contracts but delegates TUN/VPN entitlement operations to the platform VPN APIs. The shared mesh package contains the common config compiler, CIDR normalization, ACL/split-tunnel types, DNS resolver, transport selection, and multi-hop validation so desktop and mobile clients use the same policy semantics.
