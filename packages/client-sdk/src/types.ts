export interface SDKConfig {
  baseURL: string;
  apiVersion: string;
  timeoutMs: number;
  retry: import('@remotedesk/shared').RetryConfig;
  onTokenRefresh?: () => Promise<string>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}


