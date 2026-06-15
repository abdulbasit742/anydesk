export function validateTrustedNetworkCidr(cidr: string): boolean { return /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(cidr) || /^[a-f0-9:]+\/\d{1,3}$/i.test(cidr); }
