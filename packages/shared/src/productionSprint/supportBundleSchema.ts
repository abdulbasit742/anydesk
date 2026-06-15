export type SupportBundleKind = 'desktop-session' | 'api-request' | 'web-dashboard';

export interface SupportBundleAttachmentMeta {
  name: string;
  contentType: string;
  sizeBytes: number;
  sha256?: string;
}

export interface SupportBundleEnvelope {
  schemaVersion: 1;
  bundleId: string;
  kind: SupportBundleKind;
  createdAt: string;
  appVersion?: string;
  deviceId?: string;
  sessionId?: string;
  redaction: {
    clipboardTextRemoved: boolean;
    authTokensRemoved: boolean;
    ipAddressesMasked: boolean;
    filePathsMode: 'basename-only' | 'removed' | 'full-paths-for-local-debug';
  };
  diagnostics: Record<string, unknown>;
  timeline: Array<{ at: string; type: string; message: string; data?: Record<string, unknown> }>;
  attachments: SupportBundleAttachmentMeta[];
}

export function isSupportBundleEnvelope(value: unknown): value is SupportBundleEnvelope {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SupportBundleEnvelope>;
  return candidate.schemaVersion === 1 && typeof candidate.bundleId === 'string' && Array.isArray(candidate.timeline);
}
