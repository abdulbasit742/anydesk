export type SupportBundlePrivacyLevel = "minimal" | "standard" | "verbose";
export interface SupportBundleEvent { at: string; type: string; severity: "info" | "warning" | "error"; message: string; metadata?: Record<string, string | number | boolean | null>; }
export interface SupportBundleStats { at: string; rttMs?: number; bitrateKbps?: number; packetsLost?: number; frameWidth?: number; frameHeight?: number; iceState?: string; peerState?: string; dataChannelState?: string; }
export interface SupportBundleSchema { schemaVersion: 1; exportedAt: string; privacy: SupportBundlePrivacyLevel; sessionId: string; role: "host" | "viewer"; appVersion: string; events: SupportBundleEvent[]; stats: SupportBundleStats[]; }
export function createSupportBundle(input: Omit<SupportBundleSchema, "schemaVersion" | "exportedAt">): SupportBundleSchema { return { schemaVersion: 1, exportedAt: new Date().toISOString(), ...input }; }
export function isSupportBundle(value: unknown): value is SupportBundleSchema { const item = value as Partial<SupportBundleSchema>; return item?.schemaVersion === 1 && Array.isArray(item.events) && Array.isArray(item.stats); }
