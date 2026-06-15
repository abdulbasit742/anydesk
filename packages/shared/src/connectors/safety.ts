import type { ConnectorAvailability, ConnectorCategory } from "./types.js";

const allowedCategories: readonly ConnectorCategory[] = [
  "communication",
  "support",
  "security",
  "storage",
  "automation",
  "developer"
];

export function isSafeConnectorKey(key: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/.test(key);
}

export function isConnectorCategory(value: string): value is ConnectorCategory {
  return allowedCategories.includes(value as ConnectorCategory);
}

export function isConnectorInstallable(availability: ConnectorAvailability): boolean {
  return availability === "available";
}
