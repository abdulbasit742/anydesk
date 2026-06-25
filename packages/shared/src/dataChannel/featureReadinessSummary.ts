import type { DataChannelFeatureName, DataChannelFeatureReadiness } from './featureReadiness.js';

export type DataChannelFeatureStatus = 'available' | 'blocked' | 'waiting';

export type DataChannelFeatureReadinessSummary = {
  readonly feature: DataChannelFeatureName;
  readonly status: DataChannelFeatureStatus;
  readonly title: string;
  readonly description: string;
  readonly canRetry: boolean;
};

export function getDataChannelFeatureReadinessSummary(
  readiness: DataChannelFeatureReadiness,
): DataChannelFeatureReadinessSummary {
  if (readiness.canUseFeature) {
    return {
      feature: readiness.feature,
      status: 'available',
      title: 'Ready',
      description: 'This feature is ready to use for the current trusted session.',
      canRetry: false,
    };
  }

  switch (readiness.blockedReason) {
    case 'channel-not-open':
      return {
        feature: readiness.feature,
        status: 'waiting',
        title: 'Waiting for connection',
        description: 'The secure data channel is not ready yet.',
        canRetry: true,
      };
    case 'session-inactive':
      return {
        feature: readiness.feature,
        status: 'blocked',
        title: 'Session inactive',
        description: 'Start or rejoin a session before using this feature.',
        canRetry: true,
      };
    case 'feature-disabled':
      return {
        feature: readiness.feature,
        status: 'blocked',
        title: 'Feature disabled',
        description: 'This feature is disabled by the current policy.',
        canRetry: false,
      };
    case 'peer-not-trusted':
      return {
        feature: readiness.feature,
        status: 'blocked',
        title: 'Peer not trusted',
        description: 'Trust must be established before this feature can be used.',
        canRetry: false,
      };
    case 'missing-consent':
      return {
        feature: readiness.feature,
        status: 'blocked',
        title: 'Consent required',
        description: 'User consent is required before this feature can be used.',
        canRetry: true,
      };
    case 'none':
      return {
        feature: readiness.feature,
        status: 'available',
        title: 'Ready',
        description: 'This feature is ready to use.',
        canRetry: false,
      };
  }
}
