export type DataChannelFeatureName = 'file-transfer' | 'clipboard-sync';

export type DataChannelReadyState = 'connecting' | 'open' | 'closing' | 'closed';

export type DataChannelFeatureReadinessInput = {
  readonly feature: DataChannelFeatureName;
  readonly channelState: DataChannelReadyState;
  readonly sessionActive: boolean;
  readonly featureEnabled: boolean;
  readonly peerTrusted: boolean;
  readonly userConsent: boolean;
};

export type DataChannelFeatureReadiness = DataChannelFeatureReadinessInput & {
  readonly canUseFeature: boolean;
  readonly blockedReason: 'none' | 'channel-not-open' | 'session-inactive' | 'feature-disabled' | 'peer-not-trusted' | 'missing-consent';
};

export function getDataChannelFeatureReadiness(
  input: DataChannelFeatureReadinessInput,
): DataChannelFeatureReadiness {
  if (input.channelState !== 'open') {
    return { ...input, canUseFeature: false, blockedReason: 'channel-not-open' };
  }

  if (!input.sessionActive) {
    return { ...input, canUseFeature: false, blockedReason: 'session-inactive' };
  }

  if (!input.featureEnabled) {
    return { ...input, canUseFeature: false, blockedReason: 'feature-disabled' };
  }

  if (!input.peerTrusted) {
    return { ...input, canUseFeature: false, blockedReason: 'peer-not-trusted' };
  }

  if (!input.userConsent) {
    return { ...input, canUseFeature: false, blockedReason: 'missing-consent' };
  }

  return { ...input, canUseFeature: true, blockedReason: 'none' };
}
