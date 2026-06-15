export interface RelayRegion {
  id: string;
  label: string;
  priority: number;
  healthy: boolean;
}

export function chooseRelayRegion(regions: readonly RelayRegion[]): RelayRegion | undefined {
  return [...regions].filter((region) => region.healthy).sort((a, b) => a.priority - b.priority)[0];
}
