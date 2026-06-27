export const isPrivateIP = (ip: string): boolean => { const parts = ip.split(".").map(Number); return parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168); };
export const ipToNumber = (ip: string): number => ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
export const numberToIP = (num: number): string => [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");
export const isInSubnet = (ip: string, subnet: string): boolean => { const [subnetIp, bits] = subnet.split("/"); const mask = ~((1 << (32 - parseInt(bits))) - 1) >>> 0; return (ipToNumber(ip) & mask) === (ipToNumber(subnetIp) & mask); };
