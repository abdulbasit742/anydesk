export interface FleetGroupPolicy {
  groupId: string;
  fileTransferEnabled: boolean;
  clipboardSyncEnabled: boolean;
  remoteInputEnabled: boolean;
  updateChannel: "stable" | "beta" | "internal";
}

export function enforceSafeFleetGroupPolicy(policy: FleetGroupPolicy): FleetGroupPolicy {
  return {
    ...policy,
    remoteInputEnabled: false,
    updateChannel: policy.updateChannel === "internal" ? "beta" : policy.updateChannel
  };
}
