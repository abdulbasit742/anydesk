import type { MeshRuntimeAdapter, WireGuardConfig } from "./index.js";

/**
 * Platform adapter factory. Desktop supplies an Electron/native implementation;
 * mobile supplies a platform bridge backed by the OS VPN APIs.
 */
export type MeshRuntimeAdapterFactory = (options?: Record<string, unknown>) => MeshRuntimeAdapter;

export interface WireGuardUserspaceBridge {
  /** Start wireguard-go and attach it to a TUN interface. */
  start(interfaceName: string, config: WireGuardConfig): Promise<void>;
  /** Apply peer/interface changes without tearing down the tunnel. */
  apply(interfaceName: string, config: WireGuardConfig): Promise<void>;
  /** Stop wireguard-go and remove the TUN interface. */
  stop(interfaceName: string): Promise<void>;
  /** Read handshake and byte counters from the running interface. */
  status(interfaceName: string): Promise<{ bytesSent: number; bytesReceived: number; lastHandshakeAt?: string }>;
}

export interface StunClient {
  discoverCandidates(): Promise<Array<{ address: string; port: number; protocol: "udp4" | "udp6"; source: "host" | "stun" | "mapped"; priority: number }>>;
}

export interface TurnRelayClient {
  allocate(region?: string): Promise<{ id: string; region: string; url: string; username: string; credential: string; expiresAt: string }>;
  release(id: string): Promise<void>;
}

export interface MeshDnsResolver {
  install(zone: { domain: string; records: Array<{ name: string; type: "A" | "AAAA" | "CNAME"; value: string }> }): Promise<void>;
  uninstall(): Promise<void>;
}
