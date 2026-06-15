export type ConnectorCategory = "communication" | "support" | "security" | "storage" | "automation" | "developer";
export type ConnectorAvailability = "available" | "coming_soon";
export type ConnectorInstallStatus = "available" | "installed" | "coming_soon";

export interface ConnectorDefinitionDto {
  key: string;
  name: string;
  category: ConnectorCategory;
  availability: ConnectorAvailability;
  description: string;
  capabilities: string[];
  docsUrl?: string;
}

export interface ConnectorCatalogItem extends ConnectorDefinitionDto {
  installStatus: ConnectorInstallStatus;
  installedAt?: string | null;
}
