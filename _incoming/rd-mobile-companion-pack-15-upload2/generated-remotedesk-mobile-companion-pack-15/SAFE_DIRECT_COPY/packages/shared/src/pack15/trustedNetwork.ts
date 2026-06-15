export interface TrustedNetwork { id: string; label: string; cidr: string; enabled: boolean; }
export function trustedNetworkLabel(network: TrustedNetwork): string { return `${network.label} (${network.enabled ? 'enabled' : 'disabled'})`; }
