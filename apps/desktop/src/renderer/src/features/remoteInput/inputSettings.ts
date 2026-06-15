export interface RemoteInputSettings {
  allowRemoteInputThisSession: boolean;
  nativeExecutionAvailable: boolean;
  requireHostConfirmation: boolean;
  emergencyStopActive: boolean;
  rateLimitEventsPerSecond: number;
}

export const DEFAULT_REMOTE_INPUT_SETTINGS: RemoteInputSettings = {
  allowRemoteInputThisSession: false,
  nativeExecutionAvailable: false,
  requireHostConfirmation: true,
  emergencyStopActive: false,
  rateLimitEventsPerSecond: 120,
};
